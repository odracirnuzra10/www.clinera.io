"use client";

// Aviso del cupón CUKI (Ricardo, 18-oct-2026): /planes y /clinica-estetica.
// El código lo escribe la clínica en Stripe («Añadir código de promoción»):
// el Payment Link no lo precarga. Vence al día siguiente de la primera visita.

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { CUPON } from "@/content/agenda-oferta";
import { textoVence, useVenceCupon } from "./useCupon";

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const noop = () => () => {};
const readSearch = () => window.location.search;
const readSearchServer = () => "";

export default function CuponBanner({
  href,
  ctaLabel = "Ver planes",
  style,
}: {
  /** Si viene, agrega un enlace (p. ej. a /planes) con la query de la visita: sin ella el lead del anuncio pierde el origen. */
  href?: string;
  ctaLabel?: string;
  style?: React.CSSProperties;
}) {
  const vence = useVenceCupon();
  const search = useSyncExternalStore(noop, readSearch, readSearchServer);
  return (
    <div
      data-cupon={CUPON.codigo}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "8px 16px",
        padding: "16px 22px",
        border: "2px dashed #7C3AED",
        borderRadius: 16,
        background: "#FAF5FF",
        textAlign: "center",
        ...style,
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, letterSpacing: "0.08em", color: "#5B21B6" }}>{CUPON.codigo}</span>
      <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 15, color: "#111827", lineHeight: 1.45 }}>
        <strong>{CUPON.descuentoPct}% de descuento el primer mes</strong> en cualquier plan. Escríbelo en «Añadir código de promoción» al pagar.
        {vence && (
          <span data-cupon-vence={vence} style={{ display: "block", fontWeight: 700, color: "#B91C1C" }}>
            Válido {textoVence(vence)}.
          </span>
        )}
      </span>
      {href && (
        <Link
          href={href.includes("?") ? href : `${href}${search}`}
          data-cupon-cta
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 14.5,
            fontWeight: 700,
            color: "#fff",
            background: "#0A0A0A",
            borderRadius: 10,
            padding: "10px 16px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {ctaLabel} →
        </Link>
      )}
    </div>
  );
}
