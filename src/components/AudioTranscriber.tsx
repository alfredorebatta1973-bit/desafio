import React, { useState, useRef } from 'react';
import { Mic, MicOff, Sparkles, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const AudioTranscriber: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    soundFx.playClick();
    setTranscript(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          await sendAudioForTranscription(base64Audio);
        };
        reader.readAsDataURL(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert('No se pudo acceder al micrófono. Verifica los permisos del navegador.');
    }
  };

  const stopRecording = () => {
    soundFx.playClick();
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    setIsRecording(false);
  };

  const sendAudioForTranscription = async (base64Audio: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Audio, mimeType: 'audio/webm' }),
      });
      const data = await response.json();
      setTranscript(data.transcript || 'Transcripción completada.');
      soundFx.playFanfare();
    } catch (err) {
      console.error(err);
      alert('Error al transcribir el audio con Gemini 3.5 Transcribe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-[#1c0836] to-[#0d0321] border border-cyan-500/40 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-cyan-500/20 rounded-2xl border border-cyan-400/40 text-cyan-400 shrink-0">
            <Mic className="w-8 h-8 text-cyan-400" />
          </div>

          <div>
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">
              GEMINI 3.5 TRANSCRIBE API
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white font-['Outfit',sans-serif]">
              Transcriptor de Audio por Micrófono
            </h2>
            <p className="text-xs text-slate-300">
              Graba tu voz hablando sobre tus estrategias en los retos virales y obtén una transcripción instantánea de alta precisión.
            </p>
          </div>
        </div>
      </div>

      {/* Recorder Box */}
      <div className="bg-slate-900/90 border border-purple-900/40 p-8 rounded-3xl shadow-xl text-center space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/50 border-4 border-rose-300'
                : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-cyan-500/30 hover:scale-105'
            }`}
          >
            {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>

          <p className="text-sm font-bold text-white">
            {isRecording ? '🔴 Grabando voz... Toca para detener' : 'Toca el micrófono para comenzar a hablar'}
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 text-cyan-400 font-bold text-xs py-4">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Transcribiendo audio con Gemini 3.5 Transcribe...</span>
          </div>
        )}
      </div>

      {/* Transcript Result */}
      {transcript && (
        <div className="bg-gradient-to-br from-purple-900/90 to-slate-900 border-2 border-cyan-500/50 p-6 rounded-3xl shadow-2xl space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-black text-cyan-400 uppercase">
            <FileText className="w-4 h-4" />
            <span>Transcripción Oficial</span>
          </div>

          <p className="text-sm text-slate-100 bg-slate-950/80 p-5 rounded-2xl border border-purple-800/40 leading-relaxed font-medium">
            "{transcript}"
          </p>
        </div>
      )}

    </div>
  );
};
