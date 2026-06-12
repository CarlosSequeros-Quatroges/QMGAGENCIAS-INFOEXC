import { Routes } from '@angular/router';
import { empresaGuard } from './core/guards/empresa.guard';

export const routes: Routes = [
  {
    path: ':empresa',
    canActivate: [empresaGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/galeria/galeria').then((m) => m.GaleriaComponent),
      },
      {
        path: 'excursion/:codexc',
        loadComponent: () => import('./features/detalle/detalle').then((m) => m.DetalleComponent),
      },
    ],
  },
  {
    path: 'error',
    loadComponent: () => import('./features/error/error').then((m) => m.ErrorComponent),
  },
  { path: '**', redirectTo: 'error' },
];
