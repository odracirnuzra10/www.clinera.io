"use client";

// ============================================================================
// /agenda — wizard de 3 pasos que termina en una videollamada (Ricardo, 18-oct-2026)
//
// Formato de `metodohebe.cl/evaluacion` y `protocololumina.cl/evaluacion` (Ricardo,
// 18-oct-2026): una columna, carrusel de casos arriba, «Paso N de 3» con tarjetas
// seleccionables y los datos de contacto al final.
//
//   Paso 1  la boleta «lo que te ahorras con el Ecosistema» y el botón «Quiero ahorrar»
//           → ViewContent. Ya no se elige servicio (Ricardo, 19-oct-2026): se vende el
//           Ecosistema, así que el lead viaja siempre con `servicio_interes: "ambas"`.
//   Paso 2  tus datos: nombre, correo, celular, nombre y sitio web de la clínica → CRM + Lead (US$ 3)
//           El sitio web es obligatorio (Ricardo, 26-oct-2026: Clinera apunta a clínicas
//           medianas, y una clínica establecida tiene web). Antes de avanzar se verifica en el
//           servidor (`/api/verificar-sitio`). Ricardo, 27-oct-2026: sólo se frena un texto que
//           no es una dirección. Si el sitio no existe, es una red social o no es de una clínica,
//           el lead pasa igual y entra a Twenty como Nuevo para que lo revise el closer; con el
//           sitio verificado entra como MQL. La clínica sin web («¿Aún no tienes web?») avanza
//           sin más pasos (antes pedía RUT o un código por correo). Sólo el sitio que pasa dispara
//           el Lead de Meta: la campaña aprende solo de clínicas con web.
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
import AhorroEcosistema from "@/components/pricing/AhorroEcosistema";
/** Punto de la pantalla donde nace el «pum» (el centro del botón «Quiero ahorrar»). */
type OrigenPum = { x: number; y: number };
import { ECOSISTEMA_SLIDES } from "@/content/agenda-oferta";
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
import { MENSAJE_SITIO, type ResultadoSitio } from "@/lib/verificar-sitio";
import { OFERTA_ESTETICA, type OfertaId } from "@/content/oferta-estetica";
import { zonaMostrada } from "@/lib/timezone";
import base from "@/components/estetica/EsteticaAdsLanding.module.css";
import styles from "./AgendaWizard.module.css";

const SOURCE_PATH_BASE = "/agenda";
// Versión para anuncios de Google (/agenda-google): mismo wizard, otro `source_path` para
// separar el embudo en los reportes, y `lead_source` google-ads aunque la URL llegue sin gclid.
const SOURCE_PATH_GOOGLE = "/agenda-google";
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MX_TZ = /^America\/(Mexico_City|Cancun|Merida|Monterrey|Matamoros|Chihuahua|Ciudad_Juarez|Ojinaga|Mazatlan|Hermosillo|Tijuana|Bahia_Banderas)$/;
const TOTAL = 3;
const TITULOS_PASO = ["Lo que te ahorras", "Tus datos", "Tu horario"];

