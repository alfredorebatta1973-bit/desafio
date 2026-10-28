import React, { useState, useEffect } from 'react';
import { Flame, Clock, Trophy, Play, Share2, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { Challenge } from '../types/game';
import { soundFx } from '../utils/audio';

interface DailyChallengeBannerProps {
  challenge: Challenge;
  onPlay: (challenge: Challenge) => void;
  userHighScore?: number;
}

export const DailyChallengeBanner: React.FC<DailyChallengeBannerProps> = ({
  challenge,
  onPlay,
  userHighScore,
}) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/90 via-[#1b0838] to-[#0d0321] border border-pink-500/40 p-6 md:p-8 shadow-2xl mb-8 group">
      
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-500/30 transition-all duration-700" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Side Info */}
        <div className="flex-1 space-y-4">
          
          {/* Header Row */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-black tracking-wide shadow-md uppercase">
              <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
              Reto del Día #142
            </span>

            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Expira en {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>

            {userHighScore !== undefined && userHighScore > 0 && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                Tu Récord: {userHighScore} pts
              </span>
            )}
          </div>

          {/* Title & Viral Hook */}
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white font-['Outfit',sans-serif] tracking-tight group-hover:text-pink-300 transition-colors">
              {challenge.title}
            </h2>
            <p className="text-sm md:text-base text-pink-300/90 font-bold mt-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              {challenge.viralHook}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            {challenge.description}
          </p>

          {/* Meta Details */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 pt-1">
            <span className="text-cyan-400 font-bold">{challenge.category}</span>
            <span>·</span>
            <span>Tiempo: {challenge.durationSeconds} Segundos</span>
            <span>·</span>
            <span className="text-purple-300">Dificultad: {challenge.difficulty}</span>
          </div>
        </div>

        {/* Right Side Action Button */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 shrink-0">
          <button
            onClick={() => {
              soundFx.playClick();
              onPlay(challenge);
            }}
            className="w-full sm:w-auto lg:w-48 flex items-center justify-center gap-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-base py-4 px-6 rounded-2xl shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all group/btn"
          >
            <Play className="w-5 h-5 fill-white text-white group-hover/btn:translate-x-0.5 transition-transform" />
            <span>¡JUGAR AHORA!</span>
          </button>

          <p className="text-[11px] text-center text-slate-400 font-medium">
            30 Segundos · Sin descargas · Puntuación instantánea
          </p>
        </div>

      </div>
    </div>
  );
};
