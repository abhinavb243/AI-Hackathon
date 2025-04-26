from fastapi import APIRouter, HTTPException, Body
from app.core.db_client import get_records, insert_data, execute_query
from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/direct-db")

class DataCatalogEntry(BaseModel):
    name: str
    data_type: str
    description: str
    storage_location: str
    classification: str
    retention_period: Optional[str] = None
    access_controls: Optional[str] = None
    processing_purpose: Optional[str] = None
    additional_metadata: Optional[Dict[str, Any]] = None

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

@router.get("/data-catalog")
async def get_data_catalog():
    """Get all data catalog entries using direct DB access"""
    try:
        records = get_records("data_catalog")
        return {"status": "success", "data": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/add-data-catalog-entry")
async def add_data_catalog_entry(entry: DataCatalogEntry):
    """Add a new entry to the data catalog"""
    try:
        data = entry.dict()
        data["created_at"] = datetime.now().isoformat()
        
        result = insert_data("data_catalog", data)
        return {"status": "success", "id": result[0]["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/upload-mock-company-practices")
async def upload_mock_company_practices(entries: List[DataCatalogEntry]):
    """
    Upload mock company data handling practices
    This endpoint accepts a list of data catalog entries representing how the company handles data
    """
    try:
        inserted_ids = []
        for entry in entries:
            data = entry.dict()
            data["created_at"] = datetime.now().isoformat()
            result = insert_data("data_catalog", data)
            inserted_ids.append(result[0]["id"])
        
        return {
            "status": "success",
            "message": f"Added {len(inserted_ids)} mock company data practices",
            "inserted_ids": inserted_ids
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading mock practices: {str(e)}")

@router.get("/query-example")
async def query_example():
    """Example of using the DB client to run a custom query"""
    try:
        # This is a placeholder for demonstrating custom query execution
        # In a real implementation, we would execute a custom query
        
        return {
            "status": "success",
            "message": "Query execution demonstration",
            "sample_data": {
                "data_catalog_count": 5,
                "regulation_diffs_count": 3
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}") 