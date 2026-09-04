import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import ProgressIndicator from '../../components/ProgressIndicator/ProgressIndicator';
import DocumentUploader from '../../components/DocumentUploader/DocumentUploader';

export default function DocumentUploadPage() {
  const navigate = useNavigate();
  const { documents, setDocuments } = useKiosk();

  function handleDocumentAdded(doc) {
    setDocuments(prev => [...prev, doc]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col">
      <header className="w-full px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-white/80">
        <button onClick={() => navigate('/conversation')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800">
          <ArrowLeft size={20} /> Back
        </button>
        <span className="text-lg font-semibold text-slate-700">Medical Papers</span>
        <div />
      </header>

      <main className="flex-1 px-8 py-8 max-w-xl mx-auto w-full">
        <ProgressIndicator currentStep="documents" />

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FileText size={28} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Do you have previous medical papers?
          </h1>
          <p className="text-base text-slate-500 max-w-sm mx-auto">
            You can share old prescriptions, lab reports or discharge summaries. This helps the doctor know your full history.
          </p>
        </div>

        <DocumentUploader
          documents={documents}
          onDocumentAdded={handleDocumentAdded}
        />

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => navigate('/review')}
            className="btn-secondary flex-1"
            id="btn-skip-documents"
          >
            {documents.length === 0 ? 'Skip — I have no papers' : 'Continue'}
          </button>
          {documents.length > 0 && (
            <button onClick={() => navigate('/review')} className="btn-primary flex-1" id="btn-docs-continue">
              <CheckCircle2 size={18} /> Done →
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
