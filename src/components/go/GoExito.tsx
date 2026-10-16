"use client";

import { useEffect } from "react";
import { GRAD } from "@/components/brand-v3/Brand";
import Pendiente from "@/components/planes2/Pendiente";
import { GO_ANALYTICS, REGISTRO_URL_PENDIENTE } from "@/content/planes2";
import { readGoAttribution } from "@/lib/go-attribution";
import { track, trackPixel } from "@/lib/tracking";

const SS_KEY = "cl_go_purchase_sent";

/**
 * Página de éxito de Stripe Checkout de Go!. Dispara `Purchase` (US$ 17) una
 * sola vez por pestaña: recargar la página no debe duplicar la conversión.
 * Si Stripe manda `?session_id=`, ese id es el `eventID` (deduplica con CAPI).
 */
export default function GoExito() {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SS_KEY)) return;
      window.sessionStorage.setItem(SS_KEY, "1");
    } catch {
      // Sin sessionStorage el evento puede repetirse al recargar; es lo menos malo.
    }
    const sid = new URLSearchParams(window.location.search).get("session_id");
    const eventId = sid ? `go_${sid}` : `go_${Date.now()}`;
    track("purchase", {
      lead_source: GO_ANALYTICS.leadSource,
      plan: "go",
      content_name: GO_ANALYTICS.contentName,
      value: GO_ANALYTICS.valueUsd,
      currency: GO_ANALYTICS.currency,
      transaction_id: eventId,
      ...readGoAttribution(),
      page_path: "/go/exito",
    });
    trackPixel(
      "Purchase",
      {
        content_name: GO_ANALYTICS.contentName,
        content_ids: [GO_ANALYTICS.contentId],
        content_type: "product",
        value: GO_ANALYTICS.valueUsd,
        currency: GO_ANALYTICS.currency,
      },
      eventId,
    );
  }, []);

  return (
    <section style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "64px 16px", background: "#fff" }}>
      <div style={{ maxWidth: 560, textAlign: "center" }}>
        <h1 style={{ fontFamily: "Inter", fontSize: 40, fontWeight: 800, letterSpacing: "-0.035em", color: "#0A0A0A", margin: "0 0 12px" }}>
          Pago recibido.{" "}
          <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            Crea tu cuenta.
          </span>
        </h1>
        <p style={{ fontFamily: "Inter", fontSize: 17, color: "#4B5563", lineHeight: 1.55, margin: "0 0 20px" }}>
          Usa el mismo correo del pago para crear tu cuenta en Clinera y conecta tu WhatsApp.
        </p>
        <p style={{ fontFamily: "Inter", fontSize: 13 }}>
          <Pendiente>{REGISTRO_URL_PENDIENTE}</Pendiente>
        </p>
      </div>
    </section>
  );
}
