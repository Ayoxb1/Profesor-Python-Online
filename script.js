/**
 * EL PROFESOR PYTHON Y EL MISTERIO DE LA ALCANTARILLA
 * Motor de Aventura Gráfica Web AAA - VERSIÓN FINAL COMPLETA
 * 
 * Basado fielmente en el código Java terminado de:
 * Ayoxb1 (https://github.com/Ayoxb1) & pabloelique (https://github.com/pabloelique)
 * Repositorio: https://github.com/Ayoxb1/Aventura-Grafica-Profesor-Python.git
 * Presentación: https://docs.google.com/presentation/d/1KkS6pUo7uKIwQFdt-uiUk2OvdrBb7-lsdlU-fXbOa-Q/edit?slide=id.p1#slide=id.p1
 */

// =============================================================================
// ESTADO GLOBAL DEL JUEGO (IDÉNTICO A LAS VARIABLES JAVA DE ProfesorPython-master)
// =============================================================================
const GameState = {
  dinero: 0,
  pergamino1: false,
  pergamino2: false,
  pergamino3: false,
  hablarSeñor: false,
  colarseAtrasTienda: false,
  subirArbol: false,
  permisoHomer: false,
  llaveRio: false,
  verAcertijo2: false,
  cajaFuerteAbierta: false,
  cajaFuerteDineroCogido: false,
  cajaFuertePergaminoCogido: false,
  acertijoRioCompletado: false,

  // Nombres de personajes
  nombreHombre: "Marcos",
  nombreMujer: "Lucía",
  nombreJug: "Investigador",

  // Datos del acertijo de la biblioteca
  asignacionBiblioteca: [0, 0, 0, 0, 0], // A, B, C, D, E (0 = sin asignar)
  solucionBiblioteca: [11, 3, 5, 7, 9],  // A=11, B=3, C=5, D=7, E=9

  // Control de escena y navegación
  currentScene: "title",
  previousScene: "escenaPrincipal",
  visitedLocations: new Set(["ciudad"]),

  // Audio
  isMuted: false,
  volume: 0.75,
  currentBgm: null
};

// =============================================================================
// SISTEMA DE AUDIO PROFESIONAL MULTICANAL
// =============================================================================
class SoundManager {
  constructor() {
    this.bgmPlayer = document.getElementById("bgm-player");
    this.sfxPlayer = document.getElementById("sfx-player");
    this.sfxSecondary = document.getElementById("sfx-secondary");
    this.isMuted = false;
    this.volume = 0.75;
    this.currentTrack = "";

    this.tracks = {
      layton1: "assets/audio/layton1.mp3",
      layton2: "assets/audio/layton2.mp3",
      ciudad: "assets/audio/ciudad.mp3",
      buho: "assets/audio/buho.mp3",
      mercado: "assets/audio/mercado_mayorista.mp3",
      bazar: "assets/audio/bazar_hablando.mp3",
      acertijo: "assets/audio/acertijo.mp3",
      introVideo: "assets/audio/audio_video.mp3",
      jeroglificos: "assets/audio/jeroglificos.mp3",
      senor: "assets/audio/hablando_con_senor.mp3",
      campanas: "assets/audio/tienda_campanas.mp3",
      fantasia: "assets/audio/fantasia.mp3",
      victoria: "assets/audio/audio_victoria.mp3",
      agua: "assets/audio/agua_cayendo.mp3",
      papel: "assets/audio/papel.mp3",
      pagina: "assets/audio/pagina_libro.mp3",
      reloj: "assets/audio/reloj.mp3",
      jumpscare: "assets/audio/jumpscare.mp3",
      dialogos: "assets/audio/dialogos.mp3"
    };

    if (this.bgmPlayer) {
      this.bgmPlayer.volume = this.volume;
    }
  }

  playBgm(trackKey) {
    if (!this.tracks[trackKey]) return;
    const path = this.tracks[trackKey];
    if (this.currentTrack === path && !this.bgmPlayer.paused) return;

    this.currentTrack = path;
    this.bgmPlayer.src = path;
    this.bgmPlayer.loop = true;
    this.bgmPlayer.volume = this.isMuted ? 0 : this.volume;

    const playPromise = this.bgmPlayer.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn("Autoplay en espera de interacción del usuario.", err);
      });
    }
  }

  stopBgm() {
    if (this.bgmPlayer) {
      this.bgmPlayer.pause();
      this.currentTrack = "";
    }
  }

  playSfx(trackKey, volume = 1.0) {
    if (!this.tracks[trackKey] || this.isMuted) return;
    try {
      this.sfxPlayer.src = this.tracks[trackKey];
      this.sfxPlayer.volume = Math.min(1.0, this.volume * volume);
      this.sfxPlayer.play().catch(e => console.warn("SFX blocked:", e));
    } catch (e) {
      console.warn("Error playing SFX:", e);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgmPlayer) {
      this.bgmPlayer.volume = this.isMuted ? 0 : this.volume;
    }
    return this.isMuted;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.bgmPlayer && !this.isMuted) {
      this.bgmPlayer.volume = this.volume;
    }
  }
}

const AudioSys = new SoundManager();

// =============================================================================
// MOTOR DE NARRATIVA Y MÁQUINA DE ESCRIBIR
// =============================================================================
class DialogueEngine {
  constructor() {
    this.textEl = document.getElementById("dialogue-text");
    this.speakerEl = document.getElementById("speaker-name");
    this.clickHint = document.getElementById("click-hint");
    
    this.fullText = "";
    this.charIndex = 0;
    this.typeSpeed = 16;
    this.timer = null;
    this.isTyping = false;
    this.onCompleteCallback = null;
  }

  say(speaker, text, onComplete = null) {
    if (this.timer) clearInterval(this.timer);

    this.speakerEl.textContent = speaker.toUpperCase();
    this.fullText = text.replace(/\\n/g, "\n");
    this.charIndex = 0;
    this.textEl.textContent = "";
    this.isTyping = true;
    this.onCompleteCallback = onComplete;
    if (this.clickHint) this.clickHint.style.display = "none";

    this.timer = setInterval(() => {
      if (this.charIndex < this.fullText.length) {
        this.textEl.textContent += this.fullText.charAt(this.charIndex);
        this.charIndex++;
      } else {
        this.finishTyping();
      }
    }, this.typeSpeed);
  }

  finishTyping() {
    if (this.timer) clearInterval(this.timer);
    this.textEl.textContent = this.fullText;
    this.isTyping = false;
    if (this.clickHint) this.clickHint.style.display = "flex";
    if (this.onCompleteCallback) {
      const cb = this.onCompleteCallback;
      this.onCompleteCallback = null;
      cb();
    }
  }

  handleUserClick() {
    if (this.isTyping) {
      this.finishTyping();
      return true;
    }
    return false;
  }
}

const DialogSys = new DialogueEngine();

// =============================================================================
// JUMPSCARE CINEMATOGRÁFICO (REPLICA EXACTA DE jumpScare())
// =============================================================================
function triggerJumpScare(onComplete) {
  const overlay = document.getElementById("jumpscare-overlay");
  if (!overlay) {
    if (onComplete) onComplete();
    return;
  }

  AudioSys.stopBgm();
  AudioSys.playSfx("jumpscare", 1.0);
  overlay.classList.add("active");

  setTimeout(() => {
    overlay.classList.remove("active");
    if (onComplete) onComplete();
  }, 2200);
}

