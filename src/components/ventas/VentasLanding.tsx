"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  "+52": { name: "México", len: 10, placeholder: "55 1234 5678", pattern: /^[2-9]\d{9}$/, invalidHint: "Debe empezar con 2-9" },
  "+54": { name: "Argentina", len: 10, placeholder: "11 1234 5678", pattern: /^\d{10}$/, invalidHint: "Debe tener 10 dígitos" },
  "+507": { name: "Panamá", len: 8, placeholder: "6123 4567", pattern: /^6\d{7}$/, invalidHint: "Debe empezar con 6" },
  "+506": { name: "Costa Rica", len: 8, placeholder: "8312 3456", pattern: /^[678]\d{7}$/, invalidHint: "Debe empezar con 6, 7 u 8" },
  "+595": { name: "Paraguay", len: 9, placeholder: "981 234 567", pattern: /^9[2-9]\d{7}$/, invalidHint: "Debe empezar con 92-99" },
  "+34": { name: "España", len: 9, placeholder: "612 345 678", pattern: /^[67]\d{8}$/, invalidHint: "Debe empezar con 6 o 7" },
  "+51": { name: "Perú", len: 9, placeholder: "912 345 678", pattern: /^9\d{8}$/, invalidHint: "Debe empezar con 9" },
  "+1": { name: "Puerto Rico", len: 10, placeholder: "787 123 4567", pattern: /^(787|939)\d{7}$/, invalidHint: "Debe empezar con 787 o 939" },
};

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

const SOFTWARE_MICROCOPY_MIGRATE =
  "Perfecto. Nuestro ingeniero migra tus fichas, pacientes y tratamientos desde tu sistema actual — tú no haces nada.";
const SOFTWARE_MICROCOPY_CUSTOM =
  "Perfecto. Nuestro ingeniero se conecta con tu sistema a medida y migra todo por ti.";

function softwareMicrocopy(id: SoftwareId): string {
  return id === "desarrollo_propio" ? SOFTWARE_MICROCOPY_CUSTOM : SOFTWARE_MICROCOPY_MIGRATE;
}

// ============== PASO 2 — TAMAÑO DE LA OPERACIÓN ==============
// Prioridad comercial. AJUSTA AQUÍ (único lugar del código). Toda clínica que
// completa el paso 2 CALIFICA (el precio de entrada de US$279 auto-selecciona);
// "prioridad alta" es solo una señal de tamaño para el equipo comercial.
const PRIORITY_THRESHOLDS = {
  sucursales: 2, // prioridad alta si sucursales >= 2
  pacientesMes: 500, // prioridad alta si pacientes/mes >= 500
} as const;

// `value` = piso numérico del rango; lo consume la regla de prioridad.
type SizeChoice = { id: string; label: string; value: number };

const SUCURSALES_OPTIONS: SizeChoice[] = [
  { id: "1", label: "1", value: 1 },
  { id: "2", label: "2", value: 2 },
  { id: "3plus", label: "más de 3", value: 4 },
];

const PACIENTES_OPTIONS: SizeChoice[] = [
  { id: "200_500", label: "200–500", value: 200 },
  { id: "500_1000", label: "500–1.000", value: 500 },
  { id: "gt1000", label: "más de 1.000", value: 1000 },
];

type SizeAnswers = {
  sucursales: SizeChoice | null;
  pacientes: SizeChoice | null;
};

export type Qualification = { califica: boolean; prioridadAlta: boolean };

// Regla PURA — toda clínica que completa el filtro califica (el precio de entrada
// auto-selecciona). prioridad_alta = señal de tamaño para el equipo comercial.
// FUENTE DE VERDAD única: el tracking (src/lib/metaEvents.ts) consume este resultado.
function evaluateQualification(size: SizeAnswers): Qualification {
  const prioridadAlta =
    (size.sucursales?.value ?? 0) >= PRIORITY_THRESHOLDS.sucursales ||
    (size.pacientes?.value ?? 0) >= PRIORITY_THRESHOLDS.pacientesMes;
  return { califica: true, prioridadAlta };
}

function sizeComplete(size: SizeAnswers): boolean {
  return !!(size.sucursales && size.pacientes);
}

function sizeSummaryLabel(size: SizeAnswers): string {
  const suc = size.sucursales
    ? `${size.sucursales.label} sucursal${size.sucursales.id === "1" ? "" : "es"}`
    : null;
  const pac = size.pacientes ? `${size.pacientes.label} pacientes/mes` : null;
  return [suc, pac].filter(Boolean).join(" · ");
}

