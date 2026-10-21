"use client";

// Barra fija de /promo. Se pinta solo en el cliente: la fecha depende del día en que
// se abre la página (la reunión), y un HTML generado en el build quedaría congelado.

import { useSyncExternalStore } from "react";
import { GRAD } from "@/components/brand-v3/Brand";
import { promoRango } from "@/components/promo/promo-rango";

const noop = () => () => {};
const leerTexto = () => promoRango(new Date()).texto;
const textoServidor = () => "";

export default function PromoBar() {
  const texto = useSyncExternalStore(noop, leerTexto, textoServidor);
  if (!texto) return null;
  return (
    <div
      role="status"
      data-promo-bar
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 60,
        background: GRAD,
        color: "#fff",
        padding: "14px 16px calc(14px + env(safe-area-inset-bottom))",
        textAlign: "center",
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
        fontWeight: 800,
        fontSize: "clamp(14px, 1.6vw, 18px)",
        letterSpacing: "-0.01em",
        lineHeight: 1.35,
        boxShadow: "0 -12px 30px -18px rgba(124, 58, 237, .7)",
      }}
    >
      <span aria-hidden="true">⏳ </span>
      {texto}
    </div>
  );
}
