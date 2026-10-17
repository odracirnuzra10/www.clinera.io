import { CnnLogo } from "@/components/brand-v3/Brand";
import { ChannelLogo } from "@/components/pricing/PlanChannelLogos";
import { ACTIVA_DEMO_IA as D, ACTIVA_RESPALDO } from "@/content/activa";

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const CICLO = 12; // segundos por vuelta (3 escenas de ~4 s)

/** Ventanas de cada escena, en % del ciclo. */
const ESCENA = { s1: [0, 33], s2: [33, 66], s3: [66, 100] } as const;

/** Piezas: instante de entrada (% del ciclo) y escena a la que pertenecen. Cada una se apaga con su escena. */
const PIEZAS = [
  { id: "a1", t: 2, s: "s1" }, // mensaje de la paciente
  { id: "a2", t: 9, s: "s1" }, // respuesta de la IA
  { id: "a3", t: 16, s: "s1" }, // cita en la agenda
  { id: "a4", t: 22, s: "s1" }, // etiqueta «Agendado por IA»
  { id: "r1", t: 35, s: "s2" }, // recordatorio de la clínica
  { id: "r2", t: 42, s: "s2" }, // confirmación de la paciente
  { id: "r3", t: 50, s: "s2" }, // cita confirmada
  { id: "r4", t: 56, s: "s2" }, // etiqueta de recordatorio
  { id: "d1", t: 68, s: "s3" }, // mensaje de difusión
  { id: "d2", t: 74, s: "s3" }, // destinatarios (cada uno con su retraso)
  { id: "d3", t: 90, s: "s3" }, // etiqueta de difusión
] as const;

/** Un keyframe por pieza y uno por escena: invisible → aparece → se queda → se apaga con su escena. */
const KEYFRAMES =
  PIEZAS.map((p) => {
    const fin = ESCENA[p.s][1];
    return `@keyframes dia-${p.id}{0%,${p.t}%{opacity:0;transform:translateY(7px) scale(.97)}${p.t + 3}%{opacity:1;transform:none}${fin - 3}%{opacity:1;transform:none}${fin}%,100%{opacity:0;transform:none}}`;
  }).join("") +
  (Object.keys(ESCENA) as (keyof typeof ESCENA)[])
    .map((k) => {
      const [ini, fin] = ESCENA[k];
      return `@keyframes dia-${k}{0%,${Math.max(ini - 1, 0)}%{opacity:0}${ini + 1}%,${fin - 2}%{opacity:1}${fin}%,100%{opacity:0}}`;
    })
    .join("");

const pieza = (id: string, extra = ""): React.CSSProperties => ({ opacity: 0, animation: `dia-${id} ${CICLO}s ease-out ${extra} infinite` });
const escena = (k: string): React.CSSProperties => ({ opacity: 0, animation: `dia-${k} ${CICLO}s linear infinite` });

const burbuja = (bg: string): React.CSSProperties => ({ background: bg, borderRadius: 8, padding: "5px 8px", fontFamily: "Inter", fontSize: 11.5, color: "#111827", maxWidth: "92%" });
const chip: React.CSSProperties = { fontFamily: "Inter", fontSize: 12, fontWeight: 700, background: "#F3F4F6", borderRadius: 6, padding: "3px 7px" };
const etiquetaOscura: React.CSSProperties = { justifySelf: "start", fontFamily: "Inter", fontSize: 11, fontWeight: 700, background: "#1F2937", color: "#fff", borderRadius: 6, padding: "3px 8px" };
const panelChat: React.CSSProperties = { background: "#ECE5DD", borderRadius: 10, padding: 7, display: "grid", gap: 5, alignContent: "start" };
const panelCita: React.CSSProperties = { background: "#fff", borderRadius: 10, padding: 9, border: "1px solid #E5E7EB", display: "grid", alignContent: "center", gap: 5 };

/**
 * Animación compacta (sin JavaScript) del wizard de /go. Tres escenas que rotan en el mismo espacio:
 * 1) la IA agenda por WhatsApp y la cita queda «Agendado por IA»; 2) recordatorio automático de la cita;
 * 3) difusión masiva por WhatsApp. Cada escena dice desde qué plan existe (Go! no trae ninguna de las tres).
 * Debajo, «Respaldado por». Cabe en el alto de la imagen de CNN que reemplazó, para no sumar scroll.
 * Con «reducir movimiento» queda quieta la primera escena.
 */
