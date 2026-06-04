"use client";

import Link from "next/link";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { useReveal } from "@/components/home-v3/sections";

type DemoAgent = { id: "aura" | "lia" | "camila"; name: string; soon?: boolean };

const PLANS = [
  {
    name: "Conect",
    slug: "conect",
    price: "129",
    tagline: "AURA por WhatsApp 24/7 + módulo clínico, con agendamiento automático.",
    features: [
      "~270 atenciones de IA / mes",
      "8.000 créditos IA (consumo técnico)",
      "Con modo automático de agendamiento",
      "3 usuarios incluidos",
    ],
    models: ["Gemini 3.0 Flash", "Kimi K2.6"],
    agents: [{ id: "aura", name: "AURA" }] as DemoAgent[],
    stripeUrl: "https://buy.stripe.com/28EbJ32WJ3Um4cz6VZ1441k",
  },
  {
    name: "Advanced",
    slug: "advanced",
    price: "179",
    tagline: "Más atenciones y más equipo para clínicas que ya están creciendo.",
    features: [
      "~390 atenciones de IA / mes",
      "12.000 créditos IA (consumo técnico)",
      "Con modo automático de agendamiento",
      "5 usuarios / profesionales",
      "Multisucursal",
    ],
    models: ["Gemini 3.0 Flash", "Kimi K2.6"],
    agents: [{ id: "aura", name: "AURA" }] as DemoAgent[],
    stripeUrl: "https://buy.stripe.com/4gM00l7cZ8aCfVh6VZ1441m",
  },
  {
    name: "MAX",
    slug: "max",
    price: "279",
    tagline: "Toda la potencia: LIA orquesta y CAMILA llama por voz. Para clínicas que escalan.",
    popular: true,
    features: [
      "~1.000 atenciones por texto (WhatsApp/chat) al mes",
      "~120 atenciones por voz (CAMILA) al mes",
      "28.000 créditos IA (consumo técnico)",
      "Multisucursal",
      "Webhooks + API pública",
      "15 usuarios / profesionales",
    ],
    models: ["Gemini 3.0 Flash", "Kimi K2.6", "Gemini 3.5 Flash"],
    agents: [
      { id: "aura", name: "AURA" },
      { id: "lia", name: "LIA" },
      { id: "camila", name: "CAMILA", soon: true },
    ] as DemoAgent[],
    stripeUrl: "https://buy.stripe.com/6oU14pdBn9eGeRdgwz1441n",
  },
];

export default function DemoV3() {
  useReveal();
  return (
    <>
      <style jsx global>{`
        .reveal { opacity: 0; transform: translateY(12px); transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
        .reveal.in { opacity: 1; transform: none; }
        @keyframes pulseDot { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,.45); } 70% { box-shadow: 0 0 0 10px rgba(16,185,129,0); } 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); } }
        .live-dot { animation: pulseDot 2.2s infinite; }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0ms !important; transition-duration: 0ms !important; } }
        @media (max-width: 720px) {
          main > section { padding-left: 32px !important; padding-right: 32px !important; }
        }
      `}</style>
      <DemoHero />
      <VideoSection />
      <CapabilitiesSection />
      <PlansSection />
      <DemoFinalCTA />
    </>
  );
}

