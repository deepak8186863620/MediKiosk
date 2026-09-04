import os
import json
import base64
import joblib
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import google.generativeai as genai
import shutil
import tempfile
import uuid
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from backend.services.asr import asr_service
except ImportError:
    # Handle if run from inside backend dir
    from services.asr import asr_service
import google.generativeai as genai
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_fixed
import pandas as pd
import numpy as np

# Load environment variables
load_dotenv()
if "GEMINI_API_KEY" not in os.environ:
    raise ValueError("GEMINI_API_KEY is not set in the environment.")

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        asr_service.initialize()
    except Exception as e:
        print(f"Warning: ASR Service failed to initialize: {e}")
    yield
    # Shutdown
    pass

app = FastAPI(lifespan=lifespan)

# Enable CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the ML model and vocabulary on startup
try:
    disease_model = joblib.load("disease_model.joblib")
    with open("symptoms_vocab.json", "r") as f:
        symptoms_vocab = json.load(f)
except FileNotFoundError:
    print("WARNING: disease_model.joblib or symptoms_vocab.json not found. Did you run train_model.py?")
    disease_model = None
    symptoms_vocab = []

# --- Request Models ---

class GeminiRequest(BaseModel):
    systemInstruction: str
    userText: str
    json: bool = False
    imageBase64: Optional[str] = None
    imageMime: Optional[str] = None

class TriagePredictRequest(BaseModel):
    symptoms: List[str]

class TranscriptRequest(BaseModel):
    transcript: str

# --- Step 1: Backend Proxy for Gemini ---

@retry(stop=stop_after_attempt(2), wait=wait_fixed(2))
def call_gemini_api(req: GeminiRequest) -> str:
    # Initialize the model, you can specify gemini-2.5-flash or gemini-1.5-flash
    model_name = "gemini-1.5-flash" 
    model = genai.GenerativeModel(
        model_name,
        system_instruction=req.systemInstruction
    )
    
    contents = []
    
    if req.imageBase64 and req.imageMime:
        image_parts = [
            {
                "mime_type": req.imageMime,
                "data": req.imageBase64
            }
        ]
        contents.append(image_parts[0])
        
    contents.append(req.userText)
    
    generation_config = {}
    if req.json:
        generation_config["response_mime_type"] = "application/json"
        
    response = model.generate_content(
        contents,
        generation_config=generation_config
    )
    return response.text

