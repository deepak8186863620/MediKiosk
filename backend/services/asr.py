import os
import torch
import torchaudio
from transformers import AutoModelForCTC, AutoProcessor
from huggingface_hub import login
import time

SUPPORTED_LANGUAGES = {
    "english": "en",
    "hindi": "hi",
    "assamese": "as",
    "bodo": "brx",
    "manipuri": "mni",
    "nepali": "ne",
    "bengali": "bn",
    "telugu": "te"
}

class ASRService:
    def __init__(self):
        self.model = None
        self.processor = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_id = "ai4bharat/indic-conformer-600m-multilingual"
        
    def initialize(self):
        hf_token = os.environ.get("HF_TOKEN")
        if not hf_token:
            print("WARNING: HF_TOKEN is not set. ASR initialization may fail if the model requires authentication.")
        else:
            login(token=hf_token)
            
        print(f"Loading ASR model {self.model_id} on {self.device}...")
        try:
            self.processor = AutoProcessor.from_pretrained(self.model_id, token=hf_token)
            self.model = AutoModelForCTC.from_pretrained(self.model_id, token=hf_token)
            self.model.to(self.device)
            self.model.eval()
            print("ASR model loaded successfully.")
        except Exception as e:
            print(f"Failed to load ASR model: {e}")
            raise e

    def process_audio(self, audio_file_path: str):
        waveform, sample_rate = torchaudio.load(audio_file_path)
        
        # Convert stereo to mono
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)
            
        # Resample to 16kHz
        if sample_rate != 16000:
            resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
            waveform = resampler(waveform)
            
        return waveform.squeeze().numpy()

    def transcribe(self, audio_file_path: str, language: str) -> dict:
        if language.lower() not in SUPPORTED_LANGUAGES:
            raise ValueError(f"Unsupported language: {language}")
            
        lang_code = SUPPORTED_LANGUAGES[language.lower()]
        
        start_time = time.time()
        
        try:
            audio_array = self.process_audio(audio_file_path)
            
            # The indicative conformer model might require specific language tokens or settings
            # We'll use the generic process for now unless specific lang ids are required in processor
            inputs = self.processor(audio_array, sampling_rate=16000, return_tensors="pt")
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                logits = self.model(**inputs).logits
                
            predicted_ids = torch.argmax(logits, dim=-1)
            transcription = self.processor.batch_decode(predicted_ids)[0]
            
            process_time = time.time() - start_time
            
            return {
                "success": True,
                "language": language.lower(),
                "language_code": lang_code,
                "transcript": transcription,
                "processing_time": round(process_time, 2)
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

# Singleton instance
asr_service = ASRService()
