"use client";

import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { Pricing, useReveal } from "@/components/home-v3/sections";
import ConsumoCalculator from "@/components/planes-pro/ConsumoCalculator";

// ── Tokens del sitio (clinera.io / /planes): Inter + JetBrains Mono ──
const FONT = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";
const ACCENT = "#7C3AED";
const ACCENT_BG = "rgba(124,58,237,0.06)";
const GREEN = "#10B981";
const INK = "#0A0A0A";
const MUTED = "#4B5563";
const FAINT = "#9CA3AF";
const BORDER = "#E5E7EB";

type Faq = { q: string; a: string; confirmar?: boolean };

export default function PlanesProBody({ faqs }: { faqs: Faq[] }) {
  useReveal();

  return (
    <main style={{ background: "#fff", color: INK, fontFamily: FONT }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .reveal{opacity:0;transform:translateY(12px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1);}
          .reveal.in{opacity:1;transform:none;}
          .pp-faq summary{list-style:none;cursor:pointer;outline:none;}
          .pp-faq summary::-webkit-details-marker{display:none;}
          .pp-faq summary:focus-visible{box-shadow:0 0 0 2px ${ACCENT}33;border-radius:8px;}
          .pp-faq .pp-sign{transition:transform .2s ease;}
          .pp-faq details[open] .pp-sign{transform:rotate(45deg);}
          @media (prefers-reduced-motion: reduce){*{animation-duration:0ms!important;transition-duration:0ms!important;}}
          @media (max-width:720px){main > section{padding-left:28px!important;padding-right:28px!important;}}
        `,
        }}
      />

      {/* ───────────────────────── 1 · HERO ───────────────────────── */}
      <section style={{ position: "relative", padding: "96px 80px 72px", overflow: "hidden", borderBottom: `1px solid #F0F0F0` }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 80% 55% at 50% -10%, #DBEAFE 0%, #E9D5FF 32%, #FBE8F0 56%, #FFFFFF 80%)",
            zIndex: 0,
          }}
        />
        <div className="reveal in" style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Eyebrow>Planes Pro · transparencia total</Eyebrow>
          <h1 style={{ fontFamily: FONT, fontSize: "clamp(34px,5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.04, margin: "16px 0 16px", maxWidth: 780, color: INK }}>
            Todo lo que pagas, explicado al detalle.
          </h1>
          <p style={{ fontFamily: FONT, fontSize: 19, lineHeight: 1.55, color: MUTED, maxWidth: 660, margin: "0 0 30px" }}>
            Esta es la vista a fondo de los planes de Clinera: aquí sí hablamos de créditos y te
            mostramos exactamente cómo se mide el consumo, para que decidas con toda la información
            sobre la mesa. Sin letra chica.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <a href="#calculadora" style={{ display: "inline-block", background: GRAD, color: "#fff", padding: "14px 26px", borderRadius: 999, fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
              Calcular mi consumo
            </a>
            <a href="/planes" style={{ color: MUTED, fontSize: 15, fontWeight: 600, textDecoration: "none", borderBottom: `1px solid ${BORDER}`, paddingBottom: 2 }}>
              Prefiero la versión simple →
            </a>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 32 }}>
            {["Sin permanencia", "Implementación USD 450 (pago único)", "Facturación en USD"].map((t) => (
              <span key={t} style={chip}>
                <Check /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── 2 · EXPLAINER DE CRÉDITOS ─────────────────── */}
      <Section eyebrow="Cómo se mide" title="Qué es un crédito (y por qué una conversación no cuesta siempre lo mismo)">
        <p style={para}>
          Clinera factura por <strong>créditos</strong>, no por conversación. Cada plan trae una
          bolsa mensual de créditos y cada respuesta de tu agente consume según el esfuerzo real
          que tomó resolverla. ¿Por qué? Porque <strong>no todas las conversaciones son iguales</strong>:
          confirmar una hora no es lo mismo que cotizar un tratamiento y cerrar la venta. El modo de
          IA marca la diferencia.
        </p>

        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, marginTop: 30 }}>
          <ModeCompare tag="Modo Eficiente" cr="~10" color={GREEN} titulo="El día a día de la clínica" ejemplos={["Confirmar o recordar una cita", "Responder preguntas frecuentes", "Enviar info de la clínica", "Pasar un link para que el paciente se agende"]} />
          <ModeCompare tag="Modo Agentic" cr="~195" color={ACCENT} big titulo="Cuando la IA agenda y razona" ejemplos={["Agendar o reprogramar la hora sola", "Cotizar un tratamiento a medida", "Resolver objeciones y dudas complejas", "Cerrar una venta multi-paso"]} />
        </div>

        <div style={callout}>
          <strong>El contraste es real: Agentic cuesta casi 20× más que Eficiente.</strong> No es un
          castigo, es que la IA piensa, consulta el sistema y ejecuta varios pasos. La mayoría de tu
          operación es Eficiente; Agentic entra solo cuando de verdad aporta. Esa mezcla es la que
          define cuánto te rinde el mes.
        </div>

        <h3 style={subh}>Qué consume créditos (y qué no)</h3>
        <p style={{ ...para, marginTop: 0 }}>
          Tus agentes trabajan sobre la misma bolsa. <strong>AURA</strong> responde por texto,{" "}
          <strong>CAMILA</strong> atiende por voz y <strong>LIA</strong> fiscaliza tu operación. Cada
          acción descuenta distinto:
        </p>
        <div className="reveal" style={{ display: "grid", gap: 0, marginTop: 6, maxWidth: 640 }}>
          {[
            ["Texto (AURA)", "~10 créditos por conversación simple"],
            ["Agendamiento automático (Agentic)", "~195 créditos · la IA agenda sola: razona + tool calls"],
            ["Minuto de voz (CAMILA)", "25 créditos por minuto"],
            ["LIA fiscaliza", "0 créditos"],
            ["Informes de LIA", "≈4.000 créditos / mes"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "12px 2px", borderBottom: `1px solid ${BORDER}`, fontFamily: MONO, fontSize: 13.5, lineHeight: 1.5 }}>
              <span style={{ color: INK, fontWeight: 600 }}>{k}</span>
              <span style={{ color: MUTED, textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>

        <h3 style={subh}>Cuánto alcanza cada plan</h3>
        <p style={{ ...para, marginTop: 0 }}>
          Referencia si toda tu operación fuera de un solo tipo. En la práctica operarás con una
          mezcla — la calculadora más abajo lo estima por ti.
        </p>
        <div className="reveal" style={{ display: "grid", gap: 12, marginTop: 18 }}>
          {[
            { plan: "Vortex", cr: 28000, ef: 2800, ag: 143 },
            { plan: "Atlas", cr: 37000, ef: 3700, ag: 190 },
            { plan: "Summit", cr: 46000, ef: 4600, ag: 236 },
          ].map((row) => (
            <div key={row.plan} style={{ border: `1px solid ${BORDER}`, borderRadius: 18, padding: "20px 22px", background: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 18 }}>{row.plan}</span>
                <span style={{ fontFamily: MONO, fontSize: 14, color: MUTED }}>{fmt(row.cr)} créditos / mes</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 14 }}>
                <Gauge label="Eficiente" big={`~${fmt(row.ef)}`} unit="conversaciones" pct={Math.round((row.ef / 4600) * 100)} color={GREEN} />
                <Gauge label="Agentic" big={`~${fmt(row.ag)}`} unit="conversaciones" pct={Math.round((row.ag / 236) * 100)} color={ACCENT} />
              </div>
            </div>
          ))}
        </div>
        <p style={footnote}>
          Eficiente = conversaciones simples (créditos ÷ ~10). Agentic = conversaciones de
          razonamiento multi-paso, como un agendamiento automático (créditos ÷ ~195). Son
          referencias orientativas: usa la calculadora para tu mezcla real.
        </p>
      </Section>

      {/* ─────────────────── 3 · PLANES (componente real /planes) ─────────────────── */}
      <div className="reveal" style={{ background: "#FAFAFA", borderTop: `1px solid #F0F0F0`, padding: "56px 24px 0", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Eyebrow style={{ color: ACCENT }}>Los planes, con créditos a la vista</Eyebrow>
          <p style={{ fontFamily: MONO, fontSize: 13.5, color: MUTED, marginTop: 14, lineHeight: 1.6 }}>
            Cada plan trae su bolsa mensual de créditos —{" "}
            <strong style={{ color: INK }}>visible en cada tarjeta</strong>. Esa es la fuente de
            verdad; las conversaciones de referencia son orientativas. Los tres planes suman{" "}
            <strong style={{ color: INK }}>+ USD 450 de implementación (pago único)</strong>:
            onboarding asistido por una persona. Aun así, un plan completo cuesta menos que una
            recepcionista (~USD 950/mes).
          </p>
        </div>
      </div>
      <Pricing showCredits />

      {/* ─────────────────── 4 · CALCULADORA ─────────────────── */}
      <ConsumoCalculator />

      {/* ─────────────────── 5 · ADD-ONS ─────────────────── */}
      <Section eyebrow="Extras" title="Add-ons y extras">
        <p style={para}>Suma capacidad o funciones puntuales sin cambiar de plan.</p>
        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginTop: 26 }}>
          <AddonCard titulo="Recarga de créditos" precio="USD 55" unidad="= 5.000 créditos" desc="Cuando tu volumen supera la bolsa del mes. Equivale a ~500 conversaciones Eficientes extra." />
          <AddonCard titulo="Usuario / profesional extra" precio="USD 9" unidad="/ mes" desc="Suma una persona más de tu equipo al acceso de la plataforma, por encima de los incluidos en tu plan." />
          <AddonCard titulo="Sucursal extra" precio="USD 39" unidad="/ mes" desc="Suma una sucursal adicional a tu operación." nota="Disponible solo en Atlas." />
        </div>
      </Section>

      {/* ─────────────────── 6 · FAQ ─────────────────── */}
      <Section eyebrow="Dudas" title="Preguntas sobre el consumo">
        <div className="pp-faq" style={{ marginTop: 18, borderTop: `1px solid ${BORDER}` }}>
          {faqs.map((f) => (
            <details key={f.q} style={{ borderBottom: `1px solid ${BORDER}` }}>
              <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "20px 4px", fontSize: 17, fontWeight: 600, color: INK }}>
                <span>{f.q}</span>
                <span className="pp-sign" aria-hidden style={{ flexShrink: 0, color: ACCENT, fontFamily: MONO, fontSize: 22, lineHeight: 1 }}>+</span>
              </summary>
              <p style={{ padding: "0 4px 22px", fontSize: 15.5, lineHeight: 1.65, color: MUTED, maxWidth: 720 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* ─────────────────── 7 · CIERRE ─────────────────── */}
      <section style={{ padding: "40px 24px 96px", background: "#fff" }}>
        <div className="reveal" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ background: INK, color: "#fff", borderRadius: 24, padding: "52px 44px", position: "relative", overflow: "hidden" }}>
            <div aria-hidden style={{ position: "absolute", top: 0, right: 0, width: 420, height: 420, background: "radial-gradient(circle at 70% 30%, rgba(124,58,237,.4), transparent 60%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px,3.6vw,40px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 14px", color: "#fff", maxWidth: 600 }}>
                Decide con todo a la vista.
              </h2>
              <p style={{ fontFamily: FONT, fontSize: 16.5, lineHeight: 1.6, color: "rgba(255,255,255,0.78)", maxWidth: 560, margin: "0 0 28px" }}>
                Sin permanencia · implementación USD 450 (pago único) · cambias de plan cuando
                quieras. Empieza con el plan que la calculadora te recomendó, o conversemos tu caso.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 26 }}>
                <a href="#calculadora" style={{ display: "inline-block", background: GRAD, color: "#fff", padding: "14px 26px", borderRadius: 999, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
                  Calcular mi plan
                </a>
                <a href="/hablar-con-ventas" style={{ display: "inline-block", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "14px 26px", borderRadius: 999, fontWeight: 600, fontSize: 15.5, textDecoration: "none" }}>
                  Hablar con ventas
                </a>
              </div>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {["Sin permanencia", "Implementación USD 450 (pago único)", "USD · Stripe · MercadoPago · WebPay"].map((t) => (
                  <span key={t} style={{ ...chip, color: "rgba(255,255,255,0.6)" }}>
                    <Check light /> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p style={{ textAlign: "center", fontFamily: MONO, fontSize: 13, color: FAINT, marginTop: 26 }}>
            ¿Buscabas la versión sin tecnicismos?{" "}
            <a href="/planes" style={{ color: ACCENT }}>Ver la página de planes simple →</a>
          </p>
        </div>
      </section>
    </main>
  );
}

/* ───────────────────────── helpers ───────────────────────── */
function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(n);
}

const chip: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 12.5, color: MUTED };
const para: React.CSSProperties = { fontFamily: FONT, fontSize: 17, lineHeight: 1.7, color: "#374151", margin: "0 0 14px", maxWidth: 740 };
const subh: React.CSSProperties = { fontFamily: FONT, fontSize: 21, fontWeight: 700, letterSpacing: "-0.02em", margin: "40px 0 4px", color: INK };
const callout: React.CSSProperties = { marginTop: 28, padding: "20px 22px", background: ACCENT_BG, borderLeft: `3px solid ${ACCENT}`, borderRadius: 8, fontFamily: FONT, fontSize: 15.5, lineHeight: 1.6, color: INK, maxWidth: 760 };
const footnote: React.CSSProperties = { marginTop: 16, fontFamily: MONO, fontSize: 12.5, lineHeight: 1.6, color: FAINT };

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: "88px 80px", borderTop: `1px solid #F0F0F0` }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="reveal">
          <Eyebrow style={{ color: ACCENT }}>{eyebrow}</Eyebrow>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(27px,3.4vw,42px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, margin: "12px 0 20px", color: INK, maxWidth: 760 }}>
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function ModeCompare({ tag, cr, titulo, ejemplos, color, big }: { tag: string; cr: string; titulo: string; ejemplos: string[]; color: string; big?: boolean }) {
  return (
    <div style={{ background: "#fff", border: big ? `2px solid ${color}` : `1px solid ${BORDER}`, borderRadius: 20, padding: "26px 24px", boxShadow: big ? `0 24px 60px -20px ${color}40` : "0 4px 24px rgba(0,0,0,.03)" }}>
      <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color }}>{tag}</span>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "12px 0 4px" }}>
        <span style={{ fontFamily: MONO, fontSize: 42, fontWeight: 700, color: INK, letterSpacing: "-0.03em", lineHeight: 1 }}>{cr}</span>
        <span style={{ fontFamily: MONO, fontSize: 13, color: FAINT }}>cr / conversación</span>
      </div>
      <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: INK, margin: "12px 0 12px" }}>{titulo}</p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 9 }}>
        {ejemplos.map((e) => (
          <li key={e} style={{ display: "flex", gap: 10, fontFamily: FONT, fontSize: 14.5, color: MUTED, lineHeight: 1.45 }}>
            <span style={{ flexShrink: 0, marginTop: 2 }}><Check color={color} /></span>
            {e}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Gauge({ label, big, unit, pct, color }: { label: string; big: string; unit: string; pct: number; color: string }) {
  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: FAINT, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: INK, letterSpacing: "-0.01em" }}>{big}</div>
      <div style={{ fontFamily: FONT, fontSize: 12, color: FAINT, marginBottom: 8 }}>{unit}</div>
      <div style={{ height: 6, background: "#ECECEC", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${Math.max(4, Math.min(100, pct))}%`, height: "100%", background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}

function AddonCard({ titulo, precio, unidad, desc, nota, badge }: { titulo: string; precio: string; unidad: string; desc: string; nota?: string; badge?: string }) {
  return (
    <div style={{ position: "relative", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 20, padding: "26px 24px", boxShadow: "0 4px 24px rgba(0,0,0,.03)" }}>
      {badge && (
        <span style={{ position: "absolute", top: 20, right: 20, fontFamily: MONO, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(200,80,192,0.12)", color: "#A8329C", padding: "3px 9px", borderRadius: 999 }}>{badge}</span>
      )}
      <h3 style={{ fontFamily: FONT, fontSize: 16.5, fontWeight: 700, color: INK, margin: "0 0 12px", maxWidth: 180 }}>{titulo}</h3>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12 }}>
        <span style={{ fontFamily: MONO, fontSize: 30, fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}>{precio}</span>
        <span style={{ fontFamily: MONO, fontSize: 13, color: FAINT }}>{unidad}</span>
      </div>
      <p style={{ fontFamily: FONT, fontSize: 14.5, lineHeight: 1.55, color: MUTED, margin: 0 }}>{desc}</p>
      {nota && <p style={{ fontFamily: MONO, fontSize: 12, color: "#A8329C", marginTop: 12, marginBottom: 0 }}>{nota}</p>}
    </div>
  );
}

function Check({ color, light, }: { color?: string; light?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden style={{ display: "inline", verticalAlign: "middle" }}>
      <path d="M13.5 4.5L6.5 11.5L3 8" stroke={light ? "#fff" : color || GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
