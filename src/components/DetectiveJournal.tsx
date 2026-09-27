'use client';

import React, { useState } from 'react';
import { GameState } from '../types/game';

interface DetectiveJournalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
}

type TabType = 'objetivos' | 'pergaminos' | 'sospechosos' | 'consejos';

export default function DetectiveJournal({ isOpen, onClose, gameState }: DetectiveJournalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('objetivos');

  if (!isOpen) return null;

  const objectives = [
    {
      id: 'obj_paper',
      title: 'Examinar los jeroglíficos encontrados',
      desc: 'Analizar el papel arrugado recogido del suelo de la ciudad.',
      done: gameState.visitedNodes.includes('mirando_papel'),
      hint: 'Revisa el papel desde la mochila o al inicio del juego.',
    },
    {
      id: 'obj_oldman',
      title: 'Interrogar al anciano de la Plaza Central',
      desc: 'Obtener información sobre los extraños ruidos de la alcantarilla.',
      done: gameState.talkedToOldMan,
      hint: 'Se encuentra sentado en el banco de la Plaza Central.',
    },
    {
      id: 'obj_fibonacci',
      title: 'Descifrar la caja fuerte de Fibonacci',
      desc: 'Resolver la secuencia numérica [1, 1, 2, 3, 5, 8, 13, ?] en la trastienda.',
      done: gameState.parchment1 || gameState.money >= 20,
      hint: 'Dirígete al Mercado Mayorista -> Tienda/Bazar -> Puerta trasera. La clave es el siguiente número de la suma.',
    },
    {
      id: 'obj_tree',
      title: 'Encontrar la Llave Antigua en la Alameda',
      desc: 'Inspeccionar el roble colosal en la Alameda Aullante para abrir la verja de la colina.',
      done: gameState.inventory.some((i) => i.id === 'llave_antigua'),
      hint: 'Ve a la Alameda Aullante e inspecciona el roble hueco antes de la bifurcación.',
    },
    {
      id: 'obj_river',
      title: 'Cruzar el Río Turbulento con la balsa',
      desc: 'Ayudar a los 4 amigos a cruzar con la linterna en 17 minutos o menos.',
      done: gameState.solvedRiver,
      hint: 'Sigue el sendero izquierdo de la bifurcación en la Alameda Aullante.',
    },
    {
      id: 'obj_train',
      title: 'Comprar el billete de tren a la Central',
      desc: 'Abonar 10 monedas en la taquilla de la Estación Central de Ferrocarril.',
      done: gameState.visitedNodes.includes('central_nuclear'),
      hint: 'Consigue monedas resolviendo el acertijo de Fibonacci en el bazar.',
    },
    {
      id: 'obj_library',
      title: 'Consultar al Sabio Bibliotecario',
      desc: 'Conseguir que el conservador de códices traduzca los símbolos del manuscrito.',
      done: gameState.parchment2,
      hint: 'Visita la Gran Biblioteca en el Barrio Antiguo.',
    },
    {
      id: 'obj_final',
      title: 'Descender a la Ciudad Subterránea',
      desc: 'Franquear la vigilancia de la Central Nuclear y entrar por la alcantarilla maestra.',
      done: gameState.visitedNodes.includes('alcantarilla_final'),
      hint: 'Habla con el centinela de la Central una vez tengas los pergaminos.',
    },
  ];

  const characters = [
    {
      name: gameState.playerName || 'Detective Principal',
      role: 'Profesor Detective y Mente Deductiva',
      avatar: '/images/inicio_general/PORTADA IMAGEN BUENA.png',
      desc: 'Líder de la investigación. Experto en deducción lógica, análisis de enigmas y descifrado de códigos antiguos.',
    },
    {
      name: gameState.femaleName || 'Elena',
      role: 'Analista de Historia y Alquimia',
      avatar: '/images/personajes/chica.png',
      desc: 'Posee una memoria fotográfica excepcional. Es capaz de identificar patrones en inscripciones desgastadas.',
    },
    {
      name: gameState.maleName || 'Marcos',
      role: 'Aprendiz y Especialista de Campo',
      avatar: '/images/personajes/chico.png',
      desc: 'Ágil y observador. Siempre lleva consigo las herramientas básicas y el bloc de apuntes del equipo.',
    },
    {
      name: 'Caballero Desconocido',
      role: 'Habitante Veterano de la Plaza',
      avatar: '/images/plaza_central/EscenaHablandoconSeñorFuera.png',
      desc: 'Lleva décadas escuchando las pulsaciones bajo el adoquinado. Sus pistas te dirigen hacia el bazar y la central.',
    },
    {
      name: 'Tendero del Bazar',
      role: 'Comerciante de Antigüedades',
      avatar: '/images/Zona_tienda_bazar/dependiente_mercado.png',
      desc: 'Hombre desconfiado pero aficionado a las matemáticas. Custodia una caja fuerte con monedas de plata.',
    },
    {
      name: 'Sabio Bibliotecario',
      role: 'Conservador de Manuscritos Antiguos',
      avatar: '/images/Libreria/hablando_bibliotecario.png',
      desc: 'Erudito retirado que conoce los anales de la orden secreta que construyó las canalizaciones subterráneas.',
    },
    {
      name: 'Capitán de Seguridad',
      role: 'Centinela de la Central Nuclear',
      avatar: '/images/central_nuclear/conversacion_guardia.png',
      desc: 'Custodia el umbral hacia el santuario subterráneo. Exige solvencia intelectual para permitir el paso.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="parchment-box border-2 border-amber-600/60 rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[94vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABECERA VINTAGE DEL CUADERNO */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 px-3.5 sm:px-5 py-3 sm:py-4 border-b border-amber-700/50 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="text-xl sm:text-2xl drop-shadow flex-shrink-0">📔</span>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-bold font-layton text-amber-300 tracking-wide sm:tracking-wider truncate">
                Cuaderno del Profesor Python
              </h2>
              <p className="text-[10px] sm:text-xs text-amber-200/70 font-parchment italic truncate">
                Anotaciones, deducciones y estado del caso
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-800 hover:bg-amber-900/60 text-amber-300 border border-amber-600/40 flex items-center justify-center text-xs sm:text-sm font-bold transition shadow flex-shrink-0"
            title="Cerrar Cuaderno"
          >
            ✕
          </button>
        </div>

        {/* NAVEGACIÓN POR PESTAÑAS RESPONSIVE */}
        <div className="bg-stone-950/80 px-2 sm:px-4 py-2 border-b border-amber-900/40 flex gap-1.5 sm:gap-2 overflow-x-auto text-[11px] sm:text-xs font-layton">
          <button
            onClick={() => setActiveTab('objetivos')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg border transition flex items-center gap-1 sm:gap-1.5 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'objetivos'
                ? 'bg-amber-700/40 text-amber-200 border-amber-500 shadow-inner font-bold'
                : 'bg-stone-900/60 text-stone-400 border-transparent hover:text-amber-200'
            }`}
          >
            <span>📌</span>
            <span>Recordatorios ({objectives.filter((o) => o.done).length}/{objectives.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pergaminos')}
            className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pergaminos'
                ? 'bg-amber-700/40 text-amber-200 border-amber-500 shadow-inner'
                : 'bg-stone-900/60 text-stone-400 border-transparent hover:text-amber-200'
            }`}
          >
            <span>📜</span>
            <span>Pergaminos y Pistas</span>
          </button>

          <button
            onClick={() => setActiveTab('sospechosos')}
            className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sospechosos'
                ? 'bg-amber-700/40 text-amber-200 border-amber-500 shadow-inner'
                : 'bg-stone-900/60 text-stone-400 border-transparent hover:text-amber-200'
            }`}
          >
            <span>👥</span>
            <span>Personajes ({characters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('consejos')}
            className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'consejos'
                ? 'bg-amber-700/40 text-amber-200 border-amber-500 shadow-inner'
                : 'bg-stone-900/60 text-stone-400 border-transparent hover:text-amber-200'
            }`}
          >
            <span>💡</span>
            <span>Guía Deductiva</span>
          </button>
        </div>

        {/* CONTENIDO DE LA PESTAÑA */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 font-parchment space-y-4">
          {/* 1. OBJETIVOS Y RECORDATORIOS */}
          {activeTab === 'objetivos' && (
            <div className="space-y-3">
              <div className="bg-amber-950/30 border border-amber-700/30 rounded-xl p-3 text-xs text-amber-200/90 leading-relaxed">
                🔎 <strong>Regla del Detective:</strong> Un misterio complejo se resuelve paso a paso. Consulta estos recordatorios cada vez que dudes sobre cuál es tu siguiente movimiento en la ciudad.
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {objectives.map((obj) => (
                  <div
                    key={obj.id}
                    className={`p-3.5 rounded-xl border transition flex items-start gap-3.5 ${
                      obj.done
                        ? 'bg-emerald-950/20 border-emerald-600/40 text-emerald-200'
                        : 'bg-stone-900/70 border-amber-900/40 text-amber-100 hover:border-amber-600/60'
                    }`}
                  >
                    <div className="mt-0.5 text-lg">
                      {obj.done ? '✅' : '⏳'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-base font-semibold font-layton ${obj.done ? 'line-through text-emerald-300' : 'text-amber-300'}`}>
                          {obj.title}
                        </h4>
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-sans font-bold ${
                          obj.done ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30' : 'bg-amber-900/30 text-amber-400 border border-amber-600/30'
                        }`}>
                          {obj.done ? 'Resuelto' : 'Pendiente'}
                        </span>
                      </div>

                      <p className="text-sm text-stone-300 mt-1 leading-snug">
                        {obj.desc}
                      </p>

                      {!obj.done && (
                        <div className="mt-2 text-xs bg-amber-950/40 border border-amber-800/40 rounded-lg p-2 text-amber-200/80 flex items-center gap-1.5">
                          <span>💡 Pista:</span>
                          <span>{obj.hint}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. PERGAMINOS Y DOCUMENTOS */}
          {activeTab === 'pergaminos' && (
            <div className="space-y-4">
              <div className="bg-amber-950/30 border border-amber-700/30 rounded-xl p-3 text-xs text-amber-200/90 leading-relaxed">
                📜 <strong>Los Tres Pergaminos Sagrados:</strong> Documentos antiguos que revelan la ubicación del generador subterráneo y sus códigos de acceso.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Pergamino 1 */}
                <div className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-2 ${
                  gameState.parchment1
                    ? 'bg-amber-900/30 border-amber-500 text-amber-200'
                    : 'bg-stone-900/50 border-stone-800 text-stone-500 opacity-60'
                }`}>
                  <span className="text-3xl">{gameState.parchment1 ? '📜' : '🔒'}</span>
                  <h4 className="font-layton font-bold text-sm text-amber-300">
                    Pergamino I (Fibonacci)
                  </h4>
                  <p className="text-xs text-stone-300">
                    {gameState.parchment1
                      ? 'Hallado en la caja fuerte de la trastienda. Contiene la secuencia de engranajes maestros.'
                      : 'Oculto en la trastienda del Bazar del mercado.'}
                  </p>
                </div>

                {/* Pergamino 2 */}
                <div className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-2 ${
                  gameState.parchment2
                    ? 'bg-amber-900/30 border-amber-500 text-amber-200'
                    : 'bg-stone-900/50 border-stone-800 text-stone-500 opacity-60'
                }`}>
                  <span className="text-3xl">{gameState.parchment2 ? '📜' : '🔒'}</span>
                  <h4 className="font-layton font-bold text-sm text-amber-300">
                    Pergamino II (Biblioteca)
                  </h4>
                  <p className="text-xs text-stone-300">
                    {gameState.parchment2
                      ? 'Entregado por el Sabio Bibliotecario. Revela el mapa de las corrientes fluviales.'
                      : 'Bajo custodia del Conservador de la Gran Biblioteca.'}
                  </p>
                </div>

                {/* Pergamino 3 */}
                <div className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-2 ${
                  gameState.solvedRiver
                    ? 'bg-amber-900/30 border-amber-500 text-amber-200'
                    : 'bg-stone-900/50 border-stone-800 text-stone-500 opacity-60'
                }`}>
                  <span className="text-3xl">{gameState.solvedRiver ? '📜' : '🔒'}</span>
                  <h4 className="font-layton font-bold text-sm text-amber-300">
                    Pergamino III (El Río)
                  </h4>
                  <p className="text-xs text-stone-300">
                    {gameState.solvedRiver
                      ? 'Recompensa por cruzar con éxito el río neblinoso del bosque.'
                      : 'Aguarda al otro lado del paso fluvial en la Alameda Aullante.'}
                  </p>
                </div>
              </div>

              {/* Muestra de la Hoja de Jeroglíficos */}
              <div className="bg-stone-900/80 border border-amber-800/40 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src="/images/inicio_del_juego/papel_jeroglificos.png"
                  alt="Jeroglíficos"
                  className="w-24 h-24 object-cover rounded-lg border border-amber-600/50 shadow"
                />
                <div>
                  <h4 className="font-layton font-bold text-amber-300 text-sm">
                    Hoja de Jeroglíficos del Pavimento
                  </h4>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                    «Los signos grabados en el papel original representan el sello de la Alquimia Subterránea. Con cada fragmento de pergamino recuperado, los símbolos cobran sentido geométrico.»
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. PERSONAJES E INFORMANTES */}
          {activeTab === 'sospechosos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {characters.map((char, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-stone-900/80 border border-amber-900/40 rounded-xl flex items-start gap-3 hover:border-amber-600/50 transition"
                >
                  <img
                    src={char.avatar}
                    alt={char.name}
                    className="w-12 h-12 object-cover rounded-lg border border-amber-600/40 shadow flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-layton font-bold text-sm text-amber-300">{char.name}</h4>
                    <span className="text-[11px] text-amber-400/80 font-sans italic block">{char.role}</span>
                    <p className="text-xs text-stone-300 mt-1 leading-tight">{char.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. GUÍA DEDUCTIVA */}
          {activeTab === 'consejos' && (
            <div className="space-y-3 text-stone-200">
              <div className="bg-amber-950/40 border border-amber-700/40 rounded-xl p-4 space-y-2">
                <h4 className="font-layton font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span>🔢</span> Sobre la Secuencia de Fibonacci
                </h4>
                <p className="text-xs leading-relaxed text-stone-300">
                  Leonardo de Pisa observó que en la naturaleza muchos patrones crecen sumando los dos valores previos:
                  <br />
                  <span className="font-mono text-amber-400 font-bold">1 + 1 = 2</span>,{' '}
                  <span className="font-mono text-amber-400 font-bold">1 + 2 = 3</span>,{' '}
                  <span className="font-mono text-amber-400 font-bold">2 + 3 = 5</span>,{' '}
                  <span className="font-mono text-amber-400 font-bold">3 + 5 = 8</span>,{' '}
                  <span className="font-mono text-amber-400 font-bold">5 + 8 = 13</span>...
                  <br />
                  ¿Cuál es <span className="text-amber-300 font-bold">8 + 13</span>? Ese es el código exacto de la caja fuerte.
                </p>
              </div>

              <div className="bg-amber-950/40 border border-amber-700/40 rounded-xl p-4 space-y-2">
                <h4 className="font-layton font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span>🚣‍♂️</span> Estrategia para el Cruce del Río (17 Minutos)
                </h4>
                <p className="text-xs leading-relaxed text-stone-300">
                  Para no malgastar tiempo, las dos personas más lentas (Carla de 5 min y Diego de 10 min) deben cruzar <strong className="text-amber-300">juntas</strong> para que sus tiempos coincidan en un único viaje de 10 minutos. Deja que los más veloces (Ana y Bruno) transporten la linterna de regreso.
                </p>
              </div>

              <div className="bg-amber-950/40 border border-amber-700/40 rounded-xl p-4 space-y-2">
                <h4 className="font-layton font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span>🗝️</span> Las Dos Vías hacia la Central Nuclear
                </h4>
                <p className="text-xs leading-relaxed text-stone-300">
                  Puedes alcanzar la Central Nuclear por ferrocarril pagando 10 monedas en la Estación Central, o explorando la Alameda Aullante y utilizando la Llave Antigua oculta en el roble.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* PIE DEL CUADERNO */}
        <div className="bg-stone-950 px-5 py-3 border-t border-amber-900/40 flex justify-between items-center text-xs text-amber-200/70">
          <span>Monedas en bolsillo: <strong className="text-amber-400 font-mono font-bold">🪙 {gameState.money}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-stone-950 font-bold font-layton text-xs transition shadow"
          >
            Guardar Cuaderno
          </button>
        </div>
      </div>
    </div>
  );
}
