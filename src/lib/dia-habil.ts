const TZ = "America/Santiago";

function ymdEnZona(tz: string, d: Date) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day}`;
}

function sumarDias(ymd: string, n: number) {
  const [Y, M, D] = ymd.split("-").map(Number);
  return new Date(Date.UTC(Y, M - 1, D + n)).toISOString().slice(0, 10);
}

function diaSemana(ymd: string) {
  const [Y, M, D] = ymd.split("-").map(Number);
  return new Date(Date.UTC(Y, M - 1, D)).getUTCDay();
}

/**
 * Próximo día hábil (lun–vie) después de hoy en Chile, en YYYY-MM-DD. También salta el día UTC
 * en curso: el embed arma esa grilla desde la hora actual y de noche ofrece madrugadas (AGENTS.md).
 * No considera feriados.
 */
export function proximoDiaHabil(now: Date = new Date(), tz: string = TZ): string {
  const hoy = ymdEnZona(tz, now);
  const hoyUtc = now.toISOString().slice(0, 10);
  for (let i = 1; i < 10; i++) {
    const d = sumarDias(hoy, i);
    const w = diaSemana(d);
    if (w !== 0 && w !== 6 && d !== hoyUtc) return d;
  }
  return sumarDias(hoy, 1);
}
