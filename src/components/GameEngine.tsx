'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameState, StoryNode, Choice, InventoryItem } from '../types/game';
import { STORY_NODES as storyNodes, INITIAL_GAME_STATE as initialGameState } from '../data/storyNodes';
import DetectiveJournal from './DetectiveJournal';
import RiverPuzzle from './RiverPuzzle';

export default function GameEngine() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [inputValue, setInputValue] = useState<string>('');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [audioVolume, setAudioVolume] = useState<number>(0.4);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const typewriterTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentNode: StoryNode = storyNodes[gameState.currentNodeId] || storyNodes['prologue_intro'] || storyNodes['intro_video'];

  const fullNarrativeText =
    typeof currentNode.description === 'function'
      ? currentNode.description(gameState)
      : currentNode.description;

  // Efecto máquina de escribir para la narración
  useEffect(() => {
    if (typewriterTimerRef.current) {
      clearInterval(typewriterTimerRef.current);
    }

    setDisplayedText('');
    setIsTyping(true);

    let charIndex = 0;
    const speed = 12; // Velocidad de escritura en ms

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

  // Reproducción de música ambiental y SFX
  useEffect(() => {
    if (!audioEnabled || gameState.audioMuted) {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
      }
      return;
    }

    if (currentNode.bgMusic) {
      if (!bgAudioRef.current) {
        bgAudioRef.current = new Audio();
        bgAudioRef.current.loop = true;
      }
      const targetSrc = currentNode.bgMusic;
      if (
        bgAudioRef.current.src !== window.location.origin + targetSrc &&
        !bgAudioRef.current.src.endsWith(targetSrc)
      ) {
        bgAudioRef.current.src = targetSrc;
        bgAudioRef.current.volume = audioVolume;
        bgAudioRef.current.play().catch(() => {});
      }
    }

    if (currentNode.soundEffect) {
      try {
        const sfx = new Audio(currentNode.soundEffect);
        sfx.volume = Math.min(1, audioVolume * 1.5);
        sfx.play().catch(() => {});
      } catch (e) {}
    }
  }, [currentNode.bgMusic, currentNode.soundEffect, audioEnabled, gameState.audioMuted, audioVolume]);

  // Manejo de Auto-avance para cinemáticas
  useEffect(() => {
    if (currentNode.autoAdvanceMs && currentNode.nextAutoNodeId) {
      const timer = setTimeout(() => {
        handleNavigate(currentNode.nextAutoNodeId!);
      }, currentNode.autoAdvanceMs);
      return () => clearTimeout(timer);
    }
  }, [currentNode.id, currentNode.autoAdvanceMs, currentNode.nextAutoNodeId]);

  // Atajos de teclado (1-9 para opciones, J para diario, M para silenciar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'j' || e.key === 'J') {
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

  const playSfx = (src: string) => {
    try {
      const s = new Audio(src);
      s.volume = 0.5;
      s.play().catch(() => {});
    } catch (e) {}
  };

  const handleNavigate = (nodeId: string, statePatch?: Partial<GameState>) => {
    playSfx('/audio/PasandoPaginaDeLibro.mp3');
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

    const finalVal = val || currentNode.inputConfig.defaultValue || '';
    const result = currentNode.inputConfig.onSubmit(finalVal, gameState);
    handleNavigate(result.nextNodeId, result.statePatch);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (bgAudioRef.current) {
      if (audioEnabled) {
        bgAudioRef.current.pause();
      } else {
        bgAudioRef.current.play().catch(() => {});
      }
    }
  };

  const restartGame = () => {
    if (window.confirm('¿Deseas reiniciar el expediente y volver a la portada?')) {
      setGameState(initialGameState);
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
      }
    }
  };

  // Callback cuando se resuelve el acertijo del río
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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-parchment select-none antialiased relative">
      {/* CUADERNO DE DETECTIVE / RECORDATORIOS (MODAL) */}
      <DetectiveJournal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        gameState={gameState}
      />

      {/* MODAL DE INVENTARIO / MOCHILA */}
      {isInventoryOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsInventoryOpen(false)}
        >
          <div
            className="parchment-box border-2 border-amber-600/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-amber-800/40 pb-3">
              <h2 className="text-lg font-bold font-layton text-amber-300 flex items-center gap-2">
                <span>🎒</span> Mochila del Investigador
              </h2>
              <button
                onClick={() => setIsInventoryOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {gameState.inventory.length === 0 ? (
              <p className="text-sm text-stone-400 py-6 text-center italic font-parchment">
                Tu cartera y bolsillos están vacíos por ahora. Explora los distritos de la ciudad para recolectar pruebas y objetos clave.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {gameState.inventory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-stone-900/90 rounded-xl border border-amber-800/40 flex items-start gap-3 shadow-inner"
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

            <div className="text-xs text-amber-300/80 border-t border-amber-900/40 pt-3 flex justify-between font-layton">
              <span>Pergaminos sagrados:</span>
              <span className="font-mono text-amber-400 font-bold">
                {[gameState.parchment1, gameState.parchment2, gameState.parchment3].filter(Boolean).length} / 3
              </span>
            </div>
          </div>
        </div>
      )}

      {/* BARRA SUPERIOR VINTAGE (HUD) */}
      <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-amber-700/40 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-700 to-amber-950 border border-amber-500/50 flex items-center justify-center text-xl shadow-md">
            🕵️‍♂️
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold font-layton text-amber-300 tracking-wider">
              Profesor Python
            </h1>
            <p className="text-xs text-stone-400 font-parchment truncate max-w-[120px] sm:max-w-xs">
              Expediente: <span className="text-amber-200">{gameState.playerName || 'Detective'}</span>
            </p>
          </div>
        </div>

        {/* ACCESOS RÁPIDOS DEL DETECTIVE */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* BOTÓN RECORDATORIOS / CUADERNO */}
          <button
            onClick={() => setIsJournalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-900/80 to-stone-900 hover:from-amber-800 hover:to-stone-800 border border-amber-500/60 px-3 py-1.5 rounded-xl text-xs font-layton text-amber-200 shadow-md transition hover:scale-105 active:scale-95 group"
            title="Abrir Cuaderno de Recordatorios (Tecla J)"
          >
            <span className="text-base group-hover:rotate-12 transition-transform">📔</span>
            <span className="hidden md:inline font-bold">Recordatorios</span>
            <span className="bg-amber-500 text-stone-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              Guía
            </span>
          </button>

          {/* MONEDAS */}
          <div className="flex items-center gap-1.5 bg-stone-900/90 border border-amber-600/40 px-3 py-1 rounded-xl text-xs font-bold text-amber-300 shadow-inner">
            <span className="text-sm">🪙</span>
            <span className="font-mono">{gameState.money}</span>
            <span className="hidden sm:inline text-stone-400 text-[10px]">monedas</span>
          </div>

          {/* MOCHILA / INVENTARIO */}
          <button
            onClick={() => setIsInventoryOpen(!isInventoryOpen)}
            className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 px-2.5 py-1 rounded-xl text-xs transition"
            title="Ver inventario de objetos"
          >
            <span>🎒</span>
            <span className="hidden sm:inline">Mochila</span>
            <span className="bg-amber-900/60 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {gameState.inventory.length}
            </span>
          </button>

          {/* AUDIO Y REINICIO */}
          <div className="flex items-center gap-1 sm:gap-2 border-l border-amber-900/40 pl-2">
            <button
              onClick={toggleAudio}
              className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 transition"
              title={audioEnabled ? 'Silenciar música' : 'Activar sonido'}
            >
              {audioEnabled ? '🔊' : '🔇'}
            </button>
            <button
              onClick={restartGame}
              className="p-1.5 rounded-lg bg-stone-900 hover:bg-rose-950/60 text-stone-300 hover:text-rose-300 border border-stone-800 transition text-xs"
              title="Reiniciar caso"
            >
              🔄
            </button>
          </div>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-4xl mx-auto">
        <div className="w-full parchment-box border-2 border-amber-700/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur flex flex-col vintage-frame">
          {/* CABECERA DE LA ESCENA */}
          <div className="bg-stone-950/80 px-4 py-2 border-b border-amber-900/40 flex items-center justify-between text-xs font-layton">
            <div className="flex items-center gap-2 text-amber-300">
              <span>📍</span>
              <span className="tracking-widest uppercase font-semibold">
                {currentNode.location || 'Distrito de la Ciudad'}
              </span>
            </div>

            {currentNode.type === 'river_puzzle' && (
              <span className="bg-sky-950 text-sky-300 border border-sky-600/40 px-2 py-0.5 rounded-full text-[10px] font-sans font-bold animate-pulse">
                🧩 Minijuego Activo
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
              {/* ESCENARIO VISUAL / FOTOGRAMA */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group">
                {currentNode.image ? (
                  <img
                    src={currentNode.image}
                    alt={currentNode.title}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-stone-600 space-y-2">
                    <span className="text-5xl">🏛️</span>
                    <span className="text-xs font-layton">Ciudad de las Sombras</span>
                  </div>
                )}

                {/* BANNER INFERIOR CON TÍTULO DE LA ESCENA */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/85 to-transparent p-4 flex items-end justify-between">
                  <h2 className="text-base sm:text-xl font-bold font-layton text-amber-300 drop-shadow-md">
                    {currentNode.title}
                  </h2>
                </div>
              </div>

              {/* DIÁLOGO / NARRATIVA */}
              <div className="p-4 sm:p-6 space-y-4">
                {/* SI HAY PERSONAJE HABLANDO (SPEAKER) */}
                {currentNode.speaker && (
                  <div className="flex items-center gap-3 bg-stone-950/80 border border-amber-600/40 rounded-xl p-2.5 shadow-md">
                    <img
                      src={currentNode.speaker.avatar || currentNode.image || '/images/inicio_general/PORTADA IMAGEN BUENA.png'}
                      alt={currentNode.speaker.name}
                      className="w-12 h-12 object-cover rounded-lg border border-amber-500/50 shadow flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-layton font-bold text-sm text-amber-300">
                        {currentNode.speaker.name}
                      </h4>
                      <p className="text-xs text-amber-200/70 font-parchment italic">
                        {currentNode.speaker.role}
                      </p>
                    </div>
                  </div>
                )}

                {/* CAJA DE TEXTO NARRATIVO CON EFECTO TYPEWRITER */}
                <div
                  onClick={handleSkipTyping}
                  className="bg-stone-950/90 border border-amber-900/50 rounded-xl p-4 sm:p-5 shadow-inner cursor-pointer relative group"
                  title="Haz clic para mostrar todo el texto de inmediato"
                >
                  <p className="text-base sm:text-lg leading-relaxed text-amber-100/90 whitespace-pre-line font-medium font-parchment">
                    {displayedText}
                    {isTyping && <span className="inline-block w-1.5 h-4 bg-amber-400 ml-1 animate-pulse" />}
                  </p>

                  {isTyping && (
                    <div className="text-[10px] text-stone-500 text-right mt-2 font-sans">
                      (Clic para avanzar texto ⏩)
                    </div>
                  )}
                </div>

                {/* MODO ENTRADA DE TEXTO (Para Nombres o Acertijos) */}
                {currentNode.type === 'input' && currentNode.inputConfig && (
                  <form onSubmit={handleInputSubmit} className="space-y-3 pt-2">
                    <label className="block text-xs font-semibold font-layton text-amber-300 uppercase tracking-wider">
                      {currentNode.inputConfig.label}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={currentNode.inputConfig.placeholder}
                        autoFocus
                        className="flex-1 bg-stone-900 border-2 border-amber-600/50 rounded-xl px-4 py-2.5 text-sm sm:text-base text-amber-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 font-parchment"
                      />
                      <button
                        type="submit"
                        className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold font-layton px-6 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-amber-900/40 flex items-center gap-1.5"
                      >
                        <span>Confirmar</span>
                        <span>➔</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* OPCIONES / DECISIONES */}
                {currentNode.choices && currentNode.choices.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-bold font-layton text-amber-400/80 uppercase tracking-widest px-1">
                      Deducciones y Acciones
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentNode.choices.map((choice, index) => {
                        const isAvailable = !choice.condition || choice.condition(gameState);

                        return (
                          <button
                            key={choice.id}
                            disabled={!isAvailable}
                            onClick={() => handleChoice(choice)}
                            className={`group relative text-left p-3.5 rounded-xl border transition-all duration-150 flex items-start gap-3 shadow-md ${
                              isAvailable
                                ? 'bg-stone-900/90 hover:bg-amber-950/60 border-amber-900/40 hover:border-amber-500/80 hover:scale-[1.01] active:scale-[0.99]'
                                : 'bg-stone-950/60 border-stone-900 opacity-50 cursor-not-allowed text-stone-500'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                                isAvailable
                                  ? 'bg-stone-950 text-amber-400 border-amber-600/40 group-hover:border-amber-400 group-hover:bg-amber-500 group-hover:text-stone-950 transition'
                                  : 'bg-stone-950 text-stone-600 border-stone-800'
                              }`}
                            >
                              {index + 1}
                            </span>

                            <div className="flex-1 min-w-0">
                              <div
                                className={`text-sm sm:text-base font-medium font-parchment leading-snug ${
                                  isAvailable
                                    ? 'text-stone-200 group-hover:text-amber-100'
                                    : 'text-stone-500 line-through'
                                }`}
                              >
                                {choice.text}
                              </div>
                              {!isAvailable && choice.disabledReason && (
                                <div className="text-[11px] text-rose-400/90 mt-1 flex items-center gap-1 font-sans">
                                  <span>🔒</span>
                                  <span>{choice.disabledReason}</span>
                                </div>
                              )}
                            </div>
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

      {/* FOOTER DISCRETO */}
      <footer className="w-full text-center py-3 text-xs text-stone-600 border-t border-amber-950/40 font-layton">
        <p>
          El Profesor Python y El Misterio de la Alcantarilla &bull; Creado por{' '}
          <span className="text-amber-400/80">Pablo Jiménez Jorquera</span> &amp;{' '}
          <span className="text-amber-400/80">Ayoub Atidi Belbaz</span>
        </p>
      </footer>
    </div>
  );
}