// =============================================================================
// MINIJUEGO 1: ACERTIJO DE LA CAJA FUERTE (FIBONACCI = 377)
// =============================================================================
const SafeRiddle = {
  currentInput: "",
  solucionCorrecta: "377",

  init() {
    this.currentInput = "";
    this.updateDisplay();
    this.bindEvents();
  },

  updateDisplay() {
    const display = document.getElementById("safe-input-display");
    const feedback = document.getElementById("safe-feedback");
    if (display) {
      display.textContent = this.currentInput === "" ? "?" : this.currentInput;
    }
    if (feedback && this.currentInput === "") {
      feedback.textContent = "Introduce el 14º término de la sucesión (ej. 377).";
      feedback.className = "safe-feedback";
    }
  },

  inputDigit(digit) {
    if (this.currentInput.length < 3) {
      this.currentInput += digit;
      AudioSys.playSfx("reloj");
      this.updateDisplay();
    }
  },

  clear() {
    this.currentInput = "";
    AudioSys.playSfx("reloj");
    this.updateDisplay();
  },

  confirmar() {
    const feedback = document.getElementById("safe-feedback");
    const safeImg = document.getElementById("safe-puzzle-img");
    const lootPanel = document.getElementById("safe-loot-panel");

    if (this.currentInput === this.solucionCorrecta) {
      AudioSys.playSfx("fantasia");
      GameState.cajaFuerteAbierta = true;
      updateHud();

      if (feedback) {
        feedback.textContent = "¡CORRECTO! ¡Has acertado el número de la sucesión de Fibonacci!";
        feedback.className = "safe-feedback success";
      }
      if (safeImg) {
        safeImg.src = "assets/images/cofre_abierto.png";
      }
      if (lootPanel) {
        lootPanel.style.display = "flex";
      }

    } else {
      AudioSys.playSfx("reloj");
      if (feedback) {
        feedback.textContent = "No es el número correcto. La caja fuerte sigue cerrada.";
        feedback.className = "safe-feedback error";
      }
      this.currentInput = "";
      setTimeout(() => this.updateDisplay(), 1400);
    }
  },

  abrir() {
    const modal = document.getElementById("minigame-safe");
    if (modal) {
      modal.classList.add("active");
      const safeImg = document.getElementById("safe-puzzle-img");
      if (safeImg) safeImg.src = "assets/images/sucesion.png";
      const lootPanel = document.getElementById("safe-loot-panel");
      if (lootPanel) lootPanel.style.display = GameState.cajaFuerteAbierta ? "flex" : "none";
      this.init();
    }
  },

  cerrar() {
    const modal = document.getElementById("minigame-safe");
    if (modal) modal.classList.remove("active");
  },

  bindEvents() {
    const keypad = document.querySelectorAll("#minigame-safe .key-btn[data-key]");
    keypad.forEach(btn => {
      btn.onclick = () => this.inputDigit(btn.getAttribute("data-key"));
    });

    const btnClear = document.getElementById("btn-key-clear");
    const btnConfirm = document.getElementById("btn-key-confirm");
    const btnExit = document.getElementById("btn-safe-exit");

    if (btnClear) btnClear.onclick = () => this.clear();
    if (btnConfirm) btnConfirm.onclick = () => this.confirmar();
    if (btnExit) btnExit.onclick = () => this.cerrar();

    // Botones de botín
    const btnScroll = document.getElementById("btn-loot-scroll");
    const btnMoney = document.getElementById("btn-loot-money");
    const btnClose = document.getElementById("btn-loot-close");

    if (btnScroll) {
      btnScroll.onclick = () => {
        if (!GameState.pergamino1) {
          GameState.pergamino1 = true;
          GameState.cajaFuertePergaminoCogido = true;
          AudioSys.playSfx("papel");
          alert("Has cogido el primer pergamino antiguo.");
          updateHud();
        } else {
          alert("Ya tienes este pergamino.");
        }
      };
    }

    if (btnMoney) {
      btnMoney.onclick = () => {
        if (!GameState.cajaFuerteDineroCogido) {
          GameState.dinero += 500;
          GameState.cajaFuerteDineroCogido = true;
          AudioSys.playSfx("campanas");
          alert("¡Has cogido 500 monedas de oro de la caja fuerte!");
          updateHud();
        } else {
          alert("Ya has cogido el dinero de esta caja.");
        }
      };
    }

    if (btnClose) {
      btnClose.onclick = () => {
        this.cerrar();
        // Mostrar escena de habilidad de razonamiento lógico obtenida
        SceneEngine.showCustomDialogue(
          `Habilidad de ${GameState.nombreHombre}`,
          `${GameState.nombreHombre} ha obtenido la habilidad de razonamiento lógico gracias al descubrir la solución al acertijo de la sucesión de Fibonacci.`,
          "assets/images/habilidades_aventura.png",
          () => SceneEngine.loadScene("colarseTienda")
        );
      };
    }
  }
};

// =============================================================================
// MINIJUEGO 2: ACERTIJO DE LA BIBLIOTECA (REPLICA EXACTA DE acertijo2())
// =============================================================================
const LibraryRiddle = {
  letras: ["A", "B", "C", "D", "E"],
  valoresValidos: [3, 5, 7, 9, 11],
  solucionReal: [11, 3, 5, 7, 9], // A=11, B=3, C=5, D=7, E=9

  init() {
    this.render();
    this.bindEvents();
  },

  render() {
    const grid = document.getElementById("shelves-grid");
    if (!grid) return;

    grid.innerHTML = "";
    this.letras.forEach((letra, index) => {
      const card = document.createElement("div");
      card.className = "shelf-card";

      const currentVal = GameState.asignacionBiblioteca[index];

      let optionsHtml = `<option value="0" ${currentVal === 0 ? "selected" : ""}>-</option>`;
      this.valoresValidos.forEach(v => {
        optionsHtml += `<option value="${v}" ${currentVal === v ? "selected" : ""}>${v}</option>`;
      });

      card.innerHTML = `
        <span class="shelf-letter">${letra}</span>
        <select class="shelf-select" data-index="${index}">
          ${optionsHtml}
        </select>
        <span class="stat-subtle" style="font-size:0.7rem; color:var(--text-subtle);">estante</span>
      `;

      grid.appendChild(card);
    });

    // Actualizar listeners del selector
    grid.querySelectorAll(".shelf-select").forEach(sel => {
      sel.onchange = (e) => {
        const idx = parseInt(sel.getAttribute("data-index"), 10);
        GameState.asignacionBiblioteca[idx] = parseInt(e.target.value, 10);
        AudioSys.playSfx("pagina");
        this.evaluarCondiciones(false);
      };
    });

    this.evaluarCondiciones(false);
    if (window.lucide) lucide.createIcons();
  },

  evaluarCondiciones(mostrarAlerta = false) {
    const asig = GameState.asignacionBiblioteca;
    const [A, B, C, D, E] = asig;

    const cond1 = A > 0 && B > 0 && A > B;
    const cond2 = C > 0 && D > 0 && C < D;
    const cond3 = B > 0 && E > 0 && A > 0 && B < E && E < A;
    const cond4 = D > 0 && E > 0 && D < E;

    const setCond = (id, ok) => {
      const el = document.getElementById(id);
      if (el) {
        el.className = `cond-item ${ok ? "ok" : "fail"}`;
        const icon = el.querySelector(".cond-icon");
        if (icon) icon.textContent = ok ? "✓" : "○";
      }
    };

    setCond("cond-1", cond1);
    setCond("cond-2", cond2);
    setCond("cond-3", cond3);
    setCond("cond-4", cond4);

    return { cond1, cond2, cond3, cond4 };
  },

  comprobar() {
    const asig = GameState.asignacionBiblioteca;
    const feedback = document.getElementById("library-feedback");

    // 1. Comprobar que no haya estantes sin asignar
    if (asig.some(val => val === 0)) {
      alert("Asignación incompleta: aún hay estantes sin número de libros.");
      if (feedback) feedback.textContent = "Asigna un número de libros (3, 5, 7, 9 u 11) a cada estante.";
      return;
    }

    // 2. Comprobar repetidos
    const set = new Set(asig);
    if (set.size !== 5) {
      alert("Valor repetido: cada estante debe tener un número diferente de libros.");
      if (feedback) feedback.textContent = "No puedes repetir el mismo número en dos estantes.";
      return;
    }

    // 3. Evaluar pistas
    const { cond1, cond2, cond3, cond4 } = this.evaluarCondiciones(true);

    if (!cond1 || !cond2 || !cond3 || !cond4) {
      alert("Todavía NO cumples todas las pistas del bibliotecario.\nRevisa la lista de condiciones y sigue probando.");
      if (feedback) feedback.textContent = "Revisa las condiciones pendientes marcadas en rojo.";
      return;
    }

    // 4. Comprobar solución real [11, 3, 5, 7, 9]
    const esSolucion = asig.every((v, i) => v === this.solucionReal[i]);

    if (esSolucion) {
      AudioSys.playSfx("victoria");
      GameState.pergamino2 = true;
      updateHud();

      alert(
        "🎉 ¡ENHORABUENA! 🎉\n\n" +
        "Además de cumplir las pistas, has encontrado la distribución EXACTA de libros de la biblioteca.\n" +
        "¡Has obtenido el SEGUNDO PERGAMINO ANTIGUO!"
      );

      this.cerrar();
      SceneEngine.loadScene("entrarBiblioteca");

    } else {
      AudioSys.playSfx("reloj");
      alert("Cumples las pistas relativas, pero esta no es la distribución real de la biblioteca. Sigue probando otra combinación.");
    }
  },

  mostrarReglas() {
    AudioSys.playSfx("papel");
    alert(
      "ACERTIJO DE LA BIBLIOTECA:\n\n" +
      "Hay 5 estantes con un número distinto de libros: 3, 5, 7, 9 y 11.\n" +
      "Están etiquetados con las letras A, B, C, D y E.\n\n" +
      "Pistas del bibliotecario:\n" +
      " • A tiene más libros que B (A > B)\n" +
      " • C tiene menos libros que D (C < D)\n" +
      " • E tiene más libros que B y menos que A (B < E < A)\n" +
      " • D tiene menos libros que E (D < E)\n\n" +
      "Objetivo: asignar a cada letra un número (3, 5, 7, 9, 11) sin repetir para resolver el enigma."
    );
  },

  reiniciar() {
    GameState.asignacionBiblioteca = [0, 0, 0, 0, 0];
    AudioSys.playSfx("pagina");
    this.render();
  },

  abrir() {
    const modal = document.getElementById("minigame-library");
    if (modal) {
      modal.classList.add("active");
      AudioSys.playBgm("layton1");
      this.init();
    }
  },

  cerrar() {
    const modal = document.getElementById("minigame-library");
    if (modal) modal.classList.remove("active");
  },

  bindEvents() {
    const btnCheck = document.getElementById("btn-library-check");
    const btnRules = document.getElementById("btn-library-rules");
    const btnReset = document.getElementById("btn-library-reset");
    const btnExit = document.getElementById("btn-library-exit");

    if (btnCheck) btnCheck.onclick = () => this.comprobar();
    if (btnRules) btnRules.onclick = () => this.mostrarReglas();
    if (btnReset) btnReset.onclick = () => this.reiniciar();
    if (btnExit) btnExit.onclick = () => this.cerrar();
  }
};

