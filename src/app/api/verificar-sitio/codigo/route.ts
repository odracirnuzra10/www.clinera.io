// ============================================================================
// POST /api/verificar-sitio/codigo — la clínica sin sitio web verifica su correo
// empresarial (Ricardo, 26-oct-2026).
//
//   { accion: "enviar", correo }                 → { ok, sobre }  (manda el código)
//   { accion: "confirmar", correo, codigo, sobre } → { ok }
//
// Solo correos de dominio propio (no Gmail, Hotmail…) cuyo dominio reciba correo
// (registro MX, o A como MX implícito). Config: POSTMARK_SERVER_TOKEN, POSTMARK_FROM (remitente
// verificado en Postmark) y CODIGO_CORREO_SECRET (o WIZARD_FORM_SECRET).
// Sin config responde { ok:false, motivo:"sin_envio" } y el formulario ofrece
// el documento tributario.
// ============================================================================

import { lookup, resolveMx } from "node:dns/promises";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { abrir, codigoConfigurado, enviarCodigo, nuevoCodigo, sellar } from "@/lib/codigo-correo";
import { dominioCorreoEmpresarial } from "@/lib/id-tributario";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const golpes = new Map<string, number[]>();
function supera(clave: string, max: number, ventanaMs: number): boolean {
  const ahora = Date.now();
  const previos = (golpes.get(clave) ?? []).filter((t) => ahora - t < ventanaMs);
  previos.push(ahora);
  golpes.set(clave, previos);
  if (golpes.size > 2000) for (const [k, v] of golpes) if (v.every((t) => ahora - t >= 600_000)) golpes.delete(k);
  return previos.length > max;
}

async function recibeCorreo(dominio: string): Promise<boolean> {
  try {
    const mx = await resolveMx(dominio);
    if (mx.some((r) => r.exchange && r.exchange !== ".")) return true;
  } catch {
    /* sin MX: se prueba el registro A (MX implícito, RFC 5321) */
  }
  try {
    return (await lookup(dominio, { all: true })).length > 0;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "?";
  let body: { accion?: string; correo?: string; codigo?: string; sobre?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, motivo: "formato" }, { status: 400 });
  }
  const correo = String(body.correo ?? "").trim().toLowerCase().slice(0, 200);
  const dominio = dominioCorreoEmpresarial(correo);

  if (body.accion === "confirmar") {
    if (supera(`c:${ip}`, 10, 60_000) || supera(`ce:${correo}`, 8, 600_000)) {
      return NextResponse.json({ ok: false, motivo: "intentos" }, { status: 429 });
    }
    const ok = Boolean(dominio) && abrir(correo, String(body.codigo ?? "").trim(), String(body.sobre ?? ""));
    return NextResponse.json(ok ? { ok: true } : { ok: false, motivo: "codigo" });
  }

  if (body.accion !== "enviar") return NextResponse.json({ ok: false, motivo: "formato" }, { status: 400 });
  if (!dominio) return NextResponse.json({ ok: false, motivo: "gratuito" });
  if (supera(`e:${ip}`, 5, 60_000) || supera(`ee:${correo}`, 3, 600_000)) {
    return NextResponse.json({ ok: false, motivo: "intentos" }, { status: 429 });
  }
  if (!(await recibeCorreo(dominio))) return NextResponse.json({ ok: false, motivo: "no_existe" });
  if (!codigoConfigurado()) return NextResponse.json({ ok: false, motivo: "sin_envio" });
  const codigo = nuevoCodigo();
  if (!(await enviarCodigo(correo, codigo))) return NextResponse.json({ ok: false, motivo: "sin_envio" });
  console.log("[codigo-correo] enviado", dominio);
  return NextResponse.json({ ok: true, sobre: sellar(correo, codigo) });
}
