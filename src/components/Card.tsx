import React from 'react';
import { Card as CardType, CardBackStyle } from '../engine/types';
import { SUIT_COLORS, SUIT_SYMBOLS } from '../engine/rules';
import { CardBack } from './CardBack';

interface CardProps {
  card?: CardType;
  isFaceDown?: boolean;
  isValidMove?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  cardBackStyle?: CardBackStyle;
  customCardBackUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  card,
  isFaceDown = false,
  isValidMove = false,
  isSelected = false,
  onClick,
  cardBackStyle = 'classic-blue',
  customCardBackUrl,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'card-size-xs w-[36px] sm:w-[44px] md:w-[50px] lg:w-[56px] xl:w-[60px] h-[52px] sm:h-[64px] md:h-[72px] lg:h-[80px] xl:h-[86px] text-xs sm:text-sm',
    sm: 'card-size-sm w-[44px] sm:w-[52px] md:w-[60px] lg:w-[66px] xl:w-[72px] h-[64px] sm:h-[75px] md:h-[86px] lg:h-[95px] xl:h-[104px] text-xs sm:text-sm md:text-base',
    md: 'card-size-md w-16 h-24 text-sm',
    lg: 'w-22 h-32 text-base',
  }[size];

  if (isFaceDown || !card) {
    return (
      <div
        className={`${sizeClasses} shrink-0 transition-transform duration-200 ${className}`}
      >
        <CardBack style={cardBackStyle} customImageUrl={customCardBackUrl} />
      </div>
    );
  }

  const isRed = SUIT_COLORS[card.suit] === 'red';
  const symbol = SUIT_SYMBOLS[card.suit];

  return (
    <div
      onClick={isValidMove ? onClick : undefined}
      className={`
        ${sizeClasses}
        relative shrink-0 rounded-lg bg-white shadow-md select-none touch-manipulation overflow-hidden
        border transition-all duration-200 cursor-default
        flex flex-col justify-between p-0.5 sm:p-1.5 font-bold
        ${isRed ? 'text-red-600 border-red-200' : 'text-slate-900 border-slate-300'}
        ${isValidMove ? 'cursor-pointer ring-2 ring-amber-400 shadow-amber-400/50 -translate-y-2 hover:-translate-y-3 hover:shadow-lg active:scale-95' : ''}
        ${isSelected ? 'ring-2 ring-blue-500 -translate-y-3' : ''}
        ${className}
      `}
      style={{
        boxShadow: isValidMove
          ? '0 8px 16px -2px rgba(251, 191, 36, 0.4), 0 4px 8px -2px rgba(0, 0, 0, 0.1)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Top Left Corner */}
      <div className="flex flex-col items-start leading-tight pointer-events-none z-10">
        <span className="font-extrabold tracking-tighter text-[10px] sm:text-xs md:text-sm">
          {card.rank}
        </span>
        <span className="text-[8px] sm:text-[10px] md:text-xs">
          {symbol}
        </span>
      </div>

      {/* Center Suit Symbol / Art */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className={`opacity-20 select-none ${
            size === 'xs'
              ? 'text-xs'
              : size === 'sm'
              ? 'text-sm'
              : size === 'md'
              ? 'text-lg sm:text-2xl'
              : 'text-4xl'
          }`}
        >
          {symbol}
        </span>
      </div>

      {/* Bottom Right Corner (inverted) - only on larger cards to avoid doubling on compact screens */}
      {size !== 'xs' && size !== 'sm' && (
        <div className="flex flex-col items-end leading-tight rotate-180 pointer-events-none z-10">
          <span className="font-extrabold tracking-tighter text-[10px] sm:text-xs md:text-sm">
            {card.rank}
          </span>
          <span className="text-[8px] sm:text-[10px] md:text-xs">
            {symbol}
          </span>
        </div>
      )}

      {/* Valid Move Indicator Badge */}
      {isValidMove && (
        <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white animate-pulse" />
      )}
    </div>
  );
};
