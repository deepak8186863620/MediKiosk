import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Pencil } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import ProgressIndicator from '../../components/ProgressIndicator/ProgressIndicator';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import { DEMO_SUMMARY } from '../../services/demo';

export default function ReviewPage() {
  const navigate = useNavigate();
  const {
    patientInfo, chiefComplaint, conversationHistory,
    documents, structuredHistory, isDemoMode,
  } = useKiosk();

  // Use demo summary or build summary from collected data
  const summary = structuredHistory || (isDemoMode ? DEMO_SUMMARY : null);

  // Build a simple history object from conversation history
  function buildHistory() {
    if (summary) return summary;
    const entries = conversationHistory.map(h => `${h.question} → ${h.answer}`).join('\n');
    return {
      chief_complaint: chiefComplaint || 'Not specified',
      history: {
        present_illness: entries || 'Recorded through conversation.',
        duration: '',
        associated_symptoms: [],
      },
      medications: [],
      allergies: '',
      family_history: '',
    };
  }

  const data = buildHistory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col">
      <header className="w-full px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-white/80">
        <button onClick={() => navigate('/documents')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800">
          <ArrowLeft size={20} /> Back
        </button>
        <span className="text-lg font-semibold text-slate-700">Review Your Information</span>
        <div />
      </header>

      <main className="flex-1 px-8 py-8 max-w-xl mx-auto w-full">
        <ProgressIndicator currentStep="review" />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Health Information</h1>
          <p className="text-base text-slate-500">
            Please check if everything looks correct. You can edit any section.
          </p>
          {isDemoMode && (
            <span className="badge badge-demo mt-3 inline-flex">⚠ Demo data — not from real AI backend</span>
          )}
        </div>

        {/* Patient info summary */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-700">Patient</h3>
            <button onClick={() => navigate('/patient-info')} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              <Pencil size={13} /> Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-y-2 text-base text-slate-700">
            <div><span className="text-slate-400">Name</span><br /><strong>{patientInfo.name || '—'}</strong></div>
            <div><span className="text-slate-400">Age</span><br /><strong>{patientInfo.age || '—'}</strong></div>
            <div><span className="text-slate-400">Gender</span><br /><strong>{patientInfo.gender || '—'}</strong></div>
            <div><span className="text-slate-400">Type</span><br /><strong>{patientInfo.patient_type === 'new' ? 'New Patient' : 'Returning'}</strong></div>
          </div>
        </div>

        <SummaryCard
          title="Main Problem"
          icon="🩺"
          content={data.chief_complaint}
          onEdit={() => navigate('/chief-complaint')}
        />

        <SummaryCard
          title="History of Present Illness"
          icon="📋"
          content={typeof data.history === 'object' ? data.history.present_illness : data.history}
          onEdit={() => navigate('/conversation')}
        />

        {data.history?.associated_symptoms?.length > 0 && (
          <SummaryCard
            title="Associated Symptoms"
            icon="🔍"
            content={data.history.associated_symptoms}
            onEdit={() => navigate('/conversation')}
          />
        )}

        <SummaryCard
          title="Medicines"
          icon="💊"
          content={Array.isArray(data.medications) ? data.medications : data.medications || ''}
          emptyMessage="No medicines reported"
        />

        <SummaryCard
          title="Allergies"
          icon="⚠️"
          content={data.allergies}
          emptyMessage="No known allergies reported"
        />

        {documents.length > 0 && (
          <div className="card mb-4">
            <h3 className="font-semibold text-slate-700 mb-2">Documents Uploaded</h3>
            <div className="space-y-1">
              {documents.map(d => (
                <div key={d.id} className="flex items-center gap-2 text-base text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  {d.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conversation log preview */}
        {conversationHistory.length > 0 && (
          <details className="mb-4">
            <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:underline mb-2">
              View full conversation ({conversationHistory.length} answers)
            </summary>
            <div className="card mt-2 space-y-3">
              {conversationHistory.map((h, i) => (
                <div key={i} className="text-sm text-slate-600 pb-2 border-b border-slate-100 last:border-0">
                  <p className="font-medium text-slate-700">{h.question}</p>
                  <p className="text-slate-500 mt-0.5">→ {h.answer}</p>
                </div>
              ))}
            </div>
          </details>
        )}

        <div className="flex gap-4 mt-6">
          <button onClick={() => navigate('/documents')} className="btn-secondary flex-1">
            Add More
          </button>
          <button onClick={() => navigate('/complete')} className="btn-primary flex-1" id="btn-review-confirm">
            <CheckCircle2 size={18} /> Looks Correct →
          </button>
        </div>
      </main>
    </div>
  );
}
