import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { KioskProvider } from './context/KioskContext';
import Navbar from './components/Navbar/Navbar';

// Pages
import WelcomePage from './pages/Welcome/WelcomePage';
import LanguagePage from './pages/Language/LanguagePage';
import ConsentPage from './pages/Consent/ConsentPage';
import PatientInfoPage from './pages/PatientInfo/PatientInfoPage';
import ChiefComplaintPage from './pages/ChiefComplaint/ChiefComplaintPage';
import ConversationPage from './pages/Conversation/ConversationPage';
import DocumentUploadPage from './pages/DocumentUpload/DocumentUploadPage';
import ReviewPage from './pages/Review/ReviewPage';
import CompletePage from './pages/Complete/CompletePage';
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard';
import DemoPage from './pages/Demo/DemoPage';
import AyushPage from './pages/Ayush/AyushPage';

export default function App() {
  return (
    <KioskProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1 flex flex-col">
            <Routes>
          {/* Patient flow */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/language" element={<LanguagePage />} />
          <Route path="/consent" element={<ConsentPage />} />
          <Route path="/patient-info" element={<PatientInfoPage />} />
          <Route path="/chief-complaint" element={<ChiefComplaintPage />} />
          <Route path="/conversation" element={<ConversationPage />} />
          <Route path="/documents" element={<DocumentUploadPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/complete" element={<CompletePage />} />

          {/* Special routes */}
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/ayush" element={<AyushPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
          </div>
        </div>
      </BrowserRouter>
    </KioskProvider>
  );
}
