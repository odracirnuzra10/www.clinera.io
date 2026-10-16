/**
 * Meta Pixel (dataset) del sitio. Desde el 2026-10-16: dataset «Clinera Software»
 * (BM Método Hebe), que reemplaza al `[2026] OACG TECH` (1104567405156111).
 *
 * Es la fuente única para el código de `src/`. Las páginas estáticas de
 * `public/` no pueden importar TS y llevan el ID escrito en su `fbq('init')`:
 * si cambia, hay que tocarlas (el test `meta-pixel-host.spec.ts` lo vigila).
 */
export const META_PIXEL_ID = "2251201709002818";
