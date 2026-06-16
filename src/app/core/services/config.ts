import { Service } from '@angular/core';

/** Configuración de runtime (URLs del backend), cargada de `public/config_cosmos.json`. */
export interface CosmosConfig {
  /** Base de la API REST (p. ej. `http://host:puerto/mgwage/rest/infoexc`). */
  apiUrl: string;
  /** Base de los ficheros de imagen (p. ej. `http://host:puerto/descargas`). */
  descargasUrl: string;
}

/**
 * Carga la configuración del backend desde `config_cosmos.json` (en `public/`) **al iniciar la app**,
 * para poder cambiar de servidor sin recompilar. Se invoca en un `APP_INITIALIZER`, así que cuando los
 * servicios leen `apiUrl`/`descargasUrl` el valor ya está disponible.
 */
@Service()
export class ConfigService {
  private config: CosmosConfig | null = null;

  /** Descarga y cachea el JSON de configuración. Lanza error si no se puede cargar. */
  async cargar(): Promise<void> {
    // Ruta relativa: se resuelve contra el `<base href>` → en prod, `/infoexc/config_cosmos.json`.
    const resp = await fetch('config_cosmos.json', { cache: 'no-cache' });
    if (!resp.ok) {
      throw new Error(`No se pudo cargar config_cosmos.json (HTTP ${resp.status})`);
    }
    this.config = (await resp.json()) as CosmosConfig;
  }

  get apiUrl(): string {
    return this.requerir().apiUrl;
  }

  get descargasUrl(): string {
    return this.requerir().descargasUrl;
  }

  private requerir(): CosmosConfig {
    if (!this.config) {
      throw new Error('ConfigService usado antes de cargar config_cosmos.json (APP_INITIALIZER).');
    }
    return this.config;
  }
}
