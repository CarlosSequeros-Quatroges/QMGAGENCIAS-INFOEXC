import {
  Component,
  ElementRef,
  afterNextRender,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

/**
 * Imagen con carga progresiva: muestra una miniatura pixelada (LQIP) con animación de
 * pulso mientras descarga la imagen real, y hace un crossfade a nítida al cargar.
 */
@Component({
  selector: 'app-imagen-progresiva',
  imports: [NgOptimizedImage],
  templateUrl: './imagen-progresiva.html',
  styleUrl: './imagen-progresiva.scss',
})
export class ImagenProgresiva {
  src = input.required<string>();
  alt = input<string>('');
  /** Miniatura diminuta (pixelada) que se muestra mientras carga la real. */
  placeholder = input<string | null>(null);
  priority = input<boolean>(false);
  sizes = input<string>('100vw');

  cargada = signal(false);
  fallida = signal(false);

  private img = viewChild<ElementRef<HTMLImageElement>>('img');

  constructor() {
    // Cubre el caso de imagen ya cacheada: el evento (load) puede dispararse antes
    // de que Angular enganche el listener, dejando la imagen invisible.
    afterNextRender(() => {
      const el = this.img()?.nativeElement;
      if (el?.complete && el.naturalWidth > 0) this.cargada.set(true);
    });
  }

  onCargada(): void {
    this.cargada.set(true);
  }

  onError(): void {
    this.fallida.set(true);
  }
}
