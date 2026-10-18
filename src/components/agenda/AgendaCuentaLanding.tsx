"use client";

// ============================================================================
// /agenda — landing «Crea tu cuenta y actívala en minutos» (Ricardo, 18-oct-2026)
//
//   Paso 1  datos (nombre, correo, celular, clínica, profesionales) → CRM
//   Paso 2  funciones que necesita (varias)
//   Paso 3  los 3 planes con el cupón CUKI (50% el primer mes; vence al día siguiente de la primera visita) → pago
//
// El lead se manda al CRM en el paso 1 (`submitContactLead`, el mismo webhook de
// siempre), para no perder a quien abandona. Las funciones del paso 2 NO generan
// un segundo envío: un segundo `contact` con el mismo correo hace que n8n lo
// etiquete «Volvió a cotizar». Viajan en el dataLayer y, si agenda con ventas,
// en el `booking_confirmed` (`funciones_interes`).
//
// Los links de pago los envía Ricardo (`LINKS_PAGO`). Mientras no existan, cada
// botón muestra el marcador. Cuando existan, son `<a href="https://buy.stripe.com/…"
// data-plan …>` y nada más: el clic lo cuenta `Analytics.tsx` (ver AGENTS.md). El
// cupón CUKI se precarga en el link (`linkPagoConCupon`, `prefilled_promo_code`).
//
// «Prefiero hablar con ventas» abre el mismo calendario de siempre
// (`StepClineraScheduler`): la reserva sigue emitiendo el MQL.
// El wizard viejo con calendario vive en /reunion-comercial.
// ============================================================================

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/brand-v3/Brand";
import EsteticaSection from "@/components/estetica/EsteticaSection";
import AgenteIABanda from "@/components/agente-ia/AgenteIABanda";
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
  CUPON,
  CUPON_PRIMERA_VISITA_KEY,
  FUNCIONES,
  LINKS_PAGO,
  PLANES_OFERTA,
  PROFESIONALES,
  fechaLarga,
  formatoUsd,
  linkPagoConCupon,
  linkPagoPendiente,
  venceCupon,
  ymdChile,
  type FuncionId,
} from "@/content/agenda-oferta";
import {
  RESERVA_PHONE_PREFIXES,
  aE164,
  digitosTelefono,
  formatearTelefono,
  mensajeErrorTelefono,
  reglaTelefono,
} from "@/lib/telefono";
import { zonaMostrada } from "@/lib/timezone";
import base from "@/components/estetica/EsteticaAdsLanding.module.css";
import styles from "./AgendaCuentaLanding.module.css";

const SOURCE_PATH = "/agenda";
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MX_TZ = /^America\/(Mexico_City|Cancun|Merida|Monterrey|Matamoros|Chihuahua|Ciudad_Juarez|Ojinaga|Mazatlan|Hermosillo|Tijuana|Bahia_Banderas)$/;
const TOTAL = 3;

const noop = () => () => {};

