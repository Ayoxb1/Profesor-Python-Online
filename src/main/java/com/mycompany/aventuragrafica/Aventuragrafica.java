package com.mycompany.aventuragrafica;

import modulos.*;

 // INDICE
//  Alejandro eres gay si lo lees 

// ===== VARIABLES GLOBALES ===== 7

// ===== MAIN ===== 18

// ===== INICIO GENERAL ===== 27

// ===== INICIO DEL JUEGO ===== 58

// ===== ESCENA PRINCIPAL (CIUDAD) ===== 118

// ===== PLAZA CENTRAL ===== 148

// ===== ALAMEDA AULLANTE ===== 215

// ===== CENTRAL NUCLEAR ===== 265

// ===== ESTACIÓN CENTRAL ===== 316

// ===== BARRIO ANTIGUO ===== 360 

// ===== MERCADO MAYORISTA ===== 407

// ===== ZONA TIENDA / BAZAR ===== 435

// ===== ACERTIJO 1 (SUCEC. FIBONACCI) ===== 526


public class Aventuragrafica {

    // ===== VARIABLES GLOBALES =====
    static int dinero;
    static boolean pergamino1 = false;
    static boolean pergamino2 = false;
    static boolean pergamino3 = false;
    static boolean hablarSeñor = false;
    static boolean colarseAtras = false;
    static boolean colarseTienda = false;
    static String nombreHombre;
    static String nombreMujer;
    static String nombreJug;

    // ===== MAIN =====
    public static void main(String[] args) {
        inicio();
        presentacionJuego();
        datosPersonajes();
        inicioJuego();
        FuncionesGraficas.warning("Fin del juego", "Has terminado el juego, enhorabuena " + nombreJug);
    }

    // ===== INICIO GENERAL =====
    static void inicio() {
        dinero = 0;
        pergamino1 = pergamino2 = pergamino3 = false;
        hablarSeñor = false;
        colarseAtras = false;
        colarseTienda = false;
        FuncionesGraficas.FotoMensajeSonidoAutomatica("Comienzo del juego","src/main/java/resources/Imagenes/inicio_del_juego/VideoEntrada.gif" ,"En una ciudad, de la nada ocurrio lo inesperado" , "src/main/java/resources/Sonidos/AudioVideo.wav", 15,1.1, 0, true);
                
        nombreJug = FuncionesGraficas.pedirDatos("Bienvenido",
                "¿Cuál es tu nickname?");
    }

   static void presentacionJuego() {
    Reproductor.reproducirBucle("src/main/java/resources/Sonidos/Layton1.mp3");

    FuncionesGraficas.FotoyMensaje(
            "Portada",
            "src/main/java/resources/imagenes/inicio_general/PORTADA IMAGEN BUENA.png",
            "El Profesor Python y El Misterio de la Alcantarilla",
            0.4,
            false
    );
}


   
static void datosPersonajes() {
    nombreMujer = FuncionesGraficas.FotoYPedirDatos(
            "Personaje 1",
            "src/main/java/resources/imagenes/personajes/chica.png",
            "Nombre de la chica:",
            1.0,
            false
    );

    nombreHombre = FuncionesGraficas.FotoYPedirDatos(
            "Personaje 2",
            "src/main/java/resources/imagenes/personajes/chico.png",
            "Nombre del chico:",
            1.0,
            false
    );
}


    // ===== INICIO DEL JUEGO =====
    static void inicioJuego() {
        escena_papel_suelo();
        escena_mirando_papel();
        escena_cama_conver();

        escenaPrincipal();
    }
                                                                                                       
    static void escena_papel_suelo() {
        FuncionesGraficas.FotoyMensaje(
                "Una hoja en el suel"
                        + "o",
                "src/main/java/resources/imagenes/inicio_del_juego/imagen_perso_papel_fondo.png",
                "Un dia cualquiera "+nombreHombre+" y "+nombreMujer+" estaban dando una vuelta por la ciudad y se encontraron un papel en el suelo...",
                0.5,
                false
        );
    }

    static void escena_mirando_papel() {
        Reproductor.reproducir("src/main/java/resources/Sonidos/Jeroglificos.mp3");
        FuncionesGraficas.FotoyMensaje(
                "Mirando el papel",
                "src/main/java/resources/imagenes/inicio_del_juego/papel_jeroglificos.png",
                "El papel contenía unos extraños jeroglificos en un idioma que no entendian y eso generó en\nnuestros protagonistas mucha intriga, ya que ambos desde siempre\nhan tenido un carácter muy aventurero y siempre han estado jugando a los detectives",
                0.5,
                false
        );
        Reproductor.parar();
    }


