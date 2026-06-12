"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./DemoWizard.module.css";

const DOW = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
const MON = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
const DOW_LONG = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MON_LONG = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const WEBHOOK_URL =
  "https://clinerasoftware.app.n8n.cloud/webhook/088a2cfe-5c93-4a4b-a4e5-ac2617979ea5";
const STORAGE_KEY = "clinera_demo_v5_state";

type Plan = {
  id: string;
  value: string;
  name: string;
  desc: React.ReactNode;
  tag?: { label: string; soft?: boolean };
  price?: { amount: string; per: string };
  undecided?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "p-undecided",
    value: "Lo decidimos en la llamada",
    name: "Lo decidimos en la llamada",
    desc: (
      <>
        Revisamos tu caso y te sugerimos el plan ideal. <strong>Sin compromiso.</strong>
      </>
    ),
    tag: { label: "Recomendado", soft: true },
    undecided: true,
  },
  {
    id: "p-conect",
    value: "Conect",
    name: "Conect",
    desc: (
      <>
        Para clínicas que necesitan conectar todo. Incluye{" "}
        <strong>3 usuarios</strong> y <strong>1.000 conversaciones / 80 agendamientos al mes</strong>.
      </>
    ),
    tag: { label: "Más elegido" },
    price: { amount: "US$129", per: "/mes" },
  },
  {
    id: "p-advanced",
    value: "Advanced",
    name: "Advanced",
    desc: (
      <>
        Para clínicas que ya están creciendo. Incluye <strong>5 usuarios</strong>,{" "}
        <strong>1.500 conversaciones / 150 agendamientos al mes</strong> y multisucursal.
      </>
    ),
    price: { amount: "US$179", per: "/mes" },
  },
  {
    id: "p-max",
    value: "MAX",
    name: "MAX",
    desc: (
      <>
        Toda la potencia: <strong>15 usuarios</strong>,{" "}
        <strong>3.200 conversaciones / 500 agendamientos + ~120 llamadas de voz al mes</strong>, con LIA y
        CAMILA.
      </>
    ),
    price: { amount: "US$279", per: "/mes" },
  },
];

const PHONE_PREFIXES = [
  { value: "+56", len: 9, ex: "9 1234 5678", label: "🇨🇱 +56" },
  { value: "+54", len: 10, ex: "11 1234 5678", label: "🇦🇷 +54" },
  { value: "+52", len: 10, ex: "55 1234 5678", label: "🇲🇽 +52" },
  { value: "+57", len: 10, ex: "300 123 4567", label: "🇨🇴 +57" },
  { value: "+51", len: 9, ex: "912 345 678", label: "🇵🇪 +51" },
  { value: "+593", len: 9, ex: "99 123 4567", label: "🇪🇨 +593" },
  { value: "+598", len: 8, ex: "9123 4567", label: "🇺🇾 +598" },
  { value: "+34", len: 9, ex: "612 345 678", label: "🇪🇸 +34" },
];

const ROLES = [
  "Dueño/a fundador/a",
  "Socio/a",
  "Director/a médico/a",
  "Administrador/a general",
  "Gerente de operaciones",
  "Marketing / Captación",
  "Recepcionista / Front-desk",
  "Otro",
];

