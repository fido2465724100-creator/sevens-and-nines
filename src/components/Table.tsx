import React, { useState } from 'react';
import { Card as CardType, CardBackStyle, GameRules, GameState, TableClothColor } from '../engine/types';
import { SUITS_ORDER } from '../engine/rules';
import { Language, TranslationDict } from '../i18n/translations';
import { LANGUAGES_MAP } from '../i18n/languages100';
import { SuitTrack } from './SuitTrack';
import { PlayerSeat } from './PlayerSeat';
import { Hand } from './Hand';
import { GameLog } from './GameLog';
import { BookOpen, Coins, Globe, RotateCcw, Settings } from 'lucide-react';

interface TableProps {
  gameState: GameState;
  rules: GameRules;
  tableColor: TableClothColor;
  cardBackStyle: CardBackStyle;
  customCardBackUrl: string | null;
  botStatusText: string | null;
  validMoves: CardType[];
  isUserTurn: boolean;
  canPass: boolean;
  autoPass: boolean;
  onToggleAutoPass: () => void;
  language: Language;
  onOpenLanguageModal: () => void;
  onPlayCard: (card: CardType) => void;
  onPass: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  onRestart: () => void;
  t: TranslationDict;
}

export const Table: React.FC<TableProps> = ({
  gameState,
  rules,
  tableColor,
  cardBackStyle,
  customCardBackUrl,
  botStatusText,
  validMoves,
  isUserTurn,
  canPass,
  autoPass,
  onToggleAutoPass,
  language,
  onOpenLanguageModal,
  onPlayCard,
  onPass,
  onOpenSettings,
  onOpenRules,
  onRestart,
  t,
}) => {
  const { players, currentPlayerIndex, table, pot, moveHistory, winnerId } = gameState;
  const user = players[0];
  const botLeft = players[1];
  const botTop = players[2];
  const botRight = players[3];

  const feltGradients: Record<TableClothColor, string> = {
    green: 'radial-gradient(ellipse at center, #065f46 0%, #064e3b 50%, #022c22 100%)',
    blue: 'radial-gradient(ellipse at center, #1e3a8a 0%, #172554 50%, #0f172a 100%)',
    burgundy: 'radial-gradient(ellipse at center, #881337 0%, #4c0519 50%, #20020a 100%)',
    slate: 'radial-gradient(ellipse at center, #334155 0%, #1e293b 50%, #0f172a 100%)',
  };

  const currentLang = LANGUAGES_MAP[language] || LANGUAGES_MAP.ru;

  const displayRuleName = {
    nines: t.ninesTab,
    sevens: t.sevensTab,
    fantan: t.fantanTab,
    custom: rules.nameRu,
  }[rules.id] || rules.nameRu;

  return (
    <div
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden select-none"
      style={{
        background: feltGradients[tableColor],
      }}
    >
      {/* Wooden Table Border / Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.85)] border-[12px] border-amber-950/60" />

      {/* Top Navigation Bar */}
      <header className="relative z-30 flex items-center justify-between px-3 sm:px-8 py-2.5 bg-black/35 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-950 shadow-lg text-lg">
            9
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white leading-tight flex items-center gap-2">
              <span>{displayRuleName}</span>
              <span className="text-[10px] sm:text-xs font-normal text-amber-300/80 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                {rules.deckSize} {t.cardsCount}
              </span>
            </h1>
          </div>
        </div>

        {/* Action Buttons & Language Switcher */}
        <div className="flex items-center gap-2">
          {rules.passPenaltyChips > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-yellow-500/20 border border-yellow-400/60 text-yellow-300 font-bold text-xs shadow-md">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span>{t.pot}: {pot} 🪙</span>
            </div>
          )}

          {/* 100 Languages Fullscreen Trigger */}
          <button
            onClick={onOpenLanguageModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15 cursor-pointer shadow hover:border-amber-400/60 group"
            title={`${t.language} (100)`}
          >
            <Globe className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-45 transition-transform" />
            <span className="text-sm leading-none">{currentLang.flag}</span>
            <span className="hidden sm:inline text-xs font-medium">{currentLang.nativeName}</span>
            <span className="text-[10px] font-mono text-amber-300/80 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
              100
            </span>
          </button>

          <button
            onClick={onOpenRules}
            title={t.rules}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15 cursor-pointer shadow"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">{t.rules}</span>
          </button>

          <button
            onClick={onOpenSettings}
            title={t.settings}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15 cursor-pointer shadow"
          >
            <Settings className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">{t.settings}</span>
          </button>

          <button
            onClick={onRestart}
            title={t.restart}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/15 cursor-pointer shadow"
          >
            <RotateCcw className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </header>

      {/* Main Game Arena */}
      <main className="relative z-10 flex-1 flex flex-col justify-between items-center p-2 sm:p-4 max-w-7xl mx-auto w-full">
        {/* Top Player (Bot 2) */}
        <div className="flex justify-center w-full">
          {botTop && (
            <PlayerSeat
              player={botTop}
              isCurrentTurn={currentPlayerIndex === 2}
              isWinner={winnerId === botTop.id}
              position="top"
              cardBackStyle={cardBackStyle}
              customCardBackUrl={customCardBackUrl}
              botStatusText={currentPlayerIndex === 2 ? botStatusText : null}
              t={{ turn: t.turn, pass: t.pass }}
            />
          )}
        </div>

        {/* Middle Row: Left Bot + Center Suit Tracks + Right Bot */}
        <div className="flex items-center justify-between w-full my-2 gap-2 sm:gap-4">
          {/* Left Player (Bot 1) */}
          <div className="w-24 sm:w-32 shrink-0 flex justify-center">
            {botLeft && (
              <PlayerSeat
                player={botLeft}
                isCurrentTurn={currentPlayerIndex === 1}
                isWinner={winnerId === botLeft.id}
                position="left"
                cardBackStyle={cardBackStyle}
                customCardBackUrl={customCardBackUrl}
                botStatusText={currentPlayerIndex === 1 ? botStatusText : null}
                t={{ turn: t.turn, pass: t.pass }}
              />
            )}
          </div>

          {/* Center: The 4 Suit Tracks on the table */}
          <div className="flex-1 max-w-2xl flex flex-col gap-1.5 sm:gap-2">
            {SUITS_ORDER.map((suit) => (
              <SuitTrack
                key={suit}
                suit={suit}
                sequence={table[suit]}
                rules={rules}
                t={t}
              />
            ))}
          </div>

          {/* Right Player (Bot 3) */}
          <div className="w-24 sm:w-32 shrink-0 flex justify-center">
            {botRight && (
              <PlayerSeat
                player={botRight}
                isCurrentTurn={currentPlayerIndex === 3}
                isWinner={winnerId === botRight.id}
                position="right"
                cardBackStyle={cardBackStyle}
                customCardBackUrl={customCardBackUrl}
                botStatusText={currentPlayerIndex === 3 ? botStatusText : null}
                t={{ turn: t.turn, pass: t.pass }}
              />
            )}
          </div>
        </div>

        {/* Bottom Area: Human Player Hand and Game Log */}
        <div className="w-full flex flex-col items-center relative">
          <div className="w-full flex items-end justify-between gap-4">
            {/* User Avatar Badge */}
            <div className="w-24 sm:w-32 shrink-0 flex justify-center pb-4">
              {user && (
                <PlayerSeat
                  player={user}
                  isCurrentTurn={isUserTurn}
                  isWinner={winnerId === user.id}
                  position="bottom"
                  cardBackStyle={cardBackStyle}
                  customCardBackUrl={customCardBackUrl}
                  t={{ turn: t.turn, pass: t.pass }}
                />
              )}
            </div>

            {/* Hand with cards fanned and suit-separated */}
            <div className="flex-1 flex justify-center">
              {user && (
                <Hand
                  hand={user.hand}
                  validMoves={validMoves}
                  isMyTurn={isUserTurn}
                  onPlayCard={onPlayCard}
                  onPass={onPass}
                  canPass={canPass}
                  autoPass={autoPass}
                  onToggleAutoPass={onToggleAutoPass}
                  cardBackStyle={cardBackStyle}
                  customCardBackUrl={customCardBackUrl}
                  t={t}
                />
              )}
            </div>

            {/* Game Log on Right */}
            <div className="w-36 sm:w-48 shrink-0 hidden md:block pb-2">
              <GameLog
                moves={moveHistory}
                t={{
                  history: t.history,
                  started: t.started,
                  played: t.played,
                  passed: t.passed,
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
