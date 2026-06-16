import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EmpresaService } from '../services/empresa';

export const empresaGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const empresaService = inject(EmpresaService);

  const codigo = route.paramMap.get('empresa') ?? '';
  const codtour = route.paramMap.get('codtour') ?? '';

  if (!/^\d{3}$/.test(codigo) || !codtour) {
    router.navigate(['/error']);
    return false;
  }

  empresaService.setContexto(codigo, codtour);
  return true;
};
