"use client";

// /contrata (Ricardo, 5-nov-2026): el mismo cascarón de /agenda (pantalla partida,
// «Paso N de 4», datos y confirmación de la clínica) con contenido de contratación.
// El 50% por 3 meses aparece solo en el paso 4. Checkout y webhook siguen como
// marcadores: CHECKOUT y WEBHOOK_URL.

import { useEffect, useMemo, useState } from "react";
import styles from "@/components/agenda/AgendaWizard.module.css";
import base from "@/components/estetica/EsteticaAdsLanding.module.css";
import { ECOSISTEMA_SLIDES } from "@/content/agenda-oferta";
import {
  RESERVA_PHONE_PREFIXES,
  aE164,
  digitosTelefono,
  formatearTelefono,
  mensajeErrorTelefono,
  reglaTelefono,
} from "@/lib/telefono";
import extra from "./ContrataWizard.module.css";

type PlanId = "flux" | "hex" | "vortex";

const CHECKOUT: Record<PlanId, string> = {
  flux: "[LINK CHECKOUT FLUX 50%]",
  hex: "[LINK CHECKOUT HEX 50%]",
  vortex: "[LINK CHECKOUT VORTEX 50%]",
};

const WEBHOOK_URL = "[WEBHOOK_URL_N8N]";

const EMBED_BASE = "https://app.clinera.io/embed/clinera-software-1769526763629/modal";
const EMBED_ORIGIN = "https://app.clinera.io";

const PLANES: readonly {
  id: PlanId;
  name: string;
  lista: string;
  oferta: string;
  canales: string;
  detalle: string;
}[] = [
  { id: "flux", name: "Flux", lista: "USD 79", oferta: "USD 39,50", canales: "WhatsApp", detalle: "WhatsApp · 500 conversaciones · sin IA" },
  { id: "hex", name: "Hex", lista: "USD 179", oferta: "USD 89,50", canales: "WhatsApp, Facebook e Instagram", detalle: "3 redes · 2.500 conversaciones · sin IA" },
  { id: "vortex", name: "Vortex", lista: "USD 279", oferta: "USD 139,50", canales: "Redes + IA", detalle: "Redes + IA · 5.000 conversaciones · 28.000 créditos" },
];

const TITULOS = ["Tu plan", "Tus datos", "Tu clínica", "Tu oferta"] as const;
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CAPTIONS = [
  "Elige el plan de tu clínica. El descuento aparece al final.",
  "Nombre, WhatsApp y correo para activar la cuenta.",
  "Confirmamos el nombre y la ubicación de tu clínica.",
  "50% por 3 meses en el plan que elijas.",
];

function esPlan(v: string): v is PlanId {
  return v === "flux" || v === "hex" || v === "vortex";
}

async function enviarLead(payload: Record<string, string>) {
  if (!WEBHOOK_URL.startsWith("https://")) {
    console.info("[contrata] webhook pendiente", payload);
    return;
  }
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("[contrata] webhook", e);
  }
}

