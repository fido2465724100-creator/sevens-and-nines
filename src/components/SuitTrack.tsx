import React from 'react';
import { GameRules, Suit, SuitSequence } from '../engine/types';
import { SUIT_COLORS, SUIT_SYMBOLS } from '../engine/rules';
import { TranslationDict } from '../i18n/translations';
import { Card } from './Card';

interface SuitTrackProps {
  suit: Suit;
  sequence: SuitSequence;
  rules: GameRules;
  t: TranslationDict;
}

export const SuitTrack: React.FC<SuitTrackProps> = ({ suit, sequence, rules, t }) => {
  const isRed = SUIT_COLORS[suit] === 'red';
  const symbol = SUIT_SYMBOLS[suit];

  const suitName = {
    spades: t.spades,
    hearts: t.hearts,
    diamonds: t.diamonds,
    clubs: t.clubs,
  }[suit];

  const is52Deck = rules.deckSize === 52;
  const cardSize = is52Deck ? 'xs' : 'sm';

  // lowCards are stored sorted descending: [8, 7, 6...]
  // Display them left-to-right from lowest to base-1: [6, 7, 8]
  const displayLowCards = [...sequence.lowCards].reverse();
  const displayHighCards = sequence.highCards; // sorted ascending: [10, J, Q, K, A]

  // Proportional flex distribution around the Base card:
  // In 52-card mode: up to 5 low cards (2..6) and 7 high cards (8..A) -> ratio 5 : 7
  // In 36-card mode: up to 3 low cards (6..8) and 5 high cards (10..A) -> ratio 3 : 5
  // This guarantees all 4 base cards line up in a clean vertical column, and cards never overflow!
  const baseIndex = rules.ranks.indexOf(rules.baseRank);
  const maxLowCount = baseIndex >= 0 ? baseIndex : (is52Deck ? 5 : 3);
  const maxHighCount = baseIndex >= 0 ? rules.ranks.length - 1 - baseIndex : (is52Deck ? 7 : 5);

  return (
    <div className="flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 px-2.5 sm:px-3.5 rounded-2xl bg-black/35 backdrop-blur-xs border border-white/10 shadow-inner w-full min-w-0">
      {/* Suit Header Badge */}
      <div
        className={`flex flex-col items-center justify-center w-10 sm:w-12 md:w-14 shrink-0 select-none font-bold ${
          isRed ? 'text-red-400' : 'text-slate-200'
        }`}
      >
        <span className="text-xl sm:text-2xl md:text-3xl leading-none drop-shadow">{symbol}</span>
        <span className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider text-white/70">{suitName}</span>
      </div>

      {/* Cards Row Container: Left low cards, Center Base slot, Right high cards */}
      <div className="flex items-center justify-center flex-1 w-full min-w-0">
        {/* Descending cards (Left side) */}
        <div
          className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 justify-end min-w-0"
          style={{ flex: maxLowCount }}
        >
          {displayLowCards.map((card) => (
            <Card key={card.id} card={card} size={cardSize} />
          ))}
        </div>

        {/* Center: Base Card Slot (9 or 7) */}
        <div className="relative mx-1 sm:mx-1.5 shrink-0">
          {sequence.baseCard ? (
            <div className="relative">
              <Card card={sequence.baseCard} size={cardSize} className="ring-2 ring-amber-400/80 shadow-lg" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1 rounded bg-amber-500 text-[8px] sm:text-[9px] font-black text-slate-900 uppercase tracking-wider shadow">
                {t.base}
              </div>
            </div>
          ) : (
            <div
              className={`
                rounded-lg border-2 border-dashed flex flex-col items-center justify-center select-none font-semibold transition-all
                ${
                  is52Deck
                    ? 'w-[36px] sm:w-[44px] md:w-[50px] lg:w-[56px] xl:w-[60px] h-[52px] sm:h-[64px] md:h-[72px] lg:h-[80px] xl:h-[86px]'
                    : 'w-[44px] sm:w-[52px] md:w-[60px] lg:w-[66px] xl:w-[72px] h-[64px] sm:h-[75px] md:h-[86px] lg:h-[95px] xl:h-[104px]'
                }
                ${
                  isRed
                    ? 'border-red-400/40 text-red-300/60 bg-red-950/20'
                    : 'border-white/30 text-white/50 bg-black/20'
                }
              `}
            >
              <span className="text-xs sm:text-sm md:text-base font-bold">{rules.baseRank}</span>
              <span className="text-xs sm:text-sm md:text-base">{symbol}</span>
            </div>
          )}
        </div>

        {/* Ascending cards (Right side) */}
        <div
          className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 justify-start min-w-0"
          style={{ flex: maxHighCount }}
        >
          {displayHighCards.map((card) => (
            <Card key={card.id} card={card} size={cardSize} />
          ))}
        </div>
      </div>
    </div>
  );
};
