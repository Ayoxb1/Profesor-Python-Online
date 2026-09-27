'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameState, StoryNode, Choice, InventoryItem } from '../types/game';
import { STORY_NODES as storyNodes, INITIAL_GAME_STATE as initialGameState } from '../data/storyNodes';
import DetectiveJournal from './DetectiveJournal';
import RiverPuzzle from './RiverPuzzle';
import AudioNotificationBanner from './AudioNotificationBanner';
import { audioManager } from '../utils/audioManager';

// Numeración romana para el orden clásico de deducciones
const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

export default function GameEngine() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [inputValue, setInputValue] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [showAudioBanner, setShowAudioBanner] = useState<boolean>(true);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const typewriterTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentNode: StoryNode =
    storyNodes[gameState.currentNodeId] || storyNodes['prologue_intro'] || storyNodes['intro_video'];

  const fullNarrativeText =
    typeof currentNode.description === 'function'
      ? currentNode.description(gameState)
      : currentNode.description;

  // GESTOR DE AUDIO: Transición limpia entre escenas (Fade out anterior -> Fade in nueva)
  useEffect(() => {
    if (currentNode.bgMusic) {
      audioManager.playBgm(
        currentNode.bgMusic,
        currentNode.id !== 'intro_video',
        currentNode.id === 'intro_video' ? 0.8 : 0.45
      );
    } else {
      audioManager.stopBgm();
    }

    if (currentNode.soundEffect && currentNode.id !== 'intro_video') {
      audioManager.playSfx(currentNode.soundEffect, 0.65);
    }
  }, [currentNode.id, currentNode.bgMusic, currentNode.soundEffect]);

  // EFECTO MÁQUINA DE ESCRIBIR
  useEffect(() => {
    if (typewriterTimerRef.current) {
      clearInterval(typewriterTimerRef.current);
    }

    setDisplayedText('');
    setIsTyping(true);

    let charIndex = 0;
    const speed = 11; // ms por carácter

    typewriterTimerRef.current = setInterval(() => {
      charIndex++;
      if (charIndex <= fullNarrativeText.length) {
        setDisplayedText(fullNarrativeText.slice(0, charIndex));
      } else {
        setIsTyping(false);
        if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
      }
    }, speed);

    return () => {
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    };
  }, [fullNarrativeText]);

  const handleSkipTyping = () => {
    if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    setDisplayedText(fullNarrativeText);
    setIsTyping(false);
  };

  // Manejo de Auto-avance para cinemáticas
  useEffect(() => {
    if (currentNode.autoAdvanceMs && currentNode.nextAutoNodeId) {
      const timer = setTimeout(() => {
        handleNavigate(currentNode.nextAutoNodeId!);
      }, currentNode.autoAdvanceMs);
      return () => clearTimeout(timer);
    }
  }, [currentNode.id, currentNode.autoAdvanceMs, currentNode.nextAutoNodeId]);

  // Atajos de teclado (1-9 para opciones, J para diario)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'j' || e.key === 'J') {
        audioManager.playSfx('/audio/PasandoPaginaDeLibro.mp3');
        setIsJournalOpen((prev) => !prev);
        return;
      }

      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= currentNode.choices.length) {
        const choice = currentNode.choices[num - 1];
        if (!choice.condition || choice.condition(gameState)) {
          handleChoice(choice);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentNode, gameState]);

  const handleNavigate = (nodeId: string, statePatch?: Partial<GameState>) => {
    audioManager.playSfx('/audio/PasandoPaginaDeLibro.mp3', 0.4);
    setGameState((prev) => {
      const updated: GameState = {
        ...prev,
        ...statePatch,
        currentNodeId: nodeId,
        visitedNodes: prev.visitedNodes.includes(nodeId)
          ? prev.visitedNodes
          : [...prev.visitedNodes, nodeId],
      };
      return updated;
    });
    setInputValue('');
  };

  const handleChoice = (choice: Choice) => {
    audioManager.playSfx('/audio/PasandoPaginaDeLibro.mp3', 0.4);
    let patch: Partial<GameState> = {};
    if (choice.action) {
      const actionResult = choice.action(gameState);
      if (actionResult) {
        patch = actionResult;
      }
    }

    if (choice.targetNodeId) {
      handleNavigate(choice.targetNodeId, patch);
    } else if (Object.keys(patch).length > 0) {
      setGameState((prev) => ({ ...prev, ...patch }));
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNode.inputConfig) return;

    const val = inputValue.trim();
    if (!val && !currentNode.inputConfig.defaultValue) return;

    audioManager.playSfx('/audio/PasandoPaginaDeLibro.mp3', 0.5);
    const finalVal = val || currentNode.inputConfig.defaultValue || '';
    const result = currentNode.inputConfig.onSubmit(finalVal, gameState);
    handleNavigate(result.nextNodeId, result.statePatch);
  };

  const toggleMute = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const restartGame = () => {
    if (window.confirm('¿Deseas reiniciar el expediente y volver a la portada?')) {
      audioManager.stopBgm();
      setGameState(initialGameState);
    }
  };

  const handleRiverSolved = () => {
    handleNavigate('central_nuclear', {
      solvedRiver: true,
      parchment3: true,
      inventory: gameState.inventory.some((i) => i.id === 'pergamino_3')
        ? gameState.inventory
        : [
            ...gameState.inventory,
            {
              id: 'pergamino_3',
              name: 'Pergamino de las Corrientes (3/3)',
              description: 'El códice fluvial que desbloquea la entrada final a la Central Nuclear.',
              icon: '📜',
            },
          ],
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-parchment select-none antialiased relative">
      {/* BANNER INICIAL DE ACTIVACIÓN DE AUDIO */}
      {showAudioBanner && (
        <AudioNotificationBanner
          onAudioActivated={() => {
            setShowAudioBanner(false);
            if (currentNode.bgMusic) {
              audioManager.playBgm(
                currentNode.bgMusic,
                currentNode.id !== 'intro_video',
                currentNode.id === 'intro_video' ? 0.8 : 0.45
              );
            }
          }}
          onDismiss={() => setShowAudioBanner(false)}
        />
      )}

      {/* CUADERNO DE DETECTIVE / RECORDATORIOS (MODAL) */}
      <DetectiveJournal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        gameState={gameState}
      />

      {/* MODAL DE INVENTARIO / MOCHILA */}
      {isInventoryOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsInventoryOpen(false)}
        >
          <div
            className="layton-container max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-amber-800/40 pb-3">
              <h2 className="text-lg font-bold font-layton text-amber-300 flex items-center gap-2">
                <span>🎒</span> Cartera de Evidencias
              </h2>
              <button
                onClick={() => setIsInventoryOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 flex items-center justify-center text-sm font-bold shadow transition"
              >
                ✕
              </button>
            </div>

            {gameState.inventory.length === 0 ? (
              <p className="text-sm text-stone-400 py-6 text-center italic font-parchment">
                No tienes objetos ni documentos por ahora. ¡Inspecciona los distritos para encontrar evidencias!
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {gameState.inventory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-stone-950/80 rounded-xl border border-amber-900/50 flex items-start gap-3 shadow-inner hover:border-amber-600/60 transition"
                  >
                    <span className="text-2xl mt-0.5">{item.icon || '📦'}</span>
                    <div>
                      <h4 className="text-sm font-semibold font-layton text-amber-300">{item.name}</h4>
                      <p className="text-xs text-stone-300 leading-snug">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-xs text-amber-300/90 border-t border-amber-900/40 pt-3 flex justify-between font-layton items-center">
              <span>Pergaminos recuperados:</span>
              <span className="font-mono text-amber-400 font-bold bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-600/50">
                {[gameState.parchment1, gameState.parchment2, gameState.parchment3].filter(Boolean).length} / 3
              </span>
            </div>
          </div>
        </div>
      )}

      {/* BARRA SUPERIOR VINTAGE CON RELIEVE (HUD) */}
      <header className="sticky top-0 z-40 bg-[#160d09]/95 backdrop-blur-md border-b-2 border-amber-700/60 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl">
        {/* LOGO E INFORMACIÓN */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-800 to-stone-950 border-2 border-amber-400/60 flex items-center justify-center text-xl shadow-lg shadow-amber-950/50">
            🎩
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-extrabold font-layton text-amber-300 tracking-wider">
                Profesor Python
              </h1>
              <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="En línea" />
            </div>
            <p className="text-xs text-stone-400 font-parchment truncate max-w-[130px] sm:max-w-xs flex items-center gap-1">
              <span>Detective:</span>
              <strong className="text-amber-200">{gameState.playerName || 'Investigador'}</strong>
            </p>
          </div>
        </div>

        {/* ACCIONES Y BOTONES TÁCTILES */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* BOTÓN RECORDATORIOS / CUADERNO (TÁCTIL SKEUOMÓRFICO) */}
          <button
            onClick={() => {
              audioManager.playSfx('/audio/PasandoPaginaDeLibro.mp3', 0.4);
              setIsJournalOpen(true);
            }}
            className="btn-layton-tactile px-3.5 py-2 rounded-xl text-xs font-layton font-bold text-amber-200 flex items-center gap-2 pulse-gold group shadow-md"
            title="Abrir Cuaderno del Profesor (Atajo: Tecla J)"
          >
            <span className="text-base group-hover:rotate-12 transition-transform">📔</span>
            <span className="hidden sm:inline">Recordatorios</span>
            <span className="bg-amber-500 text-stone-950 text-[10px] px-1.5 py-0.2 rounded-full font-sans font-black shadow">
              Pistas
            </span>
          </button>

          {/* MONEDAS CON MEDALLÓN DORADO */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-stone-950 to-amber-950/70 border border-amber-600/50 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 shadow-inner">
            <span className="w-5 h-5 rounded-full coin-medal flex items-center justify-center text-[10px] font-bold text-stone-950 shadow">
              🪙
            </span>
            <span className="font-mono text-sm font-extrabold">{gameState.money}</span>
            <span className="hidden sm:inline text-amber-400/80 text-[10px] uppercase tracking-wider font-sans">monedas</span>
          </div>

          {/* BOTÓN MOCHILA */}
          <button
            onClick={() => {
              audioManager.playSfx('/audio/PasandoPaginaDeLibro.mp3', 0.4);
              setIsInventoryOpen(!isInventoryOpen);
            }}
            className="btn-layton-tactile px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 text-stone-200"
            title="Abrir cartera de evidencias"
          >
            <span className="text-sm">🎒</span>
            <span className="hidden md:inline font-layton">Mochila</span>
            <span className="bg-amber-950/80 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold border border-amber-700/50">
              {gameState.inventory.length}
            </span>
          </button>

          {/* CONTROLES DE SONIDO Y PANTALLA */}
          <div className="flex items-center gap-1 border-l border-amber-900/50 pl-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-xl bg-stone-950/80 hover:bg-stone-900 text-stone-300 hover:text-amber-300 border border-amber-900/40 transition shadow"
              title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-stone-950/80 hover:bg-stone-900 text-stone-300 hover:text-amber-300 border border-amber-900/40 transition shadow hidden sm:flex items-center justify-center text-xs"
              title="Pantalla Completa"
            >
              {isFullscreen ? '🗗' : '⛶'}
            </button>

            <button
              onClick={restartGame}
              className="p-2 rounded-xl bg-stone-950/80 hover:bg-rose-950/60 text-stone-300 hover:text-rose-300 border border-amber-900/40 transition text-xs shadow"
              title="Reiniciar el caso desde la portada"
            >
              🔄
            </button>
          </div>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL: LA TARJETA DEL CASO */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-4xl mx-auto">
        <div className="w-full layton-container overflow-hidden flex flex-col">
          {/* CINTA DE UBICACIÓN SUPERIOR */}
          <div className="bg-gradient-to-r from-stone-950 via-amber-950/60 to-stone-950 px-5 py-2.5 border-b border-amber-800/40 flex items-center justify-between text-xs font-layton">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <span>📍</span>
              <span className="tracking-widest uppercase">
                {currentNode.location || 'Distrito de la Ciudad'}
              </span>
            </div>

            {currentNode.type === 'river_puzzle' && (
              <span className="bg-sky-950 text-sky-300 border border-sky-500/50 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold shadow-sm animate-pulse">
                🧩 Minijuego en curso
              </span>
            )}
          </div>

          {/* VISTA SEGÚN TIPO DE NODO: MINIJUEGO DEL RÍO O ESCENA ESTÁNDAR */}
          {currentNode.type === 'river_puzzle' ? (
            <div className="p-4 sm:p-6">
              <RiverPuzzle
                gameState={gameState}
                onSuccess={handleRiverSolved}
                onExit={() => handleNavigate('alameda_bifurcacion')}
              />
            </div>
          ) : (
            <>
              {/* ESCENARIO VISUAL / IMAGEN DE LA ESCENA */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group">
                {currentNode.image ? (
                  <img
                    src={currentNode.image}
                    alt={currentNode.title}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.01]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-stone-600 space-y-2">
                    <span className="text-5xl">🏛️</span>
                    <span className="text-xs font-layton">Ciudad de las Sombras</span>
                  </div>
                )}

                {/* BANNER ELEGANTE CON TÍTULO DE LA ESCENA */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/85 to-transparent p-4 sm:p-5 flex items-end justify-between">
                  <h2 className="text-base sm:text-2xl font-extrabold font-layton text-amber-300 drop-shadow-md">
                    {currentNode.title}
                  </h2>
                </div>
              </div>

              {/* DIÁLOGO Y NARRATIVA */}
              <div className="p-4 sm:p-6 space-y-4">
                {/* SI HAY PERSONAJE HABLANDO (SPEAKER) */}
                {currentNode.speaker && (
                  <div className="flex items-center gap-3.5 bg-gradient-to-r from-stone-950 via-amber-950/30 to-stone-950 border border-amber-600/50 rounded-2xl p-3 shadow-lg">
                    <img
                      src={currentNode.speaker.avatar || currentNode.image || '/images/inicio_general/PORTADA IMAGEN BUENA.png'}
                      alt={currentNode.speaker.name}
                      className="w-12 h-12 object-cover rounded-xl border-2 border-amber-500/60 shadow-md flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-layton font-extrabold text-sm sm:text-base text-amber-300">
                        {currentNode.speaker.name}
                      </h4>
                      <p className="text-xs text-amber-200/80 font-parchment italic">
                        {currentNode.speaker.role}
                      </p>
                    </div>
                  </div>
                )}

                {/* CAJA DE TEXTO NARRATIVO CON FONDO PERGAMINO */}
                <div
                  onClick={handleSkipTyping}
                  className="layton-parchment rounded-2xl p-4 sm:p-5 cursor-pointer relative group transition hover:border-amber-600/60"
                  title="Haz clic para mostrar todo el texto de inmediato"
                >
                  <p className="text-base sm:text-lg leading-relaxed text-amber-100/90 whitespace-pre-line font-medium font-parchment">
                    {displayedText}
                    {isTyping && <span className="inline-block w-1.5 h-4 bg-amber-400 ml-1 animate-pulse" />}
                  </p>

                  {isTyping && (
                    <div className="text-[10px] text-stone-500 text-right mt-2 font-sans flex items-center justify-end gap-1">
                      <span>Clic para avanzar</span>
                      <span>⏩</span>
                    </div>
                  )}
                </div>

                {/* MODO ENTRADA DE TEXTO (Para Nombres o Acertijos) */}
                {currentNode.type === 'input' && currentNode.inputConfig && (
                  <form onSubmit={handleInputSubmit} className="space-y-3 pt-2">
                    <label className="block text-xs font-bold font-layton text-amber-300 uppercase tracking-widest">
                      {currentNode.inputConfig.label}
                    </label>
                    <div className="flex gap-2.5">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={currentNode.inputConfig.placeholder}
                        autoFocus
                        className="flex-1 bg-stone-950/80 border-2 border-amber-600/50 rounded-xl px-4 py-2.5 text-sm sm:text-base text-amber-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 font-parchment shadow-inner"
                      />
                      <button
                        type="submit"
                        className="btn-layton-tactile px-6 py-2.5 rounded-xl font-layton font-extrabold text-xs sm:text-sm text-amber-200 transition flex items-center gap-2 shadow-lg"
                      >
                        <span>Confirmar</span>
                        <span>➔</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* PARRILLA DE BOTONES DE ACCIONES (TÁCTILES ESTILO LAYTON) */}
                {currentNode.choices && currentNode.choices.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <div className="text-[11px] font-bold font-layton text-amber-400/90 uppercase tracking-widest px-1 flex items-center gap-2">
                      <span>⚖️</span>
                      <span>Deducciones y Acciones Disponibles:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentNode.choices.map((choice, index) => {
                        const isAvailable = !choice.condition || choice.condition(gameState);
                        const romanNum = ROMAN_NUMERALS[index] || (index + 1).toString();

                        return (
                          <button
                            key={choice.id}
                            disabled={!isAvailable}
                            onClick={() => handleChoice(choice)}
                            className={`btn-layton-tactile p-4 rounded-2xl flex items-start gap-3.5 text-left group ${
                              isAvailable
                                ? 'cursor-pointer'
                                : 'opacity-40 cursor-not-allowed filter grayscale'
                            }`}
                          >
                            {/* MEDALLÓN CON NUMERACIÓN ROMANA */}
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-layton font-black flex-shrink-0 mt-0.5 border shadow-md transition-transform group-hover:scale-110 ${
                                isAvailable
                                  ? 'coin-medal text-stone-950'
                                  : 'bg-stone-950 text-stone-600 border-stone-800'
                              }`}
                            >
                              {romanNum}
                            </div>

                            {/* TEXTO DE LA OPCIÓN */}
                            <div className="flex-1 min-w-0">
                              <div
                                className={`text-sm sm:text-base font-semibold font-parchment leading-snug transition-colors ${
                                  isAvailable
                                    ? 'text-stone-200 group-hover:text-amber-200'
                                    : 'text-stone-500 line-through'
                                }`}
                              >
                                {choice.text}
                              </div>

                              {!isAvailable && choice.disabledReason && (
                                <div className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1 font-sans bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-800/40">
                                  <span>🔒</span>
                                  <span>{choice.disabledReason}</span>
                                </div>
                              )}
                            </div>

                            {/* FLECHA DE AVANCE */}
                            {isAvailable && (
                              <div className="text-amber-500/70 group-hover:text-amber-300 group-hover:translate-x-1 transition-all text-sm mt-0.5">
                                ➔
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="w-full text-center py-3.5 text-xs text-stone-500 border-t border-amber-950/40 font-layton">
        <p>
          El Profesor Python y El Misterio de la Alcantarilla &bull; Desarrollado por{' '}
          <span className="text-amber-400/90 font-bold">Pablo Jiménez Jorquera</span> &amp;{' '}
          <span className="text-amber-400/90 font-bold">Ayoub Atidi Belbaz</span>
        </p>
      </footer>
    </div>
  );
}
