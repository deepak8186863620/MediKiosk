import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle2, X, Save, Pencil,
  User, Heart, FileText, ChevronRight, ArrowLeft,
  ClipboardList, Stethoscope
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import { DEMO_SUMMARY } from '../../services/demo';

const SECTION_COLORS = {
  confirmed: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  pending: 'bg-amber-50 border-amber-200 text-amber-800',
  rejected: 'bg-red-50 border-red-200 text-red-800',
};

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { patientInfo, structuredHistory, documents, conversationHistory, isDemoMode } = useKiosk();
  const [status, setStatus] = useState('pending'); // pending | confirmed | rejected
  const [editMode, setEditMode] = useState(false);
  const [notes, setNotes] = useState('');

  // Use demo summary if no real data
  const summary = structuredHistory || DEMO_SUMMARY;
  const patient = patientInfo?.name ? patientInfo : DEMO_SUMMARY.patient;

  function handleAction(action) {
    setStatus(action);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Doctor header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-slate-600 mr-1"
            title="Back to kiosk"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <Stethoscope size={18} className="text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-800">MediKiosk</span>
            <span className="ml-2 text-sm text-slate-400">Doctor View</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isDemoMode && <span className="badge badge-demo">⚠ Demo</span>}
          {/* Status indicator */}
          <span className={`badge ${
            status === 'confirmed' ? 'badge-success' :
            status === 'rejected' ? 'badge-danger' : 'badge-info'
          }`}>
            {status === 'confirmed' ? '✓ Confirmed' :
             status === 'rejected' ? '✗ Rejected' : '⏳ Pending Review'}
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* AI Draft banner */}
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm font-semibold text-amber-800">
            AI-generated draft — Physician verification required before use in clinical decisions.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main content — 2/3 */}
          <div className="col-span-2 space-y-4">

            {/* Patient header card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={28} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-slate-900">{patient.name || 'Patient'}</h1>
                  <div className="flex flex-wrap gap-4 mt-1 text-base text-slate-500">
                    <span>{patient.age ? `${patient.age} years` : '—'}</span>
                    <span>·</span>
                    <span>{patient.gender || '—'}</span>
                    <span>·</span>
                    <span>{patient.patient_type === 'new' ? 'New Patient' : 'Returning Patient'}</span>
                  </div>
                  {patient.phone && (
                    <p className="text-sm text-slate-400 mt-1">📞 {patient.phone}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Visit date</p>
                  <p className="text-sm font-medium text-slate-700">
                    {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Clinical history sections */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <ClipboardList size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800">Clinical History</h2>
              </div>

              <Section title="Chief Complaint" content={summary.chief_complaint} />
              <Section title="History of Present Illness"
                content={typeof summary.history === 'object' ? summary.history.present_illness : summary.history}
              />
              <Section title="Past Medical History" content={summary.past_medical_history} />
              <Section title="Medication History"
                content={Array.isArray(summary.medications) ? summary.medications.join(', ') : summary.medications}
              />
              <Section title="Allergy History" content={summary.allergies} />
              <Section title="Family History" content={summary.family_history} />
              <Section title="Personal History" content={summary.personal_history} />
              <Section title="Review of Systems" content={summary.review_of_systems} />
            </div>

            {/* Doctor notes */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-3">Physician Notes</h2>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add your clinical notes, impressions, or corrections here..."
                rows={5}
                className="input-large resize-none"
              />
            </div>

            {/* Documents */}
            {documents.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Previous Documents</h2>
                <div className="space-y-3">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border">
                      <FileText size={20} className="text-slate-400" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-700">{doc.name}</p>
                        <p className="text-sm text-slate-400">{doc.type} · {(doc.size / 1024).toFixed(0)} KB</p>
                      </div>
                      {doc.preview && (
                        <img src={doc.preview} alt="" className="w-12 h-12 object-cover rounded-lg" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — 1/3 */}
          <div className="space-y-4">
            {/* Action buttons */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-base font-bold text-slate-700 mb-4">Review Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleAction('confirmed')}
                  className={`w-full flex items-center gap-2 py-3.5 px-4 rounded-xl border-2 font-semibold text-base transition-all
                    ${status === 'confirmed'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 hover:border-emerald-300 text-slate-700'
                    }`}
                  id="btn-confirm"
                >
                  <CheckCircle2 size={20} /> Confirm
                </button>
                <button
                  onClick={() => handleAction('rejected')}
                  className={`w-full flex items-center gap-2 py-3.5 px-4 rounded-xl border-2 font-semibold text-base transition-all
                    ${status === 'rejected'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-slate-200 hover:border-red-300 text-slate-700'
                    }`}
                  id="btn-reject"
                >
                  <X size={20} /> Reject
                </button>
                <button
                  onClick={() => setEditMode(v => !v)}
                  className="w-full flex items-center gap-2 py-3.5 px-4 rounded-xl border-2 border-slate-200 hover:border-blue-300 font-semibold text-base text-slate-700 transition-all"
                  id="btn-edit"
                >
                  <Pencil size={18} /> Edit
                </button>
                <button
                  className="w-full flex items-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-colors"
                  id="btn-save"
                >
                  <Save size={18} /> Save
                </button>
              </div>
            </div>

            {/* AI Flags */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" /> AI Flags
              </h3>
              {(summary.ai_flags || []).length === 0 ? (
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 size={16} />
                  <span className="text-sm">No red flags detected</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {summary.ai_flags.map((flag, i) => (
                    <div key={i} className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                      {flag}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Conversation turns */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-base font-bold text-slate-700 mb-3">Conversation Log</h3>
              {conversationHistory.length === 0 ? (
                <p className="text-sm text-slate-400">Demo session — no live conversation recorded.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {conversationHistory.map((h, i) => (
                    <div key={i} className="text-xs border-b border-slate-100 pb-2 last:border-0">
                      <p className="font-medium text-slate-600">{h.question}</p>
                      <p className="text-slate-400 mt-0.5">→ {h.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AYUSH coming soon */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-5">
              <h3 className="text-base font-bold text-emerald-800 mb-1">🌿 AYUSH Mode</h3>
              <p className="text-sm text-emerald-700 mb-3">
                Prakriti, Vikriti, Agni and traditional history sections coming soon.
              </p>
              <button
                onClick={() => navigate('/ayush')}
                className="flex items-center gap-1 text-emerald-700 text-sm font-medium hover:underline"
              >
                Preview <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, content }) {
  const empty = !content || content === '';
  return (
    <div className="mb-4 pb-4 border-b border-slate-100 last:border-0 last:mb-0 last:pb-0">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <p className={`text-base leading-relaxed ${empty ? 'text-slate-300 italic' : 'text-slate-700'}`}>
        {empty ? 'Not reported' : content}
      </p>
    </div>
  );
}
