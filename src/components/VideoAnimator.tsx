import React, { useState } from 'react';
import { Film, Sparkles, Upload, Download, RefreshCw, Wand2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const VideoAnimator: React.FC = () => {
  const [prompt, setPrompt] = useState('Animate this champion trophy with floating neon particles and dramatic cinematic camera rotation');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      soundFx.playCorrect();
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    setLoading(true);
    setVideoUrl(null);

    try {
      const response = await fetch('/api/ai/video-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          base64Image: selectedImage,
          aspectRatio,
        }),
      });
      const data = await response.json();

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        soundFx.playFanfare();
      } else {
        alert('No se pudo generar el vídeo. Intenta de nuevo.');
      }
    } catch (err) {
      console.error(err);
      alert('Error al conectar con Gemini Omni Flash Video API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-[#250b45] to-[#120529] border border-fuchsia-500/40 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-fuchsia-500/20 rounded-2xl border border-fuchsia-400/40 text-fuchsia-400 shrink-0">
            <Film className="w-8 h-8 text-fuchsia-400" />
          </div>

          <div>
            <span className="text-xs font-black text-fuchsia-400 uppercase tracking-widest">
              GEMINI OMNI FLASH VIDEO API
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white font-['Outfit',sans-serif]">
              Animador de Imágenes y Vídeo IA
            </h2>
            <p className="text-xs text-slate-300">
              Sube una foto y conviértela en un vídeo cinemático de alta definición (`gemini-omni-1.1-flash`) en formato vertical (9:16) u horizontal (16:9).
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-slate-900/90 border border-purple-900/40 p-6 rounded-3xl shadow-xl space-y-4">
        <form onSubmit={handleGenerateVideo} className="space-y-4">
          
          {/* Mandatory or Optional Image Upload */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Imagen a animar en vídeo:
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-fuchsia-300 border border-fuchsia-500/30 rounded-xl cursor-pointer text-xs font-bold transition-all">
                <Upload className="w-4 h-4" />
                <span>{selectedImage ? 'Cambiar Imagen' : 'Subir Foto a Animar'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" required />
              </label>

              {selectedImage && (
                <div className="flex items-center gap-2">
                  <img src={selectedImage} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-fuchsia-400" />
                  <span className="text-xs text-emerald-400 font-bold">✓ Imagen lista</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Descripción del movimiento y efectos de vídeo:
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-purple-800/40 rounded-xl p-4 text-xs text-white placeholder-slate-500 outline-none focus:border-fuchsia-500 transition-colors resize-none"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">Formato de vídeo:</span>
              {['16:9', '9:16'].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setAspectRatio(ratio);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    aspectRatio === ratio
                      ? 'bg-fuchsia-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {ratio === '16:9' ? 'Horizontal (16:9)' : 'Vertical Story (9:16)'}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !selectedImage}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 text-white font-black text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Wand2 className="w-4 h-4 text-white" />}
              <span>{loading ? 'Generando Vídeo (Omni)...' : 'Animar a Vídeo'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {videoUrl && (
        <div className="bg-gradient-to-br from-purple-900/90 to-slate-900 border-2 border-fuchsia-500/50 p-6 rounded-3xl shadow-2xl space-y-4 text-center animate-fade-in">
          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
            ¡VÍDEO GENERADO CON ÉXITO!
          </span>

          <div className={`mx-auto overflow-hidden rounded-2xl border border-fuchsia-400/40 shadow-2xl ${aspectRatio === '9:16' ? 'max-w-[280px]' : 'max-w-md'}`}>
            <video src={videoUrl} controls autoPlay loop className="w-full h-auto object-cover" />
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <a
              href={videoUrl}
              download="RetoViral-Animated.mp4"
              className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 text-white font-black text-xs py-3 px-6 rounded-2xl shadow-xl transition-all"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Descargar Vídeo MP4</span>
            </a>
          </div>
        </div>
      )}

    </div>
  );
};
