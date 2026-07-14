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

/* ============================================================
   /migracion — Convertir clientes de AgendaPro/Reservo/Medilink + Vambe
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

export default function MigracionV3() {
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
      <CompareSection />
      <ReasonsSection />
      <ProcessSection />
      <NewFeatureSection />
      <Faq />
      <KeepYourSystemSection />
      <FinalCTA />
    </>
  );
}

/* -------------------------------- HERO -------------------------------- */
function Hero() {
  return (
    <section id="hero" style={{ position: "relative", padding: "80px 80px 40px", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 55% at 50% -5%, #FEE2E2 0%, #E9D5FF 30%, #DBEAFE 55%, #FFFFFF 80%)",
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
            ⇄
          </span>
          Migración asistida · sin permanencia
        </span>

        <h1
          className="reveal mig-hero-title"
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
          Una sola plataforma.{" "}
          <span
            style={{
              background: GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Todo el ciclo
          </span>{" "}
          del paciente, conectado.
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
            maxWidth: 760,
          }}
        >
          Si hoy usas <b>AgendaPro</b>, <b>Reservo</b> o <b>Medilink</b> + un agente IA aparte como{" "}
          <b>Vambe.ai</b>, tu IA solo ve la mitad del ciclo. Migra a Clinera y deja que un solo
          ecosistema agende, atienda, fiche y atribuya cada cita a su campaña.
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
            Quiero migrar <span>→</span>
          </CtaPrimary>
          <CtaSecondary as={Link} href="/hablar-con-ventas" style={{ padding: "15px 26px", fontSize: 16 }}>
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
            Agendar diagnóstico
          </CtaSecondary>
        </div>

        <div
          className="reveal"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginTop: 22,
            background: "#ECFDF5",
            border: "1px solid #A7F3D0",
            padding: "8px 14px",
            borderRadius: 999,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 999, background: "#10B981" }} />
          <span style={{ fontFamily: "Inter", fontSize: 13, color: "#065F46", fontWeight: 500 }}>
            Migración guiada en menos de 1 hora · Importamos tu base
          </span>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.mig-hero-title) { font-size: 40px !important; }
        }
      `}</style>
    </section>
  );
}

/* ----------------------------- COMPARE ---------------------------- */
function CompareSection() {
  return (
    <section
      style={{
        padding: "72px 80px",
        background: "#fff",
        borderTop: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
          <Mono>Antes vs después</Mono>
          <h2
            className="mig-h2"
            style={{
              fontFamily: "Inter",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              margin: "12px 0 10px",
              color: "#0A0A0A",
            }}
          >
            Pagas USD 800+ por <span style={{ color: "#B91C1C" }}>2 herramientas</span> que no se hablan.
          </h2>
          <p style={{ fontFamily: "Inter", fontSize: 17, color: "#4B5563", margin: 0, maxWidth: 760, marginLeft: "auto", marginRight: "auto", lineHeight: 1.55 }}>
            La agenda médica con API por su lado y el agente IA por otro. Dos suscripciones, datos
            partidos y nada que conecte el anuncio con la cita.
          </p>
        </div>

        <div
          className="reveal mig-compare-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 28,
            alignItems: "stretch",
          }}
        >
          {/* HOY */}
          <div
            style={{
              background: "#FFF7F5",
              border: "1px solid #FECACA",
              borderRadius: 20,
              padding: 28,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <span
              style={{
                alignSelf: "flex-start",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#B91C1C",
                background: "#FEE2E2",
                border: "1px solid #FECACA",
                padding: "5px 10px",
                borderRadius: 999,
              }}
            >
              Hoy
            </span>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.015em",
                color: "#0A0A0A",
                lineHeight: 1.2,
              }}
            >
              2 herramientas que no se hablan
            </div>
            <ToolRow
              ico="A"
              name="AgendaPro / Reservo / Medilink"
              sub="plan con API"
              price="USD 260"
              sourceHref="https://agendapro.com/cl/planes"
              sourceLabel="agendapro.com/planes"
            />
            <ToolRow
              ico="✦"
              name="Vambe.ai"
              sub="solo agenda por link"
              price="USD 550"
              sourceHref="https://www.vambe.ai/pricing"
              sourceLabel="vambe.ai/pricing"
            />
            <div
              style={{
                marginTop: "auto",
                paddingTop: 14,
                borderTop: "1px solid #FECACA",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#6B7280",
                }}
              >
                Costo / mes
              </span>
              <span
                style={{
                  fontFamily: "Inter",
                  fontSize: 32,
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: "#B91C1C",
                }}
              >
                USD 800+
              </span>
            </div>
          </div>

          {/* ARROW */}
          <div
            className="mig-arrow"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7C3AED",
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>

          {/* CON CLINERA */}
          <div
            style={{
              background: "#0E1014",
              border: "1px solid transparent",
              borderRadius: 20,
              padding: 28,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              color: "#fff",
              backgroundImage:
                "radial-gradient(ellipse 70% 80% at 100% 0%, rgba(217,70,239,.28), transparent 60%), radial-gradient(ellipse 50% 60% at 0% 120%, rgba(124,58,237,.24), transparent 60%)",
            }}
          >
            <span
              style={{
                alignSelf: "flex-start",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#A7F3D0",
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.16)",
                padding: "5px 10px",
                borderRadius: 999,
              }}
            >
              Con Clinera
            </span>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.015em",
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              Un ecosistema, una IA, un solo dato.
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {[
                "Agenda inteligente",
                "AURA · IA 24/7",
                "Ficha clínica",
                "Ventas trazables",
                "Meta + Google",
                "Cobros y pagos",
              ].map((p) => (
                <span
                  key={p}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.12)",
                    borderRadius: 999,
                    padding: "7px 12px",
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: "rgba(255,255,255,.92)",
                    fontFamily: "Inter",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: "#D946EF",
                    }}
                  />
                  {p}
                </span>
              ))}
            </div>
            <div
              style={{
                marginTop: "auto",
                paddingTop: 14,
                borderTop: "1px solid rgba(255,255,255,.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,.6)",
                }}
              >
                Costo / mes
              </span>
              <span style={{ display: "inline-flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "Inter",
                    fontSize: 16,
                    fontWeight: 500,
                    color: "rgba(255,255,255,.55)",
                    textDecoration: "line-through",
                  }}
                >
                  USD 800+
                </span>
                <span
                  style={{
                    fontFamily: "Inter",
                    fontSize: 32,
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    background: GRAD,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  USD 279
                </span>
              </span>
            </div>
            <p
              style={{
                margin: "2px 0 0",
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                letterSpacing: "0.04em",
                color: "rgba(255,255,255,.55)",
                textAlign: "right",
              }}
            >
              + USD 450 implementación (pago único)
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          :global(.mig-compare-grid) {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          :global(.mig-arrow) { transform: rotate(90deg); padding: 4px 0; }
          :global(.mig-h2) { font-size: 28px !important; }
        }
      `}</style>
    </section>
  );
}

