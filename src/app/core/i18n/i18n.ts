import { Service, signal } from '@angular/core';
import { Idioma, IDIOMAS, TRADUCCIONES } from './translations';

const STORAGE_KEY = 'idioma';

@Service()
export class I18nService {
  private _idioma = signal<Idioma>(this.idiomaInicial());

  readonly idioma = this._idioma.asReadonly();
  readonly idiomas = IDIOMAS;

  setIdioma(idioma: Idioma): void {
    this._idioma.set(idioma);
    try {
      localStorage.setItem(STORAGE_KEY, idioma);
    } catch {
      /* almacenamiento no disponible */
    }
  }

  /** Traduce una clave al idioma actual. Reactivo: leer la signal hace que las plantillas se actualicen. */
  t(clave: string): string {
    return TRADUCCIONES[this._idioma()][clave] ?? clave;
  }

  private idiomaInicial(): Idioma {
    const codigos = IDIOMAS.map((i) => i.codigo);
    let guardado: string | null = null;
    try {
      guardado = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* almacenamiento no disponible */
    }
    if (guardado && codigos.includes(guardado as Idioma)) return guardado as Idioma;

    const navegador = (typeof navigator !== 'undefined' ? navigator.language : 'es').slice(0, 2);
    return codigos.includes(navegador as Idioma) ? (navegador as Idioma) : 'es';
  }
}
