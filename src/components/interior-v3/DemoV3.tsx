"use client";

import CtaPar from "@/components/cta/CtaPar";

import DemoVideoFrame from "@/components/demo/DemoVideoFrame";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { useReveal } from "@/components/home-v3/sections";
import PlanesVigentes from "@/components/pricing/PlanesVigentes";

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
      <PlanesVigentes
        id="precios"
        titulo="Elige cómo"
        tituloAcento="quieres partir."
        bajada="Software con IA, o software más marketing de performance. Lo vemos contigo en una videollamada."
      />
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
    <section style={{ padding: "40px 24px 80px", background: "#fff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
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
          <DemoVideoFrame playerId="demo" />
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
          {/* Ricardo, 4-nov-2026: los dos CTA del sitio (reemplazan agenda + WhatsApp). */}
          <CtaPar oscuro centrado />
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
