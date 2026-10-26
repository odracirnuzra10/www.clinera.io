// ============================================================================
// Verificación del sitio web de la clínica (Ricardo, 26-oct-2026)
// ----------------------------------------------------------------------------
// Clinera apunta a clínicas medianas: una clínica establecida tiene sitio web.
// /agenda lo exige y, antes de dejar pasar el formulario, comprueba en el
// servidor (`/api/verificar-sitio`) que el sitio exista y que sea de una
// clínica. Así Meta no aprende de leads falsos.
//
// Este archivo es la parte pura (sin red): normalizar lo que escribió la
// persona, reconocer redes sociales, extraer el texto de la página y la
// heurística de respaldo cuando no hay IA. La red y la IA viven en la ruta.
// ============================================================================

export type MotivoRechazo = "formato" | "red_social" | "no_existe" | "no_clinica";

export type ResultadoSitio =
  | { ok: true; url: string; estado: "verificado" | "sin_leer" | "sin_verificar" }
  | { ok: false; motivo: MotivoRechazo };

/** Texto que ve la persona en el formulario por cada motivo. */
export const MENSAJE_SITIO: Record<MotivoRechazo, string> = {
  formato: "Escribe el sitio web de tu clínica (por ejemplo, www.tuclinica.cl).",
  red_social: "Necesitamos el sitio web de tu clínica, no una red social.",
  no_existe: "No pudimos abrir ese sitio. Revisa que esté bien escrito.",
  no_clinica: "Este sitio no corresponde a una clínica. Por favor verifica.",
};

// Redes sociales, enlaces de bio, mensajería y buscadores: no son el sitio de una clínica.
const NO_SON_SITIO =
  /(^|\.)(instagram\.com|facebook\.com|fb\.com|fb\.me|tiktok\.com|linkedin\.com|twitter\.com|x\.com|youtube\.com|youtu\.be|wa\.me|whatsapp\.com|linktr\.ee|linkin\.bio|beacons\.ai|bio\.link|taplink\.cc|t\.me|google\.com|google\.cl|goo\.gl|maps\.app\.goo\.gl|bit\.ly)$/i;

/** Lo que escribió la persona → URL https normalizada, o un rechazo de forma. */
export function normalizarSitio(valor: string): { url: string; host: string } | { motivo: MotivoRechazo } {
  const v = valor.trim();
  if (v.startsWith("@")) return { motivo: "red_social" };
  if (v.length < 4 || /\s/.test(v)) return { motivo: "formato" };
  let u: URL;
  try {
    u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
  } catch {
    return { motivo: "formato" };
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return { motivo: "formato" };
  if (u.username || u.password || u.port) return { motivo: "formato" };
  const host = u.hostname.toLowerCase().replace(/\.$/, "");
  // Un dominio de verdad: al menos un punto, TLD de letras, nada de IP.
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(host)) return { motivo: "formato" };
  if (NO_SON_SITIO.test(host)) return { motivo: "red_social" };
  return { url: `https://${host}${u.pathname === "/" ? "" : u.pathname}`, host };
}

/** IPv4/IPv6 privada, local o reservada: el servidor nunca las visita. */
export function esIpPrivada(ip: string): boolean {
  const v4 = ip.replace(/^::ffff:/i, "");
  const m = v4.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    return (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19))
    );
  }
  const x = ip.toLowerCase();
  return x === "::" || x === "::1" || x.startsWith("fc") || x.startsWith("fd") || x.startsWith("fe80");
}

/** Título, descripción y texto visible de una página, acotado para la IA. */
export function extraerTexto(html: string, max = 6000): string {
  const titulo = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const desc =
    html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] ??
    html.match(/<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']*)["']/i)?.[1] ??
    "";
  const cuerpo = html
    .replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  const limpiar = (s: string) =>
    s
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&#?\w+;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  return limpiar(`${titulo} · ${desc} · ${cuerpo}`).slice(0, max);
}

// Dominio estacionado o en venta: existe en DNS pero no es el sitio de nadie.
const ESTACIONADO =
  /(this domain (is|may be) for sale|domain is for sale|buy this domain|parked (free|domain)|dominio (está )?en venta|este dominio (est[áa] )?(a la venta|disponible)|sedo domain parking|hugedomains|dan\.com|godaddy.{0,40}(for sale|parked))/i;

export function esEstacionado(texto: string): boolean {
  return ESTACIONADO.test(texto);
}

// Respaldo sin IA: palabras de salud o estética. Sirve para no bloquear a nadie si la
// IA no está configurada; con la IA, esto no decide.
const PALABRAS_CLINICA =
  /\b(cl[íi]nica|centro (m[ée]dico|est[ée]tico|de salud)|m[ée]dic[oa]s?|doctor[ae]?s?|dra?\.|est[ée]tica|dermatolog|odontolog|dental|dentista|kinesiolog|fisioterap|nutrici|psicolog|pediatr|ginecolog|cirug[íi]a|tratamientos?|pacientes?|consulta|botox|toxina|[áa]cido hialur[óo]nico|depilaci[óo]n l[áa]ser|spa m[ée]dico|salud)\b/gi;

export function pareceClinica(texto: string): boolean {
  const hits = new Set((texto.match(PALABRAS_CLINICA) ?? []).map((s) => s.toLowerCase()));
  return hits.size >= 2;
}
