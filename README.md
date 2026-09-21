# Pedidos360 — Frontend

Proyecto académico (DSY1107 Desarrollo Cloud Native I, Duoc UC). SPA en
Angular que se autentica contra Microsoft Entra ID con MSAL y consume la API
de Pedidos360 a través del BFF.

## Arquitectura

```
Angular (esta SPA)  --login OIDC + PKCE-->  Microsoft Entra ID
   |                                              |
   | Authorization: Bearer <access token>         | firma con JWKS
   v                                              |
AWS API Gateway (producción)  <-----valida--------+
   |   En desarrollo local no hay Gateway: proxy.conf.json
   |   redirige /api hacia el BFF y así no se necesita CORS.
   v
BFF Spring Boot :8080  -->  ms-productos :8081
                       -->  ms-pedidos   :8082
```

El backend vive en el repositorio `pedidos360-backend`. Esta SPA **nunca**
llama a los microservicios directamente: todo pasa por el BFF, que es quien
valida el token y aplica los roles.

- MSAL adjunta el access token a las llamadas a `/api/**` mediante
  `MsalInterceptor` (`protectedResourceMap`), nunca a mano.
- El flujo es por **redirect**, no popup, y la caché es `sessionStorage`.

## Requisitos

- Node.js 22.12+ (probado con 22.18)
- Angular CLI 21 (`npm install -g @angular/cli@21`)
- El backend corriendo en `localhost:8080` (ver README de `pedidos360-backend`)

## Cómo ejecutar

```bash
npm install
npm start
```

La app queda en `http://localhost:4200`. `npm start` ya usa
`proxy.conf.json` (está cableado en `angular.json`), que redirige `/api`
hacia `http://localhost:8080`.

Para compilar:

```bash
ng build
```

> Si `npm install` falla con `Cannot read properties of null (reading 'edgesOut')`,
> es un bug conocido de npm resolviendo los peer dependencies de Vitest, no
> del proyecto. Solución: `npm install --legacy-peer-deps`.

## Configuración

No se usan archivos `.env`: toda la configuración vive en
`src/environments/`, tipada y versionada. No hay secretos ahí — el `clientId`
y el `tenant` son identificadores públicos de un cliente OAuth público con
PKCE, no credenciales.

| Variable | Descripción | Valor en desarrollo |
|---|---|---|
| `clientId` | App registration en Entra ID | `b5c90e11-…` |
| `authority` | Tenant de Entra ID | `https://login.microsoftonline.com/baffd3de-…` |
| `redirectUri` | Debe coincidir con el registrado en Entra ID | `http://localhost:4200` |
| `apiBaseUrl` | Prefijo de las llamadas a la API | `/api` (lo proxea Angular) |
| `scopes` | Scopes de **esta** API, nunca los de Graph | `pedidos.read`, `pedidos.write` |

- `environment.ts` → desarrollo (se usa por defecto).
- `environment.prod.ts` → producción; se sustituye en el build de producción
  vía `fileReplacements` en `angular.json`.

> **`environment.prod.ts` tiene marcadores `TODO`**: `redirectUri` y
> `apiBaseUrl` apuntan a dominios de ejemplo. Hay que reemplazarlos por la
> URL real del despliegue y del API Gateway antes de compilar para
> producción, y registrar ese `redirectUri` en Entra ID.

## Estructura

```
src/app/
  core/        guards, interceptores, modelos y servicios transversales
    config/    configuración de MSAL (instancia, guard, interceptor)
    guards/    roleGuard: autorización por rol sobre el claim `roles`
    services/  Auth, Carrito, ProductoService, PedidoService
  features/    una carpeta por vista (catálogo, pedidos, admin, …)
  shared/      navbar y banner de errores
```

Los modelos de `core/models/` espejan los DTOs del backend. Si cambia un DTO
en `ms-productos` o `ms-pedidos`, hay que actualizarlos: TypeScript no valida
las respuestas HTTP en runtime, así que una diferencia no se nota al compilar,
solo al ejecutar.

## Rutas y permisos

| Ruta | Acceso |
|---|---|
| `/` | Público |
| `/catalogo` | Abre sin sesión, pero los datos requieren token (ver nota) |
| `/pedidos/crear` | Requiere sesión (`MsalGuard`) |
| `/pedidos/mios` | Requiere sesión (`MsalGuard`) |
| `/admin/productos` | Requiere sesión **y** rol `Admin` (`MsalGuard` + `roleGuard`) |
| `/sin-permiso` | Destino cuando `roleGuard` rechaza |

Los roles se leen del claim `roles` del token. La barra superior muestra el
nombre del usuario y sus roles, y oculta el enlace de administración a quien
no sea `Admin`.

> **Nota sobre el catálogo**: la ruta no lleva `MsalGuard`, pero el BFF exige
> `SCOPE_pedidos.read` para todo `/api/**`, así que un visitante anónimo ve la
> página con el mensaje de error en vez de los productos. Si se quiere un
> catálogo realmente público hay que decidir de qué lado se resuelve: poner
> `MsalGuard` en la ruta (y asumir que el catálogo exige login), o abrir
> `GET /api/productos` en el BFF (lo que contradice la regla de autorización
> por ruta que define el proyecto).

## Manejo de errores

`core/interceptors/http-error-interceptor.ts` distingue los dos casos que
devuelve el BFF y los muestra en un banner:

- **401** — sesión ausente o inválida. Ofrece reiniciar el login.
- **403** — autenticado pero sin permisos. Redirige a `/sin-permiso`.

## Problemas conocidos

### Estoy logueado, pero todo responde 401

Si la barra superior muestra tu nombre y rol pero cada vista falla con
"Error 401", el problema casi siempre está en el **backend**, no aquí: el BFF
no puede descargar las claves públicas de Microsoft y por eso rechaza todos
los tokens, incluso los válidos. Pasa en máquinas con antivirus o proxy que
interceptan HTTPS (Avast, ESET, Zscaler…). Está documentado en el README de
`pedidos360-backend`, sección "Problemas conocidos".

Para descartar que sea del frontend, revisa el log del BFF: si aparece
`PKIX path building failed`, es eso.

### La barra muestra la sesión activa aunque el token ya no sirva

`Auth` lee la cuenta guardada en la caché de MSAL, no la validez del token.
Si la sesión caducó y MSAL no logra renovarla en silencio, la barra sigue
mostrando el usuario y sus roles mientras la API responde 401. El banner de
error sí refleja el estado real; el botón "Iniciar sesión" del banner rehace
el login.

### `npm install` falla con `edgesOut`

Bug conocido de npm con los peer dependencies de Vitest. Usa
`npm install --legacy-peer-deps`.
