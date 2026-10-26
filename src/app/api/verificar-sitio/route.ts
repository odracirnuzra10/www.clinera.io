// ============================================================================
// POST /api/verificar-sitio — ¿el sitio que escribió el lead existe y es de una
// clínica? (Ricardo, 26-oct-2026)
// ----------------------------------------------------------------------------
// Lo llama /agenda antes de pasar del paso 2. Bloquea dos cosas:
//   no_existe   el dominio no resuelve, no responde, da 404 o está en venta
//   no_clinica  la IA leyó la página y no es de salud ni estética
// Todo lo demás pasa: si el sitio bloquea robots, se dibuja solo con JavaScript
// o la IA falla, el lead sigue («sin_leer» / «sin_verificar») y el estado viaja
// al CRM. Un error nuestro no puede costar un lead real.
//
// Seguridad: el servidor visita una URL que escribió un desconocido. Solo http/https,
// sin puertos ni credenciales, y cada salto de redirección se resuelve por DNS y se
// rechaza si apunta a una IP privada. Se leen como máximo 400 KB.
//
// Config: ANTHROPIC_API_KEY (sin ella no hay IA: decide la heurística de palabras
// y nunca bloquea por «no es clínica»).
// ============================================================================

import { lookup } from "node:dns/promises";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  esEstacionado,
  esIpPrivada,
  extraerTexto,
  normalizarSitio,
  pareceClinica,
  type ResultadoSitio,
} from "@/lib/verificar-sitio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const FETCH_TIMEOUT_MS = 8_000;
const MAX_BYTES = 400_000;
const MAX_SALTOS = 4;
const MIN_TEXTO = 120;
const UA = "Mozilla/5.0 (compatible; ClineraVerificador/1.0; +https://www.clinera.io)";

// ── Rate limit y caché en memoria (por instancia) ───────────────────────────
const golpes = new Map<string, number[]>();
function superaRateLimit(ip: string): boolean {
  const ahora = Date.now();
  const previos = (golpes.get(ip) ?? []).filter((t) => ahora - t < 60_000);
  previos.push(ahora);
  golpes.set(ip, previos);
  if (golpes.size > 500) for (const [k, v] of golpes) if (v.every((t) => ahora - t >= 60_000)) golpes.delete(k);
  return previos.length > 12;
}
const cache = new Map<string, { r: ResultadoSitio; t: number }>();

type Pagina = { tipo: "ok"; status: number; html: string } | { tipo: "no_existe" } | { tipo: "sin_leer" };

async function hostSeguro(host: string): Promise<boolean | "no_resuelve"> {
  try {
    const ips = await lookup(host, { all: true });
    if (!ips.length) return "no_resuelve";
    return ips.every((a) => !esIpPrivada(a.address));
  } catch {
    return "no_resuelve";
  }
}

async function leerCuerpo(res: Response): Promise<string> {
  if (!res.body) return "";
  const reader = res.body.getReader();
  const partes: Uint8Array[] = [];
  let total = 0;
  while (total < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    partes.push(value);
    total += value.byteLength;
  }
  void reader.cancel().catch(() => {});
  return new TextDecoder("utf-8", { fatal: false }).decode(Buffer.concat(partes).subarray(0, MAX_BYTES));
}

