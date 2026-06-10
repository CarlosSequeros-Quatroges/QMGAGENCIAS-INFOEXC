import { Excursion } from '../models/excursion.model';

export const EXCURSIONES_MOCK: Excursion[] = [
  {
    id: 1,
    titulo: 'Ruta por el Teide',
    entradilla: 'Ascensión guiada al volcán más alto de España con vistas espectaculares.',
    detalle:
      'Una experiencia única recorriendo los paisajes lunares del Parque Nacional del Teide. Incluye teleférico, guía especializado y seguro de montaña.',
    imagenThumb: 'https://picsum.photos/seed/teide/400/250',
    imagenes: [
      'https://picsum.photos/seed/teide4/800/500',
      'https://picsum.photos/seed/teide2/800/500',
      'https://picsum.photos/seed/teide3/800/500',
    ],
    precioDesde: 45,
    diasDisponibles: ['2026-07-15', '2026-07-16', '2026-07-18', '2026-07-20'],
  },
  {
    id: 2,
    titulo: 'Avistamiento de cetáceos',
    entradilla: 'Navega por el estrecho de La Gomera y observa delfines y ballenas en su hábitat.',
    detalle:
      'Salida en catamarán desde Los Cristianos. Alta probabilidad de avistamiento de calderones, delfines mulares y en temporada, ballenas piloto.',
    imagenThumb: 'https://picsum.photos/seed/ballenas/400/250',
    imagenes: [
      'https://picsum.photos/seed/ballenas1/800/500',
      'https://picsum.photos/seed/ballenas2/800/500',
    ],
    precioDesde: 38,
    diasDisponibles: ['2026-07-14', '2026-07-15', '2026-07-17', '2026-07-19'],
  },
  {
    id: 3,
    titulo: 'Quad por el sur de Tenerife',
    entradilla: 'Recorre los paisajes volcánicos del sur en quad con guía experto.',
    detalle:
      'Ruta de 2 horas en quad por pistas y paisajes volcánicos únicos. Sin experiencia previa necesaria. Incluye casco, guantes y seguro.',
    imagenThumb: 'https://picsum.photos/seed/quad/400/250',
    imagenes: [
      'https://picsum.photos/seed/quad1/800/500',
      'https://picsum.photos/seed/quad2/800/500',
      'https://picsum.photos/seed/quad3/800/500',
    ],
    precioDesde: 55,
    diasDisponibles: ['2026-07-14', '2026-07-16', '2026-07-18', '2026-07-21'],
  },
];
