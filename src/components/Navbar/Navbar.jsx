import { useNavigate, useLocation } from 'react-router-dom';
import { HeartPulse, Home, Stethoscope, Leaf, HelpCircle } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { useTranslation } from '../../hooks/useTranslation';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDemoMode } = useKiosk();
  const { t } = useTranslation();

  const navItems = [
    { name: t('nav_home'), path: '/', icon: <Home size={18} /> },
    { name: t('nav_ayush'), path: '/ayush', icon: <Leaf size={18} /> },
    { name: t('nav_doctor'), path: '/doctor', icon: <Stethoscope size={18} /> }
  ];

  return (
    <>
      {/* Top Utility Bar (Government/Hospital Portal style) */}
      <div className="w-full bg-[var(--forest-900)] text-white/80 py-2 px-6 flex justify-between items-center text-xs font-medium tracking-wide">
        <span>National Health Authority · OPD Fast-Track</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><span className="hidden sm:inline">Multilingual Support</span></span>
          <span className="flex items-center gap-1"><span className="hidden sm:inline">HIPAA Compliant</span></span>
        </div>
      </div>

      <header className="kiosk-header sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-3 px-6 md:px-8">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        
        {/* Logo Section */}
        <div 
          className="logo-mark flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="bg-[var(--forest-700)] p-2 rounded-lg text-white">
            <HeartPulse size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[var(--forest-900)] leading-tight tracking-tight">MediKiosk</h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">NHA Digital OPD</p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm transition-colors ${
                  isActive 
                    ? 'bg-[var(--forest-50)] text-[var(--forest-800)] border border-[var(--forest-100)]' 
                    : 'text-[var(--text-secondary)] hover:bg-gray-50'
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            );
          })}
        </nav>
        
        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {isDemoMode && (
            <span className="badge bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase hidden sm:block">Demo Mode</span>
          )}
          <button
            onClick={() => navigate('/demo')}
            className="btn-ghost flex items-center gap-2 text-sm text-[var(--forest-800)] hover:bg-[var(--forest-50)] px-4 py-2 rounded-md font-semibold transition-colors"
          >
            <HelpCircle size={18} /> <span className="hidden sm:inline">{t('nav_staff')}</span>
          </button>
        </div>
      </div>
    </header>
    </>
  );
}
