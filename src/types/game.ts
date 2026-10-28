export type ChallengeCategory = 
  | 'Reflejos & Velocidad'
  | 'Visual & Percepción'
  | 'Memoria & Secuencia'
  | 'Lógica & Cálculo'
  | 'Precisión & Enfoque'
  | 'Nivel Épico';

export type ChallengeType =
  | 'eagle_eye'          // Spot the odd color/shape in grid
  | 'ninja_reflex'       // Tap on green color change immediately
  | 'speed_tap'          // Rapid tapping counter in 15s
  | 'flash_memory'       // Path memory grid recall
  | 'math_blitz'         // Lightning arithmetic problems
  | 'reverse_words'      // Unscramble inverted words
  | 'precision_slider'   // Stop moving bar in center
  | 'simon_sounds'       // Sequence memory repeat
  | 'color_illusion'     // Stroop test color match
  | 'emoji_odd'          // Find odd emoji
  | 'ghost_timer'        // Stop clock at 10.00s without seeing time
  | 'shadow_match'       // Pick correct shadow shape
  | 'target_precision'   // Moving target shooter
  | 'anagram_dash'       // Anagram word builder
  | 'card_pairs'         // Flip memory card pairs
  | 'tap_balance'        // Keep indicator in green zone L/R
  | 'supra_sort'         // Sort numbers low to high fast
  | 'rhythm_tap'         // Tap in beat pulse
  | 'spot_twin'          // Spot identical duplicate shape
  | 'rotating_maze'      // Rotate maze to exit
  | 'shape_morph'        // Stop shape morph when match
  | 'missing_symbol'     // Missing math operator
  | 'mirror_tap'         // Tap mirrored grid coordinate
  | 'word_chain'         // Sequence memory of words
  | 'defuse_bomb'        // Cut right wire logic puzzle
  | 'hidden_radar'       // Spot hidden camouflage item
  | 'speed_read'         // Read fast text flash & select answer
  | 'pitch_perfect'      // Highest sound pitch selector
  | 'reto_dioses';       // Triple test epic challenge

export interface Challenge {
  id: number;
  title: string;
  category: ChallengeCategory;
  difficulty: 'Fácil' | 'Media' | 'Difícil' | 'Extrema';
  durationSeconds: number;
  gameType: ChallengeType;
  description: string;
  viralHook: string; // e.g., "Solo el 8% de las personas pasa esto en 15s"
  iconName: string;
  targetScoreForA: number; // Score to get "A / Legend" grade
  colorGradient: string; // Tailwind bg gradient class
  isDailyFeatured?: boolean;
  aiCustomData?: {
    question?: string;
    options?: string[];
    correctAnswer?: string;
  };
}

export interface GameResult {
  challengeId: number;
  challengeTitle: string;
  score: number;
  maxPossibleScore: number;
  reactionTimeMs?: number;
  accuracyPercent?: number;
  grade: 'S+' | 'A' | 'B' | 'C' | 'D';
  percentileRank: number; // e.g. 96.5 means top 3.5%
  completedAt: string; // ISO string
  aiRoast?: string;
  aiTitle?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'participacion' | 'puntuacion' | 'amigos' | 'viral' | 'maestria';
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  badgeColor: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  handle: string; // e.g. @mateospeed
  status: 'online' | 'offline' | 'en_reto';
  level: number;
  totalXP: number;
  bestChallengeScore: {
    challengeId: number;
    challengeTitle: string;
    score: number;
  };
  isDirectFriend: boolean;
  lastActive: string;
}

export type FeedItemType = 
  | 'high_score'
  | 'badge_unlocked'
  | 'friend_challenge_sent'
  | 'duel_won'
  | 'daily_streak';

export interface FeedItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
  type: FeedItemType;
  content: string;
  challengeId?: number;
  challengeTitle?: string;
  score?: number;
  badgeName?: string;
  timestamp: string;
  reactions: {
    fire: number;
    zap: number;
    laugh: number;
    clap: number;
  };
  userReactions?: string[]; // list of reaction keys clicked by current user
}

export interface UserStats {
  name: string;
  handle: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  dailyStreak: number;
  lastPlayedDate: string;
  totalGamesPlayed: number;
  totalRetosCompleted: number;
  friendsCount: number;
  sharesCount: number;
  challengesSentCount: number;
  completedChallengeIds: number[];
  highScores: Record<number, number>; // challengeId -> highScore
}
