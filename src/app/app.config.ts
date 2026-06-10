import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { mockInterceptor } from './core/interceptors/mock.interceptors';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // PreloadAllModules: precarga los chunks lazy (p. ej. el detalle) en segundo plano
    // cuando el navegador está libre, para que la navegación sea instantánea.
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // fetch es el backend por defecto en Angular 22 (compatible con httpResource()).
    provideHttpClient(withInterceptors([mockInterceptor])),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
