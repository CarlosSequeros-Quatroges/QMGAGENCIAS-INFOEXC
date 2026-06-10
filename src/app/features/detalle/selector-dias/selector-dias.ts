import { Component, computed, inject, input, model } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n';

interface DiaCalendario {
  fecha: string; // YYYY-MM-DD
  diaSemana: string; // abreviatura localizada
  diaMes: number;
  disponible: boolean;
}

@Component({
  selector: 'app-selector-dias',
  templateUrl: './selector-dias.html',
  styleUrl: './selector-dias.scss',
})
export class SelectorDias {
  /** Fechas disponibles en formato YYYY-MM-DD. */
  diasDisponibles = input.required<string[]>();
  /** Fecha seleccionada (two-way: [(fechaSeleccionada)]). */
  fechaSeleccionada = model<string | null>(null);

  protected i18n = inject(I18nService);

  private disponiblesSet = computed(() => new Set(this.diasDisponibles()));

  // Formateadores localizados, reactivos al idioma actual.
  private fmtCorto = computed(
    () => new Intl.DateTimeFormat(this.i18n.idioma(), { weekday: 'short' }),
  );
  private fmtLargo = computed(
    () => new Intl.DateTimeFormat(this.i18n.idioma(), { weekday: 'long' }),
  );

  /** Próximos 16 días (hoy + 15) con marca de disponibilidad. */
  dias = computed<DiaCalendario[]>(() => {
    const set = this.disponiblesSet();
    const fmt = this.fmtCorto();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const dias: DiaCalendario[] = [];
    for (let i = 0; i <= 15; i++) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() + i);
      const fecha = this.aIso(d);
      dias.push({
        fecha,
        diaSemana: fmt.format(d),
        diaMes: d.getDate(),
        disponible: set.has(fecha),
      });
    }
    return dias;
  });

  /** Nombres (localizados) de los días de la semana en que opera la excursión. */
  diasSemanaOperativos = computed(() => {
    const fmt = this.fmtLargo();
    const indices = new Set(this.diasDisponibles().map((f) => new Date(f + 'T00:00:00').getDay()));
    return [...indices].sort().map((i) => {
      // 2024-01-07 fue domingo (getDay 0); +i da un día con ese getDay.
      const nombre = fmt.format(new Date(2024, 0, 7 + i));
      return nombre.charAt(0).toUpperCase() + nombre.slice(1);
    });
  });

  seleccionar(dia: DiaCalendario): void {
    if (!dia.disponible) return;
    this.fechaSeleccionada.set(dia.fecha);
  }

  private aIso(d: Date): string {
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
  }
}
