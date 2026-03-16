# Backend — ITX Phone Shop API

API REST desarrollada con **Spring Boot 3 + Java 21 + WebFlux** que actúa como capa intermedia entre el frontend y la API externa de ITX.

---

## Por qué existe este backend

El frontend React podría llamar directamente a la API externa `https://itx-frontend-test.onrender.com`, pero la prueba técnica exige una **arquitectura de microservicios** con el frontend desacoplado del backend. Este servicio existe por varias razones concretas:

- **CORS controlado:** el navegador bloquearía las peticiones directas a un dominio externo. El backend centraliza ese control.
- **Resiliencia:** si la API externa cae o tarda demasiado, el circuit breaker intercepta y devuelve una respuesta degradada en lugar de propagar el error al usuario.
- **Abstracción:** el frontend no conoce ni depende de la URL de la API externa. Si el proveedor cambia, solo hay que tocar el backend.
- **Validación y seguridad:** los datos entrantes (como el carrito) se validan en el backend antes de reenviarlos.
- **Extensibilidad:** el endpoint `/product/:id/similar` ya agrega datos de dos fuentes distintas, algo que no sería posible directamente desde el frontend.

---

## Arranque

### Requisitos

- Java 21
- Maven 3.8+

### Comando

```bash
mvn spring-boot:run
```

El servidor arranca en `http://localhost:8080`.

> **macOS:** el puerto 5000 está reservado por AirPlay Receiver (Control Center). Por eso el backend usa el **puerto 8080**. Se puede cambiar en `src/main/resources/application.yml`.

---

## Endpoints

### Phone Shop

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/phones` | Lista de todos los teléfonos disponibles |
| `GET` | `/api/phones/{phoneId}` | Detalle completo de un teléfono |
| `POST` | `/api/cart` | Añadir un teléfono al carrito |

**Body de `POST /api/cart`:**
```json
{
  "id": "ZmGrkLRPXOTpxsU4jjAcv",
  "colorCode": 1000,
  "storageCode": 2
}
```

**Respuesta de `POST /api/cart`:**
```json
{
  "count": 1
}
```

### Similar Products

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/product/{productId}/similar` | Lista de productos similares ordenados por similitud |

Este endpoint agrega dos llamadas a la API mock (`localhost:3001`):
1. `GET /product/{id}/similarids` — obtiene los IDs de productos similares.
2. `GET /product/{id}` — obtiene el detalle de cada ID en paralelo.

### Utilidades

| Ruta | Descripción |
|------|-------------|
| `/swagger-ui.html` | Documentación interactiva de la API |
| `/api-docs` | Especificación OpenAPI en formato JSON |
| `/actuator/health` | Estado del servicio |

---

## Swagger UI

Disponible en `http://localhost:8080/swagger-ui.html` una vez arrancado el servidor.

Permite explorar y probar todos los endpoints directamente desde el navegador sin necesidad de herramientas externas como Postman. Cada endpoint está documentado con sus parámetros, ejemplos de request/response y códigos de error.

---

## Arquitectura interna

```
HTTP Request
     │
     ▼
  Controller          (valida entrada, define rutas)
     │
     ▼
   Service            (lógica de negocio, circuit breaker)
     │
     ▼
  WebClient           (cliente HTTP reactivo con timeout)
     │
     ▼
 API externa          (itx-frontend-test.onrender.com  /  localhost:3001)
```

### Capas

| Capa | Paquete | Responsabilidad |
|------|---------|-----------------|
| Controller | `controller/` | Recibe peticiones HTTP, valida con `@Valid`, delega al servicio |
| Service | `service/` | Lógica de negocio, llamadas a APIs externas, circuit breaker |
| DTO | `dto/` | Objetos de transferencia de datos (request y response) |
| Config | `config/` | WebClient, CORS, Swagger |
| Exception | `exception/` | Manejo global de errores |

---

## Circuit Breaker (Resilience4j)

El backend implementa el patrón **Circuit Breaker** para protegerse ante fallos de las APIs externas.

### Cómo funciona

```
Estado CERRADO (normal)
  → Las peticiones llegan a la API externa con normalidad.
  → Si el 50% de las últimas 10 peticiones fallan:

Estado ABIERTO (protección)
  → Las peticiones NO llegan a la API externa.
  → Se ejecuta el fallback inmediatamente (respuesta vacía o error controlado).
  → Tras 15 segundos, pasa a estado semiabierto.

Estado SEMIABIERTO (prueba)
  → Se dejan pasar 3 peticiones de prueba.
  → Si tienen éxito → vuelve a CERRADO.
  → Si fallan → vuelve a ABIERTO.
```

### Configuración

| Instancia | Ventana | Umbral de fallo | Espera abierto | Fallback |
|-----------|---------|-----------------|----------------|----------|
| `phoneShopService` | 10 llamadas | 50 % | 15 s | Lista vacía `[]` |
| `productService` | 10 llamadas | 50 % | 10 s | Lista vacía `[]` |

---

## Gestión de errores

Todos los errores se capturan en `GlobalExceptionHandler` y devuelven siempre un JSON estructurado, nunca un stack trace:

```json
{
  "timestamp": "2026-03-16T11:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Product not found: abc123"
}
```

| Excepción | Código HTTP |
|-----------|-------------|
| `ProductNotFoundException` | 404 |
| `WebExchangeBindException` (validación) | 400 |
| `WebClientResponseException` (API externa) | 404 / 500 |
| Cualquier otra excepción | 500 |

---

## Configuración (`application.yml`)

```yaml
server:
  port: 8080

phone-shop-api:
  base-url: https://itx-frontend-test.onrender.com
  timeout: 10000        # 10 segundos

external-api:
  base-url: http://localhost:3001
  timeout: 3000         # 3 segundos (mock local, debe ser rápido)
```

---

## Tests

```bash
mvn test
```

Incluye tests de controladores y servicios con `MockWebServer` (OkHttp) para simular las APIs externas sin dependencias de red.

---

## Tecnologías

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Java | 21 | Lenguaje |
| Spring Boot | 3.4 | Framework principal |
| Spring WebFlux | 3.4 | HTTP reactivo y no bloqueante |
| Resilience4j | 2.2 | Circuit breaker y time limiter |
| SpringDoc OpenAPI | 2.8 | Generación automática de Swagger |
| Bean Validation | — | Validación de entrada (`@Valid`) |
| Lombok | — | Reducción de boilerplate |
| JUnit 5 + Reactor Test | — | Tests unitarios e integración |
| MockWebServer | 4.12 | Mock de APIs externas en tests |