function ToolRow({
  ico,
  name,
  sub,
  price,
  sourceHref,
  sourceLabel,
}: {
  ico: string;
  name: string;
  sub: string;
  price: string;
  sourceHref?: string;
  sourceLabel?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#fff",
        border: "1px dashed #FCA5A5",
        borderRadius: 12,
        padding: "10px 14px",
      }}
    >
      <span
        style={{
          flex: "0 0 28px",
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "#FEE2E2",
          color: "#B91C1C",
          fontWeight: 700,
          fontSize: 13,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {ico}
      </span>
      <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
        <span style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "#0A0A0A", lineHeight: 1.25 }}>
          {name}
        </span>
        <span style={{ fontFamily: "Inter", fontSize: 12, fontStyle: "italic", color: "#6B7280" }}>
          {sub}
        </span>
      </span>
      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 14,
            fontWeight: 700,
            color: "#B91C1C",
            letterSpacing: "-0.01em",
          }}
        >
          {price}
        </span>
        {sourceHref && (
          <a
            href={sourceHref}
            target="_blank"
            rel="noopener nofollow"
            style={{
              fontFamily: "Inter",
              fontSize: 10.5,
              color: "#6B7280",
              textDecoration: "underline",
              textDecorationColor: "#FCA5A5",
              textUnderlineOffset: 2,
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              whiteSpace: "nowrap",
            }}
          >
            {sourceLabel ?? "ver fuente"} <span aria-hidden style={{ fontSize: 9 }}>↗</span>
          </a>
        )}
      </span>
    </div>
  );
}

