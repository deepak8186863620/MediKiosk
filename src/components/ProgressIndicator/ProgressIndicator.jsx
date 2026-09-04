import { FLOW_STEPS } from '../../config/clinicalConfig';
import { CheckCircle2, Circle } from 'lucide-react';

/**
 * Progress indicator shown at the top of all patient flow screens.
 */
export default function ProgressIndicator({ currentStep }) {
  const currentIndex = FLOW_STEPS.findIndex(s => s.id === currentStep);

  // Only show steps from consent onward (skip welcome + language)
  const visibleSteps = FLOW_STEPS.slice(2);
  const visibleIndex = visibleSteps.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between gap-1">
        {visibleSteps.map((step, i) => {
          const done = i < visibleIndex;
          const active = i === visibleIndex;
          return (
            <div key={step.id} className="flex items-center gap-1 flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                {done ? (
                  <CheckCircle2 size={22} className="text-emerald-500" />
                ) : active ? (
                  <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-blue-200 ring-2 ring-blue-100" />
                ) : (
                  <Circle size={20} className="text-slate-300" />
                )}
                <span
                  className={`text-xs font-medium leading-tight text-center max-w-[60px] truncate ${
                    active ? 'text-blue-700' : done ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < visibleSteps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mb-4 rounded-full transition-colors ${
                    i < visibleIndex ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {visibleIndex >= 0 && (
        <p className="text-sm text-slate-500 text-center mt-2">
          Step {visibleIndex + 1} of {visibleSteps.length}
        </p>
      )}
    </div>
  );
}
