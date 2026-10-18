// Ícono de las funciones destacadas de los planes (`destacadoDe` en planes.ts):
// el agente IA (destello) y el onboarding humano dedicado (persona). Va sobre el
// degradado de marca para que resalte entre los ticks normales.

const GRAD = "linear-gradient(135deg, #3B82F6 0%, #7C3AED 50%, #D946EF 100%)";

export function IconoDestacado({ tipo, size = 20 }: { tipo: "ia" | "onboarding"; size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        flex: `0 0 ${size}px`,
        width: size,
        height: size,
        borderRadius: 6,
        background: GRAD,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        boxShadow: "0 4px 12px -4px rgba(124,58,237,.6)",
      }}
    >
      {tipo === "ia" ? (
        <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9z" />
          <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" />
        </svg>
      ) : (
        <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6" />
        </svg>
      )}
    </span>
  );
}
