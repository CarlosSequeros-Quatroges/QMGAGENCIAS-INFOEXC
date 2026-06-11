import { Component, computed, inject, input, output } from '@angular/core';
import { ExcursionResumen } from '../../../core/models/excursion.model';
import { ImagenProgresiva } from '../../../shared/imagen-progresiva/imagen-progresiva';
import { SinImagen } from '../../../shared/sin-imagen/sin-imagen';
import { ImagenesService } from '../../../core/services/imagenes';
import { I18nService } from '../../../core/i18n/i18n';

@Component({
  selector: 'app-tarjeta-excursion',
  imports: [ImagenProgresiva, SinImagen],
  templateUrl: './tarjeta-excursion.html',
  styleUrl: './tarjeta-excursion.scss',
})
export class TarjetaExcursionComponent {
  excursion = input.required<ExcursionResumen>();
  verDetalle = output<number>();

  private imagenes = inject(ImagenesService);
  protected i18n = inject(I18nService);

  /** URL del fichero de imagen ('' si la excursión no tiene foto). */
  imagenUrl = computed(() => this.imagenes.urlImagen(this.excursion().imagenThumb));

  onTap(): void {
    this.verDetalle.emit(this.excursion().id);
  }
}
