import { Component, inject } from '@angular/core';
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
}
