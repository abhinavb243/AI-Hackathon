from typing import Dict, Any, List, TypedDict, Annotated, Tuple
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from app.core.settings import OPENAI_API_KEY
import json

# Define state
class AgentState(TypedDict):
    regulation: Dict[str, Any]
    findings: List[Dict[str, Any]]
    action_items: List[Dict[str, Any]]
    errors: List[str]
    final_report: Dict[str, Any]

# Initialize the LLMs for each agent
regulatory_agent = ChatOpenAI(api_key=OPENAI_API_KEY, model="gpt-4o")
impact_agent = ChatOpenAI(api_key=OPENAI_API_KEY, model="gpt-4o") 
planning_agent = ChatOpenAI(api_key=OPENAI_API_KEY, model="gpt-4o")

# Define agent functions
def regulatory_intelligence(state: AgentState) -> AgentState:
    """Process regulatory information and extract key insights"""
    try:
        # In a real implementation, this would:
        # 1. Use the LLM to analyze the regulation
        # 2. Extract key changes and requirements
        
        # Simulated processing
        processed_regulation = state["regulation"]
        processed_regulation["processed"] = True
        processed_regulation["key_requirements"] = [
            "Quarterly reporting for funds over $500M",
            "Disclosure of investment strategies required"
        ]
        
        return {"regulation": processed_regulation, "errors": state.get("errors", [])}
    except Exception as e:
        return {"regulation": state["regulation"], "errors": state.get("errors", []) + [f"Regulatory error: {str(e)}"]}

def impact_assessment(state: AgentState) -> AgentState:
    """Assess the financial impact of the regulation"""
    try:
        # Skip if there are errors from previous step
        if state.get("errors"):
            return state
        
        # In a real implementation, this would:
        # 1. Use the LLM to analyze financial impact
        # 2. Generate findings based on regulation and data catalog
        
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
        
        return {
            "regulation": state["regulation"],
            "findings": findings,
            "errors": state.get("errors", [])
        }
    except Exception as e:
        return {
            "regulation": state["regulation"],
            "findings": [],
            "errors": state.get("errors", []) + [f"Impact error: {str(e)}"]
        }

def implementation_planning(state: AgentState) -> AgentState:
    """Create an implementation plan based on findings"""
    try:
        # Skip if there are errors or no findings
        if state.get("errors") or not state.get("findings"):
            return state
        
        # In a real implementation, this would:
        # 1. Use the LLM to generate action items
        # 2. Create timeline and assign responsibilities
        
        # Simulated action items
        action_items = [
            {
                "title": "Update reporting systems",
                "description": "Modify quarterly reporting system to handle new $500M threshold",
                "priority": "High",
                "assigned_to": "IT Team",
                "due_date": "2023-07-15T00:00:00Z",
                "status": "pending",
                "finding_id": "finding-001"
            },
            {
                "title": "Notify affected funds",
                "description": "Send notification to the 15 funds newly subject to quarterly reporting",
                "priority": "Medium",
                "assigned_to": "Compliance Team",
                "due_date": "2023-08-15T00:00:00Z",
                "status": "pending",
                "finding_id": "finding-001"
            }
        ]
        
        return {
            "regulation": state["regulation"],
            "findings": state["findings"],
            "action_items": action_items,
            "errors": state.get("errors", [])
        }
    except Exception as e:
        return {
            "regulation": state["regulation"],
            "findings": state["findings"],
            "action_items": [],
            "errors": state.get("errors", []) + [f"Planning error: {str(e)}"]
        }

def generate_final_report(state: AgentState) -> AgentState:
    """Generate the final compliance report"""
    try:
        # Create a comprehensive report
        report = {
            "title": f"Compliance Report: {state['regulation'].get('title', 'Regulation Change')}",
            "summary": f"Analysis of {state['regulation'].get('title')} with {len(state.get('findings', []))} findings and {len(state.get('action_items', []))} action items.",
            "regulation": state["regulation"],
            "findings": state.get("findings", []),
            "action_items": state.get("action_items", []),
            "next_steps": "Review and implement the action items according to the timeline.",
            "completion_status": "complete" if not state.get("errors") else "incomplete"
        }
        
        return {
            "regulation": state["regulation"],
            "findings": state.get("findings", []),
            "action_items": state.get("action_items", []),
            "errors": state.get("errors", []),
            "final_report": report
        }
    except Exception as e:
        return {
            "regulation": state["regulation"],
            "findings": state.get("findings", []),
            "action_items": state.get("action_items", []),
            "errors": state.get("errors", []) + [f"Report generation error: {str(e)}"],
            "final_report": {"error": "Failed to generate report"}
        }

def should_end(state: AgentState) -> Tuple[bool, bool]:
    """Determine if the workflow should end."""
    # End if there are errors or if we have a final report
    return bool(state.get("errors")) or "final_report" in state, END

# Create the graph
def create_workflow_graph():
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("regulatory_intelligence", regulatory_intelligence)
    workflow.add_node("impact_assessment", impact_assessment)
    workflow.add_node("implementation_planning", implementation_planning)
    workflow.add_node("generate_final_report", generate_final_report)
    
    # Add edges
    workflow.add_edge("regulatory_intelligence", "impact_assessment")
    workflow.add_edge("impact_assessment", "implementation_planning")
    workflow.add_edge("implementation_planning", "generate_final_report")
    workflow.add_conditional_edges(
        "generate_final_report",
        should_end
    )
    
    # Set the entry point
    workflow.set_entry_point("regulatory_intelligence")
    
    return workflow.compile()

# Create the workflow for use in API
compliance_workflow = create_workflow_graph()

async def run_pipeline(regulation: Dict[str, Any]) -> Dict[str, Any]:
    """
    Run the full compliance workflow pipeline
    
    Args:
        regulation: The regulation data to process
        
    Returns:
        The final state containing the report and any errors
    """
    # Initialize state
    initial_state = {"regulation": regulation, "errors": []}
    
    # Run the workflow
    result = compliance_workflow.invoke(initial_state)
    
    return result 