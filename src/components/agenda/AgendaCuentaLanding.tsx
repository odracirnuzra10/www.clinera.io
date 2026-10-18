"use client";

// ============================================================================
// /clinica-estetica/activar-cuenta (ex /agenda y /clinica-estetica) — landing «Crea tu cuenta y actívala en minutos» (Ricardo, 18-oct-2026)
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
// cupón CUKI lo escribe la clínica en Stripe: `prefilled_promo_code` no lo aplica
// en estos Payment Links (probado el 18-oct-2026).
//
// «Prefiero hablar con ventas» abre el mismo calendario de siempre
// (`StepClineraScheduler`): la reserva sigue emitiendo el MQL.
// El wizard viejo con calendario vive en /reunion-comercial.
// ============================================================================

import { useEffect, useRef, useState } from "react";
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
  FUNCIONES,
  FUNCIONES_HERO,
  LINKS_PAGO,
  PLANES_OFERTA,
  PROFESIONALES,
  formatoUsd,
  linkPagoPendiente,
  type FuncionId,
} from "@/content/agenda-oferta";
import { destacadoDe } from "@/content/planes";
import { IconoDestacado } from "@/components/pricing/IconoDestacado";
import { textoVence, useVenceCupon } from "./useCupon";
import CuponTicket from "./CuponTicket";
import {
  RESERVA_PHONE_PREFIXES,
  aE164,
  digitosTelefono,
  formatearTelefono,
  mensajeErrorTelefono,
  reglaTelefono,
} from "@/lib/telefono";
import { zonaMostrada } from "@/lib/timezone";
import { PRUEBA_SOCIAL_ESTETICA } from "@/content/estetica";
import base from "@/components/estetica/EsteticaAdsLanding.module.css";
import styles from "./AgendaCuentaLanding.module.css";

