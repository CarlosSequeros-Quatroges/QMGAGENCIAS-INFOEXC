import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ExcursionesService } from '../../core/services/excursiones';
import { EmpresaService } from '../../core/services/empresa';
import { I18nService } from '../../core/i18n/i18n';
import { SelectorDias } from '../../shared/selector-dias/selector-dias';
import { TarjetaExcursionComponent } from './tarjeta-excursion/tarjeta-excursion';

@Component({
  selector: 'app-galeria',
  imports: [TarjetaExcursionComponent, SelectorDias],
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

  /** Fecha por la que se filtra la galería (null = sin filtro, se ven todas). */
  readonly fechaFiltro = signal<string | null>(null);

  /** Unión de las fechas disponibles de todas las excursiones (se resaltan en el calendario). */
  readonly diasConDisponibilidad = computed(() => {
    const fechas = new Set<string>();
    for (const e of this.excursiones.value()) {
      for (const f of e.diasDisponibles ?? []) fechas.add(f);
    }
    return [...fechas];
  });

  /** Excursiones visibles según el filtro de fecha (todas si no hay filtro). */
  readonly excursionesVisibles = computed(() => {
    const fecha = this.fechaFiltro();
    const lista = this.excursiones.value();
    return fecha ? lista.filter((e) => e.diasDisponibles?.includes(fecha)) : lista;
  });

  limpiarFiltro(): void {
    this.fechaFiltro.set(null);
  }

  verDetalle(codexc: string): void {
    this.router.navigate([this.empresa(), 'excursion', codexc]);
  }
}
