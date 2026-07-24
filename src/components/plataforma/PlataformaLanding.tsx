"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  CnnLogo,
  CtaPrimary,
  CtaSecondary,
  GRAD,
  Mono,
  Wordmark,
} from "@/components/brand-v3/Brand";
import EcosistemaDiagram from "@/components/plataforma/EcosistemaDiagram";

/* ============================================================
   /plataforma — Landing de lectura previa al wizard (/ventas).
   Rediseño v5 "enterprise": restraint cromático (blanco + near-
   black, violeta quirúrgico), marcador de segmento repetido
   (clínicas medianas y grandes · 2+ sedes o alto volumen),
   franjas institucionales (partners, tamaños de operación,
   seguridad Ley 20.584) y ritmo vertical de 150-160px.
   Sistema del repo: brand-v3, Inter + JetBrains Mono.
   ============================================================ */

const ACCENT = "#7C3AED";
const ACCENT_SOFT = "rgba(124,58,237,0.08)";
const DARK = "#0A0A0F"; // negro del patrón enterprise de la home (DarkBreak)
const HAIR = "#F1EFEC"; // hairline claro entre secciones

const MONO_STACK = "'JetBrains Mono', ui-monospace, monospace";

// Retícula estructural light (eco del patrón DarkBreak) — textura sin color.
function gridLight(maskAt: "top" | "bottom"): CSSProperties {
  const mask =
    maskAt === "top"
      ? "radial-gradient(ellipse 75% 60% at 50% 0%, #000 30%, transparent 78%)"
      : "radial-gradient(ellipse 75% 60% at 50% 100%, #000 30%, transparent 78%)";
  return {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(10,10,10,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.03) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
    maskImage: mask,
    WebkitMaskImage: mask,
    pointerEvents: "none",
    zIndex: 0,
  };
}

const STATS: { n: string; l: string }[] = [
  { n: "+52", l: "clínicas activas" },
  { n: "+500", l: "profesionales coordinados" },
  { n: "10", l: "países en LATAM" },
  { n: "24/7", l: "operación con IA" },
];

