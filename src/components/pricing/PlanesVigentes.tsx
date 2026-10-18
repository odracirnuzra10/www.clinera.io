"use client";

// ============================================================================
// Planes Flux · Nexus · Summit con el DISEÑO ORIGINAL de las tarjetas de
// `Pricing` (home-v3/sections.tsx): degradado por plan, ícono, panel de cobro,
// «Funciones base», chips y canales (Ricardo, 18-oct-2026: «mantener el diseño
// original»). Cambia el contenido, no la forma:
// - solo mensual y solo dólares (sin toggle anual ni switch MXN);
// - implementación US$ 250 en todos los planes;
// - un solo CTA, «Hablar con ventas» → /agenda?plan=… con la query de la visita;
// - funciones enfocadas en la clínica estética (`planes.ts`).
// Temas e íconos se reusan de `Pricing`: Flux = tono cyan, Nexus = violeta
// claro (destacado), Summit = violeta intenso.
// ============================================================================

import { useSyncExternalStore, type CSSProperties } from "react";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { PLAN_ICONS, PLAN_THEMES } from "@/components/home-v3/sections";
import { PlanChannelLogos } from "@/components/pricing/PlanChannelLogos";
import { VERTEX_IA_MODELS } from "@/content/ia-stack";
import {
  CTA_VENTAS_LABEL,
  EXTRAS_LINEA,
  IMPLEMENTACION_USD,
  PLANES,
  PLANES_BAJADA,
  PLANES_TITULO,
  PLANES_TITULO_ACENTO,
  agendaHrefPlan,
  type PlanId,
} from "@/content/planes";

const TEMA: Record<PlanId, keyof typeof PLAN_THEMES> = {
  flux: "vortex",
  nexus: "atlas",
  summit: "summit",
};

const noop = () => () => {};
const readSearch = () => window.location.search;
const readSearchServer = () => "";

const n = (v: number) => v.toLocaleString("es-CL");
const MONO = "'JetBrains Mono', ui-monospace, monospace";
const JAKARTA = "'Plus Jakarta Sans', sans-serif";

const rowLabel = (color: string): CSSProperties => ({
  fontFamily: MONO,
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: "0.09em",
  lineHeight: 1.5,
  textTransform: "uppercase",
  color,
  whiteSpace: "nowrap",
});

