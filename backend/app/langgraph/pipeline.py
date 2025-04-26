from typing import Dict, Any, List, TypedDict
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
import json
import os

# Define a simple state structure
# Define the state structure as a TypedDict
class WorkflowState(TypedDict, total=False):
    """State structure for the workflow"""
    regulation: Dict[str, str]
    privacy_policy: str
    analysis: Dict[str, List[str]]
    impact: Dict[str, Any]
    action_plan: Dict[str, List[Dict[str, str]]]
    final_report: Dict[str, Any]
    error: str

# Initialize the LLM
api_key = os.environ.get("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY is not set in environment variables")

llm = ChatOpenAI(api_key=api_key, model="gpt-4o-mini")

def regulatory_analysis(state: WorkflowState) -> WorkflowState:
    """Analyze regulatory information and extract key insights"""
    # Define static regulation example
    regulation = {
        "title": "Align Data Handling with Singapore PDPA Updates",
        "description": "Adapt data retention policies to comply with new PDPA amendments on data breach notification timelines.",
        "priority": "high",
        "dueDate": "May 30, 2025",
        "potentialFine": "Up to SGD 1 million (approx. USD 740,000)"
    }
    
    # Define static privacy policy
    privacy_policy = """Privacy Policy
    Last Updated: January 1, 2024

    1. Data Collection and Use
    We collect personal information from users for specific business purposes.

    2. Data Retention
    We retain personal data for as long as necessary to provide our services.

    3. Data Breach Notification
    In the event of a data breach, we will notify affected users within 72 hours.

    4. User Rights
    Users have the right to access, correct, and delete their personal data.

    5. International Data Transfers
    We may transfer data internationally in compliance with applicable laws.
    """
    
    # Create prompt for the LLM
    prompt = f"""Analyze this regulatory requirement:
    
    Title: {regulation['title']}
    Description: {regulation['description']}
    Priority: {regulation['priority']}
    Due Date: {regulation['dueDate']}
    Potential Fine: {regulation['potentialFine']}
    
    Current Privacy Policy:
    {privacy_policy}
    
    Extract the key requirements and policy sections that need updates.
    
    Your response MUST be a valid JSON object with these exact fields:
    {{
        "key_requirements": ["requirement1", "requirement2", ...],
        "policy_updates": ["section1", "section2", ...]
    }}
    
    Make sure your output is properly formatted JSON without any additional text before or after.
    """
    try:
        # Get analysis from LLM
        print("Sending request to regulatory analysis agent...")
        response = llm.invoke(prompt)
        print(f"Received response from LLM: {response.content}...")
        
        # Try to parse as JSON
        try:
            analysis = json.loads(response.content)
        except:
            print("Failed to parse JSON, using structured content")
            # Extract content in a more forgiving way
            analysis = {
                "key_requirements": [response.content],
                "policy_updates": ["Data Breach Notification section"]
            }
        
        # Update state with analysis results
        state["regulation"] = regulation
        state["privacy_policy"] = privacy_policy
        state["analysis"] = analysis
        
        return state
        
    except Exception as e:
        print(f"Error in regulatory analysis: {str(e)}")
        state["error"] = f"Regulatory analysis failed: {str(e)}"
        return state

def impact_assessment(state: WorkflowState) -> WorkflowState:
    """Assess the impact of the regulatory requirements"""
    if "error" in state:
        return state
        
    regulation = state["regulation"]
    analysis = state["analysis"]
    
    # Create prompt for impact assessment
    prompt = f"""Based on this regulation and analysis:
    
    Regulation: {regulation['title']} - {regulation['description']}
    Key Requirements: {json.dumps(analysis.get('key_requirements', []))}
    Policy Updates: {json.dumps(analysis.get('policy_updates', []))}
    
    Assess the business impact:
    1. What operational changes are needed?
    2. What are the main compliance risks?
    3. What is the resource impact?
    
    Your response MUST be a valid JSON object with these exact fields:
    {{
        "operational_changes": ["change1", "change2", ...],
        "compliance_risks": ["risk1", "risk2", ...],
        "resource_impact": "brief description"
    }}

    Make sure your output is properly formatted JSON without any additional text before or after.
    """
    
    try:
        # Get impact assessment from LLM
        print("Sending request to impact assessment agent...")
        response = llm.invoke(prompt)
        print(f"Received impact assessment: {response.content[:100]}...")
        
        # Try to parse as JSON
        try:
            impact = json.loads(response.content)
        except:
            print("Failed to parse JSON, using structured content")
            impact = {
                "operational_changes": ["Update notification processes"],
                "compliance_risks": ["Missing notification deadlines"],
                "resource_impact": "Medium - requires policy updates and staff training"
            }
        
        # Update state with impact results
        state["impact"] = impact
        return state
        
    except Exception as e:
        print(f"Error in impact assessment: {str(e)}")
        state["error"] = f"Impact assessment failed: {str(e)}"
        return state

