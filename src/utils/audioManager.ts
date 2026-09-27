/**
 * AudioManager - Gestor de audio centralizado para El Profesor Python
 * Maneja canales independientes para BGM (Música de Fondo) y SFX (Efectos de Sonido).
 * Garantiza transiciones suaves con fade-out/fade-in evitando cualquier solapamiento caótico.
 */

class AudioManager {
  private static instance: AudioManager | null = null;

  private currentBgm: HTMLAudioElement | null = null;
  private currentBgmSrc: string | null = null;
  private currentTargetVolume: number = 0.5;
  private bgmVolume: number = 0.55;
  private sfxVolume: number = 0.75;
  private isMuted: boolean = false;
  private isUnlocked: boolean = false;
  private fadeInterval: NodeJS.Timeout | null = null;

  private constructor() {
    // Si estamos en el navegador, escuchar la primera interacción de usuario
    if (typeof window !== 'undefined') {
      const handleFirstInteraction = () => {
        this.unlock();
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
      };

      window.addEventListener('click', handleFirstInteraction, { once: true });
      window.addEventListener('keydown', handleFirstInteraction, { once: true });
      window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    }
  }

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
    this.isUnlocked = true;
    try {
      if (this.currentBgm && !this.isMuted) {
        this.currentBgm.volume = this.currentTargetVolume || this.bgmVolume;
        await this.currentBgm.play();
      }
      return true;
    } catch (e) {
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
    this.currentTargetVolume = normalizedTarget;

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
      const fadeStepTime = 20;
      const totalSteps = 12;
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
      audio.volume = targetVol;
      this.currentBgm = audio;
      this.currentBgmSrc = src;

      if (!this.isMuted) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isUnlocked = true;
            })
            .catch(() => {
              // Navegador bloqueó autoplay; sonará en la primera pulsación gracias a unlock()
            });
        }
      }
    } catch (e) {
      console.warn('[AudioManager] Error al instanciar BGM:', e);
    }
  }

  /**
   * Reproduce un efecto de sonido puntual en un canal aislado sin afectar la música.
   */
  public playSfx(src: string, customVolume?: number): void {
    if (!src || this.isMuted) return;

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
      } else {
        this.currentBgm.volume = this.currentTargetVolume || this.bgmVolume;
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
    this.currentTargetVolume = this.bgmVolume;
    if (this.currentBgm) {
      this.currentBgm.volume = this.bgmVolume;
    }
  }

  public setSfxVolume(volume: number): void {
    this.sfxVolume = Math.min(1, Math.max(0, volume));
  }
}

export const audioManager = AudioManager.getInstance();
