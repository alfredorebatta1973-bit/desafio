import React, { useState } from 'react';
import { MessageSquare, Flame, Zap, Smile, ThumbsUp, Swords, Share2, Award, Plus, Send } from 'lucide-react';
import { FeedItem, Challenge } from '../types/game';
import { soundFx } from '../utils/audio';

interface SocialFeedViewProps {
  feedItems: FeedItem[];
  challenges: Challenge[];
  onReaction: (feedId: string, reactionKey: 'fire' | 'zap' | 'laugh' | 'clap') => void;
  onAcceptFeedChallenge: (challengeId: number) => void;
  onPostUserResult: (text: string) => void;
}

export const SocialFeedView: React.FC<SocialFeedViewProps> = ({
  feedItems,
  challenges,
  onReaction,
  onAcceptFeedChallenge,
  onPostUserResult,
}) => {
  const [postInput, setPostInput] = useState('');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postInput.trim()) return;

    soundFx.playCorrect();
    onPostUserResult(postInput);
    setPostInput('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-900/80 via-[#1e0736] to-[#0d0321] border border-pink-500/40 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pink-500/20 rounded-2xl border border-pink-400/40 text-pink-400 shrink-0">
            <Flame className="w-8 h-8 fill-pink-500/30 text-pink-400" />
          </div>

          <div>
            <span className="text-xs font-black text-pink-400 uppercase tracking-widest">
              FEED OFICIAL DE ACTIVIDAD VIRAL
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white font-['Outfit',sans-serif]">
              Comunidad en Tiempo Real
            </h2>
            <p className="text-xs text-slate-300">
              Mira qué retos están superando tus amigos, reacciona y entra directamente a desafiarlos.
            </p>
          </div>
        </div>
      </div>

      {/* Post Composer Box */}
      <div className="bg-slate-900/90 border border-purple-900/40 p-4 rounded-2xl shadow-lg space-y-3">
        <form onSubmit={handlePostSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Escribe un mensaje o alardea sobre tu última puntuación..."
            value={postInput}
            onChange={(e) => setPostInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-purple-800/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-pink-500 transition-colors"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 shrink-0"
          >
            <Send className="w-3.5 h-3.5 fill-white" />
            <span>Publicar</span>
          </button>
        </form>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {feedItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/80 border border-purple-900/40 hover:border-pink-500/30 p-5 rounded-2xl shadow-lg transition-all space-y-3"
          >
            {/* User Info Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={item.userAvatar}
                  alt={item.userName}
                  className="w-10 h-10 rounded-full object-cover border border-purple-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white font-['Outfit',sans-serif]">
                    {item.userName}
                  </h4>
                  <p className="text-[11px] text-slate-400">{item.userHandle} · {item.timestamp}</p>
                </div>
              </div>

              {/* Type Badge */}
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-purple-950 text-pink-300 border border-purple-800">
                {item.type === 'high_score' ? '🏆 Nuevo Récord' :
                 item.type === 'badge_unlocked' ? '🎖️ Insignia Unlocked' :
                 item.type === 'friend_challenge_sent' ? '⚔️ Desafío Amigos' : '🔥 Racha Diaria'}
              </span>
            </div>

            {/* Post Content */}
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
              {item.content}
            </p>

            {/* Accept Challenge Button if attached */}
            {item.challengeId && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onAcceptFeedChallenge(item.challengeId!);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500/20 to-purple-600/20 hover:from-pink-500/30 text-pink-300 border border-pink-500/40 font-bold text-xs py-2 px-4 rounded-xl transition-all"
                >
                  <Swords className="w-3.5 h-3.5 text-pink-400" />
                  <span>Intentar y Superar a {item.userName}</span>
                </button>
              </div>
            )}

            {/* Interactive Reactions Bar */}
            <div className="flex items-center gap-3 pt-3 border-t border-purple-900/30 text-xs">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onReaction(item.id, 'fire');
                }}
                className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
              >
                <span>🔥</span>
                <span className="font-bold">{item.reactions.fire}</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onReaction(item.id, 'zap');
                }}
                className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <span>⚡</span>
                <span className="font-bold">{item.reactions.zap}</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onReaction(item.id, 'laugh');
                }}
                className="flex items-center gap-1 text-slate-400 hover:text-yellow-400 transition-colors"
              >
                <span>😂</span>
                <span className="font-bold">{item.reactions.laugh}</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onReaction(item.id, 'clap');
                }}
                className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <span>👏</span>
                <span className="font-bold">{item.reactions.clap}</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
