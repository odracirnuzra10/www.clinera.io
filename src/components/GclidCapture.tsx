"use client";

import { useEffect } from "react";
import { captureGclid, withStripeAttribution } from "@/lib/gclid";

// Componente invisible montado en layout.tsx. Hace dos cosas:
//
// 1. captureGclid() en el primer pageview de la sesión — guarda gclid /
//    gbraid / wbraid en cookie (.clinera.io, 90d) + localStorage.
//
// 2. Interceptor global de clicks sobre Payment Links de Stripe
//    (buy.stripe.com/*). Antes de que el navegador siga el link, le añade
//    ?client_reference_id=<gclid> para que la Checkout Session resultante
//    quede atribuida. El workflow n8n SUSCRIPCION lo lee del webhook
//    customer.subscription.created → data.object.client_reference_id.
//
// El interceptor usa la fase de captura para correr antes de cualquier
// otro listener (incluyendo handlers de tracking). Sólo muta el href y
// deja que el click continúe normal — no hace preventDefault.
export default function GclidCapture() {
  useEffect(() => {
    captureGclid();

    function onClick(ev: MouseEvent) {
      const target = ev.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor || !anchor.href) return;
      if (!anchor.href.includes("buy.stripe.com")) return;
      try {
        anchor.href = withStripeAttribution(anchor.href);
      } catch {
        // si algo falla con la URL, dejamos el href original.
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, {
        capture: true,
      } as AddEventListenerOptions);
    };
  }, []);

  return null;
}
