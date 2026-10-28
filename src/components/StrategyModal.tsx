import React from 'react';
import { X, CheckCircle2, TrendingUp, DollarSign, Share2, Users, Rocket, Target } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface StrategyModalProps {
  onClose: () => void;
  sharesCount: number;
  completedCount: number;
}

export const StrategyModal: React.FC<StrategyModalProps> = ({
  onClose,
  sharesCount,
  completedCount,
}) => {
  // Simple K-Factor simulation formula (shares per active completion)
  const kFactor = completedCount > 0 ? (sharesCount * 1.4 / completedCount).toFixed(2) : '0.00';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#110826] border border-pink-500/40 p-6 md:p-8 rounded-3xl max-w-2xl w-full shadow-2xl relative my-8">
        
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/40">
            <DollarSign className="w-3.5 h-3.5" />
            ESTRATEGIA DE LANZAMIENTO A S/ 0
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white font-['Outfit',sans-serif]">
            Hoja de Ruta de Crecimiento Viral
          </h2>
          <p className="text-xs text-slate-300">
            Plan para validar el engagement sin inversión previa antes de pasar a la escala masiva.
          </p>
        </div>

        {/* Live K-Factor Metrics Box */}
        <div className="bg-slate-900/90 border border-purple-800/40 p-5 rounded-2xl mb-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="text-2xl font-black text-cyan-400 font-mono">{completedCount}</span>
            <span className="block text-[11px] text-slate-400 mt-1 font-semibold">Retos Jugados</span>
          </div>

          <div>
            <span className="text-2xl font-black text-pink-400 font-mono">{sharesCount}</span>
            <span className="block text-[11px] text-slate-400 mt-1 font-semibold">Enlaces Compartidos</span>
          </div>

          <div>
            <span className="text-2xl font-black text-amber-300 font-mono">K = {kFactor}</span>
            <span className="block text-[11px] text-slate-400 mt-1 font-semibold">Factor de Viralidad</span>
          </div>
        </div>

        {/* 5 Steps Checklist */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Pasos de la Hipótesis de Lanzamiento (S/ 0):
          </h4>

          <div className="space-y-3 text-xs text-slate-200">
            <div className="flex items-start gap-3 bg-purple-950/40 p-3 rounded-xl border border-purple-800/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">1. Prototipo Funcional Completo:</strong>
                Biblioteca de 30 retos de 30 segundos, sistema de logros e integración directa con WhatsApp/Instagram.
              </div>
            </div>

            <div className="flex items-start gap-3 bg-purple-950/40 p-3 rounded-xl border border-purple-800/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">2. Prueba de Fuego en Grupos de WhatsApp:</strong>
                Lanzar el reto diario a 5 grupos clave con la frase enganche: <em>"Solo el 8% lo pasa en 15s"</em>.
              </div>
            </div>

            <div className="flex items-start gap-3 bg-purple-950/40 p-3 rounded-xl border border-purple-800/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">3. Medición del Coeficiente de Retención (K &gt; 1.0):</strong>
                Si cada usuario que completa un reto consigue que al menos 1 amigo entre y juegue, la app es viral de forma orgánica.
              </div>
            </div>

            <div className="flex items-start gap-3 bg-purple-950/40 p-3 rounded-xl border border-purple-800/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">4. Inversión Estratégica:</strong>
                Escalar a app móvil nativa (iOS/Android) solo después de validar un ciclo de retención activa de 7 días.
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 text-white font-black text-xs rounded-xl shadow-xl transition-all"
        >
          ¡ENTENDIDO, A SEGUIR JUGANDO!
        </button>

      </div>
    </div>
  );
};
