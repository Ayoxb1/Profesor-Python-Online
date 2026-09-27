/**
 * AudioManager - Gestor de audio centralizado para El Profesor Python
 * Maneja canales independientes para BGM (Música de Fondo) y SFX (Efectos de Sonido).
 * Garantiza transiciones suaves con fade-out/fade-in evitando cualquier solapamiento caótico.
 */

class AudioManager {
  private static instance: AudioManager | null = null;

  private currentBgm: HTMLAudioElement | null = null;
  private currentBgmSrc: string | null = null;
  private bgmVolume: number = 0.5;
  private sfxVolume: number = 0.7;
  private isMuted: boolean = false;
  private isUnlocked: boolean = false;
  private fadeInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Desbloquea el audio del navegador tras la primera interacción del usuario.
   */
  public async unlock(): Promise<boolean> {
    try {
      this.isUnlocked = true;
      if (this.currentBgm && !this.isMuted) {
        await this.currentBgm.play();
      }
      return true;
    } catch (e) {
      console.warn('[AudioManager] No se pudo desbloquear el audio automáticamente:', e);
      return false;
    }
  }

  public getIsUnlocked(): boolean {
    return this.isUnlocked;
  }

  /**
   * Reproduce una pista de música de fondo con fade-out de la anterior y fade-in de la nueva.
   */
  public playBgm(src: string, loop: boolean = true, targetVolume?: number): void {
    if (!src) return;

    const normalizedTarget = targetVolume !== undefined ? targetVolume : this.bgmVolume;

    // Si ya está sonando esta misma pista, no reiniciar innecesariamente
    if (this.currentBgm && this.currentBgmSrc === src && !this.currentBgm.paused) {
      return;
    }

    // Cancelar cualquier transición de fade en progreso
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    const previousAudio = this.currentBgm;

    // Si había una pista sonando, aplicar fade-out gradual
    if (previousAudio && !previousAudio.paused) {
      const fadeStepTime = 25; // ms entre pasos
      const totalSteps = 15;   // ~375ms de desvanecimiento
      const stepDec = previousAudio.volume / totalSteps;

      this.fadeInterval = setInterval(() => {
        if (previousAudio.volume > stepDec) {
          previousAudio.volume = Math.max(0, previousAudio.volume - stepDec);
        } else {
          clearInterval(this.fadeInterval!);
          this.fadeInterval = null;
          previousAudio.pause();
          previousAudio.currentTime = 0;
          this.startNewBgm(src, loop, normalizedTarget);
        }
      }, fadeStepTime);
    } else {
      this.startNewBgm(src, loop, normalizedTarget);
    }
  }

  private startNewBgm(src: string, loop: boolean, targetVol: number): void {
    try {
      const audio = new Audio(src);
      audio.loop = loop;
      audio.volume = 0; // Comienza en 0 para el fade-in
      this.currentBgm = audio;
      this.currentBgmSrc = src;

      if (!this.isMuted && this.isUnlocked) {
        audio.play().then(() => {
          this.fadeIn(audio, targetVol);
        }).catch((err) => {
          console.warn('[AudioManager] Esperando interacción del usuario para reproducir BGM:', err);
        });
      }
    } catch (e) {
      console.warn('[AudioManager] Error al instanciar BGM:', e);
    }
  }

  private fadeIn(audio: HTMLAudioElement, targetVol: number): void {
    const fadeStepTime = 30;
    const totalSteps = 15;
    const stepInc = targetVol / totalSteps;

    const interval = setInterval(() => {
      if (audio.volume + stepInc < targetVol) {
        audio.volume += stepInc;
      } else {
        audio.volume = targetVol;
        clearInterval(interval);
      }
    }, fadeStepTime);
  }

  /**
   * Reproduce un efecto de sonido puntual en un canal aislado sin afectar la música.
   */
  public playSfx(src: string, customVolume?: number): void {
    if (!src || this.isMuted || !this.isUnlocked) return;

    try {
      const sfx = new Audio(src);
      const vol = customVolume !== undefined ? customVolume : this.sfxVolume;
      sfx.volume = Math.min(1, Math.max(0, vol));
      sfx.play().catch(() => {});
    } catch (e) {
      console.warn('[AudioManager] Error al reproducir SFX:', e);
    }
  }

  /**
   * Detiene la música de fondo con un fade-out suave.
   */
  public stopBgm(): void {
    if (!this.currentBgm) return;

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    const audio = this.currentBgm;
    const fadeStepTime = 20;
    const totalSteps = 10;
    const stepDec = audio.volume / totalSteps;

    this.fadeInterval = setInterval(() => {
      if (audio.volume > stepDec) {
        audio.volume = Math.max(0, audio.volume - stepDec);
      } else {
        clearInterval(this.fadeInterval!);
        this.fadeInterval = null;
        audio.pause();
        audio.currentTime = 0;
        this.currentBgm = null;
        this.currentBgmSrc = null;
      }
    }, fadeStepTime);
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.currentBgm) {
      if (muted) {
        this.currentBgm.pause();
      } else if (this.isUnlocked) {
        this.currentBgm.play().catch(() => {});
      }
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setBgmVolume(volume: number): void {
    this.bgmVolume = Math.min(1, Math.max(0, volume));
    if (this.currentBgm) {
      this.currentBgm.volume = this.bgmVolume;
    }
  }

  public setSfxVolume(volume: number): void {
    this.sfxVolume = Math.min(1, Math.max(0, volume));
  }
}

export const audioManager = AudioManager.getInstance();