/* ----------------------------- REASONS ---------------------------- */
function ReasonsSection() {
  const reasons: Array<{
    num: string;
    title: string;
    body: string;
    bullets: string[];
    kpi: string;
    icon: ReactNode;
  }> = [
    {
      num: "01 · Ahorro",
      title: "Pagas una sola herramienta, no dos.",
      body: "Agenda médica con API USD 260 + Vambe.ai USD 550 = USD 800+/mes. Clinera Vortex incluye agente IA por USD 279. Un solo proveedor, un solo cobro.",
      bullets: [
        "Sin permanencia · un solo cobro mensual",
        "Cancelas cuando quieras",
        "Ahorro mínimo USD 500 / mes",
      ],
      kpi: "−USD 520 / mes",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      num: "02 · Centralización",
      title: "Cada interacción del paciente, en un solo lugar.",
      body: "Con 2 softwares operando paralelo no existe conector que mida el ciclo completo. Al unificar, AURA atribuye cada cita a su campaña de Meta o Google y cierra el círculo.",
      bullets: [
        "Atribución campaña → cita → venta",
        "Historial unificado por paciente",
        "Reportes sin planillas ni exports",
      ],
      kpi: "+ROAS y experiencia",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
    },
    {
      num: "03 · Modernización",
      title: "Software AI-first, no IA pegada después.",
      body: "Clinera nació con IA en su núcleo: cada módulo (agenda, ficha, cobros) está diseñado para que AURA lea y escriba sobre él. La competencia agregó IA encima — Clinera la tiene en los cimientos.",
      bullets: [
        "Memoria contextual con LangGraph",
        "Self-refine con agente juez auditable",
        "Releases continuas con eval bloqueante",
      ],
      kpi: "Listo para lo que viene",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2" />
        </svg>
      ),
    },
  ];

  return (
    <section
      style={{
        padding: "72px 80px",
        background: "#FAFAFA",
        borderTop: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
          <Eyebrow>3 razones para migrar hoy</Eyebrow>
          <h2
            className="mig-h2"
            style={{
              fontFamily: "Inter",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              margin: "12px 0 0",
              color: "#0A0A0A",
            }}
          >
            Migrar no es un costo. Es lo que te <span style={{
              background: GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}>devuelve plata, datos y tiempo</span>.
          </h2>
        </div>

        <div
          className="mig-reasons-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {reasons.map((r) => (
            <article
              key={r.num}
              className="reveal"
              style={{
                background: "#fff",
                border: "1px solid #F0F0F0",
                borderRadius: 20,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                boxShadow: "0 4px 24px rgba(0,0,0,.03)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background:
                      "linear-gradient(135deg, rgba(59,130,246,.12), rgba(124,58,237,.12), rgba(217,70,239,.12))",
                    border: "1px solid #F0F0F0",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#7C3AED",
                  }}
                >
                  {r.icon}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#7C3AED",
                  }}
                >
                  {r.num}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "Inter",
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  color: "#0A0A0A",
                  margin: 0,
                }}
              >
                {r.title}
              </h3>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 14.5,
                  color: "#4B5563",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {r.body}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {r.bullets.map((b) => (
                  <li
                    key={b}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontFamily: "Inter",
                      fontSize: 13,
                      color: "#0A0A0A",
                      lineHeight: 1.45,
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
                    {b}
                  </li>
                ))}
              </ul>
              <span
                style={{
                  alignSelf: "flex-start",
                  marginTop: "auto",
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "#065F46",
                  background: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  padding: "5px 10px",
                  borderRadius: 999,
                }}
              >
                {r.kpi}
              </span>
            </article>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          :global(.mig-reasons-grid) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ----------------------------- PROCESS ---------------------------- */
