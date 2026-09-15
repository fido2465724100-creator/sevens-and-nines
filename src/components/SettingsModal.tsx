import React, { useRef } from 'react';
import { AiDifficulty, CardBackStyle, GameRules, RulePresetId, TableClothColor } from '../engine/types';
import { RULE_PRESETS } from '../engine/rules';
import { CARD_BACK_OPTIONS } from '../types/cardBacks';
import { Language, TranslationDict } from '../i18n/translations';
import { LANGUAGES_MAP } from '../i18n/languages100';
import { CardBack } from './CardBack';
import { soundEngine } from '../audio/soundEngine';
import { Check, Globe, ImagePlus, RotateCcw, Trash2, Volume2, VolumeX, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRules: GameRules;
  onSelectRules: (presetId: RulePresetId) => void;
  cardBackStyle: CardBackStyle;
  onSelectCardBack: (style: CardBackStyle) => void;
  customCardBackUrl: string | null;
  onSaveCustomCardBack: (url: string | null) => void;
  tableColor: TableClothColor;
  onSelectTableColor: (color: TableClothColor) => void;
  aiDifficulty: AiDifficulty;
  onSelectAiDifficulty: (diff: AiDifficulty) => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  soundVolume: number;
  onChangeVolume: (vol: number) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  onOpenLanguageModal: () => void;
  onRestartGame: () => void;
  t: TranslationDict;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentRules,
  onSelectRules,
  cardBackStyle,
  onSelectCardBack,
  customCardBackUrl,
  onSaveCustomCardBack,
  tableColor,
  onSelectTableColor,
  aiDifficulty,
  onSelectAiDifficulty,
  soundEnabled,
  onToggleSound,
  soundVolume,
  onChangeVolume,
  language,
  onSelectLanguage,
  onOpenLanguageModal,
  onRestartGame,
  t,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentLangData = LANGUAGES_MAP[language] || LANGUAGES_MAP.ru;

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert(t.fileTooLarge);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      onSaveCustomCardBack(base64);
      onSelectCardBack('custom');
      try {
        localStorage.setItem('nines_custom_card_back', base64);
      } catch (err) {
        console.warn('Could not save to localStorage:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomBack = () => {
    onSaveCustomCardBack(null);
    if (cardBackStyle === 'custom') {
      onSelectCardBack('classic-blue');
    }
    localStorage.removeItem('nines_custom_card_back');
  };

  const presetDescriptions: Record<RulePresetId, string> = {
    nines: t.ninesDesc,
    sevens: t.sevensDesc,
    fantan: t.fantanDesc,
    custom: t.gameMode,
  };

  const presetNames: Record<RulePresetId, string> = {
    nines: t.ninesTab,
    sevens: t.sevensTab,
    fantan: t.fantanTab,
    custom: t.gameMode,
  };

  const getCardBackName = (id: CardBackStyle): string => {
    switch (id) {
      case 'classic-blue': return t.cardBackClassicBlue;
      case 'classic-red': return t.cardBackClassicRed;
      case 'soviet-atlas': return t.cardBackSovietAtlas;
      case 'royal-gold': return t.cardBackRoyalGold;
      case 'emerald': return t.cardBackEmerald;
      case 'cyber-neon': return t.cardBackCyberNeon;
      case 'wood-vintage': return t.cardBackWood;
      case 'galaxy': return t.cardBackSpace;
      default: return id;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            ⚙️ {t.settingsTitle}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-200">
          {/* Section 0: 100 Languages Switcher */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {t.language} (100)
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {t.gamepadNavHint}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-800/40 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3.5">
                <span className="text-3xl drop-shadow select-none">{currentLangData.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">
                      {currentLangData.nativeName}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({currentLangData.name})
                    </span>
                  </div>
                  <span className="text-xs text-amber-400/90 block mt-0.5">
                    🤖 {currentLangData.botNames.join(', ')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onOpenLanguageModal();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{t.choose} (100)</span>
              </button>
            </div>
          </div>

          {/* Section 1: Rules & Presets */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              {t.gameMode}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['nines', 'sevens', 'fantan'] as RulePresetId[]).map((presetKey) => {
                const preset = RULE_PRESETS[presetKey];
                const isSelected = currentRules.id === presetKey;

                return (
                  <button
                    key={presetKey}
                    onClick={() => {
                      onSelectRules(presetKey);
                      soundEngine.playCardPlace();
                    }}
                    className={`
                      p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer
                      ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/15 shadow-md shadow-amber-500/10'
                          : 'border-slate-700 bg-slate-800/60 hover:border-slate-500'
                      }
                    `}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{presetNames[presetKey]}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block font-mono">
                        {preset.deckSize} {t.cardsCount} • {t.base} {preset.baseRank}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-300/80 mt-2 line-clamp-3">
                      {presetDescriptions[presetKey]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Card Back Customization */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {t.cardBacks}
              </h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition cursor-pointer"
              >
                <ImagePlus className="w-4 h-4" />
                <span>{t.uploadPhoto}</span>
              </button>
            </div>

            {/* Custom Photo preview card if uploaded */}
            {customCardBackUrl && (
              <div className="mb-4 p-3 rounded-xl bg-slate-800/80 border border-indigo-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-14 rounded overflow-hidden border border-white/50 shadow">
                    <img
                      src={customCardBackUrl}
                      alt="Custom back"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block">
                      {t.myPhoto}
                    </span>
                    <span className="text-[11px] text-emerald-400">
                      {t.savedLocal}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectCardBack('custom');
                      soundEngine.playCardPlace();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      cardBackStyle === 'custom'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                  >
                    {cardBackStyle === 'custom' ? t.chosen : t.choose}
                  </button>
                  <button
                    onClick={handleRemoveCustomBack}
                    title={t.removePhoto}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 8 Built-in Card Backs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CARD_BACK_OPTIONS.map((opt) => {
                const isSelected = cardBackStyle === opt.id;
                const cardBackName = getCardBackName(opt.id);

                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onSelectCardBack(opt.id);
                      soundEngine.playCardPlace();
                    }}
                    className={`
                      p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left cursor-pointer
                      ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/40'
                          : 'border-slate-800 bg-slate-800/40 hover:border-slate-600'
                      }
                    `}
                  >
                    <div className="w-8 h-12 shrink-0 rounded overflow-hidden shadow">
                      <CardBack style={opt.id} />
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-semibold text-white text-xs block truncate">
                        {cardBackName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Table Cloth & AI Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Table Cloth Color */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                {t.tableColor}
              </h3>
              <div className="flex items-center gap-2">
                {[
                  { id: 'green', label: t.feltEmerald, bg: 'bg-emerald-800' },
                  { id: 'blue', label: t.feltSapphire, bg: 'bg-blue-900' },
                  { id: 'burgundy', label: t.feltBurgundy, bg: 'bg-rose-950' },
                  { id: 'slate', label: t.feltSlate, bg: 'bg-slate-800' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectTableColor(item.id as TableClothColor)}
                    className={`
                      flex-1 py-1.5 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer
                      ${
                        tableColor === item.id
                          ? 'border-amber-400 text-white ring-2 ring-amber-400/40'
                          : 'border-slate-700 text-slate-300 hover:border-slate-500'
                      }
                      ${item.bg}
                    `}
                  >
                    {tableColor === item.id && <Check className="w-3.5 h-3.5" />}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Difficulty */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                {t.botDifficulty}
              </h3>
              <div className="flex items-center gap-2">
                {[
                  { id: 'easy', label: t.easy },
                  { id: 'medium', label: t.medium },
                  { id: 'hard', label: t.hard },
                ].map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => onSelectAiDifficulty(diff.id as AiDifficulty)}
                    className={`
                      flex-1 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer
                      ${
                        aiDifficulty === diff.id
                          ? 'border-amber-400 bg-amber-500/20 text-white'
                          : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-500'
                      }
                    `}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Sound Controls */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              {t.sounds}
            </h3>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
              <button
                onClick={() => onToggleSound(!soundEnabled)}
                className={`p-2 rounded-lg font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                  soundEnabled
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{soundEnabled ? t.soundOn : t.soundOff}</span>
              </button>

              <div className="flex-1 flex items-center gap-3">
                <span className="text-xs text-slate-400">{t.volume}:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundVolume}
                  onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-amber-400"
                />
                <span className="text-xs font-mono text-slate-300 w-8">
                  {Math.round(soundVolume * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={() => {
              onRestartGame();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.newGame}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer"
          >
            {t.done}
          </button>
        </div>
      </div>
    </div>
  );
};
