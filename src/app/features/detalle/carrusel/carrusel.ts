import { Component, ElementRef, computed, input, signal, viewChild } from '@angular/core';
import { ImagenProgresiva } from '../../../shared/imagen-progresiva/imagen-progresiva';
import { placeholderLowres } from '../../../core/utils/imagen.util';

@Component({
  selector: 'app-carrusel',
  imports: [ImagenProgresiva],
  templateUrl: './carrusel.html',
  styleUrl: './carrusel.scss',
})
export class Carrusel {
  imagenes = input.required<string[]>();
  alt = input<string>('');

  slides = computed(() => this.imagenes().map((full) => ({ full, low: placeholderLowres(full) })));

  private pista = viewChild<ElementRef<HTMLElement>>('pista');
  indiceActivo = signal(0);

  /** Actualiza el punto activo según la posición de scroll (snap). */
  onScroll(): void {
    const el = this.pista()?.nativeElement;
    if (!el) return;
    const indice = Math.round(el.scrollLeft / el.clientWidth);
    this.indiceActivo.set(indice);
  }

  irA(indice: number): void {
    const el = this.pista()?.nativeElement;
    if (!el) return;
    el.scrollTo({ left: indice * el.clientWidth, behavior: 'smooth' });
  }
}
