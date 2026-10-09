"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import WizardShowcase from "./WizardShowcase";
import {
  buildCalLinkWithAttribution,
  getAttributionPayload,
} from "@/lib/gclid";
import { getClineraMetaIds } from "@/lib/metaIds";
import {
  MQL_TRIGGER,
  fireMqlEvent,
  type QualCustomData,
} from "@/lib/metaEvents";
import { zonaMostrada } from "@/lib/timezone";

// ============== SHARED CONSTANTS ==============
const GRAD = "linear-gradient(135deg,#3B82F6 0%,#7C3AED 50%,#D946EF 100%)";

type PhoneRule = {
  name: string;
  len: number;
  placeholder: string;
  pattern: RegExp;
  invalidHint: string;
};

const PHONE_RULES: Record<string, PhoneRule> = {
  "+56": { name: "Chile", len: 9, placeholder: "9 1234 5678", pattern: /^9\d{8}$/, invalidHint: "Debe empezar con 9" },
  "+51": { name: "Perú", len: 9, placeholder: "912 345 678", pattern: /^9\d{8}$/, invalidHint: "Debe empezar con 9" },
  "+57": { name: "Colombia", len: 10, placeholder: "300 123 4567", pattern: /^3\d{9}$/, invalidHint: "Debe empezar con 3" },
  "+52": { name: "México", len: 10, placeholder: "55 1234 5678", pattern: /^[2-9]\d{9}$/, invalidHint: "Debe empezar con 2-9" },
  "+507": { name: "Panamá", len: 8, placeholder: "6123 4567", pattern: /^6\d{7}$/, invalidHint: "Debe empezar con 6" },
  "+506": { name: "Costa Rica", len: 8, placeholder: "8312 3456", pattern: /^[678]\d{7}$/, invalidHint: "Debe empezar con 6, 7 u 8" },
  "+54": { name: "Argentina", len: 10, placeholder: "11 1234 5678", pattern: /^\d{10}$/, invalidHint: "Debe tener 10 dígitos" },
  "+595": { name: "Paraguay", len: 9, placeholder: "981 234 567", pattern: /^9[2-9]\d{7}$/, invalidHint: "Debe empezar con 92-99" },
  "+34": { name: "España", len: 9, placeholder: "612 345 678", pattern: /^[67]\d{8}$/, invalidHint: "Debe empezar con 6 o 7" },
  "+593": { name: "Ecuador", len: 9, placeholder: "99 123 4567", pattern: /^9\d{8}$/, invalidHint: "Debe empezar con 9" },
  "+1": { name: "Puerto Rico", len: 10, placeholder: "787 123 4567", pattern: /^(787|939)\d{7}$/, invalidHint: "Debe empezar con 787 o 939" },
};

const AGENDA_PHONE_PREFIXES = [
  { prefix: "+56", flag: "🇨🇱", label: "Chile" },
  { prefix: "+51", flag: "🇵🇪", label: "Perú" },
  { prefix: "+57", flag: "🇨🇴", label: "Colombia" },
  { prefix: "+52", flag: "🇲🇽", label: "México" },
  { prefix: "+507", flag: "🇵🇦", label: "Panamá" },
  { prefix: "+506", flag: "🇨🇷", label: "Costa Rica" },
] as const;

function ChannelLogos() {
  const item = (label: string, children: React.ReactNode) => (
    <span
      title={label}
      aria-label={label}
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        border: "1px solid #E7EBF0",
      }}
    >
      {children}
    </span>
  );
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 4, verticalAlign: "middle" }}>
      {item("WhatsApp", (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366" aria-hidden>
          <path d="M12 2C6.5 2 2 6.3 2 11.6c0 1.9.5 3.7 1.5 5.3L2 22l5.3-1.4c1.5.8 3.2 1.3 4.7 1.3 5.5 0 10-4.3 10-9.6S17.5 2 12 2zm5.7 13.6c-.2.7-1.2 1.2-1.9 1.4-.5.1-1.1.2-3.6-.8-3.1-1.3-5.1-4.5-5.2-4.7-.2-.2-1.3-1.7-1.3-3.3s.8-2.3 1.1-2.6c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.7-.1.3.1 1.9.9 2.2 1.1.3.1.5.2.6.3.1.2.1.8-.1 1.5z" />
        </svg>
      ))}
      {item("Facebook", (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#1877F2" aria-hidden>
          <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v9h4v-9h3.2L17 11h-4V9c0-.6.4-1 1-1z" />
        </svg>
      ))}
      {item("Instagram", (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="#E1306C" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" stroke="#E1306C" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1" fill="#E1306C" />
        </svg>
      ))}
      {item("Llamada", (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2" aria-hidden>
          <path d="M6.5 3.5l3 2.2-1.6 2.4a14 14 0 007 7l2.4-1.6 2.2 3-2.1 1.2C15.2 19.2 5 16 4.2 7.6L5.4 5.5z" />
        </svg>
      ))}
    </span>
  );
}

// ============== PASO 1 — SOFTWARE ACTUAL ==============
// Toda clínica mediana ya usa algún sistema; el paso 1 identifica cuál para
// enmarcar la migración. Ya no existe la opción "no tenemos software".
type SoftwareId =
  | "agendapro"
  | "dentalink"
  | "medilink"
  | "reservo"
  | "desarrollo_propio"
  | "otro";

type SoftwareOption = { id: SoftwareId; label: string };

const SOFTWARE_OPTIONS: SoftwareOption[] = [
  { id: "agendapro", label: "AgendaPro" },
  { id: "dentalink", label: "Dentalink" },
  { id: "medilink", label: "Medilink" },
  { id: "reservo", label: "Reservo" },
  { id: "desarrollo_propio", label: "Desarrollo propio" },
  { id: "otro", label: "Otro sistema" },
];

const SOFTWARE_LABELS: Record<SoftwareId, string> = SOFTWARE_OPTIONS.reduce(
  (acc, o) => ({ ...acc, [o.id]: o.label }),
  {} as Record<SoftwareId, string>,
);

// ============== PASO 1 — VARIANTE "NECESIDAD" ==============
// /agenda pregunta por el dolor, no por el software actual: abre la puerta a
// clínicas sin sistema y le da al equipo comercial el motivo real de la
// reunión. /ventas sigue preguntando por el software (prop `question1`).
type NeedId =
  | "fuera_horario"
  | "unificar_operacion"
  | "no_show"
  | "recuperar_pacientes"
  | "liberar_recepcion"
  | "otra";

const NEED_OPTIONS: { id: NeedId; label: string }[] = [
  { id: "fuera_horario", label: "Responder a pacientes fuera de horario" },
  { id: "unificar_operacion", label: "Unificar la operación en un solo software" },
  { id: "no_show", label: "Reducir las horas perdidas por inasistencias" },
  { id: "recuperar_pacientes", label: "Recuperar pacientes que dejaron de venir" },
  { id: "liberar_recepcion", label: "Liberar a recepción de tareas repetitivas" },
  { id: "otra", label: "Otra necesidad" },
];

// ============== PASO 1 — VARIANTE "INTERÉS" ==============
// /agenda pregunta directo si quiere implementar Clinera: un Sí que avanza y un
// No que cierra. Decisión de Ricardo (agosto 2026), sabiendo el costo: esta
// variante NO captura `necesidad_principal`, así que el equipo comercial llega a
// la reunión sin el motivo declarado. La contraparte es un paso de un solo tap.
const INTEREST_ID = "interes_implementar" as const;
const INTEREST_LABEL = "Confirmó interés en implementar Clinera";

/** Qué pregunta el paso 1. El resto del wizard es idéntico en los tres casos. */
export type Question1 = "software" | "need" | "interest" | "features";

// /agenda v2: chips de producto (multi-select), no el dolor ni el software.
export type FeatureId =
  | "voz"
  | "texto"
  | "intelligence"
  | "rrss"
  | "fichas"
  | "consentimientos"
  | "odontograma";

const FEATURE_OPTIONS: { id: FeatureId; label: string }[] = [
  { id: "voz", label: "Agente de voz" },
  { id: "texto", label: "Agente de texto" },
  { id: "intelligence", label: "Clinera Intelligence" },
  { id: "rrss", label: "WhatsApp / FB / IG" },
  { id: "fichas", label: "Fichas clínicas" },
  { id: "consentimientos", label: "Consentimientos" },
  { id: "odontograma", label: "Odontograma" },
];

const FEATURE_LABELS: Record<FeatureId, string> = FEATURE_OPTIONS.reduce(
  (acc, o) => ({ ...acc, [o.id]: o.label }),
  {} as Record<FeatureId, string>,
);

const FEATURE_IDS = new Set<string>(FEATURE_OPTIONS.map((o) => o.id));

const CARGO_OPTIONS = [
  "Dueño / Fundador",
  "Gerente general",
  "Gerente de operaciones",
  "Administrador/a",
  "Otro",
] as const;

type CargoId = (typeof CARGO_OPTIONS)[number] | "";

type Step1Id = SoftwareId | NeedId | typeof INTEREST_ID | FeatureId;

const NEED_IDS = new Set<string>(NEED_OPTIONS.map((o) => o.id));

/** Etiqueta legible de la respuesta del paso 1: software, necesidad o interés. */
const STEP1_LABELS: Record<string, string> = {
  ...SOFTWARE_LABELS,
  ...NEED_OPTIONS.reduce((acc, o) => ({ ...acc, [o.id]: o.label }), {}),
  [INTEREST_ID]: INTEREST_LABEL,
  ...FEATURE_LABELS,
};

/** Campos del paso 1 para el webhook: se conservan las claves legacy. */
function step1Fields(id: Step1Id | null, features: FeatureId[] = []) {
  const esInteres = id === INTEREST_ID;
  const esFeatures = features.length > 0 || (!!id && FEATURE_IDS.has(id));
  const esNecesidad = !!id && NEED_IDS.has(id);
  const featureIds = features.length > 0 ? features : esFeatures && id ? [id as FeatureId] : [];
  // `necesidad_principal` queda vacío en la variante de interés en vez de
  // inventarse un motivo, igual que el número de sedes en el paso 2.
  return {
    paso1_pregunta: esInteres ? "interes" : esFeatures ? "necesidad" : esNecesidad ? "necesidad" : "software",
    necesidad_principal: esFeatures ? featureIds.join(",") : esNecesidad ? id : "",
    necesidad_principal_label: esFeatures
      ? featureIds.map((f) => FEATURE_LABELS[f]).join(" · ")
      : esNecesidad
        ? STEP1_LABELS[id]
        : "",
  };
}

// ============== PASO 2 — TAMAÑO DE OPERACIÓN ==============
// UNA sola pregunta, sobre UN solo eje: el volumen mensual de pacientes.
// Reemplaza al perfil mixto (sedes + pacientes) que estuvo hasta agosto 2026 y
// que mezclaba dos ejes en la misma lista: dos de sus cuatro opciones hablaban
// de sedes y dejaban el volumen en "unknown", que es justo el dato con el que el
// equipo comercial prioriza y el que ahora viaja como columna propia
// («Tamaño de operación») a Baserow 152 y a Twenty.
//
// Las CLAVES del payload se conservan (`operational_profile`, `patients_band`,
// `sucursales`, `pacientes_mes`…) para no romper n8n → Baserow / Monday / Meta;
// lo que cambia son sus VALORES. El número de sedes ya no se pregunta: sale
// vacío en vez de inventado, igual que antes salía vacío el volumen en multisede.
export type OperationalProfileId =
  | "vol_200_500"
  | "vol_500_1000"
  | "vol_1000_plus";

export type LeadPriority = "standard" | "high" | "strategic";

/** Banda de volumen mensual de pacientes: el único eje del paso 2. */
type PatientsBand = "200_500" | "500_1000" | "gt_1000";

type OperationalProfile = {
  id: OperationalProfileId;
  label: string;
  priority: LeadPriority;
  prioridadAlta: boolean;
  patientsBand: PatientsBand;
  /** Equivalencias con el esquema anterior, para los consumidores legacy. */
  legacy: { pacientesMes: string; pacientesMesLabel: string };
};

// AJUSTA AQUÍ la prioridad comercial (único lugar del código).
export const OPERATIONAL_PROFILES: OperationalProfile[] = [
  {
    id: "vol_200_500",
    label: "Entre 200 a 500 pacientes al mes",
    priority: "standard",
    prioridadAlta: false,
    patientsBand: "200_500",
    legacy: { pacientesMes: "200_500", pacientesMesLabel: "200–500" },
  },
  {
    id: "vol_500_1000",
    label: "Entre 500 y 1000 pacientes al mes",
    priority: "high",
    prioridadAlta: true,
    patientsBand: "500_1000",
    legacy: { pacientesMes: "500_1000", pacientesMesLabel: "500–1.000" },
  },
  {
    id: "vol_1000_plus",
    label: "Más de 1000 pacientes",
    priority: "strategic",
    prioridadAlta: true,
    patientsBand: "gt_1000",
    legacy: { pacientesMes: "1000_plus", pacientesMesLabel: "más de 1.000" },
  },
];

/** El estado del paso 2. Se mantiene el nombre `SizeAnswers` para no tocar el resto. */
type SizeAnswers = { profile: OperationalProfile | null };

export type Qualification = { califica: boolean; prioridadAlta: boolean; priority: LeadPriority };

// Regla PURA — toda clínica que completa el filtro califica (el precio de entrada
// auto-selecciona). prioridad_alta / priority = señal de tamaño para el equipo comercial.
// FUENTE DE VERDAD única: el tracking (src/lib/metaEvents.ts) consume este resultado.
export function evaluateQualification(size: SizeAnswers): Qualification {
  return {
    califica: true,
    prioridadAlta: size.profile?.prioridadAlta ?? false,
    priority: size.profile?.priority ?? "standard",
  };
}

function sizeComplete(size: SizeAnswers): boolean {
  return !!size.profile;
}

function sizeSummaryLabel(size: SizeAnswers): string {
  return size.profile?.label ?? "";
}

// Tipo de clínica que atendemos. Dental se reabrió el 9-oct-2026 (ventas).
type ClinicType = "medica" | "dental" | "kinesiologica" | "estetica" | "salud_mental";
const CLINIC_TYPE_OPTIONS: { id: ClinicType; label: string }[] = [
  { id: "medica", label: "Médica" },
  { id: "kinesiologica", label: "Kinesiológica" },
  { id: "estetica", label: "Estética" },
  { id: "salud_mental", label: "Salud mental" },
];
const CLINIC_TYPE_LABELS: Record<ClinicType, string> = {
  medica: "Médica",
  dental: "Dental",
  kinesiologica: "Kinesiológica",
  estetica: "Estética",
  salud_mental: "Salud mental",
};


// El navegador ya no le habla directo a n8n: /api/wizard es el proxy
// server-side que conoce la URL real y el token compartido (hallazgo #1 de
// auditoria-leads-clinera.md, PR #170).
const WEBHOOK_URL = "/api/wizard";
const WA_NUMBER = "56985581524";

// ============== AGENDADOR DEL PASO FINAL ==============
// "cal"     → embed inline de Cal.com (flujo original de /ventas).
// "clinera" → widget de reserva del propio producto (app.clinera.io/embed),
//             usado por /agenda: dogfooding de la agenda real de Clinera.
export type SchedulerId = "cal" | "clinera";

// Embed oficial de Clinera: la clínica "Clinera software" (instancia comercial
// propia). sucursalId + tratamientoId presetean los pasos 1 y 2 del widget, que
// arranca directo en la elección de profesional.
const CLINERA_EMBED_BASE =
  "https://app.clinera.io/embed/clinera-software-1769526763629/modal";
const CLINERA_EMBED_PRESET = {
  sucursalId: "cmoqinfoi007dso3d7fhnwdyb",
  tratamientoId: "cmoyoj9sn026xoi3dnedn2kl8",
};
const CLINERA_EMBED_ORIGIN = "https://app.clinera.io";

// Reserva nativa vía n8n.oacg.cl: el paso final de /agenda intenta primero el
// flujo sin iframe (datos ya precargados; el cliente solo elige profesional,
// fecha y hora). n8n hace de puente server-side hacia la API pública de
// app.clinera.io — el workflow vive en integrations/n8n/. Si el webhook de
// config no responde (workflow inactivo o caído), se cae al embed oficial.
const N8N_AGENDA_CONFIG_URL = "https://n8n.oacg.cl/webhook/clinera-agenda-config";
const N8N_AGENDA_DISPO_URL = "https://n8n.oacg.cl/webhook/clinera-agenda-disponibilidad";
const N8N_AGENDA_TURNO_URL = "https://n8n.oacg.cl/webhook/clinera-agenda-turno";

type ClineraAgendaConfig = {
  ok: boolean;
  tratamiento?: string;
  duracionMin?: number;
};

export type DispoSlot = {
  horaInicio: string;
  horaFin?: string;
  duracionMin?: number;
  profesional?: { id?: string; name?: string };
};

// client_id de GA4 desde la cookie _ga (`GA1.1.<client_id>`). Se manda al
// webhook para que el evento server-side caiga en la misma sesión/usuario
// que el resto de la navegación, en vez de crear un usuario nuevo.
function readGaClientId(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)_ga=([^;]+)/);
  if (!m) return "";
  const partes = m[1].split(".");
  return partes.length >= 4 ? partes.slice(-2).join(".") : "";
}

