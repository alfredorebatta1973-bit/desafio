import React from 'react';
import { Swords, Trophy, Play, UserCheck, Flame } from 'lucide-react';
import { Challenge } from '../types/game';
import { soundFx } from '../utils/audio';

interface FriendChallengeBannerProps {
  friendName: string;
  targetScore: number;
  challenge: Challenge;
  onAcceptChallenge: (challenge: Challenge) => void;
}

export const FriendChallengeBanner: React.FC<FriendChallengeBannerProps> = ({
  friendName,
  targetScore,
  challenge,
  onAcceptChallenge,
}) => {
  return (
    <div className="bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-800 border-2 border-pink-400 p-5 md:p-6 rounded-3xl shadow-2xl mb-8 relative overflow-hidden animate-pulse">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-pink-300 shrink-0">
            <Swords className="w-8 h-8 text-pink-300" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black text-amber-300 uppercase tracking-widest bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30 inline-block">
              ¡DESAFÍO DIRECTO RECIBIDO!
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white font-['Outfit',sans-serif]">
              {friendName} te desafió en "{challenge.title}"
            </h3>
            <p className="text-xs md:text-sm text-pink-100 font-semibold">
              Obtuvo <span className="text-amber-300 font-black">{targetScore} pts</span>. ¿Tienes los reflejos para superarlo?
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playFanfare();
            onAcceptChallenge(challenge);
          }}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm py-3.5 px-6 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>¡ACEPTAR DESAFÍO!</span>
        </button>

      </div>
    </div>
  );
};
