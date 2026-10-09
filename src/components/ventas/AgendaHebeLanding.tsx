"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CLINERA_PLANS } from "@/content/pricing";
import styles from "./AgendaHebeLanding.module.css";
import {
  detectLeadSource,
  evaluateQualification,
  newLeadEventId,
  OPERATIONAL_PROFILES,
  pushDL,
  StepClineraScheduler,
  submitBookingConfirmation,
  submitContactLead,
  submitSizeLead,
  textoReserva,
  type CalBooking,
  type Form,
  type FeatureId,
} from "./VentasLanding";
import { zonaMostrada } from "@/lib/timezone";

const VOLUMES = [
  { id: "vol_lt_200", label: "Menos de 200" },
  { id: "vol_200_500", label: "200 a 500" },
  { id: "vol_500_1000", label: "500 a 1.000" },
  { id: "vol_1000_plus", label: "Más de 1.000" },
] as const;

// Tamaño de la clínica. Las opciones salen del brief de Meta Ads (oct 2026):
// separan a la clínica pequeña/mediana (el cliente ideal) de las operaciones grandes.
const BOXES = [
  { id: "1_3", label: "1–3" },
  { id: "4_6", label: "4–6" },
  { id: "7_10", label: "7–10" },
  { id: "10_plus", label: "Más de 10" },
] as const;

const TYPES = [
  { id: "medica", label: "Médica" },
  { id: "dental", label: "Dental" },
  { id: "kinesiologica", label: "Kinesiológica" },
  { id: "estetica", label: "Estética" },
  { id: "salud_mental", label: "Salud mental" },
] as const;

const CARGOS = ["Dueño / Fundador", "Gerente general", "Gerente de operaciones", "Administrador/a", "Otro"];

const SLIDES = [
  {
    img: "/images/home/flavio.jpeg",
    caption: "Dr. Flavio Rojas · infiltracion.cl",
    name: "Dr. Flavio Rojas",
    uses: "Ficha corporal · agente IA de texto · agente IA de voz",
  },
  {
    img: "/images/home/yasna.jpg",
    caption: "Yasna Vásquez · campañas sin más secretarias",
    name: "Dra. Yasna Vásquez",
    uses: "Odontograma · agente IA de texto",
  },
  {
    img: "/images/home/katherine.png",
    caption: "Katherine Meza · fichas y odontogramas",
    name: "Katherine Meza",
    uses: "Ficha facial · agente IA de texto · Clinera Intelligence",
  },
];

const TICKER = [
  { name: "Agente IA", price: "24/7" },
  { name: "Intelligence", price: "incluido" },
  { name: "Fichas clínicas", price: "incluido" },
  { name: "Odontograma", price: "incluido" },
];

const PLAN_IDS = new Set<string>(CLINERA_PLANS.map((p) => p.id));

const PHONES: Record<string, { flag: string; label: string; len: number; pattern: RegExp; placeholder: string; hint: string }> = {
  "+56": { flag: "🇨🇱", label: "Chile", len: 9, pattern: /^9\d{8}$/, placeholder: "9 1234 5678", hint: "9 dígitos, empieza con 9" },
  "+52": { flag: "🇲🇽", label: "México", len: 10, pattern: /^[2-9]\d{9}$/, placeholder: "55 1234 5678", hint: "10 dígitos" },
  "+51": { flag: "🇵🇪", label: "Perú", len: 9, pattern: /^9\d{8}$/, placeholder: "912 345 678", hint: "9 dígitos, empieza con 9" },
  "+57": { flag: "🇨🇴", label: "Colombia", len: 10, pattern: /^3\d{9}$/, placeholder: "300 123 4567", hint: "10 dígitos, empieza con 3" },
  "+507": { flag: "🇵🇦", label: "Panamá", len: 8, pattern: /^6\d{7}$/, placeholder: "6123 4567", hint: "8 dígitos, empieza con 6" },
  "+506": { flag: "🇨🇷", label: "Costa Rica", len: 8, pattern: /^[678]\d{7}$/, placeholder: "8312 3456", hint: "8 dígitos" },
};

