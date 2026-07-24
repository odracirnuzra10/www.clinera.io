"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { CtaPrimary, CtaSecondary, GRAD, Wordmark } from "@/components/brand-v3/Brand";
import EcosistemaDiagram from "@/components/plataforma/EcosistemaDiagram";

/* ============================================================
   /plataforma — Landing de lectura previa al wizard (/ventas)
   Objetivo: dejar claro que Clinera unifica e integra TODA la
   operación de la clínica con IA, y calificar por volumen + equipo
   para que una clínica demasiado pequeña se descarte sola.
   Sistema visual: brand-v3 (Inter + JetBrains Mono), light-first,
   acento dominante violeta (#7C3AED). CTAs → /ventas.
   ============================================================ */

const ACCENT = "#7C3AED";
const ACCENT_SOFT = "rgba(124,58,237,0.08)";

// Eyebrow mono reutilizable (convención del sitio)
function Eyebrow({ children, color = "#10B981" }: { children: ReactNode; color?: string }) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color,
      }}
    >
      {children}
    </span>
  );
}

const STATS: { n: string; l: string }[] = [
  { n: "+52", l: "clínicas activas" },
  { n: "+500", l: "profesionales coordinados" },
  { n: "10", l: "países en LATAM" },
  { n: "24/7", l: "operación con IA" },
];

