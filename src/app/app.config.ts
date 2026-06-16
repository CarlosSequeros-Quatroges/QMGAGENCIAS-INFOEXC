import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject,
  isDevMode,
} from '@angular/core';
import {
  provideRouter,
  withPreloading,
  PreloadAllModules,
  withHashLocation,
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { ConfigService } from './core/services/config';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Carga config_cosmos.json (URLs del backend) ANTES de arrancar la app, para poder
    // cambiar de servidor sin recompilar. Bloquea el bootstrap hasta que está disponible.
    provideAppInitializer(() => inject(ConfigService).cargar()),
    // PreloadAllModules: precarga los chunks lazy (p. ej. el detalle) en segundo plano
    // cuando el navegador está libre, para que la navegación sea instantánea.
    // withHashLocation: rutas tras '#' (p. ej. /infoexc/#/102). El servidor solo ve /infoexc/
    // (sirve index.html) y nunca da 404 en deep links → no necesita fallback SPA (cosmoswebserver).
    provideRouter(routes, withPreloading(PreloadAllModules), withHashLocation()),
    // fetch es el backend por defecto en Angular 22 (compatible con httpResource()).
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