export function DemoIACompact() {
  const c = D.cita;
  const e = D.escenas;
  return (
    <div data-activa-demo-ia>
      <style>{`
        ${KEYFRAMES}
        .dia-stage { position: relative; height: 124px; }
        .dia-escena { position: absolute; inset: 0; display: grid; grid-template-columns: 1.15fr 1fr; gap: 8px; align-items: stretch; }
        .dia-lab { position: absolute; top: -9px; right: 12px; z-index: 2; font-family: ${MONO}; font-size: 9px; letter-spacing: .06em; text-transform: uppercase; background: #fff; border: 1px solid #E5E7EB; border-radius: 999px; padding: 2px 8px; color: #6B7280; }
        @media (max-height: 800px) {
          .dia-stage { height: 112px; }
          .dia-head, .dia-estado { display: none !important; }
          .dia-resp { margin-top: 5px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dia-s2, .dia-s3 { display: none !important; }
          .dia-s1, .dia-s1 [style*="dia-"] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <div style={{ position: "relative", border: "1px solid #E5E7EB", borderRadius: 14, padding: 8, background: "#FAFAFA" }}>
        <div className="dia-stage">
          {/* Escena 1: la IA agenda */}
          <div className="dia-escena dia-s1" style={escena("s1")}>
            <span className="dia-lab">{e.agenda.etiqueta}</span>
            <div style={panelChat}>
              <div className="dia-head" style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Inter", fontSize: 10.5, fontWeight: 700, color: "#075E54" }}>
                <ChannelLogo channel="whatsapp" size={14} /> {D.chatNombre}
              </div>
              <div style={{ ...pieza("a1"), ...burbuja("#DCF8C6"), justifySelf: "end" }}>{D.compacto.paciente}</div>
              <div style={{ ...pieza("a2"), ...burbuja("#fff"), justifySelf: "start" }}>{D.compacto.ia}</div>
            </div>
            <div style={{ ...pieza("a3"), ...panelCita }}>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                <span style={chip}>🕒 {c.hora}</span>
                <span className="dia-estado" style={{ fontFamily: "Inter", fontSize: 10.5, fontWeight: 700, background: "#FEF3C7", color: "#92400E", borderRadius: 999, padding: "3px 8px" }}>Pendiente</span>
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 700, color: "#3B5BDB" }}>{c.paciente}</div>
              <span data-activa-etiqueta-ia style={{ ...pieza("a4"), ...etiquetaOscura }}>⚡ {c.etiqueta}</span>
            </div>
          </div>

          {/* Escena 2: recordatorio automático */}
          <div className="dia-escena dia-s2" style={escena("s2")}>
            <span className="dia-lab">{e.recordatorio.etiqueta}</span>
            <div style={panelChat}>
              <div style={{ ...pieza("r1"), ...burbuja("#fff"), justifySelf: "start" }}>{e.recordatorio.clinica}</div>
              <div style={{ ...pieza("r2"), ...burbuja("#DCF8C6"), justifySelf: "end" }}>{e.recordatorio.paciente}</div>
            </div>
            <div style={{ ...pieza("r3"), ...panelCita }}>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                <span style={chip}>🕒 {c.hora}</span>
                <span className="dia-estado" style={{ fontFamily: "Inter", fontSize: 10.5, fontWeight: 700, background: "#ECFDF5", color: "#047857", borderRadius: 999, padding: "3px 8px" }}>{c.estado}</span>
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 700, color: "#3B5BDB" }}>{c.paciente}</div>
              <span data-activa-etiqueta-recordatorio style={{ ...pieza("r4"), ...etiquetaOscura }}>{e.recordatorio.tag}</span>
            </div>
          </div>

          {/* Escena 3: difusión masiva */}
          <div className="dia-escena dia-s3" style={escena("s3")}>
            <span className="dia-lab">{e.difusion.etiqueta}</span>
            <div style={panelChat}>
              <div style={{ ...pieza("d1"), ...burbuja("#DCF8C6"), justifySelf: "end" }}>{e.difusion.mensaje}</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 10, padding: 9, border: "1px solid #E5E7EB", display: "grid", alignContent: "center", gap: 6 }}>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {e.difusion.destinatarios.map((n, i) => (
                  <span
                    key={n + i}
                    style={{ ...pieza("d2", `${(i * 0.18).toFixed(2)}s`), width: 26, height: 26, borderRadius: "50%", background: "#EDE9FE", color: "#5B21B6", fontFamily: "Inter", fontSize: 12, fontWeight: 700, display: "grid", placeItems: "center" }}
                  >
                    {n}
                  </span>
                ))}
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 11, color: "#047857", fontWeight: 700 }}>✓✓ {e.difusion.pie}</div>
              <span data-activa-etiqueta-difusion style={{ ...pieza("d3"), ...etiquetaOscura }}>{e.difusion.tag}</span>
            </div>
          </div>
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
