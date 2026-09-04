import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Mic, Hand, CheckCircle2, Loader2, ArrowRight, Heart
} from 'lucide-react';
import { demoTranscribe, demoGetNextQuestion, DEMO_CONVERSATION, DEMO_SUMMARY } from '../../services/demo';
import SummaryCard from '../../components/SummaryCard/SummaryCard';

const DEMO_STEPS = [
  'speak',      // Patient speaks
  'transcribe', // ASR transcription appears
  'question1',  // First AI question
  'answer1',    // Patient answers
  'question2',  // Second AI question
  'answer2',    // Patient answers
  'summary',    // Structured history shown
  'doctor',     // Doctor view
];

export default function DemoPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversationIndex, setConversationIndex] = useState(0);
  const [showDoctorView, setShowDoctorView] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  async function advance() {
    const current = DEMO_STEPS[step];

    if (current === 'speak') {
      setLoading(true);
      const result = await demoTranscribe();
      setTranscript(result.text);
      setLoading(false);
      setStep(s => s + 1);

    } else if (current === 'transcribe') {
      setLoading(true);
      const q = await demoGetNextQuestion(0);
      setCurrentQuestion(q);
      setLoading(false);
      setStep(s => s + 1);

    } else if (current === 'question1') {
      setStep(s => s + 1); // show answer selection

    } else if (current === 'answer1') {
      setLoading(true);
      const q = await demoGetNextQuestion(1);
      setCurrentQuestion(q);
      setConversationIndex(1);
      setLoading(false);
      setStep(s => s + 1);

    } else if (current === 'question2') {
      setStep(s => s + 1);

    } else if (current === 'answer2') {
      setStep(s => s + 1);

    } else if (current === 'summary') {
      setStep(s => s + 1);

    } else if (current === 'doctor') {
      navigate('/doctor');
    }
  }

  const currentStepName = DEMO_STEPS[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex flex-col">
      {/* Demo header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <Heart size={20} className="text-blue-400" />
          <span className="text-white font-bold text-lg">MediKiosk</span>
          <span className="badge badge-demo">⚠ Demo Mode</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-white/60 hover:text-white flex items-center gap-1.5 text-sm"
        >
          <X size={16} /> Exit Demo
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 py-10 max-w-2xl mx-auto w-full">

        {/* Demo explanation banner */}
        <div className="w-full bg-amber-500/10 border border-amber-400/20 rounded-xl px-5 py-3 mb-8 text-center">
          <p className="text-amber-300 text-sm font-medium">
            This is a simulation. No real AI backend is connected. Data shown is fictional.
          </p>
        </div>

        {/* Step: Patient speaks */}
        {currentStepName === 'speak' && (
          <StepCard title="1. Patient speaks at the kiosk">
            <div className="flex flex-col items-center gap-5 py-6">
              <div className="w-28 h-28 rounded-full bg-blue-500/20 border-2 border-blue-400/40 flex items-center justify-center">
                <Mic size={52} className="text-blue-400" />
              </div>
              <div className="text-center">
                <p className="text-white/80 text-lg mb-1">Patient says:</p>
                <p className="text-white text-2xl font-semibold italic">
                  "I have fever for three days and I feel very weak."
                </p>
              </div>
            </div>
          </StepCard>
        )}

        {/* Step: ASR transcript */}
        {currentStepName === 'transcribe' && (
          <StepCard title="2. AI4Bharat ASR — Transcription">
            <div className="py-4">
              <p className="text-white/60 text-sm mb-2">POST /api/asr/transcribe</p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 font-mono text-sm">
                <pre className="text-green-400 whitespace-pre-wrap">{JSON.stringify({ success: true, text: transcript }, null, 2)}</pre>
              </div>
              <p className="text-white/80 text-lg text-center">Transcript shown to patient:</p>
              <div className="bg-slate-700 rounded-xl p-5 mt-3 text-center">
                <p className="text-white text-xl italic">"{transcript}"</p>
              </div>
            </div>
          </StepCard>
        )}

        {/* Step: AI Question 1 */}
        {(currentStepName === 'question1' || currentStepName === 'answer1') && currentQuestion && (
          <StepCard title={`3. Gemini asks a follow-up question`}>
            <div className="py-3">
              <p className="text-white/60 text-sm mb-3">POST /api/clinical/answer → next question</p>
              <div className="bg-blue-600/20 border border-blue-400/30 rounded-xl p-5 mb-5">
                <p className="text-blue-200 text-xs font-semibold mb-2">MediKiosk asks:</p>
                <p className="text-white text-xl font-semibold">{currentQuestion.question}</p>
              </div>
              {currentStepName === 'answer1' && (
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {(currentQuestion.options || []).map((opt, i) => (
                    <button
                      key={opt}
                      className={`py-3 px-4 rounded-xl border text-base font-medium transition-all ${
                        i === 1
                          ? 'border-blue-400 bg-blue-500/20 text-white'
                          : 'border-white/20 text-white/60 hover:border-white/40'
                      }`}
                    >
                      {i === 1 && '✓ '}{opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </StepCard>
        )}

        {/* Step: AI Question 2 */}
        {(currentStepName === 'question2' || currentStepName === 'answer2') && currentQuestion && (
          <StepCard title="4. Next question based on answer">
            <div className="py-3">
              <div className="bg-blue-600/20 border border-blue-400/30 rounded-xl p-5 mb-5">
                <p className="text-blue-200 text-xs font-semibold mb-2">MediKiosk asks:</p>
                <p className="text-white text-xl font-semibold">{currentQuestion.question}</p>
              </div>
              {currentStepName === 'answer2' && (
                <div className="grid grid-cols-2 gap-3">
                  {(currentQuestion.options || []).map((opt, i) => (
                    <button
                      key={opt}
                      className={`py-3 px-4 rounded-xl border text-base font-medium transition-all ${
                        i === 0
                          ? 'border-emerald-400 bg-emerald-500/20 text-white'
                          : 'border-white/20 text-white/60'
                      }`}
                    >
                      {i === 0 && '✓ '}{opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </StepCard>
        )}

        {/* Step: Structured summary */}
        {currentStepName === 'summary' && (
          <StepCard title="5. Structured Clinical History — ready for doctor">
            <div className="py-3 space-y-3">
              <Field label="Chief Complaint" value={DEMO_SUMMARY.chief_complaint} />
              <Field label="Duration" value={DEMO_SUMMARY.history.duration} />
              <Field label="Present Illness" value={DEMO_SUMMARY.history.present_illness} />
              <Field label="Medicines" value={DEMO_SUMMARY.medications.join(', ')} />
              <Field label="Allergies" value={DEMO_SUMMARY.allergies} />
              <div className="mt-4 flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">No red flags detected in this session.</span>
              </div>
            </div>
          </StepCard>
        )}

        {/* Step: Doctor view */}
        {currentStepName === 'doctor' && (
          <StepCard title="6. Doctor reviews the structured history">
            <div className="py-4 text-center">
              <p className="text-white/80 text-lg mb-2">
                The doctor opens the MediKiosk doctor view and sees the complete structured history — without spending the first 5 minutes asking basic questions.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-5">
                {['Chief Complaint ✓', 'Duration ✓', 'Symptoms ✓', 'Medications ✓', 'Allergies ✓', 'AI Flags ✓'].map(item => (
                  <div key={item} className="bg-emerald-500/10 border border-emerald-400/20 rounded-lg py-2.5 px-4 text-emerald-300 text-sm font-medium text-center">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </StepCard>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 size={40} className="text-blue-400 animate-spin" />
            <p className="text-white/60 text-base">Simulating API call...</p>
          </div>
        )}

        {/* Navigation */}
        {!loading && (
          <div className="flex gap-4 mt-8 w-full">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="btn-secondary flex-1 text-white border-white/20 bg-white/10 hover:bg-white/20"
              >
                ← Previous
              </button>
            )}
            <button
              onClick={advance}
              className="btn-primary flex-1"
            >
              {currentStepName === 'doctor' ? 'Open Doctor View' : 'Next Step →'}
            </button>
          </div>
        )}

        {/* Step indicator */}
        <div className="flex gap-2 mt-6">
          {DEMO_STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step ? 'bg-blue-400 w-6' : i < step ? 'bg-emerald-500' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function StepCard({ title, children }) {
  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 animate-fade-in">
      <p className="text-blue-300 text-sm font-semibold uppercase tracking-wider mb-4">{title}</p>
      {children}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">{label}</p>
      <p className="text-white text-base">{value || '—'}</p>
    </div>
  );
}
