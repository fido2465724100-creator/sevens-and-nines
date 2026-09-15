import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Player } from '../engine/types';
import { TranslationDict } from '../i18n/translations';
import { soundEngine } from '../audio/soundEngine';
import { Award, Coins, RotateCcw, Trophy, Users } from 'lucide-react';

interface WinModalProps {
  isOpen: boolean;
  winner: Player | null;
  players: Player[];
  potWon: number;
  onRestart: () => void;
  t: TranslationDict;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  winner,
  players,
  potWon,
  onRestart,
  t,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundEngine.playWin();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }
    }
  }, [isOpen]);

  if (!isOpen || !winner) return null;

  const isUserWinner = !winner.isBot;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 text-center space-y-5">
        {/* Trophy Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400/80 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-bounce">
          <Trophy className="w-10 h-10 text-amber-400" />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-black text-white">
            {isUserWinner ? t.youWon : `${t.winnerIs} ${winner.name}`}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isUserWinner ? t.youWonDesc : t.botWonDesc}
          </p>
        </div>

        {/* Pot Won Badge (if Fan Tan) */}
        {potWon > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-400/60 text-yellow-300 font-bold text-sm">
            <Coins className="w-4 h-4" />
            <span>{t.potWon} +{potWon} 🪙</span>
          </div>
        )}

        {/* Scoreboard table */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between px-2">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {t.player}
            </span>
            <span>{t.handRemainder}</span>
          </div>

          <div className="divide-y divide-slate-800">
            {players.map((p) => {
              const isPWinner = p.id === winner.id;
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between py-2 px-2 text-xs rounded ${
                    isPWinner ? 'bg-amber-500/10 font-bold text-amber-300' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isPWinner && <Award className="w-4 h-4 text-amber-400" />}
                    <span>{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">
                      {p.hand.length === 0 ? t.allCleared : `${p.hand.length} ${t.cards}`}
                    </span>
                    <span className="font-mono text-yellow-400 font-bold">{p.chips} 🪙</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Play Again Button */}
        <button
          onClick={onRestart}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-98"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.playAgain}</span>
        </button>
      </div>
    </div>
  );
};
