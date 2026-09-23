/**
 * lastmod real de páginas estáticas. No usar `new Date()` de build:
 * el sitemap se leía como un único timestamp de deploy.
 *
 * Actualiza la fecha SOLO cuando el contenido de esa URL cambie de verdad.
 */
export const PAGE_DATES: Record<
  string,
  { published: string; modified: string }
> = {
  "/": { published: "2025-01-01", modified: "2026-09-03" },
  "/plataforma": { published: "2025-06-01", modified: "2026-09-03" },
  "/planes": { published: "2025-06-01", modified: "2026-09-08" },
  "/empleado-digital": { published: "2026-04-01", modified: "2026-09-03" },
  "/software-medico": { published: "2026-08-01", modified: "2026-08-26" },
  "/software-dental": { published: "2026-08-01", modified: "2026-08-26" },
  "/mejor-software-clinicas": { published: "2026-08-25", modified: "2026-08-25" },
  "/mejor-software-clinicas/chile": {
    published: "2026-08-25",
    modified: "2026-08-25",
  },
  "/mejor-software-clinicas/mexico": {
    published: "2026-08-25",
    modified: "2026-08-25",
  },
  "/mejor-software-clinicas/colombia": {
    published: "2026-08-25",
    modified: "2026-08-25",
  },
  "/prensa": { published: "2026-06-26", modified: "2026-09-03" },
  "/ayuda": { published: "2025-06-01", modified: "2026-09-03" },
  "/efectividad": { published: "2026-04-23", modified: "2026-04-23" },
  "/seguridad": { published: "2026-08-01", modified: "2026-08-25" },
  "/equipo": { published: "2026-09-03", modified: "2026-09-03" },
  "/casos/metodo-hebe": { published: "2026-09-04", modified: "2026-09-04" },
  "/casos/protocolo-lumina": { published: "2026-09-04", modified: "2026-09-04" },
  "/casos/katherine-meza": { published: "2026-09-04", modified: "2026-09-04" },
  "/clinicas": { published: "2026-06-01", modified: "2026-08-26" },
  "/funciones": { published: "2025-06-01", modified: "2026-08-26" },
  "/demo": { published: "2025-06-01", modified: "2026-05-01" },
  "/app": { published: "2026-03-01", modified: "2026-08-01" },
  "/webinars": { published: "2026-04-01", modified: "2026-08-15" },
  "/podcast": { published: "2026-09-15", modified: "2026-09-15" },
  "/partners": { published: "2026-08-01", modified: "2026-09-07" },
  "/convenio-doctores": { published: "2026-09-06", modified: "2026-09-06" },
  "/comparativas": { published: "2026-04-01", modified: "2026-08-26" },
  "/novedades": { published: "2025-06-01", modified: "2026-08-26" },
  "/novedades/fichas-clinicas": { published: "2026-04-01", modified: "2026-08-20" },
  "/migracion": { published: "2026-05-01", modified: "2026-08-01" },
  "/calculadora-de-consumo": { published: "2026-06-01", modified: "2026-08-26" },
  "/planes-pro": { published: "2026-06-01", modified: "2026-08-26" },
  "/agenda": { published: "2025-06-01", modified: "2026-08-30" },
  "/ventas": { published: "2025-06-01", modified: "2026-08-26" },
  "/presentacion": { published: "2025-06-01", modified: "2026-08-27" },
  "/presentacion-partners": { published: "2026-08-01", modified: "2026-09-06" },
  "/reunion-comercial": { published: "2026-06-01", modified: "2026-08-01" },
  "/reserva": { published: "2026-06-01", modified: "2026-08-01" },
  "/ley20584": { published: "2026-04-01", modified: "2026-08-01" },
  "/acreditacion": { published: "2026-08-01", modified: "2026-08-20" },
  "/privacidad": { published: "2025-06-01", modified: "2026-08-01" },
  "/terminos": { published: "2025-06-01", modified: "2026-08-01" },
  "/cookies": { published: "2025-06-01", modified: "2026-08-01" },
  "/recursos": { published: "2026-06-01", modified: "2026-08-01" },
  "/recursos/calculadora-roi": { published: "2026-06-01", modified: "2026-08-01" },
  "/llms.txt": { published: "2026-04-01", modified: "2026-09-23" },
  "/llms-full.txt": { published: "2026-04-01", modified: "2026-09-23" },
};

export function pageDate(path: string): { published: string; modified: string } {
  return PAGE_DATES[path] ?? { published: "2026-01-01", modified: "2026-08-26" };
}
