// ============================================================================
// Metodología PMFC (Ricardo, 19-oct-2026): Propuesta de valor, Marketing,
// Framework comercial, Clinera. El home la usa para enfocar el sitio en
// rentabilidad y margen, no en funciones. El ejemplo 10×1.000 vs 100×100 es
// ilustrativo y se rotula así. Sin "patentado" ni cifras de clientes.
// ============================================================================

import Link from "next/link";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";

const PIEZAS = [
  { letra: "P", titulo: "Propuesta de valor", texto: "Lo que te hace único, convertido en un servicio que la competencia no tiene. Es lo que te permite cobrar más." },
  { letra: "M", titulo: "Marketing", texto: "Campañas que muestran por qué elegirte, no solo cuánto cuesta. Llegan al paciente indicado." },
  { letra: "F", titulo: "Framework comercial", texto: "Tu equipo aprende a transformar evaluaciones en ventas, sin regalar tratamientos." },
  { letra: "C", titulo: "Clinera", texto: "La herramienta que sostiene todo: leads, IA que agenda, ficha, cobro y margen en un solo lugar." },
];

const CASOS = [
  { id: "a", titulo: "Clínica A", detalle: "10 pacientes × US$ 1.000", total: "US$ 10.000", nota: "Menos mano de obra, más dedicación, más margen para crecer.", pts: 10 },
  { id: "b", titulo: "Clínica B", detalle: "100 pacientes × US$ 100", total: "US$ 10.000", nota: "Más trabajo, más errores, más estrés y menos margen.", pts: 100 },
];

export default function PmfcSection({ compacto = false }: { compacto?: boolean }) {
  return (
    <section id="pmfc" aria-label="Metodología PMFC" data-pmfc style={{ padding: "112px clamp(16px, 5vw, 56px)", background: "#FAFAFA" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 48px" }}>
          <Eyebrow>Metodología PMFC</Eyebrow>
          <h2 style={{ fontFamily: "Inter", fontSize: "clamp(30px, 5vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, margin: "16px 0 14px", color: "#0A0A0A" }}>
            Vender lo mismo no es{" "}
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              ganar lo mismo.
            </span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "#4B5563", margin: 0 }}>
            Lo que hace crecer a una clínica es el margen. Con una propuesta de valor clara, cobras más, atiendes mejor y tienes con qué reinvertir en publicidad, tecnología y nuevas sucursales.
          </p>
        </div>

        {!compacto && (<>
        <div data-pmfc-casos style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 20 }}>
          {CASOS.map((c) => (
            <article key={c.id} data-pmfc-caso={c.id} style={{ background: "#FFFFFF", border: "1px solid #EDEDED", borderRadius: 20, padding: 28 }}>
              <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", color: "#7C3AED", textTransform: "uppercase" }}>
                {c.titulo}
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "8px 0 2px", color: "#0A0A0A" }}>{c.total}</div>
              <div style={{ fontSize: 15, color: "#4B5563", marginBottom: 14 }}>{c.detalle}</div>
              <div aria-hidden="true" style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 14 }}>
                {Array.from({ length: c.pts }).map((_, i) => (
                  <i key={i} style={{ width: c.pts > 10 ? 6 : 14, height: c.pts > 10 ? 6 : 14, borderRadius: 999, background: c.id === "a" ? "#7C3AED" : "#D1D5DB", display: "block" }} />
                ))}
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: "#0A0A0A", margin: 0 }}>{c.nota}</p>
            </article>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "#6B7280", textAlign: "center", margin: "0 0 56px" }}>Ejemplo ilustrativo, no un dato real.</p>
        </>)}

        <div data-pmfc-piezas style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {PIEZAS.map((p) => (
            <article key={p.letra} data-pmfc-pieza={p.letra} style={{ background: "#FFFFFF", border: "1px solid #EDEDED", borderRadius: 20, padding: 28 }}>
              <div style={{ fontFamily: "Inter", fontSize: 56, fontWeight: 800, lineHeight: 1, background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{p.letra}</div>
              <h3 style={{ fontFamily: "Inter", fontSize: 19, fontWeight: 700, margin: "12px 0 8px", color: "#0A0A0A" }}>{p.titulo}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "#4B5563", margin: 0 }}>{p.texto}</p>
            </article>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 36 }}>
          <Link href="/blog/metodologia-pmfc-rentabilidad-clinicas-esteticas" data-pmfc-link style={{ fontSize: 16, fontWeight: 600, color: "#7C3AED", textDecoration: "none" }}>
            Lee la metodología completa →
          </Link>
        </div>
      </div>
    </section>
  );
}