export type Form = {
  nombre: string;
  clinica: string;
  tipoClinica: ClinicType | "";
  prefix: string;
  phone: string;
  email: string;
  website: string;
  city: string;
  cargo: CargoId;
  /** Boxes/profesionales (`1_3`, `4_6`…). Sólo lo pregunta /agenda; el resto de los wizards lo deja fuera. */
  boxes?: { id: string; label: string } | null;
};

function isValidWebsite(value: string) {
  const v = value.trim();
  if (v.length < 3) return false;
  if (v.startsWith("@")) return v.length >= 4;
  if (/instagram|facebook|tiktok|linkedin|wa\.me|whatsapp/i.test(v)) return v.length >= 5;
  try {
    const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
    const u = new URL(withProto);
    return u.hostname.includes(".");
  } catch {
    return false;
  }
}

function clinicCrmFields(form: Form) {
  const clinica = form.clinica.trim();
  return {
    // `clinica` es el alias que n8n → Twenty ya leía; `nombre_clinica` es el canónico.
    clinica,
    nombre_clinica: clinica,
    tipo_clinica: form.tipoClinica || "",
    tipo_clinica_label: form.tipoClinica ? CLINIC_TYPE_LABELS[form.tipoClinica] : "",
    sitio_web: form.website.trim(),
    ciudad: form.city.trim(),
    cargo: form.cargo,
    ...(form.boxes
      ? { boxes_profesionales: form.boxes.id, boxes_profesionales_label: form.boxes.label }
      : {}),
  };
}

// ============== TRACKING HELPERS ==============
function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
}

// Señales de origen de un visitante. Se separan del navegador para poder probar
// la regla sin montar una página: `detectLeadSource()` las junta y
// `clasificarLeadSource()` decide.
export type LeadSourceSignals = {
  /** Query de la URL actual (`window.location.search`). */
  search: string;
  /** Identificador de click de Google ya guardado (cookie `_clinera_gclid`, 90 días). */
  storedGoogleClickId?: string | null;
  /** fbclid persistido en sessionStorage por `metaIds.ts`. */
  storedFbclid?: string | null;
  /** Cookie `_fbc`. El Pixel solo la escribe cuando vio un fbclid → es click pagado. */
  storedFbc?: string | null;
};

/**
 * De dónde viene el lead: "google-ads" | "meta-ads" | "organico" — o el
 * `utm_source` crudo cuando la campaña no es de ninguna de las dos redes.
 *
 * El orden ES la regla, y cada peldaño está por un motivo:
 *
 * 1. `?source=` / `?lead_source=` explícito: lo ponemos nosotros en un enlace,
 *    no se discute con heurísticas.
 * 2. **Identificador de click**, primero el de la URL y después el guardado. Es
 *    la única prueba dura de que hubo un anuncio: un `utm` lo escribe
 *    cualquiera, un `gclid` lo pone Google al hacer clic.
 * 3. Los `utm`, que dicen de dónde *dice* venir el enlace.
 *
 * Dos huecos que esto cierra, los dos contaban leads PAGADOS como orgánicos:
 *
 * - **`gbraid` / `wbraid`**: el identificador de click de YouTube/Demand Gen y
 *   de iOS, donde Google no manda `gclid`. `gclid.ts` los guarda y viajan en el
 *   payload desde siempre; nadie los miraba para decidir el origen.
 * - **La segunda página.** Quien entra por un anuncio a `/planes` y llega a
 *   `/agenda` por el menú ya no trae nada en la URL. El `gclid` sigue en la
 *   cookie de 90 días y viaja igual en el payload, así que el lead quedaba
 *   marcado "organico" con su propio `gclid` al lado.
 *
 * Lo que NO es señal de origen: la cookie `_fbp`. La tiene TODO visitante que
 * cargue el Pixel, venga de donde venga; usarla marcaría el sitio entero como
 * Meta Ads.
 */
export function clasificarLeadSource(s: LeadSourceSignals): string {
  const qs = new URLSearchParams(s.search || "");
  const explicit = (qs.get("source") || qs.get("lead_source") || "").toLowerCase();
  if (explicit === "google" || explicit === "google-ads") return "google-ads";
  if (explicit === "meta" || explicit === "meta-ads" || explicit === "facebook") return "meta-ads";
  if (explicit === "organico" || explicit === "organic") return "organico";

  // Identificador de click en la URL — la visita de AHORA.
  if (qs.get("gclid") || qs.get("gbraid") || qs.get("wbraid")) return "google-ads";
  if (qs.get("fbclid")) return "meta-ads";
  // `gad_source` / `gad_campaignid` los agrega el autotagging de Google y a
  // veces llegan sin `gclid` (redirecciones que se comen el resto de la query).
  if (qs.get("gad_source") || qs.get("gad_campaignid")) return "google-ads";

  // Identificador de click guardado — un anuncio de una visita anterior, dentro
  // de la ventana de atribución.
  if (s.storedGoogleClickId) return "google-ads";
  if (s.storedFbclid || s.storedFbc) return "meta-ads";

  const utm = (qs.get("utm_source") || "").toLowerCase();
  if (utm.includes("google") || utm.includes("adwords") || utm.includes("youtube")) return "google-ads";
  // `an` es Audience Network y `msg` es Messenger: los rótulos con los que Meta
  // marca sus propios anuncios. Van por igualdad y no por substring — «an» cae
  // dentro de media lengua castellana («analytics» no es Meta).
  if (utm === "an" || utm === "msg") return "meta-ads";
  if (utm.includes("facebook") || utm.includes("meta") || utm.includes("instagram") || utm.includes("ig")) return "meta-ads";
  if (utm) return utm;
  return "organico";
}

export function detectLeadSource(): string {
  if (typeof window === "undefined") return "organico";
  // Las mismas dos fuentes que ya viajan en el payload del webhook, para que el
  // `lead_source` no pueda contradecir al `gclid` que va tres líneas más abajo.
  const ads = getAttributionPayload();
  const meta = getClineraMetaIds();
  return clasificarLeadSource({
    search: window.location.search,
    storedGoogleClickId: ads.gclid || ads.gbraid || ads.wbraid,
    storedFbclid: meta.fbclid,
    storedFbc: meta.meta_fbc,
  });
}

// Empuja un evento a GTM/dataLayer (mecanismo de analytics que ya usa el sitio).
export function pushDL(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push({ event, ...data });
}

// event_id único del lead. Se comparte entre el webhook n8n (upsert del lead) y,
// según MQL_TRIGGER, el par Pixel+CAPI del evento MQL → una sola señal deduplicada.
export function newLeadEventId(): string {
  return "ventas_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
}

// Atributos NO personales del lead (software + tamaño + calificación). Se usan
// tanto en los eventos de analytics como en el payload del webhook.
function sizeAttributes(
  software: Step1Id | null,
  size: SizeAnswers,
  qual: Qualification | null,
  features: FeatureId[] = [],
) {
  const p = size.profile;
  return {
    software_actual: software ?? "",
    software_actual_label: software ? STEP1_LABELS[software] : "",
    // En /agenda el paso 1 pregunta la necesidad, no el software: se emite
    // además con clave propia para que el CRM no lea "necesidad" donde dice
    // "software". Las claves legacy de arriba se conservan igual.
    ...step1Fields(software, features),
    // Tamaño de operación — la clave que n8n mapea a la columna «Tamaño de
    // operación» de Baserow 152 y al campo homónimo del negocio en Twenty.
    tamano_operacion: p?.id ?? "",
    tamano_operacion_label: p?.label ?? "",
    // Mismo dato con las claves del esquema anterior (los consumidores ya
    // armados sobre ellas siguen funcionando).
    operational_profile: p?.id ?? "",
    operational_profile_label: p?.label ?? "",
    // El paso 2 ya no pregunta por sedes: se emite vacío, nunca inventado.
    locations_band: "",
    patients_band: p?.patientsBand ?? "unknown",
    lead_priority: qual?.priority ?? "standard",
    prioridad_alta: qual?.prioridadAlta ?? false,
    califica: qual?.califica ?? false,
    // Legacy DERIVADO del perfil — se mantiene para n8n → Baserow 152 / Monday.
    sucursales: "",
    sucursales_label: "",
    pacientes_mes: p?.legacy.pacientesMes ?? "",
    pacientes_mes_label: p?.legacy.pacientesMesLabel ?? "",
  };
}

// custom_data para el evento MQL de Meta: SOLO atributos de calificación, SIN PII
// y SIN los labels legibles. `pais` sale del prefijo telefónico cuando ya hay
// contacto (Paso 3); "" mientras no lo tengamos.
function qualCustomData(
  software: Step1Id | null,
  size: SizeAnswers,
  qual: Qualification | null,
  pais: string,
): QualCustomData {
  const p = size.profile;
  return {
    software_actual: software ?? "",
    operational_profile: p?.id ?? "",
    locations_band: "",
    patients_band: p?.patientsBand ?? "unknown",
    lead_priority: qual?.priority ?? "standard",
    // Legacy derivado: Meta ya tiene audiencias/columnas armadas sobre estos.
    sucursales: "",
    pacientes_mes: p?.legacy.pacientesMes ?? "",
    prioridad_alta: qual?.prioridadAlta ?? false,
    pais,
  };
}

// Campos legacy para no romper el mapeo de n8n → Monday (que esperaba los datos
// del esquema anterior: tamano_clinica, patient_volume, migration_intent, etc.).
// Toda clínica que llega aquí ya tiene software → su intención es migrar.
function backCompatFields(software: Step1Id | null, size: SizeAnswers, qual: Qualification | null) {
  // `patient_volume` solo se puede afirmar cuando ya hay banda elegida. Las tres
  // bandas arrancan en 200 pacientes/mes, así que todas caen en "over_100".
  const patientVolume = size.profile ? "over_100" : "unknown";
  return {
    tamano_clinica: sizeSummaryLabel(size),
    patient_volume: patientVolume,
    migration_intent: "yes_migrate",
    migration_intent_label: "Queremos migrar a Clinera",
    software_actual_migracion: software ? STEP1_LABELS[software] : "",
    monday_initial_status: "quiere migrar",
    lead_priority: qual?.priority ?? "standard",
    calendar_access: "allowed",
  };
}