// =============================================================================
// MINIJUEGO 3: ACERTIJO DEL RÍO EN EL BOSQUE (REPLICA EXACTA DE AcertijoRioBosque)
// =============================================================================
const RiverRiddle = {
  personas: [
    { id: "ana", nombre: "Ana", tiempo: 1, ladoInicial: true },
    { id: "bruno", nombre: "Bruno", tiempo: 2, ladoInicial: true },
    { id: "carla", nombre: "Carla", tiempo: 5, ladoInicial: true },
    { id: "diego", nombre: "Diego", tiempo: 10, ladoInicial: true }
  ],
  tiempoTotal: 0,
  linternaLadoInicial: true,
  seleccionados: new Set(),

  init() {
    this.reset();
    this.render();
    this.bindEvents();
  },

  reset() {
    this.personas.forEach(p => p.ladoInicial = true);
    this.tiempoTotal = 0;
    this.linternaLadoInicial = true;
    this.seleccionados.clear();
    const logList = document.getElementById("river-log-list");
    if (logList) logList.innerHTML = '<div class="log-entry empty">Aún no se ha realizado ningún cruce.</div>';
    this.render();
  },

  render() {
    const leftContainer = document.getElementById("left-characters-container");
    const rightContainer = document.getElementById("right-characters-container");
    const lanternLeft = document.getElementById("lantern-left");
    const lanternRight = document.getElementById("lantern-right");
    const timeDisplay = document.getElementById("river-time-display");
    const lanternSideDisplay = document.getElementById("river-lantern-side");
    const raft = document.getElementById("river-raft");
    const raftSlots = document.getElementById("raft-passengers");
    const crossBtn = document.getElementById("btn-river-cross");
    const selectionInfo = document.getElementById("river-selection-info");

    if (!leftContainer || !rightContainer) return;

    leftContainer.innerHTML = "";
    rightContainer.innerHTML = "";

    if (this.linternaLadoInicial) {
      lanternLeft.classList.add("active");
      lanternRight.classList.remove("active");
      lanternSideDisplay.textContent = "ORILLA INICIAL";
      raft.className = "river-raft at-left";
    } else {
      lanternLeft.classList.remove("active");
      lanternRight.classList.add("active");
      lanternSideDisplay.textContent = "ORILLA FINAL";
      raft.className = "river-raft at-right";
    }

    timeDisplay.textContent = `${this.tiempoTotal} min`;

    this.personas.forEach(persona => {
      const isSelected = this.seleccionados.has(persona.id);
      const isEligible = persona.ladoInicial === this.linternaLadoInicial;

      const token = document.createElement("div");
      token.className = `char-token ${isSelected ? "selected" : ""}`;
      token.style.opacity = isEligible ? "1" : "0.5";
      token.title = isEligible ? "Clic para embarcar" : "No está en la misma orilla que la linterna";

      token.innerHTML = `
        <div class="char-info">
          <i data-lucide="${isSelected ? 'check-circle-2' : 'user'}"></i>
          <span class="char-name">${persona.nombre}</span>
        </div>
        <span class="char-time-badge">${persona.tiempo} min</span>
      `;

      token.addEventListener("click", () => {
        if (!isEligible) {
          AudioSys.playSfx("reloj");
          return;
        }
        this.toggleSelection(persona.id);
      });

      if (persona.ladoInicial) {
        leftContainer.appendChild(token);
      } else {
        rightContainer.appendChild(token);
      }
    });

    const selectedArray = Array.from(this.seleccionados).map(id => this.personas.find(p => p.id === id));
    raftSlots.innerHTML = "";
    for (let i = 0; i < 2; i++) {
      if (selectedArray[i]) {
        const slot = document.createElement("div");
        slot.className = "raft-occupied-slot";
        slot.textContent = `${selectedArray[i].nombre} (${selectedArray[i].tiempo}m)`;
        raftSlots.appendChild(slot);
      } else {
        const slot = document.createElement("div");
        slot.className = "raft-empty-slot";
        slot.textContent = `Hueco ${i + 1}`;
        raftSlots.appendChild(slot);
      }
    }

    const count = this.seleccionados.size;
    if (count >= 1 && count <= 2) {
      crossBtn.removeAttribute("disabled");
      const names = selectedArray.map(p => p.nombre).join(" y ");
      const maxTime = Math.max(...selectedArray.map(p => p.tiempo));
      selectionInfo.textContent = `Embarcados: ${names}. Tiempo: ${maxTime} min.`;
    } else {
      crossBtn.setAttribute("disabled", "true");
      selectionInfo.textContent = "Selecciona 1 o 2 personas en la orilla de la linterna.";
    }

    if (window.lucide) lucide.createIcons();
  },

  toggleSelection(id) {
    if (this.seleccionados.has(id)) {
      this.seleccionados.delete(id);
      AudioSys.playSfx("pagina");
    } else {
      if (this.seleccionados.size >= 2) {
        alert("¡Solo caben 2 personas como máximo en la balsa!");
        return;
      }
      this.seleccionados.add(id);
      AudioSys.playSfx("pagina");
    }
    this.render();
  },

  hacerCruce() {
    if (this.seleccionados.size === 0 || this.seleccionados.size > 2) return;

    const cruzan = Array.from(this.seleccionados).map(id => this.personas.find(p => p.id === id));
    const tiempoCruce = Math.max(...cruzan.map(p => p.tiempo));

    cruzan.forEach(p => p.ladoInicial = !p.ladoInicial);
    this.tiempoTotal += tiempoCruce;
    this.linternaLadoInicial = !this.linternaLadoInicial;
    this.seleccionados.clear();

    AudioSys.playSfx("agua");

    const logList = document.getElementById("river-log-list");
    const emptyMsg = logList.querySelector(".empty");
    if (emptyMsg) emptyMsg.remove();

    const entry = document.createElement("div");
    entry.className = "log-entry";
    const direccion = this.linternaLadoInicial ? "Hacia Orilla Inicial" : "Hacia Orilla Final";
    entry.textContent = `• Cruzaron: ${cruzan.map(p => p.nombre).join(" y ")} (${direccion}) | +${tiempoCruce} min | Total: ${this.tiempoTotal} min`;
    logList.prepend(entry);

    this.render();

    if (this.todosCruzados()) {
      setTimeout(() => this.celebrarVictoria(), 500);
    }
  },

  todosCruzados() {
    return this.personas.every(p => !p.ladoInicial);
  },

  celebrarVictoria() {
    AudioSys.playSfx("victoria");
    GameState.acertijoRioCompletado = true;
    GameState.llaveRio = true;      // Llave misteriosa del río para abrir la alcantarilla nuclear
    GameState.pergamino3 = true;    // Tercer pergamino completado
    updateHud();

    alert(
      `🎉 ¡ENHORABUENA! 🎉\n\n` +
      `Has conseguido que todos crucen el río en ${this.tiempoTotal} minutos.\n` +
      `¡Has obtenido la LLAVE ANTIGUA DEL RÍO y el TERCER PERGAMINO!\n\n` +
      `Ahora tienes los elementos necesarios para abrir el secreto de la Central Nuclear.`
    );

    this.cerrar();
    SceneEngine.loadScene("alamedaAullante");
  },

  mostrarReglas() {
    AudioSys.playSfx("papel");
    alert(
      "REGLAS DEL ACERTIJO DEL RÍO:\n\n" +
      "• Cuatro amigos deben cruzar el río con una sola balsa.\n" +
      "• Solo caben 2 personas máximo en la balsa.\n" +
      "• Tiempos: Ana=1, Bruno=2, Carla=5, Diego=10.\n" +
      "• Si cruzan dos, cuenta el tiempo del más lento.\n" +
      "• Solo hay una linterna y siempre debe ir en la balsa (ida y vuelta).\n" +
      "• ¡Prueba tus jugadas y busca el récord óptimo de 17 minutos!"
    );
  },

  abrir() {
    const modal = document.getElementById("minigame-river");
    if (modal) {
      modal.classList.add("active");
      AudioSys.playBgm("acertijo");
      this.init();
    }
  },

  cerrar() {
    const modal = document.getElementById("minigame-river");
    if (modal) {
      modal.classList.remove("active");
      AudioSys.playBgm("buho");
    }
  },

  bindEvents() {
    const btnCross = document.getElementById("btn-river-cross");
    const btnReset = document.getElementById("btn-river-reset");
    const btnRules = document.getElementById("btn-river-rules");
    const btnExit = document.getElementById("btn-river-exit");

    if (btnCross) btnCross.onclick = () => this.hacerCruce();
    if (btnReset) btnReset.onclick = () => { AudioSys.playSfx("pagina"); this.reset(); };
    if (btnRules) btnRules.onclick = () => this.mostrarReglas();
    if (btnExit) btnExit.onclick = () => this.cerrar();
  }
};