export default function PlanesVigentes({
  id = "precios",
  conTitulo = true,
}: {
  id?: string;
  /** /planes trae su propio hero: ahí va sin encabezado. */
  conTitulo?: boolean;
}) {
  // La query de la visita (utm, gclid, fbclid) viaja a /agenda: sin ella el lead
  // del anuncio llega sin origen.
  const search = useSyncExternalStore(noop, readSearch, readSearchServer);

  return (
    <section
      id={id}
      aria-label="Planes de Clinera"
      data-planes-vigentes
      style={{
        padding: conTitulo ? "112px 56px" : "12px 56px 112px",
        background: "#FAFAFA",
        borderTop: conTitulo ? "1px solid #F0F0F0" : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
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
        {conTitulo && (
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 34px" }}>
            <Eyebrow>Planes</Eyebrow>
            <h2
              className="pv-h2"
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
              {PLANES_TITULO}{" "}
              <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                {PLANES_TITULO_ACENTO}
              </span>
            </h2>
            <p style={{ fontFamily: "Inter", fontSize: 17, color: "#4B5563", margin: 0, lineHeight: 1.55 }}>
              {PLANES_BAJADA}
            </p>
          </div>
        )}

        <div
          style={{
            maxWidth: 720,
            margin: "0 auto 26px",
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 10.5,
            letterSpacing: ".05em",
            color: "#6B7280",
          }}
        >
          Plan mensual en dólares · implementación US${IMPLEMENTACION_USD}, pago único en todos los planes
        </div>

        <div
          className="pv-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, alignItems: "stretch" }}
        >
          {PLANES.map((p) => {
            const th = PLAN_THEMES[TEMA[p.id]];
            const chips = [
              { num: String(p.professionals), label: "Profesionales" },
              { num: n(p.conversations), label: "Conversaciones/mes" },
            ];
            return (
              <article
                key={p.id}
                data-plan-card={p.id}
                className={p.featured ? "pv-card pv-card-featured" : "pv-card"}
                style={{
                  background: th.cardBg,
                  border: `1px solid ${th.cardBorder}`,
                  borderRadius: 24,
                  padding: p.featured ? "34px 30px 32px" : "32px 28px",
                  boxShadow: th.cardShadow,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                }}
              >
                {p.featured && (
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
                    ★ El {p.tag.toLowerCase()}
                  </div>
                )}

                {/* Encabezado: Plan + nombre, ícono del plan a la derecha */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
                  <div>
                    <div style={{ fontFamily: "Inter", fontSize: 13.5, fontWeight: 500, color: th.label }}>Plan</div>
                    <div style={{ fontFamily: JAKARTA, fontSize: 29, fontWeight: 800, color: th.name, letterSpacing: "-0.03em", marginTop: 2 }}>
                      {p.name}
                    </div>
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
                    {PLAN_ICONS[TEMA[p.id]]}
                  </span>
                </div>

                {/* Cobro: implementación + plan mensual */}
                <div
                  role="table"
                  aria-label={`Cobro del plan ${p.name}`}
                  style={{
                    background: th.panelBg,
                    border: `1px solid ${th.panelBorder}`,
                    borderRadius: 16,
                    padding: "0 20px",
                    marginBottom: 18,
                  }}
                >
                  <div
                    role="row"
                    style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "center", gap: 16, padding: "17px 0 15px" }}
                  >
                    <div role="cell" style={{ minWidth: 0 }}>
                      <div style={rowLabel(th.sub)}>Implementación</div>
                      <div style={{ fontFamily: JAKARTA, fontSize: 12.5, fontWeight: 600, lineHeight: 1.35, color: th.ink, marginTop: 4, whiteSpace: "nowrap" }}>
                        Pago único · todos los planes
                      </div>
                    </div>
                    <div role="cell" style={{ textAlign: "right" }}>
                      <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6, fontFamily: JAKARTA, fontSize: 24, fontWeight: 800, color: th.ink, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>
                        ${IMPLEMENTACION_USD}
                        <span style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 600, letterSpacing: 0, color: th.sub }}>USD</span>
                      </span>
                    </div>
                  </div>

                  <div aria-hidden style={{ borderTop: `1px solid ${th.divider}` }} />

                  <div
                    role="row"
                    style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "center", gap: 16, padding: "14px 0 16px" }}
                  >
                    <div role="cell" style={{ minWidth: 0 }}>
                      <div style={rowLabel(th.accent)}>Plan mensual</div>
                      <div style={{ fontFamily: MONO, fontSize: 10.5, lineHeight: 1.5, color: th.sub, marginTop: 5 }}>
                        Hasta {p.professionals} profesionales
                      </div>
                    </div>
                    <div role="cell" style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: JAKARTA, fontSize: 36, fontWeight: 800, color: th.ink, letterSpacing: "-0.05em", lineHeight: 1.05 }}>
                        ${p.monthlyUsd}
                      </div>
                      <div style={{ fontFamily: "Inter", fontSize: 11.5, fontWeight: 600, color: th.sub, marginTop: 4 }}>USD/mes</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <a
                    className="pv-cta"
                    href={agendaHrefPlan(p.id, search)}
                    data-cta-ventas={p.id}
                    style={{
                      textDecoration: "none",
                      textAlign: "center",
                      background: th.ctaPrimaryBg,
                      color: th.ctaPrimaryColor,
                      padding: "13px 20px",
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 14.5,
                      fontFamily: JAKARTA,
                      boxShadow: th.ctaPrimaryShadow,
                      boxSizing: "border-box",
                    }}
                  >
                    {CTA_VENTAS_LABEL} · {p.name}
                  </a>
                </div>

                <div style={{ borderTop: `1px solid ${th.divider}`, paddingTop: 18, flex: 1, display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 10.5,
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: th.label,
                      marginBottom: 12,
                    }}
                  >
                    Funciones base
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                    {p.features.map((f) => (
                      <div
                        key={f}
                        style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: "Inter", fontSize: 14, color: th.ink, lineHeight: 1.5 }}
                      >
                        <span
                          style={{
                            flex: "0 0 16px",
                            width: 16,
                            height: 16,
                            borderRadius: 999,
                            background: th.checkBg,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 2,
                          }}
                        >
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={th.checkStroke} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        </span>
                        {f}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "auto", display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {chips.map((c) => (
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
                    <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: th.label, marginBottom: 8 }}>
                      Canales
                    </div>
                    <PlanChannelLogos channels={p.channels} color={th.ink} chipBg={th.chipBg} chipBorder={th.chipBorder} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 28, fontFamily: MONO, fontSize: 11.5, letterSpacing: "0.06em", color: "#6B7280" }}>
          Extras: {EXTRAS_LINEA}
        </div>

        <div
          className="pv-ia-strip"
          style={{ marginTop: 28, borderTop: "1px solid #EEECEA", borderBottom: "1px solid #EEECEA", padding: "14px 0", display: "flex", flexWrap: "wrap", alignItems: "center", rowGap: 10, columnGap: 4 }}
        >
          <div className="pv-ia-label" style={{ flexShrink: 0, padding: "4px 18px 4px 0", borderRight: "1px solid #EEECEA", fontFamily: MONO, fontSize: 10.5, fontWeight: 600, letterSpacing: ".13em", textTransform: "uppercase", color: "#6B7280", whiteSpace: "nowrap" }}>
            Modelos de IA · Clinera Intelligence
          </div>
          <div style={{ flex: "1 1 220px", minWidth: 0, display: "flex", flexWrap: "wrap", alignItems: "center", rowGap: 6 }}>
            {VERTEX_IA_MODELS.map((m) => (
              <span key={m} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "2px 18px", fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: GRAD, display: "inline-block", flexShrink: 0 }} />
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 980px) {
          :global(.pv-grid) { grid-template-columns: 1fr !important; gap: 28px !important; }
          :global(.pv-card-featured) { order: -1; }
        }
        @media (max-width: 720px) {
          :global(section[data-planes-vigentes]) { padding-left: 16px !important; padding-right: 16px !important; }
          :global(.pv-ia-label) { border-right: none !important; border-bottom: 1px solid #EEECEA; padding: 0 0 10px 0 !important; width: 100%; white-space: normal !important; }
        }
        @media (max-width: 560px) {
          :global(.pv-h2) { font-size: 32px !important; }
        }
        :global(.pv-card) { transition: transform .26s cubic-bezier(.16,1,.3,1), box-shadow .26s ease; }
        :global(.pv-card-featured) { transform: translateY(-8px); }
        :global(.pv-card:hover) { transform: translateY(-4px); }
        :global(.pv-card-featured:hover) { transform: translateY(-12px); }
        :global(.pv-cta) { min-height: 48px; display: flex; align-items: center; justify-content: center; transition: transform .2s ease, filter .2s ease; }
        :global(.pv-cta:hover) { transform: translateY(-2px); filter: brightness(.96); }
        @media (prefers-reduced-motion: reduce) {
          :global(.pv-card), :global(.pv-cta) { transition: none !important; }
          :global(.pv-card-featured), :global(.pv-card:hover), :global(.pv-card-featured:hover) { transform: none !important; }
        }
        @media (max-width: 980px) {
          :global(.pv-card), :global(.pv-card-featured), :global(.pv-card:hover), :global(.pv-card-featured:hover) { transform: none !important; }
        }
      `}</style>
    </section>
  );
}
