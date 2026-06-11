import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n';

/**
 * Placeholder "sin imagen": icono plano de cámara tachada + texto localizado.
 * Se usa cuando la excursión no tiene fichero de imagen o la descarga falla (404).
 * Se posiciona en absoluto: el contenedor padre debe ser `position: relative`.
 */
@Component({
  selector: 'app-sin-imagen',
  templateUrl: './sin-imagen.html',
  styleUrl: './sin-imagen.scss',
})
export class SinImagen {
  protected i18n = inject(I18nService);
}
