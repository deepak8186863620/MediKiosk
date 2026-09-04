import { useKiosk } from '../context/KioskContext';
import { dictionary } from '../translations/dictionary';

export function useTranslation() {
  const { language } = useKiosk(); // e.g., 'en', 'hi'

  const t = (key) => {
    // Fallback to english if the language or key is missing
    const langDict = dictionary[language] || dictionary['en'];
    return langDict[key] || dictionary['en'][key] || key;
  };

  return { t, language };
}
