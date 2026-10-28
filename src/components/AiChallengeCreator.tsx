import React, { useState } from 'react';
import { Sparkles, Play, RefreshCw, Wand2, HelpCircle } from 'lucide-react';
import { Challenge } from '../types/game';
import { soundFx } from '../utils/audio';

interface AiChallengeCreatorProps {
  onPlayCustomChallenge: (challenge: Challenge) => void;
}

export const AiChallengeCreator: React.FC<AiChallengeCreatorProps> = ({
  onPlayCustomChallenge,
}) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedChallenge, setGeneratedChallenge] = useState<Challenge | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    soundFx.playClick();
    setLoading(true);

    try {
      const response = await fetch('/api/ai/custom-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();

      const newChallenge: Challenge = {
        id: Math.floor(Math.random() * 9000) + 1000,
        title: data.title || `Reto AI: ${topic}`,
        category: (data.category as any) || 'Lógica & Cálculo',
        difficulty: (data.difficulty as any) || 'Media',
        durationSeconds: data.durationSeconds || 20,
        gameType: 'math_blitz',
        description: data.description || 'Responde la pregunta generada por la IA antes de que expire el tiempo.',
        viralHook: data.viralHook || '¡Solo el 5% de las personas acierta en el primer intento!',
        iconName: 'Sparkles',
        targetScoreForA: 800,
        colorGradient: 'from-purple-600 via-pink-600 to-indigo-900',
        aiCustomData: {
          question: data.question,
          options: data.options,
          correctAnswer: data.correctAnswer,
        },
      };

      setGeneratedChallenge(newChallenge);
      soundFx.playFanfare();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-[#220a40] to-[#120529] border border-purple-500/40 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-purple-500/20 rounded-2xl border border-purple-400/40 text-purple-300 shrink-0">
            <Sparkles className="w-8 h-8 text-purple-300" />
          </div>

          <div>
            <span className="text-xs font-black text-purple-400 uppercase tracking-widest">
              AI RETO MASTER
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white font-['Outfit',sans-serif]">
              Generador de Retos con IA
            </h2>
            <p className="text-xs text-slate-300">
              Escribe cualquier tema y la Inteligencia Artificial creará un reto único jugable con reglas personalizadas.
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900/90 border border-purple-900/40 p-6 rounded-3xl shadow-xl space-y-4">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              ¿Qué tema te gustaría para tu reto viral?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: Memes ciberpunk, Anime de los 2000, Fútbol de Champions, Física cuántica rápida..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1 bg-slate-950 border border-purple-800/40 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-pink-500 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 text-white font-black text-xs px-5 py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span>{loading ? 'Generando...' : 'Crear Reto'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Quick Topic Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[11px] font-bold text-slate-400">Sugerencias rápidas:</span>
          {['Memes de Internet', 'Cultura Pop 2026', 'Adivina la Canción', 'Lógica Extrema'].map((sug) => (
            <button
              key={sug}
              onClick={() => setTopic(sug)}
              className="text-[11px] font-semibold text-purple-300 bg-purple-950/60 hover:bg-purple-900 border border-purple-800/40 px-2.5 py-1 rounded-lg transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Challenge Preview Card */}
      {generatedChallenge && (
        <div className="bg-gradient-to-br from-purple-900/90 to-slate-900 border-2 border-pink-500/50 p-6 rounded-3xl shadow-2xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-pink-400 uppercase">
              ¡RETO GENERADO CON ÉXITO!
            </span>
            <span className="text-xs font-bold text-cyan-300">
              {generatedChallenge.durationSeconds} Segundos
            </span>
          </div>

          <h3 className="text-2xl font-black text-white font-['Outfit',sans-serif]">
            {generatedChallenge.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {generatedChallenge.description}
          </p>

          <p className="text-xs text-amber-300 font-bold italic">
            "{generatedChallenge.viralHook}"
          </p>

          <button
            onClick={() => {
              soundFx.playClick();
              onPlayCustomChallenge(generatedChallenge);
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 text-white font-black text-sm py-3.5 px-6 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>JUGAR RETO GENERADO</span>
          </button>
        </div>
      )}

    </div>
  );
};