    static void escena_cama_conver() {
        FuncionesGraficas.FotoyMensaje(
                "Conversación",
                "src/main/java/resources/imagenes/inicio_del_juego/conver_cama.png",
                "Esa misma noche " +nombreHombre+" y " +nombreMujer+ " estuvieron horas y horas hablando del tema a través de sus dispositivos móviles\ny ambos se contaron cosas que hasta ese dia lo tenian guardado bajo llave.\nAmbos llevaban tiempo escuchando ruidos en las profundidades de la ciudad y sabian que cosas extrañas estaban pasando,\ny asi...\nCOMIENZA ESTA HISTORIA" ,
                0.5,
                false
        );
    }

    // ===== ESCENA PRINCIPAL (CIUDAD) =====
    static void escenaPrincipal() {

        String[] opciones = {
            "1. Ir a plaza central",
            "2. Ir a mercado mayorista",
            "3. Ir a barrio antiguo",
            "4. Ir a alameda aullante",
            "5. Ir a estación central",
            "6. Salir del Juego"
        };

        int eleccion = FuncionesGraficas.FotoMensajeMenu(
                "Ciudad",
                opciones,
                "src/main/java/resources/imagenes/escena_principa"
                        + "l_(ciudad)/ciudad_juego.png",
                "Te encuentras en la ciudad. ¿A dónde quieres ir?",
                0.4,
                false
        );

        switch (eleccion) {
            case 0:
                plazaCentral();
                break;
            case 1:
                mercadoMayorista();
                break;
            case 2:
                barrioAntiguo();
                break;
            case 3:
                alamedaAullante();
                break;
            case 4:
                estacionCentral();
                break;
            case 5:
                salirJuego();
                break;
            default:
                escenaPrincipal();
                break;
        }
    }

    // ===== PLAZA CENTRAL =====
   static void plazaCentral() {
Reproductor.reproducirBucle("src/main/java/resources/Sonidos/Ciudad.mp3");


    String[] opciones = {
        "1. Hablar con el señor",
        "2. Observar la alcantarilla",
        "3. Ir al barrio antiguo",
        "4. Ir a alameda aullante",
        "5. Ir a mercado mayorista",
        "6. Ir a estación central",
        "7. Salir del Juego"
    };

    int eleccion = FuncionesGraficas.FotoMensajeMenu(
        "Plaza Central",
        opciones,
        "src/main/java/resources/imagenes/plaza_central/plaza_central.png", 
        "La aventura comienza en la plaza central.\n¿Qué quieres hacer?",
        0.4,
        false
    );

    switch (eleccion) {
        case 0: { // Hablar con el señor HECHO
            if (!hablarSeñor) {
                FuncionesGraficas.FotoyMensaje(
                    "Señor misterioso",
                    "src/main/java/resources/imagenes/plaza_central/EscenaHablandoConSeñorfuera.png",
                    "Se conoce que hace muchos años aqui habia una civilizacion escondida de la cual no queda ni rastro o eso creemos\nYo soy un pobre señor mayor y no tengo idea sobre el tema, pero cuando yo era pequeño escuche una conversacion del antiguo dueño\n de la tienda que hablaba sobre unos documentos,a veces se escucha ruido aqui en una alcantarilla, probad suerte en el mercado",
                    0.4,
                    false
                );
                hablarSeñor = true;
            } else {
                FuncionesGraficas.FotoyMensaje(
                    "Señor",
                    "src/main/java/resources/imagenes/plaza_central/EscenaHablandoConSeñorfuera.png",
                    "No tengo nada nuevo que decir hijos mios,mucha suerte en vuestro viaje",
                    0.4,
                    false
                );
            } Reproductor.reproducir("src/main/java/resources/imagenes/plaza_central/HablandoConSeñor.mp3");
              
              Reproductor.parar();
            plazaCentral();

        }
            break;

        case 1: { // Alcantarilla HECHO
            escenaAlcantarilla();
            plazaCentral();
        }
            break;

        case 2:
                barrioAntiguo();
                break;//HECHO
        case 3:
                alamedaAullante();
                break;//HECHO
        case 4:
                mercadoMayorista();
                break; //HECHO
        case 5:
                estacionCentral();
                break;//HECHO
        case 6:
                salirJuego();
                break;//HECHO
        default:
                plazaCentral();
                break;
    }
}

static void escenaAlcantarilla() {                  //HECHO
    FuncionesGraficas.FotoyMensaje(
        "Alcantarilla",
        "src/main/java/resources/imagenes/plaza_central/Observando_alcantarilla_mercado_central.jpg",
        "En esta alcantarilla se escuchan ruidos a menudo, no se si será alguna pista jovenes",
        0.4,
        false
    );
    FuncionesGraficas.FotoyMensaje("Dentro de la alcantarila","src/main/java/resources/imagenes/plaza_central/alcantarilla_principio.png", ""
            
            , 0.4, false);
}


