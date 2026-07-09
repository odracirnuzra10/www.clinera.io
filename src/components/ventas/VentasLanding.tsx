"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  buildCalLinkWithAttribution,
  getAttributionPayload,
} from "@/lib/gclid";
import { getClineraMetaIds } from "@/lib/metaIds";

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

type LeadRole = "owner" | "admin" | "doctor" | "reception";
const LEAD_ROLE_OPTIONS: { id: LeadRole; title: string; desc: string }[] = [
  { id: "owner", title: "Dueño/a", desc: "Soy quien decide en la clínica." },
  { id: "admin", title: "Administrador/a", desc: "Coordino las operaciones del día a día." },
  { id: "doctor", title: "Doctor/a o Profesional", desc: "Atiendo pacientes y participo en decisiones." },
  { id: "reception", title: "Recepción / Asistente", desc: "Estoy buscando información para el dueño." },
];
const LEAD_ROLE_LABELS: Record<LeadRole, string> = {
  owner: "Dueño/a",
  admin: "Administrador/a",
  doctor: "Doctor/a o Profesional",
  reception: "Recepción / Asistente",
};

type Challenge = { id: string; emoji: string; title: string; desc: string };
const CHALLENGES: Challenge[] = [
  { id: "automatizar", emoji: "⚡", title: "Automatizar respuestas", desc: "WhatsApp, email y agendamiento sin intervención manual." },
  { id: "centralizar", emoji: "🧩", title: "Centralizar todo", desc: "Agenda, mensajería y pacientes en una sola plataforma." },
  { id: "responder", emoji: "💬", title: "Responder más rápido", desc: "Disponibilidad 24/7 en WhatsApp, reducir tiempos de espera." },
  { id: "convertir", emoji: "🎯", title: "Convertir consultas", desc: "IA que diagnostica, muestra casos de éxito y cierra la venta." },
];

type MigrationIntent = "no_software" | "yes_migrate" | "maybe" | "no_migrate";
type MigrationOption = {
  id: MigrationIntent;
  title: string;
  desc: string;
  priority?: boolean;
};

const MIGRATION_OPTIONS: MigrationOption[] = [
  {
    id: "no_software",
    title: "No tenemos software",
    desc: "Buscamos implementar uno desde cero.",
    priority: true,
  },
  {
    id: "yes_migrate",
    title: "Queremos migrar a Clinera",
    desc: "Estamos abiertos a centralizar la operación.",
  },
  {
    id: "maybe",
    title: "Queremos evaluarlo",
    desc: "Déjanos tus datos y revisamos compatibilidad.",
  },
  {
    id: "no_migrate",
    title: "Mantendremos nuestro software",
    desc: "Por ahora no buscamos migrar.",
  },
];

const MIGRATION_LABELS: Record<MigrationIntent, string> = MIGRATION_OPTIONS.reduce(
  (acc, opt) => ({ ...acc, [opt.id]: opt.title }),
  {} as Record<MigrationIntent, string>,
);

const WEBHOOK_URL = "https://n8n.oacg.cl/webhook/088a2cfe-5c93-4a4b-a4e5-ac2617979ea5";
const WA_NUMBER = "56985581524";

type Form = { nombre: string; clinica: string; prefix: string; phone: string; email: string };

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

const MIGRATION_MONDAY: Record<MigrationIntent, string | null> = {
  no_software: "no tiene software",
  yes_migrate: "quiere migrar",
  maybe: "quiere evaluarlo",
  no_migrate: null,
};

function getMigrationMeta(migrationIntent: MigrationIntent | null) {
  if (!migrationIntent) return {};

  return {
    migration_intent: migrationIntent,
    migration_intent_label: MIGRATION_LABELS[migrationIntent],
    monday_initial_status: MIGRATION_MONDAY[migrationIntent] ?? "",
    lead_priority:
      migrationIntent === "no_software"
        ? "high"
        : migrationIntent === "maybe"
          ? "manual_review"
          : "standard",
    calendar_access:
      migrationIntent === "maybe"
        ? "manual_review"
        : migrationIntent === "no_migrate"
          ? "not_available"
          : "allowed",
  };
}

