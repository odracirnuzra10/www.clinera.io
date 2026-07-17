"use client";

import { useState } from "react";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { FinalCTA, Pricing, useReveal } from "@/components/home-v3/sections";
import { PLANES_FAQ } from "@/content/planes-faq";

const FAQ = PLANES_FAQ;

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
            margin: "0 auto 22px",
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
    { price: "$20", unit: "recarga", label: "5.000 créditos extras",  sub: "≈500 conversaciones de emergencia cuando agotas la bolsa del mes." },
    { price: "$9",  unit: "/mes", label: "Usuario / profesional extra", sub: "Suma asientos sin cambiar de plan." },
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
          style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20, maxWidth: 660, margin: "0 auto" }}
        >
          {items.map((it) => (
            <div
              key={it.label}
              style={{
                background: "#FAFAFA",
                border: "1px solid #EEECEA",
                borderRadius: 16,
                padding: "28px 26px",
                textAlign: "center",
                position: "relative",
              }}
            >
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

