import React, { useState } from 'react';
import { Award, Trophy, CheckCircle2, Lock, Flame, Zap, Share2, Sparkles, Star, Users } from 'lucide-react';
import { Achievement, UserStats } from '../types/game';
import { soundFx } from '../utils/audio';

interface AchievementsViewProps {
  achievements: Achievement[];
  userStats: UserStats;
  onShareBadge: (achievement: Achievement) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  achievements,
  userStats,
  onShareBadge,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('todos');

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const unlockedPercent = Math.round((unlockedCount / totalCount) * 100);

  const filtered = filterCategory === 'todos'
    ? achievements
    : achievements.filter((a) => a.category === filterCategory);

  return (
    <div className="space-y-8">
      
      {/* Top Banner: Level & Points Progress */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-[#1d093b] to-[#120529] border border-purple-500/40 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center shadow-xl shadow-pink-500/20 text-white font-black text-3xl shrink-0">
              <Trophy className="w-10 h-10 text-white fill-white" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black text-pink-400 uppercase tracking-widest">
                SISTEMA OFICIAL DE INSIGNIAS Y RECOMPENSAS
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white font-['Outfit',sans-serif]">
                Nivel {userStats.level} · Leyenda Viral
              </h2>
              <p className="text-xs text-slate-300">
                Puntos acumulados: <span className="text-amber-300 font-bold">{userStats.xp} XP</span> · {unlockedCount} de {totalCount} Logros Desbloqueados
              </p>
            </div>
          </div>

          {/* Progress Circle / Bar */}
          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-pink-300">Progreso a Nivel {userStats.level + 1}</span>
              <span className="text-amber-300">{userStats.xp} / {userStats.xpToNextLevel} XP</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full border border-purple-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${Math.min(100, (userStats.xp / userStats.xpToNextLevel) * 100)}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'todos', label: 'Todos los Logros' },
          { id: 'participacion', label: 'Participación' },
          { id: 'puntuacion', label: 'Puntuación Alta' },
          { id: 'amigos', label: 'Amigos & Retos' },
          { id: 'viral', label: 'Viralidad' },
          { id: 'maestria', label: 'Maestría' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundFx.playClick();
              setFilterCategory(tab.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterCategory === tab.id
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ach) => (
          <div
            key={ach.id}
            className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 ${
              ach.unlocked
                ? 'bg-gradient-to-b from-purple-900/60 to-slate-900/90 border-pink-500/50 shadow-xl shadow-purple-500/10'
                : 'bg-slate-900/40 border-slate-800 opacity-75'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-md ${
                    ach.unlocked
                      ? `bg-gradient-to-tr ${ach.badgeColor} text-white shadow-pink-500/20`
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {ach.unlocked ? <Award className="w-6 h-6 text-white" /> : <Lock className="w-5 h-5 text-slate-500" />}
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    ach.unlocked
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  +{ach.xpReward} XP
                </span>
              </div>

              {/* Title & Description */}
              <h4 className={`text-base font-bold font-['Outfit',sans-serif] ${ach.unlocked ? 'text-white' : 'text-slate-400'}`}>
                {ach.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {ach.description}
              </p>
            </div>

            {/* Progress / Share Footer */}
            <div className="mt-4 pt-3 border-t border-purple-900/30">
              {ach.unlocked ? (
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ¡Desbloqueado!
                  </span>

                  <button
                    onClick={() => {
                      soundFx.playBadgeUnlock();
                      onShareBadge(ach);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-pink-400 hover:text-pink-300 transition-colors bg-pink-500/10 border border-pink-500/30 px-2.5 py-1 rounded-lg"
                  >
                    <Share2 className="w-3 h-3 text-pink-400" />
                    Mostrar Insignia
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                    <span>Progreso</span>
                    <span>{ach.progress} / {ach.maxProgress}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 transition-all duration-300"
                      style={{ width: `${Math.min(100, (ach.progress / ach.maxProgress) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
