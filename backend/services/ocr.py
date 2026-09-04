import json
from main import call_gemini_api, GeminiRequest

def extract_document_data(image_base64: str, mime_type: str, document_type: str) -> dict:
    """Uses Gemini vision to extract structured clinical data from a document image."""
    
    system_instruction = f"""
    You are an expert medical data extractor. Your task is to analyze the uploaded {document_type} image and extract structured data.
    Return ONLY valid JSON matching this schema:
    {{
      "diagnoses": ["string"],
      "medications": ["string (include dosage if found)"],
      "lab_values": [{{"test": "string", "value": "string", "unit": "string", "abnormal": boolean}}],
      "dates": ["string"],
      "summary": "A brief 2-sentence summary of the document"
    }}
    """
    
    user_text = f"Extract the medical data from this {document_type}."
    
    req = GeminiRequest(
        systemInstruction=system_instruction,
        userText=user_text,
        json=True,
        imageBase64=image_base64,
        imageMime=mime_type
    )
    
    try:
        response_text = call_gemini_api(req)
        data = json.loads(response_text)
        return data
    except Exception as e:
        return {
            "error": str(e),
            "diagnoses": [],
            "medications": [],
            "lab_values": [],
            "dates": [],
            "summary": "Extraction failed."
        }
