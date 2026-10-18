"use client";

// ============================================================================
// /agenda — wizard de 3 pasos que termina en una videollamada (Ricardo, 18-oct-2026)
//
// Formato de `metodohebe.cl/evaluacion` y `protocololumina.cl/evaluacion` (Ricardo,
// 18-oct-2026): una columna, carrusel de casos arriba, «Paso N de 3» con tarjetas
// seleccionables y los datos de contacto al final.
//
//   Paso 1  qué servicio te interesa (marketing / software / ambas) → ViewContent
//   Paso 2  tu clínica (nombre, tipo, profesionales, ciudad y país)
//   Paso 3  tus datos (nombre, celular, correo) → CRM + evento Lead (US$ 3)
//   Luego   calendario nativo de Clinera (`StepClineraScheduler`) → Schedule + MQL (US$ 10)
//
// El lead se manda al CRM al enviar el paso 3 (`submitContactLead`, el mismo webhook
// de siempre); lo elegido antes viaja en ese mismo envío (`servicio_interes`) y en el
// `booking_confirmed`. No hay un segundo `contact`: con el mismo correo n8n lo etiqueta
// «Volvió a cotizar».
//
// Embudo (Ricardo, 18-oct-2026): rellena el formulario = Lead (US$ 3) · además agenda
// una hora = MQL (US$ 10, lo dispara la reserva) · además asiste, es real y califica =
// SQL (US$ 30, lo emite el CRM desde Twenty, no el sitio) · paga un plan = Cliente
// (valor del plan, lo manda Stripe).
//
// Sin cupón, sin Payment Links y sin compra: la única salida es la videollamada.
// ============================================================================

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/brand-v3/Brand";
import ChatAgendaIA from "@/components/estetica/ChatAgendaIA";
import ClinicasLogos from "@/components/clinicas/ClinicasLogos";
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
  AGENDA_COPY,
  ECOSISTEMA_PASOS,
  PROFESIONALES,
  SERVICIOS,
  TIPOS_CLINICA,
  esServicio,
  type TipoClinicaId,
} from "@/content/agenda-oferta";
import type { ServicioId } from "@/content/planes";
import { PRUEBA_SOCIAL_ESTETICA } from "@/content/estetica";
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
const TITULOS_PASO = ["Qué te interesa", "Tu clínica", "Tus datos"];

// Casos que el visitante ve arriba, como el carrusel de casos de Método Hebe.
const CASOS = [
  { img: "/images/home/flavio.jpeg", nombre: "Dr. Flavio Rojas", uso: "Ficha corporal · agente IA de texto y voz" },
  { img: "/images/home/yasna.jpg", nombre: "Dra. Yasna Vásquez", uso: "Odontograma · agente IA de texto" },
  { img: "/images/home/katherine.png", nombre: "Katherine Meza", uso: "Ficha facial · Clinera Intelligence" },
] as const;

