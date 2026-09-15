import React from 'react';
import { RulePresetId } from '../engine/types';
import { TranslationDict } from '../i18n/translations';
import { soundEngine } from '../audio/soundEngine';
import { Sparkles, ArrowRight } from 'lucide-react';

interface InitialGameModeModalProps {
  isOpen: boolean;
  onSelectGameMode: (presetId: RulePresetId) => void;
  t: TranslationDict;
}

export const InitialGameModeModal: React.FC<InitialGameModeModalProps> = ({
  isOpen,
  onSelectGameMode,
  t,
}) => {
  if (!isOpen) return null;

  const options: Array<{
    id: RulePresetId;
    title: string;
    badge: string;
    desc: string;
    accent: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'nines',
      title: t.ninesTab,
      badge: `36 ${t.cardsCount} • ${t.base} 9♦`,
      desc: t.ninesDesc,
      accent: 'border-amber-400/80 hover:border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 shadow-amber-500/10',
      icon: (
        <span className="text-3xl font-black text-amber-400 flex items-center justify-center select-none">
          <span className="text-red-500 mr-1">♦</span>9
        </span>
      ),
    },
    {
      id: 'sevens',
      title: t.sevensTab,
      badge: `52 ${t.cardsCount} • ${t.base} 7`,
      desc: t.sevensDesc,
      accent: 'border-sky-400/80 hover:border-sky-400 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 shadow-sky-500/10',
      icon: (
        <span className="text-2xl font-black text-sky-300 flex items-center justify-center gap-1 select-none">
          <span className="text-white text-lg">♠</span>
          <span className="text-red-400 text-lg">♥</span>
          <span>7</span>
        </span>
      ),
    },
    {
      id: 'fantan',
      title: t.fantanTab,
      badge: `52 ${t.cardsCount} • ${t.pot}`,
      desc: t.fantanDesc,
      accent: 'border-emerald-400/80 hover:border-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 shadow-emerald-500/10',
      icon: (
        <span className="text-3xl flex items-center justify-center drop-shadow select-none">
          🪙
        </span>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900/95 border-2 border-amber-500/50 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 space-y-6 text-center">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.rulesGuide}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t.chooseGameTitle || t.gameMode}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            {t.chooseGameSubtitle || t.gameMode}
          </p>
        </div>

        {/* 3 Game Mode Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                soundEngine.playCardPlace();
                onSelectGameMode(opt.id);
              }}
              className={`p-5 rounded-2xl border-2 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-lg hover:scale-[1.03] group ${opt.accent}`}
            >
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-slate-700 flex items-center justify-center shadow-inner group-hover:border-amber-400/60 transition">
                  {opt.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                    {opt.title}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                    {opt.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-4">
                  {opt.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white group-hover:text-amber-300 transition">
                <span>{t.playGame || t.restart}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
