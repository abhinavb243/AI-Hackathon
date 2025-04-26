import os
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.pool import ThreadedConnectionPool
from app.core.settings import DATABASE_URL

# Initialize connection pool
pool = ThreadedConnectionPool(
    minconn=5,
    maxconn=20,
    dsn=DATABASE_URL
)

def execute_query(query, params=None, fetch=True):
    """
    Execute a SQL query with connection pooling
    
    Args:
        query (str): SQL query to execute
        params (tuple|dict): Parameters for the query
        fetch (bool): Whether to fetch results or not
        
    Returns:
        list: Query results (if fetch=True)
    """
    conn = pool.getconn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query, params)
            
            if fetch:
                results = cur.fetchall()
                return results
                
            conn.commit()
            return cur.rowcount
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        pool.putconn(conn)

def get_document_chunks(query_embedding, limit=5):
    """
    Perform vector similarity search on document_chunks
    
    Args:
        query_embedding (str): Vector embedding to search against
        limit (int): Maximum number of results to return
        
    Returns:
        list: Matching documents
    """
    query = """
    SELECT *
    FROM document_chunks
    ORDER BY embedding <-> %s::vector
    LIMIT %s
    """
    return execute_query(query, (query_embedding, limit))

def insert_data(table, data):
    """
    Insert data into a table
    
    Args:
        table (str): Table name
        data (dict): Data to insert
        
    Returns:
        int: Number of rows affected
    """
    columns = ", ".join(data.keys())
    placeholders = ", ".join([f"%({key})s" for key in data.keys()])
    
    query = f"""
    INSERT INTO {table} ({columns})
    VALUES ({placeholders})
    RETURNING id
    """
    
    return execute_query(query, data, fetch=True)

def get_records(table, conditions=None, limit=None):
    """
    Get records from a table with optional conditions
    
    Args:
        table (str): Table name
        conditions (dict): Field-value pairs for WHERE clause
        limit (int): Maximum number of records to return
        
    Returns:
        list: Query results
    """
    query = f"SELECT * FROM {table}"
    params = {}
    
    if conditions:
        where_clauses = []
        for i, (key, value) in enumerate(conditions.items()):
            param_name = f"param_{i}"
            where_clauses.append(f"{key} = %({param_name})s")
            params[param_name] = value
        
        query += " WHERE " + " AND ".join(where_clauses)
    
    if limit:
        query += f" LIMIT {limit}"
    
    return execute_query(query, params) 