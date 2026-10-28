import React from 'react';
import { Volume2, VolumeX, Trophy, Users, Award, Flame, Sparkles, HelpCircle, Music, Image as ImageIcon, Film, Radio, Mic, Box } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userLevel: number;
  userXP: number;
  dailyStreak: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenStrategyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userLevel,
  userXP,
  dailyStreak,
  isMuted,
  onToggleMute,
  onOpenStrategyModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0716]/90 backdrop-blur-md border-b border-purple-900/30 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Zone 1: Brand Title */}
        <button
          onClick={() => {
            soundFx.playClick();
            setActiveTab('home');
          }}
          className="text-left group flex items-center gap-2 text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 font-['Outfit',sans-serif] whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 group-hover:scale-105 transition-transform inline-flex">
            <Flame className="w-5 h-5 fill-pink-500/30 text-pink-400" />
          </span>
          RETO VIRAL
        </button>

        {/* Zone 2: Nav Links */}
        <nav className="hidden xl:flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-semibold text-slate-300 overflow-x-auto no-scrollbar">
          {[
            { id: 'home', label: 'Reto del Día' },
            { id: 'challenges', label: '30 Retos' },
            { id: 'achievements', label: 'Logros', icon: Award },
            { id: 'friends', label: 'Amigos', icon: Users },
            { id: 'feed', label: 'Feed' },
            { id: 'ai-creator', label: 'IA Reto', icon: Sparkles },
            { id: 'scene-3d', label: 'Escena 3D', icon: Box },
            { id: 'music', label: 'Música', icon: Music },
            { id: 'image-studio', label: 'Imágenes', icon: ImageIcon },
            { id: 'video-animator', label: 'Vídeo', icon: Film },
            { id: 'live-voice', label: 'Voz Live', icon: Radio },
            { id: 'transcribe', label: 'Transcribir', icon: Mic },
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                  activeTab === tab.id
                    ? 'bg-purple-600/30 text-pink-400 border border-purple-500/40 shadow-sm'
                    : 'hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {IconComp && <IconComp className="w-3.5 h-3.5" />}
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: User Level, Sound, & Strategy Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          
          <div className="hidden sm:flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500 animate-pulse" />
            <span>{dailyStreak} d</span>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('achievements');
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 hover:border-pink-500/50 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-200 transition-all hover:scale-105"
            title="Ver tu Nivel y Puntos"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-pink-400 font-extrabold">Nvl {userLevel}</span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-2 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-pink-400" />}
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenStrategyModal();
            }}
            className="p-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 transition-colors"
            title="Estrategia S/ 0 y Viralidad"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Mobile & Tablet Nav bar underneath header */}
      <div className="flex xl:hidden items-center justify-between gap-1 mt-2.5 pt-2 border-t border-purple-900/30 text-xs overflow-x-auto no-scrollbar">
        {[
          { id: 'home', label: 'Día' },
          { id: 'challenges', label: 'Retos' },
          { id: 'achievements', label: 'Logros' },
          { id: 'friends', label: 'Amigos' },
          { id: 'feed', label: 'Feed' },
          { id: 'ai-creator', label: 'IA' },
          { id: 'scene-3d', label: '3D' },
          { id: 'music', label: 'Música' },
          { id: 'image-studio', label: 'Img' },
          { id: 'video-animator', label: 'Vídeo' },
          { id: 'live-voice', label: 'Voz' },
          { id: 'transcribe', label: 'Audio' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundFx.playClick();
              setActiveTab(tab.id);
            }}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
              activeTab === tab.id ? 'bg-pink-500 text-white font-bold' : 'text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
