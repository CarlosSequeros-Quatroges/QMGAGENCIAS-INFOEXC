import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { Excursion } from '../../core/models/excursion.model';
import { EmpresaService } from '../../core/services/empresa';
import { I18nService } from '../../core/i18n/i18n';
import { environment } from '../../../environments/environment';
import { Carrusel } from './carrusel/carrusel';
import { SelectorDias } from './selector-dias/selector-dias';
import { PreciosHorarios } from './precios-horarios/precios-horarios';

@Component({
  selector: 'app-detalle',
  imports: [RouterLink, Carrusel, SelectorDias, PreciosHorarios],
  templateUrl: './detalle.html',
  styleUrl: './detalle.scss',
})
export class DetalleComponent {
  private route = inject(ActivatedRoute);
  private empresaService = inject(EmpresaService);
  protected i18n = inject(I18nService);

  readonly empresa = this.empresaService.codigo;
  readonly id = signal(Number(this.route.snapshot.paramMap.get('id')));

  fechaSeleccionada = signal<string | null>(null);

  /** Carga reactiva de la excursión; se recarga sola si cambia el id o el idioma. */
  excursion = httpResource<Excursion>(
    () => `${environment.apiUrl}/detalle?empresa=${this.empresa()}&id=${this.id()}&lang=${this.i18n.idioma()}`,
  );
}
