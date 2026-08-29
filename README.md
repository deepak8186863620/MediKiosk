# MediKiosk 🏥

MediKiosk is an AI-powered clinical history-taking platform designed for hospitals and clinics. It streamlines the patient intake process by collecting structured clinical histories in multiple Indian languages, identifying critical red flags, and assisting healthcare providers with AI-driven triage and contextual questions.

## 🌟 Key Features Implemented So Far

### 1. **Multilingual Speech-to-Text (ASR) Pipeline**
Integrated the **AI4Bharat IndicConformer (600M)** model to accurately transcribe spoken clinical complaints in local Indian languages.
- **Supported Languages:** English (`en`), Hindi (`hi`), Assamese (`as`), Bodo (`brx`), Manipuri (`mni`), Bengali (`bn`), Nepali (`ne`), Telugu (`te`).
- Dynamic audio preprocessing: Automatically converts stereo to mono and resamples audio to 16kHz before processing.
- Optimized initialization: The model loads securely and only once during the FastAPI backend startup to maximize performance. 

### 2. **AI Clinical Conversation & Triage Engine**
- **Gemini Pro 1.5 Integration:** An intelligent RAG (Retrieval-Augmented Generation) brain that analyzes patient transcripts to extract medical entities, identify missing data, and dynamically ask adaptive follow-up questions.
- **Symptom Extraction & Disease Classifier:** A Scikit-Learn-based Machine Learning pipeline that maps patient complaints to a standard medical vocabulary and predicts the top 3 most likely medical conditions (Triage Prediction).
- **RAG for AYUSH & Clinical Guidelines:** Chromadb vector database setup to ground the LLM's adaptive questions securely in validated medical knowledge, avoiding hallucination and preventing autonomous diagnosis.

### 3. **FastAPI Backend Architecture**
A robust, asynchronous backend handling complex ML model inferences without blocking requests.
- **Endpoints:**
  - `POST /api/asr/transcribe` - Accepts audio blobs and language context, returning highly accurate transcriptions.
  - `POST /api/triage` - Orchestrates the combination of symptom extraction and disease prediction.
  - `POST /api/gemini` - Secure proxy for frontend interaction with Google's Gemini models.
- Graceful context managers managing the lifecycle of heavy ML models (IndicConformer & Triage ML models).

### 4. **Structured Data Infrastructure**
Created a comprehensive JSON schema architecture to standardize patient data for future ABDM/FHIR compatibility.
- Adaptive Question Schemas
- Patient History Schemas
- Prescription & Medical Document Ground Truth definitions
- Hardcoded Red-Flag rules ensuring deterministic safety nets (bypassing AI unpredictability during emergencies).

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- A valid [Hugging Face Access Token](https://huggingface.co/settings/tokens) (with access to `ai4bharat/indic-conformer-600m-multilingual`)
- A valid Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/deepak8186863620/MediKiosk.git
   cd MediKiosk
   ```

2. **Set up environment variables**
   Copy the example config and add your keys:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and add your `HF_TOKEN` and `GEMINI_API_KEY`.*

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

### Running the Backend

Launch the FastAPI backend server:
```bash
cd backend
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`.

### Manual ASR Testing

You can easily test the transcription pipeline using the provided CLI tool in the root directory:
```bash
python test_asr.py --audio path/to/your/audio.wav --language hindi
```

## 📚 Documentation
For a deeper dive into the ASR implementation, please refer to [docs/AI4BHARAT_ASR.md](./docs/AI4BHARAT_ASR.md).

## 🛡️ Clinical Safety Note
This software is intended as an **assistive data-collection tool** for medical professionals. It does not output definitive medical diagnoses. The platform is strictly designed to structure information and highlight clinical red flags for urgent physician review.
