import { Service, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { EmpresaModel } from '../models/empresa.model';
import { ConfigService } from './config';

@Service()
export class EmpresaService {
  private config = inject(ConfigService);
  private _codigo = signal<string>('');
  private _codtour = signal<string>('');

  readonly codigo = this._codigo.asReadonly();
  /** Código del touroperador (segundo parámetro de la ruta: /{empresa}/{codtour}). */
  readonly codtour = this._codtour.asReadonly();

  /** Datos de marca de la empresa (logo, nombre, color); se cargan al fijar el código. */
  readonly branding = httpResource<EmpresaModel>(() => {
    const codigo = this._codigo();
    return codigo
      ? `${this.config.apiUrl}/info?empresa=${codigo}&codtour=${this._codtour()}`
      : undefined;
  });

  /** Fija el contexto de la ruta (empresa + touroperador). */
  setContexto(codigo: string, codtour: string): void {
    this._codigo.set(codigo);
    this._codtour.set(codtour);
  }
}
