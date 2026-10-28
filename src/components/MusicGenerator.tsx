import React, { useState } from 'react';
import { Music, Play, Pause, Download, Sparkles, RefreshCw } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const MusicGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('Epic electronic synthwave track for a 30-second viral gaming showdown');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handleGenerateMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    setLoading(true);
    setAudioUrl(null);
    setLyrics(null);
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }

    try {
      const response = await fetch('/api/ai/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      if (data.audioBase64) {
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setLyrics(data.lyrics || null);
        soundFx.playFanfare();

        const audio = new Audio(url);
        audio.onended = () => setIsPlaying(false);
        setAudioElement(audio);
      } else {
        alert('No se pudo generar el audio musical. Intenta de nuevo.');
      }
    } catch (err) {
      console.error(err);
      alert('Error al conectar con Lyria Music API.');
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioElement) return;
    soundFx.playClick();
    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-900 via-[#220a40] to-[#120529] border border-pink-500/40 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-pink-500/20 rounded-2xl border border-pink-400/40 text-pink-400 shrink-0">
            <Music className="w-8 h-8 text-pink-400" />
          </div>

          <div>
            <span className="text-xs font-black text-pink-400 uppercase tracking-widest">
              LYRIA AI MUSIC GENERATOR
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white font-['Outfit',sans-serif]">
              Generador de Música para Retos
            </h2>
            <p className="text-xs text-slate-300">
              Crea clips musicales únicos de 30 segundos (`lyria-3-clip-preview`) para ambientar tus desafíos virales.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-slate-900/90 border border-purple-900/40 p-6 rounded-3xl shadow-xl space-y-4">
        <form onSubmit={handleGenerateMusic} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Describe el estilo musical o ambiente deseado:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 bg-slate-950 border border-purple-800/40 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-pink-500 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 text-white font-black text-xs px-5 py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{loading ? 'Componiendo...' : 'Generar Música'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Quick Style Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[11px] font-bold text-slate-400">Estilos populares:</span>
          {[
            'Electro Synthwave 130BPM',
            'Hip-Hop Beat Épico para Retos',
            'Orquestal Cinemático Suspenso',
            'Lofi Chill Reflejos',
          ].map((style) => (
            <button
              key={style}
              onClick={() => setPrompt(style)}
              className="text-[11px] font-semibold text-pink-300 bg-pink-950/40 hover:bg-pink-900/60 border border-pink-500/30 px-2.5 py-1 rounded-lg transition-colors"
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Result Player Card */}
      {audioUrl && (
        <div className="bg-gradient-to-br from-purple-900/90 to-slate-900 border-2 border-pink-500/50 p-6 rounded-3xl shadow-2xl space-y-4 text-center animate-fade-in">
          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
            ¡PISTA MUSICAL GENERADA CON ÉXITO!
          </span>

          <h3 className="text-xl font-black text-white font-['Outfit',sans-serif]">
            "{prompt}"
          </h3>

          {lyrics && (
            <p className="text-xs text-slate-300 italic max-w-md mx-auto bg-slate-950/60 p-3 rounded-xl border border-purple-800/40">
              Letra/Notas: {lyrics}
            </p>
          )}

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 text-white font-black text-sm py-3 px-8 rounded-2xl shadow-xl transition-all active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
              <span>{isPlaying ? 'Pausar Música' : 'Reproducir Clip 30s'}</span>
            </button>

            <a
              href={audioUrl}
              download="RetoViral-Soundtrack.wav"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-xs py-3 px-6 rounded-2xl transition-all"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Descargar WAV</span>
            </a>
          </div>
        </div>
      )}

    </div>
  );
};
