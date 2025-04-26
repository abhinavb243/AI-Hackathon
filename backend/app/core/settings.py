from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

# OpenAI settings
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Supabase settings
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Database connection string for direct PostgreSQL access
DATABASE_URL = os.getenv("DATABASE_URL")

# Application settings
DEBUG = os.getenv("DEBUG", "False").lower() == "true" 