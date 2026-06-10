import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ExcursionesService } from '../../core/services/excursiones';
import { EmpresaService } from '../../core/services/empresa';
import { I18nService } from '../../core/i18n/i18n';
import { TarjetaExcursionComponent } from './tarjeta-excursion/tarjeta-excursion';

@Component({
  selector: 'app-galeria',
  imports: [TarjetaExcursionComponent],
  templateUrl: './galeria.html',
  styleUrl: './galeria.scss',
})
export class GaleriaComponent {
  private excursionesService = inject(ExcursionesService);
  private empresaService = inject(EmpresaService);
  private router = inject(Router);
  protected i18n = inject(I18nService);

  readonly empresa = this.empresaService.codigo;
  readonly excursiones = this.excursionesService.lista;

  verDetalle(id: number): void {
    this.router.navigate([this.empresa(), 'excursion', id]);
  }
}