// ============== ROOT ==============
export default function VentasLanding({
  enableMigrationQualification = false,
  scheduler = "cal",
  sourcePath = "/ventas",
  question1 = "software",
  investmentAfterContact = false,
  meetingMinutes = 30,
  showcase = false,
  agendaV2 = false,
  tzIp = "",
}: {
  enableMigrationQualification?: boolean;
  /** Qué pregunta el paso 1: el software actual (default) o la necesidad. */
  question1?: Question1;
  /**
   * Corre el aviso de inversión del paso 2 al paso 4, es decir después de que
   * el lead dejó sus datos: menos fricción y el lead queda capturado igual.
   */
  investmentAfterContact?: boolean;
  /** Duración real de la reunión, la que se promete en el copy. */
  meetingMinutes?: number;
  /** Agendador del paso final. Default: Cal.com (comportamiento original). */
  scheduler?: SchedulerId;
  /** Ruta que origina el lead — viaja en `fuente` del webhook y en el mensaje de WhatsApp. */
  sourcePath?: string;
  /**
   * Reemplaza la columna de testimonios por el argumento de producto que vivía
   * en /plataforma, sincronizado con el paso del wizard: el visitante ve qué es
   * Clinera sin salir de la página donde agenda. Ver WizardShowcase.
   */
  showcase?: boolean;
  /** /agenda v2: necesidades en chips, clínica con web, cargo, doctores en móvil. */
  agendaV2?: boolean;
  /** Zona IANA de la IP (`x-vercel-ip-timezone`). Gana sobre el reloj del OS. */
  tzIp?: string;
}) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0, rootMargin: "0px 0px -5% 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    const t = window.setTimeout(() => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in")), 1200);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        html, body { margin: 0; padding: 0; background: #fff; color: #0A0A0A; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        :root {
          --brand-grad: linear-gradient(135deg, #3B82F6 0%, #7C3AED 50%, #D946EF 100%);
          --brand-grad-soft: linear-gradient(135deg, rgba(59,130,246,.12) 0%, rgba(124,58,237,.12) 50%, rgba(217,70,239,.12) 100%);
        }
        ::selection { background: #0A0A0A; color: #fff; }
        .reveal { opacity: 0; transform: translateY(12px); transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
        .reveal.in { opacity: 1; transform: none; }
        @keyframes pulseDot { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,.45); } 70% { box-shadow: 0 0 0 10px rgba(16,185,129,0); } 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); } }
        .live-dot { animation: pulseDot 2.2s infinite; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-5px); } 40% { transform: translateX(5px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(3px); } }
        @keyframes scaleBounce { 0% { transform: scale(0); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
        @keyframes marqueeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes ventasFadeUp { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0ms !important; transition-duration: 0ms !important; } }
        /* /agenda ocupa la ventana completa y centra el bloque: es una landing de
           un solo golpe de vista, no una página para scrollear. Sólo la variante
           showcase — el resto de las páginas que comparten este hero siguen
           fluyendo con su alto natural. */
        .ventas-hero-centrado { min-height: 100svh; }
        @supports not (min-height: 100svh) { .ventas-hero-centrado { min-height: 100vh; } }
        /* En móvil el stack ya cabe en ~650px útiles. Volver a 100svh centra el
           bloque en pantallas altas (844) y reparte la franja blanca arriba y
           abajo en vez de dejar un hueco enorme sólo abajo — sin forzar scroll
           cuando el contenido es más bajo que la ventana. */
        @media (max-width: 820px) {
          .ventas-hero-centrado { min-height: 100svh; }
          @supports not (min-height: 100svh) { .ventas-hero-centrado { min-height: 100vh; } }
        }
        /* Desktop shows the big carousel card; mobile swaps to a compact horizontal strip */
        .ventas-testi-desktop { display: block; }
        .ventas-testi-mobile { display: none; }
        @media (max-width: 820px) {
          .ventas-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
            padding: 8px 14px 10px !important;
          }
          /* Envuelve a dos líneas en casi cualquier ancho de móvil y se come
             ~70-80px que en /agenda hacen falta para que el paso completo entre
             sin scroll. La info que da ("solo dueños y gerentes", "45 min") no
             es esencial para decidir — se pierde en mobile, se mantiene en desktop. */
          .ventas-hero-badge { display: none !important; }
          .ventas-testi-desktop { display: none !important; }
          .ventas-testi-mobile { display: flex !important; }
          .ventas-integraciones { display: none !important; }
          /* Compartido por /ventas, /agenda y /agenda. Un poco más
             generoso que la ronda vacía, sin pasar el techo de ~650px útiles
             de un in-app browser donde viven panel + tarjeta apilados. */
          .ventas-wizard { padding: 12px 14px 10px !important; border-radius: 16px !important; }
          .ventas-wizard-progress { margin-bottom: 5px !important; }
          .ventas-cal-embed { min-height: 560px !important; }
          .ventas-step-title { font-size: 18.5px !important; letter-spacing: -.02em !important; margin-bottom: 5px !important; }
          .ventas-step-header { margin-bottom: 5px !important; }
          .ventas-step-sub { font-size: 12.5px !important; }
          .ventas-step-label { font-size: 10.5px !important; margin-bottom: 4px !important; }
          .ventas-interes-q { font-size: 14.5px !important; margin-bottom: 10px !important; }
          .ventas-interes-stack { gap: 7px !important; }
          .ventas-interes-no { padding: 10px 16px !important; font-size: 14px !important; }
          .ventas-challenge-opt { padding: 10px 12px !important; gap: 10px !important; }
          .ventas-challenge-icon { width: 36px !important; height: 36px !important; font-size: 18px !important; }
          .ventas-challenge-title { font-size: 14px !important; }
          .ventas-challenge-desc { font-size: 12px !important; }
          .ventas-submit-btn { padding: 11px !important; font-size: 14.5px !important; }
          .ventas-field { margin-bottom: 10px !important; }
          .ventas-field-label { margin-bottom: 4px !important; }
          .ventas-volume-num { font-size: 46px !important; }
          .ventas-volume-picker { margin-bottom: 6px !important; }
          .ventas-volume-label { font-size: 12.5px !important; margin-bottom: 4px !important; }
          .ventas-volume-list { gap: 4px !important; }
          .ventas-volume-opt { padding: 7px 11px !important; gap: 8px !important; }
          .ventas-volume-opt-text { font-size: 13px !important; }
          .ventas-form-note { margin-top: 8px !important; font-size: 11px !important; }
          .ventas-back-btn { min-height: 30px !important; margin-bottom: 2px !important; }
          .ventas-showcase-desktop { display: none !important; }
          .ventas-agenda-doctor { display: flex !important; }
        }
        .ventas-showcase-desktop { display: block; }
        .ventas-agenda-doctor { display: none; }
        @media (min-width: 821px) {
          .ventas-hero-parejo { min-height: 100svh; align-items: stretch !important; }
          .ventas-hero-parejo .ventas-hero-grid {
            align-items: stretch !important;
            min-height: calc(100svh - 24px);
          }
          .ventas-hero-parejo .ventas-parejo-col {
            display: flex;
            flex-direction: column;
            min-height: 0;
            height: 100%;
          }
          .ventas-hero-parejo .ventas-hero-badge {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 3;
            margin-bottom: 0 !important;
          }
          .ventas-hero-parejo .ventas-parejo-col { position: relative; }
          .ventas-hero-parejo .ventas-showcase-desktop,
          .ventas-hero-parejo .ventas-testi-desktop {
            padding-top: 0;
          }
          .ventas-hero-parejo .ventas-integraciones { display: none !important; }
          .ventas-hero-parejo .ventas-wizard {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 640px;
            height: 100%;
            box-sizing: border-box;
          }
          .ventas-hero-parejo .ventas-wizard > *:not(.ventas-wizard-progress) {
            flex: 1;
            min-height: 0;
          }
          .ventas-hero-parejo .ventas-showcase-desktop,
          .ventas-hero-parejo .ventas-testi-desktop {
            flex: 1;
            display: flex !important;
            flex-direction: column;
            min-height: 0;
            height: 100%;
          }
          .ventas-hero-parejo .ventas-testi-desktop > div:first-child {
            flex: 1;
            min-height: 0 !important;
            height: auto !important;
          }
        }
      `}</style>
      <ReunionHero
        enableMigrationQualification={enableMigrationQualification}
        scheduler={scheduler}
        sourcePath={sourcePath}
        question1={question1}
        investmentAfterContact={investmentAfterContact}
        meetingMinutes={meetingMinutes}
        showcase={showcase}
        agendaV2={agendaV2}
        tzIp={tzIp}
      />
    </>
  );
}

// ============== HERO ==============
function ReunionHero({
  enableMigrationQualification,
  scheduler,
  sourcePath,
  question1,
  investmentAfterContact,
  meetingMinutes,
  showcase,
  agendaV2,
  tzIp,
}: {
  enableMigrationQualification: boolean;
  scheduler: SchedulerId;
  sourcePath: string;
  question1: Question1;
  investmentAfterContact: boolean;
  meetingMinutes: number;
  showcase: boolean;
  agendaV2: boolean;
  tzIp: string;
}) {
  // Espejo de solo lectura del paso del wizard, para que la columna de
  // argumento cambie con él. El wizard sigue siendo el dueño del estado.
  const [visibleStep, setVisibleStep] = useState(1);
  return (
    <section
      className={
        showcase
          ? agendaV2
            ? "ventas-hero ventas-hero-centrado ventas-hero-parejo"
            : "ventas-hero ventas-hero-centrado"
          : "ventas-hero"
      }
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: agendaV2 ? "stretch" : "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 55% at 50% -5%, #DBEAFE 0%, #E9D5FF 30%, #FBE8F0 55%, #FFFFFF 80%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        className="ventas-hero-grid"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: agendaV2 ? 1280 : 1200,
          margin: "0 auto",
          padding: agendaV2 ? "16px 24px 20px" : "20px 24px 28px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: agendaV2 ? 28 : 40,
          alignItems: showcase && !agendaV2 ? "center" : "stretch",
        }}
      >
        <div className="reveal ventas-parejo-col" style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <span
            className="ventas-hero-badge"
            style={{
              alignSelf: "flex-start",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#0A0A0A",
              background: "#fff",
              border: "1px solid #E5E7EB",
              padding: "6px 12px",
              borderRadius: 999,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              marginBottom: agendaV2 ? 0 : 20,
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                background: GRAD,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
              }}
            >
              ✦
            </span>
            SOLO DUEÑOS Y GERENTES DE CLÍNICAS
            <span style={{ color: "#9CA3AF" }}>·</span>
            <span style={{ color: "#10B981", textTransform: "none", letterSpacing: "0.08em" }}>reunión de {meetingMinutes} min</span>
          </span>

          {/* Pasos 1–3 (necesidad + clínica 1 y 2): producto en movimiento.
              Desde contacto y calendario, cara de un colega. */}
          {showcase && visibleStep <= 3 ? (
            <div className="ventas-showcase-desktop">
              <WizardShowcase step={visibleStep} />
            </div>
          ) : (
          <div className={agendaV2 ? "ventas-showcase-desktop" : undefined}>
          <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
            <TestimonialCarousel />
          </div>

          <div
            className="ventas-integraciones"
            style={{
              marginTop: 20,
              display: "flex",
              alignItems: "stretch",
              borderTop: "1px solid #EEECEA",
              borderBottom: "1px solid #EEECEA",
              padding: "10px 0",
            }}
          >
            <div
              style={{
                flexShrink: 0,
                padding: "4px 14px 4px 0",
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: ".14em",
                color: "#6B7280",
                textTransform: "uppercase",
                lineHeight: 1.3,
                borderRight: "1px solid #EEECEA",
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              Especialidades
            </div>
            <div
              style={{
                flex: 1,
                overflow: "hidden",
                position: "relative",
                WebkitMaskImage: "linear-gradient(to right, transparent, #000 20px, #000 calc(100% - 20px), transparent)",
                maskImage: "linear-gradient(to right, transparent, #000 20px, #000 calc(100% - 20px), transparent)",
              }}
            >
              <div style={{ display: "flex", whiteSpace: "nowrap", animation: "marqueeScroll 22s linear infinite", width: "max-content", paddingLeft: 12 }}>
                {Array(2)
                  .fill(["Médica", "Kinesiológica", "Estética", "Salud mental"])
                  .flat()
                  .map((n, i, arr) => (
                    <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                      <span style={{ padding: "0 18px", fontFamily: "Inter", fontSize: 13, color: "#4B5563", fontWeight: 500 }}>{n}</span>
                      {i < arr.length - 1 && <span style={{ color: "#D1D5DB", fontSize: 10 }}>•</span>}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          </div>
          )}
          {agendaV2 && <AgendaStepDoctor step={visibleStep} />}
        </div>

        <div className="reveal ventas-parejo-col" style={{ display: "flex", minWidth: 0 }}>
          <Wizard
            enableMigrationQualification={enableMigrationQualification}
            scheduler={scheduler}
            sourcePath={sourcePath}
            question1={question1}
            investmentAfterContact={investmentAfterContact}
            meetingMinutes={meetingMinutes}
            showcase={showcase}
            agendaV2={agendaV2}
            tzIp={tzIp}
            onStepChange={setVisibleStep}
          />
        </div>
      </div>
    </section>
  );
}

const AGENDA_DOCTORS = [
  {
    img: "/images/home/flavio.jpeg",
    name: "Dr. Flavio Rojas",
    clinic: "infiltracion.cl · Los Ángeles",
    uses: "Ficha corporal · agente IA de texto · agente IA de voz",
    quote:
      "Clinera Intelligence me permite saber cuánto he vendido y compararlo con el mes anterior para saber cuál es el tratamiento que más se vende.",
    feature: "Clinera Intelligence",
  },
  {
    img: "/images/home/yasna.jpg",
    name: "Dra. Yasna Vásquez",
    clinic: "Estética Facial · Talca",
    uses: "Odontograma · agente IA de texto",
    quote:
      "Con el agente IA de Clinera puedo crecer en mis campañas de marketing en Facebook, Instagram y WhatsApp sin tener que contratar más secretarias.",
    feature: "WhatsApp · Facebook · Instagram",
  },
  {
    img: "/images/home/katherine.png",
    name: "Katherine Meza",
    clinic: "Clínica Estética · Santiago",
    uses: "Ficha facial · agente IA de texto · Clinera Intelligence",
    quote:
      "En mi clínica le damos mucho uso a las distintas fichas clínicas que ofrece Clinera, como la ficha de estética facial, la de estética corporal y odontogramas. Es muy útil.",
    feature: "Fichas clínicas · Odontograma",
  },
] as const;

function AgendaStepDoctor({ step }: { step: number }) {
  const idx = ((Math.max(step, 1) - 1) % AGENDA_DOCTORS.length);
  const s = AGENDA_DOCTORS[idx];
  return (
    <div
      className="ventas-agenda-doctor"
      style={{
        display: "none",
        width: "100%",
        background: "#141c25",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 14,
        padding: 10,
        gap: 12,
        alignItems: "center",
        boxShadow: "0 10px 24px rgba(0,0,0,.18)",
        color: "#fff",
      }}
    >
      <div style={{ flexShrink: 0, width: 72, height: 72, borderRadius: 10, overflow: "hidden", background: "#0A0A0A" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={s.img}
          alt={s.name}
          loading="eager"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontFamily: "Inter", fontSize: 13.5, fontWeight: 700, color: "#fff", letterSpacing: "-.015em" }}>
          {s.name}
        </div>
        <div style={{ fontFamily: "Inter", fontSize: 12, lineHeight: 1.35, color: "rgba(255,255,255,.78)" }}>
          {s.uses}
        </div>
      </div>
    </div>
  );
}

// ============== TESTIMONIAL CAROUSEL ==============
const SLIDES = [
  { img: "/images/home/flavio.jpeg", metric: "−71% en costos de marketing", quote: "Clinera me permite crecer sin pagar de más.", name: "Dr. Flavio Rojas", clinic: "infiltracion.cl" },
  { img: "/images/home/stefani.webp", metric: "+89 pacientes recuperados en marzo", quote: "Clinera es el corazón de mi clínica.", name: "Dra. Stefani Michailiszen", clinic: "Dermaclinic · Las Condes" },
  { img: "/images/home/yasna.jpg", metric: "+29% de citas confirmadas", quote: "Clinera me ayuda a organizar todo.", name: "Dra. Yasna Vásquez", clinic: "Estética Facial · Talca" },
  { img: "/images/home/tamara.jpeg", metric: "Comunicaciones simplificadas", quote: "Clinera nos simplificó las comunicaciones.", name: "Tamara Oyarzún", clinic: "Estética Corporal · Vitacura" },
  { img: "/images/home/katherine.png", metric: "Menos carga operativa", quote: "Clinera me libera de responder mensajes.", name: "Katherine Meza", clinic: "@km_estetica_avanzada" },
];

function TestimonialCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 4600);
    return () => clearInterval(t);
  }, []);
  const s = SLIDES[idx];
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {/* DESKTOP — big hero card */}
      <div className="ventas-testi-desktop" style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            flex: 1,
            minHeight: 560,
            borderRadius: 20,
            overflow: "hidden",
            background: "#141c25",
            border: "1px solid rgba(255,255,255,.08)",
            boxShadow: "0 30px 80px rgba(0,0,0,.4)",
          }}
        >
          <div
            key={idx}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 1,
              transform: "scale(1)",
              transition: "opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1)",
              pointerEvents: "auto",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.img}
              alt={s.name}
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(14,20,26,0) 0%, rgba(14,20,26,.2) 45%, rgba(14,20,26,.95) 88%)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "24px 26px 26px", color: "#fff" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: ".06em",
                  color: "#10B981",
                  background: "rgba(16,185,129,.14)",
                  border: "1px solid rgba(16,185,129,.35)",
                  padding: "5px 10px",
                  borderRadius: 6,
                  marginBottom: 14,
                  textTransform: "uppercase",
                }}
              >
                {s.metric}
              </div>
              <p style={{ fontFamily: "Inter", fontSize: 20, lineHeight: 1.3, fontWeight: 500, margin: "0 0 12px", letterSpacing: "-.015em" }}>&quot;{s.quote}&quot;</p>
              <div style={{ fontFamily: "Inter", fontSize: 14.5, fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "rgba(255,255,255,.55)", marginTop: 2 }}>{s.clinic}</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 16 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={"Testimonio " + (i + 1)}
              style={{
                width: i === idx ? 24 : 8,
                height: 8,
                borderRadius: i === idx ? 4 : 999,
                background: i === idx ? "#0A0A0A" : "rgba(10,10,10,.25)",
                border: 0,
                padding: 0,
                cursor: "pointer",
                transition: "all .3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* MOBILE — compact horizontal strip */}
      <div
        className="ventas-testi-mobile"
        style={{
          display: "none",
          width: "100%",
          background: "#141c25",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 14,
          padding: 10,
          gap: 12,
          alignItems: "center",
          boxShadow: "0 10px 24px rgba(0,0,0,.18)",
          color: "#fff",
        }}
      >
        <div style={{ flexShrink: 0, width: 72, height: 72, borderRadius: 10, overflow: "hidden", background: "#0A0A0A" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.img}
            alt={s.name}
            loading={idx === 0 ? "eager" : "lazy"}
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", transition: "opacity .4s" }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              alignSelf: "flex-start",
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: ".05em",
              color: "#10B981",
              background: "rgba(16,185,129,.14)",
              border: "1px solid rgba(16,185,129,.35)",
              padding: "3px 7px",
              borderRadius: 5,
              textTransform: "uppercase",
              lineHeight: 1.2,
              maxWidth: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {s.metric}
          </div>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 13,
              lineHeight: 1.35,
              fontWeight: 500,
              margin: 0,
              letterSpacing: "-.01em",
              color: "#fff",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            &quot;{s.quote}&quot;
          </p>
          <div style={{ fontFamily: "Inter", fontSize: 11.5, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {s.name}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============== WIZARD ==============
function Wizard({
  enableMigrationQualification,
  scheduler,
  sourcePath,
  question1,
  investmentAfterContact,
  meetingMinutes,
  showcase = false,
  agendaV2 = false,
  tzIp = "",
  onStepChange,
}: {
  enableMigrationQualification: boolean;
  scheduler: SchedulerId;
  sourcePath: string;
  question1: Question1;
  investmentAfterContact: boolean;
  meetingMinutes: number;
  /** Con showcase, el precio y el descarte viven junto al paso 3 (ver WizardShowcase). */
  showcase?: boolean;
  agendaV2?: boolean;
  tzIp?: string;
  onStepChange?: (step: number) => void;
}) {
  const [step, setStep] = useState(1);
  const [software, setSoftware] = useState<Step1Id | null>(null);
  const [features, setFeatures] = useState<FeatureId[]>([]);
  const [size, setSize] = useState<SizeAnswers>({ profile: null });
  const [qualification, setQualification] = useState<Qualification | null>(null);
  const [form, setForm] = useState<Form>({
    nombre: "",
    clinica: "",
    tipoClinica: "",
    prefix: "+56",
    phone: "",
    email: "",
    website: "",
    city: "",
    cargo: "",
  });
  const [leadCtx, setLeadCtx] = useState<{ eventId: string; leadSource: string } | null>(null);
  const [booking, setBooking] = useState<CalBooking | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [declined, setDeclined] = useState(false);
  // El paso de software (paso 1) queda gateado por la misma prop de antes; ambas
  // páginas (/ventas y /agenda) lo activan → flujo de 4 pasos.
  const hasSoftwareStep = enableMigrationQualification;
  const totalSteps = hasSoftwareStep ? (agendaV2 ? 5 : 4) : 3;
  const softwareStep = 1;
  const sizeStep = hasSoftwareStep ? 2 : 1;
  const clinicDetailsStep = agendaV2 && hasSoftwareStep ? 3 : -1;
  const contactStep = hasSoftwareStep ? (agendaV2 ? 4 : 3) : 2;
  const calStep = hasSoftwareStep ? (agendaV2 ? 5 : 4) : 3;

  // El paso se avisa hacia arriba en un efecto y no en cada setStep: así ninguna
  // de las transiciones existentes cambia, y la columna de argumento sigue al
  // wizard aunque se vuelva atrás.
  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  // Aceptación / descarte de la inversión. Vive acá porque el aviso de precio
  // se muestra en el paso 1, el 2 o el 4 según la variante, y todos deben
  // registrar exactamente lo mismo.
  //
  // `interes_confirmado` se emite UNA vez por sesión de wizard. Sin el guardia
  // se contaba de más en dos caminos: volver del paso 3 al 2 y pulsar
  // "Continuar" otra vez, y —con question1="interest"— el sí del paso 1 más el
  // submit del paso 2, que también lo emite.
  const interesSiEmitido = useRef(false);
  const handleInteres = (v: "si" | "no") => {
    if (v === "no") {
      pushDL("no_interesa", {
        software_actual: software ?? "",
        software_actual_label: software ? STEP1_LABELS[software] : "",
      });
      setDeclined(true);
    } else if (!interesSiEmitido.current) {
      interesSiEmitido.current = true;
      pushDL("interes_confirmado", { software_actual: software ?? "" });
    }
  };

  return (
    <div
      className="ventas-wizard"
      style={{
        width: "100%",
        background: "#fff",
        border: "1px solid #EEECEA",
        borderRadius: 20,
        padding: "32px 32px 28px",
        boxShadow: "0 30px 80px rgba(15,10,30,.10), 0 8px 20px rgba(0,0,0,.04)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="ventas-wizard-progress" style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
          <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= n ? "#0A0A0A" : "#EEECEA", transition: "background .4s ease" }} />
        ))}
      </div>

      {!submitted && !declined && hasSoftwareStep && step === softwareStep && (
        question1 === "interest" ? (
          <StepInteres
            label={`Paso ${softwareStep} de ${totalSteps}`}
            onSi={() => {
              // El "sí" queda registrado como la respuesta del paso 1, así el
              // webhook sigue recibiendo las mismas claves con un valor real.
              setSoftware(INTEREST_ID);
              pushDL("paso_1_completado", {
                software_actual: INTEREST_ID,
                software_actual_label: INTEREST_LABEL,
              });
              handleInteres("si");
              setStep(sizeStep);
            }}
            onNo={() => handleInteres("no")}
          />
        ) : question1 === "features" ? (
          <StepFeatures
            features={features}
            setFeatures={setFeatures}
            label={`Paso ${softwareStep} de ${totalSteps}`}
            onNext={() => {
              const first = features[0] ?? null;
              setSoftware(first);
              pushDL("paso_1_completado", {
                software_actual: first ?? "",
                software_actual_label: first ? FEATURE_LABELS[first] : "",
                ...step1Fields(first, features),
              });
              setStep(sizeStep);
            }}
          />
        ) : (
          <StepSoftware
            question1={question1}
            software={software}
            setSoftware={setSoftware}
            label={`Paso ${softwareStep} de ${totalSteps}`}
            onNext={() => {
              pushDL("paso_1_completado", {
                software_actual: software ?? "",
                software_actual_label: software ? STEP1_LABELS[software] : "",
              });
              setStep(sizeStep);
            }}
          />
        )
      )}
      {!submitted && !declined && step === sizeStep && (
        <StepSize
          showInvestment={!investmentAfterContact && !showcase}
          size={size}
          setSize={setSize}
          agendaV2={agendaV2}
          onInteres={handleInteres}
          label={`Paso ${sizeStep} de ${totalSteps}`}
          onBack={hasSoftwareStep ? () => setStep(softwareStep) : undefined}
          onNext={() => {
            if (agendaV2) {
              setStep(clinicDetailsStep);
              return;
            }
            // Toda clínica que completa el filtro califica (el precio de entrada
            // auto-selecciona). No hay rama de lista de espera.
            const qual = evaluateQualification(size);
            setQualification(qual);
            const attrs = sizeAttributes(software, size, qual, features);
            pushDL("paso_2_completado", attrs);
            pushDL("calificado", attrs);
            if (typeof window !== "undefined" && typeof window.fbq === "function") {
              window.fbq("track", "ViewContent", { content_name: "Clinera Ventas", ...attrs });
            }
            const eventId = leadCtx?.eventId ?? newLeadEventId();
            if (!leadCtx) setLeadCtx({ eventId, leadSource: detectLeadSource() });
            void submitSizeLead({ software, size, qual, eventId, sourcePath, features, form });
            if (MQL_TRIGGER === "qualified_step2") {
              void fireMqlEvent({
                eventId,
                qual,
                customData: qualCustomData(software, size, qual, ""),
              });
            }
            setStep(contactStep);
          }}
        />
      )}
      {!submitted && !declined && agendaV2 && step === clinicDetailsStep && (
        <StepClinicDetails
          form={form}
          setForm={setForm}
          label={`Paso ${clinicDetailsStep} de ${totalSteps}`}
          onBack={() => setStep(sizeStep)}
          onNext={() => {
            const qual = evaluateQualification(size);
            setQualification(qual);
            const attrs = sizeAttributes(software, size, qual, features);
            pushDL("paso_2_completado", attrs);
            pushDL("calificado", attrs);
            if (typeof window !== "undefined" && typeof window.fbq === "function") {
              window.fbq("track", "ViewContent", { content_name: "Clinera Ventas", ...attrs });
            }
            const eventId = leadCtx?.eventId ?? newLeadEventId();
            if (!leadCtx) setLeadCtx({ eventId, leadSource: detectLeadSource() });
            void submitSizeLead({ software, size, qual, eventId, sourcePath, features, form });
            if (MQL_TRIGGER === "qualified_step2") {
              void fireMqlEvent({
                eventId,
                qual,
                customData: qualCustomData(software, size, qual, ""),
              });
            }
            setStep(contactStep);
          }}
        />
      )}
      {!submitted && !declined && step === contactStep && (
        <StepContact
          meetingMinutes={meetingMinutes}
          form={form}
          setForm={setForm}
          agendaV2={agendaV2}
          label={`Paso ${contactStep} de ${totalSteps}`}
          onInteres={showcase ? handleInteres : undefined}
          onBack={() => setStep(agendaV2 ? clinicDetailsStep : sizeStep)}
          onNext={() => {
            if (typeof window !== "undefined" && typeof window.fbq === "function") {
              window.fbq("track", "InitiateCheckout", { content_name: "Clinera Ventas" });
            }
            pushDL("lead_completo", sizeAttributes(software, size, qualification, features));
            // Enviar el lead completo en background — sin bloquear el avance al embed.
            // Reutiliza el event_id del lead parcial (paso 2) para que n8n haga upsert.
            submitContactLead({ form, software, size, qual: qualification, leadCtx, sourcePath, features }).then((ctx) => {
              if (ctx) setLeadCtx(ctx);
              // MQL (default): SOLO con submit OK del backend y lead CALIFICADO.
              // Idempotente por sesión → recarga/doble-click/atrás no lo redisparan.
              // fireMqlEvent consume qual.califica (fuente de verdad); si no califica,
              // no se dispara jamás.
              if (ctx?.ok && MQL_TRIGGER === "contact_submitted") {
                const digits = form.phone.replace(/\D/g, "");
                void fireMqlEvent({
                  eventId: ctx.eventId,
                  qual: {
                    califica: qualification?.califica ?? false,
                    prioridadAlta: qualification?.prioridadAlta ?? false,
                  },
                  customData: qualCustomData(
                    software,
                    size,
                    qualification,
                    PHONE_RULES[form.prefix]?.name ?? "",
                  ),
                  contact: { email: form.email, phoneE164: form.prefix + digits },
                });
              }
            });
            setStep(calStep);
          }}
        />
      )}
      {!submitted && !declined && step === calStep && scheduler === "cal" && (
        <StepCalCom
          form={form}
          software={software}
          size={size}
          label={`Paso ${calStep} de ${totalSteps}`}
          onBack={() => setStep(contactStep)}
          onBooked={async (calBooking) => {
            setBooking(calBooking);
            setSubmitted(true);
            void submitBookingConfirmation({ form, software, size, qual: qualification, leadCtx, booking: calBooking, sourcePath });
          }}
        />
      )}
      {!submitted && !declined && step === calStep && scheduler === "clinera" && (
        <StepClineraScheduler
          form={form}
          tzIp={tzIp}
          showInvestment={investmentAfterContact && !showcase}
          onInteres={handleInteres}
          label={`Paso ${calStep} de ${totalSteps}`}
          onBack={() => setStep(contactStep)}
          onBooked={async (clineraBooking, via, confirmEventId) => {
            // Nativo: trae fecha/hora/profesional reales. Embed: viene {} y los
            // campos cal_* viajan en null. `via` distingue el agendador en n8n.
            setBooking(clineraBooking);
            setSubmitted(true);
            void submitBookingConfirmation({
              form,
              software,
              size,
              qual: qualification,
              leadCtx,
              booking: clineraBooking,
              sourcePath,
              via,
              confirmEventId,
            });
          }}
        />
      )}
      {!submitted && declined && (
        <StepDeclined
          onBack={() => setDeclined(false)}
        />
      )}
      {submitted && <StepSuccess form={form} software={software} size={size} booking={booking} sourcePath={sourcePath} tzIp={tzIp} />}
    </div>
  );
}

// ============== SUBMIT + META DEDUP ==============
// El lead se captura en ETAPAS, todas contra el mismo webhook n8n:
// 1) submitSizeLead     — apenas se completa el paso 2 (tamaño). Deja el lead
//                         capturado aunque abandone antes de dar sus datos.
// 2) submitContactLead  — al enviar el paso 3 (contacto). Reutiliza el event_id del
//                         paso 2 para que n8n haga upsert del mismo lead.
// 3) submitBookingConfirmation — cuando Cal.com dispara `bookingSuccessful`.

export type CalBooking = {
  booking?: { uid?: string; eventTypeId?: number; startTime?: string; endTime?: string };
  eventType?: { title?: string; slug?: string; length?: number };
  date?: string;
  duration?: number;
  organizer?: { name?: string; email?: string; timeZone?: string };
  confirmed?: boolean;
};

// Señales de Meta (fbp/fbc) desde cookies + fbclid de la URL.
function getMetaSignals() {
  const fbp = getCookie("_fbp");
  let fbc = getCookie("_fbc");
  if (!fbc && typeof window !== "undefined") {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  }
  return { fbp, fbc };
}

// Devuelve true si el backend respondió OK. El MQL (contact_submitted) se gatea
// con este resultado: "submit exitoso, respuesta OK del backend".
async function postWebhook(payload: Record<string, unknown>, errLabel: string): Promise<boolean> {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    return res.ok;
  } catch (e) {
    console.error(`${errLabel} webhook failed`, e);
    return false;
  }
}

// (1) Lead parcial de TAMAÑO — se dispara apenas se completa el paso 2 si CALIFICA.
// Aún no hay datos de contacto: guarda software + tamaño + calificación para que el
// lead quede capturado incluso si el usuario abandona antes del paso 3.
export async function submitSizeLead({
  software,
  size,
  qual,
  eventId,
  sourcePath = "/ventas",
  features = [],
  form,
  plan,
}: {
  software: Step1Id | null;
  size: SizeAnswers;
  qual: Qualification;
  eventId?: string;
  sourcePath?: string;
  features?: FeatureId[];
  form?: Form;
  plan?: string;
}): Promise<{ eventId: string; leadSource: string } | null> {
  if (!qual.califica) return null;

  const resolvedEventId = eventId ?? newLeadEventId();
  const leadSource = detectLeadSource();
  const { fbp, fbc } = getMetaSignals();

  pushDL("ventas_size_lead", {
    lead_source: leadSource,
    event_id: resolvedEventId,
    booking_status: "pending",
    ...sizeAttributes(software, size, qual, features),
  });

  const payload = {
    event_id: resolvedEventId,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: typeof window !== "undefined" ? window.location.href : "",
    action_source: "website",
    fbp,
    fbc,
    ...getClineraMetaIds(),
    client_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",

    lead_stage: "size_captured",
    lead_status: "qualified",
    booking_status: "pending",
    lead_source: leadSource,
    ...getAttributionPayload(),
    ...sizeAttributes(software, size, qual, features),
    ...backCompatFields(software, size, qual),
    ...(form ? clinicCrmFields(form) : {}),
    ...(plan ? { plan, plan_interes: plan } : {}),
    fuente: `Landing ${sourcePath} — Clinera (tamaño)`,
    landing_url: typeof window !== "undefined" ? location.href : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
    created_at: new Date().toISOString(),
    timestamp: Date.now(),
  };

  await postWebhook(payload, "Size lead");
  return { eventId: resolvedEventId, leadSource };
}

// (2) Lead COMPLETO de contacto — se dispara al enviar el paso 3. Reutiliza el
// event_id del lead de tamaño (paso 2) para que n8n upsertee el mismo lead.
export async function submitContactLead({
  form,
  software,
  size,
  qual,
  leadCtx,
  sourcePath = "/ventas",
  features = [],
  plan,
}: {
  form: Form;
  software: Step1Id | null;
  size: SizeAnswers;
  qual: Qualification | null;
  leadCtx: { eventId: string; leadSource: string } | null;
  sourcePath?: string;
  features?: FeatureId[];
  plan?: string;
}): Promise<{ eventId: string; leadSource: string; ok: boolean } | null> {
  const eventId = leadCtx?.eventId ?? newLeadEventId();
  const leadSource = leadCtx?.leadSource ?? detectLeadSource();
  const { fbp, fbc } = getMetaSignals();

  const rule = PHONE_RULES[form.prefix];
  const digits = form.phone.replace(/\D/g, "");

  // El evento MQL de Meta (Pixel + CAPI) ya NO se dispara aquí: lo maneja
  // src/lib/metaEvents.ts (fireMqlEvent) tras confirmar el OK del backend, con
  // dedup por event_id, user_data hasheado e idempotencia por sesión.

  pushDL("ventas_submit_lead", {
    lead_source: leadSource,
    event_id: eventId,
    booking_status: "pending",
    ...sizeAttributes(software, size, qual, features),
  });

  const payload = {
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: typeof window !== "undefined" ? window.location.href : "",
    action_source: "website",
    fbp,
    fbc,
    ...getClineraMetaIds(),
    client_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",

    lead_stage: "contact",
    lead_status: "qualified",
    booking_status: "pending",
    lead_source: leadSource,
    ...getAttributionPayload(),
    ...sizeAttributes(software, size, qual, features),
    ...backCompatFields(software, size, qual),
    nombre: form.nombre.trim(),
    ...clinicCrmFields(form),
    celular: (form.prefix + digits).trim(),
    celular_prefix: form.prefix,
    celular_digits: digits,
    celular_pais: rule?.name,
    email: form.email.trim(),
    ...(plan ? { plan, plan_interes: plan } : {}),
    fuente: `Landing ${sourcePath} — Clinera`,
    landing_url: typeof window !== "undefined" ? location.href : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
    created_at: new Date().toISOString(),
    timestamp: Date.now(),
  };

  const ok = await postWebhook(payload, "Contact lead");
  return { eventId, leadSource, ok };
}

// (4) Confirmación de reserva — cuando Cal.com dispara `bookingSuccessful`.
export async function submitBookingConfirmation({
  form,
  software,
  size,
  qual,
  leadCtx,
  booking,
  sourcePath = "/ventas",
  via = "Cal.com confirm",
  confirmEventId: confirmEventIdProp,
  leadgenId = "",
}: {
  form: Form;
  software: Step1Id | null;
  size: SizeAnswers;
  qual: Qualification | null;
  leadCtx: { eventId: string; leadSource: string } | null;
  booking: CalBooking;
  sourcePath?: string;
  /** Agendador que confirmó la reserva — distingue Cal.com del embed de Clinera en n8n. */
  via?: string;
  /**
   * event_id ya enviado al webhook del turno (flujo nativo). Reutilizarlo hace
   * que el Schedule del Pixel y el de CAPI se dedupliquen en Meta.
   */
  confirmEventId?: string;
  /**
   * `leadgen_id` del Instant Form de Meta, cuando el lead llegó por ahí
   * (`/reserva-tu-hora`). Viaja hasta el campo `leadgenId` del negocio en
   * Twenty, que es lo que después permite mandar `lead_id` en los eventos
   * SQL/SQL+ y usar «maximizar clientes cualificados» en Meta Ads. Vacío en
   * el wizard: ese lead no nació de un formulario nativo.
   */
  leadgenId?: string;
}) {
  const confirmEventId =
    confirmEventIdProp ??
    "ventas_confirm_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);

  // Disparar Schedule pixel — funnel step posterior al Lead.
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(
      "track",
      "Schedule",
      {
        content_name: "Clinera Ventas",
        content_category: "booking",
        lead_source: leadCtx?.leadSource,
        cal_booking_uid: booking?.booking?.uid,
        ...sizeAttributes(software, size, qual),
      },
      { eventID: confirmEventId },
    );
  }

  // MQL: la reunión agendada ES el MQL (MQL_TRIGGER = "booking_confirmed").
  // Se dispara acá y no en el paso 3, para que un lead cuente UNA sola vez.
  // fireMqlEvent es idempotente por sesión y sólo dispara si el lead califica.
  // En /agenda, n8n manda además el MQL por CAPI con este mismo event_id:
  // Meta deduplica por (event_name, event_id), así que sigue siendo uno.
  if (MQL_TRIGGER === "booking_confirmed" && qual?.califica) {
    void fireMqlEvent({
      eventId: confirmEventId,
      qual: { califica: qual.califica, prioridadAlta: qual.prioridadAlta },
      customData: qualCustomData(software, size, qual, PHONE_RULES[form.prefix]?.name ?? ""),
      contact: {
        email: form.email,
        phoneE164: form.prefix + form.phone.replace(/\D/g, ""),
      },
    });
  }

  pushDL("ventas_booking_confirmed", {
    lead_event_id: leadCtx?.eventId,
    cal_booking_uid: booking?.booking?.uid,
    cal_date: booking?.date,
    ...sizeAttributes(software, size, qual),
  });

  const rule = PHONE_RULES[form.prefix];
  const digits = form.phone.replace(/\D/g, "");

  const payload = {
    event_id: confirmEventId,
    parent_event_id: leadCtx?.eventId ?? null,
    event_time: Math.floor(Date.now() / 1000),
    booking_status: "confirmed",
    lead_stage: "booking_confirmed",
    lead_status: "qualified",

    // Atribución de Google Ads (gclid/gbraid/wbraid) para offline conversions
    ...getAttributionPayload(),
    // Identificadores de Meta para CAPI (meta_fbc / meta_fbp / fbclid)
    ...getClineraMetaIds(),

    // Datos del calendario (Cal.com)
    cal_booking_uid: booking?.booking?.uid ?? null,
    cal_event_type_id: booking?.booking?.eventTypeId ?? null,
    cal_event_type_title: booking?.eventType?.title ?? null,
    cal_event_type_slug: booking?.eventType?.slug ?? null,
    cal_date: booking?.date ?? null,
    cal_start_time: booking?.booking?.startTime ?? null,
    cal_end_time: booking?.booking?.endTime ?? null,
    cal_duration: booking?.duration ?? null,
    cal_organizer_name: booking?.organizer?.name ?? null,
    cal_organizer_email: booking?.organizer?.email ?? null,
    cal_organizer_timezone: booking?.organizer?.timeZone ?? null,
    cal_confirmed: booking?.confirmed ?? null,

    // Datos del contacto (re-incluidos para que el segundo evento sea autosuficiente)
    lead_source: leadCtx?.leadSource ?? detectLeadSource(),
    ...sizeAttributes(software, size, qual),
    ...backCompatFields(software, size, qual),
    nombre: form.nombre.trim(),
    nombre_clinica: form.clinica.trim(),
    tipo_clinica: form.tipoClinica || "",
    tipo_clinica_label: form.tipoClinica ? CLINIC_TYPE_LABELS[form.tipoClinica] : "",
    celular: (form.prefix + digits).trim(),
    celular_prefix: form.prefix,
    celular_digits: digits,
    celular_pais: rule?.name,
    email: form.email.trim(),
    leadgen_id: leadgenId.trim(),
    fuente: `Landing ${sourcePath} — Clinera (${via})`,
    landing_url: typeof window !== "undefined" ? location.href : "",
    created_at: new Date().toISOString(),
    timestamp: Date.now(),
  };

  await postWebhook(payload, "Booking confirmation");
}

// ============== STEP 1 — SOFTWARE ACTUAL ==============
function StepSoftware({
  question1 = "software",
  software,
  setSoftware,
  label,
  onNext,
}: {
  question1?: Question1;
  software: Step1Id | null;
  setSoftware: (id: Step1Id) => void;
  label: string;
  onNext: () => void;
}) {
  const esNecesidad = question1 === "need";
  const opciones: { id: Step1Id; label: string }[] = esNecesidad
    ? NEED_OPTIONS
    : SOFTWARE_OPTIONS;
  // Elegir la opción avanza solo: el paso no tiene nada más que responder y
  // un "Continuar" ahí es un tap de más. El respiro alcanza para ver el check.
  const advanceRef = useRef<number | null>(null);
  useEffect(() => () => {
    if (advanceRef.current !== null) window.clearTimeout(advanceRef.current);
  }, []);
  const pick = (id: Step1Id) => {
    setSoftware(id);
    if (advanceRef.current !== null) window.clearTimeout(advanceRef.current);
    advanceRef.current = window.setTimeout(onNext, 320);
  };
  return (
    <div>
      <StepHeader
        label={label}
        title={
          esNecesidad ? (
            <>
              ¿Cuál es tu principal{" "}
              <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                necesidad
              </em>
              ?
            </>
          ) : (
            <>
              ¿Qué{" "}
              <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                software
              </em>{" "}
              usan hoy en tu clínica?
            </>
          )
        }
        sub="Reunión exclusiva para dueños, gerentes y directores médicos de clínicas."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {opciones.map((opt) => {
          const sel = software === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => pick(opt.id)}
              className="ventas-challenge-opt"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                border: "1.5px solid " + (sel ? "#0A0A0A" : "#E7EBF0"),
                borderRadius: 14,
                cursor: "pointer",
                background: sel ? "#FAFBFD" : "#fff",
                textAlign: "left",
                fontFamily: "Inter",
                color: "#0A0A0A",
                width: "100%",
                overflow: "hidden",
                transition: "all .2s",
              }}
            >
              {sel && <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: GRAD }} />}
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="ventas-challenge-title" style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-.012em" }}>{opt.label}</span>
              </span>
              <span
                style={{
                  flexShrink: 0,
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  border: "1.5px solid " + (sel ? "#0A0A0A" : "#D1D5DB"),
                  background: sel ? "#0A0A0A" : "#fff",
                  position: "relative",
                  transition: "all .2s",
                }}
              >
                {sel && (
                  <span
                    style={{
                      position: "absolute",
                      left: 7,
                      top: 3,
                      width: 5,
                      height: 10,
                      border: "solid #fff",
                      borderWidth: "0 2px 2px 0",
                      transform: "rotate(45deg)",
                    }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}

// ============== STEP 1 (agenda v2) — NECESIDADES DE PRODUCTO ==============
function StepFeatures({
  features,
  setFeatures,
  label,
  onNext,
}: {
  features: FeatureId[];
  setFeatures: (ids: FeatureId[]) => void;
  label: string;
  onNext: () => void;
}) {
  const [attempted, setAttempted] = useState(false);
  const toggle = (id: FeatureId) => {
    setFeatures(features.includes(id) ? features.filter((f) => f !== id) : [...features, id]);
  };
  return (
    <div>
      <StepHeader
        label={label}
        title={
          <>
            Hablemos de tus{" "}
            <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              necesidades
            </em>
          </>
        }
        sub="Selecciona todo lo que te interesa. Puedes elegir varias."
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        {FEATURE_OPTIONS.map((opt) => {
          const sel = features.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={sel}
              onClick={() => toggle(opt.id)}
              className="ventas-challenge-opt"
              style={{
                padding: "10px 14px",
                border: "1.5px solid " + (sel ? "#0A0A0A" : "#E7EBF0"),
                borderRadius: 999,
                cursor: "pointer",
                background: sel ? "#0A0A0A" : "#fff",
                color: sel ? "#fff" : "#0A0A0A",
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: "-.01em",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {attempted && features.length === 0 && (
        <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "#E74C3C", fontWeight: 600, margin: "8px 0" }}>
          Elige al menos una necesidad.
        </div>
      )}
      <SubmitBtn
        enabled={features.length > 0}
        onClick={() => {
          if (features.length === 0) {
            setAttempted(true);
            return;
          }
          onNext();
        }}
      >
        Siguiente
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </SubmitBtn>
    </div>
  );
}

// ============== STEP 1 (alt) — ¿TE INTERESA IMPLEMENTARLO? ==============
// Un solo tap: Sí avanza, No cierra con StepDeclined. El "No" es un botón real y
// no un enlace discreto porque acá la pregunta ES el filtro; en los otros pasos
// el descarte compite con el CTA y por eso va abajo y en gris.
function StepInteres({
  label,
  onSi,
  onNo,
}: {
  label: string;
  onSi: () => void;
  onNo: () => void;
}) {
  return (
    <div>
      <StepHeader
        label={label}
        title={
          <>
            Clinera ordena tu clínica bajo un mismo{" "}
            <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              sistema operativo con IA
            </em>
            .
          </>
        }
        sub="Agendas, fichas, sedes, tratamientos, comunicaciones y profesionales, en un solo lugar."
      />

      <p
        className="ventas-interes-q"
        style={{
          fontFamily: "Inter",
          fontSize: 16.5,
          fontWeight: 700,
          letterSpacing: "-.018em",
          color: "#0A0A0A",
          margin: "0 0 14px",
        }}
      >
        ¿Te interesa implementarlo?
      </p>

      <div className="ventas-interes-stack" style={{ display: "grid", gap: 10 }}>
        <button
          type="button"
          onClick={onSi}
          className="ventas-submit-btn"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            padding: "14px 20px",
            border: 0,
            borderRadius: 14,
            background: "#0A0A0A",
            color: "#fff",
            fontFamily: "Inter",
            fontSize: 15.5,
            fontWeight: 700,
            letterSpacing: "-.012em",
            cursor: "pointer",
          }}
        >
          Sí, me interesa
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onNo}
          className="ventas-interes-no"
          style={{
            width: "100%",
            padding: "13px 20px",
            border: "1.5px solid #E7EBF0",
            borderRadius: 14,
            background: "#fff",
            color: "#4B5563",
            fontFamily: "Inter",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-.01em",
            cursor: "pointer",
          }}
        >
          No por ahora
        </button>
      </div>

      <FormNote>Reunión exclusiva para dueños, gerentes y directores médicos.</FormNote>
    </div>
  );
}

// ============== STEP 2 — TAMAÑO DE OPERACIÓN ==============
// Lista vertical (no chips): las etiquetas son largas y en móvil los chips
// obligaban a truncar o a scroll horizontal.
function ProfilePicker({
  selected,
  onSelect,
}: {
  selected: OperationalProfile | null;
  onSelect: (p: OperationalProfile) => void;
}) {
  return (
    <div className="ventas-volume-picker" style={{ marginBottom: 16 }}>
      <div
        className="ventas-volume-label"
        style={{
          fontFamily: "Inter",
          fontWeight: 600,
          fontSize: 13.5,
          letterSpacing: "-.01em",
          color: "#374151",
          marginBottom: 9,
        }}
      >
        ¿De qué tamaño es tu operación mensual?
      </div>
      <div role="radiogroup" aria-label="Tamaño de operación" className="ventas-volume-list" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {OPERATIONAL_PROFILES.map((opt) => {
          const sel = selected?.id === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={sel}
              onClick={() => onSelect(opt)}
              className="ventas-volume-opt"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                textAlign: "left",
                padding: "13px 15px",
                border: "1.5px solid " + (sel ? "#0A0A0A" : "#E7EBF0"),
                borderRadius: 12,
                background: sel ? "#FAFBFD" : "#fff",
                cursor: "pointer",
                fontFamily: "Inter",
                fontWeight: sel ? 700 : 500,
                fontSize: 14.5,
                letterSpacing: "-.01em",
                color: sel ? "#0A0A0A" : "#4B5563",
                transition: "all .2s",
              }}
            >
              <span
                aria-hidden
                style={{
                  flexShrink: 0,
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  border: "1.5px solid " + (sel ? "#0A0A0A" : "#D1D5DB"),
                  background: sel ? "#0A0A0A" : "#fff",
                  position: "relative",
                }}
              >
                {sel && (
                  <span
                    style={{
                      position: "absolute",
                      left: 5.5,
                      top: 2,
                      width: 4,
                      height: 8,
                      border: "solid #fff",
                      borderWidth: "0 2px 2px 0",
                      transform: "rotate(45deg)",
                    }}
                  />
                )}
              </span>
              <span className="ventas-volume-opt-text" style={{ flex: 1, minWidth: 0 }}>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepSize({
  size,
  setSize,
  onInteres,
  label,
  onBack,
  onNext,
  showInvestment = true,
  agendaV2 = false,
}: {
  size: SizeAnswers;
  setSize: (s: SizeAnswers) => void;
  onInteres: (v: "si" | "no") => void;
  label: string;
  onBack?: () => void;
  onNext: () => void;
  /** Con false, el precio y el descarte se muestran recién en el paso 4. */
  showInvestment?: boolean;
  agendaV2?: boolean;
}) {
  const complete = sizeComplete(size);

  const advanceRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (advanceRef.current !== null) window.clearTimeout(advanceRef.current);
    };
  }, []);
  const selectProfile = (profile: OperationalProfile) => {
    setSize({ profile });
    if (showInvestment) return;
    if (advanceRef.current !== null) window.clearTimeout(advanceRef.current);
    advanceRef.current = window.setTimeout(() => {
      onInteres("si");
      onNext();
    }, 320);
  };

  return (
    <div>
      {onBack && <BackBtn onClick={onBack} />}
      <StepHeader
        label={label}
        title={
          showInvestment ? (
            <>
              Así funciona la{" "}
              <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                inversión
              </em>
              .
            </>
          ) : agendaV2 ? (
            <>
              ¿Cuántos pacientes al{" "}
              <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                mes
              </em>
              ?
            </>
          ) : (
            <>
              ¿Qué{" "}
              <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                volumen
              </em>{" "}
              maneja tu clínica?
            </>
          )
        }
        sub={
          showInvestment
            ? "Para que no haya sorpresas en la reunión."
            : agendaV2
              ? (
                <span style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
                  Clinera atiende pacientes con IA por WhatsApp, Facebook, Instagram y llamada telefónica.
                  <ChannelLogos />
                </span>
              )
              : "Para preparar la reunión con datos de tu operación."
        }
      />

      {/* Gate de precio — muestra solo el valor mensual de entrada para no
          convertir la implementación en un filtro antes de la reunión.
          Con showInvestment=false se muestra recién en el paso 4. */}
      {showInvestment && (
      <div
        style={{
          background: "linear-gradient(135deg,#F4F8FF 0%,#FAF5FF 100%)",
          border: "1px solid rgba(124,58,237,.16)",
          borderRadius: 14,
          padding: "16px 18px",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1.5px solid rgba(124,58,237,.30)",
            borderRadius: 12,
            padding: "14px 16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "#7C3AED", marginBottom: 7 }}>
            Planes desde
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 800, letterSpacing: "-.03em", color: "#0A0A0A", lineHeight: 1.15 }}>
            USD 279 mensuales
          </div>
        </div>
      </div>
      )}

      <ProfilePicker
        selected={size.profile}
        onSelect={selectProfile}
      />

      {/* Sólo la variante con precio necesita un CTA propio: ahí el click ES la
          aceptación de la inversión, distinta de simplemente elegir un perfil.
          Sin precio, selectProfile ya avanza sola — un botón acá sería
          redundante y, con el timeout de 320ms, alcanzaría a mostrarse
          habilitado por un instante antes de que la pantalla cambie sola. */}
      {showInvestment && (
      <SubmitBtn
        enabled={complete}
        onClick={() => {
          if (!complete) return;
          // El CTA principal es la aceptación explícita: mantiene interes_confirmado
          // para los dashboards y automatizaciones que ya lo consumen.
          onInteres("si");
          onNext();
        }}
      >
        Continuar con esta inversión
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </SubmitBtn>
      )}

      {/* Abandono explícito para analytics: enlace discreto, nunca compite con el
          CTA. Va junto al precio: sin precio a la vista no hay nada que declinar. */}
      {showInvestment && (
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <button
          type="button"
          onClick={() => onInteres("no")}
          style={{
            background: "transparent",
            border: 0,
            padding: "4px 6px",
            fontFamily: "Inter",
            fontSize: 13,
            color: "#9CA3AF",
            textDecoration: "underline",
            textUnderlineOffset: 3,
            cursor: "pointer",
          }}
        >
          No es para mí
        </button>
      </div>
      )}
    </div>
  );
}

function StepClinicDetails({
  form,
  setForm,
  label,
  onBack,
  onNext,
}: {
  form: Form;
  setForm: (f: Form) => void;
  label: string;
  onBack: () => void;
  onNext: () => void;
}) {
  const [attempted, setAttempted] = useState(false);
  const clinicOk = form.clinica.trim().length >= 2;
  const webOk = isValidWebsite(form.website);
  const typeOk = form.tipoClinica !== "";
  const complete = clinicOk && webOk && typeOk;

  return (
    <div>
      <BackBtn onClick={onBack} />
      <StepHeader
        label={label}
        title={
          <>
            Hablemos más de tu{" "}
            <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              clínica
            </em>
          </>
        }
        sub="Nombre, web o redes y tipo de clínica — para preparar la reunión."
      />
      <Field label="Nombre de la clínica" required error={attempted && !clinicOk ? "Ingresa el nombre de tu clínica." : undefined}>
        <Input value={form.clinica} onChange={(e) => setForm({ ...form, clinica: e.target.value })} placeholder="Ej: Clínica Sonríe" autoComplete="organization" error={attempted && !clinicOk} />
      </Field>
      <Field label="Sitio web o redes sociales" required error={attempted && !webOk ? "Ingresa un sitio o red social." : undefined}>
        <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="www.tuclinica.cl o @tuclinica" inputMode="url" autoComplete="url" error={attempted && !webOk} />
      </Field>
      <Field label="Tipo de clínica" required error={attempted && !typeOk ? "Selecciona el tipo de clínica." : undefined}>
        <select
          value={form.tipoClinica}
          onChange={(e) => setForm({ ...form, tipoClinica: e.target.value as ClinicType | "" })}
          style={{
            ...baseInputStyle({ error: attempted && !typeOk }),
            width: "100%",
            appearance: "none" as const,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right .8rem center",
            backgroundSize: "14px",
            paddingRight: "2.2rem",
          }}
        >
          <option value="">Selecciona…</option>
          {CLINIC_TYPE_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>
      <SubmitBtn
        enabled={complete}
        onClick={() => {
          if (!complete) {
            setAttempted(true);
            return;
          }
          onNext();
        }}
      >
        Siguiente
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </SubmitBtn>
    </div>
  );
}

// Pantalla "No me interesa" — cierre suave, sin lista de espera.
function StepDeclined({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ padding: "24px 0 12px", textAlign: "center" }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 999,
          background: "rgba(59,130,246,.10)",
          border: "2px solid rgba(59,130,246,.28)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          animation: "scaleBounce .5s ease .05s both",
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 9V5a3 3 0 0 0-6 0v4" />
          <path d="M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h2 style={{ fontFamily: "Inter", fontSize: 26, fontWeight: 800, letterSpacing: "-.028em", color: "#0A0A0A", margin: "0 0 10px" }}>
        Sin problema.
      </h2>
      <p style={{ fontFamily: "Inter", fontSize: 15, color: "#4B5563", lineHeight: 1.55, margin: "0 auto 20px", maxWidth: 400 }}>
        Cuando tu clínica necesite ordenarse con IA, acá vamos a estar para ayudarte a escalarla.
      </p>
      <button
        type="button"
        onClick={onBack}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "transparent",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: "11px 20px",
          color: "#0A0A0A",
          fontFamily: "Inter",
          fontSize: 14.5,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Cambié de opinión
      </button>
    </div>
  );
}

// ============== STEP 2 ==============
function StepContact({
  form,
  setForm,
  label = "Paso 2 de 3",
  onBack,
  onNext,
  onInteres,
  meetingMinutes = 30,
  agendaV2 = false,
}: {
  form: Form;
  setForm: (f: Form) => void;
  label?: string;
  meetingMinutes?: number;
  onBack: () => void;
  onNext: () => void;
  /**
   * Descarte explícito. Sólo lo pasa la variante con showcase: ahí el precio se
   * muestra al lado de este paso, así que el "no" pertenece acá. En el flujo
   * original el descarte vive junto al precio, en el paso 2 o en el 4.
   */
  onInteres?: (v: "si" | "no") => void;
  agendaV2?: boolean;
}) {
  const [attempted, setAttempted] = useState(false);
  const phoneFieldLabel = "Tu WhatsApp personal (dueño/a o gerente)";
  const phoneHelper = "Te escribimos directo a quien decide.";
  const rule = PHONE_RULES[form.prefix] ?? PHONE_RULES["+56"];
  const digits = form.phone.replace(/\D/g, "");
  const nameOk = form.nombre.trim().length >= 2;
  const clinicOk = agendaV2 || form.clinica.trim().length >= 2;
  const clinicTypeOk = agendaV2 || form.tipoClinica !== "";
  const cargoOk = !agendaV2 || form.cargo !== "";
  const phoneLengthOk = digits.length === rule.len;
  const phonePatternOk = rule.pattern.test(digits);
  const phoneOk = phoneLengthOk && phonePatternOk;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const allOk = nameOk && clinicOk && clinicTypeOk && cargoOk && phoneOk && emailOk;

  function formatPhone(v: string, prefix: string) {
    const r = PHONE_RULES[prefix];
    const d = v.replace(/\D/g, "").slice(0, r.len);
    if (prefix === "+56") {
      if (d.length <= 1) return d;
      if (d.length <= 5) return d[0] + " " + d.slice(1);
      return d[0] + " " + d.slice(1, 5) + " " + d.slice(5);
    }
    if (prefix === "+34" || prefix === "+51" || prefix === "+595") {
      if (d.length <= 3) return d;
      if (d.length <= 6) return d.slice(0, 3) + " " + d.slice(3);
      return d.slice(0, 3) + " " + d.slice(3, 6) + " " + d.slice(6);
    }
    if (prefix === "+507" || prefix === "+506") {
      if (d.length <= 4) return d;
      return d.slice(0, 4) + " " + d.slice(4);
    }
    if (prefix === "+593") {
      if (d.length <= 2) return d;
      if (d.length <= 5) return d.slice(0, 2) + " " + d.slice(2);
      return d.slice(0, 2) + " " + d.slice(2, 5) + " " + d.slice(5);
    }
    if (prefix === "+57") {
      if (d.length <= 3) return d;
      if (d.length <= 6) return d.slice(0, 3) + " " + d.slice(3);
      return d.slice(0, 3) + " " + d.slice(3, 6) + " " + d.slice(6);
    }
    if (prefix === "+1") {
      if (d.length <= 3) return d;
      if (d.length <= 6) return d.slice(0, 3) + " " + d.slice(3);
      return d.slice(0, 3) + " " + d.slice(3, 6) + " " + d.slice(6);
    }
    if (d.length <= 2) return d;
    if (d.length <= 6) return d.slice(0, 2) + " " + d.slice(2);
    return d.slice(0, 2) + " " + d.slice(2, 6) + " " + d.slice(6);
  }

  const phoneHint = (() => {
    if (!digits.length) return { cls: "#6B7280", t: `Ingresa ${rule.len} dígitos (${rule.name})` };
    if (digits.length < rule.len) return { cls: "#E74C3C", t: `Faltan ${rule.len - digits.length} dígito${rule.len - digits.length === 1 ? "" : "s"} (${rule.name})` };
    if (digits.length > rule.len) return { cls: "#E74C3C", t: `Demasiados dígitos para ${rule.name}` };
    if (!phonePatternOk) return { cls: "#E74C3C", t: `${rule.invalidHint} (${rule.name})` };
    return { cls: "#09B48A", t: `Número válido para ${rule.name}` };
  })();

  function submit() {
    if (!allOk) {
      setAttempted(true);
      return;
    }
    onNext();
  }

  return (
    <div>
      <BackBtn onClick={onBack} />
      <StepHeader
        label={label}
        title={
          agendaV2 ? (
            <>
              Hablemos de{" "}
              <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>ti</em>
            </>
          ) : (
            <>
              Tus{" "}
              <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>datos</em>{" "}
              de contacto
            </>
          )
        }
        sub={agendaV2 ? "Para contactarte con la persona correcta." : "Te confirmamos por WhatsApp."}
      />

      <Field label="Nombre" required error={attempted && !nameOk ? "Ingresa tu nombre." : undefined}>
        <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre completo" autoComplete="name" error={attempted && !nameOk} />
      </Field>
      {!agendaV2 && (
      <Field label="Nombre de la clínica" required error={attempted && !clinicOk ? "Ingresa el nombre de tu clínica." : undefined}>
        <Input value={form.clinica} onChange={(e) => setForm({ ...form, clinica: e.target.value })} placeholder="Ej: Clínica Sonríe" autoComplete="organization" error={attempted && !clinicOk} />
      </Field>
      )}
      {!agendaV2 && (
      <Field label="Tipo de clínica" required error={attempted && !clinicTypeOk ? "Selecciona el tipo de clínica." : undefined}>
        <select
          value={form.tipoClinica}
          onChange={(e) => setForm({ ...form, tipoClinica: e.target.value as ClinicType | "" })}
          style={{
            ...baseInputStyle({ error: attempted && !clinicTypeOk }),
            width: "100%",
            appearance: "none" as const,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right .8rem center",
            backgroundSize: "14px",
            paddingRight: "2.2rem",
          }}
        >
          <option value="">Selecciona…</option>
          {CLINIC_TYPE_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>
      )}
      {agendaV2 && (
      <Field label="Cargo" required error={attempted && !cargoOk ? "Selecciona tu cargo." : undefined}>
        <select
          value={form.cargo}
          onChange={(e) => setForm({ ...form, cargo: e.target.value as CargoId })}
          style={{
            ...baseInputStyle({ error: attempted && !cargoOk }),
            width: "100%",
            appearance: "none" as const,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right .8rem center",
            backgroundSize: "14px",
            paddingRight: "2.2rem",
          }}
        >
          <option value="">Selecciona…</option>
          {CARGO_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      )}
      <Field label={phoneFieldLabel} required>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={form.prefix}
            onChange={(e) => {
              const p = e.target.value;
              setForm({ ...form, prefix: p, phone: formatPhone(form.phone, p) });
            }}
            style={{
              ...baseInputStyle({ error: false }),
              width: 115,
              padding: "12px 10px",
              paddingRight: "1.8rem",
              flex: "0 0 115px",
              fontSize: 15,
              cursor: "pointer",
              appearance: "none" as const,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right .6rem center",
              backgroundSize: "14px",
            }}
          >
            {agendaV2
              ? AGENDA_PHONE_PREFIXES.map((c) => (
                  <option key={c.prefix} value={c.prefix}>
                    {c.flag} {c.prefix}
                  </option>
                ))
              : (
                <>
            <option value="+56">🇨🇱 +56</option>
            <option value="+52">🇲🇽 +52</option>
            <option value="+54">🇦🇷 +54</option>
            <option value="+507">🇵🇦 +507</option>
            <option value="+506">🇨🇷 +506</option>
            <option value="+595">🇵🇾 +595</option>
            <option value="+34">🇪🇸 +34</option>
            <option value="+51">🇵🇪 +51</option>
            <option value="+593">🇪🇨 +593</option>
            <option value="+1">🇵🇷 +1</option>
                </>
              )}
          </select>
          <Input
            style={{ flex: 1 }}
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value, form.prefix) })}
            placeholder={rule.placeholder}
            maxLength={rule.len + 4}
            autoComplete="tel-national"
            error={attempted && !phoneOk}
          />
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11.5,
            color: "#6B7280",
            marginTop: 7,
            lineHeight: 1.45,
            letterSpacing: ".01em",
          }}
        >
          {phoneHelper}
        </div>
        {(digits.length > 0 || attempted) && (
          <div style={{ fontSize: 12, color: digits.length === 0 ? "#E74C3C" : phoneHint.cls, marginTop: 4, letterSpacing: ".01em", fontWeight: 500 }}>
            {digits.length === 0 ? `Ingresa tu WhatsApp (${rule.len} dígitos)` : phoneHint.t}
          </div>
        )}
      </Field>
      <Field label="Email" required error={attempted && !emailOk ? "Ingresa un email válido." : undefined}>
        <Input type="email" inputMode="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@clinica.cl" autoComplete="email" error={attempted && !emailOk} />
      </Field>
      {attempted && !allOk && (
        <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "#E74C3C", fontWeight: 600, textAlign: "center", marginBottom: 10 }}>
          Completa todos los campos para continuar.
        </div>
      )}
      <SubmitBtn enabled={allOk} onClick={submit}>
        Agenda con tu ingeniero
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </SubmitBtn>
      <FormNote>Sin compromiso · {meetingMinutes} min por videollamada</FormNote>
      {onInteres && (
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <button
            type="button"
            onClick={() => onInteres("no")}
            style={{
              background: "transparent",
              border: 0,
              padding: "4px 6px",
              fontFamily: "Inter",
              fontSize: 13,
              color: "#9CA3AF",
              textDecoration: "underline",
              textUnderlineOffset: 3,
              cursor: "pointer",
            }}
          >
            No es para mí
          </button>
        </div>
      )}
    </div>
  );
}

// ============== STEP 3 — Cal.com inline embed ==============
function StepCalCom({
  form,
  software,
  size,
  label = "Paso 4 de 4",
  onBack,
  onBooked,
}: {
  form: Form;
  software: Step1Id | null;
  size: SizeAnswers;
  label?: string;
  onBack: () => void;
  onBooked: (b: CalBooking) => void;
}) {
  // Mantenemos el callback más reciente sin re-registrar el listener.
  const onBookedRef = useRef(onBooked);
  useEffect(() => {
    onBookedRef.current = onBooked;
  });

  const [calLoaded, setCalLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as {
      Cal?: CalGlobal;
      __clineraCalListener?: boolean;
    };

    // Cargador oficial de Cal.com (idempotente).
    if (!w.Cal) {
      (function (C: typeof w, A: string, L: string) {
        const p = (a: { q: unknown[] }, ar: unknown) => a.q.push(ar);
        const d = document;
        C.Cal =
          C.Cal ||
          ((...rest: unknown[]) => {
            const cal = C.Cal as CalGlobal;
            const ar = rest;
            if (!cal.loaded) {
              cal.ns = {};
              cal.q = cal.q || [];
              const s = d.createElement("script");
              s.src = A;
              d.head.appendChild(s);
              cal.loaded = true;
            }
            if (ar[0] === L) {
              const api: CalApi = function (...a: unknown[]) {
                p(api, a);
              } as CalApi;
              const namespace = ar[1];
              api.q = api.q || [];
              if (typeof namespace === "string") {
                cal.ns![namespace] = cal.ns![namespace] || api;
                p(cal.ns![namespace] as { q: unknown[] }, ar);
                p(cal as unknown as { q: unknown[] }, ["initNamespace", namespace]);
              } else {
                p(cal as unknown as { q: unknown[] }, ar);
              }
              return;
            }
            p(cal as unknown as { q: unknown[] }, ar);
          });
      })(w, "https://app.cal.com/embed/embed.js", "init");
    }

    const Cal = w.Cal!;
    Cal("init", "ads", { origin: "https://app.cal.com" });

    const sizeLabel = sizeSummaryLabel(size);
    const notes = [
      software ? `Software actual: ${STEP1_LABELS[software]}` : null,
      sizeLabel ? `Tamaño: ${sizeLabel}` : null,
      form.clinica ? `Clínica: ${form.clinica}` : null,
      form.phone ? `Teléfono: ${form.prefix} ${form.phone}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    Cal.ns!.ads("inline", {
      elementOrSelector: "#my-cal-inline-ads",
      config: {
        layout: "month_view",
        useSlotsViewOnSmallScreen: "true",
        name: form.nombre,
        email: form.email,
        notes,
      },
      calLink: buildCalLinkWithAttribution("team/clinera.io/ads"),
    });

    Cal.ns!.ads("ui", { hideEventTypeDetails: true, layout: "month_view" });

    // Registrar el listener una sola vez por sesión: cal.com no expone "off".
    if (!w.__clineraCalListener) {
      Cal.ns!.ads("on", {
        action: "bookingSuccessful",
        callback: (e: { detail?: { data?: CalBooking } }) => {
          onBookedRef.current?.(e?.detail?.data ?? {});
        },
      });
      w.__clineraCalListener = true;
    }

    // Skeleton loader: ocultarlo cuando Cal avise que el iframe quedo listo.
    Cal.ns!.ads("on", {
      action: "linkReady",
      callback: () => setCalLoaded(true),
    });

    // Fallback: si linkReady no llega en 6s (cambio de API, conexion lenta),
    // ocultamos igual para no dejar al usuario mirando un skeleton perpetuo.
    const fallback = window.setTimeout(() => setCalLoaded(true), 6000);
    return () => window.clearTimeout(fallback);
  }, [form.nombre, form.email, form.clinica, form.phone, form.prefix, software, size]);

  return (
    <div>
      <BackBtn onClick={onBack} />
      <StepHeader
        label={label}
        title={
          <>
            Elige tu{" "}
            <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>horario</em>
          </>
        }
        sub="Selecciona el día y hora que mejor te acomode. Recibirás la confirmación por email."
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: 620,
        }}
      >
        <div
          id="my-cal-inline-ads"
          className="ventas-cal-embed"
          style={{
            width: "100%",
            minHeight: 620,
            overflow: "auto",
            borderRadius: 12,
          }}
        />
        {!calLoaded && <CalendarLoadingOverlay />}
      </div>
      <FormNote>
        <strong>Sin compromiso</strong> · 30 min por videollamada
      </FormNote>
    </div>
  );
}