    // ===== ALAMEDA AULLANTE =====
   static void alamedaAullante() {
   Reproductor.reproducirBucle("src/main/java/resources/Sonidos/Buho.mp3",-1);
    String[] opciones = {
        "1. Buscar tras el árbol",
        "2. Volver a la plaza central",
        "3. Ir hacia la izquierda",//TIENES QUE HACER QUE SEA UNA DECISION ENTRE CAMINOS ES UNA ESCENA A PARTE QUE HAY QUE CREARLA LA FOTO TE LA PASO AHORA MISMO AL DRIVE Y YA DESDE DENTRO DE ESTA FUNCION O COMO SE LLAME ESO IR A DERECHA O IR A IZQUIERDA 
        "4. Ir hacia la derecha",
        "5. Salir del Juego"
    };

    int eleccion = FuncionesGraficas.FotoMensajeMenu(
        "Alameda aullante",
        opciones,
        "src/main/java/resources/imagenes/alameda_aullante/alameda_aullante.png",
        "La alameda está silenciosa, se oyen ruidos extraños.",
        0.4,
        false
    );

    switch (eleccion) {
        case 0: {
            FuncionesGraficas.FotoyMensaje(
                "Tras el árbol",
                "src/main/java/resources/imagenes/alameda_aullante/buscando_detras.png",
                "Aqui parece que hay otra especie de pista no "+nombreHombre+"?\nSi eso parece "+nombreMujer+" pero no se que puede ser, investiguemos más"
                        + "",
                0.4,
                false
            ); Reproductor.parar();
            alamedaAullante();

        }
            break;

        case 1:
                plazaCentral();
                break;//HECHO
        case 2: {
            FuncionesGraficas.FotoyMensaje(
                "Camino izquierdo",
                "src/main/java/resources/imagenes/alameda_aullante/bifurcacion_camino.png",
                "Tomas el camino de la izquierda.",
                0.4,
                false
            );
            Reproductor.parar();
            Reproductor.reproducir("src/main/java/resources/sonidos/Acertijo.mp3");
               AcertijoRioBosque.lanzar();   // AQUÍ se ejecuta el acertijo
        }
            break;

        case 3: {
            FuncionesGraficas.FotoyMensaje(
                "Camino derecho",
                "src/main/java/resources/imagenes/alameda_aullante/camino_derecha.png",
                "Tomas el camino de la derecha.",
                0.4,
                false
            );
       
        }
            break;
   
        case 4:
                salirJuego();
                break;
        default:
                alamedaAullante();
                break;
    }
}


    // ===== CENTRAL NUCLEAR =====
    static void centralNuclear() {

        
        String[] opciones = {
            "1. Investigar alrededores",
            "2. Hablar con el segurata",
            "3. Volver a la estación central",
            "4. Volver a la alameda aullante",
            "5. Salir del Juego"
        };

        int eleccion = FuncionesGraficas.FotoMensajeMenu(
                "Central nuclear",
                opciones,
                "src/main/java/resources/imagenes/central_nuclear/conversacion_guardia.png",
                "Llegas a la central nuclear de las afueras.",
                0.4,
                false
        );

        switch (eleccion) {
            case 0: {
                FuncionesGraficas.FotoyMensaje(
                        "Alrededores",
                        "src/main/java/resources/imagenes/central_nuclear/ciudad_aliens.png",
                        "Investigas los alrededores en busca de pistas.",
                        0.4,
                        false
                );
                centralNuclear();
            }
            break;

            case 1: {
                FuncionesGraficas.FotoyMensaje(
                        "Segurata",
                        "src/main/java/resources/imagenes/central_nuclear/conversacion_guardia.png",
                        "Hablas con el guardia de seguridad.",
                        0.4,
                        false
                );
                centralNuclear();
            }
            break;

            case 2:
                estacionCentral();
                break;
            case 3:
                alamedaAullante();
                break;
            case 4:
                salirJuego();
                break;
            default:
                centralNuclear();
                break;
        }
    }

