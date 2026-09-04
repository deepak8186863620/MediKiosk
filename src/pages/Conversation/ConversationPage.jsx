import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Hand, RefreshCw, CheckCircle2, AlertTriangle, PhoneCall, Loader2, CheckCheck, Volume2 } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import ProgressIndicator from '../../components/ProgressIndicator/ProgressIndicator';
import VoiceRecorder from '../../components/VoiceRecorder/VoiceRecorder';
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import AudioButton from '../../components/AudioButton/AudioButton';
import { transcribeAudio, processClinicalAnswer } from '../../services/api';
import { demoTranscribe, demoGetNextQuestion, IS_DEMO } from '../../services/demo';
import { getLanguageByCode } from '../../config/languages';
import { useTranslation } from '../../hooks/useTranslation';

const INITIAL_QUESTION = {
  question: 'What problem are you having today? Please describe it in your own words.',
  options: null,
};

export default function ConversationPage() {
  const navigate = useNavigate();
  const { t, language: currentLanguage } = useTranslation();
  const {
    chiefComplaint, patientInfo, language,
    sessionId, setSessionId,
    addConversationEntry, conversationHistory,
    setStructuredHistory, setRedFlag, redFlag, isDemoMode,
  } = useKiosk();

  const [inputMode, setInputMode] = useState('choose'); // 'choose' | 'voice' | 'touch'
  const [currentQuestion, setCurrentQuestion] = useState(INITIAL_QUESTION);
  const [transcript, setTranscript] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [step, setStep] = useState(0); // conversation turn index
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voicePhase, setVoicePhase] = useState('record'); // 'record' | 'confirm'
  const [isComplete, setIsComplete] = useState(false);

  // Pre-fill first question if chief complaint already chosen by touch
  useEffect(() => {
    if (chiefComplaint) {
      setCurrentQuestion({
        question: `Thank you. You mentioned: "${chiefComplaint}". Can you tell me more — when did it start?`,
        options: ['Today', '1–3 days ago', '4–7 days ago', 'More than a week', "I don't know"],
      });
    }
  }, []);

  // --- RED FLAG SCREEN ---
  if (redFlag) {
    return <RedFlagScreen />;
  }

  // --- COMPLETE ---
  if (isComplete) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center px-8 text-center">
        <CheckCheck size={64} className="text-emerald-500 mb-6" />
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('History Collected!', 'History Collected!')}</h1>
        <p className="text-lg text-slate-600 mb-8 max-w-sm">
          {t('Thank you. We have recorded your health information. You can now review it or add medical documents.', 'Thank you. We have recorded your health information. You can now review it or add medical documents.')}
        </p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/documents')} className="btn-secondary">{t('Add Medical Papers', 'Add Medical Papers')}</button>
          <button onClick={() => navigate('/review')} className="btn-primary">{t('Review & Continue →', 'Review & Continue →')}</button>
        </div>
      </div>
    );
  }

  // --- AUDIO TRANSCRIPTION ---
  async function handleRecordingComplete(blob) {
    setError(null);
    setIsLoading(true);
    try {
      let result;
      if (isDemoMode || IS_DEMO) {
        result = await demoTranscribe();
      } else {
        const langConfig = getLanguageByCode(language);
        result = await transcribeAudio(blob, langConfig.asrCode || langConfig.name.toLowerCase());
      }
      setTranscript(result.transcript || result.text || '');
      setVoicePhase('confirm');
    } catch (err) {
      setError(t('Sorry, we could not understand the recording. Please try again or use tap instead.', 'Sorry, we could not understand the recording. Please try again or use tap instead.'));
    } finally {
      setIsLoading(false);
    }
  }

  // --- SUBMIT ANSWER ---
  async function submitAnswer(answer) {
    const entry = {
      turn: step,
      question: currentQuestion.question,
      answer,
      mode: inputMode,
    };
    addConversationEntry(entry);
    setIsLoading(true);
    setTranscript('');
    setSelectedOption(null);
    setVoicePhase('record');
    setInputMode('choose');

    try {
      let nextQ;
      if (isDemoMode || IS_DEMO) {
        nextQ = await demoGetNextQuestion(step + 1);
      } else {
        nextQ = await processClinicalAnswer({
          session_id: sessionId,
          question: entry.question,
          answer,
          turn: step,
          patient: patientInfo,
          language,
          history: [...conversationHistory, entry],
        });
      }

      if (nextQ.red_flag) {
        setRedFlag(true);
        return;
      }

      if (nextQ.complete) {
        setStructuredHistory(nextQ.summary || null);
        setIsComplete(true);
        return;
      }

      setCurrentQuestion({ question: nextQ.question, options: nextQ.options || null });
      setStep(s => s + 1);
    } catch (err) {
      setError(t('We could not save your answer. Please try again or contact staff.', 'We could not save your answer. Please try again or contact staff.'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col">
      <header className="w-full px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-white/80">
        <button onClick={() => navigate('/chief-complaint')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800">
          <ArrowLeft size={20} /> {t('back', 'Back')}
        </button>
        <span className="text-lg font-semibold text-slate-700">{t('Health Questions', 'Health Questions')}</span>
        {isDemoMode && <span className="badge badge-demo">Demo</span>}
      </header>

      <main className="flex-1 px-8 py-8 max-w-xl mx-auto w-full">
        <ProgressIndicator currentStep="conversation" />

        {/* Progress counter */}
        {step > 0 && (
          <p className="text-center text-sm text-slate-400 mb-4">
            {t('Question', 'Question')} {step + 1} — {t('Taking your health history', 'Taking your health history')}
          </p>
        )}

        {/* Current question */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1">
              <QuestionCard
                question={currentQuestion.question}
                options={inputMode === 'touch' ? (currentQuestion.options || []) : []}
                onOptionSelect={opt => setSelectedOption(opt)}
                selectedOption={selectedOption}
              />
            </div>
            <AudioButton text={currentQuestion.question} label={t('Listen', 'Listen')} size="md" autoSpeak={true} />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-base text-red-700">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 size={36} className="text-blue-600 animate-spin" />
            <p className="text-slate-500 text-base">Please wait...</p>
          </div>
        )}

        {/* Mode chooser */}
        {!isLoading && inputMode === 'choose' && (
          <div className="flex gap-4">
            <button
              onClick={() => setInputMode('voice')}
              className="card-interactive flex-1 flex flex-col items-center gap-3 py-6"
              id="choose-voice"
            >
              <Mic size={32} className="text-blue-600" />
              <span className="text-lg font-semibold text-slate-800">🎤 Speak</span>
            </button>
            <button
              onClick={() => setInputMode('touch')}
              className="card-interactive flex-1 flex flex-col items-center gap-3 py-6"
              id="choose-touch"
            >
              <Hand size={32} className="text-emerald-600" />
              <span className="text-lg font-semibold text-slate-800">👆 Tap</span>
            </button>
          </div>
        )}

        {/* Voice mode */}
        {!isLoading && inputMode === 'voice' && (
          <div className="animate-fade-in">
            {voicePhase === 'record' && (
              <div className="text-center">
                <p className="text-slate-500 text-base mb-6">
                  Speak clearly. You do not need to use medical words.
                </p>
                <VoiceRecorder
                  onRecordingComplete={handleRecordingComplete}
                  onError={msg => setError(msg)}
                />
                <button
                  onClick={() => setInputMode('touch')}
                  className="mt-6 text-blue-600 text-base hover:underline"
                >
                  Switch to tap instead
                </button>
              </div>
            )}

            {voicePhase === 'confirm' && transcript && (
              <div className="animate-fade-in">
                <p className="text-base font-semibold text-slate-700 mb-3">We heard:</p>
                <div className="bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 mb-5">
                  <p className="text-xl text-slate-800 italic">"{transcript}"</p>
                </div>
                <p className="text-sm text-slate-500 mb-5">
                  Is this correct? You can edit it below.
                </p>
                <textarea
                  value={transcript}
                  onChange={e => setTranscript(e.target.value)}
                  rows={3}
                  className="input-large resize-none mb-5"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => { setVoicePhase('record'); setTranscript(''); }}
                    className="btn-secondary flex-1"
                  >
                    <RefreshCw size={16} /> Try Again
                  </button>
                  <button
                    onClick={() => submitAnswer(transcript)}
                    className="btn-primary flex-1"
                    id="btn-confirm-transcript"
                    disabled={!transcript.trim()}
                  >
                    <CheckCircle2 size={18} /> Looks Correct
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Touch mode */}
        {!isLoading && inputMode === 'touch' && (
          <div className="animate-fade-in">
            {!currentQuestion.options && (
              <div className="mb-5">
                <label className="block text-base font-medium text-slate-700 mb-2">Your answer:</label>
                <textarea
                  value={transcript}
                  onChange={e => setTranscript(e.target.value)}
                  rows={3}
                  className="input-large resize-none"
                  placeholder="Type your answer here..."
                />
              </div>
            )}

            {selectedOption && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-700">Selected: <strong>{selectedOption}</strong></p>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button onClick={() => setInputMode('choose')} className="btn-secondary flex-1">
                Change Mode
              </button>
              <button
                onClick={() => submitAnswer(selectedOption || transcript)}
                disabled={!selectedOption && !transcript.trim()}
                className={`btn-primary flex-1 ${(!selectedOption && !transcript.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                id="btn-submit-answer"
              >
                <CheckCircle2 size={18} /> Submit Answer
              </button>
            </div>
          </div>
        )}

        {/* Conversation history mini-log */}
        {conversationHistory.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-400 mb-3">Recorded so far:</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {conversationHistory.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-500">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Q:</strong> {h.question} → <strong>A:</strong> {h.answer}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Emergency red-flag screen
function RedFlagScreen() {
  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center px-8 text-center">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 border-4 border-red-200">
        <AlertTriangle size={52} className="text-red-600" />
      </div>
      <h1 className="text-3xl font-bold text-red-800 mb-3">Please stay here</h1>
      <p className="text-xl text-red-700 mb-2 max-w-sm">
        Your symptoms may need immediate attention.
      </p>
      <p className="text-lg text-red-600 mb-8 max-w-md">
        A hospital staff member has been alerted. Please wait at this kiosk and do not leave.
      </p>
      <div className="p-6 bg-white border-2 border-red-200 rounded-2xl shadow-lg max-w-sm w-full">
        <p className="text-base text-slate-600 mb-4">
          You can also press the button below to call for help immediately:
        </p>
        <button className="btn-danger w-full text-xl py-5">
          <PhoneCall size={24} /> Call Staff Now
        </button>
      </div>
      <p className="mt-8 text-sm text-red-400 max-w-sm">
        MediKiosk does not make medical diagnoses. Please wait for a medical professional.
      </p>
    </div>
  );
}
