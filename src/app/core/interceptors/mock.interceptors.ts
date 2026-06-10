import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { EXCURSIONES_MOCK } from '../mocks/excursiones.mock';
import { Excursion, ExcursionResumen } from '../models/excursion.model';
import { Disponibilidad } from '../models/disponibilidad.model';
import { EmpresaModel } from '../models/empresa.model';

// Patrón de días de la semana en los que opera cada excursión (0=domingo … 6=sábado).
const PATRON_DIAS: Record<number, number[]> = {
  1: [1, 3, 5], // lun, mié, vie
  2: [0, 2, 4, 6], // dom, mar, jue, sáb
  3: [2, 4, 6], // mar, jue, sáb
};

/** Devuelve las fechas (YYYY-MM-DD) de los próximos 15 días que caen en los días indicados. */
function proximasFechas(diasSemana: number[]): string[] {
  const fechas: string[] = [];
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  for (let i = 0; i <= 15; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    if (diasSemana.includes(d.getDay())) {
      fechas.push(d.toISOString().slice(0, 10));
    }
  }
  return fechas;
}

/** Clona el mock inyectando días disponibles dinámicos (relativos a hoy). */
function excursionConDisponibilidad(e: Excursion): Excursion {
  return { ...e, diasDisponibles: proximasFechas(PATRON_DIAS[e.id] ?? [1, 3, 5]) };
}

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') return next(req);

  // Ruta sin query string (p. ej. quita ?lang=es).
  const path = req.url.split('?')[0];

  // GET /:empresa/info (datos de marca de la empresa)
  if (path.endsWith('/info')) {
    const segmentos = path.split('/');
    const codigo = segmentos[segmentos.length - 2];
    const body: EmpresaModel = {
      codigo,
      nombre: 'Fuerte Itaka',
      logoUrl: 'https://fuerteitaka.com/wp-content/uploads/2022/06/fuerte-itaka-logo-01.png',
      colorPrimario: '#C20E1A',
    };
    return of(new HttpResponse({ status: 200, body }));
  }

  // GET /:empresa/excursiones  y  /:empresa/excursiones/:id
  if (path.includes('/excursiones') && !path.includes('disponibilidad')) {
    const segmentos = path.split('/');
    const idIndex = segmentos.indexOf('excursiones') + 1;

    // GET detalle por id (objeto completo)
    if (idIndex < segmentos.length) {
      const id = Number(segmentos[idIndex]);
      const encontrada = EXCURSIONES_MOCK.find((e) => e.id === id);
      const excursion = encontrada ? excursionConDisponibilidad(encontrada) : null;
      return of(new HttpResponse({ status: 200, body: excursion }));
    }

    // GET listado (objeto ligero)
    const listado: ExcursionResumen[] = EXCURSIONES_MOCK.map((e) => ({
      id: e.id,
      titulo: e.titulo,
      entradilla: e.entradilla,
      imagenThumb: e.imagenThumb,
      precioDesde: e.precioDesde,
    }));
    return of(new HttpResponse({ status: 200, body: listado }));
  }

  // GET disponibilidad: .../excursiones/:id/disponibilidad/:fecha
  if (path.includes('disponibilidad')) {
    const fecha = path.split('/').pop() ?? '';
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
