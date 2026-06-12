import {
  Component,
  ElementRef,
  HostListener,
  effect,
  input,
  viewChild,
} from '@angular/core';

/**
 * Renderiza un documento HTML completo (recibido en base64 UTF-8) dentro de un iframe
 * aislado con `sandbox` SIN scripts: sus estilos no afectan a la app, no contaminan el
 * `:root`/`body` global y no ejecuta JavaScript (defensa frente a contenido no confiable).
 * La altura del iframe se ajusta al contenido tras cargar y al redimensionar.
 */
@Component({
  selector: 'app-contenido-html',
  templateUrl: './contenido-html.html',
  styleUrl: './contenido-html.scss',
})
export class ContenidoHtml {
  /** Documento HTML completo codificado en base64 (UTF-8). */
  base64 = input.required<string>();
  /** Texto del atributo `title` del iframe (accesibilidad). */
  titulo = input<string>('');

  private iframe = viewChild<ElementRef<HTMLIFrameElement>>('iframe');

  constructor() {
    // Asignamos el HTML por propiedad (no por binding) para evitar la sanitización de
    // Angular: el aislamiento lo garantiza el sandbox del iframe, no el sanitizer.
    effect(() => {
      const el = this.iframe()?.nativeElement;
      if (el) el.srcdoc = decodeBase64Utf8(this.base64());
    });
  }

  @HostListener('window:resize')
  ajustarAltura(): void {
    const el = this.iframe()?.nativeElement;
    const doc = el?.contentWindow?.document;
    if (!el || !doc) return;
    el.style.height = `${doc.documentElement.scrollHeight}px`;
  }
}

/** Decodifica una cadena base64 con contenido UTF-8 (acentos, ñ…). */
function decodeBase64Utf8(b64: string): string {
  if (!b64) return '';
  const binario = atob(b64);
  const bytes = Uint8Array.from(binario, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}
