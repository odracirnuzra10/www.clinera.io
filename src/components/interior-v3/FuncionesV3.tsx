"use client";

import Link from "next/link";
import { ReactNode, useEffect } from "react";
import {
  CtaPrimary,
  CtaSecondary,
  Eyebrow,
  GRAD,
  Mono,
} from "@/components/brand-v3/Brand";
import ModosAgendamiento from "@/components/empleado-digital/ModosAgendamiento";

/* ============================================================
   /funciones — rediseño v3 con el lenguaje del home nuevo
   ============================================================ */

function useReveal() {
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

export default function FuncionesV3() {
  useReveal();
  return (
    <>
      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.in {
          opacity: 1;
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0ms !important;
            transition-duration: 0ms !important;
          }
        }
        @media (max-width: 720px) {
          main > section { padding-left: 32px !important; padding-right: 32px !important; }
        }
      `}</style>

      <Hero />
      <FeatureIndex />
      <FeaturesList />
      <ModosAgendamiento />
      <Testimonials />
      <FinalCTA />
    </>
  );
}


/* -------------------------------- HERO -------------------------------- */
function Hero() {
  return (
    <section style={{ position: "relative", padding: "80px 80px 40px", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 55% at 50% -5%, #DBEAFE 0%, #E9D5FF 30%, #FBE8F0 55%, #FFFFFF 80%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <span
          className="reveal"
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
          Funciones · AURA 2.0
        </span>

        <h1
          className="reveal funciones-hero-title"
          style={{
            fontFamily: "Inter",
            fontSize: 60,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1.04,
            margin: "22px auto 0",
            color: "#0A0A0A",
            maxWidth: 920,
          }}
        >
          Todo lo que hace Clinera{" "}
          <span
            style={{
              background: GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            por ti
          </span>
          , automáticamente.
        </h1>
        <p
          className="reveal"
          style={{
            fontFamily: "Inter",
            fontSize: 19,
            fontWeight: 400,
            lineHeight: 1.55,
            color: "#4B5563",
            margin: "22px auto 0",
            maxWidth: 720,
          }}
        >
          AURA no es un chatbot. Es una plataforma completa conectada a tu agenda, a tu base de
          datos de pacientes, a tus cobros y a tus anuncios. Cada función está diseñada para que tu
          clínica opere sola mientras tú atiendes.
        </p>

        <div
          className="reveal"
          style={{
            display: "flex",
            gap: 12,
            marginTop: 30,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <CtaPrimary as={Link} href="/hablar-con-ventas" style={{ padding: "15px 26px", fontSize: 16 }}>
            Hablar con ventas <span>→</span>
          </CtaPrimary>
          <CtaSecondary as={Link} href="/reunion" style={{ padding: "15px 26px", fontSize: 16 }}>
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
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M16 3v4M8 3v4M3 10h18" />
            </svg>
            Agendar reunión
          </CtaSecondary>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.funciones-hero-title) { font-size: 40px !important; }
        }
      `}</style>
    </section>
  );
}

