import argparse
import asyncio
from dotenv import load_dotenv
load_dotenv()
from backend.services.asr import asr_service
import os

def main():
    parser = argparse.ArgumentParser(description="Test ASR Service")
    parser.add_argument("--audio", type=str, required=True, help="Path to the audio file (wav)")
    parser.add_argument("--language", type=str, default="english", help="Language to transcribe")
    args = parser.parse_args()

    if not os.path.exists(args.audio):
        print(f"Audio file not found: {args.audio}")
        return

    print("Initializing ASR service...")
    try:
        asr_service.initialize()
    except Exception as e:
        print(f"Failed to initialize: {e}")
        return

    print(f"Transcribing {args.audio} in {args.language}...")
    result = asr_service.transcribe(args.audio, args.language)
    
    import json
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
