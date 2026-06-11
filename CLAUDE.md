# QMGAgencias — InfoExc · Webapp de excursiones

Contexto del proyecto para retomar el trabajo en cualquier equipo. (Documento vivo: actualízalo
cuando cambien decisiones importantes.)

## Qué es

Webapp para **clientes de hotel** que consultan las excursiones disponibles. Se entra por un **QR**
con una URL `/{empresa}` (código de **3 dígitos**, validado con `^\d{3}$` en `empresaGuard`).
Flujo: **galería** → **detalle** (carrusel + selector de días hoy→+15 → precios adulto/niño y
horarios del día). Orientada a **móvil** primero, también tablet y escritorio.

## Stack

- **Angular 22**, standalone components, **signals**, SCSS. Sin librerías de UI.
- **PWA** (`@angular/pwa` / service worker).
- Node 20+ y npm. Gestor declarado: `npm@11.16.0`.

## Cómo arrancar

```bash
npm install
npm start          # dev server en http://localhost:4200  → abrir /123 (empresa de 3 dígitos)
npm run build      # build de producción (genera el service worker)
npm run lint
```

Probar la **PWA / offline** (el SW solo corre en build de producción, NO en `ng serve`):
```bash
npm run build
npx serve -s dist/qMGAgencias-infoExc/browser -l 8080   # abrir http://localhost:8080/123
```

## Estructura

- `src/app/core/` — `models/`, `services/`, `i18n/`, `interceptors/`, `guards/`, `mocks/`, `utils/`.
- `src/app/features/` — `galeria/`, `detalle/` (con `carrusel/`, `selector-dias/`, `precios-horarios/`), `error/`.
- `src/app/shared/` — `header/`, `selector-idioma/`, `imagen-progresiva/`.
- `docs/api-contract.md` — **contrato de API** (fuente de verdad para el backend).

## Backend / API

- URL base en `src/environments/environment.ts` → `apiUrl` (dev: `http://localhost:3000/mgwage/rest/infoexc`).
- **Estilo query-param**: empresa, id y fecha viajan como query (`?empresa=001&id=1&lang=es&fecha=YYYY-MM-DD`),
  no como segmentos de ruta. Idioma vía `&lang=` (`es|en|de|fr`).
- Endpoints: `/info`, `/excursiones`, `/detalle`, `/disponibilidad`. Ver `docs/api-contract.md` para JSON exacto.
- Mientras no haya backend, todo lo sirve `core/interceptors/mock.interceptors.ts`. Para conectar el
  backend real: apuntar `apiUrl` y desactivar el `mockInterceptor` en `app.config.ts`.
- El mock **ignora `lang`** (contenido solo en español); el backend debe traducir título/entradilla/detalle.

## Decisiones clave (ya implementadas)

- **Carga progresiva** (prioridad UX móvil): `httpResource` reactivo, `@defer (on viewport)` en
  disponibilidad, `PreloadAllModules` en el router, skeletons + shimmer, `NgOptimizedImage`.
  ⚠️ En `NgOptimizedImage`, `sizes` solo admite valores responsive (vw), **nunca px** (error NG02952).
- **Imagen progresiva** (`shared/imagen-progresiva`): miniatura pixelada (LQIP, `image-rendering: pixelated`)
  con pulso y crossfade a nítida. La miniatura la deriva `core/utils/imagen.util.ts` (truco picsum solo
  para el mock; en producción la dará el backend).
- **PWA**: `ngsw-config.json` cachea imágenes y tiene `dataGroup` para la API. Offline verificado.
- **i18n**: 4 idiomas (ES/EN/DE/FR), sistema propio en `core/i18n` (sin librería, traducciones
  empaquetadas → offline). `I18nService.t('clave')` reactivo. Selector de **banderas SVG** (en
  `public/flags/`, NO emojis porque no renderizan en Windows) en el header. Días localizados con `Intl`.
- **Branding**: header data-driven desde `/info` (`EmpresaService.branding`). Color de acento global
  en variable CSS `--color-acento` (`styles.scss`). ⚠️ El branding actual (logo Fuerte Itaka, rojo
  **#C20E1A**) es **PROVISIONAL**, pendiente de confirmar en reunión con el cliente.
- `@Service()` (Angular 22) es válido: equivale a `@Injectable({ providedIn: 'root' })`. No es un error.

## Convenciones

- UI y nombres de dominio **en español**. El contenido traducible lo resuelve el backend vía `lang`.
- Imitar el estilo del código existente (signals, standalone, mismas convenciones de SCSS).

## Pendiente / próximos pasos

- Conectar el **backend real** (apuntar `apiUrl`, desactivar mock).
- **Imágenes locales** en el mock o esperar al CDN del backend (mejora fiabilidad offline).
- Aviso de **nueva versión** con `SwUpdate` (complementa el service worker).
- **Image loader** responsive de `NgOptimizedImage` cuando se decida el alojamiento de imágenes.
- Cerrar el **branding** definitivo tras la reunión con el cliente.
