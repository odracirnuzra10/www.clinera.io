import { CnnLogo } from "@/components/brand-v3/Brand";
import { ChannelLogo } from "@/components/pricing/PlanChannelLogos";
import { ACTIVA_DEMO_IA as D, ACTIVA_RESPALDO } from "@/content/activa";

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const CICLO = 14; // segundos por vuelta
// Instante (en % del ciclo) en que entra cada pieza: mensaje de la paciente, respuesta de la IA, cita y etiqueta.
const ENTRA = [8, 24, 46, 60] as const;

/** Un keyframe por pieza: invisible → aparece → se queda → se apaga al final de la vuelta. */
const KEYFRAMES = ENTRA.map(
  (t, i) =>
    `@keyframes dia-e${i}{0%,${t}%{opacity:0;transform:translateY(8px) scale(.97)}${t + 4}%{opacity:1;transform:none}90%{opacity:1;transform:none}96%,100%{opacity:0;transform:none}}`,
).join("");

const pieza = (i: number) => ({ opacity: 0, animation: `dia-e${i} ${CICLO}s ease-out infinite` });

/**
 * Animación compacta (sin JavaScript) para el wizard de /go: la paciente escribe por WhatsApp, la IA
 * agenda y la cita aparece con la etiqueta «Agendado por IA». Debajo, «Respaldado por». Cabe en el alto
 * que ocupaba la imagen del video de CNN para que el wizard siga sin scroll. Con «reducir movimiento»
 * queda todo visible y quieto.
 */
export function DemoIACompact() {
  const c = D.cita;
  return (
    <div data-activa-demo-ia>
      <style>{`
        ${KEYFRAMES}
        .dia { display: grid; grid-template-columns: 1.15fr 1fr; gap: 8px; align-items: stretch; }
        .dia-fig { padding-bottom: 8px; }
        @media (max-height: 800px) {
          .dia { padding: 6px !important; gap: 6px !important; }
          .dia-head, .dia-estado { display: none !important; }
          .dia-resp { margin-top: 5px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dia [style*="dia-e"] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
      <div className="dia" style={{ border: "1px solid #E5E7EB", borderRadius: 14, padding: 8, background: "#FAFAFA" }}>
        <div style={{ background: "#ECE5DD", borderRadius: 10, padding: 7, display: "grid", gap: 5, alignContent: "start" }}>
          <div className="dia-head" style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Inter", fontSize: 10.5, fontWeight: 700, color: "#075E54" }}>
            <ChannelLogo channel="whatsapp" size={14} /> {D.chatNombre}
          </div>
          <div style={{ ...pieza(0), justifySelf: "end", maxWidth: "92%", background: "#DCF8C6", borderRadius: 8, padding: "5px 8px", fontFamily: "Inter", fontSize: 11.5, color: "#111827" }}>
            {D.compacto.paciente}
          </div>
          <div style={{ ...pieza(1), justifySelf: "start", maxWidth: "92%", background: "#fff", borderRadius: 8, padding: "5px 8px", fontFamily: "Inter", fontSize: 11.5, color: "#111827" }}>
            {D.compacto.ia}
          </div>
        </div>
        <div style={{ ...pieza(2), background: "#fff", borderRadius: 10, padding: 9, border: "1px solid #E5E7EB", display: "grid", alignContent: "center", gap: 5 }}>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontFamily: "Inter", fontSize: 12, fontWeight: 700, background: "#F3F4F6", borderRadius: 6, padding: "3px 7px" }}>🕒 {c.hora}</span>
            <span className="dia-estado" style={{ fontFamily: "Inter", fontSize: 10.5, fontWeight: 700, background: "#ECFDF5", color: "#047857", borderRadius: 999, padding: "3px 8px" }}>{c.estado}</span>
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 700, color: "#3B5BDB" }}>{c.paciente}</div>
          <span
            data-activa-etiqueta-ia
            style={{ ...pieza(3), justifySelf: "start", fontFamily: "Inter", fontSize: 11, fontWeight: 700, background: "#1F2937", color: "#fff", borderRadius: 6, padding: "3px 8px" }}
          >
            ⚡ {c.etiqueta}
          </span>
        </div>
      </div>
      <div className="dia-resp" data-activa-respaldo style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
        <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B7280" }}>{ACTIVA_RESPALDO.etiqueta}</span>
        <CnnLogo height={17} color="#F03A47" />
        <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 16, fontWeight: 700, color: "#111827" }}>Forbes</span>
        <span style={{ fontFamily: "Inter", fontSize: 12.5, fontWeight: 700, letterSpacing: "-0.02em", color: "#0B4F8A" }}>Clínica Alemana</span>
      </div>
    </div>
  );
}
