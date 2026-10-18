"use client";

// ============================================================================
// /agenda — wizard de 3 pasos que termina en una videollamada (Ricardo, 18-oct-2026)
//
// Formato de `metodohebe.cl/evaluacion` y `protocololumina.cl/evaluacion` (Ricardo,
// 18-oct-2026): una columna, carrusel de casos arriba, «Paso N de 3» con tarjetas
// seleccionables y los datos de contacto al final.
//
//   Paso 1  qué servicio te interesa (se pueden elegir varios) → ViewContent
//   Paso 2  tus datos: nombre, correo, celular y nombre de la clínica → CRM + Lead (US$ 3)
//   Paso 3  elige tu horario: calendario nativo de Clinera (`StepClineraScheduler`) →
//           Schedule + MQL (US$ 10)
//
// Solo se piden esos cuatro datos (Ricardo, 18-oct-2026: «el resto lo manejamos
// nosotros»): sin ciudad, país, tipo de clínica ni profesionales. El país del lead sale
// del prefijo del celular. El lead se manda al CRM al enviar el paso 2
// (`submitContactLead`, el mismo webhook de siempre); lo elegido antes viaja en ese
// envío (`servicio_interes`) y en el `booking_confirmed`. No hay un segundo `contact`:
// con el mismo correo n8n lo etiqueta «Volvió a cotizar».
//
// Embudo (Ricardo, 18-oct-2026): rellena el formulario = Lead (US$ 3) · además agenda
// una hora = MQL (US$ 10, lo dispara la reserva) · además asiste, es real y califica =
// SQL (US$ 30, lo emite el CRM desde Twenty, no el sitio) · paga un plan = Cliente
// (valor del plan, lo manda Stripe).
//
// Sin cupón, sin Payment Links y sin compra: la única salida es la videollamada.
// ============================================================================

import { useEffect, useRef, useState } from "react";
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
import { ECOSISTEMA_SLIDES, SERVICIOS, esServicio } from "@/content/agenda-oferta";
import type { ServicioId } from "@/content/planes";
import { fireLeadEvent } from "@/lib/metaEvents";
import {
  RESERVA_PHONE_PREFIXES,
  aE164,
  digitosTelefono,
  formatearTelefono,
  mensajeErrorTelefono,
  reglaTelefono,
} from "@/lib/telefono";
import { trackPixel } from "@/lib/tracking";
import { zonaMostrada } from "@/lib/timezone";
import base from "@/components/estetica/EsteticaAdsLanding.module.css";
import styles from "./AgendaWizard.module.css";

const SOURCE_PATH = "/agenda";
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MX_TZ = /^America\/(Mexico_City|Cancun|Merida|Monterrey|Matamoros|Chihuahua|Ciudad_Juarez|Ojinaga|Mazatlan|Hermosillo|Tijuana|Bahia_Banderas)$/;
const TOTAL = 3;
const TITULOS_PASO = ["Qué te interesa", "Tus datos", "Tu horario"];

// Lo que se puede elegir: marketing y software (los dos juntos = el ecosistema completo).
const OPCIONES = SERVICIOS.filter((s) => s.id === "marketing" || s.id === "software");
type Opcion = "marketing" | "software";

