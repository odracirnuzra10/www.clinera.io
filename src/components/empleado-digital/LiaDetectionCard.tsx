/**
 * Micro-card flotante para la sección LIA.
 * Simula una alerta operacional: hueco detectado + mejor candidato.
 * Estilo dashboard mínimo, no WhatsApp.
 */
export default function LiaDetectionCard() {
  return (
    <div
      role="img"
      aria-label="Alerta operacional: hueco detectado, mejor candidato Pedro Soto"
      style={{
        width: 260,
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 14,
        padding: "12px 14px",
        boxShadow:
          "0 18px 40px -16px rgba(10,10,10,0.18), 0 4px 10px -4px rgba(124,58,237,0.08)",
        fontFamily: "var(--font-main)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Header row: LIA badge + status + time */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          aria-hidden
          style={{
            padding: "3px 8px",
            borderRadius: 999,
            background:
              "linear-gradient(135deg, #009FE3 0%, #7C3AED 50%, #C850C0 100%)",
            color: "#fff",
            fontFamily: "var(--font-mono)",
            fontSize: 9.5,
            fontWeight: 600,
            letterSpacing: "0.1em",
            flexShrink: 0,
          }}
        >
          LIA
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "#3D4250",
            textTransform: "uppercase",
            flex: 1,
            minWidth: 0,
          }}
        >
          Operación · alerta
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "#9CA3AF",
            flexShrink: 0,
          }}
        >
          14:30
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: "var(--font-main)",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color: "#111318",
          lineHeight: 1.3,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7C3AED"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          style={{ flexShrink: 0 }}
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Hueco detectado
      </div>

      {/* Body */}
      <div
        style={{
          fontFamily: "var(--font-main)",
          fontSize: 12.5,
          color: "#3D4250",
          lineHeight: 1.45,
        }}
      >
        Posible mejor candidato:{" "}
        <strong style={{ color: "#111318" }}>Pedro Soto</strong>.
      </div>
    </div>
  );
}
