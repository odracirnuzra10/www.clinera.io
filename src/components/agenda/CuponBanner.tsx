"use client";

// Aviso del cupón CUKI (Ricardo, 18-oct-2026): /planes y /clinica-estetica.
// El código lo escribe la clínica en Stripe («Añadir código de promoción»):
// el Payment Link no lo precarga. Vence al día siguiente de la primera visita.

import { useSyncExternalStore } from "react";
import Link from "next/link";
import CuponTicket from "./CuponTicket";
import { textoVence, useVenceCupon } from "./useCupon";

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
    <CuponTicket style={style}>
      <span>
        <strong>50% de descuento el primer mes</strong> en cualquier plan. Pégalo en «Añadir código de promoción» al pagar.
        {vence && (
          <span data-cupon-vence={vence} style={{ display: "block", fontWeight: 700 }}>
            Válido {textoVence(vence)}.
          </span>
        )}
        {href && (
          <Link
            href={href.includes("?") ? href : `${href}${search}`}
            data-cupon-cta
            style={{ display: "inline-block", marginTop: 6, color: "#fff", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3 }}
          >
            {ctaLabel} →
          </Link>
        )}
      </span>
    </CuponTicket>
  );
}
