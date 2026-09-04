import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useTTS } from '../../hooks/useTTS';

/**
 * AudioButton — reads text aloud using the centralized useTTS hook.
 * Appears throughout the kiosk for audio accessibility.
 */
export default function AudioButton({ text, label = 'Listen', size = 'md', autoSpeak = false, langOverride = null }) {
  const { speak, cancel, isSpeaking, isSupported } = useTTS();
  const [hasSpoken, setHasSpoken] = useState(false);

  useEffect(() => {
    if (autoSpeak && text && !hasSpoken) {
      speak(text, langOverride);
      setHasSpoken(true);
    }
  }, [autoSpeak, text, hasSpoken, speak, langOverride]);

  useEffect(() => {
    // Reset hasSpoken if text changes
    setHasSpoken(false);
  }, [text]);

  const sizeClasses = size === 'lg'
    ? 'px-5 py-3 text-lg gap-2.5'
    : 'px-4 py-2.5 text-base gap-2';

  if (!isSupported) return null;

  return (
    <button
      onClick={() => isSpeaking ? cancel() : speak(text, langOverride)}
      className={`inline-flex items-center ${sizeClasses} rounded-xl font-medium transition-colors ${
        isSpeaking 
          ? 'bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200' 
          : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
      }`}
      aria-label={`Read aloud: ${text}`}
      title="Listen to this"
    >
      {isSpeaking ? (
        <VolumeX size={size === 'lg' ? 22 : 18} className="animate-pulse" />
      ) : (
        <Volume2 size={size === 'lg' ? 22 : 18} />
      )}
      {isSpeaking ? 'Stop' : label}
    </button>
  );
}
