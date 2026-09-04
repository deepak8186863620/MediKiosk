/**
 * QuestionCard — displays a clinical question with optional tap-to-answer choices.
 * Supports both voice and touch modes.
 */
export default function QuestionCard({ question, options = null, onOptionSelect, selectedOption }) {
  return (
    <div className="w-full animate-fade-in">
      {/* AI question bubble */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-5 mb-6">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-2">MediKiosk asks</p>
        <p className="text-2xl font-semibold text-slate-800 leading-snug">{question}</p>
      </div>

      {/* Tap options */}
      {options && options.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => onOptionSelect?.(opt)}
              className={`card-interactive text-left text-lg font-medium py-4 px-5 ${
                selectedOption === opt ? 'selected' : ''
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
