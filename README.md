# Prueba Técnica — ITX Phone Shop

Aplicación full-stack para la compra de dispositivos móviles, desarrollada como prueba técnica.

---

## Estructura del proyecto

```
prueba_tecnica_nunegal/
├── frontend/      # SPA en React 19 + TypeScript + Tailwind CSS
├── backend/       # API REST en Spring Boot 3 + Java 21
└── README.md      # Este fichero
```

---

## Requisitos previos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js | 18 |
| npm | 9 |
| Java (JDK) | 21 |
| Maven | 3.8 |

---

## Arranque rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/Diego-DPL/prueba_tecnica_nunegal.git
cd prueba_tecnica_nunegal
```

### 2. Arrancar el backend

```bash
cd backend
mvn spring-boot:run
```

El backend quedará disponible en `http://localhost:8080`.

> **Nota:** En macOS Monterey o posterior el puerto 5000 está reservado por el sistema (AirPlay Receiver), por lo que el backend se ha configurado en el **puerto 8080**. Si usas Linux o Windows puedes cambiarlo en `backend/src/main/resources/application.yml`.

### 3. Arrancar el frontend (en otra terminal)

```bash
cd frontend
npm install
npm run start
```

La aplicación estará disponible en `http://localhost:3000`.

> El frontend redirige automáticamente las peticiones `/api/*` al backend mediante el proxy de Vite. **El backend debe estar corriendo antes de arrancar el frontend.**

---

## URLs de la aplicación

| Servicio | URL |
|----------|-----|
| Aplicación web | http://localhost:3000 |
| API backend | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| OpenAPI JSON | http://localhost:8080/api-docs |
| Actuator health | http://localhost:8080/actuator/health |

---

## Scripts del frontend

| Comando | Descripción |
|---------|-------------|
| `npm run start` | Modo desarrollo |
| `npm run build` | Compilación para producción |
| `npm run test` | Lanzamiento de tests |
| `npm run lint` | Comprobación de código |

---

## Arquitectura

```
Navegador (React SPA)
        │
        │ /api/*  (proxy Vite en dev)
        ▼
Backend Spring Boot  ──►  API externa ITX
   localhost:8080         itx-frontend-test.onrender.com
```

El backend actúa como **BFF (Backend For Frontend)**: recibe las peticiones del frontend, las redirige a la API externa de ITX y devuelve los datos. Esto desacopla completamente el frontend del proveedor externo y permite añadir lógica de resiliencia (circuit breaker), validación y control de CORS.

---

## Funcionalidades implementadas

### Frontend
- **PLP (Product List Page):** listado de teléfonos con búsqueda en tiempo real por marca y modelo, y paginación tipo *load more* de 16 en 16.
- **PDP (Product Detail Page):** imagen, especificaciones completas, selectores de color y almacenamiento, y botón de añadir al carrito.
- **Caché cliente:** los datos de la API se guardan en `sessionStorage` con TTL de 1 hora para evitar peticiones repetidas.
- **Contador de carrito:** se actualiza con el valor `count` devuelto por la API y se persiste en `localStorage`.

> **Nota sobre la paginación:** la API externa no soporta parámetros de paginación (devuelve siempre el catálogo completo). Por ello la paginación se realiza en cliente sobre el array cacheado, lo que resulta en una sola petición de red por sesión.

### Backend
- `GET /api/phones` — listado de teléfonos.
- `GET /api/phones/:id` — detalle completo de un teléfono.
- `POST /api/cart` — añadir producto al carrito (devuelve `{ count }`).
- `GET /product/:id/similar` — productos similares (agrega llamadas a la API mock).
- Circuit breaker con Resilience4j para tolerancia a fallos externos.
- Validación de entrada con Bean Validation (`@Valid`).
- Manejo global de errores con respuestas JSON estructuradas.
- Documentación interactiva con Swagger/OpenAPI.

---

## Tecnologías

### Frontend
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

### Backend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Java | 21 | Lenguaje |
| Spring Boot | 3.4 | Framework |
| Spring WebFlux | 3.4 | HTTP reactivo |
| Resilience4j | 2.2 | Circuit breaker |
| SpringDoc OpenAPI | 2.8 | Swagger UI |
| Lombok | — | Reducción de boilerplate |
| JUnit 5 | — | Tests |