/** Último día del cupón según la primera visita guardada (o hoy). */
function leerVenceCupon(): string {
  let primera = ymdChile(new Date());
  try {
    const guardada = window.localStorage.getItem(CUPON_PRIMERA_VISITA_KEY);
    if (guardada && /^\d{4}-\d{2}-\d{2}$/.test(guardada)) primera = guardada;
  } catch {
    /* sin almacenamiento */
  }
  return venceCupon(primera);
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function AgendaCuentaLanding({ tzIp = "" }: { tzIp?: string }) {
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [conVentas, setConVentas] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [prefix, setPrefix] = useState(() => (MX_TZ.test(tzIp) ? "+52" : "+56"));
  const [phone, setPhone] = useState("");
  const [clinica, setClinica] = useState("");
  const [profesionales, setProfesionales] = useState("");
  const [funciones, setFunciones] = useState<FuncionId[]>([]);
  const [intentado, setIntentado] = useState(false);
  const [leadCtx, setLeadCtx] = useState<{ eventId: string; leadSource: string } | null>(null);
  const [booking, setBooking] = useState<CalBooking | null>(null);
  const formStarted = useRef(false);
  const bookingSent = useRef(false);

  useEffect(() => {
    pushDL("agenda_landing_view", { source_path: SOURCE_PATH });
  }, []);

  // El cupón vence al día siguiente de la PRIMERA visita (Ricardo, 18-oct-2026).
  // Se guarda la fecha en el navegador para que no se corra cada vez que vuelve;
  // sin almacenamiento (modo privado), se cuenta desde hoy.
  const vence = useSyncExternalStore(noop, leerVenceCupon, () => null);
  useEffect(() => {
    try {
      if (!window.localStorage.getItem(CUPON_PRIMERA_VISITA_KEY)) {
        window.localStorage.setItem(CUPON_PRIMERA_VISITA_KEY, ymdChile(new Date()));
      }
    } catch {
      /* sin almacenamiento: cuenta desde hoy */
    }
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
  const prof = PROFESIONALES.find((p) => p.id === profesionales) ?? null;
  const datosOk = nombreOk && emailOk && phoneOk && clinicaOk && !!prof;
  const rule = reglaTelefono(prefix);

  const funcionesSel = FUNCIONES.filter((f) => funciones.includes(f.id));
  const form: Form = {
    nombre,
    clinica,
    tipoClinica: "estetica",
    prefix,
    phone: digitos,
    email,
    website: "",
    city: "",
    cargo: "" as Form["cargo"],
    boxes: prof ? { id: prof.id, label: prof.label } : null,
    funciones: funcionesSel.map((f) => ({ id: f.id, label: f.label })),
  };
  const size = { profile: null };
  const qual = evaluateQualification(size);

  function errorPaso1(): string {
    if (!nombreOk) return "Escribe tu nombre.";
    if (!emailOk) return "Revisa tu correo.";
    if (phoneError) return phoneError;
    if (!clinicaOk) return "Escribe el nombre de tu clínica.";
    if (!prof) return "Elige cuántos profesionales tiene tu clínica.";
    return "Revisa tus datos.";
  }

  function enviarPaso1() {
    if (!datosOk) {
      setIntentado(true);
      return;
    }
    const eventId = leadCtx?.eventId ?? newLeadEventId();
    const ctx = leadCtx ?? { eventId, leadSource: detectLeadSource() };
    if (!leadCtx) setLeadCtx(ctx);
    pushDL("agenda_step_complete", { step: 1, step_name: "datos", tamano_boxes: profesionales, source_path: SOURCE_PATH });
    setIntentado(false);
    setPaso(2);
    // Al CRM en el paso 1 (Ricardo): el lead que abandona igual queda. No se espera a n8n.
    void submitContactLead({
      form: { ...form, funciones: null },
      software: null,
      size,
      qual,
      leadCtx: ctx,
      sourcePath: SOURCE_PATH,
      features: [],
      plan: "summit_oferta",
    }).then((next) => {
      if (next) setLeadCtx(next);
    });
  }

  function enviarPaso2() {
    pushDL("agenda_step_complete", {
      step: 2,
      step_name: "funciones",
      funciones: funciones.join(","),
      source_path: SOURCE_PATH,
    });
    pushDL("agenda_offer_view", { cupon: CUPON.codigo, source_path: SOURCE_PATH });
    setPaso(3);
  }

  function toggleFuncion(id: FuncionId) {
    setFunciones((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }

  const titulosPaso = ["Tus datos", "Lo que necesitas", "Tu plan con descuento"];
  const [copiado, setCopiado] = useState(false);

  return (
    <div className={base.page}>
      <header className={base.top}>
        <Link href="/" aria-label="Clinera.io">
          <Wordmark size={19} />
        </Link>
        <span className={base.meta}>{AGENDA_COPY.eyebrow}</span>
      </header>

      <section className={base.hero}>
        <div className={base.heroCopy}>
          <span className={base.meta}>{AGENDA_COPY.eyebrow}</span>
          <h1 className={base.h1}>
            Crea tu cuenta y <span className={base.grad}>actívala en minutos.</span>
          </h1>
          <p className={base.sub}>{AGENDA_COPY.sub}</p>
        </div>

        <div className={base.formCol} id="crear-cuenta">
          <div className={base.card}>
            {booking ? (
              <div className={base.done}>
                <div className={base.doneCheck} aria-hidden>
                  <Check />
                </div>
                <h2 className={base.cardTitle}>Listo, tu reunión quedó agendada</h2>
                <p className={base.cardSub}>Te llega el enlace por correo. 45 minutos con el equipo.</p>
                {booking.date && (
                  <p className={base.when}>
                    {textoReserva(booking.date, zonaMostrada(tzIp, ""))}
                    {booking.organizer?.name ? ` · ${booking.organizer.name}` : ""}
                  </p>
                )}
              </div>
            ) : conVentas ? (
              <div>
                <span className={base.stepMeta}>Hablar con ventas · elige tu hora</span>
                <StepClineraScheduler
                  form={form}
                  tzIp={tzIp}
                  onBack={() => setConVentas(false)}
                  onBooked={(next, via, confirmEventId) => {
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
            ) : (
              <>
                <div className={styles.progress} aria-hidden>
                  {Array.from({ length: TOTAL }, (_, i) => (
                    <span key={i} className={`${styles.seg} ${i + 1 <= paso ? styles.segOn : ""}`} />
                  ))}
                </div>
                <span className={base.stepMeta}>
                  Paso {paso} de {TOTAL} · {titulosPaso[paso - 1]}
                </span>

                {paso === 1 && (
                  <div onFocusCapture={marcarInicio} data-agenda-paso="1">
                    <h2 className={base.cardTitle}>Crea tu cuenta</h2>
                    <p className={base.cardSub}>Sin tarjeta en este paso. Te toma un minuto.</p>

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

                    <span className={base.label} id="ag-prof-label">¿Cuántos profesionales atienden?</span>
                    <div className={base.chips} role="radiogroup" aria-labelledby="ag-prof-label">
                      {PROFESIONALES.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          role="radio"
                          aria-checked={profesionales === p.id}
                          className={`${base.chip} ${profesionales === p.id ? base.chipOn : ""}`}
                          onClick={() => {
                            marcarInicio();
                            setProfesionales(p.id);
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    {intentado && !datosOk && (
                      <p className={base.error} role="alert">
                        {errorPaso1()}
                      </p>
                    )}
                    <button type="button" className={base.cta} onClick={enviarPaso1}>
                      Continuar →
                    </button>
                    <p className={base.note}>Tus datos no se comparten.</p>
                  </div>
                )}

                {paso === 2 && (
                  <div data-agenda-paso="2">
                    <h2 className={base.cardTitle}>¿Qué necesita tu clínica?</h2>
                    <p className={base.cardSub}>Marca todo lo que quieras usar. Puedes elegir varias.</p>
                    <div className={styles.funciones} role="group" aria-label="Funciones que necesitas">
                      {FUNCIONES.map((f) => {
                        const on = funciones.includes(f.id);
                        return (
                          <button
                            key={f.id}
                            type="button"
                            role="checkbox"
                            aria-checked={on}
                            className={`${styles.funcion} ${on ? styles.funcionOn : ""}`}
                            onClick={() => toggleFuncion(f.id)}
                          >
                            <span className={styles.box} aria-hidden>
                              {on && <Check />}
                            </span>
                            {f.label}
                          </button>
                        );
                      })}
                    </div>
                    <button type="button" className={base.cta} onClick={enviarPaso2}>
                      Ver mi oferta →
                    </button>
                    <button type="button" className={styles.volver} onClick={() => setPaso(1)}>
                      ← Volver
                    </button>
                  </div>
                )}

                {paso === 3 && (
                  <div data-agenda-paso="3" data-oferta>
                    <h2 className={base.cardTitle}>Elige tu plan con {CUPON.descuentoPct}% de descuento</h2>
                    <div className={styles.cupon} data-cupon={CUPON.codigo}>
                      <div>
                        <span className={styles.cuponMeta}>Tu cupón</span>
                        <span className={styles.cuponCodigo}>{CUPON.codigo}</span>
                      </div>
                      <button
                        type="button"
                        className={styles.cuponCopiar}
                        onClick={() => {
                          void navigator.clipboard?.writeText(CUPON.codigo).then(() => setCopiado(true));
                        }}
                      >
                        {copiado ? "Copiado" : "Copiar"}
                      </button>
                    </div>
                    <p className={styles.durante}>
                      {CUPON.descuentoPct}% de descuento {CUPON.meses === 1 ? "el primer mes" : `durante ${CUPON.meses} meses`} en cualquier plan. Ingresa el código {CUPON.codigo} al pagar.
                    </p>
                    {vence && (
                      <p className={styles.vence} data-cupon-vence={vence}>
                        Válido hasta el {fechaLarga(vence)}.
                      </p>
                    )}
                    {funcionesSel.length > 0 && (
                      <p className={styles.marcaste}>
                        Marcaste: {funcionesSel.map((f) => f.label.charAt(0).toLowerCase() + f.label.slice(1)).join(", ")}.
                      </p>
                    )}

                    <div className={styles.planes}>
                      {PLANES_OFERTA.map((p) => {
                        const link = LINKS_PAGO[p.id];
                        return (
                          <div key={p.id} className={`${styles.plan} ${p.featured ? styles.planOn : ""}`} data-plan-oferta={p.id}>
                            <div className={styles.planHead}>
                              <span className={styles.planNombre}>{p.name}</span>
                              {p.tag && <span className={styles.planTag}>{p.tag}</span>}
                            </div>
                            <div className={styles.precio}>
                              <span className={styles.tachado}>US$ {p.monthlyUsd}</span>
                              <span className={styles.oferta}>
                                <span className={styles.ofertaCur}>US$</span>
                                <span className={styles.ofertaMonto}>{formatoUsd(p.conCupon)}</span>
                                <span className={styles.ofertaPer}>/mes</span>
                              </span>
                            </div>
                            <p className={styles.luego}>
                              {CUPON.meses === 1 ? "El primer mes" : `Los primeros ${CUPON.meses} meses`} · luego US$ {p.monthlyUsd}/mes
                            </p>
                            <ul className={styles.incluye}>
                              {p.destacados.map((d) => (
                                <li key={d}>
                                  <span className={styles.tick}>
                                    <Check />
                                  </span>
                                  {d}
                                </li>
                              ))}
                            </ul>
                            {link ? (
                              <a
                                className={base.cta}
                                href={linkPagoConCupon(link)}
                                data-plan={p.id}
                                data-plan-name={`${p.name} cupón ${CUPON.codigo}`}
                                data-plan-value={p.conCupon}
                                style={{ display: "block", textAlign: "center", textDecoration: "none" }}
                              >
                                Activar {p.name} con {CUPON.codigo}
                              </a>
                            ) : (
                              <span className={styles.pendiente} data-pago-pendiente={p.id}>
                                {linkPagoPendiente(p.name)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      className={styles.ventas}
                      onClick={() => {
                        pushDL("agenda_prefiere_ventas", { source_path: SOURCE_PATH });
                        setConVentas(true);
                      }}
                    >
                      Prefiero hablar con ventas antes
                    </button>
                    <button type="button" className={styles.volver} onClick={() => setPaso(2)}>
                      ← Volver
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className={base.heroProof}>
          <ul className={base.benefits}>
            {AGENDA_COPY.beneficios.map((b) => (
              <li key={b}>
                <span className={base.tick}>
                  <Check />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <div className={base.proof}>
            <span className={base.dot} aria-hidden />
            <span>+52 clínicas activas</span>
            <span className={base.sep}>·</span>
            <span>Hecho en Método Hebe y Protocolo Lumina</span>
          </div>
        </div>
      </section>

      <EsteticaSection id="hecho-para-estetica" modelo="duena" ctaHref="#crear-cuenta" />
      <AgenteIABanda href="#crear-cuenta" ctaLabel="Crear mi cuenta" />

      <footer className={base.footer}>
        <span>© {new Date().getFullYear()} Clinera.io · OACG</span>
        <Link href="/privacidad">Privacidad</Link>
        <Link href="/terminos">Términos</Link>
      </footer>
    </div>
  );
}
