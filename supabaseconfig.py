import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()  # Load from .env file

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_BUCKECT_NAME = "images"

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ Supabase credentials are missing. Make sure SUPABASE_URL and SUPABASE_KEY are set in your environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
