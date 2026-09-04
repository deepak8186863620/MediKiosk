import { createContext, useContext, useState } from 'react';
import { DEFAULT_LANGUAGE } from '../config/languages';

const KioskContext = createContext(null);

export function KioskProvider({ children }) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [consent, setConsent] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    abha_id: '',
    patient_type: 'new',
  });
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [structuredHistory, setStructuredHistory] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(
    import.meta.env.VITE_DEMO_MODE === 'true'
  );
  const [redFlag, setRedFlag] = useState(false);

  function addConversationEntry(entry) {
    setConversationHistory(prev => [...prev, entry]);
  }

  function resetSession() {
    setConsent(false);
    setPatientInfo({ name: '', age: '', gender: '', phone: '', abha_id: '', patient_type: 'new' });
    setChiefComplaint('');
    setSessionId(null);
    setConversationHistory([]);
    setStructuredHistory(null);
    setDocuments([]);
    setRedFlag(false);
  }

  return (
    <KioskContext.Provider value={{
      language, setLanguage,
      consent, setConsent,
      patientInfo, setPatientInfo,
      chiefComplaint, setChiefComplaint,
      sessionId, setSessionId,
      conversationHistory, addConversationEntry,
      structuredHistory, setStructuredHistory,
      documents, setDocuments,
      isDemoMode, setIsDemoMode,
      redFlag, setRedFlag,
      resetSession,
    }}>
      {children}
    </KioskContext.Provider>
  );
}

export function useKiosk() {
  const ctx = useContext(KioskContext);
  if (!ctx) throw new Error('useKiosk must be used within KioskProvider');
  return ctx;
}
