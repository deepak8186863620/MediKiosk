import os
import json
import chromadb
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables (including GEMINI_API_KEY)
load_dotenv()

# Configure the Gemini API
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

class MediKioskRAGBrain:
    def __init__(self, db_path="./chroma_db"):
        self.chroma_client = chromadb.PersistentClient(path=db_path)
        self.collection = self.chroma_client.get_or_create_collection(name="clinical_knowledge")
        
        # We'll use the latest Gemini 1.5 Pro or Flash which has massive context windows and great JSON support
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
    def ingest_knowledge(self, document_text, metadata_id):
        """
        Adds clinical guidelines, AYUSH knowledge, or red flags into the RAG vector database.
        """
        self.collection.add(
            documents=[document_text],
            metadatas=[{"source": metadata_id}],
            ids=[metadata_id]
        )
        print(f"Ingested document: {metadata_id}")

    def get_relevant_context(self, query, n_results=2):
        """
        Retrieves the most relevant clinical knowledge for a given patient query.
        """
        if self.collection.count() == 0:
            return ""
            
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        
        # Combine the retrieved documents into a single context string
        if results['documents']:
            return "\n\n".join(results['documents'][0])
        return ""

    def generate_adaptive_question(self, patient_history, complaint):
        """
        Uses Gemini to generate the next question based on the RAG context and the JSON schema.
        """
        # 1. Retrieve clinical context from RAG
        context = self.get_relevant_context(complaint)
        
        # 2. Build the prompt
        prompt = f"""
        You are an expert clinical triage AI for the MediKiosk platform.
        Your task is to generate the next adaptive clinical question for the patient.
        
        Clinical Knowledge (RAG Context):
        {context if context else 'No specific guidelines found. Rely on general medical knowledge.'}
        
        Patient Complaint: {complaint}
        Patient History So Far: {patient_history}
        
        Output a valid JSON object matching the AdaptiveQuestionsSchema.
        """
        
        # 3. Call Gemini enforcing JSON format (In production, use structured outputs/response_schema if supported, or JSON mode)
        response = self.model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
            )
        )
        
        return json.loads(response.text)

if __name__ == "__main__":
    brain = MediKioskRAGBrain()
    
    # 1. Simulate adding some knowledge to the RAG database
    brain.ingest_knowledge(
        "For severe chest pain radiating to the left arm, suspect myocardial infarction. "
        "Ask about shortness of breath and sweating. This is a critical Red Flag.",
        "cardiology_guidelines_01"
    )
    
    # 2. Simulate a patient interaction
    complaint = "I have terrible chest pain and my left arm feels heavy."
    history = [] # First question
    
    print("\n--- Generating Adaptive Question with RAG ---")
    question_json = brain.generate_adaptive_question(history, complaint)
    
    print(json.dumps(question_json, indent=2))
