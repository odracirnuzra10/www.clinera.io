"use client";

import { useState } from "react";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { FinalCTA, Pricing, useReveal } from "@/components/home-v3/sections";

const FAQ = [
  { q: "¿Tiene costo de implementación?", a: "No. La implementación es asistida por un humano del equipo de Clinera y tiene costo $0 en todos los planes. Setup en menos de 1 hora, sin programador: configuramos AURA con la voz de tu clínica, conectamos tu WhatsApp Business, integramos tu agenda actual y dejamos a AURA operando esa misma tarde." },
  { q: "¿Cuántos créditos y conversaciones incluye cada plan?", a: "Core: 13.000 créditos IA / mes — equivalen a ~200 conversaciones. Conect: 26.000 créditos — ~400 conversaciones, con modo automático de agendamiento. Advanced: 78.000 créditos — ~1.200 conversaciones, con modo automático. Advanced tiene el mejor costo por conversación ($0,30 vs $0,45 Conect y $0,65 Core). Si necesitas más, sumas un add-on de créditos o subes de plan." },
  { q: "¿Qué diferencia hay entre modo Enlace y modo Automático?", a: "Modo Enlace: AURA conversa por WhatsApp y envía un link para que el paciente confirme la cita. Modo Automático: AURA agenda directamente en tu calendario, sin que el paciente tenga que hacer nada extra. El modo Automático solo está disponible en Conect y Advanced — Core solo tiene Enlace. Conect y Advanced incluyen además los 3 modelos IA (Gemini 3 Flash, Kimi K2.6 y Claude Sonnet 4.6); Core solo Gemini 3 Flash." },
  { q: "¿Qué es una conversación?", a: "Es una secuencia de mensajes con un paciente por WhatsApp donde AURA agenda, re-agenda, confirma, responde dudas o reactiva. Cada conversación consume ~65 créditos en promedio (el cálculo final depende del modo y modelo usados). Los tres planes incluyen Agente IA; la diferencia entre planes está en la cantidad de créditos al mes, si incluyen modo automático, y si incluyen o no el Módulo Clínico (Conect y Advanced lo incluyen, Core no)." },
  { q: "¿Puedo cambiar de plan después?", a: "Sí. Puedes subir o bajar de plan en cualquier momento desde tu panel. El cambio se aplica en tu próximo ciclo de facturación." },
  { q: "¿Hay permanencia o contrato?", a: "No. Todos los planes son mes a mes. Puedes cancelar en cualquier momento sin penalizaciones." },
  { q: "¿Qué pasa si supero el cupo de mi plan?", a: "Te avisamos al 80% y al 100% del cupo de créditos. Tu servicio no se interrumpe sin aviso. Si necesitas más, sumas un add-on de +5.000 créditos IA por $15 USD/mes (≈ ~77 conversaciones extra) o subes de plan." },
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
    { price: "$15", unit: "/mes", label: "+5.000 créditos IA",          sub: "≈ ~77 conversaciones extra" },
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

