"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, ReactNode } from "react";
import { CtaPrimary, CtaSecondary, Eyebrow, Mono, GRAD } from "@/components/brand-v3/Brand";
import { HOME_FAQ } from "@/content/home-faq";

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
              EMPLEADO DIGITAL · AURA
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
              Contrata un{" "}
              <span
                style={{
                  background: GRAD,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                empleado digital
              </span>
              .<br />
              Atiende 24/7.
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
              No es un chatbot. Es un agente que <b style={{ color: "#0A0A0A" }}>ejecuta funciones</b>: crea citas, re-agenda, consulta pagos y revisa sesiones. Hace el 100% del trabajo de tu recepcionista — por WhatsApp, sin descanso.
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
              <CtaPrimary as={Link} href="/hablar-con-ventas" style={{ padding: "15px 26px", fontSize: 16 }}>
                Hablar con ventas <span>→</span>
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
                Ver demo
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
                <b style={{ color: "#0A0A0A" }}>+500 médicos</b> en 10 países · Sin tarjeta · Cancela
                cuando quieras
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
              <span>+2.400 citas agendadas por IA</span>
              <span style={{ color: "#9CA3AF" }}>·</span>
              <span>
                Desde <b style={{ color: "#0A0A0A" }}>$129</b> vs ~$950 recepcionista
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

      {/* Floating chat card */}
      <div
        style={{
          position: "absolute",
          bottom: -36,
          left: -22,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 20px 48px rgba(15,10,30,.18)",
          border: "1px solid #F0F0F0",
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
    "Clínica Andes",
    "Dermaclinic",
    "Centro Estético Aurora",
    "protocololumina.cl",
    "Vitaderma",
    "Nuevo Ser",
    "Hospital del Valle",
    "Clínica Providencia",
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
              Tres empleados digitales que{" "}
              <span
                style={{
                  background: GRAD,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                ejecutan tu front-desk
              </span>{" "}
              — 24/7, sin licencias.
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
        status={{ kind: "live", label: "Activa ahora" }}
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

      {/* CAMILA — small teaser card between agents */}
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
        status={{ kind: "dev", label: "En desarrollo" }}
        stat={{ value: "+21%", label: "cupos recuperados al mes" }}
        cta={{ label: "Anotarme a la beta de LIA", href: "/contacto" }}
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
                    ? "Sin tarjeta · activá en 1 hora"
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
   CAMILA PEEK — small "coming next" card between AURA and LIA
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
                  background: "rgba(245,158,11,0.07)",
                  color: "#B45309",
                  border: "1px solid #FDE68A",
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 999,
                    background: "#F59E0B",
                  }}
                />
                Próximamente · agosto 2026
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
              <b style={{ color: "#0A0A0A" }}>Contrata ahora y tendrás a CAMILA gratis</b> en tu plan cuando salga — sin pagar nada extra al lanzamiento.
            </div>
          </div>

          {/* Action */}
          <Link
            href="/planes"
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
            Asegurar acceso →
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
   PRICING
   ============================================================ */
type Agent = { id: "aura" | "lia" | "camila"; name: string; soon?: boolean };

export type Billing = "monthly" | "annual";

export function BillingToggle({ billing, onChange }: { billing: Billing; onChange: (b: Billing) => void }) {
  const annual = billing === "annual";
  const base = {
    appearance: "none" as const,
    cursor: "pointer",
    border: 0,
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 999,
    transition: "background .2s, color .2s, box-shadow .2s",
  };
  return (
    <div
      role="group"
      aria-label="Frecuencia de facturación"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 999,
        padding: 5,
        boxShadow: "0 1px 2px rgba(0,0,0,.05)",
      }}
    >
      <button
        type="button"
        onClick={() => onChange("monthly")}
        aria-pressed={!annual}
        style={{
          ...base,
          background: !annual ? "#0A0A0A" : "transparent",
          color: !annual ? "#fff" : "#4B5563",
          padding: "9px 20px",
        }}
      >
        Mensual
      </button>
      <button
        type="button"
        onClick={() => onChange("annual")}
        aria-pressed={annual}
        style={{
          ...base,
          background: annual ? "#0A0A0A" : "transparent",
          color: annual ? "#fff" : "#4B5563",
          padding: "9px 20px",
        }}
      >
        Anual
      </button>
    </div>
  );
}

export function Pricing({ showCredits = false }: { showCredits?: boolean } = {}) {
  const plans = [
    {
      name: "Conect",
      price: "$129",
      perAppt: "$0.13",
      credits: "10.000",
      sub: "AURA por WhatsApp 24/7 + módulo clínico, con agendamiento automático.",
      tags: [
        { t: "Agente IA", ok: true },
        { t: "Módulo Clínico", ok: true },
      ],
      features: [
        "1.000 conversaciones / 80 agendamientos al mes",
        "3 usuarios incluidos",
      ],
      modos: ["Eficiente", "Agentic"],
      agents: [{ id: "aura", name: "AURA" }] as Agent[],
      stripe: "https://buy.stripe.com/28EbJ32WJ3Um4cz6VZ1441k",
      annualMonthly: "$99",
      annualTotal: "$1.190",
      saveYear: "$358",
      stripeAnnual: "https://buy.stripe.com/bJe7sNfJvbmOdN9a8b1441r",
    },
    {
      name: "Advanced",
      price: "$179",
      perAppt: "$0.12",
      credits: "15.000",
      sub: "Más capacidad y más equipo para clínicas que ya están creciendo.",
      tags: [
        { t: "Agente IA", ok: true },
        { t: "Módulo Clínico", ok: true },
      ],
      headline: "Todo de Conect, más",
      features: [
        "1.500 conversaciones / 150 agendamientos al mes",
        "5 usuarios / profesionales",
        "Multisucursal",
      ],
      modos: ["Eficiente", "Agentic"],
      agents: [{ id: "aura", name: "AURA" }] as Agent[],
      stripe: "https://buy.stripe.com/4gM00l7cZ8aCfVh6VZ1441m",
      annualMonthly: "$141",
      annualTotal: "$1.690",
      saveYear: "$458",
      stripeAnnual: "https://buy.stripe.com/9B6dRbapbduW4czfsv1441q",
    },
    {
      name: "MAX",
      price: "$279",
      perAppt: "$0.09",
      credits: "28.000",
      sub: "Toda la potencia: LIA orquesta y CAMILA llama por voz. Para clínicas que escalan.",
      featured: true,
      bestValue: true,
      tags: [
        { t: "Agente IA", ok: true },
        { t: "Módulo Clínico", ok: true },
      ],
      headline: "Todo de Advanced, más",
      features: [
        "3.200 conversaciones / 500 agendamientos al mes",
        "~120 llamadas de voz (CAMILA) al mes",
        "Multisucursal",
        "Webhooks + API pública",
        "15 usuarios / profesionales",
      ],
      modos: ["Eficiente", "Agentic", "Agentic Pro"],
      agents: [
        { id: "aura", name: "AURA" },
        { id: "lia", name: "LIA" },
        { id: "camila", name: "CAMILA", soon: true },
      ] as Agent[],
      stripe: "https://buy.stripe.com/6oU14pdBn9eGeRdgwz1441n",
      annualMonthly: "$224",
      annualTotal: "$2.690",
      saveYear: "$658",
      stripeAnnual: "https://buy.stripe.com/8x28wRapbfD424r6VZ1441s",
    },
  ];

  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const annual = billing === "annual";

  return (
    <section
      id="precios"
      style={{
        padding: "112px 80px",
        background: "#FAFAFA",
        borderTop: "1px solid #F0F0F0",
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
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div className="reveal" style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
          <Eyebrow>Planes</Eyebrow>
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
            Tu próximo empleado parte en $129. Y trabaja 24/7.
          </h2>
          <p style={{ fontFamily: "Inter", fontSize: 17, color: "#4B5563", margin: 0, lineHeight: 1.55 }}>
            Una recepcionista te cuesta ~$950 USD/mes en LATAM, trabaja 45 horas semana y se enferma. Un empleado digital de Clinera <b>parte en $129/mes</b>, no descansa y no escala con sueldo. Sin contratos, sin permanencia.
          </p>
        </div>

        <div className="reveal" style={{ display: "flex", justifyContent: "center", marginBottom: 44 }}>
          <BillingToggle billing={billing} onChange={setBilling} />
        </div>

        <div
          className="reveal home-pricing-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1.18fr",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          {plans.map((p) => (
            <article
              key={p.name}
              className={p.featured ? "home-plan-card home-plan-card-featured" : "home-plan-card"}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: p.featured ? "40px 34px" : "34px 30px",
                border: p.featured ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                boxShadow: p.featured
                  ? "0 36px 80px -16px rgba(124,58,237,.30), 0 12px 28px rgba(217,70,239,.12)"
                  : "0 4px 24px rgba(0,0,0,.03)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                transform: p.featured ? "translateY(-8px)" : "none",
              }}
            >
              {p.featured && (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: GRAD,
                    borderRadius: "20px 20px 0 0",
                  }}
                />
              )}
              {p.featured && (
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: GRAD,
                    color: "#fff",
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 10.5,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "7px 16px",
                    borderRadius: 999,
                    fontWeight: 600,
                    boxShadow: "0 10px 24px -4px rgba(124,58,237,.45)",
                    whiteSpace: "nowrap",
                  }}
                >
                  ★ El más elegido · mejor costo/conversación
                </div>
              )}
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#0A0A0A",
                  letterSpacing: "-0.01em",
                }}
              >
                {p.name}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 10, marginBottom: 4 }}>
                <div
                  style={{
                    fontFamily: "Inter",
                    fontSize: 48,
                    fontWeight: 800,
                    color: "#0A0A0A",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {annual ? p.annualMonthly : p.price}
                </div>
                <div style={{ fontFamily: "Inter", fontSize: 14, color: "#6B7280" }}>/mes</div>
              </div>
              <div style={{ minHeight: 20, marginBottom: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {annual && (
                  <>
                    <span style={{ fontFamily: "Inter", fontSize: 13, color: "#6B7280" }}>
                      facturado anual · {p.annualTotal} USD/año
                    </span>
                    <span style={{ fontFamily: "Inter", fontSize: 12.5, color: "#9CA3AF", textDecoration: "line-through" }}>
                      {p.price}/mes
                    </span>
                  </>
                )}
              </div>
              {annual && (
                <div style={{ marginBottom: 10 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "Inter",
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#065F46",
                      background: "#ECFDF5",
                      border: "1px solid #A7F3D0",
                      padding: "4px 10px",
                      borderRadius: 999,
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                    Ahorras {p.saveYear} al año
                  </span>
                </div>
              )}
              {p.perAppt && (
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 11,
                    color: p.bestValue ? "#10B981" : "#9CA3AF",
                    fontWeight: p.bestValue ? 600 : 400,
                    letterSpacing: "0.02em",
                    marginTop: 4,
                    marginBottom: 14,
                  }}
                >
                  {p.perAppt} por conversación
                </div>
              )}
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: 14,
                  color: "#4B5563",
                  marginBottom: 18,
                  lineHeight: 1.5,
                  minHeight: 42,
                }}
              >
                {p.sub}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
                {p.tags.map((t, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "Inter",
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: t.ok ? "#065F46" : "#9CA3AF",
                      background: t.ok ? "#ECFDF5" : "#F3F4F6",
                      border: "1px solid " + (t.ok ? "#A7F3D0" : "#E5E7EB"),
                      padding: "5px 10px",
                      borderRadius: 999,
                    }}
                  >
                    {t.ok ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    )}
                    {t.t}
                  </span>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #F3F2F0", paddingTop: 18, marginBottom: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 10.5,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#6B7280",
                    marginBottom: 12,
                  }}
                >
                  {p.headline || "Incluye"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {showCredits && p.credits && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 8,
                        padding: "11px 13px",
                        marginBottom: 4,
                        background: p.featured ? "rgba(124,58,237,.05)" : "#F7F6F3",
                        border: "1px solid " + (p.featured ? "rgba(124,58,237,.18)" : "#E5E7EB"),
                        borderRadius: 10,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#0A0A0A",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {p.credits}
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                          fontSize: 10.5,
                          fontWeight: 500,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#6B7280",
                        }}
                      >
                        créditos / mes
                      </span>
                    </div>
                  )}
                  {p.features.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        fontFamily: "Inter",
                        fontSize: 14,
                        color: "#0A0A0A",
                        lineHeight: 1.5,
                      }}
                    >
                      <span
                        style={{
                          flex: "0 0 16px",
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          background: "#ECFDF5",
                          border: "1px solid #A7F3D0",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: 2,
                        }}
                      >
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      </span>
                      {f}
                    </div>
                  ))}
                </div>

                {p.modos && p.modos.length > 0 && (
                  <div
                    style={{
                      marginTop: "auto",
                      padding: "18px 18px",
                      background: p.featured ? "rgba(124,58,237,.04)" : "#FAFAFA",
                      border: p.featured ? "1px solid rgba(124,58,237,.18)" : "1px solid #E5E7EB",
                      borderRadius: 12,
                      minHeight: 104,
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                        fontSize: 9.5,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#9CA3AF",
                        marginBottom: 12,
                      }}
                    >
                      {p.modos.length === 1 ? "Modo de agendamiento" : "Modos de agendamiento"}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {p.modos.map((m) => {
                        const dotColor =
                          m === "Eficiente" ? "#009FE3"
                          : m === "Agentic" ? "#7C3AED"
                          : "#C850C0";
                        return (
                          <span
                            key={m}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "6px 12px",
                              background: "#fff",
                              border: "1px solid #E5E7EB",
                              borderRadius: 999,
                              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                              fontSize: 11,
                              color: "#0A0A0A",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: dotColor,
                                display: "inline-block",
                              }}
                            />
                            {m}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {p.agents && p.agents.length > 0 && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: "18px 18px",
                      background: p.featured ? "rgba(124,58,237,.04)" : "#FAFAFA",
                      border: p.featured ? "1px solid rgba(124,58,237,.18)" : "1px solid #E5E7EB",
                      borderRadius: 12,
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                        fontSize: 9.5,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#9CA3AF",
                        marginBottom: 12,
                      }}
                    >
                      {p.agents.length === 1 ? "Empleado digital incluido" : "Empleados digitales incluidos"}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {p.agents.map((a) => {
                        const gradMap: Record<Agent["id"], string> = {
                          aura: "linear-gradient(135deg,#3B82F6,#7C3AED)",
                          lia: "linear-gradient(135deg,#7C3AED,#C850C0)",
                          camila: "linear-gradient(135deg,#C850C0,#F59E0B)",
                        };
                        return (
                          <span
                            key={a.id}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "4px 10px 4px 4px",
                              background: "#fff",
                              border: "1px solid #E5E7EB",
                              borderRadius: 999,
                              fontFamily: "Inter, sans-serif",
                              fontSize: 11.5,
                              fontWeight: 600,
                              color: "#0A0A0A",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                background: gradMap[a.id],
                                color: "#fff",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 9.5,
                                fontWeight: 700,
                                letterSpacing: 0,
                              }}
                            >
                              {a.name.charAt(0)}
                            </span>
                            {a.name}
                            {a.soon && (
                              <span
                                style={{
                                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                                  fontSize: 8.5,
                                  fontWeight: 700,
                                  letterSpacing: "0.08em",
                                  textTransform: "uppercase",
                                  color: "#7C3AED",
                                  background: "rgba(124,58,237,.10)",
                                  border: "1px solid rgba(124,58,237,.22)",
                                  borderRadius: 4,
                                  padding: "1px 5px",
                                  marginLeft: 2,
                                }}
                              >
                                pronto
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
                <Link
                  href="/hablar-con-ventas"
                  style={{
                    textDecoration: "none",
                    textAlign: "center",
                    background: p.featured ? GRAD : "#fff",
                    color: p.featured ? "#fff" : "#0A0A0A",
                    border: p.featured ? "0" : "1px solid #0A0A0A",
                    padding: "13px 20px",
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 14.5,
                    fontFamily: "Inter",
                    boxShadow: p.featured ? "0 10px 24px -8px rgba(124,58,237,.45)" : "none",
                    boxSizing: "border-box",
                  }}
                >
                  Hablar con ventas
                </Link>
                <a
                  href={annual ? p.stripeAnnual : p.stripe}
                  target="_blank"
                  rel="noopener"
                  style={{
                    textDecoration: "none",
                    textAlign: "center",
                    background: "#F3F4F6",
                    color: "#0A0A0A",
                    border: "1px solid #E5E7EB",
                    padding: "13px 20px",
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 14.5,
                    fontFamily: "Inter",
                    boxSizing: "border-box",
                  }}
                  data-plan={p.name.toLowerCase()}
                  data-plan-billing={annual ? "annual" : "monthly"}
                  data-plan-value={(annual ? p.annualTotal : p.price).replace(/[$.]/g, "")}
                  data-plan-name={`${p.name} pay ${annual ? "annual" : "monthly"}`}
                >
                  {annual ? "Activar plan anual" : "Activar plan"}
                </a>
                <div
                  style={{
                    textAlign: "center",
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 11,
                    letterSpacing: "0.02em",
                    color: "#3D4250",
                    marginTop: 2,
                  }}
                >
                  Sin permanencia · Implementación $0 · Cancela cuando quieras
                </div>
              </div>
            </article>
          ))}
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
          Una conversación = un intercambio completo de IA con un paciente · un agendamiento crea o mueve la cita en tu agenda
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

        <div
          className="reveal home-enterprise-card"
          style={{
            marginTop: 36,
            background: "linear-gradient(135deg, #0E1014 0%, #1F1B2E 100%)",
            borderRadius: 18,
            padding: "32px 36px",
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 32,
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 24px 48px -16px rgba(124,58,237,.25)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: GRAD,
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.6)",
                marginBottom: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#D946EF",
                  display: "inline-block",
                }}
              />
              Corporativo · plan personalizado
            </div>
            <h3
              style={{
                fontFamily: "Inter",
                fontSize: 26,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
                margin: "0 0 10px",
              }}
            >
              Cadenas, hospitales y redes médicas
            </h3>
            <p
              style={{
                fontFamily: "Inter",
                fontSize: 14.5,
                color: "rgba(255,255,255,.75)",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: 480,
              }}
            >
              Todo de MAX + onboarding white-glove + SLA personalizado + integraciones a medida + soporte dedicado + facturación adaptada.
            </p>
          </div>
          <div
            className="home-enterprise-right"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,.55)",
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Desde
              </span>
              <span
                style={{
                  fontFamily: "Inter",
                  fontSize: 40,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                $1.500
              </span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,.55)" }}>USD/mes</span>
            </div>
            <Link
              href="/hablar-con-ventas"
              data-plan="corporativo"
              data-plan-value="1500"
              data-plan-name="Corporativo talk-to-sales"
              style={{
                background: "#fff",
                color: "#0E1014",
                padding: "12px 24px",
                borderRadius: 999,
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: 14.5,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Hablar con ventas →
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home-pricing-grid) { grid-template-columns: 1fr !important; gap: 28px !important; }
          :global(.home-plan-card) { transform: none !important; }
          :global(.home-plan-card-featured) { order: -1; }
        }
        @media (max-width: 720px) {
          :global(.home-enterprise-card) { grid-template-columns: 1fr !important; gap: 20px !important; padding: 24px !important; }
          :global(.home-enterprise-right) { align-items: flex-start !important; }
        }
        @media (max-width: 560px) {
          :global(.home-h2-big) { font-size: 32px !important; }
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
            <Eyebrow style={{ color: "#D946EF" }}>Empieza hoy</Eyebrow>
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
              Contrata a AURA hoy. Esta noche ya está agendando.
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
              30 minutos con ventas y te mostramos cómo quedaría tu empleado digital — con tu agenda, tu base de datos y tus precios. Sin compromiso.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href="/hablar-con-ventas"
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
                Hablar con ventas <span>→</span>
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
                Ver demo
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
              ● Activación en &lt; 1 hora · Soporte en Chile y México · Factura en USD
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
                Así parte AURA en tu clínica
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
