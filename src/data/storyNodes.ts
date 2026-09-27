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
  solvedRiver: false,
  inventory: [],
  currentNodeId: 'intro_video',
  visitedNodes: ['intro_video'],
  audioMuted: false,
};

export const STORY_NODES: Record<string, StoryNode> = {
  intro_video: {
    id: 'intro_video',
    title: 'Comienzo de la historia',
    location: 'Ciudad de las Sombras',
    description: 'En una apacible y señorial ciudad, envuelta en la niebla del atardecer, de la nada ocurrió lo inesperado...',
    image: '/images/inicio_del_juego/VideoEntrada.gif',
    bgMusic: '/audio/AudioVideo.mp3',
    soundEffect: '/audio/AudioVideo.mp3',
    type: 'cutscene',
    autoAdvanceMs: 14000,
    nextAutoNodeId: 'portada',
    choices: [
      {
        id: 'skip_intro',
        text: 'Saltar prólogo visual ⏩',
        targetNodeId: 'portada',
      },
    ],
  },

  portada: {
    id: 'portada',
    title: 'El Profesor Python y El Misterio de la Alcantarilla',
    location: 'Calle Principal',
    description: 'Una investigación deductiva inspirada en los grandes enigmas de la época victoriana. Prepárate para agudizar tu ingenio y descubrir qué secretos aguardan en las profundidades del subsuelo.',
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
    title: 'Registro del Cuaderno de Campo',
    location: 'Despacho de Detectives',
    description: 'Todo buen investigador debe firmar en el registro antes de abrir un nuevo expediente. ¿Cómo se te conoce en los círculos detectivescos?',
    image: '/images/inicio_general/PORTADA IMAGEN BUENA.png',
    bgMusic: '/audio/Layton1.mp3',
    type: 'input',
    inputConfig: {
      label: 'Firma / Nickname del Jugador:',
      placeholder: 'Ej. Profesor Layton, Sherlock, PythonMaster...',
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
    title: 'Investigadora Principal',
    location: 'Expediente del Caso',
    speaker: {
      name: 'Compañera',
      avatar: '/images/personajes/chica.png',
      role: 'Especialista en Historia y Alquimia',
    },
    description: 'La intrépida estudiante y analista del equipo. Destaca por su agudeza visual y conocimientos históricos.',
    image: '/images/personajes/chica.png',
    bgMusic: '/audio/Layton1.mp3',
    type: 'input',
    inputConfig: {
      label: 'Nombre de la investigadora:',
      placeholder: 'Ej. Elena, Flora, Maya...',
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
    title: 'Compañero Detective',
    location: 'Expediente del Caso',
    speaker: {
      name: 'Compañero',
      avatar: '/images/personajes/chico.png',
      role: 'Aprendiz de Lógica y Mecánica',
    },
    description: 'El incansable ayudante del Profesor, siempre listo con su bloc de notas y su espíritu aventurero.',
    image: '/images/personajes/chico.png',
    bgMusic: '/audio/Layton1.mp3',
    type: 'input',
    inputConfig: {
      label: 'Nombre del compañero:',
      placeholder: 'Ej. Marcos, Luke, John...',
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
    title: 'Un hallazgo inesperado',
    location: 'Avenida de adoquines',
    description: (state) =>
      `Un día cualquiera, ${state.maleName} y ${state.femaleName} paseaban tranquilamente conversando sobre los extraños rumores que circulaban en la ciudad. De repente, una ráfaga de viento hizo rodar un misterioso pergamino arrugado a sus pies...`,
    image: '/images/inicio_del_juego/imagen_perso_papel_fondo.png',
    bgMusic: '/audio/Layton1.mp3',
    soundEffect: '/audio/Papel.mp3',
    choices: [
      {
        id: 'inspect_paper',
        text: 'Desplegar y examinar el pergamino 📜',
        targetNodeId: 'mirando_papel',
      },
    ],
  },

  mirando_papel: {
    id: 'mirando_papel',
    title: 'Jeroglíficos Ancestrales',
    location: 'Bajo el farol de gas',
    description:
      'El papel contiene una serie de signos crípticos y símbolos geométricos grabados en tinta sepia. Su caligrafía no pertenece a ninguna lengua moderna, pero el emblema de una rueda dentada y una espiral delata su relación con el sistema de cloacas.',
    image: '/images/inicio_del_juego/papel_jeroglificos.png',
    soundEffect: '/audio/Jeroglificos.mp3',
    choices: [
      {
        id: 'continue_night',
        text: 'Guardar el pergamino y reunirse al caer la noche 🌙',
        targetNodeId: 'cama_conversacion',
        action: (state) => ({
          inventory: state.inventory.some((i) => i.id === 'pergamino_intro')
            ? state.inventory
            : [
                ...state.inventory,
                {
                  id: 'pergamino_intro',
                  name: 'Hoja con Jeroglíficos',
                  description: 'Un pergamino hallado en el pavimento con símbolos de la orden subterránea.',
                  icon: '📜',
                },
              ],
        }),
      },
    ],
  },

  cama_conversacion: {
    id: 'cama_conversacion',
    title: 'Reflexiones Nocturnas',
    location: 'Aposentos de los Detectives',
    speaker: {
      name: 'Compañeros',
      avatar: '/images/inicio_del_juego/conver_cama.png',
      role: 'Intercambio de Deducciones',
    },
    description: (state) =>
      `Esa noche, ${state.maleName} y ${state.femaleName} se mantuvieron en vela comunicándose y cotejando mapas antiguos. Ambos confesaron haber sentido vibraciones y ecos metálicos provenientes de las alcantarillas de la Plaza Central... ¡El caso ha comenzado!`,
    image: '/images/inicio_del_juego/conver_cama.png',
    soundEffect: '/audio/Reloj.mp3',
    choices: [
      {
        id: 'enter_city',
        text: 'Salir al centro urbano con las primeras luces del alba 🏙️',
        targetNodeId: 'ciudad_hub',
      },
    ],
  },

  ciudad_hub: {
    id: 'ciudad_hub',
    title: 'Encrucijada Metropolitana',
    location: 'Cruce de Cuatro Caminos',
    description: 'El reloj municipal marca las ocho en punto. La niebla se disipa y los tranvías comienzan a circular. ¿Qué distrito deseas investigar primero?',
    image: '/images/escena_principal_(ciudad)/ciudad_juego.png',
    bgMusic: '/audio/Ciudad.mp3',
    choices: [
      {
        id: 'go_plaza',
        text: '1. Plaza Central (Ruidos y transeúntes) ⛲',
        targetNodeId: 'plaza_central',
      },
      {
        id: 'go_mercado',
        text: '2. Mercado Mayorista y Tienda / Bazar 🍎',
        targetNodeId: 'mercado_mayorista',
      },
      {
        id: 'go_barrio',
        text: '3. Barrio Antiguo y Gran Biblioteca 🏛️',
        targetNodeId: 'barrio_antiguo',
      },
      {
        id: 'go_alameda',
        text: '4. Alameda Aullante (Bosque perimetral) 🌲',
        targetNodeId: 'alameda_aullante',
      },
      {
        id: 'go_estacion',
        text: '5. Estación Central de Ferrocarril 🚂',
        targetNodeId: 'estacion_central',
      },
    ],
  },

  plaza_central: {
    id: 'plaza_central',
    title: 'Plaza Central',
    location: 'Plaza Mayor de la Villa',
    description: 'En el corazón empedrado de la plaza, el goteo de la fuente de piedra compite con un extraño borboteo que emana de una pesada alcantarilla de hierro fundido.',
    image: '/images/plaza_central/plaza_central.png',
    bgMusic: '/audio/Ciudad.mp3',
    choices: [
      {
        id: 'talk_old_man',
        text: 'Interrogar al anciano misterioso del banco 👴',
        targetNodeId: 'senor_misterioso',
      },
      {
        id: 'inspect_sewer',
        text: 'Examinar detenidamente la tapa de la alcantarilla 🕳️',
        targetNodeId: 'alcantarilla_escena',
      },
      {
        id: 'back_city_from_plaza',
        text: 'Regresar a la encrucijada metropolitana 🏙️',
        targetNodeId: 'ciudad_hub',
      },
    ],
  },

  senor_misterioso: {
    id: 'senor_misterioso',
    title: 'El Anciano Testigo',
    location: 'Banco de madera en la Plaza',
    speaker: {
      name: 'Caballero Desconocido',
      avatar: '/images/plaza_central/EscenaHablandoconSeñorFuera.png',
      role: 'Residente Vetusto',
    },
    description: (state) =>
      !state.talkedToOldMan
        ? '«Ah... vosotros sois los jóvenes que van buscando respuestas. Se cuenta que hace más de un siglo existió una ciudadela oculta bajo nuestros pies. Las tuberías no transportan solo agua... He visto al comerciante del bazar guardar secretos en su trastienda. Probad suerte allí.»'
        : '«Poco más os puedo revelar, audaces muchachos. Seguid el rastro de los pergaminos y no os fieis de los guardias de la vieja central.»',
    image: '/images/plaza_central/EscenaHablandoconSeñorFuera.png',
    soundEffect: '/audio/HablandoConSeñor.mp3',
    choices: [
      {
        id: 'leave_old_man',
        text: 'Anotar su testimonio en el Cuaderno y despedirse',
        targetNodeId: 'plaza_central',
        action: () => ({ talkedToOldMan: true }),
      },
    ],
  },

  alcantarilla_escena: {
    id: 'alcantarilla_escena',
    title: 'La Rejilla Subterránea',
    location: 'Rejilla Central',
    description: 'Te agachas y aplicas el oído. Por los respiraderos sube un olor a humedad y un zumbido eléctrico que no encaja con una cloaca ordinaria. ¡Hay maquinaria funcionando abajo!',
    image: '/images/plaza_central/Observando_alcantarilla_mercado_central.jpg',
    soundEffect: '/audio/AguaCallendo.mp3',
    choices: [
      {
        id: 'look_inside',
        text: 'Mirar a través de los barrotes con la linterna 🔦',
        targetNodeId: 'alcantarilla_interior',
      },
      {
        id: 'back_plaza_from_sewer',
        text: 'Incorporarse y volver a la plaza',
        targetNodeId: 'plaza_central',
      },
    ],
  },

  alcantarilla_interior: {
    id: 'alcantarilla_interior',
    title: 'Visión de las Tuberías Maestras',
    location: 'Profundidades de la Plaza',
    description: 'Enormes conductos presurizados de bronce y válvulas con manómetros cruzan el abismo. El acceso principal desde aquí requiere una clave y autorizaciones de la Central Nuclear.',
    image: '/images/plaza_central/alcantarilla_principio.png',
    soundEffect: '/audio/AguaCallendo.mp3',
    choices: [
      {
        id: 'subir_plaza',
        text: 'Volver a la superficie de la plaza',
        targetNodeId: 'plaza_central',
      },
    ],
  },

  alameda_aullante: {
    id: 'alameda_aullante',
    title: 'La Alameda Aullante',
    location: 'Bosque de Robles Centenarios',
    description: 'Un sendero sombrío flanqueado por árboles centenarios retorcidos. El viento silba entre las ramas como si advirtiera a los intrusos que no perturben la calma del bosque.',
    image: '/images/alameda_aullante/alameda_aullante.png',
    bgMusic: '/audio/Buho.mp3',
    choices: [
      {
        id: 'buscar_arbol',
        text: 'Inspeccionar el tronco hueco del roble colosal 🌳',
        targetNodeId: 'alameda_arbol',
      },
      {
        id: 'bifurcacion',
        text: 'Avanzar con sigilo hacia la bifurcación de sendas 🔀',
        targetNodeId: 'alameda_bifurcacion',
      },
      {
        id: 'volver_ciudad_alameda',
        text: 'Regresar a la civilización 🏙️',
        targetNodeId: 'ciudad_hub',
      },
    ],
  },

  alameda_arbol: {
    id: 'alameda_arbol',
    title: 'Secreto en la Raíz',
    location: 'Hueco del Roble',
    description: 'Entre las raíces húmedas y el musgo descubres un objeto envuelto en tela encerada: ¡una pesada llave antigua de bronce pulido!',
    image: '/images/alameda_aullante/llave_arbol.png',
    choices: [
      {
        id: 'coger_llave',
        text: 'Añadir la Llave Antigua a la mochila 🗝️',
        targetNodeId: 'alameda_aullante',
        action: (state) => ({
          inventory: state.inventory.some((i) => i.id === 'llave_antigua')
            ? state.inventory
            : [
                ...state.inventory,
                {
                  id: 'llave_antigua',
                  name: 'Llave Antigua de Bronce',
                  description: 'Una llave ornamentada encontrada en el roble de la Alameda Aullante.',
                  icon: '🗝️',
                },
              ],
        }),
      },
    ],
  },

  alameda_bifurcacion: {
    id: 'alameda_bifurcacion',
    title: 'Bifurcación de Caminos',
    location: 'Cruce del Bosque',
    description: 'La senda se bifurca: a la izquierda, el rumor de un caudaloso río corta el paso hacia la vieja Central; a la derecha, un sendero asciende hacia una verja enrejada.',
    image: '/images/alameda_aullante/bifurcacion_camino.png',
    bgMusic: '/audio/Buho.mp3',
    choices: [
      {
        id: 'camino_izq',
        text: 'Sendero izquierdo: El Cruce del Río Fluvial 🌊',
        targetNodeId: 'alameda_izq',
      },
      {
        id: 'camino_der',
        text: 'Sendero derecho: La Verja de Acceso 🔒',
        targetNodeId: 'alameda_der',
      },
      {
        id: 'volver_alameda',
        text: 'Volver a la entrada de la Alameda',
        targetNodeId: 'alameda_aullante',
      },
    ],
  },

  alameda_izq: {
    id: 'alameda_izq',
    title: 'La Orilla del Río Neblinoso',
    location: 'Paso del Río en el Bosque',
    description: 'Llegas a un muelle improvisado frente a un río turbulento. Para cruzarlo y llegar a las instalaciones traseras de la Central Nuclear, es necesario coordinar el paso de los exploradores con una balsa y una sola linterna.',
    image: '/images/alameda_aullante/buscando_detras.png',
    soundEffect: '/audio/Acertijo.mp3',
    choices: [
      {
        id: 'iniciar_acertijo_rio',
        text: 'Comenzar el Acertijo del Río (Minijuego) 🚣‍♂️',
        targetNodeId: 'acertijo_rio_bosque',
      },
      {
        id: 'volver_bifurcacion',
        text: 'Volver a la bifurcación',
        targetNodeId: 'alameda_bifurcacion',
      },
    ],
  },

  acertijo_rio_bosque: {
    id: 'acertijo_rio_bosque',
    title: 'Acertijo del Río en el Bosque',
    location: 'Embarcadero del Río',
    description: 'Cuatro exploradores (Ana, Bruno, Carla y Diego) deben cruzar a la otra orilla antes de que caiga la noche. Dispones de una única balsa para 2 personas y una sola linterna.',
    type: 'river_puzzle',
    image: '/images/alameda_aullante/buscando_detras.png',
    bgMusic: '/audio/Acertijo.mp3',
    choices: [
      {
        id: 'volver_orilla_atras',
        text: 'Abandonar el río por ahora',
        targetNodeId: 'alameda_bifurcacion',
      },
    ],
  },

  alameda_der: {
    id: 'alameda_der',
    title: 'Camino hacia la Verja',
    location: 'Colina de Piedra',
    description: 'Un sendero rocoso culmina frente a una imponente cancela de hierro que custodia el acceso perimetral.',
    image: '/images/alameda_aullante/camino_derecha.png',
    choices: [
      {
        id: 'puerta_llave',
        text: 'Examinar la cerradura de la cancela 🔒',
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
    title: 'La Cancela Bloqueada',
    location: 'Entrada Perimetral',
    description: 'El cerrojo es de estilo decimonónico con muescas en forma de trébol. Necesitas una llave a medida para abrirla sin activar la alarma.',
    image: '/images/alameda_aullante/entrada_llave.png',
    choices: [
      {
        id: 'usar_llave',
        text: 'Insertar la Llave Antigua de Bronce 🗝️',
        targetNodeId: 'central_nuclear',
        condition: (state) => state.inventory.some((i) => i.id === 'llave_antigua'),
        disabledReason: 'Necesitas encontrar la Llave Antigua en el roble para girar este mecanismo.',
      },
      {
        id: 'volver_der',
        text: 'Retroceder al camino de la colina',
        targetNodeId: 'alameda_der',
      },
    ],
  },

  mercado_mayorista: {
    id: 'mercado_mayorista',
    title: 'Mercado Mayorista',
    location: 'Lonja y Plaza de Abastos',
    description: 'El trajín de cajones de verdura, carruajes y gritos de mercaderes oculta transacciones clandestinas. Un letrero chirriante señala el Bazar de Antigüedades.',
    image: '/images/mercado_mayorista/mercado_mayorista.png',
    bgMusic: '/audio/MercadoMayoristaAudio.mp3',
    choices: [
      {
        id: 'ir_tienda',
        text: '1. Acercarse a la Tienda / Bazar 🏪',
        targetNodeId: 'tienda_bazar',
      },
      {
        id: 'volver_ciudad_mercado',
        text: '2. Volver a la Encrucijada Metropolitana 🏙️',
        targetNodeId: 'ciudad_hub',
      },
    ],
  },

  tienda_bazar: {
    id: 'tienda_bazar',
    title: 'El Bazar de Curiosidades',
    location: 'Interior del Bazar',
    speaker: {
      name: 'Tendero',
      avatar: '/images/Zona_tienda_bazar/dependiente_mercado.png',
      role: 'Comerciante de Reliquias',
    },
    description: 'El aire huele a té negro y polvo antiguo. El dependiente acomoda astrolabios y brújulas con una sonrisa enigmática mientras vigila de reojo una discreta puerta en la trasera.',
    image: '/images/Zona_tienda_bazar/dependiente_mercado.png',
    soundEffect: '/audio/TiendaCampanas.mp3',
    choices: [
      {
        id: 'hablar_dependiente',
        text: 'Interrogar al dependiente sobre los jeroglíficos',
        targetNodeId: 'dependiente_dialogo',
      },
      {
        id: 'colarse_trastienda',
        text: 'Escabullirse disimuladamente hacia la puerta trasera 🚪',
        targetNodeId: 'trastienda_puerta',
      },
      {
        id: 'salir_mercado',
        text: 'Salir al bullicio del mercado',
        targetNodeId: 'mercado_mayorista',
      },
    ],
  },

  dependiente_dialogo: {
    id: 'dependiente_dialogo',
    title: 'Trato Comercial',
    location: 'Mostrador del Bazar',
    speaker: {
      name: 'Tendero del Bazar',
      avatar: '/images/Zona_tienda_bazar/dependiente_mercado.png',
      role: 'Informante Clandestino',
    },
    description:
      '«Todo en esta ciudad tiene un precio, distinguidos investigadores... Si tenéis 10 monedas, os diré qué buscan los ingenieros en el tren de la Central. O quizás prefiráis probar suerte con la caja fuerte de mi trastienda... si es que vuestras matemáticas están a la altura.»',
    image: '/images/Zona_tienda_bazar/dependiente_mercado.png',
    soundEffect: '/audio/BazarHablando.mp3',
    choices: [
      {
        id: 'volver_tienda',
        text: 'Agradecer la información y volver a la tienda',
        targetNodeId: 'tienda_bazar',
      },
    ],
  },

  trastienda_puerta: {
    id: 'trastienda_puerta',
    title: 'La Trastienda Secreta',
    location: 'Almacén Posterior',
    description: 'Entre estanterías de cajas de madera protegidas por candados, descubres una formidable caja fuerte de acero reforzado incrustada en el muro de ladrillo.',
    image: '/images/Zona_tienda_bazar/puerta_atras_tienda.png',
    choices: [
      {
        id: 'caja_fuerte',
        text: 'Examinar el dial y el enigma matemático 🔢',
        targetNodeId: 'acertijo_fibonacci',
      },
      {
        id: 'volver_tienda_desde_atras',
        text: 'Volver a la sala principal del bazar',
        targetNodeId: 'tienda_bazar',
      },
    ],
  },

  acertijo_fibonacci: {
    id: 'acertijo_fibonacci',
    title: 'Acertijo: La Secuencia Prohibida',
    location: 'Caja Fuerte de la Trastienda',
    description:
      'Grabada en la placa de bronce sobre el dial se lee la siguiente sucesión numérica:\n\n« 1,  1,  2,  3,  5,  8,  13,  ? »\n\n¿Qué número completa la célebre secuencia del sabio italiano para desbloquear los cerrojos?',
    image: '/images/Acertijo/Despensa chino caja feurte.png',
    bgMusic: '/audio/BazarHablando.mp3',
    type: 'input',
    inputConfig: {
      label: 'Introduce la clave numérica:',
      placeholder: 'Escribe el número aquí...',
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
        text: 'Consultar notas y retroceder',
        targetNodeId: 'trastienda_puerta',
      },
    ],
  },

  acertijo_fibonacci_fallo: {
    id: 'acertijo_fibonacci_fallo',
    title: 'Mecanismo Bloqueado',
    location: 'Caja Fuerte',
    description: 'Un chasquido seco reverbera en el mecanismo. Las ruedas dentadas giran en vacío y los pestillos no ceden. Recuerda: cada término es la suma de los dos anteriores...',
    image: '/images/Acertijo/Despensa chino caja feurte.png',
    bgMusic: '/audio/BazarHablando.mp3',
    choices: [
      {
        id: 'reintentar_fibo',
        text: 'Volver a intentar introducir la clave 🔄',
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
    title: '¡Caja Fuerte Desbloqueada!',
    location: 'Interior de la Caja Fuerte',
    description: '¡Los engranajes se alinean a la perfección! La pesada puerta de acero se abre suavemente revelando 20 monedas de plata maciza y el Primer Pergamino Sagrado de la Ciudadela.',
    image: '/images/Acertijo/cofre_abierto.png',
    soundEffect: '/audio/Fantasia.mp3',
    bgMusic: '/audio/BazarHablando.mp3',
    choices: [
      {
        id: 'coger_recompensa',
        text: 'Guardar las 20 monedas y el Pergamino 1 en la mochila 💰',
        targetNodeId: 'tienda_bazar',
        action: (state) => ({
          money: 20,
          parchment1: true,
          inventory: state.inventory.some((i) => i.id === 'pergamino_1')
            ? state.inventory
            : [
                ...state.inventory,
                {
                  id: 'pergamino_1',
                  name: 'Pergamino de Fibonacci (1/3)',
                  description: 'Fragmento que revela los engranajes maestros de las compuertas subterráneas.',
                  icon: '📜',
                },
              ],
        }),
      },
    ],
  },

  barrio_antiguo: {
    id: 'barrio_antiguo',
    title: 'Barrio Antiguo',
    location: 'Distrito Histórico',
    description: 'Mansiones góticas y bibliotecas centenarias flanquean esta solemne calle adoquinada. Aquí descansa la Gran Biblioteca de manuscritos olvidados.',
    image: '/images/barrio_antiguo/Libreria.png',
    bgMusic: '/audio/Layton2.mp3',
    choices: [
      {
        id: 'entrar_biblioteca',
        text: 'Entrar en la Gran Biblioteca de la Ciudad 📚',
        targetNodeId: 'biblioteca_interior',
      },
      {
        id: 'callejon_antiguo',
        text: 'Inspeccionar el callejón de los faroles tenues 🐾',
        targetNodeId: 'callejon_biblioteca',
      },
      {
        id: 'volver_ciudad_barrio',
        text: 'Volver a la Encrucijada Metropolitana 🏙️',
        targetNodeId: 'ciudad_hub',
      },
    ],
  },

  biblioteca_interior: {
    id: 'biblioteca_interior',
    title: 'La Gran Biblioteca',
    location: 'Nave Central de Lectura',
    speaker: {
      name: 'Sabio Bibliotecario',
      avatar: '/images/Libreria/hablando_bibliotecario.png',
      role: 'Conservador de Códices',
    },
    description: 'Columnas de mármol y estanterías de nogal que llegan hasta la cúpula. El conservador atiende una pila de códices antiguos con una lupa de aumento.',
    image: '/images/Libreria/libreria_grande.png',
    bgMusic: '/audio/Layton2.mp3',
    choices: [
      {
        id: 'hablar_bibliotecario',
        text: 'Consultar al Conservador sobre los Jeroglíficos 📖',
        targetNodeId: 'bibliotecario_charla',
      },
      {
        id: 'salir_biblioteca',
        text: 'Salir al Barrio Antiguo',
        targetNodeId: 'barrio_antiguo',
      },
    ],
  },

  bibliotecario_charla: {
    id: 'bibliotecario_charla',
    title: 'La Sabiduría de los Libros',
    location: 'Escritorio del Conservador',
    speaker: {
      name: 'Sabio Bibliotecario',
      avatar: '/images/Libreria/hablando_bibliotecario.png',
      role: 'Maestro Epigrafista',
    },
    description:
      '«¡Por todos los cielos! Hacía décadas que no contemplaba este sello... Representa a los Alquimistas de la Red Subterránea. Construyeron una metrópolis secreta bajo las cloacas para proteger un generador de energía limpia. Tomad este Segundo Pergamino con el mapa de las corrientes. Os abrirá las puertas de la Central.»',
    image: '/images/Libreria/hablando_bibliotecario.png',
    soundEffect: '/audio/PasandoPaginaDeLibro.mp3',
    choices: [
      {
        id: 'volver_libreria',
        text: 'Agradecer el manuscrito y añadirlo al Cuaderno 📜',
        targetNodeId: 'biblioteca_interior',
        action: (state) => ({
          parchment2: true,
          inventory: state.inventory.some((i) => i.id === 'pergamino_2')
            ? state.inventory
            : [
                ...state.inventory,
                {
                  id: 'pergamino_2',
                  name: 'Pergamino Cartográfico (2/3)',
                  description: 'Mapa hidroeléctrico con las canalizaciones de la vieja orden.',
                  icon: '📜',
                },
              ],
        }),
      },
    ],
  },

  callejon_biblioteca: {
    id: 'callejon_biblioteca',
    title: 'Callejón de la Biblioteca',
    location: 'Pasaje de la Sombra',
    description: 'Un pasadizo sombreado entre muros de piedra. Un gato negro te observa desde una cornisa antes de perderse en la oscuridad.',
    image: '/images/barrio_antiguo/biblioteca_callejon.png',
    choices: [
      {
        id: 'volver_barrio',
        text: 'Regresar a la avenida del Barrio Antiguo',
        targetNodeId: 'barrio_antiguo',
      },
    ],
  },

  estacion_central: {
    id: 'estacion_central',
    title: 'Estación Central de Ferrocarril',
    location: 'Andén Principal',
    description: 'El silbato de las locomotoras de vapor resuena en la bóveda de cristal. En la taquilla militar se despachan billetes exclusivos hacia la zona restringida de la Central Nuclear por 10 monedas.',
    image: '/images/estacion_central/estacion_central.png',
    bgMusic: '/audio/Reloj.mp3',
    choices: [
      {
        id: 'comprar_billete',
        text: 'Comprar billete exprés a la Central Nuclear (10 monedas) 🎫',
        targetNodeId: 'central_nuclear',
        condition: (state) => state.money >= 10,
        disabledReason: 'Necesitas 10 monedas (consíguelas en la caja fuerte del bazar).',
        action: (state) => ({ money: state.money - 10 }),
      },
      {
        id: 'volver_ciudad_estacion',
        text: 'Volver a la Encrucijada Metropolitana 🏙️',
        targetNodeId: 'ciudad_hub',
      },
    ],
  },

  central_nuclear: {
    id: 'central_nuclear',
    title: 'Instalaciones de la Central',
    location: 'Perímetro de Seguridad',
    description: 'Estructuras industriales iluminadas por reflectores. El aire vibra con una frecuencia zumbante. Aquí se esconde el conducto de descenso hacia la Ciudad Subterránea.',
    image: '/images/central_nuclear/ciudad_aliens.png',
    bgMusic: '/audio/Fantasia.mp3',
    choices: [
      {
        id: 'hablar_guardia',
        text: 'Dialogar con el Capitán de la Guardia 👮',
        targetNodeId: 'guardia_central',
      },
      {
        id: 'alcantarilla_nuclear',
        text: 'Descender por la Alcantarilla Maestra ☢️',
        targetNodeId: 'alcantarilla_final',
      },
      {
        id: 'volver_estacion',
        text: 'Tomar el tren de regreso a la Estación Central',
        targetNodeId: 'estacion_central',
      },
    ],
  },

  guardia_central: {
    id: 'guardia_central',
    title: 'El Centinela de la Central',
    location: 'Puesto de Control',
    speaker: {
      name: 'Capitán de Seguridad',
      avatar: '/images/central_nuclear/conversacion_guardia.png',
      role: 'Centinela de la Orden',
    },
    description:
      '«Alto. Solo aquellos que hayan demostrado su ingenio reuniendo los pergaminos pueden descender a las alcantarillas de la Ciudad Subterránea. Si tenéis el valor necesario, adelante... pero preparaos para lo que vais a contemplar.»',
    image: '/images/central_nuclear/conversacion_guardia.png',
    choices: [
      {
        id: 'volver_central',
        text: 'Agradecer su autorización y regresar al recinto',
        targetNodeId: 'central_nuclear',
      },
    ],
  },

  alcantarilla_final: {
    id: 'alcantarilla_final',
    title: 'El Secreto Revelado: La Ciudad Subterránea',
    location: 'El Santuario de la Sabiduría',
    speaker: {
      name: 'El Profesor Python',
      avatar: '/images/inicio_general/PORTADA IMAGEN BUENA.png',
      role: 'Maestro Detective',
    },
    description: (state) =>
      `¡Enhorabuena, ${state.playerName}! ¡El caso está resuelto!\n\nAl descender por la compuerta final, se abre ante tus ojos una metrópolis subterránea resplandeciente, alimentada por energía limpia y protegida por la tecnología de los Alquimistas. ${state.femaleName} y ${state.maleName} contemplan asombrados la maravilla oculta bajo el asfalto.\n\nHas demostrado que con perspicacia, paciencia y lógica no hay misterio que se resista.`,
    image: '/images/central_nuclear/alcantarilla_abierta_nuclear.png',
    soundEffect: '/audio/AudioVictoria.mp3',
    choices: [
      {
        id: 'reiniciar_partida',
        text: '🎉 ¡Victoria Total! Volver a la Portada',
        targetNodeId: 'portada',
        action: () => ({ ...INITIAL_GAME_STATE }),
      },
    ],
  },
};
