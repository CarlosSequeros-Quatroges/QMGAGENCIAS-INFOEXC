export const environment = {
  production: false,
  // En desarrollo las rutas son RELATIVAS: el dev server (`ng serve`) las reenvía al backend
  // mediante `proxy.conf.json` (evita CORS al estar el backend en otro host). El host real
  // vive solo en `proxy.conf.json`. En producción se usa `environment.ts` (URLs absolutas).
  apiUrl: '/mgwage/rest/infoexc',
  descargasUrl: '/descargas',
};