// Overlay de carga del calendario — compartido por StepCalCom (Cal.com) y
// StepClineraEmbed (widget propio). Los padres lo montan mientras su embed
// no avisa que quedó listo.
function CalendarLoadingOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 12,
        background: "linear-gradient(135deg,#F4F8FF 0%,#FAF5FF 100%)",
        border: "1px solid rgba(124,58,237,.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: 32,
        animation: "calOverlayFade 220ms ease",
      }}
    >
      <div className="cal-skeleton-grid" aria-hidden="true">
        {Array.from({ length: 35 }).map((_, i) => (
          <span key={i} className="cal-skeleton-cell" />
        ))}
      </div>
      <div
        role="status"
        aria-live="polite"
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: "#4B5563",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: "2px solid rgba(124,58,237,.18)",
            borderTopColor: "#7C3AED",
            animation: "calSpin 0.8s linear infinite",
          }}
        />
        Cargando tu calendario<span className="cal-loading-dots" />
      </div>
      <style jsx>{`
        .cal-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          width: 100%;
          max-width: 420px;
        }
        .cal-skeleton-cell {
          aspect-ratio: 1 / 1;
          border-radius: 8px;
          background: linear-gradient(
            90deg,
            rgba(124, 58, 237, 0.06) 0%,
            rgba(217, 70, 239, 0.1) 50%,
            rgba(124, 58, 237, 0.06) 100%
          );
          background-size: 200% 100%;
          animation: calShimmer 1.4s ease-in-out infinite;
        }
        .cal-skeleton-cell:nth-child(7n) {
          animation-delay: 0.05s;
        }
        .cal-skeleton-cell:nth-child(3n) {
          animation-delay: 0.1s;
        }
        .cal-loading-dots::after {
          display: inline-block;
          width: 1.4em;
          text-align: left;
          content: "";
          animation: calDots 1.2s steps(4, end) infinite;
        }
        @keyframes calShimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        @keyframes calSpin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes calDots {
          0% {
            content: "";
          }
          25% {
            content: ".";
          }
          50% {
            content: "..";
          }
          75% {
            content: "...";
          }
        }
        @keyframes calOverlayFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cal-skeleton-cell,
          .cal-loading-dots::after {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

// ============== STEP 4 (alt) — Embed oficial de Clinera ==============
// El paso final de /agenda: en vez de Cal.com, el widget de reserva del propio
// producto. sucursalId + tratamientoId van preseteados, así que el widget abre
// directo en la elección de profesional → fecha/hora. Los datos del paso
// anterior viajan en la URL con los MISMOS nombres del estado interno del
// wizard del embed (nombre / email / telefono, este último en E.164) para que
// el widget los precargue en su paso "Tus datos" apenas app.clinera.io los lea
// del preset; enviarlos hoy es inocuo (parámetros ignorados).
function StepClineraEmbed({
  form,
  label = "Paso 4 de 4",
  onBack,
  onBooked,
}: {
  form: Form;
  label?: string;
  onBack: () => void;
  onBooked: () => void;
}) {
  // Callback más reciente sin re-registrar el listener (mismo patrón que StepCalCom).
  const onBookedRef = useRef(onBooked);
  useEffect(() => {
    onBookedRef.current = onBooked;
  });

  const [embedLoaded, setEmbedLoaded] = useState(false);
  // Guard contra doble disparo (dos clicks a "Entendido", mensajes repetidos).
  const bookedRef = useRef(false);

  const src = useMemo(() => {
    const params = new URLSearchParams(CLINERA_EMBED_PRESET);
    const digits = form.phone.replace(/\D/g, "");
    if (form.nombre.trim()) params.set("nombre", form.nombre.trim());
    if (form.email.trim()) params.set("email", form.email.trim());
    if (digits) params.set("telefono", form.prefix + digits);
    return `${CLINERA_EMBED_BASE}?${params.toString()}`;
  }, [form.nombre, form.email, form.phone, form.prefix]);

  // El único postMessage que emite el embed es {type:"CLOSE_FROM_IFRAME"}, y
  // sale exclusivamente del botón "Entendido" de su pantalla de éxito → llega
  // solo cuando el turno ya se creó. Se valida el origen y se dispara una vez.
  useEffect(() => {
    const onMessage = (ev: MessageEvent) => {
      if (ev.origin !== CLINERA_EMBED_ORIGIN) return;
      const type = (ev.data as { type?: string } | null)?.type;
      if (type !== "CLOSE_FROM_IFRAME") return;
      if (bookedRef.current) return;
      bookedRef.current = true;
      onBookedRef.current?.();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div>
      <BackBtn onClick={onBack} />
      <StepHeader
        label={label}
        title={
          <>
            Elige profesional y{" "}
            <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>horario</em>
          </>
        }
        sub="Selecciona con quién y cuándo te acomoda reunirte. Recibirás la confirmación por email."
      />
      <div style={{ position: "relative", width: "100%", minHeight: 700 }}>
        <iframe
          src={src}
          title="Widget de Reserva de Turnos"
          onLoad={() => setEmbedLoaded(true)}
          style={{
            border: "none",
            borderRadius: 12,
            width: "100%",
            height: 700,
            display: "block",
            background: "transparent",
          }}
        />
        {!embedLoaded && <CalendarLoadingOverlay />}
      </div>
      <FormNote>
        <strong>Sin compromiso</strong> · Videollamada con el equipo Clinera
      </FormNote>
    </div>
  );
}

// ============== STEP 4 (alt) — Selector de agendador Clinera ==============
// Prueba el webhook de config de n8n: si responde, reserva nativa (sin iframe,
// con los datos del paso 3 precargados); si no (workflow inactivo, n8n caído,
// timeout), cae al embed oficial. /agenda funciona igual aunque n8n no esté.
export function StepClineraScheduler({
  form,
  label,
  onBack,
  onBooked,
  showInvestment = false,
  onInteres,
  tzIp = "",
}: {
  form: Form;
  label?: string;
  /** Muestra el aviso de inversión acá (viene del paso 2 para bajar fricción). */
  showInvestment?: boolean;
  onInteres?: (v: "si" | "no") => void;
  onBack: () => void;
  onBooked: (b: CalBooking, via: string, confirmEventId?: string) => void | Promise<void>;
  tzIp?: string;
}) {
  const [mode, setMode] = useState<"checking" | "nativo" | "embed">("checking");
  const [config, setConfig] = useState<ClineraAgendaConfig | null>(null);

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    const t = window.setTimeout(() => ctrl.abort(), 2500);
    fetch(N8N_AGENDA_CONFIG_URL, { signal: ctrl.signal })
      .then((r) => (r.ok ? (r.json() as Promise<ClineraAgendaConfig>) : null))
      .then((cfg) => {
        if (cancelled) return;
        if (cfg?.ok) {
          setConfig(cfg);
          setMode("nativo");
        } else {
          setMode("embed");
        }
      })
      .catch(() => {
        if (!cancelled) setMode("embed");
      })
      .finally(() => window.clearTimeout(t));
    return () => {
      cancelled = true;
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, []);

  if (mode === "checking") {
    return (
      <div>
        <BackBtn onClick={onBack} />
        <div style={{ position: "relative", width: "100%", minHeight: 480 }}>
          <CalendarLoadingOverlay />
        </div>
      </div>
    );
  }
  if (mode === "nativo") {
    return (
      <StepClineraNativo
        form={form}
        config={config ?? { ok: true }}
        tzIp={tzIp}
        showInvestment={showInvestment}
        onInteres={onInteres}
        label={label}
        onBack={onBack}
        onBooked={(b, confirmEventId) => onBooked(b, "Clinera nativo (n8n)", confirmEventId)}
        onFallback={() => setMode("embed")}
      />
    );
  }
  return (
    <StepClineraEmbed
      form={form}
      label={label}
      onBack={onBack}
      onBooked={() => onBooked({}, "Clinera embed confirm")}
    />
  );
}

// ============== STEP 4 (alt) — Reserva nativa vía n8n ==============
// UX estilo Cal.com sin iframe: el cliente ya dejó sus datos en el paso 3, acá
// solo elige día, profesional y hora. Disponibilidad y creación del turno van
// por los webhooks de n8n.oacg.cl (integrations/n8n/), que llaman a la API
// pública de app.clinera.io — el turno queda en la agenda real de Clinera.
// ---------------------------------------------------------------------------
// La API de disponibilidad manda las horas como TEXTO PLANO en hora de Chile
// ("10:00"), sin zona. Un dueño de clínica en México leía ese 10:00 como suyo,
// reservaba, y la reunión le quedaba a las 08:00 de su mañana. Acá el bloque se
// ancla a un instante real para poder mostrarlo en la zona del visitante.
//
// Lo que se manda al webhook NO cambia: sigue siendo `horaInicio` en hora de
// Chile. Esto es sólo lo que el visitante lee.
// ---------------------------------------------------------------------------
export const TZ_CLINICA = "America/Santiago";

export function ymdEnZona(tz: string, instante: Date): string {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instante);
  const p: Record<string, string> = {};
  for (const parte of partes) p[parte.type] = parte.value;
  return `${p.year}-${p.month}-${p.day}`;
}

function addCalendarDays(ymd: string, days: number): string {
  const [Y, M, D] = ymd.split("-").map(Number);
  return new Date(Date.UTC(Y, (M || 1) - 1, (D || 1) + days)).toISOString().slice(0, 10);
}

function weekdayYmd(ymd: string): number {
  const [Y, M, D] = ymd.split("-").map(Number);
  return new Date(Date.UTC(Y, (M || 1) - 1, D || 1)).getUTCDay();
}

/**
 * Días que el picker puede ofrecer. Arranca en el hábil siguiente al de Chile
 * y además salta el día UTC en curso: la API arma esa grilla desde la hora
 * actual, no desde el horario de atención. Después de las 20:00 en Chile,
 * "mañana" local sigue siendo hoy en UTC y aparecen bloques tipo 01:45.
 */
export function diasCandidatosAgenda(now: Date = new Date()): { ymd: string; date: Date }[] {
  const chileHoy = ymdEnZona(TZ_CLINICA, now);
  const utcHoy = now.toISOString().slice(0, 10);
  const out: { ymd: string; date: Date }[] = [];
  for (let i = 1; out.length < 14 && i < 28; i++) {
    const ymd = addCalendarDays(chileHoy, i);
    const dow = weekdayYmd(ymd);
    if (dow === 0 || dow === 6) continue;
    if (ymd === utcHoy) continue;
    const [Y, M, D] = ymd.split("-").map(Number);
    out.push({ ymd, date: new Date(Y, (M || 1) - 1, D || 1) });
  }
  return out;
}

/** Reuniones de lun–vie en horario de oficina Chile. La madrugada UTC no pasa. */
export function esBloqueHabil(horaInicio: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(horaInicio) && horaInicio >= "08:00" && horaInicio <= "18:00";
}

/** Offset de una zona para un instante dado, en minutos (-240 = GMT-4). */
export function offsetZona(tz: string, instante: Date): number {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instante);
  const p: Record<string, string> = {};
  for (const parte of partes) p[parte.type] = parte.value;
  const comoUTC = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour) % 24,
    Number(p.minute),
    Number(p.second),
  );
  return (comoUTC - (instante.getTime() - instante.getMilliseconds())) / 60000;
}

/**
 * Instante real de un bloque `YYYY-MM-DD` + `HH:MM` expresado en hora de Chile.
 * Dos pasadas a propósito: la primera da un offset aproximado y la segunda lo
 * corrige si el ajuste cruzó el cambio de horario. El offset NO se escribe a
 * mano — Chile pasa a GMT-3 el primer domingo de septiembre y una constante
 * quedaría vieja ese día sin que nadie se entere.
 */
export function instanteEnChile(ymd: string, hhmm: string): Date {
  const [Y, M, D] = ymd.split("-").map(Number);
  const [h, m] = hhmm.split(":").map(Number);
  const tentativo = Date.UTC(Y, (M || 1) - 1, D, h || 0, m || 0);
  let ts = tentativo - offsetZona(TZ_CLINICA, new Date(tentativo)) * 60000;
  ts = tentativo - offsetZona(TZ_CLINICA, new Date(ts)) * 60000;
  return new Date(ts);
}

export function horaEnZona(instante: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(instante);
}

/** Lo que el visitante lee en cada bloque: su hora local, y Chile si no coincide. */
export function rotuloSlot(
  horaChile: string,
  ymd: string,
  tzVisitante: string,
): { local: string; chile: string; otraZona: boolean } {
  const inst = instanteEnChile(ymd, horaChile);
  const tz = zonaMostrada(tzVisitante, "");
  return {
    local: horaEnZona(inst, tz),
    chile: horaChile,
    otraZona: offsetZona(tz, inst) !== offsetZona(TZ_CLINICA, inst),
  };
}

/** Rótulo GMT±H de una zona para ese instante ("GMT-6", "GMT+5:30"). */
export function etiquetaGmt(tz: string, instante: Date): string {
  const min = offsetZona(tz, instante);
  const abs = Math.abs(min);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return "GMT" + (min < 0 ? "-" : "+") + h + (m ? ":" + String(m).padStart(2, "0") : "");
}

/** Zona del visitante, o "" si el navegador no la expone o estamos en el server. */
function zonaVisitante(): string {
  if (typeof window === "undefined") return "";
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

/**
 * Deja UN slot por hora, eligiendo a qué profesional le toca.
 *
 * Antes esto era un dedupe que conservaba la PRIMERA aparición, y no repartía
 * nada: la API ordena por id de profesional de forma estable, así que la misma
 * persona salía primera en 48 de cada 50 bloques y se llevaba todas las
 * reuniones. Ahora gana quien tenga MÁS bloques libres ese día — más libres =
 * menos agendado —, así el reparto se equilibra solo, sin llevar cuenta entre
 * visitas (cada visitante reserva una vez y no sabe nada de los demás).
 *
 * Pura y exportada para poder probarla contra la respuesta real de la API.
 */
export function repartirSlots(slots: DispoSlot[]): DispoSlot[] {
  const libres = new Map<string, number>();
  const porHora = new Map<string, DispoSlot[]>();
  for (const s of slots) {
    if (!s.horaInicio) continue;
    const id = s.profesional?.id ?? "";
    libres.set(id, (libres.get(id) ?? 0) + 1);
    const previos = porHora.get(s.horaInicio);
    if (previos) previos.push(s);
    else porHora.set(s.horaInicio, [s]);
  }

  // Contar sólo los bloques libres del día NO alcanza: es un número por
  // persona, así que quien tenga uno más se lleva las 10 horas y volvemos al
  // mismo problema con otro nombre. Hay que repartir también DENTRO del día,
  // llevando cuenta de lo que ya se entregó en esta misma grilla.
  //
  // Cada visitante reserva un solo bloque, pero distintos visitantes eligen
  // distintas horas: si las horas quedan repartidas entre las dos, el agregado
  // se equilibra aunque nadie lleve un registro entre visitas.
  const entregados = new Map<string, number>();
  return Array.from(porHora.keys())
    .sort((a, b) => a.localeCompare(b))
    .map((horaInicio, i) => {
      const cand = porHora.get(horaInicio) as DispoSlot[];
      // El empate se rompe rotando por la posición de la hora, NO con
      // Math.random(): esto corre dentro de un useMemo y la aleatoriedad haría
      // saltar la asignación en cada recálculo, cambiándole el profesional al
      // visitante bajo los pies.
      let mejor = cand[0];
      let mejorHolgura = -Infinity;
      for (let j = 0; j < cand.length; j++) {
        const c = cand[(j + i) % cand.length];
        const id = c.profesional?.id ?? "";
        const holgura = (libres.get(id) ?? 0) - (entregados.get(id) ?? 0);
        if (holgura > mejorHolgura) {
          mejor = c;
          mejorHolgura = holgura;
        }
      }
      const idMejor = mejor.profesional?.id ?? "";
      entregados.set(idMejor, (entregados.get(idMejor) ?? 0) + 1);
      return mejor;
    });
}

function StepClineraNativo({
  form,
  config,
  label = "Paso 4 de 4",
  onBack,
  onBooked,
  onFallback,
  showInvestment = false,
  onInteres,
  tzIp = "",
}: {
  form: Form;
  config: ClineraAgendaConfig;
  label?: string;
  showInvestment?: boolean;
  onInteres?: (v: "si" | "no") => void;
  onBack: () => void;
  onBooked: (b: CalBooking, confirmEventId: string) => void | Promise<void>;
  onFallback: () => void;
  tzIp?: string;
}) {
  // Hábil siguiente en Chile, sin el día UTC en curso (la API de "hoy"
  // arma la grilla desde ahora y de madrugada aparecen las 01:45).
  const candidateDays = useMemo(() => diasCandidatosAgenda(), []);

  // Cuántas horas tiene cada día, en una sola llamada. Sirve para no ofrecer
  // un día que va a responder "sin horas disponibles": el visitante lo
  // descubre recién al hacer clic y parece que la agenda está rota.
  const [resumen, setResumen] = useState<Record<string, number> | null>(null);
  useEffect(() => {
    const desde = candidateDays[0]?.ymd;
    if (!desde) return;
    const ctrl = new AbortController();
    fetch(`${N8N_AGENDA_DISPO_URL}?desde=${desde}&dias=21`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("resumen " + r.status))))
      .then((json: { dias?: Record<string, number> }) => {
        if (json && json.dias && typeof json.dias === "object") setResumen(json.dias);
      })
      .catch(() => {
        /* Sin resumen se ofrecen todos los días: mejor mostrar uno vacío que
           esconder uno que sí tenía horas. */
      });
    return () => ctrl.abort();
  }, [candidateDays]);

  // Un día se esconde solo si el resumen dice que tiene CERO horas. El -1 es
  // "no se pudo consultar", y ese se ofrece igual.
  const days = useMemo(
    () => (resumen ? candidateDays.filter((d) => resumen[d.ymd] !== 0) : candidateDays).slice(0, 10),
    [candidateDays, resumen],
  );

  const [fecha, setFecha] = useState(candidateDays[0].ymd);
  const [hora, setHora] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [retryTick, setRetryTick] = useState(0);
  // Si el día elegido se cayó de la tira porque el resumen dijo que no tiene
  // horas, se muestra el primero que sí tenga. Derivado, no efecto: lo que el
  // visitante eligió no se pisa.
  const fechaEfectiva = days.some((d) => d.ymd === fecha) ? fecha : (days[0]?.ymd ?? fecha);

  // El estado de disponibilidad se escribe SOLO desde los callbacks del fetch;
  // loading/slots/error se derivan comparando la clave pedida vs la recibida.
  const dispoKey = `${fechaEfectiva}#${retryTick}`;
  const [dispo, setDispo] = useState<{ key: string; slots: DispoSlot[]; error: boolean } | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const key = dispoKey;
    fetch(`${N8N_AGENDA_DISPO_URL}?fecha=${fechaEfectiva}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("dispo " + r.status))))
      .then((json: { data?: { horariosDisponibles?: DispoSlot[] }; horariosDisponibles?: DispoSlot[] }) => {
        const list = json?.data?.horariosDisponibles ?? json?.horariosDisponibles ?? [];
        setDispo({ key, slots: Array.isArray(list) ? list : [], error: false });
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setDispo({ key, slots: [], error: true });
      });
    return () => ctrl.abort();
  }, [fechaEfectiva, dispoKey]);

  const loadingSlots = dispo?.key !== dispoKey;
  const slots = useMemo(() => (loadingSlots || !dispo ? [] : dispo.slots), [loadingSlots, dispo]);
  const slotsError = !loadingSlots && !!dispo?.error;

  // Sin selector de profesional: acá nadie agenda por persona, agenda por hora
  // disponible. La API devuelve una entrada por profesional, así que cada hora
  // se ofrece una sola vez y hay que elegir a quién le queda.
  //
  // Antes se conservaba la PRIMERA aparición, y eso no repartía nada: la API
  // ordena por id de profesional de forma estable, así que la misma persona
  // salía primera en 48 de cada 50 bloques y se llevaba todas las reuniones.
  //
  // Ahora gana quien tenga MÁS bloques libres ese día: más libres = menos
  // agendado, así que el reparto se equilibra solo, sin llevar cuenta entre
  // visitas (cada visitante reserva una vez y no sabe nada de los demás).
  const visibleSlots = useMemo(
    () => repartirSlots(slots.filter((s) => esBloqueHabil(s.horaInicio))),
    [slots],
  );

  // Zona del visitante: gana la IP. El snapshot de servidor es la IP (o "")
  // y el de cliente suma el reloj del OS sólo si no hubo header.
  const tzNavegador = useSyncExternalStore(
    () => () => {},
    zonaVisitante,
    () => "",
  );
  const tzVisitante = zonaMostrada(tzIp, tzNavegador);

  // Instante de referencia del día visible, para comparar offsets y rotular.
  const refInstante = useMemo(() => instanteEnChile(fechaEfectiva, "12:00"), [fechaEfectiva]);

  // Se compara el OFFSET, no el nombre de la zona: alguien en Caracas está en
  // GMT-4 igual que Chile en invierno, y mostrarle dos horas iguales sería
  // ruido. Alguien en Punta Arenas sí difiere aunque también sea Chile.
  const otraZona =
    offsetZona(tzVisitante, refInstante) !== offsetZona(TZ_CLINICA, refInstante);

  // La hora elegida solo vale si sigue existiendo en el día visible.
  const selectedSlot = visibleSlots.find((s) => s.horaInicio === hora) ?? null;

  async function confirmar() {
    const slot = selectedSlot;
    if (!slot || submitting) return;
    setSubmitting(true);
    setSubmitError(false);
    const digits = form.phone.replace(/\D/g, "");
    // El event_id se genera ACÁ y viaja tanto al webhook (que dispara el
    // Schedule server-side por CAPI) como al fbq del navegador: Meta deduplica
    // por (event_name, event_id), así que el par cuenta como UNA conversión.
    const confirmEventId =
      "ventas_confirm_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
    try {
      const res = await fetch(N8N_AGENDA_TURNO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          telefono: form.prefix + digits,
          // fechaEfectiva, no fecha: si el día que el visitante tocó se cayó de
          // la tira porque el resumen dijo que no tenía horas, la grilla que
          // está viendo es la de OTRO día. Reservar con `fecha` agendaba sobre
          // el día que ya no se muestra.
          fecha: fechaEfectiva,
          hora: slot.horaInicio,
          professionalId: slot.profesional?.id ?? "",
          professionalName: slot.profesional?.name ?? "",
          // Tracking server-side (Meta CAPI + GA4 Measurement Protocol).
          event_id: confirmEventId,
          event_source_url: typeof window !== "undefined" ? window.location.href : "",
          ga_client_id: readGaClientId(),
          ...getClineraMetaIds(),
          ...getAttributionPayload(),
        }),
        signal: AbortSignal.timeout(20_000),
      });
      // n8n responde `{ success: true }`. Un `ok` suelto también vale.
      const json: { ok?: boolean; success?: boolean } = res.ok ? await res.json() : {};
      if (!(json.ok || json.success)) throw new Error("turno no creado");
      // El CRM/Chat no puede dejar el botón en «Confirmando…».
      void onBooked(
        {
          date: `${fechaEfectiva}T${slot.horaInicio}:00`,
          duration: slot.duracionMin ?? config.duracionMin,
          organizer: slot.profesional?.name ? { name: slot.profesional.name } : undefined,
          confirmed: true,
        },
        confirmEventId,
      );
    } catch {
      setSubmitting(false);
      setSubmitError(true);
    }
  }

  const dayBtn = (sel: boolean): React.CSSProperties => ({
    flex: "0 0 auto",
    minWidth: 74,
    padding: "10px 8px",
    border: "1.5px solid " + (sel ? "#0A0A0A" : "#E7EBF0"),
    borderRadius: 12,
    background: sel ? "#0A0A0A" : "#fff",
    color: sel ? "#fff" : "#0A0A0A",
    cursor: "pointer",
    fontFamily: "Inter",
    textAlign: "center",
    transition: "all .2s",
  });

  return (
    <div>
      <BackBtn onClick={onBack} />
      <StepHeader
        label={label}
        title={
          <>
            Elige el día y la{" "}
            <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>hora</em>
          </>
        }
        sub="Tus datos ya quedaron guardados: solo elige cuándo te acomoda."
      />

      {showInvestment && (
        <div
          style={{
            background: "linear-gradient(135deg,#F4F8FF 0%,#FAF5FF 100%)",
            border: "1px solid rgba(124,58,237,.16)",
            borderRadius: 14,
            padding: 14,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "#7C3AED", marginBottom: 6 }}>
            Planes desde
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 19, fontWeight: 800, letterSpacing: "-.03em", color: "#0A0A0A", lineHeight: 1.15 }}>
            USD 279 mensuales
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, marginBottom: 14, WebkitOverflowScrolling: "touch" }}>
        {days.map((d) => {
          const sel = d.ymd === fechaEfectiva;
          const wd = d.date.toLocaleDateString("es-CL", { weekday: "short" }).replace(".", "");
          const dm = d.date.toLocaleDateString("es-CL", { day: "numeric", month: "short" }).replace(".", "");
          return (
            <button key={d.ymd} type="button" onClick={() => setFecha(d.ymd)} style={dayBtn(sel)}>
              <span style={{ display: "block", fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", opacity: sel ? 0.75 : 0.55 }}>{wd}</span>
              <span style={{ display: "block", fontSize: 14, fontWeight: 700, marginTop: 2, whiteSpace: "nowrap" }}>{dm}</span>
            </button>
          );
        })}
      </div>

      <div style={{ minHeight: 180, marginBottom: 6 }}>
        {loadingSlots && (
          <div style={{ position: "relative", minHeight: 180 }}>
            <CalendarLoadingOverlay />
          </div>
        )}
        {!loadingSlots && slotsError && (
          <div style={{ fontFamily: "Inter", fontSize: 14, color: "#4B5563", textAlign: "center", padding: "28px 12px" }}>
            No pudimos cargar los horarios.{" "}
            <button
              type="button"
              onClick={() => setRetryTick((t) => t + 1)}
              style={{ background: "none", border: 0, color: "#7C3AED", fontWeight: 600, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, fontSize: 14, fontFamily: "Inter" }}
            >
              Reintentar
            </button>
          </div>
        )}
        {!loadingSlots && !slotsError && visibleSlots.length === 0 && (
          <div style={{ fontFamily: "Inter", fontSize: 14, color: "#6B7280", textAlign: "center", padding: "28px 12px" }}>
            Sin horas disponibles este día — prueba con otra fecha.
          </div>
        )}
        {!loadingSlots && !slotsError && visibleSlots.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 8 }}>
            {visibleSlots.map((s) => {
              const sel = hora === s.horaInicio;
              const rotulo = rotuloSlot(s.horaInicio, fechaEfectiva, tzVisitante);
              return (
                <button
                  key={s.horaInicio}
                  type="button"
                  onClick={() => setHora(s.horaInicio)}
                  aria-label={
                    rotulo.otraZona
                      ? `${rotulo.local} tu hora, ${rotulo.chile} en Chile`
                      : `${rotulo.local} hora de Chile`
                  }
                  style={{
                    padding: "11px 6px",
                    border: "1.5px solid " + (sel ? "#0A0A0A" : "#E7EBF0"),
                    borderRadius: 10,
                    background: sel ? "#0A0A0A" : "#fff",
                    color: sel ? "#fff" : "#0A0A0A",
                    fontFamily: "Inter",
                    fontSize: 14.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                >
                  {rotulo.otraZona ? (
                    <>
                      <span style={{ display: "block" }}>{rotulo.local}</span>
                      <span
                        style={{
                          display: "block",
                          fontSize: 10.5,
                          fontWeight: 600,
                          marginTop: 2,
                          opacity: sel ? 0.7 : 0.5,
                        }}
                      >
                        {rotulo.chile} Chile
                      </span>
                    </>
                  ) : (
                    rotulo.local
                  )}
                </button>
              );
            })}
          </div>
        )}
        {!loadingSlots && !slotsError && visibleSlots.length > 0 && (
          <div
            style={{
              fontFamily: "Inter",
              fontSize: 12,
              color: "#6B7280",
              textAlign: "center",
              marginTop: 10,
              lineHeight: 1.45,
            }}
          >
            {otraZona
              ? `Horarios en tu hora local (${etiquetaGmt(tzVisitante, refInstante)}). Debajo va la hora en Chile (${etiquetaGmt(TZ_CLINICA, refInstante)}), que es cuando se hace la reunión.`
              : `Horarios en tu hora local — Chile (${etiquetaGmt(TZ_CLINICA, refInstante)}).`}
          </div>
        )}
      </div>

      {submitError && (
        <div style={{ fontFamily: "Inter", fontSize: 13, color: "#E74C3C", fontWeight: 600, textAlign: "center", marginBottom: 8 }}>
          No pudimos confirmar tu reunión. Intenta de nuevo o{" "}
          <button
            type="button"
            onClick={onFallback}
            style={{ background: "none", border: 0, color: "#E74C3C", fontWeight: 700, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, fontSize: 13, fontFamily: "Inter" }}
          >
            usa el calendario clásico
          </button>
          .
        </div>
      )}

      <SubmitBtn enabled={!!selectedSlot && !submitting} onClick={confirmar}>
        {submitting ? "Confirmando…" : "Confirmar reunión"}
        {!submitting && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )}
      </SubmitBtn>
      {showInvestment && onInteres && (
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button
            type="button"
            onClick={() => onInteres("no")}
            style={{
              background: "transparent",
              border: 0,
              padding: "4px 6px",
              fontFamily: "Inter",
              fontSize: 13,
              color: "#9CA3AF",
              textDecoration: "underline",
              textUnderlineOffset: 3,
              cursor: "pointer",
            }}
          >
            No es para mí
          </button>
        </div>
      )}
      <FormNote>
        <strong>Sin compromiso</strong> · {config.duracionMin ?? 45} min por videollamada
      </FormNote>
    </div>
  );
}

// ============== SUCCESS ==============
function formatBookingDate(iso?: string | null, tzVisitante = TZ_CLINICA): string {
  return textoReserva(iso, tzVisitante);
}

export function textoReserva(dateIso: string | undefined | null, tzVisitante: string): string {
  if (!dateIso) return "";
  const m = dateIso.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
  if (!m) {
    try {
      return new Date(dateIso).toLocaleString("es-CL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return "";
    }
  }
  const inst = instanteEnChile(m[1], m[2]);
  const rotulo = rotuloSlot(m[2], m[1], tzVisitante);
  const dia = new Intl.DateTimeFormat("es-CL", {
    timeZone: TZ_CLINICA,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(inst);
  if (rotulo.otraZona) return `${dia} · ${rotulo.local} tu hora · ${rotulo.chile} Chile`;
  return `${dia} · ${rotulo.local}`;
}

function StepSuccess({
  form,
  software,
  size,
  booking,
  sourcePath = "/ventas",
  tzIp = "",
}: {
  form: Form;
  software: Step1Id | null;
  size: SizeAnswers;
  booking: CalBooking | null;
  sourcePath?: string;
  tzIp?: string;
}) {
  const bookingLabel = formatBookingDate(booking?.date, zonaMostrada(tzIp, ""));
  const softwareLabel = software ? STEP1_LABELS[software] : "";
  const sizeLabel = sizeSummaryLabel(size);
  const msg = encodeURIComponent(
    `Hola Clinera, acabo de agendar una reunión comercial desde ${sourcePath}.\n\nNombre: ${form.nombre}\nClínica: ${form.clinica}\nEmail: ${form.email}${softwareLabel ? `\nSoftware actual: ${softwareLabel}` : ""}${sizeLabel ? `\nTamaño: ${sizeLabel}` : ""}${bookingLabel ? `\nCuándo: ${bookingLabel}` : ""}`,
  );
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${msg}`;

  return (
    <div style={{ padding: "24px 0 8px", textAlign: "center" }}>
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 999,
          background: "rgba(16,185,129,.14)",
          border: "2px solid rgba(16,185,129,.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 22px",
          animation: "scaleBounce .6s ease .1s both",
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 style={{ fontFamily: "Inter", fontSize: 30, fontWeight: 800, letterSpacing: "-.028em", color: "#0A0A0A", margin: "0 0 10px" }}>¡Reunión recibida!</h2>
      <p style={{ fontFamily: "Inter", fontSize: 15, color: "#4B5563", lineHeight: 1.5, margin: "0 auto 8px", maxWidth: 380 }}>
        Recibirás la confirmación con el link de la videollamada por email.
      </p>
      {bookingLabel && (
        <div
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 12,
            color: "#0A0A0A",
            background: "#F3F4F6",
            border: "1px solid #E5E7EB",
            padding: "8px 12px",
            borderRadius: 8,
            margin: "18px auto 22px",
            display: "inline-block",
          }}
        >
          {bookingLabel}
        </div>
      )}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#25D366",
            color: "#fff",
            padding: "12px 22px",
            borderRadius: 12,
            fontFamily: "Inter",
            fontSize: 15,
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 10px 24px -8px rgba(37,211,102,.5)",
          }}
        >
          <WhatsAppIcon size={16} />
          Confirmar por WhatsApp
        </a>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            color: "#0A0A0A",
            padding: "12px 20px",
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            fontFamily: "Inter",
            fontSize: 14.5,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Volver al inicio
        </Link>
      </div>
      <p style={{ fontFamily: "Inter", fontSize: 12.5, color: "#9CA3AF", margin: "22px auto 0", maxWidth: 340, lineHeight: 1.5 }}>
        Tu hora debe quedar confirmada por WhatsApp. Si no confirmas, liberamos el cupo para otra clínica.
      </p>
    </div>
  );
}