// Siempre el Ecosistema (software + marketing): lo que se vende desde el 19-oct-2026.
const SERVICIO = { id: "ambas", label: "Ecosistema (software con IA + marketing de performance)" } as const;

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
  google = false,
  oferta = null,
  sourcePath,
  encabezado,
  tarjeta = false,
}: {
  /** `source_path` propio (p. ej. la landing que lleva el wizard arriba). */
  sourcePath?: string;
  /** H1 del panel oscuro. Sin él, «Agenda tu videollamada con Clinera». */
  encabezado?: { titulo: string; sub: string };
  /** Solo el formulario, como tarjeta dentro de otra página (hero de una landing):
   *  sin el panel de imágenes, sin ocupar la pantalla entera y sin `<main>` propio. */
  tarjeta?: boolean;
  /** `?oferta=estetica379` (landing /oferta-clinicas-esteticas): boleta a US$ 379 y aviso al closer. */
  oferta?: OfertaId | null;
  /** Versión de /agenda-google: atribuye a Google Ads por defecto y reporta su propio `source_path`. */
  google?: boolean;
  tzIp?: string;
  /** `?servicio=` de la URL: ya no cambia el flujo, solo se registra en el dataLayer. */
  servicioInicial?: string | null;
}) {
  const SOURCE_PATH = sourcePath ?? (google ? SOURCE_PATH_GOOGLE : SOURCE_PATH_BASE);
  const fuente = () => {
    const f = detectLeadSource();
    return google && f === "organico" ? "google-ads" : f;
  };
  const Lado = tarjeta ? "div" : "main";
  const raizRef = useRef<HTMLDivElement>(null);
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [prefix, setPrefix] = useState(() => (MX_TZ.test(tzIp) ? "+52" : "+56"));
  const [phone, setPhone] = useState("");
  const [clinica, setClinica] = useState("");
  const [sitio, setSitio] = useState("");
  // Último sitio verificado (lo escrito y el resultado): si no cambia, no se vuelve a preguntar.
  const [sitioRes, setSitioRes] = useState<{ valor: string; r: ResultadoSitio } | null>(null);
  const [verificando, setVerificando] = useState(false);
  // Clínica sin sitio web: avanza igual y el closer la verifica (Ricardo, 27-oct-2026).
  const [sinWeb, setSinWeb] = useState(false);
  const [intentado, setIntentado] = useState(false);
  const [leadCtx, setLeadCtx] = useState<{ eventId: string; leadSource: string } | null>(null);
  const [booking, setBooking] = useState<CalBooking | null>(null);
  const [pum, setPum] = useState<OrigenPum | null>(null); // efecto de apertura al terminar de deslizar
  const formStarted = useRef(false);
  const bookingSent = useRef(false);

  useEffect(() => {
    pushDL("agenda_landing_view", { source_path: SOURCE_PATH, servicio_url: servicioInicial ?? "", oferta: oferta ?? "" });
  }, [servicioInicial, SOURCE_PATH, oferta]);

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
  const sitioOk = sitio.trim().length >= 4;
  const datosOk = nombreOk && emailOk && phoneOk && clinicaOk && (sinWeb || sitioOk);
  const sitioVigente = sitioRes && sitioRes.valor === sitio.trim() ? sitioRes.r : null;
  // Sólo un texto que no es una dirección frena el paso; el resto pasa como Nuevo.
  const sitioError = sitioVigente && !sitioVigente.ok && sitioVigente.motivo === "formato" ? MENSAJE_SITIO.formato : null;
  const rule = reglaTelefono(prefix);

  const form: Form = {
    nombre,
    clinica,
    tipoClinica: "",
    subtipo: null,
    prefix,
    phone: digitos,
    email,
    website: sinWeb ? "" : sitioVigente?.ok ? sitioVigente.url : sitio.trim(),
    sitioEstado: sinWeb ? "sin_web" : sitioVigente ? (sitioVigente.ok ? sitioVigente.estado : sitioVigente.motivo) : undefined,
    city: "",
    pais: paisDePrefijo(prefix),
    cargo: "" as Form["cargo"],
    boxes: null,
    servicio: oferta ? { id: SERVICIO.id, label: OFERTA_ESTETICA.etiquetaCrm } : SERVICIO,
  };
  const size = { profile: null };
  const qual = evaluateQualification(size);

  function errorDatos(): string {
    if (!nombreOk) return "Escribe tu nombre.";
    if (!emailOk) return "Revisa tu correo.";
    if (phoneError) return phoneError;
    if (!clinicaOk) return "Escribe el nombre de tu clínica.";
    if (!sinWeb && !sitioOk) return MENSAJE_SITIO.formato;
    return "Revisa tus datos.";
  }

  function irA(n: 1 | 2 | 3) {
    setPaso(n);
    // En tarjeta la página sigue: se sube solo hasta el formulario, no al tope.
    if (tarjeta) raizRef.current?.scrollIntoView({ block: "nearest" });
    else window.scrollTo({ top: 0 });
  }

  function enviarPaso1(origen?: OrigenPum) {
    // Primero se avanza y después se mide: si el seguimiento falla, el visitante igual pasa al
    // paso 2 (26-oct-2026: con un error de GTM el deslizador quedaba pegado al final).
    const sinMovimiento = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!origen || sinMovimiento) {
      irA(2);
    } else {
      // «Pum»: del punto donde quedó la perilla se abre un círculo de color que cubre el wizard; ya
      // cubierto se cambia al paso 2 y el círculo se disuelve dejando entrar los datos.
      setPum(origen);
      window.setTimeout(() => irA(2), 420);
      window.setTimeout(() => setPum(null), 1100);
    }
    try {
      marcarInicio();
      pushDL("agenda_step_complete", { step: 1, step_name: "boleta_quiero_ahorrar", servicio: SERVICIO.id, source_path: SOURCE_PATH });
      // ViewContent: quiso ver lo que ahorra con el Ecosistema (Ricardo, 19-oct-2026).
      trackPixel("ViewContent", { content_name: SERVICIO.label, content_category: "servicio_interes", content_ids: ["ecosistema"] });
    } catch (e) {
      console.error("[agenda] seguimiento del paso 1", e);
    }
  }

  async function verificarSitio(): Promise<ResultadoSitio> {
    const valor = sitio.trim();
    if (sitioRes && sitioRes.valor === valor) return sitioRes.r;
    let r: ResultadoSitio;
    try {
      const res = await fetch("/api/verificar-sitio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sitio: valor }),
      });
      const data = (await res.json()) as ResultadoSitio;
      // Si la verificación misma falla (429, 5xx), el lead pasa: un error nuestro no lo bloquea.
      r = res.ok && typeof data?.ok === "boolean" ? data : { ok: true, url: valor, estado: "sin_verificar" };
    } catch {
      r = { ok: true, url: valor, estado: "sin_verificar" };
    }
    setSitioRes({ valor, r });
    return r;
  }

  function entrarSinWeb() {
    setSinWeb(true);
    setIntentado(false);
    pushDL("agenda_sin_sitio_web", { source_path: SOURCE_PATH });
  }

  async function enviarPaso2() {
    if (verificando) return;
    if (!datosOk) {
      setIntentado(true);
      return;
    }
    let formOk: Form = { ...form, sitioEstado: "sin_web" };
    let sitioPasa = false;
    if (!sinWeb) {
      setVerificando(true);
      const r = await verificarSitio();
      setVerificando(false);
      if (!r.ok && r.motivo === "formato") return;
      if (r.ok) {
        sitioPasa = true;
        formOk = { ...form, website: r.url, sitioEstado: r.estado };
      } else {
        // No existe, red social o no es clínica: pasa igual y el closer lo revisa (27-oct-2026).
        pushDL("agenda_sitio_rechazado", { motivo: r.motivo, source_path: SOURCE_PATH });
        formOk = { ...form, website: sitio.trim(), sitioEstado: r.motivo };
      }
    }
    const eventId = leadCtx?.eventId ?? newLeadEventId();
    const ctx = leadCtx ?? { eventId, leadSource: fuente() };
    if (!leadCtx) setLeadCtx(ctx);
    pushDL("agenda_step_complete", { step: 2, step_name: "datos", servicio: SERVICIO.id, source_path: SOURCE_PATH });
    setIntentado(false);
    irA(3);
    // Embudo de Meta (Ricardo, 18-oct-2026): rellenar el formulario = Lead US$ 3.
    // Sólo el sitio que pasa lo dispara: Meta aprende solo de clínicas con web
    // (Ricardo, 26-oct-2026). El resto le llega a la campaña cuando el closer lo pase a MQL.
    if (sitioPasa) void fireLeadEvent({
      eventId: ctx.eventId,
      contact: { email: email.trim(), phoneE164: aE164(prefix, digitos) },
      customData: { content_name: "agenda_videollamada", lead_source: ctx.leadSource },
    });
    // Al CRM al enviar los datos: el lead que no agenda igual queda. No se espera a n8n.
    void submitContactLead({
      form: formOk,
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
  // Panel izquierdo: una imagen por pantalla (campañas → software con IA → reunión semanal).
  const caso = paso - 1;
  const slide = ECOSISTEMA_SLIDES[caso];

  return (
    <div
      ref={raizRef}
      className={`${base.page} ${tarjeta ? styles.enTarjeta : styles.pagina} ${paso > 1 || booking ? styles.avanzado : ""} ${paso === 1 ? styles.inicio : ""} ${enCalendario || booking ? styles.calendario : ""}`}
      data-paso={paso}
    >
      {!tarjeta && (
      <aside className={styles.panel} data-agenda-casos>
        <div className={styles.marco}>
          {ECOSISTEMA_SLIDES.map((sl, i) => (
            <figure key={sl.n} className={`${styles.slide} ${i === caso ? styles.slideOn : ""}`} aria-hidden={i !== caso}>
              <div className={styles.slideImg} style={{ backgroundImage: `url(${sl.img})` }} role="img" aria-label={sl.titulo} />
            </figure>
          ))}
        </div>
        <p className={styles.caption} data-agenda-caption>
          <b>{slide.titulo}</b>
        </p>
        <div className={styles.puntos} aria-hidden>
          {ECOSISTEMA_SLIDES.map((sl, i) => (
            <span key={sl.n} className={`${styles.punto} ${i === caso ? styles.puntoOn : ""}`} />
          ))}
        </div>
        <h1 className={styles.chip}>
          <span className={styles.chipTitulo}>{encabezado?.titulo ?? "Agenda tu videollamada con Clinera"}</span>
          <span className={styles.chipSub}>{encabezado?.sub ?? "Así trabajamos contigo"}</span>
        </h1>
      </aside>
      )}

      {pum && (
        <div
          className={styles.pum}
          aria-hidden
          data-pum
          style={{ ["--x" as string]: `${pum.x}px`, ["--y" as string]: `${pum.y}px` }}
        >
          <span className={styles.pumAnillo} />
          <span className={`${styles.pumAnillo} ${styles.pumAnillo2}`} />
        </div>
      )}

      <Lado className={tarjeta ? styles.ladoTarjeta : styles.lado}>
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
                    <h2 className={styles.titulo}>Lo que te ahorras con el Ecosistema Clinera</h2>
                    <p className={styles.sub}>Marketing de performance con reunión semanal, más el software con IA, en un solo lugar.</p>
                    <AhorroEcosistema
                      compacto
                      precioUsd={oferta ? OFERTA_ESTETICA.precioUsd : undefined}
                      ahorroDesdeUsd={oferta ? OFERTA_ESTETICA.ahorroDesdeUsd : undefined}
                    />
                    {/* Ricardo, 26-oct-2026: el botón deslizante pasó a ser un botón simple. */}
                    <button
                      type="button"
                      className={styles.quieroAhorrar}
                      data-quiero-ahorrar
                      onClick={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        enviarPaso1({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
                      }}
                    >
                      Quiero ahorrar
                    </button>
                  </div>
                )}

                {paso === 2 && (
                  <div data-agenda-paso="2" onFocusCapture={marcarInicio} className={styles.entrada}>
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

                    {!sinWeb ? (
                      <>
                        <div className={styles.labelFila}>
                          <label className={base.label} htmlFor="ag-sitio">Sitio web de tu clínica</label>
                          <button type="button" className={styles.sinWebLink} onClick={entrarSinWeb} data-sin-web-abrir>
                            ¿Aún no tienes web?
                          </button>
                        </div>
                        <input id="ag-sitio" className={base.input} value={sitio} onChange={(e) => setSitio(e.target.value)} type="url" inputMode="url" autoComplete="url" autoCapitalize="none" spellCheck={false} placeholder="www.tuclinica.cl" aria-invalid={(intentado && !sitioOk) || !!sitioError} data-sitio-estado={sitioVigente ? (sitioVigente.ok ? sitioVigente.estado : sitioVigente.motivo) : undefined} />
                      </>
                    ) : (
                      <div className={styles.sinWeb} data-sin-web>
                        <p className={styles.sinWebOk}>Sin problema: sigue y elige tu horario.</p>
                        <button type="button" className={styles.sinWebLink} onClick={() => setSinWeb(false)} data-sin-web-cerrar>
                          Sí tengo sitio web
                        </button>
                      </div>
                    )}

                    {intentado && !datosOk ? (
                      <p className={base.error} role="alert">
                        {errorDatos()}
                      </p>
                    ) : !sinWeb && sitioError ? (
                      <p className={base.error} role="alert" data-sitio-error>
                        {sitioError}
                      </p>
                    ) : null}
                    <button type="button" className={base.cta} onClick={() => void enviarPaso2()} disabled={verificando} aria-busy={verificando}>
                      {verificando ? "Verificando tu sitio…" : "Elegir mi hora →"}
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
                        pushDL("agenda_step_complete", { step: 3, step_name: "horario", servicio: SERVICIO.id, source_path: SOURCE_PATH });
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
      </Lado>
    </div>
  );
}