const SOURCE_PATH = "/clinica-estetica/activar-cuenta";
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MX_TZ = /^America\/(Mexico_City|Cancun|Merida|Monterrey|Matamoros|Chihuahua|Ciudad_Juarez|Ojinaga|Mazatlan|Hermosillo|Tijuana|Bahia_Banderas)$/;
const TOTAL = 3;

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

  const vence = useVenceCupon();

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

  // Móvil (Ricardo, 18-oct-2026): al bajar, un botón fijo devuelve al formulario
  // para completarlo. Se esconde mientras el formulario está a la vista.
  const formRef = useRef<HTMLDivElement>(null);
  const [formVisible, setFormVisible] = useState(true);
  useEffect(() => {
    const el = formRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // Desde el paso 2 la página es solo el wizard (Ricardo, 18-oct-2026: «que el
  // segundo paso se abra en una pestaña exclusiva para no hacer scroll fuera»).
  // Misma pestaña a propósito: una ventana nueva perdería lo escrito en el paso 1.
  const enfocado = paso > 1 || conVentas || booking !== null;
  useEffect(() => {
    if (enfocado) window.scrollTo({ top: 0 });
  }, [enfocado, paso]);

  const volverLabel = paso === 1 ? "Completa tus datos" : paso === 2 ? "Sigue con tu cuenta" : `Ver mi ${CUPON.descuentoPct}% de descuento`;

  return (
    <div className={`${base.page} ${styles.aire}`}>
      <header className={base.top}>
        <Link href="/" aria-label="Clinera.io">
          <Wordmark size={19} />
        </Link>
        <span className={base.meta}>{AGENDA_COPY.eyebrow}</span>
      </header>

      <section className={`${base.hero} ${styles.heroTinte} ${enfocado ? styles.enfocado : ""}`} data-agenda-enfocado={enfocado || undefined}>
        {!enfocado && (
        <div className={base.heroCopy}>
          <span className={base.meta}>{AGENDA_COPY.eyebrow}</span>
          <h1 className={base.h1}>
            Crea tu cuenta y <span className={base.grad}>actívala en minutos.</span>
          </h1>
          <p className={base.sub}>{AGENDA_COPY.sub}</p>
        </div>
        )}

        <div className={base.formCol} id="crear-cuenta" ref={formRef}>
          <div className={`${base.card} ${styles.cardDestacada}`}>
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
                    {/* El cupón en grande: lo pega al pagar en el paso 3 (Ricardo, 18-oct-2026). */}
                    <CuponTicket grande style={{ marginBottom: 6 }}>
                      <span>Cópialo: lo pegas al pagar en el siguiente paso.</span>
                    </CuponTicket>
                    <div style={{ height: 14 }} />
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
                    <CuponTicket style={{ marginTop: 10 }}>
                      <span>Pégalo en «Añadir código de promoción» al pagar.</span>
                    </CuponTicket>
                    {vence && (
                      <p className={styles.vence} data-cupon-vence={vence}>
                        Válido {textoVence(vence)}.
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
                            {/* Énfasis en el 1er mes; desde el 2.º, en chico (Ricardo, 18-oct-2026). */}
                            <div className={styles.precio}>
                              <span className={styles.oferta}>
                                <span className={styles.ofertaCur}>US$</span>
                                <span className={styles.ofertaMonto}>{formatoUsd(p.conCupon)}</span>
                                <span className={styles.ofertaPer}>1er mes</span>
                              </span>
                            </div>
                            <p className={styles.luego}>Desde el 2.º mes: US$ {p.monthlyUsd}/mes</p>
                            <ul className={styles.incluye}>
                              {p.destacados.map((d) => {
                                const tipo = destacadoDe(d);
                                return (
                                  <li key={d} data-destacado={tipo ?? undefined}>
                                    {tipo ? (
                                      <IconoDestacado tipo={tipo} />
                                    ) : (
                                      <span className={styles.tick}>
                                        <Check />
                                      </span>
                                    )}
                                    {tipo ? <strong>{d}</strong> : d}
                                  </li>
                                );
                              })}
                            </ul>
                            {link ? (
                              <a
                                className={base.cta}
                                href={link}
                                data-plan={p.id}
                                data-plan-name={`${p.name} cupón ${CUPON.codigo}`}
                                data-plan-value={p.conCupon}
                                style={{ display: "block", textAlign: "center", textDecoration: "none" }}
                              >
                                Crear cuenta · {p.name}
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

        {/* Lo que trae Clinera, al lado del wizard (Ricardo, 18-oct-2026). */}
        {!enfocado && (
        <div className={base.heroProof}>
          <ul className={base.benefits} aria-label="Lo que incluye Clinera" data-funciones-hero>
            {FUNCIONES_HERO.map((f) => (
              <li key={f}>
                <span className={base.tick}>
                  <Check />
                </span>
                {f}
              </li>
            ))}
          </ul>
          {/* Una línea por dato: con separador, la segunda quedaba colgando. */}
          <div className={base.proof} style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }} data-prueba-social>
            <span>
              <span aria-hidden style={{ color: "#F59E0B", letterSpacing: "0.1em", marginRight: 8 }}>★★★★★</span>
              {PRUEBA_SOCIAL_ESTETICA[0]}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span className={base.dot} aria-hidden />
              {PRUEBA_SOCIAL_ESTETICA[1]}
            </span>
          </div>
        </div>
        )}
      </section>

      {!enfocado && (
        <>
      <EsteticaSection id="hecho-para-estetica" modelo="duena" ctaHref="#crear-cuenta" ctaLabel="Crear mi cuenta" cupon compacta />
      <AgenteIABanda href="#crear-cuenta" ctaLabel="Crear mi cuenta" />
        </>
      )}

      {!enfocado && !formVisible && (
        <a href="#crear-cuenta" className={styles.volverForm} data-volver-form>
          {volverLabel} ↑
        </a>
      )}

      <footer className={base.footer}>
        <span>© {new Date().getFullYear()} Clinera.io · OACG</span>
        <Link href="/privacidad">Privacidad</Link>
        <Link href="/terminos">Términos</Link>
      </footer>
    </div>
  );
}
