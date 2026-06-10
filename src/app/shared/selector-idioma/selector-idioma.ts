import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n';
import { Idioma } from '../../core/i18n/translations';

@Component({
  selector: 'app-selector-idioma',
  templateUrl: './selector-idioma.html',
  styleUrl: './selector-idioma.scss',
})
export class SelectorIdioma {
  private i18n = inject(I18nService);

  readonly idiomas = this.i18n.idiomas;
  readonly actual = this.i18n.idioma;

  cambiar(codigo: Idioma): void {
    this.i18n.setIdioma(codigo);
  }
}
