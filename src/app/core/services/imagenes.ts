import { Service, inject } from '@angular/core';
import { EmpresaService } from './empresa';
import { ConfigService } from './config';

/** Construye las URLs de las imágenes de excursiones (ficheros estáticos del backend). */
@Service()
export class ImagenesService {
  private empresa = inject(EmpresaService);
  private config = inject(ConfigService);

  /**
   * URL del fichero de imagen de una excursión.
   * Esquema: `${descargasUrl}/emp{codigoEmpresa}/{nombreFichero}`.
   * Devuelve '' si la excursión no tiene imagen (nombre de fichero vacío).
   */
  urlImagen(codexc: string, nombreFichero: string): string {
    if (!nombreFichero) return '';
    return `${this.config.descargasUrl}/emp${this.empresa.codigo()}/exc${codexc}/${nombreFichero}`;
  }
}
