import React, { useState } from 'react';
import { TranslationDict } from '../i18n/translations';
import { BookOpen, X } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationDict;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, t }) => {
  const [activeTab, setActiveTab] = useState<'nines' | 'sevens' | 'fantan' | 'tactics'>('nines');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>{t.rulesGuide}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-2 gap-2 overflow-x-auto">
          {[
            { id: 'nines', label: t.ninesTab },
            { id: 'sevens', label: t.sevensTab },
            { id: 'fantan', label: t.fantanTab },
            { id: 'tactics', label: t.tacticsTab },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer
                ${
                  activeTab === tab.id
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {activeTab === 'nines' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-amber-400">{t.ninesTab} (36 {t.cardsCount})</h3>
              <p>{t.ninesDesc}</p>
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <span className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
                  <span className="text-red-400 text-lg">♦</span> 9 ({t.base})
                </span>
                <span className="text-xs text-slate-300 font-mono">6, 7, 8 ← <strong>9</strong> → 10, J, Q, K, A</span>
              </div>
            </div>
          )}

          {activeTab === 'sevens' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-amber-400">{t.sevensTab} (52 {t.cardsCount})</h3>
              <p>{t.sevensDesc}</p>
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <span className="font-bold text-amber-400 text-sm">7 ♠ ♥ ♦ ♣ ({t.base})</span>
                <span className="text-xs text-slate-300 font-mono">2, 3, 4, 5, 6 ← <strong>7</strong> → 8, 9, 10, J, Q, K</span>
              </div>
            </div>
          )}

          {activeTab === 'fantan' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-amber-400">{t.fantanTab} (52 {t.cardsCount})</h3>
              <p>{t.fantanDesc}</p>
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <span className="font-bold text-yellow-300 flex items-center gap-1.5 text-sm">
                  <span>🪙</span>
                  <span>{t.pot}</span>
                </span>
                <span className="text-xs text-slate-300">{t.potWon}</span>
              </div>
            </div>
          )}

          {activeTab === 'tactics' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-amber-400">{t.tacticsTab}</h3>
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
                  <h4 className="font-bold text-amber-300 mb-1">{t.tactics1Title}</h4>
                  <p className="text-slate-300 leading-relaxed">{t.tactics1Desc}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
                  <h4 className="font-bold text-amber-300 mb-1">{t.tactics2Title}</h4>
                  <p className="text-slate-300 leading-relaxed">{t.tactics2Desc}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
                  <h4 className="font-bold text-amber-300 mb-1">{t.tactics3Title}</h4>
                  <p className="text-slate-300 leading-relaxed">{t.tactics3Desc}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition cursor-pointer"
          >
            {t.understood}
          </button>
        </div>
      </div>
    </div>
  );
};
