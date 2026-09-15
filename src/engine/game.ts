import { Card, GameRules, GameState, Player, Suit, TableSequences } from './types';
import { createDeck, dealCards, shuffleDeck, sortHand } from './deck';
import { SUITS_ORDER } from './rules';

export function createInitialTable(): TableSequences {
  return {
    spades: { suit: 'spades', baseCard: null, lowCards: [], highCards: [] },
    hearts: { suit: 'hearts', baseCard: null, lowCards: [], highCards: [] },
    diamonds: { suit: 'diamonds', baseCard: null, lowCards: [], highCards: [] },
    clubs: { suit: 'clubs', baseCard: null, lowCards: [], highCards: [] },
  };
}

export function canPlayCard(
  card: Card,
  table: TableSequences,
  rules: GameRules,
  firstMoveDone: boolean
): boolean {
  // First move condition
  if (!firstMoveDone) {
    if (rules.starterCardId) {
      return card.id === rules.starterCardId;
    }
    return card.rank === rules.baseRank;
  }

  // Base card can open a new suit if not already opened
  if (card.rank === rules.baseRank) {
    return table[card.suit].baseCard === null;
  }

  const seq = table[card.suit];
  // Can only attach to an opened suit
  if (!seq.baseCard) {
    return false;
  }

  const currentMinOrder = seq.lowCards.length > 0
    ? seq.lowCards[seq.lowCards.length - 1].order
    : seq.baseCard.order;

  const currentMaxOrder = seq.highCards.length > 0
    ? seq.highCards[seq.highCards.length - 1].order
    : seq.baseCard.order;

  // Extends downwards (e.g. 8 after 9, or 6 after 7)
  if (card.order === currentMinOrder - 1) {
    return true;
  }

  // Extends upwards (e.g. 10 after 9, or 8 after 7)
  if (card.order === currentMaxOrder + 1) {
    return true;
  }

  return false;
}

export function getValidMoves(
  player: Player,
  table: TableSequences,
  rules: GameRules,
  firstMoveDone: boolean
): Card[] {
  return player.hand.filter((card) => canPlayCard(card, table, rules, firstMoveDone));
}

export function initGame(
  rules: GameRules,
  playerNames: string[] = ['Игрок', 'Алексей (ИИ)', 'Мария (ИИ)', 'Дмитрий (ИИ)'],
  existingPlayers?: Player[]
): GameState {
  const deck = shuffleDeck(createDeck(rules));
  const hands = dealCards(deck, playerNames.length);

  const players: Player[] = playerNames.map((name, i) => ({
    id: `player_${i}`,
    name,
    isBot: i > 0,
    hand: sortHand(hands[i], rules),
    chips: existingPlayers?.[i]?.chips ?? rules.initialChips,
    avatar: ['avatar-user', 'avatar-bot-1', 'avatar-bot-2', 'avatar-bot-3'][i % 4],
    passedThisRound: false,
  }));

  // Find who has starter card if starterCardId is configured
  let startingPlayerIndex = 0;
  if (rules.starterCardId) {
    const starterId = rules.starterCardId;
    const foundIndex = players.findIndex((p) => p.hand.some((c) => c.id === starterId));
    if (foundIndex !== -1) {
      startingPlayerIndex = foundIndex;
    }
  } else {
    // Find player with any base card
    const foundIndex = players.findIndex((p) => p.hand.some((c) => c.rank === rules.baseRank));
    if (foundIndex !== -1) {
      startingPlayerIndex = foundIndex;
    }
  }

  // In Fan Tan, each player deposits 1 chip into the pot at start
  const initialPot = rules.passPenaltyChips > 0 ? players.length : 0;
  if (initialPot > 0) {
    players.forEach((p) => {
      p.chips = Math.max(0, p.chips - 1);
    });
  }

  return {
    status: 'playing',
    rules,
    players,
    currentPlayerIndex: startingPlayerIndex,
    table: createInitialTable(),
    pot: initialPot,
    moveHistory: [],
    firstMoveDone: false,
    winnerId: null,
    consecutivePasses: 0,
    roundNumber: 1,
  };
}

