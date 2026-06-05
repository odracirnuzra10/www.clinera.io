"use client";

import { useState } from "react";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { FinalCTA, Pricing, useReveal } from "@/components/home-v3/sections";

const FAQ = [
  { q: "¿Tiene costo de implementación?", a: "No. La implementación es asistida por un humano del equipo de Clinera y tiene costo $0 en todos los planes. Setup en menos de 1 hora, sin programador: configuramos AURA con la voz de tu clínica, conectamos tu WhatsApp Business, integramos tu agenda actual y dejamos a AURA operando esa misma tarde." },
  { q: "¿Cuántas atenciones incluye cada plan?", a: "Una atención = una conversación completa de IA con un paciente por WhatsApp. Conect: ~270 atenciones / mes (8.000 créditos IA, modos Eficiente y Agentic). Advanced: ~390 atenciones / mes (12.000 créditos IA) y 5 usuarios. MAX: ~1.000 atenciones / mes (28.000 créditos IA), incluye además modo Agentic Pro y los agentes LIA y CAMILA (voz). Las atenciones son estimadas y varían según el mix de conversaciones de tu clínica. MAX tiene el mejor costo por atención (~$0,28 vs ~$0,46 Advanced y ~$0,48 Conect). Los números son estimados con mix realista (consultas + agendamientos + tool calls) y con un margen conservador para evitar sorpresas. Si necesitas más, sumas el Add-on de créditos IA (US$100 → ~500 atenciones en Eficiente, ~170 en Agentic o ~50 por voz) o subes de plan." },
  { q: "¿Cuál es la diferencia entre los 3 modos de agendamiento?", a: "Eficiente (Gemini 3.0 Flash, no agéntico): AURA conversa por WhatsApp y envía un link a tu calendario propio o al de Clinera para que el paciente confirme. ~10 créditos por atención (conversación de solo texto) — el costo IA más bajo. Disponible en todos los planes. Agentic (Kimi K2.6, agéntico automático): AURA agenda directamente en tu calendario, sin links ni fricción. ~30 créditos por atención en promedio — la mejor relación capacidad/costo; una conversación de agendamiento completo (≈6 turnos con varias tool calls) puede llegar a ~195 créditos, pero la mayoría de las atenciones son más livianas. Disponible desde Conect. Agentic Pro (Gemini 3.5 Flash, agéntico ultra rápido): mismo nivel agéntico que Agentic con respuesta inmediata (289 tokens/s). ~36 créditos por atención. Solo en MAX." },
  { q: "¿Qué es una atención?", a: "Una atención = una conversación completa de IA con un paciente por WhatsApp: puede ser solo una consulta (preguntas, info, FAQ) o una conversación que termina en agendamiento (con tool calls a tu agenda y BD). La métrica que importa para tu clínica son las atenciones; los créditos son el consumo técnico interno de cada atención. Los tres planes incluyen Agente IA y Módulo Clínico; la diferencia está en cuántas atenciones al mes, qué modos de IA usas y qué empleados digitales incluyes (Conect y Advanced: AURA · MAX: AURA + LIA + CAMILA)." },
  { q: "¿Puedo cambiar de plan después?", a: "Sí. Puedes subir o bajar de plan en cualquier momento desde tu panel. El cambio se aplica en tu próximo ciclo de facturación." },
  { q: "¿Tienen plan para cadenas grandes u hospitales?", a: "Sí, el plan Corporativo (desde USD 1.500/mes) es personalizado: créditos a medida, onboarding white-glove, SLA personalizado, integraciones a medida, soporte dedicado y facturación adaptada. Habla con ventas para armar la propuesta." },
  { q: "¿Hay permanencia o contrato?", a: "No. Todos los planes son mes a mes. Puedes cancelar en cualquier momento sin penalizaciones." },
  { q: "¿Qué pasa si supero el cupo de mi plan?", a: "Te avisamos al 80% y al 100% del cupo de atenciones. Tu servicio no se interrumpe sin aviso. Si necesitas más, sumas el Add-on de créditos IA (US$100 → ~500 atenciones en Eficiente, ~170 en Agentic o ~50 por voz) o subes de plan." },
  { q: "¿Se integra con mi software actual?", a: "Sí. Clinera se conecta vía API con Reservo, AgendaPro, Medilink, Dentalink, Sacmed y cualquier sistema que exponga una API REST o soporte MCP." },
  { q: "¿Cómo funciona la IA de mensajería?", a: "Nuestra IA responde automáticamente por WhatsApp usando memoria contextual. Agenda, confirma y responde consultas 24/7. Si necesita un humano, deriva la conversación automáticamente." },
  { q: "¿Qué es el módulo Odontograma?", a: "Es un add-on nuevo para clínicas dentales (próximamente): ficha odontológica visual interactiva por pieza dental, historial completo, integración con consentimientos y agenda. Cuesta $21 USD/mes extra sobre cualquier plan." },
  { q: "¿Los precios incluyen IVA?", a: "Los precios están en USD y no incluyen impuestos locales. El monto final depende de la legislación tributaria de tu país." },
];

