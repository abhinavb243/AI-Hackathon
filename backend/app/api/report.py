from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import json
from typing import List, Dict, Any, Optional
from app.core.supabase_client import supabase
from fastapi.responses import FileResponse, JSONResponse
import os
import tempfile

router = APIRouter(prefix="/report")

class ReportRequest(BaseModel):
    regulation_diff_id: str
    include_findings: bool = True
    include_action_items: bool = True

@router.post("/generate")
async def generate_report(request: ReportRequest):
    """Generate a comprehensive compliance report"""
    try:
        # Get the regulation diff
        reg_diff_result = supabase.table("regulation_diffs") \
                                .select("*") \
                                .eq("id", request.regulation_diff_id) \
                                .execute()
        
        if not reg_diff_result.data:
            raise HTTPException(status_code=404, detail="Regulation diff not found")
        
        regulation_diff = reg_diff_result.data[0]
        
        # Get findings if requested
        findings = []
        if request.include_findings:
            findings_result = supabase.table("findings") \
                                   .select("*") \
                                   .eq("regulation_diff_id", request.regulation_diff_id) \
                                   .execute()
            findings = findings_result.data
        
        # Get action items if requested
        action_items = []
        if request.include_action_items and findings:
            # Collect all finding IDs
            finding_ids = [finding["id"] for finding in findings]
            
            # Get action items for these findings
            action_items_result = supabase.table("action_items") \
                                       .select("*") \
                                       .in_("finding_id", finding_ids) \
                                       .execute()
            action_items = action_items_result.data
        
        # In a real implementation, we would:
        # 1. Use a template engine like Jinja2 to generate HTML
        # 2. Use WeasyPrint or similar to convert to PDF
        # 3. Upload the PDF to Supabase Storage
        # 4. Return the URL
        
        # For now, we'll simulate this by returning a JSON report
        report_data = {
            "title": f"Compliance Report: {regulation_diff.get('title', 'Regulation Change')}",
            "generated_at": datetime.now().isoformat(),
            "regulation_diff": regulation_diff,
            "findings": findings,
            "action_items": action_items,
            "summary": f"This report analyzes the impact of '{regulation_diff.get('title')}' with {len(findings)} findings and {len(action_items)} action items."
        }
        
        # In a real implementation, we would store the report in Supabase
        # and return a URL to access it
        
        return {
            "status": "success",
            "message": "Report generated successfully",
            "report": report_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")

@router.get("/list")
async def list_reports():
    """List all generated reports"""
    try:
        # In a real implementation, we would fetch from a reports table
        # For now, return a simulated list
        reports = [
            {
                "id": "report-001",
                "title": "SEC Form PF Amendments Impact",
                "regulation_diff_id": "reg-diff-001",
                "created_at": "2023-06-15T10:30:00Z",
                "url": "/api/report/download/report-001"
            }
        ]
        
        return reports
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing reports: {str(e)}")

@router.get("/download/{report_id}")
async def download_report(report_id: str):
    """Download a generated report"""
    try:
        # In a real implementation, we would:
        # 1. Get the report from Supabase Storage
        # 2. Return the file
        
        # For now, we'll simulate by returning a message
        return JSONResponse(
            content={
                "status": "error",
                "message": f"Report download simulation: In production, this would return a PDF file for report ID: {report_id}"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error downloading report: {str(e)}")

@router.post("/generate/{assessment_id}")
async def generate_report(assessment_id: str):
    """Generate compliance report based on impact assessment"""
    try:
        # Return mock data for testing
        report = {
            "status": "success",
            "message": "Compliance report generated successfully",
            "report": {
                "assessment_id": assessment_id,
                "title": "GDPR Compliance Assessment Report",
                "summary": "Based on our analysis, the company has moderate compliance gaps with the GDPR, primarily in data retention and user consent areas.",
                "compliance_score": 68,
                "risk_level": "Medium",
                "key_findings": [
                    {
                        "id": "finding-1",
                        "category": "Data Retention",
                        "description": "Customer data is being stored beyond necessary periods",
                        "severity": "High",
                        "recommendation": "Implement automatic data purging after 2 years of inactivity"
                    },
                    {
                        "id": "finding-2",
                        "category": "User Consent",
                        "description": "Consent collection does not meet specificity requirements",
                        "severity": "Medium",
                        "recommendation": "Update consent forms to be more granular and specific"
                    },
                    {
                        "id": "finding-3",
                        "category": "Cross-Border Transfers",
                        "description": "Missing safeguards for EU-US data transfers",
                        "severity": "Medium",
                        "recommendation": "Implement EU-approved SCCs for all transfers"
                    }
                ],
                "created_at": datetime.now().isoformat()
            }
        }
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating compliance report: {str(e)}") 