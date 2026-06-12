import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { Disponibilidad } from '../models/disponibilidad.model';

/**
 * Mock SOLO de `/disponibilidad` (aún no fiable en el backend). El resto —`/info`,
 * `/excursiones`, `/detalle` e imágenes (`/descargas/...`)— ya va al backend real
 * (pasa de largo con `next(req)`). Cuando el backend dé disponibilidad fiable, borra
 * este bloque o quita el interceptor en `app.config.ts`.
 */
export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') return next(req);

  // Las rutas usan query params: separamos ruta de la query string.
  const path = req.url.split('?')[0];

  // GET /disponibilidad?empresa=001&codexc=0030&fecha=YYYY-MM-DD
  if (path.endsWith('/disponibilidad')) {
    const fecha = new URLSearchParams(req.url.split('?')[1] ?? '').get('fecha') ?? '';
    const body: Disponibilidad = {
      fecha,
      horarios: [
        { hora: '09:00', precioAdulto: 45, precioNino: 30, plazasLibres: 12 },
        { hora: '12:00', precioAdulto: 45, precioNino: 30, plazasLibres: 4 },
        { hora: '16:00', precioAdulto: 38, precioNino: 25, plazasLibres: 20 },
      ],
    };
    return of(new HttpResponse({ status: 200, body }));
  }

  return next(req);
};
