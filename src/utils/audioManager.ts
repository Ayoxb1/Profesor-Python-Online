/**
 * AudioManager - Gestor de audio centralizado para El Profesor Python
 * Maneja canales independientes para BGM (Música de Fondo), Escena SFX y UI SFX.
 * Garantiza de forma estricta que al cambiar rápido de escena NINGÚN audio anterior
 * continúe sonando o se superponga.
 */

class AudioManager {
  private static instance: AudioManager | null = null;

  // Canal BGM (Música de fondo)
  private currentBgm: HTMLAudioElement | null = null;
  private currentBgmSrc: string | null = null;
  private bgmVolume: number = 0.55;

  // Canal SFX de Escena (Efectos de ambiente, voces, diálogos, jeroglíficos)
  private currentSceneSfx: HTMLAudioElement | null = null;
  private sfxVolume: number = 0.75;

  // Canal SFX de UI (Clicks de botones cortos)
  private uiClickAudio: HTMLAudioElement | null = null;

  private isMuted: boolean = false;
  private isUnlocked: boolean = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      // Instanciar un audio reutilizable para el click de UI
      this.uiClickAudio = new Audio('/audio/PasandoPaginaDeLibro.mp3');
      this.uiClickAudio.volume = 0.35;

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
   * Desbloquea el audio del navegador en la primera interacción.
   */
  public async unlock(): Promise<boolean> {
    this.isUnlocked = true;
    try {
      if (this.currentBgm && !this.isMuted) {
        this.currentBgm.volume = this.bgmVolume;
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
   * Transición de Escena Segura:
   * Corta INMEDIATAMENTE cualquier efecto de sonido de la escena anterior.
   * Si la música de fondo cambia, corta la anterior al instante e inicia la nueva sin solapes.
   */
  public handleSceneTransition(bgMusic?: string, soundEffect?: string, isIntroVideo: boolean = false): void {
    // 1. CORTAR INMEDIATAMENTE cualquier SFX de la escena previa
    this.stopSceneSfx();

    // 2. GESTIONAR MÚSICA DE FONDO (BGM)
    if (bgMusic) {
      this.playBgm(bgMusic, !isIntroVideo, isIntroVideo ? 0.8 : this.bgmVolume);
    } else {
      this.stopBgm();
    }

    // 3. REPRODUCIR NUEVO SFX DE ESCENA (si existe y no es el vídeo de intro)
    if (soundEffect && !isIntroVideo) {
      this.playSceneSfx(soundEffect);
    }
  }

  /**
   * Reproduce una pista de música de fondo garantizando que la anterior se corte por completo.
   */
  public playBgm(src: string, loop: boolean = true, targetVolume?: number): void {
    if (!src) return;

    const vol = targetVolume !== undefined ? targetVolume : this.bgmVolume;

    // Si ya está sonando exactamente esta pista y no está pausada, mantenerla sin reiniciar
    if (this.currentBgm && this.currentBgmSrc === src && !this.currentBgm.paused) {
      this.currentBgm.volume = vol;
      return;
    }

    // CORTE INMEDIATO Y LIMPIO DE LA PISTA ANTERIOR (sin intervals que provoquen colisiones)
    if (this.currentBgm) {
      try {
        this.currentBgm.pause();
        this.currentBgm.currentTime = 0;
        this.currentBgm.src = '';
      } catch (e) {}
      this.currentBgm = null;
      this.currentBgmSrc = null;
    }

    try {
      const audio = new Audio(src);
      audio.loop = loop;
      audio.volume = vol;
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
              // Navegador esperará al unlock de primera interacción
            });
        }
      }
    } catch (e) {
      console.warn('[AudioManager] Error iniciando BGM:', e);
    }
  }

  /**
   * Detiene de inmediato la música de fondo actual.
   */
  public stopBgm(): void {
    if (this.currentBgm) {
      try {
        this.currentBgm.pause();
        this.currentBgm.currentTime = 0;
        this.currentBgm.src = '';
      } catch (e) {}
      this.currentBgm = null;
      this.currentBgmSrc = null;
    }
  }

  /**
   * Reproduce un efecto de sonido de escena rastreado.
   * Corta de inmediato cualquier SFX previo de escena.
   */
  public playSceneSfx(src: string, customVolume?: number): void {
    if (!src || this.isMuted) return;

    this.stopSceneSfx();

    try {
      const sfx = new Audio(src);
      const vol = customVolume !== undefined ? customVolume : this.sfxVolume;
      sfx.volume = Math.min(1, Math.max(0, vol));
      this.currentSceneSfx = sfx;

      sfx.play().catch(() => {});

      sfx.onended = () => {
        if (this.currentSceneSfx === sfx) {
          this.currentSceneSfx = null;
        }
      };
    } catch (e) {
      console.warn('[AudioManager] Error iniciando Scene SFX:', e);
    }
  }

  /**
   * Alias de compatibilidad para reproducir efectos de sonido de escena.
   */
  public playSfx(src: string, customVolume?: number): void {
    this.playSceneSfx(src, customVolume);
  }

  /**
   * Detiene y corta de inmediato el efecto de sonido de escena actual.
   */
  public stopSceneSfx(): void {
    if (this.currentSceneSfx) {
      try {
        this.currentSceneSfx.pause();
        this.currentSceneSfx.currentTime = 0;
        this.currentSceneSfx.src = '';
      } catch (e) {}
      this.currentSceneSfx = null;
    }
  }

  /**
   * Reproduce el sonido de clic de UI corto e instantáneo.
   */
  public playUiClick(): void {
    if (this.isMuted) return;

    if (this.uiClickAudio) {
      try {
        this.uiClickAudio.currentTime = 0;
        this.uiClickAudio.play().catch(() => {});
      } catch (e) {}
    }
  }

  /**
   * Detiene absolutamente todo el audio en reproducción.
   */
  public stopAll(): void {
    this.stopBgm();
    this.stopSceneSfx();
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      if (this.currentBgm) this.currentBgm.pause();
      if (this.currentSceneSfx) this.currentSceneSfx.pause();
    } else {
      if (this.currentBgm && this.isUnlocked) {
        this.currentBgm.volume = this.bgmVolume;
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
