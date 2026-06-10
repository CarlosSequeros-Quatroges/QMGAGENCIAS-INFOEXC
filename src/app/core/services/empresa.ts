import { Service, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { EmpresaModel } from '../models/empresa.model';
import { environment } from '../../../environments/environment';

@Service()
export class EmpresaService {
  private _codigo = signal<string>('');

  readonly codigo = this._codigo.asReadonly();

  /** Datos de marca de la empresa (logo, nombre, color); se cargan al fijar el código. */
  readonly branding = httpResource<EmpresaModel>(() => {
    const codigo = this._codigo();
    return codigo ? `${environment.apiUrl}/${codigo}/info` : undefined;
  });

  setCodigo(codigo: string): void {
    this._codigo.set(codigo);
  }
}
