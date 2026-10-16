"use client";

import { useState } from "react";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import CatalogPrice from "@/components/pricing/CatalogPrice";
import PriceModalitySwitch from "@/components/pricing/PriceModalitySwitch";
import { PlanChannelLogos } from "@/components/pricing/PlanChannelLogos";
import Pendiente from "@/components/planes2/Pendiente";
import {
  CHANNELS_2,
  CLIENTE_ACTUAL_LINEA,
  CLIENTE_ACTUAL_URL_PENDIENTE,
  COMO_FUNCIONA_2,
  DEFINICION_AURA,
  DEFINICION_INTELLIGENCE,
  EXTRA_BRANCH_USD,
  PLANES2_FAQ,
  PLANS_2,
  SOLO_NUEVOS,
  VORTEX_DEMO_URL,
  pendiente,
  type Plan2,
} from "@/content/planes2";
import { EXTRA_CREDIT_PACK_CREDITS, EXTRA_CREDIT_PACK_USD, EXTRA_USER_USD } from "@/content/pricing";

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const INK = "#0A0A0A";
const MUTED = "#4B5563";

const gradText = {
  background: GRAD,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
} as const;

function trackCheckout(plan: Plan2) {
  const w = window as unknown as { dataLayer?: unknown[]; fbq?: (...a: unknown[]) => void };
  (w.dataLayer = w.dataLayer || []).push({
    event: "initiate_checkout",
    lead_source: "planes2_landing",
    plan: plan.id,
    content_name: plan.name,
    value: plan.monthlyUsd,
    currency: "USD",
    page_path: "/planes2",
  });
  w.fbq?.("track", "InitiateCheckout", {
    content_name: plan.name,
    content_category: "planes2",
    content_type: "product",
    currency: "USD",
    value: plan.monthlyUsd,
  });
}

export default function Planes2Body() {
  return (
    <>
      <style jsx global>{`
        @media (max-width: 720px) {
          .p2-sec { padding-left: 16px !important; padding-right: 16px !important; }
          .p2-h1 { font-size: 36px !important; }
        }
        @media (max-width: 960px) {
          .p2-grid { grid-template-columns: 1fr !important; max-width: 460px !important; }
          .p2-steps { grid-template-columns: 1fr !important; }
          .p2-addons { grid-template-columns: 1fr !important; max-width: 420px !important; }
        }
      `}</style>
      <Hero />
      <Cards />
      <Definiciones />
      <Addons />
      <ComoFunciona />
      <Faq />
      <ClienteActual />
    </>
  );
}

function Hero() {
  return (
    <section className="p2-sec" style={{ padding: "64px 80px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
        <Eyebrow>Planes · vista previa interna</Eyebrow>
        <h1
          className="p2-h1"
          style={{
            fontFamily: "Inter",
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.03,
            margin: "16px 0 14px",
            color: INK,
          }}
        >
          Empieza con Clinera{" "}
          <span style={gradText}>desde USD&nbsp;17 al&nbsp;mes.</span>
        </h1>
        <p style={{ fontFamily: "Inter", fontSize: 18, color: MUTED, lineHeight: 1.55, margin: "0 auto 18px", maxWidth: 640 }}>
          Agenda, fichas y tus mensajes de WhatsApp, Facebook e Instagram en un solo lugar. Sube de plan cuando tu
          clínica crezca.
        </p>
        <p style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "#6B7280", margin: 0 }}>
          {SOLO_NUEVOS}
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
          <PriceModalitySwitch size="compact" align="start" />
        </div>
        <p style={{ fontFamily: "Inter", fontSize: 12.5, margin: "10px 0 0", color: "#6B7280" }}>
          <Pendiente>{pendiente("precios en MXN de los 3 planes; hoy se convierten al tipo de cambio congelado")}</Pendiente>
        </p>
      </div>
    </section>
  );
}

