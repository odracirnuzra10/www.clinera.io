"use client";

import Link from "next/link";

/**
 * Banner "ANTES VS DESPUÉS" para comparativas directas.
 * Replica visualmente el bloque de /migracion pero personalizado al competidor
 * de cada slug. Si el competidor no publica precios (Reservo, Medilink, Dentalink,
 * Saludtools), usa "Consulta" y suma solo Vambe al total con leyenda "+ lo que pagas".
 *
 * Vambe.ai Advanced (USD 574/mes verificado en vambe.ai/pricing abril 2026) es el
 * comparable real de IA por WhatsApp.
 */

const GRAD = "linear-gradient(135deg, #7C3AED 0%, #D946EF 100%)";

const VAMBE_PRICE_USD = 574;
const VAMBE_URL = "https://www.vambe.ai/pricing";
const CLINERA_PRICE_USD = 279;

export type CompetitorApiPricing = {
  /** Nombre largo del competidor para mostrar (ej "AgendaPro", "Medifolios") */
  name: string;
  /** Plan más completo que incluye API (ej "Plan Pro", "Titanium", "IPS Alta Complejidad") */
  plan: string;
  /** Precio formateado (ej "USD 270", "USD 49", "Consulta") */
  price: string;
  /** Si NO tiene precio público, true → solo suma Vambe al total */
  priceIsConsulta?: boolean;
  /** Si el precio es estimación regional (no verificado en pricing público), true → muestra * y nota al pie */
  priceIsEstimated?: boolean;
  /** Valor numérico USD para sumar al total (ignorado si priceIsConsulta=true) */
  priceUsd?: number;
  /** URL al pricing público del competidor */
  priceUrl: string;
  /** Etiqueta del enlace (ej "agendapro.com/planes") */
  priceLabel: string;
};

type Props = {
  competitor: CompetitorApiPricing;
};