// =============================================================================
// MODAL DE ENTRADA DE DATOS (NICKNAME / NOMBRES DE PERSONAJES)
// =============================================================================
const InputModal = {
  currentCallback: null,

  prompt(title, label, portraitSrc, defaultVal, callback) {
    const modal = document.getElementById("input-modal");
    const titleEl = document.getElementById("input-modal-title");
    const labelEl = document.getElementById("input-modal-label");
    const inputEl = document.getElementById("player-input-field");
    const portraitEl = document.getElementById("input-portrait-img");
    const submitBtn = document.getElementById("btn-submit-input");

    if (!modal) return;

    titleEl.textContent = title;
    labelEl.textContent = label;
    inputEl.value = defaultVal || "";
    this.currentCallback = callback;

    if (portraitSrc) {
      portraitEl.src = portraitSrc;
      portraitEl.parentElement.style.display = "block";
    } else {
      portraitEl.parentElement.style.display = "none";
    }

    modal.classList.add("active");
    setTimeout(() => inputEl.focus(), 100);

    const handleSubmit = () => {
      const val = inputEl.value.trim() || defaultVal;
      modal.classList.remove("active");
      submitBtn.onclick = null;
      inputEl.onkeydown = null;
      if (this.currentCallback) this.currentCallback(val);
    };

    submitBtn.onclick = handleSubmit;
    inputEl.onkeydown = (e) => {
      if (e.key === "Enter") handleSubmit();
    };
  }
};

