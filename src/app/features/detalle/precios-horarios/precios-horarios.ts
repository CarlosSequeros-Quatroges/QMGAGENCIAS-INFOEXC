import { Component, inject, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Disponibilidad } from '../../../core/models/disponibilidad.model';
import { environment } from '../../../../environments/environment';
import { I18nService } from '../../../core/i18n/i18n';

@Component({
  selector: 'app-precios-horarios',
  templateUrl: './precios-horarios.html',
  styleUrl: './precios-horarios.scss',
})
export class PreciosHorarios {
  empresa = input.required<string>();
  excursionId = input.required<number>();
  fecha = input<string | null>(null);

  protected i18n = inject(I18nService);

  /**
   * Carga reactiva: se dispara sola cuando cambia `fecha`. Si no hay fecha
   * seleccionada devuelve undefined → el recurso queda en idle (sin petición).
   */
  disponibilidad = httpResource<Disponibilidad>(() => {
    const fecha = this.fecha();
    if (!fecha) return undefined;
    return `${environment.apiUrl}/disponibilidad?empresa=${this.empresa()}&id=${this.excursionId()}&fecha=${fecha}`;
  });
}