export default function PlataformaLanding() {
  // Nota de atribución: gclid/fbclid se capturan y persisten globalmente en el
  // primer pageview (GclidCapture, montado en layout) → cookie .clinera.io + storage.
  // El wizard /ventas lee esa atribución desde storage, así que basta con links
  // planos y crawleables (sin arrastrar el query string) para no perder tracking.
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
    // Fallback: si el observer no dispara, revela igual (paridad con el resto del sitio).
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
          transform: translateY(14px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
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
          .plt-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .plt-canales-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 760px) {
          .plt-section { padding-left: 28px !important; padding-right: 28px !important; }
          .plt-header-inner { padding-left: 28px !important; padding-right: 28px !important; }
          .plt-unifica-grid { grid-template-columns: 1fr !important; }
          .plt-stats { grid-template-columns: 1fr 1fr !important; gap: 28px 16px !important; }
          .plt-h1 { font-size: 40px !important; }
          .plt-h2 { font-size: 30px !important; }
        }
        @media (max-width: 460px) {
          .plt-cta-row { flex-direction: column; align-items: stretch; }
          .plt-cta-row > a { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* ============== HEADER MÍNIMO — solo logo + CTA (landing sin nav) ============== */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.86)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid #EEECEA",
        }}
      >
        <div
          className="plt-header-inner"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "13px 80px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link href="/" aria-label="Clinera.io" style={{ textDecoration: "none" }}>
            <Wordmark size={20} />
          </Link>
          <CtaPrimary as={Link} href="/ventas" style={{ padding: "10px 18px", fontSize: 14 }}>
            Ver si califico <span>→</span>
          </CtaPrimary>
        </div>
      </header>

      {/* ============== HERO ============== */}
      <section
        className="plt-section"
        style={{ position: "relative", padding: "64px 80px 64px", overflow: "hidden" }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 78% 50% at 15% -10%, #EDE4FF 0%, #F4EEFF 34%, #FFFFFF 72%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div
            className="plt-hero-grid"
            style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, alignItems: "center" }}
          >
            <div className="reveal">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.11em",
                  textTransform: "uppercase",
                  color: "#0A0A0A",
                  background: "#fff",
                  border: "1px solid #E9E4F5",
                  padding: "6px 12px",
                  borderRadius: 999,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <span
                  className="plt-dot"
                  style={{ width: 7, height: 7, borderRadius: 999, background: "#10B981", display: "inline-block" }}
                />
                Una sola plataforma · Operación clínica con IA
              </span>

              <h1
                className="plt-h1"
                style={{
                  fontFamily: "Inter",
                  fontSize: 56,
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.04,
                  margin: "20px 0 0",
                  color: "#0A0A0A",
                }}
              >
                Una clínica que crece no se opera en cinco sistemas.{" "}
                <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                  Se opera en uno solo, con IA.
                </span>
              </h1>

              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 18.5,
                  lineHeight: 1.58,
                  color: "#4B5563",
                  margin: "22px 0 0",
                  maxWidth: 560,
                }}
              >
                Clinera unifica agenda, WhatsApp, fichas, cobros y recuperación de pacientes de{" "}
                <b style={{ color: "#0A0A0A" }}>todas tus sedes</b> en una sola plataforma. Agentes de
                IA operan el día a día 24/7 y tú ves y controlas todo desde un solo lugar.
              </p>

              <div className="plt-cta-row" style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
                <CtaPrimary as={Link} href="/ventas" style={{ padding: "15px 26px", fontSize: 16 }}>
                  Ver si tu clínica califica <span>→</span>
                </CtaPrimary>
                <CtaSecondary as={Link} href="#la-ia" style={{ padding: "15px 24px", fontSize: 16 }}>
                  Ver la IA en acción
                </CtaSecondary>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
                <div style={{ display: "flex" }}>
                  {["#EDE9FE", "#FCE7F3", "#DBEAFE", "#D1FAE5"].map((c, i) => (
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
                      {["CM", "TE", "SP", "JS"][i]}
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: "Inter", fontSize: 13.5, color: "#4B5563" }}>
                  <b style={{ color: "#0A0A0A" }}>+500 profesionales</b> coordinados en 10 países
                </div>
              </div>
            </div>

            {/* Visual: capa única sobre operaciones sueltas */}
            <div className="reveal" style={{ transitionDelay: "90ms" }}>
              <UnifyVisual accent={ACCENT} accentSoft={ACCENT_SOFT} />
            </div>
          </div>
        </div>
      </section>

      {/* ============== LO QUE UNIFICA ============== */}
      <section className="plt-section" style={{ padding: "24px 80px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ maxWidth: 720 }}>
            <Eyebrow>Una capa sobre toda tu operación</Eyebrow>
            <h2
              className="plt-h2"
              style={{
                fontFamily: "Inter",
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.12,
                color: "#0A0A0A",
                margin: "12px 0 0",
              }}
            >
              Unifica todas tus operaciones con IA.
            </h2>
            <p style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 1.55, color: "#4B5563", margin: "14px 0 0" }}>
              Una sola fuente de verdad para tu equipo y tus sedes. Sin planillas paralelas, sin datos
              que no cuadran, sin herramientas que no se hablan entre sí.
            </p>
          </div>

          <div style={{ marginTop: 48 }}>
            <EcosistemaDiagram />
          </div>

          {/* Stat band */}
          <div
            className="plt-stats reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
              marginTop: 40,
              padding: "30px 32px",
              background: "#FAFAFA",
              border: "1px solid #EFEDEA",
              borderRadius: 16,
            }}
          >
            {STATS.map((s) => (
              <div key={s.l}>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 30,
                    fontWeight: 600,
                    color: "#0A0A0A",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </div>
                <div style={{ fontFamily: "Inter", fontSize: 13.5, color: "#6B7280", marginTop: 8 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== SLIDE NEGRO — chat IA interno + 2 canales ============== */}
      <section
        id="la-ia"
        className="plt-section"
        style={{ position: "relative", background: "#0D0F14", padding: "92px 80px", overflow: "hidden", scrollMarginTop: 70 }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -160,
            right: -140,
            width: 520,
            height: 520,
            background: "radial-gradient(circle, rgba(124,58,237,0.16) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* ---- Chat IA interno (estilo /presentacion) ---- */}
          <div className="reveal" style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <Eyebrow color="#A78BFA">Una sola IA · toda tu operación</Eyebrow>
            <h2
              className="plt-h2"
              style={{
                fontFamily: "Inter",
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.12,
                color: "#fff",
                margin: "12px 0 0",
              }}
            >
              Y le puedes preguntar lo que sea.
            </h2>
            <p style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 1.55, color: "rgba(255,255,255,0.65)", margin: "14px auto 0", maxWidth: 560 }}>
              Como Clinera unifica todo, su IA conoce cada venta, cada hora y cada paciente de tus sedes.
              Pregúntale en español, como a un miembro más del equipo.
            </p>
          </div>

          <AuraChat />

          {/* ---- Una IA, 2 canales: voz + WhatsApp ---- */}
          <div className="reveal" style={{ maxWidth: 680, marginTop: 100 }}>
            <Eyebrow color="#A78BFA">Una IA · dos canales</Eyebrow>
            <h2
              className="plt-h2"
              style={{
                fontFamily: "Inter",
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.12,
                color: "#fff",
                margin: "12px 0 0",
              }}
            >
              Una IA, 2 canales para atender a tus pacientes.
            </h2>
            <p style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 1.55, color: "rgba(255,255,255,0.65)", margin: "14px 0 0" }}>
              Tus pacientes eligen: por teléfono o por WhatsApp. La misma IA llama, confirma, reagenda y
              responde en ambos — sin que se te escape ninguno.
            </p>
          </div>

          <div
            className="plt-canales-grid reveal"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 40 }}
          >
            {/* Canal 1 — Llamada de voz */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "24px 24px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.32)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4B5FD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 17z"/></svg>
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Inter", fontSize: 14.5, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>Llamada de voz</div>
                  <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "rgba(255,255,255,0.5)" }}>La IA llama y confirma</div>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C4B5FD", background: "rgba(124,58,237,0.16)", border: "1px solid rgba(124,58,237,0.3)", padding: "3px 8px", borderRadius: 999 }}>AURA</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, marginBottom: 14 }}>
                <span style={{ width: 34, height: 34, borderRadius: 999, background: "rgba(255,255,255,0.08)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>MR</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Inter", fontSize: 13.5, fontWeight: 600, color: "#fff" }}>Sra. Rojas</div>
                  <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11, color: "#34D399" }}>en llamada · 00:14</div>
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
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "24px 24px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(37,211,102,0.14)", border: "1px solid rgba(37,211,102,0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/></svg>
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Inter", fontSize: 14.5, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>WhatsApp</div>
                  <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "rgba(255,255,255,0.5)" }}>La IA responde y confirma</div>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C4B5FD", background: "rgba(124,58,237,0.16)", border: "1px solid rgba(124,58,237,0.3)", padding: "3px 8px", borderRadius: 999 }}>AURA</span>
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
      </section>

      {/* ============== CTA FINAL ============== */}
      <section className="plt-section" style={{ position: "relative", padding: "88px 80px", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 60% 60% at 50% 120%, #F1EBFF 0%, #FFFFFF 70%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <div className="reveal" style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2
            className="plt-h2"
            style={{
              fontFamily: "Inter",
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.08,
              color: "#0A0A0A",
              margin: 0,
            }}
          >
            Si tu clínica ya opera con volumen,{" "}
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              hablemos.
            </span>
          </h2>
          <p style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 1.58, color: "#4B5563", margin: "18px auto 0", maxWidth: 560 }}>
            30 minutos con nuestro equipo. Te mostramos cómo se vería tu operación unificada — con tus
            números y tus sedes, no una demo genérica.
          </p>

          <div className="plt-cta-row" style={{ display: "flex", gap: 12, marginTop: 30, justifyContent: "center", flexWrap: "wrap" }}>
            <CtaPrimary as={Link} href="/ventas" style={{ padding: "16px 30px", fontSize: 16 }}>
              Ver si califico <span>→</span>
            </CtaPrimary>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 22,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
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
    <div className="reveal" style={{ maxWidth: 470, margin: "40px auto 0" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 18,
          padding: 16,
          backdropFilter: "blur(8px)",
          boxShadow: "0 30px 70px -34px rgba(0,0,0,0.8)",
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
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
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
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #EAEAEA",
        borderRadius: 18,
        boxShadow: "0 24px 60px -30px rgba(17,19,24,0.22)",
        padding: 22,
      }}
    >
      {/* barra tipo app */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 18 }}>
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FF5F57" }} />
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FEBC2E" }} />
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "#28C840" }} />
        <span
          style={{
            marginLeft: 8,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "#9CA3AF",
            textTransform: "uppercase",
          }}
        >
          clinera · panel único
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
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
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
