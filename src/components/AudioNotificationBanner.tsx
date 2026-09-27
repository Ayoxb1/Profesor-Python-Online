'use client';

import React from 'react';
import { audioManager } from '../utils/audioManager';

interface AudioNotificationBannerProps {
  onAudioActivated: () => void;
  onDismiss: () => void;
}

export default function AudioNotificationBanner({
  onAudioActivated,
  onDismiss,
}: AudioNotificationBannerProps) {
  const handleActivate = async () => {
    await audioManager.unlock();
    audioManager.playSfx('/audio/TiendaCampanas.mp3');
    onAudioActivated();
  };

  return (
    <div className="fixed top-3 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 max-w-xl w-full animate-in slide-in-from-top-4 duration-500">
      <div className="parchment-box border-2 border-amber-500/80 rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(217,119,6,0.35)] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* ICONO Y TEXTO */}
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-950 border border-amber-400/60 flex items-center justify-center text-2xl shadow-md flex-shrink-0 animate-pulse">
            🎼
          </div>
          <div>
            <h3 className="font-layton font-extrabold text-sm sm:text-base text-amber-300 tracking-wider">
              Banda Sonora del Caso
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 font-parchment leading-snug mt-0.5">
              Para disfrutar plenamente de los misterios y la experiencia, te recomendamos activar el volumen.
            </p>
          </div>
        </div>

        {/* ACCIÓN PRINCIPAL Y SECUNDARIA */}
        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={onDismiss}
            className="px-3 py-2 rounded-xl text-xs font-layton text-stone-400 hover:text-stone-200 hover:bg-stone-900/60 transition"
            title="Continuar en silencio"
          >
            Silencio
          </button>

          <button
            onClick={handleActivate}
            className="btn-brass px-4 py-2.5 rounded-xl font-layton font-extrabold text-xs sm:text-sm text-amber-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-950/70 pulse-gold"
          >
            <span>Activar Audio</span>
            <span>🔊</span>
          </button>
        </div>
      </div>
    </div>
  );
}