function trackQualificationSelected(migrationIntent: MigrationIntent) {
  if (typeof window === "undefined") return;
  const meta = getMigrationMeta(migrationIntent);

  if (window.dataLayer) {
    window.dataLayer.push({ event: `qualification_selected:${migrationIntent}`, ...meta });
    window.dataLayer.push({ event: "qualification_selected", ...meta });
  }

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", `qualification_selected:${migrationIntent}`, meta);
  }
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
            REUNIÓN COMERCIAL · 30 MIN
            <span style={{ color: "#9CA3AF" }}>·</span>
            <span style={{ color: "#10B981", textTransform: "none", letterSpacing: "0.08em" }}>sin compromiso</span>
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
              Integraciones
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
                  .fill(["Reservo", "Dentalink", "Medilink", "AgendaPro", "WhatsApp Business"])
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
  const [migrationIntent, setMigrationIntent] = useState<MigrationIntent | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [leadRole, setLeadRole] = useState<LeadRole | null>(null);
  const [form, setForm] = useState<Form>({ nombre: "", clinica: "", prefix: "+56", phone: "", email: "" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [leadCtx, setLeadCtx] = useState<{ eventId: string; leadSource: string } | null>(null);
  const [booking, setBooking] = useState<CalBooking | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [terminalState, setTerminalState] = useState<"manual_review" | "not_compatible" | null>(null);
  const hasQualification = enableMigrationQualification;
  const totalSteps = hasQualification ? 5 : 4;
  const challengeStep = hasQualification ? 2 : 1;
  const roleStep = hasQualification ? 3 : 2;
  const contactStep = hasQualification ? 4 : 3;
  const calStep = hasQualification ? 5 : 4;

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

      {!submitted && !terminalState && hasQualification && step === 1 && (
        <StepMigrationQualification
          migrationIntent={migrationIntent}
          setMigrationIntent={(intent) => {
            setMigrationIntent(intent);
            trackQualificationSelected(intent);
            if (intent === "no_migrate") {
              setTimeout(() => {
                setStep(totalSteps);
                setTerminalState("not_compatible");
              }, 260);
              return;
            }
            setTimeout(() => setStep(challengeStep), 300);
          }}
        />
      )}
      {!submitted && !terminalState && step === challengeStep && (
        <StepChallenge
          challenge={challenge}
          label={`Paso ${challengeStep} de ${totalSteps}`}
          setChallenge={(c) => {
            setChallenge(c);
            if (typeof window !== "undefined" && typeof window.fbq === "function") {
              window.fbq("track", "ViewContent", {
                content_name: "Clinera Ventas",
                challenge: c.id,
                ...(migrationIntent ? { migration_intent: migrationIntent } : {}),
              });
            }
            setTimeout(() => setStep(roleStep), 300);
          }}
        />
      )}
      {!submitted && !terminalState && step === roleStep && (
        <StepRole
          leadRole={leadRole}
          label={`Paso ${roleStep} de ${totalSteps}`}
          onBack={() => setStep(challengeStep)}
          setLeadRole={(role) => {
            setLeadRole(role);
            if (typeof window !== "undefined" && window.dataLayer) {
              window.dataLayer.push({ event: "ventas_select_role", lead_role: role });
            }
            setTimeout(() => setStep(contactStep), 280);
          }}
        />
      )}
      {!submitted && !terminalState && step === contactStep && (
        <StepContact
          form={form}
          setForm={setForm}
          errors={errors}
          setErrors={setErrors}
          leadRole={leadRole}
          label={`Paso ${contactStep} de ${totalSteps}`}
          onBack={() => setStep(roleStep)}
          onNext={() => {
            if (typeof window !== "undefined" && typeof window.fbq === "function") {
              window.fbq("track", "InitiateCheckout", {
                content_name: "Clinera Ventas",
                ...(migrationIntent ? { migration_intent: migrationIntent } : {}),
              });
            }
            // Capturar el lead en n8n en background — sin bloquear el avance al embed.
            // El fetch usa keepalive, así que se completa aunque cambie de pestaña.
            submitPartialLead({ form, challenge, migrationIntent, leadRole }).then((ctx) => {
              if (ctx) setLeadCtx(ctx);
            });
            if (migrationIntent === "maybe") {
              setStep(totalSteps);
              setTerminalState("manual_review");
              return;
            }
            setStep(calStep);
          }}
        />
      )}
      {!submitted && !terminalState && step === calStep && (
        <StepCalCom
          form={form}
          challenge={challenge}
          migrationIntent={migrationIntent}
          label={`Paso ${calStep} de ${totalSteps}`}
          onBack={() => setStep(contactStep)}
          onBooked={async (calBooking) => {
            setBooking(calBooking);
            await submitBookingConfirmation({ form, challenge, migrationIntent, leadRole, leadCtx, booking: calBooking });
            setSubmitted(true);
          }}
        />
      )}
      {terminalState === "manual_review" && <StepManualReviewClose />}
      {terminalState === "not_compatible" && <StepNotCompatibleClose />}
      {submitted && <StepSuccess form={form} challenge={challenge} booking={booking} migrationIntent={migrationIntent} />}
    </div>
  );
}

