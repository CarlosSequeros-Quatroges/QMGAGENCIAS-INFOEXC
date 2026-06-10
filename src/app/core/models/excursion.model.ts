/** Datos ligeros para la galería (endpoint de listado). */
export interface ExcursionResumen {
  id: number;
  titulo: string;
  entradilla: string;
  imagenThumb: string;
  precioDesde: number;
}

/** Datos completos de una excursión (endpoint de detalle). */
export interface Excursion extends ExcursionResumen {
  detalle: string;
  imagenes: string[];
  diasDisponibles: string[]; // 'YYYY-MM-DD'
}
