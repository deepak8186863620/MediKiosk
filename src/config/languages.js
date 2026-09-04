// MediKiosk Language Configuration
// Add more Indian languages here without changing application logic.

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false, asrCode: 'en-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false, asrCode: 'hi-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', rtl: false, asrCode: 'te-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', rtl: false, asrCode: 'ta-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', rtl: false, asrCode: 'bn-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', rtl: false, asrCode: 'mr-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', rtl: false, asrCode: 'as-IN' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', rtl: false, asrCode: 'mni-IN' },
];

export const DEFAULT_LANGUAGE = 'en';

export function getLanguageByCode(code) {
  return LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
}
