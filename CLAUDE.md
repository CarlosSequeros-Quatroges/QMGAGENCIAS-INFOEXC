# QMGAgencias — InfoExc · Webapp de excursiones

Contexto del proyecto para retomar el trabajo en cualquier equipo. (Documento vivo: actualízalo
cuando cambien decisiones importantes.)

## Qué es

Webapp para **clientes de hotel** que consultan las excursiones disponibles. Se entra por un **QR**.
El **router usa hash** (`withHashLocation`), así que la URL es `…/infoexc/#/{empresa}` (código de
**3 dígitos**, validado con `^\d{3}$` en `empresaGuard`). ⚠️ **El QR debe codificar la URL CON `#/`**
(p. ej. `http://host:puerto/infoexc/#/102`). Se usa hash porque el servidor (cosmoswebserver/Jetty) no
hace fallback SPA: con `#` solo ve `/infoexc/` y nunca da 404 en deep links.
Flujo: **galería** → **detalle** (carrusel + selector de días hoy→+15 → horarios del día).
Orientada a **móvil** primero, también tablet y escritorio.

## Stack

- **Angular 22**, standalone components, **signals**, SCSS. Sin librerías de UI.
- **PWA** (`@angular/pwa` / service worker).
- Node 20+ y npm. Gestor declarado: `npm@11.16.0`.

## Cómo arrancar

```bash
npm install
npm start          # dev server → abrir http://localhost:4200/infoexc/123 (empresa de 3 dígitos)
npm run build      # build de producción (genera el service worker)
npm run lint
```

El backend está en **otro host**, así que en dev se usa el **proxy de Angular** (`proxy.conf.json`,
ya cableado en `angular.json` → serve:development). Las URLs en dev son **relativas**
(`environment.development.ts`) y `ng serve` las reenvía al backend; cambia el `target` del proxy si
el backend cambia de host. En **producción** se usan las URLs absolutas de `environment.ts`.

La app se sirve **bajo `/infoexc/`** (hay otra webapp en `/traslados`): `baseHref: "/infoexc/"` está en
`angular.json` (build → `options`, común a dev y prod), por lo que el router antepone `/infoexc/` solo
(**no** hay que añadirlo a las rutas) y los assets cuelgan de ahí. En dev, además, `serve:development`
tiene `servePath: "/infoexc"` para imitar a prod. Si cambia la ruta base de despliegue, ajústalo ahí.
En **producción** el servidor debe servir el build bajo `/infoexc/` y hacer **fallback SPA** a
`/infoexc/index.html` para las rutas profundas.

Probar la **PWA / offline** (el SW solo corre en build de producción, NO en `ng serve`). Como el build
usa `baseHref /infoexc/`, hay que servirlo bajo esa ruta:
```bash
npm run build
mkdir -p dist/pwa/infoexc && cp -r dist/qMGAgencias-infoExc/browser/* dist/pwa/infoexc/
npx serve dist/pwa -l 8080   # abrir http://localhost:8080/infoexc/123
```

## Estructura

- `src/app/core/` — `models/`, `services/`, `i18n/`, `guards/`, `utils/`.
- `src/app/features/` — `galeria/`, `detalle/` (con `carrusel/`, `selector-dias/`, `precios-horarios/`), `error/`.
- `src/app/shared/` — `header/`, `selector-idioma/`, `imagen-progresiva/`.
- `docs/api-contract.md` — **contrato de API** (fuente de verdad para el backend).

## Backend / API

- URL base: **prod** en `environment.ts` (absoluta, `http://192.168.1.51:8094/mgwage/rest/infoexc`);
  **dev** en `environment.development.ts` (relativa, `/mgwage/rest/infoexc`) reenviada por `proxy.conf.json`.
- **Estilo query-param**: empresa, id y fecha viajan como query (`?empresa=001&id=1&lang=es&fecha=YYYY-MM-DD`),
  no como segmentos de ruta. Idioma vía `&lang=` (`es|en|de|fr`).
- Endpoints: `/info`, `/excursiones`, `/detalle`, `/disponibilidad`. Ver `docs/api-contract.md` para JSON exacto.
- **Imágenes**: ficheros estáticos en `${descargasUrl}/emp{empresa}/{nombreFichero}` (`environment.descargasUrl`).
  El listado/detalle traen el **nombre de fichero** (`imagenThumb`/`imagenes[]`) y el LQIP base64 (`imagenLowres`),
  no URLs. El frontend compone la URL en `core/services/imagenes.ts`.
