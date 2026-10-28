import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Upload, Download, RefreshCw, Wand2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const ImageStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('A glowing cyberpunk champion trophy with neon wings and 3D floating stars');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

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

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    setLoading(true);

    try {
      const response = await fetch('/api/ai/image-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          base64Image: selectedImage,
          aspectRatio,
        }),
      });
      const data = await response.json();

      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        soundFx.playFanfare();
      } else {
        alert('No se pudo generar la imagen. Intenta con otro texto.');
      }
    } catch (err) {
      console.error(err);
      alert('Error al conectar con Gemini Nano Banana API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-[#1e0736] to-[#0f0521] border border-cyan-500/40 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-cyan-500/20 rounded-2xl border border-cyan-400/40 text-cyan-400 shrink-0">
            <ImageIcon className="w-8 h-8 text-cyan-400" />
          </div>

          <div>
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">
              GEMINI NANO BANANA 2.1 IMAGE STUDIO
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white font-['Outfit',sans-serif]">
              Creación y Edición de Imágenes IA
            </h2>
            <p className="text-xs text-slate-300">
              Genera ilustraciones fotorrealistas de alta resolución o sube una foto para editarla y añadirle elementos mágicos.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-slate-900/90 border border-purple-900/40 p-6 rounded-3xl shadow-xl space-y-4">
        <form onSubmit={handleGenerateImage} className="space-y-4">
          
          {/* Optional Reference Image Upload */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Imagen de referencia (Opcional para edición):
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl cursor-pointer text-xs font-bold transition-all">
                <Upload className="w-4 h-4" />
                <span>{selectedImage ? 'Cambiar Imagen' : 'Subir Foto'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {selectedImage && (
                <div className="flex items-center gap-2">
                  <img src={selectedImage} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-cyan-400" />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-bold"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {selectedImage ? 'Instrucción de edición:' : 'Descripción de la imagen:'}
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-purple-800/40 rounded-xl p-4 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition-colors resize-none"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">Relación de aspecto:</span>
              {['1:1', '16:9', '9:16', '3:4', '4:3'].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setAspectRatio(ratio);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    aspectRatio === ratio
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Wand2 className="w-4 h-4 text-slate-950" />}
              <span>{loading ? 'Generando 1K...' : 'Generar con Banana AI'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {generatedImageUrl && (
        <div className="bg-gradient-to-br from-purple-900/90 to-slate-900 border-2 border-cyan-500/50 p-6 rounded-3xl shadow-2xl space-y-4 text-center animate-fade-in">
          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
            ¡IMAGEN CREADA CON ÉXITO!
          </span>

          <div className="max-w-md mx-auto overflow-hidden rounded-2xl border border-cyan-400/40 shadow-2xl">
            <img src={generatedImageUrl} alt="Generated AI" className="w-full h-auto object-cover" />
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <a
              href={generatedImageUrl}
              download="RetoViral-AI-Art.png"
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 text-slate-950 font-black text-xs py-3 px-6 rounded-2xl shadow-xl transition-all"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Descargar Imagen HD</span>
            </a>
          </div>
        </div>
      )}

    </div>
  );
};
