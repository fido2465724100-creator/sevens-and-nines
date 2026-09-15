import { Card, GameRules, Rank, Suit } from './types';
import { SUITS_ORDER } from './rules';

export function createDeck(rules: GameRules): Card[] {
  const deck: Card[] = [];
  const ranks: Rank[] = rules.ranks;

  for (const suit of SUITS_ORDER) {
    ranks.forEach((rank, order) => {
      deck.push({
        id: `${suit}_${rank}`,
        suit,
        rank,
        order,
      });
    });
  }

  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function sortHand(hand: Card[], rules: GameRules): Card[] {
  const suitPriority: Record<Suit, number> = {
    spades: 0,
    hearts: 1,
    diamonds: 2,
    clubs: 3,
  };

  return [...hand].sort((a, b) => {
    if (a.suit !== b.suit) {
      return suitPriority[a.suit] - suitPriority[b.suit];
    }
    return a.order - b.order;
  });
}

export function dealCards(cards: Card[], playerCount: number): Card[][] {
  const hands: Card[][] = Array.from({ length: playerCount }, () => []);
  cards.forEach((card, index) => {
    hands[index % playerCount].push(card);
  });
  return hands;
}
