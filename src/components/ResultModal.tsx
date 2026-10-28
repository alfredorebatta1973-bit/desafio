import React, { useState, useEffect } from 'react';
import { Trophy, Share2, Sparkles, RefreshCw, X, MessageSquare, Check, Send, Award, Flame } from 'lucide-react';
import { GameResult, Challenge } from '../types/game';
import { StoryCardCanvas } from './StoryCardCanvas';
import { soundFx } from '../utils/audio';

interface ResultModalProps {
  result: GameResult;
  challenge: Challenge;
  userName: string;
  userHandle: string;
  onPlayAgain: () => void;
  onClose: () => void;
  onViewAchievements: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  challenge,
  userName,
  userHandle,
  onPlayAgain,
  onClose,
  onViewAchievements,
}) => {
  const [aiRoast, setAiRoast] = useState<{ roast: string; title: string } | null>(null);
  const [loadingAi, setLoadingAi] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  useEffect(() => {
    soundFx.playFanfare();

    // Fetch AI Roast from server API
    const fetchRoast = async () => {
      try {
        const response = await fetch('/api/ai/roast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challengeTitle: challenge.title,
            score: result.score,
            maxScore: result.maxPossibleScore,
            reactionTimeMs: result.reactionTimeMs,
            accuracy: result.accuracyPercent,
            userRank: result.grade,
          }),
        });
        const data = await response.json();
        setAiRoast(data);
      } catch (e) {
        setAiRoast({
          roast: `¡Conseguiste ${result.score} puntos en ${challenge.title}! ¡Tus amigos se van a quedar impresionados!`,
          title: '¡Desafío Brutal!',
        });
      } finally {
        setLoadingAi(false);
      }
    };

    fetchRoast();
  }, [challenge, result]);

  const shareText = `🔥 ¡Obtuve ${result.score} pts en "${challenge.title}" en RETO VIRAL! ⚡ Solo el ${(100 - result.percentileRank).toFixed(1)}% de la gente logra esto. Te reto a superarme aquí: ${window.location.origin}?challenge=${encodeURIComponent(challenge.title)}&score=${result.score}&ref=${encodeURIComponent(userName)}`;

  const handleWhatsAppShare = () => {
    soundFx.playClick();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const handleCopyLink = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f0921] border border-pink-500/40 rounded-3xl p-6 md:p-8 shadow-2xl my-8 overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-black uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 fill-white" />
            ¡RESULTADO OFICIAL!
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white font-['Outfit',sans-serif]">
            {challenge.title}
          </h2>
          <p className="text-xs text-pink-300 font-semibold">
            ⚡ Solo el <span className="text-amber-300 font-extrabold">{(100 - result.percentileRank).toFixed(1)}%</span> de las personas logra este nivel
          </p>
        </div>

        {/* Big Score Card */}
        <div className="bg-slate-900/90 border border-purple-800/40 p-6 rounded-2xl text-center mb-6 relative group">
          <div className="flex items-center justify-center gap-4">
            <div>
              <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 font-['Outfit',sans-serif]">
                {result.score}
              </span>
              <span className="block text-xs font-bold text-slate-400 mt-1">PUNTOS OBTENIDOS</span>
            </div>

            <div className="border-l border-slate-800 pl-6 text-left space-y-1">
              <div className="inline-block px-3 py-1 bg-pink-500 text-white font-black text-sm rounded-lg shadow-md">
                GRADO {result.grade}
              </div>
              <p className="text-xs text-slate-300">
                Precisión: <span className="text-emerald-400 font-bold">{result.accuracyPercent}%</span>
              </p>
              {result.reactionTimeMs && (
                <p className="text-xs text-slate-300">
                  Reflejo: <span className="text-cyan-400 font-bold">{result.reactionTimeMs} ms</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* AI Roast / Dynamic Evaluation */}
        <div className="bg-purple-950/60 border border-purple-500/30 p-4 rounded-2xl mb-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-pink-400 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Evaluación de IA Master: "{aiRoast?.title || 'Análisis de Reflejos'}"</span>
          </div>

          {loadingAi ? (
            <p className="text-xs text-slate-400 animate-pulse py-2">
              Analizando tu nivel de reflejos y preparando el roast...
            </p>
          ) : (
            <p className="text-xs md:text-sm text-slate-200 font-medium italic leading-relaxed">
              "{aiRoast?.roast}"
            </p>
          )}
        </div>

        {/* WhatsApp & Social Direct Buttons */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
            Compartir y Desafiar Amigos
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95"
            >
              <Send className="w-4 h-4 fill-white" />
              <span>Desafiar por WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-xs py-3 px-4 rounded-xl transition-all active:scale-95"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace de Desafío'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Story Canvas Card */}
        <StoryCardCanvas
          challengeTitle={challenge.title}
          score={result.score}
          maxScore={result.maxPossibleScore}
          grade={result.grade}
          percentileRank={result.percentileRank}
          userName={userName}
          userHandle={userHandle}
          aiRoast={aiRoast?.roast}
          aiTitle={aiRoast?.title}
        />

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-purple-900/30">
          <button
            onClick={() => {
              soundFx.playClick();
              onViewAchievements();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Award className="w-4 h-4 text-amber-400" />
            Ver Logros Unlocked
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playClick();
                onPlayAgain();
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Jugar de Nuevo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
