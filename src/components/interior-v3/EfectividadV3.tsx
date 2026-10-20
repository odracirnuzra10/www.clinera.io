"use client";

import Link from "next/link";
import Image from "next/image";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { FinalCTA, useReveal } from "@/components/home-v3/sections";

const FLOWS: Array<{ name: string; pass: number; total: number; note: string }> = [
  { name: "agendar_cita", pass: 3, total: 3, note: "Turnos reales creados en tabla Turno" },
  { name: "auto_booking_off", pass: 3, total: 3, note: "Handoff correcto cuando auto_booking=false" },
  { name: "burst_messages", pass: 3, total: 3, note: "Hasta 6 mensajes consecutivos consolidados" },
  { name: "cancelar_cita", pass: 3, total: 3, note: "Pide identificación antes de cancelar" },
  { name: "charla_general", pass: 3, total: 3, note: "Info sin empujar agendamiento" },
  { name: "consultar_disponibilidad", pass: 3, total: 3, note: "Multi-sucursal consolidado" },
  { name: "consultar_servicios", pass: 3, total: 3, note: "Precios reales, sin mezclar clínicas" },
  { name: "cross_tenant_leak", pass: 3, total: 3, note: "Rechaza preguntas sobre otras clínicas" },
  { name: "handoff_explicito", pass: 3, total: 3, note: "Tool handoff_humano ejecutado" },
  { name: "ia_loop_detection", pass: 3, total: 3, note: "Corta loops con otra IA" },
  { name: "instrucciones_custom", pass: 3, total: 3, note: "Respeta clinic_instructions del dueño" },
  { name: "manipulacion_datos", pass: 3, total: 3, note: "No cede a precios falsos" },
  { name: "multi_turno", pass: 2, total: 3, note: "Pasa en pass@2" },
  { name: "prompt_injection", pass: 2, total: 3, note: "Pasa en pass@2 (markup adversarial)" },
];

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "¿Qué significa “100% de agendamientos exitosos”?",
    a: "En la muestra auditada de 42 casos sobre 3 clínicas reales, todos los casos terminaron en agendamiento correcto o en derivación a humano correcta cuando ese era el objetivo. Ningún caso quedó sin resolver.",
  },
  {
    q: "¿El paciente tiene que escribir varias veces si la IA falla?",
    a: "No. Escribe una sola vez. Si el agente principal falla, un segundo agente (juez) lo detecta y reintenta internamente. El paciente solo nota que la respuesta tardó 90 o 120 segundos en lugar de 40.",
  },
  {
    q: "¿Puedo auditar estos resultados?",
    a: "Sí. Los clientes activos pueden solicitar el JSONL crudo de resultados. Periodistas e investigadores pueden coordinar una auditoría en sandbox bajo NDA.",
  },
  {
    q: "¿Cada cuánto actualizan el estudio?",
    a: "La suite corre en cada release y bloquea merge si pass@1 baja de 90%. Publicamos un reporte resumido trimestralmente. Próxima actualización: julio 2026.",
  },
  {
    q: "¿Qué hace Clinera distinto de otros chatbots para clínicas?",
    a: "Tres cosas auditables: arquitectura de dos niveles con agente juez y self-refine, tests contra clínicas reales publicados, y trazabilidad completa desde el mensaje hasta el turno creado en la base de datos.",
  },
];

export default function EfectividadV3() {
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
          main > section { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>
      <Hero />
      <VideoSection />
      <StatsGrid />
      <TimelineSection />
      <ReporteOriginal />
      <FlowBreakdown />
      <ArchitectureSection />
      <FaqSection />
      <FinalCTA />
    </>
  );
}

