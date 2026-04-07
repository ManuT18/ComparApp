# ComparApp 🛒🕵️‍♂️

**ComparApp** es una herramienta web Fullstack (*Frontend + Backend*) diseñada para buscar y comparar precios de productos en tiempo real a través de los tres principales supermercados de Bahía Blanca, Argentina: **Cooperativa Obrera**, **Vea**, y **Chango Más**.

En lugar de requerir que el usuario abra y consulte pestaña por pestaña visualizando los sitios web oficiales (a veces lentos o poco responsivos), **ComparApp** se conecta en milisegundos directamente con las interfaces ocultas (APIs VTEX) de las plataformas de supermercado, obteniendo los precios oficiales, procesándolos e imprimiendo el resultado comparativo en pantalla de modo instantáneo.

## 🚀 Características Principales

*   **100% de Velocidad Nativa:** Evita el cuello de botella tradicional del *Web Scraping* usando navegadores ocultos simulados. Las búsquedas emplean requests eficientes a las APIs e-commerce nativas.
*   **Ahorro Garantizado:** Resalta instantáneamente y de color verde la mejor oferta para la marca y el producto buscado entre los diferentes catálogos unificados.
*   **Conocimiento de Stock:** Capaz de notificar sobre inconsistencias de mercadería reportando faltantes como *"Agotado/No Encontrado"*.
*   **Premium User Experience:**
    *   Interfaz con elementos de **Glassmorphism**.
    *   Sistema fluido de **Modo Claro** y **Modo Oscuro**.
    *   Barras de progreso, transiciones y un uso estricto de colores distintivos por columnas (Vea: Rojo, Chango Más: Azul, Coope: Verde).

---

## 🛠️ Tecnologías Empleadas

El proyecto está separado principalmente en dos ambientes modulares:

### 🌐 Frontend (Interfaz UI)
*   **Librería Principal:** React JS.
*   **Empaquetador/Entorno:** Vite *(`create-vite`)* - Permite Hot-Reload y builds veloces.
*   **Estilos:** Vanilla CSS *(Variables nativas, sin librerías externas o frameworks como Tailwind)*.
*   **Tipografía:** Google Fonts (`Inter` y `Outfit`).

### ⚙️ Backend (Motor de Búsqueda y Scraping)
*   **Plataforma Base:** Node.js.
*   **Framework de ruteo:** Express.js 
*   **Gestión de Solicitudes:** Axios (Permite peticiones HTTP de alta velocidad contra servidores VTEX).
*   **Permisos de Origen:** CORS.

---

## 💻 Guía de Instalación y Ejecución

Debido a su naturaleza modular, si descargas el proyecto, debes mantener el **Backend** y el **Frontend** corriendo simultáneamente:

### Requisitos Previos:
Necesitas tener instalados en tu computadora [Node.js](https://nodejs.org/es/) y `npm`.

### 1. Levantar el Backend (El motor central)
Abre una consola / terminal nueva:
```bash
# Entra a la carpeta del servidor
cd backend

# Instala todas las dependencias
npm install

# Inicia el motor de captura de datos
node index.js
```
*(Confirma que ves el mensaje: `Analizador de Precios Backend running on http://localhost:3001`)*

### 2. Levantar el Frontend (La experiencia visual)
Con el backend todavía corriendo abierto, abre una terminal distinta:
```bash
# Entra a la carpeta de diseño visual
cd frontend

# Instala los paquetes y librerías de React
npm install

# Ejecuta Vite en tu navegador
npm run dev
```
Haz click en la ruta de Localhost que Vite te arrojará (por ejemplo, `http://localhost:5173`) y empieza tus comparaciones.

---

**Creado para Bahía Blanca - 2026.**
