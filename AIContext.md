# Contexto del Proyecto

## Estado General
ComparApp es un analizador de precios en tiempo real para supermercados de Argentina (Vea, Chango Más, Carrefour, Cooperativa Obrera). Permite comparar ofertas de manera directa conectándose a las APIs oficiales (VTEX) e indexando/agrupar productos mediante códigos EAN y el algoritmo Jaccard Index para similitud de texto. Actualmente está en desarrollo y es funcional localmente y desplegable en Vercel.

## Arquitectura y Decisiones
- **Frontend**: React (v19) y Vite con Vanilla CSS. Interfaz con estética moderna Glassmorphism y tema Cherry Dark.
- **Backend**: Node.js + Express (ubicado en `api/`) que actúa como proxy para realizar consultas eficientes de hasta 50 productos por supermercado por búsqueda.
- **Librerías clave**: Axios para peticiones HTTP de alto rendimiento, Cheerio y Playwright para soporte de recolección de datos adicionales.

## Tareas Completadas (Recientes)
- [x] Configuración inicial con React v19, Vite y Express backend.
- [x] Conexión con APIs nativas (VTEX) de Vea, Chango Más, Carrefour y Cooperativa Obrera.
- [x] Agrupamiento híbrido basado en código EAN y Jaccard Index.
- [x] Filtros en vivo por exclusión de palabras y productos con competencia única.
- [x] Interfaz de usuario responsiva con tema Cherry Dark y Glassmorphism.

## Próximos Pasos (TODO)
- [ ] Optimizar la latencia en consultas concurrentes a las APIs oficiales.
- [ ] Mejorar la robustez del algoritmo de agrupamiento para productos con descripciones inconsistentes.
- [ ] Agregar soporte para más cadenas de supermercados nacionales (Jumbo, Disco, Coto).
- [ ] Implementar un sistema de caché de corta duración en el servidor backend para búsquedas repetidas comunes.

## Problemas Abiertos o Notas
- Las APIs de terceros pueden aplicar rate-limiting o cambiar sus endpoints sin previo aviso.