export default function MigrationCompareBanner({ competitor }: Props) {
  const total = competitor.priceIsConsulta
    ? `USD ${VAMBE_PRICE_USD}+`
    : `USD ${(competitor.priceUsd ?? 0) + VAMBE_PRICE_USD}+`;
  const subTotalNote = competitor.priceIsConsulta
    ? ` + lo que pagues por ${competitor.name}`
    : "";

  return (
    <section
      className="section"
      style={{ paddingTop: 32, paddingBottom: 32 }}
    >
      <div className="container">
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span
              style={{
                display: "inline-block",
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#6B7280",
              }}
            >
              Antes vs Después
            </span>
            <h2
              className="mig-banner-h2"
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                margin: "10px 0 8px",
                color: "#0A0A0A",
              }}
            >
              Pagas {total}
              <span style={{ color: "#B91C1C" }}> por 2 herramientas</span> que no se hablan.
            </h2>
            <p
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 16,
                color: "#4B5563",
                margin: 0,
                maxWidth: 720,
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: 1.55,
              }}
            >
              {competitor.name} ({competitor.plan}) por su lado y el agente IA por otro. Dos
              suscripciones, datos partidos y nada que conecte el anuncio con la cita.
            </p>
          </div>

          <div
            className="mig-banner-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: 24,
              alignItems: "stretch",
            }}
          >
            {/* HOY */}
            <div
              style={{
                background: "#FFF7F5",
                border: "1px solid #FECACA",
                borderRadius: 18,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <span
                style={{
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#B91C1C",
                  background: "#FEE2E2",
                  border: "1px solid #FECACA",
                  padding: "5px 10px",
                  borderRadius: 999,
                }}
              >
                Hoy
              </span>
              <div
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  color: "#0A0A0A",
                  lineHeight: 1.2,
                }}
              >
                2 herramientas que no se hablan
              </div>
              <ToolRow
                ico={competitor.name.charAt(0)}
                name={competitor.name}
                sub={competitor.plan}
                price={
                  competitor.priceIsEstimated
                    ? `${competitor.price}*`
                    : competitor.price
                }
                sourceHref={competitor.priceUrl}
                sourceLabel={competitor.priceLabel}
              />
              <ToolRow
                ico="✦"
                name="Vambe.ai"
                sub="agente IA por WhatsApp (plan Advanced)"
                price={`USD ${VAMBE_PRICE_USD}`}
                sourceHref={VAMBE_URL}
                sourceLabel="vambe.ai/pricing"
              />
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: 12,
                  borderTop: "1px solid #FECACA",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#6B7280",
                  }}
                >
                  Costo / mes
                </span>
                <span
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    color: "#B91C1C",
                  }}
                >
                  {total}
                </span>
              </div>
              {subTotalNote && (
                <div
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 12,
                    color: "#9B1C1C",
                    marginTop: -6,
                    fontStyle: "italic",
                  }}
                >
                  {subTotalNote}
                </div>
              )}
            </div>

            {/* ARROW */}
            <div
              className="mig-banner-arrow"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#7C3AED",
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>

            {/* CON CLINERA */}
            <div
              style={{
                background: "#0E1014",
                border: "1px solid transparent",
                borderRadius: 18,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                color: "#fff",
                backgroundImage:
                  "radial-gradient(ellipse 70% 80% at 100% 0%, rgba(217,70,239,.28), transparent 60%), radial-gradient(ellipse 50% 60% at 0% 120%, rgba(124,58,237,.24), transparent 60%)",
              }}
            >
              <span
                style={{
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#A7F3D0",
                  background: "rgba(255,255,255,.08)",
                  border: "1px solid rgba(255,255,255,.16)",
                  padding: "5px 10px",
                  borderRadius: 999,
                }}
              >
                Con Clinera
              </span>
              <div
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  color: "#fff",
                  lineHeight: 1.2,
                }}
              >
                Un ecosistema, una IA, un solo dato.
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {[
                  "Agenda inteligente",
                  "AURA · IA 24/7",
                  "Ficha clínica",
                  "Ventas trazables",
                  "Meta + Google",
                  "Cobros y pagos",
                ].map((p) => (
                  <span
                    key={p}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "rgba(255,255,255,.06)",
                      border: "1px solid rgba(255,255,255,.12)",
                      borderRadius: 999,
                      padding: "7px 12px",
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: "rgba(255,255,255,.92)",
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 999,
                        background: "#D946EF",
                      }}
                    />
                    {p}
                  </span>
                ))}
              </div>
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: 12,
                  borderTop: "1px solid rgba(255,255,255,.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,.6)",
                  }}
                >
                  Costo / mes
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "baseline",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 15,
                      fontWeight: 500,
                      color: "rgba(255,255,255,.55)",
                      textDecoration: "line-through",
                    }}
                  >
                    {total}
                  </span>
                  <span
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 28,
                      fontWeight: 700,
                      letterSpacing: "-0.025em",
                      background: GRAD,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    USD {CLINERA_PRICE_USD}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link
              href="/migracion"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#7C3AED",
                textDecoration: "none",
              }}
            >
              Ver el cálculo completo en /migracion <span aria-hidden>→</span>
            </Link>
            {competitor.priceIsEstimated && (
              <p
                style={{
                  marginTop: 14,
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 12,
                  color: "#9CA3AF",
                  fontStyle: "italic",
                  maxWidth: 640,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                * Precio estimado para el plan con API en base a planes
                equivalentes regionales del segmento. {competitor.name} no
                publica precios públicos en su sitio — para tarifa exacta
                consultar directamente al proveedor.
              </p>
            )}
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 900px) {
            :global(.mig-banner-grid) {
              grid-template-columns: 1fr !important;
              gap: 14px !important;
            }
            :global(.mig-banner-arrow) {
              transform: rotate(90deg);
              padding: 4px 0;
            }
          }
        `}</style>
      </div>
    </section>
  );
}

function ToolRow({
  ico,
  name,
  sub,
  price,
  sourceHref,
  sourceLabel,
}: {
  ico: string;
  name: string;
  sub: string;
  price: string;
  sourceHref?: string;
  sourceLabel?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#fff",
        border: "1px dashed #FCA5A5",
        borderRadius: 12,
        padding: "10px 14px",
      }}
    >
      <span
        style={{
          flex: "0 0 28px",
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "#FEE2E2",
          color: "#B91C1C",
          fontWeight: 700,
          fontSize: 13,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {ico}
      </span>
      <span
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "#0A0A0A",
            lineHeight: 1.25,
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 12,
            fontStyle: "italic",
            color: "#6B7280",
          }}
        >
          {sub}
        </span>
      </span>
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 2,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 14,
            fontWeight: 700,
            color: "#B91C1C",
            letterSpacing: "-0.01em",
          }}
        >
          {price}
        </span>
        {sourceHref && (
          <a
            href={sourceHref}
            target="_blank"
            rel="noopener nofollow"
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 10.5,
              color: "#6B7280",
              textDecoration: "underline",
              textDecorationColor: "#FCA5A5",
              textUnderlineOffset: 2,
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              whiteSpace: "nowrap",
            }}
          >
            {sourceLabel ?? "ver fuente"}{" "}
            <span aria-hidden style={{ fontSize: 9 }}>
              ↗
            </span>
          </a>
        )}
      </span>
    </div>
  );
}
