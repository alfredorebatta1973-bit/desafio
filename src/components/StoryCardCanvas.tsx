import React, { useEffect, useRef } from 'react';
import { Download, Share2, Copy, Check } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface StoryCardCanvasProps {
  challengeTitle: string;
  score: number;
  maxScore: number;
  grade: string;
  percentileRank: number;
  userName: string;
  userHandle: string;
  aiRoast?: string;
  aiTitle?: string;
  onShareCompleted?: () => void;
}

export const StoryCardCanvas: React.FC<StoryCardCanvasProps> = ({
  challengeTitle,
  score,
  maxScore,
  grade,
  percentileRank,
  userName,
  userHandle,
  aiRoast,
  aiTitle,
  onShareCompleted,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas size: 1080 x 1920 (9:16 Instagram / TikTok Story Format)
    canvas.width = 1080;
    canvas.height = 1920;

    // 1. Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGradient.addColorStop(0, '#0b0716');
    bgGradient.addColorStop(0.4, '#1a0b36');
    bgGradient.addColorStop(0.8, '#2a0845');
    bgGradient.addColorStop(1, '#0f051d');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // Decorative Glowing Orbs
    const orb1 = ctx.createRadialGradient(200, 300, 50, 200, 300, 400);
    orb1.addColorStop(0, 'rgba(255, 0, 127, 0.3)');
    orb1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = orb1;
    ctx.beginPath();
    ctx.arc(200, 300, 400, 0, Math.PI * 2);
    ctx.fill();

    const orb2 = ctx.createRadialGradient(880, 1400, 50, 880, 1400, 500);
    orb2.addColorStop(0, 'rgba(0, 242, 254, 0.25)');
    orb2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = orb2;
    ctx.beginPath();
    ctx.arc(880, 1400, 500, 0, Math.PI * 2);
    ctx.fill();

    // 2. Header Brand Logo
    ctx.fillStyle = '#ff007f';
    ctx.font = '900 64px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔥 RETO VIRAL', 540, 160);

    ctx.fillStyle = '#a855f7';
    ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Desafíos de 30 Segundos entre Amigos', 540, 220);

    // 3. Card Frame Container
    const cardX = 90;
    const cardY = 300;
    const cardW = 900;
    const cardH = 1380;
    const cornerRadius = 48;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.4)';
    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, cornerRadius);
    ctx.fill();
    ctx.stroke();

    // Challenge Title Banner
    ctx.fillStyle = '#00f2fe';
    ctx.font = '800 42px "Outfit", sans-serif';
    ctx.fillText(challengeTitle.toUpperCase(), 540, 390);

    // Percentile Hook
    ctx.fillStyle = '#ffd700';
    ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`⚡ Solo el ${(100 - percentileRank).toFixed(1)}% logra este nivel`, 540, 460);

    // 4. Score Circle / Big Badge
    const circleX = 540;
    const circleY = 680;
    const circleR = 170;

    const ringGradient = ctx.createLinearGradient(370, 510, 710, 850);
    ringGradient.addColorStop(0, '#ff007f');
    ringGradient.addColorStop(0.5, '#00f2fe');
    ringGradient.addColorStop(1, '#00ff87');

    ctx.lineWidth = 18;
    ctx.strokeStyle = ringGradient;
    ctx.beginPath();
    ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2);
    ctx.stroke();

    // Grade Text in Circle
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 120px "Outfit", sans-serif';
    ctx.fillText(score.toString(), 540, 680);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`de ${maxScore} pts`, 540, 730);

    // Grade Badge Pill
    ctx.fillStyle = '#ff007f';
    ctx.beginPath();
    ctx.roundRect(540 - 120, 890, 240, 70, 35);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 40px "Outfit", sans-serif';
    ctx.fillText(`GRADO ${grade}`, 540, 940);

    // 5. AI Roast / Praise Quote Box
    if (aiRoast) {
      const quoteX = 140;
      const quoteY = 1010;
      const quoteW = 800;
      const quoteH = 260;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(quoteX, quoteY, quoteW, quoteH, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f472b6';
      ctx.font = '800 30px "Outfit", sans-serif';
      ctx.fillText(`"${aiTitle || 'Evaluación del Reto'}"`, 540, 1060);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '500 32px "Plus Jakarta Sans", sans-serif';

      // Simple word wrapping for roast text
      const words = aiRoast.split(' ');
      let line = '';
      let y = 1120;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 720 && n > 0) {
          ctx.fillText(line, 540, y);
          line = words[n] + ' ';
          y += 42;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 540, y);
    }

    // 6. User Profile Lockup
    ctx.fillStyle = '#00f2fe';
    ctx.font = '800 42px "Outfit", sans-serif';
    ctx.fillText(`Jugador: ${userName}`, 540, 1360);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${userHandle} · ¿Puedes superarme?`, 540, 1410);

    // 7. Call To Action Footer
    ctx.fillStyle = '#00ff87';
    ctx.font = '900 46px "Outfit", sans-serif';
    ctx.fillText('👉 ¿Puedes superar mi puntuación? 👈', 540, 1540);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Entra gratis y acepta el desafío en RETO VIRAL', 540, 1600);

    // App URL at bottom
    ctx.fillStyle = '#64748b';
    ctx.font = '500 28px monospace';
    ctx.fillText(window.location.host || 'retoviral.app', 540, 1800);

  }, [challengeTitle, score, maxScore, grade, percentileRank, userName, userHandle, aiRoast, aiTitle]);

  const handleDownload = () => {
    soundFx.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `RetoViral-${challengeTitle.replace(/\s+/g, '_')}-${score}pts.png`;
    link.href = dataUrl;
    link.click();

    if (onShareCompleted) onShareCompleted();
  };

  const handleCopyLink = () => {
    soundFx.playClick();
    const shareUrl = `${window.location.origin}?challenge=${challengeTitle}&score=${score}&ref=${encodeURIComponent(userName)}`;
    const text = `🔥 ¡Obtuve ${score} pts en "${challengeTitle}" en RETO VIRAL! Solo el ${(100 - percentileRank).toFixed(1)}% logra esta puntuación. ¿Te atreves a superarme? 👇\n${shareUrl}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    if (onShareCompleted) onShareCompleted();
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-slate-900/90 border border-purple-800/40 p-5 rounded-2xl shadow-xl">
      <div className="text-center">
        <h4 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
          Tarjeta Gráfica para Instagram & TikTok Stories
        </h4>
        <p className="text-xs text-slate-400 mt-0.5">
          Descarga la imagen formateada en 9:16 o copia el texto de desafío directo.
        </p>
      </div>

      {/* Hidden high-res canvas render + preview scaled */}
      <div className="relative group overflow-hidden rounded-xl border border-pink-500/30 max-w-[240px] shadow-2xl">
        <canvas
          ref={canvasRef}
          className="w-full h-auto object-contain rounded-xl"
          style={{ aspectRatio: '9/16' }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="text-xs font-bold text-white bg-pink-600/90 px-3 py-1.5 rounded-full shadow-md">
            9:16 Formato HD
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          Descargar para Story
        </button>

        <button
          onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-bold py-2.5 px-4 rounded-xl transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              ¡Copiado al Portapapeles!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-cyan-400" />
              Copiar Enlace de Reto
            </>
          )}
        </button>
      </div>
    </div>
  );
};
