import React from 'react';
import { GameMove } from '../engine/types';
import { SUIT_SYMBOLS } from '../engine/rules';
import { History, ScrollText } from 'lucide-react';

interface GameLogProps {
  moves: GameMove[];
  className?: string;
  t?: { history: string; started: string; played: string; passed: string };
}

export const GameLog: React.FC<GameLogProps> = ({
  moves,
  className = '',
  t = { history: 'Журнал ходов', started: 'Партия началась...', played: 'выложил', passed: 'пас' },
}) => {
  const recentMoves = moves.slice(0, 8);

  return (
    <div
      className={`rounded-xl bg-black/40 backdrop-blur-md border border-white/10 p-2.5 text-xs text-slate-200 shadow-lg ${className}`}
    >
      <div className="flex items-center gap-1.5 font-bold text-amber-300/90 mb-2 border-b border-white/10 pb-1 text-[11px] uppercase tracking-wider">
        <History className="w-3.5 h-3.5" />
        <span>{t.history}</span>
      </div>

      {recentMoves.length === 0 ? (
        <div className="text-white/40 italic py-2 text-center text-[11px]">
          {t.started}
        </div>
      ) : (
        <div className="space-y-1 overflow-y-auto max-h-32 pr-1">
          {recentMoves.map((m, i) => {
            const isPlay = m.type === 'play' && m.card;
            const symbol = isPlay ? SUIT_SYMBOLS[m.card!.suit] : '';

            return (
              <div
                key={m.timestamp + '-' + i}
                className={`flex items-center justify-between py-0.5 px-1 rounded text-[11px] ${
                  i === 0 ? 'bg-white/10 font-semibold text-amber-200' : 'text-slate-300'
                }`}
              >
                <span className="truncate max-w-[110px]">{m.playerName}</span>
                {isPlay ? (
                  <span className="font-mono font-bold flex items-center gap-0.5">
                    {t.played} {m.card!.rank}
                    <span className={m.card!.suit === 'hearts' || m.card!.suit === 'diamonds' ? 'text-red-400' : 'text-slate-200'}>
                      {symbol}
                    </span>
                  </span>
                ) : (
                  <span className="text-rose-400 font-medium">
                    {t.passed} {m.chipsLost ? `(-${m.chipsLost} 🪙)` : ''}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
