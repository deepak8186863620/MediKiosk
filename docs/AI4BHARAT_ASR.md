# AI4Bharat IndicConformer ASR Integration

## 1. What is IndicConformer?
IndicConformer is a 600M parameter multilingual speech-to-text model developed by AI4Bharat. It is designed to handle multiple Indian languages accurately.

## 2. Why MediKiosk uses it
MediKiosk serves diverse populations in India, requiring highly accurate transcription in local languages like Hindi, Assamese, Bodo, and Telugu. IndicConformer provides state-of-the-art accuracy for these languages, allowing accurate clinical history collection from patients who do not speak English.

## 3. How to obtain Hugging Face access
1. Create an account on [Hugging Face](https://huggingface.co/).
2. Navigate to your Settings -> Access Tokens.
3. Generate a new token with "read" access.
4. Visit the [ai4bharat/indic-conformer-600m-multilingual](https://huggingface.co/ai4bharat/indic-conformer-600m-multilingual) page and accept their terms (if required).

## 4. Where HF_TOKEN goes
Place your token in the `.env` file at the root of the project:
```
HF_TOKEN=hf_your_token_here
GEMINI_API_KEY=your_gemini_key
```

## 5. Installation Commands
```bash
pip install torch torchaudio transformers huggingface_hub python-multipart pydub
```

## 6. How to run the backend
```bash
cd backend
uvicorn main:app --reload
```

## 7. How to test Assamese
```bash
python test_asr.py --audio sample_as.wav --language assamese
```

## 8. How to test Bodo
```bash
python test_asr.py --audio sample_brx.wav --language bodo
```

## 9. How to test Manipuri
```bash
python test_asr.py --audio sample_mni.wav --language manipuri
```

## 10. How to test Hindi
```bash
python test_asr.py --audio sample_hi.wav --language hindi
```

## 11. How to test Telugu
```bash
python test_asr.py --audio sample_te.wav --language telugu
```

## 12. API Endpoint
**POST** `/api/asr/transcribe`

## 13. Example Request
```bash
curl -X POST -F "file=@sample_as.wav" -F "language=assamese" http://localhost:8000/api/asr/transcribe
```

## 14. Example Response
```json
{
  "success": true,
  "language": "assamese",
  "language_code": "as",
  "transcript": "আমি অসমীয়া কওঁ",
  "processing_time": 1.42
}
```

## 15. CPU/GPU Requirements
The model automatically detects if a CUDA GPU is available. 
- **GPU**: Recommended for production (fast inference, < 2 seconds).
- **CPU**: Supported but slower (inference might take 10-30 seconds depending on audio length).

## 16. Troubleshooting
- **Missing HF_TOKEN**: The backend will show a warning on startup. Set `HF_TOKEN` in `.env`.
- **Memory errors**: The 600M model requires ~2.5GB RAM. Ensure you have enough available memory.
- **Microphone permission**: Ensure the frontend asks for permission before recording.
- **Data integrity**: The system preserves the original transcript and does not silently alter medication names, doses, allergies, dates, or symptoms.
