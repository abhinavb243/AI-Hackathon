from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any

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

class TestPipelineRequest(BaseModel):
    mock_regulation: Dict[str, Any]
    use_mock_company_data: bool = True

@app.post("/test-compliance-pipeline")
async def test_compliance_pipeline(request: TestPipelineRequest):
    """
    Test the full compliance pipeline with mock data
    This endpoint uploads mock regulatory data, tests it against mock company data,
    and returns the complete analysis
    """
    try:
        # Step 1: Upload the mock regulation
        # Create MockRegulation instance from the dictionary
        from app.api.reg_intel import MockRegulation
        mock_regulation = MockRegulation(**request.mock_regulation)
        reg_response = await reg_intel.upload_mock_regulation(mock_regulation)
        regulation_diff_id = reg_response.get("regulation_diff_id")
        
        if not regulation_diff_id:
            raise HTTPException(status_code=500, detail="Failed to upload mock regulation")
            
        # Step 2: Run compliance assessment with the uploaded regulation against mock company data
        compliance_request = impact.ComplianceAssessmentRequest(
            regulation_diff_id=regulation_diff_id,
            use_mock_data=request.use_mock_company_data
        )
        impact_assessment = await impact.assess_compliance(compliance_request)
        
        # Step 3: Generate implementation plan from the findings
        implementation_plan = await planner.generate_plan(regulation_diff_id)
        
        # Step 4: Generate a report (optional)
        report_request = report.ReportRequest(
            regulation_diff_id=regulation_diff_id,
            include_findings=True,
            include_action_items=True
        )
        compliance_report = await report.generate_report(report_request)
        
        # Return the full pipeline results
        return {
            "status": "success",
            "message": "Full compliance pipeline executed with mock data",
            "steps_completed": [
                "regulatory_intelligence",
                "impact_assessment",
                "implementation_planning",
                "report_generation"
            ],
            "results": {
                "regulation": reg_response,
                "impact_assessment": impact_assessment,
                "implementation_plan": implementation_plan,
                "report": compliance_report
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

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