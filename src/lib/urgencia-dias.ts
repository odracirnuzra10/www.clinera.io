// Fechas del banner de /contrata. «Hoy» es el día calendario en Chile, a mediodía UTC,
// para que el horario de verano no cruce la medianoche. Se pinta solo en el cliente:
// si se generara en el build, la fecha quedaría congelada.

const TZ = "America/Santiago";
const MES = new Intl.DateTimeFormat("es-CL", { timeZone: "UTC", month: "long" });

export function hoyChile(now: Date): Date {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const v = (t: string) => Number(p.find((x) => x.type === t)?.value);
  return new Date(Date.UTC(v("year"), v("month") - 1, v("day"), 12));
}

/** `YYYY-MM-DD` del día civil en Chile. */
export function fechaChileISO(now: Date): string {
  const hoy = hoyChile(now);
  const m = String(hoy.getUTCMonth() + 1).padStart(2, "0");
  const d = String(hoy.getUTCDate()).padStart(2, "0");
  return `${hoy.getUTCFullYear()}-${m}-${d}`;
}

const dd = (d: Date) => String(d.getUTCDate()).padStart(2, "0");

/** «Solo por hoy 05 y mañana 06 de noviembre» / «… hoy 30 de noviembre y mañana 01 de diciembre». */
export function textoUrgencia(now: Date = new Date()): string {
  const hoy = hoyChile(now);
  const man = new Date(hoy.getTime() + 86_400_000);
  const mh = MES.format(hoy);
  const mm = MES.format(man);
  return mh === mm
    ? `Solo por hoy ${dd(hoy)} y mañana ${dd(man)} de ${mm}`
    : `Solo por hoy ${dd(hoy)} de ${mh} y mañana ${dd(man)} de ${mm}`;
}
