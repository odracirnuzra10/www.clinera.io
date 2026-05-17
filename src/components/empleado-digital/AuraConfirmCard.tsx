/**
 * Micro-card flotante para la sección AURA.
 * Simula una notificación de WhatsApp: cita confirmada.
 * Estilo mínimo, sin replicar todo el UI de WhatsApp.
 */
export default function AuraConfirmCard() {
  return (
    <div
      role="img"
      aria-label="Notificación de WhatsApp: cita agendada con Dr. Ricardo"
      style={{
        width: 248,
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 14,
        padding: "12px 14px",
        boxShadow:
          "0 18px 40px -16px rgba(10,10,10,0.18), 0 4px 10px -4px rgba(10,10,10,0.06)",
        fontFamily: "var(--font-main)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {/* Header row: WhatsApp icon + sender + time */}
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
            width: 22,
            height: 22,
            borderRadius: 6,
            background: "#25D366",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
          </svg>
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: "#3D4250",
            textTransform: "uppercase",
            flex: 1,
            minWidth: 0,
          }}
        >
          WhatsApp · Clínica
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "#9CA3AF",
            flexShrink: 0,
          }}
        >
          ahora
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
          stroke="#10B981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          style={{ flexShrink: 0 }}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Cita confirmada
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
        Tu cita ha sido agendada con{" "}
        <strong style={{ color: "#111318" }}>Dr. Ricardo</strong>.
      </div>
    </div>
  );
}
