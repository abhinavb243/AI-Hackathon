import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Supabase settings
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Database connection string for direct PostgreSQL access
DATABASE_URL = os.getenv("DATABASE_URL")

# OpenAI settings
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Application settings
DEBUG = os.getenv("DEBUG", "False").lower() == "true" 