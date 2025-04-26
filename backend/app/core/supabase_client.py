from supabase import create_client
from app.core.settings import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Supabase client
supabase = None
if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    try:
        # Now passing both required arguments
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        logger.info("Supabase client initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing Supabase client: {str(e)}")
else:
    error_msg = ""
    if not SUPABASE_URL:
        error_msg += "SUPABASE_URL is not set. "
    if not SUPABASE_SERVICE_ROLE_KEY:
        error_msg += "SUPABASE_SERVICE_ROLE_KEY is not set. "
    logger.error(f"Failed to initialize Supabase client: {error_msg}Check your .env file.")

def get_document_chunks(query_embedding, limit=5):
    """
    Perform vector similarity search on document_chunks
    """
    if supabase is None:
        raise ValueError("Supabase client is not initialized. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file")
        
    response = supabase.table("document_chunks").select("*") \
                      .order(f"embedding <-> '{query_embedding}'::vector") \
                      .limit(limit) \
                      .execute()
    return response.data 