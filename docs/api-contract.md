# Contrato de API — qMGAgencias / Excursiones

Documento de referencia para el backend. Si la API devuelve estas estructuras, el frontend
funciona sin cambios: basta con desactivar el `mockInterceptor`
(`src/app/core/interceptors/mock.interceptors.ts`) y apuntar `environment.apiUrl` al backend real.

## Convenciones generales

- **Base URL:** `/mgwage/rest/infoexc` (configurable en `environment.apiUrl`; en dev:
  `http://localhost:3000/mgwage/rest/infoexc`).
- **Parámetros por query string:** todos los parámetros (incluida la empresa, el id y la fecha)
  viajan como **query params**, no como segmentos de ruta.
- **`empresa`:** código de **3 dígitos** del QR (query param `?empresa=`). El frontend valida
  `^\d{3}$` antes de llamar.
- **Método:** todos **GET**.
- **Content-Type:** `application/json; charset=utf-8`.
- **Idioma:** parámetro de query **`&lang=`** con valores `es | en | de | fr` (por defecto `es`).
  Solo afecta al **texto de contenido** (título, entradilla, detalle).
- **Errores:** `404` si la empresa o la excursión no existen; `400` si los parámetros son
  inválidos. El frontend muestra un estado de error ante cualquier respuesta no 2xx.
- **Imágenes:** URLs **absolutas**. Recomendado WebP/AVIF servidas desde un CDN con
  redimensionado por URL (p. ej. `?w=400`).

---

## 1) Datos de marca de la empresa

```
GET /mgwage/rest/infoexc/info?empresa=001
```

**Parámetros:** `empresa` (query).

**Respuesta `200`:**
```json
{
  "codigo": "123",
  "nombre": "Fuerte Itaka"
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `codigo` | string | El mismo código de 3 dígitos |
| `nombre` | string | Nombre de la empresa (usado como `alt` del logo) |

> El **logo** es un asset fijo del frontend (`public/fuerte-itaka-logo.png`) y el **color de acento** es fijo
> (variable CSS `--color-acento` en `styles.scss`). No viajan en la respuesta de `/info`.

---

## 2) Listado de excursiones (galería) — **ligero**

```
GET /mgwage/rest/infoexc/excursiones?empresa=001&lang=es
```

**Parámetros:** `empresa` (query), `lang` (query).

**Respuesta `200`:** array de objetos **ligeros** (la galería solo necesita estos campos →
menos datos, carga más rápida):
```json
[
  {
    "id": 1,
    "codexc": "0030",
    "titulo": "Ruta por el Teide",
    "entradilla": "Ascensión guiada al volcán más alto de España.",
    "imagenLowres": "data:image/webp;base64,UklGR…",
    "imagenThumb": "img0030-gal.webp",
    "precioDesde": 45,
    "diasDisponibles": ["2026-06-12", "2026-06-15", "2026-06-17"]
  }
]
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | number | Identificador numérico de la fila |
| `codexc` | string | **Código de negocio** de la excursión (p. ej. `"0030"`). Es la **clave** con la que el frontend pide `/detalle` y `/disponibilidad`, y cuadra con el nombre del fichero de imagen |
| `titulo` | string | Traducido según `lang` |
| `entradilla` | string | Resumen corto, traducido |
| `imagenLowres` | string | Miniatura LQIP **embebida** como data URI base64 (~24 px). `""` si no hay imagen. La usa el frontend como placeholder pixelado mientras carga la real |
| `imagenThumb` | string | **Nombre del fichero** de la imagen (no una URL). El frontend compone la URL real (ver §5). `""` si no hay imagen |
| `precioDesde` | number | Precio "desde" en € (entero o decimal) |
| `diasDisponibles` | string[] | Fechas con excursión, formato `YYYY-MM-DD` (**hoy → +15 días**). La galería las usa para el filtro por fecha (resalta días con disponibilidad) |

---

## 3) Detalle de una excursión — **completo**

```
GET /mgwage/rest/infoexc/detalle?empresa=001&codexc=0030&lang=es
```

**Parámetros:** `empresa` (query), `codexc` (query), `lang` (query).

