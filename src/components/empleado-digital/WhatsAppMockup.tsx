type Message =
  | { who: "patient"; text: string; t: string }
  | { who: "aura"; text: string; t: string }
  | { who: "system"; text: string };

const MESSAGES: Message[] = [
  { who: "patient", text: "Hola, quiero agendar limpieza facial", t: "14:32" },
  { who: "aura", text: "¡Hola! Tengo cupo mañana 10:30 o jueves 16:00. ¿Cuál te acomoda?", t: "14:32" },
  { who: "patient", text: "Jueves 16:00", t: "14:33" },
  { who: "aura", text: "Listo. Confirmada jueves 16:00 con Dra. Pérez. Te envío recordatorio el miércoles.", t: "14:33" },
  { who: "system", text: "LIA detectó cupo libre el lunes 11:00 → AURA contactando a 3 pacientes en lista de espera" },
  { who: "patient", text: "Hola, tomo el lunes 11:00", t: "14:51" },
];

const GRAD = "linear-gradient(135deg, #009FE3 0%, #7C3AED 50%, #C850C0 100%)";

export default function WhatsAppMockup() {
  return (
    <div
      aria-label="Ejemplo de conversación de WhatsApp con AURA y LIA"
      style={{
        width: "100%",
        maxWidth: 420,
        background: "#FFFFFF",
        borderRadius: 18,
        border: "1px solid var(--border-sterile)",
        boxShadow: "var(--shadow-glass), 0 24px 60px -24px rgba(10,10,10,0.18)",
        overflow: "hidden",
        fontFamily: "var(--font-main)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          background: "#075E54",
          color: "#fff",
        }}
      >
        <div
          aria-hidden
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: GRAD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-main)",
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: "-0.02em",
            flexShrink: 0,
          }}
        >
          A
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
            Clínica · WhatsApp Business
          </div>
          <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "#34D399",
                display: "inline-block",
              }}
            />
            en línea · IA activa
          </div>
        </div>
      </div>

      {/* Chat body */}
      <div
        style={{
          padding: "20px 14px 18px",
          background: "#ECE5DD",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          minHeight: 360,
        }}
      >
        {MESSAGES.map((m, i) => {
          if (m.who === "system") {
            return (
              <div
                key={i}
                style={{
                  alignSelf: "center",
                  maxWidth: "92%",
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(124,58,237,0.18)",
                  borderRadius: 12,
                  padding: "10px 12px 10px 10px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontStyle: "italic",
                  fontSize: 12,
                  color: "#3D4250",
                  lineHeight: 1.45,
                  margin: "4px 0",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    fontStyle: "normal",
                    background: GRAD,
                    color: "#fff",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9.5,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    padding: "3px 7px",
                    borderRadius: 999,
                    flexShrink: 0,
                  }}
                >
                  LIA
                </span>
                <span>{m.text}</span>
              </div>
            );
          }

          const isPatient = m.who === "patient";
          return (
            <div
              key={i}
              style={{
                alignSelf: isPatient ? "flex-start" : "flex-end",
                maxWidth: "82%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {!isPatient && (
                <span
                  style={{
                    alignSelf: "flex-end",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9.5,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    color: "#7C3AED",
                    marginBottom: 2,
                  }}
                >
                  AURA
                </span>
              )}
              <div
                style={{
                  background: isPatient ? "#FFFFFF" : "#DCF8C6",
                  color: "#0A0A0A",
                  fontSize: 13.5,
                  lineHeight: 1.45,
                  padding: "8px 10px 6px",
                  borderRadius: 10,
                  borderTopLeftRadius: isPatient ? 4 : 10,
                  borderTopRightRadius: isPatient ? 10 : 4,
                  boxShadow: "0 1px 1px rgba(0,0,0,0.08)",
                  position: "relative",
                }}
              >
                <div>{m.text}</div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9.5,
                    color: "rgba(0,0,0,0.45)",
                    textAlign: "right",
                    marginTop: 4,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    float: "right",
                  }}
                >
                  {m.t}
                  {!isPatient && (
                    <svg
                      width="14"
                      height="10"
                      viewBox="0 0 16 11"
                      fill="none"
                      aria-hidden
                      style={{ color: "#34B7F1" }}
                    >
                      <path
                        d="M11.071.653a.5.5 0 0 1 .063.704l-6 7a.5.5 0 0 1-.74.034l-3-3a.5.5 0 1 1 .708-.708L4.696 7.37l5.671-6.617a.5.5 0 0 1 .704-.1Z"
                        fill="currentColor"
                      />
                      <path
                        d="M15.071.653a.5.5 0 0 1 .063.704l-6 7a.5.5 0 0 1-.74.034l-.86-.86.74-.864.474.474L14.367.753a.5.5 0 0 1 .704-.1Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </div>
                <div style={{ clear: "both" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
