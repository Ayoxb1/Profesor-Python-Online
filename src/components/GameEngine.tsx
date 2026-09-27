'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameState, StoryNode, Choice, InventoryItem } from '../types/game';
import { storyNodes, initialGameState } from '../data/storyNodes';

export default function GameEngine() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [inputValue, setInputValue] = useState<string>('');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [logMessage, setLogMessage] = useState<string | null>(null);

  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const sfxAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentNode: StoryNode = storyNodes[gameState.currentNodeId] || storyNodes['prologue_intro'];

  // Sincronizar música de fondo
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
      if (bgAudioRef.current.src !== window.location.origin + currentNode.bgMusic && !bgAudioRef.current.src.endsWith(currentNode.bgMusic)) {
        bgAudioRef.current.src = currentNode.bgMusic;
        bgAudioRef.current.volume = 0.45;
        bgAudioRef.current.play().catch(() => {
          // Navegadores bloquean autoplay hasta primera interacción
        });
      }
    }

    // Efecto de sonido puntual (SFX)
    if (currentNode.soundEffect) {
      try {
        const sfx = new Audio(currentNode.soundEffect);
        sfx.volume = 0.7;
        sfx.play().catch(() => {});
      } catch (e) {
        console.warn('Audio error:', e);
      }
    }
  }, [currentNode.bgMusic, currentNode.soundEffect, audioEnabled, gameState.audioMuted]);

  // Manejo de Auto-avance para cinemáticas
  useEffect(() => {
    if (currentNode.autoAdvanceMs && currentNode.nextAutoNodeId) {
      const timer = setTimeout(() => {
        handleNavigate(currentNode.nextAutoNodeId!);
      }, currentNode.autoAdvanceMs);
      return () => clearTimeout(timer);
    }
  }, [currentNode.id, currentNode.autoAdvanceMs, currentNode.nextAutoNodeId]);

  // Soporte de atajos de teclado (1-9 para opciones)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el usuario está escribiendo en el input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

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
    if (window.confirm('¿Deseas reiniciar la partida desde el inicio?')) {
      setGameState(initialGameState);
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
      }
    }
  };

  const narrativeText =
    typeof currentNode.description === 'function'
      ? currentNode.description(gameState)
      : currentNode.description;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* HUD SUPERIOR */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-amber-900/40 px-4 py-2.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🕵️‍♂️</span>
            <div className="leading-tight">
              <h1 className="text-sm font-bold text-amber-400 tracking-wide">
                Profesor Python
              </h1>
              <p className="text-xs text-slate-400 truncate max-w-[120px] sm:max-w-xs">
                {gameState.playerName || 'Investigador'}
              </p>
            </div>
          </div>
        </div>

        {/* CONTADORES Y ESTADÍSTICAS */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-semibold text-amber-300 shadow-inner">
            <span>🪙</span>
            <span>{gameState.money} monedas</span>
          </div>

          <button
            onClick={() => setIsInventoryOpen(!isInventoryOpen)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-full text-xs transition"
            title="Ver inventario"
          >
            <span>🎒</span>
            <span className="hidden sm:inline">Mochila</span>
            <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {gameState.inventory.length}
            </span>
          </button>

          {/* AUDIO Y CONTROLES */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition"
              title={audioEnabled ? 'Silenciar música' : 'Activar música'}
            >
              {audioEnabled ? '🔊' : '🔇'}
            </button>
            <button
              onClick={restartGame}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 transition text-xs"
              title="Reiniciar aventura"
            >
              🔄
            </button>
          </div>
        </div>
      </header>

      {/* MODAL DE INVENTARIO */}
      {isInventoryOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsInventoryOpen(false)}
        >
          <div
            className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <span>🎒</span> Inventario de Objetos
              </h2>
              <button
                onClick={() => setIsInventoryOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {gameState.inventory.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center italic">
                La mochila está vacía por ahora. ¡Explora la ciudad para encontrar objetos!
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {gameState.inventory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start gap-3"
                  >
                    <span className="text-2xl">{item.icon || '📦'}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-amber-300">{item.name}</h4>
                      <p className="text-xs text-slate-300">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-xs text-slate-500 border-t border-slate-800 pt-3 flex justify-between">
              <span>Pergaminos descubiertos:</span>
              <span className="font-mono text-amber-400">
                {[gameState.parchment1, gameState.parchment2, gameState.parchment3].filter(Boolean).length} / 3
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-4xl mx-auto">
        <div className="w-full bg-slate-900/70 border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur flex flex-col">
          {/* ETAPAS VISUALES / IMAGEN DE LA ESCENA */}
          <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group">
            {currentNode.image ? (
              <img
                src={currentNode.image}
                alt={currentNode.title}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-600 space-y-2">
                <span className="text-4xl">🏛️</span>
                <span className="text-xs">Ciudad de las Sombras</span>
              </div>
            )}

            {/* Título de la Escena Flotante */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 flex items-end">
              <h2 className="text-base sm:text-xl font-bold text-amber-300 drop-shadow-md">
                {currentNode.title}
              </h2>
            </div>
          </div>

          {/* ÁREA DE TEXTO NARRATIVO */}
          <div className="p-4 sm:p-6 space-y-4">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-inner">
              <p className="text-sm sm:text-base leading-relaxed text-slate-200 whitespace-pre-line font-medium font-serif">
                {narrativeText}
              </p>
            </div>

            {/* MODO DE ENTRADA DE TEXTO (Para Nombres o Acertijos Numéricos) */}
            {currentNode.type === 'input' && currentNode.inputConfig && (
              <form onSubmit={handleInputSubmit} className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  {currentNode.inputConfig.label}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={currentNode.inputConfig.placeholder}
                    autoFocus
                    className="flex-1 bg-slate-800/90 border border-amber-500/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-amber-900/30 flex items-center gap-1.5"
                  >
                    <span>Confirmar</span>
                    <span>➔</span>
                  </button>
                </div>
              </form>
            )}

            {/* PARRILLA DE BOTONES DE OPCIONES / ELECCIONES */}
            {currentNode.choices && currentNode.choices.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
                  Acciones disponibles
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentNode.choices.map((choice, index) => {
                    const isAvailable = !choice.condition || choice.condition(gameState);

                    return (
                      <button
                        key={choice.id}
                        disabled={!isAvailable}
                        onClick={() => handleChoice(choice)}
                        className={`group relative text-left p-3.5 rounded-xl border transition duration-150 flex items-start gap-3 shadow-md ${
                          isAvailable
                            ? 'bg-slate-800/80 hover:bg-amber-950/40 border-slate-700/80 hover:border-amber-500/60 active:scale-[0.99]'
                            : 'bg-slate-900/50 border-slate-800/60 opacity-50 cursor-not-allowed text-slate-500'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                            isAvailable
                              ? 'bg-slate-900 text-amber-400 border-amber-500/30 group-hover:border-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition'
                              : 'bg-slate-950 text-slate-600 border-slate-800'
                          }`}
                        >
                          {index + 1}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-sm font-medium ${
                              isAvailable
                                ? 'text-slate-200 group-hover:text-amber-200'
                                : 'text-slate-500 line-through'
                            }`}
                          >
                            {choice.text}
                          </div>
                          {!isAvailable && choice.disabledReason && (
                            <div className="text-[11px] text-rose-400/90 mt-0.5 flex items-center gap-1 font-sans">
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
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full text-center py-3 text-xs text-slate-600 border-t border-slate-900">
        <p>
          El Profesor Python y El Misterio de la Alcantarilla &bull; Creado por{' '}
          <span className="text-slate-400">Pablo Jiménez Jorquera</span> &amp;{' '}
          <span className="text-slate-400">Ayoub Atidi Belbaz</span>
        </p>
      </footer>
    </div>
  );
}
