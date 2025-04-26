from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from app.core.supabase_client import supabase
from app.core.settings import OPENAI_API_KEY
from langchain_openai import ChatOpenAI

router = APIRouter(prefix="/planner")

class ActionItem(BaseModel):
    title: str
    description: str
    priority: str
    assigned_to: Optional[str] = None
    due_date: Optional[str] = None
    status: str = "pending"
    finding_id: str

@router.post("/plan/{finding_id}")
async def create_implementation_plan(finding_id: str):
    """Create implementation plan for a specific finding"""
    try:
        # Get the finding from Supabase
        finding_result = supabase.table("findings") \
                                .select("*") \
                                .eq("id", finding_id) \
                                .execute()
        
        if not finding_result.data:
            raise HTTPException(status_code=404, detail="Finding not found")
        
        finding = finding_result.data[0]
        
        # In a real implementation, we would use LangGraph and agent here
        # For now, we simulate the Implementation Planning agent

        # Initialize LLM (would be part of LangGraph in full implementation)
        llm = ChatOpenAI(api_key=OPENAI_API_KEY, model="gpt-4o")
        
        # Calculate due dates based on current date
        today = datetime.now()
        one_month = (today + timedelta(days=30)).isoformat()
        two_months = (today + timedelta(days=60)).isoformat()
        three_months = (today + timedelta(days=90)).isoformat()
        
        # Simulated action items
        action_items = [
            {
                "title": "Update reporting systems",
                "description": "Modify quarterly reporting system to handle new $500M threshold",
                "priority": "High",
                "assigned_to": "IT Team",
                "due_date": one_month,
                "status": "pending",
                "finding_id": finding_id
            },
            {
                "title": "Notify affected funds",
                "description": "Send notification to the 15 funds newly subject to quarterly reporting",
                "priority": "Medium",
                "assigned_to": "Compliance Team",
                "due_date": two_months,
                "status": "pending",
                "finding_id": finding_id
            },
            {
                "title": "Train operations staff",
                "description": "Conduct training sessions on new reporting requirements",
                "priority": "Medium",
                "assigned_to": "Training Team",
                "due_date": three_months,
                "status": "pending",
                "finding_id": finding_id
            }
        ]
        
        # Insert into Supabase
        result = supabase.table("action_items").insert(action_items).execute()
        
        return {
            "status": "success",
            "message": "Implementation plan created",
            "action_items": action_items
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating implementation plan: {str(e)}")

@router.get("/action-items")
async def get_action_items():
    """Get all action items"""
    try:
        result = supabase.table("action_items").select("*").execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching action items: {str(e)}")

@router.put("/action-items/{action_item_id}")
async def update_action_item(action_item_id: str, action_item: ActionItem):
    """Update an action item"""
    try:
        result = supabase.table("action_items") \
                       .update(action_item.dict()) \
                       .eq("id", action_item_id) \
                       .execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Action item not found")
        
        return {
            "status": "success",
            "message": "Action item updated",
            "action_item": result.data[0]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating action item: {str(e)}") 