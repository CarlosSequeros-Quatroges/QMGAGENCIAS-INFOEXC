export interface Disponibilidad {
  fecha: string;
  horarios: Horario[];
}

export interface Horario {
  hora: string;
  /** Zona opcional; si viene, el horario solo está disponible en ella. */
  zona?: string;
  precioAdulto: number;
  precioNino: number;
  plazasLibres: number;
}
