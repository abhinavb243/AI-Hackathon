from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from app.core.supabase_client import supabase
import json

router = APIRouter(prefix="/reg-intel")

class RegulationSource(BaseModel):
    source: str
    url: str

@router.get("/sources")
async def get_sources():
    """Get all configured regulatory sources"""
    sources = [
        {"source": "SEC", "url": "https://www.sec.gov/rules"},
        {"source": "FINRA", "url": "https://www.finra.org/rules-guidance"},
        {"source": "CFTC", "url": "https://www.cftc.gov/LawRegulation/index.htm"}
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

@router.get("/diffs")
async def get_regulation_diffs():
    """Get all regulation diffs"""
    try:
        result = supabase.table("regulation_diffs").select("*").execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching regulation diffs: {str(e)}") 