// ============== SHARED ATOMS ==============
function StepHeader({ label, title, sub }: { label: string; title: React.ReactNode; sub: React.ReactNode }) {
  return (
    <div className="ventas-step-header" style={{ marginBottom: 22 }}>
      <div
        className="ventas-step-label"
        style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontWeight: 600, fontSize: 11.5, letterSpacing: ".14em", color: "#3B82F6", marginBottom: 8, textTransform: "uppercase" }}
      >
        {label}
      </div>
      <h2 className="ventas-step-title" style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 32, lineHeight: 1.08, margin: "0 0 10px", letterSpacing: "-.028em", color: "#0A0A0A" }}>
        {title}
      </h2>
      <p className="ventas-step-sub" style={{ fontFamily: "Inter", fontSize: 14.5, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
        {sub}
      </p>
    </div>
  );
}
function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ventas-back-btn"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "none",
        border: 0,
        color: "#6B7280",
        fontFamily: "Inter",
        fontSize: 13,
        cursor: "pointer",
        minHeight: 44,
        padding: "0 2px",
        marginBottom: 0,
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Volver
    </button>
  );
}
function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="ventas-field" style={{ marginBottom: 14 }}>
      <label className="ventas-field-label" style={{ fontFamily: "Inter", fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block", letterSpacing: ".01em" }}>
        {label}
        {required && <span style={{ color: "#E74C3C", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && (
        <div style={{ fontFamily: "Inter", fontSize: 12, color: "#E74C3C", marginTop: 5, fontWeight: 500 }}>{error}</div>
      )}
    </div>
  );
}
function baseInputStyle({ error }: { error: boolean }): React.CSSProperties {
  return {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid " + (error ? "#E74C3C" : "#E0E4EA"),
    borderRadius: 10,
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: 400,
    color: "#0A0A0A",
    background: "#fff",
    outline: "none",
    transition: "border-color .2s, box-shadow .2s",
    animation: error ? "shake .4s ease" : "none",
  };
}
function Input({
  error,
  style,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...rest}
      style={{ ...baseInputStyle({ error: !!error }), ...style }}
      onFocus={(e) => {
        e.target.style.borderColor = "#0A0A0A";
        e.target.style.boxShadow = "0 0 0 3px rgba(14,20,26,.08)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error ? "#E74C3C" : "#E0E4EA";
        e.target.style.boxShadow = "none";
      }}
    />
  );
}
function SubmitBtn({ enabled, children, onClick }: { enabled: boolean; children: React.ReactNode; onClick: () => void }) {
  const style: React.CSSProperties = enabled
    ? {
        background: GRAD,
        color: "#fff",
        boxShadow: "0 12px 32px -8px rgba(124,58,237,.35),0 4px 12px -2px rgba(217,70,239,.22)",
        cursor: "pointer",
      }
    : { background: "#C3CAD2", color: "#fff", cursor: "not-allowed", boxShadow: "none" };
  return (
    <button
      type="button"
      onClick={onClick}
      // Deshabilitado de verdad, no solo en gris: lo leen el teclado y los
      // lectores de pantalla, no únicamente la vista.
      disabled={!enabled}
      aria-disabled={!enabled}
      className="ventas-submit-btn"
      style={{
        width: "100%",
        padding: 14,
        minHeight: 48,
        border: 0,
        borderRadius: 12,
        fontFamily: "Inter",
        fontSize: 15.5,
        fontWeight: 700,
        letterSpacing: "-.01em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "all .25s",
        marginTop: 6,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
function FormNote({ children }: { children: React.ReactNode }) {
  return <div className="ventas-form-note" style={{ textAlign: "center", fontFamily: "Inter", fontSize: 12.5, color: "#9CA3AF", marginTop: 12, fontWeight: 400 }}>{children}</div>;
}
function WhatsAppIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ============== WINDOW TYPES ==============
type CalApi = ((...args: unknown[]) => void) & { q: unknown[] };
type CalGlobal = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns?: Record<string, CalApi>;
  q?: unknown[];
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    // dataLayer is already declared globally by analytics types
  }
}