// =============================================================================
// GRAFO COMPLETO DE ESCENAS (100% IDÉNTICO AL CÓDIGO JAVA TERMINADO)
// =============================================================================
const SCENES = {
  // ESCENA PRINCIPAL (CIUDAD)
  escenaPrincipal: {
    title: "Ciudad",
    banner: "CIUDAD PRINCIPAL",
    bg: "assets/images/ciudad_juego.png",
    bgm: "layton1",
    speaker: "Narrador",
    text: "Te encuentras en la ciudad. ¿A dónde quieres ir?",
    choices: [
      { text: "1. Ir a plaza central", action: () => SceneEngine.loadScene("plazaCentral") },
      { text: "2. Ir a mercado mayorista", action: () => SceneEngine.loadScene("mercadoMayorista") },
      { text: "3. Ir a barrio antiguo", action: () => SceneEngine.loadScene("barrioAntiguo") },
      { text: "4. Ir a alameda aullante", action: () => SceneEngine.loadScene("alamedaAullante") },
      { text: "5. Ir a estación central", action: () => SceneEngine.loadScene("estacionCentral") },
      { text: "6. Salir del Juego", action: () => SceneEngine.loadScene("salirJuego") }
    ]
  },

  // PLAZA CENTRAL
  plazaCentral: {
    title: "Plaza Central",
    banner: "PLAZA CENTRAL",
    bg: "assets/images/plaza_central.png",
    bgm: "ciudad",
    speaker: "Narrador",
    text: "La aventura comienza en la plaza central.\n¿Qué quieres hacer?",
    choices: [
      {
        text: "1. Hablar con el señor",
        action: () => {
          if (!GameState.hablarSeñor) {
            AudioSys.playSfx("senor");
            SceneEngine.showCustomDialogue(
              "Señor misterioso",
              "Se conoce que hace muchos años aquí había una civilización escondida de la cual no queda ni rastro o eso creemos.\nYo soy un pobre señor mayor y no tengo idea sobre el tema, pero cuando yo era pequeño escuché una conversación del antiguo dueño de la tienda que hablaba sobre unos documentos, a veces se escucha ruido aquí en una alcantarilla, probad suerte en el mercado.",
              "assets/images/escena_hablando_senor.png",
              () => {
                GameState.hablarSeñor = true;
                updateHud();
                SceneEngine.loadScene("plazaCentral");
              }
            );
          } else {
            AudioSys.playSfx("senor");
            SceneEngine.showCustomDialogue(
              "Señor",
              "No tengo nada nuevo que decir hijos míos, mucha suerte en vuestro viaje.",
              "assets/images/escena_hablando_senor.png",
              () => SceneEngine.loadScene("plazaCentral")
            );
          }
        }
      },
      {
        text: "2. Observar la alcantarilla",
        action: () => {
          AudioSys.playSfx("agua");
          SceneEngine.showCustomDialogue(
            "Alcantarilla",
            "En esta alcantarilla se escuchan ruidos a menudo, no sé si será alguna pista jóvenes...",
            "assets/images/observando_alcantarilla.jpg",
            () => {
              SceneEngine.showCustomDialogue(
                "Dentro de la alcantarilla",
                "Miras fijamente a través de los barrotes de la alcantarilla...",
                "assets/images/alcantarilla_principio.png",
                () => SceneEngine.loadScene("plazaCentral")
              );
            }
          );
        }
      },
      { text: "3. Ir al barrio antiguo", action: () => SceneEngine.loadScene("barrioAntiguo") },
      { text: "4. Ir a alameda aullante", action: () => SceneEngine.loadScene("alamedaAullante") },
      { text: "5. Ir a mercado mayorista", action: () => SceneEngine.loadScene("mercadoMayorista") },
      { text: "6. Ir a estación central", action: () => SceneEngine.loadScene("estacionCentral") },
      { text: "7. Salir del Juego", action: () => SceneEngine.loadScene("salirJuego") }
    ]
  },

  // ALAMEDA AULLANTE
  alamedaAullante: {
    title: "Alameda aullante",
    banner: "ALAMEDA AULLANTE",
    bg: "assets/images/alameda_aullante.png",
    bgm: "buho",
    speaker: "Narrador",
    text: "La alameda está silenciosa, se oyen ruidos extraños.",
    choices: [
      {
        text: "1. Buscar tras el árbol",
        action: () => {
          SceneEngine.showCustomDialogue(
            "Tras el árbol",
            `Aquí parece que hay otra especie de pista ¿no ${GameState.nombreHombre}?\nSí, eso parece ${GameState.nombreMujer}, pero no sé qué puede ser, investiguemos más.`,
            "assets/images/buscando_detras.png",
            () => SceneEngine.loadScene("alamedaAullante")
          );
        }
      },
      { text: "2. Volver a la plaza central", action: () => SceneEngine.loadScene("plazaCentral") },
      { text: "3. Bifurcación de caminos", action: () => SceneEngine.loadScene("bifurcacionCaminos") },
      {
        text: "4. Subirse al árbol",
        action: () => {
          GameState.subirArbol = true;
          updateHud();
          SceneEngine.showCustomDialogue(
            "Subir al árbol",
            `¡Eh mira ${GameState.nombreMujer}, desde aquí se ve una central nuclear!`,
            "assets/images/subida_arbol_nuclear.png",
            () => SceneEngine.loadScene("alamedaAullante")
          );
        }
      },
      {
        text: "5. Ir a la central nuclear",
        action: () => {
          if (GameState.subirArbol) {
            SceneEngine.loadScene("centralNuclear");
          } else {
            alert("Atención:\nDeberías tener algo más de visión para orientarte antes de ir.");
            SceneEngine.loadScene("alamedaAullante");
          }
        }
      },
      { text: "6. Salir del Juego", action: () => SceneEngine.loadScene("salirJuego") }
    ]
  },

  // BIFURCACIÓN DE CAMINOS
  bifurcacionCaminos: {
    title: "Bifurcación",
    banner: "BIFURCACIÓN DE CAMINOS",
    bg: "assets/images/bifurcacion_camino.png",
    bgm: "buho",
    speaker: "Narrador",
    text: "Te encuentras en una bifurcación. ¿Hacia dónde quieres ir?",
    choices: [
      {
        text: "1. Ir hacia la izquierda (Acertijo del Río)",
        action: () => {
          SceneEngine.showCustomDialogue(
            "Camino de la izquierda",
            "Escoges el camino de la izquierda que desciende hacia la orilla del río...",
            "assets/images/bifurcacion_camino.png",
            () => RiverRiddle.abrir()
          );
        }
      },
      {
        text: "2. Ir hacia la derecha (¡Peligro!)",
        action: () => {
          SceneEngine.showCustomDialogue(
            "Camino de la derecha",
            "Coges valor y te adentras por el camino de la derecha...",
            "assets/images/camino_derecha.png",
            () => {
              triggerJumpScare(() => SceneEngine.loadScene("alamedaAullante"));
            }
          );
        }
      },
      { text: "3. Volver atrás", action: () => SceneEngine.loadScene("alamedaAullante") }
    ]
  },

  // CENTRAL NUCLEAR
  centralNuclear: {
    title: "Central nuclear",
    banner: "CENTRAL NUCLEAR DE LAS AFUERAS",
    bg: "assets/images/conversacion_guardia.png",
    bgm: "layton2",
    speaker: "Narrador",
    text: "¡Por fin llegamos a la central nuclear!\nPero... hay un guardia, ¿qué hacemos?",
    choices: [
      {
        text: "1. Investigar alrededores",
        action: () => {
          if (GameState.pergamino1 && GameState.pergamino2 && GameState.pergamino3 && GameState.permisoHomer) {
            SceneEngine.loadScene("investigarAlrededores");
          } else {
            alert("Atención:\nParece que no tenemos las cosas necesarias para ello.\n(Necesitas los 3 Pergaminos y la confianza del guardia Homer)");
            SceneEngine.loadScene("centralNuclear");
          }
        }
      },
      {
        text: "2. Hablar con el segurata",
        action: () => {
          GameState.permisoHomer = true;
          updateHud();
          SceneEngine.showCustomDialogue(
            "Hablando con Homer",
            "Homer: Muchachos, este no es lugar por el cual estar jugando... pero si buscáis respuestas, tened cuidado con lo que encontréis en los alrededores.",
            "assets/images/conversacion_guardia.png",
            () => SceneEngine.loadScene("centralNuclear")
          );
        }
      },
      {
        text: "3. Volver a la estación central (10 monedas)",
        cost: 10,
        action: () => {
          if (GameState.dinero >= 10) {
            GameState.dinero -= 10;
            updateHud();
            SceneEngine.loadScene("estacionCentral");
          } else {
            alert("Sin dinero: Necesitas al menos 10 monedas para el billete de vuelta.");
            SceneEngine.loadScene("centralNuclear");
          }
        }
      },
      { text: "4. Volver a la alameda aullante", action: () => SceneEngine.loadScene("alamedaAullante") },
      { text: "5. Salir del Juego", action: () => SceneEngine.loadScene("salirJuego") }
    ]
  },

  // INVESTIGAR ALREDEDORES (FINAL DE LA HISTORIA)
  investigarAlrededores: {
    title: "Alrededores Nuclear",
    banner: "ALREDEDORES DE LA CENTRAL NUCLEAR",
    bg: "assets/images/alcantarillacerradacentral.png",
    bgm: "layton2",
    speaker: "Narrador",
    text: "En los alrededores de la central nuclear bajo la supervisión de Homer...\nEspera, ¿qué es esto?",
    choices: [
      {
        text: "1. Abrir alcantarilla con la llave",
        action: () => {
          if (GameState.llaveRio) {
            SceneEngine.showCustomDialogue(
              "Aliens agradecidos",
              `${GameState.nombreMujer}, creo que hemos resuelto lo que estábamos buscando...`,
              "assets/images/alcantarilla_abierta_nuclear.png",
              () => {
                SceneEngine.showCustomDialogue(
                  "Ciudad subterránea de los aliens",
                  "¡Bajo la ciudad se extendía un colosal reino subterráneo donde una civilización extraterrestre ha vivido en secreto!",
                  "assets/images/ciudad_aliens.png",
                  () => {
                    alert("Armonía:\nAl cabo del tiempo, aliens y humanos aprendieron a vivir en humildad y armonía...");
                    SceneEngine.showCustomDialogue(
                      "Plaza renovada",
                      "La plaza central ha cambiado para siempre tras tus valientes acciones.",
                      "assets/images/ciudad_subterranea.png",
                      () => SceneEngine.loadScene("finalFeliz")
                    );
                  }
                );
              }
            );
          } else {
            alert("Bloqueada:\nParece que no puedes abrir la alcantarilla, te falta la Llave Antigua del Río...");
            SceneEngine.loadScene("centralNuclear");
          }
        }
      },
      { text: "2. Ir atrás", action: () => SceneEngine.loadScene("centralNuclear") }
    ]
  },

  // FINAL FELIZ
  finalFeliz: {
    title: "¡Enhorabuena!",
    banner: "RESOLUCIÓN DEL CASO: VICTORIA",
    bg: "assets/images/ciudad_subterranea.png",
    bgm: "fantasia",
    speaker: "Profesor Python",
    text: () => `¡Felicidades ${GameState.nombreJug}! Has completado la aventura, resuelto todos los enigmas y salvado la ciudad. ¡Gran trabajo, investigador!`,
    choices: [
      {
        text: "Volver a la ciudad en armonía",
        action: () => SceneEngine.loadScene("escenaPrincipal")
      },
      {
        text: "Pantalla de título",
        action: () => document.getElementById("title-screen").classList.add("active")
      }
    ]
  },

  // ESTACIÓN CENTRAL
  estacionCentral: {
    title: "Estación central",
    banner: "ESTACIÓN CENTRAL",
    bg: "assets/images/estacion_central.png",
    bgm: "ciudad",
    speaker: "Narrador",
    text: "La estación central está llena de viajeros.",
    choices: [
      { text: "1. Volver a plaza central", action: () => SceneEngine.loadScene("plazaCentral") },
      { text: "2. Ir a mercado mayorista", action: () => SceneEngine.loadScene("mercadoMayorista") },
      {
        text: "3. Ir a central nuclear (10 monedas)",
        cost: 10,
        action: () => {
          if (GameState.dinero >= 10) {
            GameState.dinero -= 10;
            updateHud();
            SceneEngine.loadScene("centralNuclear");
          } else {
            alert("Sin dinero: Necesitas al menos 10 monedas para el billete de tren.");
            SceneEngine.loadScene("estacionCentral");
          }
        }
      },
      {
        text: "4. Ir al segundo piso",
        action: () => {
          const imgEscaleras = GameState.pergamino1 ? "assets/images/pista_acertijo1_nuclear.png" : "assets/images/escaleras_segundo_piso.png";
          const tituloEsc = GameState.pergamino1 ? "Escaleras con extraño grafiti" : "Escaleras al segundo piso";

          SceneEngine.showCustomDialogue(
            tituloEsc,
            "Subes las escaleras hacia la planta superior...",
            imgEscaleras,
            () => {
              SceneEngine.showCustomDialogue(
                "Segundo piso",
                "No hay nada.",
                "assets/images/segundopiso_nada.png",
                () => SceneEngine.loadScene("estacionCentral")
              );
            }
          );
        }
      },
      { text: "5. Salir del Juego", action: () => SceneEngine.loadScene("salirJuego") }
    ]
  },

  // BARRIO ANTIGUO
  barrioAntiguo: {
    title: "Barrio antiguo",
    banner: "BARRIO ANTIGUO",
    bg: "assets/images/biblioteca_callejon.png",
    bgm: "layton1",
    speaker: "Narrador",
    text: "Parece que hemos llegado a la biblioteca, a ver qué encontramos por aquí...",
    choices: [
      { text: "1. Entrar a la biblioteca", action: () => SceneEngine.loadScene("entrarBiblioteca") },
      { text: "2. Volver a la plaza central", action: () => SceneEngine.loadScene("plazaCentral") },
      {
        text: "3. Ir al callejón oscuro (¡Peligro!)",
        action: () => {
          triggerJumpScare(() => SceneEngine.loadScene("barrioAntiguo"));
        }
      },
      { text: "4. Salir del Juego", action: () => SceneEngine.loadScene("salirJuego") }
    ]
  },

  // DENTRO DE LA BIBLIOTECA
  entrarBiblioteca: {
    title: "Biblioteca",
    banner: "BIBLIOTECA ANTIGUA",
    bg: "assets/images/libreria_grande.png",
    bgm: "layton1",
    speaker: "Narrador",
    text: "La biblioteca está llena de estanterías y libros antiguos, nada especial a simple vista.",
    choices: [
      {
        text: "1. Hablar con el bibliotecario",
        action: () => {
          if (GameState.pergamino2) {
            SceneEngine.showCustomDialogue(
              "Bibliotecario",
              "Revisas la librería en busca de algo interesante. El bibliotecario asiente respetuoso tras haber resuelto el enigma.",
              "assets/images/hablando_bibliotecario.png",
              () => SceneEngine.loadScene("barrioAntiguo")
            );
          } else {
            alert("Bibliotecario:\nOs deseo suerte en vuestra aventura, pero aún no he podido encontrar nada especial...");
            SceneEngine.loadScene("entrarBiblioteca");
          }
        }
      },
      {
        text: "2. Observar librería",
        action: () => {
          GameState.verAcertijo2 = true;
          updateHud();
          SceneEngine.showCustomDialogue(
            "Librería",
            "Revisas la librería en busca de algo interesante.",
            "assets/images/libreria_grande.png",
            () => {
              SceneEngine.showCustomDialogue(
                "Conversación",
                `${GameState.nombreMujer} hojea un libro antiguo mientras ${GameState.nombreHombre} observa unas notas misteriosas en una esquina. ¡Parece un acertijo sobre estantes!`,
                "assets/images/libreria.png",
                () => SceneEngine.loadScene("entrarBiblioteca")
              );
            }
          );
        }
      },
      {
        text: "3. Resolver acertijo (Estantes)",
        action: () => {
          if (!GameState.verAcertijo2) {
            alert("Nada sospechoso:\nPor ahora parece una librería normal, quizá deberías investigar y observar un poco más.");
            SceneEngine.loadScene("entrarBiblioteca");
          } else {
            LibraryRiddle.abrir();
          }
        }
      },
      { text: "4. Volver al barrio antiguo", action: () => SceneEngine.loadScene("barrioAntiguo") }
    ]
  },

  // MERCADO MAYORISTA
  mercadoMayorista: {
    title: "Mercado mayorista",
    banner: "MERCADO MAYORISTA",
    bg: "assets/images/mercado_mayorista.png",
    bgm: "mercado",
    speaker: "Narrador",
    text: "El mercado está lleno de puestos y gente.",
    choices: [
      { text: "1. Ir a la tienda", action: () => SceneEngine.loadScene("irALaTienda") },
      { text: "2. Ir al bazar", action: () => SceneEngine.loadScene("irALBazar") },
      { text: "3. Ir a estación central", action: () => SceneEngine.loadScene("estacionCentral") },
      { text: "4. Ir a plaza central", action: () => SceneEngine.loadScene("plazaCentral") },
      { text: "5. Salir del Juego", action: () => SceneEngine.loadScene("salirJuego") }
    ]
  },

  // IR A LA TIENDA
  irALaTienda: {
    title: "Calle de la tienda",
    banner: "CALLE DE LA TIENDA",
    bg: "assets/images/yendo_tienda.png",
    bgm: "mercado",
    speaker: "Narrador",
    text: "A ver si pudiésemos conseguir algo de información...",
    choices: [
      {
        text: "1. Ir a la tienda",
        action: () => {
          AudioSys.playSfx("campanas");
          GameState.colarseAtrasTienda = true;
          updateHud();
          SceneEngine.showCustomDialogue(
            "Interior tienda",
            `Buenos días señor, nos han llegado rumores de que por aquí hace tiempo había una persona que sabía algo de algún secreto de la ciudad, ¿es eso cierto?\n\nDependiente: Pues la verdad que no lo sé, lo único que sé es que en la parte de atrás de la tienda hay una entrada que da al almacén y tiene una caja fuerte que nunca he podido desbloquear.\n\n¿Sería usted tan amable de dejarnos ver esa caja fuerte?\n\nDependiente: Lo siento chicos, el acceso no está permitido para personal no autorizado, que tengáis buen día.`,
            "assets/images/dependiente_mercado.png",
            () => SceneEngine.loadScene("irALaTienda")
          );
        }
      },
      {
        text: "2. Colarse en la parte de atrás de la tienda",
        action: () => {
          if (!GameState.colarseAtrasTienda) {
            alert("Aviso:\nNo sabes dónde es, deberías de obtener información del sitio hablando antes en la tienda.");
            SceneEngine.loadScene("irALaTienda");
          } else {
            SceneEngine.loadScene("colarseTienda");
          }
        }
      },
      { text: "3. Ir atrás", action: () => SceneEngine.loadScene("mercadoMayorista") },
      { text: "4. Salir del Juego", action: () => SceneEngine.loadScene("salirJuego") }
    ]
  },

  // COLARSE EN LA TIENDA
  colarseTienda: {
    title: "Puerta trasera",
    banner: "TRASTIENDA DEL MERCADO",
    bg: "assets/images/puerta_atras_tienda.png",
    bgm: "mercado",
    speaker: "Narrador",
    text: "Llegas a la parte trasera de la tienda, ves una puerta con candado y la fuerzas para entrar.",
    choices: [
      {
        text: "1. Forzar cerradura (Acertijo)",
        action: () => {
          SceneEngine.showCustomDialogue(
            "Viendo caja fuerte",
            "Observas la sucesión de números en la caja fuerte.\n¿Qué número falta al final de la sucesión?",
            "assets/images/abriendo_caja_fuerte.png",
            () => SafeRiddle.abrir()
          );
        }
      },
      { text: "2. Volver atrás", action: () => SceneEngine.loadScene("irALaTienda") },
      { text: "3. Salir del Juego", action: () => SceneEngine.loadScene("salirJuego") }
    ]
  },

  // BAZAR CHINO
  irALBazar: {
    title: "Bazar Chino",
    banner: "BAZAR CHINO",
    bg: "assets/images/hablando_con_chinos.png",
    bgm: "bazar",
    speaker: "Dependienta",
    text: "Buenas señora, ¿sabe usted algo del misterio de la ciudad?\nDependienta: ...\nDependienta: ...\nDependienta: ...\nParece que no nos entiende, vámonos.",
    choices: [
      { text: "1. Volver atrás", action: () => SceneEngine.loadScene("mercadoMayorista") },
      { text: "2. Salir del Juego", action: () => SceneEngine.loadScene("salirJuego") }
    ]
  },

  // SALIR DEL JUEGO
  salirJuego: {
    title: "Salir del juego",
    banner: "FIN DE LA SESIÓN",
    bg: "assets/images/portada.png",
    bgm: "layton1",
    speaker: "Profesor Python",
    text: () => `Has decidido salir. ¡Muchas gracias por jugar, ${GameState.nombreJug}!`,
    choices: [
      { text: "Continuar investigando", action: () => SceneEngine.loadScene(GameState.previousScene || "escenaPrincipal") },
      { text: "Ir a la pantalla de título", action: () => document.getElementById("title-screen").classList.add("active") }
    ]
  }
};

