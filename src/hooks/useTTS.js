/**
 * useTTS — Centralized Text-to-Speech hook for MediKiosk
 * Uses Web Speech API with best-effort Indian language voice matching.
 * Provides autoSpeak, speak, cancel, and speaking state.
 */
import { useState, useEffect, useRef, useCallback } from 'react';

// Maps language code → BCP-47 for Web Speech API
const TTS_LANG_MAP = {
  en:  'en-IN',
  hi:  'hi-IN',
  te:  'te-IN',
  ta:  'ta-IN',
  bn:  'bn-IN',
  mr:  'mr-IN',
  as:  'as-IN',
  mni: 'bn-IN', // fallback — Manipuri not widely available; use Bengali script
  gu:  'gu-IN',
  kn:  'kn-IN',
};

export function useTTS(language = 'en') {
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

    const lang = TTS_LANG_MAP[langOverride || language] || 'en-IN';

    // Voices may not be loaded yet — wait if needed
    const doSpeak = () => {
      // Chrome has a bug where utterances > 15s get cancelled.
      // We chunk the text by punctuation to avoid this.
      const chunks = text.match(/[^.!?]+[.!?]*/g) || [text];
      let currentChunkIndex = 0;

      const speakNextChunk = () => {
        if (currentChunkIndex >= chunks.length) {
          setIsSpeaking(false);
          return;
        }

        const chunk = chunks[currentChunkIndex].trim();
        if (!chunk) {
          currentChunkIndex++;
          speakNextChunk();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.lang = lang;
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const match = voices.find(v => v.lang === lang)
          || voices.find(v => v.lang.startsWith(lang.split('-')[0]))
          || voices.find(v => v.lang.startsWith('en'));
        if (match) utterance.voice = match;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onerror = () => setIsSpeaking(false);
        utterance.onend = () => {
          currentChunkIndex++;
          speakNextChunk();
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      };

      speakNextChunk();
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
    } else {
      doSpeak();
    }
  }, [isSupported, language, cancel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  return { speak, cancel, isSpeaking, isSupported };
}

export default useTTS;
