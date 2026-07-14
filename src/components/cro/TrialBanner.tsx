import Link from "next/link";

type Props = {
  variant?: "light" | "dark";
};

export default function TrialBanner({ variant = "light" }: Props) {
  const dark = variant === "dark";
  return (
    <section
      aria-label="Implementación de Clinera: pago único"
      style={{
        padding: "32px 24px",
        background: dark ? "#0A0A0A" : "#FAF8FF",
        borderTop: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #EDE9FE",
        borderBottom: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #EDE9FE",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 280 }}>
          <span
            aria-hidden
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              background: "linear-gradient(135deg, #7C3AED 0%, #D946EF 100%)",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 18,
              boxShadow: "0 8px 24px -8px rgba(124,58,237,0.55)",
              flexShrink: 0,
            }}
          >
            ✓
          </span>
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: "Inter, system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 17,
                color: dark ? "#fff" : "#0A0A0A",
                letterSpacing: "-0.01em",
              }}
            >
              Implementación USD 450 (pago único)
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 14,
                color: dark ? "rgba(255,255,255,0.72)" : "#4B5563",
              }}
            >
              Onboarding asistido por un humano: configura AURA, conecta tu WhatsApp e importa tu base. Quedas operando el mismo día.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href="/planes"
            data-plan="vortex"
            data-plan-name="Vortex signup"
            data-plan-value="279"
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #D946EF 100%)",
              color: "#fff",
              padding: "12px 22px",
              borderRadius: 10,
              fontWeight: 600,
              textDecoration: "none",
              fontSize: 14.5,
              boxShadow: "0 10px 26px -8px rgba(124,58,237,0.45)",
            }}
          >
            Activar Vortex $279 →
          </Link>
          <Link
            href="/hablar-con-ventas"
            style={{
              background: dark ? "rgba(255,255,255,0.08)" : "#fff",
              color: dark ? "#fff" : "#0A0A0A",
              border: dark
                ? "1px solid rgba(255,255,255,0.18)"
                : "1px solid #E5E7EB",
              padding: "12px 22px",
              borderRadius: 10,
              fontWeight: 600,
              textDecoration: "none",
              fontSize: 14.5,
            }}
          >
            Hablar con ventas
          </Link>
        </div>
      </div>
    </section>
  );
}