export default function PlanesV3() {
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
      <PlanesHero />
      <Pricing />
      <Addons />
      <PlanesFaq />
      <FinalCTA />
    </>
  );
}

function PlanesHero() {
  return (
    <section
      style={{
        padding: "56px 80px 24px",
        background: "linear-gradient(180deg,#FFFFFF 0%,#FAFAFA 100%)",
      }}
    >
      <div className="reveal" style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
        <Eyebrow>Planes y precios</Eyebrow>
        <h1
          style={{
            fontFamily: "Inter",
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1.04,
            margin: "14px 0 12px",
            color: "#0A0A0A",
          }}
          className="planes-hero-title"
        >
          Elige tu plan.{" "}
          <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            Activa hoy.
          </span>
        </h1>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 17,
            color: "#4B5563",
            lineHeight: 1.55,
            margin: "0 auto",
            maxWidth: 600,
          }}
        >
          Sin permanencia. Precios en USD. Calcula tu plan abajo.
        </p>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.planes-hero-title) { font-size: 36px !important; }
        }
      `}</style>
    </section>
  );
}

function Addons() {
  const items = [
    { price: "$100", unit: "única vez", label: "Add-on de créditos IA",  sub: "Créditos IA extra: ~500 atenciones en Eficiente · ~170 en Agentic · ~50 por voz. Recarga opcional cuando agotas tus créditos del mes." },
    { price: "$9",  unit: "/mes", label: "Usuario / profesional extra", sub: "Suma asientos sin cambiar de plan" },
    { price: "$21", unit: "/mes", label: "Módulo Odontograma",          sub: "Ficha odontológica visual + historial dental", isNew: true },
  ];
  return (
    <section style={{ padding: "80px 80px", background: "#fff", borderTop: "1px solid #F0F0F0" }}>
      <div className="reveal" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Eyebrow>Add-ons</Eyebrow>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "12px 0 0",
              color: "#0A0A0A",
            }}
          >
            Escala cuando lo necesites.
          </h2>
        </div>
        <div
          className="planes-addons-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, maxWidth: 980, margin: "0 auto" }}
        >
          {items.map((it) => (
            <div
              key={it.label}
              style={{
                background: "#FAFAFA",
                border: it.isNew ? "1px solid #7C3AED" : "1px solid #EEECEA",
                borderRadius: 16,
                padding: "28px 26px",
                textAlign: "center",
                position: "relative",
              }}
            >
              {it.isNew && (
                <div style={{
                  position: "absolute",
                  top: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: GRAD,
                  color: "#fff",
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 9.5,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  padding: "4px 12px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                  boxShadow: "0 4px 12px rgba(124,58,237,.3)",
                }}>NUEVO</div>
              )}
              <div style={{ fontFamily: "Inter", fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", color: "#0A0A0A" }}>
                {it.price}
                <span style={{ fontSize: 16, fontWeight: 500, color: "#6B7280", marginLeft: 4 }}>{it.unit}</span>
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: "#0A0A0A", marginTop: 8 }}>{it.label}</div>
              <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "#6B7280", marginTop: 6, lineHeight: 1.5 }}>{it.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          :global(.planes-addons-grid) { grid-template-columns: 1fr !important; max-width: 380px !important; }
        }
      `}</style>
    </section>
  );
}

function PlanesFaq() {
  const [open, setOpen] = useState(0);
  return (
    <section style={{ padding: "96px 80px", borderTop: "1px solid #F0F0F0", background: "#FAFAFA" }}>
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
            Dudas sobre tu plan.
          </h2>
        </div>
        <div className="reveal" style={{ borderTop: "1px solid #E5E7EB" }}>
          {FAQ.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderBottom: "1px solid #E5E7EB" }}>
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
                  <span style={{ fontSize: 17, fontWeight: 600, color: "#0A0A0A", letterSpacing: "-0.01em" }}>{it.q}</span>
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
                      background: "#fff",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 4px 22px", fontFamily: "Inter", fontSize: 15.5, color: "#4B5563", lineHeight: 1.6, maxWidth: 780 }}>
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

