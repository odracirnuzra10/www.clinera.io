"use client";

import { useEffect, useMemo, useState } from "react";
import { CLINERA_PLANS } from "@/content/pricing";
import styles from "./AgendaHebeLanding.module.css";
import {
  detectLeadSource,
  evaluateQualification,
  newLeadEventId,
  OPERATIONAL_PROFILES,
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

const NEED_CARDS: { id: string; label: string; hint: string; features: FeatureId[] }[] = [
  { id: "comms", label: "Voz, texto y redes", hint: "WhatsApp, Instagram y llamadas", features: ["voz", "texto", "rrss"] },
  { id: "intelligence", label: "Clinera Intelligence", hint: "Agente IA interno que interactúa con tus operaciones, ventas, agenda, marketing, etc.", features: ["intelligence"] },
  { id: "fichas", label: "Fichas, recetas y consentimientos", hint: "Ficha facial, ficha corporal, odontograma", features: ["fichas", "consentimientos", "odontograma"] },
] as const;

const VOLUMES = [
  { id: "vol_200_500", label: "200 a 500 pacientes / mes", hint: "Operación en crecimiento" },
  { id: "vol_500_1000", label: "500 a 1.000 pacientes / mes", hint: "Varios profesionales" },
  { id: "vol_1000_plus", label: "Más de 1.000 pacientes / mes", hint: "Multi-sede o alto flujo" },
] as const;

const TYPES = [
  { id: "medica", label: "Médica" },
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

function planConsumoShort(plan: (typeof CLINERA_PLANS)[number]): string {
  const m = plan.consumptionReference.match(/~?([\d.]+)\s*conversaciones\s*o\s*~?([\d.]+)\s*agendamientos/i);
  if (!m) return plan.consumptionReference.split(" · ")[0].replace(/~/g, "").replace(" automáticos", "");
  return `${m[1]} conv. o ${m[2]} agend.`;
}

function planBranchShort(plan: (typeof CLINERA_PLANS)[number]): string {
  if (plan.id === "summit") return "sedes ilimitadas";
  return plan.branches;
}

function planStepFeatures(plan: (typeof CLINERA_PLANS)[number]): string[] {
  const agent =
    plan.id === "vortex" ? "IA por WhatsApp" : plan.id === "atlas" ? "IA WhatsApp, FB e IG" : "IA WhatsApp, FB, IG y llamadas";
  return [`Fichas · agenda · ${agent}`, `${planConsumoShort(plan)} · ${planBranchShort(plan)}`];
}

const PLAN_OPTIONS = CLINERA_PLANS.map((plan) => ({
  id: plan.id,
  name: plan.name,
  price: plan.monthlyPrice,
  featured: plan.featured,
  features: planStepFeatures(plan),
}));

const PHONES: Record<string, { flag: string; label: string; len: number; pattern: RegExp; placeholder: string; hint: string }> = {
  "+56": { flag: "🇨🇱", label: "Chile", len: 9, pattern: /^9\d{8}$/, placeholder: "9 1234 5678", hint: "9 dígitos, empieza con 9" },
  "+51": { flag: "🇵🇪", label: "Perú", len: 9, pattern: /^9\d{8}$/, placeholder: "912 345 678", hint: "9 dígitos, empieza con 9" },
  "+57": { flag: "🇨🇴", label: "Colombia", len: 10, pattern: /^3\d{9}$/, placeholder: "300 123 4567", hint: "10 dígitos, empieza con 3" },
  "+52": { flag: "🇲🇽", label: "México", len: 10, pattern: /^[2-9]\d{9}$/, placeholder: "55 1234 5678", hint: "10 dígitos" },
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

const TOTAL = 6;
const DEFAULT_SOURCE_PATH = "/agenda";

function Check() {
  return (
    <span className={styles.check} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

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
  const [selectedPlan, setSelectedPlan] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);
  const [volume, setVolume] = useState("");
  const [clinica, setClinica] = useState("");
  const [website, setWebsite] = useState("");
  const [tipo, setTipo] = useState("");
  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [prefix, setPrefix] = useState("+56");
  const [leadCtx, setLeadCtx] = useState<{ eventId: string; leadSource: string } | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [booking, setBooking] = useState<CalBooking | null>(null);

  useEffect(() => {
    const t = window.setInterval(() => setSlide((i) => (i + 1) % SLIDES.length), 4200);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("plan");
    if (fromQuery && PLAN_OPTIONS.some((p) => p.id === fromQuery)) {
      setSelectedPlan(fromQuery);
    }
  }, []);

  const rule = PHONES[prefix];
  const digits = phone.replace(/\D/g, "");
  const phoneOk = digits.length === rule.len && rule.pattern.test(digits);

  const form: Form = useMemo(
    () => ({
      nombre,
      clinica,
      tipoClinica: (tipo || "") as Form["tipoClinica"],
      prefix,
      phone,
      email,
      website,
      city: "",
      cargo: cargo as Form["cargo"],
    }),
    [nombre, clinica, tipo, prefix, phone, email, website, cargo],
  );

  const features: FeatureId[] = needs.flatMap((id) => NEED_CARDS.find((c) => c.id === id)?.features ?? []);

  function go(n: number) {
    setAttempted(false);
    setStep(n);
  }

  const clinicOk = clinica.trim().length >= 2 && website.trim().length >= 3 && tipo !== "";
  const personOk = nombre.trim().length >= 2 && cargo !== "" && phoneOk && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

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
    // El calendario no espera a n8n: si el webhook se cuelga, se pierden leads.
    go(6);
    void submitSizeLead({
      software: features[0] ?? null,
      size,
      qual,
      eventId,
      sourcePath,
      features,
      form,
      plan: selectedPlan,
    }).then((next) => {
      if (next) setLeadCtx(next);
    });
    void submitContactLead({
      form,
      software: features[0] ?? null,
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
      <h1 className={styles.srOnly}>Agenda una reunión con Clinera</h1>

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

          <div className={`${styles.viewport} ${step === 6 ? styles.viewportScheduler : ""}`}>
            <div className={`${styles.step} ${step === 1 ? styles.stepActive : ""}`} aria-hidden={step !== 1}>
              <div className={styles.label}>Paso 1 de {TOTAL}</div>
              <h2 className={styles.title}>
                ¿Cuál plan te <em>interesa</em>?
              </h2>
              <div className={styles.planGrid}>
                {PLAN_OPTIONS.map((p) => {
                  const on = selectedPlan === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`${styles.planCard} ${p.featured ? styles.planCardFeatured : ""} ${on ? styles.planCardSelected : ""}`}
                      aria-pressed={on}
                      onClick={() => setSelectedPlan(p.id)}
                    >
                      {p.featured && <span className={styles.planBadge}>Más elegido</span>}
                      <div className={styles.planHead}>
                        <span className={styles.planName}>{p.name}</span>
                        <span className={styles.planPrice}>
                          USD {p.price}
                          <small>/mes</small>
                        </span>
                      </div>
                      <ul className={styles.planFeatures}>
                        {p.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                      <Check />
                    </button>
                  );
                })}
              </div>
              <button type="button" className={styles.cta} disabled={!selectedPlan} onClick={() => selectedPlan && go(2)}>
                Continuar
              </button>
            </div>

            <div className={`${styles.step} ${step === 2 ? styles.stepActive : ""}`} aria-hidden={step !== 2}>
              <Back onClick={() => go(1)} />
              <div className={styles.viewers}>Más de 80 clínicas en LATAM unificaron sus operaciones con inteligencia artificial. ¿Qué esperas tú?</div>
              <div className={styles.reviews}>
                <span className={styles.stars}>★★★★★</span>
                <span>Dueños y gerentes de clínicas</span>
              </div>
              <div className={styles.label}>Paso 2 de {TOTAL}</div>
              <h2 className={styles.title}>
                Hablemos de tus <em>necesidades</em>
              </h2>
              <p className={styles.sub}>Elige lo que te interesa. Puedes marcar más de una.</p>
              <div className={styles.cards}>
                {NEED_CARDS.map((c) => {
                  const on = needs.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`${styles.card} ${on ? styles.cardSelected : ""}`}
                      onClick={() => setNeeds((prev) => (prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id]))}
                    >
                      <span className={styles.icon} aria-hidden>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 3v18M3 12h18" />
                        </svg>
                      </span>
                      <span className={styles.info}>
                        <h3>{c.label}</h3>
                        <p>{c.hint}</p>
                      </span>
                      <Check />
                    </button>
                  );
                })}
              </div>
              <button type="button" className={styles.cta} disabled={needs.length === 0} onClick={() => needs.length && go(3)}>
                Continuar
              </button>
            </div>

            <div className={`${styles.step} ${step === 3 ? styles.stepActive : ""}`} aria-hidden={step !== 3}>
              <Back onClick={() => go(2)} />
              <div className={styles.label}>Paso 3 de {TOTAL}</div>
              <h2 className={styles.title}>
                ¿Cuántos pacientes al <em>mes</em>?
              </h2>
              <p className={`${styles.sub} ${styles.subRow}`}>
                Clinera atiende pacientes con IA por WhatsApp, Facebook, Instagram y llamada telefónica.
                <ChannelLogos />
              </p>
              <div className={styles.cards}>
                {VOLUMES.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    className={`${styles.card} ${volume === v.id ? styles.cardSelected : ""}`}
                    onClick={() => {
                      setVolume(v.id);
                      const profile = OPERATIONAL_PROFILES.find((p) => p.id === v.id) ?? null;
                      const eventId = leadCtx?.eventId ?? newLeadEventId();
                      const ctx = leadCtx ?? { eventId, leadSource: detectLeadSource() };
                      if (!leadCtx) setLeadCtx(ctx);
                      void submitSizeLead({
                        software: features[0] ?? null,
                        size: { profile },
                        qual: evaluateQualification({ profile }),
                        eventId,
                        sourcePath,
                        features,
                        plan: selectedPlan,
                      });
                      window.setTimeout(() => go(4), 280);
                    }}
                  >
                    <span className={styles.icon} aria-hidden>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19V5M4 19h16M8 15l3-6 3 3 4-8" />
                      </svg>
                    </span>
                    <span className={styles.info}>
                      <h3>{v.label}</h3>
                      <p>{v.hint}</p>
                    </span>
                    <Check />
                  </button>
                ))}
              </div>
            </div>

            <div className={`${styles.step} ${step === 4 ? styles.stepActive : ""}`} aria-hidden={step !== 4}>
              <Back onClick={() => go(3)} />
              <div className={styles.label}>Paso 4 de {TOTAL}</div>
              <h2 className={styles.title}>
                Hablemos más de tu <em>clínica</em>
              </h2>
              <p className={styles.sub}>Nombre, web o redes y tipo de clínica.</p>
              <div className={styles.group}>
                <label>Nombre de la clínica</label>
                <input className={attempted && clinica.trim().length < 2 ? styles.err : undefined} value={clinica} onChange={(e) => setClinica(e.target.value)} placeholder="Ej: Clínica Sonríe" />
              </div>
              <div className={styles.group}>
                <label>Sitio web o redes sociales</label>
                <input className={attempted && website.trim().length < 3 ? styles.err : undefined} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="www.tuclinica.cl o @tuclinica" />
              </div>
              <div className={styles.group}>
                <label htmlFor="agenda-tipo-clinica">Tipo de clínica</label>
                <select
                  id="agenda-tipo-clinica"
                  className={attempted && !tipo ? styles.err : undefined}
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="">Selecciona…</option>
                  {TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className={styles.cta}
                onClick={() => {
                  if (!clinicOk) {
                    setAttempted(true);
                    return;
                  }
                  go(5);
                }}
              >
                Continuar
              </button>
            </div>

            <div className={`${styles.step} ${step === 5 ? styles.stepActive : ""}`} aria-hidden={step !== 5}>
              <Back onClick={() => go(4)} />
              <div className={styles.label}>Paso 5 de {TOTAL}</div>
              <h2 className={styles.title}>
                Tus datos de <em>contacto</em>
              </h2>
              <p className={styles.sub}>Te escribimos directo a quien decide, no a recepción.</p>
              <div className={styles.group}>
                <label>Nombre</label>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre completo" />
              </div>
              <div className={styles.group}>
                <label htmlFor="agenda-cargo">Cargo</label>
                <select id="agenda-cargo" value={cargo} onChange={(e) => setCargo(e.target.value)}>
                  <option value="">Selecciona…</option>
                  {CARGOS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.group}>
                <label>WhatsApp personal</label>
                <div className={styles.phone}>
                  <select
                    className={styles.prefixSelect}
                    value={prefix}
                    onChange={(e) => {
                      setPrefix(e.target.value);
                      setPhone("");
                    }}
                  >
                    {Object.entries(PHONES).map(([code, c]) => (
                      <option key={code} value={code}>
                        {c.flag} {code}
                      </option>
                    ))}
                  </select>
                  <input
                    className={attempted && !phoneOk ? styles.err : undefined}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, rule.len))}
                    placeholder={rule.placeholder}
                    inputMode="numeric"
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
                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@clinica.cl" />
              </div>
              <button type="button" className={styles.cta} onClick={goToScheduler}>
                Agenda con tu ingeniero
              </button>
              <p className={styles.note}>Sin compromiso · 45 min por videollamada</p>
            </div>

            <div className={`${styles.step} ${styles.stepScheduler} ${step === 6 ? styles.stepActive : ""}`} aria-hidden={step !== 6}>
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
                  label={`Paso 5 de ${TOTAL}`}
                  onBack={() => go(5)}
                  onBooked={(next, via, confirmEventId) => {
                    setBooking(next);
                    const profile = OPERATIONAL_PROFILES.find((p) => p.id === volume) ?? null;
                    const size = { profile };
                    const qual = evaluateQualification(size);
                    void submitBookingConfirmation({
                      form,
                      software: features[0] ?? null,
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
        </div>
      </section>
    </div>
  );
}
