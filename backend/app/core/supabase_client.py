from supabase import create_client
from app.core.settings import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

# Initialize Supabase client
supabase = create_client(SUPABASE_URL)

def get_document_chunks(query_embedding, limit=5):
    """
    Perform vector similarity search on document_chunks
    """
    response = supabase.table("document_chunks").select("*") \
                      .order(f"embedding <-> '{query_embedding}'::vector") \
                      .limit(limit) \
                      .execute()
    return response.data 