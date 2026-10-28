import React, { useState } from 'react';
import { Radio, Mic, Volume2, Sparkles, PhoneCall, PhoneOff } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const LiveVoiceChat: React.FC = () => {
  const [inCall, setInCall] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    { sender: 'ai', text: '¡Hola! Soy tu coach de voz en vivo con Gemini 3.8 Live. ¿Listo para repasar tácticas para los retos de 30 segundos?' },
  ]);
  const [inputVal, setInputVal] = useState('');

  const toggleCall = () => {
    soundFx.playClick();
    const nextState = !inCall;
    setInCall(nextState);
    if (nextState) {
      soundFx.playFanfare();
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    soundFx.playClick();
    const userMsg = inputVal;
    setInputVal('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);

    // Simulate real-time live response
    setTimeout(() => {
      soundFx.playCorrect();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `¡Excelente punto sobre "${userMsg}"! En los retos de velocidad de 30 segundos, mantener la calma en los primeros 10 segundos asegura el 95% de éxito.`,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-[#270c47] to-[#120529] border border-pink-500/40 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-pink-500/20 rounded-2xl border border-pink-400/40 text-pink-400 shrink-0">
            <Radio className="w-8 h-8 text-pink-400 animate-pulse" />
          </div>

          <div>
            <span className="text-xs font-black text-pink-400 uppercase tracking-widest">
              GEMINI 3.8 LIVE API
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white font-['Outfit',sans-serif]">
              Conversación de Voz en Tiempo Real
            </h2>
            <p className="text-xs text-slate-300">
              Conéctate por voz de baja latencia con el asistente IA (`gemini-3.8-live`) para entrenar y debatir estrategias de retos virales.
            </p>
          </div>
        </div>
      </div>

      {/* Live Call Interface */}
      <div className="bg-slate-900/90 border border-purple-900/40 p-6 rounded-3xl shadow-xl space-y-6">
        
        {/* Status / Orb */}
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 ${
            inCall
              ? 'bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 shadow-2xl shadow-pink-500/50 animate-pulse'
              : 'bg-slate-800 border-2 border-slate-700 text-slate-500'
          }`}>
            {inCall ? <Volume2 className="w-12 h-12 text-white animate-bounce" /> : <Radio className="w-10 h-10 text-slate-500" />}
          </div>

          <div className="text-center">
            <h4 className="text-base font-bold text-white font-['Outfit',sans-serif]">
              {inCall ? '🔴 En llamada de voz activa (Gemini 3.8 Live)' : 'Llamada inactiva'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {inCall ? 'Escuchando y respondiendo en tiempo real...' : 'Presiona el botón para iniciar conversación'}
            </p>
          </div>

          <button
            onClick={toggleCall}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-xs shadow-xl transition-all active:scale-95 ${
              inCall
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/40'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-slate-950 shadow-emerald-500/30'
            }`}
          >
            {inCall ? <PhoneOff className="w-4 h-4" /> : <PhoneCall className="w-4 h-4" />}
            <span>{inCall ? 'Colgar Llamada Live' : 'Iniciar Llamada de Voz'}</span>
          </button>
        </div>

        {/* Chat / Transcript Stream */}
        {inCall && (
          <div className="space-y-3 pt-4 border-t border-purple-900/40 max-h-64 overflow-y-auto pr-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-pink-600 text-white rounded-br-none'
                      : 'bg-purple-950/80 text-slate-200 border border-purple-500/30 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            <form onSubmit={handleSend} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Escribe o habla con tu coach de voz..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 bg-slate-950 border border-purple-800/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-pink-500"
              />
              <button
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md"
              >
                Enviar
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
};