function DemoHero() {
  return (
    <section
      style={{
        padding: "96px 80px 40px",
        background: "linear-gradient(180deg,#FFFFFF 0%,#FAFAFA 100%)",
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <div className="reveal" style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
        <div
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
            marginBottom: 18,
          }}
        >
          <span
            className="live-dot"
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "#10B981",
            }}
          />
          Demo en vivo · 3 min
        </div>
        <h1
          className="demo-hero-title"
          style={{
            fontFamily: "Inter",
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            margin: "0 0 16px",
            color: "#0A0A0A",
          }}
        >
          Software médico con IA y agente IA para clínicas{" "}
          <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            en acción
          </span>
          .
        </h1>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 19,
            color: "#4B5563",
            lineHeight: 1.55,
            margin: "0 auto",
            maxWidth: 680,
          }}
        >
          3 minutos para ver cómo AURA agenda pacientes por WhatsApp, gestiona fichas clínicas y rastrea tus ventas en una sola plataforma.
        </p>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.demo-hero-title) { font-size: 40px !important; }
        }
      `}</style>
    </section>
  );
}

function VideoSection() {
  return (
    <section style={{ padding: "40px 80px 80px", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 28 }}>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              margin: "0 0 12px",
              color: "#0A0A0A",
            }}
          >
            Demo en vivo
          </h2>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 17,
              color: "#4B5563",
              lineHeight: 1.6,
              margin: "0 auto",
              maxWidth: 760,
            }}
          >
            Revisa cómo Clinera.io funciona como software médico con IA para clínicas, automatizando el agendamiento por WhatsApp, la gestión clínica y la atención comercial desde una sola plataforma.
          </p>
        </div>
        <div
          className="reveal"
          style={{
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid #EEECEA",
            boxShadow: "0 30px 80px rgba(15,10,30,.10), 0 8px 20px rgba(0,0,0,.04)",
            background: "#0E1014",
          }}
        >
          <div style={{ padding: "47.04% 0 0 0", position: "relative" }}>
            <iframe
              src="https://player.vimeo.com/video/1190537955?h=80af129fe0&badge=0&autopause=0&player_id=0&app_id=58479"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
              title="Demo 2026 | Clinera.io"
            />
          </div>
        </div>
        <p
          className="reveal"
          style={{
            fontFamily: "Inter",
            fontSize: 16,
            color: "#4B5563",
            lineHeight: 1.7,
            margin: "24px auto 0",
            maxWidth: 860,
            textAlign: "center",
          }}
        >
          Este agente IA para clínicas ayuda a centros médicos, dentales y estéticos en LATAM a responder más rápido, confirmar citas y operar con un sistema de agendamiento inteligente que puede ser alternativa a AgendaPro, Dentalink, Medilink y DentalSoft.
        </p>
      </div>
    </section>
  );
}

function CapabilitiesSection() {
  return (
    <section style={{ padding: "0 80px 96px", background: "#fff" }}>
      <div
        className="demo-capabilities-grid"
        style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}
      >
        <article
          className="reveal"
          style={{
            background: "#FAFAFA",
            border: "1px solid #EEECEA",
            borderRadius: 20,
            padding: "32px 28px",
          }}
        >
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              margin: "0 0 12px",
              color: "#0A0A0A",
            }}
          >
            Agendamiento automático con IA
          </h2>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 16,
              color: "#4B5563",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Clinera automatiza reservas, recordatorios, reprogramaciones y seguimientos para que tu equipo reciba menos carga operativa y más pacientes confirmados.
          </p>
        </article>
        <article
          className="reveal"
          style={{
            background: "#FAFAFA",
            border: "1px solid #EEECEA",
            borderRadius: 20,
            padding: "32px 28px",
          }}
        >
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              margin: "0 0 12px",
              color: "#0A0A0A",
            }}
          >
            Integración con WhatsApp
          </h2>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 16,
              color: "#4B5563",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            El agente responde por WhatsApp con contexto, deriva cuando hace falta y mantiene la trazabilidad comercial y clínica en un CRM médico pensado para LATAM.
          </p>
        </article>
      </div>
      <style jsx>{`
        @media (max-width: 820px) {
          :global(.demo-capabilities-grid) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function PlansSection() {
  return (
    <section style={{ padding: "96px 80px", background: "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
          <Eyebrow>Precios</Eyebrow>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "14px 0 10px",
              color: "#0A0A0A",
            }}
          >
            Elige tu plan y activa hoy.
          </h2>
          <p style={{ fontFamily: "Inter", fontSize: 17, color: "#4B5563", margin: 0 }}>
            Sin permanencia · sin costo de implementación · precios en USD.
          </p>
        </div>
        <div
          className="demo-plans-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}
        >
          {PLANS.map((plan) => {
            const popular = !!plan.popular;
            return (
              <div
                key={plan.name}
                className="reveal"
                style={{
                  position: "relative",
                  background: popular ? "#0E1014" : "#fff",
                  color: popular ? "#fff" : "#0A0A0A",
                  border: popular ? "0" : "1px solid #EEECEA",
                  borderRadius: 20,
                  padding: "32px 28px 28px",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: popular
                    ? "0 30px 80px rgba(124,58,237,.2), 0 8px 20px rgba(0,0,0,.08)"
                    : "0 1px 2px rgba(0,0,0,0.03)",
                  overflow: "hidden",
                }}
              >
                {popular && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(ellipse 60% 60% at 80% 0%, rgba(217,70,239,.22) 0%, transparent 70%),radial-gradient(ellipse 50% 50% at 0% 100%, rgba(59,130,246,.15) 0%, transparent 60%)",
                      pointerEvents: "none",
                    }}
                  />
                )}
                <div style={{ position: "relative", display: "flex", flexDirection: "column", flex: 1 }}>
                  {popular && (
                    <span
                      style={{
                        alignSelf: "flex-start",
                        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                        fontSize: 10.5,
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        background: GRAD,
                        color: "#fff",
                        padding: "4px 10px",
                        borderRadius: 999,
                        marginBottom: 14,
                      }}
                    >
                      Recomendado · mejor costo/atención
                    </span>
                  )}
                  <h3
                    style={{
                      fontFamily: "Inter",
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      margin: 0,
                    }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "Inter",
                      fontSize: 14,
                      color: popular ? "rgba(255,255,255,.7)" : "#6B7280",
                      margin: "6px 0 16px",
                      lineHeight: 1.45,
                    }}
                  >
                    {plan.tagline}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                    <span style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 600 }}>$</span>
                    <span style={{ fontFamily: "Inter", fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
                      {plan.price}
                    </span>
                    <span style={{ fontFamily: "Inter", fontSize: 14, color: popular ? "rgba(255,255,255,.7)" : "#6B7280", marginLeft: 4 }}>
                      USD/mes
                    </span>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        style={{
                          fontFamily: "Inter",
                          fontSize: 14,
                          color: popular ? "rgba(255,255,255,.85)" : "#4B5563",
                          display: "flex",
                          gap: 10,
                          alignItems: "flex-start",
                          lineHeight: 1.45,
                        }}
                      >
                        <span
                          style={{
                            flexShrink: 0,
                            width: 18,
                            height: 18,
                            borderRadius: 999,
                            background: popular ? "rgba(16,185,129,.2)" : "#ECFDF5",
                            color: "#10B981",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 1,
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {plan.models && plan.models.length > 0 && (
                    <div
                      style={{
                        marginBottom: 20,
                        padding: "10px 12px",
                        background: popular ? "rgba(255,255,255,.06)" : "#FAFAFA",
                        border: popular ? "1px solid rgba(255,255,255,.1)" : "1px solid #E5E7EB",
                        borderRadius: 10,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                          fontSize: 9.5,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: popular ? "rgba(255,255,255,.55)" : "#9CA3AF",
                          marginBottom: 8,
                        }}
                      >
                        {plan.models.length === 1 ? "Modelo IA disponible" : "Modelos IA disponibles"}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {plan.models.map((m) => (
                          <span
                            key={m}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "4px 9px",
                              background: popular ? "rgba(255,255,255,.1)" : "#fff",
                              border: popular ? "1px solid rgba(255,255,255,.16)" : "1px solid #E5E7EB",
                              borderRadius: 999,
                              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                              fontSize: 10.5,
                              color: popular ? "#fff" : "#0A0A0A",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: "#7C3AED",
                                display: "inline-block",
                              }}
                            />
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {plan.agents && plan.agents.length > 0 && (
                    <div
                      style={{
                        marginBottom: 20,
                        padding: "10px 12px",
                        background: popular ? "rgba(255,255,255,.06)" : "#FAFAFA",
                        border: popular ? "1px solid rgba(255,255,255,.1)" : "1px solid #E5E7EB",
                        borderRadius: 10,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                          fontSize: 9.5,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: popular ? "rgba(255,255,255,.55)" : "#9CA3AF",
                          marginBottom: 8,
                        }}
                      >
                        {plan.agents.length === 1 ? "Empleado digital incluido" : "Empleados digitales incluidos"}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {plan.agents.map((a) => {
                          const gradMap: Record<DemoAgent["id"], string> = {
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
                                padding: "3px 10px 3px 3px",
                                background: popular ? "rgba(255,255,255,.1)" : "#fff",
                                border: popular ? "1px solid rgba(255,255,255,.16)" : "1px solid #E5E7EB",
                                borderRadius: 999,
                                fontFamily: "Inter, sans-serif",
                                fontSize: 11,
                                fontWeight: 600,
                                color: popular ? "#fff" : "#0A0A0A",
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
                                }}
                              >
                                {a.name.charAt(0)}
                              </span>
                              {a.name}
                              {a.soon && (
                                <span
                                  style={{
                                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                                    fontSize: 8,
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: popular ? "#C4B5FD" : "#7C3AED",
                                    background: popular ? "rgba(196,181,253,.16)" : "rgba(124,58,237,.10)",
                                    border: popular ? "1px solid rgba(196,181,253,.32)" : "1px solid rgba(124,58,237,.22)",
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
                  <Link
                    href="/hablar-con-ventas"
                    data-plan={plan.slug}
                    data-plan-value={plan.price}
                    data-plan-name={`${plan.name} talk-to-sales`}
                    style={{
                      background: popular ? GRAD : "#0A0A0A",
                      color: "#fff",
                      padding: "13px 18px",
                      borderRadius: 10,
                      fontFamily: "Inter",
                      fontWeight: 600,
                      fontSize: 14.5,
                      textDecoration: "none",
                      textAlign: "center",
                      marginBottom: 10,
                      boxShadow: popular ? "0 12px 32px -8px rgba(217,70,239,.5)" : "none",
                    }}
                  >
                    Hablar con ventas
                  </Link>
                  <a
                    href={plan.stripeUrl}
                    target="_blank"
                    rel="noopener"
                    data-plan={plan.slug}
                    data-plan-value={plan.price}
                    data-plan-name={`${plan.name} pay`}
                    style={{
                      background: popular ? "rgba(255,255,255,.1)" : "#fff",
                      color: popular ? "#fff" : "#0A0A0A",
                      border: popular ? "1px solid rgba(255,255,255,.18)" : "1px solid #E5E7EB",
                      padding: "12px 18px",
                      borderRadius: 10,
                      fontFamily: "Inter",
                      fontWeight: 600,
                      fontSize: 14,
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    Activar plan →
                  </a>
                  <p
                    style={{
                      fontFamily: "Inter",
                      fontSize: 12,
                      color: popular ? "rgba(255,255,255,.5)" : "#9CA3AF",
                      textAlign: "center",
                      margin: "10px 0 0",
                    }}
                  >
                    Sin permanencia · cancela en 1 click
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="reveal demo-enterprise-card"
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
            maxWidth: 1100,
            marginLeft: "auto",
            marginRight: "auto",
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
                fontSize: 24,
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
                fontSize: 14,
                color: "rgba(255,255,255,.75)",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: 460,
              }}
            >
              Todo de MAX + onboarding white-glove + SLA personalizado + integraciones a medida + soporte dedicado.
            </p>
          </div>
          <div
            className="demo-enterprise-right"
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
                  fontSize: 38,
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
                fontSize: 14,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Hablar con ventas →
            </Link>
          </div>
        </div>

        <div
          className="reveal demo-addons"
          style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, maxWidth: 980, margin: "48px auto 0" }}
        >
          {[
            { price: "$100", unit: "única vez", label: "Add-on de créditos IA", sub: "~300 atenciones por texto o ~50 por voz" },
            { price: "$9", unit: "/mes", label: "Profesional o usuario extra", sub: "" },
            { price: "$21", unit: "/mes", label: "Módulo Odontograma", sub: "" },
          ].map((it) => (
            <div
              key={it.label}
              style={{
                background: "#fff",
                border: "1px solid #EEECEA",
                borderRadius: 14,
                padding: "22px 24px",
                textAlign: "center",
              }}
            >
              <div style={{ fontFamily: "Inter", fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", color: "#0A0A0A" }}>
                {it.price}
                <span style={{ fontSize: 14, fontWeight: 500, color: "#6B7280", marginLeft: 4 }}>{it.unit}</span>
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 14, color: "#4B5563", marginTop: 6 }}>{it.label}</div>
              {it.sub && (
                <div style={{ fontFamily: "Inter", fontSize: 12, color: "#9CA3AF", marginTop: 4, lineHeight: 1.45 }}>{it.sub}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 960px) {
          :global(.demo-plans-grid) { grid-template-columns: 1fr !important; max-width: 460px; margin: 0 auto; }
        }
        @media (max-width: 720px) {
          :global(.demo-enterprise-card) { grid-template-columns: 1fr !important; gap: 20px !important; padding: 24px !important; }
          :global(.demo-enterprise-right) { align-items: flex-start !important; }
        }
        @media (max-width: 640px) {
          :global(.demo-addons) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function DemoFinalCTA() {
  return (
    <section style={{ padding: "16px 80px 80px", background: "#FAFAFA" }}>
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
        <div style={{ position: "relative", textAlign: "center", maxWidth: 780, margin: "0 auto" }}>
          <Eyebrow style={{ color: "#D946EF" }}>¿Tienes dudas?</Eyebrow>
          <h2
            className="demo-final-cta-title"
            style={{
              fontFamily: "Inter",
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "14px 0 14px",
              color: "#fff",
            }}
          >
            Hablemos en vivo.
          </h2>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 17,
              color: "#A0A6B2",
              lineHeight: 1.55,
              margin: "0 auto 28px",
              maxWidth: 540,
            }}
          >
            Coordina una reunión de 30 min por videollamada o escríbenos directo por WhatsApp — te respondemos al tiro.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              href="/reunion"
              style={{
                background: "rgba(255,255,255,.1)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.22)",
                padding: "14px 24px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15.5,
                fontFamily: "Inter",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18" />
              </svg>
              Agendar reunión
            </Link>
            <a
              href="https://wa.me/56985581524?text=Hola%2C%20quiero%20asistencia%20con%20Clinera."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "rgba(255,255,255,.1)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.22)",
                padding: "14px 24px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15.5,
                fontFamily: "Inter",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chatear con nosotros
            </a>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.demo-final-cta-title) { font-size: 30px !important; }
        }
      `}</style>
    </section>
  );
}