export default function ContrataWizard({ planInicial = "flux" }: { planInicial?: string }) {
  const [paso, setPaso] = useState<1 | 2 | 3 | 4>(1);
  const [plan, setPlan] = useState<PlanId>(esPlan(planInicial) ? planInicial : "flux");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [prefix, setPrefix] = useState("+56");
  const [phone, setPhone] = useState("");
  const [clinica, setClinica] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [intentado, setIntentado] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [vista, setVista] = useState<"oferta" | "agenda" | "listo">("oferta");

  const rule = reglaTelefono(prefix);
  const digitos = digitosTelefono(phone);
  const phoneError = mensajeErrorTelefono(prefix, digitos);
  const nombreOk = nombre.trim().length > 1;
  const emailOk = EMAIL_OK.test(email.trim());
  const clinicaOk = clinica.trim().length > 1;
  const ubicacionOk = ubicacion.trim().length > 1;
  const elegido = PLANES.find((p) => p.id === plan) ?? PLANES[0];

  const slide = ECOSISTEMA_SLIDES[Math.min(paso - 1, ECOSISTEMA_SLIDES.length - 1)];

  function irA(n: 1 | 2 | 3 | 4) {
    setIntentado(false);
    setConfirmando(false);
    setPaso(n);
    window.scrollTo({ top: 0 });
  }

  function payload(etapa: string): Record<string, string> {
    return {
      nombre: nombre.trim(),
      clinica: clinica.trim(),
      ubicacion: ubicacion.trim(),
      celular: aE164(prefix, digitos),
      correo: email.trim(),
      plan: elegido.id,
      cta: "oferta",
      origen: "contrata",
      etapa,
      fecha: new Date().toISOString(),
      lead_stage: "contact",
      booking_status: "pending",
    };
  }

  const embedSrc = useMemo(() => {
    const params = new URLSearchParams({
      sucursalId: "cmoqinfoi007dso3d7fhnwdyb",
      tratamientoId: "cmoyoj9sn026xoi3dnedn2kl8",
    });
    if (nombre.trim()) params.set("nombre", nombre.trim());
    if (email.trim()) params.set("email", email.trim());
    if (digitos) params.set("telefono", aE164(prefix, digitos));
    return `${EMBED_BASE}?${params.toString()}`;
  }, [nombre, email, prefix, digitos]);

  useEffect(() => {
    if (vista !== "agenda") return;
    const onMessage = (ev: MessageEvent) => {
      if (ev.origin !== EMBED_ORIGIN) return;
      if ((ev.data as { type?: string } | null)?.type !== "CLOSE_FROM_IFRAME") return;
      setVista("listo");
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [vista]);

  return (
    <div
      className={`${base.page} ${styles.pagina} ${paso > 1 ? styles.avanzado : ""} ${paso === 1 ? styles.inicio : ""} ${paso === 3 ? styles.clinicaVista : ""} ${paso === 4 ? styles.calendario : ""}`}
      data-contrata-wizard
      data-paso={paso}
    >
      <aside className={styles.panel}>
        <div className={styles.marco}>
          {ECOSISTEMA_SLIDES.map((sl, i) => (
            <figure key={sl.n} className={`${styles.slide} ${sl.n === slide.n ? styles.slideOn : ""}`} aria-hidden={sl.n !== slide.n}>
              <div className={styles.slideImg} style={{ backgroundImage: `url(${sl.img})` }} />
            </figure>
          ))}
        </div>
        <p className={styles.caption}>
          <b>{CAPTIONS[paso - 1]}</b>
        </p>
        <h1 className={styles.chip}>
          <span className={styles.chipTitulo}>Contrata Clinera</span>
          <span className={styles.chipSub}>Elige tu plan y actívalo</span>
        </h1>
      </aside>

      <main className={styles.lado}>
        <div className={styles.contenido}>
          <div className={styles.tarjeta} id="formulario">
            <div className={styles.progress} aria-hidden>
              {TITULOS.map((_, i) => (
                <span key={TITULOS[i]} className={`${styles.seg} ${i < paso ? styles.segOn : ""}`} />
              ))}
            </div>
            <span className={styles.paso}>
              Paso {paso} de 4 · {TITULOS[paso - 1]}
            </span>

            {paso === 1 && (
              <div data-contrata-paso="1">
                <h2 className={styles.titulo}>Elige tu plan</h2>
                <p className={styles.sub}>Agenda y WhatsApp desde USD 79 al mes. Sin costo de implementación.</p>
                <Opciones plan={plan} onChange={setPlan} oferta={false} />
                <button type="button" className={base.cta} onClick={() => irA(2)}>
                  Continuar →
                </button>
              </div>
            )}

            {paso === 2 && (
              <div data-contrata-paso="2">
                <h2 className={styles.titulo}>¿Dónde te confirmamos?</h2>
                <label className={base.label} htmlFor="ct-nombre">Nombre</label>
                <input id="ct-nombre" className={base.input} value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" placeholder="Nombre y apellido" aria-invalid={intentado && !nombreOk} />
                <label className={base.label} htmlFor="ct-phone">Celular (WhatsApp)</label>
                <div className={base.phoneRow}>
                  <select
                    className={base.select}
                    value={prefix}
                    aria-label="Código de país"
                    onChange={(e) => {
                      setPrefix(e.target.value);
                      setPhone(formatearTelefono(phone, e.target.value));
                    }}
                  >
                    {RESERVA_PHONE_PREFIXES.map((p) => (
                      <option key={p.prefix} value={p.prefix}>
                        {p.flag} {p.prefix}
                      </option>
                    ))}
                  </select>
                  <input
                    id="ct-phone"
                    className={base.input}
                    value={phone}
                    onChange={(e) => setPhone(formatearTelefono(e.target.value, prefix))}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={rule.placeholder}
                    aria-invalid={intentado && !!phoneError}
                  />
                </div>
                <label className={base.label} htmlFor="ct-email">Correo</label>
                <input id="ct-email" className={base.input} value={email} onChange={(e) => setEmail(e.target.value)} type="email" inputMode="email" autoComplete="email" placeholder="tucorreo@clinica.cl" aria-invalid={intentado && !emailOk} />
                {intentado && (!nombreOk || phoneError || !emailOk) ? (
                  <p className={base.error} role="alert">
                    {!nombreOk ? "Escribe tu nombre." : phoneError || "Revisa tu correo."}
                  </p>
                ) : null}
                <button
                  type="button"
                  className={base.cta}
                  onClick={() => {
                    if (!nombreOk || phoneError || !emailOk) {
                      setIntentado(true);
                      return;
                    }
                    irA(3);
                  }}
                >
                  Continuar →
                </button>
                <button type="button" className={styles.volver} onClick={() => irA(1)}>
                  ← Volver
                </button>
              </div>
            )}

            {paso === 3 && (
              <div data-contrata-paso="3">
                <h2 className={styles.titulo}>Cuéntanos de tu clínica</h2>
                <label className={base.label} htmlFor="ct-clinica">Nombre de tu clínica</label>
                <input id="ct-clinica" className={base.input} value={clinica} onChange={(e) => setClinica(e.target.value)} autoComplete="organization" placeholder="Clínica Vela" aria-invalid={intentado && !clinicaOk} />
                <label className={base.label} htmlFor="ct-ubicacion">Ubicación</label>
                <input id="ct-ubicacion" className={base.input} value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} autoComplete="address-level2" placeholder="Ciudad o comuna" aria-invalid={intentado && !ubicacionOk} />
                {intentado && (!clinicaOk || !ubicacionOk) ? (
                  <p className={base.error} role="alert">
                    {!clinicaOk ? "Escribe el nombre de tu clínica." : "Escribe dónde está tu clínica."}
                  </p>
                ) : null}
                {confirmando ? (
                  <div className={styles.confirmaClinica} role="alertdialog" aria-labelledby="ct-confirma" data-confirmar-clinica>
                    <p id="ct-confirma" className={styles.confirmaTexto}>
                      Tu clínica se llama <strong>{clinica.trim()}</strong> y está ubicada en <strong>{ubicacion.trim()}</strong>. ¿Correcto?
                    </p>
                    <div className={styles.confirmaBotones}>
                      <button
                        type="button"
                        className={base.cta}
                        onClick={() => {
                          setPaso(4);
                          setVista("oferta");
                          void enviarLead(payload("clinica"));
                        }}
                      >
                        Sí, correcto
                      </button>
                      <button type="button" className={styles.corregir} onClick={() => setConfirmando(false)}>
                        Corregir
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      className={base.cta}
                      onClick={() => {
                        if (!clinicaOk || !ubicacionOk) {
                          setIntentado(true);
                          return;
                        }
                        setConfirmando(true);
                      }}
                    >
                      Ver mi oferta →
                    </button>
                    <button type="button" className={styles.volver} onClick={() => irA(2)}>
                      ← Volver
                    </button>
                  </>
                )}
              </div>
            )}

            {paso === 4 && vista === "listo" && (
              <div data-contrata-paso="4" data-agenda-listo>
                <h2 className={styles.titulo}>Reunión agendada</h2>
                <p className={styles.sub}>Te llega la confirmación por correo. Nos vemos.</p>
              </div>
            )}

            {paso === 4 && vista === "agenda" && (
              <div data-contrata-paso="4" data-agenda-embed>
                <h2 className={styles.titulo}>Agenda tu reunión</h2>
                <p className={styles.sub}>Elige profesional, día y hora. Te llega la confirmación por correo.</p>
                <iframe className={extra.embed} src={embedSrc} title="Agenda tu reunión con Clinera" />
                <button type="button" className={styles.volver} onClick={() => setVista("oferta")}>
                  ← Volver a la oferta
                </button>
              </div>
            )}

            {paso === 4 && vista === "oferta" && (
              <div data-contrata-paso="4" data-oferta>
                <h2 className={styles.titulo}>50% por 3 meses</h2>
                <Opciones plan={plan} onChange={setPlan} oferta />
                <p className={extra.terminos}>por 3 meses, luego precio normal · sin costo de implementación</p>
                <a className={base.cta} style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }} href={CHECKOUT[plan]} data-checkout={plan} data-cta="oferta-50">
                  Aprovechar {elegido.name} al 50%
                </a>
                <button type="button" className={extra.secundario} data-agendar onClick={() => setVista("agenda")}>
                  Agendar reunión
                </button>
                <button type="button" className={styles.volver} onClick={() => irA(3)}>
                  ← Volver
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Opciones({ plan, onChange, oferta }: { plan: PlanId; onChange: (id: PlanId) => void; oferta: boolean }) {
  return (
    <div className={extra.opciones} role="radiogroup" aria-label={oferta ? "Plan con 50% por 3 meses" : "Plan"}>
      {PLANES.map((p) => (
        <label key={p.id} className={`${extra.opcion} ${plan === p.id ? extra.opcionOn : ""}`} data-plan-opcion={p.id}>
          <input type="radio" name={oferta ? "oferta" : "plan"} value={p.id} checked={plan === p.id} onChange={() => onChange(p.id)} />
          <span className={extra.nombre}>{p.name}</span>
          <span className={extra.precio} data-precio>
            {oferta ? p.oferta : p.lista}
            {oferta ? <s>{p.lista}</s> : null}
          </span>
          <p className={extra.detalle}>{p.detalle}</p>
        </label>
      ))}
    </div>
  );
}
