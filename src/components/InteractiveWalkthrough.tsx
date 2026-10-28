import React, { useState } from 'react';
import { Flame, Trophy, Users, Award, Sparkles, ArrowRight, ArrowLeft, X, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface WalkthroughProps {
  onComplete: () => void;
  onNavigateTab: (tab: string) => void;
}

export const InteractiveWalkthrough: React.FC<WalkthroughProps> = ({
  onComplete,
  onNavigateTab,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '¡Bienvenido a RETO VIRAL!',
      subtitle: 'La aplicación definitiva de desafíos de 30 segundos entre amigos.',
      description: 'Pon a prueba tus reflejos, memoria y agilidad mental. Cada reto dura exactamente 30 segundos. ¿Podrás entrar en el top mundial?',
      icon: Flame,
      color: 'from-pink-500 to-rose-600',
      targetTab: 'home',
    },
    {
      title: 'El Reto del Día',
      subtitle: 'Un desafío fresco cada 24 horas.',
      description: 'Cada día aparece un reto especial. Obtén tu puntuación, compara tu tiempo con el de otros jugadores y descubre el porcentaje de éxito mundial.',
      icon: Trophy,
      color: 'from-amber-500 to-orange-600',
      targetTab: 'home',
    },
    {
      title: 'Feed Social y Comunidad',
      subtitle: 'Desafía y observa a tus amigos.',
      description: 'En el Feed Social podrás ver los récords y las insignias que van desbloqueando tus amigos, reaccionar con emojis y aceptar sus duelos directos al instante.',
      icon: Users,
      color: 'from-cyan-500 to-blue-600',
      targetTab: 'feed',
    },
    {
      title: 'Logros, Puntos & Insignias',
      subtitle: 'Gana XP y sube de nivel.',
      description: 'Desbloquea hasta 15 insignias exclusivas (como "Velocidad de la Luz" o "Cirujano de la Precisión") y compártelas en WhatsApp e Instagram.',
      icon: Award,
      color: 'from-purple-500 to-indigo-600',
      targetTab: 'achievements',
    },
    {
      title: 'IA Reto Master',
      subtitle: 'Crea tus propios desafíos con Inteligencia Artificial.',
      description: 'Escribe cualquier tema (cultura pop, música, ciencia) y deja que Gemini cree un minijuego único y viral para desafiar a tu grupo.',
      icon: Sparkles,
      color: 'from-fuchsia-500 to-pink-600',
      targetTab: 'ai-creator',
    },
  ];

  const handleNext = () => {
    soundFx.playClick();
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      onNavigateTab(steps[next].targetTab);
    } else {
      soundFx.playFanfare();
      onComplete();
    }
  };

  const handlePrev = () => {
    soundFx.playClick();
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      onNavigateTab(steps[prev].targetTab);
    }
  };

  const current = steps[currentStep];
  const IconComponent = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#110926] border-2 border-pink-500/50 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Background Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Skip / Close Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onComplete();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Saltar tutorial"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= currentStep ? 'bg-pink-500 shadow-sm shadow-pink-500/50' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Icon Header */}
        <div className="flex flex-col items-center text-center space-y-4 my-4">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${current.color} flex items-center justify-center shadow-xl shadow-pink-500/25 text-white`}>
            <IconComponent className="w-10 h-10 text-white" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black text-pink-400 uppercase tracking-widest">
              Paso {currentStep + 1} de {steps.length}
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white font-['Outfit',sans-serif]">
              {current.title}
            </h3>
            <p className="text-sm font-bold text-amber-300">
              {current.subtitle}
            </p>
          </div>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-md pt-2">
            {current.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-6 border-t border-purple-900/40 mt-6">
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs rounded-xl shadow-xl shadow-pink-500/30 transition-all active:scale-95"
          >
            <span>{currentStep === steps.length - 1 ? '¡Comenzar a Jugar!' : 'Siguiente'}</span>
            {currentStep === steps.length - 1 ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
};
