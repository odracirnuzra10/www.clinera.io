"use client";

import { useState } from "react";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import CatalogPrice from "@/components/pricing/CatalogPrice";
import PriceModalitySwitch from "@/components/pricing/PriceModalitySwitch";
import { usePriceModality } from "@/components/pricing/PriceModalityProvider";
import { PLAN_THEMES, type PlanTheme } from "@/components/home-v3/sections";
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
    <section className="p2-sec" style={{ padding: "64px 80px 10px", background: "linear-gradient(180deg,#FFFFFF 0%,#FAFAFA 100%)" }}>
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

// Mismo diseño que /planes: tema por tarjeta de home-v3. Go! toma el tema cian
// (entrada), Flux el violeta y Vortex el violeta intenso, destacado.
const THEME_OF: Record<Plan2["id"], keyof typeof PLAN_THEMES> = {
  go: "vortex",
  flux: "atlas",
  vortex: "summit",
};

const JAKARTA = "'Plus Jakarta Sans', sans-serif";

const ICONS: Record<Plan2["id"], React.ReactNode> = {
  go: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" />
    </svg>
  ),
  flux: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M3 9c3-4 6 4 9 0s6 4 9 0" />
      <path d="M3 16c3-4 6 4 9 0s6 4 9 0" />
    </svg>
  ),
  vortex: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-9-9" />
      <path d="M16.5 12A4.5 4.5 0 1 1 12 7.5" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
};

