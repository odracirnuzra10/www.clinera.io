"use client";

// Modal «Crea tu cuenta gratis» del sitio (Ricardo, 7-nov-2026). Todo «Regístrate gratis» del sitio
// (enlaces con data-cta-registro: menú, home, planes, tarjeta flotante) abre este modal en la misma página en vez
// de ir a /prueba-gratis: la landing queda solo para los anuncios. Mismo contrato que el modal de la landing
// (public/kimi-gratis/index.html): Lead US$ 3 al pixel + CAPI con el mismo event_id, lead a /api/wizard y
// después app.clinera.io/auth/register con los datos y la atribución.

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { FONO, FONO_AYUDA, FONO_EJEMPLO, fonoOk, limitarFono } from "@/lib/registro-fono";

const PREFIJOS = ["+56", "+52", "+57", "+51", "+54", "+593", "+598", "+1"];
const PLAN_NOMBRE: Record<string, string> = { flux: "Flux", hex: "Hex", xcale: "Xcale" };
const RESUMEN = "Conecta WhatsApp, Facebook e Instagram y agenda pacientes con IA. 7 días, sin tarjeta de crédito.";
const RESUMEN_ASISTENCIA = "Deja tus datos y te abrimos WhatsApp con nuestro equipo.";
// «Solicita asistencia» del sitio (Ricardo, 7-nov-2026) abre este mismo modal en modo asistencia: pide los datos,
// manda el lead y después abre WhatsApp. Solo se intercepta el WhatsApp de ventas genérico: las landings de anuncios
// (/oferta-clinicas-esteticas, /super-promo) llevan su propio mensaje, que es su atribución, y siguen directo.
const WA_ASISTENCIA = "https://wa.me/56985581524?text=necesito%20asistencia";

type Modo = "registro" | "asistencia";

function cookie(n: string): string {
  const m = document.cookie.match(new RegExp("(?:^|; )" + n + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : "";
}

async function sha256(t: string): Promise<string> {
  try {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
    return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join("");
  } catch {
    return "";
  }
}

type Datos = { nombre: string; email: string; clinica: string; prefijo: string; celular: string; telefono: string };

function rutaActual(): string {
  return location.pathname.replace(/\/+$/, "") || "/";
}

// Devuelve el event_id cuando la llamada a CAPI ya salió (keepalive): así no se pierde al cambiar de página.
async function enviarLead(datos: Datos, modo: Modo): Promise<string> {
  const eventId = "lead_web_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const custom = { value: 3, currency: "USD", content_name: modo === "asistencia" ? "web_asistencia" : "web_registro" };
  try {
    const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
    if (typeof fbq === "function") fbq("track", "Lead", custom, { eventID: eventId });
  } catch {}
  const [em, ph] = await Promise.all([sha256(datos.email.toLowerCase()), sha256(datos.telefono.replace(/\D/g, ""))]);
  const ud: Record<string, string> = {};
  if (em) ud.em = em;
  if (ph) ud.ph = ph;
  void fetch("/api/meta/capi", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "Lead", event_id: eventId, event_source_url: location.href, action_source: "website",
        fbp: cookie("_fbp"), fbc: cookie("_fbc"), user_data: ud, custom_data: custom,
      }),
  }).catch(() => {});
  return eventId;
}

function guardarLead(datos: Datos, plan: string, eventId: string, modo: Modo) {
  const q = new URLSearchParams(location.search);
  let lead = "organico";
  if (q.get("gclid") || q.get("gbraid") || q.get("wbraid")) lead = "google-ads";
  else if (q.get("fbclid")) lead = "meta-ads";
  const nombrePlan = PLAN_NOMBRE[plan] ?? "Xcale";
  void fetch("/api/wizard", {
    method: "POST",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lead_stage: "contact",
      booking_status: "pending",
      nombre: datos.nombre,
      email: datos.email,
      nombre_clinica: datos.clinica,
      clinica: datos.clinica,
      telefono: datos.telefono,
      celular: datos.telefono,
      celular_prefix: datos.prefijo,
      celular_digits: datos.celular,
      lead_source: lead,
      fuente: modo === "asistencia" ? `Web ${rutaActual()} — asistencia` : `Web ${rutaActual()} — registro ${nombrePlan}`,
      source_path: rutaActual(),
      landing_url: location.href,
      plan,
      servicio_interes_label: modo === "asistencia" ? "Solicita asistencia" : `${nombrePlan} demo 7 días`,
      servicio_interes: "ambas",
      event_id: eventId,
    }),
  }).catch(() => {});
}

function urlAlta(datos: Datos, plan: string, eventId: string): string {
  const u = new URL("https://app.clinera.io/auth/register");
  u.searchParams.set("nombre", datos.nombre);
  u.searchParams.set("email", datos.email);
  u.searchParams.set("telefono", datos.telefono);
  u.searchParams.set("clinica", datos.clinica);
  u.searchParams.set("plan", plan);
  u.searchParams.set("lead_event_id", eventId);
  const fbp = cookie("_fbp"), fbc = cookie("_fbc");
  if (fbp) u.searchParams.set("fbp", fbp);
  if (fbc) u.searchParams.set("fbc", fbc);
  const q = new URLSearchParams(location.search);
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"]) {
    const v = q.get(k);
    if (v) u.searchParams.set(k, v);
  }
  return u.toString();
}

