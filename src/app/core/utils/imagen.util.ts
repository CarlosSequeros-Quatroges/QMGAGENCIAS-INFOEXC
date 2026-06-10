/**
 * Genera la URL de una miniatura diminuta para usar como placeholder pixelado (LQIP).
 *
 * En desarrollo (mock con picsum.photos) deriva una versión de ~24px de ancho con la
 * misma seed, que pesa muy poco y se muestra pixelada mientras carga la imagen real.
 *
 * Con el backend real, lo ideal es que el servidor devuelva directamente esta miniatura
 * (o un data-URI base64) y se pase tal cual al componente; esta función solo cubre el mock.
 */
export function placeholderLowres(url: string): string {
  const m = url.match(/^(.*?)\/(\d+)\/(\d+)(\?.*)?$/);
  if (!m) return url;
  const [, base, w, h, query = ''] = m;
  const ancho = 24;
  const alto = Math.max(1, Math.round((Number(h) / Number(w)) * ancho));
  return `${base}/${ancho}/${alto}${query}`;
}
