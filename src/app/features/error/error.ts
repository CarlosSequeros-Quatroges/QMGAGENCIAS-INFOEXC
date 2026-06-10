import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n';

@Component({
  selector: 'app-error',
  templateUrl: './error.html',
  styleUrl: './error.scss',
})
export class ErrorComponent {
  protected i18n = inject(I18nService);
}
