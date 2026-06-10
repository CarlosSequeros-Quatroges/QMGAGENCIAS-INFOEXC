import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EmpresaService } from '../services/empresa';

export const empresaGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const empresaService = inject(EmpresaService);

  const codigo = route.paramMap.get('empresa') ?? '';

  if (!/^\d{3}$/.test(codigo)) {
    router.navigate(['/error']);
    return false;
  }

  empresaService.setCodigo(codigo);
  return true;
};
