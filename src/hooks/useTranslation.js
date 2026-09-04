/**
 * useTranslation — Multilingual translation hook for MediKiosk
 * Returns a t(key) function scoped to the current KioskContext language.
 * Falls back to English if a translation is missing.
 */
import { useCallback } from 'react';
import { useKiosk } from '../context/KioskContext';
import { dictionary } from '../translations/dictionary';

export function useTranslation() {
  const { language } = useKiosk();

  const t = useCallback((key, fallback) => {
    const langDict = dictionary[language] || dictionary['en'];
    const enDict   = dictionary['en'];
    return langDict?.[key] ?? enDict?.[key] ?? fallback ?? key;
  }, [language]);

  return { t, language };
}

export default useTranslation;
