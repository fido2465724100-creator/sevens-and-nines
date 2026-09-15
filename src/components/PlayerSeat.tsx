import React from 'react';
import { CardBackStyle, Player } from '../engine/types';
import { CardBack } from './CardBack';
import { Bot, Coins, Layers, User } from 'lucide-react';

interface PlayerSeatProps {
  player: Player;
  isCurrentTurn: boolean;
  isWinner: boolean;
  position: 'top' | 'left' | 'right' | 'bottom';
  cardBackStyle: CardBackStyle;
  customCardBackUrl?: string | null;
  botStatusText?: string | null;
  t?: { turn: string; pass: string };
}

export const PlayerSeat: React.FC<PlayerSeatProps> = ({
  player,
  isCurrentTurn,
  isWinner,
  position,
  cardBackStyle,
  customCardBackUrl,
  botStatusText,
  t = { turn: 'Turn', pass: 'Pass' },
}) => {
  const isBottom = position === 'bottom';

  return (
    <div
      className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${
        isCurrentTurn ? 'scale-105' : 'opacity-90'
      }`}
    >
      {/* Turn active glow ring */}
      <div className="relative">
        <div
          className={`
            w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all shadow-md
            ${
              isWinner
                ? 'border-amber-400 bg-amber-500/20 ring-4 ring-amber-400/50'
                : isCurrentTurn
                ? 'border-amber-400 bg-slate-900/80 ring-4 ring-amber-400/40 animate-pulse'
                : 'border-white/30 bg-slate-900/60'
            }
          `}
        >
          {player.isBot ? (
            <Bot className={`w-7 h-7 ${isCurrentTurn ? 'text-amber-300' : 'text-slate-300'}`} />
          ) : (
            <User className={`w-7 h-7 ${isCurrentTurn ? 'text-amber-300' : 'text-slate-300'}`} />
          )}
        </div>

        {/* Turn indicator pin */}
        {isCurrentTurn && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow">
            {t.turn}
          </span>
        )}

        {/* Passed indicator */}
        {player.passedThisRound && !isCurrentTurn && (
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 bg-red-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow">
            {t.pass}
          </span>
        )}
      </div>

      {/* Name and Badges */}
      <div className="flex flex-col items-center">
        <span className="text-xs font-bold text-white drop-shadow truncate max-w-[100px]">
          {player.name}
        </span>

        <div className="flex items-center gap-2 mt-0.5 text-[11px] font-semibold text-white/85">
          {/* Card count */}
          <div className="flex items-center gap-0.5 bg-black/40 px-1.5 py-0.5 rounded-full border border-white/10">
            <Layers className="w-3 h-3 text-amber-300" />
            <span>{player.hand.length}</span>
          </div>

          {/* Chips count */}
          <div className="flex items-center gap-0.5 bg-black/40 px-1.5 py-0.5 rounded-full border border-white/10">
            <Coins className="w-3 h-3 text-yellow-400" />
            <span>{player.chips}</span>
          </div>
        </div>
      </div>

      {/* Bot Hand (Face-down cards mini fan) */}
      {player.isBot && !isBottom && (
        <div className="flex items-center justify-center -space-x-4 mt-0.5 overflow-visible">
          {Array.from({ length: Math.min(player.hand.length, 7) }).map((_, i) => (
            <div
              key={i}
              className="w-5 h-8 rounded border border-white/40 overflow-hidden shadow-sm transition-transform"
              style={{
                transform: `rotate(${(i - Math.min(player.hand.length, 7) / 2) * 4}deg)`,
              }}
            >
              <CardBack style={cardBackStyle} customImageUrl={customCardBackUrl} />
            </div>
          ))}
          {player.hand.length > 7 && (
            <span className="text-[10px] text-white/70 pl-2 font-bold">
              +{player.hand.length - 7}
            </span>
          )}
        </div>
      )}

      {/* Bot Status Thought bubble */}
      {isCurrentTurn && botStatusText && player.isBot && (
        <div className="absolute -top-8 bg-slate-900/95 text-amber-300 text-[11px] px-2.5 py-1 rounded-lg border border-amber-400/40 shadow-xl whitespace-nowrap pointer-events-none animate-bounce z-20">
          {botStatusText}
        </div>
      )}
    </div>
  );
};
