/** Datos ligeros para la galería (endpoint de listado). */
export interface ExcursionResumen {
  id: number;
  titulo: string;
  entradilla: string;
  /** Miniatura LQIP ya embebida como data URI base64 ('' si no hay imagen). */
  imagenLowres: string;
  /** Nombre del fichero de imagen; la real se sirve en `${descargasUrl}/emp{empresa}/{imagenThumb}`. */
  imagenThumb: string;
  precioDesde: number;
  /** Fechas con excursión ('YYYY-MM-DD'); el backend las da en hoy → +15 días. */
  diasDisponibles: string[];
}

/** Datos completos de una excursión (endpoint de detalle). */
export interface Excursion extends ExcursionResumen {
  detalle: string;
  imagenes: string[];
}