// Tipo de clínica que atendemos hoy — dentales pausadas por el momento.
type ClinicType = "medica" | "kinesiologica" | "estetica" | "salud_mental";
const CLINIC_TYPE_OPTIONS: { id: ClinicType; label: string }[] = [
  { id: "medica", label: "Médica" },
  { id: "kinesiologica", label: "Kinesiológica" },
  { id: "estetica", label: "Estética" },
  { id: "salud_mental", label: "Salud mental" },
];
const CLINIC_TYPE_LABELS: Record<ClinicType, string> = {
  medica: "Médica",
  kinesiologica: "Kinesiológica",
  estetica: "Estética",
  salud_mental: "Salud mental",
};


const WEBHOOK_URL = "https://n8n.oacg.cl/webhook/088a2cfe-5c93-4a4b-a4e5-ac2617979ea5";
const WA_NUMBER = "56985581524";

type Form = { nombre: string; clinica: string; tipoClinica: ClinicType | ""; prefix: string; phone: string; email: string };

// ============== TRACKING HELPERS ==============
function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
}

function detectLeadSource(): string {
  if (typeof window === "undefined") return "organico";
  const qs = new URLSearchParams(window.location.search);
  const explicit = (qs.get("source") || qs.get("lead_source") || "").toLowerCase();
  if (explicit === "google" || explicit === "google-ads") return "google-ads";
  if (explicit === "meta" || explicit === "meta-ads" || explicit === "facebook") return "meta-ads";
  if (explicit === "organico" || explicit === "organic") return "organico";
  if (qs.get("gclid")) return "google-ads";
  if (qs.get("fbclid")) return "meta-ads";
  const utm = (qs.get("utm_source") || "").toLowerCase();
  if (utm.includes("google") || utm.includes("adwords")) return "google-ads";
  if (utm.includes("facebook") || utm.includes("meta") || utm.includes("instagram") || utm.includes("ig")) return "meta-ads";
  if (utm) return utm;
  return "organico";
}

// Empuja un evento a GTM/dataLayer (mecanismo de analytics que ya usa el sitio).
function pushDL(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push({ event, ...data });
}

// event_id único del lead. Se comparte entre el webhook n8n (upsert del lead) y,
// según MQL_TRIGGER, el par Pixel+CAPI del evento MQL → una sola señal deduplicada.
function newLeadEventId(): string {
  return "ventas_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
}

// Atributos NO personales del lead (software + tamaño + calificación). Se usan
// tanto en los eventos de analytics como en el payload del webhook.
function sizeAttributes(
  software: SoftwareId | null,
  size: SizeAnswers,
  qual: Qualification | null,
) {
  return {
    software_actual: software ?? "",
    software_actual_label: software ? SOFTWARE_LABELS[software] : "",
    sucursales: size.sucursales?.id ?? "",
    sucursales_label: size.sucursales?.label ?? "",
    pacientes_mes: size.pacientes?.id ?? "",
    pacientes_mes_label: size.pacientes?.label ?? "",
    prioridad_alta: qual?.prioridadAlta ?? false,
    califica: qual?.califica ?? false,
  };
}

// custom_data para el evento MQL de Meta: SOLO atributos de calificación, SIN PII
// y SIN los labels legibles. `pais` sale del prefijo telefónico cuando ya hay
// contacto (Paso 3); "" mientras no lo tengamos.
function qualCustomData(
  software: SoftwareId | null,
  size: SizeAnswers,
  qual: Qualification | null,
  pais: string,
): QualCustomData {
  return {
    software_actual: software ?? "",
    sucursales: size.sucursales?.id ?? "",
    pacientes_mes: size.pacientes?.id ?? "",
    prioridad_alta: qual?.prioridadAlta ?? false,
    pais,
  };
}

// Campos legacy para no romper el mapeo de n8n → Monday (que esperaba los datos
// del esquema anterior: tamano_clinica, patient_volume, migration_intent, etc.).
// Toda clínica que llega aquí ya tiene software → su intención es migrar.
function backCompatFields(software: SoftwareId | null, size: SizeAnswers, qual: Qualification | null) {
  const pacientesValue = size.pacientes?.value ?? 0;
  return {
    tamano_clinica: sizeSummaryLabel(size),
    patient_volume: pacientesValue >= 100 ? "over_100" : "under_100",
    migration_intent: "yes_migrate",
    migration_intent_label: "Queremos migrar a Clinera",
    software_actual_migracion: software ? SOFTWARE_LABELS[software] : "",
    monday_initial_status: "quiere migrar",
    lead_priority: qual?.prioridadAlta ? "high" : "standard",
    calendar_access: "allowed",
  };
}