async function traer(urlInicial: string): Promise<Pagina> {
  let url = urlInicial;
  for (let salto = 0; salto <= MAX_SALTOS; salto++) {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") return { tipo: "sin_leer" };
    const seguro = await hostSeguro(u.hostname);
    if (seguro === "no_resuelve") return { tipo: "no_existe" };
    if (!seguro) return { tipo: "no_existe" };
    let res: Response;
    try {
      res = await fetch(url, {
        redirect: "manual",
        headers: { "User-Agent": UA, Accept: "text/html,*/*;q=0.5", "Accept-Language": "es,en;q=0.5" },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
    } catch {
      // TLS roto o sin https: se prueba una vez por http antes de darlo por muerto.
      if (salto === 0 && u.protocol === "https:") {
        url = url.replace(/^https:/, "http:");
        continue;
      }
      return { tipo: "no_existe" };
    }
    if (res.status >= 300 && res.status < 400) {
      const destino = res.headers.get("location");
      void res.body?.cancel().catch(() => {});
      if (!destino) return { tipo: "sin_leer" };
      url = new URL(destino, url).toString();
      continue;
    }
    if (res.status === 404 || res.status === 410) return { tipo: "no_existe" };
    if (res.status >= 400) return { tipo: "sin_leer" }; // 403/429/5xx: protección anti-robots
    return { tipo: "ok", status: res.status, html: await leerCuerpo(res) };
  }
  return { tipo: "sin_leer" };
}

const ESQUEMA = {
  type: "object",
  properties: {
    decision: { type: "string", enum: ["clinica", "no_clinica", "insuficiente"] },
    rubro: { type: "string" },
  },
  required: ["decision", "rubro"],
  additionalProperties: false,
} as const;

const SISTEMA = `Recibes el texto de la página de inicio de un sitio web que alguien declaró como el sitio de su clínica.
Decide si el sitio es de un negocio de salud o estética que atiende pacientes: clínica médica, clínica o centro estético, centro médico, consulta de un médico o dentista, clínica dental, kinesiología, nutrición, dermatología, spa médico, centro de depilación láser u otro similar.
Responde "clinica" si lo es.
Responde "no_clinica" si el sitio es claramente de otra cosa: una tienda, una empresa de otro rubro, un medio, un blog, una plantilla vacía, un buscador, una red social o un sitio genérico.
Responde "insuficiente" si el texto no alcanza para decidir.
En "rubro" pon en pocas palabras de qué es el sitio.`;

async function clasificar(host: string, texto: string): Promise<"clinica" | "no_clinica" | "insuficiente" | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const client = new Anthropic({ timeout: 15_000, maxRetries: 1 });
    const res = await client.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 2000,
      system: SISTEMA,
      output_config: { effort: "low", format: { type: "json_schema", schema: ESQUEMA } },
      messages: [{ role: "user", content: `Dominio: ${host}\n\nTexto del sitio:\n${texto}` }],
    });
    if (res.stop_reason === "refusal") return null;
    const bloque = res.content.find((b) => b.type === "text");
    if (!bloque || bloque.type !== "text") return null;
    const { decision } = JSON.parse(bloque.text) as { decision: "clinica" | "no_clinica" | "insuficiente" };
    return decision;
  } catch (e) {
    console.error("[verificar-sitio] IA falló", host, e instanceof Error ? e.message : e);
    return null;
  }
}

async function verificar(valor: string): Promise<ResultadoSitio> {
  const n = normalizarSitio(valor);
  if ("motivo" in n) return { ok: false, motivo: n.motivo };
  const enCache = cache.get(n.host);
  if (enCache && Date.now() - enCache.t < 3_600_000) return enCache.r;

  const pagina = await traer(n.url);
  let r: ResultadoSitio;
  if (pagina.tipo === "no_existe") r = { ok: false, motivo: "no_existe" };
  else if (pagina.tipo === "sin_leer") r = { ok: true, url: n.url, estado: "sin_leer" };
  else {
    const texto = extraerTexto(pagina.html);
    if (esEstacionado(texto)) r = { ok: false, motivo: "no_existe" };
    else if (texto.length < MIN_TEXTO) r = { ok: true, url: n.url, estado: "sin_leer" };
    else {
      const ia = await clasificar(n.host, texto);
      if (ia === "no_clinica") r = { ok: false, motivo: "no_clinica" };
      else if (ia === "clinica") r = { ok: true, url: n.url, estado: "verificado" };
      else if (ia === null && pareceClinica(texto)) r = { ok: true, url: n.url, estado: "verificado" };
      else r = { ok: true, url: n.url, estado: "sin_verificar" };
    }
  }
  if (cache.size > 2000) cache.clear();
  cache.set(n.host, { r, t: Date.now() });
  return r;
}

export async function POST(req: Request) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "?";
  if (superaRateLimit(ip)) return NextResponse.json({ ok: false, error: "Demasiados intentos" }, { status: 429 });
  let valor = "";
  try {
    const body = (await req.json()) as { sitio?: unknown };
    valor = typeof body.sitio === "string" ? body.sitio.slice(0, 300) : "";
  } catch {
    return NextResponse.json({ ok: false, motivo: "formato" }, { status: 400 });
  }
  const r = await verificar(valor);
  console.log("[verificar-sitio]", JSON.stringify({ sitio: valor, ...r }));
  return NextResponse.json(r);
}
