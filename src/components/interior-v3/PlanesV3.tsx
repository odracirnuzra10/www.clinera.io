"use client";

import Link from "next/link";
import { useState } from "react";
import { CtaPrimary, CtaSecondary, Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { FinalCTA, Pricing, useReveal } from "@/components/home-v3/sections";

const FAQ = [
  { q: "¿Tiene costo de implementación?", a: "No. La implementación es asistida por un humano del equipo de Clinera y tiene costo $0 en todos los planes. Setup en menos de 1 hora, sin programador: configuramos AURA con la voz de tu clínica, conectamos tu WhatsApp Business, integramos tu agenda actual y dejamos a AURA operando esa misma tarde." },
  { q: "¿Qué es un crédito IA y cómo se consume?", a: "Un crédito IA es la unidad básica que consume AURA. 1 mensaje IA equivale aproximadamente a 200 créditos. 1 agendamiento automático equivale a unos 2.200 créditos porque incluye 10–12 mensajes más llamadas a tools como agenda, ficha y confirmación. El cliente combina ambos libremente dentro de su pool: una clínica puede usar 100.000 créditos en 400 mensajes + 10 agendamientos, o en 30 agendamientos puros — su decisión." },
  { q: "¿Puedo cambiar de plan después?", a: "Sí. Puedes subir o bajar de plan en cualquier momento desde tu panel. El cambio se aplica en tu próximo ciclo de facturación." },
  { q: "¿Hay permanencia o contrato?", a: "No. Todos los planes son mes a mes. Puedes cancelar en cualquier momento sin penalizaciones." },
  { q: "¿Qué pasa si supero los créditos de mi plan?", a: "Te avisamos al 80% y al 100% del cupo. Tu servicio nunca se interrumpe sin avisarte. Si necesitas más, sumas paquetes de +10.000 créditos IA por $5 USD/mes — equivalen a ~50 mensajes o ~4 agendamientos extra cada uno." },
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
        padding: "96px 80px 40px",
        background: "linear-gradient(180deg,#FFFFFF 0%,#FAFAFA 100%)",
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <div className="reveal" style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
        <Eyebrow>Planes y precios</Eyebrow>
        <h1
          style={{
            fontFamily: "Inter",
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            margin: "16px 0 16px",
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
            fontSize: 19,
            color: "#4B5563",
            lineHeight: 1.55,
            margin: "0 auto 28px",
            maxWidth: 680,
          }}
        >
          Todos los planes incluyen API completa, sin permanencia. Precios en USD.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <CtaPrimary as={Link} href="/hablar-con-ventas">
            Hablar con ventas <span style={{ marginLeft: 2 }}>→</span>
          </CtaPrimary>
          <CtaSecondary as={Link} href="/reunion">
            Agendar reunión
          </CtaSecondary>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.planes-hero-title) { font-size: 40px !important; }
        }
      `}</style>
    </section>
  );
}

function Calculator() {
  const PLANS = [
    { name: "Growth",   price: 89,  credits: 100000 },
    { name: "Conect",   price: 129, credits: 150000 },
    { name: "Advanced", price: 179, credits: 200000 },
  ];
  const CR_PER_MSG = 200;
  const CR_PER_APPT = 2200;
  const OVERAGE_PER_10K = 5;

  const RANGE = {
    msg:  { min: 0, max: 1500, step: 25, def: 400, label: "Mensajes IA / mes",            unit: "msgs",  cr: CR_PER_MSG  },
    appt: { min: 0, max: 200,  step: 5,  def: 30,  label: "Agendamientos automáticos / mes", unit: "agend", cr: CR_PER_APPT },
  } as const;

  const [tab, setTab] = useState<"msg" | "appt">("msg");
  const [val, setVal] = useState<number>(RANGE.msg.def);

  const r = RANGE[tab];
  const used = val * r.cr;
  const chosen = PLANS.find((p) => used <= p.credits) ?? PLANS[PLANS.length - 1];
  const overCredits = Math.max(0, used - chosen.credits);
  const overagePacks = Math.ceil(overCredits / 10000);
  const overageCost = overagePacks * OVERAGE_PER_10K;
  const otherCount = tab === "msg" ? Math.round(used / CR_PER_APPT) : Math.round(used / CR_PER_MSG);
  const otherUnit = tab === "msg" ? "agendamientos automáticos" : "mensajes IA";
  const pctOfCap = Math.min(999, Math.round((used / chosen.credits) * 100));
  const fmt = (n: number) => Math.round(n).toLocaleString("es-CL");
  const pctSlider = ((val - r.min) / (r.max - r.min)) * 100;

  const onTabChange = (newTab: "msg" | "appt") => {
    setTab(newTab);
    setVal(RANGE[newTab].def);
  };

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

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#10B981", marginBottom: 8 }}>
            Calculadora
          </div>
          <h3 style={{ fontFamily: "Inter", fontSize: 26, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.02em", margin: "0 0 6px" }}>
            Mira qué plan te calza.
          </h3>
          <p style={{ fontFamily: "Inter", fontSize: 14, color: "#6B7280", margin: 0 }}>
            Elige una métrica y mueve el slider. Te recomendamos el plan en vivo.
          </p>
        </div>

        <div style={{ display: "flex", gap: 6, maxWidth: 480, margin: "0 auto 28px", background: "#F3F4F6", borderRadius: 999, padding: 4 }}>
          {(["msg", "appt"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onTabChange(t)}
              style={{
                flex: 1,
                padding: "11px 16px",
                border: "none",
                background: tab === t ? GRAD : "transparent",
                color: tab === t ? "#fff" : "#6B7280",
                fontFamily: "Inter",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 999,
                cursor: "pointer",
                transition: "all .25s",
                letterSpacing: "-0.01em",
                boxShadow: tab === t ? "0 4px 14px rgba(124,58,237,.25)" : "none",
              }}
            >
              {t === "msg" ? "Mensajes IA" : "Agendamientos automáticos"}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: 620, margin: "0 auto 24px", padding: "0 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, color: "#6B7280", letterSpacing: ".12em", textTransform: "uppercase" }}>
              {r.label}
            </span>
            <span style={{ fontFamily: "Inter", fontSize: 22, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.01em" }}>
              {fmt(val)}
              <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, color: "#6B7280", marginLeft: 4, letterSpacing: ".04em", textTransform: "uppercase", fontWeight: 500 }}> {r.unit}</span>
            </span>
          </div>
          <input
            type="range"
            min={r.min}
            max={r.max}
            step={r.step}
            value={val}
            onChange={(e) => setVal(+e.target.value)}
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
            <span>{fmt(r.max)}</span>
          </div>
        </div>

        <div
          style={{
            maxWidth: 460,
            margin: "0 auto 20px",
            padding: "24px 28px",
            background: "linear-gradient(135deg, rgba(0,159,227,.05), rgba(124,58,237,.05), rgba(200,80,192,.04))",
            border: "1px solid #E5E7EB",
            borderRadius: 16,
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, color: "#6B7280", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>
            Equivale a
          </div>
          <div
            style={{
              fontFamily: "Inter",
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1,
              background: GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: 8,
            }}
          >
            {fmt(used)}
            <span style={{ fontSize: 14, fontWeight: 600, color: "#4B5563", WebkitTextFillColor: "#4B5563", marginLeft: 6, letterSpacing: 0 }}>créditos IA</span>
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 13, color: "#4B5563", lineHeight: 1.5 }}>
            ≈ <b style={{ color: "#0A0A0A" }}>{fmt(otherCount)} {otherUnit}</b> en su equivalente
          </div>
        </div>

        <div style={{ textAlign: "center", paddingTop: 20, borderTop: "1px solid #F0F0F0" }}>
          <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, color: "#6B7280", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>
            Plan recomendado
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 22, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>
            Plan{" "}
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              {chosen.name}
            </span>{" "}
            · ${chosen.price} USD/mes
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 13, color: "#6B7280" }}>
            Usas {pctOfCap}% de los {fmt(chosen.credits)} créditos del plan {chosen.name}
          </div>
          {overCredits > 0 && (
            <div
              style={{
                display: "inline-block",
                marginTop: 12,
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
              + {fmt(overCredits)} créditos extra → {overagePacks} pack(s) de $5 = ${overageCost} USD overage
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
    { price: "$5",  unit: "/mes", label: "+10.000 créditos IA",        sub: "≈ ~50 mensajes o ~4 agendamientos extra" },
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

