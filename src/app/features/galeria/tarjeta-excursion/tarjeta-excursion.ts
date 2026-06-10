import { Component, computed, inject, input, output } from '@angular/core';
import { ExcursionResumen } from '../../../core/models/excursion.model';
import { ImagenProgresiva } from '../../../shared/imagen-progresiva/imagen-progresiva';
import { placeholderLowres } from '../../../core/utils/imagen.util';
import { I18nService } from '../../../core/i18n/i18n';

@Component({
  selector: 'app-tarjeta-excursion',
  imports: [ImagenProgresiva],
  templateUrl: './tarjeta-excursion.html',
  styleUrl: './tarjeta-excursion.scss',
})
export class TarjetaExcursionComponent {
  excursion = input.required<ExcursionResumen>();
  verDetalle = output<number>();

  protected i18n = inject(I18nService);
  placeholder = computed(() => placeholderLowres(this.excursion().imagenThumb));

  onTap(): void {
    this.verDetalle.emit(this.excursion().id);
  }
}
