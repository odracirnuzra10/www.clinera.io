"use client";

// ============================================================================
// /clinica-estetica — landing de Google Ads para clínicas estéticas
// (Ricardo, 18-oct-2026)
//
// POR QUÉ ASÍ
// -----------
// Reservo y Medilink piden pocos datos en el primer pliegue y después llevan a
// elegir la hora de la reunión. Acá es igual: un wizard de 2 pasos
//   1. nombre, tipo de clínica, correo y WhatsApp;
//   2. el MISMO calendario de /agenda (`StepClineraScheduler`, importado).
// No se copia el calendario: copiarlo sería mantener dos que se desincronizan
// (ver /reserva-tu-hora).
//
// MEDICIÓN
// --------
// Igual que /agenda: `agenda_landing_view` → `agenda_form_start` →
// `agenda_step_complete` (step 1) → `ventas_submit_lead` → reserva
// (`ventas_booking_confirmed` + Schedule/MQL). El MQL se gana agendando, no
// al llenar el paso 1. El calendario NO espera al webhook: si n8n se cuelga,
// se pierden leads.
//
// Copy del nicho: `src/content/estetica.ts`.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/brand-v3/Brand";
import EsteticaSection from "./EsteticaSection";
import {
  ESTETICA_LP_FAQ,
  ESTETICA_ORIGEN,
  PERFILES_ESTETICA,
  TRATAMIENTOS_PRECARGADOS,
  type PerfilEsteticaId,
} from "@/content/estetica";
import {
  detectLeadSource,
  evaluateQualification,
  newLeadEventId,
  pushDL,
  StepClineraScheduler,
  submitBookingConfirmation,
  submitContactLead,
  textoReserva,
  type CalBooking,
  type Form,
} from "@/components/ventas/VentasLanding";
import {
  RESERVA_PHONE_PREFIXES,
  aE164,
  digitosTelefono,
  formatearTelefono,
  mensajeErrorTelefono,
  reglaTelefono,
} from "@/lib/telefono";
import { zonaMostrada } from "@/lib/timezone";
import styles from "./EsteticaAdsLanding.module.css";

export const SOURCE_PATH = "/clinica-estetica";
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mismas zonas que /agenda: un mexicano que ve "+56" cree que el formulario no
// es para él.
const MX_TZ = /^America\/(Mexico_City|Cancun|Merida|Monterrey|Matamoros|Chihuahua|Ciudad_Juarez|Ojinaga|Mazatlan|Hermosillo|Tijuana|Bahia_Banderas)$/;

