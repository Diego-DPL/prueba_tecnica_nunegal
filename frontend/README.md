# PhoneStore — Frontend

Mini-aplicación SPA para comprar dispositivos móviles, desarrollada con **React 19 + TypeScript + Tailwind CSS**.

---

## Requisitos previos

- Node.js ≥ 18
- npm ≥ 9
- Backend Spring Boot corriendo en `http://localhost:8080`

> **Nota sobre el puerto 8080:** macOS Monterey y posteriores reservan el puerto 5000 para AirPlay Receiver (Control Center), por lo que el backend se ha configurado en el puerto 8080.

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run start` | Modo desarrollo (puerto 3000) |
| `npm run build` | Compilación para producción |
| `npm run test` | Lanzamiento de tests con Vitest |
| `npm run lint` | Comprobación de código con ESLint |

---

## Instalación y arranque

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run start
```

La aplicación estará disponible en `http://localhost:3000`.

El frontend proxifica automáticamente las peticiones `/api/*` hacia el backend en `http://localhost:8080` mediante la configuración de Vite, por lo que **el backend debe estar arrancado previamente**.

---

## Arquitectura y decisiones técnicas

### Vistas

- **PLP (Product List Page)** — `GET /` — Listado de teléfonos con búsqueda en tiempo real y paginación tipo "Load more".
- **PDP (Product Detail Page)** — `GET /phone/:id` — Detalle del producto con imagen, especificaciones completas, selectores de color/almacenamiento y botón de añadir al carrito.

### Componentes clave

- `Header` — Logo/título como enlace a inicio, breadcrumbs y contador de carrito persistido.
- `SearchBar` — Filtrado en tiempo real por marca o modelo.
- `PhoneCard` — Tarjeta de producto con imagen, marca, modelo y precio.

### Paginación

La PLP muestra inicialmente **16 productos**. Un botón "Load more" carga los siguientes 16 de forma acumulativa hasta mostrar el catálogo completo.

La paginación es **cliente**, no servidor. La API externa (`itx-frontend-test.onrender.com`) no soporta parámetros de paginación — devuelve siempre el catálogo completo en una sola respuesta. Por este motivo se descarga el conjunto total de productos en la primera petición, se cachea en `sessionStorage` y la paginación opera sobre el array en memoria.

La barra de búsqueda filtra sobre el **conjunto completo** de productos (no solo los visibles) y resetea la paginación al primer resultado cada vez que cambia la consulta.

### Estado y persistencia

- **CartContext** (React Context + `useReducer`) — Estado local del carrito persistido en `localStorage`.
- **Cart count** — El contador del carrito en el header se actualiza con el valor `count` devuelto por la API (`POST /api/cart`) y se persiste en `localStorage`.
- **Caché de API** — Los datos de la API se almacenan en `sessionStorage` con un TTL de 1 hora. Pasado ese tiempo, se revalidan automáticamente.

### Integración API

El frontend llama al backend Spring Boot (`localhost:8080`) que actúa como proxy hacia la API externa `https://itx-frontend-test.onrender.com`.

| Endpoint (backend) | Descripción |
|--------------------|-------------|
| `GET /api/phones` | Listado de teléfonos |
| `GET /api/phones/:id` | Detalle de un teléfono |
| `POST /api/cart` | Añadir al carrito (devuelve `{ count }`) |

La documentación interactiva de la API (Swagger) está disponible en `http://localhost:8080/swagger-ui.html`.

### Seguridad

- Sin `dangerouslySetInnerHTML` ni evaluación dinámica de código.
- Tipado estricto con TypeScript en todo el proyecto.
- Gestión de errores centralizada en todas las llamadas a la API.

---

## Tecnologías

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 19 | Framework UI |
| TypeScript | 5.9 | Tipado estático |
| Tailwind CSS | 4 | Estilos |
| React Router | 7 | Enrutado SPA |
| Axios | 1.x | Cliente HTTP |
| Vite | 6 | Bundler / Dev server |
| Vitest | 3 | Testing |
| Testing Library | 16 | Tests de componentes |
