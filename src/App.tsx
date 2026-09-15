import React, { useEffect, useMemo, useState } from 'react';
import {
  AiDifficulty,
  Card as CardType,
  CardBackStyle,
  GameRules,
  GameState,
  RulePresetId,
  TableClothColor,
} from './engine/types';
import { RULE_PRESETS } from './engine/rules';
import { getValidMoves, initGame, passTurn, playCard } from './engine/game';
import { chooseBotMove } from './engine/bot';
import { soundEngine } from './audio/soundEngine';
import { Language, TranslationDict, getTranslationsForLanguage } from './i18n/translations';
import { LANGUAGES_MAP } from './i18n/languages100';
import { Table } from './components/Table';
import { SettingsModal } from './components/SettingsModal';
import { RulesModal } from './components/RulesModal';
import { WinModal } from './components/WinModal';
import { LanguageSelectModal } from './components/LanguageSelectModal';

export const App: React.FC = () => {
  // Language (100 languages supported)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('nines_lang');
    return saved && LANGUAGES_MAP[saved] ? saved : 'ru';
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(() => {
    return localStorage.getItem('nines_lang_chosen') !== 'true';
  });

  const t: TranslationDict = useMemo(() => {
    return getTranslationsForLanguage(language);
  }, [language]);

  // Auto-pass toggle state
  const [autoPass, setAutoPass] = useState<boolean>(() => {
    return localStorage.getItem('nines_auto_pass') === 'true';
  });

  // Local storage loaded preferences
  const [rulePresetId, setRulePresetId] = useState<RulePresetId>(() => {
    return (localStorage.getItem('nines_preset') as RulePresetId) || 'nines';
  });

  const [cardBackStyle, setCardBackStyle] = useState<CardBackStyle>(() => {
    return (localStorage.getItem('nines_card_back') as CardBackStyle) || 'classic-blue';
  });

  const [customCardBackUrl, setCustomCardBackUrl] = useState<string | null>(() => {
    return localStorage.getItem('nines_custom_card_back');
  });

  const [tableColor, setTableColor] = useState<TableClothColor>(() => {
    return (localStorage.getItem('nines_table_color') as TableClothColor) || 'green';
  });

  const [aiDifficulty, setAiDifficulty] = useState<AiDifficulty>(() => {
    return (localStorage.getItem('nines_ai_diff') as AiDifficulty) || 'hard';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('nines_sound') !== 'false';
  });

  const [soundVolume, setSoundVolume] = useState<number>(() => {
    const v = localStorage.getItem('nines_volume');
    return v !== null ? parseFloat(v) : 0.5;
  });

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);

  // Bot Status / Thinking bubble text
  const [botStatusText, setBotStatusText] = useState<string | null>(null);

  // Game Engine State
  const activeRules: GameRules = useMemo(() => {
    return RULE_PRESETS[rulePresetId] || RULE_PRESETS.nines;
  }, [rulePresetId]);

  const getPlayerNamesForLang = (code: string) => {
    const langData = LANGUAGES_MAP[code] || LANGUAGES_MAP.ru;
    return [
      langData.playerYou,
      `${langData.botNames[0]} [${langData.botTag}]`,
      `${langData.botNames[1]} [${langData.botTag}]`,
      `${langData.botNames[2]} [${langData.botTag}]`,
    ];
  };

  const [gameState, setGameState] = useState<GameState>(() => {
    return initGame(activeRules, getPlayerNamesForLang(language));
  });

  const handleSelectLanguage = (newCode: string) => {
    setLanguage(newCode);
    localStorage.setItem('nines_lang', newCode);
    localStorage.setItem('nines_lang_chosen', 'true');
    const newLangData = LANGUAGES_MAP[newCode] || LANGUAGES_MAP.ru;
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p, idx) => {
        if (idx === 0) {
          return { ...p, name: newLangData.playerYou };
        }
        const botIdx = idx - 1;
        const botName = newLangData.botNames[botIdx] || `Bot ${idx}`;
        return { ...p, name: `${botName} [${newLangData.botTag}]` };
      }),
    }));
  };

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('nines_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('nines_auto_pass', autoPass ? 'true' : 'false');
  }, [autoPass]);

  useEffect(() => {
    soundEngine.setEnabled(soundEnabled);
    localStorage.setItem('nines_sound', soundEnabled ? 'true' : 'false');
  }, [soundEnabled]);

  useEffect(() => {
    soundEngine.setVolume(soundVolume);
    localStorage.setItem('nines_volume', soundVolume.toString());
  }, [soundVolume]);

  useEffect(() => {
    localStorage.setItem('nines_preset', rulePresetId);
  }, [rulePresetId]);

  useEffect(() => {
    localStorage.setItem('nines_card_back', cardBackStyle);
  }, [cardBackStyle]);

  useEffect(() => {
    localStorage.setItem('nines_table_color', tableColor);
  }, [tableColor]);

  useEffect(() => {
    localStorage.setItem('nines_ai_diff', aiDifficulty);
  }, [aiDifficulty]);

  // Restart game
  const handleRestart = (rules = activeRules) => {
    setBotStatusText(null);
    const newState = initGame(rules, getPlayerNamesForLang(language));
    setGameState(newState);
    soundEngine.playCardDeal();
  };

  const handleSelectRules = (newPresetId: RulePresetId) => {
    setRulePresetId(newPresetId);
    const newRules = RULE_PRESETS[newPresetId] || RULE_PRESETS.nines;
    handleRestart(newRules);
  };

  // Turn checks
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isUserTurn = currentPlayer ? !currentPlayer.isBot && gameState.status === 'playing' : false;

  const validMoves = useMemo(() => {
    if (!currentPlayer || gameState.status !== 'playing') return [];
    return getValidMoves(currentPlayer, gameState.table, gameState.rules, gameState.firstMoveDone);
  }, [currentPlayer, gameState.table, gameState.rules, gameState.firstMoveDone, gameState.status]);

  const canPass = isUserTurn && (validMoves.length === 0 || !gameState.rules.mandatoryPlay);

  // Player action: play card
  const handlePlayCard = (card: CardType) => {
    if (!isUserTurn) return;
    soundEngine.playCardPlace();
    setGameState((prev) => playCard(prev, currentPlayer.id, card));
  };

  // Player action: pass
  const handlePass = () => {
    if (!isUserTurn) return;
    soundEngine.playPass();
    if (gameState.rules.passPenaltyChips > 0) {
      soundEngine.playChip();
    }
    setGameState((prev) => passTurn(prev, currentPlayer.id));
  };

  // Auto-pass feature: when user has 0 valid moves and autoPass is enabled, automatically pass after 450ms
  useEffect(() => {
    if (isUserTurn && validMoves.length === 0 && autoPass && gameState.status === 'playing') {
      const timer = setTimeout(() => {
        handlePass();
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [isUserTurn, validMoves.length, autoPass, gameState.status]);

  // Bot Turn Automation Effect
  useEffect(() => {
    if (gameState.status !== 'playing') return;
    if (!currentPlayer || !currentPlayer.isBot) return;

    setBotStatusText(t.thinking);

    const timer = setTimeout(() => {
      const decision = chooseBotMove(
        currentPlayer,
        gameState.table,
        gameState.rules,
        gameState.firstMoveDone,
        aiDifficulty
      );

      if (decision.action === 'play' && decision.card) {
        const suitName = t[decision.card.suit as keyof TranslationDict] || decision.card.suit;
        setBotStatusText(`${t.played} ${decision.card.rank} ${suitName}`);
      } else {
        setBotStatusText(`${t.noMoves} — ${t.pass}`);
      }

      setTimeout(() => {
        if (decision.action === 'play' && decision.card) {
          soundEngine.playCardPlace();
          setGameState((prev) => playCard(prev, currentPlayer.id, decision.card!));
        } else {
          soundEngine.playPass();
          if (gameState.rules.passPenaltyChips > 0) {
            soundEngine.playChip();
          }
          setGameState((prev) => passTurn(prev, currentPlayer.id));
        }
        setBotStatusText(null);
      }, 500);
    }, 750);

    return () => clearTimeout(timer);
  }, [
    gameState.currentPlayerIndex,
    gameState.status,
    currentPlayer,
    gameState.table,
    gameState.rules,
    gameState.firstMoveDone,
    aiDifficulty,
    t.thinking,
  ]);

  const winner = gameState.winnerId
    ? gameState.players.find((p) => p.id === gameState.winnerId) || null
    : null;

  return (
    <div className="w-full min-h-screen font-sans text-slate-100 antialiased overflow-x-hidden">
      <Table
        gameState={gameState}
        rules={activeRules}
        tableColor={tableColor}
        cardBackStyle={cardBackStyle}
        customCardBackUrl={customCardBackUrl}
        botStatusText={botStatusText}
        validMoves={validMoves}
        isUserTurn={isUserTurn}
        canPass={canPass}
        autoPass={autoPass}
        onToggleAutoPass={() => setAutoPass((prev) => !prev)}
        language={language}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onPlayCard={handlePlayCard}
        onPass={handlePass}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onRestart={() => handleRestart()}
        t={t}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentRules={activeRules}
        onSelectRules={handleSelectRules}
        cardBackStyle={cardBackStyle}
        onSelectCardBack={setCardBackStyle}
        customCardBackUrl={customCardBackUrl}
        onSaveCustomCardBack={setCustomCardBackUrl}
        tableColor={tableColor}
        onSelectTableColor={setTableColor}
        aiDifficulty={aiDifficulty}
        onSelectAiDifficulty={setAiDifficulty}
        soundEnabled={soundEnabled}
        onToggleSound={setSoundEnabled}
        soundVolume={soundVolume}
        onChangeVolume={setSoundVolume}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onRestartGame={() => handleRestart()}
        t={t}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        t={t}
      />

      <WinModal
        isOpen={gameState.status === 'round_over' || gameState.status === 'game_over'}
        winner={winner}
        players={gameState.players}
        potWon={gameState.pot}
        onRestart={() => handleRestart()}
        t={t}
      />

      <LanguageSelectModal
        isOpen={isLanguageModalOpen}
        onClose={() => {
          setIsLanguageModalOpen(false);
          localStorage.setItem('nines_lang_chosen', 'true');
        }}
        currentLanguageCode={language}
        onSelectLanguage={handleSelectLanguage}
        t={t}
      />
    </div>
  );
};

export default App;