/* ----------------------------- FEATURE INDEX ---------------------------- */
function FeatureIndex() {
  const items = [
    { eyebrow: "01 · Agenda", title: "Agenda inteligente" },
    { eyebrow: "02 · AURA", title: "IA conversacional 24/7" },
    { eyebrow: "03 · Inbox", title: "Mensajería omnicanal" },
    { eyebrow: "04 · Ficha", title: "Ficha clínica digital" },
    { eyebrow: "05 · Ventas", title: "Ventas trazables" },
    { eyebrow: "06 · Marketing", title: "Meta + Google conectados" },
  ];
  return (
    <section
      className="reveal"
      style={{ padding: "56px 80px", borderTop: "1px solid #F0F0F0", background: "#fff" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Mono>Las 6 capas de Clinera</Mono>
        </div>
        <div
          className="funciones-index-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 12,
            textAlign: "center",
          }}
        >
          {items.map((it) => (
            <div
              key={it.title}
              style={{
                background: "#FAFAFA",
                border: "1px solid #F0F0F0",
                borderRadius: 14,
                padding: "20px 14px",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#7C3AED",
                  marginBottom: 8,
                }}
              >
                {it.eyebrow}
              </div>
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0A0A0A",
                  lineHeight: 1.35,
                }}
              >
                {it.title}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 980px) {
          :global(.funciones-index-grid) { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 560px) {
          :global(.funciones-index-grid) { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

/* ----------------------------- FEATURES LIST ---------------------------- */
function FeaturesList() {
  return (
    <section style={{ padding: "64px 80px 40px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FeatureRow
          num="01"
          eyebrow="Agenda inteligente"
          title="Un calendario hecho para ir rápido, no para frenarte."
          body="Drag-and-drop fluido, atajos de teclado y filtros por profesional, servicio o sede. AURA puede leerlo y escribirlo en tiempo real — sin conflictos ni doble reserva."
          bullets={[
            "Vista día/semana/mes con drag-and-drop",
            "Bloqueos, recursos y tiempos por tratamiento",
            "Sincroniza con Google Calendar, AgendaPro, Medilink",
            "Ficha auto-creada al agendar",
          ]}
          mockup={<AgendaMock />}
        />

        <FeatureRow
          reverse
          num="02"
          eyebrow="AURA · IA 24/7"
          title="La recepcionista con IA que responde como tu clínica."
          body="AURA lee tu agenda, tu base de datos y tu catálogo de servicios antes de responder. Habla con el tono de tu equipo — formal, cercano o coloquial — y entiende audios en español LATAM."
          bullets={[
            "Memoria contextual (LangChain)",
            "Derivación automática a humano ante urgencias",
            "Aprende tus modismos, precios y promos",
            "Entiende texto y notas de voz",
          ]}
          mockup={<AuraMock />}
        />

        <FeatureRow
          num="03"
          eyebrow="Inbox omnicanal"
          title="WhatsApp, Instagram y llamadas en un solo lugar."
          body="Centraliza toda la comunicación con pacientes. El equipo humano toma la conversación cuando quiera; AURA sigue respondiendo el resto."
          bullets={[
            "Inbox unificado con filtros y etiquetas",
            "Respuestas 24/7 fuera de horario",
            "Botones de acción rápida: confirmar, reagendar, cobrar",
            "Pase a humano con un click",
          ]}
          mockup={<InboxMock />}
        />

        <FeatureRow
          reverse
          num="04"
          eyebrow="Ficha clínica digital"
          title="Historial completo, accesible en segundos."
          body="Campos personalizables por especialidad, evolución clínica ordenada en timeline, firma digital y adjuntos sin límite. Cumple Ley 19.628 con cifrado en AWS Sao Paulo."
          bullets={[
            "Plantillas por especialidad (dental, estética, médica)",
            "Evolución clínica con timeline",
            "Consentimientos informados y firma digital",
            "Adjuntos ilimitados · Cifrado en reposo y tránsito",
          ]}
          mockup={<FichaMock />}
        />

        <FeatureRow
          num="05"
          eyebrow="Ventas trazables"
          title="Cada peso, desde el anuncio hasta el cobro."
          body="Atribución real: sabes qué anuncio de Meta o Google generó cada cita y cada venta. Sin planillas, sin suposiciones, sin mezclar datos entre fuentes."
          bullets={[
            "Atribución campaña → conversación → cita → venta",
            "Dashboard de ROI en tiempo real",
            "Panel de cobros y pagos pendientes",
            "Exportable a CSV / Excel",
          ]}
          mockup={<VentasMock />}
        />

        <FeatureRow
          reverse
          num="06"
          eyebrow="Marketing"
          title="Meta Ads y Google Ads, conectados al sistema."
          body="Clinera se conecta oficialmente a Meta y Google, lee tus campañas y te dice cuál anuncio trae pacientes reales — no solo leads. Decides con datos, sin planillas."
          bullets={[
            "Conector oficial Meta Business + Google Ads",
            "Conversion API por WhatsApp",
            "Panel por campaña / audiencia / anuncio",
            "Recomendaciones de AURA para optimizar",
          ]}
          mockup={<MarketingMock />}
        />
      </div>
    </section>
  );
}

function FeatureRow({
  num,
  eyebrow,
  title,
  body,
  bullets,
  mockup,
  reverse,
}: {
  num: string;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  mockup: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className="reveal funciones-row"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 72,
        alignItems: "center",
        padding: "72px 0",
        borderTop: "1px solid #F3F2F0",
      }}
    >
      <div style={{ order: reverse ? 2 : 1 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 12,
              letterSpacing: "0.14em",
              color: "#9CA3AF",
              fontWeight: 500,
            }}
          >
            {num}
          </span>
          <span
            style={{
              width: 18,
              height: 1,
              background: "#E5E7EB",
            }}
          />
          <Eyebrow style={{ color: "#7C3AED" }}>{eyebrow}</Eyebrow>
        </div>
        <h3
          style={{
            fontFamily: "Inter",
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.06,
            margin: "8px 0 16px",
            color: "#0A0A0A",
          }}
          className="funciones-row-title"
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
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {bullets.map((b) => (
            <li
              key={b}
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
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
          :global(.funciones-row) {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
            padding: 56px 0 !important;
          }
          :global(.funciones-row > div:nth-child(1)) { order: 1 !important; }
          :global(.funciones-row > div:nth-child(2)) { order: 2 !important; }
          :global(.funciones-row-title) { font-size: 30px !important; }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------- MOCKUPS -------------------------------- */
function MockCard({ children }: { children: ReactNode }) {
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
      {children}
    </div>
  );
}

function AgendaMock() {
  const rows = [
    { t: "08:30", n: "Limpieza · Andrea V.", tag: "Confirmada" },
    { t: "10:00", n: "Consulta nueva · Carla V.", tag: "AURA", aura: true },
    { t: "11:30", n: "Control · Matías R.", tag: "Confirmada" },
    { t: "13:00", n: "—", tag: "Bloqueo almuerzo", block: true },
    { t: "15:00", n: "Primera vez · Ana M.", tag: "Pagado", paid: true, aura: true },
  ];
  return (
    <MockCard>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <Mono>Agenda · Dra. Meza · Jueves 24</Mono>
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            color: "#10B981",
            fontWeight: 500,
          }}
        >
          98% ocupación
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
              background: r.block ? "#F8FAFC" : "#FAFAFA",
              border: "1px " + (r.block ? "dashed" : "solid") + " " + (r.block ? "#E5E7EB" : "transparent"),
              borderRadius: 10,
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 12,
                color: "#6B7280",
                width: 48,
              }}
            >
              {r.t}
            </div>
            <div
              style={{
                flex: 1,
                fontSize: 13.5,
                color: r.block ? "#9CA3AF" : "#0A0A0A",
                fontWeight: r.block ? 400 : 500,
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
                color: r.aura ? "#7C3AED" : r.block ? "#6B7280" : "#059669",
                background: r.aura
                  ? "rgba(124,58,237,.06)"
                  : r.block
                  ? "#F3F4F6"
                  : "rgba(16,185,129,.08)",
                padding: "3px 8px",
                borderRadius: 999,
                border:
                  "1px solid " +
                  (r.aura ? "#DDD6FE" : r.block ? "#E5E7EB" : "#A7F3D0"),
              }}
            >
              {r.tag}
            </span>
          </div>
        ))}
      </div>
    </MockCard>
  );
}

function AuraMock() {
  return (
    <MockCard>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: GRAD,
            color: "#fff",
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px -6px rgba(124,58,237,.4)",
          }}
        >
          ✦
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: "#0A0A0A" }}>
            AURA · activa
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              color: "#10B981",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            ● En línea · &lt;1s
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            alignSelf: "flex-start",
            maxWidth: "88%",
            background: "#F3F4F6",
            color: "#0A0A0A",
            fontSize: 13.5,
            padding: "10px 13px",
            borderRadius: "14px 14px 14px 4px",
            lineHeight: 1.4,
            fontFamily: "Inter",
          }}
        >
          Hola, quería saber si atienden con Fonasa
        </div>
        <div
          style={{
            alignSelf: "flex-end",
            maxWidth: "88%",
            background: "#2EA5FF",
            color: "#fff",
            fontSize: 13.5,
            padding: "10px 13px",
            borderRadius: "14px 14px 4px 14px",
            lineHeight: 1.4,
            fontFamily: "Inter",
            boxShadow: "0 4px 10px rgba(46,165,255,.25)",
          }}
        >
          Hola 👋 Tenemos convenio Fonasa en <b>consulta general</b>. Con bono, la consulta sale
          <b> $9.800</b>. ¿Te tomo una hora con la <b>Dra. Meza</b>?
        </div>
        <div
          style={{
            alignSelf: "flex-start",
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            color: "#7C3AED",
            marginTop: 6,
          }}
        >
          → aplicó política Fonasa · leyó horario Dra. Meza
        </div>
      </div>
    </MockCard>
  );
}

