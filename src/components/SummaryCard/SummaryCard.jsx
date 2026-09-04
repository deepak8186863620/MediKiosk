import { Pencil } from 'lucide-react';

/**
 * SummaryCard — shows a section of the structured patient history.
 * Used on the Review screen and Doctor Dashboard.
 */
export default function SummaryCard({ title, icon, content, onEdit, emptyMessage = 'Not reported' }) {
  const isEmpty = !content || content === '' || (Array.isArray(content) && content.length === 0);

  return (
    <div className="card mb-4">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          <h3 className="text-base font-semibold text-slate-700">{title}</h3>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium shrink-0"
          >
            <Pencil size={14} /> Edit
          </button>
        )}
      </div>

      {isEmpty ? (
        <p className="text-slate-400 italic text-base">{emptyMessage}</p>
      ) : Array.isArray(content) ? (
        <ul className="list-disc list-inside space-y-1">
          {content.map((item, i) => (
            <li key={i} className="text-base text-slate-700">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-base text-slate-700 leading-relaxed">{content}</p>
      )}
    </div>
  );
}
