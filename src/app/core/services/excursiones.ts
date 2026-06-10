import { Service, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ExcursionResumen } from '../models/excursion.model';
import { EmpresaService } from './empresa';
import { I18nService } from '../i18n/i18n';
import { environment } from '../../../environments/environment';

@Service()
export class ExcursionesService {
  private empresa = inject(EmpresaService);
  private i18n = inject(I18nService);

  /**
   * Listado ligero de excursiones. Reactivo a empresa e idioma: se recarga solo si cambian.
   * Al vivir en el servicio (singleton), se conserva entre navegaciones (vuelta atrás instantánea).
   */
  readonly lista = httpResource<ExcursionResumen[]>(
    () => {
      const codigo = this.empresa.codigo();
      return codigo
        ? `${environment.apiUrl}/${codigo}/excursiones?lang=${this.i18n.idioma()}`
        : undefined;
    },
    { defaultValue: [] },
  );
}
