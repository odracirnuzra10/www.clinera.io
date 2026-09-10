"use client";

// ============================================================================
// /reserva-tu-hora — SOLO el paso de agendamiento del wizard.
//
// POR QUÉ EXISTE (Ricardo, 27-ago-2026)
// -------------------------------------
// El Instant Form de Meta tiene un destino «Reservar cita» que abre solo un
// enlace de programación al enviar el formulario. Hoy apunta a `clinera.io/demo`,
// que es una página de video SIN calendario: el lead completaba el formulario y
// no tenía dónde agendar. Esta página es ese destino.
//
// Con esto el embudo queda parejo en los tres caminos:
//   Instant Form / alta .......... `Nuevo` US$ 0   (W1; Sub A no manda Lead)
//   closer verifica que es real ... `MQL`   US$ 10  (W1; campañas optimizan acá)
//   closer → SQL / HOT / NQL ...... `SQL` 100 · `HOT` 200 · `NQL` 0
//   contrata ..................... `Purchase` valor del plan
// El MQL se GANA agendando, en los tres. Por eso acá no hay wizard: el lead ya
// dejó sus datos en el formulario de Meta y volvérselos a pedir sería la forma
// más cara de perderlo.
//
// LO QUE NO SE COPIA
// ------------------
// El calendario es `StepClineraScheduler` tal cual, importado. Sus piezas
// internas (BackBtn, StepHeader, SubmitBtn, el reparto determinista de
// profesional, la doble hora local/Chile) no están exportadas, así que copiar
// el JSX significaría mantener dos calendarios que se van a desincronizar.
//
// LA TRAMPA DEL PRELLENADO
// ------------------------
// Meta NO garantiza pasar los datos del lead a un enlace de programación
// «Personalizado» (sí lo hace con Calendly/HubSpot, que tienen integración
// nativa). Por eso la página funciona en dos modos y el segundo no es un caso
// raro: es el esperable.
//   1. con `?nombre=&email=&telefono=` → directo al calendario;
//   2. sin ellos → tres campos y después el calendario.
// El webhook del turno manda `nombre`, `email` y `telefono`: sin esos datos no
// hay reserva posible, así que no se puede simplemente omitirlos.
// ============================================================================

import { useMemo, useState } from "react";
import {
  detectLeadSource,
  evaluateQualification,
  newLeadEventId,
  OPERATIONAL_PROFILES,
  StepClineraScheduler,
  submitBookingConfirmation,
  submitContactLead,
  textoReserva,
  type CalBooking,
  type Form,
} from "./VentasLanding";
import { zonaMostrada } from "@/lib/timezone";
import {
  RESERVA_PHONE_PREFIXES,
  aE164,
  digitosTelefono,
  formatearTelefono,
  mensajeErrorTelefono,
  reglaTelefono,
  separarTelefono,
  telefonoLocalValido,
} from "@/lib/telefono";
import styles from "./ReservaHoraLanding.module.css";

const SOURCE_PATH = "/reserva-tu-hora";

/** Re-export para tests / callers que importaban desde este módulo. */
export { separarTelefono };

/**
 * El tramo de pacientes/mes que el Instant Form ya preguntó. Se acepta tanto el
 * valor de Twenty (`P_500_1000`) como el id del perfil (`vol_500_1000`) para no
 * depender de cuál de los dos vocabularios mande n8n en la URL.
 *
 * No es cosmético: `lead_priority` y `prioridad_alta` del MQL salen de acá, y
 * son lo que separa una clínica de 1.000 pacientes de una de 200 en Meta.
 */
export function perfilDesdeParametro(valor: string) {
  const v = String(valor || "").trim().toUpperCase();
  if (!v) return null;
  const equivalencias: Record<string, string> = {
    P_200_500: "vol_200_500",
    P_500_1000: "vol_500_1000",
    P_1000_PLUS: "vol_1000_plus",
    VOL_200_500: "vol_200_500",
    VOL_500_1000: "vol_500_1000",
    VOL_1000_PLUS: "vol_1000_plus",
  };
  const id = equivalencias[v];
  return OPERATIONAL_PROFILES.find((p) => p.id === id) ?? null;
}

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type PrefillReserva = {
  nombre?: string;
  email?: string;
  telefono?: string;
  clinica?: string;
  tamano?: string;
  leadgenId?: string;
};

