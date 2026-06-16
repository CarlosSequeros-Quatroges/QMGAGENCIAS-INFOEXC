import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmpresaService } from '../../core/services/empresa';
import { SelectorIdioma } from '../selector-idioma/selector-idioma';

@Component({
  selector: 'app-header',
  imports: [SelectorIdioma, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  private empresaService = inject(EmpresaService);
  readonly branding = this.empresaService.branding;
  readonly codtour = this.empresaService.codtour;

  /** Fichero del logo del touroperador: `tour{empresa}-{codtour}.png` (en `public/`). */
  readonly logoTour = computed(
    () => `tour${this.empresaService.codigo()}-${this.empresaService.codtour()}.png`,
  );
  /** Se oculta si el logo del touroperador no existe (fallo de carga). */
  readonly mostrarLogoTour = signal(true);

  onErrorLogoTour(): void {
    this.mostrarLogoTour.set(false);
  }
}
