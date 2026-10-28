import React from 'react';
import { Play, Trophy, Users, Zap, Flame, Clock, Eye, Brain, Calculator, Target, Award } from 'lucide-react';
import { Challenge } from '../types/game';
import { soundFx } from '../utils/audio';

interface ChallengeCardProps {
  challenge: Challenge;
  highScore?: number;
  onPlay: (challenge: Challenge) => void;
  onChallengeFriend: (challenge: Challenge) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  highScore,
  onPlay,
  onChallengeFriend,
}) => {
  return (
    <div className="group relative flex flex-col justify-between bg-slate-900/80 hover:bg-slate-900/95 border border-purple-900/40 hover:border-pink-500/50 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10">
      
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold text-cyan-400 tracking-wider uppercase">
            {challenge.category}
          </span>

          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
            challenge.difficulty === 'Fácil' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
            challenge.difficulty === 'Media' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
            challenge.difficulty === 'Difícil' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
            'bg-purple-500/10 text-purple-300 border border-purple-500/30'
          }`}>
            {challenge.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif] group-hover:text-pink-300 transition-colors">
          #{challenge.id}. {challenge.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {challenge.description}
        </p>

        {/* Hook */}
        <p className="text-[11px] text-pink-400/90 font-medium italic mt-2">
          "{challenge.viralHook}"
        </p>
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-4 pt-3 border-t border-purple-900/30 space-y-3">
        
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            {challenge.durationSeconds}s
          </span>

          {highScore && highScore > 0 ? (
            <span className="flex items-center gap-1 font-bold text-amber-400">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Récord: {highScore} pts
            </span>
          ) : (
            <span className="text-slate-500 italic">Sin intentar</span>
          )}
        </div>

        {/* Play & Direct Challenge Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playClick();
              onPlay(challenge);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl shadow-md transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            JUGAR
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onChallengeFriend(challenge);
            }}
            className="flex items-center justify-center p-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white border border-cyan-500/30 rounded-xl transition-all active:scale-95"
            title="Desafiar a un amigo"
          >
            <Users className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