    // ===== ESTACIÓN CENTRAL =====
    static void estacionCentral() {

        String[] opciones = {
            "1. Volver a plaza central",
            "2. Ir a mercado mayorista",
            "3. Ir a central nuclear (si tienes dinero)",
            "4. Quedarse mirando la estación",
            "5. Salir del Juego"
        };

        int eleccion = FuncionesGraficas.FotoMensajeMenu(
                "Estación central",
                opciones,
                "src/main/java/resources/imagenes/estacion_central/estacion_central.png",
                "La estación central está llena de viajeros.",
                0.4,
                false
        );

        switch (eleccion) {
            case 0:
                plazaCentral();
                break;
            case 1:
                mercadoMayorista();
                break;
            case 2: {
                if (dinero >= 10) {
                    centralNuclear();
                } else {
                    FuncionesGraficas.warning("Sin dinero", "Necesitas al menos 10 monedas para el billete.");
                    estacionCentral();
                }
            }
            break;

            case 3: {
                FuncionesGraficas.FotoyMensaje(
                        "Andén",
                        "src/main/java/resources/imagenes/estacion_central/estacion central dentro.png",
                        "Te quedas observando a la gente en los andenes.",
                        0.4,
                        false
                );
                estacionCentral();
            }
            break;

            case 4:
                salirJuego();
                break;
            default:
                estacionCentral();
                break;
        }
    }

    // ===== BARRIO ANTIGUO =====
    static void barrioAntiguo() {

        String[] opciones = {
            "1. Entrar a la biblioteca",
            "2. Volver a la plaza central",
            "3. Ir al callejón oscuro",
            "4. Salir del Juego"
        };

        int eleccion = FuncionesGraficas.FotoMensajeMenu(
                "Barrio antiguo",
                opciones,
                "src/main/java/resources/imagenes/barrio_antiguo/biblioteca_callejon.png",
                "Llegas al barrio antiguo de la ciudad.",
                0.4,
                false
        );
    
    // ===== MERCADO MAYORISTA =====
 
        switch (eleccion) {
            case 0:
                entrarBiblioteca();
                break;
            case 1:
                plazaCentral();
                break;
            case 2:
                callejonOscuro();
                break;
            case 3:
                salirJuego();
                break;
            default:
                barrioAntiguo();
                break;
        }
    }

    static void entrarBiblioteca() {
        FuncionesGraficas.FotoyMensaje(
                "Biblioteca",
                "src/main/java/resources/imagenes/barrio_antiguo/Libreria.png",
                "La biblioteca está llena de estanterías y libros antiguos.",
                0.4,
                false
        );
        // aquí seguiría todo el árbol de la biblioteca si lo desarrollas
    }

    static void callejonOscuro() {
        FuncionesGraficas.FotoyMensaje(
                "Callejón",
                "src/main/java/resources/imagenes/barrio_antiguo/biblioteca_callejon BUENApng.png", // ajusta al nombre exacto
                "Te adentras en un callejón oscuro entre los edificios.",
                0.4,
                false
        );
    }

    // ===== MERCADO MAYORISTA =====
    static void mercadoMayorista() {
Reproductor.reproducir("src/main/java/resources/Sonidos/MercadoMayoristaAudio.mp3");
        String[] opciones = {
            "1. Ir a la tienda",
            "2. Ir al bazar",
            "3. Ir a estación central",
            "4. Ir a plaza central",
            "5. Salir del Juego"
        };


        int eleccion = FuncionesGraficas.FotoMensajeMenu(
                "Mercado mayorista",
                opciones,
                "src/main/java/resources/imagenes/mercado_mayorista/mercado_mayorista.png",
                "El mercado está lleno de puestos y gente.",
                0.4,
                false
        );

        switch (eleccion) {
            case 0:
                irALaTienda();
                break;
            case 1:
                irALBazar();
                break;
            case 2:
                estacionCentral();
                break;
            case 3:
                plazaCentral();
                break;
            case 4:
                salirJuego();
                break;
            default:
                mercadoMayorista();
                break;
        }
    }

