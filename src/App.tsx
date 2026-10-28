import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DailyChallengeBanner } from './components/DailyChallengeBanner';
import { FriendChallengeBanner } from './components/FriendChallengeBanner';
import { ChallengeCard } from './components/ChallengeCard';
import { GameRunner } from './components/GameRunner';
import { ResultModal } from './components/ResultModal';
import { AchievementsView } from './components/AchievementsView';
import { FriendsView } from './components/FriendsView';
import { SocialFeedView } from './components/SocialFeedView';
import { AiChallengeCreator } from './components/AiChallengeCreator';
import { StrategyModal } from './components/StrategyModal';
import { InteractiveWalkthrough } from './components/InteractiveWalkthrough';
import { Three3DScene } from './components/Three3DScene';
import { MusicGenerator } from './components/MusicGenerator';
import { ImageStudio } from './components/ImageStudio';
import { VideoAnimator } from './components/VideoAnimator';
import { AudioTranscriber } from './components/AudioTranscriber';
import { LiveVoiceChat } from './components/LiveVoiceChat';

import { INITIAL_CHALLENGES } from './data/challenges';
import { INITIAL_ACHIEVEMENTS } from './data/achievements';
import { INITIAL_FRIENDS, INITIAL_FEED } from './data/initialSocial';
import { Challenge, GameResult, Achievement, Friend, FeedItem, UserStats } from './types/game';
import { soundFx } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showStrategyModal, setShowStrategyModal] = useState<boolean>(false);

  // Walkthrough State
  const [showWalkthrough, setShowWalkthrough] = useState<boolean>(() => {
    const seen = localStorage.getItem('retoviral_seen_walkthrough');
    return !seen;
  });

  // Active Challenge Run
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [activeResult, setActiveResult] = useState<GameResult | null>(null);

  // Deep Link Direct Friend Challenge
  const [directFriendChallenge, setDirectFriendChallenge] = useState<{
    friendName: string;
    targetScore: number;
    challenge: Challenge;
  } | null>(null);

  // User Stats with LocalStorage Persistence
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('retoviral_userStats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Jugador Pro',
      handle: '@jugador1',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      level: 1,
      xp: 0,
      xpToNextLevel: 300,
      dailyStreak: 3,
      lastPlayedDate: new Date().toISOString().split('T')[0],
      totalGamesPlayed: 0,
      totalRetosCompleted: 0,
      friendsCount: 4,
      sharesCount: 0,
      challengesSentCount: 0,
      completedChallengeIds: [],
      highScores: {},
    };
  });

  // Achievements State
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('retoviral_achievements');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ACHIEVEMENTS;
  });

  // Friends State
  const [friends, setFriends] = useState<Friend[]>(() => {
    const saved = localStorage.getItem('retoviral_friends');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_FRIENDS;
  });

  // Social Feed State
  const [feedItems, setFeedItems] = useState<FeedItem[]>(() => {
    const saved = localStorage.getItem('retoviral_feed');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_FEED;
  });

  // Category Filter for 30 Challenges
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Sync LocalStorage
  useEffect(() => {
    localStorage.setItem('retoviral_userStats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('retoviral_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('retoviral_friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('retoviral_feed', JSON.stringify(feedItems));
  }, [feedItems]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const challengeParam = params.get('challenge');
    const scoreParam = params.get('score');
    const refParam = params.get('ref');

    if (challengeParam && scoreParam) {
      const found = INITIAL_CHALLENGES.find(
        (c) => c.title.toLowerCase() === challengeParam.toLowerCase() || c.id === Number(challengeParam)
      ) || INITIAL_CHALLENGES[0];

      setDirectFriendChallenge({
        friendName: refParam || 'Tu Amigo',
        targetScore: Number(scoreParam),
        challenge: found,
      });
    }
  }, []);

  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  const handleCompleteWalkthrough = () => {
    localStorage.setItem('retoviral_seen_walkthrough', 'true');
    setShowWalkthrough(false);
    setActiveTab('home');
  };

  const handleGameFinish = (result: GameResult) => {
    setActiveResult(result);

    const baseXP = Math.round(result.score / 2);
    const newXP = userStats.xp + baseXP;

    let newLevel = userStats.level;
    let nextXPThreshold = userStats.xpToNextLevel;

    if (newXP >= nextXPThreshold) {
      newLevel += 1;
      nextXPThreshold = newLevel * 350;
      soundFx.playFanfare();
    }

    const currentHighScore = userStats.highScores[result.challengeId] || 0;
    const isNewHighScore = result.score > currentHighScore;
    const updatedHighScores = {
      ...userStats.highScores,
      [result.challengeId]: Math.max(currentHighScore, result.score),
    };

    const isFirstTimeCompleted = !userStats.completedChallengeIds.includes(result.challengeId);
    const updatedCompletedIds = isFirstTimeCompleted
      ? [...userStats.completedChallengeIds, result.challengeId]
      : userStats.completedChallengeIds;

    setUserStats((prev) => ({
      ...prev,
      xp: newXP,
      level: newLevel,
      xpToNextLevel: nextXPThreshold,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      totalRetosCompleted: updatedCompletedIds.length,
      completedChallengeIds: updatedCompletedIds,
      highScores: updatedHighScores,
    }));

    setAchievements((prev) =>
      prev.map((ach) => {
        let newProgress = ach.progress;
        let unlocked = ach.unlocked;

        if (ach.id === 'first_play') {
          newProgress = 1;
          unlocked = true;
        } else if (ach.id === 'complete_5') {
          newProgress = updatedCompletedIds.length;
          if (newProgress >= 5) unlocked = true;
        } else if (ach.id === 'complete_15') {
          newProgress = updatedCompletedIds.length;
          if (newProgress >= 15) unlocked = true;
        } else if (ach.id === 'complete_all') {
          newProgress = updatedCompletedIds.length;
          if (newProgress >= 30) unlocked = true;
        } else if (ach.id === 'high_score_900') {
          if (result.score >= 900) {
            newProgress = 900;
            unlocked = true;
          }
        } else if (ach.id === 'ninja_200ms' && result.challengeId === 1) {
          if (result.reactionTimeMs && result.reactionTimeMs <= 210) {
            newProgress = 1;
            unlocked = true;
          }
        } else if (ach.id === 'perfect_accuracy') {
          if (result.accuracyPercent === 100) {
            newProgress = 1;
            unlocked = true;
          }
        } else if (ach.id === 'god_challenge' && result.challengeId === 30) {
          if (result.grade === 'S+') {
            newProgress = 1;
            unlocked = true;
          }
        }

        return { ...ach, progress: newProgress, unlocked };
      })
    );

    if (isNewHighScore && result.score > 700) {
      const newFeedPost: FeedItem = {
        id: `feed-${Date.now()}`,
        userId: 'user-self',
        userName: userStats.name,
        userHandle: userStats.handle,
        userAvatar: userStats.avatar,
        type: 'high_score',
        content: `¡Acaba de lograr un nuevo récord de ${result.score} pts en "${result.challengeTitle}"! 🔥`,
        challengeId: result.challengeId,
        challengeTitle: result.challengeTitle,
        score: result.score,
        timestamp: 'Ahora mismo',
        reactions: { fire: 1, zap: 1, laugh: 0, clap: 0 },
      };
      setFeedItems((prev) => [newFeedPost, ...prev]);
    }
  };

  const handleAddFriend = (handle: string, name: string) => {
    const newFriend: Friend = {
      id: `friend-${Date.now()}`,
      name,
      handle,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(handle)}`,
      status: 'online',
      level: 3,
      totalXP: 950,
      bestChallengeScore: {
        challengeId: 1,
        challengeTitle: 'Reflejos Ninja',
        score: 820,
      },
      isDirectFriend: true,
      lastActive: 'Ahora mismo',
    };

    setFriends((prev) => [newFriend, ...prev]);
    setUserStats((prev) => ({ ...prev, friendsCount: prev.friendsCount + 1 }));

    setAchievements((prev) =>
      prev.map((a) => {
        if (a.id === 'invite_3_friends') {
          const prog = Math.min(3, a.progress + 1);
          return { ...a, progress: prog, unlocked: prog >= 3 };
        }
        return a;
      })
    );
  };

  const handleSendChallenge = (friend: Friend, challenge: Challenge) => {
    setUserStats((prev) => ({
      ...prev,
      sharesCount: prev.sharesCount + 1,
      challengesSentCount: prev.challengesSentCount + 1,
    }));

    const text = `🔥 ¡Hola ${friend.name}! Te desafío oficialmente en "${challenge.title}" en RETO VIRAL. ¿Puedes superar mi nivel? 👇\n${window.location.origin}?challenge=${encodeURIComponent(challenge.title)}&score=850&ref=${encodeURIComponent(userStats.name)}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleFeedReaction = (feedId: string, reactionKey: 'fire' | 'zap' | 'laugh' | 'clap') => {
    setFeedItems((prev) =>
      prev.map((item) => {
        if (item.id === feedId) {
          return {
            ...item,
            reactions: {
              ...item.reactions,
              [reactionKey]: item.reactions[reactionKey] + 1,
            },
          };
        }
        return item;
      })
    );
  };

  const handlePostUserResult = (text: string) => {
    const newPost: FeedItem = {
      id: `feed-${Date.now()}`,
      userId: 'user-self',
      userName: userStats.name,
      userHandle: userStats.handle,
      userAvatar: userStats.avatar,
      type: 'high_score',
      content: text,
      timestamp: 'Ahora mismo',
      reactions: { fire: 1, zap: 0, laugh: 0, clap: 1 },
    };
    setFeedItems((prev) => [newPost, ...prev]);
  };

  const filteredChallenges = selectedCategory === 'Todos'
    ? INITIAL_CHALLENGES
    : INITIAL_CHALLENGES.filter((c) => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0b0716] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col justify-between">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userLevel={userStats.level}
        userXP={userStats.xp}
        dailyStreak={userStats.dailyStreak}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenStrategyModal={() => setShowStrategyModal(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 md:py-8 space-y-8">
        
        {/* TAB 1: HOME / RETO DEL DÍA */}
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in">
            
            {directFriendChallenge && (
              <FriendChallengeBanner
                friendName={directFriendChallenge.friendName}
                targetScore={directFriendChallenge.targetScore}
                challenge={directFriendChallenge.challenge}
                onAcceptChallenge={(c) => setActiveChallenge(c)}
              />
            )}

            <DailyChallengeBanner
              challenge={INITIAL_CHALLENGES[0]}
              onPlay={(c) => setActiveChallenge(c)}
              userHighScore={userStats.highScores[INITIAL_CHALLENGES[0].id]}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-white font-['Outfit',sans-serif] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
                  Retos Más Populares de la Semana
                </h3>

                <button
                  onClick={() => setActiveTab('challenges')}
                  className="text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors"
                >
                  Ver los 30 Retos →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {INITIAL_CHALLENGES.slice(0, 6).map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    highScore={userStats.highScores[challenge.id]}
                    onPlay={(c) => setActiveChallenge(c)}
                    onChallengeFriend={(c) => handleSendChallenge(friends[0], c)}
                  />
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: 30 RETOS LIBRARY */}
        {activeTab === 'challenges' && (
          <div className="space-y-6 animate-fade-in">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-black text-pink-400 uppercase tracking-widest">
                BIBLIOTECA COMPLETA DE DESAFÍOS
              </span>
              <h2 className="text-3xl font-black text-white font-['Outfit',sans-serif]">
                30 Retos de 30 Segundos
              </h2>
              <p className="text-xs text-slate-400">
                Elige tu categoría preferida, supera la puntuación requerida y desbloquea insignias exclusivas.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap pb-2">
              {[
                'Todos',
                'Reflejos & Velocidad',
                'Visual & Percepción',
                'Memoria & Secuencia',
                'Lógica & Cálculo',
                'Precisión & Enfoque',
                'Nivel Épico',
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-purple-900/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  highScore={userStats.highScores[challenge.id]}
                  onPlay={(c) => setActiveChallenge(c)}
                  onChallengeFriend={(c) => handleSendChallenge(friends[0], c)}
                />
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: LOGROS & PUNTOS */}
        {activeTab === 'achievements' && (
          <AchievementsView
            achievements={achievements}
            userStats={userStats}
            onShareBadge={(ach) => {
              const text = `🏅 ¡Desbloqueé la insignia oficial "${ach.title}" (+${ach.xpReward} XP) en RETO VIRAL! 👇\n${window.location.origin}`;
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
            }}
          />
        )}

        {/* TAB 4: AMIGOS & DUELOS */}
        {activeTab === 'friends' && (
          <FriendsView
            friends={friends}
            challenges={INITIAL_CHALLENGES}
            onAddFriend={handleAddFriend}
            onSendChallenge={handleSendChallenge}
          />
        )}

        {/* TAB 5: FEED SOCIAL */}
        {activeTab === 'feed' && (
          <SocialFeedView
            feedItems={feedItems}
            challenges={INITIAL_CHALLENGES}
            onReaction={handleFeedReaction}
            onAcceptFeedChallenge={(cid) => {
              const found = INITIAL_CHALLENGES.find((c) => c.id === cid);
              if (found) setActiveChallenge(found);
            }}
            onPostUserResult={handlePostUserResult}
          />
        )}

        {/* TAB 6: IA RETO MASTER */}
        {activeTab === 'ai-creator' && (
          <AiChallengeCreator
            onPlayCustomChallenge={(c) => setActiveChallenge(c)}
          />
        )}

        {/* TAB 7: ESCENA 3D */}
        {activeTab === 'scene-3d' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-black text-pink-400 uppercase tracking-widest">
                THREE.JS PBR 3D ENVIRONMENT
              </span>
              <h2 className="text-3xl font-black text-white font-['Outfit',sans-serif]">
                Trofeo 3D Interactivo
              </h2>
              <p className="text-xs text-slate-400">
                Escena tridimensional renderizada con iluminación de estudio PBR, RoomEnvironment y modelo compuesto procedural.
              </p>
            </div>
            <Three3DScene />
          </div>
        )}

        {/* TAB 8: MÚSICA AI */}
        {activeTab === 'music' && (
          <div className="animate-fade-in">
            <MusicGenerator />
          </div>
        )}

        {/* TAB 9: ESTUDIO DE IMÁGENES */}
        {activeTab === 'image-studio' && (
          <div className="animate-fade-in">
            <ImageStudio />
          </div>
        )}

        {/* TAB 10: ANIMADOR DE VÍDEO */}
        {activeTab === 'video-animator' && (
          <div className="animate-fade-in">
            <VideoAnimator />
          </div>
        )}

        {/* TAB 11: VOZ LIVE AI */}
        {activeTab === 'live-voice' && (
          <div className="animate-fade-in">
            <LiveVoiceChat />
          </div>
        )}

        {/* TAB 12: TRANSCRIPTOR DE AUDIO */}
        {activeTab === 'transcribe' && (
          <div className="animate-fade-in">
            <AudioTranscriber />
          </div>
        )}

      </main>

      {/* Interactive Walkthrough Modal for New Users */}
      {showWalkthrough && (
        <InteractiveWalkthrough
          onComplete={handleCompleteWalkthrough}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      )}

      {/* Interactive Game Runner Modal */}
      {activeChallenge && (
        <GameRunner
          challenge={activeChallenge}
          onFinish={handleGameFinish}
          onClose={() => setActiveChallenge(null)}
        />
      )}

      {/* Result Modal with AI Roast & Story Canvas */}
      {activeResult && activeChallenge && (
        <ResultModal
          result={activeResult}
          challenge={activeChallenge}
          userName={userStats.name}
          userHandle={userStats.handle}
          onPlayAgain={() => {
            setActiveResult(null);
          }}
          onClose={() => {
            setActiveResult(null);
            setActiveChallenge(null);
          }}
          onViewAchievements={() => {
            setActiveResult(null);
            setActiveChallenge(null);
            setActiveTab('achievements');
          }}
        />
      )}

      {/* Strategy S/ 0 Modal */}
      {showStrategyModal && (
        <StrategyModal
          onClose={() => setShowStrategyModal(false)}
          sharesCount={userStats.sharesCount}
          completedCount={userStats.totalRetosCompleted}
        />
      )}

      {/* Footer with Tutorial Restart Button */}
      <footer className="border-t border-purple-900/30 py-6 px-4 text-center text-xs text-slate-500 space-y-2 mt-12 bg-[#090512]">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              soundFx.playClick();
              setShowWalkthrough(true);
            }}
            className="text-pink-400 hover:text-pink-300 font-bold transition-colors underline underline-offset-4"
          >
            Ver Tutorial Interactivo (Walkthrough)
          </button>
        </div>
        <p className="font-semibold text-slate-400">RETO VIRAL © 2026 · Plataforma de Desafíos de 30 Segundos</p>
        <p className="text-[11px] text-slate-600">
          Diseñado para compartir en WhatsApp, TikTok e Instagram · Potenciado con Gemini AI
        </p>
      </footer>

    </div>
  );
}