export function playCard(state: GameState, playerId: string, card: Card): GameState {
  const playerIndex = state.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1) return state;

  const player = state.players[playerIndex];
  const newHand = player.hand.filter((c) => c.id !== card.id);

  // Update table sequence
  const newTable = { ...state.table };
  const seq = { ...newTable[card.suit] };

  if (card.rank === state.rules.baseRank) {
    seq.baseCard = card;
  } else {
    const baseOrder = seq.baseCard!.order;
    if (card.order < baseOrder) {
      seq.lowCards = [...seq.lowCards, card].sort((a, b) => b.order - a.order); // sorted descending: 8, 7, 6
    } else {
      seq.highCards = [...seq.highCards, card].sort((a, b) => a.order - b.order); // sorted ascending: 10, J, Q
    }
  }
  newTable[card.suit] = seq;

  const updatedPlayer: Player = {
    ...player,
    hand: newHand,
    passedThisRound: false,
  };

  const newPlayers = [...state.players];
  newPlayers[playerIndex] = updatedPlayer;

  const moveRecord = {
    playerId,
    playerName: player.name,
    type: 'play' as const,
    card,
    timestamp: Date.now(),
  };

  // Check victory (first to empty hand)
  if (newHand.length === 0) {
    // Winner gets the pot
    const winnerChips = updatedPlayer.chips + state.pot;
    newPlayers[playerIndex] = { ...updatedPlayer, chips: winnerChips };

    return {
      ...state,
      players: newPlayers,
      table: newTable,
      status: 'round_over',
      winnerId: playerId,
      pot: 0,
      moveHistory: [moveRecord, ...state.moveHistory],
      firstMoveDone: true,
      consecutivePasses: 0,
    };
  }

  // Advance to next player
  const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;

  return {
    ...state,
    players: newPlayers,
    table: newTable,
    currentPlayerIndex: nextPlayerIndex,
    moveHistory: [moveRecord, ...state.moveHistory],
    firstMoveDone: true,
    consecutivePasses: 0,
  };
}

export function passTurn(state: GameState, playerId: string): GameState {
  const playerIndex = state.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1) return state;

  const player = state.players[playerIndex];
  let newChips = player.chips;
  let newPot = state.pot;
  const penalty = state.rules.passPenaltyChips;

  if (penalty > 0) {
    const deduct = Math.min(penalty, newChips);
    newChips -= deduct;
    newPot += deduct;
  }

  const updatedPlayer: Player = {
    ...player,
    chips: newChips,
    passedThisRound: true,
  };

  const newPlayers = [...state.players];
  newPlayers[playerIndex] = updatedPlayer;

  const moveRecord = {
    playerId,
    playerName: player.name,
    type: 'pass' as const,
    timestamp: Date.now(),
    chipsLost: penalty,
  };

  const nextConsecutivePasses = state.consecutivePasses + 1;
  const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;

  // Stale game check (all players passed consecutively)
  const isStalemate = nextConsecutivePasses >= state.players.length;

  return {
    ...state,
    players: newPlayers,
    currentPlayerIndex: nextPlayerIndex,
    pot: newPot,
    moveHistory: [moveRecord, ...state.moveHistory],
    consecutivePasses: nextConsecutivePasses,
    status: isStalemate ? 'round_over' : state.status,
    winnerId: isStalemate ? findLowestHandPlayerId(newPlayers) : state.winnerId,
  };
}

function findLowestHandPlayerId(players: Player[]): string | null {
  let minCount = Infinity;
  let winnerId: string | null = null;
  for (const p of players) {
    if (p.hand.length < minCount) {
      minCount = p.hand.length;
      winnerId = p.id;
    }
  }
  return winnerId;
}
