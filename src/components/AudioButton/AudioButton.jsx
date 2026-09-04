import { Volume2 } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';

/**
 * AudioButton — reads text aloud using the Web Speech API.
 * Appears throughout the kiosk for audio accessibility.
 */
export default function AudioButton({ text, label = 'Listen', size = 'md' }) {
  const { language } = useKiosk();

  function speak() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language ? `${language}-IN` : 'en-IN';
    utterance.rate = 0.88;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  const sizeClasses = size === 'lg'
    ? 'px-5 py-3 text-lg gap-2.5'
    : 'px-4 py-2.5 text-base gap-2';

  return (
    <button
      onClick={speak}
      className={`inline-flex items-center ${sizeClasses} rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-medium hover:bg-blue-100 transition-colors`}
      aria-label={`Read aloud: ${text}`}
      title="Listen to this"
    >
      <Volume2 size={size === 'lg' ? 22 : 18} />
      {label}
    </button>
  );
}