export default function ReservaHoraLanding({
  tzIp = "",
  prefill = {},
}: {
  tzIp?: string;
  prefill?: PrefillReserva;
} = {}) {
  const telefonoInicial = useMemo(
    () => separarTelefono(prefill.telefono ?? ""),
    [prefill.telefono],
  );

  const [nombre, setNombre] = useState(prefill.nombre ?? "");
  const [email, setEmail] = useState(prefill.email ?? "");
  const [prefix, setPrefix] = useState(telefonoInicial.prefix);
  const [phone, setPhone] = useState(telefonoInicial.phone);
  const [intentado, setIntentado] = useState(false);
  const [booking, setBooking] = useState<CalBooking | null>(null);
  const [leadCtx, setLeadCtx] = useState<{ eventId: string; leadSource: string } | null>(null);

  const clinica = prefill.clinica ?? "";
  const leadgenId = prefill.leadgenId ?? "";
  const perfil = useMemo(() => perfilDesdeParametro(prefill.tamano ?? ""), [prefill.tamano]);

  // ¿Meta mandó los tres datos? Se evalúa UNA vez, sobre el prefill, y no sobre
  // lo que se va tipeando: si se recalculara, el calendario aparecería solo a
  // mitad de escribir el correo.
  const vinoPrellenado = useMemo(
    () =>
      (prefill.nombre ?? "").trim().length >= 2 &&
      EMAIL_OK.test((prefill.email ?? "").trim()) &&
      telefonoLocalValido(telefonoInicial.prefix, digitosTelefono(telefonoInicial.phone)),
    [prefill.nombre, prefill.email, telefonoInicial.prefix, telefonoInicial.phone],
  );
  const [pidiendoDatos, setPidiendoDatos] = useState(() => !vinoPrellenado);

  const digitos = digitosTelefono(phone);
  const phoneError = mensajeErrorTelefono(prefix, digitos);
  const phoneOk = phoneError === null;
  const nombreOk = nombre.trim().length >= 2;
  const emailOk = EMAIL_OK.test(email.trim());
  const datosOk = nombreOk && emailOk && phoneOk;
  const rule = reglaTelefono(prefix);

  const form: Form = useMemo(
    () => ({
      nombre,
      clinica,
      tipoClinica: "",
      prefix,
      // El wizard arma E.164 con prefix + dígitos; guardamos solo nacionales
      // formateados en el input y los dígitos limpios vía replace en submit*.
      phone,
      email,
      website: "",
      city: "",
      cargo: "" as Form["cargo"],
    }),
    [nombre, clinica, prefix, phone, email],
  );

  const size = useMemo(() => ({ profile: perfil }), [perfil]);
  const qual = useMemo(() => evaluateQualification(size), [size]);

  function irAlCalendario() {
    if (!datosOk) {
      setIntentado(true);
      return;
    }
    const eventId = leadCtx?.eventId ?? newLeadEventId();
    const ctx = leadCtx ?? { eventId, leadSource: detectLeadSource() };
    if (!leadCtx) setLeadCtx(ctx);

    // El calendario NO espera al webhook: si n8n se cuelga, se pierden leads.
    setPidiendoDatos(false);

    // Un lead que viene del Instant Form YA existe en Baserow y en Twenty (lo
    // creó Sub A al recibir el leadgen), así que no se vuelve a dar de alta:
    // duplicarlo significa una segunda llamada de la IA al mismo teléfono.
    // Sin `leadgenId` la persona llegó por otra vía y sí hay que crearla.
    if (!leadgenId) {
      void submitContactLead({
        form: {
          ...form,
          // Asegura que el payload lleve dígitos limpios; submitContactLead
          // ya hace replace(/\D/g) y concatena prefix → E.164.
          phone: digitos,
        },
        software: null,
        size,
        qual,
        leadCtx: ctx,
        sourcePath: SOURCE_PATH,
        features: [],
      }).then((siguiente) => {
        if (siguiente) setLeadCtx(siguiente);
      });
    }
  }

  function mensajeFormError(): string {
    if (!phoneOk && phoneError) return phoneError;
    if (!nombreOk || !emailOk) {
      return "Revisa tu nombre, correo y teléfono para poder agendarte.";
    }
    return "Revisa tu nombre, correo y teléfono para poder agendarte.";
  }

  if (booking) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <div className={styles.check} aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className={styles.title}>Listo, tu hora quedó reservada</h1>
          <p className={styles.sub}>
            Te llega el enlace de la videollamada por correo. Sin compromiso · 45 minutos.
          </p>
          {booking.date && (
            <p className={styles.when}>
              {textoReserva(booking.date, zonaMostrada(tzIp, ""))}
              {booking.organizer?.name ? ` · ${booking.organizer.name}` : ""}
            </p>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.head}>
          <h1 className={styles.title}>
            {pidiendoDatos ? "Agenda tu demo de Clinera" : "Elige cuándo hablamos"}
          </h1>
          <p className={styles.sub}>
            45 minutos por videollamada con un ingeniero. Te mostramos la plataforma
            funcionando con el caso de tu clínica.
          </p>
        </header>

        {pidiendoDatos ? (
          <div className={styles.formBox}>
            <label className={styles.label} htmlFor="rh-nombre">
              Tu nombre
            </label>
            <input
              id="rh-nombre"
              className={styles.input}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoComplete="name"
              placeholder="Nombre y apellido"
            />

            <label className={styles.label} htmlFor="rh-email">
              Correo
            </label>
            <input
              id="rh-email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="tucorreo@clinica.cl"
            />

            <label className={styles.label} htmlFor="rh-phone">
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
                id="rh-phone"
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
                {mensajeFormError()}
              </p>
            )}
            {!intentado && digitos.length > 0 && phoneError && (
              <p className={styles.phoneHint} role="status">
                {phoneError}
              </p>
            )}

            <button type="button" className={styles.cta} onClick={irAlCalendario}>
              Ver horas disponibles
            </button>
            <p className={styles.note}>Sin compromiso · no te llamamos sin avisar.</p>
          </div>
        ) : (
          // `onBack` es obligatoria en el scheduler y siempre pinta su botón
          // «volver». Si los datos vinieron de Meta no hay paso previo, así que
          // ese botón se esconde por CSS; si esta página los pidió, se deja,
          // porque ahí sí vuelve a algo.
          <div className={vinoPrellenado ? styles.sinVolver : undefined}>
            <StepClineraScheduler
              form={form}
              tzIp={tzIp}
              onBack={() => setPidiendoDatos(true)}
              onBooked={(next, via, confirmEventId) => {
                setBooking(next);
                void submitBookingConfirmation({
                  form: { ...form, phone: digitos },
                  software: null,
                  size,
                  qual,
                  leadCtx,
                  booking: next,
                  sourcePath: SOURCE_PATH,
                  via,
                  confirmEventId,
                  leadgenId,
                });
              }}
            />
          </div>
        )}
      </section>
    </main>
  );
}
