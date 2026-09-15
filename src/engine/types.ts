export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';

export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  id: string; // e.g. "diamonds_9"
  suit: Suit;
  rank: Rank;
  order: number; // numeric order within suit (0..12 for 52-card, or 0..8 for 36-card)
}

export type RulePresetId = 'nines' | 'sevens' | 'fantan' | 'custom';

export interface GameRules {
  id: RulePresetId;
  name: string;
  nameRu: string;
  descriptionRu: string;
  descriptionEn: string;
  deckSize: 36 | 52;
  ranks: Rank[];
  baseRank: Rank; // '9' for 9ka, '7' for Sevens
  starterCardId: string | null; // e.g. 'diamonds_9' (must start with this) or null (any base card)
  aceIsHigh: boolean; // true: 6..10,J,Q,K,A; false: A,2,3...
  mandatoryPlay: boolean; // must play if valid card available
  passPenaltyChips: number; // 0 for nines, 1 for Fan Tan
  initialChips: number;
}

export interface Player {
  id: string;
  name: string;
  isBot: boolean;
  hand: Card[];
  chips: number;
  avatar: string;
  passedThisRound?: boolean;
}

export interface SuitSequence {
  suit: Suit;
  baseCard: Card | null;
  lowCards: Card[];  // descending from baseRank - 1 down to min
  highCards: Card[]; // ascending from baseRank + 1 up to max
}

export type TableSequences = Record<Suit, SuitSequence>;

export type GameStatus = 'idle' | 'dealing' | 'playing' | 'round_over' | 'game_over';

export interface GameMove {
  playerId: string;
  playerName: string;
  type: 'play' | 'pass';
  card?: Card;
  timestamp: number;
  chipsLost?: number;
}

export interface GameState {
  status: GameStatus;
  rules: GameRules;
  players: Player[];
  currentPlayerIndex: number;
  table: TableSequences;
  pot: number;
  moveHistory: GameMove[];
  firstMoveDone: boolean;
  winnerId: string | null;
  consecutivePasses: number;
  roundNumber: number;
}

export type CardBackStyle =
  | 'classic-blue'
  | 'classic-red'
  | 'soviet-atlas'
  | 'royal-gold'
  | 'emerald'
  | 'cyber-neon'
  | 'wood-vintage'
  | 'galaxy'
  | 'custom';

export type TableClothColor = 'green' | 'blue' | 'burgundy' | 'slate';
export type AiDifficulty = 'easy' | 'medium' | 'hard';