- **Estado del backend**: **todo va al backend real** (`/info`, `/excursiones`, `/detalle`, `/disponibilidad`,
  imágenes). **Ya no hay mock** (el `mockInterceptor` se eliminó; `provideHttpClient()` sin interceptores).
  ⚠️ `precioDesde` llega como **0** del backend (pendiente); la tarjeta oculta el precio si es 0.
- **`detalle` (HTML base64)**: el campo `detalle` de `/detalle` es un **documento HTML completo en base64 (UTF-8)**.
  `shared/contenido-html` lo decodifica y lo pinta en un **iframe con `sandbox` (sin scripts)** para aislar sus
  estilos (`:root`/`body`/`<style>`) de la app; la altura se ajusta al contenido. El carrusel recibe `imagenes[]`
  como **nombres de fichero** y compone la URL con `core/services/imagenes.ts`.
- **i18n del contenido**: el backend traduce título/entradilla/detalle según `lang`.

## Decisiones clave (ya implementadas)

- **Carga progresiva** (prioridad UX móvil): `httpResource` reactivo, `@defer (on viewport)` en
  disponibilidad, `PreloadAllModules` en el router, skeletons + shimmer, `NgOptimizedImage`.
  ⚠️ En `NgOptimizedImage`, `sizes` solo admite valores responsive (vw), **nunca px** (error NG02952).
- **Imagen progresiva** (`shared/imagen-progresiva`): miniatura pixelada (LQIP, `image-rendering: pixelated`)
  con pulso y crossfade a nítida. En la **galería** el LQIP es el `imagenLowres` (base64) del backend y la imagen
  nítida es la URL del fichero (`NgOptimizedImage`). El **carrusel del detalle** usa la URL del fichero sin LQIP
  (el detalle no trae `imagenLowres`). Sin imagen o si la descarga falla → placeholder **"sin imagen"**
  (cámara tachada, `shared/sin-imagen`).
- **PWA**: `ngsw-config.json` cachea imágenes y tiene `dataGroup` para la API. Offline verificado.
- **i18n**: 4 idiomas (ES/EN/DE/FR), sistema propio en `core/i18n` (sin librería, traducciones
  empaquetadas → offline). `I18nService.t('clave')` reactivo. Selector de **banderas SVG** (en
  `public/flags/`, NO emojis porque no renderizan en Windows) en el header. Días localizados con `Intl`.
- **Branding**: el **logo** es un asset fijo del frontend (`public/fuerte-itaka-logo.png`, servido en la raíz) y el
  **color de acento** es fijo en la variable CSS `--color-acento` (`styles.scss`). NO viajan en `/info`
  (`EmpresaModel` solo lleva `codigo` y `nombre`). ⚠️ El branding actual (logo Fuerte Itaka, rojo
  **#C20E1A**) es **PROVISIONAL**, pendiente de confirmar en reunión con el cliente.
- `@Service()` (Angular 22) es válido: equivale a `@Injectable({ providedIn: 'root' })`. No es un error.
- **Precios y cupos OCULTOS** a petición del cliente (comentados en el HTML, código intacto para reactivar):
  el precio de la tarjeta en `tarjeta-excursion.html`, y dentro de `precios-horarios.html` los precios y las
  plazas. En el **detalle SÍ se muestran días y horas** (selector de día + lista de horas); el subtítulo usa
  `detalle.horarios` (en vez de `detalle.precios`). El **filtro por fecha de la galería** también se mantiene.

## Convenciones

- UI y nombres de dominio **en español**. El contenido traducible lo resuelve el backend vía `lang`.
- Imitar el estilo del código existente (signals, standalone, mismas convenciones de SCSS).

## Pendiente / próximos pasos

- Cerrar el **branding** definitivo (logo + `--color-acento`) tras la reunión con el cliente. **Único pendiente real.**
- _Opcional_: aviso de **nueva versión** con `SwUpdate` (mejora de la PWA).
- _Opcional_: que una empresa/`codexc` con formato válido pero **inexistente** (backend 404) vaya a `/error`
  en vez de mostrar el error genérico de carga.

### Limitaciones asumidas (no requieren acción en el frontend)

- Las imágenes de `/descargas` llegan con `Content-Type: text/html` (Jetty no las mapea como `image/webp`).
  Se renderizan bien por _content sniffing_ (no hay `nosniff`).
- `NgOptimizedImage` sin `IMAGE_LOADER` responsive: el backend ya sirve una miniatura ligera (`*-gal.webp`,
  ~15 KB) para la galería y la imagen completa para el carrusel, así que **ya está optimizado** para este
  alojamiento (lazy-load, prioridad en el LCP, sin _layout shift_, LQIP, WebP, caché del SW). Un loader
  responsive (`srcset` por ancho) solo aportaría si el backend ofreciera **redimensionado por URL**.
