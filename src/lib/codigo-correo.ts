// ============================================================================
// Código de verificación al correo de la clínica (Ricardo, 26-oct-2026)
// ----------------------------------------------------------------------------
// La clínica sin sitio web puede probar que existe con un correo de dominio
// propio: se le manda un código de 6 dígitos y lo escribe en el formulario.
// Sin base de datos: el servidor devuelve un sobre firmado (HMAC) con el correo,
// el hash del código y el vencimiento; al confirmar se vuelve a calcular.
// Sólo servidor (usa node:crypto).
// ============================================================================

import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

const VIGENCIA_MS = 15 * 60_000;

function secreto(): string {
  return process.env.CODIGO_CORREO_SECRET || process.env.WIZARD_FORM_SECRET || "";
}

const firmar = (texto: string) => createHmac("sha256", secreto()).update(texto).digest("base64url");

export function codigoConfigurado(): boolean {
  return Boolean(secreto() && process.env.POSTMARK_SERVER_TOKEN && process.env.POSTMARK_FROM);
}

export function nuevoCodigo(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/** Sobre que viaja al navegador: no contiene el código, solo su firma. */
export function sellar(correo: string, codigo: string, ahora = Date.now()): string {
  const vence = ahora + VIGENCIA_MS;
  const cuerpo = `${correo.toLowerCase()}|${vence}`;
  return `${vence}.${firmar(`${cuerpo}|${codigo}`)}`;
}

export function abrir(correo: string, codigo: string, sobre: string, ahora = Date.now()): boolean {
  const [venceTxt, firma] = sobre.split(".");
  const vence = Number(venceTxt);
  if (!vence || !firma || ahora > vence || !/^\d{6}$/.test(codigo)) return false;
  const esperado = firmar(`${correo.toLowerCase()}|${vence}|${codigo}`);
  const a = Buffer.from(esperado);
  const b = Buffer.from(firma);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function enviarCodigo(correo: string, codigo: string): Promise<boolean> {
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;color:#111318">
<p>Hola,</p>
<p>Tu código para verificar el correo de tu clínica en Clinera es:</p>
<p style="font-size:32px;font-weight:700;letter-spacing:6px;margin:18px 0">${codigo}</p>
<p style="color:#5b6472">Vence en 15 minutos. Si no lo pediste, ignora este correo.</p>
</div>`;
  try {
    const res = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN || "",
      },
      body: JSON.stringify({
        From: process.env.POSTMARK_FROM,
        To: correo,
        Subject: `Tu código de Clinera: ${codigo}`,
        HtmlBody: html,
        TextBody: `Tu código para verificar el correo de tu clínica en Clinera es ${codigo}. Vence en 15 minutos.`,
        MessageStream: "outbound",
        Tag: "agenda-codigo-correo",
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error("[codigo-correo] Postmark", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (e) {
    console.error("[codigo-correo] Postmark falló", e instanceof Error ? e.message : e);
    return false;
  }
}
