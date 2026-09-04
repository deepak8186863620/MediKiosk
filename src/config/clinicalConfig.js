// MediKiosk Clinical Configuration
// Defines symptom categories, question flows, and department schemas.
// Different departments (Allopathy, AYUSH, Paediatrics) can have different configs.

export const SYMPTOM_CATEGORIES = [
  { id: 'fever', label: 'Fever', icon: '🌡️', color: 'bg-orange-50 border-orange-200 text-orange-800' },
  { id: 'pain', label: 'Pain', icon: '😣', color: 'bg-red-50 border-red-200 text-red-800' },
  { id: 'cough', label: 'Cough', icon: '🫁', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { id: 'breathing', label: 'Breathing Problem', icon: '💨', color: 'bg-sky-50 border-sky-200 text-sky-800' },
  { id: 'stomach', label: 'Stomach Problem', icon: '🤢', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  { id: 'headache', label: 'Headache', icon: '🤕', color: 'bg-purple-50 border-purple-200 text-purple-800' },
  { id: 'weakness', label: 'Weakness', icon: '😴', color: 'bg-slate-50 border-slate-200 text-slate-800' },
  { id: 'skin', label: 'Skin Problem', icon: '🩺', color: 'bg-pink-50 border-pink-200 text-pink-800' },
  { id: 'other', label: 'Other', icon: '➕', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
];

export const DURATION_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: '1-3d', label: '1–3 days' },
  { id: '4-7d', label: '4–7 days' },
  { id: '1w+', label: 'More than a week' },
  { id: 'unknown', label: "I don't know" },
];

export const HISTORY_SECTIONS = [
  { id: 'chief_complaint', label: 'Chief Complaint', icon: '🩺' },
  { id: 'present_illness', label: 'Present Illness', icon: '📋' },
  { id: 'past_history', label: 'Past Medical History', icon: '📁' },
  { id: 'medications', label: 'Medicines', icon: '💊' },
  { id: 'allergies', label: 'Allergies', icon: '⚠️' },
  { id: 'family_history', label: 'Family History', icon: '👨‍👩‍👧' },
  { id: 'personal_history', label: 'Personal History', icon: '👤' },
  { id: 'review_of_systems', label: 'Review of Systems', icon: '🔍' },
];

// Progress steps for the patient flow
export const FLOW_STEPS = [
  { id: 'welcome', label: 'Welcome', path: '/' },
  { id: 'language', label: 'Language', path: '/language' },
  { id: 'consent', label: 'Consent', path: '/consent' },
  { id: 'patient-info', label: 'Your Information', path: '/patient-info' },
  { id: 'chief-complaint', label: 'Your Problem', path: '/chief-complaint' },
  { id: 'conversation', label: 'Health Questions', path: '/conversation' },
  { id: 'documents', label: 'Medical Papers', path: '/documents' },
  { id: 'review', label: 'Review', path: '/review' },
  { id: 'complete', label: 'Done', path: '/complete' },
];

// Department schemas — extensible for AYUSH, Paediatrics, etc.
export const DEPARTMENTS = {
  allopathy: {
    id: 'allopathy',
    label: 'General Medicine',
    sections: HISTORY_SECTIONS,
  },
  ayush: {
    id: 'ayush',
    label: 'AYUSH',
    sections: [
      { id: 'prakriti', label: 'Prakriti', icon: '🌿' },
      { id: 'vikriti', label: 'Vikriti', icon: '🌀' },
      { id: 'agni', label: 'Agni (Digestive Fire)', icon: '🔥' },
      { id: 'koshtha', label: 'Koshtha', icon: '🌾' },
      { id: 'ahara', label: 'Ahara (Diet)', icon: '🍽️' },
      { id: 'vihara', label: 'Vihara (Lifestyle)', icon: '🧘' },
      { id: 'dashavidha', label: 'Dashavidha Pariksha', icon: '📊' },
    ],
  },
};
