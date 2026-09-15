import { GameRules, Rank, RulePresetId } from './types';

export const RANKS_36: Rank[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
export const RANKS_52: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const RULE_PRESETS: Record<RulePresetId, GameRules> = {
  nines: {
    id: 'nines',
    name: 'Nines (9-ka)',
    nameRu: 'Девятка',
    descriptionRu: 'Классическая русская игра на 36 карт. Первый ход строго с 9♦ (бубны). Ряды выстраиваются вверх до Туза и вниз до 6. Пас возможен только если нет подходящих карт.',
    descriptionEn: 'Classic Eastern European layout game with 36 cards. First move is strictly the 9 of Diamonds. Suits build up to Ace and down to 6.',
    deckSize: 36,
    ranks: RANKS_36,
    baseRank: '9',
    starterCardId: 'diamonds_9',
    aceIsHigh: true,
    mandatoryPlay: true,
    passPenaltyChips: 0,
    initialChips: 20,
  },
  sevens: {
    id: 'sevens',
    name: 'Sevens (Parliament)',
    nameRu: 'Семёрки (Parliament)',
    descriptionRu: 'Международный вариант на 52 карты. Первый ход с любой семёрки (или 7♦). Ряды строятся вверх до Короля/Туза и вниз до Двойки/Туза. Пас только при отсутствии хода.',
    descriptionEn: 'International English variant with 52 cards. Starts with 7s. Sequences build up to King and down to 2/Ace.',
    deckSize: 52,
    ranks: RANKS_52,
    baseRank: '7',
    starterCardId: 'diamonds_7',
    aceIsHigh: true,
    mandatoryPlay: true,
    passPenaltyChips: 0,
    initialChips: 20,
  },
  fantan: {
    id: 'fantan',
    name: 'Fan Tan (Card Dominoes)',
    nameRu: 'Фан Тан (Card Dominoes)',
    descriptionRu: 'Азартный вариант с банком и фишками на 52 карты. Старт с семёрок. За каждый пропуск хода игрок кладёт штрафную фишку в банк. Победитель забирает весь банк!',
    descriptionEn: 'Gambling sequence game with a chips pot. Starts with 7s. Passing costs a chip to the pot. Winner takes all chips in the pot!',
    deckSize: 52,
    ranks: RANKS_52,
    baseRank: '7',
    starterCardId: 'diamonds_7',
    aceIsHigh: true,
    mandatoryPlay: true,
    passPenaltyChips: 1,
    initialChips: 25,
  },
  custom: {
    id: 'custom',
    name: 'Custom Rules',
    nameRu: 'Свои правила',
    descriptionRu: 'Настраиваемые правила: размер колоды, стартовый ранг, штрафы за пас и условие первого хода.',
    descriptionEn: 'Customizable card layout game settings.',
    deckSize: 36,
    ranks: RANKS_36,
    baseRank: '9',
    starterCardId: 'diamonds_9',
    aceIsHigh: true,
    mandatoryPlay: true,
    passPenaltyChips: 0,
    initialChips: 20,
  },
};

export const SUITS_ORDER = ['spades', 'hearts', 'diamonds', 'clubs'] as const;

export const SUIT_SYMBOLS: Record<string, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

export const SUIT_NAMES_RU: Record<string, string> = {
  spades: 'Пики',
  hearts: 'Черви',
  diamonds: 'Бубны',
  clubs: 'Трефы',
};

export const SUIT_NAMES_EN: Record<string, string> = {
  spades: 'Spades',
  hearts: 'Hearts',
  diamonds: 'Diamonds',
  clubs: 'Clubs',
};

export const SUIT_COLORS: Record<string, 'red' | 'black'> = {
  spades: 'black',
  hearts: 'red',
  diamonds: 'red',
  clubs: 'black',
};
