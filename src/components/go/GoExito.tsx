"use client";

import { useEffect } from "react";
import { GRAD } from "@/components/brand-v3/Brand";
import { GO_ACTIVACION_PASOS, GO_ANALYTICS, SOPORTE_WHATSAPP, SOPORTE_WHATSAPP_URL } from "@/content/planes2";
import { trialEventId } from "@/lib/meta-purchase-id";
import { trackPixel } from "@/lib/tracking";

const SS_KEY = "cl_go_trial_sent";

/**
 * Página de éxito de Stripe Checkout de Go!. Regla de Ricardo (17-oct): quien paga Go!
 * es un `TRIAL` de USD 17, NO un `Purchase` ni un `SQL`. `CLIENTE` es para Flux y Ultra
 * y lo manda solo el servidor. Se dispara una sola vez por pestaña: recargar la página
 * no debe duplicar la conversión.
 *
 * Si Stripe manda `?session_id=`, `trialEventId()` es el `eventID`: coincide con el
 * `event_id` del TRIAL por servidor de `/api/stripe/meta-purchase`, así Meta lo cuenta
 * una sola vez. No se empuja nada al dataLayer: la etiqueta de Meta de GTM reenvía
 * todo evento y duplicaría el TRIAL con otro `event_id`.
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
    const eventId = sid ? trialEventId(sid) : `trial_${Date.now()}`;
    trackPixel(
      "TRIAL",
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
    <section style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "48px 16px", background: "#fff" }}>
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Inter", fontSize: "clamp(30px, 8vw, 40px)", fontWeight: 800, letterSpacing: "-0.035em", color: "#0A0A0A", margin: "0 0 12px" }}>
          Pago recibido.{" "}
          <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            Activa tu WhatsApp.
          </span>
        </h1>
        <p style={{ fontFamily: "Inter", fontSize: 17, color: "#4B5563", lineHeight: 1.55, margin: "0 0 24px" }}>
          Escríbele a soporte y dejamos andando el WhatsApp de tu clínica.
        </p>
        <a
          href={SOPORTE_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-go-activar
          style={{
            display: "block",
            padding: "18px 24px",
            borderRadius: 14,
            background: GRAD,
            color: "#fff",
            fontFamily: "Inter",
            fontSize: 18,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Activar mi WhatsApp
        </a>
        <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 12, letterSpacing: "0.06em", color: "#6B7280", margin: "12px 0 28px" }}>
          SOPORTE · {SOPORTE_WHATSAPP.display}
        </p>
        <ol style={{ textAlign: "left", fontFamily: "Inter", fontSize: 15, color: "#374151", lineHeight: 1.6, paddingLeft: 20, margin: 0 }}>
          {GO_ACTIVACION_PASOS.map((p) => (
            <li key={p} style={{ marginBottom: 6 }}>
              {p}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
