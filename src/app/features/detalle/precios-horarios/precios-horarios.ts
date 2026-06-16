import { Component, inject, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Disponibilidad } from '../../../core/models/disponibilidad.model';
import { ConfigService } from '../../../core/services/config';
import { I18nService } from '../../../core/i18n/i18n';

@Component({
  selector: 'app-precios-horarios',
  templateUrl: './precios-horarios.html',
  styleUrl: './precios-horarios.scss',
})
export class PreciosHorarios {
  empresa = input.required<string>();
  codtour = input.required<string>();
  codexc = input.required<string>();
  fecha = input<string | null>(null);

  protected i18n = inject(I18nService);
  private config = inject(ConfigService);

  /**
   * Carga reactiva: se dispara sola cuando cambia `fecha`. Si no hay fecha
   * seleccionada devuelve undefined → el recurso queda en idle (sin petición).
   */
  disponibilidad = httpResource<Disponibilidad>(() => {
    const fecha = this.fecha();
    if (!fecha) return undefined;
    return `${this.config.apiUrl}/disponibilidad?empresa=${this.empresa()}&codtour=${this.codtour()}&codexc=${this.codexc()}&fecha=${fecha}`;
  });
}
