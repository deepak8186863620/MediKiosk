import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, CheckCircle2, Languages, Globe } from 'lucide-react';
import { LANGUAGES } from '../../config/languages';
import { useKiosk } from '../../context/KioskContext';

export default function LanguagePage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useKiosk();

  function handleSelect(lang) {
    setLanguage(lang.code);
  }

  function speakLanguage(lang) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lang.nativeName);
    utterance.lang = lang.code; // use actual language code for pronunciation
    window.speechSynthesis.speak(utterance);
  }

  function handleContinue() {
    navigate('/consent');
  }

  // Identify Northeast languages for specific UI highlighting based on the region
  const neLanguages = ['as', 'mni', 'bodo'];

  return (
    <div className="page-bg">
      <div className="gamosa-strip"></div>
      
      {/* Sub-header for flow pages */}
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="btn-ghost">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-2">
           <Languages size={20} className="text-[var(--forest-500)]" />
           <span className="text-lg font-bold text-[var(--forest-800)]">Language / भाषा</span>
        </div>
        <div className="w-[88px]" /> {/* Spacer for balance */}
      </header>

      <main className="flex-1 px-8 py-10 kiosk-container relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--saffron-100)] mb-4">
            <Globe size={32} className="text-[var(--saffron-600)]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--forest-900)] mb-3">
            Choose your language
          </h1>
          <p className="text-lg text-[var(--text-muted)] font-medium">
            अपनी भाषा चुनें · మీ భాషను ఎంచుకోండి · നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക
          </p>
        </div>

        {/* Language grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 w-full animate-slide-up" style={{animationDelay: '0.1s'}}>
          {LANGUAGES.map(lang => {
            const isNE = neLanguages.includes(lang.code);
            return (
              <div key={lang.code} className="relative">
                <button
                  onClick={() => handleSelect(lang)}
                  className={`lang-card w-full ${language === lang.code ? 'selected' : ''}`}
                  id={`lang-${lang.code}`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-2xl font-bold text-[var(--forest-900)] font-['Noto_Sans']">
                      {lang.nativeName}
                    </span>
                    {language === lang.code && (
                      <CheckCircle2 size={24} className="text-[var(--forest-500)] shadow-sm rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">{lang.name}</span>
                    {isNE && <span className="ne-tag">Northeast</span>}
                  </div>
                </button>
                
                {/* Listen button */}
                <button
                  onClick={(e) => { e.stopPropagation(); speakLanguage(lang); }}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[var(--surface-bg)] border border-[var(--border)] flex items-center justify-center hover:bg-white transition-colors z-10"
                  aria-label={`Listen to ${lang.name}`}
                  title="Listen"
                >
                  <Volume2 size={16} className="text-[var(--forest-600)]" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="animate-slide-up" style={{animationDelay: '0.2s', width: '100%', maxWidth: '400px', margin: '0 auto'}}>
          <button
            onClick={handleContinue}
            className="btn-primary w-full"
            id="btn-continue-language"
            disabled={!language}
          >
            Continue →
          </button>
        </div>
      </main>
    </div>
  );
}
