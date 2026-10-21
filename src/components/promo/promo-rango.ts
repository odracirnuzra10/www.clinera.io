// Rango de la promo de /promo (Ricardo, 21-oct-2026): el día de la reunión con el
// cliente es SIEMPRE el último de una promo de 7 días. Si la reunión cae el 21 de
// octubre, la promo va del 14 al 21; si cae el 22, del 15 al 22. Así el vendedor
// cierra en la misma reunión.
//
// «Hoy» es el día calendario en Chile, no el del navegador: un cliente en México a
// las 23:00 ya está en el día siguiente de Chile, y el equipo vende en hora Chile.

const TZ = "America/Santiago";
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
export const PROMO_DIAS = 7;

function hoyEnChile(ahora: Date): { y: number; m: number; d: number } {
  const partes = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(ahora);
  const v = (t: string) => Number(partes.find((p) => p.type === t)?.value);
  return { y: v("year"), m: v("month"), d: v("day") };
}

const fmt = (fecha: Date) => `${fecha.getUTCDate()} de ${MESES[fecha.getUTCMonth()]}`;

/** Texto de la barra para el instante dado. Pura: se prueba con fechas fijas. */
export function promoRango(ahora: Date): { desde: string; hasta: string; texto: string } {
  const { y, m, d } = hoyEnChile(ahora);
  // Mediodía UTC: la resta de días no cruza medianoche por el horario de verano.
  const fin = new Date(Date.UTC(y, m - 1, d, 12));
  const inicio = new Date(fin.getTime() - PROMO_DIAS * 86400000);
  const desde = fmt(inicio);
  const hasta = fmt(fin);
  return { desde, hasta, texto: `Aprovecha nuestro descuento desde el ${desde} al ${hasta}` };
}
