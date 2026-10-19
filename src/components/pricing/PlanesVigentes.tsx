"use client";

// ============================================================================
// Las dos opciones de Clinera: Vortex · Ecosistema (Ricardo, 18-oct-2026)
// ----------------------------------------------------------------------------
// Tarjetas con el diseño de `Pricing` (degradado por plan, ícono, panel de cobro,
// lista de lo que incluye). Lo pintan el home («Dos formas de trabajar con
// Clinera») y /planes. Sin cupón, sin compra y sin extras:
// - CTA único «Agendar videollamada» → /agenda?servicio=… con la query de la visita;
// - línea de implementación (USD 450, pago único) bajo las tarjetas;
// - el agente de IA y los tres bloques de marketing van destacados (ícono + negrita).
// Temas (`planThemes.tsx`): Vortex = violeta claro; Ecosistema = magenta claro
// (destacada, «Recomendado»).
// ============================================================================

import { useSyncExternalStore, type CSSProperties } from "react";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { ICONO_ECOSISTEMA, ICONO_VORTEX, TEMA_ECOSISTEMA, TEMA_VORTEX } from "@/components/pricing/planThemes";
import { PlanChannelLogos } from "@/components/pricing/PlanChannelLogos";
import { IconoDestacado } from "@/components/pricing/IconoDestacado";
import AhorroEcosistema from "@/components/pricing/AhorroEcosistema";
import { VERTEX_IA_MODELS } from "@/content/ia-stack";
import {
  CTA_VENTAS_LABEL,
  IMPLEMENTACION_LINEA,
  NECESIDADES_LINEA,
  PLANES,
  PLANES_BAJADA,
  PLANES_TITULO,
  PLANES_TITULO_ACENTO,
  agendaHref,
  destacadoDe,
  type PlanId,
} from "@/content/planes";

const temaDe = (id: PlanId) => (id === "ecosistema" ? TEMA_ECOSISTEMA : TEMA_VORTEX);
const iconoDe = (id: PlanId) => (id === "ecosistema" ? ICONO_ECOSISTEMA : ICONO_VORTEX);