function Check({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const paisDePrefijo = (prefix: string) => RESERVA_PHONE_PREFIXES.find((p) => p.prefix === prefix)?.label ?? "";

/** `?servicio=` de la URL → opciones marcadas. «ambas» marca las dos. */
function opcionesIniciales(v: string | null | undefined): Opcion[] {
  if (!esServicio(v)) return [];
  return v === "ambas" ? ["marketing", "software"] : [v];
}

export default function AgendaWizard({
  tzIp = "",
  servicioInicial = null,
}: {
  tzIp?: string;
  /** `?servicio=` de la URL: deja esas opciones marcadas en el paso 1. */
  servicioInicial?: string | null;
}) {
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [elegidos, setElegidos] = useState<Opcion[]>(() => opcionesIniciales(servicioInicial));
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [prefix, setPrefix] = useState(() => (MX_TZ.test(tzIp) ? "+52" : "+56"));
  const [phone, setPhone] = useState("");
  const [clinica, setClinica] = useState("");
  const [intentado, setIntentado] = useState(false);
  const [leadCtx, setLeadCtx] = useState<{ eventId: string; leadSource: string } | null>(null);
  const [booking, setBooking] = useState<CalBooking | null>(null);
  const [caso, setCaso] = useState(0);
  const formStarted = useRef(false);
  const bookingSent = useRef(false);

  useEffect(() => {
    pushDL("agenda_landing_view", { source_path: SOURCE_PATH, servicio_url: servicioInicial ?? "" });
  }, [servicioInicial]);

  // Panel izquierdo: cómo funciona el ecosistema, una imagen cada pocos segundos.
  useEffect(() => {
    const t = window.setInterval(() => setCaso((c) => (c + 1) % ECOSISTEMA_SLIDES.length), 4500);
    return () => window.clearInterval(t);
  }, []);

  function marcarInicio() {
    if (formStarted.current) return;
    formStarted.current = true;
    pushDL("agenda_form_start", { source_path: SOURCE_PATH });
  }

  // Una opción = ese servicio; las dos juntas = «ambas», el valor que ya entiende el CRM.
  const servicio: ServicioId | null = elegidos.length === 2 ? "ambas" : (elegidos[0] ?? null);
  const servicioLabel = elegidos.length === 2 ? "Marketing de performance + Software con IA" : (OPCIONES.find((o) => o.id === elegidos[0])?.titulo ?? "");

  const digitos = digitosTelefono(phone);
  const phoneError = mensajeErrorTelefono(prefix, digitos);
  const phoneOk = phoneError === null;
  const nombreOk = nombre.trim().length >= 2;
  const emailOk = EMAIL_OK.test(email.trim());
  const clinicaOk = clinica.trim().length >= 2;
  const datosOk = nombreOk && emailOk && phoneOk && clinicaOk;
  const rule = reglaTelefono(prefix);

  const form: Form = {
    nombre,
    clinica,
    tipoClinica: "",
    subtipo: null,
    prefix,
    phone: digitos,
    email,
    website: "",
    city: "",
    pais: paisDePrefijo(prefix),
    cargo: "" as Form["cargo"],
    boxes: null,
    servicio: servicio ? { id: servicio, label: servicioLabel } : null,
  };
  const size = { profile: null };
  const qual = evaluateQualification(size);

  function errorDatos(): string {
    if (!nombreOk) return "Escribe tu nombre.";
    if (!emailOk) return "Revisa tu correo.";
    if (phoneError) return phoneError;
    if (!clinicaOk) return "Escribe el nombre de tu clínica.";
    return "Revisa tus datos.";
  }

  function irA(n: 1 | 2 | 3) {
    setPaso(n);
    window.scrollTo({ top: 0 });
  }

  function alternar(o: Opcion) {
    marcarInicio();
    setElegidos((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]));
  }

  function enviarPaso1() {
    if (!servicio) {
      setIntentado(true);
      return;
    }
    pushDL("agenda_step_complete", { step: 1, step_name: "servicio", servicio, source_path: SOURCE_PATH });
    // ViewContent con lo elegido (Ricardo, 18-oct-2026).
    trackPixel("ViewContent", { content_name: servicioLabel, content_category: "servicio_interes", content_ids: elegidos });
    setIntentado(false);
    irA(2);
  }

  function enviarPaso2() {
    if (!datosOk) {
      setIntentado(true);
      return;
    }
    const eventId = leadCtx?.eventId ?? newLeadEventId();
    const ctx = leadCtx ?? { eventId, leadSource: detectLeadSource() };
    if (!leadCtx) setLeadCtx(ctx);
    pushDL("agenda_step_complete", { step: 2, step_name: "datos", servicio, source_path: SOURCE_PATH });
    setIntentado(false);
    irA(3);
    // Embudo de Meta (Ricardo, 18-oct-2026): rellenar el formulario = Lead US$ 3.
    // Agendar la hora (paso 3) dispara Schedule + MQL.
    void fireLeadEvent({
      eventId: ctx.eventId,
      contact: { email: email.trim(), phoneE164: aE164(prefix, digitos) },
      customData: { content_name: "agenda_videollamada", lead_source: ctx.leadSource },
    });
    // Al CRM al enviar los datos: el lead que no agenda igual queda. No se espera a n8n.
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

  const enCalendario = paso === 3 && booking === null;
  const slide = ECOSISTEMA_SLIDES[caso];

  return (
    <div
      className={`${base.page} ${styles.pagina} ${paso > 1 || booking ? styles.avanzado : ""} ${enCalendario || booking ? styles.calendario : ""}`}
      data-paso={paso}
    >
      <aside className={styles.panel} data-agenda-casos>
        <div className={styles.marco} aria-roledescription="carrusel">
          {ECOSISTEMA_SLIDES.map((sl, i) => (
            <figure key={sl.n} className={`${styles.slide} ${i === caso ? styles.slideOn : ""}`} aria-hidden={i !== caso}>
              {sl.img ? (
                <div className={styles.slideImg} style={{ backgroundImage: `url(${sl.img})` }} role="img" aria-label={sl.titulo} />
              ) : (
                <div className={`${styles.slideImg} ${styles.slideMarca}`} role="img" aria-label={sl.titulo}>
                  <span>{sl.n}</span>
                  <em>Facebook · Instagram · Google</em>
                </div>
              )}
            </figure>
          ))}
        </div>
        <p className={styles.caption}>
          <b>
            {slide.n} de {ECOSISTEMA_SLIDES.length} · {slide.titulo}
          </b>
          <span>{slide.texto}</span>
        </p>
        <div className={styles.puntos} aria-hidden>
          {ECOSISTEMA_SLIDES.map((sl, i) => (
            <span key={sl.n} className={`${styles.punto} ${i === caso ? styles.puntoOn : ""}`} />
          ))}
        </div>
        <h1 className={styles.chip}>
          <span className={styles.chipTitulo}>Agenda tu videollamada con Clinera</span>
          <span className={styles.chipSub}>Así funciona el ecosistema</span>
        </h1>
      </aside>

      <main className={styles.lado}>
        <div className={styles.contenido}>
          <div className={styles.tarjeta} id="agendar">
            {booking ? (
              <div className={base.done} data-agenda-listo>
                <div className={base.doneCheck} aria-hidden>
                  <Check size={22} />
                </div>
                <h2 className={base.cardTitle}>Listo, te esperamos.</h2>
                {booking.date && (
                  <p className={base.when}>
                    {textoReserva(booking.date, zonaMostrada(tzIp, ""))}
                    {booking.organizer?.name ? ` · ${booking.organizer.name}` : ""}
                  </p>
                )}
                <p className={base.cardSub}>Te llegará la confirmación por correo y por WhatsApp.</p>
              </div>
            ) : (
              <>
                <div className={styles.progress} aria-hidden>
                  {Array.from({ length: TOTAL }, (_, i) => (
                    <span key={i} className={`${styles.seg} ${i + 1 <= paso ? styles.segOn : ""}`} />
                  ))}
                </div>
                <span className={styles.paso}>
                  Paso {paso} de {TOTAL} · {TITULOS_PASO[paso - 1]}
                </span>

                {paso === 1 && (
                  <div data-agenda-paso="1">
                    <h2 className={styles.titulo}>¿Qué servicio te interesa?</h2>
                    <p className={styles.sub}>Puedes elegir los dos.</p>
                    <div className={styles.servicios} role="group" aria-label="Servicio de interés">
                      {OPCIONES.map((s) => {
                        const on = elegidos.includes(s.id as Opcion);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            role="checkbox"
                            aria-checked={on}
                            data-servicio={s.id}
                            className={`${styles.servicio} ${on ? styles.servicioOn : ""}`}
                            onClick={() => alternar(s.id as Opcion)}
                          >
                            <span className={`${styles.radio} ${styles.casilla}`} aria-hidden>
                              {on && <Check size={13} />}
                            </span>
                            <span className={styles.servicioTitulo}>{s.titulo}</span>
                            <span className={styles.servicioTexto}>{s.texto}</span>
                          </button>
                        );
                      })}
                    </div>
                    {intentado && !servicio && (
                      <p className={base.error} role="alert">
                        Elige al menos un servicio.
                      </p>
                    )}
                    <button type="button" className={base.cta} onClick={enviarPaso1}>
                      Continuar →
                    </button>
                  </div>
                )}

                {paso === 2 && (
                  <div data-agenda-paso="2" onFocusCapture={marcarInicio}>
                    <h2 className={styles.titulo}>¿Dónde te confirmamos?</h2>

                    <label className={base.label} htmlFor="ag-nombre">Nombre</label>
                    <input id="ag-nombre" className={base.input} value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" placeholder="Nombre y apellido" aria-invalid={intentado && !nombreOk} />

                    <label className={base.label} htmlFor="ag-email">Correo</label>
                    <input id="ag-email" className={base.input} value={email} onChange={(e) => setEmail(e.target.value)} type="email" inputMode="email" autoComplete="email" placeholder="tucorreo@clinica.cl" aria-invalid={intentado && !emailOk} />

                    <label className={base.label} htmlFor="ag-phone">Celular (WhatsApp)</label>
                    <div className={base.phoneRow}>
                      <select
                        className={base.select}
                        value={prefix}
                        onChange={(e) => {
                          setPrefix(e.target.value);
                          setPhone(formatearTelefono(phone, e.target.value));
                        }}
                        aria-label="Código de país"
                      >
                        {RESERVA_PHONE_PREFIXES.map((p) => (
                          <option key={p.prefix} value={p.prefix}>
                            {p.flag} {p.prefix}
                          </option>
                        ))}
                      </select>
                      <input id="ag-phone" className={base.input} value={phone} onChange={(e) => setPhone(formatearTelefono(e.target.value, prefix))} type="tel" inputMode="tel" autoComplete="tel" placeholder={rule.placeholder} aria-invalid={intentado && !phoneOk} data-e164={phoneOk ? aE164(prefix, digitos) : undefined} />
                    </div>

                    <label className={base.label} htmlFor="ag-clinica">Nombre de tu clínica</label>
                    <input id="ag-clinica" className={base.input} value={clinica} onChange={(e) => setClinica(e.target.value)} autoComplete="organization" placeholder="Clínica Estética Vela" aria-invalid={intentado && !clinicaOk} />

                    {intentado && !datosOk && (
                      <p className={base.error} role="alert">
                        {errorDatos()}
                      </p>
                    )}
                    <button type="button" className={base.cta} onClick={enviarPaso2}>
                      Elegir mi hora →
                    </button>
                    <button type="button" className={styles.volver} onClick={() => irA(1)}>
                      ← Volver
                    </button>
                  </div>
                )}

                {paso === 3 && (
                  <div data-agenda-paso="3">
                    <StepClineraScheduler
                      form={form}
                      tzIp={tzIp}
                      label="Videollamada de 30 minutos con el equipo"
                      onBack={() => irA(2)}
                      onBooked={(next, via, confirmEventId) => {
                        if (bookingSent.current) return;
                        bookingSent.current = true;
                        setBooking(next);
                        pushDL("agenda_step_complete", { step: 3, step_name: "horario", servicio, source_path: SOURCE_PATH });
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
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