function ProcessSection() {
  const steps: { n: string; t: string; d: string; link?: { href: string; label: string } }[] = [
    {
      n: "01",
      t: "Diagnóstico de 30 min",
      d: "Revisamos tu agenda actual, tu base de pacientes y tu stack publicitario. Te decimos qué se importa, qué se reconfigura y qué se mejora.",
    },
    {
      n: "02",
      t: "Importamos tu base sin perder un paciente",
      d: "Migramos pacientes, citas futuras, fichas y catálogo de tratamientos desde AgendaPro / Reservo / Medilink. La fase corre en paralelo para que no pares de atender.",
      link: { href: "/blog/importacion-masiva-tratamientos", label: "Cómo importamos tu catálogo →" },
    },
    {
      n: "03",
      t: "Conectamos AURA + Meta + Google",
      d: "Activamos AURA con el tono de tu equipo, conectamos Conversion API por WhatsApp, Meta Business y Google Ads. La atribución empieza el día 1.",
    },
    {
      n: "04",
      t: "Go-live en menos de 1 hora",
      d: "Capacitamos a recepción, dejamos el sistema andando y monitoreamos la primera semana en vivo. Soporte humano en español LATAM.",
    },
  ];
  return (
    <section
      style={{
        padding: "72px 80px",
        background: "#fff",
        borderTop: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
          <Mono>Cómo migramos</Mono>
          <h2
            className="mig-h2"
            style={{
              fontFamily: "Inter",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              margin: "12px 0 10px",
              color: "#0A0A0A",
            }}
          >
            4 pasos. Sin parar de atender. Sin perder un paciente.
          </h2>
          <p style={{ fontFamily: "Inter", fontSize: 17, color: "#4B5563", margin: 0, maxWidth: 720, marginLeft: "auto", marginRight: "auto", lineHeight: 1.55 }}>
            La migración la corre nuestro equipo. Tú sigues atendiendo mientras el switch sucede en
            paralelo.
          </p>
        </div>

        <div
          className="mig-process-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="reveal"
              style={{
                background: "#FAFAFA",
                border: "1px solid #F0F0F0",
                borderRadius: 16,
                padding: 22,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#7C3AED",
                }}
              >
                Paso {s.n}
              </span>
              <h3
                style={{
                  fontFamily: "Inter",
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  lineHeight: 1.25,
                  color: "#0A0A0A",
                  margin: 0,
                }}
              >
                {s.t}
              </h3>
              <p style={{ fontFamily: "Inter", fontSize: 13.5, color: "#4B5563", lineHeight: 1.5, margin: 0 }}>
                {s.d}
              </p>
              {s.link && (
                <Link
                  href={s.link.href}
                  style={{
                    fontFamily: "Inter",
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#7C3AED",
                    textDecoration: "none",
                    letterSpacing: "-0.005em",
                    marginTop: 4,
                  }}
                >
                  {s.link.label}
                </Link>
              )}
              {i < steps.length - 1 && (
                <span
                  className="mig-process-arrow"
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: -14,
                    transform: "translateY(-50%)",
                    color: "#D946EF",
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 980px) {
          :global(.mig-process-grid) { grid-template-columns: 1fr 1fr !important; }
          :global(.mig-process-arrow) { display: none; }
        }
        @media (max-width: 560px) {
          :global(.mig-process-grid) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ------------------------ NEW FEATURE BANNER ----------------------- */
function NewFeatureSection() {
  return (
    <section
      style={{
        position: "relative",
        padding: "88px 80px",
        overflow: "hidden",
        borderTop: "1px solid #F0F0F0",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 80% 0%, rgba(217,70,239,.16) 0%, rgba(124,58,237,.08) 40%, transparent 70%),radial-gradient(ellipse 60% 70% at 10% 100%, rgba(59,130,246,.12) 0%, transparent 60%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        className="mig-newfeat"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.05fr)",
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
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#D946EF",
              padding: "6px 12px",
              borderRadius: 999,
              background: "rgba(217,70,239,.08)",
              border: "1px solid rgba(217,70,239,.22)",
              marginBottom: 18,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#D946EF",
                boxShadow: "0 0 0 0 rgba(217,70,239,.6)",
                animation: "migPulse 1.6s ease-out infinite",
              }}
            />
            Nuevo · Abril 2026
          </span>
          <h2
            className="mig-h2"
            style={{
              fontFamily: "Inter",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              margin: "0 0 14px",
              color: "#0A0A0A",
            }}
          >
            Tu catálogo de tratamientos,{" "}
            <em
              style={{
                fontStyle: "normal",
                background: GRAD,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              importado en minutos
            </em>
            .
          </h2>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 17,
              color: "#4B5563",
              lineHeight: 1.55,
              margin: "0 0 22px",
              maxWidth: 520,
            }}
          >
            Lo que faltaba para cerrar la migración. Pacientes y tratamientos ahora se importan en el mismo flujo — y tu equipo empieza a atender desde Clinera el día 1.
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 28px",
              display: "grid",
              gap: 10,
            }}
          >
            {[
              { t: "Más rápido", d: "100 tratamientos en 2 minutos vs 3–5 horas a mano" },
              { t: "Más seguro", d: "Validación automática de columnas, sin typos en precios" },
              { t: "Más control", d: "Cada tratamiento queda editable después de la importación" },
            ].map((b) => (
              <li
                key={b.t}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontFamily: "Inter",
                  fontSize: 14.5,
                  color: "#0A0A0A",
                  lineHeight: 1.5,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    marginTop: 7,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: GRAD,
                  }}
                />
                <span>
                  <strong style={{ fontWeight: 600 }}>{b.t}.</strong>{" "}
                  <span style={{ color: "#4B5563" }}>{b.d}</span>
                </span>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <CtaPrimary as={Link} href="/blog/importacion-masiva-tratamientos">
              Leer el artículo completo →
            </CtaPrimary>
            <CtaSecondary as={Link} href="/hablar-con-ventas">
              Hablar con migración
            </CtaSecondary>
          </div>
        </div>

        <div
          className="reveal"
          style={{
            position: "relative",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow:
              "0 24px 60px -16px rgba(124,58,237,.28),0 8px 24px -8px rgba(217,70,239,.18)",
            border: "1px solid rgba(124,58,237,.12)",
            background: "#fff",
            aspectRatio: "16 / 10",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/blog/import-tratamientos.png"
            alt="Importa todos tus tratamientos en minutos, no en horas"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </div>
      <style jsx>{`
        @keyframes migPulse {
          0% { box-shadow: 0 0 0 0 rgba(217,70,239,.5); }
          70% { box-shadow: 0 0 0 8px rgba(217,70,239,0); }
          100% { box-shadow: 0 0 0 0 rgba(217,70,239,0); }
        }
        @media (max-width: 980px) {
          :global(.mig-newfeat) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ----------------------------- FAQ ---------------------------- */
function Faq() {
  const items = [
    {
      q: "¿Tengo que parar de atender mientras migramos?",
      a: "No. Importamos tu base en paralelo y hacemos el switch fuera de horario clínico. Cero downtime para el paciente.",
    },
    {
      q: "¿Qué pasa con las citas futuras ya agendadas en AgendaPro / Reservo / Medilink?",
      a: "Se importan tal cual están en Clinera con el mismo profesional, hora y servicio. Tus pacientes no notan nada.",
    },
    {
      q: "¿Puedo seguir usando mi agenda actual y solo agregar Clinera?",
      a: "Técnicamente sí, pero el agente IA solo verá la mitad del ciclo y no podrá atribuir campañas. Vas a estar pagando dos herramientas sin aprovechar ninguna al máximo. Por eso recomendamos migrar.",
    },
    {
      q: "¿Hay permanencia o costo de implementación?",
      a: "Sin permanencia: cancelas cuando quieras. La implementación es un pago único de USD 450 — onboarding asistido por un humano que configura AURA, conecta tu WhatsApp Business, importa tus pacientes y tratamientos, integra tu agenda y capacita a tu equipo. Quedas operando el mismo día.",
    },
    {
      q: "¿Cuánto tiempo toma la migración completa?",
      a: "Diagnóstico el día 1, importación durante la primera semana, go-live en menos de 1 hora. Para clínicas con +5.000 pacientes históricos puede tomar hasta 2 semanas.",
    },
  ];
  return (
    <section
      style={{
        padding: "72px 80px",
        background: "#FAFAFA",
        borderTop: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 32 }}>
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h2
            className="mig-h2"
            style={{
              fontFamily: "Inter",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              margin: "12px 0 0",
              color: "#0A0A0A",
            }}
          >
            Lo que nos preguntan antes de migrar.
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((it) => (
            <details
              key={it.q}
              className="reveal"
              style={{
                background: "#fff",
                border: "1px solid #F0F0F0",
                borderRadius: 14,
                padding: "16px 20px",
              }}
            >
              <summary
                style={{
                  fontFamily: "Inter",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0A0A0A",
                  cursor: "pointer",
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {it.q}
                <span style={{ color: "#7C3AED", fontWeight: 700, fontSize: 18, lineHeight: 1 }}>+</span>
              </summary>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 14.5,
                  color: "#4B5563",
                  lineHeight: 1.55,
                  margin: "10px 0 0",
                }}
              >
                {it.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------- KEEP YOUR SYSTEM (Modo Por Link) ----------------------- */
function KeepYourSystemSection() {
  return (
    <section
      style={{
        position: "relative",
        padding: "80px 80px 88px",
        background: "#FBF6EE",
        borderTop: "1px solid #F0E4D2",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 50% 60% at 90% 0%, rgba(34,211,238,.10) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="mig-keep"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
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
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#0E7490",
              padding: "6px 12px",
              borderRadius: 999,
              background: "rgba(34,211,238,.10)",
              border: "1px solid rgba(14,116,144,.18)",
              marginBottom: 18,
            }}
          >
            Alternativa
          </span>
          <h2
            className="mig-h2"
            style={{
              fontFamily: "Inter",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              margin: "0 0 14px",
              color: "#0A0A0A",
            }}
          >
            ¿Aún así prefieres mantener tu sistema actual?
          </h2>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 17,
              color: "#4B5563",
              lineHeight: 1.6,
              margin: "0 0 20px",
              maxWidth: 560,
            }}
          >
            Lo respetamos. Clinera puede trabajar sobre tu AgendaPro / Reservo / Medilink usando un <strong style={{ color: "#0A0A0A", fontWeight: 600 }}>link de agendamiento</strong> — AURA conversa igual con el paciente, le entrega el link y la cita queda en tu sistema actual sin fricción.
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 28px",
              display: "grid",
              gap: 10,
            }}
          >
            {[
              { t: "AURA atiende WhatsApp 24/7", d: "Misma conversación natural, mismo tono de tu equipo" },
              { t: "El paciente recibe un link", d: "Reserva en tu sistema actual sin abandonar la conversación" },
              { t: "Tu setup queda igual", d: "No movemos nada de AgendaPro / Reservo / Medilink" },
            ].map((b) => (
              <li
                key={b.t}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontFamily: "Inter",
                  fontSize: 14.5,
                  color: "#0A0A0A",
                  lineHeight: 1.5,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    marginTop: 7,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22D3EE",
                  }}
                />
                <span>
                  <strong style={{ fontWeight: 600 }}>{b.t}.</strong>{" "}
                  <span style={{ color: "#4B5563" }}>{b.d}</span>
                </span>
              </li>
            ))}
          </ul>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 13.5,
              color: "#7C5C2C",
              lineHeight: 1.55,
              margin: "0 0 24px",
              padding: "12px 14px",
              background: "rgba(217,168,77,.10)",
              border: "1px solid rgba(217,168,77,.25)",
              borderRadius: 10,
              maxWidth: 560,
            }}
          >
            <strong style={{ fontWeight: 600 }}>El trade-off honesto:</strong> AURA no ve la cita confirmada,
            entonces pierdes atribución de campañas y trazabilidad campaña → cita → venta.
            Si te importa medir el ROI de tus anuncios, conviene migrar.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <CtaPrimary
              as={Link}
              href="/hablar-con-ventas"
              style={{
                background: "linear-gradient(135deg,#0E7490 0%,#0891B2 50%,#22D3EE 100%)",
                boxShadow:
                  "0 12px 32px -8px rgba(14,116,144,.35),0 4px 12px -2px rgba(34,211,238,.22)",
              }}
            >
              Quiero AURA con mi sistema actual
            </CtaPrimary>
            <CtaSecondary as={Link} href="#hero" style={{ background: "transparent" }}>
              Ver beneficios de migrar
            </CtaSecondary>
          </div>
        </div>

        <div
          className="reveal mig-keep-card"
          style={{
            position: "relative",
            background: "#fff",
            border: "1px solid #EFE4D0",
            borderRadius: 20,
            padding: 22,
            boxShadow: "0 24px 60px -20px rgba(60,40,10,.18)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontFamily: "Inter",
          }}
        >
          <span
            style={{
              alignSelf: "flex-start",
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#6B7280",
              padding: "5px 10px",
              borderRadius: 999,
              background: "#F4EFE6",
              border: "1px solid #E5DAC1",
            }}
          >
            Modo · Por link
          </span>
          <ChatBubble side="in">Hola, quería hora con la Dra. Meza</ChatBubble>
          <ChatBubble side="out">¡Hola! Soy AURA. Para registrarte, ¿me das tu nombre y RUT?</ChatBubble>
          <ChatBubble side="in">Carla Pérez · 17.xxx.xxx-3</ChatBubble>
          <ChatBubble side="out">Perfecto Carla. Aquí tienes el link para reservar tu hora:</ChatBubble>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              alignSelf: "flex-end",
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 12.5,
              fontWeight: 500,
              color: "#0E7490",
              background: "rgba(34,211,238,.08)",
              border: "1px solid rgba(34,211,238,.22)",
              borderRadius: 10,
              padding: "8px 12px",
              textDecoration: "none",
              maxWidth: "85%",
            }}
          >
            🔗 reservo.cl/clinica-meza/2026-04-30
          </a>
          <ChatBubble side="in">Ya agendé ✓</ChatBubble>
          <div
            style={{
              marginTop: 6,
              padding: "12px 14px",
              borderRadius: 12,
              background: "#F8F4EC",
              border: "1px solid #EFE4D0",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              fontSize: 12.5,
              color: "#4B5563",
              lineHeight: 1.5,
            }}
          >
            <span
              aria-hidden
              style={{
                flexShrink: 0,
                marginTop: 1,
                fontSize: 14,
              }}
            >
              ↗
            </span>
            <span>
              <strong style={{ color: "#0A0A0A", fontWeight: 600 }}>
                Cita queda en tu sistema actual
              </strong>
              {" — "}AURA no la ve, pero el paciente quedó atendido sin fricción.
            </span>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 980px) {
          :global(.mig-keep) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          :global(.mig-keep-card) {
            order: -1;
          }
        }
      `}</style>
    </section>
  );
}

function ChatBubble({ side, children }: { side: "in" | "out"; children: ReactNode }) {
  const isOut = side === "out";
  return (
    <div
      style={{
        alignSelf: isOut ? "flex-end" : "flex-start",
        maxWidth: "82%",
        background: isOut ? "#1F2937" : "#F3F4F6",
        color: isOut ? "#fff" : "#0A0A0A",
        padding: "9px 13px",
        borderRadius: 14,
        fontSize: 13.5,
        lineHeight: 1.4,
        letterSpacing: "-0.005em",
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------- FINAL CTA ----------------------------- */
function FinalCTA() {
  return (
    <section style={{ padding: "24px 80px 64px", background: "#fff" }}>
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
          <Eyebrow style={{ color: "#D946EF" }}>Migra esta semana</Eyebrow>
          <h2
            className="mig-finalcta-title"
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
            Deja de pagar 2 herramientas que no se hablan.
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
            30 minutos de diagnóstico, te mostramos cómo queda tu clínica con AURA en lugar de
            AgendaPro + Vambe. Sin compromiso.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 12,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
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
              href="/hablar-con-ventas"
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
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18" />
              </svg>
              Agendar diagnóstico
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.mig-finalcta-title) { font-size: 30px !important; }
        }
      `}</style>
    </section>
  );
}