// =============================================================================
// MOTOR DE ESCENAS Y CONTROLADOR PRINCIPAL
// =============================================================================
const SceneEngine = {
  loadScene(sceneKey) {
    const scene = SCENES[sceneKey];
    if (!scene) {
      console.error("Escena no encontrada:", sceneKey);
      return;
    }

    GameState.previousScene = GameState.currentScene;
    GameState.currentScene = sceneKey;
    GameState.visitedLocations.add(sceneKey);
    updateHud();

    // Actualizar imagen central y fondo difuso
    const mainImg = document.getElementById("main-scene-image");
    const bgEl = document.getElementById("scene-bg");
    if (scene.bg) {
      if (mainImg) {
        mainImg.src = scene.bg;
        mainImg.classList.remove("fade-in");
        void mainImg.offsetWidth;
        mainImg.classList.add("fade-in");
      }
      if (bgEl) {
        bgEl.style.backgroundImage = `url('${scene.bg}')`;
      }
    }

    // Actualizar banner
    const titleEl = document.getElementById("scene-title");
    if (titleEl) titleEl.textContent = scene.banner || scene.title.toUpperCase();

    // Música
    if (scene.bgm) {
      AudioSys.playBgm(scene.bgm);
    }

    // Texto y diálogo
    const text = typeof scene.text === "function" ? scene.text() : scene.text;
    DialogSys.say(scene.speaker || "NARRADOR", text, () => {
      this.renderChoices(scene.choices);
    });
  },

  renderChoices(choices) {
    const container = document.getElementById("choices-container");
    const promptEl = document.getElementById("choices-prompt");
    if (!container) return;

    container.innerHTML = "";
    promptEl.textContent = "¿Qué decides hacer?";

    if (!choices || choices.length === 0) return;

    choices.forEach((choice, index) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      
      const badgeCost = choice.cost ? `<span class="choice-badge-cost">${choice.cost} monedas</span>` : "";

      btn.innerHTML = `
        <span class="choice-key-badge">${index + 1}</span>
        <span class="choice-label">${choice.text}</span>
        ${badgeCost}
      `;

      btn.addEventListener("click", () => {
        AudioSys.playSfx("pagina");
        choice.action();
      });

      container.appendChild(btn);
    });
  },

  showCustomDialogue(speaker, message, imageSrc, onNext) {
    const container = document.getElementById("choices-container");
    const promptEl = document.getElementById("choices-prompt");
    if (container) container.innerHTML = "";
    if (promptEl) promptEl.textContent = "Continuar relato...";

    const mainImg = document.getElementById("main-scene-image");
    const bgEl = document.getElementById("scene-bg");
    if (imageSrc) {
      if (mainImg) {
        mainImg.src = imageSrc;
        mainImg.classList.remove("fade-in");
        void mainImg.offsetWidth;
        mainImg.classList.add("fade-in");
      }
      if (bgEl) {
        bgEl.style.backgroundImage = `url('${imageSrc}')`;
      }
    }

    DialogSys.say(speaker, message, () => {
      if (container) {
        const nextBtn = document.createElement("button");
        nextBtn.className = "choice-btn btn-primary-glow";
        nextBtn.style.gridColumn = "1 / -1";
        nextBtn.innerHTML = `
          <span class="choice-label">Continuar ➔</span>
        `;
        nextBtn.onclick = () => {
          AudioSys.playSfx("pagina");
          if (onNext) onNext();
        };
        container.appendChild(nextBtn);
      }
    });
  }
};

