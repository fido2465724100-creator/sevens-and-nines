import { AiDifficulty, Card, GameRules, Player, TableSequences } from './types';
import { getValidMoves } from './game';

export interface BotDecision {
  action: 'play' | 'pass';
  card?: Card;
}

export function chooseBotMove(
  bot: Player,
  table: TableSequences,
  rules: GameRules,
  firstMoveDone: boolean,
  difficulty: AiDifficulty = 'hard'
): BotDecision {
  const validMoves = getValidMoves(bot, table, rules, firstMoveDone);

  if (validMoves.length === 0) {
    return { action: 'pass' };
  }

  if (validMoves.length === 1) {
    return {
      action: 'play',
      card: validMoves[0],
    };
  }

  if (difficulty === 'easy') {
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return {
      action: 'play',
      card: validMoves[randomIndex],
    };
  }

  // Strategic scoring for Medium and Hard
  const scoredMoves = validMoves.map((card) => {
    let score = 0;
    const cardsInSuit = bot.hand.filter((c) => c.suit === card.suit);
    const isBase = card.rank === rules.baseRank;

    if (isBase) {
      // If we open a suit:
      // More cards in this suit -> high incentive to open
      // Fewer cards in this suit -> holding the base card blocks opponents!
      if (cardsInSuit.length >= 3) {
        score += 25 + cardsInSuit.length * 5;
      } else if (cardsInSuit.length === 1) {
        // Only the base card itself: hold it to starve opponents
        score -= difficulty === 'hard' ? 40 : 15;
      } else {
        score -= 5;
      }
    } else {
      // Not base card (extending sequence)
      score += 15;

      // Check if we have the follow-up card in hand!
      const isLow = card.order < (rules.baseRank === '9' ? 3 : 5);
      const nextOrder = isLow ? card.order - 1 : card.order + 1;
      const hasFollowUp = bot.hand.some((c) => c.suit === card.suit && c.order === nextOrder);

      if (hasFollowUp) {
        // Paving the way for our own hand!
        score += 30;
      }

      // Favor unloading suits where we have many cards
      score += cardsInSuit.length * 4;

      // In Hard mode: if card is an extreme (e.g. 6 or A in 36-deck), getting rid of it closes an end
      const isEndCard = card.order === 0 || card.order === rules.ranks.length - 1;
      if (isEndCard && difficulty === 'hard') {
        score += 10;
      }
    }

    return { card, score };
  });

  // Sort descending by score
  scoredMoves.sort((a, b) => b.score - a.score);
  const best = scoredMoves[0];

  return {
    action: 'play',
    card: best.card,
  };
}