// Intro de sección centrada y numerada — unidad de jerarquía de la página.
function SectionIntro({
  num,
  eyebrow,
  title,
  sub,
  dark = false,
}: {
  num: string;
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  dark?: boolean;
}) {
  const numColor = dark ? "#A78BFA" : ACCENT;
  const eyeColor = dark ? "rgba(255,255,255,0.5)" : "#9AA0AE";
  const line = dark ? "rgba(255,255,255,0.2)" : "#D8DBE2";
  const titleColor = dark ? "#fff" : "#0A0A0A";
  const subColor = dark ? "rgba(255,255,255,0.6)" : "#4B5563";
  return (
    <div className="reveal" style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 26,
          fontFamily: MONO_STACK,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: numColor, fontWeight: 600 }}>{num}</span>
        <span style={{ width: 24, height: 1, background: line }} />
        <span style={{ color: eyeColor }}>{eyebrow}</span>
      </div>
      <h2
        className="plt-h2"
        style={{
          fontFamily: "Inter",
          fontSize: 46,
          fontWeight: 700,
          letterSpacing: "-0.033em",
          lineHeight: 1.08,
          color: titleColor,
          margin: 0,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p style={{ fontFamily: "Inter", fontSize: 19, lineHeight: 1.55, color: subColor, margin: "22px auto 0", maxWidth: 600 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export default function PlataformaLanding() {
  // Nota de atribución: gclid/fbclid se capturan y persisten globalmente en el
  // primer pageview (GclidCapture, montado en layout) → cookie .clinera.io + storage.
  // El wizard /ventas lee esa atribución desde storage; basta con links planos.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    const t = window.setTimeout(
      () => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in")),
      1200,
    );
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.in {
          opacity: 1;
          transform: none;
        }
        @keyframes pltPulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45); }
          70% { box-shadow: 0 0 0 9px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .plt-dot { animation: pltPulse 2.2s infinite; }
        @keyframes pltMsgIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
        .plt-msg { animation: pltMsgIn 0.42s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes pltBlink {
          0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-2px); }
        }
        .plt-typing i {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: rgba(196, 181, 253, 0.9);
          margin: 0 2px;
          animation: pltBlink 1.2s infinite;
        }
        .plt-typing i:nth-child(2) { animation-delay: 0.18s; }
        .plt-typing i:nth-child(3) { animation-delay: 0.36s; }
        @keyframes pltWave {
          0%, 100% { height: 5px; }
          50% { height: 17px; }
        }
        .plt-wave { display: inline-flex; align-items: center; gap: 3px; height: 20px; }
        .plt-wave i {
          display: inline-block;
          width: 3px;
          height: 6px;
          border-radius: 2px;
          background: #A78BFA;
          animation: pltWave 0.9s ease-in-out infinite;
        }
        .plt-wave i:nth-child(2) { animation-delay: 0.12s; }
        .plt-wave i:nth-child(3) { animation-delay: 0.24s; }
        .plt-wave i:nth-child(4) { animation-delay: 0.36s; }
        .plt-wave i:nth-child(5) { animation-delay: 0.48s; }
        .plt-wave i:nth-child(6) { animation-delay: 0.60s; }
        .plt-wave i:nth-child(7) { animation-delay: 0.72s; }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1 !important; transform: none !important; }
          .plt-dot, .plt-msg, .plt-typing i, .plt-wave i { animation: none; }
          .plt-msg { opacity: 1; transform: none; }
        }
        @media (max-width: 900px) {
          .plt-canales-grid { grid-template-columns: 1fr !important; }
          .plt-seg-grid { grid-template-columns: 1fr !important; }
          .plt-sec-band { grid-template-columns: 1fr !important; }
          .plt-sec-chips { justify-content: flex-start !important; max-width: none !important; }
          .plt-cred { flex-direction: column !important; gap: 26px !important; text-align: center; }
          .plt-cred-sep { display: none !important; }
        }
        @media (max-width: 760px) {
          .plt-section { padding-left: 24px !important; padding-right: 24px !important; }
          .plt-header-inner { padding-left: 24px !important; padding-right: 24px !important; }
          .plt-seg-chip { display: none !important; }
          .plt-stats { grid-template-columns: 1fr 1fr !important; gap: 36px 12px !important; padding: 36px 24px !important; }
          .plt-stats > div { border-left: none !important; }
          .plt-h1 { font-size: 40px !important; }
          .plt-h2 { font-size: 30px !important; }
          .plt-section-pad { padding-top: 96px !important; padding-bottom: 96px !important; }
        }
        @media (max-width: 460px) {
          .plt-cta-row { flex-direction: column; align-items: stretch; }
          .plt-cta-row > a { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* ============== HEADER MÍNIMO — logo + segmento + CTA ============== */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <div
          className="plt-header-inner"
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "15px 80px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Link href="/" aria-label="Clinera.io" style={{ textDecoration: "none" }}>
            <Wordmark size={20} />
          </Link>
          <span
            className="plt-seg-chip"
            style={{
              fontFamily: MONO_STACK,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#6B7280",
              background: "#FAFAFA",
              border: "1px solid #E5E7EB",
              borderRadius: 999,
              padding: "6px 14px",
              whiteSpace: "nowrap",
            }}
          >
            Para clínicas medianas y grandes
          </span>
          <CtaPrimary as={Link} href="/ventas" style={{ padding: "10px 18px", fontSize: 14 }}>
            Ver si califico <span>→</span>
          </CtaPrimary>
        </div>
      </header>

      {/* ============== HERO (centrado, dominante) ============== */}
      <section className="plt-section" style={{ position: "relative", padding: "88px 80px 110px", overflow: "hidden", background: "#fff" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 62% 44% at 50% -12%, #F4F2FA 0%, #FFFFFF 58%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <div aria-hidden style={gridLight("top")} />
        <div style={{ maxWidth: 920, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <span
            className="reveal"
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontFamily: MONO_STACK,
              fontSize: 11.5,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#374151",
              background: "#fff",
              border: "1px solid #E5E7EB",
              padding: "8px 16px",
              borderRadius: 999,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              lineHeight: 1.6,
            }}
          >
            Para clínicas medianas y grandes · 2+ sedes o alto volumen
          </span>

          <h1
            className="plt-h1 reveal"
            style={{
              fontFamily: "Inter",
              fontSize: 68,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              margin: "30px auto 0",
              color: "#0A0A0A",
              maxWidth: 880,
            }}
          >
            Una clínica que crece no se opera en cinco sistemas.{" "}
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              Se opera en uno solo, con IA.
            </span>
          </h1>

          <p
            className="reveal"
            style={{
              fontFamily: "Inter",
              fontSize: 20,
              lineHeight: 1.58,
              color: "#4B5563",
              margin: "28px auto 0",
              maxWidth: 640,
            }}
          >
            Clinera unifica agenda, WhatsApp, fichas, cobros y recuperación de pacientes de{" "}
            <b style={{ color: "#0A0A0A" }}>todas tus sedes</b> en una sola plataforma. Agentes de IA
            operan el día a día 24/7 y tú ves y controlas todo desde un solo lugar.
          </p>

          <div className="plt-cta-row reveal" style={{ display: "flex", gap: 12, marginTop: 38, justifyContent: "center", flexWrap: "wrap" }}>
            <CtaPrimary as={Link} href="/ventas" style={{ padding: "16px 30px", fontSize: 16 }}>
              Ver si tu clínica califica <span>→</span>
            </CtaPrimary>
            <CtaSecondary as={Link} href="#la-ia" style={{ padding: "16px 26px", fontSize: 16 }}>
              Ver la IA en acción
            </CtaSecondary>
          </div>

          <div className="reveal" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 30, flexWrap: "wrap" }}>
            <div style={{ display: "flex" }}>
              {["CM", "TE", "SP", "JS"].map((ini, i) => (
                <div
                  key={ini}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    background: "#F3F4F6",
                    border: "2px solid #fff",
                    outline: "1px solid #E5E7EB",
                    marginLeft: i === 0 ? 0 : -9,
                    fontFamily: "Inter",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#374151",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {ini}
                </div>
              ))}
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 14, color: "#4B5563" }}>
              <b style={{ color: "#0A0A0A" }}>+500 profesionales</b> coordinados en 10 países
            </div>
          </div>

          {/* Puente multi-sede */}
          <div className="reveal" style={{ marginTop: 76 }}>
            <Mono color="#9AA0AE" size={11}>Multi-sede por diseño</Mono>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 21,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#0A0A0A",
                marginTop: 10,
              }}
            >
              Opera 2, 5 o 20 sedes con la misma precisión que una.
            </div>
          </div>

          {/* Visual: una capa (Clinera) sobre operaciones sueltas */}
          <div className="reveal" style={{ maxWidth: 680, margin: "44px auto 0", transitionDelay: "90ms" }}>
            <UnifyVisual accent={ACCENT} accentSoft={ACCENT_SOFT} />
          </div>
        </div>
      </section>

      {/* ============== FRANJA DE CREDENCIALES ============== */}
      <CredencialesStrip />

      {/* ============== 01 · ECOSISTEMA ============== */}
      <section className="plt-section plt-section-pad" style={{ padding: "150px 80px", background: "#FBFBFA" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <SectionIntro
            num="01"
            eyebrow="Estandariza toda tu red"
            title="Unifica todas tus operaciones con IA."
            sub="Una sola fuente de verdad para tu equipo y todas tus sedes — el mismo estándar en 2, 5 o 20 sucursales. Sin planillas paralelas, sin datos que no cuadran, sin herramientas que no se hablan entre sí."
          />

          <div className="reveal" style={{ marginTop: 76 }}>
            <EcosistemaDiagram />
            <div style={{ textAlign: "center", marginTop: 30 }}>
              <Mono color="#9AA0AE" size={11}>El mismo estándar de atención en cada sucursal</Mono>
            </div>
          </div>

          {/* Stat band */}
          <div
            className="plt-stats reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
              marginTop: 76,
              padding: "48px 40px",
              background: "#fff",
              border: "1px solid #ECEAE6",
              borderRadius: 16,
            }}
          >
            {STATS.map((s, i) => (
              <div key={s.l} style={{ textAlign: "center", borderLeft: i > 0 ? "1px solid #EDEBE7" : "none" }}>
                <div
                  style={{
                    fontFamily: MONO_STACK,
                    fontSize: 44,
                    fontWeight: 600,
                    color: "#0A0A0A",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </div>
                <div style={{ fontFamily: "Inter", fontSize: 14, color: "#6B7280", marginTop: 12 }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ textAlign: "center", marginTop: 20 }}>
            <Mono color="#9AA0AE" size={11}>94% de confirmaciones automáticas · resultados sobre clínicas reales en producción</Mono>
          </div>
        </div>
      </section>

      {/* ============== SLIDE NEGRO — 02 chat + 03 canales ============== */}
      <section
        id="la-ia"
        className="plt-section plt-section-pad"
        style={{ position: "relative", background: DARK, padding: "160px 80px", overflow: "hidden", scrollMarginTop: 70 }}
      >
        {/* hairline superior con gradiente de marca */}
        <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: GRAD, opacity: 0.7 }} />
        {/* retícula estructural */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, #000 40%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, #000 40%, transparent 85%)",
            pointerEvents: "none",
          }}
        />
        {/* glows sobrios */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -200,
            right: -160,
            width: 560,
            height: 560,
            background: "radial-gradient(circle, rgba(217,70,239,0.16) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -220,
            left: -180,
            width: 560,
            height: 560,
            background: "radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* 02 — Inteligencia interna */}
          <SectionIntro
            num="02"
            eyebrow="Una sola IA · toda tu operación"
            title="Y le puedes preguntar lo que sea."
            sub="Como Clinera unifica todo, su IA conoce cada venta, cada hora y cada paciente de tus sedes. Pregúntale en español, como a un miembro más del equipo."
            dark
          />
          <AuraChat />
          <div className="reveal" style={{ textAlign: "center", marginTop: 22 }}>
            <Mono color="rgba(255,255,255,0.4)" size={10.5}>Datos consolidados de todas tus sedes, en tiempo real</Mono>
          </div>

          {/* 03 — Dos canales */}
          <div style={{ marginTop: 144 }}>
            <SectionIntro
              num="03"
              eyebrow="Una IA · dos canales"
              title="Una IA, 2 canales para atender a tus pacientes."
              sub="Tus pacientes eligen: por teléfono o por WhatsApp. La misma IA llama, confirma, reagenda y responde en ambos — sin que se te escape ninguno."
              dark
            />

            <div
              className="plt-canales-grid reveal"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 60, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}
            >
              {/* Canal 1 — Llamada de voz */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 18, padding: "26px 26px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.32)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4B5FD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 17z"/></svg>
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Inter", fontSize: 14.5, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>Llamada de voz</div>
                    <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "rgba(255,255,255,0.5)" }}>La IA llama y confirma</div>
                  </div>
                  <span style={{ fontFamily: MONO_STACK, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C4B5FD", background: "rgba(124,58,237,0.16)", border: "1px solid rgba(124,58,237,0.3)", padding: "3px 8px", borderRadius: 999 }}>AURA</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, marginBottom: 14 }}>
                  <span style={{ width: 34, height: 34, borderRadius: 999, background: "rgba(255,255,255,0.08)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>MR</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "Inter", fontSize: 13.5, fontWeight: 600, color: "#fff" }}>Sra. Rojas</div>
                    <div style={{ fontFamily: MONO_STACK, fontSize: 11, color: "#34D399" }}>en llamada · 00:14</div>
                  </div>
                  <span className="plt-wave" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontFamily: "Inter", fontSize: 13.5, lineHeight: 1.45, color: "rgba(255,255,255,0.9)" }}>
                    <span style={{ color: "#C4B5FD", fontWeight: 600 }}>IA:</span> «Hola, le confirmo su hora del martes 15:00 con la Dra. Vera.»
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: 13.5, lineHeight: 1.45, color: "rgba(255,255,255,0.6)" }}>
                    <span style={{ fontWeight: 600 }}>Paciente:</span> «Sí, ahí estaré.»
                  </div>
                </div>

                <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Inter", fontSize: 13, fontWeight: 600, color: "#34D399" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  Cita confirmada por teléfono
                </div>
              </div>

              {/* Canal 2 — WhatsApp */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 18, padding: "26px 26px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(37,211,102,0.14)", border: "1px solid rgba(37,211,102,0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/></svg>
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Inter", fontSize: 14.5, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>WhatsApp</div>
                    <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "rgba(255,255,255,0.5)" }}>La IA responde y confirma</div>
                  </div>
                  <span style={{ fontFamily: MONO_STACK, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C4B5FD", background: "rgba(124,58,237,0.16)", border: "1px solid rgba(124,58,237,0.3)", padding: "3px 8px", borderRadius: 999 }}>AURA</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "6px 2px 2px" }}>
                  <div style={{ alignSelf: "flex-start", maxWidth: "88%", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.92)", fontFamily: "Inter", fontSize: 13, lineHeight: 1.4, padding: "9px 12px", borderRadius: 12, borderBottomLeftRadius: 3 }}>¿Le confirmo su hora de mañana a las 11:00?</div>
                  <div style={{ alignSelf: "flex-end", maxWidth: "80%", background: "rgba(37,211,102,0.16)", border: "1px solid rgba(37,211,102,0.28)", color: "#fff", fontFamily: "Inter", fontSize: 13, lineHeight: 1.4, padding: "9px 12px", borderRadius: 12, borderBottomRightRadius: 3 }}>Sí, gracias</div>
                  <div style={{ alignSelf: "flex-start", maxWidth: "88%", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.92)", fontFamily: "Inter", fontSize: 13, lineHeight: 1.4, padding: "9px 12px", borderRadius: 12, borderBottomLeftRadius: 3 }}>¡Listo! Quedó confirmada.</div>
                </div>

                <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Inter", fontSize: 13, fontWeight: 600, color: "#34D399" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  Confirmada por WhatsApp
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== 04 · TAMAÑO DE OPERACIÓN ============== */}
      <SegmentoOperacion />

      {/* ============== SEGURIDAD / COMPLIANCE ============== */}
      <SeguridadBand />

      {/* ============== CTA FINAL ============== */}
      <section
        className="plt-section plt-section-pad"
        style={{ position: "relative", padding: "150px 80px 170px", overflow: "hidden", borderTop: `1px solid ${HAIR}`, background: "#fff" }}
      >
        <div aria-hidden style={gridLight("bottom")} />
        <div className="reveal" style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2
            className="plt-h2"
            style={{
              fontFamily: "Inter",
              fontSize: 54,
              fontWeight: 700,
              letterSpacing: "-0.038em",
              lineHeight: 1.05,
              color: "#0A0A0A",
              margin: 0,
            }}
          >
            Hablemos de{" "}
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              tu operación.
            </span>
          </h2>
          <p style={{ fontFamily: "Inter", fontSize: 19, lineHeight: 1.58, color: "#4B5563", margin: "24px auto 0", maxWidth: 580 }}>
            Si operas una clínica con equipo — o una red con varias sedes — en 30 minutos te mostramos
            cómo se vería unificada: con tus números y tus sedes, no una demo genérica.
          </p>

          <div className="plt-cta-row" style={{ display: "flex", gap: 12, marginTop: 38, justifyContent: "center", flexWrap: "wrap" }}>
            <CtaPrimary as={Link} href="/ventas" style={{ padding: "17px 36px", fontSize: 16 }}>
              Ver si califico <span>→</span>
            </CtaPrimary>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 30,
              fontFamily: MONO_STACK,
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#6B7280",
            }}
          >
            {["Desde USD 279/mes", "Sin permanencia", "Migración incluida", "WhatsApp Business API"].map((t, i) => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                {i > 0 && <span style={{ color: "#D1D5DB" }}>·</span>}
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ============ Franja de credenciales — partners + prensa + evidencia ============ */
function CredencialesStrip() {
  const badges = [
    { src: "/images/badges/meta-business-partner.svg", alt: "Meta Business Partner" },
    { src: "/images/badges/whatsapp-business.svg", alt: "WhatsApp Business API oficial" },
    { src: "/images/badges/stripe.svg", alt: "Stripe — pagos certificados" },
    { src: "/images/badges/google-calendar.svg", alt: "Google Calendar — integración oficial" },
  ];
  return (
    <section
      className="plt-section"
      aria-label="Respaldo: partners oficiales, prensa y evidencia auditada"
      style={{ background: "#fff", borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}`, padding: "36px 80px" }}
    >
      <div
        className="plt-cred reveal"
        style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 36 }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <span aria-hidden style={{ width: 24, height: 1, background: "#D8DBE2" }} />
          <Mono color="#9AA0AE" size={11}>Respaldo y partners</Mono>
        </span>

        <span className="plt-cred-sep" aria-hidden style={{ width: 1, height: 36, background: "#EFEDEA" }} />

        <span style={{ display: "inline-flex", alignItems: "center", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          {badges.map((b) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={b.src} src={b.src} alt={b.alt} width={147} height={44} loading="lazy" decoding="async" style={{ display: "block" }} />
          ))}
        </span>

        <span className="plt-cred-sep" aria-hidden style={{ width: 1, height: 36, background: "#EFEDEA" }} />

        <span style={{ display: "inline-flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Mono color="#9AA0AE" size={11}>Visto en</Mono>
          <CnnLogo height={20} />
          <span aria-hidden style={{ color: "#D1D5DB" }}>·</span>
          <Mono color="#6B7280" size={11}>100% de agendamientos en ≤3 intentos · estudio auditado · 42 casos</Mono>
        </span>
      </div>
    </section>
  );
}

/* ============ 04 · Tamaño de operación — escalera de segmentos (auto-calificación) ============ */
function SegmentoOperacion() {
  return (
    <section className="plt-section plt-section-pad" style={{ background: "#fff", borderTop: `1px solid ${HAIR}`, padding: "150px 80px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <SectionIntro
          num="04"
          eyebrow="Para operaciones con volumen"
          title="¿De qué tamaño es tu operación?"
          sub="Clinera está diseñada para clínicas con equipo — desde una sede con alto volumen hasta cadenas con decenas de sucursales. Elige tu plan por el tamaño de tu operación."
        />

        <div
          className="plt-seg-grid reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
            marginTop: 64,
            maxWidth: 1080,
            marginLeft: "auto",
            marginRight: "auto",
            alignItems: "stretch",
          }}
        >
          {/* A — Una sede con equipo */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 18,
              padding: "30px 28px",
            }}
          >
            <Mono color={ACCENT} size={10.5}>01 · Una sede con equipo</Mono>
            <div style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.015em", margin: "14px 0 0" }}>
              Clínica con equipo y volumen
            </div>
            <p style={{ fontFamily: "Inter", fontSize: 14.5, lineHeight: 1.55, color: "#4B5563", margin: "10px 0 22px" }}>
              Varios profesionales, recepción y cientos de citas al mes que ordenar.
            </p>
            <div style={{ marginTop: "auto" }}>
              <div style={{ paddingTop: 18, borderTop: "1px solid #F1EFEC" }}>
                <Mono color="#6B7280" size={11}>Vortex · desde USD 279/mes</Mono>
              </div>
              <Link
                href="/ventas"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "#0A0A0A", textDecoration: "none", marginTop: 16 }}
              >
                Ver si califico <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* B — Multi-sede (destacada) */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              background: "#fff",
              border: "1px solid #0A0A0A",
              borderRadius: 18,
              padding: "30px 28px",
              overflow: "hidden",
            }}
          >
            <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: GRAD }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <Mono color={ACCENT} size={10.5}>02 · Dos o más sedes</Mono>
              <span
                style={{
                  fontFamily: MONO_STACK,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#0A0A0A",
                  background: "#F5F3FF",
                  border: "1px solid #DDD6FE",
                  borderRadius: 999,
                  padding: "3px 9px",
                  whiteSpace: "nowrap",
                }}
              >
                El más elegido
              </span>
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.015em", margin: "14px 0 0" }}>
              Clínicas multi-sede
            </div>
            <p style={{ fontFamily: "Inter", fontSize: 14.5, lineHeight: 1.55, color: "#4B5563", margin: "10px 0 22px" }}>
              Estandariza la atención y consolida el control central de todas tus sucursales.
            </p>
            <div style={{ marginTop: "auto" }}>
              <div style={{ paddingTop: 18, borderTop: "1px solid #F1EFEC" }}>
                <Mono color="#6B7280" size={11}>Atlas USD 379 · Summit USD 479 · sucursales ilimitadas</Mono>
              </div>
              <Link
                href="/ventas"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "#0A0A0A", textDecoration: "none", marginTop: 16 }}
              >
                Ver si califico <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* C — Cadenas y redes (ancla enterprise, dark) */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              background: DARK,
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 18,
              padding: "30px 28px",
              overflow: "hidden",
            }}
          >
            <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: GRAD }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: "#D946EF", display: "inline-block" }} />
              <Mono color="rgba(255,255,255,0.65)" size={10.5}>03 · Cadenas y redes</Mono>
            </span>
            <div style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.015em", margin: "14px 0 0" }}>
              Cadenas, redes y hospitales
            </div>
            <p style={{ fontFamily: "Inter", fontSize: 14.5, lineHeight: 1.55, color: "rgba(255,255,255,0.72)", margin: "10px 0 22px" }}>
              White-glove, SLA, integraciones a medida y consolidado central de toda la red.
            </p>
            <div style={{ marginTop: "auto" }}>
              <div style={{ paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "baseline", gap: 8 }}>
                <Mono color="rgba(255,255,255,0.5)" size={10.5}>Desde</Mono>
                <span style={{ fontFamily: "Inter", fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>$1.900</span>
                <Mono color="rgba(255,255,255,0.5)" size={10.5}>USD/mes</Mono>
              </div>
              <Link
                href="/ventas"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "#fff", textDecoration: "none", marginTop: 16 }}
              >
                Ver si califico <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="reveal" style={{ textAlign: "center", marginTop: 28 }}>
          <Mono color="#9AA0AE" size={11}>
            El wizard te ubica en el plan correcto según tus sucursales y pacientes al mes — toma 2 minutos
          </Mono>
        </div>
      </div>
    </section>
  );
}

/* ============ Banda de seguridad / compliance — Ley 20.584 ============ */
function SeguridadBand() {
  const chips = ["AES-256-GCM", "1 llave por clínica · Cloud KMS", "Access log Ley 20.584", "Backups + PITR"];
  return (
    <section className="plt-section" style={{ background: "#FBFBFA", borderTop: `1px solid ${HAIR}`, padding: "64px 80px" }}>
      <div
        className="plt-sec-band reveal"
        style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" }}
      >
        <div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <Mono color="#9AA0AE" size={11}>Seguridad y cumplimiento</Mono>
          </span>
          <div style={{ fontFamily: "Inter", fontSize: 22, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.02em", margin: "12px 0 0" }}>
            Seguridad de nivel enterprise.
          </div>
          <p style={{ fontFamily: "Inter", fontSize: 15, lineHeight: 1.55, color: "#4B5563", margin: "8px 0 0", maxWidth: 520 }}>
            Cifrado, aislamiento por clínica y trazabilidad de acceso a cada ficha — bajo la Ley 20.584
            de derechos del paciente.
          </p>
        </div>
        <div
          className="plt-sec-chips"
          style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 520, justifyContent: "flex-end" }}
        >
          {chips.map((c) => (
            <span
              key={c}
              style={{
                fontFamily: MONO_STACK,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#4B5563",
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: "8px 12px",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Chat IA interno — AURA responde sobre tus operaciones ============ */
const AURA_TURNS: { q: string; a: ReactNode }[] = [
  { q: "¿Cuánto vendí este mes?", a: <>Vas en <b>$18.240.000</b> — 12% sobre el mes pasado.</> },
  { q: "¿Cuántos no-shows tuve esta semana?", a: <>9 no-shows. Ya reagendé <b>6</b> por WhatsApp, sola.</> },
  { q: "¿Qué sede rinde más?", a: <>Providencia: <b>91%</b> de ocupación. Ñuñoa va en 73%.</> },
  { q: "¿Cuánto tengo por cobrar?", a: <><b>$3.180.000</b> pendientes. Envié 14 recordatorios hoy.</> },
];

function AuraChat() {
  // Un solo intervalo → estado derivado (lint-safe: setState va en el callback del timer).
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => s + 1), 2200);
    return () => window.clearInterval(id);
  }, []);
  const ti = Math.floor(step / 2) % AURA_TURNS.length;
  const turn = AURA_TURNS[ti];
  const answered = step % 2 === 1;

  return (
    <div className="reveal" style={{ maxWidth: 480, margin: "60px auto 0" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: 18,
          backdropFilter: "blur(8px)",
          boxShadow: "0 40px 90px -40px rgba(0,0,0,0.85)",
        }}
      >
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", gap: 11, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/agents/aura.jpg"
            alt="AURA — agente de IA de Clinera"
            width={38}
            height={38}
            loading="lazy"
            decoding="async"
            style={{ borderRadius: 999, objectFit: "cover", border: "1px solid rgba(255,255,255,0.15)" }}
          />
          <div>
            <div style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>AURA</div>
            <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Núcleo IA · toda tu operación</div>
          </div>
          <span
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: MONO_STACK,
              fontSize: 10.5,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#34D399",
            }}
          >
            <span className="plt-dot" style={{ width: 7, height: 7, borderRadius: 999, background: "#10B981" }} />
            en línea
          </span>
        </div>

        {/* cuerpo del chat */}
        <div style={{ minHeight: 128, display: "flex", flexDirection: "column", gap: 10, padding: "16px 2px 8px" }}>
          <div
            key={`q-${ti}`}
            className="plt-msg"
            style={{
              alignSelf: "flex-end",
              maxWidth: "82%",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              fontFamily: "Inter",
              fontSize: 14,
              lineHeight: 1.45,
              padding: "10px 13px",
              borderRadius: 13,
              borderBottomRightRadius: 3,
            }}
          >
            {turn.q}
          </div>
          {answered ? (
            <div
              key={`a-${ti}`}
              className="plt-msg"
              style={{
                alignSelf: "flex-start",
                maxWidth: "90%",
                background: "rgba(124,58,237,0.18)",
                border: "1px solid rgba(124,58,237,0.32)",
                color: "rgba(255,255,255,0.96)",
                fontFamily: "Inter",
                fontSize: 14,
                lineHeight: 1.45,
                padding: "10px 13px",
                borderRadius: 13,
                borderBottomLeftRadius: 3,
              }}
            >
              {turn.a}
            </div>
          ) : (
            <div
              key={`t-${ti}`}
              className="plt-msg"
              style={{
                alignSelf: "flex-start",
                background: "rgba(124,58,237,0.14)",
                border: "1px solid rgba(124,58,237,0.28)",
                padding: "13px 15px",
                borderRadius: 13,
                borderBottomLeftRadius: 3,
              }}
            >
              <span className="plt-typing" style={{ display: "inline-flex", alignItems: "center" }}>
                <i />
                <i />
                <i />
              </span>
            </div>
          )}
        </div>

        {/* input decorativo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 6,
            padding: "11px 14px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
          }}
        >
          <span style={{ fontFamily: "Inter", fontSize: 13.5, color: "rgba(255,255,255,0.42)", flex: 1 }}>
            Pregúntale a tu operación…
          </span>
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: GRAD,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============ Visual del hero: una capa (Clinera) sobre módulos sueltos ============ */
function UnifyVisual({ accent, accentSoft }: { accent: string; accentSoft: string }) {
  const modulos = ["Agenda", "WhatsApp", "Fichas", "Cobros", "Recuperación", "Reportes"];
  const sedes = ["Providencia", "Las Condes", "Viña del Mar"];
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #EAEAEA",
        borderRadius: 20,
        boxShadow: "0 40px 90px -44px rgba(17,19,24,0.28)",
        padding: 24,
        textAlign: "left",
      }}
    >
      {/* barra tipo app */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 16 }}>
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FF5F57" }} />
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FEBC2E" }} />
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "#28C840" }} />
        <span
          style={{
            marginLeft: 8,
            fontFamily: MONO_STACK,
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "#9CA3AF",
            textTransform: "uppercase",
          }}
        >
          clinera · panel único
        </span>
      </div>

      {/* fila de sedes — consolidado multi-sucursal */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {sedes.map((s, i) => (
          <span
            key={s}
            style={{
              fontFamily: "Inter",
              fontSize: 12,
              fontWeight: 600,
              padding: "5px 10px",
              borderRadius: 8,
              background: i === 0 ? "#F6F5FF" : "#FAFAFA",
              border: i === 0 ? "1px solid rgba(124,58,237,0.3)" : "1px solid #EFEDEA",
              color: i === 0 ? "#5B21B6" : "#6B7280",
            }}
          >
            {s}
          </span>
        ))}
        <span
          style={{
            marginLeft: "auto",
            fontFamily: MONO_STACK,
            fontSize: 10.5,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#059669",
          }}
        >
          3 sedes · consolidado central
        </span>
      </div>

      {/* núcleo IA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          borderRadius: 12,
          background: accentSoft,
          border: `1px solid rgba(124,58,237,0.18)`,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: GRAD,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontFamily: "Inter",
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          c
        </span>
        <div>
          <div style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>Una sola IA operando</div>
          <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "#6B7280" }}>Todas tus sedes, en tiempo real</div>
        </div>
        <span
          style={{
            marginLeft: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: MONO_STACK,
            fontSize: 10.5,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#059669",
          }}
        >
          <span className="plt-dot" style={{ width: 7, height: 7, borderRadius: 999, background: "#10B981" }} />
          activo
        </span>
      </div>

      {/* módulos unificados */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {modulos.map((m) => (
          <div
            key={m}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "11px 13px",
              borderRadius: 10,
              background: "#FAFAFA",
              border: "1px solid #EFEDEA",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4 4 10-10.5" />
            </svg>
            <span style={{ fontFamily: "Inter", fontSize: 13.5, fontWeight: 500, color: "#0A0A0A" }}>{m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
