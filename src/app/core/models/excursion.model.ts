/** Datos ligeros para la galería (endpoint de listado). */
export interface ExcursionResumen {
  id: number;
  /** Código de negocio de la excursión (p. ej. "0030"); cuadra con el nombre del fichero de imagen. */
  codexc: string;
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
  /** Descripción extendida: documento HTML completo codificado en base64 (UTF-8). */
  detalle: string;
  /** Nombres de fichero del carrusel; la URL real se compone como `imagenThumb`. */
  imagenes: string[];
}