function ChannelLogos() {
  return (
    <span className={styles.channels}>
      <span className={styles.channel} title="WhatsApp">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366"><path d="M12 2C6.5 2 2 6.3 2 11.6c0 1.9.5 3.7 1.5 5.3L2 22l5.3-1.4c1.5.8 3.2 1.3 4.7 1.3 5.5 0 10-4.3 10-9.6S17.5 2 12 2zm5.7 13.6c-.2.7-1.2 1.2-1.9 1.4-.5.1-1.1.2-3.6-.8-3.1-1.3-5.1-4.5-5.2-4.7-.2-.2-1.3-1.7-1.3-3.3s.8-2.3 1.1-2.6c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.7-.1.3.1 1.9.9 2.2 1.1.3.1.5.2.6.3.1.2.1.8-.1 1.5z" /></svg>
      </span>
      <span className={styles.channel} title="Facebook">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#1877F2"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v9h4v-9h3.2L17 11h-4V9c0-.6.4-1 1-1z" /></svg>
      </span>
      <span className={styles.channel} title="Instagram">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="#E1306C" strokeWidth="2" /><circle cx="12" cy="12" r="4" stroke="#E1306C" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1" fill="#E1306C" /></svg>
      </span>
      <span className={styles.channel} title="Llamada">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2"><path d="M6.5 3.5l3 2.2-1.6 2.4a14 14 0 007 7l2.4-1.6 2.2 3-2.1 1.2C15.2 19.2 5 16 4.2 7.6L5.4 5.5z" /></svg>
      </span>
    </span>
  );
}

const TOTAL = 3;

// Zonas horarias de México (IANA). Si el visitante entra desde ahí, el
// teléfono arranca en +52 en vez de +56: un mexicano que ve "+56" cree que el
// formulario no es para él.
const MX_TZ = /^America\/(Mexico_City|Cancun|Merida|Monterrey|Matamoros|Chihuahua|Ciudad_Juarez|Ojinaga|Mazatlan|Hermosillo|Tijuana|Bahia_Banderas)$/;
const DEFAULT_SOURCE_PATH = "/agenda";

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className={styles.back} onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Volver
    </button>
  );
}

function TickerTrack() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className={styles.tickerTrack}>
      {items.map((t, i) => (
        <span key={`${t.name}-${i}`}>
          <span className={styles.tickerItem}>
            <span>{t.name}</span>
            <span className={styles.tickerPrice}>{t.price}</span>
          </span>
          <span className={styles.tickerSep}>◆</span>
        </span>
      ))}
    </div>
  );
}

