import sys
import os
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Import FastAPI app
from backend.main import app

# Export for Vercel
handler = app