import { SETUP_FEE_AMOUNT, SETUP_FEE_COPY, SETUP_FEE_TITLE } from "@/content/pricing";

const GRAD = "linear-gradient(90deg, #009FE3 0%, #7C3AED 55%, #D946EF 100%)";

/**
 * Banda de costo de configuración inicial. Va justo arriba de la grilla de planes
 * (debajo del toggle de facturación): es lo primero que hay que saber antes de
 * comparar precios. Negra para que destaque, pero en una sola franja delgada
 * para no pesar más que las tarjetas.
 *
 * `className` permite sumar la clase `reveal` en las páginas que corren useReveal();
 * en las que no (por ejemplo /plataforma) se omite y la banda se ve directo.
 */
export default function SetupFeeBand({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={["setup-fee-band", className].filter(Boolean).join(" ")}
      style={{
        background: "linear-gradient(135deg, #0E1014 0%, #1F1B2E 100%)",
        borderRadius: 14,
        padding: "16px 22px",
        position: "relative",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 24,
        alignItems: "center",
        boxShadow: "0 14px 32px -16px rgba(124,58,237,.45)",
        ...style,
      }}
    >
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: GRAD }} />
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 9.5,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#E9D5FF",
              background: "rgba(124,58,237,.18)",
              border: "1px solid rgba(124,58,237,.40)",
              borderRadius: 999,
              padding: "3px 9px",
              whiteSpace: "nowrap",
            }}
          >
            Pago único
          </span>
          <strong style={{ fontFamily: "Inter", fontSize: 15.5, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
            {SETUP_FEE_TITLE}
          </strong>
        </div>
        <p style={{ margin: "6px 0 0", fontFamily: "Inter", fontSize: 13.5, color: "rgba(255,255,255,.72)", lineHeight: 1.5, maxWidth: 640 }}>
          {SETUP_FEE_COPY}
        </p>
      </div>
      <div className="setup-fee-band-right" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, whiteSpace: "nowrap" }}>
          <span
            style={{
              fontFamily: "Inter",
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: "#fff",
            }}
          >
            {SETUP_FEE_AMOUNT}
          </span>
          <span style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(255,255,255,.55)" }}>USD</span>
        </div>
        <small style={{ color: "rgba(255,255,255,.60)", fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 9.5, letterSpacing: ".04em", textAlign: "right" }}>
          Mensual · gratis en semestral y anual
        </small>
      </div>
      <style>{`
        @media (max-width: 720px) {
          .setup-fee-band { grid-template-columns: 1fr !important; gap: 10px !important; padding: 16px 18px !important; }
          /* En móvil el monto sube al tope y comparte fila con su nota: es el dato
             que se busca, y así la banda no obliga a leer el párrafo para llegar a él. */
          .setup-fee-band .setup-fee-band-right {
            order: -1 !important;
            flex-direction: row !important;
            align-items: baseline !important;
            flex-wrap: wrap !important;
            gap: 4px 10px !important;
          }
          .setup-fee-band .setup-fee-band-right small { text-align: left !important; }
        }
      `}</style>
    </div>
  );
}