// ============== SUBMIT + META DEDUP ==============
// El lead se captura en DOS etapas:
// 1) submitPartialLead — al final del paso 2 (datos de contacto). Garantiza que n8n
//    reciba el lead aunque después abandone el embed de Cal.com.
// 2) submitBookingConfirmation — cuando Cal.com dispara `bookingSuccessful`.
//    Manda los detalles del calendario y referencia al lead anterior.

type CalBooking = {
  booking?: { uid?: string; eventTypeId?: number; startTime?: string; endTime?: string };
  eventType?: { title?: string; slug?: string; length?: number };
  date?: string;
  duration?: number;
  organizer?: { name?: string; email?: string; timeZone?: string };
  confirmed?: boolean;
};

async function submitPartialLead({
  form,
  challenge,
  migrationIntent,
  leadRole,
}: {
  form: Form;
  challenge: Challenge | null;
  migrationIntent?: MigrationIntent | null;
  leadRole?: LeadRole | null;
}): Promise<{ eventId: string; leadSource: string } | null> {
  if (!challenge) return null;

  const eventId = "ventas_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
  const eventTime = Math.floor(Date.now() / 1000);

  const fbp = getCookie("_fbp");
  let fbc = getCookie("_fbc");
  if (!fbc && typeof window !== "undefined") {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  const leadSource = detectLeadSource();
  const rule = PHONE_RULES[form.prefix];
  const digits = form.phone.replace(/\D/g, "");
  const migrationMeta = getMigrationMeta(migrationIntent ?? null);

  // Fire Pixel MQL — el lead está calificado: nombre + clínica + tel + email.
  // El booking en Cal.com es un upgrade adicional, no un requisito para considerarlo MQL.
  // Mismo eventID que va al webhook n8n → dedup con el evento server-side MQL (CAPI).
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(
      "track",
      "MQL",
      {
        content_name: "Clinera Ventas",
        content_category: "booking",
        lead_source: leadSource,
        booking_status: "pending",
        value: 10,
        currency: "USD",
        ...migrationMeta,
      },
      { eventID: eventId },
    );
  }

  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "ventas_submit_lead",
      lead_source: leadSource,
      challenge: challenge.id,
      event_id: eventId,
      booking_status: "pending",
      ...migrationMeta,
    });
  }

  const adAttribution = getAttributionPayload();

  const payload = {
    event_id: eventId,
    event_time: eventTime,
    event_source_url: typeof window !== "undefined" ? window.location.href : "",
    action_source: "website",
    fbp,
    fbc,
    // Identificadores de Meta para CAPI (meta_fbc / meta_fbp / fbclid) — los lee
    // n8n. Capturados en el pageview inicial y persistidos en sessionStorage.
    ...getClineraMetaIds(),
    client_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",

    booking_status: "pending",
    lead_source: leadSource,
    ...migrationMeta,
    ...adAttribution,
    challenge_id: challenge.id,
    challenge_label: challenge.title,
    lead_role: leadRole ?? "",
    solicitante: leadRole ? LEAD_ROLE_LABELS[leadRole] : "",
    nombre: form.nombre.trim(),
    nombre_clinica: form.clinica.trim(),
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

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (e) {
    console.error("Partial lead webhook failed", e);
  }

  return { eventId, leadSource };
}

