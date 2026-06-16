export type Idioma = 'es' | 'en' | 'de' | 'fr';

export interface OpcionIdioma {
  codigo: Idioma;
  nombre: string;
  bandera: string; // ruta al SVG en /public
}

export const IDIOMAS: OpcionIdioma[] = [
  { codigo: 'es', nombre: 'Español', bandera: 'flags/es.svg' },
  { codigo: 'en', nombre: 'English', bandera: 'flags/gb.svg' },
  { codigo: 'de', nombre: 'Deutsch', bandera: 'flags/de.svg' },
  { codigo: 'fr', nombre: 'Français', bandera: 'flags/fr.svg' },
];

type Diccionario = Record<string, string>;

export const TRADUCCIONES: Record<Idioma, Diccionario> = {
  es: {
    'galeria.cargando': 'Cargando excursiones…',
    'galeria.error': 'No se han podido cargar las excursiones. Inténtalo de nuevo.',
    'galeria.sinExcursiones':
      'En este momento no hay excursiones disponibles. Por favor, contacta con tu guía.',
    'galeria.filtrarFecha': 'Filtra por fecha',
    'galeria.verTodas': 'Ver todas',
    'tarjeta.desde': 'desde',
    'imagen.noDisponible': 'Imagen no disponible',
    'detalle.volver': 'Volver',
    'detalle.eligeDia': 'Elige tu día',
    'detalle.precios': 'Precios y horarios',
    'detalle.horarios': 'Horarios',
    'detalle.error': 'No se ha podido cargar la excursión. Inténtalo de nuevo.',
    'selector.disponible': 'Excursión disponible:',
    'precios.seleccionaDia': 'Selecciona un día para ver los horarios.',
    'precios.error': 'No se pudieron cargar los horarios. Inténtalo de nuevo.',
    'precios.adulto': 'Adulto',
    'precios.nino': 'Niño',
    'precios.plazas': 'plazas',
    'precios.soloZona': 'Disponible solo en zona',
    'error.titulo': 'Enlace no válido',
    'error.texto': 'Escanea de nuevo el código QR de tu hotel para ver las excursiones disponibles.',
  },
  en: {
    'galeria.cargando': 'Loading excursions…',
    'galeria.error': 'The excursions could not be loaded. Please try again.',
    'galeria.sinExcursiones':
      'There are no excursions available at the moment. Please contact your guide.',
    'galeria.filtrarFecha': 'Filter by date',
    'galeria.verTodas': 'Show all',
    'tarjeta.desde': 'from',
    'imagen.noDisponible': 'No image available',
    'detalle.volver': 'Back',
    'detalle.eligeDia': 'Choose your day',
    'detalle.precios': 'Prices and times',
    'detalle.horarios': 'Times',
    'detalle.error': 'The excursion could not be loaded. Please try again.',
    'selector.disponible': 'Excursion available:',
    'precios.seleccionaDia': 'Select a day to see the times.',
    'precios.error': 'The times could not be loaded. Please try again.',
    'precios.adulto': 'Adult',
    'precios.nino': 'Child',
    'precios.plazas': 'spots',
    'precios.soloZona': 'Available only in zone',
    'error.titulo': 'Invalid link',
    'error.texto': 'Scan your hotel’s QR code again to see the available excursions.',
  },
  de: {
    'galeria.cargando': 'Ausflüge werden geladen…',
    'galeria.error': 'Die Ausflüge konnten nicht geladen werden. Bitte versuchen Sie es erneut.',
    'galeria.sinExcursiones':
      'Derzeit sind keine Ausflüge verfügbar. Bitte wenden Sie sich an Ihren Reiseleiter.',
    'galeria.filtrarFecha': 'Nach Datum filtern',
    'galeria.verTodas': 'Alle anzeigen',
    'tarjeta.desde': 'ab',
    'imagen.noDisponible': 'Kein Bild verfügbar',
    'detalle.volver': 'Zurück',
    'detalle.eligeDia': 'Wähle deinen Tag',
    'detalle.precios': 'Preise und Uhrzeiten',
    'detalle.horarios': 'Uhrzeiten',
    'detalle.error': 'Der Ausflug konnte nicht geladen werden. Bitte versuchen Sie es erneut.',
    'selector.disponible': 'Ausflug verfügbar:',
    'precios.seleccionaDia': 'Wähle einen Tag, um die Uhrzeiten zu sehen.',
    'precios.error': 'Die Uhrzeiten konnten nicht geladen werden. Bitte versuchen Sie es erneut.',
    'precios.adulto': 'Erwachsener',
    'precios.nino': 'Kind',
    'precios.plazas': 'Plätze',
    'precios.soloZona': 'Nur verfügbar in Zone',
    'error.titulo': 'Ungültiger Link',
    'error.texto':
      'Scannen Sie den QR-Code Ihres Hotels erneut, um die verfügbaren Ausflüge zu sehen.',
  },
  fr: {
    'galeria.cargando': 'Chargement des excursions…',
    'galeria.error': 'Les excursions n’ont pas pu être chargées. Veuillez réessayer.',
    'galeria.sinExcursiones':
      'Aucune excursion n’est disponible pour le moment. Veuillez contacter votre guide.',
    'galeria.filtrarFecha': 'Filtrer par date',
    'galeria.verTodas': 'Voir toutes',
    'tarjeta.desde': 'à partir de',
    'imagen.noDisponible': 'Image non disponible',
    'detalle.volver': 'Retour',
    'detalle.eligeDia': 'Choisissez votre jour',
    'detalle.precios': 'Prix et horaires',
    'detalle.horarios': 'Horaires',
    'detalle.error': 'L’excursion n’a pas pu être chargée. Veuillez réessayer.',
    'selector.disponible': 'Excursion disponible :',
    'precios.seleccionaDia': 'Sélectionnez un jour pour voir les horaires.',
    'precios.error': 'Les horaires n’ont pas pu être chargés. Veuillez réessayer.',
    'precios.adulto': 'Adulte',
    'precios.nino': 'Enfant',
    'precios.plazas': 'places',
    'precios.soloZona': 'Disponible uniquement dans la zone',
    'error.titulo': 'Lien invalide',
    'error.texto':
      'Scannez à nouveau le code QR de votre hôtel pour voir les excursions disponibles.',
  },
};
