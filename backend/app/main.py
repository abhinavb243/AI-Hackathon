from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional

# Import API routers
from app.api import reg_intel, impact, planner, report, example_direct_db
from app.langgraph.pipeline import run_pipeline

app = FastAPI(title="Compliance AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PipelineRequest(BaseModel):
    regulation: Dict[str, Any]
    source: Optional[str] = None
    priority: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Compliance AI API - Welcome!"}

# Include API routers
app.include_router(reg_intel.router, tags=["Regulatory Intelligence"])
app.include_router(impact.router, tags=["Impact Assessment"])
app.include_router(planner.router, tags=["Implementation Planning"])
app.include_router(report.router, tags=["Report Generation"])
app.include_router(example_direct_db.router, tags=["Direct Database Access"])

@app.post("/run-pipeline")
async def run_full_pipeline(request: PipelineRequest):
    """Run the complete compliance pipeline from regulatory scraping to report generation"""
    try:
        # Prepare regulation data
        regulation_data = request.regulation
        if request.source:
            regulation_data["source"] = request.source
        if request.priority:
            regulation_data["priority"] = request.priority
            
        # Run the LangGraph pipeline
        result = await run_pipeline()
        
        # Check for errors
        if result.get("errors"):
            return {
                "status": "error",
                "message": "Pipeline completed with errors",
                "errors": result["errors"],
                "partial_results": result
            }
            
        # Return successful result
        return {
            "status": "success",
            "message": "Pipeline execution completed",
            "data": {
                "regulation": result["regulation"],
                "findings": result.get("findings", []),
                "action_items": result.get("action_items", []),
                "final_report": result.get("final_report", {})
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline execution failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 