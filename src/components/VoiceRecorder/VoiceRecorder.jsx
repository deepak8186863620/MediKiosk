import { Mic, Square, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { useEffect, useRef } from 'react';

/**
 * VoiceRecorder — the central voice capture component for the kiosk.
 * Designed to be extremely simple for elderly users.
 */
export default function VoiceRecorder({ onRecordingComplete, onError }) {
  const { state, audioBlob, error, startRecording, stopRecording, reset } = useVoiceRecorder();
  const blobSentRef = useRef(false);

  useEffect(() => {
    if (state === 'processing' && audioBlob && !blobSentRef.current) {
      blobSentRef.current = true;
      onRecordingComplete?.(audioBlob);
    }
    if (state !== 'processing') {
      blobSentRef.current = false;
    }
  }, [state, audioBlob]);

  useEffect(() => {
    if (error) onError?.(error);
  }, [error]);

  const stateConfig = {
    idle: {
      icon: <Mic size={52} className="text-blue-600" />,
      label: 'Press to speak',
      sublabel: 'Tap the microphone to start recording',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      ringColor: '',
      action: startRecording,
      showStop: false,
    },
    recording: {
      icon: <Mic size={52} className="text-white" />,
      label: 'Listening...',
      sublabel: 'Speak clearly. Press stop when finished.',
      color: 'bg-red-500 border-red-400',
      ringColor: 'ring-4 ring-red-300',
      action: stopRecording,
      showStop: true,
    },
    processing: {
      icon: <Loader2 size={48} className="text-blue-600 animate-spin" />,
      label: 'Processing...',
      sublabel: 'Please wait while we transcribe your speech.',
      color: 'bg-blue-50 border-blue-200',
      ringColor: '',
      action: null,
      showStop: false,
    },
    error: {
      icon: <AlertCircle size={48} className="text-red-500" />,
      label: 'Recording failed',
      sublabel: error || 'Please try again.',
      color: 'bg-red-50 border-red-200',
      ringColor: '',
      action: null,
      showStop: false,
    },
  };

  const cfg = stateConfig[state] || stateConfig.idle;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Mic button with ripple effect for recording */}
      <div className="relative flex items-center justify-center">
        {state === 'recording' && (
          <>
            <div className="absolute w-40 h-40 rounded-full bg-red-300 animate-ripple opacity-40" />
            <div className="absolute w-32 h-32 rounded-full bg-red-300 animate-ripple opacity-60" style={{ animationDelay: '0.5s' }} />
          </>
        )}
        <button
          onClick={cfg.action}
          disabled={!cfg.action}
          className={`relative z-10 w-36 h-36 rounded-full border-4 flex items-center justify-center transition-all duration-200
            ${cfg.color} ${cfg.ringColor}
            ${cfg.action ? 'cursor-pointer active:scale-95' : 'cursor-default opacity-80'}
          `}
          aria-label={cfg.label}
        >
          {cfg.icon}
        </button>
      </div>

      {/* State label */}
      <div className="text-center">
        <p className="text-2xl font-semibold text-slate-800">{cfg.label}</p>
        <p className="text-base text-slate-500 mt-1 max-w-xs mx-auto">{cfg.sublabel}</p>
      </div>

      {/* Action buttons */}
      {state === 'error' && (
        <div className="flex gap-3">
          <button onClick={() => { reset(); startRecording(); }} className="btn-primary">
            <RefreshCw size={18} /> Try Again
          </button>
        </div>
      )}

      {state === 'recording' && (
        <button
          onClick={stopRecording}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white text-lg font-semibold hover:bg-red-600 transition-colors"
        >
          <Square size={20} fill="white" /> Stop Recording
        </button>
      )}
    </div>
  );
}
