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
    xs: 'w-[32px] sm:w-[36px] md:w-[40px] h-[48px] sm:h-[54px] md:h-[60px] text-[10px] sm:text-xs',
    sm: 'w-[42px] sm:w-12 h-[63px] sm:h-18 text-xs',
    md: 'w-16 h-24 text-sm',
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
        relative shrink-0 rounded-lg bg-white shadow-md select-none
        border transition-all duration-200 cursor-default
        flex flex-col justify-between p-1 sm:p-1.5 font-bold
        ${isRed ? 'text-red-600 border-red-200' : 'text-slate-900 border-slate-300'}
        ${isValidMove ? 'cursor-pointer ring-2 ring-amber-400 shadow-amber-400/50 -translate-y-2 hover:-translate-y-3 hover:shadow-lg' : ''}
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
      <div className="flex flex-col items-start leading-none pointer-events-none">
        <span className={`font-extrabold tracking-tighter ${size === 'xs' ? 'text-[10px] sm:text-[11px]' : ''}`}>
          {card.rank}
        </span>
        <span className={size === 'xs' ? 'text-[8px] sm:text-[9px]' : 'text-xs sm:text-sm'}>
          {symbol}
        </span>
      </div>

      {/* Center Suit Symbol / Art */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className={`opacity-85 select-none ${
            size === 'xs' ? 'text-base sm:text-lg' : size === 'sm' ? 'text-xl' : size === 'md' ? 'text-3xl' : 'text-5xl'
          }`}
        >
          {symbol}
        </span>
      </div>

      {/* Bottom Right Corner (inverted) */}
      <div className="flex flex-col items-end leading-none rotate-180 pointer-events-none">
        <span className={`font-extrabold tracking-tighter ${size === 'xs' ? 'text-[10px] sm:text-[11px]' : ''}`}>
          {card.rank}
        </span>
        <span className={size === 'xs' ? 'text-[8px] sm:text-[9px]' : 'text-xs sm:text-sm'}>
          {symbol}
        </span>
      </div>

      {/* Valid Move Indicator Badge */}
      {isValidMove && (
        <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white animate-pulse" />
      )}
    </div>
  );
};
