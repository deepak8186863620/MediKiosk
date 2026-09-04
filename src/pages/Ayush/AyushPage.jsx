import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';
import { DEPARTMENTS } from '../../config/clinicalConfig';

export default function AyushPage() {
  const navigate = useNavigate();
  const ayush = DEPARTMENTS.ayush;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col">
      <header className="w-full px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-white/80">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-2">
          <Leaf size={20} className="text-emerald-600" />
          <span className="text-lg font-semibold text-slate-700">AYUSH Mode</span>
        </div>
        <div />
      </header>

      <main className="flex-1 px-8 py-10 max-w-xl mx-auto w-full">
        {/* Coming soon banner */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8 text-center">
          <span className="text-4xl mb-3 block">🌿</span>
          <h1 className="text-2xl font-bold text-emerald-900 mb-2">AYUSH Mode</h1>
          <p className="text-emerald-700 text-base">
            Traditional medicine history collection — coming soon.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-800 text-sm font-semibold">
            🚧 Prototype Placeholder
          </div>
        </div>

        <p className="text-base text-slate-600 mb-6 leading-relaxed text-center">
          The AYUSH module will collect traditional medicine history including Prakriti assessment, dietary habits, and lifestyle factors — separate from the standard allopathic workflow.
        </p>

        {/* Section previews */}
        <div className="grid grid-cols-1 gap-3">
          {ayush.sections.map(section => (
            <div
              key={section.id}
              className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl"
            >
              <span className="text-2xl w-10 text-center">{section.icon}</span>
              <div>
                <p className="font-semibold text-slate-800">{section.label}</p>
                <p className="text-sm text-slate-400">Coming soon</p>
              </div>
              <div className="ml-auto">
                <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">Soon</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500">
          <strong>Architecture note:</strong> AYUSH questions are completely separate from the allopathic question flow. The <code>clinicalConfig.js</code> department schema makes it easy to add new question flows without modifying the core application.
        </div>

        <button onClick={() => navigate(-1)} className="btn-secondary w-full mt-6">
          Go Back
        </button>
      </main>
    </div>
  );
}
