"use client";

import { useEffect, useMemo, useState } from "react";
import { GRAD, Wordmark } from "@/components/brand-v3/Brand";
import { ChannelLogo } from "@/components/pricing/PlanChannelLogos";
import {
  detectLeadSource,
  evaluateQualification,
  newLeadEventId,
  submitContactLead,
  type Form,
} from "@/components/ventas/VentasLanding";
import {
  GO,
  GO_ANALYTICS,
  GO_TAMANOS,
  GO_PRUEBA_SOCIAL,
  GO_WIZARD,
} from "@/content/planes2";
import { captureGoAttribution } from "@/lib/go-attribution";
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

  return (
    <>
      <style jsx global>{`
        .gw-field { display: block; margin: 0 0 12px; }
        .gw-label { display: block; font-family: ${MONO}; font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; color: #6B7280; margin: 0 0 5px; }
        .gw-input {
          width: 100%; box-sizing: border-box; min-height: 46px; padding: 0 14px; border-radius: 12px;
          border: 1px solid #D1D5DB; background: #fff; color: ${INK}; font-family: Inter, sans-serif; font-size: 16px;
          appearance: none; -webkit-appearance: none;
        }
        select.gw-input {
          background-image: linear-gradient(45deg, transparent 50%, #6B7280 50%), linear-gradient(135deg, #6B7280 50%, transparent 50%);
          background-position: calc(100% - 20px) 19px, calc(100% - 14px) 19px; background-size: 6px 6px; background-repeat: no-repeat; padding-right: 36px;
        }
        .gw-input:focus-visible, .gw-chip:focus-visible, .gw-cta:focus-visible, .gw-back:focus-visible { outline: 3px solid rgba(124,58,237,.45); outline-offset: 2px; }
        .gw-input[data-err="true"] { border-color: #DC2626; }
        .gw-phone { display: grid; grid-template-columns: 138px 1fr; gap: 8px; }
        .gw-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .gw-chip {
          min-height: 42px; padding: 0 16px; border-radius: 12px; border: 1px solid #D1D5DB; background: #fff; color: ${INK};
          font-family: Inter, sans-serif; font-size: 15px; font-weight: 600; cursor: pointer;
        }
        .gw-chip[aria-pressed="true"] { border-color: transparent; color: #fff; background: ${GRAD}; }
        .gw-cta {
          display: flex; align-items: center; justify-content: center; width: 100%; box-sizing: border-box; min-height: 54px; padding: 0 24px;
          border-radius: 14px; border: 0; cursor: pointer; text-decoration: none; color: #fff; background: ${GRAD};
          font-family: Inter, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: -0.01em;
          transition: transform .2s ease, filter .2s ease;
        }
        .gw-cta:hover { transform: translateY(-2px); filter: brightness(.97); }
        .gw-back { background: transparent; border: 0; padding: 8px 0; cursor: pointer; font-family: Inter, sans-serif; font-size: 14.5px; font-weight: 600; color: #6B7280; }
        .gw-kicker { display: block; font-family: Inter, sans-serif; font-size: clamp(22px, 6.6vw, 30px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; color: ${INK}; }
        .gw-price { display: block; font-family: Inter, sans-serif; font-size: clamp(76px, 25vw, 124px); font-weight: 800; letter-spacing: -0.055em; line-height: .98; margin: 2px 0 0; }
        .gw-stat { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 14px; padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 16px; background: #FAFAFA; }
        .gw-stat-n { font-family: Inter, sans-serif; font-size: clamp(40px, 12vw, 52px); font-weight: 800; letter-spacing: -0.04em; line-height: 1; min-width: 3.1ch; }
        .gw-stat-l { font-family: Inter, sans-serif; font-size: 16px; font-weight: 600; line-height: 1.3; color: ${INK}; }
        .gw-logos { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
        .gw-proof { display: block; width: 100%; height: auto; aspect-ratio: 16 / 6; object-fit: cover; object-position: 50% 36%; }
        @media (max-width: 720px) {
          .gw-phone { grid-template-columns: 120px 1fr; }
        }
        @media (max-height: 700px) {
          .gw-field { margin-bottom: 7px; }
          .gw-label { margin-bottom: 3px; }
          .gw-input { min-height: 41px; }
          .gw-chip { min-height: 38px; }
          .gw-sub { display: none; }
          .gw-pitch { display: none; }
          .gw-proof { aspect-ratio: 16 / 5; }
          .gw-back { padding: 4px 0; }
        }
        @media (max-height: 760px) {
          .gw-price { font-size: clamp(60px, 19vw, 92px); }
          .gw-stat { padding: 8px 14px; }
          .gw-stat-n { font-size: 36px; }
          .gw-stat-l { font-size: 14.5px; }
        }
        @media (prefers-reduced-motion: reduce) { .gw-cta { transition: none !important; } .gw-cta:hover { transform: none !important; } }
      `}</style>

      {/* paddingTop 0: anula `main > div:first-child { padding-top: 112px }` de globals.css (hecha para el navbar). */}
      <div style={{ background: "#fff", minHeight: "100dvh", paddingTop: 0 }}>
        <header style={{ maxWidth: 560, margin: "0 auto", padding: "14px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
          style={{ maxWidth: 560, margin: "12px auto 0", padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}
        >
          {[1, 2, 3].map((n) => (
            <span key={n} style={{ height: 4, borderRadius: 999, background: n <= step ? GRAD : "#E5E7EB" }} />
          ))}
        </div>

        <div style={{ maxWidth: 560, margin: "0 auto", padding: "18px 20px 12px" }}>
          {step === 1 && (
            <section data-go-step="1">
              <h1 style={{ margin: 0 }}>
                <span className="gw-kicker">Activa tu cuenta por solo</span>
                <span className="gw-price" style={gradText}>
                  USD&nbsp;17.
                </span>
              </h1>
              <div style={{ display: "grid", gap: 8, margin: "14px 0 10px" }} data-go-incluye>
                <div className="gw-stat">
                  <span className="gw-stat-n" style={gradText}>{GO.conversations}</span>
                  <span className="gw-stat-l">
                    conversaciones por WhatsApp, Facebook e Instagram
                    <span className="gw-logos" data-go-canales>
                      <ChannelLogo channel="whatsapp" size={24} />
                      <ChannelLogo channel="facebook" size={24} />
                      <ChannelLogo channel="instagram" size={24} />
                    </span>
                  </span>
                </div>
                <div className="gw-stat">
                  <span className="gw-stat-n" style={gradText}>{GO.agendamientos}</span>
                  <span className="gw-stat-l">agendamientos</span>
                </div>
              </div>
              <p className="gw-pitch" style={{ fontFamily: "Inter", fontSize: 15, color: MUTED, margin: "0 0 14px" }}>Prueba el poder de Clinera ahora.</p>
              <p style={{ fontFamily: "Inter", fontSize: 16, fontWeight: 700, color: INK, margin: "0 0 8px" }}>{GO_WIZARD.ofertaPregunta}</p>
              <button type="button" id="go-start" className="gw-cta" onClick={() => goTo(2)}>
                Sí, quiero activarla
              </button>
              <p style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".07em", textTransform: "uppercase", color: "#6B7280", margin: "10px 0 0", lineHeight: 1.6 }}>
                Sin costo de implementación · Sin permanencia · Cancelas cuando quieras
              </p>
            </section>
          )}

          {step === 2 && (
            <section data-go-step="2">
              <h1 style={{ fontFamily: "Inter", fontSize: "clamp(24px, 6.4vw, 30px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.08, color: INK, margin: "0 0 4px" }}>
                {GO_WIZARD.datosTitulo}
              </h1>
              <p className="gw-sub" style={{ fontFamily: "Inter", fontSize: 14.5, color: MUTED, margin: "0 0 14px" }}>{GO_WIZARD.datosTexto}</p>

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
        </div>

        {step === 1 && (
          // Imagen fija del reportaje de CNN (no el reproductor): prueba social sin sacar al
          // visitante del wizard. Es un fotograma del mismo video de /plataforma.
          <figure data-go-cnn style={{ maxWidth: 560, margin: "0 auto", padding: "2px 20px 12px" }}>
            <div style={{ position: "relative", overflow: "hidden", borderRadius: 14, border: "1px solid #E5E7EB", background: INK }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="gw-proof"
                src="/images/go/cnn-clinera.jpg"
                alt="Entrevista de CNN Chile a Clinera"
                width={1280}
                height={720}
                loading="lazy"
              />
              <figcaption
                style={{
                  position: "absolute",
                  inset: "auto 0 0 0",
                  padding: "26px 14px 10px",
                  background: "linear-gradient(180deg, rgba(10,10,20,0) 0%, rgba(10,10,20,.88) 100%)",
                  fontFamily: "Inter",
                  fontSize: "clamp(14.5px, 4.2vw, 18px)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  color: "#fff",
                }}
              >
                {GO_PRUEBA_SOCIAL}
              </figcaption>
            </div>
          </figure>
        )}
      </div>
    </>
  );
}
