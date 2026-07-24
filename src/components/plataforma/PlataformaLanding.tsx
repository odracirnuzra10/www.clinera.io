"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { CtaPrimary, CtaSecondary, GRAD } from "@/components/brand-v3/Brand";

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

// Íconos stroke afilados propios (sin Lucide / sin emoji)
function IcoAgenda() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
      <path d="M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2" />
    </svg>
  );
}
function IcoWhatsapp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19l1.3-3.2A7.5 7.5 0 1 1 8.2 18.7L4 19z" />
      <path d="M9 10c0 2.5 2.5 5 5 5" />
      <path d="M9 10c0-.8.6-1.2 1.1-1 .5.2.9 1.4.9 1.7 0 .4-.5.7-.7 1M14 15c.8 0 1.2-.6 1-1.1-.2-.5-1.4-.9-1.7-.9-.4 0-.7.5-1 .7" />
    </svg>
  );
}
function IcoFicha() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M9 3.5V6h6V3.5M9 11h6M9 14.5h4" />
    </svg>
  );
}
function IcoCobros() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M6.5 14.5h3" />
    </svg>
  );
}
function IcoRecupera() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 4v4h-4" />
    </svg>
  );
}
function IcoControl() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  );
}

const UNIFICA: { icon: ReactNode; title: string; desc: string }[] = [
  {
    icon: <IcoAgenda />,
    title: "Agenda unificada",
    desc: "La agenda de todo tu equipo y todas tus sedes en una sola vista. Sin choques ni horas-box vacías.",
  },
  {
    icon: <IcoWhatsapp />,
    title: "WhatsApp con IA",
    desc: "Agenda, reagenda, confirma, cobra y recupera pacientes por WhatsApp 24/7. Ningún mensaje sin responder.",
  },
  {
    icon: <IcoFicha />,
    title: "Ficha clínica",
    desc: "Historia, tratamientos y consentimientos de cada paciente, iguales en toda tu red de sedes.",
  },
  {
    icon: <IcoCobros />,
    title: "Cobros y pagos",
    desc: "Abonos y links de pago conectados a la agenda. La plata deja de perseguirse a mano.",
  },
  {
    icon: <IcoRecupera />,
    title: "Recuperación de pacientes",
    desc: "La IA detecta quién no volvió y lo reactiva. El paciente que ya tienes vale más que uno nuevo.",
  },
  {
    icon: <IcoControl />,
    title: "Control central",
    desc: "Ocupación, ingresos y rendimiento por sede y por profesional, en tiempo real y en un solo lugar.",
  },
];

const STATS: { n: string; l: string }[] = [
  { n: "+52", l: "clínicas activas" },
  { n: "+500", l: "profesionales coordinados" },
  { n: "10", l: "países en LATAM" },
  { n: "24/7", l: "operación con IA" },
];

const SI = [
  "Tienes un equipo: varios profesionales, recepción o coordinación.",
  "Ves cientos de pacientes al mes, en una sede grande o en varias.",
  "Ya usas un software y se te quedó corto para coordinar todo.",
  "Pierdes horas y dinero en no-shows y leads que nadie responde a tiempo.",
];

const NO = [
  "Eres un profesional independiente que atiende solo o sola.",
  "Estás recién partiendo y ves pocos pacientes al mes.",
  "Buscas la opción más barata o una herramienta gratis.",
  "No tienes a nadie operando el día a día de la clínica.",
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
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1 !important; transform: none !important; }
          .plt-dot { animation: none; }
        }
        @media (max-width: 900px) {
          .plt-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .plt-qual-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 760px) {
          .plt-section { padding-left: 28px !important; padding-right: 28px !important; }
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

      {/* ============== HERO ============== */}
      <section
        className="plt-section"
        style={{ position: "relative", padding: "76px 80px 64px", overflow: "hidden" }}
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
                <CtaSecondary as={Link} href="#para-quien" style={{ padding: "15px 24px", fontSize: 16 }}>
                  ¿Es para mi clínica?
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
              Todo lo que hoy vive en herramientas sueltas, integrado.
            </h2>
            <p style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 1.55, color: "#4B5563", margin: "14px 0 0" }}>
              Una sola fuente de verdad para tu equipo y tus sedes. Sin planillas paralelas, sin datos
              que no cuadran, sin herramientas que no se hablan entre sí.
            </p>
          </div>

          <div
            className="plt-unifica-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              marginTop: 44,
            }}
          >
            {UNIFICA.map((f, i) => (
              <div
                key={f.title}
                className="reveal"
                style={{
                  background: "#fff",
                  border: "1px solid #EAEAEA",
                  borderRadius: 14,
                  padding: "26px 24px",
                  transitionDelay: `${i * 55}ms`,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 11,
                    background: ACCENT_SOFT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: "Inter", fontSize: 17, fontWeight: 700, color: "#0A0A0A", margin: 0, letterSpacing: "-0.01em" }}>
                  {f.title}
                </h3>
                <p style={{ fontFamily: "Inter", fontSize: 14.5, lineHeight: 1.55, color: "#4B5563", margin: "8px 0 0" }}>
                  {f.desc}
                </p>
              </div>
            ))}
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

      {/* ============== PARA QUIÉN ES / NO ES (calificación, dark) ============== */}
      <section
        id="para-quien"
        className="plt-section"
        style={{ position: "relative", background: "#0D0F14", padding: "92px 80px", overflow: "hidden", scrollMarginTop: 80 }}
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
          <div className="reveal" style={{ maxWidth: 680 }}>
            <Eyebrow color="#A78BFA">Honestos desde el principio</Eyebrow>
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
              Clinera no es para toda clínica.
            </h2>
            <p style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 1.55, color: "rgba(255,255,255,0.65)", margin: "14px 0 0" }}>
              Es una plataforma para operaciones con volumen y equipo. Antes de que dejes tus datos,
              mira si de verdad es para ti.
            </p>
          </div>

          <div
            className="plt-qual-grid reveal"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 44 }}
          >
            {/* SÍ */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(16,185,129,0.35)",
                borderRadius: 16,
                padding: "30px 28px",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#34D399",
                  marginBottom: 18,
                }}
              >
                Es para ti si
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 15 }}>
                {SI.map((t) => (
                  <li key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                      <circle cx="12" cy="12" r="10" fill="rgba(16,185,129,0.15)" />
                      <path d="M8 12.5l2.5 2.5L16 9" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontFamily: "Inter", fontSize: 15.5, lineHeight: 1.5, color: "rgba(255,255,255,0.9)" }}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* NO */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 16,
                padding: "30px 28px",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6B7280",
                  marginBottom: 18,
                }}
              >
                Todavía no es para ti si
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 15 }}>
                {NO.map((t) => (
                  <li key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                      <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.05)" />
                      <path d="M8 12h8" stroke="#7B8496" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span style={{ fontFamily: "Inter", fontSize: 15.5, lineHeight: 1.5, color: "rgba(255,255,255,0.55)" }}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p
            className="reveal"
            style={{
              fontFamily: "Inter",
              fontSize: 16,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.7)",
              margin: "28px 0 0",
              maxWidth: 720,
            }}
          >
            Si te describe la columna de la derecha, hoy Clinera te va a quedar grande — y preferimos
            decírtelo ahora, no venderte algo que no vas a aprovechar.
          </p>
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
