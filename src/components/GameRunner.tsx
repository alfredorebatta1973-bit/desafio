import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, Zap, CheckCircle, AlertTriangle, RefreshCw, Flame, Award } from 'lucide-react';
import { Challenge, GameResult } from '../types/game';
import { soundFx } from '../utils/audio';

interface GameRunnerProps {
  challenge: Challenge;
  onFinish: (result: GameResult) => void;
  onClose: () => void;
}

export const GameRunner: React.FC<GameRunnerProps> = ({ challenge, onFinish, onClose }) => {
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'finished'>('countdown');
  const [startCountdown, setStartCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(challenge.durationSeconds);
  const [score, setScore] = useState(0);
  const [clicksCount, setClicksCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Challenge specific states
  const [ninjaStage, setNinjaStage] = useState<'waiting' | 'ready' | 'clicked'>('waiting');
  const [ninjaStartTime, setNinjaStartTime] = useState<number | null>(null);
  const [reactionTimeMs, setReactionTimeMs] = useState<number | null>(null);

  // Eagle Eye / Grid states
  const [gridSize, setGridSize] = useState(3);
  const [oddIndex, setOddIndex] = useState(0);
  const [baseHue, setBaseHue] = useState(200);

  // Math Blitz / AI Questions
  const [mathProblem, setMathProblem] = useState({ q: '8 + 7 × 2', options: ['22', '30', '26', '16'], ans: '22' });

  // Stroop
  const [stroopWord, setStroopWord] = useState({ text: 'ROJO', colorClass: 'text-blue-500', correctColor: 'Azul' });

  // Precision Slider
  const [sliderPos, setSliderPos] = useState(10);
  const [sliderDir, setSliderDir] = useState(1);

  // Ghost Timer
  const [ghostStartTime, setGhostStartTime] = useState<number | null>(null);
  const [ghostStoppedTime, setGhostStoppedTime] = useState<number | null>(null);

  // Supra Sort (1-10)
  const [nextNumberNeeded, setNextNumberNeeded] = useState(1);
  const [shuffledNumbers, setShuffledNumbers] = useState<number[]>([]);

  // Card Pairs
  const [cards, setCards] = useState<{ id: number; icon: string; flipped: boolean; matched: boolean }[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  // Tap Balance
  const [balanceVal, setBalanceVal] = useState(50); // 0 to 100

  // Defuse Bomb
  const [wires, setWires] = useState<{ color: string; cut: boolean }[]>([
    { color: 'Rojo', cut: false },
    { color: 'Azul', cut: false },
    { color: 'Verde', cut: false },
    { color: 'Amarillo', cut: false },
  ]);
  const [bombRule, setBombRule] = useState('Corta el cable que NO sea azul y NO esté al final');

  // Pitch Perfect sound
  const [pitchTones, setPitchTones] = useState<number[]>([]);
  const [highestToneIdx, setHighestToneIdx] = useState(0);

  const timerRef = useRef<any>(null);
  const sliderIntervalRef = useRef<any>(null);

  // 1. Initial Start Countdown
  useEffect(() => {
    let count = 3;
    soundFx.playTick();
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setStartCountdown(count);
        soundFx.playTick();
      } else {
        clearInterval(interval);
        setGameState('playing');
        soundFx.playCorrect();
        initGameMechanics();
      }
    }, 900);

    return () => clearInterval(interval);
  }, []);

  // 2. Play Countdown Timer
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishGame();
            return 0;
          }
          if (prev <= 5) soundFx.playTickUrgent();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  // Initialize game specific boards
  const initGameMechanics = () => {
    const gType = challenge.gameType;

    if (gType === 'ninja_reflex') {
      setNinjaStage('waiting');
      const delay = 1500 + Math.random() * 2500;
      setTimeout(() => {
        setNinjaStage('ready');
        setNinjaStartTime(Date.now());
      }, delay);
    } else if (gType === 'eagle_eye' || gType === 'emoji_odd' || gType === 'spot_twin') {
      setupEagleEyeGrid(3);
    } else if (gType === 'math_blitz' || gType === 'reverse_words' || gType === 'anagram_dash' || gType === 'missing_symbol' || gType === 'speed_read') {
      generateMathProblem();
    } else if (gType === 'color_illusion') {
      generateStroop();
    } else if (gType === 'precision_slider') {
      sliderIntervalRef.current = setInterval(() => {
        setSliderPos((prev) => {
          if (prev >= 90) setSliderDir(-1);
          if (prev <= 10) setSliderDir(1);
          return prev + sliderDir * 4;
        });
      }, 30);
    } else if (gType === 'ghost_timer') {
      setGhostStartTime(Date.now());
    } else if (gType === 'supra_sort') {
      const nums = Array.from({ length: 10 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
      setShuffledNumbers(nums);
      setNextNumberNeeded(1);
    } else if (gType === 'card_pairs') {
      const icons = ['🔥', '⚡', '👑', '💎'];
      const deck = [...icons, ...icons]
        .sort(() => Math.random() - 0.5)
        .map((icon, idx) => ({ id: idx, icon, flipped: false, matched: false }));
      setCards(deck);
    } else if (gType === 'pitch_perfect') {
      generatePitchTones();
    }
  };

  // Helper generators
  const setupEagleEyeGrid = (size: number) => {
    setGridSize(size);
    const total = size * size;
    setOddIndex(Math.floor(Math.random() * total));
    setBaseHue(Math.floor(Math.random() * 360));
  };

  const generateMathProblem = () => {
    if (challenge.aiCustomData) {
      setMathProblem({
        q: challenge.aiCustomData.question || '¿Cuánto es 15 + 25?',
        options: challenge.aiCustomData.options || ['35', '40', '45', '50'],
        ans: challenge.aiCustomData.correctAnswer || '40',
      });
      return;
    }

    const n1 = Math.floor(Math.random() * 20) + 5;
    const n2 = Math.floor(Math.random() * 12) + 2;
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let ans = 0;

    if (op === '+') ans = n1 + n2;
    if (op === '-') ans = n1 - n2;
    if (op === '×') ans = n1 * n2;

    const opts = [
      ans.toString(),
      (ans + 3).toString(),
      (ans - 2).toString(),
      (ans + 5).toString(),
    ].sort(() => Math.random() - 0.5);

    setMathProblem({
      q: `¿Cuánto es ${n1} ${op} ${n2}?`,
      options: opts,
      ans: ans.toString(),
    });
  };

  const generateStroop = () => {
    const colors = [
      { name: 'Rojo', class: 'text-red-500' },
      { name: 'Azul', class: 'text-blue-500' },
      { name: 'Verde', class: 'text-emerald-500' },
      { name: 'Amarillo', class: 'text-yellow-400' },
    ];
    const textIdx = Math.floor(Math.random() * colors.length);
    let colorIdx = Math.floor(Math.random() * colors.length);
    while (colorIdx === textIdx) colorIdx = Math.floor(Math.random() * colors.length);

    setStroopWord({
      text: colors[textIdx].name,
      colorClass: colors[colorIdx].class,
      correctColor: colors[colorIdx].name,
    });
  };

  const generatePitchTones = () => {
    const freqs = [350, 480, 620].sort(() => Math.random() - 0.5);
    setPitchTones(freqs);
    const max = Math.max(...freqs);
    setHighestToneIdx(freqs.indexOf(max));
  };

  // Game Handlers
  const handleNinjaTap = () => {
    if (ninjaStage === 'waiting') {
      soundFx.playWrong();
      setWrongCount((prev) => prev + 1);
      alert('¡Muy pronto! Espera a que la pantalla cambie a color VERDE.');
      setNinjaStage('waiting');
      return;
    }

    if (ninjaStage === 'ready' && ninjaStartTime) {
      const ms = Date.now() - ninjaStartTime;
      setReactionTimeMs(ms);
      soundFx.playCorrect();
      setNinjaStage('clicked');

      // Score based on reaction time: < 200ms = 990, < 250ms = 920, etc.
      let pts = Math.max(100, Math.floor(1000 - ms * 1.5));
      setScore(pts);
      setCorrectCount(1);
      setTimeout(() => finishGame(pts, ms), 800);
    }
  };

  const handleEagleTileClick = (idx: number) => {
    if (idx === oddIndex) {
      soundFx.playCorrect();
      setScore((prev) => prev + 100);
      setCorrectCount((prev) => prev + 1);
      setupEagleEyeGrid(Math.min(6, gridSize + 1));
    } else {
      soundFx.playWrong();
      setWrongCount((prev) => prev + 1);
    }
  };

  const handleSpeedTap = () => {
    soundFx.playClick();
    setClicksCount((prev) => prev + 1);
    setScore((prev) => prev + 15);
  };

  const handleMathChoice = (opt: string) => {
    if (opt === mathProblem.ans) {
      soundFx.playCorrect();
      setScore((prev) => prev + 120);
      setCorrectCount((prev) => prev + 1);
      generateMathProblem();
    } else {
      soundFx.playWrong();
      setWrongCount((prev) => prev + 1);
      generateMathProblem();
    }
  };

  const handleStroopChoice = (chosenColor: string) => {
    if (chosenColor === stroopWord.correctColor) {
      soundFx.playCorrect();
      setScore((prev) => prev + 110);
      setCorrectCount((prev) => prev + 1);
      generateStroop();
    } else {
      soundFx.playWrong();
      setWrongCount((prev) => prev + 1);
      generateStroop();
    }
  };

  const handleStopSlider = () => {
    clearInterval(sliderIntervalRef.current);
    const diff = Math.abs(sliderPos - 50);
    const pts = Math.max(50, Math.floor(1000 - diff * 20));
    soundFx.playFanfare();
    setScore(pts);
    setCorrectCount(1);
    setTimeout(() => finishGame(pts), 1000);
  };

  const handleStopGhostTimer = () => {
    if (!ghostStartTime) return;
    const elapsed = (Date.now() - ghostStartTime) / 1000;
    setGhostStoppedTime(elapsed);
    const diff = Math.abs(elapsed - 10.0);

    let pts = Math.max(0, Math.floor(1000 - diff * 300));
    soundFx.playFanfare();
    setScore(pts);
    setCorrectCount(1);
    setTimeout(() => finishGame(pts), 1200);
  };

  const handleSupraSortClick = (num: number) => {
    if (num === nextNumberNeeded) {
      soundFx.playCorrect();
      if (nextNumberNeeded === 10) {
        soundFx.playFanfare();
        const pts = Math.floor(1000 - (12 - timeLeft) * 50);
        setScore(pts);
        setCorrectCount(10);
        setTimeout(() => finishGame(pts), 800);
      } else {
        setNextNumberNeeded((prev) => prev + 1);
      }
    } else {
      soundFx.playWrong();
      setWrongCount((prev) => prev + 1);
    }
  };

  const handleCardClick = (id: number) => {
    if (selectedCards.length === 2 || cards[id].flipped || cards[id].matched) return;

    soundFx.playClick();
    const updated = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    setCards(updated);
    const newSelected = [...selectedCards, id];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (cards[first].icon === cards[second].icon) {
        soundFx.playCorrect();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === first || c.id === second ? { ...c, matched: true } : c))
          );
          setSelectedCards([]);
          setScore((s) => s + 250);

          // Check if all matched
          const remaining = cards.filter((c) => !c.matched && c.id !== first && c.id !== second);
          if (remaining.length === 0) {
            soundFx.playFanfare();
            setTimeout(() => finishGame(1000), 800);
          }
        }, 400);
      } else {
        soundFx.playWrong();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === first || c.id === second ? { ...c, flipped: false } : c))
          );
          setSelectedCards([]);
        }, 800);
      }
    }
  };

  const handleCutWire = (idx: number) => {
    soundFx.playClick();
    if (idx === 1) { // Correct wire according to rule "NO sea azul y NO al final" -> Verde
      soundFx.playFanfare();
      setScore(950);
      setCorrectCount(1);
      setTimeout(() => finishGame(950), 800);
    } else {
      soundFx.playWrong();
      alert('💥 ¡BOOM! Cortaste el cable equivocado.');
      finishGame(150);
    }
  };

  // Finish Game logic
  const finishGame = (finalPts?: number, reactionMs?: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (sliderIntervalRef.current) clearInterval(sliderIntervalRef.current);

    const calcScore = finalPts !== undefined ? finalPts : score;
    const totalAttempts = correctCount + wrongCount;
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;

    let grade: 'S+' | 'A' | 'B' | 'C' | 'D' = 'C';
    if (calcScore >= challenge.targetScoreForA) grade = 'S+';
    else if (calcScore >= challenge.targetScoreForA * 0.8) grade = 'A';
    else if (calcScore >= challenge.targetScoreForA * 0.6) grade = 'B';
    else if (calcScore >= challenge.targetScoreForA * 0.4) grade = 'C';
    else grade = 'D';

    // Calculate Percentile
    const percentile = Math.min(99.5, Math.max(20, Math.floor((calcScore / 1000) * 100)));

    const result: GameResult = {
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      score: calcScore,
      maxPossibleScore: 1000,
      reactionTimeMs: reactionMs || reactionTimeMs || undefined,
      accuracyPercent: accuracy,
      grade,
      percentileRank: percentile,
      completedAt: new Date().toISOString(),
    };

    setGameState('finished');
    onFinish(result);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#110926] border border-pink-500/40 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[500px]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-4">
          <div>
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
              {challenge.category}
            </span>
            <h3 className="text-xl font-black text-white font-['Outfit',sans-serif]">
              {challenge.title}
            </h3>
          </div>

          <button
            onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              if (sliderIntervalRef.current) clearInterval(sliderIntervalRef.current);
              onClose();
            }}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game State: COUNTDOWN */}
        {gameState === 'countdown' && (
          <div className="flex flex-col items-center justify-center my-auto py-12 text-center space-y-4">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest animate-pulse">
              ¡Prepárate! El reto comienza en...
            </span>
            <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-amber-400 font-['Outfit',sans-serif] animate-bounce">
              {startCountdown}
            </div>
            <p className="text-sm text-slate-300 max-w-xs italic">
              "{challenge.description}"
            </p>
          </div>
        )}

        {/* Game State: PLAYING */}
        {gameState === 'playing' && (
          <div className="flex flex-col items-center justify-between flex-1 py-4 space-y-6">
            
            {/* Timer & Score HUD */}
            <div className="w-full flex items-center justify-between bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-purple-800/40">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="text-lg font-black text-amber-300 font-mono">
                  {timeLeft}s
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-pink-500" />
                <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 font-mono">
                  {score} pts
                </span>
              </div>
            </div>

            {/* 1. NINJA REFLEX */}
            {challenge.gameType === 'ninja_reflex' && (
              <div
                onClick={handleNinjaTap}
                className={`w-full h-64 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none shadow-2xl ${
                  ninjaStage === 'waiting'
                    ? 'bg-rose-900/80 border-4 border-rose-500'
                    : ninjaStage === 'ready'
                    ? 'bg-emerald-500 border-4 border-emerald-300 animate-pulse'
                    : 'bg-cyan-600 border-4 border-cyan-300'
                }`}
              >
                {ninjaStage === 'waiting' && (
                  <p className="text-xl font-black text-white text-center px-4">
                    NO TOCAR AÚN...<br />
                    <span className="text-xs font-semibold text-rose-200">Espera a que cambie a VERDE</span>
                  </p>
                )}
                {ninjaStage === 'ready' && (
                  <p className="text-3xl font-black text-slate-950 text-center animate-bounce">
                    ¡¡TOCA YA YA YA!! ⚡
                  </p>
                )}
                {ninjaStage === 'clicked' && (
                  <p className="text-2xl font-black text-white text-center">
                    ¡Tiempo de Reacción!<br />
                    <span className="text-4xl text-amber-300 font-mono">{reactionTimeMs} ms</span>
                  </p>
                )}
              </div>
            )}

            {/* 2. EAGLE EYE / EMOJI ODD */}
            {(challenge.gameType === 'eagle_eye' || challenge.gameType === 'emoji_odd' || challenge.gameType === 'spot_twin') && (
              <div className="w-full space-y-3">
                <p className="text-xs text-center text-slate-300 font-semibold">
                  Toca el recuadro que tiene una tonalidad o símbolo diferente:
                </p>

                <div
                  className="grid gap-2 w-full max-w-xs mx-auto aspect-square p-2 bg-slate-900/90 rounded-2xl border border-purple-800/40"
                  style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: gridSize * gridSize }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleEagleTileClick(idx)}
                      className="rounded-xl transition-all active:scale-95 flex items-center justify-center text-2xl font-black shadow-md"
                      style={{
                        backgroundColor:
                          challenge.gameType === 'emoji_odd'
                            ? undefined
                            : idx === oddIndex
                            ? `hsl(${baseHue}, 75%, 62%)`
                            : `hsl(${baseHue}, 75%, 52%)`,
                      }}
                    >
                      {challenge.gameType === 'emoji_odd' && (idx === oddIndex ? '😁' : '😀')}
                      {challenge.gameType === 'spot_twin' && (idx === oddIndex ? '⭐' : '🌟')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SPEED TAP */}
            {challenge.gameType === 'speed_tap' && (
              <div className="w-full flex flex-col items-center gap-4">
                <button
                  onClick={handleSpeedTap}
                  className="w-48 h-48 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-black text-2xl shadow-2xl shadow-pink-500/40 border-4 border-pink-300 active:scale-90 transition-transform flex flex-col items-center justify-center gap-1"
                >
                  <Zap className="w-8 h-8 fill-white" />
                  <span>¡TAP AHORA!</span>
                  <span className="text-xs text-pink-200">{clicksCount} Taps</span>
                </button>
              </div>
            )}

            {/* 4. MATH BLITZ / REVERSE WORDS / CUSTOM AI */}
            {(challenge.gameType === 'math_blitz' || challenge.gameType === 'reverse_words' || challenge.gameType === 'anagram_dash' || challenge.gameType === 'missing_symbol' || challenge.gameType === 'speed_read') && (
              <div className="w-full space-y-4 text-center">
                <div className="bg-purple-950/60 border border-purple-500/40 p-5 rounded-2xl">
                  <h4 className="text-2xl font-black text-white font-['Outfit',sans-serif]">
                    {mathProblem.q}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {mathProblem.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleMathChoice(opt)}
                      className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-purple-600/80 text-white font-bold text-base border border-purple-700/40 hover:border-pink-400 active:scale-95 transition-all shadow-md"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 5. COLOR ILLUSION (STROOP) */}
            {challenge.gameType === 'color_illusion' && (
              <div className="w-full space-y-6 text-center">
                <p className="text-xs text-slate-300 font-semibold">
                  Toca el botón con el color del TEXTO (¡ignora la palabra!):
                </p>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <span className={`text-4xl font-black tracking-widest ${stroopWord.colorClass}`}>
                    {stroopWord.text}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {['Rojo', 'Azul', 'Verde', 'Amarillo'].map((colorName) => (
                    <button
                      key={colorName}
                      onClick={() => handleStroopChoice(colorName)}
                      className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm border border-slate-700 active:scale-95 transition-all"
                    >
                      {colorName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 6. PRECISION SLIDER */}
            {challenge.gameType === 'precision_slider' && (
              <div className="w-full space-y-6 text-center">
                <p className="text-xs text-slate-300 font-semibold">
                  Detén el indicador justo en el objetivo verde del medio:
                </p>

                <div className="relative w-full h-12 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex items-center p-1">
                  {/* Center Target Zone */}
                  <div className="absolute left-[45%] right-[45%] top-0 bottom-0 bg-emerald-500/40 border-x-2 border-emerald-400 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                    OBJETIVO
                  </div>

                  {/* Slider Pin */}
                  <div
                    className="absolute top-1 bottom-1 w-4 bg-pink-500 rounded-md shadow-lg shadow-pink-500/80 transition-all duration-75"
                    style={{ left: `${sliderPos}%` }}
                  />
                </div>

                <button
                  onClick={handleStopSlider}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-lg rounded-2xl shadow-xl active:scale-95 transition-transform"
                >
                  ¡DETENER AHORA!
                </button>
              </div>
            )}

            {/* 7. GHOST TIMER (10.00s) */}
            {challenge.gameType === 'ghost_timer' && (
              <div className="w-full space-y-6 text-center">
                <p className="text-xs text-slate-300 font-semibold">
                  Presiona STOP exactamente a los 10.00 segundos (reloj oculto tras los 5s):
                </p>

                <div className="bg-slate-950 p-8 rounded-3xl border border-purple-800/40">
                  <span className="text-5xl font-black font-mono text-pink-400">
                    {ghostStoppedTime !== null
                      ? `${ghostStoppedTime.toFixed(2)}s`
                      : timeLeft > 7
                      ? `${(12 - timeLeft).toFixed(2)}s`
                      : '?? . ?? s'}
                  </span>
                </div>

                <button
                  onClick={handleStopGhostTimer}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 text-white font-black text-lg rounded-2xl shadow-xl active:scale-95 transition-transform"
                >
                  ¡PARAR RELOJ!
                </button>
              </div>
            )}

            {/* 8. SUPRA SORT 1-10 */}
            {challenge.gameType === 'supra_sort' && (
              <div className="w-full space-y-4 text-center">
                <p className="text-xs text-slate-300 font-semibold">
                  Toca el número <span className="text-pink-400 font-extrabold text-sm">{nextNumberNeeded}</span> en orden ascendente:
                </p>

                <div className="grid grid-cols-5 gap-2">
                  {shuffledNumbers.map((num) => (
                    <button
                      key={num}
                      onClick={() => handleSupraSortClick(num)}
                      className={`h-16 rounded-xl font-black text-xl border transition-all active:scale-90 ${
                        num < nextNumberNeeded
                          ? 'bg-slate-800/40 text-slate-600 border-slate-800 pointer-events-none'
                          : 'bg-purple-900/60 hover:bg-pink-600 text-white border-purple-500/40'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 9. CARD PAIRS */}
            {challenge.gameType === 'card_pairs' && (
              <div className="w-full space-y-3 text-center">
                <p className="text-xs text-slate-300 font-semibold">
                  Encuentra las 4 parejas volteando las cartas:
                </p>

                <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto">
                  {cards.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCardClick(c.id)}
                      className={`h-20 rounded-xl font-black text-2xl border transition-all duration-300 flex items-center justify-center ${
                        c.flipped || c.matched
                          ? 'bg-purple-600 text-white border-pink-400'
                          : 'bg-slate-800 hover:bg-slate-700 border-slate-700'
                      }`}
                    >
                      {c.flipped || c.matched ? c.icon : '❓'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 10. DEFUSE BOMB */}
            {challenge.gameType === 'defuse_bomb' && (
              <div className="w-full space-y-4 text-center">
                <div className="bg-red-950/80 border border-red-500/50 p-4 rounded-2xl text-xs font-bold text-red-200">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  REGLA: {bombRule}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {wires.map((w, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCutWire(idx)}
                      className="py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-red-600/80 text-white font-extrabold text-sm border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <span>✂️ Cable {w.color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* FALLBACK GENERIC PLAY */}
            {!['ninja_reflex', 'eagle_eye', 'emoji_odd', 'spot_twin', 'speed_tap', 'math_blitz', 'reverse_words', 'color_illusion', 'precision_slider', 'ghost_timer', 'supra_sort', 'card_pairs', 'defuse_bomb'].includes(challenge.gameType) && (
              <div className="w-full space-y-4 text-center">
                <p className="text-sm text-slate-300">
                  {challenge.description}
                </p>

                <button
                  onClick={() => {
                    soundFx.playCorrect();
                    setScore((s) => s + 150);
                    setCorrectCount((c) => c + 1);
                  }}
                  className="w-full py-8 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-2xl rounded-2xl shadow-xl active:scale-95 transition-transform"
                >
                  ¡ACEPTAR ACCIÓN RETO! (+150 pts)
                </button>
              </div>
            )}

          </div>
        )}

        {/* Footer info */}
        <div className="pt-3 border-t border-purple-900/30 text-center text-[11px] text-slate-500">
          RETO VIRAL Engine v1.0 · Puntuación en tiempo real
        </div>

      </div>
    </div>
  );
};
