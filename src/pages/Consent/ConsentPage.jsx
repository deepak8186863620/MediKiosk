import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import AudioButton from '../../components/AudioButton/AudioButton';

const CONSENT_TEXT = `We will ask you some questions about your health. Your answers will be used to prepare information for the doctor who will see you today. This kiosk does not make any medical decisions. Your doctor will review all information. Your information is kept private and is used only for your consultation today.`;

const CONSENT_DETAILS = `Your health information collected through this kiosk is:
• Stored securely and used only for today's consultation
• Not shared with anyone outside this hospital
• Not used for advertising or research without your permission
• Protected under applicable Indian health data regulations

MediKiosk is an AI-assisted system. All clinical decisions are made by qualified medical professionals. The kiosk only collects and organises your health history.`;

export default function ConsentPage() {
  const navigate = useNavigate();
  const { setConsent } = useKiosk();
  const [agreed, setAgreed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  function handleContinue() {
    if (!agreed) return;
    setConsent(true);
    navigate('/patient-info');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col">
      <header className="w-full px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-white/80">
        <button onClick={() => navigate('/language')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800">
          <ArrowLeft size={20} /> Back
        </button>
        <span className="text-lg font-semibold text-slate-700">Before We Begin</span>
        <div />
      </header>

      <main className="flex-1 px-8 py-10 max-w-xl mx-auto w-full flex flex-col">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🤝</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Before we begin</h1>
        </div>

        {/* Consent card */}
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-800">What will happen?</h2>
            <AudioButton text={CONSENT_TEXT} label="Listen" />
          </div>
          <p className="text-base text-slate-600 leading-relaxed">{CONSENT_TEXT}</p>

          {/* Details accordion */}
          <button
            onClick={() => setShowDetails(v => !v)}
            className="flex items-center gap-1.5 mt-4 text-blue-600 text-sm font-medium hover:underline"
          >
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showDetails ? 'Hide details' : 'View full details'}
          </button>

          {showDetails && (
            <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600 whitespace-pre-line leading-relaxed animate-fade-in">
              {CONSENT_DETAILS}
            </div>
          )}
        </div>

        {/* Agreement checkbox */}
        <button
          onClick={() => setAgreed(v => !v)}
          className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all mb-8 text-left w-full
            ${agreed
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-200 bg-white hover:border-blue-300'
            }`}
          id="consent-toggle"
        >
          <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all
            ${agreed ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
            {agreed && <span className="text-white text-lg font-bold">✓</span>}
          </div>
          <p className="text-lg font-medium text-slate-800">
            I understand and agree
          </p>
        </button>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button onClick={() => navigate('/language')} className="btn-secondary flex-1">
            Go Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!agreed}
            className={`flex-1 btn-primary ${!agreed ? 'opacity-50 cursor-not-allowed' : ''}`}
            id="btn-consent-continue"
          >
            Continue →
          </button>
        </div>
      </main>
    </div>
  );
}
