import React from 'react';
import { Card as CardType, CardBackStyle, Suit } from '../engine/types';
import { TranslationDict } from '../i18n/translations';
import { Card } from './Card';
import { ArrowRightCircle, Ban, Zap, ZapOff } from 'lucide-react';

interface HandProps {
  hand: CardType[];
  validMoves: CardType[];
  isMyTurn: boolean;
  onPlayCard: (card: CardType) => void;
  onPass: () => void;
  canPass: boolean;
  autoPass: boolean;
  onToggleAutoPass: () => void;
  cardBackStyle: CardBackStyle;
  customCardBackUrl?: string | null;
  t: TranslationDict;
}

export const Hand: React.FC<HandProps> = ({
  hand,
  validMoves,
  isMyTurn,
  onPlayCard,
  onPass,
  canPass,
  autoPass,
  onToggleAutoPass,
  cardBackStyle,
  customCardBackUrl,
  t,
}) => {
  const validCardIds = new Set(validMoves.map((c) => c.id));
  const hasValidMoves = validMoves.length > 0;

  // Group hand cards by suit in order: spades, hearts, diamonds, clubs
  const suitsOrder: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
  const groupedHand = suitsOrder
    .map((suit) => ({
      suit,
      cards: hand.filter((c) => c.suit === suit),
    }))
    .filter((g) => g.cards.length > 0);

  return (
    <div className="flex flex-col items-center gap-0.5 sm:gap-2 w-full max-w-5xl px-1 sm:px-2">
      {/* Top Action Bar / Helper & Auto-Pass Toggle */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 w-full px-2 sm:px-4 py-0.5 sm:py-2 rounded-lg sm:rounded-xl bg-black/45 backdrop-blur-md border border-white/10 text-white text-[9px] sm:text-xs shadow-lg">
        {/* Status notice */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isMyTurn ? (
            hasValidMoves ? (
              <span className="flex items-center gap-1 sm:gap-1.5 text-amber-300 font-bold animate-pulse">
                <ArrowRightCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                {t.yourTurn}
              </span>
            ) : (
              <span className="flex items-center gap-1 sm:gap-1.5 text-rose-300 font-bold">
                <Ban className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
                {autoPass ? `${t.noMoves} (${t.autoPass})` : t.noMoves}
              </span>
            )
          ) : (
            <span className="text-white/60">{t.waitingTurn}</span>
          )}
        </div>

        {/* Action Buttons: Auto-Pass Toggle and Manual Pass Button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Auto-pass Toggle Button */}
          <button
            onClick={onToggleAutoPass}
            title={autoPass ? t.autoPassOff : t.autoPassOn}
            className={`
              flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-xs font-bold transition-all shadow cursor-pointer border
              ${
                autoPass
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/40'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 border-white/15'
              }
            `}
          >
            {autoPass ? (
              <>
                <Zap className="w-3 h-3 text-slate-950 fill-slate-950" />
                <span>{t.autoPassOn}</span>
              </>
            ) : (
              <>
                <ZapOff className="w-3 h-3 text-slate-400" />
                <span>{t.autoPassOff}</span>
              </>
            )}
          </button>

          {/* Manual Pass Button */}
          {isMyTurn && (
            <button
              onClick={onPass}
              disabled={!canPass}
              className={`
                px-2.5 sm:px-4 py-0.5 sm:py-1 rounded-md sm:rounded-lg font-bold transition-all text-[9px] sm:text-xs flex items-center gap-1 shadow
                ${
                  canPass
                    ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white cursor-pointer ring-2 ring-red-400/50 animate-bounce'
                    : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/5'
                }
              `}
            >
              <Ban className="w-3 h-3" />
              <span>{t.pass}</span>
            </button>
          )}
        </div>
      </div>

      {/* Cards Fan with Half-Card Gap Between Suits */}
      <div className="flex items-center justify-center flex-nowrap gap-2 sm:gap-6 md:gap-7 py-1 sm:py-3 px-1 sm:px-3 w-full overflow-x-auto min-h-[70px] sm:min-h-[145px] hand-fan-compact">
        {groupedHand.map((group) => (
          <div
            key={group.suit}
            className="flex items-center -space-x-5 sm:-space-x-5 hover:-space-x-2 transition-all duration-200"
          >
            {group.cards.map((card, cardIndex) => {
              const isValid = isMyTurn && validCardIds.has(card.id);
              const rotationAngle = (cardIndex - (group.cards.length - 1) / 2) * 2;

              return (
                <div
                  key={card.id}
                  className="transition-transform duration-200 origin-bottom hover:z-30"
                  style={{
                    transform: `rotate(${rotationAngle}deg)`,
                  }}
                >
                  <Card
                    card={card}
                    isValidMove={isValid}
                    onClick={() => onPlayCard(card)}
                    size="md"
                    cardBackStyle={cardBackStyle}
                    customCardBackUrl={customCardBackUrl}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