// =============================================================================
// FLUJO INICIAL DEL JUEGO
// =============================================================================
function iniciarNuevaAventura() {
  document.getElementById("title-screen").classList.remove("active");

  const cutsceneOverlay = document.getElementById("cutscene-overlay");
  const cutsceneSubtitles = document.getElementById("cutscene-subtitles");
  const btnSkipCutscene = document.getElementById("btn-skip-cutscene");

  cutsceneOverlay.classList.add("active");
  cutsceneSubtitles.textContent = "En una ciudad, de la nada ocurrió lo inesperado...";
  AudioSys.playBgm("introVideo");

  const finishCutscene = () => {
    cutsceneOverlay.classList.remove("active");
    AudioSys.stopBgm();
    pedirDatosJugador();
  };

  btnSkipCutscene.onclick = finishCutscene;
  setTimeout(() => {
    if (cutsceneOverlay.classList.contains("active")) {
      finishCutscene();
    }
  }, 10000);
}

function pedirDatosJugador() {
  AudioSys.playBgm("layton1");

  InputModal.prompt(
    "Bienvenido",
    "¿Cuál es tu nickname?",
    null,
    "Profesor",
    (nickname) => {
      GameState.nombreJug = nickname;
      updateHud();

      InputModal.prompt(
        "Personaje 1",
        "Nombre de la chica:",
        "assets/images/chica.png",
        "Lucía",
        (nombreChica) => {
          GameState.nombreMujer = nombreChica;
          updateHud();

          InputModal.prompt(
            "Personaje 2",
            "Nombre del chico:",
            "assets/images/chico.png",
            "Marcos",
            (nombreChico) => {
              GameState.nombreHombre = nombreChico;
              updateHud();
              secuenciaIntroHistoria();
            }
          );
        }
      );
    }
  );
}

function secuenciaIntroHistoria() {
  SceneEngine.showCustomDialogue(
    "Una hoja en el suelo",
    `Un día cualquiera ${GameState.nombreHombre} y ${GameState.nombreMujer} estaban dando una vuelta por la ciudad y se encontraron un papel en el suelo...`,
    "assets/images/imagen_perso_papel_fondo.png",
    () => {
      AudioSys.playSfx("jeroglificos");
      SceneEngine.showCustomDialogue(
        "Mirando el papel",
        "El papel contenía unos extraños jeroglíficos en un idioma que no entendían y eso generó en nuestros protagonistas mucha intriga, ya que ambos desde siempre han tenido un carácter muy aventurero y siempre han estado jugando a los detectives.",
        "assets/images/papel_jeroglificos.png",
        () => {
          SceneEngine.showCustomDialogue(
            "Conversación",
            `Esa misma noche ${GameState.nombreHombre} y ${GameState.nombreMujer} estuvieron horas y horas hablando del tema a través de sus dispositivos móviles y ambos se contaron cosas que hasta ese día lo tenían guardado bajo llave.\n\nAmbos llevaban tiempo escuchando ruidos en las profundidades de la ciudad y sabían que cosas extrañas estaban pasando, y así...\n\nCOMIENZA ESTA HISTORIA.`,
            "assets/images/conver_cama.png",
            () => SceneEngine.loadScene("escenaPrincipal")
          );
        }
      );
    }
  );
}

// =============================================================================
// ACTUALIZACIÓN DE HUD Y ESTADÍSTICAS
// =============================================================================
function updateHud() {
  const pName = document.getElementById("hud-player-name");
  const tNames = document.getElementById("hud-team-names");
  const mCount = document.getElementById("hud-money-count");
  const lName = document.getElementById("hud-location-name");
  const fStatus = document.getElementById("footer-system-status");

  if (pName) pName.textContent = GameState.nombreJug;
  if (tNames) tNames.textContent = `${GameState.nombreHombre} & ${GameState.nombreMujer}`;
  if (mCount) mCount.textContent = GameState.dinero;

  const currentSc = SCENES[GameState.currentScene];
  const locTitle = currentSc ? (currentSc.banner || currentSc.title) : "Ciudad";
  if (lName) lName.textContent = locTitle;
  if (fStatus) fStatus.textContent = `Explorando: ${locTitle}`;

  // Actualizar mapa
  document.querySelectorAll(".map-node").forEach(node => {
    if (node.getAttribute("data-scene") === GameState.currentScene) {
      node.classList.add("current");
    } else {
      node.classList.remove("current");
    }
  });

  // Guardado automático
  try {
    localStorage.setItem("aventura_profesor_python_save_v2", JSON.stringify(GameState));
  } catch (e) {}
}

// =============================================================================
// CONTROLADORES DE MODALES Y EXPEDIENTES
// =============================================================================
function initModals() {
  const btnCodex = document.getElementById("btn-codex");
  const modalCodex = document.getElementById("codex-modal");
  const btnCloseCodex = document.getElementById("btn-close-codex");

  if (btnCodex) {
    btnCodex.onclick = () => {
      AudioSys.playSfx("pagina");
      renderCodexContent();
      modalCodex.classList.add("active");
    };
  }
  if (btnCloseCodex) btnCloseCodex.onclick = () => modalCodex.classList.remove("active");

  const tabBtns = document.querySelectorAll(".codex-tab-btn");
  tabBtns.forEach(btn => {
    btn.onclick = () => {
      AudioSys.playSfx("pagina");
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const targetTab = btn.getAttribute("data-tab");
      document.querySelectorAll(".codex-tab-content").forEach(tc => tc.classList.remove("active"));
      const targetEl = document.getElementById(targetTab);
      if (targetEl) targetEl.classList.add("active");
    };
  });

  const btnMap = document.getElementById("btn-map");
  const modalMap = document.getElementById("map-modal");
  const btnCloseMap = document.getElementById("btn-close-map");

  if (btnMap) {
    btnMap.onclick = () => {
      AudioSys.playSfx("pagina");
      modalMap.classList.add("active");
    };
  }
  if (btnCloseMap) btnCloseMap.onclick = () => modalMap.classList.remove("active");

  document.querySelectorAll(".map-node").forEach(node => {
    node.onclick = () => {
      const scene = node.getAttribute("data-scene");
      modalMap.classList.remove("active");
      if (scene) SceneEngine.loadScene(scene);
    };
  });

  const btnCredits = document.getElementById("btn-credits");
  const modalCredits = document.getElementById("credits-modal");
  const btnCloseCredits = document.getElementById("btn-close-credits");

  if (btnCredits) {
    btnCredits.onclick = () => {
      AudioSys.playSfx("pagina");
      modalCredits.classList.add("active");
    };
  }
  if (btnCloseCredits) btnCloseCredits.onclick = () => modalCredits.classList.remove("active");

  const btnAudioToggle = document.getElementById("btn-audio-toggle");
  const audioIcon = document.getElementById("audio-icon");
  const volumeSlider = document.getElementById("volume-slider");

  if (btnAudioToggle) {
    btnAudioToggle.onclick = () => {
      const isMuted = AudioSys.toggleMute();
      if (audioIcon) {
        audioIcon.setAttribute("data-lucide", isMuted ? "volume-x" : "volume-2");
        if (window.lucide) lucide.createIcons();
      }
    };
  }

  if (volumeSlider) {
    volumeSlider.oninput = (e) => AudioSys.setVolume(parseFloat(e.target.value));
  }

  const btnFullscreen = document.getElementById("btn-fullscreen");
  if (btnFullscreen) {
    btnFullscreen.onclick = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    };
  }

  const btnRestart = document.getElementById("btn-restart-game");
  if (btnRestart) {
    btnRestart.onclick = () => {
      if (confirm("¿Deseas reiniciar la investigación desde el principio?")) {
        localStorage.removeItem("aventura_profesor_python_save_v2");
        location.reload();
      }
    };
  }

  const dialogueHud = document.getElementById("dialogue-hud");
  if (dialogueHud) {
    dialogueHud.onclick = () => DialogSys.handleUserClick();
  }

  // Lightbox
  const centralFrame = document.getElementById("central-image-frame");
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const btnCloseLightbox = document.getElementById("btn-close-lightbox");

  if (centralFrame && lightboxModal && lightboxImg) {
    centralFrame.onclick = () => {
      const mainImg = document.getElementById("main-scene-image");
      if (mainImg && mainImg.src) {
        lightboxImg.src = mainImg.src;
        if (lightboxCaption) {
          const titleEl = document.getElementById("scene-title");
          lightboxCaption.textContent = titleEl ? titleEl.textContent : "Ilustración";
        }
        lightboxModal.classList.add("active");
        AudioSys.playSfx("pagina");
      }
    };
  }

  if (btnCloseLightbox && lightboxModal) {
    btnCloseLightbox.onclick = () => lightboxModal.classList.remove("active");
  }
  if (lightboxModal) {
    lightboxModal.onclick = (e) => {
      if (e.target === lightboxModal) lightboxModal.classList.remove("active");
    };
  }
}