async function submitBookingConfirmation({
  form,
  challenge,
  migrationIntent,
  leadRole,
  leadCtx,
  booking,
}: {
  form: Form;
  challenge: Challenge | null;
  migrationIntent?: MigrationIntent | null;
  leadRole?: LeadRole | null;
  leadCtx: { eventId: string; leadSource: string } | null;
  booking: CalBooking;
}) {
  if (!challenge) return;

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
        ...getMigrationMeta(migrationIntent ?? null),
      },
      { eventID: confirmEventId },
    );
  }

  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "ventas_booking_confirmed",
      lead_event_id: leadCtx?.eventId,
      cal_booking_uid: booking?.booking?.uid,
      cal_date: booking?.date,
      ...getMigrationMeta(migrationIntent ?? null),
    });
  }

  const rule = PHONE_RULES[form.prefix];
  const digits = form.phone.replace(/\D/g, "");
  const migrationMeta = getMigrationMeta(migrationIntent ?? null);
  const adAttribution = getAttributionPayload();

  const payload = {
    event_id: confirmEventId,
    parent_event_id: leadCtx?.eventId ?? null,
    event_time: Math.floor(Date.now() / 1000),
    booking_status: "confirmed",

    // Atribución de Google Ads (gclid/gbraid/wbraid) para offline conversions
    ...adAttribution,
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
    ...migrationMeta,
    challenge_id: challenge.id,
    challenge_label: challenge.title,
    lead_role: leadRole ?? "",
    solicitante: leadRole ? LEAD_ROLE_LABELS[leadRole] : "",
    nombre: form.nombre.trim(),
    nombre_clinica: form.clinica.trim(),
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

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (e) {
    console.error("Booking confirmation webhook failed", e);
  }
}

// ============== STEP — ROLE ==============
function StepRole({
  leadRole,
  setLeadRole,
  label,
  onBack,
}: {
  leadRole: LeadRole | null;
  setLeadRole: (role: LeadRole) => void;
  label: string;
  onBack: () => void;
}) {
  return (
    <div>
      <BackBtn onClick={onBack} />
      <StepHeader
        label={label}
        title={
          <>
            ¿Cuál es tu{" "}
            <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>rol</em>{" "}
            en la clínica?
          </>
        }
        sub="Adaptamos la reunión a quien la está agendando."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {LEAD_ROLE_OPTIONS.map((opt, index) => {
          const sel = leadRole === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setLeadRole(opt.id)}
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
                minHeight: 64,
                overflow: "hidden",
                transition: "all .2s",
              }}
            >
              {sel && <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: GRAD }} />}
              <span
                className="ventas-challenge-icon"
                style={{
                  flexShrink: 0,
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: sel ? GRAD : "linear-gradient(135deg,#F4F8FF 0%,#FAF5FF 100%)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 14,
                  fontWeight: 700,
                  color: sel ? "#fff" : "#7C3AED",
                  boxShadow: sel ? "0 6px 14px -4px rgba(124,58,237,.4)" : "none",
                  transition: "all .25s",
                }}
              >
                {index + 1}
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                <span className="ventas-challenge-title" style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-.012em" }}>{opt.title}</span>
                <span className="ventas-challenge-desc" style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.4 }}>{opt.desc}</span>
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

// ============== STEP 1 — MIGRATION QUALIFICATION ==============
function StepMigrationQualification({
  migrationIntent,
  setMigrationIntent,
}: {
  migrationIntent: MigrationIntent | null;
  setMigrationIntent: (intent: MigrationIntent) => void;
}) {
  return (
    <div>
      <StepHeader
        label="Paso 1 de 4"
        title={
          <>
            Situación{" "}
            <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              actual
            </em>
          </>
        }
        sub="Antes de agendar, cuéntanos si tu clínica busca implementar o migrar a Clinera."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MIGRATION_OPTIONS.map((opt, index) => {
          const sel = migrationIntent === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setMigrationIntent(opt.id)}
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
              <span
                className="ventas-challenge-icon"
                style={{
                  flexShrink: 0,
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: sel ? GRAD : "linear-gradient(135deg,#F4F8FF 0%,#FAF5FF 100%)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 14,
                  fontWeight: 700,
                  color: sel ? "#fff" : "#7C3AED",
                  boxShadow: sel ? "0 6px 14px -4px rgba(124,58,237,.4)" : "none",
                  transition: "all .25s",
                }}
              >
                {index + 1}
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span className="ventas-challenge-title" style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-.012em" }}>{opt.title}</span>
                  {opt.priority && (
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        color: "#065F46",
                        background: "rgba(16,185,129,.10)",
                        border: "1px solid rgba(16,185,129,.24)",
                        borderRadius: 999,
                        padding: "3px 7px",
                        lineHeight: 1,
                      }}
                    >
                      Atención prioritaria
                    </span>
                  )}
                </span>
                <span className="ventas-challenge-desc" style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.4 }}>{opt.desc}</span>
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

