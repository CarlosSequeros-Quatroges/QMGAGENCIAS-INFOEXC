export interface Disponibilidad {
  fecha: string;
  horarios: Horario[];
}

export interface Horario {
  hora: string;
  precioAdulto: number;
  precioNino: number;
  plazasLibres: number;
}