const BENEFICIOS = [
  "Ficha de estética facial y corporal, con fotos y consentimientos",
  "Presupuestos faciales y corporales enviados por WhatsApp",
  `${TRATAMIENTOS_PRECARGADOS.map((t) => t.nombre).join(", ").replace(/, ([^,]*)$/, " y $1")} ya cargados`,
  "AURA agenda, confirma y recupera pacientes por WhatsApp 24/7",
];

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function irAlFormulario() {
  document.getElementById("agenda-demo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => document.getElementById("ce-nombre")?.focus({ preventScroll: true }), 500);
}

export default function EsteticaAdsLanding({ tzIp = "" }: { tzIp?: string }) {
  const [paso, setPaso] = useState<1 | 2>(1);
  const [nombre, setNombre] = useState("");
  const [perfilId, setPerfilId] = useState<PerfilEsteticaId | "">("");
  const [email, setEmail] = useState("");
  const [prefix, setPrefix] = useState(() => (MX_TZ.test(tzIp) ? "+52" : "+56"));
  const [phone, setPhone] = useState("");
  const [intentado, setIntentado] = useState(false);
  const [booking, setBooking] = useState<CalBooking | null>(null);
  const [leadCtx, setLeadCtx] = useState<{ eventId: string; leadSource: string } | null>(null);
  const formStarted = useRef(false);
  const bookingSent = useRef(false);

  useEffect(() => {
    pushDL("agenda_landing_view", { source_path: SOURCE_PATH });
  }, []);

  function marcarInicio() {
    if (formStarted.current) return;
    formStarted.current = true;
    pushDL("agenda_form_start", { source_path: SOURCE_PATH });
  }

  const perfil = PERFILES_ESTETICA.find((p) => p.id === perfilId) ?? null;
  const digitos = digitosTelefono(phone);
  const phoneError = mensajeErrorTelefono(prefix, digitos);
  const phoneOk = phoneError === null;
  const nombreOk = nombre.trim().length >= 2;
  const emailOk = EMAIL_OK.test(email.trim());
  const datosOk = nombreOk && !!perfil && emailOk && phoneOk;
  const rule = reglaTelefono(prefix);

  const form: Form = {
    nombre,
    clinica: "",
    tipoClinica: (perfil?.tipoClinica ?? "") as Form["tipoClinica"],
    subtipo: perfil ? { id: perfil.id, label: perfil.label } : null,
    prefix,
    phone: digitos,
    email,
    website: "",
    city: "",
    cargo: "" as Form["cargo"],
  };

  // Sin pregunta de volumen: toda clínica califica (evaluateQualification) y el
  // tamaño lo conversa el closer.
  const size = useMemo(() => ({ profile: null }), []);
  const qual = useMemo(() => evaluateQualification(size), [size]);

  function verHoras() {
    if (!datosOk) {
      setIntentado(true);
      return;
    }
    const eventId = leadCtx?.eventId ?? newLeadEventId();
    const ctx = leadCtx ?? { eventId, leadSource: detectLeadSource() };
    if (!leadCtx) setLeadCtx(ctx);
    pushDL("agenda_step_complete", {
      step: 1,
      step_name: "contacto",
      subtipo_clinica: perfil?.id,
      source_path: SOURCE_PATH,
    });
    setIntentado(false);
    setPaso(2);
    void submitContactLead({
      form,
      software: null,
      size,
      qual,
      leadCtx: ctx,
      sourcePath: SOURCE_PATH,
      features: [],
    }).then((next) => {
      if (next) setLeadCtx(next);
    });
  }

  function mensajeError(): string {
    if (!nombreOk) return "Escribe tu nombre.";
    if (!perfil) return "Elige qué tipo de clínica tienes.";
    if (!emailOk) return "Revisa tu correo.";
    if (phoneError) return phoneError;
    return "Revisa tus datos.";
  }

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <Link href="/" aria-label="Clinera.io">
          <Wordmark size={19} />
        </Link>
        <span className={styles.meta}>Software para clínicas estéticas</span>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.meta}>Clínicas · centros de estética · médicos y enfermeras estéticas</span>
          <h1 className={styles.h1}>
            Software para{" "}
            <span className={styles.grad}>clínicas y centros de estética</span>
          </h1>
          <p className={styles.sub}>
            Agenda, ficha clínica estética y presupuestos en un solo lugar, con IA que atiende tu
            WhatsApp. Lo construimos para nuestras propias clínicas estéticas.
          </p>
        </div>

        <div className={styles.formCol} id="agenda-demo">
          <div className={styles.card}>
            {booking ? (
              <div className={styles.done}>
                <div className={styles.doneCheck} aria-hidden>
                  <Check />
                </div>
                <h2 className={styles.cardTitle}>Listo, tu hora quedó reservada</h2>
                <p className={styles.cardSub}>
                  Te llega el enlace de la videollamada por correo. 45 minutos, sin compromiso.
                </p>
                {booking.date && (
                  <p className={styles.when}>
                    {textoReserva(booking.date, zonaMostrada(tzIp, ""))}
                    {booking.organizer?.name ? ` · ${booking.organizer.name}` : ""}
                  </p>
                )}
              </div>
            ) : paso === 1 ? (
              <div onFocusCapture={marcarInicio}>
                <span className={styles.stepMeta}>Paso 1 de 2 · tus datos</span>
                <h2 className={styles.cardTitle}>Agenda tu demo gratis</h2>
                <p className={styles.cardSub}>45 minutos por videollamada. Te mostramos Clinera con el caso de tu clínica.</p>

                <label className={styles.label} htmlFor="ce-nombre">
                  Nombre
                </label>
                <input
                  id="ce-nombre"
                  className={styles.input}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  autoComplete="name"
                  placeholder="Nombre y apellido"
                  aria-invalid={intentado && !nombreOk}
                />

                <span className={styles.label} id="ce-tipo-label">
                  ¿Qué tipo de clínica tienes?
                </span>
                <div className={styles.chips} role="radiogroup" aria-labelledby="ce-tipo-label">
                  {PERFILES_ESTETICA.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={perfilId === p.id}
                      className={`${styles.chip} ${perfilId === p.id ? styles.chipOn : ""}`}
                      onClick={() => {
                        marcarInicio();
                        setPerfilId(p.id);
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <label className={styles.label} htmlFor="ce-email">
                  Correo
                </label>
                <input
                  id="ce-email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="tucorreo@clinica.cl"
                  aria-invalid={intentado && !emailOk}
                />

                <label className={styles.label} htmlFor="ce-phone">
                  WhatsApp
                </label>
                <div className={styles.phoneRow}>
                  <select
                    className={styles.select}
                    value={prefix}
                    onChange={(e) => {
                      const next = e.target.value;
                      setPrefix(next);
                      setPhone(formatearTelefono(phone, next));
                    }}
                    aria-label="Código de país"
                  >
                    {RESERVA_PHONE_PREFIXES.map((p) => (
                      <option key={p.prefix} value={p.prefix}>
                        {p.flag} {p.prefix}
                      </option>
                    ))}
                  </select>
                  <input
                    id="ce-phone"
                    className={styles.input}
                    value={phone}
                    onChange={(e) => setPhone(formatearTelefono(e.target.value, prefix))}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={rule.placeholder}
                    aria-invalid={intentado && !phoneOk}
                    data-e164={phoneOk ? aE164(prefix, digitos) : undefined}
                  />
                </div>

                {intentado && !datosOk && (
                  <p className={styles.error} role="alert">
                    {mensajeError()}
                  </p>
                )}

                <button type="button" className={styles.cta} onClick={verHoras}>
                  Ver horas disponibles →
                </button>
                <p className={styles.note}>Sin compromiso · tus datos no se comparten.</p>
              </div>
            ) : (
              <div>
                <span className={styles.stepMeta}>Paso 2 de 2 · elige tu hora</span>
                <StepClineraScheduler
                  form={form}
                  tzIp={tzIp}
                  onBack={() => setPaso(1)}
                  onBooked={(next, via, confirmEventId) => {
                    // Una sola reserva por visita: el MQL no puede contar doble.
                    if (bookingSent.current) return;
                    bookingSent.current = true;
                    setBooking(next);
                    void submitBookingConfirmation({
                      form,
                      software: null,
                      size,
                      qual,
                      leadCtx,
                      booking: next,
                      sourcePath: SOURCE_PATH,
                      via,
                      confirmEventId,
                    });
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.heroProof}>
          <ul className={styles.benefits}>
            {BENEFICIOS.map((b) => (
              <li key={b}>
                <span className={styles.tick}>
                  <Check />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <div className={styles.proof}>
            <span className={styles.dot} aria-hidden />
            <span>+52 clínicas activas</span>
            <span className={styles.sep}>·</span>
            <span>Hecho en {ESTETICA_ORIGEN.casos.map((c) => c.nombre).join(" y ")}</span>
          </div>
        </div>
      </section>

      <EsteticaSection id="hecho-para-estetica" />

      <section className={styles.faq} aria-labelledby="ce-faq">
        <div className={styles.faqInner}>
          <span className={styles.meta}>Preguntas frecuentes</span>
          <h2 id="ce-faq" className={styles.h2}>
            Antes de agendar
          </h2>
          <div className={styles.faqList}>
            {ESTETICA_LP_FAQ.map((f) => (
              <details key={f.q} className={styles.faqItem}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.final}>
        <h2 className={styles.finalTitle}>Ve Clinera funcionando con el caso de tu clínica.</h2>
        <button type="button" className={`${styles.cta} ${styles.ctaInline}`} onClick={irAlFormulario}>
          Agendar mi demo →
        </button>
      </section>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Clinera.io · OACG</span>
        <Link href="/privacidad">Privacidad</Link>
        <Link href="/terminos">Términos</Link>
      </footer>
    </div>
  );
}
