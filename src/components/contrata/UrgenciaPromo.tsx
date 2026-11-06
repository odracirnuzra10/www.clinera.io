"use client";

import { useSyncExternalStore } from "react";
import { textoUrgencia } from "@/lib/urgencia-dias";

const sub = (cb: () => void) => {
  const t = setInterval(cb, 60_000);
  return () => clearInterval(t);
};

/** El servidor pinta vacío: la fecha se arma en el navegador y cambia a medianoche de Chile. */
export default function UrgenciaPromo({ className }: { className?: string }) {
  const texto = useSyncExternalStore(sub, () => textoUrgencia(), () => null);
  return (
    <div className={className} data-urgencia aria-live="polite">
      {texto ? (
        <>
          <b>$14.495 por 30 días.</b> {texto}.
        </>
      ) : (
        "\u00A0"
      )}
    </div>
  );
}
