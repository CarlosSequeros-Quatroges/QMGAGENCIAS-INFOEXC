# Despliegue bajo subpath (`/infoexc`) con hash routing

Cómo se configuró esta app para correr bajo `http://host:puerto/infoexc/` en el motor
**cosmoswebserver** (Jetty interno), que **no** hace fallback SPA. Sirve de guía para portar la
otra webapp (`/traslados`) que corre en el mismo servidor: es lo mismo cambiando `infoexc` → `traslados`.

## Resumen: 3 cambios

### 1) `baseHref` — `angular.json`

En `architect → build → options` (común a dev y prod). Hace que el router anteponga el prefijo y que
los assets cuelguen de ahí; genera `<base href="/infoexc/">` en el `index.html`.

```jsonc
"build": {
  "options": {
    "baseHref": "/infoexc/"        // ← "/traslados/" en la otra app
  }
}
```

### 2) `servePath` (solo dev) — `angular.json`

En `architect → serve → configurations → development`. Hace que `ng serve` sirva bajo el subpath e
imite a producción.

```jsonc
"serve": {
  "configurations": {
    "development": {
      "buildTarget": "...:build:development",
      "proxyConfig": "proxy.conf.json",
      "servePath": "/infoexc"      // ← "/traslados" en la otra app
    }
  }
}
```

### 3) Hash routing — `app.config.ts`

```ts
import {
  provideRouter,
  withPreloading,
  PreloadAllModules,
  withHashLocation,
} from '@angular/router';

provideRouter(routes, withPreloading(PreloadAllModules), withHashLocation()),
```

Es lo que **evita configurar fallback SPA** en cosmoswebserver: con `#`, el servidor solo ve
`/infoexc/` (sirve `index.html`) y nunca da 404 en deep links. La URL queda `…/infoexc/#/...`.

## Lo que NO hay que tocar

- **Definiciones de rutas** (`app.routes.ts`): se quedan igual. El prefijo `/infoexc/` lo pone el
  `baseHref` solo; **no** se añade a las rutas.
- **Fallback SPA en el servidor**: no hace falta, gracias al hash routing.

## A revisar al portarlo a `/traslados`

- **Assets en relativo**: referencias sin `/` inicial (p. ej. `logo.png`, no `/logo.png`) para que
  resuelvan contra el `base href`. Las llamadas a API **absolutas** (otro host) no se ven afectadas.
- **`manifest.webmanifest`** (si es PWA): `scope` y `start_url` en relativo (`"./"`) para que apunten
  a `/traslados/`.
- **Service worker**: con el `baseHref` puesto, `ngsw.json` genera `"index": "/traslados/index.html"`
  automáticamente; no hay que tocar nada.
- **`proxy.conf.json`** (dev): mapea las rutas de API de esa app (en esta es `/mgwage` y `/descargas`,
  que cuelgan de la **raíz** del backend, no del subpath).

## Despliegue

1. Subir el contenido de `dist/<app>/browser/` bajo `/traslados/` en el servidor.
2. **QR / URL de entrada**: `…/traslados/#/...` (con el `#/`).
3. Las dos apps conviven sin pisarse porque cada una tiene su `baseHref` y su carpeta.

> Nota: en esta app las URLs del backend se cargan en runtime de `public/config_cosmos.json`
> (ver `CLAUDE.md`), para poder cambiar de servidor sin recompilar. Si `/traslados` necesita lo
> mismo, replica ese patrón (`ConfigService` + `APP_INITIALIZER`).
