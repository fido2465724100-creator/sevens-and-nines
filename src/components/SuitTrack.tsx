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

  // lowCards are stored sorted descending: [8, 7, 6...]
  // Display them left-to-right from lowest to base-1: [6, 7, 8]
  const displayLowCards = [...sequence.lowCards].reverse();
  const displayHighCards = sequence.highCards; // sorted ascending: [10, J, Q, K, A]

  return (
    <div className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-black/25 backdrop-blur-xs border border-white/10 shadow-inner w-full overflow-x-auto min-h-[105px]">
      {/* Suit Header Badge */}
      <div
        className={`flex flex-col items-center justify-center w-12 shrink-0 select-none font-bold ${
          isRed ? 'text-red-400' : 'text-slate-200'
        }`}
      >
        <span className="text-2xl leading-none drop-shadow">{symbol}</span>
        <span className="text-[10px] uppercase tracking-wider text-white/70">{suitName}</span>
      </div>

      {/* Cards Row Container */}
      <div className="flex items-center justify-center flex-1 gap-1 sm:gap-1.5 min-w-max">
        {/* Descending cards (Left side) */}
        <div className="flex items-center gap-1 justify-end">
          {displayLowCards.map((card) => (
            <Card key={card.id} card={card} size="sm" />
          ))}
        </div>

        {/* Center: Base Card Slot (9 or 7) */}
        <div className="relative mx-1">
          {sequence.baseCard ? (
            <div className="relative">
              <Card card={sequence.baseCard} size="sm" className="ring-2 ring-amber-400/80 shadow-lg" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1 rounded bg-amber-500 text-[8px] font-black text-slate-900 uppercase tracking-wider shadow">
                {t.base}
              </div>
            </div>
          ) : (
            <div
              className={`w-12 h-18 rounded-lg border-2 border-dashed flex flex-col items-center justify-center select-none font-semibold ${
                isRed
                  ? 'border-red-400/40 text-red-300/60 bg-red-950/20'
                  : 'border-white/30 text-white/50 bg-black/20'
              }`}
            >
              <span className="text-xs font-bold">{rules.baseRank}</span>
              <span className="text-sm">{symbol}</span>
            </div>
          )}
        </div>

        {/* Ascending cards (Right side) */}
        <div className="flex items-center gap-1 justify-start">
          {displayHighCards.map((card) => (
            <Card key={card.id} card={card} size="sm" />
          ))}
        </div>
      </div>
    </div>
  );
};