// ============== STEP 2 ==============
function StepChallenge({
  challenge,
  setChallenge,
  label = "Paso 1 de 3",
}: {
  challenge: Challenge | null;
  setChallenge: (c: Challenge) => void;
  label?: string;
}) {
  return (
    <div>
      <StepHeader
        label={label}
        title={
          <>
            ¿Cuál es tu{" "}
            <em style={{ fontStyle: "normal", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              mayor desafío
            </em>
            ?
          </>
        }
        sub="Selecciona el que mejor describe tu situación. Personalizaremos Clinera para tu caso."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {CHALLENGES.map((opt) => {
          const sel = challenge?.id === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setChallenge(opt)}
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
              <span
                className="ventas-challenge-icon"
                style={{
                  flexShrink: 0,
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: sel ? GRAD : "linear-gradient(135deg,#F4F8FF 0%,#FAF5FF 100%)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  lineHeight: 1,
                  boxShadow: sel ? "0 6px 14px -4px rgba(124,58,237,.4)" : "none",
                  transition: "all .25s",
                }}
              >
                {opt.emoji}
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span className="ventas-challenge-title" style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-.012em" }}>{opt.title}</span>
                <span className="ventas-challenge-desc" style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.4 }}>{opt.desc}</span>
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

// ============== STEP 2 ==============
function StepContact({
  form,
  setForm,
  errors,
  setErrors,
  leadRole,
  label = "Paso 2 de 3",
  onBack,
  onNext,
}: {
  form: Form;
  setForm: (f: Form) => void;
  errors: Record<string, boolean>;
  setErrors: (e: Record<string, boolean>) => void;
  leadRole?: LeadRole | null;
  label?: string;
  onBack: () => void;
  onNext: () => void;
}) {
  const isReception = leadRole === "reception";
  const phoneFieldLabel = isReception ? "WhatsApp del dueño o administrador" : "Tu WhatsApp personal";
  const phoneHelper = isReception
    ? "Necesitamos coordinar con quien toma la decisión. Pídele su número y vuelve."
    : "Te escribimos directo a ti, no a recepción. Coordinar la demo toma 2 minutos.";
  const rule = PHONE_RULES[form.prefix];
  const digits = form.phone.replace(/\D/g, "");
  const nameOk = form.nombre.trim().length >= 2;
  const clinicOk = form.clinica.trim().length >= 2;
  const phoneLengthOk = digits.length === rule.len;
  const phonePatternOk = rule.pattern.test(digits);
  const phoneOk = phoneLengthOk && phonePatternOk;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const allOk = nameOk && clinicOk && phoneOk && emailOk;

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
      setErrors({ nombre: !nameOk, clinica: !clinicOk, phone: !phoneOk, email: !emailOk });
      setTimeout(() => setErrors({}), 500);
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
        sub="Para preparar la reunión y confirmarte por WhatsApp."
      />

      <Field label="Nombre">
        <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre completo" autoComplete="name" error={!!errors.nombre} />
      </Field>
      <Field label="Nombre de la clínica">
        <Input value={form.clinica} onChange={(e) => setForm({ ...form, clinica: e.target.value })} placeholder="Ej: Clínica Sonríe" autoComplete="organization" error={!!errors.clinica} />
      </Field>
      <Field label={phoneFieldLabel}>
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
            error={!!errors.phone}
          />
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11.5,
            color: isReception ? "#B45309" : "#6B7280",
            marginTop: 7,
            lineHeight: 1.45,
            letterSpacing: ".01em",
          }}
        >
          {phoneHelper}
        </div>
        {digits.length > 0 && (
          <div style={{ fontSize: 12, color: phoneHint.cls, marginTop: 4, letterSpacing: ".01em", fontWeight: 500 }}>{phoneHint.t}</div>
        )}
      </Field>
      <Field label="Email">
        <Input type="email" inputMode="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@clinica.cl" autoComplete="email" error={!!errors.email} />
      </Field>
      <SubmitBtn enabled={allOk} onClick={submit}>
        Agenda mi demo
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
  challenge,
  migrationIntent,
  label = "Paso 3 de 3",
  onBack,
  onBooked,
}: {
  form: Form;
  challenge: Challenge | null;
  migrationIntent?: MigrationIntent | null;
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

    const notes = [
      challenge ? `Desafío: ${challenge.title}` : null,
      migrationIntent ? `Situación: ${MIGRATION_LABELS[migrationIntent]}` : null,
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
  }, [form.nombre, form.email, form.clinica, form.phone, form.prefix, challenge, migrationIntent]);

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
  challenge,
  booking,
  migrationIntent,
}: {
  form: Form;
  challenge: Challenge | null;
  booking: CalBooking | null;
  migrationIntent?: MigrationIntent | null;
}) {
  const bookingLabel = formatBookingDate(booking?.date);
  const migrationLabel = migrationIntent ? MIGRATION_LABELS[migrationIntent] : "";
  const msg = encodeURIComponent(
    `Hola Clinera, acabo de agendar una reunión comercial desde /ventas.\n\nNombre: ${form.nombre}\nClínica: ${form.clinica}\nEmail: ${form.email}${migrationLabel ? `\nSituación: ${migrationLabel}` : ""}\nDesafío: ${challenge?.title || ""}${bookingLabel ? `\nCuándo: ${bookingLabel}` : ""}`,
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

function StepManualReviewClose() {
  return (
    <TerminalMessage
      tone="review"
      title="Gracias. Revisaremos tu caso"
      body="Gracias. Revisaremos tu caso y nuestro equipo te contactará si vemos compatibilidad."
    />
  );
}

function StepNotCompatibleClose() {
  const msg = encodeURIComponent("Hola Clinera, quiero contactarlos aunque por ahora no busco migrar.");
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${msg}`;

  return (
    <TerminalMessage
      tone="info"
      title="Gracias por tu interés"
      body="Actualmente Clinera está diseñado para clínicas que buscan centralizar su operación dentro del ecosistema Clinera."
      action={
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "#25D366",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 12,
            fontFamily: "Inter",
            fontSize: 15,
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 10px 24px -8px rgba(37,211,102,.5)",
            marginTop: 22,
          }}
        >
          <WhatsAppIcon size={16} />
          Contactarnos por WhatsApp
        </a>
      }
    />
  );
}

function TerminalMessage({
  tone,
  title,
  body,
  action,
}: {
  tone: "review" | "info";
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  const isReview = tone === "review";
  return (
    <div style={{ padding: "30px 0 18px", textAlign: "center" }}>
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 999,
          background: isReview ? "rgba(124,58,237,.12)" : "rgba(59,130,246,.12)",
          border: `2px solid ${isReview ? "rgba(124,58,237,.32)" : "rgba(59,130,246,.32)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 22px",
          animation: "scaleBounce .6s ease .1s both",
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={isReview ? "#7C3AED" : "#3B82F6"} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          {isReview ? (
            <>
              <path d="M12 8v5" />
              <path d="M12 17h.01" />
              <circle cx="12" cy="12" r="9" />
            </>
          ) : (
            <>
              <path d="M20 6L9 17l-5-5" />
              <path d="M21 12a9 9 0 11-4.6-7.9" />
            </>
          )}
        </svg>
      </div>
      <h2 style={{ fontFamily: "Inter", fontSize: 30, fontWeight: 800, letterSpacing: "-.028em", color: "#0A0A0A", margin: "0 0 10px" }}>{title}</h2>
      <p style={{ fontFamily: "Inter", fontSize: 15, color: "#4B5563", lineHeight: 1.55, margin: "0 auto", maxWidth: 430 }}>
        {body}
      </p>
      {action}
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
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="ventas-field" style={{ marginBottom: 14 }}>
      <label className="ventas-field-label" style={{ fontFamily: "Inter", fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block", letterSpacing: ".01em" }}>
        {label}
      </label>
      {children}
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
