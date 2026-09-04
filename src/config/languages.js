// MediKiosk Language Configuration
// Add more Indian languages here without changing application logic.

export const LANGUAGES = [
  { code: 'en',  name: 'English',   nativeName: 'English',       rtl: false, asrCode: 'en-IN',  ttsLang: 'en-IN', asrName: 'english'  },
  { code: 'hi',  name: 'Hindi',     nativeName: 'हिन्दी',          rtl: false, asrCode: 'hi-IN',  ttsLang: 'hi-IN', asrName: 'hindi'    },
  { code: 'te',  name: 'Telugu',    nativeName: 'తెలుగు',          rtl: false, asrCode: 'te-IN',  ttsLang: 'te-IN', asrName: 'telugu'   },
  { code: 'ta',  name: 'Tamil',     nativeName: 'தமிழ்',            rtl: false, asrCode: 'ta-IN',  ttsLang: 'ta-IN', asrName: 'tamil'    },
  { code: 'bn',  name: 'Bengali',   nativeName: 'বাংলা',             rtl: false, asrCode: 'bn-IN',  ttsLang: 'bn-IN', asrName: 'bengali'  },
  { code: 'mr',  name: 'Marathi',   nativeName: 'मराठी',             rtl: false, asrCode: 'mr-IN',  ttsLang: 'mr-IN', asrName: 'marathi'  },
  { code: 'as',  name: 'Assamese',  nativeName: 'অসমীয়া',          rtl: false, asrCode: 'as-IN',  ttsLang: 'as-IN', asrName: 'assamese' },
  { code: 'mni', name: 'Manipuri',  nativeName: 'মৈতৈলোন্',        rtl: false, asrCode: 'mni-IN', ttsLang: 'bn-IN', asrName: 'manipuri' },
];

export const DEFAULT_LANGUAGE = 'en';

export function getLanguageByCode(code) {
  return LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
}
