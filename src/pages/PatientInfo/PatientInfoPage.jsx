import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import ProgressIndicator from '../../components/ProgressIndicator/ProgressIndicator';

export default function PatientInfoPage() {
  const navigate = useNavigate();
  const { patientInfo, setPatientInfo } = useKiosk();
  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setPatientInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs = {};
    if (!patientInfo.name.trim()) errs.name = 'Please enter your name.';
    if (!patientInfo.age || patientInfo.age < 1 || patientInfo.age > 120) errs.age = 'Please enter a valid age.';
    if (!patientInfo.gender) errs.gender = 'Please select your gender.';
    return errs;
  }

  function handleContinue() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    navigate('/chief-complaint');
  }

  const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
  const PATIENT_TYPE = ['New Patient', 'Returning Patient'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col">
      <header className="w-full px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-white/80">
        <button onClick={() => navigate('/consent')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800">
          <ArrowLeft size={20} /> Back
        </button>
        <span className="text-lg font-semibold text-slate-700">Your Information</span>
        <div />
      </header>

      <main className="flex-1 px-8 py-8 max-w-xl mx-auto w-full">
        <ProgressIndicator currentStep="patient-info" />

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <User size={28} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Tell us about yourself</h1>
          <p className="text-base text-slate-500">We only ask what is needed for your visit.</p>
        </div>

        <div className="space-y-5 mb-8">
          {/* Name */}
          <div>
            <label className="block text-base font-semibold text-slate-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={patientInfo.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Enter your name"
              className="input-large"
              id="input-name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="block text-base font-semibold text-slate-700 mb-2">Age *</label>
            <input
              type="number"
              value={patientInfo.age}
              onChange={e => handleChange('age', e.target.value)}
              placeholder="Your age in years"
              min="1"
              max="120"
              className="input-large"
              id="input-age"
            />
            {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-base font-semibold text-slate-700 mb-2">Gender *</label>
            <div className="flex gap-3">
              {GENDER_OPTIONS.map(g => (
                <button
                  key={g}
                  onClick={() => handleChange('gender', g)}
                  className={`flex-1 py-3.5 rounded-xl border-2 font-medium text-base transition-all
                    ${patientInfo.gender === g
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                    }`}
                  id={`gender-${g.toLowerCase()}`}
                >
                  {g}
                </button>
              ))}
            </div>
            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
          </div>

          {/* Phone (optional) */}
          <div>
            <label className="block text-base font-semibold text-slate-700 mb-2">
              Phone Number <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              value={patientInfo.phone}
              onChange={e => handleChange('phone', e.target.value)}
              placeholder="10-digit mobile number"
              className="input-large"
              id="input-phone"
            />
          </div>

          {/* Patient type */}
          <div>
            <label className="block text-base font-semibold text-slate-700 mb-2">Visit Type</label>
            <div className="flex gap-3">
              {PATIENT_TYPE.map(t => {
                const val = t === 'New Patient' ? 'new' : 'existing';
                return (
                  <button
                    key={t}
                    onClick={() => handleChange('patient_type', val)}
                    className={`flex-1 py-3.5 rounded-xl border-2 font-medium text-base transition-all
                      ${patientInfo.patient_type === val
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                      }`}
                    id={`patient-type-${val}`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ABHA ID — prototype placeholder */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm font-semibold text-amber-800 mb-2">🏥 ABHA ID (Prototype)</p>
            <input
              type="text"
              value={patientInfo.abha_id}
              onChange={e => handleChange('abha_id', e.target.value)}
              placeholder="Enter or Scan ABHA ID"
              className="input-large text-sm"
              id="input-abha"
            />
            <p className="text-xs text-amber-700 mt-2">
              ABDM integration coming soon. This field is optional for the prototype.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={() => navigate('/consent')} className="btn-secondary flex-1">Go Back</button>
          <button onClick={handleContinue} className="btn-primary flex-1" id="btn-patient-info-continue">
            Continue →
          </button>
        </div>
      </main>
    </div>
  );
}