function InboxMock() {
  const convos = [
    { n: "Carla V.", m: "¿Tengo hora mañana?", ch: "WA", unread: true, ts: "10:02" },
    { n: "Matías R.", m: "Reagendar 11:30 → 14:00", ch: "IG", ts: "9:48" },
    { n: "Ana M.", m: "Pago confirmado ✓", ch: "WA", ts: "9:15" },
    { n: "+56 9 4x..", m: "Audio · 0:24", ch: "WA", ts: "8:42" },
  ];
  return (
    <MockCard>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <Mono>Inbox · Todos los canales</Mono>
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            color: "#6B7280",
          }}
        >
          12 abiertas
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {convos.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 10px",
              borderRadius: 10,
              background: c.unread ? "rgba(46,165,255,.06)" : "transparent",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                background: GRAD,
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {c.n[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>
                {c.n}
              </div>
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: 12.5,
                  color: "#6B7280",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {c.m}
              </div>
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10,
                color: c.ch === "WA" ? "#10B981" : "#D946EF",
                background: c.ch === "WA" ? "#ECFDF5" : "rgba(217,70,239,.08)",
                padding: "3px 7px",
                borderRadius: 999,
                border:
                  "1px solid " + (c.ch === "WA" ? "#A7F3D0" : "rgba(217,70,239,.3)"),
                letterSpacing: "0.08em",
              }}
            >
              {c.ch}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10.5,
                color: "#9CA3AF",
              }}
            >
              {c.ts}
            </span>
          </div>
        ))}
      </div>
    </MockCard>
  );
}