@app.post("/api/gemini")
async def gemini_proxy(req: GeminiRequest):
    """Proxy endpoint to securely call Gemini API"""
    try:
        response_text = call_gemini_api(req)
        return {"text": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")


# --- Step 2: Symptom-to-Disease Classifier ---

@app.post("/api/triage-predict")
async def triage_predict(req: TriagePredictRequest):
    """Predicts disease based on symptom array using the scikit-learn model."""
    if not disease_model:
        raise HTTPException(status_code=500, detail="ML Model not loaded.")
        
    # Create input vector matching the vocab
    input_vector = np.zeros(len(symptoms_vocab))
    for symptom in req.symptoms:
        # Match symptom strictly to the vocabulary
        if symptom in symptoms_vocab:
            idx = symptoms_vocab.index(symptom)
            input_vector[idx] = 1
            
    input_df = pd.DataFrame([input_vector], columns=symptoms_vocab)
    
    # Get probabilities
    probabilities = disease_model.predict_proba(input_df)[0]
    
    # Get top 3 predictions
    top_indices = probabilities.argsort()[-3:][::-1]
    classes = disease_model.classes_
    
    top_alternatives = []
    for idx in top_indices:
        if probabilities[idx] > 0:
            top_alternatives.append({
                "condition": classes[idx],
                "confidence": float(probabilities[idx])
            })
            
    if not top_alternatives:
        return {"predictedCondition": "Unknown", "confidence": 0.0, "topAlternatives": []}
        
    return {
        "predictedCondition": top_alternatives[0]["condition"],
        "confidence": top_alternatives[0]["confidence"],
        "topAlternatives": top_alternatives[1:]
    }


# --- Step 3: Bridge Logic ---

@app.post("/api/asr/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    language: str = Form("english")
):
    """
    Transcribes uploaded audio using AI4Bharat IndicConformer.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
        
    temp_dir = tempfile.gettempdir()
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    temp_path = os.path.join(temp_dir, unique_filename)
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        result = asr_service.transcribe(temp_path, language)
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result.get("error", "Transcription failed"))
            
        return result
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/api/extract-symptoms")
async def extract_symptoms(req: TranscriptRequest):
    """Uses Gemini to extract symptoms from transcript that match the known vocabulary."""
    
    system_instruction = f"""
    You are a medical entity extraction AI. Your task is to extract symptoms from the patient's transcript.
    You MUST output ONLY a JSON array of strings representing the symptoms found.
    You may ONLY use symptoms from this exact vocabulary list. Do not make up any symptoms.
    Vocabulary: {json.dumps(symptoms_vocab)}
    """
    
    gemini_req = GeminiRequest(
        systemInstruction=system_instruction,
        userText=req.transcript,
        json=True
    )
    
    try:
        response_text = call_gemini_api(gemini_req)
        symptoms_list = json.loads(response_text)
        if not isinstance(symptoms_list, list):
            symptoms_list = []
        return {"symptoms": symptoms_list}
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Symptom extraction failed: {str(e)}")


@app.post("/api/triage")
async def complete_triage(req: TranscriptRequest):
    """Combines extraction and prediction into a single call for the frontend."""
    # 1. Extract symptoms
    extracted = await extract_symptoms(req)
    symptoms = extracted.get("symptoms", [])
    
    # 2. Predict
    prediction = await triage_predict(TriagePredictRequest(symptoms=symptoms))
    
    # 3. Return both
    return {
        "extractedSymptoms": symptoms,
        "prediction": prediction
    }

# --- Step 4: Multilingual Clinical Conversation ---

class PatientInfo(BaseModel):
    name: str
    age: str
    gender: str
    phone: Optional[str] = ""
    abha_id: Optional[str] = ""
    patient_type: str

class ConversationEntry(BaseModel):
    turn: int
    question: str
    answer: str
    mode: str

class ClinicalAnswerRequest(BaseModel):
    session_id: Optional[str] = None
    question: str
    answer: str
    turn: int
    patient: PatientInfo
    language: str
    history: Optional[List[ConversationEntry]] = []

@app.post("/api/clinical/answer")
async def process_clinical_answer(req: ClinicalAnswerRequest):
    """Processes a patient's answer and generates the next question using Gemini, in the selected language."""
    
    language_map = {
        "hi": "Hindi (Devanagari script)",
        "te": "Telugu",
        "ta": "Tamil",
        "bn": "Bengali",
        "mr": "Marathi",
        "as": "Assamese",
        "mni": "Manipuri",
        "en": "English"
    }
    
    target_language = language_map.get(req.language, "English")
    
    system_instruction = f"""
    You are a clinical history taking assistant for an Indian hospital kiosk.
    Your job is to collect the patient's medical history by asking one question at a time.
    DO NOT diagnose the patient. Only ask questions to understand their symptoms.

    The patient's chosen language is: {target_language}.
    CRITICAL: You MUST output your 'question' and 'options' in EXACTLY this language ({target_language}).
    
    Your response MUST be a valid JSON object matching this schema:
    {{
      "question": "The next question to ask the patient (translated to {target_language})",
      "options": ["Option 1", "Option 2"], // 2-5 common answers for the user to tap, translated to {target_language}
      "red_flag": boolean, // true if symptoms indicate a medical emergency (e.g. severe chest pain, stroke signs)
      "complete": boolean, // true if you have collected enough information (typically after 3-5 turns)
      "summary": null // If complete is true, provide a structured summary object (this MUST be in English for the doctor)
    }}

    If complete is true, the summary object should have this schema:
    {{
      "chief_complaint": "string",
      "history": {{
        "present_illness": "string",
        "duration": "string",
        "associated_symptoms": ["string"]
      }},
      "medications": ["string"],
      "allergies": "string",
      "family_history": "string",
      "personal_history": "string",
      "review_of_systems": "string",
      "ai_flags": ["string"]
    }}
    """
    
    # Build conversation context
    history_text = "Conversation History:\n"
    if req.history:
        for entry in req.history:
            history_text += f"AI: {entry.question}\nPatient: {entry.answer}\n\n"
    else:
        history_text += f"AI: {req.question}\nPatient: {req.answer}\n\n"
        
    user_text = f"""
    Patient Profile:
    Name: {req.patient.name}, Age: {req.patient.age}, Gender: {req.patient.gender}
    
    {history_text}
    
    Based on the conversation so far, generate the next JSON response.
    """
    
    gemini_req = GeminiRequest(
        systemInstruction=system_instruction,
        userText=user_text,
        json=True
    )
    
    try:
        response_text = call_gemini_api(gemini_req)
        # Parse JSON
        result = json.loads(response_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")
