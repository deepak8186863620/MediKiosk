import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Heart, RotateCcw } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import ProgressIndicator from '../../components/ProgressIndicator/ProgressIndicator';

export default function CompletePage() {
  const navigate = useNavigate();
  const { patientInfo, resetSession } = useKiosk();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex flex-col">
      <header className="w-full px-8 py-5 flex items-center justify-center border-b border-slate-100 bg-white/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Heart size={18} className="text-white" fill="white" />
          </div>
          <span className="text-lg font-bold text-slate-800">MediKiosk</span>
        </div>
      </header>

      <main className="flex-1 px-8 py-12 max-w-lg mx-auto w-full flex flex-col items-center text-center">
        <ProgressIndicator currentStep="complete" />

        {/* Success animation */}
        <div className="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-emerald-200 mb-8">
          <CheckCircle2 size={64} className="text-emerald-500" />
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          Your information is ready!
        </h1>
        {patientInfo.name && (
          <p className="text-xl text-slate-600 mb-6">Thank you, {patientInfo.name}.</p>
        )}

        {/* Summary checklist */}
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 mb-8 text-left shadow-sm">
          <p className="font-semibold text-slate-700 mb-4">What we have prepared:</p>
          <div className="space-y-3">
            {[
              'Health history recorded',
              'Summary prepared for doctor',
              'Information kept private',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 size={22} className="text-emerald-500 flex-shrink-0" />
                <p className="text-base text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor message */}
        <div className="w-full bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
          <p className="text-lg text-blue-800 font-medium mb-1">
            Your doctor will review this information.
          </p>
          <p className="text-base text-blue-600">
            Please wait to be called for your consultation.
          </p>
        </div>

        {/* Important disclaimer */}
        <div className="w-full p-4 bg-amber-50 border border-amber-200 rounded-xl mb-8">
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Important:</strong> MediKiosk does not make the final medical decision. Your doctor will carefully review your information before providing any advice or treatment.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => navigate('/review')}
            className="btn-secondary w-full"
          >
            Review My Information Again
          </button>
          <button
            onClick={() => { resetSession(); navigate('/'); }}
            className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 text-base"
          >
            <RotateCcw size={16} /> Start a New Session
          </button>
        </div>
      </main>
    </div>
  );
}
