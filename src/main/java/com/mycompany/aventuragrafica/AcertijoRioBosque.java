package com.mycompany.aventuragrafica;

import modulos.*;
import java.util.*;

public class AcertijoRioBosque {

    // ---------- CLASE INTERNA PERSONA ----------
    static class Persona {
        String nombre;
        int tiempo;
        boolean ladoInicial;

        Persona(String n, int t) {
            nombre = n;
            tiempo = t;
            ladoInicial = true;
        }

        public String toString() {
            return nombre + "(" + tiempo + ")";
        }
    }

    // ---------- ESTADO DEL ACERTIJO ----------
    static Persona[] personas = {
        new Persona("Ana",   1),
        new Persona("Bruno", 2),
        new Persona("Carla", 5),
        new Persona("Diego", 10)
    };

    static int tiempoTotal = 0;
    static boolean linternaLadoInicial = true;

    // ---------- MÉTODO PÚBLICO PARA LLAMAR DESDE LA AVENTURA ----------
    public static void lanzar() {

        String[] opcionesMenu = {
            "Salir (3)",
            "Hacer un cruce",
            "Ver reglas"
        };

        boolean salir = false;

        while (!salir) {

            mostrarEstado();

            if (todosCruzados()) {
                FuncionesGraficas.mostrarMensaje(
                        "¡Enhorabuena!",
                        "Has conseguido que todos crucen el río en " + tiempoTotal + " minutos.",
                        1
                );
                break;
            }

            int opcion = FuncionesGraficas.menu(
                    "Acertijo del río en el bosque",
                    opcionesMenu,
                    opcionesMenu.length
            );

            switch (opcion) {
                case 1:
                    hacerCruce();
                    break;
                case 2:
                    mostrarReglas();
                    break;
                default:
                    salir = true;
                    break;
            }
        }
    }

    // ---------- RESTO DE MÉTODOS ----------
    static void mostrarEstado() {
        StringBuilder estado = new StringBuilder();

        estado.append("TIEMPO TOTAL: ").append(tiempoTotal).append(" minutos\n\n");

        estado.append("Lado INICIAL (linterna: ");
        estado.append(linternaLadoInicial ? "SÍ" : "NO");
        estado.append(")\n");

        for (Persona persona : personas) {
            if (persona.ladoInicial) {
                estado.append("  ").append(persona).append("\n");
            }
        }

        estado.append("\nLado FINAL (linterna: ");
        estado.append(!linternaLadoInicial ? "SÍ" : "NO");
        estado.append(")\n");

        for (Persona persona : personas) {
            if (!persona.ladoInicial) {
                estado.append("  ").append(persona).append("\n");
            }
        }

        FuncionesGraficas.mostrarDatos("Estado actual del acertijo", estado.toString());
    }

    static boolean todosCruzados() {
        for (Persona persona : personas) {
            if (persona.ladoInicial) {
                return false;
            }
        }
        return true;
    }

    static void hacerCruce() {

        String ladoTexto = linternaLadoInicial
                ? "lado INICIAL al lado FINAL"
                : "lado FINAL al lado INICIAL";

        StringBuilder disponibles = new StringBuilder();
        disponibles.append("Personas que pueden cruzar ahora:\n");
        for (Persona persona : personas) {
            if (linternaLadoInicial == persona.ladoInicial) {
                disponibles.append("  - ").append(persona.nombre)
                           .append(" (").append(persona.tiempo).append(" min)\n");
            }
        }
        FuncionesGraficas.mostrarDatos("Posibles cruces", disponibles.toString());

        String entrada = FuncionesGraficas.pedirDatos(
                "Cruce",
                "Escribe 1 o 2 nombres que cruzan de " + ladoTexto +
                " (ej.: \"Ana Bruno\" o \"Diego\"):"
        );

        if (entrada == null) return;

        entrada = entrada.trim();
        if (entrada.isEmpty()) return;

        String[] nombres = entrada.split("\\s+");
        if (nombres.length > 2) {
            FuncionesGraficas.mostrarMensaje(
                    "Aviso",
                    "Solo se tendrán en cuenta los dos primeros nombres.",
                    0
            );
        }

        ArrayList<Persona> cruzan = new ArrayList<>();

        for (int i = 0; i < nombres.length && i < 2; i++) {
            Persona p = buscarPersona(nombres[i]);
            if (p != null && p.ladoInicial == linternaLadoInicial) {
                cruzan.add(p);
            }
        }

        if (cruzan.isEmpty()) {
            FuncionesGraficas.mostrarMensaje(
                    "Error",
                    "No has elegido ninguna persona válida para este lado.",
                    0
            );
            return;
        }

        int tiempoCruce = 0;
        for (Persona p : cruzan) {
            if (p.tiempo > tiempoCruce) {
                tiempoCruce = p.tiempo;
            }
        }

        for (Persona p : cruzan) {
            p.ladoInicial = !p.ladoInicial;
        }

        tiempoTotal += tiempoCruce;
        linternaLadoInicial = !linternaLadoInicial;

        StringBuilder resumen = new StringBuilder();
        resumen.append("Se han movido: ");
        for (Persona p : cruzan) {
            resumen.append(p.nombre).append(" ");
        }
        resumen.append("\nTiempo de este cruce: ").append(tiempoCruce).append(" min");
        resumen.append("\nTiempo total acumulado: ").append(tiempoTotal).append(" min");

        FuncionesGraficas.mostrarDatos("Resultado del cruce", resumen.toString());
    }

    static Persona buscarPersona(String nombre) {
        for (Persona persona : personas) {
            if (persona.nombre.equalsIgnoreCase(nombre)) {
                return persona;
            }
        }
        return null;
    }

    static void mostrarReglas() {
        String reglas =
                "REGLAS DEL ACERTIJO:\n\n" +
                "- Cuatro amigos deben cruzar el río con una sola balsa.\n" +
                "- Solo caben 2 personas máximo en la balsa.\n" +
                "- Tiempos: Ana=1, Bruno=2, Carla=5, Diego=10.\n" +
                "- Si cruzan dos, cuenta el tiempo del más lento.\n" +
                "- Solo hay una linterna y siempre debe ir en la balsa (ida y vuelta).\n" +
                "- El programa no te da la solución: tú pruebas tus jugadas.";
        FuncionesGraficas.mostrarDatos("Reglas del juego", reglas);
    }
}
