import { useState, useRef } from 'react';
import { Upload, Camera, X, FileText, FlaskConical, HospitalIcon, Files, CheckCircle2 } from 'lucide-react';

const DOC_TYPES = [
  { id: 'prescription', label: 'Prescription', icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'lab_report', label: 'Lab Report', icon: FlaskConical, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'discharge_summary', label: 'Discharge Summary', icon: Files, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'other', label: 'Other Document', icon: Files, color: 'text-slate-600 bg-slate-50 border-slate-200' },
];

/**
 * DocumentUploader — handles medical document upload/capture.
 * OCR integration is marked COMING SOON — no fake results shown.
 */
export default function DocumentUploader({ onDocumentAdded, documents = [] }) {
  const [selectedType, setSelectedType] = useState(null);
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file || !selectedType) return;

    const doc = {
      id: Date.now(),
      file,
      name: file.name,
      type: selectedType,
      size: file.size,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      uploadedAt: new Date().toISOString(),
    };

    onDocumentAdded?.(doc);
    setSelectedType(null);
    e.target.value = '';
  }

  return (
    <div className="space-y-6">
      {/* Document type selection */}
      <div>
        <p className="text-lg font-medium text-slate-700 mb-3">What type of document do you have?</p>
        <div className="grid grid-cols-2 gap-3">
          {DOC_TYPES.map(dt => {
            const Icon = dt.icon;
            return (
              <button
                key={dt.id}
                onClick={() => setSelectedType(dt.id)}
                className={`card-interactive flex flex-col items-center gap-3 py-5 ${
                  selectedType === dt.id ? 'selected' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${dt.color}`}>
                  <Icon size={24} />
                </div>
                <span className="text-base font-medium text-slate-700 text-center">{dt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload actions */}
      {selectedType && (
        <div className="animate-fade-in">
          <p className="text-base text-slate-500 mb-3 text-center">
            Selected: <strong className="text-slate-700">{DOC_TYPES.find(d => d.id === selectedType)?.label}</strong>
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 btn-primary"
            >
              <Upload size={20} /> Upload Document
            </button>
            <button
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.capture = 'environment';
                  fileInputRef.current.click();
                }
              }}
              className="flex-1 btn-secondary"
            >
              <Camera size={20} /> Take Photo
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Coming soon notice */}
          <div className="mt-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <strong>Coming soon:</strong> Automatic reading of document contents (OCR) will be available in a future update.
          </div>
        </div>
      )}

      {/* Uploaded documents list */}
      {documents.length > 0 && (
        <div>
          <p className="text-base font-semibold text-slate-700 mb-3">Uploaded Documents</p>
          <div className="space-y-3">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle2 size={22} className="text-emerald-600 flex-shrink-0" />
                {doc.preview ? (
                  <img src={doc.preview} alt="Preview" className="w-12 h-12 object-cover rounded-lg border" />
                ) : (
                  <div className="w-12 h-12 bg-slate-100 rounded-lg border flex items-center justify-center">
                    <FileText size={20} className="text-slate-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{doc.name}</p>
                  <p className="text-sm text-slate-500">
                    {DOC_TYPES.find(d => d.id === doc.type)?.label} · {(doc.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
