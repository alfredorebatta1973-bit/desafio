import React, { useState } from 'react';
import { Users, UserPlus, Swords, Trophy, Search, Check, Send, Flame, MessageCircle, Shield, Award } from 'lucide-react';
import { Friend, Challenge } from '../types/game';
import { soundFx } from '../utils/audio';

interface FriendsViewProps {
  friends: Friend[];
  challenges: Challenge[];
  onAddFriend: (handle: string, name: string) => void;
  onSendChallenge: (friend: Friend, challenge: Challenge) => void;
}

export const FriendsView: React.FC<FriendsViewProps> = ({
  friends,
  challenges,
  onAddFriend,
  onSendChallenge,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newHandleInput, setNewHandleInput] = useState('');
  const [newNameInput, setNewNameInput] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedChallengeForDuel, setSelectedChallengeForDuel] = useState<Challenge>(challenges[0]);
  const [activeTab, setActiveTab] = useState<'lista' | 'leaderboard'>('lista');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandleInput.trim() || !newNameInput.trim()) return;

    soundFx.playCorrect();
    onAddFriend(
      newHandleInput.startsWith('@') ? newHandleInput : `@${newHandleInput}`,
      newNameInput
    );
    setNewHandleInput('');
    setNewNameInput('');
    setShowAddModal(false);
  };

  const filteredFriends = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-[#180933] to-[#0f0521] border border-cyan-500/40 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Users className="w-8 h-8 text-cyan-400" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">
                SISTEMA OFICIAL DE AMIGOS & DUELOS
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white font-['Outfit',sans-serif]">
                Comunidad de Amigos Virales
              </h2>
              <p className="text-xs text-slate-300">
                Añade amigos, compara récords en vivo y envía desafíos directos a sus redes social.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              setShowAddModal(true);
            }}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-black text-sm py-3.5 px-6 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <UserPlus className="w-4 h-4 text-slate-950" />
            <span>Añadir Nuevo Amigo</span>
          </button>

        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-900/90 rounded-2xl border border-purple-900/40 w-full sm:w-auto">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('lista');
            }}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'lista'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mis Amigos ({friends.length})
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('leaderboard');
            }}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tabla de Clasificación
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar amigo por nombre o @handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-purple-900/40 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* TAB 1: FRIENDS LIST */}
      {activeTab === 'lista' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="bg-slate-900/80 border border-purple-900/40 hover:border-cyan-500/50 p-5 rounded-2xl shadow-lg flex flex-col justify-between transition-all"
            >
              <div>
                {/* Avatar & Online Status */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/40"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                        friend.status === 'online'
                          ? 'bg-emerald-500'
                          : friend.status === 'en_reto'
                          ? 'bg-amber-400 animate-ping'
                          : 'bg-slate-500'
                      }`}
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white font-['Outfit',sans-serif]">
                      {friend.name}
                    </h4>
                    <p className="text-xs text-slate-400">{friend.handle}</p>
                  </div>
                </div>

                {/* Best Score Badge */}
                <div className="bg-purple-950/50 border border-purple-800/30 p-3 rounded-xl mb-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Mejor Récord Registrado</span>
                  <p className="text-xs font-bold text-cyan-300">
                    {friend.bestChallengeScore.challengeTitle}: <span className="text-amber-300 font-extrabold">{friend.bestChallengeScore.score} pts</span>
                  </p>
                </div>
              </div>

              {/* Direct Challenge Button */}
              <button
                onClick={() => {
                  soundFx.playClick();
                  onSendChallenge(friend, selectedChallengeForDuel);
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95"
              >
                <Swords className="w-4 h-4 text-white" />
                <span>Enviar Desafío Directo</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: LEADERBOARD DE AMIGOS */}
      {activeTab === 'leaderboard' && (
        <div className="bg-slate-900/90 border border-purple-900/40 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-purple-900/30 pb-4">
            <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Ranking General de Amigos
            </h3>

            {/* Select Challenge Filter */}
            <select
              value={selectedChallengeForDuel.id}
              onChange={(e) => {
                const found = challenges.find((c) => c.id === Number(e.target.value));
                if (found) setSelectedChallengeForDuel(found);
              }}
              className="bg-slate-800 border border-purple-700/40 text-xs font-bold text-slate-200 rounded-xl px-3 py-2 outline-none"
            >
              {challenges.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.id}. {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {friends
              .slice()
              .sort((a, b) => b.totalXP - a.totalXP)
              .map((friend, rank) => (
                <div
                  key={friend.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    rank === 0
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : rank === 1
                      ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                      : 'bg-slate-900/50 border-purple-900/30 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-black text-lg w-6 text-center font-mono">
                      #{rank + 1}
                    </span>

                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-10 h-10 rounded-full object-cover border border-purple-500/40"
                    />

                    <div>
                      <h4 className="text-sm font-bold">{friend.name}</h4>
                      <p className="text-xs text-slate-400">{friend.handle}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-amber-300 block">
                      {friend.totalXP} XP
                    </span>
                    <span className="text-[10px] text-slate-400">Nivel {friend.level}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modal: Add Friend */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#110926] border border-cyan-500/40 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-xl font-black text-white font-['Outfit',sans-serif]">
              Añadir Nuevo Amigo
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Nombre Completo / Apodo
                </label>
                <input
                  type="text"
                  placeholder="Ej: Mateo Mendoza"
                  value={newNameInput}
                  onChange={(e) => setNewNameInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  @Handle de Amigo
                </label>
                <input
                  type="text"
                  placeholder="Ej: @mateobrain"
                  value={newHandleInput}
                  onChange={(e) => setNewHandleInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-lg"
                >
                  Guardar Amigo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
