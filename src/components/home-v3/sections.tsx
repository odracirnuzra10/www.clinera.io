"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, ReactNode } from "react";
import { CtaPrimary, CtaSecondary, Eyebrow, Mono, GRAD, CnnLogo } from "@/components/brand-v3/Brand";
import { HOME_FAQ } from "@/content/home-faq";
import {
  ANNUAL_DISCOUNT_PERCENT,
  ANNUAL_MONTHS,
  CLINERA_PLANS,
  SEMESTER_DISCOUNT_PERCENT,
  SEMESTER_MONTHS,
  SETUP_FEE_AMOUNT,
  annualFirstYearSavings,
  includesFreeSetup,
  type Billing,
} from "@/content/pricing";
import { VERTEX_IA_MODELS } from "@/content/ia-stack";
import AvisoNoReemplaza from "@/components/empleado-digital/AvisoNoReemplaza";

/* ============================================================
   Reveal-on-scroll helper
   ============================================================ */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0, rootMargin: "0px 0px -5% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    const t = window.setTimeout(
      () => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in")),
      1200
    );
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, []);
}

/* ============================================================
   HERO
   ============================================================ */
export function Hero() {
  return (
    <section style={{ position: "relative", padding: "80px 80px 40px", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 85% 55% at 50% -5%, #DBEAFE 0%, #E9D5FF 30%, #FBE8F0 55%, #FFFFFF 80%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        className="home-hero-inner"
        style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}
      >
        <div
          className="home-hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div className="reveal">
            <span
              style={{
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
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                ✦
              </span>
              CLINERA O.S. · EL SISTEMA OPERATIVO DE TU CLÍNICA
              <span style={{ color: "#9CA3AF" }}>·</span>
              <span style={{ color: "#10B981", textTransform: "none", letterSpacing: "0.08em" }}>
                en vivo en Chile y México
              </span>
            </span>

            <h1
              className="home-hero-title"
              style={{
                fontFamily: "Inter",
                fontSize: 68,
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1.02,
                margin: "22px 0 0",
                color: "#0A0A0A",
              }}
            >
              {/* H1 — opción elegida (alternativa 2). Otras opciones:
                  · "El sistema con IA que opera y estandariza todas tus clínicas."
                  · "Coordina todas tus sedes y a todo tu equipo con agentes de IA." */}
              Opera 2, 5 o 20 sedes{" "}
              <span
                style={{
                  background: GRAD,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                con la misma precisión que una
              </span>
              .
            </h1>
            <p
              style={{
                fontFamily: "Inter",
                fontSize: 19,
                fontWeight: 400,
                lineHeight: 1.55,
                color: "#4B5563",
                margin: "22px 0 0",
                maxWidth: 580,
              }}
            >
              <b style={{ color: "#0A0A0A" }}>Clinera O.S.</b> es el sistema operativo con IA por el que opera tu clínica — agenda, pacientes, fichas, tratamientos, cobros y marketing — y pone agentes a trabajar sobre <b style={{ color: "#0A0A0A" }}>todo tu equipo y todas tus sedes</b> por WhatsApp: agendan, reagendan, confirman, cobran y recuperan pacientes 24/7. Toda tu operación bajo control, con visibilidad central.
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
              <CtaPrimary as={Link} href="/agenda" style={{ padding: "15px 26px", fontSize: 16 }}>
                Agendar demo <span>→</span>
              </CtaPrimary>
              <CtaSecondary as={Link} href="/demo" style={{ padding: "15px 26px", fontSize: 16 }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0A0A0A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Ver cómo funciona
              </CtaSecondary>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: 22,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex" }}>
                {["#FCE7F3", "#EDE9FE", "#DBEAFE", "#D1FAE5"].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: c,
                      border: "2px solid #fff",
                      marginLeft: i === 0 ? 0 : -8,
                      fontFamily: "Inter",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#0A0A0A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {["KM", "FR", "PS", "AL"][i]}
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 13.5, color: "#4B5563" }}>
                <b style={{ color: "#0A0A0A" }}>+500 profesionales</b> coordinados en 9 países
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 18,
                flexWrap: "wrap",
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 12,
                color: "#374151",
                letterSpacing: "0.01em",
              }}
            >
              <span
                className="live-dot"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "#10B981",
                  display: "inline-block",
                }}
              />
              <span>+52 clínicas activas</span>
              <span style={{ color: "#9CA3AF" }}>·</span>
              <span>+2.400 citas gestionadas por IA</span>
              <span style={{ color: "#9CA3AF" }}>·</span>
              <span>
                <b style={{ color: "#0A0A0A" }}>95%</b> agendadas al primer intento
              </span>
              <Link
                href="/efectividad"
                style={{
                  color: "#7C3AED",
                  textDecoration: "underline",
                  textDecorationThickness: 1,
                  textUnderlineOffset: 3,
                  marginLeft: 4,
                }}
              >
                Ver estudio →
              </Link>
            </div>
          </div>

          <div className="reveal home-hero-mockup-wrap">
            <HeroMockup />
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home-hero-grid) { grid-template-columns: 1fr !important; gap: 40px !important; }
          :global(.home-hero-title) { font-size: 48px !important; }
        }
        @media (max-width: 560px) {
          :global(.home-hero-title) { font-size: 38px !important; }
        }
      `}</style>
    </section>
  );
}

function HeroMockup() {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 30px 80px rgba(15,10,30,.12), 0 8px 20px rgba(0,0,0,.04)",
          border: "1px solid #EEECEA",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            borderBottom: "1px solid #F0F0F0",
            background: "#FAFAFA",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 999, background: "#FF5F57" }} />
            <span style={{ width: 12, height: 12, borderRadius: 999, background: "#FEBC2E" }} />
            <span style={{ width: 12, height: 12, borderRadius: 999, background: "#28C840" }} />
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 13,
              color: "#6B7280",
              letterSpacing: "-0.01em",
            }}
          >
            Agenda · Jueves 23 abril
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11.5,
              color: "#0C4A6E",
              background: "#E0F2FE",
              padding: "4px 10px",
              borderRadius: 999,
              letterSpacing: "0.04em",
            }}
          >
            24 citas
          </div>
        </div>
        <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { t: "09:00", n: "Limpieza facial · Javiera S.", d: "Confirmada · 8:12 am" },
            { t: "10:00", n: "Consulta nueva · Carla V.", d: "Agendada por AURA · hace 2 min", aura: true },
            { t: "11:30", n: "Control · Matías Ríos", d: "Confirmada · ayer" },
            { t: "12:30", n: "—", d: "Disponible", free: true },
            { t: "14:00", n: "Primera vez · Ana Méndez", d: "Confirmada · recordatorio 24h enviado" },
          ].map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                padding: "14px 12px",
                background: r.aura ? "#E0F2FE" : "transparent",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 13,
                  color: "#6B7280",
                  width: 54,
                  flex: "0 0 54px",
                  paddingTop: 2,
                  border: "1px solid " + (r.aura ? "#BAE6FD" : "#E5E7EB"),
                  borderRadius: 6,
                  textAlign: "center",
                  padding: "4px 0",
                  background: r.aura ? "#fff" : "#FAFAFA",
                }}
              >
                {r.t}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "Inter",
                    fontSize: 14.5,
                    fontWeight: 600,
                    color: r.free ? "#9CA3AF" : "#0A0A0A",
                  }}
                >
                  {r.n}
                </div>
                <div
                  style={{
                    fontFamily: "Inter",
                    fontSize: 13,
                    color: r.aura ? "#0C4A6E" : "#6B7280",
                    marginTop: 2,
                  }}
                >
                  {r.d}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating chat card — WhatsApp (borde neón verde titilando) */}
      <div
        className="wa-glow"
        style={{
          position: "absolute",
          bottom: -36,
          left: -22,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 20px 48px rgba(15,10,30,.18)",
          border: "2px solid #25D366",
          padding: 16,
          width: 320,
          zIndex: 3,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                background: "#2EA5FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              A
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: "#0A0A0A" }}>
              AURA
            </div>
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11.5,
              color: "#6B7280",
            }}
          >
            10:02
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              alignSelf: "flex-start",
              maxWidth: "85%",
              background: "#F3F4F6",
              color: "#0A0A0A",
              fontFamily: "Inter",
              fontSize: 13.5,
              padding: "10px 13px",
              borderRadius: "14px 14px 14px 4px",
              lineHeight: 1.4,
            }}
          >
            Necesito cita mañana 10am
          </div>
          <div
            className="msg-in"
            style={{
              alignSelf: "flex-end",
              maxWidth: "90%",
              background: "#2EA5FF",
              color: "#fff",
              fontFamily: "Inter",
              fontSize: 13.5,
              padding: "10px 13px",
              borderRadius: "14px 14px 4px 14px",
              lineHeight: 1.4,
              boxShadow: "0 4px 10px rgba(46,165,255,.25)",
            }}
          >
            <b>10:00 con Dra. Meza ✓</b>
            <br />
            Te agendé y te envié el recordatorio.
          </div>
        </div>
      </div>

      {/* Floating tag */}
      <div
        style={{
          position: "absolute",
          top: -14,
          right: -14,
          background: "#fff",
          border: "1px solid #F0F0F0",
          borderRadius: 12,
          padding: "10px 12px",
          boxShadow: "0 12px 32px rgba(0,0,0,.08)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          zIndex: 3,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: GRAD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          ✦
        </div>
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 10.5,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#7C3AED",
            }}
          >
            AURA · &lt; 1 s
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "#0A0A0A", fontWeight: 500 }}>
            14 citas agendadas hoy
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LOGOS
   ============================================================ */
export function Logos() {
  const clinics = [
    "Hospital del Valle",
    "Clínica Andes",
    "Clínica Providencia",
    "Dermaclinic",
    "Centro Estético Aurora",
    "Vitaderma",
    "protocololumina.cl",
    "Nuevo Ser",
  ];
  return (
    <section
      className="reveal"
      style={{ padding: "56px 80px", borderTop: "1px solid #F0F0F0", background: "#fff" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <Mono>Usado por clínicas líderes en Chile y LATAM</Mono>
        <div
          className="home-logos-grid"
          style={{
            marginTop: 26,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px 40px",
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          {clinics.map((n, i) => (
            <div
              key={i}
              style={{
                fontFamily: "Inter",
                fontSize: 17,
                fontWeight: 600,
                color: "#0A0A0A",
                letterSpacing: "-0.015em",
                opacity: 0.55,
              }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.home-logos-grid) { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   FEATURES
   ============================================================ */
export function Features() {
  return (
    <>
      {/* Section intro */}
      <section
        id="producto"
        style={{ padding: "128px 80px 80px", borderTop: "1px solid #F0F0F0", background: "#fff" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ maxWidth: 760 }}>
            <Eyebrow>Tu equipo digital</Eyebrow>
            <h2
              className="home-h2-big"
              style={{
                fontFamily: "Inter",
                fontSize: 52,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.04,
                margin: "14px 0 0",
                color: "#0A0A0A",
              }}
            >
              Tres agentes de IA que{" "}
              <span
                style={{
                  background: GRAD,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                estandarizan tu operación
              </span>{" "}
              — 24/7, sin que se escape un lead.
            </h2>
            <p
              style={{
                fontFamily: "Inter",
                fontSize: 19,
                color: "#4B5563",
                marginTop: 18,
                lineHeight: 1.55,
                maxWidth: 660,
              }}
            >
              AURA agenda por WhatsApp. CAMILA llama por teléfono. LIA decide qué hacer y por dónde. No responden — <b style={{ color: "#0A0A0A" }}>ejecutan</b>: crean citas, re-agendan, consultan pagos. Misma memoria del paciente, distinto canal.
            </p>
            <AvisoNoReemplaza />
          </div>
        </div>
      </section>

      {/* AURA */}
      <AgentSection
        id="aura"
        num="01"
        role="WhatsApp IA"
        name="AURA"
        accent="#7C3AED"
        accentSoft="rgba(124,58,237,0.08)"
        accentBorder="#DDD6FE"
        nameGrad
        sectionEyebrow="El equipo IA"
        status={{ kind: "live", label: "En vivo" }}
        stat={{ value: "94%", label: "confirmaciones automáticas" }}
        cta={{ label: "Ver a AURA en acción", href: "/demo" }}
        bg="#fff"
        features={[
          {
            tabLabel: "Agenda",
            tabIcon: <IconCalendar />,
            eyebrow: "Agenda sin colisiones",
            title: "Conecta tu agenda. Reserva sola.",
            body: "Lee tu calendario al instante. Agenda y reagenda sin pisarse con nadie.",
            bullets: [
              "Sincroniza con Google Calendar y AgendaPro",
              "Respeta tiempos por tratamiento",
              "Reagenda con un tap",
            ],
            mockup: <AgendaMockup />,
          },
          {
            tabLabel: "Contexto",
            tabIcon: <IconDatabase />,
            eyebrow: "Contexto real",
            title: "Conoce a cada paciente.",
            body: "Antes de responder, consulta tu base de datos: historial, alergias y precios vigentes.",
            bullets: [
              "Reconoce por teléfono o RUT",
              "Recuerda tratamientos y alergias",
              "Aplica precios y promos del día",
            ],
            mockup: <ContextMockup />,
          },
          {
            tabLabel: "Reactiva",
            tabIcon: <IconRefresh />,
            eyebrow: "Recuperación automática",
            title: "Pacientes dormidos vuelven solos.",
            body: "Detecta a quien no ha vuelto en 60, 90 o 180 días y lo reactiva con un mensaje personal.",
            bullets: [
              "Segmenta por tratamiento y tiempo",
              "Tu voz, no plantillas genéricas",
              "Dashboard con recuperaciones",
            ],
            mockup: <RecoveryMockup />,
          },
        ]}
      />

      {/* CAMILA — disponible hoy, entre AURA y LIA */}
      <CamilaPeek />

      {/* LIA */}
      <AgentSection
        id="lia"
        num="02"
        role="Cerebro operacional"
        name="LIA"
        accent="#0A0A0A"
        accentSoft="#F3F4F6"
        accentBorder="#E5E7EB"
        sectionEyebrow="El cerebro"
        reverse
        status={{ kind: "live", label: "En vivo" }}
        stat={{ value: "+21%", label: "cupos recuperados al mes" }}
        cta={{ label: "Ver a LIA en acción", href: "/demo" }}
        bg="#FAFBFC"
        features={[
          {
            tabLabel: "Huecos",
            tabIcon: <IconScan />,
            eyebrow: "Inteligencia operativa",
            title: "Encuentra huecos antes que tú.",
            body: "Mira tu agenda 24/7. Detecta cancelaciones, leads tibios y pacientes dormidos.",
            bullets: [
              "Cron sobre agenda y base de datos",
              "Cancelaciones de última hora",
              "Prioriza por LTV y urgencia",
            ],
            mockup: <LiaGapsMockup />,
          },
          {
            tabLabel: "Decide",
            tabIcon: <IconBranch />,
            eyebrow: "Canal correcto · cero pisadas",
            title: "Elige quién contacta y por qué canal.",
            body: "Por cada hueco asigna al mejor candidato. AURA escribe; CAMILA llama.",
            bullets: [
              "Memoria del paciente compartida",
              "Canal según historial de respuesta",
              "Si nadie contesta, escala",
            ],
            mockup: <LiaDecisionMockup />,
          },
          {
            tabLabel: "Embudo",
            tabIcon: <IconFunnel />,
            eyebrow: "Recuperación end-to-end",
            title: "Levanta lo que se perdía.",
            body: "Leads tibios, dormidos, cobros pendientes — arma cohortes y los manda a recuperar.",
            bullets: [
              "Detecta leads que no avanzaron",
              "Reactiva a 60, 90 o 180 días",
              "Reportes con cohortes y resultados",
            ],
            mockup: <LiaFunnelMockup />,
          },
        ]}
      />
    </>
  );
}

/* ============================================================
   AGENT SECTION — photo + 3 cycling features
   ============================================================ */
type AgentFeature = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  mockup: ReactNode;
  tabLabel: string;
  tabIcon: ReactNode;
};

export function AgentSection({
  id,
  num,
  role,
  name,
  accent,
  accentSoft,
  accentBorder,
  nameGrad,
  status,
  bg,
  reverse,
  sectionEyebrow,
  stat,
  cta,
  features,
}: {
  id: "aura" | "camila" | "lia";
  num: string;
  role: string;
  name: string;
  accent: string;
  accentSoft: string;
  accentBorder: string;
  nameGrad?: boolean;
  status: { kind: "live" | "soon" | "dev"; label: string };
  bg: string;
  reverse?: boolean;
  sectionEyebrow?: string;
  stat?: { value: string; label: string };
  cta?: { label: string; href: string };
  features: AgentFeature[];
}) {
  const [idx, setIdx] = useState(0);
  const [imgOk, setImgOk] = useState(true);
  const f = features[idx];

  const statusColors =
    status.kind === "live"
      ? { bg: "rgba(16,185,129,0.06)", bd: "#A7F3D0", fg: "#047857", dot: "#10B981" }
      : status.kind === "soon"
      ? { bg: "rgba(245,158,11,0.07)", bd: "#FDE68A", fg: "#B45309", dot: "#F59E0B" }
      : { bg: "rgba(124,58,237,0.06)", bd: "#DDD6FE", fg: "#7C3AED", dot: "#7C3AED" };

  return (
    <section
      id={id}
      className="agent-sec"
      style={{
        padding: "176px 80px",
        background: bg,
        borderTop: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {sectionEyebrow && (
          <div className="reveal" style={{ marginBottom: 36, display: "flex", alignItems: "center", gap: 14 }}>
            <Eyebrow style={{ color: accent }}>{sectionEyebrow}</Eyebrow>
            <span style={{ height: 1, width: 56, background: accentBorder, display: "inline-block" }} />
          </div>
        )}
        <div
          className="agent-grid reveal"
          style={{
            display: "grid",
            gridTemplateColumns: reverse ? "1.42fr 0.58fr" : "0.58fr 1.42fr",
            gap: 56,
            alignItems: "flex-start",
          }}
        >
          {/* LEFT: portrait + identity (or features-col when reverse) */}
          <div
            className="agent-portrait-col"
            style={{ display: "flex", flexDirection: "column", gap: 24, order: reverse ? 2 : 1 }}
          >
            <div
              className="agent-portrait agent-float"
              style={{
                position: "relative",
                aspectRatio: "4 / 5",
                borderRadius: 18,
                overflow: "hidden",
                background: `radial-gradient(circle at 30% 22%, rgba(255,255,255,0.22), transparent 55%), linear-gradient(160deg, ${accent}, ${mix(accent, "#0A0A0A", 0.55)})`,
                boxShadow: "0 32px 80px -32px rgba(10,10,10,0.35), 0 1px 0 rgba(10,10,10,0.04)",
              }}
            >
              {/* Always-visible initial as base layer */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Inter",
                  fontWeight: 800,
                  fontSize: "clamp(120px, 16vw, 210px)",
                  color: "#fff",
                  opacity: 0.92,
                  letterSpacing: "-0.06em",
                  lineHeight: 1,
                  textShadow: "0 8px 40px rgba(0,0,0,0.18)",
                  zIndex: 0,
                }}
              >
                {name[0]}
              </span>
              {/* Photo overlay (hidden if 404 / load error) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/agents/${id}.jpg`}
                alt={`${name} · agente IA`}
                onError={() => setImgOk(false)}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  opacity: imgOk ? 1 : 0,
                  transition: "opacity 250ms ease",
                  zIndex: 1,
                }}
              />
              {/* Channel chip top-right */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.95)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: accent,
                  boxShadow: "0 8px 24px -8px rgba(0,0,0,0.25)",
                  zIndex: 2,
                }}
              >
                <ChannelIcon agent={id} />
              </div>
              {/* Stat chip bottom-left (small, out of the face) */}
              {stat && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 14,
                    left: 14,
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    borderRadius: 10,
                    padding: "7px 10px",
                    boxShadow: "0 6px 18px -8px rgba(0,0,0,0.28)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    zIndex: 2,
                    display: "inline-flex",
                    alignItems: "baseline",
                    gap: 8,
                    maxWidth: "82%",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Inter",
                      fontSize: 15,
                      fontWeight: 800,
                      letterSpacing: "-0.015em",
                      color: accent,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      fontSize: 9,
                      letterSpacing: "0.04em",
                      color: "#0A0A0A",
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              )}
            </div>
            <div className="agent-id" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Mono style={{ color: "#6B7280" }}>
                <span style={{ color: "#0A0A0A", fontWeight: 500 }}>{num}</span> · {role}
              </Mono>
              <h3
                style={{
                  fontFamily: "Inter",
                  fontWeight: 800,
                  fontSize: "clamp(48px, 5.5vw, 72px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.95,
                  margin: 0,
                  color: "#0A0A0A",
                  ...(nameGrad
                    ? {
                        background: GRAD,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }
                    : {}),
                }}
              >
                {name}
              </h3>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "6px 12px",
                  borderRadius: 999,
                  alignSelf: "flex-start",
                  border: `1px solid ${statusColors.bd}`,
                  background: statusColors.bg,
                  color: statusColors.fg,
                }}
              >
                <span
                  className={status.kind === "live" || status.kind === "dev" ? "live-dot" : ""}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: statusColors.dot,
                  }}
                />
                {status.label}
              </span>
            </div>
          </div>

          {/* RIGHT: cycling features (or LEFT when reverse) */}
          <div
            className="agent-features-col"
            style={{ display: "flex", flexDirection: "column", minWidth: 0, order: reverse ? 1 : 2 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                marginBottom: 20,
              }}
            >
              <Mono style={{ color: "#9CA3AF" }}>
                <span style={{ color: "#0A0A0A", fontWeight: 500 }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>{" "}
                / 03 · Funciones
              </Mono>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {features.map((feat, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    aria-label={`Función ${i + 1}: ${feat.tabLabel}`}
                    aria-selected={i === idx}
                    style={{
                      cursor: "pointer",
                      border: `1px solid ${i === idx ? accent : "#E5E7EB"}`,
                      padding: "7px 12px 7px 10px",
                      background: i === idx ? accent : "#fff",
                      color: i === idx ? "#fff" : "#374151",
                      fontFamily: "Inter",
                      fontSize: 13,
                      fontWeight: 500,
                      letterSpacing: "-0.005em",
                      borderRadius: 999,
                      transition: "background 220ms ease, color 220ms ease, border-color 220ms ease, transform 200ms ease",
                      lineHeight: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                    className="agent-tab-btn"
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 16,
                        height: 16,
                        color: i === idx ? "#fff" : accent,
                        opacity: i === idx ? 1 : 0.85,
                      }}
                      aria-hidden="true"
                    >
                      {feat.tabIcon}
                    </span>
                    <span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                          fontSize: 10.5,
                          opacity: 0.7,
                          marginRight: 6,
                          letterSpacing: "0.06em",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {feat.tabLabel}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIdx((idx + 1) % features.length)}
                style={{
                  marginLeft: "auto",
                  border: `1px solid ${accentBorder}`,
                  background: "#fff",
                  color: accent,
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "background 200ms ease, color 200ms ease",
                }}
                className="next-feat-btn"
              >
                Siguiente →
              </button>
            </div>

            {/* Stage */}
            <div
              key={`${id}-${idx}`}
              className="msg-in"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 48,
                alignItems: "flex-start",
              }}
            >
              <div className="feat-text">
                <Eyebrow style={{ color: accent }}>{f.eyebrow}</Eyebrow>
                <h4
                  style={{
                    fontFamily: "Inter",
                    fontSize: 36,
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.1,
                    margin: "16px 0 20px",
                    color: "#0A0A0A",
                  }}
                >
                  {f.title}
                </h4>
                <p
                  style={{
                    fontFamily: "Inter",
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "#4B5563",
                    margin: "0 0 32px",
                    maxWidth: 480,
                  }}
                >
                  {f.body}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {f.bullets.map((b, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                        fontFamily: "Inter",
                        fontSize: 14.5,
                        color: "#0A0A0A",
                        lineHeight: 1.5,
                      }}
                    >
                      <span
                        style={{
                          flex: "0 0 18px",
                          width: 18,
                          height: 18,
                          borderRadius: 999,
                          background: accentSoft,
                          border: `1px solid ${accentBorder}`,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: 2,
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="feat-mockup">{f.mockup}</div>
            </div>

            {/* Agent CTA */}
            {cta && (
              <div
                style={{
                  marginTop: 48,
                  paddingTop: 32,
                  borderTop: "1px solid #F0F0F0",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <Link
                  href={cta.href}
                  className="agent-cta"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: 14,
                    letterSpacing: "-0.005em",
                    padding: "13px 22px",
                    borderRadius: 999,
                    background: accent,
                    color: "#fff",
                    border: `1px solid ${accent}`,
                    transition: "transform 200ms ease, box-shadow 200ms ease",
                  }}
                >
                  {cta.label} →
                </Link>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 11,
                    color: "#9CA3AF",
                    letterSpacing: "0.04em",
                  }}
                >
                  {status.kind === "live"
                    ? "En vivo · onboarding asistido"
                    : status.kind === "soon"
                    ? "Reservá tu acceso · 0 costo extra"
                    : "Beta privada · cupos limitados"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .next-feat-btn:hover {
          background: ${accent};
          color: #fff;
        }
      `}</style>
      <style jsx global>{`
        @keyframes agentFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.012); }
        }
        .agent-float {
          animation: agentFloat 6.5s ease-in-out infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .agent-float { animation: none; }
        }
      `}</style>
      <style jsx>{`
        @media (max-width: 1100px) {
          :global(.agent-sec) { padding: 112px 32px !important; }
          :global(.agent-grid) {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          :global(.agent-grid > div) { order: unset !important; }
          :global(.agent-portrait) { aspect-ratio: 16 / 10 !important; max-height: 360px; }
        }
        @media (max-width: 760px) {
          :global(.agent-sec) { padding: 88px 28px !important; }
          :global(.agent-features-col > div:nth-child(2)) {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   CAMILA PEEK — disponible hoy, entre AURA y LIA
   ============================================================ */
function CamilaPeek() {
  const [imgOk, setImgOk] = useState(true);
  return (
    <section
      style={{
        padding: "56px 80px",
        background: "#fff",
        borderTop: "1px solid #F0F0F0",
        borderBottom: "1px solid #F0F0F0",
      }}
      className="camila-peek-sec"
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="reveal camila-peek"
          style={{
            display: "grid",
            gridTemplateColumns: "92px 1fr auto",
            gap: 24,
            alignItems: "center",
            padding: "20px 24px",
            background: "#FAFBFC",
            border: "1px solid #F0F0F0",
            borderRadius: 16,
          }}
        >
          {/* Mini portrait */}
          <div
            style={{
              position: "relative",
              width: 92,
              height: 92,
              borderRadius: 14,
              overflow: "hidden",
              background:
                "radial-gradient(circle at 30% 22%, rgba(255,255,255,0.22), transparent 55%), linear-gradient(160deg, #0891B2, #0e3548)",
              boxShadow: "0 12px 28px -14px rgba(8,145,178,0.4)",
              flexShrink: 0,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Inter",
                fontWeight: 800,
                fontSize: 56,
                color: "#fff",
                opacity: 0.92,
                letterSpacing: "-0.06em",
                zIndex: 0,
              }}
            >
              C
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/agents/camila.jpg"
              alt="CAMILA"
              onError={() => setImgOk(false)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                opacity: imgOk ? 1 : 0,
                transition: "opacity 250ms ease",
                zIndex: 1,
              }}
            />
          </div>

          {/* Text */}
          <div className="camila-peek-text" style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
              <Mono style={{ color: "#0891B2" }}>03 · Llamadas IA</Mono>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "3px 9px",
                  borderRadius: 999,
                  background: "rgba(16,185,129,0.08)",
                  color: "#047857",
                  border: "1px solid #A7F3D0",
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 999,
                    background: "#10B981",
                  }}
                />
                En vivo · desde Atlas
              </span>
            </div>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#0A0A0A",
                lineHeight: 1.3,
                marginBottom: 8,
              }}
            >
              <span style={{ marginRight: 12 }}>CAMILA</span>
              <span style={{ fontWeight: 400, color: "#4B5563", fontSize: 16 }}>
                — Lo mismo que AURA, pero hablando por teléfono.
              </span>
            </div>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 13.5,
                lineHeight: 1.5,
                color: "#374151",
                background: "#fff",
                border: "1px solid #A5F3FC",
                borderLeft: "3px solid #0891B2",
                padding: "10px 14px",
                borderRadius: 8,
                maxWidth: 600,
              }}
            >
              <b style={{ color: "#0A0A0A" }}>Disponible hoy desde Atlas</b>
              {" "}— llama para confirmar y reagendar, conectada a tu agenda. 25 créditos por minuto.
            </div>
          </div>

          {/* Action */}
          <Link
            href="/demo"
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "10px 16px",
              borderRadius: 999,
              background: "#0891B2",
              color: "#fff",
              border: "1px solid #0891B2",
              whiteSpace: "nowrap",
            }}
            className="camila-peek-cta"
          >
            Ver demo →
          </Link>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 760px) {
          :global(.camila-peek-sec) {
            padding: 32px 28px !important;
          }
          :global(.camila-peek) {
            grid-template-columns: 64px 1fr !important;
            gap: 16px !important;
            padding: 16px !important;
          }
          :global(.camila-peek > div:first-child) {
            width: 64px !important;
            height: 64px !important;
          }
          :global(.camila-peek-cta) {
            grid-column: 1 / -1;
            text-align: center;
            margin-top: 4px;
          }
        }
      `}</style>
    </section>
  );
}

/* Quick color mix util (k = 0..1 toward target) */
function mix(hex: string, target: string, k: number) {
  const h = (c: string) => {
    const x = c.replace("#", "");
    return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)];
  };
  const a = h(hex);
  const b = h(target);
  const out = a.map((v, i) => Math.round(v * (1 - k) + b[i] * k));
  return `rgb(${out[0]},${out[1]},${out[2]})`;
}

/* Tab icons (16px, stroke-based) */
const tabIconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
function IconCalendar() {
  return (
    <svg {...tabIconProps}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 10h18M8 2v4M16 2v4" />
    </svg>
  );
}
function IconDatabase() {
  return (
    <svg {...tabIconProps}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      <path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" />
    </svg>
  );
}
function IconRefresh() {
  return (
    <svg {...tabIconProps}>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <polyline points="21 4 21 10 15 10" />
    </svg>
  );
}
function IconScan() {
  return (
    <svg {...tabIconProps}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-5-5" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}
function IconBranch() {
  return (
    <svg {...tabIconProps}>
      <circle cx="6" cy="5" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M6 7v3a3 3 0 0 0 3 3h6" />
      <path d="M18 8v8" />
    </svg>
  );
}
function IconFunnel() {
  return (
    <svg {...tabIconProps}>
      <path d="M3 4h18l-7 9v6l-4 2v-8L3 4z" />
    </svg>
  );
}

function ChannelIcon({ agent }: { agent: "aura" | "camila" | "lia" }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (agent === "aura") {
    return (
      <svg {...props}>
        <path d="M3 21l1.65-3.8A9 9 0 1 1 12 20c-1.7 0-3.3-.4-4.7-1.2L3 21z" />
      </svg>
    );
  }
  if (agent === "camila") {
    return (
      <svg {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1 .35 1.96.66 2.86a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.31 1.86.53 2.86.66A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

/* ============================================================
   CAMILA mockups
   ============================================================ */
function CamilaCallMockup() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 24px 64px rgba(0,0,0,.06)",
        border: "1px solid #F0F0F0",
        padding: 22,
      }}
    >
      <Mono style={{ color: "#6B7280", marginBottom: 14, display: "block" }}>
        CAMILA · Llamada saliente
      </Mono>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 999,
            background: "rgba(8,145,178,0.10)",
            color: "#0891B2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-hidden="true"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1 .35 1.96.66 2.86a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.31 1.86.53 2.86.66A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: "#0A0A0A", letterSpacing: "-0.005em" }}>
            Diego López
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              color: "#6B7280",
              letterSpacing: "0.04em",
              marginTop: 2,
            }}
          >
            Confirmando consulta · 16:00 · 00:42
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 18 }}>
          {[6, 12, 8, 14, 9, 13, 7].map((h, i) => (
            <span
              key={i}
              style={{
                width: 2.5,
                height: h,
                background: "#0891B2",
                borderRadius: 2,
                opacity: 0.55,
              }}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          background: "#0A0A0A",
          color: "#fff",
          borderRadius: 12,
          padding: "12px 14px",
          fontFamily: "Inter",
          fontSize: 13.5,
          lineHeight: 1.55,
        }}
      >
        <Mono style={{ color: "rgba(255,255,255,0.55)", marginBottom: 8, display: "block" }}>
          Transcripción en vivo
        </Mono>
        Hola Diego, te llamo de Clínica Meza. Mañana tienes consulta a las <b style={{ color: "#fff" }}>16:00</b>. ¿La confirmas, o prefieres que la movamos?
      </div>
    </div>
  );
}

function CamilaSilenceMockup() {
  const events = [
    { t: "10:42", who: "AURA", txt: "Mensaje enviado a María R.", muted: true },
    { t: "12:08", who: "AURA", txt: "Reintento. Sin respuesta.", muted: true },
    { t: "12:30", who: "LIA", txt: "Trigger: silencio chat 1h47 + cupo libre 16:00", flag: true },
    { t: "12:31", who: "CAMILA", txt: "Llamada saliente — María R.", action: true },
  ];
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 24px 64px rgba(0,0,0,.06)",
        border: "1px solid #F0F0F0",
        padding: 22,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Mono>Línea de tiempo · paciente María R.</Mono>
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 10,
            color: "#0891B2",
            background: "rgba(8,145,178,0.08)",
            padding: "3px 8px",
            borderRadius: 999,
            border: "1px solid #A5F3FC",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          LTV alto
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {events.map((e, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "44px 70px 1fr",
              gap: 10,
              alignItems: "center",
              padding: "10px 12px",
              borderRadius: 10,
              background: e.action ? "rgba(8,145,178,0.06)" : e.flag ? "#FAFAFA" : "transparent",
              border: e.action ? "1px solid #A5F3FC" : e.flag ? "1px dashed #E5E7EB" : "0",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                color: "#9CA3AF",
              }}
            >
              {e.t}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 500,
                color:
                  e.who === "AURA" ? "#7C3AED" : e.who === "LIA" ? "#0A0A0A" : "#0891B2",
              }}
            >
              {e.who}
            </span>
            <span
              style={{
                fontFamily: "Inter",
                fontSize: 13.5,
                color: e.muted ? "#6B7280" : "#0A0A0A",
                fontWeight: e.action ? 600 : 400,
                letterSpacing: "-0.005em",
                lineHeight: 1.4,
              }}
            >
              {e.txt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CamilaVoiceMockup() {
  const sliders = [
    { l: "Tono", v: "Cercano", w: 64 },
    { l: "Ritmo", v: "Natural", w: 48 },
    { l: "Acento", v: "CL · neutro", w: 30 },
    { l: "Formalidad", v: "Médico", w: 72 },
  ];
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 24px 64px rgba(0,0,0,.06)",
        border: "1px solid #F0F0F0",
        padding: 22,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <Mono>Configuración de voz · CAMILA</Mono>
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 10,
            color: "#0891B2",
            letterSpacing: "0.08em",
          }}
        >
          ◆ entrenando con tus llamadas
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {sliders.map((s) => (
          <div
            key={s.l}
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr 110px",
              gap: 16,
              alignItems: "center",
            }}
          >
            <Mono style={{ color: "#6B7280" }}>{s.l}</Mono>
            <div style={{ position: "relative", height: 4, background: "#E5E7EB", borderRadius: 2 }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${s.w}%`,
                  background: "#0891B2",
                  borderRadius: 2,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: "#0891B2",
                  top: "50%",
                  left: `${s.w}%`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 0 0 4px rgba(8,145,178,0.16)",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 12,
                color: "#0A0A0A",
                fontWeight: 500,
                textAlign: "right",
              }}
            >
              {s.v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   LIA mockups
   ============================================================ */
function LiaGapsMockup() {
  const rows = [
    { t: "15:00", n: "Antonia Ríos", tag: "Conf." },
    { t: "16:00", n: "Hueco · cancelación 10:42", gap: true },
    { t: "17:00", n: "Hueco · sin agendar", gap: true },
    { t: "18:00", n: "Vicente Soto", tag: "Conf." },
  ];
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 24px 64px rgba(0,0,0,.06)",
        border: "1px solid #F0F0F0",
        padding: 22,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <Mono>Hoy · Dra. Meza</Mono>
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 10.5,
            color: "#F59E0B",
            background: "rgba(245,158,11,0.08)",
            padding: "3px 8px",
            borderRadius: 999,
            border: "1px solid #FDE68A",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          2 huecos detectados
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 10,
              background: r.gap ? "rgba(245,158,11,0.06)" : "#FAFAFA",
              border: r.gap ? "1px dashed #FDE68A" : "1px solid #F0F0F0",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 12,
                color: "#6B7280",
                width: 44,
              }}
            >
              {r.t}
            </span>
            <span
              style={{
                flex: 1,
                fontFamily: "Inter",
                fontSize: 13.5,
                color: r.gap ? "#B45309" : "#0A0A0A",
                fontStyle: r.gap ? "italic" : "normal",
                fontWeight: 500,
              }}
            >
              {r.n}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: r.gap ? "#B45309" : "#6B7280",
                background: r.gap ? "rgba(245,158,11,0.12)" : "#F3F4F6",
                padding: "3px 8px",
                borderRadius: 999,
                border: r.gap ? "1px solid #FDE68A" : "1px solid #E5E7EB",
              }}
            >
              {r.gap ? "Detectado" : r.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiaDecisionMockup() {
  const steps = [
    { num: "01", txt: "Hueco 17:00 detectado · 30 min libres", end: "→" },
    { num: "02", txt: "Mejor candidata: María R. · LTV $480k · sin respuesta a 2 chats", end: "→" },
    { num: "03", txt: "Acción: llamada ahora + fallback a chat", tag: "CAMILA", action: true },
  ];
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 24px 64px rgba(0,0,0,.06)",
        border: "1px solid #F0F0F0",
        padding: 22,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <Mono>LIA · Plan de contacto</Mono>
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 10.5,
            color: "#10B981",
          }}
        >
          ● procesando
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "32px 1fr auto",
              gap: 12,
              alignItems: "center",
              padding: "12px 14px",
              borderRadius: 10,
              background: s.action ? "rgba(8,145,178,0.06)" : "#FAFAFA",
              border: s.action ? "1px solid #A5F3FC" : "1px solid #F0F0F0",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                color: "#9CA3AF",
                fontWeight: 500,
                letterSpacing: "0.06em",
              }}
            >
              {s.num}
            </span>
            <span
              style={{
                fontFamily: "Inter",
                fontSize: 13.5,
                color: "#0A0A0A",
                fontWeight: s.action ? 600 : 400,
                lineHeight: 1.4,
              }}
            >
              {s.txt}
            </span>
            {s.tag ? (
              <span
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  padding: "4px 9px",
                  borderRadius: 999,
                  background: "#fff",
                  color: "#0891B2",
                  border: "1px solid #A5F3FC",
                }}
              >
                {s.tag}
              </span>
            ) : (
              <span style={{ color: "#7C3AED", fontSize: 14, fontWeight: 600 }}>{s.end}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function LiaFunnelMockup() {
  const stages = [
    { n: "Leads totales", v: "847", pct: 100 },
    { n: "Evaluación agendada", v: "312", pct: 36.8 },
    { n: "Agendaron sin comprar — LIA reactiva", v: "181", pct: 21.4, target: true },
    { n: "Cerrados esta semana", v: "47", pct: 5.5 },
  ];
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 24px 64px rgba(0,0,0,.06)",
        border: "1px solid #F0F0F0",
        padding: 22,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <Mono>Embudo activo · esta semana</Mono>
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 10.5,
            color: "#7C3AED",
          }}
        >
          ▲ +12% vs semana pasada
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {stages.map((s, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 12,
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: 10,
              background: s.target ? "rgba(124,58,237,0.05)" : "#fff",
              border: s.target ? "1px solid #DDD6FE" : "1px solid #F0F0F0",
            }}
          >
            <span
              style={{
                fontFamily: "Inter",
                fontSize: 13.5,
                color: s.target ? "#0A0A0A" : "#374151",
                fontWeight: s.target ? 600 : 500,
                letterSpacing: "-0.005em",
              }}
            >
              {s.n}
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontFamily: "Inter",
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: s.target ? "#7C3AED" : "#0A0A0A",
                }}
              >
                {s.v}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10.5,
                  color: "#9CA3AF",
                  width: 48,
                  textAlign: "right",
                }}
              >
                {s.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureRow({
  eyebrow,
  title,
  body,
  bullets,
  mockup,
  reverse,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  mockup: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className="reveal home-feature-row"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 72,
        alignItems: "center",
        padding: "72px 0",
        borderTop: "1px solid #F3F2F0",
      }}
    >
      <div style={{ order: reverse ? 2 : 1 }} className="home-feature-text">
        <Eyebrow style={{ color: "#7C3AED" }}>{eyebrow}</Eyebrow>
        <h3
          style={{
            fontFamily: "Inter",
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.06,
            margin: "14px 0 16px",
            color: "#0A0A0A",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 17,
            lineHeight: 1.6,
            color: "#4B5563",
            margin: "0 0 22px",
            maxWidth: 480,
          }}
        >
          {body}
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {bullets.map((b, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                fontFamily: "Inter",
                fontSize: 15,
                color: "#0A0A0A",
                lineHeight: 1.5,
              }}
            >
              <span
                style={{
                  flex: "0 0 18px",
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 2,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ order: reverse ? 1 : 2 }}>{mockup}</div>
      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home-feature-row) {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
            padding: 56px 0 !important;
          }
          :global(.home-feature-row > div:nth-child(1)) { order: 1 !important; }
          :global(.home-feature-row > div:nth-child(2)) { order: 2 !important; }
        }
      `}</style>
    </div>
  );
}

function AgendaMockup() {
  const rows = [
    { t: "09:00", n: "María Torres", tag: "Control" },
    { t: "10:30", n: "Pedro Rojas", tag: "Primera vez", aura: true },
    { t: "12:00", n: "—", tag: "Libre", free: true },
    { t: "15:00", n: "Luis Alonso", tag: "Pagado", paid: true, aura: true },
    { t: "16:30", n: "Ana Mena", tag: "Control" },
  ];
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 24px 64px rgba(0,0,0,.06)",
        border: "1px solid #F0F0F0",
        padding: 22,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <Mono>Agenda · Viernes 24 oct</Mono>
        <div
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            color: "#10B981",
            fontWeight: 500,
          }}
        >
          94% ocupación
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              background: r.free ? "#fff" : "#FAFAFA",
              border: "1px dashed " + (r.free ? "#E5E7EB" : "transparent"),
              borderRadius: 10,
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 12,
                color: "#6B7280",
                width: 44,
              }}
            >
              {r.t}
            </div>
            <div
              style={{
                flex: 1,
                fontSize: 13.5,
                color: r.free ? "#9CA3AF" : "#0A0A0A",
                fontWeight: r.free ? 400 : 500,
                fontFamily: "Inter",
              }}
            >
              {r.n}
            </div>
            {r.paid && (
              <span
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#059669",
                  background: "#ECFDF5",
                  padding: "3px 7px",
                  borderRadius: 999,
                  border: "1px solid #A7F3D0",
                }}
              >
                Pagado
              </span>
            )}
            <span
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: r.aura ? "#7C3AED" : "#6B7280",
                background: r.aura ? "rgba(124,58,237,.06)" : "#F3F4F6",
                padding: "3px 8px",
                borderRadius: 999,
                border: "1px solid " + (r.aura ? "#DDD6FE" : "#E5E7EB"),
              }}
            >
              {r.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContextMockup() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 24px 64px rgba(0,0,0,.06)",
        border: "1px solid #F0F0F0",
        padding: 22,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Mono>Consulta en curso · AURA</Mono>
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 10.5,
            letterSpacing: "0.08em",
            color: "#10B981",
          }}
        >
          ● leyendo BD
        </span>
      </div>
      <div
        style={{
          background: "#F8FAFC",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: 14,
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 11.5,
          color: "#374151",
          lineHeight: 1.55,
          marginBottom: 12,
        }}
      >
        <div style={{ color: "#7C3AED" }}>→ buscar_paciente(tel:&quot;+56 9 ...&quot;)</div>
        <div style={{ marginLeft: 14, marginTop: 4 }}>
          <span style={{ color: "#10B981" }}>✓</span> Carla Pérez · RUT 17.xxx.xxx-3
          <br />
          <span style={{ color: "#10B981" }}>✓</span> Última visita: 14 ago (limpieza facial)
          <br />
          <span style={{ color: "#10B981" }}>✓</span> Precio cliente recurrente: $ 38.000
        </div>
        <div style={{ color: "#7C3AED", marginTop: 6 }}>
          → horas_disponibles(prof:&quot;Meza&quot;, dia:&quot;mañana&quot;)
        </div>
        <div style={{ marginLeft: 14, marginTop: 4 }}>
          <span style={{ color: "#10B981" }}>✓</span> 10:30, 15:00
        </div>
      </div>
      <div
        style={{
          background: "#F3F4F6",
          borderRadius: 12,
          padding: "11px 13px",
          fontFamily: "Inter",
          fontSize: 13.5,
          color: "#0A0A0A",
          lineHeight: 1.5,
        }}
      >
        Hola <b>Carla</b> 👋 Tengo hora con la Dra. Meza mañana <b>10:30</b> o <b>15:00</b>. Como
        eres cliente frecuente, la limpieza queda en <b>$ 38.000</b>. ¿Cuál te acomoda?
      </div>
    </div>
  );
}

function AuraMockup() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 24px 64px rgba(0,0,0,.06),0 2px 4px rgba(0,0,0,.04)",
        border: "1px solid #F0F0F0",
        padding: 22,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: GRAD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 22,
            boxShadow: "0 8px 24px -6px rgba(124,58,237,.4)",
          }}
        >
          ✦
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: "#0A0A0A" }}>
            AURA · Clínica Andes
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#10B981",
              marginTop: 2,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              className="live-dot"
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "#10B981",
              }}
            />
            En línea · &lt;1s
          </div>
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 10.5,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#6B7280",
            background: "#F3F4F6",
            padding: "4px 8px",
            borderRadius: 999,
          }}
        >
          WhatsApp
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { k: "Agendadas", v: "94", d: "+12" },
          { k: "Confirmadas", v: "81", d: "+8" },
          { k: "Recuperadas", v: "12", d: "+3" },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: "#FAFAFA",
              borderRadius: 10,
              padding: "12px 14px",
              border: "1px solid #F0F0F0",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#6B7280",
              }}
            >
              {s.k}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#0A0A0A",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  color: "#10B981",
                  fontWeight: 500,
                }}
              >
                {s.d}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: "#FAFAFA",
          border: "1px solid #F0F0F0",
          borderRadius: 12,
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {[
          { t: "10:32", m: "Agenda creada para Carla Pérez · jueves 23, 10:30" },
          { t: "10:31", m: "Reserva cobrada · USD 22" },
          { t: "10:28", m: "Paciente recuperada: Luisa R. (sin visita 92 días)" },
        ].map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13 }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                color: "#6B7280",
                width: 44,
                flex: "0 0 44px",
                paddingTop: 1,
              }}
            >
              {e.t}
            </div>
            <div style={{ flex: 1, color: "#0A0A0A", fontFamily: "Inter", lineHeight: 1.45 }}>{e.m}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecoveryMockup() {
  const rows = [
    { n: "María G.", d: "Sin visita desde agosto", st: "Agendada", sc: "#10B981" },
    { n: "Carlos P.", d: "Cumpleaños el 22", st: "Respondió", sc: "#7C3AED" },
    { n: "Luisa R.", d: "Tratamiento interrumpido", st: "Mensaje enviado", sc: "#6B7280" },
    { n: "Ignacio V.", d: "Control pendiente", st: "Agendada", sc: "#10B981" },
  ];
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 24px 64px rgba(0,0,0,.06)",
        border: "1px solid #F0F0F0",
        padding: 22,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 16,
        }}
      >
        <div>
          <Mono>Pacientes inactivos · 90 días</Mono>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 40,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#0A0A0A",
              }}
            >
              342
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 12,
                color: "#10B981",
                fontWeight: 500,
              }}
            >
              +18 esta semana
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 48 }}>
          {[14, 22, 18, 28, 34, 30, 42, 48, 52, 44, 60, 66].map((h, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: h,
                borderRadius: 2,
                background:
                  i > 8
                    ? "linear-gradient(180deg,#D946EF 0%,#7C3AED 50%,#3B82F6 100%)"
                    : "#E5E7EB",
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              background: "#FAFAFA",
              border: "1px solid #F0F0F0",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 999,
                background: GRAD,
                color: "#fff",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontFamily: "Inter",
              }}
            >
              {r.n[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Inter", fontSize: 13.5, fontWeight: 500, color: "#0A0A0A" }}>
                {r.n}
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 12, color: "#6B7280" }}>{r.d}</div>
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: r.sc,
                background:
                  r.sc === "#10B981"
                    ? "rgba(16,185,129,.08)"
                    : r.sc === "#7C3AED"
                    ? "rgba(124,58,237,.08)"
                    : "#F3F4F6",
                padding: "4px 8px",
                borderRadius: 999,
                border:
                  "1px solid " +
                  (r.sc === "#10B981"
                    ? "#A7F3D0"
                    : r.sc === "#7C3AED"
                    ? "#DDD6FE"
                    : "#E5E7EB"),
              }}
            >
              {r.st}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   ECOSISTEMA IA · todas tus sedes en una sola IA
   ============================================================ */
export function EcosistemaIA() {
  const sources = [
    { n: "Agenda", s: "Horas y bloqueos", d: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>' },
    { n: "Sedes", s: "Toda tu operación", d: '<path d="M3 21h18M5 21V8l7-5 7 5v13M10 21v-5h4v5"/>' },
    { n: "Fichas", s: "Historial de cada paciente", d: '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 13h6M9 17h6"/>' },
    { n: "Tratamientos", s: "Precios y protocolos", d: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/>' },
    { n: "Ventas", s: "Qué se vende y cuánto", d: '<path d="M3 3v18h18"/><path d="M7 15l3-4 3 2 5-6"/>' },
    { n: "Pagos", s: "Cobros y conciliación", d: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>' },
    { n: "Marketing", s: "Campañas y difusiones", d: '<path d="M3 11l16-5v13L3 14z"/><path d="M11 15.5a3 3 0 0 1-5.5-1.5"/>' },
    { n: "WhatsApp", s: "Toda la conversación", d: '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/>' },
    { n: "Consentimientos", s: "Firmados y archivados", d: '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 15l1.5 1.5L14 13"/>' },
    { n: "Exámenes", s: "Resultados y controles", d: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' },
  ];
  const actions = [
    { n: "Agenda y reagenda", s: "Reserva y mueve horas sola", d: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4M9 15l2 2 4-4"/>' },
    { n: "Responde 24/7", s: "Por WhatsApp, sin descanso", d: '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/>' },
    { n: "Cobra y recupera", s: "Confirma pagos, reactiva pacientes", d: '<path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
    { n: "Automatiza", s: "Flujos que se disparan solos", d: '<path d="M13 2 3 14h8l-1 8 10-12h-8z"/>' },
  ];

  const icon = (d: string, color: string) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />
  );
  const srcTile = (p: { n: string; s: string; d: string }) => (
    <div key={p.n} style={{ display: "flex", alignItems: "center", gap: 11, background: "#fff", border: "1px solid #F0F0F0", borderRadius: 12, padding: "11px 13px", boxShadow: "0 3px 12px rgba(0,0,0,.03)" }}>
      <span style={{ width: 32, height: 32, borderRadius: 9, background: "#F6F5FF", border: "1px solid #EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon(p.d, "#7C3AED")}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "Inter", fontSize: 13.5, fontWeight: 600, color: "#0A0A0A", lineHeight: 1.2 }}>{p.n}</span>
        <span style={{ display: "block", fontFamily: "Inter", fontSize: 11.5, color: "#6B7280", marginTop: 1, lineHeight: 1.3 }}>{p.s}</span>
      </span>
    </div>
  );
  const actTile = (p: { n: string; s: string; d: string }) => (
    <div key={p.n} style={{ display: "flex", alignItems: "center", gap: 11, background: "#0E1014", border: "1px solid #241F34", borderRadius: 12, padding: "13px 15px", boxShadow: "0 10px 28px -14px rgba(124,58,237,.5)" }}>
      <span style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(124,58,237,.18)", border: "1px solid rgba(124,58,237,.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon(p.d, "#D8B4FE")}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "Inter", fontSize: 13.5, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>{p.n}</span>
        <span style={{ display: "block", fontFamily: "Inter", fontSize: 11.5, color: "rgba(255,255,255,.6)", marginTop: 1, lineHeight: 1.3 }}>{p.s}</span>
      </span>
    </div>
  );

  return (
    <section id="clinera-intelligence" style={{ position: "relative", padding: "112px 80px", borderTop: "1px solid #F0F0F0", background: "#FAFAFA", overflow: "hidden", scrollMarginTop: 96 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div className="reveal" style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 52px" }}>
          <Eyebrow>Clinera O.S. · El sistema operativo de tu clínica</Eyebrow>
          <h2 className="home-h2-big" style={{ fontFamily: "Inter", fontSize: 44, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, margin: "14px 0 16px", color: "#0A0A0A" }}>
            Clinera O.S.:{" "}
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>el sistema con IA por el que opera toda tu clínica</span>.
          </h2>
          <p style={{ fontFamily: "Inter", fontSize: 17, color: "#4B5563", lineHeight: 1.55, margin: 0 }}>
            Mucho más que un chatbot: agenda, pacientes, fichas clínicas, tratamientos, consentimientos, ventas, pagos, marketing y comunicación con IA por voz y texto viven en un solo sistema. Clinera O.S. entiende el contexto completo, coordina agentes y actúa —en una o en veinte sedes— con visibilidad y control central.
          </p>
        </div>

        <div className="reveal home-eco-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 0.85fr 1.1fr", gap: 28, alignItems: "center" }}>
          <div>
            <div style={{ marginBottom: 14 }}><Mono>Toda tu operación la alimenta</Mono></div>
            <div className="home-eco-src" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {sources.map(srcTile)}
            </div>
          </div>
          <div className="home-eco-core" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ position: "relative", width: 128, height: 128, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 28px 64px -14px rgba(124,58,237,.55)" }}>
              <span className="live-dot" style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "2px solid rgba(124,58,237,.35)" }} />
              <span style={{ color: "#fff", fontSize: 46, fontWeight: 700, lineHeight: 1 }}>✦</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Inter", fontSize: 18, fontWeight: 750, color: "#0A0A0A", letterSpacing: "-0.025em" }}>Clinera O.S.</div>
              <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7C3AED", marginTop: 5 }}>Contexto · decisiones · acción</div>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 14 }}><Mono>Clinera O.S. actúa</Mono></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {actions.map(actTile)}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home-eco-grid) { grid-template-columns: 1fr !important; gap: 32px !important; }
          :global(.home-eco-core) { order: -1; }
        }
        @media (max-width: 520px) {
          :global(.home-eco-src) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   INTEGRACIONES
   ============================================================ */
export function Integraciones() {
  const primary = [
    { name: "Meta", sub: "Business Partner", emoji: "Ⓜ", color: "#1877F2" },
    { name: "WhatsApp Business", sub: "API integrado oficialmente", emoji: "🟢", color: "#25D366" },
    { name: "Google Calendar", sub: "Sincronización bidireccional", emoji: "📅", color: "#4285F4" },
    { name: "Stripe", sub: "Pagos seguros certificados", emoji: "S", color: "#635BFF" },
    { name: "MercadoPago", sub: "Pagos LATAM", emoji: "MP", color: "#00B0EE" },
    { name: "WebPay / Transbank", sub: "Pagos oficiales en Chile", emoji: "W", color: "#E30613" },
  ];
  const automation = [
    { name: "API/Webhooks", sub: "Eventos en tiempo real", emoji: "API", color: "#111827" },
    { name: "n8n", sub: "Workflows avanzados", emoji: "n8n", color: "#EA4B71" },
    { name: "Make", sub: "Automatización visual", emoji: "M", color: "#6D28D9" },
    { name: "Zapier", sub: "Conecta tu stack no-code", emoji: "Z", color: "#FF4A00" },
    { name: "CRMs y dashboards", sub: "HubSpot, Pipedrive, Sheets y más", emoji: "CRM", color: "#2563EB" },
    { name: "Operaciones", sub: "Monday, Notion, Slack y sistemas internos", emoji: "OPS", color: "#10B981" },
  ];
  // Pausado — reactivar cuando se relancen integraciones de agenda en home
  // const agendas = [
  //   { name: "AgendaPro", sub: "Integración con agenda", emoji: "AP", color: "#F97316" },
  //   { name: "Reservo", sub: "Integración con agenda", emoji: "R", color: "#111827" },
  //   { name: "Sacmed", sub: "Integración con agenda", emoji: "SM", color: "#0E7490" },
  //   { name: "Medilink", sub: "Integración con agenda", emoji: "+", color: "#2563EB" },
  //   { name: "Dentalink", sub: "Integración con agenda", emoji: "DL", color: "#0EA5E9" },
  //   { name: "Más por venir", sub: "¿Pedir tu integración?", emoji: "+", color: "#6B7280", dashed: true },
  // ];

  const tile = (p: { name: string; sub: string; emoji: string; color: string; dashed?: boolean }) => (
    <div
      key={p.name}
      style={{
        background: "#fff",
        border: "1px solid #F0F0F0",
        borderRadius: 14,
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 4px 16px rgba(0,0,0,.03)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "#FAFAFA",
          border: "1px solid #F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            background: p.dashed ? "#F3F4F6" : p.color,
            color: p.dashed ? "#6B7280" : "#fff",
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: p.dashed ? "1px dashed #D1D5DB" : "none",
          }}
        >
          {p.emoji}
        </div>
      </div>
      <div>
        <div style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: "#0A0A0A" }}>
          {p.name}
        </div>
        <div style={{ fontFamily: "Inter", fontSize: 13, color: "#6B7280", marginTop: 2 }}>
          {p.sub}
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="integraciones"
      style={{
        position: "relative",
        padding: "112px 80px",
        borderTop: "1px solid #F0F0F0",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 50% 40% at 50% 0%, #DBEAFE 0%, #E9D5FF 40%, #FFFFFF 70%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>
        <div className="reveal" style={{ textAlign: "center", maxWidth: 780, margin: "0 auto 48px" }}>
          <Eyebrow>Ecosistema Clinera</Eyebrow>
          <h2
            className="home-h2-big"
            style={{
              fontFamily: "Inter",
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "14px 0 16px",
              color: "#0A0A0A",
            }}
          >
            Certificaciones oficiales <span style={{ color: "#7C3AED" }}>+</span> integraciones nativas
          </h2>
          <p style={{ fontFamily: "Inter", fontSize: 17, color: "#4B5563", lineHeight: 1.55, margin: 0 }}>
            Partner verificado de Meta, WhatsApp y Stripe — los canales que tu clínica realmente usa,
            integrados oficialmente.
          </p>
        </div>

        <div className="reveal">
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <Mono>Partnerships y certificaciones</Mono>
          </div>
          <div
            className="home-integra-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              marginBottom: 36,
            }}
          >
            {primary.map(tile)}
          </div>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <Mono>API/Webhooks y automatización</Mono>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,.9)",
              border: "1px solid #EDE9FE",
              borderRadius: 18,
              padding: "26px",
              boxShadow: "0 18px 50px rgba(17,24,39,.06)",
            }}
          >
            <div
              className="home-api-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.45fr",
                gap: 24,
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "Inter",
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    color: "#0A0A0A",
                    marginBottom: 10,
                  }}
                >
                  Conecta Clinera con tu stack actual
                </div>
                <p style={{ fontFamily: "Inter", fontSize: 15, color: "#4B5563", lineHeight: 1.6, margin: "0 0 16px" }}>
                  Usa API/Webhooks para integrar Clinera con plataformas como n8n, Make y Zapier, y desde ahí
                  conectar CRMs, planillas, dashboards, tareas, reportes y sistemas internos compatibles.
                </p>
                <Link
                  href="/blog/clinera-api-webhooks-n8n-make-zapier"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "Inter",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#7C3AED",
                    textDecoration: "none",
                  }}
                >
                  Leer anuncio de integraciones →
                </Link>
              </div>
              <div
                className="home-integra-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 12,
                }}
              >
                {automation.map(tile)}
              </div>
            </div>
          </div>

          {/* Pausado — reactivar cuando se relancen integraciones de agenda en home
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <Mono>Se integra con otras agendas</Mono>
          </div>
          <div
            className="home-integra-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
          >
            {agendas.map(tile)}
          </div>
          */}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 820px) {
          :global(.home-integra-grid) { grid-template-columns: repeat(2, 1fr) !important; }
          :global(.home-api-grid) { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          :global(.home-integra-grid) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   ESTUDIOS
   ============================================================ */
export function Estudios() {
  const studies = [
    {
      tag: "Efectividad del agente",
      stat: "100%",
      statSub: "de agendamientos en ≤3 intentos",
      title: "Estudio de efectividad 2026",
      desc: "42 casos reales auditados sobre 3 clínicas en producción. 95.2% pass@1, 100% pass@3. Arquitectura, metodología y código publicados.",
      meta: "42 casos · 14 flujos · 3 clínicas · abril 2026",
      href: "/efectividad",
      accent: "#7C3AED",
      accentBg: "#F5F3FF",
      accentBorder: "#DDD6FE",
    },
    {
      tag: "Confianza y conversión",
      stat: "+12 pp",
      statSub: "más completaciones con timing humano",
      title: "Estudio de confianza IA 2026",
      desc: "A/B con 89 clínicas y +57.000 interacciones. La IA con timing humano (20–90 s) convierte un 91% frente al 79% de la respuesta instantánea.",
      meta: "89 clínicas · 57k interacciones · feb–abr 2026",
      href: "/blog/estudio-ia-respuesta-humana-confianza-pacientes",
      accent: "#0369A1",
      accentBg: "#EFF6FF",
      accentBorder: "#BFDBFE",
    },
  ];

  return (
    <section
      style={{
        padding: "96px 80px",
        background: "#FAFAFA",
        borderTop: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 52px" }}>
          <Eyebrow>Evidencia publicada</Eyebrow>
          <h2
            className="home-h2-big"
            style={{
              fontFamily: "Inter",
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "14px 0 16px",
              color: "#0A0A0A",
            }}
          >
            Estudios internos{" "}
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              con datos reales
            </span>
          </h2>
          <p style={{ fontFamily: "Inter", fontSize: 17, color: "#4B5563", lineHeight: 1.55, margin: 0 }}>
            No promesas. Clinera publica los números de cómo funciona en producción.
          </p>
        </div>

        <div
          className="reveal home-estudios-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
        >
          {studies.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #EEECEA",
                  borderRadius: 20,
                  padding: "32px 28px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  transition: "box-shadow .2s, border-color .2s",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,.08)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = s.accentBorder;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#EEECEA";
                }}
              >
                {/* Tag */}
                <span
                  style={{
                    display: "inline-block",
                    alignSelf: "flex-start",
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: s.accent,
                    background: s.accentBg,
                    border: `1px solid ${s.accentBorder}`,
                    padding: "4px 10px",
                    borderRadius: 999,
                  }}
                >
                  {s.tag}
                </span>

                {/* Stat */}
                <div>
                  <div
                    style={{
                      fontFamily: "Inter",
                      fontSize: 52,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      color: "#0A0A0A",
                    }}
                  >
                    {s.stat}
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: 14, color: "#6B7280", marginTop: 6 }}>
                    {s.statSub}
                  </div>
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "Inter",
                      fontSize: 19,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: "#0A0A0A",
                      marginBottom: 10,
                    }}
                  >
                    {s.title}
                  </div>
                  <p style={{ fontFamily: "Inter", fontSize: 15, color: "#4B5563", lineHeight: 1.6, margin: 0 }}>
                    {s.desc}
                  </p>
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #F3F4F6",
                    paddingTop: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      fontSize: 11,
                      color: "#9CA3AF",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {s.meta}
                  </span>
                  <span style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: s.accent }}>
                    Leer estudio →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.home-estudios-grid) { grid-template-columns: 1fr !important; }
          :global(.home-h2-big) { font-size: 34px !important; }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   DARK BREAK (quote)
   ============================================================ */
export function DarkBreak() {
  return (
    <section style={{ padding: "48px 80px 24px", background: "#fff" }}>
      <div
        className="reveal home-dark-break"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          borderRadius: 28,
          position: "relative",
          overflow: "hidden",
          background: "#0A0A0F",
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 80% at 90% 0%, rgba(217,70,239,.22) 0%, rgba(124,58,237,.1) 40%, transparent 70%),radial-gradient(ellipse 50% 70% at 0% 100%, rgba(59,130,246,.22) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            pointerEvents: "none",
            maskImage:
              "radial-gradient(ellipse 70% 70% at 50% 50%, #000 40%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 70% at 50% 50%, #000 40%, transparent 85%)",
          }}
        />

        <div
          className="home-dark-break-grid"
          style={{
            position: "relative",
            padding: "72px 56px",
            display: "grid",
            gridTemplateColumns: "0.85fr 1.15fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.55)",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ width: 24, height: 1, background: "linear-gradient(90deg,#3B82F6,#D946EF)" }} />
              Benchmark AURA · Abril 2026
            </div>
            <div style={{ position: "relative" }}>
              <div
                className="home-dark-break-huge"
                style={{
                  background: GRAD,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  fontFamily: "Inter",
                  fontSize: 180,
                  fontWeight: 800,
                  letterSpacing: "-0.06em",
                  lineHeight: 0.9,
                  margin: 0,
                }}
              >
                24/7
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,.5)",
                  marginTop: 12,
                }}
              >
                Sin turnos · Sin feriados · Sin licencia
              </div>
            </div>
          </div>

          <div className="home-dark-break-quote" style={{ borderLeft: "1px solid rgba(255,255,255,.08)", paddingLeft: 56 }}>
            <div
              aria-hidden
              style={{
                fontFamily: "Inter",
                fontSize: 72,
                lineHeight: 1,
                color: "rgba(217,70,239,.6)",
                marginBottom: -12,
                fontWeight: 700,
              }}
            >
              &ldquo;
            </div>
            <blockquote
              style={{
                margin: 0,
                fontFamily: "Inter",
                fontSize: 32,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                color: "#fff",
              }}
            >
              Despertamos un martes y AURA ya había{" "}
              <span
                style={{
                  background: GRAD,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                agendado 14 pacientes
              </span>{" "}
              durante la noche. En ese momento entendimos que no íbamos a volver al sistema antiguo.
            </blockquote>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: 32,
                paddingTop: 24,
                borderTop: "1px solid rgba(255,255,255,.08)",
              }}
            >
              <Image
                src="/images/home/flavio.jpeg"
                alt="Dr. Flavio Rojas"
                width={52}
                height={52}
                style={{
                  borderRadius: 999,
                  objectFit: "cover",
                  objectPosition: "center 25%",
                  border: "2px solid rgba(255,255,255,.1)",
                }}
                unoptimized
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: "#fff" }}>
                  Dr. Flavio Rojas
                </div>
                <div style={{ fontFamily: "Inter", fontSize: 13.5, color: "rgba(255,255,255,.6)" }}>
                  infiltracion.cl · Los Ángeles, Chile
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#D946EF">
                    <path d="M12 .5l3.09 8.26L24 9.27l-7 6.04L18.18 24 12 19.77 5.82 24 7 15.31l-7-6.04 8.91-.51z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home-dark-break-grid) {
            grid-template-columns: 1fr !important;
            padding: 48px 28px !important;
            gap: 32px !important;
          }
          :global(.home-dark-break-huge) { font-size: 100px !important; }
          :global(.home-dark-break-quote) { padding-left: 0 !important; border-left: 0 !important; border-top: 1px solid rgba(255,255,255,.08) !important; padding-top: 32px !important; }
          :global(.home-dark-break-quote blockquote) { font-size: 22px !important; }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   TESTIMONIOS
   ============================================================ */
export function Testimonios() {
  const items = [
    {
      q: "Por fin tengo tiempo para mis pacientes. AURA contesta incluso cuando estoy en pabellón o durmiendo. Mi secretaria ahora se dedica a lo importante.",
      name: "Dra. Katherine Meza",
      role: "Clínica Estética · Santiago",
      photo: "/images/home/katherine.png",
      pos: "center 20%",
      stat: "No-shows 30% → 5%",
    },
    {
      q: "Probamos Clinera un mes para ver. No volvimos atrás. Llenó la agenda sin gastar un peso más en Instagram.",
      name: "Dr. Flavio Rojas",
      role: "infiltracion.cl · Los Ángeles, Chile",
      photo: "/images/home/flavio.jpeg",
      pos: "center 25%",
      stat: "−71% gasto en marketing",
    },
    {
      q: "Lo que más me sorprende: las pacientes creen que AURA es la recepcionista nueva. Responde con el tono de la clínica, sin que nadie note que es IA.",
      name: "Dra. Stefani Michailiszen",
      role: "Dermaclinic · Las Condes",
      photo: "/images/home/stefani.webp",
      pos: "center 20%",
      stat: "+38% agenda ocupada",
    },
    {
      q: "AURA reactivó 47 pacientes inactivos el primer mes. Eso pagó la suscripción del año.",
      name: "Tamara Oyarzún",
      role: "Estética Corporal · Vitacura",
      photo: "/images/home/tamara.jpeg",
      pos: "center 25%",
      stat: "+47 pacientes recuperados",
    },
    {
      q: "Dejamos de perder pacientes por no contestar a tiempo. Responde en menos de un segundo y con el historial de cada uno.",
      name: "Dra. Yasna Vásquez",
      role: "Estética Facial · Talca",
      photo: "/images/home/yasna.jpg",
      pos: "center 15%",
      stat: "Respuesta <1s · 24/7",
    },
  ];

  const [perView, setPerView] = useState(3);

  useEffect(() => {
    const h = () => {
      const w = window.innerWidth;
      setPerView(w < 680 ? 1 : w < 980 ? 2 : 3);
    };
    h();
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const maxIdx = Math.max(0, items.length - perView);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setIdx((i) => Math.min(i, maxIdx));
  }, [maxIdx]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIdx((i) => (i >= maxIdx ? 0 : i + 1));
    }, 5200);
    return () => clearInterval(t);
  }, [paused, maxIdx]);

  const GAP = 18;
  const translate = `translateX(calc(${-idx} * ((100% - ${GAP * (perView - 1)}px) / ${perView} + ${GAP}px)))`;
  const atStart = idx <= 0;
  const atEnd = idx >= maxIdx;

  return (
    <section
      id="historias"
      style={{ padding: "112px 80px", borderTop: "1px solid #F0F0F0", background: "#fff" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="reveal"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
            marginBottom: 44,
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 680 }}>
            <Eyebrow>Historias</Eyebrow>
            <h2
              className="home-h2-big"
              style={{
                fontFamily: "Inter",
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                margin: "14px 0 0",
                color: "#0A0A0A",
              }}
            >
              Clínicas chilenas que ya no vuelven atrás.
            </h2>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              disabled={atStart}
              onClick={() => {
                setPaused(true);
                setIdx((i) => Math.max(0, i - 1));
              }}
              aria-label="Anterior"
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
                border: "1px solid #E5E7EB",
                background: "#fff",
                cursor: atStart ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0A0A0A",
                opacity: atStart ? 0.35 : 1,
                transition: "opacity .2s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              disabled={atEnd}
              onClick={() => {
                setPaused(true);
                setIdx((i) => Math.min(maxIdx, i + 1));
              }}
              aria-label="Siguiente"
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
                border: "1px solid #0A0A0A",
                background: "#0A0A0A",
                cursor: atEnd ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                opacity: atEnd ? 0.35 : 1,
                transition: "opacity .2s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className="reveal"
          style={{ overflow: "hidden" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            style={{
              display: "flex",
              gap: GAP,
              transition: "transform .7s cubic-bezier(.22,.8,.28,1)",
              transform: translate,
              willChange: "transform",
            }}
          >
            {items.map((t, i) => (
              <figure
                key={i}
                style={{
                  flex: `0 0 calc((100% - ${GAP * (perView - 1)}px) / ${perView})`,
                  background: "#FAFAFA",
                  border: "1px solid #F0F0F0",
                  borderRadius: 20,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  margin: 0,
                }}
              >
                <div
                  style={{
                    height: 320,
                    background: "#F3F4F6",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={t.photo}
                    alt={t.name}
                    fill
                    style={{
                      objectFit: "cover",
                      objectPosition: t.pos || "center top",
                    }}
                    unoptimized
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      fontSize: 10.5,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#fff",
                      background: "rgba(10,10,10,.7)",
                      backdropFilter: "blur(6px)",
                      padding: "5px 10px",
                      borderRadius: 999,
                      zIndex: 2,
                    }}
                  >
                    {t.stat}
                  </div>
                </div>
                <div
                  style={{
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                    flex: 1,
                  }}
                >
                  <blockquote
                    style={{
                      margin: 0,
                      fontFamily: "Inter",
                      fontSize: 16.5,
                      lineHeight: 1.5,
                      letterSpacing: "-0.01em",
                      color: "#0A0A0A",
                    }}
                  >
                    &ldquo;{t.q}&rdquo;
                  </blockquote>
                  <figcaption style={{ marginTop: "auto" }}>
                    <div style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>
                      {t.name}
                    </div>
                    <div style={{ fontFamily: "Inter", fontSize: 13, color: "#6B7280" }}>{t.role}</div>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 28 }}>
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setPaused(true);
                setIdx(i);
              }}
              aria-label={`Ir a grupo ${i + 1}`}
              style={{
                width: i === idx ? 28 : 8,
                height: 8,
                borderRadius: 999,
                border: 0,
                padding: 0,
                cursor: "pointer",
                background: i === idx ? GRAD : "#E5E7EB",
                transition: "all .3s",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PRENSA · CNN (video vertical de credibilidad)
   ============================================================ */
export function PrensaCNN() {
  return (
    <section style={{ padding: "48px 80px", background: "#fff" }}>
      <div
        className="reveal home-cnn-card"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          borderRadius: 28,
          position: "relative",
          overflow: "hidden",
          background: "#0A0A0F",
          color: "#fff",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 55% 75% at 88% 12%, rgba(217,70,239,.26) 0%, rgba(124,58,237,.12) 42%, transparent 72%),radial-gradient(ellipse 50% 60% at 8% 100%, rgba(59,130,246,.18) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="home-cnn-grid"
          style={{
            position: "relative",
            padding: "56px 56px",
            display: "grid",
            gridTemplateColumns: "0.92fr 1.08fr",
            gap: 52,
            alignItems: "center",
          }}
        >
          <div className="home-cnn-text">
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.55)",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ width: 24, height: 1, background: "linear-gradient(90deg,#3B82F6,#D946EF)" }} />
              Clinera en la prensa
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 22 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,.45)",
                }}
              >
                Visto en
              </span>
              <CnnLogo height={30} color="#F23A30" />
            </div>

            <h2
              className="home-cnn-title"
              style={{
                fontFamily: "Inter",
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                margin: "0 0 18px",
                color: "#fff",
              }}
            >
              Un gran paso para{" "}
              <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                Clinera
              </span>
              .
            </h2>
            <p
              style={{
                fontFamily: "Inter",
                fontSize: 17,
                lineHeight: 1.6,
                color: "rgba(255,255,255,.72)",
                margin: "0 0 26px",
                maxWidth: 440,
              }}
            >
              Ricardo Oyarzún, fundador de Clinera, fue entrevistado por{" "}
              <b style={{ color: "#fff", fontWeight: 600 }}>CNN</b> sobre cómo la IA está transformando la atención de las clínicas en LATAM. Un reconocimiento que confirma hacia dónde vamos.
            </p>
            <Link
              href="/prensa"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "Inter",
                fontSize: 14.5,
                fontWeight: 600,
                color: "#fff",
                textDecoration: "none",
                background: "rgba(255,255,255,.07)",
                border: "1px solid rgba(255,255,255,.16)",
                borderRadius: 999,
                padding: "11px 18px",
                transition: "background .2s, border-color .2s",
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: 999, background: "#F23A30", display: "inline-block" }} />
              Ver la entrevista en CNN
              <span aria-hidden style={{ fontSize: 16, lineHeight: 1, opacity: 0.7 }}>→</span>
            </Link>
            <div style={{ marginTop: 14 }}>
              <a
                href="https://www.youtube.com/watch?v=Gskr4kELyx4"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,.5)",
                  textDecoration: "none",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6Z" />
                </svg>
                Ver emisión original en YouTube ↗
              </a>
            </div>
          </div>

          <div className="home-cnn-video">
            <div
              style={{
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,.12)",
                boxShadow: "0 40px 90px -20px rgba(0,0,0,.6)",
                background: "#000",
              }}
            >
              <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                <iframe
                  src="https://player.vimeo.com/video/1205127087?badge=0&autopause=0&player_id=0&app_id=58479"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  loading="lazy"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                  title="CNN entrevista a Clinera"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        :global(.home-cnn-text a:hover) {
          background: rgba(255, 255, 255, 0.12) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
        }
        @media (max-width: 900px) {
          :global(.home-cnn-grid) {
            grid-template-columns: 1fr !important;
            gap: 34px !important;
            padding: 40px 26px !important;
          }
          :global(.home-cnn-title) { font-size: 32px !important; }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   PRICING
   ============================================================ */
// Funciones base por card (formato compacto); el detalle completo vive en /planes-pro.
function planFeatures(plan: (typeof CLINERA_PLANS)[number]): string[] {
  // Solo la equivalencia de texto, sin minutos de voz ni "automáticos".
  const consumo = plan.consumptionReference.split(" · ")[0].replace(" automáticos", "");
  switch (plan.id) {
    case "vortex":
      return ["AURA · IA por WhatsApp 24/7", consumo, "Agenda, fichas y pagos"];
    case "atlas":
      return ["Todo lo de Vortex", "CAMILA · IA de voz", consumo];
    case "summit":
      return ["Todo lo de Atlas", "LIA · fiscalización", consumo];
  }
}

// Tema visual por card: el tinte escala con el tier recorriendo el espectro de
// marca (cyan → violeta → magenta), con superficies suaves para que el precio
// siga siendo el primer punto de atención. Summit conserva el mayor contraste.
type PlanTheme = {
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  label: string;
  name: string;
  ink: string;
  sub: string;
  panelBg: string;
  panelBorder: string;
  divider: string;
  accent: string;
  ctaPrimaryBg: string;
  ctaPrimaryColor: string;
  ctaPrimaryShadow: string;
  ctaSecondaryBg: string;
  ctaSecondaryColor: string;
  ctaSecondaryBorder: string;
  checkBg: string;
  checkStroke: string;
  chipBg: string;
  chipBorder: string;
  iconBg: string;
  iconColor: string;
};

const PLAN_THEMES: Record<(typeof CLINERA_PLANS)[number]["id"], PlanTheme> = {
  vortex: {
    cardBg: "linear-gradient(145deg,#F6FCFF 0%,#E6F5FC 100%)",
    cardBorder: "rgba(2,132,199,.20)",
    cardShadow: "0 18px 36px -28px rgba(2,132,199,.46), 0 4px 14px rgba(2,132,199,.06)",
    label: "#0C4A6E",
    name: "#0284C7",
    ink: "#0A0A0A",
    sub: "#48677A",
    panelBg: "rgba(255,255,255,.62)",
    panelBorder: "rgba(2,132,199,.10)",
    divider: "rgba(2,132,199,.16)",
    accent: "#0284C7",
    ctaPrimaryBg: "#0A0A0A",
    ctaPrimaryColor: "#fff",
    ctaPrimaryShadow: "none",
    ctaSecondaryBg: "rgba(255,255,255,.72)",
    ctaSecondaryColor: "#0A0A0A",
    ctaSecondaryBorder: "rgba(2,132,199,.22)",
    checkBg: "rgba(2,132,199,.13)",
    checkStroke: "#0284C7",
    chipBg: "rgba(255,255,255,.66)",
    chipBorder: "rgba(2,132,199,.14)",
    iconBg: "rgba(2,132,199,.13)",
    iconColor: "#0284C7",
  },
  atlas: {
    cardBg: "linear-gradient(145deg,#FCFAFF 0%,#F0EBFC 100%)",
    cardBorder: "rgba(109,40,217,.20)",
    cardShadow: "0 22px 42px -28px rgba(109,40,217,.52), 0 6px 18px rgba(109,40,217,.08)",
    label: "#3B1E7E",
    name: "#5B21B6",
    ink: "#150B33",
    sub: "#4A3B7C",
    panelBg: "rgba(255,255,255,.60)",
    panelBorder: "rgba(109,40,217,.12)",
    divider: "rgba(109,40,217,.18)",
    accent: "#6D28D9",
    ctaPrimaryBg: "#0A0A0A",
    ctaPrimaryColor: "#fff",
    ctaPrimaryShadow: "none",
    ctaSecondaryBg: "rgba(255,255,255,.66)",
    ctaSecondaryColor: "#150B33",
    ctaSecondaryBorder: "rgba(109,40,217,.24)",
    checkBg: "rgba(109,40,217,.15)",
    checkStroke: "#6D28D9",
    chipBg: "rgba(255,255,255,.62)",
    chipBorder: "rgba(109,40,217,.16)",
    iconBg: "rgba(109,40,217,.15)",
    iconColor: "#6D28D9",
  },
  summit: {
    cardBg: "linear-gradient(145deg,#6D28D9 0%,#7C3AED 58%,#A855F7 100%)",
    cardBorder: "rgba(255,255,255,.34)",
    cardShadow: "0 42px 78px -22px rgba(124,58,237,.52), 0 14px 30px rgba(91,33,182,.20)",
    label: "rgba(255,255,255,.72)",
    name: "#fff",
    ink: "#fff",
    sub: "rgba(255,255,255,.75)",
    panelBg: "rgba(255,255,255,.13)",
    panelBorder: "rgba(255,255,255,.20)",
    divider: "rgba(255,255,255,.24)",
    accent: "#fff",
    ctaPrimaryBg: "#fff",
    ctaPrimaryColor: "#6D28D9",
    ctaPrimaryShadow: "0 10px 24px -8px rgba(17,6,48,.45)",
    ctaSecondaryBg: "rgba(255,255,255,.16)",
    ctaSecondaryColor: "#fff",
    ctaSecondaryBorder: "rgba(255,255,255,.30)",
    checkBg: "rgba(255,255,255,.22)",
    checkStroke: "#fff",
    chipBg: "rgba(255,255,255,.14)",
    chipBorder: "rgba(255,255,255,.24)",
    iconBg: "rgba(255,255,255,.18)",
    iconColor: "#fff",
  },
};

// Íconos de plan (trazo propio, 20px): remolino, globo y cumbre.
const PLAN_ICONS: Record<(typeof CLINERA_PLANS)[number]["id"], ReactNode> = {
  vortex: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-9-9" />
      <path d="M16.5 12A4.5 4.5 0 1 1 12 7.5" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  atlas: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.7 2.4 2.7 14.6 0 17" />
      <path d="M12 3.5c-2.7 2.4-2.7 14.6 0 17" />
    </svg>
  ),
  summit: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 19h18" />
      <path d="M5 19l6-11 3.4 6.2L17 10.5 21 19" />
    </svg>
  ),
};

// Chips inferiores con número grande (usuarios / sucursales), estilo Vambe.
function planChipData(plan: (typeof CLINERA_PLANS)[number]): { num: string; label: string }[] {
  const branchNum = /^\d+/.exec(plan.branches)?.[0] ?? "∞";
  const rawLabel = branchNum === "∞" ? "sucursales" : plan.branches.replace(/^\d+\s*/, "");
  const branchLabel = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);
  return [
    { num: String(plan.users), label: "Usuarios" },
    { num: branchNum, label: branchLabel },
  ];
}

// Canales del plan como fila de íconos (texto / voz / API), estilo Vambe.
function ChannelIcons({ channel, color }: { channel: string; color: string }) {
  const hasVoz = channel.includes("voz");
  const hasApi = channel.includes("API");
  return (
    <span role="img" aria-label={channel} title={channel} style={{ display: "inline-flex", alignItems: "center", gap: 9, color }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
        <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5z" />
      </svg>
      {hasVoz && (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
          <path d="M12 18v3" />
        </svg>
      )}
      {hasApi && (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 7 4 12l4.5 5" />
          <path d="M15.5 7 20 12l-4.5 5" />
        </svg>
      )}
    </span>
  );
}

export type { Billing };

/**
 * Selector de modalidad. El anual va primero, ocupa más ancho y conserva un
 * borde violeta aunque no esté elegido: es la opción que el sitio empuja y la
 * jerarquía tiene que decirlo antes de que el usuario lea el precio.
 */
export function BillingToggle({ billing, onChange }: { billing: Billing; onChange: (b: Billing) => void }) {
  const base = {
    appearance: "none" as const,
    cursor: "pointer",
    border: 0,
    fontFamily: "Outfit, sans-serif",
    fontWeight: 600,
    borderRadius: 9,
    transition: "background .2s, color .2s, box-shadow .2s",
    minHeight: 58,
    padding: "9px 18px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 2,
  };
  const annual = billing === "annual";
  const semester = billing === "semester";
  const monthly = billing === "monthly";
  return (
    <div
      role="group"
      aria-label="Frecuencia de facturación"
      className="billing-toggle"
      style={{
        display: "inline-grid",
        gridTemplateColumns: "1.28fr 1fr 1fr",
        alignItems: "center",
        gap: 4,
        background: "#F6F6F7",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        padding: 4,
      }}
    >
      <button
        className="billing-toggle-option"
        type="button"
        onClick={() => onChange("annual")}
        aria-pressed={annual}
        style={{
          ...base,
          minWidth: 200,
          position: "relative",
          background: annual ? GRAD : "#fff",
          color: annual ? "#fff" : "#6D28D9",
          boxShadow: annual
            ? "0 8px 20px -6px rgba(124,58,237,.62)"
            : "inset 0 0 0 1.5px rgba(124,58,237,.34)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14.5 }}>
          Anual
          <span
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              padding: "2px 7px",
              borderRadius: 999,
              background: annual ? "rgba(255,255,255,.22)" : "rgba(124,58,237,.12)",
              color: annual ? "#fff" : "#6D28D9",
              whiteSpace: "nowrap",
            }}
          >
            Mejor valor
          </span>
        </span>
        <small
          style={{
            color: annual ? "#F5E9FF" : "#7C3AED",
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 8.5,
            letterSpacing: ".04em",
          }}
        >
          {ANNUAL_DISCOUNT_PERCENT}% OFF + implementación gratis
        </small>
      </button>
      <button
        className="billing-toggle-option"
        type="button"
        onClick={() => onChange("semester")}
        aria-pressed={semester}
        style={{
          ...base,
          minWidth: 150,
          background: semester ? "#7C3AED" : "transparent",
          color: semester ? "#fff" : "#4B5563",
          boxShadow: semester ? "0 6px 16px -6px rgba(124,58,237,.55)" : "none",
        }}
      >
        <span style={{ fontSize: 14 }}>Semestral</span>
        <small style={{ color: semester ? "#DDD6FE" : "#777E89", fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 8.5, letterSpacing: ".04em" }}>
          {SEMESTER_DISCOUNT_PERCENT}% OFF + implementación gratis
        </small>
      </button>
      <button
        className="billing-toggle-option"
        type="button"
        onClick={() => onChange("monthly")}
        aria-pressed={monthly}
        style={{
          ...base,
          minWidth: 150,
          background: monthly ? "#7C3AED" : "transparent",
          color: monthly ? "#fff" : "#4B5563",
          boxShadow: monthly ? "0 6px 16px -6px rgba(124,58,237,.55)" : "none",
        }}
      >
        <span style={{ fontSize: 14 }}>Mensual</span>
        <small style={{ color: monthly ? "#DDD6FE" : "#777E89", fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 8.5, letterSpacing: ".04em" }}>
          Pago mes a mes
        </small>
      </button>
    </div>
  );
}

export function Pricing({
  showCredits = true,
  intro = "default",
  ctaHref,
}: {
  showCredits?: boolean;
  intro?: "default" | "comparison" | "none";
  // Destino del CTA de cada tarjeta. Por defecto es el checkout de Stripe del
  // plan y la modalidad elegida. Las páginas cuyo objetivo es la reunión y no
  // la venta con tarjeta (p. ej. /plataforma) pasan una ruta interna acá.
  ctaHref?: string;
} = {}) {
  const [billing, setBilling] = useState<Billing>("annual");
  const isAnnual = billing === "annual";
  const isSemester = billing === "semester";
  const freeSetup = includesFreeSetup(billing);
  const billingLabel = isAnnual ? "anual" : isSemester ? "semestral" : "mensual";
  const isComparisonIntro = intro === "comparison";
  // "none": la página ya trae su propio hero (p. ej. /planes) — sin header duplicado.
  const hideHeader = intro === "none";
  const IA_MODELS = VERTEX_IA_MODELS;
  const plans = CLINERA_PLANS.map((plan) => ({
    id: plan.id,
    name: plan.name,
    price: `$${plan.monthlyPrice}`,
    monthlyValue: plan.monthlyPrice,
    semesterMonthly: `$${plan.semesterMonthly.toLocaleString("es-CL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    semesterTotal: `USD ${plan.semesterTotal.toLocaleString("es-CL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    semesterValue: plan.semesterTotal,
    annualMonthly: `$${plan.annualMonthly.toLocaleString("es-CL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    annualTotal: `USD ${plan.annualTotal.toLocaleString("es-CL")}`,
    annualValue: plan.annualTotal,
    annualSavings: `USD ${annualFirstYearSavings(plan).toLocaleString("es-CL")}`,
    credits: plan.credits.toLocaleString("es-CL"),
    channel: plan.channel,
    chips: planChipData(plan),
    features: planFeatures(plan),
    stripe: plan.stripe,
    stripeSemester: plan.stripeSemester,
    stripeAnnual: plan.stripeAnnual,
    featured: plan.featured,
  }));

  const checkoutUrl = (p: (typeof plans)[number]) => {
    const base = ctaHref ?? "/agenda";
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}plan=${p.id}`;
  };
  const ctaIsExternal = false;
  const checkoutValue = (p: (typeof plans)[number]) =>
    isAnnual ? p.annualValue : isSemester ? p.semesterValue : p.monthlyValue;

  return (
    <section
      id="precios"
      style={{
        // Padding lateral más corto que el resto del sitio: las tres tarjetas
        // necesitan ancho para que el precio y sus notas no se partan en dos
        // líneas y estiren la caja a lo alto.
        padding: hideHeader ? "12px 56px 112px" : isComparisonIntro ? "80px 56px 112px" : "112px 56px",
        background: "#FAFAFA",
        borderTop: hideHeader ? "none" : "1px solid #F0F0F0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 480,
          height: 480,
          background: "radial-gradient(circle at 70% 30%, rgba(217,70,239,.14), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative" }}>
        {!hideHeader && (
        <div className="reveal" style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 26px" }}>
          <Eyebrow>{isComparisonIntro ? "Comparación" : "Planes"}</Eyebrow>
          <h2
            className="home-h2-big"
            style={{
              fontFamily: "Inter",
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "14px 0 14px",
              color: "#0A0A0A",
            }}
          >
            {isComparisonIntro ? (
              <>
                La misma inteligencia.{" "}
                <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                  Distinta capacidad operativa.
                </span>
              </>
            ) : (
              "Elige tu plan por el tamaño de tu operación."
            )}
          </h2>
          <p style={{ fontFamily: "Inter", fontSize: 17, color: "#4B5563", margin: 0, lineHeight: 1.55 }}>
            {isComparisonIntro ? (
              <>
                Todos los planes incluyen AURA por WhatsApp. Compara créditos, agentes, usuarios y sedes para encontrar la capacidad que tu clínica necesita hoy.
              </>
            ) : (
              <>
                Desde clínicas con equipo de recepción y varios profesionales hasta grupos con varias sedes. Todos los planes incluyen agentes de IA que agendan, confirman, cobran y recuperan pacientes por WhatsApp 24/7, con <b>visibilidad y control central</b> de toda tu operación.
              </>
            )}
          </p>
        </div>
        )}

        <div className="reveal home-billing-toggle" style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <BillingToggle billing={billing} onChange={setBilling} />
        </div>
        <div
          className="reveal"
          aria-live="polite"
          style={{
            maxWidth: 660,
            margin: "0 auto 20px",
            textAlign: "center",
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 10.5,
            letterSpacing: ".05em",
            color: "#6B7280",
          }}
        >
          {isAnnual
            ? `Anual seleccionado · precio equivalente mensual · total de ${ANNUAL_MONTHS} meses con ${ANNUAL_DISCOUNT_PERCENT}% OFF · implementación gratis · plan se cobra de inmediato`
            : isSemester
              ? `Semestral seleccionado · precio equivalente mensual · total de ${SEMESTER_MONTHS} meses con ${SEMESTER_DISCOUNT_PERCENT}% OFF · implementación gratis · plan se cobra de inmediato`
              : `Mensual seleccionado · mes 1 = implementación USD ${SETUP_FEE_AMOUNT.replace("$", "")} · el plan se cobra después · permanencia mínima de ${SEMESTER_MONTHS} meses`}
        </div>

        <div
          className="reveal home-pricing-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          {plans.map((p) => {
            const th = PLAN_THEMES[p.id];
            // La implementación usa la tinta de cada tarjeta para conservar
            // contraste también sobre Summit. El verde queda reservado al estado
            // "Gratis" de semestral y anual.
            const impl = freeSetup
              ? {
                  strike: th.sub,
                  pillBg: "#2F6A3F",
                  pillInk: "#FFFFFF",
                }
              : {
                  strike: th.sub,
                  pillBg: "#8A6516",
                  pillInk: "#FFFFFF",
                };
            return (
              <article
                key={p.name}
                className={p.featured ? "home-plan-card home-plan-card-featured" : "home-plan-card"}
                style={{
                  background: th.cardBg,
                  border: `1px solid ${th.cardBorder}`,
                  borderRadius: 24,
                  padding: p.featured ? "34px 30px 32px" : "32px 28px",
                  boxShadow: th.cardShadow,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  willChange: "transform",
                }}
              >
                {p.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#fff",
                      color: "#7C3AED",
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      fontSize: 10.5,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      padding: "7px 16px",
                      borderRadius: 999,
                      fontWeight: 700,
                      boxShadow: "0 10px 24px -6px rgba(91,33,182,.45)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ★ El más elegido
                  </div>
                )}

                {/* Encabezado: Plan + nombre, ícono del plan a la derecha */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
                  <div>
                    <div style={{ fontFamily: "Inter", fontSize: 13.5, fontWeight: 500, color: th.label }}>Plan</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 29, fontWeight: 800, color: th.name, letterSpacing: "-0.03em", marginTop: 2 }}>
                      {p.name}
                    </div>
                  </div>
                  <span
                    aria-hidden
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 13,
                      background: th.iconBg,
                      color: th.iconColor,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: "0 0 auto",
                    }}
                  >
                    {PLAN_ICONS[p.id]}
                  </span>
                </div>

                {/* Prepago (semestral/anual): implementación gratis + cobro inmediato.
                    Mensual: implementación cobrada al inicio; plan después. */}
                <div
                  className="home-plan-economics"
                  role="table"
                  aria-label={`Secuencia de cobro del plan ${p.name}`}
                  style={{
                    background: th.panelBg,
                    border: `1px solid ${th.panelBorder}`,
                    borderRadius: 16,
                    padding: "0 20px",
                    marginBottom: 18,
                  }}
                >
                  {/* Dos filas y un divisor continuo: primero implementación,
                      después el plan. La secuencia se entiende antes de leer el
                      detalle de modalidad o créditos. */}
                  <div
                    className="home-plan-payment-row"
                    role="row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) auto",
                      alignItems: "center",
                      gap: 16,
                      padding: "17px 0 15px",
                    }}
                  >
                    <div role="cell" style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                          fontSize: 10.5,
                          fontWeight: 700,
                          letterSpacing: "0.09em",
                          lineHeight: 1.5,
                          textTransform: "uppercase",
                          color: th.sub,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {freeSetup ? "Implementación" : "Mes 1"}
                      </div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, fontWeight: 600, lineHeight: 1.35, color: th.ink, marginTop: 4, whiteSpace: "nowrap" }}>
                        {freeSetup
                          ? `Incluida en el plan ${billingLabel}`
                          : "Implementación · plan después"}
                      </div>
                    </div>
                    <div role="cell" style={{ textAlign: "right", flex: "0 0 auto" }}>
                      {freeSetup ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                          <s style={{ fontFamily: "Inter", fontSize: 13.5, fontWeight: 600, color: impl.strike, textDecorationThickness: "from-font" }}>
                            {SETUP_FEE_AMOUNT}
                          </s>
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                              fontSize: 10.5,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: impl.pillInk,
                              background: impl.pillBg,
                              borderRadius: 999,
                              padding: "4px 10px",
                            }}
                          >
                            Gratis
                          </span>
                        </span>
                      ) : (
                        <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 800, color: th.ink, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>
                          {SETUP_FEE_AMOUNT}
                          <span style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 600, letterSpacing: 0, color: th.sub }}>USD</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div aria-hidden style={{ borderTop: `1px solid ${th.divider}` }} />

                  <div
                    className="home-plan-payment-row"
                    role="row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) auto",
                      alignItems: "center",
                      gap: 16,
                      padding: "16px 0 18px",
                    }}
                  >
                    <div role="cell" style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                          fontSize: 10.5,
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          lineHeight: 1.5,
                          textTransform: "uppercase",
                          color: th.sub,
                        }}
                      >
                        {freeSetup
                          ? isAnnual
                            ? "Plan anual"
                            : "Plan semestral"
                          : "Después de la implementación"}
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10.5, lineHeight: 1.5, color: th.sub, marginTop: 5 }}>
                        {freeSetup ? "Equivalente mensual · cobro inmediato" : `Plan · ${billingLabel}`}
                      </div>
                      {showCredits && (
                        <div
                          className="home-plan-credit-pill"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            background: th.chipBg,
                            border: `1px solid ${th.chipBorder}`,
                            borderRadius: 999,
                            padding: "5px 9px",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 11,
                            fontWeight: 700,
                            lineHeight: 1.2,
                            color: th.ink,
                            marginTop: 10,
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span style={{ fontSize: 12 }}>{p.credits}</span> créditos/mes
                        </div>
                      )}
                    </div>
                    <div role="cell" style={{ textAlign: "right", flex: "0 0 auto" }}>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 38, fontWeight: 800, color: th.ink, letterSpacing: "-0.05em", lineHeight: 1.05 }}>
                        {isAnnual ? p.annualMonthly : isSemester ? p.semesterMonthly : p.price}
                      </div>
                      <div style={{ fontFamily: "Inter", fontSize: 11.5, fontWeight: 600, color: th.sub, marginTop: 6 }}>USD/mes</div>
                    </div>
                  </div>

                </div>

                {/* Un solo CTA: contratar. Sin "Agendar demo" compitiendo, el
                    botón de conversión toma el estilo primario de la tarjeta. */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: 22 }}>
                  <a
                    className="home-plan-cta"
                    href={checkoutUrl(p)}
                    {...(ctaIsExternal ? { target: "_blank", rel: "noopener" } : {})}
                    style={{
                      textDecoration: "none",
                      textAlign: "center",
                      background: th.ctaPrimaryBg,
                      color: th.ctaPrimaryColor,
                      border: 0,
                      padding: "13px 20px",
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 14.5,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      boxShadow: th.ctaPrimaryShadow,
                      boxSizing: "border-box",
                    }}
                    data-plan={p.name.toLowerCase()}
                    data-plan-billing={billing}
                    data-plan-value={checkoutValue(p)}
                    data-plan-name={`${p.name} demo`}
                  >
                    Agendar demo · {p.name}
                  </a>
                </div>

                <div style={{ borderTop: `1px solid ${th.divider}`, paddingTop: 18, flex: 1, display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      fontSize: 10.5,
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: th.label,
                      marginBottom: 12,
                    }}
                  >
                    Funciones base
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                    {p.features.map((f, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          fontFamily: "Inter",
                          fontSize: 14,
                          color: th.ink,
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          style={{
                            flex: "0 0 16px",
                            width: 16,
                            height: 16,
                            borderRadius: 999,
                            background: th.checkBg,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 2,
                          }}
                        >
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={th.checkStroke} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        </span>
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* Chips inferiores: usuarios / sucursales / canales */}
                  <div style={{ marginTop: "auto", display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {p.chips.map((c) => (
                      <span
                        key={c.label}
                        style={{
                          display: "inline-flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                          background: th.chipBg,
                          border: `1px solid ${th.chipBorder}`,
                          borderRadius: 12,
                          padding: "7px 13px",
                        }}
                      >
                        <span style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 800, color: th.ink, lineHeight: 1.2 }}>{c.num}</span>
                        <span style={{ fontFamily: "Inter", fontSize: 10.5, fontWeight: 500, color: th.sub }}>{c.label}</span>
                      </span>
                    ))}
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        background: th.chipBg,
                        border: `1px solid ${th.chipBorder}`,
                        borderRadius: 12,
                        padding: "7px 14px",
                      }}
                    >
                      <ChannelIcons channel={p.channel} color={th.iconColor} />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empuje al prepago: semestral y anual regalan la implementación.
            Desde mensual se ofrecen las dos; desde semestral se empuja al anual
            por más meses con el mismo −20%. */}
        {billing === "monthly" && (
          <div style={{ marginTop: 22, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setBilling("semester")}
              className="home-annual-nudge"
              style={{
                appearance: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
                textAlign: "center",
                background: "#fff",
                border: "1.5px solid rgba(124,58,237,.32)",
                borderRadius: 14,
                padding: "14px 22px",
                fontFamily: "Inter",
                fontSize: 15,
                color: "#4B5563",
                lineHeight: 1.5,
                boxShadow: "0 10px 30px -18px rgba(124,58,237,.65)",
                maxWidth: 760,
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#fff",
                  background: GRAD,
                  borderRadius: 999,
                  padding: "4px 10px",
                  whiteSpace: "nowrap",
                }}
              >
                Semestral
              </span>
              <span>
                {SEMESTER_DISCOUNT_PERCENT}% OFF +{" "}
                <b style={{ color: "#0A0A0A" }}>implementación gratis</b> ({SETUP_FEE_AMOUNT} USD) →
              </span>
            </button>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              className="home-annual-nudge"
              style={{
                appearance: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
                textAlign: "center",
                background: "#fff",
                border: "1.5px solid rgba(124,58,237,.32)",
                borderRadius: 14,
                padding: "14px 22px",
                fontFamily: "Inter",
                fontSize: 15,
                color: "#4B5563",
                lineHeight: 1.5,
                boxShadow: "0 10px 30px -18px rgba(124,58,237,.65)",
                maxWidth: 760,
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#fff",
                  background: GRAD,
                  borderRadius: 999,
                  padding: "4px 10px",
                  whiteSpace: "nowrap",
                }}
              >
                Anual
              </span>
              <span>
                {ANNUAL_DISCOUNT_PERCENT}% OFF +{" "}
                <b style={{ color: "#0A0A0A" }}>implementación gratis</b> ({SETUP_FEE_AMOUNT} USD) →
              </span>
            </button>
          </div>
        )}
        {billing === "semester" && (
          <div style={{ marginTop: 22, display: "flex", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              className="home-annual-nudge"
              style={{
                appearance: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
                textAlign: "center",
                background: "#fff",
                border: "1.5px solid rgba(124,58,237,.32)",
                borderRadius: 14,
                padding: "14px 22px",
                fontFamily: "Inter",
                fontSize: 15,
                color: "#4B5563",
                lineHeight: 1.5,
                boxShadow: "0 10px 30px -18px rgba(124,58,237,.65)",
                maxWidth: 760,
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#fff",
                  background: GRAD,
                  borderRadius: 999,
                  padding: "4px 10px",
                  whiteSpace: "nowrap",
                }}
              >
                Anual
              </span>
              <span>
                Mismo {ANNUAL_DISCOUNT_PERCENT}% OFF e implementación gratis, pero{" "}
                <b style={{ color: "#0A0A0A" }}>12 meses</b> anticipados →
              </span>
            </button>
          </div>
        )}

        {/* Info compartida de los 3 planes de autoservicio */}
        <div className="reveal" style={{ textAlign: "center", marginTop: 20, fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11.5, letterSpacing: "0.06em", color: "#6B7280" }}>
          Todos los planes: ingeniero E2E · soporte prioritario · permanencia mínima de 6 meses
        </div>

        {/* Captura explícita de la clínica grande de una sola sede */}
        <div className="reveal" style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center", textAlign: "center", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px 22px", fontFamily: "Inter", fontSize: 15, color: "#4B5563", lineHeight: 1.5, boxShadow: "0 4px 24px rgba(0,0,0,.03)", maxWidth: 760 }}>
            <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7C3AED", background: "rgba(124,58,237,.08)", border: "1px solid rgba(124,58,237,.22)", borderRadius: 999, padding: "4px 10px", whiteSpace: "nowrap" }}>¿Una sola sede?</span>
            <span>¿Varios box, equipo grande y cientos de citas al mes? Tu plan es <b style={{ color: "#0A0A0A" }}>Summit</b>.</span>
          </div>
        </div>

        <div className="reveal home-ia-strip" style={{ marginTop: 34, borderTop: "1px solid #EEECEA", borderBottom: "1px solid #EEECEA", padding: "14px 0", display: "flex", flexWrap: "wrap", alignItems: "center", rowGap: 10, columnGap: 4 }}>
          <div className="home-ia-label" style={{ flexShrink: 0, padding: "4px 18px 4px 0", borderRight: "1px solid #EEECEA", fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10.5, fontWeight: 600, letterSpacing: ".13em", textTransform: "uppercase", color: "#6B7280", display: "flex", alignItems: "center", whiteSpace: "nowrap", lineHeight: 1.3 }}>
            Modelo activo · todos los planes
          </div>
          <div className="home-ia-models" style={{ flex: "1 1 220px", minWidth: 0, display: "flex", flexWrap: "wrap", alignItems: "center", rowGap: 6 }}>
            {IA_MODELS.map((m) => (
              <span key={m} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "2px 18px", fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: GRAD, display: "inline-block", flexShrink: 0 }} />
                {m}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 32,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11.5,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#6B7280",
          }}
        >
          $15 USD = 5.000 créditos ≈ 166 conversaciones o ~25 agendamientos automáticos
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 10,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11.5,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#6B7280",
          }}
        >
          Facturación en USD · Stripe · MercadoPago · WebPay · Boleta o factura según país
        </div>

      </div>
      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home-pricing-grid) { grid-template-columns: 1fr !important; gap: 28px !important; }
          :global(.home-plan-card) { transform: none !important; }
          :global(.home-plan-card-featured) { order: -1; }
        }
        @media (max-width: 640px) {
          /* En móvil el anual se toma la fila completa arriba: la jerarquía se
             mantiene aunque las tres opciones no quepan en una sola línea. */
          :global(.billing-toggle) { grid-template-columns: 1fr 1fr !important; }
          :global(.billing-toggle > button:first-child) { grid-column: 1 / -1 !important; }
        }
        @media (max-width: 720px) {
          :global(.home-ia-strip) { align-items: flex-start !important; }
          :global(.home-ia-label) {
            border-right: none !important;
            border-bottom: 1px solid #EEECEA;
            padding: 0 0 10px 0 !important;
            width: 100%;
            white-space: normal !important;
          }
        }
        @media (max-width: 560px) {
          :global(.home-h2-big) { font-size: 32px !important; }
          :global(.home-billing-toggle > div) { width: 100% !important; }
          :global(.billing-toggle-option) { min-width: 0 !important; padding-left: 11px !important; padding-right: 11px !important; }
        }
        :global(.home-plan-card) {
          transition: transform .26s cubic-bezier(.16,1,.3,1), box-shadow .26s ease, filter .26s ease;
        }
        :global(.home-plan-card-featured) { transform: translateY(-8px); }
        :global(.home-plan-card:hover) {
          transform: translateY(-4px);
          filter: saturate(1.03) brightness(1.01);
        }
        :global(.home-plan-card-featured:hover) { transform: translateY(-12px); }
        :global(.home-plan-cta) {
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform .2s ease, filter .2s ease, box-shadow .2s ease;
        }
        :global(.home-plan-cta:hover) {
          transform: translateY(-2px);
          filter: brightness(.96);
        }
        :global(.home-plan-cta:focus-visible) {
          outline: 3px solid rgba(124,58,237,.55);
          outline-offset: 3px;
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.home-plan-card), :global(.home-plan-cta) { transition: none !important; }
          :global(.home-plan-card-featured), :global(.home-plan-card:hover), :global(.home-plan-card-featured:hover), :global(.home-plan-cta:hover) { transform: none !important; }
        }
        @media (max-width: 980px) {
          :global(.home-plan-card), :global(.home-plan-card-featured), :global(.home-plan-card:hover), :global(.home-plan-card-featured:hover) { transform: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   FAQ
   ============================================================ */
export function Faq() {
  const qs = HOME_FAQ;
  const [open, setOpen] = useState<number>(0);
  return (
    <section id="faq" style={{ padding: "112px 80px", borderTop: "1px solid #F0F0F0", background: "#fff" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "14px 0 0",
              color: "#0A0A0A",
            }}
          >
            Lo que siempre nos preguntan.
          </h2>
        </div>
        <div className="reveal" style={{ borderTop: "1px solid #F0F0F0" }}>
          {qs.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderBottom: "1px solid #F0F0F0" }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "transparent",
                    border: 0,
                    padding: "22px 4px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 20,
                    cursor: "pointer",
                    fontFamily: "Inter",
                  }}
                >
                  <span style={{ fontSize: 17, fontWeight: 600, color: "#0A0A0A", letterSpacing: "-0.01em" }}>
                    {it.q}
                  </span>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      border: "1px solid #E5E7EB",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#0A0A0A",
                      flex: "0 0 28px",
                      transform: isOpen ? "rotate(45deg)" : "none",
                      transition: "transform .2s",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: "0 4px 22px",
                      fontFamily: "Inter",
                      fontSize: 15.5,
                      color: "#4B5563",
                      lineHeight: 1.6,
                      maxWidth: 720,
                    }}
                  >
                    {it.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FINAL CTA
   ============================================================ */
export function FinalCTA() {
  return (
    <section id="trial" style={{ padding: "16px 80px 24px", background: "#fff" }}>
      <div
        className="reveal home-final-cta"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          borderRadius: 24,
          padding: "72px 40px",
          position: "relative",
          overflow: "hidden",
          background: "#0E1014",
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 80% at 80% 20%, rgba(217,70,239,.35) 0%, rgba(124,58,237,.15) 40%, transparent 70%),radial-gradient(ellipse 50% 60% at 10% 110%, rgba(34,211,238,.18) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="home-final-cta-grid"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <Eyebrow style={{ color: "#D946EF" }}>Agenda tu demo</Eyebrow>
            <h2
              style={{
                fontFamily: "Inter",
                fontSize: 56,
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1.02,
                margin: "16px 0 20px",
                color: "#fff",
              }}
              className="home-final-cta-title"
            >
              Coordina todo tu equipo y tus sedes con IA.
            </h2>
            <p
              style={{
                fontFamily: "Inter",
                fontSize: 18,
                color: "#A0A6B2",
                margin: "0 0 28px",
                maxWidth: 520,
                lineHeight: 1.55,
              }}
            >
              30 minutos con ventas y te mostramos cómo quedaría tu operación con IA — sobre la agenda de todo tu equipo, tu base de datos y tus precios. Sin compromiso.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href="/agenda"
                style={{
                  background: GRAD,
                  color: "#fff",
                  border: 0,
                  padding: "15px 26px",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 16,
                  fontFamily: "Inter",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 12px 32px -8px rgba(217,70,239,.5)",
                }}
              >
                Agendar demo <span>→</span>
              </Link>
              <Link
                href="/demo"
                style={{
                  background: "rgba(255,255,255,.08)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,.18)",
                  padding: "15px 26px",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 16,
                  fontFamily: "Inter",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Ver cómo funciona
              </Link>
            </div>
            <div
              style={{
                marginTop: 22,
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11.5,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#A0A6B2",
              }}
            >
              ● Onboarding asistido · Soporte en Chile y México · Factura en USD
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 16,
              padding: 24,
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: GRAD,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 20,
                }}
              >
                ✦
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: "#fff" }}>
                Así parte AURA en tu operación
              </div>
            </div>
            {[
              { n: "01", t: "Conectas tu WhatsApp Business", d: "Sin cambiar de número. 2 minutos." },
              { n: "02", t: "AURA se conecta a tu agenda y BD", d: "Importamos tu base de pacientes y horas disponibles." },
              { n: "03", t: "Empieza a responder con contexto", d: "Esta misma tarde, sabiendo quién es quién." },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "14px 0",
                  borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,.08)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    color: "#D946EF",
                    flex: "0 0 28px",
                  }}
                >
                  {s.n}
                </div>
                <div>
                  <div style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 500, color: "#fff" }}>
                    {s.t}
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: 13, color: "#A0A6B2", marginTop: 2 }}>
                    {s.d}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home-final-cta) { padding: 48px 28px !important; }
          :global(.home-final-cta-grid) { grid-template-columns: 1fr !important; gap: 32px !important; }
          :global(.home-final-cta-title) { font-size: 36px !important; }
        }
      `}</style>
    </section>
  );
}