function Check({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const paisDePrefijo = (prefix: string) => RESERVA_PHONE_PREFIXES.find((p) => p.prefix === prefix)?.label ?? "";

export default function AgendaWizard({
  tzIp = "",
  servicioInicial = null,
}: {
  tzIp?: string;
  /** `?servicio=` de la URL: deja esa opción preseleccionada en el paso 1. */
  servicioInicial?: string | null;
}) {
  // 1..3 = pasos; 4 = calendario.
  const [paso, setPaso] = useState<1 | 2 | 3 | 4>(1);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [prefix, setPrefix] = useState(() => (MX_TZ.test(tzIp) ? "+52" : "+56"));
  const [phone, setPhone] = useState("");
  const [clinica, setClinica] = useState("");
  const [tipo, setTipo] = useState<TipoClinicaId | "">("");
  const [profesionales, setProfesionales] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [pais, setPais] = useState<string | null>(null); // null = sigue al prefijo del celular
  const [servicio, setServicio] = useState<ServicioId | null>(esServicio(servicioInicial) ? servicioInicial : null);
  const [intentado, setIntentado] = useState(false);
  const [leadCtx, setLeadCtx] = useState<{ eventId: string; leadSource: string } | null>(null);
  const [booking, setBooking] = useState<CalBooking | null>(null);
  const [caso, setCaso] = useState(0);
  const formStarted = useRef(false);
  const bookingSent = useRef(false);

  useEffect(() => {
    pushDL("agenda_landing_view", { source_path: SOURCE_PATH, servicio_url: servicioInicial ?? "" });
  }, [servicioInicial]);

  useEffect(() => {
    const t = window.setInterval(() => setCaso((c) => (c + 1) % CASOS.length), 4500);
    return () => window.clearInterval(t);
  }, []);

  function marcarInicio() {
    if (formStarted.current) return;
    formStarted.current = true;
    pushDL("agenda_form_start", { source_path: SOURCE_PATH });
  }

  const digitos = digitosTelefono(phone);
  const phoneError = mensajeErrorTelefono(prefix, digitos);
  const phoneOk = phoneError === null;
  const nombreOk = nombre.trim().length >= 2;
  const emailOk = EMAIL_OK.test(email.trim());
  const clinicaOk = clinica.trim().length >= 2;
  const tipoSel = TIPOS_CLINICA.find((t) => t.id === tipo) ?? null;
  const prof = PROFESIONALES.find((p) => p.id === profesionales) ?? null;
  const ciudadOk = ciudad.trim().length >= 2;
  const paisActual = pais ?? paisDePrefijo(prefix);
  const clinicaPasoOk = clinicaOk && !!tipoSel && !!prof && ciudadOk && !!paisActual;
  const contactoOk = nombreOk && emailOk && phoneOk;
  const rule = reglaTelefono(prefix);
  const servicioSel = SERVICIOS.find((s) => s.id === servicio) ?? null;

  const form: Form = {
    nombre,
    clinica,
    tipoClinica: tipoSel?.tipoClinica ?? "",
    subtipo: tipoSel?.subtipo ?? null,
    prefix,
    phone: digitos,
    email,
    website: "",
    city: ciudad,
    pais: paisActual,
    cargo: "" as Form["cargo"],
    boxes: prof ? { id: prof.id, label: prof.label } : null,
    servicio: servicioSel ? { id: servicioSel.id, label: servicioSel.titulo } : null,
  };
  const size = { profile: null };
  const qual = evaluateQualification(size);

  function errorPaso2(): string {
    if (!clinicaOk) return "Escribe el nombre de tu clínica.";
    if (!tipoSel) return "Elige qué tipo de clínica tienes.";
    if (!prof) return "Elige cuántos profesionales tiene tu clínica.";
    if (!ciudadOk) return "Escribe tu ciudad.";
    return "Revisa los datos de tu clínica.";
  }

  function errorPaso3(): string {
    if (!nombreOk) return "Escribe tu nombre.";
    if (phoneError) return phoneError;
    if (!emailOk) return "Revisa tu correo.";
    return "Revisa tus datos.";
  }

  function irA(n: 1 | 2 | 3 | 4) {
    setPaso(n);
    window.scrollTo({ top: 0 });
  }

  function enviarPaso1() {
    if (!servicioSel) {
      setIntentado(true);
      return;
    }
    pushDL("agenda_step_complete", { step: 1, step_name: "servicio", servicio: servicioSel.id, source_path: SOURCE_PATH });
    // ViewContent con el servicio elegido (Ricardo, 18-oct-2026).
    trackPixel("ViewContent", { content_name: servicioSel.titulo, content_category: "servicio_interes", content_ids: [servicioSel.id] });
    setIntentado(false);
    irA(2);
  }

  function enviarPaso2() {
    if (!clinicaPasoOk) {
      setIntentado(true);
      return;
    }
    pushDL("agenda_step_complete", { step: 2, step_name: "clinica", tamano_boxes: profesionales, tipo_clinica: tipo, source_path: SOURCE_PATH });
    setIntentado(false);
    irA(3);
  }

  function enviarPaso3() {
    if (!contactoOk) {
      setIntentado(true);
      return;
    }
    const eventId = leadCtx?.eventId ?? newLeadEventId();
    const ctx = leadCtx ?? { eventId, leadSource: detectLeadSource() };
    if (!leadCtx) setLeadCtx(ctx);
    pushDL("agenda_step_complete", { step: 3, step_name: "datos", servicio, source_path: SOURCE_PATH });
    setIntentado(false);
    irA(4);
    // Embudo de Meta (Ricardo, 18-oct-2026): rellenar el formulario = Lead US$ 3.
    // Agendar la hora (calendario) dispara Schedule + MQL.
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

  const enCalendario = paso === 4 && booking === null;

  return (
    <div className={`${base.page} ${styles.aire} ${styles.pagina}`}>
      <header className={base.top}>
        <Link href="/" aria-label="Clinera.io">
          <Wordmark size={19} />
        </Link>
        <span className={base.meta}>{AGENDA_COPY.eyebrow}</span>
      </header>

      <main className={styles.columna}>
        <div className={styles.casos} data-agenda-casos aria-roledescription="carrusel">
          {CASOS.map((c, i) => (
            <figure key={c.nombre} className={`${styles.caso} ${i === caso ? styles.casoOn : ""}`} aria-hidden={i !== caso}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt={c.nombre} className={styles.casoImg} loading={i === 0 ? "eager" : "lazy"} />
              <figcaption className={styles.casoPie}>
                <strong>{c.nombre}</strong>
                <span>{c.uso}</span>
              </figcaption>
            </figure>
          ))}
          <div className={styles.casoPuntos} aria-hidden>
            {CASOS.map((c, i) => (
              <span key={c.nombre} className={`${styles.punto} ${i === caso ? styles.puntoOn : ""}`} />
            ))}
          </div>
        </div>

        <h1 className={styles.h1}>
          Agenda tu <span className={base.grad}>videollamada con Clinera</span>
        </h1>
        <p className={styles.sub}>{AGENDA_COPY.sub}</p>
        <div className={styles.prueba} data-prueba-social>
          <span>
            <span aria-hidden style={{ color: "#F59E0B", letterSpacing: "0.1em", marginRight: 6 }}>★★★★★</span>
            {PRUEBA_SOCIAL_ESTETICA[0]}
          </span>
          <span>{PRUEBA_SOCIAL_ESTETICA[1]}</span>
        </div>

        <div className={base.formCol} id="agendar">
          <div className={`${base.card} ${styles.cardDestacada} ${enCalendario ? styles.cardAncha : ""}`}>
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
                {paso <= 3 && (
                  <>
                    <div className={styles.progress} aria-hidden>
                      {Array.from({ length: TOTAL }, (_, i) => (
                        <span key={i} className={`${styles.seg} ${i + 1 <= paso ? styles.segOn : ""}`} />
                      ))}
                    </div>
                    <span className={base.stepMeta}>
                      Paso {paso} de {TOTAL} · {TITULOS_PASO[paso - 1]}
                    </span>
                  </>
                )}

                {paso === 1 && (
                  <div onFocusCapture={marcarInicio} data-agenda-paso="1">
                    <h2 className={base.cardTitle}>¿Qué servicio te interesa?</h2>
                    <p className={base.cardSub}>Elige uno. En la videollamada vemos el detalle.</p>
                    <div className={styles.servicios} role="radiogroup" aria-label="Servicio de interés">
                      {SERVICIOS.map((s) => {
                        const on = servicio === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            data-servicio={s.id}
                            className={`${styles.servicio} ${on ? styles.servicioOn : ""} ${s.destacada ? styles.servicioDestacado : ""}`}
                            onClick={() => {
                              marcarInicio();
                              setServicio(s.id);
                            }}
                          >
                            {s.etiqueta && <span className={styles.recomendado}>{s.etiqueta}</span>}
                            <span className={styles.radio} aria-hidden>
                              {on && <Check size={13} />}
                            </span>
                            <span className={styles.servicioTitulo}>{s.titulo}</span>
                            <span className={styles.servicioTexto}>{s.texto}</span>
                          </button>
                        );
                      })}
                    </div>
                    {intentado && !servicioSel && (
                      <p className={base.error} role="alert">
                        Elige el servicio que te interesa.
                      </p>
                    )}
                    <button type="button" className={base.cta} onClick={enviarPaso1}>
                      Continuar →
                    </button>
                  </div>
                )}

                {paso === 2 && (
                  <div data-agenda-paso="2">
                    <h2 className={base.cardTitle}>Cuéntanos de tu clínica</h2>
                    <p className={base.cardSub}>Te toma un minuto. Sin tarjeta.</p>

                    <label className={base.label} htmlFor="ag-clinica">Nombre de tu clínica</label>
                    <input id="ag-clinica" className={base.input} value={clinica} onChange={(e) => setClinica(e.target.value)} autoComplete="organization" placeholder="Clínica Estética Vela" aria-invalid={intentado && !clinicaOk} />

                    <span className={base.label} id="ag-tipo-label">Tipo de clínica</span>
                    <div className={styles.opciones} role="radiogroup" aria-labelledby="ag-tipo-label">
                      {TIPOS_CLINICA.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          role="radio"
                          aria-checked={tipo === t.id}
                          className={`${styles.opcion} ${tipo === t.id ? styles.opcionOn : ""}`}
                          onClick={() => setTipo(t.id)}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <span className={base.label} id="ag-prof-label">¿Cuántos profesionales atienden?</span>
                    <div className={styles.opciones} role="radiogroup" aria-labelledby="ag-prof-label">
                      {PROFESIONALES.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          role="radio"
                          aria-checked={profesionales === p.id}
                          className={`${styles.opcion} ${profesionales === p.id ? styles.opcionOn : ""}`}
                          onClick={() => setProfesionales(p.id)}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    <div className={styles.fila2}>
                      <div>
                        <label className={base.label} htmlFor="ag-ciudad">Ciudad</label>
                        <input id="ag-ciudad" className={base.input} value={ciudad} onChange={(e) => setCiudad(e.target.value)} autoComplete="address-level2" placeholder="Santiago" aria-invalid={intentado && !ciudadOk} />
                      </div>
                      <div>
                        <label className={base.label} htmlFor="ag-pais">País</label>
                        <select id="ag-pais" className={base.select} style={{ width: "100%" }} value={paisActual} onChange={(e) => setPais(e.target.value)}>
                          {RESERVA_PHONE_PREFIXES.map((p) => (
                            <option key={p.prefix} value={p.label}>
                              {p.flag} {p.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {intentado && !clinicaPasoOk && (
                      <p className={base.error} role="alert">
                        {errorPaso2()}
                      </p>
                    )}
                    <button type="button" className={base.cta} onClick={enviarPaso2}>
                      Continuar →
                    </button>
                    <button type="button" className={styles.volver} onClick={() => irA(1)}>
                      ← Volver
                    </button>
                  </div>
                )}

                {paso === 3 && (
                  <div data-agenda-paso="3">
                    <h2 className={base.cardTitle}>¿Dónde te confirmamos?</h2>
                    <p className={base.cardSub}>Con esto reservamos tu videollamada.</p>

                    <label className={base.label} htmlFor="ag-nombre">Nombre</label>
                    <input id="ag-nombre" className={base.input} value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" placeholder="Nombre y apellido" aria-invalid={intentado && !nombreOk} />

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

                    <label className={base.label} htmlFor="ag-email">Correo</label>
                    <input id="ag-email" className={base.input} value={email} onChange={(e) => setEmail(e.target.value)} type="email" inputMode="email" autoComplete="email" placeholder="tucorreo@clinica.cl" aria-invalid={intentado && !emailOk} />

                    {intentado && !contactoOk && (
                      <p className={base.error} role="alert">
                        {errorPaso3()}
                      </p>
                    )}
                    <button type="button" className={base.cta} onClick={enviarPaso3}>
                      Enviar y elegir mi hora →
                    </button>
                    <p className={base.note}>Tus datos no se comparten.</p>
                    <button type="button" className={styles.volver} onClick={() => irA(2)}>
                      ← Volver
                    </button>
                  </div>
                )}

                {paso === 4 && (
                  <div data-agenda-paso="4">
                    <StepClineraScheduler
                      form={form}
                      tzIp={tzIp}
                      label="Videollamada de 30 minutos con el equipo"
                      onBack={() => irA(3)}
                      onBooked={(next, via, confirmEventId) => {
                        if (bookingSent.current) return;
                        bookingSent.current = true;
                        setBooking(next);
                        pushDL("agenda_step_complete", { step: 4, step_name: "videollamada", servicio, source_path: SOURCE_PATH });
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

      {/* Debajo, corto y con aire: las campañas traen al lead y la IA lo agenda en Clinera. */}
      {paso === 1 && booking === null && (
        <>
          <section className={styles.eco} aria-labelledby="eco-h2" data-ecosistema>
            <div className={styles.ecoInner}>
              <span className={styles.ecoMeta}>Cómo funciona el ecosistema</span>
              <h2 id="eco-h2" className={styles.ecoH2}>
                Marketing que trae pacientes. <span className={base.grad}>IA que los agenda.</span>
              </h2>
              <ol className={styles.ecoPasos}>
                {ECOSISTEMA_PASOS.map((p) => (
                  <li key={p.n} className={styles.ecoPaso}>
                    <span className={styles.ecoN}>{p.n}</span>
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
          <ChatAgendaIA />
          <section className={styles.eco} aria-label="Clínicas que usan Clinera">
            <div className={styles.ecoInner}>
              <ClinicasLogos enSeccion />
            </div>
          </section>
        </>
      )}

      <footer className={base.footer}>
        <span>© {new Date().getFullYear()} Clinera.io · OACG</span>
        <Link href="/privacidad">Privacidad</Link>
        <Link href="/terminos">Términos</Link>
      </footer>
    </div>
  );
}