// =============================================================================
// RENDERIZADO DEL CÓDICE / INVENTARIO
// =============================================================================
function renderCodexContent() {
  const invGrid = document.getElementById("inventory-grid");
  if (invGrid) {
    invGrid.innerHTML = `
      <div class="inventory-item-card">
        <div class="item-icon-box"><i data-lucide="coins"></i></div>
        <span class="item-name">${GameState.dinero} Monedas</span>
        <span class="item-desc">Dinero para viajes en tren y comercio.</span>
      </div>
      <div class="inventory-item-card">
        <div class="item-icon-box"><i data-lucide="scroll"></i></div>
        <span class="item-name">1er Pergamino</span>
        <span class="item-desc">${GameState.pergamino1 ? "Obtenido de la caja fuerte Fibonacci." : "Pendiente de encontrar (Mercado)."}</span>
      </div>
      <div class="inventory-item-card">
        <div class="item-icon-box"><i data-lucide="scroll"></i></div>
        <span class="item-name">2º Pergamino</span>
        <span class="item-desc">${GameState.pergamino2 ? "Obtenido en la biblioteca (Estantes)." : "Pendiente de descifrar (Biblioteca)."}</span>
      </div>
      <div class="inventory-item-card">
        <div class="item-icon-box"><i data-lucide="scroll"></i></div>
        <span class="item-name">3er Pergamino</span>
        <span class="item-desc">${GameState.pergamino3 ? "Obtenido tras cruzar el río del bosque." : "Pendiente de cruce (Alameda)."}</span>
      </div>
      <div class="inventory-item-card">
        <div class="item-icon-box"><i data-lucide="key"></i></div>
        <span class="item-name">Llave Antigua del Río</span>
        <span class="item-desc">${GameState.llaveRio ? "Llave que abre la alcantarilla secreta de la central nuclear." : "En posesión de los amigos del río."}</span>
      </div>
    `;
  }

  const cluesList = document.getElementById("clues-list");
  if (cluesList) {
    cluesList.innerHTML = `
      <div class="clue-card">
        <h6 class="clue-title">Secreto de la Alcantarilla de la Central Nuclear</h6>
        <p class="clue-text">Para acceder a la civilización subterránea necesitas los 3 Pergaminos, la aprobación del guardia Homer y la Llave Antigua del Río.</p>
      </div>
      <div class="clue-card">
        <h6 class="clue-title">Visión de la Central</h6>
        <p class="clue-text">${GameState.subirArbol ? "Has divisado la central nuclear desde lo alto de la alameda aullante." : "Sube al árbol más alto de la alameda para orientarte."}</p>
      </div>
      <div class="clue-card">
        <h6 class="clue-title">Permiso de Seguridad</h6>
        <p class="clue-text">${GameState.permisoHomer ? "Homer ha autorizado que investigues los alrededores." : "Habla con el segurata Homer en la central nuclear."}</p>
      </div>
    `;
  }

  const galGrid = document.getElementById("gallery-grid");
  if (galGrid) {
    const images = [
      { src: "assets/images/portada.png", name: "Portada Oficial" },
      { src: "assets/images/ciudad_juego.png", name: "Ciudad Principal (Mapa)" },
      { src: "assets/images/plaza_central.png", name: "Plaza Central" },
      { src: "assets/images/alameda_aullante.png", name: "Alameda Aullante" },
      { src: "assets/images/estacion_central.png", name: "Estación Central" },
      { src: "assets/images/biblioteca_callejon.png", name: "Barrio Antiguo" },
      { src: "assets/images/mercado_mayorista.png", name: "Mercado Mayorista" },
      { src: "assets/images/conversacion_guardia.png", name: "Central Nuclear" },
      { src: "assets/images/alcantarillacerradacentral.png", name: "Alcantarilla Nuclear" },
      { src: "assets/images/ciudad_subterranea.png", name: "Ciudad Subterránea" },
      { src: "assets/images/sucesion.png", name: "Sucesión Fibonacci" },
      { src: "assets/images/abriendo_caja_fuerte.png", name: "Caja Fuerte" },
      { src: "assets/images/jumpscare.jpg", name: "¡Jumpscare!" }
    ];

    galGrid.innerHTML = images.map(img => `
      <div class="gallery-card" onclick="alert('Mostrando: ${img.name}')">
        <img src="${img.src}" alt="${img.name}" loading="lazy">
        <div class="gallery-caption">${img.name}</div>
      </div>
    `).join("");
  }

  const musicList = document.getElementById("music-tracklist");
  if (musicList) {
    const tracks = [
      { key: "layton1", name: "Profesor Layton Theme (Tema Principal)" },
      { key: "ciudad", name: "Ambiente Urbano de la Plaza" },
      { key: "buho", name: "Ecos Nocturnos de la Alameda" },
      { key: "mercado", name: "Bullicio del Mercado Mayorista" },
      { key: "bazar", name: "Murmullos en el Bazar" },
      { key: "acertijo", name: "Tema de Acertijos y Enigmas" },
      { key: "fantasia", name: "Fanfarria del Descubrimiento y Armonía" },
      { key: "layton2", name: "Misterio Subterráneo" }
    ];

    musicList.innerHTML = tracks.map(t => `
      <div class="track-row">
        <span class="track-title"><i data-lucide="music-2"></i> ${t.name}</span>
        <button class="btn-play-track" onclick="AudioSys.playBgm('${t.key}')">Reproducir</button>
      </div>
    `).join("");
  }

  if (window.lucide) lucide.createIcons();
}

// =============================================================================
// ATAJOS DE TECLADO GLOBALES
// =============================================================================
function initKeyboardShortcuts() {
  window.addEventListener("keydown", (e) => {
    const activeModal = document.querySelector(".modal-backdrop.active, .minigame-modal.active, .lightbox-modal.active");
    if (activeModal) {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-backdrop.active, .lightbox-modal.active").forEach(m => m.classList.remove("active"));
      }
      return;
    }

    if (e.key === " " || e.key === "Enter") {
      DialogSys.handleUserClick();
      return;
    }

    const num = parseInt(e.key, 10);
    if (!isNaN(num) && num >= 1 && num <= 9) {
      const choices = document.querySelectorAll(".choice-btn");
      if (choices[num - 1] && !choices[num - 1].disabled) {
        choices[num - 1].click();
      }
    }

    if (e.key.toLowerCase() === "m") {
      const btnMap = document.getElementById("btn-map");
      if (btnMap) btnMap.click();
    }
    if (e.key.toLowerCase() === "b") {
      const btnCodex = document.getElementById("btn-codex");
      if (btnCodex) btnCodex.click();
    }
  });
}

// =============================================================================
// INICIALIZACIÓN GLOBAL
// =============================================================================
window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();

  RiverRiddle.init();
  SafeRiddle.init();
  LibraryRiddle.init();
  initModals();
  initKeyboardShortcuts();

  const btnStart = document.getElementById("btn-start-adventure");
  if (btnStart) {
    btnStart.onclick = () => {
      AudioSys.playSfx("pagina");
      iniciarNuevaAventura();
    };
  }

  try {
    const rawSave = localStorage.getItem("aventura_profesor_python_save_v2");
    if (rawSave) {
      const save = JSON.parse(rawSave);
      const btnContinue = document.getElementById("btn-continue-adventure");
      if (btnContinue) {
        btnContinue.style.display = "flex";
        btnContinue.onclick = () => {
          Object.assign(GameState, save);
          document.getElementById("title-screen").classList.remove("active");
          updateHud();
          SceneEngine.loadScene(GameState.currentScene || "escenaPrincipal");
        };
      }
    }
  } catch (e) {}

  updateHud();
});
