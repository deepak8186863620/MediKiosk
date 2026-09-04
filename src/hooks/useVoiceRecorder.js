import { useState, useRef, useCallback } from 'react';

const MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/mp4',
];

function getSupportedMimeType() {
  return MIME_TYPES.find(t => MediaRecorder.isTypeSupported(t)) || '';
}

export function useVoiceRecorder() {
  const [state, setState] = useState('idle'); // idle | ready | recording | processing | error
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const startRecording = useCallback(async () => {
    setError(null);
    setAudioBlob(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || 'audio/webm',
        });
        setAudioBlob(blob);
        streamRef.current?.getTracks().forEach(t => t.stop());
        setState('processing');
      };

      recorder.onerror = () => {
        setError('Recording failed. Please try again.');
        setState('error');
      };

      recorder.start(250); // collect every 250ms
      setState('recording');
    } catch (err) {
      const msg =
        err.name === 'NotAllowedError'
          ? 'Microphone access was denied. Please allow microphone access.'
          : 'Could not start recording. Please try again.';
      setError(msg);
      setState('error');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setAudioBlob(null);
    setError(null);
    setState('idle');
    chunksRef.current = [];
  }, []);

  return { state, audioBlob, error, startRecording, stopRecording, reset };
}