function FichaMock() {
  return (
    <MockCard>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            background: GRAD,
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          CP
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Inter", fontSize: 16, fontWeight: 700, color: "#0A0A0A" }}>
            Carla Pérez
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 13, color: "#6B7280" }}>
            RUT 17.xxx.xxx-3 · 34 años · Estética facial
          </div>
        </div>
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#7C3AED",
            background: "rgba(124,58,237,.06)",
            border: "1px solid #DDD6FE",
            padding: "4px 8px",
            borderRadius: 999,
          }}
        >
          Paciente activa
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          borderTop: "1px solid #F0F0F0",
          paddingTop: 14,
        }}
      >
        {[
          { d: "14 Ago", t: "Limpieza facial", dr: "Dra. Meza", n: "Piel mixta, sin reacciones" },
          { d: "02 Jul", t: "Consulta inicial", dr: "Dra. Meza", n: "Evaluación piel · plan 6 sesiones" },
          { d: "12 May", t: "Ácido hialurónico", dr: "Dr. Rojas", n: "Labio superior 0.5ml" },
        ].map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 12, fontSize: 13 }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                color: "#9CA3AF",
                width: 58,
                flex: "0 0 58px",
                paddingTop: 3,
              }}
            >
              {e.d}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Inter", fontSize: 13.5, fontWeight: 600, color: "#0A0A0A" }}>
                {e.t} <span style={{ color: "#6B7280", fontWeight: 400 }}>· {e.dr}</span>
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "#6B7280", marginTop: 2 }}>
                {e.n}
              </div>
            </div>
          </div>
        ))}
      </div>
    </MockCard>
  );
}

function VentasMock() {
  return (
    <MockCard>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <Mono>Ventas · Últimos 30 días</Mono>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#0A0A0A",
              }}
            >
              $ 18.9M
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 12,
                color: "#10B981",
                fontWeight: 500,
              }}
            >
              +24% vs mes
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 52 }}>
          {[18, 22, 16, 30, 34, 28, 44, 50, 42, 56, 68, 72].map((h, i) => (
            <div
              key={i}
              style={{
                width: 7,
                height: h,
                borderRadius: 2,
                background:
                  i > 7
                    ? "linear-gradient(180deg,#D946EF 0%,#7C3AED 50%,#3B82F6 100%)"
                    : "#E5E7EB",
              }}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          borderTop: "1px solid #F0F0F0",
          paddingTop: 14,
        }}
      >
        {[
          { c: "Meta · Ads primera visita", v: "$ 6.2M", r: "ROAS 8.4x" },
          { c: "Google · Search marca", v: "$ 4.8M", r: "ROAS 12.1x" },
          { c: "Referidos · orgánico", v: "$ 3.9M", r: "—" },
          { c: "Recuperación AURA", v: "$ 2.1M", r: "+47 pacientes" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
            <div style={{ flex: 1, fontFamily: "Inter", color: "#0A0A0A" }}>{r.c}</div>
            <div style={{ fontFamily: "Inter", fontWeight: 600, color: "#0A0A0A" }}>{r.v}</div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                color: "#10B981",
                width: 90,
                textAlign: "right",
              }}
            >
              {r.r}
            </div>
          </div>
        ))}
      </div>
    </MockCard>
  );
}