    // ===== ZONA TIENDA / BAZAR =====
    static void irALaTienda() {
Reproductor.reproducir("src/main/java/resources/Sonidos/TiendaCampanas.mp3");

        String[] opciones = {
            "1. Ir a la tienda",
            "2. Colarse en la parte de atrás de la tienda",
            "3. Ir atrás",
            "4. Salir del Juego"
        };
    
        int eleccion = FuncionesGraficas.FotoMensajeMenu(
                "Calle de la tienda",
                opciones,
                "src/main/java/resources/imagenes/Zona_tienda_bazar/yendo_tienda.png",
                "Te acercas a la tienda del mercado.",
                0.4,
                false
        );

        switch (eleccion) {
            case 0: {
                FuncionesGraficas.FotoyMensaje(
                        "Interior tienda",
                        "src/main/java/resources/imagenes/Zona_tienda_bazar/dependiente_mercado.png",
                        "Entras en la tienda por la puerta principal.",
                        0.4,
                        false
                );
                irALaTienda();
            }
            break;

            case 1: {
                if (colarseTienda) {
                    FuncionesGraficas.warning("Aviso", "Alguien debería saber que te sigues colando...");
                } else {
                    colarseTienda();
                }
                irALaTienda();
            }
            break;

            case 2:
                mercadoMayorista();
                break;
            case 3:
                salirJuego();
                break;
            default:
                irALaTienda();
                break;
        }
        Reproductor.parar();
    }

    static void irALBazar() {
Reproductor.reproducirBucle("src/main/java/resources/Sonidos/BazarHablando.mp3");
        String[] opciones = {
            "1. Hablar con la dependienta",
            "2. Volver atrás",
            "3. Salir del Juego"
        };

        int eleccion = FuncionesGraficas.FotoMensajeMenu(
                "Bazar",
                opciones,
                "src/main/java/resources/imagenes/Zona_tienda_bazar/dependiente_mercado.png",
                "La dependienta te mira con curiosidad.",
                0.4,
                false
        );

        switch (eleccion) {
            case 0:
                acertijo1();
                break;
            case 1:
                mercadoMayorista();
                break;
            case 2:
                salirJuego();
                break;
            default:
                irALBazar();
                break;
        }
    }

    static void colarseTienda() {

        String[] opciones = {
            "1. Forzar cerradura",
            "2. Volver atrás",
            "3. Salir del Juego"

        };

        int eleccion = FuncionesGraficas.FotoMensajeMenu(
                "Puerta trasera",
                opciones,
                "src/main/java/resources/imagenes/Zona_tienda_bazar/puerta_atras_tienda.png",
                "Llegas a la parte trasera de la tienda y ves una puerta con candado.",
                0.4,
                false
        );

        switch (eleccion) {
            case 0: {
                acertijo1();
                colarseTienda = true;
            }
            break;

            case 1: { /* volver sin hacer nada */ }
            break;

            case 2:
                salirJuego();
                break;
            default:
                colarseTienda();
                break;
        }
    }

    // ===== ACERTIJO 1 (SUCEC. FIBONACCI--> caja fuerte) =====
 
    static int acertijo1() {

        FuncionesGraficas.FotoyMensaje(
                "Acertijo",
                "src/main/java/resources/imagenes/Acertijo/Acertijo_biblio.png",
                "Observas la sucesión y tratas de adivinar el siguiente número.",
                0.4,
                false
        );

        int n = FuncionesGraficas.pedirEntero(
                "Acertijo",
                "Introduce el siguiente número de la sucesión:"
        );

        int correcto = 8;   // pon aquí el valor real

        if (n == correcto) {
            Reproductor.reproducir("src/main/java/resources/Sonidos/Fantasia.mp3");
            FuncionesGraficas.FotoyMensaje(
                    "Correcto",
                    "src/main/java/resources/imagenes/Acertijo/cofre_abierto.png",
                    "¡Has acertado! La caja fuerte se abre.",
                    0.4,
                    false
            );
           
        } else {
            FuncionesGraficas.FotoyMensaje(
                    "Incorrecto",
                    "src/main/java/resources/imagenes/Acertijo/Despensa chino caja fuerte.png",
                    "No es el número correcto. La caja sigue cerrada.",
                    0.5,
                    false
            );
        }

        return n;
    }
static void salirJuego() {
    FuncionesGraficas.warning(
            "Salir del juego",
            "Has decidido salir. ¡Gracias por jugar, " + nombreJug + "!"
    );
    System.exit(0); // Cierra la JVM y termina el juego
}


    
}




//ayoub me recibes 1231231

