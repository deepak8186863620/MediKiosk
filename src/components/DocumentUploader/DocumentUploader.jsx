import { useState, useRef } from 'react';
import { Upload, Camera, X, FileText, FlaskConical, HospitalIcon, Files, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { uploadMedicalDocument } from '../../services/api';
import { useKiosk } from '../../context/KioskContext';

const DOC_TYPES = [
  { id: 'prescription', label: 'Prescription', icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'lab_report', label: 'Lab Report', icon: FlaskConical, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'discharge_summary', label: 'Discharge Summary', icon: Files, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'other', label: 'Other Document', icon: Files, color: 'text-slate-600 bg-slate-50 border-slate-200' },
];

/**
 * DocumentUploader — handles medical document upload/capture and OCR extraction.
 */
export default function DocumentUploader({ onDocumentAdded, documents = [] }) {
  const { sessionId } = useKiosk();
  const [selectedType, setSelectedType] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file || !selectedType) return;

    setError(null);
    setIsExtracting(true);

    try {
      // 1. Upload and process OCR via backend
      const result = await uploadMedicalDocument(file, selectedType, sessionId || 'demo-session');
      
      if (!result.success) {
        throw new Error(result.error || "Extraction failed");
      }

      // 2. Add to local state
      const doc = {
        id: result.document_id || Date.now(),
        file,
        name: file.name,
        type: selectedType,
        size: file.size,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        uploadedAt: new Date().toISOString(),
        extracted: result.extracted || null,
      };

      onDocumentAdded?.(doc);
      setSelectedType(null);
    } catch (err) {
      setError("Could not read document. Please try a clearer photo.");
      console.error(err);
    } finally {
      setIsExtracting(false);
      e.target.value = '';
    }
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
                disabled={isExtracting}
                className={`card-interactive flex flex-col items-center gap-3 py-5 ${
                  selectedType === dt.id ? 'selected' : ''
                } ${isExtracting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
      {selectedType && !isExtracting && (
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
        </div>
      )}
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Loading state */}
      {isExtracting && (
        <div className="p-8 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col items-center justify-center text-center animate-fade-in">
          <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
          <h3 className="text-lg font-bold text-blue-900 mb-2">Reading Document...</h3>
          <p className="text-blue-700">MediKiosk AI is extracting clinical data.</p>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-fade-in">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Uploaded documents list */}
      {documents.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-lg font-bold text-slate-800 mb-4">Digitized Documents</p>
          <div className="space-y-4">
            {documents.map(doc => (
              <div key={doc.id} className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 p-4 bg-slate-50 border-b border-slate-100">
                  <CheckCircle2 size={22} className="text-emerald-600 flex-shrink-0" />
                  {doc.preview ? (
                    <img src={doc.preview} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                  ) : (
                    <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                      <FileText size={20} className="text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{doc.name}</p>
                    <p className="text-sm text-slate-500">
                      {DOC_TYPES.find(d => d.id === doc.type)?.label} · {(doc.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                
                {/* Extracted Data Display */}
                {doc.extracted && doc.extracted.summary !== "Extraction failed." && (
                  <div className="p-4 bg-blue-50/50 space-y-3">
                    {doc.extracted.diagnoses?.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Diagnoses Found</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {doc.extracted.diagnoses.map((d, i) => (
                            <span key={i} className="px-2 py-1 bg-white border border-blue-200 text-slate-700 text-sm rounded-md shadow-sm">{d}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {doc.extracted.medications?.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Medications Found</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {doc.extracted.medications.map((m, i) => (
                            <span key={i} className="px-2 py-1 bg-white border border-emerald-200 text-slate-700 text-sm rounded-md shadow-sm">{m}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {doc.extracted.lab_values?.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Lab Results</span>
                        <div className="mt-1 space-y-1">
                          {doc.extracted.lab_values.map((l, i) => (
                            <div key={i} className={`flex justify-between items-center p-2 rounded-lg text-sm border ${l.abnormal ? 'bg-red-50 border-red-200 text-red-800' : 'bg-white border-slate-200 text-slate-700'}`}>
                              <span className="font-medium">{l.test}</span>
                              <span className="font-mono">{l.value} {l.unit} {l.abnormal && <AlertCircle size={14} className="inline ml-1" />}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
