'use client';

import React, { useState } from 'react';
import { GameState } from '../types/game';

interface Explorer {
  id: string;
  name: string;
  time: number;
  initialSide: boolean;
  avatar: string;
}

interface RiverPuzzleProps {
  gameState: GameState;
  onSuccess: () => void;
  onExit: () => void;
}

export default function RiverPuzzle({ gameState, onSuccess, onExit }: RiverPuzzleProps) {
  const [explorers, setExplorers] = useState<Explorer[]>([
    { id: 'ana', name: 'Ana', time: 1, initialSide: true, avatar: '👩‍🦰' },
    { id: 'bruno', name: 'Bruno', time: 2, initialSide: true, avatar: '🧑‍🦱' },
    { id: 'carla', name: 'Carla', time: 5, initialSide: true, avatar: '👩‍🔬' },
    { id: 'diego', name: 'Diego', time: 10, initialSide: true, avatar: '🧔' },
  ]);

  const [totalTime, setTotalTime] = useState<number>(0);
  const [flashlightOnInitialSide, setFlashlightOnInitialSide] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [historyLog, setHistoryLog] = useState<string[]>([]);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  // Seleccionar o deseleccionar explorador para subir a la balsa
  const toggleSelect = (explorer: Explorer) => {
    // Solo puede subirse si está en el mismo lado que la balsa/linterna
    if (explorer.initialSide !== flashlightOnInitialSide) return;

    if (selectedIds.includes(explorer.id)) {
      setSelectedIds(selectedIds.filter((id) => id !== explorer.id));
    } else {
      if (selectedIds.length >= 2) {
        // Máximo 2 personas en la balsa
        return;
      }
      setSelectedIds([...selectedIds, explorer.id]);
    }
  };

  const handleCross = () => {
    if (selectedIds.length === 0) return;

    const travelers = explorers.filter((e) => selectedIds.includes(e.id));
    const tripTime = Math.max(...travelers.map((t) => t.time));
    const newTotalTime = totalTime + tripTime;
    const direction = flashlightOnInitialSide ? 'Orilla Inicial ➔ Orilla Final' : 'Orilla Final ➔ Orilla Inicial';

    const names = travelers.map((t) => `${t.name} (${t.time}m)`).join(' y ');
    const logEntry = `${direction}: Cruzaron ${names} en ${tripTime} min. (Total: ${newTotalTime} min)`;

    const updatedExplorers = explorers.map((e) => {
      if (selectedIds.includes(e.id)) {
        return { ...e, initialSide: !e.initialSide };
      }
      return e;
    });

    setExplorers(updatedExplorers);
    setTotalTime(newTotalTime);
    setFlashlightOnInitialSide(!flashlightOnInitialSide);
    setSelectedIds([]);
    setHistoryLog((prev) => [logEntry, ...prev]);

    // Comprobar victoria: ¿Todos están en el lado final (initialSide === false)?
    const allCrossed = updatedExplorers.every((e) => !e.initialSide);
    if (allCrossed) {
      setIsVictory(true);
      try {
        const audio = new Audio('/audio/AudioVictoria.mp3');
        audio.volume = 0.8;
        audio.play().catch(() => {});
      } catch (e) {}
    }
  };

  const handleReset = () => {
    setExplorers([
      { id: 'ana', name: 'Ana', time: 1, initialSide: true, avatar: '👩‍🦰' },
      { id: 'bruno', name: 'Bruno', time: 2, initialSide: true, avatar: '🧑‍🦱' },
      { id: 'carla', name: 'Carla', time: 5, initialSide: true, avatar: '👩‍🔬' },
      { id: 'diego', name: 'Diego', time: 10, initialSide: true, avatar: '🧔' },
    ]);
    setTotalTime(0);
    setFlashlightOnInitialSide(true);
    setSelectedIds([]);
    setHistoryLog([]);
    setIsVictory(false);
  };

  const initialSideExplorers = explorers.filter((e) => e.initialSide);
  const finalSideExplorers = explorers.filter((e) => !e.initialSide);

  return (
    <div className="w-full bg-stone-950 border border-amber-600/40 rounded-2xl p-4 sm:p-6 shadow-2xl text-amber-100 font-parchment space-y-5">
      {/* CABECERA DEL ACERTIJO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-800/40 pb-4">
        <div>
          <span className="text-[10px] sm:text-xs uppercase font-sans font-bold tracking-wider sm:tracking-widest text-amber-400">
            Enigma Original de Bosque
          </span>
          <h3 className="text-lg sm:text-2xl font-bold font-layton text-amber-300 leading-tight">
            El Acertijo del Río y la Linterna
          </h3>
        </div>

        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          <div className="bg-amber-950/70 border border-amber-600/50 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-sm">⏱️</span>
            <span className="font-mono text-sm sm:text-base font-bold text-amber-300">{totalTime} min</span>
            <span className="text-[9px] sm:text-[10px] text-stone-400 font-sans">(Meta: ≤17m)</span>
          </div>

          <button
            onClick={() => setShowRules(!showRules)}
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-[11px] sm:text-xs font-layton text-amber-200 transition"
          >
            {showRules ? 'Ocultar' : '📖 Reglas'}
          </button>

          <button
            onClick={handleReset}
            className="p-1 sm:px-2.5 py-1 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-700/50 text-xs font-layton text-rose-200 transition"
            title="Reiniciar cruces"
          >
            🔄
          </button>
        </div>
      </div>

      {/* REGLAS DESPLEGABLES */}
      {showRules && (
        <div className="bg-stone-900/90 border border-amber-700/50 rounded-xl p-4 text-xs sm:text-sm text-stone-300 space-y-2 animate-in fade-in duration-150">
          <h4 className="font-layton font-bold text-amber-300">Reglas del Cruce (AcertijoRioBosque):</h4>
          <ul className="list-disc list-inside space-y-1 text-stone-300">
            <li>Cuatro exploradores deben cruzar el río usando una única balsa.</li>
            <li>En la balsa caben como <strong>máximo 2 personas</strong> por viaje.</li>
            <li>La <strong>linterna</strong> es obligatoria en cada travesía (ida y vuelta) y siempre viaja en la balsa.</li>
            <li>Cuando cruzan dos personas, la balsa navega a la velocidad del <strong>más lento</strong>:
              <span className="text-amber-400 font-semibold"> Ana (1m), Bruno (2m), Carla (5m), Diego (10m)</span>.
            </li>
            <li>¡El desafío de honor del Profesor es lograrlo en <strong>17 minutos o menos</strong>!</li>
          </ul>
        </div>
      )}

      {/* RÍO Y ORILLAS VISUALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* ORILLA INICIAL */}
        <div className={`p-4 rounded-2xl border transition-all ${
          flashlightOnInitialSide
            ? 'bg-amber-950/30 border-amber-500/70 shadow-lg shadow-amber-950/40'
            : 'bg-stone-900/40 border-stone-800'
        }`}>
          <div className="flex items-center justify-between mb-3 border-b border-amber-900/30 pb-2">
            <h4 className="font-layton font-bold text-sm text-amber-300 flex items-center gap-1.5">
              <span>🌲</span> Orilla Inicial
            </h4>
            {flashlightOnInitialSide && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded-full font-sans font-bold flex items-center gap-1 animate-pulse">
                <span>🔦</span> Linterna y Balsa
              </span>
            )}
          </div>

          <div className="space-y-2">
            {initialSideExplorers.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-4 text-center">Nadie en esta orilla</p>
            ) : (
              initialSideExplorers.map((exp) => {
                const isSelected = selectedIds.includes(exp.id);
                const canSelect = flashlightOnInitialSide;

                return (
                  <button
                    key={exp.id}
                    disabled={!canSelect}
                    onClick={() => toggleSelect(exp)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-amber-600/40 border-amber-400 text-white shadow-md'
                        : canSelect
                        ? 'bg-stone-800/80 hover:bg-stone-700/80 border-stone-700 text-stone-200'
                        : 'bg-stone-900/40 border-stone-800 text-stone-600 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{exp.avatar}</span>
                      <div className="text-left leading-tight">
                        <span className="text-sm font-semibold block">{exp.name}</span>
                        <span className="text-[11px] text-amber-300/80 font-mono">Tarda {exp.time} min</span>
                      </div>
                    </div>
                    <span className="text-xs">
                      {isSelected ? '🚣 En balsa' : canSelect ? '+ Subir' : 'Esperando'}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* CANAL DEL RÍO Y ACCIÓN DE CRUCE */}
        <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-800/40 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 space-y-2">
            <span className="text-3xl animate-bounce">🌊 🚣‍♂️ 🌊</span>
            <div className="font-layton text-xs font-bold text-sky-300 uppercase tracking-widest">
              Paso Fluvial de la Alameda
            </div>
            <p className="text-xs text-sky-200/80 max-w-[200px]">
              {selectedIds.length === 0
                ? 'Selecciona 1 o 2 personas en la orilla activa para subir a la balsa.'
                : `Pasajeros: ${selectedIds.map((id) => explorers.find((e) => e.id === id)?.name).join(' y ')}`}
            </p>
          </div>

          <button
            onClick={handleCross}
            disabled={selectedIds.length === 0}
            className={`relative z-10 w-full sm:w-auto px-5 py-2.5 rounded-xl font-layton font-bold text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-2 ${
              selectedIds.length > 0
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-900/50 hover:scale-105 active:scale-95'
                : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
            }`}
          >
            <span>Cruzar el Río</span>
            <span>➔</span>
          </button>
        </div>

        {/* ORILLA FINAL */}
        <div className={`p-4 rounded-2xl border transition-all ${
          !flashlightOnInitialSide
            ? 'bg-amber-950/30 border-amber-500/70 shadow-lg shadow-amber-950/40'
            : 'bg-stone-900/40 border-stone-800'
        }`}>
          <div className="flex items-center justify-between mb-3 border-b border-amber-900/30 pb-2">
            <h4 className="font-layton font-bold text-sm text-amber-300 flex items-center gap-1.5">
              <span>🏰</span> Orilla Final (Destino)
            </h4>
            {!flashlightOnInitialSide && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded-full font-sans font-bold flex items-center gap-1 animate-pulse">
                <span>🔦</span> Linterna y Balsa
              </span>
            )}
          </div>

          <div className="space-y-2">
            {finalSideExplorers.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-4 text-center">Nadie ha cruzado aún</p>
            ) : (
              finalSideExplorers.map((exp) => {
                const isSelected = selectedIds.includes(exp.id);
                const canSelect = !flashlightOnInitialSide;

                return (
                  <button
                    key={exp.id}
                    disabled={!canSelect}
                    onClick={() => toggleSelect(exp)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-amber-600/40 border-amber-400 text-white shadow-md'
                        : canSelect
                        ? 'bg-stone-800/80 hover:bg-stone-700/80 border-stone-700 text-stone-200'
                        : 'bg-stone-900/40 border-stone-800 text-stone-600 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{exp.avatar}</span>
                      <div className="text-left leading-tight">
                        <span className="text-sm font-semibold block">{exp.name}</span>
                        <span className="text-[11px] text-amber-300/80 font-mono">Tarda {exp.time} min</span>
                      </div>
                    </div>
                    <span className="text-xs">
                      {isSelected ? '🚣 En balsa' : canSelect ? '+ Subir' : 'A salvo'}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* MENSAJE DE VICTORIA */}
      {isVictory && (
        <div className="p-5 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-2 border-emerald-500/80 rounded-2xl text-center space-y-3 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="text-3xl">🎉 📜 🏆</div>
          <h4 className="text-xl font-bold font-layton text-emerald-300">
            ¡Enhorabuena! ¡Todos han cruzado con éxito!
          </h4>
          <p className="text-sm text-stone-200 max-w-lg mx-auto leading-relaxed">
            Has completado la travesía en <strong className="text-amber-300 font-mono font-bold">{totalTime} minutos</strong>.
            {totalTime <= 17
              ? ' ¡Una deducción perfecta digna del Profesor Layton! Has obtenido el Tercer Pergamino y paso franco hacia la Central Nuclear.'
              : ' Todos están a salvo al otro lado del río, aunque los más puristas afirman que puede lograrse en exactamente 17 minutos.'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onSuccess}
              className="bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold font-layton px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-900/40"
            >
              Recoger Pergamino y Continuar ➔
            </button>
          </div>
        </div>
      )}

      {/* REGISTRO DE MOVIMIENTOS */}
      {historyLog.length > 0 && (
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-3 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Historial de cruces:
          </div>
          <div className="max-h-24 overflow-y-auto space-y-1 text-xs text-stone-300 pr-1 font-mono">
            {historyLog.map((log, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-amber-400">»</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOTÓN SALIR / VOLVER */}
      <div className="flex justify-between items-center pt-2 border-t border-amber-900/30">
        <button
          onClick={onExit}
          className="text-xs text-stone-400 hover:text-amber-300 transition flex items-center gap-1 font-layton"
        >
          <span>←</span>
          <span>Volver a la bifurcación del bosque</span>
        </button>
      </div>
    </div>
  );
}
