/**
 * useTTS — Centralized Text-to-Speech hook for MediKiosk
 * Uses Web Speech API. Ensure Windows Language Packs are installed.
 */
import { useState, useEffect, useRef, useCallback } from 'react';

// Maps our app's language codes to BCP-47 tags
const TTS_LANG_MAP = {
  en: 'en-IN', hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN',
  bn: 'bn-IN', mr: 'mr-IN', as: 'as-IN', mni: 'hi-IN'
};

export function useTTS(defaultLanguage = 'en') {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  const cancel = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback((text, langOverride) => {
    if (!isSupported || !text) return;
    cancel();

    const targetLangCode = langOverride || defaultLanguage;
    const lang = TTS_LANG_MAP[targetLangCode] || 'en-IN';
    
    // Very simple execution without chunking to ensure reliability
    const executeSpeech = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.85;

      // Try to find the best voice
      const voices = window.speechSynthesis.getVoices();
      
      const exactMatch = voices.find(v => v.lang === lang);
      const prefixMatch = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
      
      // Fallback name search (e.g. searching for "hindi")
      const langNames = { hi: 'hindi', te: 'telugu', ta: 'tamil', bn: 'bengali', mr: 'marathi' };
      const nameMatch = langNames[targetLangCode] 
        ? voices.find(v => v.name.toLowerCase().includes(langNames[targetLangCode])) 
        : null;

      const fallbackMatch = voices.find(v => v.lang.startsWith('en'));

      if (exactMatch) utterance.voice = exactMatch;
      else if (prefixMatch) utterance.voice = prefixMatch;
      else if (nameMatch) utterance.voice = nameMatch;
      else if (fallbackMatch) utterance.voice = fallbackMatch;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error("SpeechSynthesis error:", e);
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        executeSpeech();
      };
    } else {
      executeSpeech();
    }
  }, [defaultLanguage, isSupported, cancel]);

  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  return { speak, cancel, isSpeaking, isSupported };
}

export default useTTS;