// ============== ROOT ==============
export default function VentasLanding({
  enableMigrationQualification = false,
}: {
  enableMigrationQualification?: boolean;
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
        /* Desktop shows the big carousel card; mobile swaps to a compact horizontal strip */
        .ventas-testi-desktop { display: block; }
        .ventas-testi-mobile { display: none; }
        @media (max-width: 820px) {
          .ventas-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
            padding: 12px 16px 16px !important;
          }
          .ventas-hero-badge { font-size: 10.5px !important; padding: 5px 10px !important; gap: 6px !important; }
          .ventas-testi-desktop { display: none !important; }
          .ventas-testi-mobile { display: flex !important; }
          .ventas-integraciones { display: none !important; }
          .ventas-wizard { padding: 20px 14px 16px !important; border-radius: 16px !important; }
          .ventas-wizard-progress { margin-bottom: 16px !important; }
          .ventas-cal-embed { min-height: 560px !important; }
          .ventas-step-title { font-size: 22px !important; letter-spacing: -.02em !important; }
          .ventas-step-header { margin-bottom: 14px !important; }
          .ventas-step-sub { font-size: 13px !important; }
          .ventas-step-label { font-size: 10.5px !important; margin-bottom: 6px !important; }
          .ventas-challenge-opt { padding: 10px 12px !important; gap: 10px !important; }
          .ventas-challenge-icon { width: 36px !important; height: 36px !important; font-size: 18px !important; }
          .ventas-challenge-title { font-size: 14px !important; }
          .ventas-challenge-desc { font-size: 12px !important; }
          .ventas-submit-btn { padding: 12px !important; font-size: 14.5px !important; }
          .ventas-field { margin-bottom: 10px !important; }
          .ventas-field-label { margin-bottom: 4px !important; }
          .ventas-volume-num { font-size: 46px !important; }
        }
      `}</style>
      <ReunionHero enableMigrationQualification={enableMigrationQualification} />
    </>
  );
}

// ============== HERO ==============
function ReunionHero({
  enableMigrationQualification,
}: {
  enableMigrationQualification: boolean;
}) {
  return (
    <section style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
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
          maxWidth: 1200,
          margin: "0 auto",
          padding: "20px 24px 28px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "stretch",
        }}
      >
        <div className="reveal" style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
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
              marginBottom: 20,
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
            <span style={{ color: "#10B981", textTransform: "none", letterSpacing: "0.08em" }}>reunión de 30 min</span>
          </span>

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

        <div className="reveal" style={{ display: "flex", minWidth: 0 }}>
          <Wizard enableMigrationQualification={enableMigrationQualification} />
        </div>
      </div>
    </section>
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
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 22%" }}
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
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 22%", transition: "opacity .4s" }}
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
}: {
  enableMigrationQualification: boolean;
}) {
  const [step, setStep] = useState(1);
  const [software, setSoftware] = useState<SoftwareId | null>(null);
  const [size, setSize] = useState<SizeAnswers>({ sucursales: null, pacientes: null });
  const [interes, setInteres] = useState<"si" | "no" | null>(null);
  const [qualification, setQualification] = useState<Qualification | null>(null);
  const [form, setForm] = useState<Form>({ nombre: "", clinica: "", tipoClinica: "", prefix: "+56", phone: "", email: "" });
  const [leadCtx, setLeadCtx] = useState<{ eventId: string; leadSource: string } | null>(null);
  const [booking, setBooking] = useState<CalBooking | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [declined, setDeclined] = useState(false);
  // El paso de software (paso 1) queda gateado por la misma prop de antes; ambas
  // páginas (/ventas y /hablar-con-ventas) lo activan → flujo de 4 pasos.
  const hasSoftwareStep = enableMigrationQualification;
  const totalSteps = hasSoftwareStep ? 4 : 3;
  const softwareStep = 1;
  const sizeStep = hasSoftwareStep ? 2 : 1;
  const contactStep = hasSoftwareStep ? 3 : 2;
  const calStep = hasSoftwareStep ? 4 : 3;

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
      }}
    >
      <div className="ventas-wizard-progress" style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
          <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= n ? "#0A0A0A" : "#EEECEA", transition: "background .4s ease" }} />
        ))}
      </div>

      {!submitted && !declined && hasSoftwareStep && step === softwareStep && (
        <StepSoftware
          software={software}
          setSoftware={setSoftware}
          label={`Paso ${softwareStep} de ${totalSteps}`}
          onNext={() => {
            pushDL("paso_1_completado", {
              software_actual: software ?? "",
              software_actual_label: software ? SOFTWARE_LABELS[software] : "",
            });
            setStep(sizeStep);
          }}
        />
      )}
      {!submitted && !declined && step === sizeStep && (
        <StepSize
          size={size}
          setSize={setSize}
          interes={interes}
          onInteres={(v) => {
            setInteres(v);
            if (v === "no") {
              pushDL("no_interesa", {
                software_actual: software ?? "",
                software_actual_label: software ? SOFTWARE_LABELS[software] : "",
              });
              setDeclined(true);
            } else {
              pushDL("interes_confirmado", { software_actual: software ?? "" });
            }
          }}
          label={`Paso ${sizeStep} de ${totalSteps}`}
          onBack={hasSoftwareStep ? () => setStep(softwareStep) : undefined}
          onNext={() => {
            // Toda clínica que completa el filtro califica (el precio de entrada
            // auto-selecciona). No hay rama de lista de espera.
            const qual = evaluateQualification(size);
            setQualification(qual);
            const attrs = sizeAttributes(software, size, qual);
            pushDL("paso_2_completado", attrs);
            pushDL("calificado", attrs);
            if (typeof window !== "undefined" && typeof window.fbq === "function") {
              window.fbq("track", "ViewContent", { content_name: "Clinera Ventas", ...attrs });
            }
            // event_id único del lead — compartido con el webhook n8n y, si
            // MQL_TRIGGER === "qualified_step2", con el par Pixel+CAPI del MQL.
            const eventId = newLeadEventId();
            // Persistir el lead parcial YA (apenas se completa el paso 2): así queda
            // capturado aunque el usuario abandone antes de dejar sus datos.
            submitSizeLead({ software, size, qual, eventId }).then((ctx) => {
              if (ctx) setLeadCtx(ctx);
            });
            // MQL en el Paso 2 sólo si el equipo lo activó. Sin user_data:
            // todavía no hay datos de contacto (email/teléfono).
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
          form={form}
          setForm={setForm}
          label={`Paso ${contactStep} de ${totalSteps}`}
          onBack={() => setStep(sizeStep)}
          onNext={() => {
            if (typeof window !== "undefined" && typeof window.fbq === "function") {
              window.fbq("track", "InitiateCheckout", { content_name: "Clinera Ventas" });
            }
            pushDL("lead_completo", sizeAttributes(software, size, qualification));
            // Enviar el lead completo en background — sin bloquear el avance al embed.
            // Reutiliza el event_id del lead parcial (paso 2) para que n8n haga upsert.
            submitContactLead({ form, software, size, qual: qualification, leadCtx }).then((ctx) => {
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
      {!submitted && !declined && step === calStep && (
        <StepCalCom
          form={form}
          software={software}
          size={size}
          label={`Paso ${calStep} de ${totalSteps}`}
          onBack={() => setStep(contactStep)}
          onBooked={async (calBooking) => {
            setBooking(calBooking);
            await submitBookingConfirmation({ form, software, size, qual: qualification, leadCtx, booking: calBooking });
            setSubmitted(true);
          }}
        />
      )}
      {!submitted && declined && (
        <StepDeclined
          onBack={() => {
            setDeclined(false);
            setInteres(null);
          }}
        />
      )}
      {submitted && <StepSuccess form={form} software={software} size={size} booking={booking} />}
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

type CalBooking = {
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
async function submitSizeLead({
  software,
  size,
  qual,
  eventId,
}: {
  software: SoftwareId | null;
  size: SizeAnswers;
  qual: Qualification;
  eventId?: string;
}): Promise<{ eventId: string; leadSource: string } | null> {
  if (!qual.califica) return null;

  const resolvedEventId = eventId ?? newLeadEventId();
  const leadSource = detectLeadSource();
  const { fbp, fbc } = getMetaSignals();

  pushDL("ventas_size_lead", {
    lead_source: leadSource,
    event_id: resolvedEventId,
    booking_status: "pending",
    ...sizeAttributes(software, size, qual),
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
    ...sizeAttributes(software, size, qual),
    ...backCompatFields(software, size, qual),
    fuente: "Landing /ventas — Clinera (tamaño)",
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
async function submitContactLead({
  form,
  software,
  size,
  qual,
  leadCtx,
}: {
  form: Form;
  software: SoftwareId | null;
  size: SizeAnswers;
  qual: Qualification | null;
  leadCtx: { eventId: string; leadSource: string } | null;
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
    ...sizeAttributes(software, size, qual),
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
    fuente: "Landing /ventas — Clinera",
    landing_url: typeof window !== "undefined" ? location.href : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
    created_at: new Date().toISOString(),
    timestamp: Date.now(),
  };

  const ok = await postWebhook(payload, "Contact lead");
  return { eventId, leadSource, ok };
}

// (4) Confirmación de reserva — cuando Cal.com dispara `bookingSuccessful`.
async function submitBookingConfirmation({
  form,
  software,
  size,
  qual,
  leadCtx,
  booking,
}: {
  form: Form;
  software: SoftwareId | null;
  size: SizeAnswers;
  qual: Qualification | null;
  leadCtx: { eventId: string; leadSource: string } | null;
  booking: CalBooking;
}) {
  const confirmEventId =
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
    fuente: "Landing /ventas — Clinera (Cal.com confirm)",
    landing_url: typeof window !== "undefined" ? location.href : "",
    created_at: new Date().toISOString(),
    timestamp: Date.now(),
  };

  await postWebhook(payload, "Booking confirmation");
}

// ============== STEP 1 — SOFTWARE ACTUAL ==============
function StepSoftware({
  software,
  setSoftware,
  label,
  onNext,
}: {
  software: SoftwareId | null;
  setSoftware: (id: SoftwareId) => void;
  label: string;
  onNext: () => void;
}) {
  return (
    <div>
      <StepHeader
        label={label}
        title={
          <>
            ¿Qué{" "}
            <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              software
            </em>{" "}
            usan hoy en tu clínica?
          </>
        }
        sub="Reunión exclusiva para dueños, gerentes y directores médicos de clínicas."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SOFTWARE_OPTIONS.map((opt) => {
          const sel = software === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSoftware(opt.id)}
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

      {software && (
        <div
          key={software}
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: "13px 15px",
            background: "linear-gradient(135deg,#F4F8FF 0%,#FAF5FF 100%)",
            border: "1px solid rgba(124,58,237,.16)",
            borderRadius: 12,
            animation: "ventasFadeUp .3s ease both",
          }}
        >
          <span style={{ flexShrink: 0, marginTop: 1, color: "#7C3AED" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <span style={{ fontFamily: "Inter", fontSize: 13.5, color: "#374151", lineHeight: 1.45 }}>
            {softwareMicrocopy(software)}
          </span>
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <SubmitBtn enabled={!!software} onClick={() => software && onNext()}>
          Continuar
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </SubmitBtn>
      </div>
    </div>
  );
}

// ============== STEP 2 — TAMAÑO DE LA OPERACIÓN ==============
function ChipGroup({
  groupLabel,
  options,
  selected,
  onSelect,
}: {
  groupLabel: string;
  options: SizeChoice[];
  selected: SizeChoice | null;
  onSelect: (o: SizeChoice) => void;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontFamily: "Inter",
          fontWeight: 600,
          fontSize: 13.5,
          letterSpacing: "-.01em",
          color: "#374151",
          marginBottom: 9,
        }}
      >
        {groupLabel}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((opt) => {
          const sel = selected?.id === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt)}
              style={{
                flex: "1 1 auto",
                minWidth: "fit-content",
                padding: "11px 16px",
                border: "1.5px solid " + (sel ? "#0A0A0A" : "#E7EBF0"),
                borderRadius: 999,
                background: sel ? "#FAFBFD" : "#fff",
                cursor: "pointer",
                fontFamily: "Inter",
                fontWeight: sel ? 700 : 500,
                fontSize: 14,
                letterSpacing: "-.01em",
                color: sel ? "#0A0A0A" : "#4B5563",
                whiteSpace: "nowrap",
                transition: "all .2s",
              }}
            >
              {opt.label}
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
  interes,
  onInteres,
  label,
  onBack,
  onNext,
}: {
  size: SizeAnswers;
  setSize: (s: SizeAnswers) => void;
  interes: "si" | "no" | null;
  onInteres: (v: "si" | "no") => void;
  label: string;
  onBack?: () => void;
  onNext: () => void;
}) {
  const complete = interes === "si" && sizeComplete(size);
  return (
    <div>
      {onBack && <BackBtn onClick={onBack} />}
      <StepHeader
        label={label}
        title={
          <>
            ¿Clinera es para{" "}
            <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              tu clínica
            </em>
            ?
          </>
        }
        sub="Una pregunta rápida antes de coordinar tu reunión."
      />

      {/* Pregunta de interés (gate) — precio de entrada */}
      <div
        style={{
          background: "linear-gradient(135deg,#F4F8FF 0%,#FAF5FF 100%)",
          border: "1px solid rgba(124,58,237,.16)",
          borderRadius: 14,
          padding: "16px 18px",
          marginBottom: 18,
        }}
      >
        <p style={{ fontFamily: "Inter", fontSize: 14, color: "#374151", lineHeight: 1.5, margin: "0 0 12px" }}>
          Clinera es para clínicas en crecimiento que necesitan ordenarse con IA, desde{" "}
          <strong style={{ color: "#0A0A0A" }}>US$279/mes</strong>. ¿Te interesa?
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => onInteres("si")}
            style={{
              flex: 1,
              padding: "12px 14px",
              border: "1.5px solid " + (interes === "si" ? "#0A0A0A" : "#D7C9F0"),
              borderRadius: 12,
              background: interes === "si" ? "#0A0A0A" : "#fff",
              color: interes === "si" ? "#fff" : "#0A0A0A",
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: 14.5,
              letterSpacing: "-.01em",
              cursor: "pointer",
              transition: "all .2s",
            }}
          >
            Sí, me interesa
          </button>
          <button
            type="button"
            onClick={() => onInteres("no")}
            style={{
              flex: "0 0 auto",
              padding: "12px 18px",
              border: "1.5px solid #E7EBF0",
              borderRadius: 12,
              background: "#fff",
              color: "#6B7280",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: 14.5,
              cursor: "pointer",
              transition: "all .2s",
            }}
          >
            No
          </button>
        </div>
      </div>

      {/* Datos de tamaño — sólo si dijo que le interesa */}
      {interes === "si" && (
        <div key="size-groups" style={{ animation: "ventasFadeUp .3s ease both" }}>
          <ChipGroup
            groupLabel="¿Cuántas sucursales tienes?"
            options={SUCURSALES_OPTIONS}
            selected={size.sucursales}
            onSelect={(o) => setSize({ ...size, sucursales: o })}
          />
          <ChipGroup
            groupLabel="¿Cuántos pacientes atiendes al mes?"
            options={PACIENTES_OPTIONS}
            selected={size.pacientes}
            onSelect={(o) => setSize({ ...size, pacientes: o })}
          />
        </div>
      )}

      <SubmitBtn enabled={complete} onClick={() => complete && onNext()}>
        Continuar
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
}: {
  form: Form;
  setForm: (f: Form) => void;
  label?: string;
  onBack: () => void;
  onNext: () => void;
}) {
  const [attempted, setAttempted] = useState(false);
  const phoneFieldLabel = "Tu WhatsApp personal (dueño/a o gerente)";
  const phoneHelper = "Te escribimos directo a quien decide, no a recepción.";
  const rule = PHONE_RULES[form.prefix];
  const digits = form.phone.replace(/\D/g, "");
  const nameOk = form.nombre.trim().length >= 2;
  const clinicOk = form.clinica.trim().length >= 2;
  const clinicTypeOk = form.tipoClinica !== "";
  const phoneLengthOk = digits.length === rule.len;
  const phonePatternOk = rule.pattern.test(digits);
  const phoneOk = phoneLengthOk && phonePatternOk;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const allOk = nameOk && clinicOk && clinicTypeOk && phoneOk && emailOk;

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
          <>
            Tus{" "}
            <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>datos</em>{" "}
            de contacto
          </>
        }
        sub="Te confirmamos por WhatsApp."
      />

      {/* Card de inversión transparente — siempre visible, sin acordeón */}
      <div
        style={{
          background: "#FAFBFD",
          border: "1px solid #E7EBF0",
          borderRadius: 14,
          padding: "15px 17px",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "#6B7280",
            marginBottom: 8,
          }}
        >
          Inversión transparente
        </div>
        <div style={{ fontFamily: "Inter", fontSize: 19, fontWeight: 800, letterSpacing: "-.02em", color: "#0A0A0A", lineHeight: 1.15 }}>
          Implementación única de US$450
        </div>
        <div style={{ marginTop: 7, fontFamily: "Inter", fontSize: 13, color: "#4B5563", lineHeight: 1.5 }}>
          Incluye tu ingeniero dedicado: migración completa, configuración de IA y capacitación del equipo.
        </div>
        <div style={{ marginTop: 10, fontFamily: "Inter", fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>
          1 de cada 5 horas agendadas se pierde por inasistencias. Eso empieza a recuperarse desde la primera semana.
        </div>
      </div>

      <Field label="Nombre" required error={attempted && !nameOk ? "Ingresa tu nombre." : undefined}>
        <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre completo" autoComplete="name" error={attempted && !nameOk} />
      </Field>
      <Field label="Nombre de la clínica" required error={attempted && !clinicOk ? "Ingresa el nombre de tu clínica." : undefined}>
        <Input value={form.clinica} onChange={(e) => setForm({ ...form, clinica: e.target.value })} placeholder="Ej: Clínica Sonríe" autoComplete="organization" error={attempted && !clinicOk} />
      </Field>
      <Field label="Tipo de clínica" required error={attempted && !clinicTypeOk ? "Selecciona el tipo de clínica." : undefined}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {CLINIC_TYPE_OPTIONS.map((opt) => {
            const sel = form.tipoClinica === opt.id;
            const showErr = attempted && !clinicTypeOk;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setForm({ ...form, tipoClinica: opt.id })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "13px 14px",
                  border: "1.5px solid " + (sel ? "#0A0A0A" : showErr ? "#E74C3C" : "#E7EBF0"),
                  borderRadius: 12,
                  background: sel ? "#FAFBFD" : "#fff",
                  cursor: "pointer",
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: 14.5,
                  letterSpacing: "-.01em",
                  color: "#0A0A0A",
                  transition: "all .2s",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </Field>
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
            <option value="+56">🇨🇱 +56</option>
            <option value="+52">🇲🇽 +52</option>
            <option value="+54">🇦🇷 +54</option>
            <option value="+507">🇵🇦 +507</option>
            <option value="+506">🇨🇷 +506</option>
            <option value="+595">🇵🇾 +595</option>
            <option value="+34">🇪🇸 +34</option>
            <option value="+51">🇵🇪 +51</option>
            <option value="+1">🇵🇷 +1</option>
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
      <FormNote>Sin compromiso · 30 min por videollamada</FormNote>
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
  software: SoftwareId | null;
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
      software ? `Software actual: ${SOFTWARE_LABELS[software]}` : null,
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
        {!calLoaded && (
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
          </div>
        )}
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
      <FormNote>
        <strong>Sin compromiso</strong> · 30 min por videollamada
      </FormNote>
    </div>
  );
}

// ============== SUCCESS ==============
function formatBookingDate(iso?: string | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString("es-CL", {
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

function StepSuccess({
  form,
  software,
  size,
  booking,
}: {
  form: Form;
  software: SoftwareId | null;
  size: SizeAnswers;
  booking: CalBooking | null;
}) {
  const bookingLabel = formatBookingDate(booking?.date);
  const softwareLabel = software ? SOFTWARE_LABELS[software] : "";
  const sizeLabel = sizeSummaryLabel(size);
  const msg = encodeURIComponent(
    `Hola Clinera, acabo de agendar una reunión comercial desde /ventas.\n\nNombre: ${form.nombre}\nClínica: ${form.clinica}\nEmail: ${form.email}${softwareLabel ? `\nSoftware actual: ${softwareLabel}` : ""}${sizeLabel ? `\nTamaño: ${sizeLabel}` : ""}${bookingLabel ? `\nCuándo: ${bookingLabel}` : ""}`,
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
function StepHeader({ label, title, sub }: { label: string; title: React.ReactNode; sub: string }) {
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
  return <div style={{ textAlign: "center", fontFamily: "Inter", fontSize: 12.5, color: "#9CA3AF", marginTop: 12, fontWeight: 400 }}>{children}</div>;
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
