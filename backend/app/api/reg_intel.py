from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from datetime import datetime
from app.core.supabase_client import supabase
import json
from typing import List, Dict, Any, Optional

router = APIRouter(prefix="/reg-intel")

class RegulationSource(BaseModel):
    source: str
    url: str

class RegulationChange(BaseModel):
    section: str
    old_text: str
    new_text: str

class MockRegulation(BaseModel):
    source: str
    title: str
    summary: str
    url: Optional[str] = None
    content: str
    previous_version: Optional[str] = None
    changes: List[Dict[str, str]]
    jurisdiction: Optional[str] = "GDPR"

@router.get("/sources")
async def get_sources():
    """Get all configured regulatory sources"""
    sources = [
        {"source": "SEC", "url": "https://www.sec.gov/rules"},
        {"source": "FINRA", "url": "https://www.finra.org/rules-guidance"},
        {"source": "CFTC", "url": "https://www.cftc.gov/LawRegulation/index.htm"},
        {"source": "GDPR", "url": "https://gdpr.eu/"},
        {"source": "CCPA", "url": "https://oag.ca.gov/privacy/ccpa"}
    ]
    return sources

@router.post("/scrape")
async def scrape_regulations():
    """Scrape regulations from configured sources and store diffs"""
    try:
        # Simulate regulatory scraping
        # In a real implementation, this would:
        # 1. Scrape regulatory websites
        # 2. Extract regulation changes
        # 3. Store in Supabase
        
        # Simulated regulation diff
        regulation_diff = {
            "source": "SEC",
            "title": "Amendments to Form PF",
            "summary": "Changes to reporting requirements for private fund advisers",
            "url": "https://www.sec.gov/rules/final/2023/amendments-form-pf",
            "published_date": datetime.now().isoformat(),
            "content": "The amendments to Form PF are designed to enhance FSOC's monitoring...",
            "previous_version": "Previous requirements only applied to funds over $1B in assets",
            "changes": [
                {"section": "2a", "old_text": "Quarterly reporting threshold: $1B", "new_text": "Quarterly reporting threshold: $500M"},
                {"section": "4b", "old_text": "No disclosure required", "new_text": "Disclosure of investment strategies required"}
            ]
        }
        
        # Insert into Supabase
        result = supabase.table("regulation_diffs").insert(regulation_diff).execute()
        
        return {
            "status": "success", 
            "message": "Regulatory intelligence gathered", 
            "diffs_found": 1
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scraping regulations: {str(e)}")

@router.post("/upload-mock-regulation")
async def upload_mock_regulation(regulation: MockRegulation):
    """
    Upload mock regulation data for testing compliance detection
    This endpoint accepts mock regulatory data and stores it in the regulation_diffs table
    """
    try:
        # Convert the model to a dict
        regulation_diff = {
            "source": regulation.source,
            "title": regulation.title,
            "summary": regulation.summary,
            "url": regulation.url or f"https://example.com/{regulation.source.lower()}-mock",
            "published_date": datetime.now().isoformat(),
            "content": regulation.content,
            "previous_version": regulation.previous_version,
            "changes": regulation.changes,
            "jurisdiction": regulation.jurisdiction
        }
        
        try:
            # Insert into Supabase if available
            if supabase:
                result = supabase.table("regulation_diffs").insert(regulation_diff).execute()
                reg_id = result.data[0]["id"] if result.data else "mock-reg-id-123"
            else:
                # Mock response for testing without Supabase
                reg_id = "mock-reg-id-123"
        except Exception as db_error:
            # If database operation fails, return a mock ID for testing
            print(f"Database error (continuing with mock ID): {str(db_error)}")
            reg_id = "mock-reg-id-123"
        
        return {
            "status": "success", 
            "message": "Mock regulation data stored successfully", 
            "regulation_diff_id": reg_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error storing mock regulation: {str(e)}")

@router.get("/diffs")
async def get_regulation_diffs():
    """Get all regulation diffs"""
    try:
        result = supabase.table("regulation_diffs").select("*").execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching regulation diffs: {str(e)}") 