export default function RegistroModal() {
  const [abierto, setAbierto] = useState(false);
  const [modo, setModo] = useState<Modo>("registro");
  const [plan, setPlan] = useState("xcale");
  const [prefijo, setPrefijo] = useState("+56");
  const [celular, setCelular] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const nombreRef = useRef<HTMLInputElement>(null);

  const cerrar = useCallback(() => setAbierto(false), []);

  // Cualquier enlace «Regístrate gratis» del sitio abre el modal (sin JS, el enlace sigue llevando a la landing).
  useEffect(() => {
    function alClic(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = e.target as Element | null;
      const wa = el?.closest?.(`a[data-cta-asistencia][href="${WA_ASISTENCIA}"]`);
      if (wa) {
        e.preventDefault();
        setModo("asistencia");
        setError("");
        setEnviando(false);
        setAbierto(true);
        return;
      }
      const a = el?.closest?.("a[data-cta-registro]");
      if (!a) return;
      e.preventDefault();
      setModo("registro");
      setEnviando(false);
      const elegido = a.getAttribute("data-plan-elegido") || "xcale";
      setPlan(PLAN_NOMBRE[elegido] ? elegido : "xcale");
      setError("");
      setAbierto(true);
    }
    document.addEventListener("click", alClic);
    return () => document.removeEventListener("click", alClic);
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const t = setTimeout(() => nombreRef.current?.focus(), 30);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    document.addEventListener("keydown", esc);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = overflow;
    };
  }, [abierto, cerrar]);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nombre = String(f.get("nombre") || "").trim();
    const email = String(f.get("email") || "").trim();
    const clinica = String(f.get("clinica") || "").trim();
    const digits = fonoOk(prefijo, celular);
    const correoOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!nombre || !correoOk || !clinica || !digits) {
      setError(
        nombre && correoOk && clinica && !digits
          ? `Revisa el celular. ${FONO_AYUDA[prefijo] ?? ""}`
          : "Completa nombre, celular, correo y el nombre de la clínica.",
      );
      return;
    }
    setError("");
    setEnviando(true);
    const datos: Datos = { nombre, email, clinica, prefijo, celular: digits, telefono: prefijo + digits };
    const eventId = await enviarLead(datos, modo);
    guardarLead(datos, plan, eventId, modo);
    if (modo === "asistencia") {
      const v = window.open(WA_ASISTENCIA, "_blank", "noopener,noreferrer");
      if (!v) location.assign(WA_ASISTENCIA);
      setAbierto(false);
      return;
    }
    try {
      sessionStorage.setItem("clinera_cuenta", JSON.stringify({ ...datos, plan: PLAN_NOMBRE[plan] }));
    } catch {}
    location.assign(urlAlta(datos, plan, eventId));
  }

  if (!abierto) return null;
  const celInvalido = !!error && error.startsWith("Revisa el celular");

  return (
    <div className="reg-modal" role="dialog" aria-modal="true" aria-labelledby="reg-titulo" data-registro-modal>
      <button type="button" className="reg-fondo" aria-label="Cerrar" onClick={cerrar} />
      <form className="reg-card" onSubmit={enviar} noValidate>
        <button type="button" className="reg-x" aria-label="Cerrar registro" onClick={cerrar}>
          ×
        </button>
        <h2 id="reg-titulo">{modo === "asistencia" ? "Solicita asistencia" : "Crea tu cuenta gratis"}</h2>
        <div className="reg-caja">
          <div className="reg-chs" role="img" aria-label="WhatsApp, Facebook, Instagram y agenda">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#25D366" d="M12 2C6.5 2 2 6.3 2 11.6c0 1.9.5 3.7 1.5 5.3L2 22l5.3-1.4c1.5.8 3.2 1.3 4.7 1.3 5.5 0 10-4.3 10-9.6S17.5 2 12 2zm5.7 13.6c-.2.7-1.2 1.2-1.9 1.4-.5.1-1.1.2-3.6-.8-3.1-1.3-5.1-4.5-5.2-4.7-.2-.2-1.3-1.7-1.3-3.3s.8-2.3 1.1-2.6c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.7-.1.3.1 1.9.9 2.2 1.1.3.1.5.2.6.3.1.2.1.8-.1 1.5z" /></svg>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#1877F2" /><path fill="#fff" d="M13.4 21v-7.6h2.5l.4-3h-2.9V8.5c0-.9.3-1.4 1.5-1.4h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8v3h2.5V21z" /></svg>
            <svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="reg-ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#FEDA75" /><stop offset=".45" stopColor="#D62976" /><stop offset="1" stopColor="#4F5BD5" /></linearGradient></defs><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="url(#reg-ig)" strokeWidth="2.2" /><circle cx="12" cy="12" r="4.2" fill="none" stroke="url(#reg-ig)" strokeWidth="2.2" /><circle cx="17.3" cy="6.7" r="1.3" fill="#D62976" /></svg>
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="6" fill="#7C3AED" /><rect x="5.5" y="7" width="13" height="11.5" rx="2" fill="none" stroke="#fff" strokeWidth="1.8" /><path d="M5.5 11h13M9 5v3.5M15 5v3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </div>
          <p data-registro-resumen>{modo === "asistencia" ? RESUMEN_ASISTENCIA : RESUMEN}</p>
        </div>
        <label>
          Nombre
          <input ref={nombreRef} name="nombre" autoComplete="name" required maxLength={80} placeholder="Tu nombre" />
        </label>
        <label>
          Celular
          <span className="reg-phone">
            <select
              name="prefijo"
              aria-label="Prefijo del país"
              value={prefijo}
              onChange={(e) => {
                setPrefijo(e.target.value);
                setCelular((c) => limitarFono(e.target.value, c));
              }}
            >
              {PREFIJOS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              name="celular"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              required
              placeholder={FONO_EJEMPLO[prefijo]}
              value={celular}
              aria-invalid={celInvalido || undefined}
              onChange={(e) => setCelular(limitarFono(prefijo, e.target.value))}
              maxLength={FONO[prefijo] ? undefined : 15}
            />
          </span>
        </label>
        <label>
          Correo
          <input name="email" type="email" autoComplete="email" inputMode="email" required maxLength={120} placeholder="tu@correo.com" />
        </label>
        <label>
          Nombre de la clínica
          <input name="clinica" autoComplete="organization" required maxLength={120} placeholder="Ej.: Clínica Aurora" />
        </label>
        {error ? (
          <p className="reg-error" role="alert" data-registro-error>
            {error}
          </p>
        ) : null}
        <button type="submit" className="reg-enviar" disabled={enviando} data-registro-enviar>
          {modo === "asistencia"
            ? enviando ? "Abriendo WhatsApp…" : "Abrir WhatsApp"
            : enviando ? "Abriendo tu registro…" : "Registra y activa tu clínica"}
        </button>
        <p className="reg-nota">
          {modo === "asistencia" ? "Te responde una persona del equipo." : "Después terminas tu registro en app.clinera.io."}
        </p>
      </form>
      <style jsx global>{`
        .reg-modal{position:fixed;inset:0;z-index:210;display:grid;place-items:center;padding:16px;font-family:Inter,system-ui,sans-serif}
        .reg-fondo{position:absolute;inset:0;background:rgba(17,24,39,.5);border:0;cursor:pointer}
        .reg-card{position:relative;width:min(440px,100%);max-height:min(92dvh,680px);overflow:auto;background:#fff;color:#111827;border-radius:20px;padding:24px 22px;box-shadow:0 18px 50px rgba(17,24,39,.25)}
        .reg-x{position:absolute;top:12px;right:12px;width:44px;height:44px;border:0;border-radius:999px;background:#F5F3FF;color:#5B21B6;font-size:24px;line-height:1;cursor:pointer}
        .reg-card h2{font-size:28px;font-weight:800;letter-spacing:-.03em;line-height:1.1;margin:0 0 12px;padding-right:44px;color:#0B0D12}
        .reg-caja{background:#F7F5FF;border:1px solid #EDE9FE;border-radius:12px;padding:12px 14px;margin:0 0 16px}
        .reg-chs{display:flex;gap:8px;margin:0 0 8px}
        .reg-chs svg{width:22px;height:22px}
        .reg-caja p{margin:0;font-size:15px;line-height:1.45;font-weight:600;color:#374151}
        .reg-card label{display:block;margin:0 0 12px;font-weight:650;font-size:14.5px;color:#111827}
        .reg-card input,.reg-card select{display:block;width:100%;box-sizing:border-box;margin-top:6px;min-height:48px;padding:12px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font:400 16px/1.3 Inter,system-ui,sans-serif;color:#111827;background:#fff}
        .reg-card input:focus,.reg-card select:focus{outline:2px solid #7C3AED;outline-offset:1px}
        .reg-card input[aria-invalid]{border-color:#B91C1C}
        .reg-phone{display:grid;grid-template-columns:96px 1fr;gap:8px;margin-top:6px}
        .reg-phone input,.reg-phone select{margin-top:0}
        .reg-error{color:#B91C1C;font-weight:650;font-size:14.5px;margin:0 0 12px}
        .reg-enviar{width:100%;min-height:52px;border:0;border-radius:12px;background:linear-gradient(90deg,#2563EB,#7C3AED 55%,#C026D3);color:#fff;font:700 16px/1.2 Inter,system-ui,sans-serif;cursor:pointer}
        .reg-enviar:disabled{opacity:.7;cursor:wait}
        .reg-nota{margin:10px 0 0;text-align:center;font-size:13px;color:#6B7280}
        @media (max-width:640px){
          .reg-modal{place-items:end center;padding:0}
          .reg-card{width:100%;border-radius:20px 20px 0 0;padding:22px 18px calc(18px + env(safe-area-inset-bottom));max-height:94dvh}
        }
      `}</style>
    </div>
  );
}