function Cards() {
  return (
    <section
      className="p2-sec"
      style={{ padding: "12px 56px 96px", background: "#FAFAFA", position: "relative", overflow: "hidden" }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 480,
          height: 480,
          background: "radial-gradient(circle at 70% 30%, rgba(217,70,239,.14), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative" }}>
        <div
          className="p2-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, alignItems: "stretch" }}
        >
          {PLANS_2.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 24,
            fontFamily: MONO,
            fontSize: 11.5,
            letterSpacing: "0.06em",
            color: "#6B7280",
          }}
        >
          Todos los planes: WhatsApp, Facebook e Instagram · solo para clientes nuevos
        </div>
      </div>
      <style jsx>{`
        :global(.p2-card) {
          transition: transform .26s cubic-bezier(.16,1,.3,1), box-shadow .26s ease, filter .26s ease;
        }
        :global(.p2-card-featured) { transform: translateY(-8px); }
        :global(.p2-card:hover) { transform: translateY(-4px); filter: saturate(1.03) brightness(1.01); }
        :global(.p2-card-featured:hover) { transform: translateY(-12px); }
        :global(.p2-cta) {
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform .2s ease, filter .2s ease;
        }
        :global(.p2-cta:hover) { transform: translateY(-2px); filter: brightness(.96); }
        :global(.p2-cta:focus-visible) { outline: 3px solid rgba(124,58,237,.55); outline-offset: 3px; }
        @media (max-width: 980px) {
          :global(.p2-card), :global(.p2-card-featured), :global(.p2-card:hover), :global(.p2-card-featured:hover) { transform: none !important; }
          :global(.p2-card-featured) { order: -1; }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.p2-card), :global(.p2-cta) { transition: none !important; }
          :global(.p2-card:hover), :global(.p2-cta:hover) { transform: none !important; }
        }
      `}</style>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan2 }) {
  const th = PLAN_THEMES[THEME_OF[plan.id]];
  const featured = plan.id === "vortex";
  const hasBadge = featured || plan.id === "go";
  const monoLabel = {
    fontFamily: MONO,
    fontSize: 10.5,
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: th.label,
  } as const;
  return (
    <article
      data-plan-card={plan.id}
      className={featured ? "p2-card p2-card-featured" : "p2-card"}
      style={{
        background: th.cardBg,
        border: `1px solid ${th.cardBorder}`,
        borderRadius: 24,
        padding: featured ? "34px 30px 32px" : "32px 28px",
        boxShadow: th.cardShadow,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      {hasBadge && (
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            color: "#7C3AED",
            fontFamily: MONO,
            fontSize: 10.5,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "7px 16px",
            borderRadius: 999,
            fontWeight: 700,
            boxShadow: "0 10px 24px -6px rgba(91,33,182,.45)",
            whiteSpace: "nowrap",
          }}
        >
          {featured ? `★ ${plan.tag}` : plan.tag}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: "Inter", fontSize: 13.5, fontWeight: 500, color: th.label }}>Plan</div>
          <h2 style={{ fontFamily: JAKARTA, fontSize: 29, fontWeight: 800, color: th.name, letterSpacing: "-0.03em", margin: "2px 0 0" }}>
            {plan.name}
          </h2>
        </div>
        <span
          aria-hidden
          style={{
            width: 42,
            height: 42,
            borderRadius: 13,
            background: th.iconBg,
            color: th.iconColor,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "0 0 auto",
          }}
        >
          {ICONS[plan.id]}
        </span>
      </div>

      <div
        style={{
          background: th.panelBg,
          border: `1px solid ${th.panelBorder}`,
          borderRadius: 16,
          padding: "0 20px",
          marginBottom: 18,
        }}
      >
        <div style={{ padding: "17px 0 15px" }}>
          <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: th.sub }}>
            Implementación
          </div>
          <div style={{ fontFamily: JAKARTA, fontSize: 15, fontWeight: 800, lineHeight: 1.4, color: th.ink, marginTop: 4 }}>
            Sin costo
          </div>
        </div>
        <div aria-hidden style={{ borderTop: `1px solid ${th.divider}` }} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            alignItems: "center",
            gap: 16,
            padding: "12px 0 16px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: th.accent }}>
              Plan mensual
            </div>
            <div style={{ fontFamily: MONO, fontSize: 10.5, lineHeight: 1.5, color: th.sub, marginTop: 5 }}>
              {plan.branches === 1 ? "1 sucursal" : `${plan.branches} sucursales`} ·{" "}
              {plan.professionals === 1 ? "1 profesional" : `${plan.professionals} profesionales`}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: JAKARTA, fontSize: 36, fontWeight: 800, color: th.ink, letterSpacing: "-0.05em", lineHeight: 1.05 }}>
              <CatalogPrice usd={plan.monthlyUsd} />
            </div>
            <PriceCurrency color={th.sub} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
        <PlanCta plan={plan} theme={th} />
        {featured && (
          <a
            href={VORTEX_DEMO_URL}
            style={{
              textDecoration: "none",
              textAlign: "center",
              color: th.sub,
              padding: "6px 12px",
              fontWeight: 500,
              fontSize: 12.5,
              fontFamily: "Inter, sans-serif",
              opacity: 0.85,
            }}
          >
            Agendar demo · Vortex
          </a>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${th.divider}`, paddingTop: 18, flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ ...monoLabel, marginBottom: 12 }}>Funciones base</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
          {plan.features.map((f) => (
            <FeatureRow key={f} th={th} text={f} />
          ))}
          {plan.excluded.map((x) => (
            <FeatureRow key={x} th={th} text={x} off />
          ))}
        </div>

        <div style={{ marginTop: "auto", display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { num: String(plan.professionals), label: "Profesionales" },
            { num: String(plan.branches), label: plan.branches === 1 ? "Sucursal" : "Sucursales" },
          ].map((c) => (
            <span
              key={c.label}
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                background: th.chipBg,
                border: `1px solid ${th.chipBorder}`,
                borderRadius: 12,
                padding: "7px 13px",
              }}
            >
              <span style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 800, color: th.ink, lineHeight: 1.2 }}>{c.num}</span>
              <span style={{ fontFamily: "Inter", fontSize: 10.5, fontWeight: 500, color: th.sub }}>{c.label}</span>
            </span>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ ...monoLabel, marginBottom: 8 }}>Canales</div>
          <PlanChannelLogos channels={[...CHANNELS_2]} color={th.ink} chipBg={th.chipBg} chipBorder={th.chipBorder} />
        </div>
      </div>
    </article>
  );
}

function PriceCurrency({ color }: { color: string }) {
  const { meta } = usePriceModality();
  return <div style={{ fontFamily: "Inter", fontSize: 11.5, fontWeight: 600, color, marginTop: 4 }}>{meta.currency}/mes</div>;
}

function FeatureRow({ th, text, off }: { th: PlanTheme; text: string; off?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        fontFamily: "Inter",
        fontSize: 14,
        lineHeight: 1.5,
        color: off ? th.sub : th.ink,
        opacity: off ? 0.7 : 1,
        textDecoration: off ? "line-through" : "none",
      }}
    >
      <span
        style={{
          flex: "0 0 16px",
          width: 16,
          height: 16,
          borderRadius: 999,
          background: off ? "transparent" : th.checkBg,
          border: off ? `1px solid ${th.divider}` : 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
        }}
      >
        {off ? (
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={th.sub} strokeWidth="3.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={th.checkStroke} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
        )}
      </span>
      <span style={{ textDecoration: "none" }}>
        <Pendiente>{text}</Pendiente>
      </span>
    </div>
  );
}

function PlanCta({ plan, theme }: { plan: Plan2; theme: PlanTheme }) {
  const base = {
    textDecoration: "none",
    textAlign: "center",
    padding: "13px 20px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 14.5,
    fontFamily: JAKARTA,
    boxSizing: "border-box",
  } as const;
  if (!plan.checkoutUrl) {
    return (
      <div>
        <span
          aria-disabled="true"
          data-cta-pendiente={plan.id}
          className="p2-cta"
          style={{ ...base, background: theme.ctaSecondaryBg, color: theme.sub, border: `1px dashed ${theme.ctaSecondaryBorder}`, cursor: "not-allowed" }}
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
      className="p2-cta"
      onClick={() => trackCheckout(plan)}
      style={{ ...base, background: theme.ctaPrimaryBg, color: theme.ctaPrimaryColor, boxShadow: theme.ctaPrimaryShadow, border: 0 }}
    >
      {plan.ctaLabel}
    </a>
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
