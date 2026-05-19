"use client";

import { useState } from "react";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { FinalCTA, Pricing, useReveal } from "@/components/home-v3/sections";

const FAQ = [
  { q: "¿Tiene costo de implementación?", a: "No. La implementación es asistida por un humano del equipo de Clinera y tiene costo $0 en todos los planes. Setup en menos de 1 hora, sin programador: configuramos AURA con la voz de tu clínica, conectamos tu WhatsApp Business, integramos tu agenda actual y dejamos a AURA operando esa misma tarde." },
  { q: "¿Cuántos mensajes y agendamientos incluye cada plan?", a: "Core incluye 1.000 mensajes + 45 agendamientos automáticos por AURA / mes. Conect incluye 2.000 mensajes + 65 agendamientos. Advanced incluye 3.000 mensajes + 90 agendamientos. Si necesitas más, sumas un add-on de créditos o subes de plan." },
  { q: "¿Qué es un agendamiento automático?", a: "Es cuando AURA, nuestro agente IA, agenda una cita por WhatsApp sin que tu equipo intervenga: conversa con el paciente, valida disponibilidad en tu agenda y confirma la cita. Los tres planes incluyen Agente IA. La diferencia entre planes está en el cupo de agendamientos automáticos al mes y si incluye o no el Módulo Clínico (Conect y Advanced lo incluyen, Core no)." },
  { q: "¿Puedo cambiar de plan después?", a: "Sí. Puedes subir o bajar de plan en cualquier momento desde tu panel. El cambio se aplica en tu próximo ciclo de facturación." },
  { q: "¿Hay permanencia o contrato?", a: "No. Todos los planes son mes a mes. Puedes cancelar en cualquier momento sin penalizaciones." },
  { q: "¿Qué pasa si supero el cupo de mi plan?", a: "Te avisamos al 80% y al 100% del cupo. Tu servicio no se interrumpe sin aviso. Si necesitas más, sumas un add-on de +10.000 créditos IA por $5 USD/mes (≈ ~5 agendamientos extra o ~500 mensajes IA con AURA) o subes de plan." },
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
      <Calculator />
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

function Calculator() {
  const PLANS = [
    { name: "Core",     price: 129, appt: 45, messages: 1000, modClinico: false },
    { name: "Conect",   price: 189, appt: 65, messages: 2000, modClinico: true  },
    { name: "Advanced", price: 239, appt: 90, messages: 3000, modClinico: true  },
  ];
  const SLIDER_MAX = 120;
  const SLIDER_STEP = 5;

  const [appts, setAppts] = useState<number>(20);

  const chosen =
    appts <= 45 ? PLANS[0] :
    appts <= 65 ? PLANS[1] :
    appts <= 90 ? PLANS[2] :
                  PLANS[2];
  const overAppts = Math.max(0, appts - chosen.appt);
  const fmt = (n: number) => Math.round(n).toLocaleString("es-CL");
  const pctSlider = (appts / SLIDER_MAX) * 100;

  return (
    <section style={{ padding: "8px 80px 64px", background: "linear-gradient(180deg, #FAFAFA 0%, #FFFFFF 100%)" }}>
      <div
        className="reveal"
        style={{
          maxWidth: 880,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 20,
          padding: "36px 32px 28px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 12px 40px rgba(17,19,24,.06)",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 32, right: 32, height: 2, background: GRAD, borderRadius: "0 0 2px 2px" }} />

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#10B981", marginBottom: 8 }}>
            Calculadora
          </div>
          <h3 style={{ fontFamily: "Inter", fontSize: 26, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.02em", margin: "0 0 6px" }}>
            ¿Cuántos agendamientos al mes?
          </h3>
          <p style={{ fontFamily: "Inter", fontSize: 14, color: "#6B7280", margin: 0 }}>
            Mueve el slider con tu estimado. Te recomendamos el plan en vivo.
          </p>
        </div>

        <div style={{ maxWidth: 620, margin: "0 auto 24px", padding: "0 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, color: "#6B7280", letterSpacing: ".12em", textTransform: "uppercase" }}>
              Agendamientos automáticos / mes
            </span>
            <span style={{ fontFamily: "Inter", fontSize: 22, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.01em" }}>
              {fmt(appts)}
              <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, color: "#6B7280", marginLeft: 4, letterSpacing: ".04em", textTransform: "uppercase", fontWeight: 500 }}> agend</span>
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={SLIDER_MAX}
            step={SLIDER_STEP}
            value={appts}
            onChange={(e) => setAppts(+e.target.value)}
            className="calc-v3-slider"
            style={{
              WebkitAppearance: "none",
              appearance: "none",
              width: "100%",
              height: 6,
              borderRadius: 999,
              background: `linear-gradient(90deg, #009FE3 0%, #7C3AED ${pctSlider}%, #ECEEF1 ${pctSlider}%, #ECEEF1 100%)`,
              outline: "none",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, color: "#9CA3AF", marginTop: 8, letterSpacing: ".04em" }}>
            <span>0</span>
            <span>{fmt(SLIDER_MAX)}</span>
          </div>
        </div>

        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "26px 28px",
            background: "linear-gradient(135deg, rgba(0,159,227,.05), rgba(124,58,237,.05), rgba(200,80,192,.04))",
            border: "1px solid #E5E7EB",
            borderRadius: 16,
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, color: "#6B7280", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>
            Plan recomendado
          </div>
          <div
            style={{
              fontFamily: "Inter",
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1,
              background: GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: 4,
            }}
          >
            {chosen.name}
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 16, fontWeight: 600, color: "#0A0A0A", marginBottom: 14 }}>
            ${chosen.price} USD / mes
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 13.5, color: "#0A0A0A", lineHeight: 1.6 }}>
            <b>{chosen.appt} agendamientos automáticos</b> · <b>{fmt(chosen.messages)} mensajes</b> / mes
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 12.5, color: "#6B7280", marginTop: 6 }}>
            {chosen.modClinico ? "Agente IA AURA + Módulo clínico incluidos" : "Agente IA AURA · sin módulo clínico"}
          </div>
          {chosen.name === "Core" && (
            <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.25)", borderRadius: 10, fontFamily: "Inter", fontSize: 12, color: "#065F46", lineHeight: 1.5 }}>
              <b>Con $60 más</b>, Conect te suma <b>+20 agendamientos</b> · <b>Módulo clínico completo</b> · agenda + fichas
            </div>
          )}
          {chosen.name === "Conect" && (
            <div style={{ marginTop: 14, padding: "10px 14px", background: "linear-gradient(135deg, rgba(0,159,227,.08), rgba(124,58,237,.08), rgba(200,80,192,.06))", border: "1px solid rgba(124,58,237,.3)", borderRadius: 10, fontFamily: "Inter", fontSize: 12, color: "#0A0A0A", lineHeight: 1.5 }}>
              <b>Con $50 más</b>, Advanced te suma <b>+25 agendamientos</b> · <b>multi-sede</b> · <b>+10 usuarios</b> · soporte premium
            </div>
          )}
          {overAppts > 0 && (
            <div
              style={{
                display: "inline-block",
                marginTop: 14,
                padding: "8px 14px",
                background: "rgba(245,158,11,.08)",
                border: "1px solid rgba(245,158,11,.2)",
                borderRadius: 8,
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                color: "#B45309",
                fontWeight: 500,
                letterSpacing: ".02em",
              }}
            >
              + {overAppts} agendamientos extra → suma add-on de créditos IA
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        :global(.calc-v3-slider::-webkit-slider-thumb) {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #7C3AED;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
          cursor: pointer;
          transition: transform 0.15s;
        }
        :global(.calc-v3-slider::-webkit-slider-thumb:hover) {
          transform: scale(1.15);
        }
        :global(.calc-v3-slider::-moz-range-thumb) {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #7C3AED;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
          cursor: pointer;
        }
        @media (max-width: 720px) {
          :global(section) > .reveal { padding: 24px 18px 22px !important; }
        }
      `}</style>
    </section>
  );
}

function Addons() {
  const items = [
    { price: "$5",  unit: "/mes", label: "+10.000 créditos IA",        sub: "≈ ~4 agendamientos extra · ~50 mensajes" },
    { price: "$29", unit: "/mes", label: "Usuario / profesional extra", sub: "Suma asientos sin cambiar de plan" },
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

