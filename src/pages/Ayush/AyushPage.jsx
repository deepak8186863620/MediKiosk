import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight, Leaf } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import AudioButton from '../../components/AudioButton/AudioButton';
import ProgressIndicator from '../../components/ProgressIndicator/ProgressIndicator';
import { DASHAVIDHA_QUESTIONS } from '../../config/ayushQuestions';
import { useTranslation } from '../../hooks/useTranslation';

export default function AyushPage() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { ayushHistory, setAyushHistory } = useKiosk();
  
  const [step, setStep] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState(ayushHistory || {});
  
  const question = DASHAVIDHA_QUESTIONS[step];
  
  const qText = language === 'hi' ? question.question_hi : question.question_en;
  const qDesc = language === 'hi' ? question.description_hi : question.description_en;
  
  function handleSelect(val) {
    const updated = { ...currentAnswers, [question.ayush_field]: val };
    setCurrentAnswers(updated);
    setAyushHistory(updated);
    
    if (step < DASHAVIDHA_QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 400);
    } else {
      navigate('/documents');
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col">
      <header className="w-full px-8 py-5 flex items-center justify-between border-b border-emerald-100 bg-white/80">
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)} className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium">
          <ArrowLeft size={20} /> {t('back', 'Back')}
        </button>
        <div className="flex items-center gap-2 text-emerald-800">
          <Leaf size={20} />
          <span className="text-lg font-semibold">{t('Dashavidha Pariksha', 'AYUSH Assessment')}</span>
        </div>
        <div className="w-20"></div>
      </header>

      <main className="flex-1 px-8 py-10 max-w-2xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
            Step {step + 1} of {DASHAVIDHA_QUESTIONS.length}
          </span>
          <span className="text-sm font-bold text-emerald-800">{language === 'hi' ? question.category_hi : question.category}</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-emerald-100 rounded-full mb-10 overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${((step + 1) / DASHAVIDHA_QUESTIONS.length) * 100}%` }}></div>
        </div>
        
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="text-2xl font-bold text-slate-800 leading-snug">{qText}</h2>
            <AudioButton text={qText} size="md" autoSpeak={true} />
          </div>
          <p className="text-base text-slate-500">{qDesc}</p>
        </div>
        
        <div className="space-y-3 animate-fade-in">
          {question.options.map((opt, idx) => {
            const isSelected = currentAnswers[question.ayush_field] === opt.value;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                  isSelected 
                    ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-500/10' 
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <span className={`text-lg font-medium ${isSelected ? 'text-emerald-800' : 'text-slate-700'}`}>
                  {language === 'hi' ? opt.label_hi : opt.label_en}
                </span>
                {isSelected && <CheckCircle2 size={24} className="text-emerald-500" />}
              </button>
            );
          })}
        </div>
        
        <div className="mt-12 flex justify-end">
          <button onClick={() => navigate('/documents')} className="text-emerald-600 font-medium hover:underline text-sm">
            {t('Skip remaining questions', 'Skip remaining questions')}
          </button>
        </div>
      </main>
    </div>
  );
}
