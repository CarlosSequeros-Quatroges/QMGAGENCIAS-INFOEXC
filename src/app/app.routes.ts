import { Routes } from '@angular/router';
import { empresaGuard } from './core/guards/empresa.guard';

export const routes: Routes = [
  // 'error' debe ir ANTES que ':empresa': si no, `:empresa` (que casa cualquier segmento)
  // captura '/error', el guard lo rechaza y se entra en un bucle de redirección.
  {
    path: 'error',
    loadComponent: () => import('./features/error/error').then((m) => m.ErrorComponent),
  },
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
  { path: '**', redirectTo: 'error' },
];
