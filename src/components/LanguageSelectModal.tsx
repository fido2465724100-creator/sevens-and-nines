import React, { useEffect, useRef } from 'react';
import { LANGUAGES_100, LanguageData } from '../i18n/languages100';
import { TranslationDict } from '../i18n/translations';
import { Check, Globe, X } from 'lucide-react';

interface LanguageSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguageCode: string;
  onSelectLanguage: (code: string) => void;
  t: TranslationDict;
  isOnboarding?: boolean;
}

export const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
  isOpen,
  onClose,
  currentLanguageCode,
  onSelectLanguage,
  t,
  isOnboarding,
}) => {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const getGridCols = () => {
    if (typeof window === 'undefined') return 5;
    if (window.innerWidth < 640) return 2;
    if (window.innerWidth < 768) return 3;
    if (window.innerWidth < 1024) return 4;
    return 5;
  };

  useEffect(() => {
    if (isOpen) {
      const idx = LANGUAGES_100.findIndex((l) => l.code === currentLanguageCode);
      const targetIdx = idx >= 0 ? idx : 0;
      setTimeout(() => {
        buttonRefs.current[targetIdx]?.focus();
        buttonRefs.current[targetIdx]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 50);
    }
  }, [isOpen, currentLanguageCode]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const cols = getGridCols();
    let targetIndex = -1;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      targetIndex = Math.min(LANGUAGES_100.length - 1, index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      targetIndex = Math.max(0, index - 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = Math.min(LANGUAGES_100.length - 1, index + cols);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = Math.max(0, index - cols);
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = LANGUAGES_100.length - 1;
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (targetIndex !== -1 && buttonRefs.current[targetIndex]) {
      buttonRefs.current[targetIndex]?.focus();
      buttonRefs.current[targetIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900/95 border-2 border-amber-500/40 w-full h-full max-w-7xl max-h-[95vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Fullscreen Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center shadow-lg">
              <Globe className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{t.language}</span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  100
                </span>
                {isOnboarding && (
                  <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                    1 / 2
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                {t.gamepadNavHint}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer border border-transparent hover:border-slate-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 100 Languages Grid (Gamepad & Keyboard Accessible) */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {LANGUAGES_100.map((lang, index) => {
              const isSelected = currentLanguageCode === lang.code;

              return (
                <button
                  key={lang.code}
                  ref={(el) => {
                    buttonRefs.current[index] = el;
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    onClose();
                  }}
                  className={`
                    p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-150 cursor-pointer outline-none relative group
                    ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/25 ring-2 ring-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02]'
                        : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/80 hover:border-slate-600 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/50 focus:scale-[1.02]'
                    }
                  `}
                >
                  {/* Top: Flag & Checkmark */}
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-3xl drop-shadow select-none">{lang.flag}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase bg-black/40 px-1.5 py-0.5 rounded">
                        #{index + 1}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-black shadow">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle: Native name */}
                  <div className="my-1">
                    <span
                      className={`text-sm sm:text-base font-bold block truncate ${
                        isSelected ? 'text-amber-300' : 'text-white group-hover:text-amber-200'
                      }`}
                      dir={lang.dir || 'ltr'}
                    >
                      {lang.nativeName}
                    </span>
                    <span className="text-xs text-slate-400 truncate block">
                      {lang.name}
                    </span>
                  </div>

                  {/* Bottom: Localized bots preview */}
                  <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate text-slate-400">
                      🤖 {lang.botNames.join(', ')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl transition cursor-pointer"
          >
            {t.done}
          </button>
        </div>
      </div>
    </div>
  );
};
