from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.core.supabase_client import supabase
import json
import os
from langchain_openai import ChatOpenAI
from app.core.settings import OPENAI_API_KEY

router = APIRouter(prefix="/impact")

class ImpactAssessment(BaseModel):
    regulation_diff_id: str
    findings: List[Dict[str, Any]]
    exposures: List[Dict[str, Any]]
    severity: str
    impact_areas: List[str]
    estimated_cost: Optional[float] = None

@router.post("/assess/{regulation_diff_id}")
async def assess_impact(regulation_diff_id: str):
    """Assess financial impact of a specific regulation diff"""
    try:
        # Get the regulation diff from Supabase
        reg_diff_result = supabase.table("regulation_diffs") \
                                .select("*") \
                                .eq("id", regulation_diff_id) \
                                .execute()
        
        if not reg_diff_result.data:
            raise HTTPException(status_code=404, detail="Regulation diff not found")
        
        regulation_diff = reg_diff_result.data[0]
        
        # Get relevant data catalog entries for context
        data_catalog_result = supabase.table("data_catalog") \
                                    .select("*") \
                                    .limit(10) \
                                    .execute()
        
        data_catalog = data_catalog_result.data
        
        # In a real implementation, we would use LangGraph and agent here
        # For now, we simulate the Financial Impact Assessment agent

        # Initialize LLM (would be part of LangGraph in full implementation)
        llm = ChatOpenAI(api_key=OPENAI_API_KEY, model="gpt-4o")
        
        # Simulated findings
        findings = [
            {
                "id": "finding-001",
                "title": "Quarterly reporting threshold change impacts 15 funds",
                "description": "The change in threshold from $1B to $500M means 15 additional funds will need quarterly reporting",
                "regulation_section": "2a",
                "confidence": 0.92
            },
            {
                "id": "finding-002",
                "title": "New disclosure requirements affect investment strategy reporting",
                "description": "All private funds will need to update reporting templates and processes",
                "regulation_section": "4b",
                "confidence": 0.85
            }
        ]
        
        # Simulated exposures
        exposures = [
            {
                "id": "exposure-001",
                "financial_impact": 250000,
                "description": "Estimated cost for implementing new reporting systems and processes",
                "affected_departments": ["Operations", "Compliance", "IT"],
                "timeframe": "6 months"
            }
        ]
        
        # Create impact assessment
        impact_assessment = {
            "regulation_diff_id": regulation_diff_id,
            "findings": findings,
            "exposures": exposures,
            "severity": "Medium",
            "impact_areas": ["Reporting", "Operations", "Compliance"],
            "estimated_cost": 250000,
            "created_at": datetime.now().isoformat()
        }
        
        # Insert into Supabase
        result = supabase.table("findings").insert(impact_assessment).execute()
        
        return {
            "status": "success",
            "message": "Impact assessment completed",
            "impact_assessment": impact_assessment
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error assessing impact: {str(e)}")

@router.get("/findings")
async def get_findings():
    """Get all impact assessment findings"""
    try:
        result = supabase.table("findings").select("*").execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching findings: {str(e)}") 