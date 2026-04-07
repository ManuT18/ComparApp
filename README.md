# ComparApp 🛒🕵️‍♂️

**ComparApp** es una herramienta web Fullstack diseñada para buscar y comparar precios de productos en tiempo real a través de los principales supermercados de Argentina: **Carrefour**, **Vea**, **Chango Más** y **Cooperativa Obrera**.

En lugar de navegar manualmente por cada sitio web, **ComparApp** se conecta directamente con las APIs nativas (VTEX) de las plataformas, obteniendo precios oficiales y procesándolos instantáneamente en una interfaz unificada.

## 🚀 Características Principales

*   **Velocidad Nativa:** Utiliza peticiones directas a las APIs e-commerce, evitando el uso de navegadores simulados y garantizando respuestas en milisegundos.
*   **Agrupamiento Híbrido Inteligente:** Implementa un motor de búsqueda que combina:
    *   **Identidad Estricta:** Vinculación por código de barras (EAN).
    *   **Coincidencia Difusa:** Algoritmo de Índice de Jaccard para agrupar productos con nombres similares pero no idénticos.
    *   **Aislamiento de Seguridad:** Previene falsos positivos manteniendo productos diferentes en filas separadas.
*   **Ahorro Instantáneo:** Resalta automáticamente la mejor oferta disponible resaltando el precio más bajo en verde.
*   **Interfaz Premium:**
    *   Diseño moderno con estética **Glassmorphism** (vidrio esmerilado).
    *   Tema único unificado en tonos **Cherry Dark** para una experiencia elegante.
    *   Filtros en tiempo real para excluir palabras clave y ocultar productos sin competencia.

---

## 🛠️ Tecnologías Empleadas

El proyecto está construido sobre una arquitectura moderna y eficiente:

### 🌐 Frontend (Interfaz UI)
*   **React JS** con **Vite** para una experiencia de desarrollo y carga ultrarrápida.
*   **Vanilla CSS** con variables nativas para un control total del diseño sin dependencias externas.
*   **Google Fonts** (`Inter` y `Outfit`) para una tipografía moderna y legible.

### ⚙️ Backend (Motor de Procesamiento)
*   **Node.js** con **Express.js**.
*   **Axios** para la gestión de solicitudes HTTP de alto rendimiento.
*   **Lógica de Normalización:** Procesamiento de texto para limpiar tildes, símbolos y optimizar la comparación.

---

**Creado para Bahía Blanca - 2026.**
