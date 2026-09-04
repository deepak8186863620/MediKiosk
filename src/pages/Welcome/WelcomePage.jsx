import { useNavigate } from 'react-router-dom';
import { HeartPulse, HelpCircle, Shield, Globe, FileText, ArrowRight, Activity } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { useTTS } from '../../hooks/useTTS';
import { useEffect } from 'react';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { speak, isSupported } = useTTS('en');

  useEffect(() => {
    // Auto-greet the patient on kiosk startup
    const timer = setTimeout(() => {
      speak("Welcome to MediKiosk. Please tap Start Registration to begin.", "en");
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak]);

  return (
    <div className="page-bg min-h-screen flex flex-col bg-slate-50">
      
      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center">
        
        {/* Hero Wrapper */}
        <div className="w-full flex flex-col lg:flex-row max-w-7xl mx-auto">
          {/* Left Content */}
          <section className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold tracking-wide uppercase mb-8 w-max">
               <FileText size={16} /> Fast-Track Registration
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Skip the queue.<br/>
              <span className="text-[var(--forest-700)]">Tell the doctor your symptoms now.</span>
            </h2>
            
            <p className="text-xl text-gray-500 font-medium mb-10 max-w-lg leading-relaxed">
              Use this kiosk to record your medical history in your native language before entering the doctor's cabin.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 mb-10">
              <button
                onClick={() => navigate('/language')}
                className="btn-primary text-xl px-10 py-5 rounded-xl shadow-lg shadow-[var(--forest-500)]/20 flex items-center justify-center gap-3 w-full sm:w-auto transform hover:-translate-y-1 transition-all"
                id="btn-start"
              >
                Start Registration <ArrowRight size={24} />
              </button>
            </div>
            
            <div className="flex items-center gap-3 text-gray-500 text-sm font-medium bg-gray-50 p-4 rounded-lg border border-gray-100 max-w-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <Shield size={20} className="text-green-700" />
              </div>
              <p>Your medical data is encrypted and securely sent directly to your assigned doctor's terminal.</p>
            </div>
          </section>
          
          {/* Right Image Grid */}
          <section className="flex-1 bg-gray-50 p-6 md:p-12 lg:p-16 flex flex-col justify-center border-l border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
              
              {/* Main Image */}
              <div className="md:col-span-2 relative group rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                <img 
                  src="/images/opd_waiting_room.png" 
                  alt="Hospital OPD Waiting Room" 
                  className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-white font-bold text-lg">Designed for high-volume Indian OPDs</p>
                </div>
              </div>

              {/* Feature Image 1 */}
              <div className="relative group rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                <img 
                  src="/images/elderly_patient_kiosk.png" 
                  alt="Patient using kiosk" 
                  className="w-full h-[200px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-semibold text-sm">Voice & Touch enabled for all ages</p>
                </div>
              </div>

              {/* Feature Image 2 */}
              <div className="relative group rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                <img 
                  src="/images/doctor_reviewing_data.png" 
                  alt="Doctor reviewing data" 
                  className="w-full h-[200px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-semibold text-sm">Empowering doctors with structured data</p>
                </div>
              </div>

            </div>
          </section>
        </div>

        {/* The Problem & Our Solution Section */}
        <section className="w-full mt-16 border-t border-[var(--border-light)] pt-16 pb-12 bg-white px-6 md:px-12 lg:px-24 rounded-3xl shadow-sm border border-gray-100">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">
            
            {/* The Problem */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[var(--forest-900)] mb-6 flex items-center gap-3">
                <span className="bg-red-100 text-red-600 p-2 rounded-lg">
                  <Activity size={24} />
                </span>
                The Crisis in Indian OPDs
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold text-gray-400">1</div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-1">Overwhelming Patient Load</h4>
                    <p className="text-gray-600">In government hospitals, doctors often have less than 2-3 minutes per patient. Vital details are missed due to severe time constraints.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold text-gray-400">2</div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-1">Language & Literacy Barriers</h4>
                    <p className="text-gray-600">Elderly and rural patients struggle to explain complex medical histories in English or non-native languages, leading to misdiagnosis.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold text-gray-400">3</div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-1">Unorganized Medical Records</h4>
                    <p className="text-gray-600">Patients arrive with crumpled papers and physical reports. Doctors spend half the consultation time just organizing past history.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Solution */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[var(--forest-900)] mb-6 flex items-center gap-3">
                <span className="bg-green-100 text-[var(--forest-600)] p-2 rounded-lg">
                  <Shield size={24} />
                </span>
                How MediKiosk Solves It
              </h2>
              <div className="space-y-6 bg-[var(--forest-50)] p-8 rounded-2xl border border-[var(--forest-100)]">
                <div>
                  <h4 className="text-xl font-semibold text-[var(--forest-900)] mb-2 flex items-center gap-2">
                    <HeartPulse size={20} className="text-[var(--forest-600)]" /> 1. Utilizing Wait Times
                  </h4>
                  <p className="text-[var(--forest-800)]/80">Instead of sitting idle, patients use the kiosk in the waiting room to enter their symptoms via simple voice commands or touchscreen taps.</p>
                </div>
                <div className="h-px bg-[var(--forest-200)] w-full"></div>
                <div>
                  <h4 className="text-xl font-semibold text-[var(--forest-900)] mb-2 flex items-center gap-2">
                    <Globe size={20} className="text-[var(--forest-600)]" /> 2. Multilingual AI Empathy
                  </h4>
                  <p className="text-[var(--forest-800)]/80">The kiosk's AI speaks and understands regional languages (like Hindi, Assamese, Telugu). It asks empathetic follow-up questions just like a human assistant.</p>
                </div>
                <div className="h-px bg-[var(--forest-200)] w-full"></div>
                <div>
                  <h4 className="text-xl font-semibold text-[var(--forest-900)] mb-2 flex items-center gap-2">
                    <FileText size={20} className="text-[var(--forest-600)]" /> 3. Empowering the Doctor
                  </h4>
                  <p className="text-[var(--forest-800)]/80">The AI compiles the conversation into a highly structured clinical summary. When the patient walks in, the doctor already knows the full history.</p>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
