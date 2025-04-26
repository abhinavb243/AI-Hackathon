from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import API routers
from app.api import reg_intel, impact, planner, report, example_direct_db

app = FastAPI(title="Compliance AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
async def run_full_pipeline():
    """Run the complete compliance pipeline from regulatory scraping to report generation"""
    try:
        # This would use the LangGraph orchestration to run the full pipeline
        # For now, it's a placeholder that returns a success message
        return {
            "status": "success",
            "message": "Full compliance pipeline executed",
            "steps_completed": [
                "regulatory_intelligence",
                "impact_assessment",
                "implementation_planning",
                "report_generation"
            ]
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 