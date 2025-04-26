from fastapi import APIRouter, HTTPException
from app.core.db_client import get_records, insert_data, execute_query
from datetime import datetime
from typing import List, Dict, Any, Optional

router = APIRouter(prefix="/direct-db")

@router.get("/regulation-diffs")
async def get_regulation_diffs_direct():
    """Get all regulation diffs using direct PostgreSQL connection"""
    try:
        # Example of using the direct database connection
        results = get_records("regulation_diffs")
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/insert-regulation")
async def insert_regulation_direct(regulation: Dict[str, Any]):
    """Insert a regulation using direct PostgreSQL connection"""
    try:
        # Add timestamp if not provided
        if "published_date" not in regulation:
            regulation["published_date"] = datetime.now().isoformat()
            
        # Insert into database directly
        result = insert_data("regulation_diffs", regulation)
        return {
            "status": "success",
            "message": "Regulation inserted directly",
            "id": result[0]["id"] if result else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/vector-search/{embedding}")
async def vector_search_direct(embedding: str, limit: int = 5):
    """Perform vector search using direct PostgreSQL connection"""
    try:
        # Example vector search query
        query = """
        SELECT id, content, (embedding <-> %s::vector) as distance
        FROM document_chunks
        ORDER BY distance
        LIMIT %s
        """
        results = execute_query(query, (embedding, limit))
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vector search error: {str(e)}")

@router.get("/complex-query")
async def complex_query():
    """Example of a more complex SQL query that might be easier with direct DB access"""
    try:
        # This is the kind of complex query that's easier with direct SQL access
        query = """
        WITH recent_regs AS (
            SELECT id, title, published_date
            FROM regulation_diffs
            WHERE published_date > (CURRENT_DATE - INTERVAL '30 days')
        ),
        impact_counts AS (
            SELECT regulation_diff_id, COUNT(*) as finding_count
            FROM findings
            GROUP BY regulation_diff_id
        ),
        action_counts AS (
            SELECT f.regulation_diff_id, COUNT(*) as action_count
            FROM action_items a
            JOIN findings f ON a.finding_id = f.id
            GROUP BY f.regulation_diff_id
        )
        SELECT r.id, r.title, r.published_date, 
               COALESCE(i.finding_count, 0) as finding_count,
               COALESCE(a.action_count, 0) as action_count
        FROM recent_regs r
        LEFT JOIN impact_counts i ON r.id = i.regulation_diff_id
        LEFT JOIN action_counts a ON r.id = a.regulation_diff_id
        ORDER BY r.published_date DESC
        """
        results = execute_query(query)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query error: {str(e)}") 