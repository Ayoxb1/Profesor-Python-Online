# 🕵️‍♂️ El Profesor Python y El Misterio de la Alcantarilla

> **Trabajo de Fin de 1º Grado** — Una aventura gráfica detectivesca desarrollada en **Java (Swing/AWT)** y adaptada para ejecutarse directamente en el navegador web mediante **CheerpJ 3 (WebAssembly JVM)** sin necesidad de instalar Java en el equipo del jugador.

---

## 🎮 Jugar Online (Visor Web)

Puedes acceder a la versión web del juego a través de los siguientes enlaces:

- 🚀 **Despliegue en Vercel (Recomendado):** [https://aventura-grafica-profesor-python.vercel.app](https://aventura-grafica-profesor-python.vercel.app) *(o la URL asignada a tu proyecto en Vercel)*
- 🌐 **Visor HTML / Vista previa:** [`index.html`](./index.html)

---

## 📖 Sinopsis

En una apacible ciudad, de la nada ocurrió lo inesperado... Nuestros protagonistas, mientras paseaban, encuentran una misteriosa hoja en el suelo repleta de extraños jeroglíficos en un idioma desconocido. Movidos por su espíritu detectivesco, inician una investigación nocturna que los llevará a explorar los rincones más oscuros de la ciudad: la Plaza Central, la Alameda Aullante, el Barrio Antiguo, la Estación Central, el Mercado Mayorista y los secretos ocultos bajo las alcantarillas.

---

## 🛠️ Tecnologías Utilizadas

- **Java (OpenJDK 17 / 21):** Lógica del juego, flujo narrativo, acertijos y gestión de eventos.
- **Java Swing & AWT (`modulos.FuncionesGraficas`):** Interfaz gráfica, ventanas modulares, diálogos interactivos y renderizado de imágenes.
- **Jaco MP3 Player:** Efectos sonoros y bandas sonoras ambientales en formato MP3/WAV.
- **CheerpJ 3:** Entorno de ejecución WebAssembly que virtualiza una JVM completa dentro del navegador del usuario.
- **HTML5 & CSS3:** Contenedor inmersivo para pantalla completa, centrado del canvas y gestión del ciclo de vida de la aplicación.
- **Vercel / Netlify:** Alojamiento estático global con políticas de seguridad avanzadas (`COOP`/`COEP`).

---

## 📁 Estructura del Repositorio

```text
├── index.html                  # Visor Web con CheerpJ 3 y canvas centrado
├── vercel.json                 # Cabeceras de seguridad COOP / COEP para WebAssembly
├── juego.jar                   # Fat JAR ejecutable (generado con dependencias)
├── pom.xml                     # Configuración del proyecto Maven
└── src/
    └── main/
        └── java/
            ├── com/mycompany/aventuragrafica/
            │   ├── Aventuragrafica.java      # Clase principal y flujo de la historia
            │   ├── AcertijoRioBosque.java    # Acertijo del cruce del río
            │   └── Reproductor.java          # Controlador de audio
            └── resources/
                ├── Imagenes/                 # Escenas, personajes y pistas
                └── Sonidos/                  # Efectos sonoros y pistas musicales
```

---

## ⚙️ Cómo Compilar `juego.jar` (Fat JAR)

Para generar el archivo ejecutable con todas las dependencias incluidas (`Libreria` y `JackMp3`):

1. Abre el proyecto en tu IDE (NetBeans, IntelliJ o VS Code).
2. Asegúrate de compilar con compatibilidad para **Java 17** (versión recomendada por CheerpJ 3).
3. Genera el artefacto / Clean and Build para obtener el Fat JAR y renómbralo como **`juego.jar`** en la raíz del repositorio.

---

## 🚀 Despliegue en Vercel en 2 Pasos

1. Ve a [Vercel](https://vercel.com/) y pulsa en **Add New Project**.
2. Selecciona este repositorio (`Aventura-Grafica-Profesor-Python`).
3. Deja la configuración predeterminada (Vercel detectará automáticamente `vercel.json` y servirá `index.html` con todos los recursos).
4. Pulsa **Deploy** y ¡a jugar!

---

*Desarrollado con dedicación por [Ayoxb1](https://github.com/Ayoxb1)*.
