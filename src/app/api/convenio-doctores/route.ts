// ============================================================================
// Convenio doctores — postulación por correo a Ricardo
// ----------------------------------------------------------------------------
// Wizard propio, no el de /hablar-con-ventas. El navegador postea acá (sin SMTP en el
// bundle). El servidor manda nombre, correo y motivo a ricardo@oacg.cl.
// Reply-To = el correo del doctor, para responderle directo.
//
//   Navegador  →  POST /api/convenio-doctores
//   Servidor   →  SMTP  (mismas vars que cotizaciones: SMTP_USER / SMTP_PASS)
//
// Si falta SMTP: 503. Una postulación que se pierde en silencio es peor
// que un error visible.
// ============================================================================

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { PARTNERS_DOCTORS_EMAIL } from "@/content/partners-program";
import {
  normalizarPostulacion,
  validarPostulacion,
  type PostulacionDoctores,
} from "@/lib/convenio-doctores";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIMEOUT_MS = 15_000;
const VENTANA_MS = 60_000;
const MAX_POR_VENTANA = 3;
const golpes = new Map<string, number[]>();

function smtpListo(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function superaRateLimit(ip: string): boolean {
  const ahora = Date.now();
  const previos = (golpes.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  previos.push(ahora);
  golpes.set(ip, previos);
  if (golpes.size > 500) {
    for (const [clave, marcas] of golpes) {
      if (marcas.every((t) => ahora - t >= VENTANA_MS)) golpes.delete(clave);
    }
  }
  return previos.length > MAX_POR_VENTANA;
}

function respuestaError(errores: string[], status: number) {
  return NextResponse.json({ ok: false, errores }, { status });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  const h = await headers();
  const origin = h.get("origin");
  if (origin) {
    const host = h.get("host");
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = "";
    }
    if (!host || originHost !== host) {
      return respuestaError(["Origen no permitido."], 403);
    }
  }

  const ip =
    (h.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    (h.get("x-real-ip") ?? "") ||
    "desconocida";

  if (superaRateLimit(ip)) {
    return respuestaError(
      ["Demasiadas postulaciones seguidas. Espera un minuto e inténtalo de nuevo."],
      429,
    );
  }

  let crudo: Partial<PostulacionDoctores>;
  try {
    crudo = (await request.json()) as Partial<PostulacionDoctores>;
  } catch {
    return respuestaError(["No pudimos leer el formulario."], 400);
  }

  const payload = normalizarPostulacion(crudo);
  const errores = validarPostulacion(payload);
  if (errores.length) return respuestaError(errores, 400);

  if (!smtpListo()) {
    return respuestaError(
      [
        "El envío todavía no está conectado (falta SMTP). Avísale al equipo técnico.",
      ],
      503,
    );
  }

  const transporte = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const nombre = escapeHtml(payload.nombre);
  const correo = escapeHtml(payload.correo);
  const motivo = escapeHtml(payload.motivo).replace(/\n/g, "<br>");

  const mail = {
    from: process.env.COTIZACION_EMAIL_FROM || `Clinera <${process.env.SMTP_USER}>`,
    to: PARTNERS_DOCTORS_EMAIL,
    replyTo: `${payload.nombre} <${payload.correo}>`,
    subject: `Convenio doctores — ${payload.nombre}`,
    html: `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; color: #111318;">
  <p style="font-size: 13px; color: #656a76; margin: 0 0 16px;">Postulación al convenio doctores · clinera.io/convenio-doctores</p>
  <p style="margin: 0 0 8px;"><b>Nombre</b><br>${nombre}</p>
  <p style="margin: 0 0 8px;"><b>Correo</b><br>${correo}</p>
  <p style="margin: 0;"><b>Motivo</b><br>${motivo}</p>
</div>`,
    text: [
      "Postulación al convenio doctores",
      "",
      `Nombre: ${payload.nombre}`,
      `Correo: ${payload.correo}`,
      "",
      "Motivo:",
      payload.motivo,
    ].join("\n"),
  };

  try {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        transporte.sendMail(mail),
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS);
        }),
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  } catch {
    return respuestaError(
      ["No pudimos enviar tu postulación. Revisa tu conexión e inténtalo de nuevo."],
      502,
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
