"use client";

// Los dos únicos CTA del sitio (Ricardo, 4-nov-2026):
// · Principal «Contratar Hex · US$ 35/mes» → Payment Link de Hex, en degradado.
// · Secundario «Hablar con ventas» → /agenda, blanco con borde.
// Reemplazan «Prueba gratis», «Ver demo», «Agendar reunión» y demás en home, landings, menú y pie.
//
// El link de Stripe va pelado: sin onClick y con data-plan*, para que Analytics.tsx cuente el
// InitiateCheckout y le ponga el client_reference_id al hacer clic (AGENTS.md, «El clic a
// buy.stripe.com»). Lleva los utm de la visita. El secundario conserva la query de la visita:
// clasificarLeadSource() la lee en /agenda.

import { useSyncExternalStore, type CSSProperties } from "react";
import { GRAD } from "@/components/brand-v3/Brand";
import { CTA_VENTAS_LABEL, agendaHref } from "@/content/planes";
import { HEX_PAGO_URL, PLANES_NUEVOS, conUtm } from "@/content/planes-nuevos";

const HEX = PLANES_NUEVOS.find((p) => p.id === "hex")!;
export const CTA_HEX_LABEL = `Contratar Hex · US$ ${HEX.monthlyUsd}/mes`;
export const CTA_HEX_CORTO = "Contratar Hex";

const noop = () => () => {};
const leerSearch = () => window.location.search;
const leerSearchServidor = () => "";

/** La query de la visita, leída en el navegador (en el servidor, vacía). */
export function useSearch(): string {
  return useSyncExternalStore(noop, leerSearch, leerSearchServidor);
}

export function hexHref(search: string): string {
  return conUtm(HEX.pagoUrl ?? HEX_PAGO_URL, search);
}

/** /agenda con la query de la visita y, si viene, un parámetro extra (p. ej. lead_source). */
export function ventasHref(search: string, extra?: Record<string, string>): string {
  const q = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  for (const [k, v] of Object.entries(extra ?? {})) q.set(k, v);
  return agendaHref(null, q.toString());
}

type Tam = "md" | "sm";

export function estiloPrincipal(tam: Tam = "md"): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: tam === "sm" ? 44 : 50,
    padding: tam === "sm" ? "10px 16px" : "13px 22px",
    borderRadius: 999,
    background: GRAD,
    color: "#fff",
    fontFamily: "Inter, system-ui, sans-serif",
    fontWeight: 700,
    fontSize: tam === "sm" ? 14 : 16,
    textDecoration: "none",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  };
}

export function estiloSecundario(tam: Tam = "md", oscuro = false): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: tam === "sm" ? 44 : 50,
    padding: tam === "sm" ? "10px 16px" : "13px 22px",
    borderRadius: 999,
    background: oscuro ? "transparent" : "#fff",
    color: oscuro ? "#fff" : "#0A0A0A",
    border: oscuro ? "1.5px solid rgba(255,255,255,.55)" : "1.5px solid #D1D5DB",
    fontFamily: "Inter, system-ui, sans-serif",
    fontWeight: 600,
    fontSize: tam === "sm" ? 14 : 16,
    textDecoration: "none",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  };
}

/** Botón principal: Payment Link de Hex. */
export function CtaHex({
  tam = "md",
  corto = false,
  style,
  className,
  datos,
}: {
  tam?: Tam;
  corto?: boolean;
  style?: CSSProperties;
  className?: string;
  /** Atributos data-* extra (p. ej. los que leen las pruebas). */
  datos?: Record<string, string>;
}) {
  const search = useSearch();
  return (
    <a
      {...datos}
      href={hexHref(search)}
      suppressHydrationWarning
      data-cta-hex
      data-plan={HEX.id}
      data-plan-name={HEX.name}
      data-plan-value={HEX.monthlyUsd}
      className={className}
      style={{ ...estiloPrincipal(tam), ...style }}
    >
      {corto ? CTA_HEX_CORTO : CTA_HEX_LABEL}
    </a>
  );
}

/** Botón secundario: «Hablar con ventas» → /agenda. */
export function CtaVentas({
  tam = "md",
  oscuro = false,
  extra,
  style,
  className,
  datos,
}: {
  tam?: Tam;
  oscuro?: boolean;
  extra?: Record<string, string>;
  style?: CSSProperties;
  className?: string;
  datos?: Record<string, string>;
}) {
  const search = useSearch();
  return (
    <a {...datos} href={ventasHref(search, extra)} suppressHydrationWarning data-cta-ventas className={className} style={{ ...estiloSecundario(tam, oscuro), ...style }}>
      {CTA_VENTAS_LABEL}
    </a>
  );
}

/** El par: principal + secundario. */
export default function CtaPar({
  tam = "md",
  oscuro = false,
  centrado = false,
  apilado = false,
  extra,
  style,
}: {
  tam?: Tam;
  oscuro?: boolean;
  centrado?: boolean;
  apilado?: boolean;
  extra?: Record<string, string>;
  style?: CSSProperties;
}) {
  return (
    <div
      data-cta-par
      style={{
        display: "flex",
        flexDirection: apilado ? "column" : "row",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: centrado ? "center" : "flex-start",
        alignItems: apilado ? "stretch" : "center",
        ...style,
      }}
    >
      <CtaHex tam={tam} />
      <CtaVentas tam={tam} oscuro={oscuro} extra={extra} />
    </div>
  );
}
