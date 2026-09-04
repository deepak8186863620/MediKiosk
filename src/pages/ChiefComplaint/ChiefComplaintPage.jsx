import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Hand, Stethoscope } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import ProgressIndicator from '../../components/ProgressIndicator/ProgressIndicator';
import { SYMPTOM_CATEGORIES } from '../../config/clinicalConfig';
import { useTranslation } from '../../hooks/useTranslation';

export default function ChiefComplaintPage() {
  const navigate = useNavigate();
  const { setChiefComplaint } = useKiosk();
  const { t } = useTranslation();
  const [mode, setMode] = useState(null); // 'voice' | 'touch'
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [otherText, setOtherText] = useState('');

  function toggleSymptom(id) {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }

  function handleContinue() {
    const complaint = mode === 'touch'
      ? selectedSymptoms.map(id => SYMPTOM_CATEGORIES.find(s => s.id === id)?.label).join(', ') +
        (otherText ? `, ${otherText}` : '')
      : '';
    setChiefComplaint(complaint);
    navigate('/conversation');
  }

  return (
    <div className="page-bg">
      <div className="gamosa-strip"></div>
      
      {/* Sub-header for flow pages */}
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/patient-info')} className="btn-ghost">
          <ArrowLeft size={20} /> {t('back')}
        </button>
        <div className="flex items-center gap-2">
           <Stethoscope size={20} className="text-[var(--forest-500)]" />
           <span className="text-lg font-bold text-[var(--forest-800)]">{t('cc_header')}</span>
        </div>
        <div className="w-[88px]" />
      </header>

      <main className="flex-1 px-8 py-8 kiosk-container relative z-10">
        <ProgressIndicator currentStep="chief-complaint" />

        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--forest-900)] mb-3">
            {t('cc_title')}
          </h1>
          <p className="text-lg text-[var(--text-muted)] font-medium">
            {t('cc_subtitle')}
          </p>
        </div>

        {/* Mode selection */}
        {!mode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full max-w-[700px] mx-auto animate-slide-up" style={{animationDelay: '0.1s'}}>
            <button
              onClick={() => { setMode('voice'); navigate('/conversation'); }}
              className="card-interactive flex flex-col items-center gap-5 py-10 border-2 hover:border-[var(--forest-500)]"
              id="mode-voice"
            >
              <div className="w-24 h-24 rounded-full bg-[var(--surface-bg)] border-[1.5px] border-[var(--border)] flex items-center justify-center shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--forest-500)] opacity-10"></div>
                <Mic size={48} className="text-[var(--forest-600)]" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--forest-900)] mt-1">{t('cc_speak_btn')}</p>
                <p className="text-base text-[var(--text-muted)] mt-2 font-medium">{t('cc_speak_sub')}</p>
              </div>
            </button>

            <button
              onClick={() => setMode('touch')}
              className="card-interactive flex flex-col items-center gap-5 py-10 border-2 hover:border-[var(--forest-500)]"
              id="mode-touch"
            >
              <div className="w-24 h-24 rounded-full bg-[var(--surface-bg)] border-[1.5px] border-[var(--border)] flex items-center justify-center shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--saffron-500)] opacity-15"></div>
                <Hand size={48} className="text-[var(--saffron-600)]" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--forest-900)] mt-1">{t('cc_tap_btn')}</p>
                <p className="text-base text-[var(--text-muted)] mt-2 font-medium">{t('cc_tap_sub')}</p>
              </div>
            </button>
          </div>
        )}

        {/* Touch mode symptom grid */}
        {mode === 'touch' && (
          <div className="animate-slide-up w-full max-w-[800px] mx-auto">
            <p className="text-lg font-bold text-[var(--forest-800)] mb-5 text-center">
              {t('cc_select')}
            </p>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {SYMPTOM_CATEGORIES.map(cat => {
                const isSelected = selectedSymptoms.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleSymptom(cat.id)}
                    className={`flex flex-col items-center justify-center gap-3 py-6 px-3 rounded-[1.25rem] border-2 transition-all
                      ${isSelected
                        ? 'border-[var(--forest-500)] bg-[var(--forest-500)] text-white shadow-lg shadow-[var(--forest-500)]/30 transform scale-[1.02]'
                        : 'border-[var(--border)] bg-white text-[var(--forest-900)] hover:border-[var(--forest-400)] hover:bg-[var(--surface-bg)]'
                      }`}
                    id={`symptom-${cat.id}`}
                  >
                    <span className="text-4xl drop-shadow-sm">{cat.icon}</span>
                    <span className={`text-center font-bold text-sm leading-snug ${isSelected ? 'text-white' : 'text-[var(--forest-800)]'}`}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Other text field */}
            {selectedSymptoms.includes('other') && (
              <div className="mb-8 animate-fade-in card p-6 bg-white/60">
                <label className="block text-base font-bold text-[var(--forest-900)] mb-3">{t('cc_or')}</label>
                <textarea
                  value={otherText}
                  onChange={e => setOtherText(e.target.value)}
                  placeholder={t('cc_placeholder')}
                  rows={3}
                  className="input-large resize-none"
                />
              </div>
            )}

            <div className="flex gap-4 max-w-[500px] mx-auto">
              <button onClick={() => setMode(null)} className="btn-secondary flex-1 py-4">
                {t('change_mode')}
              </button>
              <button
                onClick={handleContinue}
                disabled={selectedSymptoms.length === 0}
                className={`btn-primary flex-1 py-4 ${selectedSymptoms.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                id="btn-complaint-continue"
              >
                {t('continue')} →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
