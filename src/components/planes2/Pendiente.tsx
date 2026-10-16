import type { ReactNode } from "react";

const RE = /(\[PENDIENTE:[^\]]*\])/g;

/**
 * Imprime un texto resaltando los marcadores `[PENDIENTE: …]`, para que en la
 * revisión interna se vea qué falta. Si el texto no trae marcadores, sale igual.
 */
export default function Pendiente({ children }: { children: string }): ReactNode {
  return (
    <>
      {children.split(RE).map((part, i) =>
        part.startsWith("[PENDIENTE:") ? (
          <mark
            key={i}
            data-pendiente
            style={{
              background: "#FEF3C7",
              color: "#92400E",
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: "0.85em",
              padding: "1px 6px",
              borderRadius: 6,
              letterSpacing: "0.01em",
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