**Respuesta `200`:**
```json
{
  "id": 1,
  "codexc": "0030",
  "titulo": "Excursión en catamarán",
  "entradilla": "Con música, sol y buen ambiente a bordo de un catamarán.",
  "detalle": "PCFET0NUWVBFIGh0bWw+CjxodG1s…",
  "imagenThumb": "img0030-gal.webp",
  "imagenes": ["img0030-001.webp", "img0030-002.webp", "img0030-003.webp"],
  "precioDesde": 63,
  "diasDisponibles": ["2026-06-12", "2026-06-15", "2026-06-17", "2026-06-19"]
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id`, `codexc`, `titulo`, `entradilla`, `imagenThumb`, `precioDesde`, `diasDisponibles` | — | Igual que en el listado (`imagenThumb` = nombre de fichero) |
| `detalle` | string | Descripción extendida: **documento HTML completo codificado en base64 (UTF-8)**. El frontend lo decodifica y lo renderiza en un **iframe aislado** (sandbox sin scripts) para no contaminar los estilos de la app. Traducido según `lang` |
| `imagenes` | string[] | **Nombres de fichero** del carrusel (no URLs). La **primera** es la principal (LCP). El frontend compone cada URL como en §5 |
| `diasDisponibles` | string[] | Fechas con excursión, formato `YYYY-MM-DD`. Basta con devolver las de **hoy → +15 días** (el calendario solo pinta 16 días) |

> El detalle **no** incluye `imagenLowres` (el carrusel no usa LQIP por imagen).
>
> ⚠️ **Pendiente:** hoy `/disponibilidad` devuelve datos de **esqueleto** (no fiables); el frontend lo
> sirve aún con el `mockInterceptor` hasta que el backend lo cierre. `/detalle` ya es real.

---

## 4) Disponibilidad de un día (precios y horarios)

```
GET /mgwage/rest/infoexc/disponibilidad?empresa=001&codexc=0030&fecha=2026-06-12
```

**Parámetros:** `empresa` (query), `codexc` (query), `fecha` (query, `YYYY-MM-DD`).
No necesita `lang` (solo devuelve números y horas).

**Respuesta `200`:**
```json
{
  "fecha": "2026-06-12",
  "horarios": [
    { "hora": "09:00", "precioAdulto": 45, "precioNino": 30, "plazasLibres": 12 },
    { "hora": "12:00", "precioAdulto": 45, "precioNino": 30, "plazasLibres": 4 },
    { "hora": "16:00", "precioAdulto": 38, "precioNino": 25, "plazasLibres": 20 }
  ]
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `fecha` | string | Eco de la fecha solicitada (`YYYY-MM-DD`) |
| `horarios[].hora` | string | Formato `HH:mm` (24 h) |
| `horarios[].precioAdulto` | number | € |
| `horarios[].precioNino` | number | € |
| `horarios[].plazasLibres` | number | Entero. El frontend marca en rojo si ≤ 5 |

---

## 5) Ficheros de imagen (estáticos)

Las imágenes **no viajan en el JSON**: se sirven como ficheros estáticos y el frontend compone
la URL a partir del **código de empresa** y el **nombre de fichero** (`imagenThumb` / `imagenes[]`):

```text
GET {descargasUrl}/emp{empresa}/{nombreFichero}

Ejemplo: GET /descargas/emp102/img0030-gal.webp
```

- **`descargasUrl`** es configurable en `environment.descargasUrl` (independiente de `apiUrl`).
- El nombre de la carpeta es **`emp` + código de empresa** (3 dígitos), p. ej. `emp102`.
- **Formato recomendado:** WebP/AVIF. Conviene `Cache-Control` largo (los ficheros son inmutables;
  el service worker los cachea en el `assetGroup` `imagenes-excursiones`).
- **Imagen ausente:** si la excursión no tiene foto, `imagenThumb` e `imagenLowres` llegan como `""`;
  el frontend muestra un placeholder "sin foto".

> El **LQIP** (carga progresiva) lo cubre `imagenLowres` (base64 embebido en el JSON del listado/detalle):
> el frontend lo pinta pixelado mientras descarga el fichero real y hace crossfade.

---

## Recomendaciones (opcionales)

1. **`imagenLowres` (LQIP):** mantener el micro data-URI base64 (~24 px) en cada item del listado y
   del detalle; es lo que da la carga progresiva sin peticiones extra.
2. **Formato e CDN de imágenes:** WebP/AVIF; con `Cache-Control` largo en `/descargas/**` el service
   worker las cachea y la app funciona offline tras la primera visita.
3. **`Cache-Control`** en `/info` y `/excursiones` (cambian poco): el service worker tiene un
   `dataGroup` (`api-excursiones`, estrategia *freshness*) que lo aprovecha.

---

## Resumen de endpoints

| # | Método | Ruta | Query | Devuelve |
|---|---|---|---|---|
| 1 | GET | `/info` | `empresa` | Marca de la empresa |
| 2 | GET | `/excursiones` | `empresa`, `lang` | Listado ligero |
| 3 | GET | `/detalle` | `empresa`, `codexc`, `lang` | Detalle completo |
| 4 | GET | `/disponibilidad` | `empresa`, `codexc`, `fecha` | Precios y horarios del día |
| 5 | GET | `{descargasUrl}/emp{empresa}/{fichero}` | — | Fichero de imagen (estático) |