function MarketingMock() {
  return (
    <MockCard>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <Mono>Campañas · Meta Ads</Mono>
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            color: "#10B981",
          }}
        >
          ● CAPI activo
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { c: "Primera visita LATAM", i: "Impr 184K", cpl: "$ 4.2", ag: 42, st: "Activa" },
          { c: "Retargeting · form abierto", i: "Impr 62K", cpl: "$ 2.1", ag: 18, st: "Activa" },
          { c: "Labios · mujeres 30-45", i: "Impr 94K", cpl: "$ 6.8", ag: 7, st: "Pausar" },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              background: "#FAFAFA",
              border: "1px solid #F0F0F0",
              borderRadius: 12,
              padding: 14,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>
                {c.c}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  color: "#6B7280",
                  marginTop: 4,
                }}
              >
                {c.i} · CPL {c.cpl}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0A0A0A",
                  letterSpacing: "-0.02em",
                }}
              >
                {c.ag}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10,
                  color: "#7C3AED",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                agendados
              </div>
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10,
                padding: "4px 8px",
                borderRadius: 999,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: c.st === "Activa" ? "#10B981" : "#D97706",
                background: c.st === "Activa" ? "#ECFDF5" : "#FEF3C7",
                border: "1px solid " + (c.st === "Activa" ? "#A7F3D0" : "#FDE68A"),
              }}
            >
              {c.st}
            </span>
          </div>
        ))}
      </div>
    </MockCard>
  );
}

/* ----------------------------- TESTIMONIALS ---------------------------- */
function Testimonials() {
  const cards = [
    {
      stat: "+24% en facturación",
      q: "Logramos facturar 45M adicionales gracias a la trazabilidad de ventas.",
      name: "Karla Díaz",
      role: "Método Hebe",
    },
    {
      stat: "+39% agenda ocupada",
      q: "La IA AURA recuperó pacientes que antes perdíamos fuera de horario.",
      name: "Tamara Oyarzún",
      role: "Lumina Protocolo",
    },
    {
      stat: "6.7× ROAS",
      q: "Nuestro ROAS se estabilizó en niveles récord desde la integración con Meta Ads.",
      name: "Daniela Aguilera",
      role: "Beauty Esthetics",
    },
  ];
  return (
    <section
      style={{
        padding: "112px 80px",
        background: "#FAFAFA",
        borderTop: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
          <Eyebrow>Resultados reales</Eyebrow>
          <h2
            className="funciones-test-title"
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
            Clínicas que ya operan con Clinera.
          </h2>
        </div>
        <div
          className="reveal funciones-test-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}
        >
          {cards.map((c) => (
            <div
              key={c.name}
              style={{
                background: "#fff",
                border: "1px solid #F0F0F0",
                borderRadius: 20,
                padding: 28,
                boxShadow: "0 4px 24px rgba(0,0,0,.03)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignSelf: "flex-start",
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#7C3AED",
                  background: "rgba(124,58,237,.06)",
                  border: "1px solid #DDD6FE",
                  padding: "5px 10px",
                  borderRadius: 999,
                }}
              >
                {c.stat}
              </div>
              <blockquote
                style={{
                  margin: 0,
                  fontFamily: "Inter",
                  fontSize: 17,
                  lineHeight: 1.5,
                  letterSpacing: "-0.01em",
                  color: "#0A0A0A",
                }}
              >
                &ldquo;{c.q}&rdquo;
              </blockquote>
              <div style={{ marginTop: "auto" }}>
                <div
                  style={{
                    fontFamily: "Inter",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0A0A0A",
                  }}
                >
                  {c.name}
                </div>
                <div style={{ fontFamily: "Inter", fontSize: 13, color: "#6B7280" }}>{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          :global(.funciones-test-grid) { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          :global(.funciones-test-title) { font-size: 30px !important; }
        }
      `}</style>
    </section>
  );
}

/* ------------------------------- FINAL CTA ----------------------------- */
function FinalCTA() {
  return (
    <section style={{ padding: "24px 80px 48px", background: "#fff" }}>
      <div
        className="reveal"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          borderRadius: 24,
          padding: "64px 40px",
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
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 16,
          }}
        >
          <Eyebrow style={{ color: "#D946EF" }}>Empieza hoy</Eyebrow>
          <h2
            className="funciones-finalcta-title"
            style={{
              fontFamily: "Inter",
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              margin: 0,
              color: "#fff",
              maxWidth: 820,
            }}
          >
            Conecta tu clínica a Clinera en menos de una hora.
          </h2>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 17,
              color: "#A0A6B2",
              margin: 0,
              lineHeight: 1.55,
              maxWidth: 640,
            }}
          >
            Te mostramos cómo quedaría AURA con tu agenda, tu base de datos y tus precios. 30
            minutos, sin compromiso.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap", justifyContent: "center" }}>
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
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.funciones-finalcta-title) { font-size: 30px !important; }
        }
      `}</style>
    </section>
  );
}