export default function AgendaHebeLanding({
  sourcePath = DEFAULT_SOURCE_PATH,
  tzIp = "",
}: {
  sourcePath?: string;
  tzIp?: string;
} = {}) {
  const price = CLINERA_PLANS[0].monthlyPrice;
  const [step, setStep] = useState(1);
  const [slide, setSlide] = useState(1);
  // El plan ya no se elige acá: sólo se conserva si el enlace trae ?plan=
  // (viene de /planes), para que el closer sepa qué miraba.
  const [selectedPlan, setSelectedPlan] = useState("");
  const [volume, setVolume] = useState("");
  const [boxes, setBoxes] = useState("");
  const [clinica, setClinica] = useState("");
  const [tipo, setTipo] = useState("");
  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [prefix, setPrefix] = useState(() => (MX_TZ.test(tzIp) ? "+52" : "+56"));
  const [leadCtx, setLeadCtx] = useState<{ eventId: string; leadSource: string } | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [booking, setBooking] = useState<CalBooking | null>(null);
  const formStarted = useRef(false);
  const bookingSent = useRef(false);

  useEffect(() => {
    const t = window.setInterval(() => setSlide((i) => (i + 1) % SLIDES.length), 4200);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("plan");
    if (fromQuery && PLAN_IDS.has(fromQuery)) {
      setSelectedPlan(fromQuery);
    }
  }, []);

  // Medición del embudo (GTM/dataLayer). Visita → inicio → paso 1 → paso 2 →
  // `ventas_submit_lead` (formulario completo, ya existente) → reserva
  // (`ventas_booking_confirmed` + Schedule/MQL, sólo tras agendar de verdad).
  useEffect(() => {
    pushDL("agenda_landing_view", { source_path: sourcePath });
  }, [sourcePath]);

  function markStarted() {
    if (formStarted.current) return;
    formStarted.current = true;
    pushDL("agenda_form_start", { source_path: sourcePath });
  }

  const rule = PHONES[prefix];
  const digits = phone.replace(/\D/g, "");
  const phoneOk = digits.length === rule.len && rule.pattern.test(digits);

  const boxesOpt = BOXES.find((b) => b.id === boxes) ?? null;

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
      cargo: cargo as Form["cargo"],
      boxes: boxesOpt ? { id: boxesOpt.id, label: boxesOpt.label } : null,
    }),
    [nombre, clinica, tipo, prefix, phone, email, cargo, boxesOpt],
  );

  const features: FeatureId[] = [];

  function go(n: number) {
    setAttempted(false);
    setStep(n);
  }

  const clinicOk = clinica.trim().length >= 2 && tipo !== "" && boxes !== "" && volume !== "";
  const personOk = nombre.trim().length >= 2 && cargo !== "" && phoneOk && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  function goToContact() {
    if (!clinicOk) {
      setAttempted(true);
      return;
    }
    const profile = OPERATIONAL_PROFILES.find((p) => p.id === volume) ?? null;
    const eventId = leadCtx?.eventId ?? newLeadEventId();
    const ctx = leadCtx ?? { eventId, leadSource: detectLeadSource() };
    if (!leadCtx) setLeadCtx(ctx);
    pushDL("agenda_step_complete", { step: 1, step_name: "clinica", tamano_boxes: boxes, source_path: sourcePath });
    go(2);
    // Lead parcial: la clínica queda capturada aunque abandone en el paso 2.
    void submitSizeLead({
      software: null,
      size: { profile },
      qual: evaluateQualification({ profile }),
      eventId,
      sourcePath,
      features,
      form,
      plan: selectedPlan,
    }).then((next) => {
      if (next) setLeadCtx(next);
    });
  }

  function goToScheduler() {
    if (!personOk) {
      setAttempted(true);
      return;
    }
    const profile = OPERATIONAL_PROFILES.find((p) => p.id === volume) ?? null;
    const size = { profile };
    const qual = evaluateQualification(size);
    const eventId = leadCtx?.eventId ?? newLeadEventId();
    const ctx = leadCtx ?? { eventId, leadSource: detectLeadSource() };
    if (!leadCtx) setLeadCtx(ctx);
    pushDL("agenda_step_complete", { step: 2, step_name: "contacto", source_path: sourcePath });
    // El calendario no espera a n8n: si el webhook se cuelga, se pierden leads.
    go(3);
    void submitContactLead({
      form,
      software: null,
      size,
      qual,
      leadCtx: ctx,
      sourcePath,
      features,
      plan: selectedPlan,
    }).then((next) => {
      if (next) setLeadCtx(next);
    });
  }

  return (
    <div className={styles.page}>
      <aside className={styles.left}>
        <div className={styles.carouselWrap}>
          <div className={styles.carousel}>
            {SLIDES.map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s.img}
                src={s.img}
                alt={s.caption}
                className={`${styles.carouselImg} ${i === slide ? styles.carouselImgOn : ""}`}
              />
            ))}
          </div>
          <div className={styles.caption}>{SLIDES[slide].caption}</div>
          <div className={styles.dots}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Foto ${i + 1}`}
                className={`${styles.dot} ${i === slide ? styles.dotActive : ""}`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
        </div>
        <div className={styles.priceBadge}>
          <div className={styles.priceLabel}>Planes desde</div>
          <div className={styles.priceNew}>USD {price} al mes · reunión de 45 min</div>
        </div>
        <div className={styles.spots}>
          <span className={styles.pulse} />
          Solo dueños y gerentes de clínicas
        </div>
        <div className={styles.ticker}>
          <div className={styles.tickerBadge}>
            Lo más
            <br />
            pedido
          </div>
          <div className={styles.tickerArea}>
            <TickerTrack />
          </div>
        </div>
      </aside>

      <section className={styles.right}>
        <div className={styles.mobileHeader}>
          <div className={styles.mobileHero}>
            <div className={styles.mobileCarousel} style={{ backgroundImage: `url(${SLIDES[slide].img})` }} />
            <div className={styles.mobileInfo}>
              <div className={styles.doctorName}>{SLIDES[slide].name}</div>
              <div className={styles.doctorUses}>{SLIDES[slide].uses}</div>
              <div className={styles.mobileSpots}>
                <span className={styles.pulse} /> Reunión de 45 min
              </div>
            </div>
          </div>
          <div className={styles.mobileTicker}>
            <div className={styles.tickerBadge}>
              Lo más
              <br />
              pedido
            </div>
            <div className={styles.tickerArea}>
              <TickerTrack />
            </div>
          </div>
        </div>

        <div className={styles.inner}>
          {step < 3 && (
            <header className={styles.hero}>
              <h1 className={styles.heroTitle}>Automatiza el WhatsApp y las citas de tu clínica con inteligencia artificial.</h1>
              <p className={styles.heroSub}>
                Clinera ayuda a clínicas pequeñas y medianas a responder consultas, gestionar reservas y reducir tareas administrativas.
              </p>
              <p className={styles.heroPrice}>Planes desde USD {price}/mes</p>
            </header>
          )}
          <div className={styles.progress}>
            {Array.from({ length: TOTAL }, (_, i) => {
              const n = i + 1;
              return (
                <div
                  key={n}
                  className={`${styles.seg} ${n < step ? styles.segDone : ""} ${n === step ? styles.segActive : ""}`}
                />
              );
            })}
          </div>

          <div className={`${styles.viewport} ${step === 3 ? styles.viewportScheduler : ""}`}>
            <div className={`${styles.step} ${step === 1 ? styles.stepActive : ""}`} aria-hidden={step !== 1}>
              <div className={styles.viewers}>+52 clínicas en LATAM ya operan con Clinera.</div>
              <div className={styles.label}>Paso 1 de {TOTAL}</div>
              <h2 className={styles.title}>
                Cuéntanos de tu <em>clínica</em>
              </h2>
              <p className={`${styles.sub} ${styles.subRow}`}>
                Atendemos pacientes con IA por WhatsApp, Facebook, Instagram y llamada.
                <ChannelLogos />
              </p>
              <div className={styles.group}>
                <label htmlFor="agenda-clinica">Nombre de la clínica</label>
                <input
                  id="agenda-clinica"
                  className={attempted && clinica.trim().length < 2 ? styles.err : undefined}
                  value={clinica}
                  onChange={(e) => {
                    markStarted();
                    setClinica(e.target.value);
                  }}
                  placeholder="Ej: Clínica Sonríe"
                  autoComplete="organization"
                />
              </div>
              <div className={styles.group}>
                <label htmlFor="agenda-tipo-clinica">Especialidad</label>
                <select
                  id="agenda-tipo-clinica"
                  className={attempted && !tipo ? styles.err : undefined}
                  value={tipo}
                  onChange={(e) => {
                    markStarted();
                    setTipo(e.target.value);
                  }}
                >
                  <option value="">Selecciona…</option>
                  {TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.group} role="group" aria-labelledby="agenda-boxes-label">
                <label id="agenda-boxes-label">¿Cuántos boxes o profesionales tiene tu clínica?</label>
                <div className={`${styles.chips} ${attempted && !boxes ? styles.chipsErr : ""}`}>
                  {BOXES.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className={`${styles.chip} ${boxes === b.id ? styles.chipOn : ""}`}
                      aria-pressed={boxes === b.id}
                      onClick={() => {
                        markStarted();
                        setBoxes(b.id);
                      }}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.group} role="group" aria-labelledby="agenda-vol-label">
                <label id="agenda-vol-label">Pacientes al mes</label>
                <div className={`${styles.chips} ${attempted && !volume ? styles.chipsErr : ""}`}>
                  {VOLUMES.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`${styles.chip} ${volume === v.id ? styles.chipOn : ""}`}
                      aria-pressed={volume === v.id}
                      onClick={() => {
                        markStarted();
                        setVolume(v.id);
                      }}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <button type="button" className={styles.cta} onClick={goToContact}>
                Continuar
              </button>
              <p className={styles.note}>Sin compromiso · demostración de 45 min por videollamada</p>
            </div>

            <div className={`${styles.step} ${step === 2 ? styles.stepActive : ""}`} aria-hidden={step !== 2}>
              <Back onClick={() => go(1)} />
              <div className={styles.label}>Paso 2 de {TOTAL}</div>
              <h2 className={styles.title}>
                Tus datos de <em>contacto</em>
              </h2>
              <p className={styles.sub}>Te escribimos directo a quien decide, no a recepción.</p>
              <div className={styles.group}>
                <label htmlFor="agenda-nombre">Nombre</label>
                <input
                  id="agenda-nombre"
                  className={attempted && nombre.trim().length < 2 ? styles.err : undefined}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre completo"
                  autoComplete="name"
                />
              </div>
              <div className={styles.group}>
                <label htmlFor="agenda-cargo">Cargo</label>
                <select
                  id="agenda-cargo"
                  className={attempted && !cargo ? styles.err : undefined}
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                >
                  <option value="">Selecciona…</option>
                  {CARGOS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.group}>
                <label htmlFor="agenda-whatsapp">WhatsApp</label>
                <div className={styles.phone}>
                  <select
                    className={styles.prefixSelect}
                    aria-label="País del WhatsApp"
                    value={prefix}
                    onChange={(e) => {
                      setPrefix(e.target.value);
                      setPhone("");
                    }}
                  >
                    {Object.entries(PHONES).map(([code, c]) => (
                      <option key={code} value={code}>
                        {c.flag} {c.label} {code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="agenda-whatsapp"
                    className={attempted && !phoneOk ? styles.err : undefined}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, rule.len))}
                    placeholder={rule.placeholder}
                    inputMode="numeric"
                    autoComplete="tel-national"
                  />
                </div>
                <div className={styles.hint}>
                  {digits.length === 0
                    ? rule.hint
                    : digits.length < rule.len
                      ? `Faltan ${rule.len - digits.length} dígito${rule.len - digits.length === 1 ? "" : "s"} (${rule.label})`
                      : digits.length > rule.len
                        ? `Demasiados dígitos para ${rule.label}`
                        : phoneOk
                          ? `Número válido para ${rule.label}`
                          : rule.hint}
                </div>
              </div>
              <div className={styles.group}>
                <label htmlFor="agenda-email">Correo</label>
                <input
                  id="agenda-email"
                  className={attempted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? styles.err : undefined}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@tuclinica.com"
                  autoComplete="email"
                  inputMode="email"
                />
              </div>
              <button type="button" className={styles.cta} onClick={goToScheduler}>
                Agenda una demostración
              </button>
              <p className={styles.note}>Sin compromiso · 45 min por videollamada</p>
            </div>

            <div className={`${styles.step} ${styles.stepScheduler} ${step === 3 ? styles.stepActive : ""}`} aria-hidden={step !== 3}>
              {booking ? (
                <div className={styles.success}>
                  <div className={styles.successMark} aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2 className={styles.successTitle}>¡Reunión recibida!</h2>
                  <p className={styles.sub}>Te llega el Meet por email. Sin compromiso · 45 min.</p>
                  {booking.date && (
                    <div className={styles.successWhen}>
                      {textoReserva(booking.date, zonaMostrada(tzIp, ""))}
                      {booking.organizer?.name ? ` · ${booking.organizer.name}` : ""}
                    </div>
                  )}
                </div>
              ) : (
                <StepClineraScheduler
                  form={form}
                  tzIp={tzIp}
                  label={`Paso 3 de ${TOTAL}`}
                  onBack={() => go(2)}
                  onBooked={(next, via, confirmEventId) => {
                    // Un solo envío por reserva: Pixel, CAPI y CRM deduplican por
                    // event_id, pero no hay por qué pedirles que lo hagan.
                    if (bookingSent.current) return;
                    bookingSent.current = true;
                    setBooking(next);
                    const profile = OPERATIONAL_PROFILES.find((p) => p.id === volume) ?? null;
                    const size = { profile };
                    const qual = evaluateQualification(size);
                    void submitBookingConfirmation({
                      form,
                      software: null,
                      size,
                      qual,
                      leadCtx,
                      booking: next,
                      sourcePath,
                      via,
                      confirmEventId,
                    });
                  }}
                />
              )}
            </div>
          </div>
          <p className={styles.legal}>
            Al continuar aceptas nuestra <a href="/privacidad">política de privacidad</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
