import { CnnLogo } from "@/components/brand-v3/Brand";
import { ChannelLogo } from "@/components/pricing/PlanChannelLogos";
import { ACTIVA_DEMO_IA as D, ACTIVA_RESPALDO } from "@/content/activa";

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const CICLO = 18; // segundos por vuelta
// Instante (en % del ciclo) en que entra cada pieza: 4 mensajes, la cita y la etiqueta.
const ENTRA = [6, 18, 34, 46, 62, 72] as const;

/** Un keyframe por pieza: invisible → aparece → se queda → se apaga al final de la vuelta. */
const KEYFRAMES = ENTRA.map(
  (t, i) =>
    `@keyframes ac-e${i}{0%,${t}%{opacity:0;transform:translateY(10px) scale(.97)}${t + 3}%{opacity:1;transform:none}90%{opacity:1;transform:none}96%,100%{opacity:0;transform:none}}`,
).join("");

const pieza = (i: number) => ({ animation: `ac-e${i} ${CICLO}s ease-out infinite` });

/** Animación sin JavaScript: se ve igual en servidor y respeta «reducir movimiento» (queda todo visible). */
export default function DemoIA() {
  const c = D.cita;
  return (
    <div data-activa-demo-ia>
      <style>{`
        ${KEYFRAMES}
        .ac-demo { display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; align-items: center; text-align: left; }
        .ac-flecha { color: #7C3AED; font-size: 28px; font-family: Inter; }
        @media (max-width: 900px) {
          .ac-demo { grid-template-columns: 1fr; }
          .ac-flecha { transform: rotate(90deg); justify-self: center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ac-demo [style*="ac-e"] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <div className="ac-demo">
        <div style={{ background: "#ECE5DD", borderRadius: 16, overflow: "hidden", border: "1px solid #E5E7EB", minHeight: 340 }}>
          <div style={{ background: "#075E54", color: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <ChannelLogo channel="whatsapp" size={26} />
            <div>
              <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 14 }}>{D.chatNombre}</div>
              <div style={{ fontFamily: "Inter", fontSize: 11.5, opacity: 0.8 }}>{D.chatEstado}</div>
            </div>
          </div>
          <div style={{ padding: 14, display: "grid", gap: 8 }}>
            {D.mensajes.map((m, i) => {
              const ia = m.de === "ia";
              return (
                <div
                  key={i}
                  style={{
                    ...pieza(i),
                    opacity: 0,
                    justifySelf: ia ? "start" : "end",
                    maxWidth: "86%",
                    background: ia ? "#fff" : "#DCF8C6",
                    borderRadius: 10,
                    padding: "8px 10px",
                    fontFamily: "Inter",
                    fontSize: 14,
                    color: "#111827",
                    boxShadow: "0 1px 1px rgba(0,0,0,.08)",
                  }}
                >
                  {m.t}
                  <span style={{ display: "block", textAlign: "right", fontSize: 10.5, color: "#6B7280", marginTop: 2 }}>{m.hora}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ac-flecha" aria-hidden>→</div>

        <div>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "#6B7280", marginBottom: 8 }}>
            Tu agenda
          </div>
          <div style={{ ...pieza(4), opacity: 0, background: "#fff", borderRadius: 16, padding: 18, border: "1px solid #E5E7EB", boxShadow: "0 12px 32px -12px rgba(124,58,237,.25)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              <span style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, background: "#F3F4F6", borderRadius: 8, padding: "6px 10px" }}>🕒 {c.hora}</span>
              <span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 700, background: "#ECFDF5", color: "#047857", borderRadius: 999, padding: "5px 11px" }}>{c.estado}</span>
              <span
                data-activa-etiqueta-ia
                style={{ ...pieza(5), opacity: 0, fontFamily: "Inter", fontSize: 12.5, fontWeight: 700, background: "#1F2937", color: "#fff", borderRadius: 7, padding: "5px 9px" }}
              >
                ⚡ {c.etiqueta}
              </span>
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 700, color: "#3B5BDB", marginBottom: 6 }}>{c.paciente}</div>
            <div style={{ fontFamily: "Inter", fontSize: 14, color: "#4B5563" }}>
              {c.sede} · {c.servicio}
            </div>
          </div>
        </div>
      </div>

      <p style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", color: "#9CA3AF", margin: "16px 0 0", textAlign: "center" }}>
        {D.ejemplo}
      </p>

      <div data-activa-respaldo style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22, flexWrap: "wrap", marginTop: 28 }}>
        <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B7280" }}>{ACTIVA_RESPALDO.etiqueta}</span>
        <CnnLogo height={28} color="#F03A47" />
        <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em", color: "#111827" }}>Forbes</span>
        <span style={{ fontFamily: "Inter", fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", color: "#0B4F8A" }}>Clínica Alemana</span>
      </div>
    </div>
  );
}