function Cards() {
  return (
    <section className="p2-sec" style={{ padding: "24px 56px 96px", background: "#fff" }}>
      <div
        className="p2-grid"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 20,
          alignItems: "stretch",
        }}
      >
        {PLANS_2.map((p) => (
          <PlanCard key={p.id} plan={p} />
        ))}
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan2 }) {
  const isGo = plan.id === "go";
  const isVortex = plan.id === "vortex";
  return (
    <article
      data-plan-card={plan.id}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        borderRadius: 20,
        padding: "28px 26px 26px",
        border: isGo ? "1.5px solid transparent" : "1px solid #E5E7EB",
        backgroundImage: isGo ? `linear-gradient(#fff,#fff), ${GRAD}` : undefined,
        backgroundOrigin: "border-box",
        backgroundClip: isGo ? "padding-box, border-box" : undefined,
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: isGo ? "#7C3AED" : "#6B7280" }}>
        {plan.tag}
      </span>
      <h2 style={{ fontFamily: "Inter", fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", margin: "10px 0 4px", color: INK }}>
        {plan.name}
      </h2>
      <p style={{ fontFamily: "Inter", fontSize: 14.5, color: MUTED, lineHeight: 1.5, margin: "0 0 18px", minHeight: 44 }}>
        {plan.tagline}
      </p>
      <div style={{ fontFamily: "Inter", color: INK, display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.04em" }}>
          <CatalogPrice usd={plan.monthlyUsd} />
        </span>
        <span style={{ fontSize: 15, color: "#6B7280" }}>/mes</span>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0", display: "grid", gap: 10, fontFamily: "Inter", fontSize: 14.5, color: INK }}>
        <Li>{plan.branches === 1 ? "1 sucursal" : `${plan.branches} sucursales`}</Li>
        <Li>{plan.professionals === 1 ? "1 profesional" : `${plan.professionals} profesionales`}</Li>
        <Li>
          Clinera Intelligence · <Pendiente>{plan.intelligence}</Pendiente>
        </Li>
        {plan.aura && (
          <Li>
            <Pendiente>{plan.auraNote}</Pendiente>
          </Li>
        )}
        {plan.excluded.map((x) => (
          <li key={x} style={{ display: "flex", gap: 8, color: "#9CA3AF", textDecoration: "line-through" }}>
            <span aria-hidden style={{ width: 16, flex: "0 0 16px" }}>–</span>
            <span>{x}</span>
          </li>
        ))}
      </ul>

      <div style={{ margin: "18px 0 0" }}>
        <PlanChannelLogos channels={[...CHANNELS_2]} />
      </div>

      <div style={{ marginTop: "auto", paddingTop: 24, display: "grid", gap: 10 }}>
        <PlanCta plan={plan} primary={isGo || isVortex} />
        {isVortex && (
          <a
            href={VORTEX_DEMO_URL}
            style={secondaryBtn}
          >
            Agendar demo · Vortex
          </a>
        )}
      </div>
    </article>
  );
}

const secondaryBtn = {
  display: "block",
  textAlign: "center",
  padding: "13px 20px",
  borderRadius: 10,
  border: "1px solid #E5E7EB",
  background: "#fff",
  color: INK,
  fontFamily: "Inter",
  fontWeight: 600,
  fontSize: 15,
  textDecoration: "none",
} as const;

function PlanCta({ plan, primary }: { plan: Plan2; primary: boolean }) {
  const base = {
    display: "block",
    textAlign: "center",
    padding: "14px 20px",
    borderRadius: 10,
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: 15,
    textDecoration: "none",
  } as const;
  if (!plan.checkoutUrl) {
    return (
      <div>
        <span
          aria-disabled="true"
          data-cta-pendiente={plan.id}
          style={{ ...base, background: "#F3F4F6", color: "#6B7280", cursor: "not-allowed" }}
        >
          {plan.ctaLabel}
        </span>
        <p style={{ fontFamily: "Inter", fontSize: 12, lineHeight: 1.5, margin: "8px 0 0" }}>
          <Pendiente>{plan.checkoutPending}</Pendiente>
        </p>
      </div>
    );
  }
  return (
    <a
      href={plan.checkoutUrl}
      data-plan={plan.id}
      onClick={() => trackCheckout(plan)}
      style={
        primary
          ? { ...base, background: GRAD, color: "#fff", boxShadow: "0 12px 32px -8px rgba(124,58,237,.35)" }
          : { ...base, background: INK, color: "#fff" }
      }
    >
      {plan.ctaLabel}
    </a>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ display: "flex", gap: 8 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 16px", marginTop: 3 }} aria-hidden>
        <path d="M5 12l5 5L20 7" />
      </svg>
      <span>{children}</span>
    </li>
  );
}

function Definiciones() {
  return (
    <section className="p2-sec" style={{ padding: "0 56px 80px", background: "#fff" }}>
      <div className="p2-grid" style={{ maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {[
          { k: "Clinera Intelligence", d: DEFINICION_INTELLIGENCE },
          { k: "AURA", d: DEFINICION_AURA },
        ].map((x) => (
          <div key={x.k} style={{ border: "1px solid #EEECEA", borderRadius: 16, padding: "22px 24px", background: "#FAFAFA" }}>
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B7280" }}>{x.k}</span>
            <p style={{ fontFamily: "Inter", fontSize: 15, color: MUTED, lineHeight: 1.55, margin: "8px 0 0" }}>{x.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Addons() {
  const items = [
    {
      usd: EXTRA_USER_USD,
      unit: "/mes",
      label: "Profesional extra",
    },
    {
      usd: EXTRA_BRANCH_USD,
      unit: "/mes",
      label: "Sucursal extra",
    },
    {
      usd: EXTRA_CREDIT_PACK_USD,
      unit: "recarga",
      label: `${EXTRA_CREDIT_PACK_CREDITS.toLocaleString("es-CL")} créditos extras`,
    },
  ];
  return (
    <section className="p2-sec" style={{ padding: "72px 80px", background: "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <Eyebrow>Add-ons</Eyebrow>
        <h2 style={{ fontFamily: "Inter", fontSize: 34, fontWeight: 700, letterSpacing: "-0.03em", margin: "12px 0 32px", color: INK }}>
          Escala cuando lo necesites.
        </h2>
        <div className="p2-addons" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, maxWidth: 900, margin: "0 auto" }}>
          {items.map((it) => (
            <div key={it.label} style={{ background: "#fff", border: "1px solid #EEECEA", borderRadius: 16, padding: "26px 24px" }}>
              <div style={{ fontFamily: "Inter", fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em", color: INK }}>
                <CatalogPrice usd={it.usd} />
                <span style={{ fontSize: 15, fontWeight: 500, color: "#6B7280", marginLeft: 4 }}>{it.unit}</span>
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: INK, marginTop: 8 }}>{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComoFunciona() {
  return (
    <section className="p2-sec" style={{ padding: "80px 80px", background: "#fff", borderTop: "1px solid #F0F0F0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Eyebrow>Cómo funciona</Eyebrow>
          <h2 style={{ fontFamily: "Inter", fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em", margin: "12px 0 0", color: INK }}>
            Tres pasos para operar.
          </h2>
        </div>
        <div className="p2-steps" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {COMO_FUNCIONA_2.map((s) => (
            <div key={s.n} style={{ border: "1px solid #EEECEA", borderRadius: 16, padding: "24px 24px 26px" }}>
              <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".1em", ...gradText }}>{s.n}</span>
              <h3 style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", margin: "10px 0 6px", color: INK }}>{s.t}</h3>
              <p style={{ fontFamily: "Inter", fontSize: 14.5, color: MUTED, lineHeight: 1.55, margin: 0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="p2-sec" style={{ padding: "88px 80px", background: "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h2 style={{ fontFamily: "Inter", fontSize: 38, fontWeight: 700, letterSpacing: "-0.03em", margin: "12px 0 0", color: INK }}>
            Dudas sobre tu plan.
          </h2>
        </div>
        <div style={{ borderTop: "1px solid #E5E7EB" }}>
          {PLANES2_FAQ.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} style={{ borderBottom: "1px solid #E5E7EB" }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "transparent",
                    border: 0,
                    padding: "20px 4px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 20,
                    cursor: "pointer",
                    fontFamily: "Inter",
                  }}
                >
                  <span style={{ fontSize: 16.5, fontWeight: 600, color: INK }}>{it.q}</span>
                  <span aria-hidden style={{ fontSize: 22, color: INK, transform: isOpen ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 4px 20px", fontFamily: "Inter", fontSize: 15, color: MUTED, lineHeight: 1.6 }}>
                    <Pendiente>{it.a}</Pendiente>
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

function ClienteActual() {
  return (
    <section className="p2-sec" style={{ padding: "48px 80px 88px", background: "#fff" }}>
      <p style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", fontFamily: "Inter", fontSize: 15.5, color: MUTED, lineHeight: 1.6 }}>
        {CLIENTE_ACTUAL_LINEA} <Pendiente>{CLIENTE_ACTUAL_URL_PENDIENTE}</Pendiente>
      </p>
    </section>
  );
}
