<div align="center">

# 🕵️‍♂️ El Profesor Python y El Misterio de la Alcantarilla

### *Trabajo de Fin de 1º Grado de Desarrollo de Aplicaciones*

[![Java](https://img.shields.io/badge/Java-17%20%7C%2021-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-CheerpJ%203-654FF0?style=for-the-badge&logo=webassembly&logoColor=white)](https://cheerpj.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Platform](https://img.shields.io/badge/Platform-Web%20Browser%20%26%20Desktop-38bdf8?style=for-the-badge)](./index.html)

Una aventura gráfica detectivesca desarrollada en **Java (Swing / AWT)** y portada a la web mediante **CheerpJ 3 (WebAssembly JVM)** para que cualquier usuario pueda jugarla directamente desde su navegador sin tener que instalar Java ni configurar dependencias.

[🎮 **¡Jugar Online (Visor Web)!**](./index.html) · [📖 Ver Sinopsis](#-sinopsis-y-trama) · [👥 Autores](#-autores) · [🚀 Despliegue](#-despliegue-en-vercel)

</div>

---

## 👥 Autores

Proyecto conceptualizado, programado y diseñado por:

- **Pablo Jiménez Jorquera** ([@pablo](https://github.com/Ayoxb1))
- **Ayoub Atidi Belbaz** ([@Ayoxb1](https://github.com/Ayoxb1))

---

## 🎮 Jugar Online (HTML / Web View)

El juego está optimizado para ejecutarse en el navegador con aceleración WebAssembly y sonido integrado:

- 🌐 **Visor HTML local / GitHub:** Puedes abrir directamente el archivo [`index.html`](./index.html) en tu servidor web.
- ⚡ **Despliegue en Vercel:** Listo para desplegar en 1 clic gracias al archivo `vercel.json` configurado con encabezados de aislamiento `Cross-Origin-Opener-Policy` y `Cross-Origin-Embedder-Policy`.

---

## 📖 Sinopsis y Trama

En una tranquila ciudad metropolitana, lo inesperado sacude la rutina. Dos jóvenes con una curiosidad insaciable y un instinto detectivesco encuentran en el suelo un misterioso pergamino con jeroglíficos crípticos.

Lo que parecía un enigma inocente se convierte en una peligrosa trama que conecta las profundidades del subsuelo urbano con enigmas matemáticos, secretos en la biblioteca antigua y sospechosas actividades en la central.

### 🗺️ Lugares a explorar:
- **La Plaza Central:** El corazón de la investigación y punto de inicio del misterio.
- **La Alameda Aullante:** Caminos ocultos, bifurcaciones y pistas escondidas tras la naturaleza.
- **El Barrio Antiguo y la Librería:** Consulta de jeroglíficos y diálogos con sabios locales.
- **La Central Nuclear y la Estación Central:** Zonas vigiladas de alto riesgo.
- **El Mercado Mayorista y el Bazar:** Encuentros con comerciantes y resolución de acertijos de compra/intercambio.
- **Las Profundidades de la Alcantarilla:** El clímax subterráneo del misterio.

---

## 🧩 Acertijos y Mecánicas

- **Diálogos con toma de decisiones:** Conversaciones con personajes clave que alteran el progreso y desbloquean nuevas zonas.
- **Acertijo del Río en el Bosque:** Clásico problema de optimización lógica donde los personajes deben cruzar el río antes de que se agote el tiempo.
- **Sucesión de Fibonacci y Criptografía:** Descifrado de claves numéricas para abrir cajas fuertes y avanzar en la historia.
- **Banda Sonora y Efectos Ambientales:** Pistas musicales y sonidos que reaccionan a cada escena mediante el reproductor MP3 integrado.

---

## 🛠️ Tecnologías y Arquitectura

| Componente | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Lenguaje Base** | Java (JDK 17 / 21) | Lógica orientada a objetos, control de flujo y eventos. |
| **Interfaz Gráfica** | Java Swing & AWT | Ventanas modulares (`modulos.FuncionesGraficas`), diálogos y paneles interactivos. |
| **Motor de Audio** | Jaco MP3 Player | Decodificación y reproducción de pistas `.mp3` y `.wav` en bucle continuo. |
| **Virtualización Web** | CheerpJ 3 (WebAssembly) | Compilador JIT de bytecode Java a WebAssembly ejecutado en el navegador del cliente. |
| **Frontend Web** | HTML5 / CSS3 Moderno | Contenedor gamer centrado, pantalla de carga fluida y modo pantalla completa. |
| **Hosting Cloud** | Vercel / Netlify | CDN global con cabeceras `COOP` y `COEP` para soporte de multihilo en WebAssembly. |

---

## 📁 Estructura del Proyecto

```text
Profesor-Python-Online/
├── index.html                  # Visor Web con CheerpJ 3 y canvas responsive
├── vercel.json                 # Cabeceras de seguridad requeridas por WebAssembly
├── pom.xml                     # Descriptor Maven de dependencias
├── README.md                   # Documentación completa y créditos
├── juego.jar                   # Fat JAR ejecutable (Java 17)
└── src/
    └── main/
        └── java/
            ├── com/mycompany/aventuragrafica/
            │   ├── Aventuragrafica.java      # Clase principal y flujo de la historia
            │   ├── AcertijoRioBosque.java    # Módulo del acertijo del río
            │   └── Reproductor.java          # Módulo del reproductor de sonido
            └── resources/
                ├── Imagenes/                 # Fondos, personajes y jeroglíficos
                └── Sonidos/                  # Efectos y bandas sonoras MP3/WAV
```

---

## 🚀 Despliegue en Vercel

1. Entra a [Vercel](https://vercel.com/) e inicia sesión con tu cuenta de GitHub.
2. Pulsa en **Add New Project** y selecciona el repositorio **`Profesor-Python-Online`**.
3. Deja la configuración en **Other** (sitio estático). Vercel leerá automáticamente `vercel.json` y servirá `index.html` con todos sus recursos.
4. Pulsa **Deploy** y comparte el enlace público para jugar.

---

<div align="center">

Hecho con dedicación por **Pablo Jiménez Jorquera** y **Ayoub Atidi Belbaz** 🎓  
*Aventura Gráfica - Profesor Python*

</div>