def action_planning(state: WorkflowState) -> WorkflowState:
    """Create action plan based on analysis and impact assessment"""
    if "error" in state:
        return state
        
    regulation = state["regulation"]
    analysis = state["analysis"]
    impact = state["impact"]
    
    # Create prompt for action planning
    prompt = f"""Create an action plan:
    
    Regulation: {regulation['title']} - Due by {regulation['dueDate']}
    Requirements: {json.dumps(analysis.get('key_requirements', []))}
    Operational Changes: {json.dumps(impact.get('operational_changes', []))}
    Compliance Risks: {json.dumps(impact.get('compliance_risks', []))}

Create 3-5 specific action items with:
- title
- description
- priority (high/medium/low)
- assigned_to (role/department)
- deadline

Your response MUST be a valid JSON object with these exact fields:
{{
    "action_items": [
        {{
            "title": "...",
            "description": "...",
            "priority": "high|medium|low",
            "assigned_to": "...",
            "deadline": "YYYY-MM-DD"
        }},
        ...
    ]
}}

    """
    
    try:
        # Get action plan from LLM
        print("Sending request to action planning agent...")
        response = llm.invoke(prompt)
        print(f"Received action plan: {response.content[:100]}...")
        
        # Try to parse as JSON
        try:
            action_plan = json.loads(response.content)
        except:
            print("Failed to parse JSON, using structured content")
            action_plan = {
                "action_items": [
                    {
                        "title": "Update Privacy Policy",
                        "description": "Revise data breach notification section",
                        "priority": "high",
                        "assigned_to": "Legal Department",
                        "deadline": "May 1, 2025"
                    },
                    {
                        "title": "Staff Training",
                        "description": "Train staff on new notification procedures",
                        "priority": "medium",
                        "assigned_to": "HR Department",
                        "deadline": "May 15, 2025"
                    }
                ]
            }
        
        # Update state with action plan
        state["action_plan"] = action_plan
        
        # Generate summary report
        state["final_report"] = {
            "title": f"Compliance Report: {regulation['title']}",
            "due_date": regulation['dueDate'],
            "key_requirements": analysis.get('key_requirements', []),
            "compliance_risks": impact.get('compliance_risks', []),
            "action_items_count": len(action_plan.get('action_items', [])),
            "high_priority_actions": len([a for a in action_plan.get('action_items', []) if a.get('priority') == 'high'])
        }
        
        return state
        
    except Exception as e:
        print(f"Error in action planning: {str(e)}")
        state["error"] = f"Action planning failed: {str(e)}"
        return state

def should_end(state: WorkflowState) -> tuple[bool, str]:
    """Determine if workflow should end"""
    if "error" in state or "final_report" in state:
        return True, END
    return False, "continue"

# Create the workflow graph
def create_workflow():
    # Initialize the graph
    workflow = StateGraph(WorkflowState)
    
    # Add nodes
    workflow.add_node("regulatory_analysis", regulatory_analysis)
    workflow.add_node("impact_assessment", impact_assessment)
    workflow.add_node("action_planning", action_planning)
    
    # Add edges for sequential flow
    workflow.add_edge("regulatory_analysis", "impact_assessment")
    workflow.add_edge("impact_assessment", "action_planning")
    
    # Add conditional edge from action_planning 
    workflow.add_conditional_edges("action_planning", should_end)
    
    # Set entry point
    workflow.set_entry_point("regulatory_analysis")
    
    # Compile graph
    return workflow.compile()

# Run the workflow
async def run_pipeline():
    """Run the full workflow and return results"""
    try:
        # Create workflow
        print("Creating workflow...")
        workflow = create_workflow()
        
        # Initialize empty state
        initial_state = WorkflowState()
        
        # Run the workflow
        print("Running workflow...")
        final_state = workflow.invoke(initial_state)
        
        # Check for errors
        if "error" in final_state:
            print(f"Workflow completed with error: {final_state['error']}")
        else:
            print("Workflow completed successfully!")
            print(f"Generated {len(final_state.get('action_plan', {}).get('action_items', []))} action items")
        
        return final_state
    
    except Exception as e:
        print(f"Workflow execution error: {str(e)}")
        return {"error": f"Workflow execution failed: {str(e)}"}

# # Run the workflow if this script is executed directly
# if __name__ == "__main__":
#     print("Starting workflow execution...")
#     result = run_workflow()
    
#     # Print final report
#     if "final_report" in result:
#         print("\nFINAL REPORT:")
#         print(json.dumps(result["final_report"], indent=2))
        
#         print("\nACTION ITEMS:")
#         for i, item in enumerate(result.get("action_plan", {}).get("action_items", [])):
#             print(f"{i+1}. {item.get('title')} ({item.get('priority')}) - {item.get('deadline')}")
    # else:
    #     print("\nNo final report generated. Check for errors.")