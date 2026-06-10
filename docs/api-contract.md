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
  "nombre": "Fuerte Itaka",
  "logoUrl": "https://cdn.fuerteitaka.com/branding/logo.png",
  "colorPrimario": "#C20E1A"
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `codigo` | string | El mismo código de 3 dígitos |
| `nombre` | string | Nombre de la empresa (usado como `alt` del logo) |
| `logoUrl` | string | URL absoluta del logo (PNG/SVG, fondo transparente recomendado) |
| `colorPrimario` | string | Color de marca en hex `#RRGGBB`. El frontend lo usa como color de acento |

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
    "titulo": "Ruta por el Teide",
    "entradilla": "Ascensión guiada al volcán más alto de España.",
    "imagenThumb": "https://cdn.fuerteitaka.com/exc/1/thumb.webp",
    "precioDesde": 45
  }
]
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | number | Identificador de la excursión |
| `titulo` | string | Traducido según `lang` |
| `entradilla` | string | Resumen corto, traducido |
| `imagenThumb` | string | URL de miniatura ligera (~400 px) |
| `precioDesde` | number | Precio "desde" en € (entero o decimal) |

---

## 3) Detalle de una excursión — **completo**

```
GET /mgwage/rest/infoexc/detalle?empresa=001&id=1&lang=es
```

**Parámetros:** `empresa` (query), `id` (query), `lang` (query).

**Respuesta `200`:**
```json
{
  "id": 1,
  "titulo": "Ruta por el Teide",
  "entradilla": "Ascensión guiada al volcán más alto de España.",
  "detalle": "Una experiencia única recorriendo los paisajes lunares del Parque Nacional del Teide. Incluye teleférico, guía especializado y seguro de montaña.",
  "imagenThumb": "https://cdn.fuerteitaka.com/exc/1/thumb.webp",
  "imagenes": [
    "https://cdn.fuerteitaka.com/exc/1/foto-1.webp",
    "https://cdn.fuerteitaka.com/exc/1/foto-2.webp",
    "https://cdn.fuerteitaka.com/exc/1/foto-3.webp"
  ],
  "precioDesde": 45,
  "diasDisponibles": ["2026-06-12", "2026-06-15", "2026-06-17", "2026-06-19"]
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id`, `titulo`, `entradilla`, `imagenThumb`, `precioDesde` | — | Igual que en el listado |
| `detalle` | string | Descripción larga, traducida según `lang` |
| `imagenes` | string[] | URLs del carrusel. La **primera** es la principal (LCP) |
| `diasDisponibles` | string[] | Fechas con excursión, formato `YYYY-MM-DD`. Basta con devolver las de **hoy → +15 días** (el calendario solo pinta 16 días) |

---

## 4) Disponibilidad de un día (precios y horarios)

```
GET /mgwage/rest/infoexc/disponibilidad?empresa=001&id=1&fecha=2026-06-12
```

**Parámetros:** `empresa` (query), `id` (query), `fecha` (query, `YYYY-MM-DD`).
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

## Recomendaciones (opcionales)

1. **Placeholder LQIP:** para la carga progresiva de imágenes, sería ideal que cada imagen
   incluyera un micro-placeholder (data-URI base64 de ~24 px, o una `imagenLowres`). Hoy el
   frontend lo deriva con un truco solo válido en el mock.
2. **Formato e CDN de imágenes:** WebP/AVIF con redimensionado por URL para activar el
   *image loader* responsive que el frontend ya tiene preparado.
3. **`Cache-Control`** en `/info` y `/excursiones` (cambian poco): el service worker tiene un
   `dataGroup` (`api-excursiones`, estrategia *freshness*) que lo aprovecha.

---

## Resumen de endpoints

| # | Método | Ruta | Query | Devuelve |
|---|---|---|---|---|
| 1 | GET | `/info` | `empresa` | Marca de la empresa |
| 2 | GET | `/excursiones` | `empresa`, `lang` | Listado ligero |
| 3 | GET | `/detalle` | `empresa`, `id`, `lang` | Detalle completo |
| 4 | GET | `/disponibilidad` | `empresa`, `id`, `fecha` | Precios y horarios del día |
