import { Service, inject } from '@angular/core';
import { EmpresaService } from './empresa';
import { environment } from '../../../environments/environment';

/** Construye las URLs de las imágenes de excursiones (ficheros estáticos del backend). */
@Service()
export class ImagenesService {
  private empresa = inject(EmpresaService);

  /**
   * URL del fichero de imagen de una excursión.
   * Esquema: `${descargasUrl}/emp{codigoEmpresa}/{nombreFichero}`.
   * Devuelve '' si la excursión no tiene imagen (nombre de fichero vacío).
   */
  urlImagen(nombreFichero: string): string {
    if (!nombreFichero) return '';
    return `${environment.descargasUrl}/emp${this.empresa.codigo()}/${nombreFichero}`;
  }
}
