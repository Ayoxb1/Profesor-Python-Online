import { StoryNode, GameState } from '../types/game';

export const INITIAL_GAME_STATE: GameState = {
  playerName: 'Detective',
  femaleName: 'Elena',
  maleName: 'Marcos',
  money: 0,
  parchment1: false,
  parchment2: false,
  parchment3: false,
  talkedToOldMan: false,
  sneakedBack: false,
  sneakedStore: false,
  inventory: [],
  currentNodeId: 'intro_video',
  visitedNodes: ['intro_video'],
  audioMuted: false,
};

export const STORY_NODES: Record<string, StoryNode> = {
  intro_video: {
    id: 'intro_video',
    title: 'Comienzo de la historia',
    description: 'En una apacible ciudad, de la nada ocurrió lo inesperado...',
    image: '/images/inicio_del_juego/VideoEntrada.gif',
    soundEffect: '/audio/AudioVideo.wav',
    type: 'cutscene',
    autoAdvanceMs: 14000,
    nextAutoNodeId: 'portada',
    choices: [
      {
        id: 'skip_intro',
        text: 'Saltar introducción ⏩',
        targetNodeId: 'portada',
      },
    ],
  },

  portada: {
    id: 'portada',
    title: 'El Profesor Python y El Misterio de la Alcantarilla',
    description: 'Una aventura gráfica interactiva de misterio, acertijos y decisiones.',
    image: '/images/inicio_general/PORTADA IMAGEN BUENA.png',
    bgMusic: '/audio/Layton1.mp3',
    choices: [
      {
        id: 'start_game',
        text: 'Comenzar Investigación 🕵️‍♂️',
        targetNodeId: 'pedir_nickname',
      },
    ],
  },

  pedir_nickname: {
    id: 'pedir_nickname',
    title: 'Registro de Detective',
    description: 'Antes de comenzar la investigación, dinos cómo te gustaría que te llamemos.',
    image: '/images/inicio_general/PORTADA IMAGEN BUENA.png',
    bgMusic: '/audio/Layton1.mp3',
    type: 'input',
    inputConfig: {
      label: 'Tu Nickname:',
      placeholder: 'Ej. Sherlock, PythonMaster...',
      defaultValue: 'Detective',
      onSubmit: (value) => ({
        nextNodeId: 'pedir_chica',
        statePatch: { playerName: value.trim() || 'Detective' },
      }),
    },
    choices: [],
  },

  pedir_chica: {
    id: 'pedir_chica',
    title: 'Protagonista Femenina',
    description: 'Asigna un nombre a la intrépida investigadora del equipo.',
    image: '/images/personajes/chica.png',
    bgMusic: '/audio/Layton1.mp3',
    type: 'input',
    inputConfig: {
      label: 'Nombre de la chica:',
      placeholder: 'Ej. Elena, Sara, Lucía...',
      defaultValue: 'Elena',
      onSubmit: (value) => ({
        nextNodeId: 'pedir_chico',
        statePatch: { femaleName: value.trim() || 'Elena' },
      }),
    },
    choices: [],
  },

  pedir_chico: {
    id: 'pedir_chico',
    title: 'Protagonista Masculino',
    description: 'Asigna un nombre al ingenioso compañero de aventuras.',
    image: '/images/personajes/chico.png',
    bgMusic: '/audio/Layton1.mp3',
    type: 'input',
    inputConfig: {
      label: 'Nombre del chico:',
      placeholder: 'Ej. Marcos, David, Alex...',
      defaultValue: 'Marcos',
      onSubmit: (value) => ({
        nextNodeId: 'papel_suelo',
        statePatch: { maleName: value.trim() || 'Marcos' },
      }),
    },
    choices: [],
  },

  papel_suelo: {
    id: 'papel_suelo',
    title: 'Una hoja en el suelo',
    description: (state) =>
      `Un día cualquiera, ${state.maleName} y ${state.femaleName} estaban dando una vuelta por la ciudad y se encontraron un extraño papel en el suelo...`,
    image: '/images/inicio_del_juego/imagen_perso_papel_fondo.png',
    choices: [
      {
        id: 'inspect_paper',
        text: 'Examinar el papel de cerca 📜',
        targetNodeId: 'mirando_papel',
      },
    ],
  },

  mirando_papel: {
    id: 'mirando_papel',
    title: 'Mirando el papel',
    description:
      'El papel contenía unos extraños jeroglíficos en un idioma desconocido. Ambos han tenido siempre un carácter muy aventurero y jugaban a los detectives, por lo que su curiosidad se disparó.',
    image: '/images/inicio_del_juego/papel_jeroglificos.png',
    soundEffect: '/audio/Jeroglificos.mp3',
    choices: [
      {
        id: 'continue_night',
        text: 'Volver a casa a investigar 🌙',
        targetNodeId: 'cama_conversacion',
      },
    ],
  },

  cama_conversacion: {
    id: 'cama_conversacion',
    title: 'Conversación nocturna',
    description: (state) =>
      `Esa misma noche, ${state.maleName} y ${state.femaleName} estuvieron horas hablando a través de sus móviles. Ambos confesaron haber escuchado ruidos en las profundidades de la ciudad... ¡Y así comienza el misterio!`,
    image: '/images/inicio_del_juego/conver_cama.png',
    choices: [
      {
        id: 'enter_city',
        text: 'Salir a explorar la ciudad al amanecer 🏙️',
        targetNodeId: 'ciudad_hub',
      },
    ],
  },

  ciudad_hub: {
    id: 'ciudad_hub',
    title: 'La Ciudad',
    description: 'Te encuentras en el cruce principal de la ciudad. ¿Hacia dónde quieres dirigirte?',
    image: '/images/escena_principal_(ciudad)/ciudad_juego.png',
    bgMusic: '/audio/Ciudad.mp3',
    choices: [
      {
        id: 'go_plaza',
        text: '1. Ir a la Plaza Central ⛲',
        targetNodeId: 'plaza_central',
      },
      {
        id: 'go_mercado',
        text: '2. Ir al Mercado Mayorista 🍎',
        targetNodeId: 'mercado_mayorista',
      },
      {
        id: 'go_barrio',
        text: '3. Ir al Barrio Antiguo 🏛️',
        targetNodeId: 'barrio_antiguo',
      },
      {
        id: 'go_alameda',
        text: '4. Ir a la Alameda Aullante 🌲',
        targetNodeId: 'alameda_aullante',
      },
      {
        id: 'go_estacion',
        text: '5. Ir a la Estación Central 🚂',
        targetNodeId: 'estacion_central',
      },
    ],
  },

  plaza_central: {
    id: 'plaza_central',
    title: 'Plaza Central',
    description: 'La plaza central está tranquila, pero una alcantarilla emite un sonido sospechoso.',
    image: '/images/plaza_central/plaza_central.png',
    bgMusic: '/audio/Ciudad.mp3',
    choices: [
      {
        id: 'talk_old_man',
        text: 'Hablar con el señor misterioso 👴',
        targetNodeId: 'senor_misterioso',
      },
      {
        id: 'inspect_sewer',
        text: 'Observar la alcantarilla 🕳️',
        targetNodeId: 'alcantarilla_escena',
      },
      {
        id: 'back_city_from_plaza',
        text: 'Volver a la vista general de la ciudad 🏙️',
        targetNodeId: 'ciudad_hub',
      },
    ],
  },

  senor_misterioso: {
    id: 'senor_misterioso',
    title: 'Señor Misterioso',
    description: (state) =>
      !state.talkedToOldMan
        ? '«Se cuenta que hace muchos años aquí había una civilización escondida... A veces se escuchan ruidos en la alcantarilla. Probad suerte en el mercado.»'
        : '«No tengo nada nuevo que decir, hijos míos. ¡Mucha suerte en vuestro viaje!»',
    image: '/images/plaza_central/EscenaHablandoconSeñorFuera.png',
    soundEffect: '/audio/HablandoConSeñor.mp3',
    choices: [
      {
        id: 'leave_old_man',
        text: 'Despedirse y volver a la plaza',
        targetNodeId: 'plaza_central',
        action: () => ({ talkedToOldMan: true }),
      },
    ],
  },

  alcantarilla_escena: {
    id: 'alcantarilla_escena',
    title: 'La Alcantarilla',
    description: 'Una rejilla de hierro oxidado cubre la entrada. Se percibe una corriente de aire frío que sube desde el abismo.',
    image: '/images/plaza_central/Observando_alcantarilla_mercado_central.jpg',
    choices: [
      {
        id: 'look_inside',
        text: 'Asomarse a la oscuridad',
        targetNodeId: 'alcantarilla_interior',
      },
      {
        id: 'back_plaza_from_sewer',
        text: 'Regresar a la plaza',
        targetNodeId: 'plaza_central',
      },
    ],
  },

  alcantarilla_interior: {
    id: 'alcantarilla_interior',
    title: 'Dentro de la Alcantarilla',
    description: 'Tuberías gigantescas recorren el subsuelo. Se escuchan murmullos y un eco metálico a lo lejos.',
    image: '/images/plaza_central/alcantarilla_principio.png',
    soundEffect: '/audio/AguaCallendo.mp3',
    choices: [
      {
        id: 'subir_plaza',
        text: 'Subir de nuevo a la superficie',
        targetNodeId: 'plaza_central',
      },
    ],
  },

  alameda_aullante: {
    id: 'alameda_aullante',
    title: 'Alameda Aullante',
    description: 'Un sendero boscoso y tenebroso en las afueras de la ciudad. El viento aúlla entre las copas de los árboles.',
    image: '/images/alameda_aullante/alameda_aullante.png',
    bgMusic: '/audio/Buho.mp3',
    choices: [
      {
        id: 'buscar_arbol',
        text: 'Buscar tras el árbol retorcido 🌳',
        targetNodeId: 'alameda_arbol',
      },
      {
        id: 'bifurcacion',
        text: 'Seguir el camino hacia la bifurcación 🔀',
        targetNodeId: 'alameda_bifurcacion',
      },
      {
        id: 'volver_ciudad_alameda',
        text: 'Regresar a la ciudad',
        targetNodeId: 'ciudad_hub',
      },
    ],
  },

  alameda_arbol: {
    id: 'alameda_arbol',
    title: 'Tras el Árbol',
    description: '¡Encuentras una llave antigua oculta entre las raíces! Parece que podría abrir alguna puerta o candado importante.',
    image: '/images/alameda_aullante/llave_arbol.png',
    choices: [
      {
        id: 'coger_llave',
        text: 'Recoger la llave y guardar en inventario 🗝️',
        targetNodeId: 'alameda_aullante',
        action: (state) => ({
          inventory: [...state.inventory, { id: 'llave_antigua', name: 'Llave Antigua', description: 'Una llave de bronce encontrada en la Alameda Aullante.' }],
        }),
      },
    ],
  },

  alameda_bifurcacion: {
    id: 'alameda_bifurcacion',
    title: 'Bifurcación de senderos',
    description: 'El camino se divide en dos: uno desciende hacia la izquierda entre la niebla y el otro sube hacia la derecha hacia las colinas.',
    image: '/images/alameda_aullante/bifurcacion_camino.png',
    bgMusic: '/audio/Buho.mp3',
    choices: [
      {
        id: 'camino_izq',
        text: 'Tomar camino izquierdo',
        targetNodeId: 'alameda_izq',
      },
      {
        id: 'camino_der',
        text: 'Tomar camino derecho',
        targetNodeId: 'alameda_der',
      },
      {
        id: 'volver_alameda',
        text: 'Volver atrás',
        targetNodeId: 'alameda_aullante',
      },
    ],
  },

  alameda_izq: {
    id: 'alameda_izq',
    title: 'Camino Izquierdo',
    description: 'La vegetación se vuelve muy densa. Parece el camino hacia la vieja central.',
    image: '/images/alameda_aullante/buscando_detras.png',
    choices: [
      {
        id: 'ir_central_desde_alameda',
        text: 'Continuar hacia la Central Nuclear ☢️',
        targetNodeId: 'central_nuclear',
      },
      {
        id: 'volver_bifurcacion',
        text: 'Regresar a la bifurcación',
        targetNodeId: 'alameda_bifurcacion',
      },
    ],
  },

  alameda_der: {
    id: 'alameda_der',
    title: 'Camino Derecho',
    description: 'Un sendero rocoso que conduce a una puerta misteriosa con una cerradura.',
    image: '/images/alameda_aullante/camino_derecha.png',
    choices: [
      {
        id: 'puerta_llave',
        text: 'Examinar la puerta con cerradura 🔒',
        targetNodeId: 'alameda_puerta',
      },
      {
        id: 'volver_bifurcacion_2',
        text: 'Regresar a la bifurcación',
        targetNodeId: 'alameda_bifurcacion',
      },
    ],
  },

  alameda_puerta: {
    id: 'alameda_puerta',
    title: 'Puerta Bloqueada',
    description: 'Una pesada puerta metálica con runas extrañas.',
    image: '/images/alameda_aullante/entrada_llave.png',
    choices: [
      {
        id: 'usar_llave',
        text: 'Abrir con la Llave Antigua 🗝️',
        targetNodeId: 'central_nuclear',
        condition: (state) => state.inventory.some((i) => i.id === 'llave_antigua'),
        disabledReason: 'Necesitas una llave para abrir esta puerta.',
      },
      {
        id: 'volver_der',
        text: 'Volver al sendero',
        targetNodeId: 'alameda_der',
      },
    ],
  },

  mercado_mayorista: {
    id: 'mercado_mayorista',
    title: 'Mercado Mayorista',
    description: 'El bullicio de los comerciantes llena el ambiente. Aquí se pueden conseguir pistas, mercancías y acceder a la tienda bazar.',
    image: '/images/mercado_mayorista/mercado_mayorista.png',
    bgMusic: '/audio/MercadoMayoristaAudio.mp3',
    choices: [
      {
        id: 'ir_tienda',
        text: '1. Entrar en la Tienda / Bazar 🏪',
        targetNodeId: 'tienda_bazar',
      },
      {
        id: 'volver_ciudad_mercado',
        text: '2. Volver a la Ciudad 🏙️',
        targetNodeId: 'ciudad_hub',
      },
    ],
  },

  tienda_bazar: {
    id: 'tienda_bazar',
    title: 'Tienda del Mercado',
    description: 'El dependiente te observa con mirada inquisitiva mientras coloca piezas exóticas en las estanterías.',
    image: '/images/Zona_tienda_bazar/dependiente_mercado.png',
    soundEffect: '/audio/TiendaCampanas.mp3',
    choices: [
      {
        id: 'hablar_dependiente',
        text: 'Hablar con el dependiente',
        targetNodeId: 'dependiente_dialogo',
      },
      {
        id: 'colarse_trastienda',
        text: 'Intentar colarse en la puerta trasera 🚪',
        targetNodeId: 'trastienda_puerta',
      },
      {
        id: 'salir_mercado',
        text: 'Salir al mercado',
        targetNodeId: 'mercado_mayorista',
      },
    ],
  },

  dependiente_dialogo: {
    id: 'dependiente_dialogo',
    title: 'El Dependiente',
    description: '«Tengo información valiosa sobre los jeroglíficos, pero nada en esta vida es gratis... Si me conseguís 10 monedas, os diré lo que sé.»',
    image: '/images/Zona_tienda_bazar/dependiente_mercado.png',
    choices: [
      {
        id: 'volver_tienda',
        text: 'Entendido, volveré cuando las tenga',
        targetNodeId: 'tienda_bazar',
      },
    ],
  },

  trastienda_puerta: {
    id: 'trastienda_puerta',
    title: 'Puerta Trasera de la Tienda',
    description: 'Llegas a un callejón discreto detrás de la tienda donde hay una caja fuerte con una combinación numérica.',
    image: '/images/Zona_tienda_bazar/puerta_atras_tienda.png',
    choices: [
      {
        id: 'caja_fuerte',
        text: 'Examinar la caja fuerte (Acertijo Fibonacci) 🔢',
        targetNodeId: 'acertijo_fibonacci',
      },
      {
        id: 'volver_tienda_desde_atras',
        text: 'Regresar a la tienda',
        targetNodeId: 'tienda_bazar',
      },
    ],
  },

  acertijo_fibonacci: {
    id: 'acertijo_fibonacci',
    title: 'Acertijo de Fibonacci',
    description: 'La caja fuerte muestra la serie: [ 1, 1, 2, 3, 5, 8, 13, ? ]. Introduce el siguiente número para abrir el mecanismo:',
    image: '/images/Acertijo/Despensa chino caja feurte.png',
    soundEffect: '/audio/Acertijo.mp3',
    type: 'input',
    inputConfig: {
      label: 'Código numérico:',
      placeholder: 'Escribe el número...',
      onSubmit: (value) => {
        if (value.trim() === '21') {
          return {
            nextNodeId: 'caja_abierta_exito',
            statePatch: { money: 20, parchment1: true },
          };
        }
        return {
          nextNodeId: 'acertijo_fibonacci_fallo',
        };
      },
    },
    choices: [
      {
        id: 'rendirse_fibonacci',
        text: 'Rendirse y volver atrás',
        targetNodeId: 'trastienda_puerta',
      },
    ],
  },

  acertijo_fibonacci_fallo: {
    id: 'acertijo_fibonacci_fallo',
    title: 'Código Incorrecto',
    description: 'El mecanismo emite un chasquido metálico y una luz roja parpadea. El número introducido no es correcto.',
    image: '/images/Acertijo/Despensa chino caja feurte.png',
    choices: [
      {
        id: 'reintentar_fibo',
        text: 'Volver a intentarlo 🔄',
        targetNodeId: 'acertijo_fibonacci',
      },
      {
        id: 'salir_fibo',
        text: 'Regresar a la tienda',
        targetNodeId: 'tienda_bazar',
      },
    ],
  },

  caja_abierta_exito: {
    id: 'caja_abierta_exito',
    title: '¡Caja Abierta!',
    description: '¡El mecanismo cede! En el interior encuentras 20 monedas relucientes y el primer fragmento de pergamino con runas subterráneas.',
    image: '/images/Acertijo/cofre_abierto.png',
    soundEffect: '/audio/AudioVictoria.mp3',
    choices: [
      {
        id: 'coger_recompensa',
        text: 'Recoger las 20 monedas y el pergamino 💰',
        targetNodeId: 'tienda_bazar',
      },
    ],
  },

  barrio_antiguo: {
    id: 'barrio_antiguo',
    title: 'Barrio Antiguo',
    description: 'Calles empedradas y edificios señoriales. Aquí se encuentra la gran biblioteca de la ciudad.',
    image: '/images/barrio_antiguo/Libreria.png',
    bgMusic: '/audio/Layton2.mp3',
    choices: [
      {
        id: 'entrar_biblioteca',
        text: 'Entrar en la Gran Biblioteca 📚',
        targetNodeId: 'biblioteca_interior',
      },
      {
        id: 'callejon_antiguo',
        text: 'Explorar el callejón oscuro 🐾',
        targetNodeId: 'callejon_biblioteca',
      },
      {
        id: 'volver_ciudad_barrio',
        text: 'Volver al centro de la ciudad',
        targetNodeId: 'ciudad_hub',
      },
    ],
  },

  biblioteca_interior: {
    id: 'biblioteca_interior',
    title: 'La Gran Biblioteca',
    description: 'Estanterías repletas de tomos antiguos alcanzan el techo abovedado. El bibliotecario está revisando manuscritos.',
    image: '/images/Libreria/libreria_grande.png',
    bgMusic: '/audio/Layton2.mp3',
    choices: [
      {
        id: 'hablar_bibliotecario',
        text: 'Hablar con el Bibliotecario 📖',
        targetNodeId: 'bibliotecario_charla',
      },
      {
        id: 'salir_biblioteca',
        text: 'Salir al barrio antiguo',
        targetNodeId: 'barrio_antiguo',
      },
    ],
  },

  bibliotecario_charla: {
    id: 'bibliotecario_charla',
    title: 'El Sabio Bibliotecario',
    description: '«Los jeroglíficos que me mostráis provienen de una orden subterránea de ingenieros y alquimistas... Para descifrar el siguiente acertijo debéis consultar el mapa de la central y cruzar el río.»',
    image: '/images/Libreria/hablando_bibliotecario.png',
    soundEffect: '/audio/PasandoPaginaDeLibro.mp3',
    choices: [
      {
        id: 'volver_libreria',
        text: 'Agradecer y continuar la búsqueda',
        targetNodeId: 'biblioteca_interior',
        action: () => ({ parchment2: true }),
      },
    ],
  },

  callejon_biblioteca: {
    id: 'callejon_biblioteca',
    title: 'Callejón de la Biblioteca',
    description: 'Un pasaje estrecho y silencioso bañado por la luz tenue de los faroles.',
    image: '/images/barrio_antiguo/biblioteca_callejon.png',
    choices: [
      {
        id: 'volver_barrio',
        text: 'Regresar a la calle principal',
        targetNodeId: 'barrio_antiguo',
      },
    ],
  },

  estacion_central: {
    id: 'estacion_central',
    title: 'Estación Central de Trenes',
    description: 'Locomotoras de vapor y andenes concurridos. Hay un billete disponible por 10 monedas para acceder a la zona restringida de la Central Nuclear.',
    image: '/images/estacion_central/estacion_central.png',
    bgMusic: '/audio/Reloj.mp3',
    choices: [
      {
        id: 'comprar_billete',
        text: 'Comprar billete a la Central Nuclear (10 monedas) 🎫',
        targetNodeId: 'central_nuclear',
        condition: (state) => state.money >= 10,
        disabledReason: 'Necesitas al menos 10 monedas para comprar el billete.',
        action: (state) => ({ money: state.money - 10 }),
      },
      {
        id: 'volver_ciudad_estacion',
        text: 'Volver a la ciudad 🏙️',
        targetNodeId: 'ciudad_hub',
      },
    ],
  },

  central_nuclear: {
    id: 'central_nuclear',
    title: 'Central Nuclear',
    description: 'Instalaciones secretas con guardias de seguridad. Al fondo se divisa la entrada a la Ciudad Subterránea.',
    image: '/images/central_nuclear/ciudad_aliens.png',
    bgMusic: '/audio/Fantasia.mp3',
    choices: [
      {
        id: 'hablar_guardia',
        text: 'Conversar con el guardia de seguridad 👮',
        targetNodeId: 'guardia_central',
      },
      {
        id: 'alcantarilla_nuclear',
        text: 'Descender a la alcantarilla secreta ☢️',
        targetNodeId: 'alcantarilla_final',
      },
      {
        id: 'volver_estacion',
        text: 'Regresar a la estación',
        targetNodeId: 'estacion_central',
      },
    ],
  },

  guardia_central: {
    id: 'guardia_central',
    title: 'Guardia de Seguridad',
    description: '«Alto ahí. Esta zona está restringida. Si buscáis la verdad, deberéis descender a la red subterránea... pero pocos han regresado para contarlo.»',
    image: '/images/central_nuclear/conversacion_guardia.png',
    choices: [
      {
        id: 'volver_central',
        text: 'Retroceder con cautela',
        targetNodeId: 'central_nuclear',
      },
    ],
  },

  alcantarilla_final: {
    id: 'alcantarilla_final',
    title: 'La Ciudad Subterránea',
    description: (state) =>
      `¡Has llegado al corazón del misterio, ${state.playerName}! Ante ti se extiende una inmensa ciudadela subterránea iluminada por cristales bioluminiscentes. El Profesor Python y sus detectives han resuelto el enigma de la alcantarilla.`,
    image: '/images/central_nuclear/alcantarilla_abierta_nuclear.png',
    soundEffect: '/audio/AudioVictoria.mp3',
    choices: [
      {
        id: 'reiniciar_partida',
        text: '🎉 ¡Enhorabuena! Jugar de nuevo',
        targetNodeId: 'portada',
        action: () => ({ ...INITIAL_GAME_STATE }),
      },
    ],
  },
};