function nextBusinessDays(n: number): Date[] {
  const days: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  while (days.length < n) {
    const w = d.getDay();
    if (w !== 0 && w !== 6) days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function generateSlots(): string[] {
  const s: string[] = [];
  for (let h = 10; h < 18; h++) {
    s.push(`${String(h).padStart(2, "0")}:00`);
    s.push(`${String(h).padStart(2, "0")}:30`);
  }
  return s;
}

function getBlockedSlots(date: Date, total: number): Set<number> {
  const seed = date.getDate() + date.getMonth() * 30;
  const b = new Set<number>();
  [seed * 3, seed * 7 + 1, seed * 11 + 4, seed * 13 + 2, seed * 17 + 3].forEach((v) =>
    b.add(Math.abs(v) % total)
  );
  return b;
}

export default function DemoWizard() {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<string>("Lo decidimos en la llamada");
  const [days] = useState<Date[]>(() => nextBusinessDays(4));
  const [dayIdx, setDayIdx] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [tzLabel, setTzLabel] = useState("Hora América/Santiago (GMT-3)");

  // form fields
  const [fName, setFName] = useState("");
  const [fClinic, setFClinic] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fPrefix, setFPrefix] = useState("+56");
  const [fRole, setFRole] = useState("");
  const [consent, setConsent] = useState(true);

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [phoneHint, setPhoneHint] = useState<{ text: string; tone: "" | "err" | "ok" }>({
    text: "Ingresa 9 dígitos",
    tone: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalInfo, setModalInfo] = useState<{ plan: string; dateStr: string; slot: string; name: string; clinic: string } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);

  // Detect timezone
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const off = -new Date().getTimezoneOffset() / 60;
      const offStr = (off >= 0 ? "+" : "") + off;
      if (tz) setTzLabel(`Hora ${tz.replace("_", " ")} (GMT${offStr})`);
    } catch {}
  }, []);

  // Restore state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s.plan) setPlan(s.plan);
      if (s.fields) {
        if (s.fields.f_name) setFName(s.fields.f_name);
        if (s.fields.f_clinic) setFClinic(s.fields.f_clinic);
        if (s.fields.f_email) setFEmail(s.fields.f_email);
        if (s.fields.f_phone) setFPhone(s.fields.f_phone);
        if (s.fields.f_prefix) setFPrefix(s.fields.f_prefix);
        if (s.fields.f_role) setFRole(s.fields.f_role);
      }
    } catch {}
  }, []);

  // Persist state
  useEffect(() => {
    try {
      const payload = {
        plan,
        fields: {
          f_name: fName,
          f_clinic: fClinic,
          f_email: fEmail,
          f_phone: fPhone,
          f_prefix: fPrefix,
          f_role: fRole,
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [plan, fName, fClinic, fEmail, fPhone, fPrefix, fRole]);

  // Phone format/validation
  useEffect(() => {
    const opt = PHONE_PREFIXES.find((p) => p.value === fPrefix);
    if (!opt) return;
    const digits = fPhone.replace(/\D/g, "").slice(0, opt.len);
    const formatted = digits.replace(/(.{3})(?=.)/g, "$1 ").trim();
    if (formatted !== fPhone) {
      setFPhone(formatted);
      return;
    }
    if (!digits.length) {
      setPhoneHint({ text: `Ingresa ${opt.len} dígitos`, tone: "" });
    } else if (digits.length < opt.len) {
      const missing = opt.len - digits.length;
      setPhoneHint({
        text: `Faltan ${missing} dígito${missing === 1 ? "" : "s"}`,
        tone: "err",
      });
    } else {
      setPhoneHint({ text: `Número válido para ${opt.value}`, tone: "ok" });
    }
  }, [fPhone, fPrefix]);

  const goToStep = (n: number) => {
    setStep(n);
    requestAnimationFrame(() => {
      const el = rootRef.current?.querySelector(`.${styles.formWrap}`) as HTMLElement | null;
      if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
    });
  };

  const nextStep = () => step < 3 && goToStep(step + 1);
  const prevStep = () => step > 1 && goToStep(step - 1);

  const selectedDay = dayIdx !== null ? days[dayIdx] : null;
  const canContinueStep2 = dayIdx !== null && slot !== null;

  const submitForm = async () => {
    const errs: Record<string, boolean> = {};
    if (!fName.trim()) errs.fName = true;
    if (!fClinic.trim()) errs.fClinic = true;
    if (!fEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fEmail.trim())) errs.fEmail = true;

    const opt = PHONE_PREFIXES.find((p) => p.value === fPrefix);
    const digits = fPhone.replace(/\D/g, "");
    if (!opt || digits.length !== opt.len) errs.fPhone = true;

    if (!consent) {
      alert("Debes aceptar el consentimiento.");
      return;
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const d = selectedDay!;
    const dateStr = `${DOW_LONG[d.getDay()]} ${d.getDate()} ${MON_LONG[d.getMonth()]}`;

    const payload = {
      plan,
      fecha: d.toISOString(),
      fecha_texto: dateStr,
      hora: slot,
      nombre: fName.trim(),
      clinica: fClinic.trim(),
      email: fEmail.trim(),
      telefono_prefijo: fPrefix,
      telefono: digits,
      telefono_completo: fPrefix + digits,
      rol: fRole,
      consentimiento: consent,
      origen: "landing/demo-v5",
      timestamp: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
        mode: "cors",
      });
    } catch (err) {
      console.warn("Webhook error:", err);
    }

    setModalInfo({ plan, dateStr, slot: slot!, name: payload.nombre, clinic: payload.clinica });
    setShowModal(true);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setSubmitting(false);
    setTimeout(() => {
      window.location.href = "https://www.clinera.io/demo";
    }, 2200);
  };

  const stepTitles: Record<number, string> = { 1: "Elige tu plan", 2: "Agenda tu hora", 3: "Tus datos" };
  const stepHints: Record<number, string> = { 1: "30 seg", 2: "20 seg", 3: "40 seg" };

  return (
    <div ref={rootRef} className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroBadge}>
            <span className={styles.dot} />
            Demostración personalizada · 30 min · sin compromiso
          </div>
          <h1 className={styles.heroTitle}>
            Agenda tu <span className={styles.gt}>demostración</span> y recupera pacientes con un agente IA
          </h1>

          <div className={styles.mainGrid}>
            {/* VIDEO COL */}
            <aside className={styles.videoCol}>
              <div className={styles.videoFrame}>
                <div className={styles.videoWrap}>
                  <iframe
                    src="https://player.vimeo.com/video/1184979478?badge=0&autopause=0&player_id=0&app_id=58479"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                    title="Conoce Clinera"
                  />
                </div>
              </div>
              <div className={styles.videoCaption}>
                <div className={styles.avatar}>RO</div>
                <div>
                  <div className={styles.speakerName}>Ricardo Oyarzún</div>
                  <div className={styles.speakerRole}>Fundador · Clinera.io</div>
                </div>
              </div>
              <div className={styles.trust}>
                <span>
                  <CheckIcon /> +180 clínicas activas
                </span>
                <span>
                  <CheckIcon /> Implementación en 7 días
                </span>
                <span>
                  <CheckIcon /> Soporte humano
                </span>
                <span className={styles.flagSep} aria-hidden />
                <span className={styles.flagInlineLabel}>Clínicas en</span>
                <span className={styles.flag} title="México">🇲🇽</span>
                <span className={styles.flag} title="Chile">🇨🇱</span>
                <span className={styles.flag} title="Ecuador">🇪🇨</span>
                <span className={styles.flag} title="Perú">🇵🇪</span>
                <span className={styles.flag} title="Colombia">🇨🇴</span>
                <span className={styles.flag} title="Argentina">🇦🇷</span>
              </div>
            </aside>

            {/* WIZARD COL */}
            <div>
              <div className={styles.formWrap}>
                <div className={styles.wizardHead}>
                  <div className={styles.wizardHeadRow}>
                    <div className={styles.wizardStepInfo}>
                      <span className={styles.wizardStepNum}>Paso {step} de 3</span>
                      <span className={styles.wizardStepTitle}>{stepTitles[step]}</span>
                    </div>
                    <span className={styles.wizardHint}>{stepHints[step]}</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${step * 33.333}%` }}
                    />
                  </div>
                  <div className={styles.stepsRow}>
                    {[1, 2, 3].map((n) => {
                      const labels: Record<number, string> = { 1: "Plan", 2: "Agenda", 3: "Tus datos" };
                      const dotClass = [
                        styles.stepDot,
                        n === step ? styles.stepDotActive : "",
                        n < step ? styles.stepDotDone : "",
                      ].join(" ");
                      const labelClass = [
                        styles.stepLabel,
                        n <= step ? styles.stepLabelActive : "",
                      ].join(" ");
                      return (
                        <div key={n} className={styles.stepNode}>
                          <span className={dotClass}>
                            <span>{n}</span>
                          </span>
                          <span className={labelClass}>{labels[n]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PANEL 1 */}
                <div className={`${styles.wizardPanel} ${step === 1 ? styles.wizardPanelActive : ""}`}>
                  <h2 className={styles.panelTitle}>¿Qué plan te acomoda?</h2>
                  <p className={styles.panelSub}>
                    Elige el que mejor calza con tu clínica hoy. Lo ajustamos contigo en la
                    demostración si lo necesitas.
                  </p>
                  <div className={styles.planStack}>
                    {PLANS.map((p) => (
                      <PlanOption
                        key={p.id}
                        plan={p}
                        checked={plan === p.value}
                        onChange={() => setPlan(p.value)}
                      />
                    ))}
                  </div>
                  <div className={styles.wizardNav}>
                    <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={nextStep}>
                      Continuar <ArrowRight />
                    </button>
                  </div>
                </div>

                {/* PANEL 2 */}
                <div className={`${styles.wizardPanel} ${step === 2 ? styles.wizardPanelActive : ""}`}>
                  <h2 className={styles.panelTitle}>¿Cuándo te acomoda?</h2>
                  <p className={styles.panelSub}>
                    Elige día y horario de los próximos 4 días hábiles. Son 30 minutos por Google Meet.
                  </p>
                  <div className={styles.dayGrid}>
                    {days.map((d, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`${styles.dayTab} ${i === dayIdx ? styles.dayTabActive : ""}`}
                        onClick={() => {
                          setDayIdx(i);
                          setSlot(null);
                        }}
                      >
                        <span className={styles.dow}>{DOW[d.getDay()]}</span>
                        <span className={styles.dnum}>{d.getDate()}</span>
                        <span className={styles.dmon}>{MON[d.getMonth()]}</span>
                      </button>
                    ))}
                  </div>
                  <div className={styles.slotsHead}>
                    <span>
                      {selectedDay
                        ? `Horarios · ${DOW[selectedDay.getDay()]} ${selectedDay.getDate()} ${MON[selectedDay.getMonth()]}`
                        : "Horarios disponibles"}
                    </span>
                    <span className={`${styles.fontMono} ${styles.slotsHeadHint}`}>
                      Lunes a viernes · 10:00 – 18:00
                    </span>
                  </div>
                  {selectedDay && (
                    <SlotGrid
                      date={selectedDay}
                      activeSlot={slot}
                      onSelect={setSlot}
                    />
                  )}
                  <div className={styles.tzHint}>
                    <ClockIcon />
                    <span>{tzLabel}</span>
                    <span>· ajustamos a tu zona</span>
                  </div>
                  <div className={styles.wizardNav}>
                    <button type="button" className={`${styles.btn} ${styles.btnBack}`} onClick={prevStep}>
                      <ArrowLeft /> Atrás
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      onClick={nextStep}
                      disabled={!canContinueStep2}
                    >
                      Continuar <ArrowRight />
                    </button>
                  </div>
                </div>

                {/* PANEL 3 */}
                <div className={`${styles.wizardPanel} ${step === 3 ? styles.wizardPanelActive : ""}`}>
                  <h2 className={styles.panelTitle}>Tus datos</h2>
                  <p className={styles.panelSub}>
                    Solo lo esencial. Te enviamos la confirmación por correo y WhatsApp.
                  </p>
                  <div className={styles.inputRowStack}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="f_name">
                        Nombre completo <span className={styles.req}>*</span>
                      </label>
                      <input
                        id="f_name"
                        type="text"
                        className={styles.input}
                        placeholder="Ej: María José Fuentes"
                        autoComplete="name"
                        value={fName}
                        onChange={(e) => setFName(e.target.value)}
                        style={errors.fName ? errorStyle : undefined}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="f_clinic">
                        Nombre de la clínica <span className={styles.req}>*</span>
                      </label>
                      <input
                        id="f_clinic"
                        type="text"
                        className={styles.input}
                        placeholder="Ej: Clínica Estética Santiago"
                        autoComplete="organization"
                        value={fClinic}
                        onChange={(e) => setFClinic(e.target.value)}
                        style={errors.fClinic ? errorStyle : undefined}
                      />
                    </div>
                    <div className={styles.inputRow2}>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="f_email">
                          Correo electrónico <span className={styles.req}>*</span>
                        </label>
                        <input
                          id="f_email"
                          type="email"
                          className={styles.input}
                          placeholder="tu@correo.cl"
                          autoComplete="email"
                          value={fEmail}
                          onChange={(e) => setFEmail(e.target.value)}
                          style={errors.fEmail ? errorStyle : undefined}
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="f_phone">
                          WhatsApp <span className={styles.req}>*</span>
                        </label>
                        <div className={styles.phoneWrap}>
                          <select
                            className={styles.select}
                            value={fPrefix}
                            onChange={(e) => setFPrefix(e.target.value)}
                          >
                            {PHONE_PREFIXES.map((p) => (
                              <option key={p.value} value={p.value}>
                                {p.label}
                              </option>
                            ))}
                          </select>
                          <input
                            id="f_phone"
                            type="tel"
                            className={styles.input}
                            placeholder={
                              PHONE_PREFIXES.find((p) => p.value === fPrefix)?.ex || ""
                            }
                            autoComplete="tel"
                            inputMode="numeric"
                            value={fPhone}
                            onChange={(e) => setFPhone(e.target.value)}
                            style={errors.fPhone ? errorStyle : undefined}
                          />
                        </div>
                        <div
                          className={`${styles.phoneHint} ${
                            phoneHint.tone === "err"
                              ? styles.phoneHintErr
                              : phoneHint.tone === "ok"
                              ? styles.phoneHintOk
                              : ""
                          }`}
                        >
                          {phoneHint.text}
                        </div>
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="f_role">
                        Tu rol en la clínica <span className={styles.opt}>(opcional)</span>
                      </label>
                      <select
                        id="f_role"
                        className={styles.select}
                        value={fRole}
                        onChange={(e) => setFRole(e.target.value)}
                      >
                        <option value="">Selecciona una opción</option>
                        {ROLES.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.meetNote}>
                    <GoogleMeetIcon />
                    <div>
                      <div className={styles.meetTitle}>Reunión de 30 min en Google Meet</div>
                      <div className={styles.meetSub}>
                        Te enviamos el link por correo y WhatsApp al confirmar
                      </div>
                    </div>
                  </div>

                  <label className={styles.consent}>
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />
                    <span>
                      Acepto que Clinera use mis datos para contactarme sobre esta
                      demostración y entiendo que puedo darme de baja en cualquier momento.
                    </span>
                  </label>

                  <div className={styles.wizardNav}>
                    <button type="button" className={`${styles.btn} ${styles.btnBack}`} onClick={prevStep}>
                      <ArrowLeft /> Atrás
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      onClick={submitForm}
                      disabled={submitting}
                    >
                      {submitting ? "Enviando..." : "Confirmar demostración"}
                      {!submitting && <CheckIconBold />}
                    </button>
                  </div>
                </div>
              </div>
              <div className={styles.formFoot}>
                🔒 Tus datos están protegidos · Nunca enviamos spam
              </div>
            </div>
          </div>
        </div>
      </section>

      {showModal && modalInfo && (
        <div className={`${styles.modalBackdrop} ${styles.modalBackdropShow}`}>
          <div className={styles.modal}>
            <div className={styles.modalIcon}>
              <CheckIconBold />
            </div>
            <h3 className={styles.gt}>¡Demostración confirmada!</h3>
            <p>
              Te enviamos un correo con el link de Google Meet y el resumen. Te estamos
              llevando a la demo del software...
            </p>
            <div className={styles.modalInfo}>
              <div>
                <strong>Plan:</strong> {modalInfo.plan}
              </div>
              <div>
                <strong>Fecha:</strong> {modalInfo.dateStr} · {modalInfo.slot} hrs
              </div>
              <div>
                <strong>Para:</strong> {modalInfo.name} — {modalInfo.clinic}
              </div>
            </div>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              style={{ margin: "0 auto" }}
              onClick={() => (window.location.href = "https://www.clinera.io/demo")}
            >
              Ir a la demo ahora
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const errorStyle: React.CSSProperties = {
  borderColor: "#EF4444",
  boxShadow: "0 0 0 4px rgba(239, 68, 68, 0.1)",
};

function PlanOption({
  plan,
  checked,
  onChange,
}: {
  plan: Plan;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <>
      <input
        type="radio"
        name="plan"
        id={plan.id}
        value={plan.value}
        className={styles.sr}
        checked={checked}
        onChange={onChange}
      />
      <label
        htmlFor={plan.id}
        className={`${styles.planCard} ${plan.undecided ? styles.planCardUndecided : ""}`}
      >
        <span className={styles.planRadioMark} />
        <div className={styles.planNameRow}>
          <span className={styles.planName}>{plan.name}</span>
          {plan.tag && (
            <span className={`${styles.planTag} ${plan.tag.soft ? styles.planTagSoft : ""}`}>
              {plan.tag.label}
            </span>
          )}
          {plan.price && (
            <span className={styles.planPrice}>
              <span className={styles.planPriceNum}>{plan.price.amount}</span>
              <span className={styles.planPricePer}>{plan.price.per}</span>
            </span>
          )}
        </div>
        <p className={styles.planDesc}>{plan.desc}</p>
      </label>
    </>
  );
}

function SlotGrid({
  date,
  activeSlot,
  onSelect,
}: {
  date: Date;
  activeSlot: string | null;
  onSelect: (s: string) => void;
}) {
  const all = generateSlots();
  const blocked = getBlockedSlots(date, all.length);
  return (
    <div className={styles.slotGrid}>
      {all.map((s, i) => {
        const isBlocked = blocked.has(i);
        const isActive = activeSlot === s;
        return (
          <button
            key={s}
            type="button"
            className={`${styles.slot} ${isActive ? styles.slotActive : ""} ${
              isBlocked ? styles.slotDisabled : ""
            }`}
            onClick={() => !isBlocked && onSelect(s)}
            disabled={isBlocked}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

/* ── Icons ── */
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function CheckIconBold() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
function ArrowLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function GoogleMeetIcon() {
  return (
    <svg viewBox="0 0 87 72" width="28" height="23" aria-hidden="true">
      <path fill="#00832d" d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z" />
      <path fill="#0066da" d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z" />
      <path fill="#e94235" d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z" />
      <path fill="#2684fc" d="M20.5 20.5H0v31h20.5z" />
      <path fill="#00ac47" d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.85.135 4.85-2.37V11c0-2.535-2.945-3.925-4.91-2.32zM49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z" />
      <path fill="#ffba00" d="M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z" />
    </svg>
  );
}