/* ---------- 1. HERO ---------- */
function Hero() {
  return (
    <section
      style={{
        padding: "96px 80px 56px",
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
            style={{ display: "inline-block", width: 8, height: 8, borderRadius: 999, background: "#10B981" }}
          />
          Reporte técnico · Abril 2026 · auditable
        </div>
        <h1
          className="efectividad-hero-title"
          style={{
            fontFamily: "Inter",
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 0.98,
            margin: "0 0 20px",
            color: "#0A0A0A",
          }}
        >
          El 95.2% agenda{" "}
          <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            al primer intento.
          </span>
          <br />
          El 100% en tres.
        </h1>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 19,
            color: "#4B5563",
            lineHeight: 1.55,
            margin: "0 auto 28px",
            maxWidth: 640,
          }}
        >
          Publicamos los números porque la confianza se construye con evidencia, no con promesas. 42 casos, 14 flujos
          conversacionales, 3 clínicas reales.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
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
            Agendar reunión <span>→</span>
          </Link>
          <Link
            href="/blog/efectividad"
            style={{
              background: "#fff",
              color: "#0A0A0A",
              border: "1px solid #E5E7EB",
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Leer el estudio completo
          </Link>
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11.5,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#6B7280",
          }}
        >
          ● 14 flujos · 3 clínicas reales · Última medición abril 2026
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          :global(.efectividad-hero-title) { font-size: 56px !important; }
        }
        @media (max-width: 600px) {
          :global(.efectividad-hero-title) { font-size: 40px !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------- 1b. VIDEO ---------- */
function VideoSection() {
  return (
    <section style={{ padding: "40px 80px 20px", background: "#FAFAFA" }}>
      <div
        className="reveal"
        style={{
          maxWidth: 960,
          margin: "0 auto",
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid #EEECEA",
          boxShadow: "0 30px 80px rgba(15,10,30,.10), 0 8px 20px rgba(0,0,0,.04)",
          background: "#0E1014",
        }}
      >
        <div style={{ position: "relative", width: "100%", paddingTop: "75%" }}>
          <iframe
            src="https://player.vimeo.com/video/1186403367?badge=0&autopause=0&player_id=0&app_id=58479"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Publicamos un estudio real en Clinera."
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. STATS GRID ---------- */
function StatsGrid() {
  const stats: Array<{ metric: string; label: string; note: string; highlight?: boolean }> = [
    { metric: "95.2%", label: "pass@1", note: "Al primer intento", highlight: true },
    { metric: "97.6%", label: "pass@2", note: "Al segundo intento (juez)" },
    { metric: "100%", label: "pass@3", note: "En máximo tres intentos" },
  ];
  return (
    <section style={{ padding: "56px 80px", background: "#fff" }}>
      <div
        className="efectividad-stats-grid"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="reveal"
            style={{
              position: "relative",
              padding: "36px 28px",
              borderRadius: 20,
              border: s.highlight ? "0" : "1px solid #EEECEA",
              background: s.highlight ? "#0E1014" : "#fff",
              color: s.highlight ? "#fff" : "#0A0A0A",
              overflow: "hidden",
              boxShadow: s.highlight
                ? "0 30px 80px rgba(124,58,237,.18), 0 8px 20px rgba(0,0,0,.06)"
                : "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            {s.highlight && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse 70% 70% at 90% 0%, rgba(217,70,239,.22) 0%, transparent 70%),radial-gradient(ellipse 50% 50% at 0% 100%, rgba(59,130,246,.15) 0%, transparent 60%)",
                  pointerEvents: "none",
                }}
              />
            )}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: s.highlight ? "rgba(255,255,255,.7)" : "#6B7280",
                  marginBottom: 14,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: 64,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                {s.metric}
              </div>
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: 14,
                  color: s.highlight ? "rgba(255,255,255,.75)" : "#6B7280",
                  marginTop: 12,
                }}
              >
                {s.note}
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.efectividad-stats-grid) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------- 3. TIMELINE ---------- */
function TimelineSection() {
  const steps = [
    { time: "40 s", label: "95.2% de los casos", primary: true },
    { time: "90 s", label: "+2.4% (corregido por el juez)", primary: false },
    { time: "120 s", label: "+2.4% (cierra el 100%)", primary: false },
  ];
  return (
    <section style={{ padding: "96px 80px", background: "#F7F6F3", borderTop: "1px solid #F0F0F0", borderBottom: "1px solid #F0F0F0" }}>
      <div className="reveal" style={{ maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
        <Eyebrow>Lo que el paciente percibe</Eyebrow>
        <h2
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
          El paciente nunca repite el agendamiento.
        </h2>
        <p style={{ fontFamily: "Inter", fontSize: 17, color: "#4B5563", margin: "0 auto 40px", maxWidth: 640, lineHeight: 1.55 }}>
          Si el primer intento del agente falla, un segundo agente (juez) lo corrige internamente. Lo único que varía es
          el tiempo de respuesta.
        </p>
      </div>
      <div
        className="efectividad-timeline reveal"
        style={{
          maxWidth: 920,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {steps.map((s, i) => (
          <div
            key={s.time}
            style={{
              background: "#fff",
              border: "1px solid #EEECEA",
              borderRadius: 16,
              padding: "24px 22px",
              position: "relative",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#6B7280",
                marginBottom: 10,
              }}
            >
              Intento {i + 1}
            </div>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: s.primary
                  ? "#0A0A0A"
                  : "#0A0A0A",
                background: s.primary ? GRAD : undefined,
                WebkitBackgroundClip: s.primary ? "text" : undefined,
                backgroundClip: s.primary ? ("text" as const) : undefined,
                WebkitTextFillColor: s.primary ? ("transparent" as const) : undefined,
                lineHeight: 1,
              }}
            >
              {s.time}
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 14, color: "#4B5563", marginTop: 10, lineHeight: 1.45 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <div
        className="reveal"
        style={{
          maxWidth: 920,
          margin: "20px auto 0",
          padding: "16px 22px",
          borderRadius: 12,
          border: "1px dashed #D6D3CD",
          background: "rgba(255,255,255,.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontFamily: "Inter", fontSize: 14, color: "#6B7280" }}>
          Para comparar: una recepcionista humana validando agenda y creando un turno
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 14,
            fontWeight: 600,
            color: "#0A0A0A",
            letterSpacing: "0.06em",
          }}
        >
          5–15 min
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.efectividad-timeline) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------- 4. REPORTE ORIGINAL (imágenes del PDF) ---------- */
function ReporteOriginal() {
  return (
    <section style={{ padding: "96px 80px", background: "#fff" }}>
      <div className="reveal" style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
        <Eyebrow>Evidencia visual</Eyebrow>
        <h2
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
          El reporte original, sin filtros.
        </h2>
        <p style={{ fontFamily: "Inter", fontSize: 17, color: "#4B5563", margin: "0 auto 48px", maxWidth: 720, lineHeight: 1.55 }}>
          Las dos páginas que generó la suite de evals el 22 de abril de 2026. Sin retoques, sin marketing, sin
          selección. Si alguna cifra de esta página no coincide con la captura, gana la captura.
        </p>
      </div>
      <div
        className="efectividad-figures reveal"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 24,
        }}
      >
        <Figure
          src="/images/efectividad/reporte-pagina-1.webp"
          alt="Métricas pass@1 95.2%, pass@2 97.6% y pass@3 100% del reporte de evals de Clinera del 22 de abril de 2026, sobre 42 casos y 14 flujos contra 3 clínicas reales"
          caption="Página 1 · Métricas generales"
        />
        <Figure
          src="/images/efectividad/reporte-pagina-2.webp"
          alt="Tabla de los 5 bugs críticos arreglados antes del release: sycophancy con precios, loop con otra IA, error 400 multi-sucursal, fechas 2025 y alucinación de confirmación"
          caption="Página 2 · Desglose y bugs"
        />
      </div>
      <style jsx>{`
        @media (max-width: 820px) {
          :global(.efectividad-figures) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

export function Figure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure
      style={{
        margin: 0,
        background: "#FFFFFF",
        border: "1px solid #EAEAEA",
        borderRadius: 14,
        padding: 8,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px -16px rgba(15,10,30,.18)",
      }}
    >
      <div style={{ position: "relative", width: "100%", borderRadius: 8, overflow: "hidden", background: "#FAFAFA" }}>
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={1697}
          sizes="(max-width: 820px) 100vw, 600px"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
      <figcaption
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 11.5,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#6B7280",
          padding: "14px 8px 6px",
          textAlign: "center",
        }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

/* ---------- 5. FLOW BREAKDOWN (gráfico de barras horizontales) ---------- */
function FlowBreakdown() {
  return (
    <section style={{ padding: "96px 80px", background: "#FAFAFA", borderTop: "1px solid #F0F0F0", borderBottom: "1px solid #F0F0F0" }}>
      <div className="reveal" style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
        <Eyebrow>Por flujo</Eyebrow>
        <h2
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
          Los 14 flujos evaluados.
        </h2>
        <p style={{ fontFamily: "Inter", fontSize: 17, color: "#4B5563", margin: "0 auto 48px", maxWidth: 680, lineHeight: 1.55 }}>
          Cada flujo se ejecutó 3 veces con variaciones de prompt. Doce pasaron con pass@1 perfecto. Dos necesitaron al
          juez para llegar al 100%.
        </p>
      </div>
      <div
        className="reveal"
        style={{
          maxWidth: 980,
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #EEECEA",
          borderRadius: 16,
          padding: "28px 32px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        }}
      >
        {FLOWS.map((f) => {
          const ratio = f.pass / f.total;
          const perfect = ratio === 1;
          return (
            <div
              key={f.name}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(160px, 220px) 1fr 56px",
                alignItems: "center",
                gap: 16,
                padding: "10px 0",
                borderBottom: "1px solid #F3F4F6",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 13,
                  color: "#0A0A0A",
                  fontWeight: 500,
                }}
              >
                {f.name}
              </div>
              <div style={{ position: "relative", height: 10, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: `${ratio * 100}%`,
                    background: perfect ? GRAD : "#F59E0B",
                    borderRadius: 999,
                    transition: "width .8s cubic-bezier(.16,1,.3,1)",
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 13,
                  color: perfect ? "#10B981" : "#B45309",
                  fontWeight: 600,
                  textAlign: "right",
                }}
              >
                {f.pass}/{f.total}
              </div>
            </div>
          );
        })}
        <div
          style={{
            marginTop: 18,
            fontFamily: "Inter",
            fontSize: 13,
            color: "#6B7280",
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, background: GRAD, borderRadius: 999 }} /> pass@1 perfecto
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, background: "#F59E0B", borderRadius: 999 }} /> requirió juez (pass@2)
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. ARCHITECTURE ---------- */
function ArchitectureSection() {
  return (
    <section style={{ padding: "96px 80px", background: "#fff" }}>
      <div className="reveal" style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
        <Eyebrow>Cómo se llega al 100%</Eyebrow>
        <h2
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
          Self-refine con agente juez.
        </h2>
        <p style={{ fontFamily: "Inter", fontSize: 17, color: "#4B5563", margin: "0 auto 48px", maxWidth: 700, lineHeight: 1.55 }}>
          El agente principal responde, un segundo LLM independiente verifica si el objetivo se cumplió, y si no,
          genera un hint y dispara un reintento. El paciente no nota el proceso: solo el tiempo varía.
        </p>
      </div>
      <div
        className="efectividad-arch reveal"
        style={{
          maxWidth: 980,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        <ArchCard kicker="Mensaje" title="Paciente" body="WhatsApp · IG · Widget web" />
        <ArchCard kicker="Nivel 1" title="Fluentia" body="Agente conversacional. Crea turno con tools reales." badge="LLM" />
        <ArchCard kicker="Nivel 2" title="Juez" body="LLM independiente. ¿Se cumplió el objetivo?" badge="LLM" highlight />
        <ArchCard kicker="Resultado" title="Turno creado" body="DB real de la clínica. Trazable end-to-end." />
      </div>
      <div
        className="reveal"
        style={{
          maxWidth: 980,
          margin: "32px auto 0",
          background: "#F7F6F3",
          border: "1px solid #EEECEA",
          borderRadius: 14,
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontFamily: "Inter", fontSize: 15, color: "#0A0A0A", maxWidth: 640, lineHeight: 1.55 }}>
          ¿Quieres ver el código, los patrones de guardrail, el stack completo y la metodología?
        </div>
        <Link
          href="/blog/efectividad"
          style={{
            background: "#0A0A0A",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 10,
            fontFamily: "Inter",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Leer el estudio técnico <span>→</span>
        </Link>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          :global(.efectividad-arch) { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          :global(.efectividad-arch) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function ArchCard({
  kicker,
  title,
  body,
  badge,
  highlight,
}: {
  kicker: string;
  title: string;
  body: string;
  badge?: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: highlight ? "#0E1014" : "#fff",
        color: highlight ? "#fff" : "#0A0A0A",
        border: highlight ? "0" : "1px solid #EEECEA",
        borderRadius: 16,
        padding: "20px 18px 22px",
        overflow: "hidden",
        boxShadow: highlight
          ? "0 30px 80px rgba(124,58,237,.18), 0 8px 20px rgba(0,0,0,.06)"
          : "0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      {highlight && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 70% at 90% 0%, rgba(217,70,239,.22) 0%, transparent 70%),radial-gradient(ellipse 50% 50% at 0% 100%, rgba(59,130,246,.15) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
      )}
      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 10.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: highlight ? "rgba(255,255,255,.7)" : "#6B7280",
              fontWeight: 600,
            }}
          >
            {kicker}
          </span>
          {badge && (
            <span
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: highlight ? "rgba(255,255,255,.12)" : "#F3F4F6",
                color: highlight ? "#fff" : "#0A0A0A",
                padding: "3px 8px",
                borderRadius: 999,
                fontWeight: 600,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: "Inter",
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            marginBottom: 8,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "Inter",
            fontSize: 13.5,
            color: highlight ? "rgba(255,255,255,.8)" : "#6B7280",
            lineHeight: 1.5,
          }}
        >
          {body}
        </div>
      </div>
    </div>
  );
}

/* ---------- 7. FAQ ---------- */
function FaqSection() {
  return (
    <section style={{ padding: "96px 80px", background: "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
      <div className="reveal" style={{ maxWidth: 980, margin: "0 auto 48px", textAlign: "center" }}>
        <Eyebrow>Preguntas frecuentes</Eyebrow>
        <h2
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
          Lo que más nos preguntan.
        </h2>
      </div>
      <div className="reveal" style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {FAQS.map((f, i) => (
          <details
            key={i}
            style={{
              background: "#fff",
              border: "1px solid #EEECEA",
              borderRadius: 14,
              padding: "18px 22px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <summary
              style={{
                cursor: "pointer",
                listStyle: "none",
                fontFamily: "Inter",
                fontSize: 16,
                fontWeight: 600,
                color: "#0A0A0A",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span>{f.q}</span>
              <span
                aria-hidden
                style={{
                  flexShrink: 0,
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  background: "#F3F4F6",
                  color: "#6B7280",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                +
              </span>
            </summary>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 15,
                color: "#4B5563",
                lineHeight: 1.6,
                marginTop: 12,
              }}
            >
              {f.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