const noop = () => () => {};
const readSearch = () => window.location.search;
const readSearchServer = () => "";

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
  titulo = PLANES_TITULO,
  tituloAcento = PLANES_TITULO_ACENTO,
  bajada = PLANES_BAJADA,
  conModelos = false,
}: {
  id?: string;
  /** /planes trae su propio hero: ahí va sin encabezado. */
  conTitulo?: boolean;
  titulo?: string;
  tituloAcento?: string;
  bajada?: string;
  /** /planes muestra la franja de modelos de IA de Clinera Intelligence (sin atarla a un plan). */
  conModelos?: boolean;
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
      <div style={{ maxWidth: 1040, margin: "0 auto", position: "relative" }}>
        {conTitulo && (
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 56px" }}>
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
              {titulo}{" "}
              <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                {tituloAcento}
              </span>
            </h2>
            <p style={{ fontFamily: "Inter", fontSize: 17, color: "#4B5563", margin: 0, lineHeight: 1.55 }}>{bajada}</p>
          </div>
        )}

        <div className="pv-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "stretch" }}>
          {PLANES.map((p) => {
            const th = temaDe(p.id);
            return (
              <article
                key={p.id}
                data-plan-card={p.id}
                className={p.featured ? "pv-card pv-card-featured" : "pv-card"}
                style={{
                  background: th.cardBg,
                  border: `1px solid ${th.cardBorder}`,
                  borderRadius: 24,
                  padding: "36px 32px 34px",
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
                      color: "#A21CAF",
                      fontFamily: MONO,
                      fontSize: 10.5,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      padding: "7px 16px",
                      borderRadius: 999,
                      fontWeight: 700,
                      boxShadow: "0 10px 24px -6px rgba(162,28,175,.4)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ★ {p.tag}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
                  <div>
                    <div style={{ fontFamily: "Inter", fontSize: 13.5, fontWeight: 500, color: th.label }}>Opción</div>
                    <div style={{ fontFamily: JAKARTA, fontSize: 30, fontWeight: 800, color: th.name, letterSpacing: "-0.03em", marginTop: 2 }}>
                      {p.name}
                    </div>
                  </div>
                  <span
                    aria-hidden
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 13,
                      background: th.iconBg,
                      color: th.iconColor,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: "0 0 auto",
                    }}
                  >
                    {iconoDe(p.id)}
                  </span>
                </div>

                {p.id === "ecosistema" && (
                  <span
                    data-plan-marketing
                    style={{
                      display: "inline-block",
                      margin: "0 0 12px",
                      padding: "5px 12px",
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #009FE3, #7C3AED, #C850C0)",
                      color: "#FFFFFF",
                      fontFamily: MONO,
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Incluye marketing de performance
                  </span>
                )}
                <p style={{ fontFamily: "Inter", fontSize: 15, lineHeight: 1.5, color: th.sub, margin: "0 0 18px" }}>{p.resumen}</p>

                <div
                  role="table"
                  aria-label={`Precio de ${p.name}`}
                  style={{ background: th.panelBg, border: `1px solid ${th.panelBorder}`, borderRadius: 16, padding: "0 20px", marginBottom: 20 }}
                >
                  <div
                    role="row"
                    style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "center", gap: 16, padding: "16px 0" }}
                  >
                    <div role="cell" style={{ minWidth: 0 }}>
                      <div style={rowLabel(th.accent)}>Mensual</div>
                      <div style={{ fontFamily: MONO, fontSize: 10.5, lineHeight: 1.5, color: th.sub, marginTop: 5 }}>
                        Hasta {p.professionals} profesionales
                      </div>
                    </div>
                    <div role="cell" style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: JAKARTA, fontSize: 40, fontWeight: 800, color: th.ink, letterSpacing: "-0.05em", lineHeight: 1.05 }}>
                        ${p.monthlyUsd}
                      </div>
                      <div style={{ fontFamily: "Inter", fontSize: 11.5, fontWeight: 600, color: th.sub, marginTop: 4 }}>USD/mes</div>
                    </div>
                  </div>
                </div>

                <a
                  className="pv-cta"
                  href={agendaHref(p.servicio, search)}
                  data-cta-ventas={p.id}
                  style={{
                    textDecoration: "none",
                    textAlign: "center",
                    background: p.featured ? GRAD : th.ctaPrimaryBg,
                    color: p.featured ? "#fff" : th.ctaPrimaryColor,
                    padding: "14px 20px",
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 15,
                    fontFamily: JAKARTA,
                    boxShadow: p.featured ? "0 10px 26px -8px rgba(162,28,175,.5)" : th.ctaPrimaryShadow,
                    boxSizing: "border-box",
                    marginBottom: 24,
                  }}
                >
                  {CTA_VENTAS_LABEL}
                </a>

                <div style={{ borderTop: `1px solid ${th.divider}`, paddingTop: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 10.5,
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: th.label,
                      marginBottom: 14,
                    }}
                  >
                    Qué incluye
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                    {p.features.map((f) => {
                      const tipo = destacadoDe(f);
                      if (tipo) {
                        return (
                          <div
                            key={f}
                            data-destacado={tipo}
                            style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "Inter", fontSize: 14.5, fontWeight: 800, color: th.ink, lineHeight: 1.4, background: th.chipBg, border: `1px solid ${th.chipBorder}`, borderRadius: 12, padding: "9px 11px" }}
                          >
                            <IconoDestacado tipo={tipo} size={22} />
                            <strong>{f}</strong>
                          </div>
                        );
                      }
                      return (
                        <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: "Inter", fontSize: 14.5, color: th.ink, lineHeight: 1.5 }}>
                          <span
                            style={{ flex: "0 0 16px", width: 16, height: 16, borderRadius: 999, background: th.checkBg, display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}
                          >
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={th.checkStroke} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                          </span>
                          {f}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: "auto" }}>
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

        <div style={{ textAlign: "center", marginTop: 36, display: "grid", gap: 8 }}>
          <p data-implementacion style={{ margin: 0, fontFamily: "Inter", fontSize: 16, fontWeight: 600, color: "#111827" }}>
            {IMPLEMENTACION_LINEA}
          </p>
          <p style={{ margin: 0, fontFamily: "Inter", fontSize: 15, color: "#4B5563" }}>{NECESIDADES_LINEA}</p>
        </div>

        <AhorroEcosistema />

        {conModelos && (
          <div
            className="pv-ia-strip"
            style={{ marginTop: 40, borderTop: "1px solid #EEECEA", borderBottom: "1px solid #EEECEA", padding: "14px 0", display: "flex", flexWrap: "wrap", alignItems: "center", rowGap: 10, columnGap: 4 }}
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
        )}
      </div>
      <style jsx>{`
        @media (max-width: 860px) {
          :global(.pv-grid) { grid-template-columns: 1fr !important; gap: 32px !important; }
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
        @media (max-width: 860px) {
          :global(.pv-card), :global(.pv-card-featured), :global(.pv-card:hover), :global(.pv-card-featured:hover) { transform: none !important; }
        }
      `}</style>
    </section>
  );
}
