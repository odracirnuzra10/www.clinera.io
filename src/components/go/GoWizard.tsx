"use client";

import { useEffect, useMemo, useState } from "react";
import { CnnLogo, Eyebrow, GRAD, Wordmark } from "@/components/brand-v3/Brand";
import {
  detectLeadSource,
  evaluateQualification,
  newLeadEventId,
  submitContactLead,
  type Form,
} from "@/components/ventas/VentasLanding";
import {
  AGENDA_PATH,
  GO,
  GO_ANALYTICS,
  GO_FAQ,
  GO_TAMANOS,
  GO_WIZARD,
  ULTRA_DEMO_URL,
} from "@/content/planes2";
import { captureGoAttribution } from "@/lib/go-attribution";
import { PARTNER_CNN_VIMEO_SRC } from "@/lib/partners";
import { PHONE_RULES, RESERVA_PHONE_PREFIXES, digitosTelefono, mensajeErrorTelefono, telefonoLocalValido } from "@/lib/telefono";
import { track, trackPixel } from "@/lib/tracking";

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const INK = "#0A0A0A";
const MUTED = "#4B5563";
const gradText = { background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } as const;

// Mismas especialidades que el wizard de /agenda. Dental sigue fuera a propósito
// (pendiente de validar con ventas, ver AGENTS.md).
const ESPECIALIDADES = [
  { id: "medica", label: "Médica" },
  { id: "kinesiologica", label: "Kinesiológica" },
  { id: "estetica", label: "Estética" },
  { id: "salud_mental", label: "Salud mental" },
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = 1 | 2 | 3;

export default function GoWizard() {
  const [step, setStep] = useState<Step>(1);
  const [nombre, setNombre] = useState("");
  const [clinica, setClinica] = useState("");
  const [tipo, setTipo] = useState("");
  const [tamano, setTamano] = useState("");
  const [email, setEmail] = useState("");
  const [prefix, setPrefix] = useState("+56");
  const [phone, setPhone] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [leadCtx, setLeadCtx] = useState<{ eventId: string; leadSource: string } | null>(null);

  useEffect(() => {
    captureGoAttribution(window.location.search);
    track("view_content", {
      lead_source: GO_ANALYTICS.leadSource,
      content_name: GO_ANALYTICS.contentName,
      page_path: "/go",
    });
    trackPixel("ViewContent", {
      content_name: GO_ANALYTICS.contentName,
      content_ids: [GO_ANALYTICS.contentId],
      content_type: "product",
      currency: GO_ANALYTICS.currency,
      value: GO_ANALYTICS.valueUsd,
    });
  }, []);

  // El botón de pago aparece recién en la pantalla 3. `Analytics.tsx` engancha el
  // `client_reference_id` (gclid, GA, fbc, fbp…) solo a los enlaces que existen al
  // cargar o cuando se avisa un cambio de ruta: hay que avisarlo para que lo tome.
  useEffect(() => {
    if (step !== 3) return;
    window.dispatchEvent(new Event("clinera:routechange"));
  }, [step]);

  const rule = PHONE_RULES[prefix];
  const digits = digitosTelefono(phone);
  const phoneOk = telefonoLocalValido(prefix, digits);
  const emailOk = EMAIL_RE.test(email.trim());
  const datosOk = nombre.trim().length >= 2 && clinica.trim().length >= 2 && tipo !== "" && tamano !== "" && emailOk && phoneOk;

  const tamanoOpt = GO_TAMANOS.find((t) => t.id === tamano) ?? null;
  const form: Form = useMemo(
    () => ({
      nombre,
      clinica,
      tipoClinica: (tipo || "") as Form["tipoClinica"],
      prefix,
      phone,
      email,
      website: "",
      city: "",
      cargo: "" as Form["cargo"],
      boxes: tamanoOpt ? { id: tamanoOpt.id, label: tamanoOpt.label } : null,
    }),
    [nombre, clinica, tipo, prefix, phone, email, tamanoOpt],
  );

  function goTo(n: Step) {
    setAttempted(false);
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function continuar() {
    if (!datosOk) {
      setAttempted(true);
      return;
    }
    const ctx = leadCtx ?? { eventId: newLeadEventId(), leadSource: detectLeadSource() };
    if (!leadCtx) setLeadCtx(ctx);
    // `generate_lead` lo traduce GTM a `Lead` de Meta. Va solo por dataLayer: un fbq
    // propio lo contaría doble con la etiqueta de GTM.
    track("generate_lead", {
      lead_source: ctx.leadSource,
      event_id: ctx.eventId,
      plan: "go",
      content_name: GO_ANALYTICS.contentName,
      page_path: "/go",
    });
    // Los datos se guardan ANTES del pago para poder contactar a quien lo abandona.
    // La pantalla 3 no espera a n8n: si el webhook se cuelga, se pierden compras.
    goTo(3);
    void submitContactLead({
      form,
      software: null,
      size: { profile: null },
      qual: evaluateQualification({ profile: null }),
      leadCtx: ctx,
      sourcePath: "/go",
      features: [],
      plan: "go",
    }).then((next) => {
      if (next) setLeadCtx({ eventId: next.eventId, leadSource: next.leadSource });
    });
  }

  // Stripe precarga el correo del paso 2. El `client_reference_id` no se toca: lo arma
  // `Analytics.tsx` con 7 segmentos que n8n separa por «::»; un valor suelto, como el id
  // del lead, n8n lo leería como gclid y ensuciaría la atribución.
  const payUrl = useMemo(() => {
    if (!GO.checkoutUrl) return null;
    try {
      const u = new URL(GO.checkoutUrl);
      if (emailOk) u.searchParams.set("prefilled_email", email.trim());
      return u.toString();
    } catch {
      return GO.checkoutUrl;
    }
  }, [email, emailOk]);

  const verVentas = tamano === "10_plus";

  return (
    <>
      <style jsx global>{`
        .gw-field { display: block; margin: 0 0 18px; }
        .gw-label { display: block; font-family: ${MONO}; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: #6B7280; margin: 0 0 8px; }
        .gw-input {
          width: 100%; box-sizing: border-box; min-height: 52px; padding: 0 14px; border-radius: 12px;
          border: 1px solid #D1D5DB; background: #fff; color: ${INK}; font-family: Inter, sans-serif; font-size: 16px;
          appearance: none; -webkit-appearance: none;
        }
        select.gw-input {
          background-image: linear-gradient(45deg, transparent 50%, #6B7280 50%), linear-gradient(135deg, #6B7280 50%, transparent 50%);
          background-position: calc(100% - 20px) 22px, calc(100% - 14px) 22px; background-size: 6px 6px; background-repeat: no-repeat; padding-right: 36px;
        }
        .gw-input:focus-visible, .gw-chip:focus-visible, .gw-cta:focus-visible, .gw-back:focus-visible { outline: 3px solid rgba(124,58,237,.45); outline-offset: 2px; }
        .gw-input[data-err="true"] { border-color: #DC2626; }
        .gw-phone { display: grid; grid-template-columns: 138px 1fr; gap: 8px; }
        .gw-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .gw-chip {
          min-height: 48px; padding: 0 18px; border-radius: 12px; border: 1px solid #D1D5DB; background: #fff; color: ${INK};
          font-family: Inter, sans-serif; font-size: 15px; font-weight: 600; cursor: pointer;
        }
        .gw-chip[aria-pressed="true"] { border-color: transparent; color: #fff; background: ${GRAD}; }
        .gw-cta {
          display: flex; align-items: center; justify-content: center; width: 100%; box-sizing: border-box; min-height: 56px; padding: 0 24px;
          border-radius: 14px; border: 0; cursor: pointer; text-decoration: none; color: #fff; background: ${GRAD};
          font-family: Inter, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: -0.01em;
          transition: transform .2s ease, filter .2s ease;
        }
        .gw-cta:hover { transform: translateY(-2px); filter: brightness(.97); }
        .gw-back { background: transparent; border: 0; padding: 12px 0; cursor: pointer; font-family: Inter, sans-serif; font-size: 14.5px; font-weight: 600; color: #6B7280; }
        .gw-sec { padding: 72px 24px; }
        .gw-h2 { font-family: Inter; font-size: clamp(26px, 4.4vw, 36px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.08; color: ${INK}; margin: 12px 0 0; }
        @media (max-width: 720px) {
          .gw-sec { padding: 44px 20px !important; }
          .gw-2 { grid-template-columns: 1fr !important; }
          .gw-phone { grid-template-columns: 120px 1fr; }
        }
        @media (prefers-reduced-motion: reduce) { .gw-cta { transition: none !important; } .gw-cta:hover { transform: none !important; } }
      `}</style>

      {/* paddingTop 0: anula `main > div:first-child { padding-top: 112px }` de globals.css (hecha para el navbar). */}
      <div style={{ background: "#fff", minHeight: "100vh", paddingTop: 0 }}>
        <header style={{ maxWidth: 560, margin: "0 auto", padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Wordmark />
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#6B7280" }}>
            Paso {step} de 3
          </span>
        </header>

        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={step}
          aria-label="Progreso"
          style={{ maxWidth: 560, margin: "16px auto 0", padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}
        >
          {[1, 2, 3].map((n) => (
            <span key={n} style={{ height: 4, borderRadius: 999, background: n <= step ? GRAD : "#E5E7EB" }} />
          ))}
        </div>

        <main style={{ maxWidth: 560, margin: "0 auto", padding: "36px 20px 56px" }}>
          {step === 1 && (
            <section data-go-step="1">
              <Eyebrow>Clinera Go! · USD 17/mes</Eyebrow>
              <h1 style={{ fontFamily: "Inter", fontSize: "clamp(34px, 9vw, 48px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.04, color: INK, margin: "14px 0 14px" }}>
                <span style={gradText}>Activa tu cuenta</span> por solo USD 17.
              </h1>
              <p style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 1.55, color: MUTED, margin: "0 0 28px" }}>
                {GO_WIZARD.ofertaTexto}
              </p>
              <p style={{ fontFamily: "Inter", fontSize: 17, fontWeight: 700, color: INK, margin: "0 0 12px" }}>{GO_WIZARD.ofertaPregunta}</p>
              <button type="button" id="go-start" className="gw-cta" onClick={() => goTo(2)}>
                Sí, quiero activarla
              </button>
              <p style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "#6B7280", margin: "16px 0 0", lineHeight: 1.7 }}>
                Sin costo de implementación · Sin permanencia · Cancelas cuando quieras
              </p>
              <p style={{ fontFamily: "Inter", fontSize: 14, color: "#6B7280", margin: "22px 0 0" }}>
                ¿Prefieres hablarlo con una persona?{" "}
                <a
                  href={`${AGENDA_PATH}?plan=go`}
                  data-cta-agendar="wizard"
                  onClick={(ev) => {
                    ev.preventDefault();
                    window.location.href = agendaHref("go");
                  }}
                  style={{ color: "#7C3AED", fontWeight: 600, textDecoration: "none" }}
                >
                  Agenda una reunión con ventas
                </a>
              </p>
            </section>
          )}

          {step === 2 && (
            <section data-go-step="2">
              <h1 style={{ fontFamily: "Inter", fontSize: "clamp(28px, 7vw, 36px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.08, color: INK, margin: "0 0 8px" }}>
                {GO_WIZARD.datosTitulo}
              </h1>
              <p style={{ fontFamily: "Inter", fontSize: 16, color: MUTED, margin: "0 0 26px" }}>{GO_WIZARD.datosTexto}</p>

              <label className="gw-field">
                <span className="gw-label">Tu nombre</span>
                <input className="gw-input" data-err={attempted && nombre.trim().length < 2} value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" />
              </label>
              <label className="gw-field">
                <span className="gw-label">Nombre de tu clínica</span>
                <input className="gw-input" data-err={attempted && clinica.trim().length < 2} value={clinica} onChange={(e) => setClinica(e.target.value)} autoComplete="organization" />
              </label>
              <label className="gw-field">
                <span className="gw-label">Especialidad</span>
                <select className="gw-input" data-err={attempted && tipo === ""} value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="">Elige una</option>
                  {ESPECIALIDADES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="gw-field">
                <span className="gw-label">Profesionales en tu clínica</span>
                <div className="gw-chips" role="group" aria-label="Número de profesionales">
                  {GO_TAMANOS.map((t) => (
                    <button key={t.id} type="button" className="gw-chip" aria-pressed={tamano === t.id} onClick={() => setTamano(t.id)}>
                      {t.label}
                    </button>
                  ))}
                </div>
                {attempted && tamano === "" && <span style={{ fontFamily: "Inter", fontSize: 13, color: "#DC2626", display: "block", marginTop: 6 }}>Elige una opción.</span>}
                {verVentas && (
                  <p style={{ fontFamily: "Inter", fontSize: 13.5, color: MUTED, margin: "10px 0 0", lineHeight: 1.5 }}>
                    Go! es para 1 profesional.{" "}
                    <a href={ULTRA_DEMO_URL} data-cta-agendar="wizard-ultra" style={{ color: "#7C3AED", fontWeight: 600, textDecoration: "none" }}>
                      Hablar con ventas · Ultra
                    </a>
                  </p>
                )}
              </div>
              <label className="gw-field">
                <span className="gw-label">Correo</span>
                <input
                  className="gw-input"
                  data-err={attempted && !emailOk}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@tuclinica.com"
                />
              </label>
              <div className="gw-field">
                <span className="gw-label">WhatsApp</span>
                <div className="gw-phone">
                  <select
                    className="gw-input"
                    aria-label="País del WhatsApp"
                    value={prefix}
                    onChange={(e) => {
                      setPrefix(e.target.value);
                      setPhone("");
                    }}
                  >
                    {RESERVA_PHONE_PREFIXES.map((c) => (
                      <option key={c.prefix} value={c.prefix}>
                        {c.label} {c.prefix}
                      </option>
                    ))}
                  </select>
                  <input
                    className="gw-input"
                    data-err={attempted && !phoneOk}
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={phone}
                    onChange={(e) => setPhone(digitosTelefono(e.target.value).slice(0, rule.len))}
                    placeholder={rule.placeholder}
                  />
                </div>
                {attempted && !phoneOk && (
                  <span style={{ fontFamily: "Inter", fontSize: 13, color: "#DC2626", display: "block", marginTop: 6 }}>{mensajeErrorTelefono(prefix, digits)}</span>
                )}
              </div>

              <button type="button" className="gw-cta" onClick={continuar}>
                Continuar
              </button>
              <button type="button" className="gw-back" onClick={() => goTo(1)}>
                ← Atrás
              </button>
            </section>
          )}

          {step === 3 && (
            <section data-go-step="3">
              <h1 style={{ fontFamily: "Inter", fontSize: "clamp(28px, 7vw, 36px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.08, color: INK, margin: "0 0 18px" }}>
                {GO_WIZARD.pagoTitulo}
              </h1>
              <div style={{ border: "1px solid #E5E7EB", borderRadius: 16, padding: "20px 20px 18px", marginBottom: 20 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B7280" }}>Tu plan</span>
                <p style={{ fontFamily: "Inter", fontSize: 17, fontWeight: 700, color: INK, lineHeight: 1.45, margin: "8px 0 0" }}>{GO_WIZARD.resumen}</p>
              </div>
              {payUrl ? (
                // Sin onClick propio: `Analytics.tsx` cuenta el clic (InitiateCheckout) y arma el
                // `client_reference_id`. Un handler propio contaría el clic doble.
                <a
                  href={payUrl}
                  data-plan="go"
                  data-plan-name={`${GO_ANALYTICS.contentName} contratar`}
                  data-plan-value={GO_ANALYTICS.valueUsd}
                  data-cta-where="wizard-pago"
                  className="gw-cta"
                >
                  {GO_WIZARD.pagoCta}
                </a>
              ) : null}
              <p style={{ fontFamily: "Inter", fontSize: 13.5, color: "#6B7280", lineHeight: 1.55, margin: "14px 0 0" }}>
                Pago seguro con Stripe. Sin costo de implementación y sin permanencia: puedes cancelar cuando quieras.
              </p>
              <button type="button" className="gw-back" onClick={() => goTo(2)}>
                ← Atrás
              </button>
            </section>
          )}
        </main>

        {step === 1 && (
          <>
            <section className="gw-sec" aria-labelledby="go-cnn-title" style={{ background: "#fff", borderTop: "1px solid #F0F0F0" }}>
              <div className="gw-2" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: 36, alignItems: "center" }}>
                <div>
                  <CnnLogo height={30} color="#F03A47" />
                  <span style={{ display: "block", fontFamily: MONO, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#6B7280", margin: "14px 0 0" }}>
                    Clinera en CNN
                  </span>
                  <h2 id="go-cnn-title" className="gw-h2" style={{ margin: "10px 0 12px" }}>
                    Un gran paso para Clinera.
                  </h2>
                  <p style={{ fontFamily: "Inter", fontSize: 16, color: MUTED, lineHeight: 1.55, margin: 0 }}>
                    CNN conoció cómo Clinera ayuda a las clínicas de LATAM a operar con más control.
                  </p>
                </div>
                <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: 16, overflow: "hidden", border: "1px solid #E5E7EB", background: INK }}>
                  <iframe
                    src={PARTNER_CNN_VIMEO_SRC}
                    title="Reportaje de CNN sobre Clinera"
                    loading="lazy"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                  />
                </div>
              </div>
            </section>
            <GoFaq />
          </>
        )}
      </div>
    </>
  );
}

/** Lleva a /agenda conservando la query de la visita (UTM, fbclid, gclid): la atribución del lead depende de ella. */
function agendaHref(plan: string): string {
  if (typeof window === "undefined") return `${AGENDA_PATH}?plan=${plan}`;
  const q = new URLSearchParams(window.location.search);
  q.set("plan", plan);
  return `${AGENDA_PATH}?${q.toString()}`;
}

function GoFaq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="gw-sec" style={{ background: "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h2 className="gw-h2">Todo sobre los planes.</h2>
        </div>
        <div style={{ borderTop: "1px solid #E5E7EB" }}>
          {GO_FAQ.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} style={{ borderBottom: "1px solid #E5E7EB" }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  style={{ width: "100%", textAlign: "left", background: "transparent", border: 0, padding: "18px 4px", display: "flex", justifyContent: "space-between", gap: 20, cursor: "pointer", fontFamily: "Inter" }}
                >
                  <span style={{ fontSize: 16.5, fontWeight: 600, color: INK }}>{it.q}</span>
                  <span aria-hidden style={{ fontSize: 22, color: INK, transform: isOpen ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
                </button>
                {isOpen && <div style={{ padding: "0 4px 18px", fontFamily: "Inter", fontSize: 15, color: MUTED, lineHeight: 1.6 }}>{it.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
