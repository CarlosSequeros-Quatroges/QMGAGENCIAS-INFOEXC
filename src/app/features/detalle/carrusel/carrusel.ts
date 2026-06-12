import { Component, ElementRef, computed, inject, input, signal, viewChild } from '@angular/core';
import { ImagenProgresiva } from '../../../shared/imagen-progresiva/imagen-progresiva';
import { ImagenesService } from '../../../core/services/imagenes';

@Component({
  selector: 'app-carrusel',
  imports: [ImagenProgresiva],
  templateUrl: './carrusel.html',
  styleUrl: './carrusel.scss',
})
export class Carrusel {
  /** Nombres de fichero de las imágenes; la URL real se compone con `ImagenesService`. */
  imagenes = input.required<string[]>();
  alt = input<string>('');

  private imagenesSvc = inject(ImagenesService);

  /** URLs compuestas de cada imagen del carrusel. */
  slides = computed(() => this.imagenes().map((nombre) => this.imagenesSvc.urlImagen(nombre)));

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
