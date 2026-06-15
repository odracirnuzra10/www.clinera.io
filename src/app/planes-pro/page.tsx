import type { Metadata } from "next";
import type { CSSProperties } from "react";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import ConsumoCalculator from "@/components/planes-pro/ConsumoCalculator";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, orgSchema, faqSchema } from "@/components/seo/schemas";

const URL = "https://www.clinera.io/planes-pro";

export const metadata: Metadata = {
  title: "Planes Pro · precios y créditos explicados al detalle — Clinera.io",
  description:
    "La vista a fondo de los planes de Clinera: qué es un crédito, por qué una conversación no siempre cuesta lo mismo (Eficiente ~10 vs Agentic ~195) y cuánto rinde cada plan. Conect 10.000 cr, Advanced 15.000 cr, MAX 28.000 cr. Calculadora de consumo incluida. Sin permanencia.",
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: URL,
    siteName: "Clinera.io",
    title: "Planes Pro · precios y créditos explicados al detalle",
    description:
      "Transparencia total: créditos visibles, modos de IA explicados y una calculadora para estimar tu plan ideal.",
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Planes Pro · Clinera.io",
    description: "Créditos explicados al detalle + calculadora de consumo.",
    images: ["/images/og-banner.png"],
  },
};

// ── Tokens (light-first · acento único cyan = transparencia) ──
const ACCENT = "#009FE3";
const INK = "#0A0A0A";
const FONT = "'Outfit', system-ui, sans-serif";
const MONO = "'DM Mono', ui-monospace, monospace";
const BORDER = "#EAEAEA";
const MUTED = "#4A5168";

// ── Datos de planes (fuente: home-v3 Pricing) ──
const STRIPE = {
  conect: "https://buy.stripe.com/28EbJ32WJ3Um4cz6VZ1441k",
  advanced: "https://buy.stripe.com/4gM00l7cZ8aCfVh6VZ1441m",
  max: "https://buy.stripe.com/6oU14pdBn9eGeRdgwz1441n",
};

const FAQS: { q: string; a: string; confirmar?: boolean }[] = [
  {
    q: "¿Qué es un crédito y por qué lo usamos?",
    a: "Un crédito es la unidad base con la que se mide el trabajo de la IA. En vez de cobrarte un precio fijo por “conversación” —que en la práctica no cuesta siempre lo mismo— cada plan trae una bolsa mensual de créditos y cada respuesta consume según el esfuerzo real que tomó resolverla. Es la forma más honesta de cobrar: pagas por lo que de verdad usas.",
  },
  {
    q: "¿Por qué una conversación no siempre cuesta lo mismo?",
    a: "Depende del modo en que responde tu agente. En modo Eficiente (respuestas directas: agendar, confirmar, recordar, FAQ) una conversación gasta ~10 créditos. En modo Agentic (razonamiento multi-paso: cotizar tratamientos, resolver objeciones, decisiones) gasta ~195: casi 20× más, porque la IA piensa, consulta y ejecuta varios pasos. La mayoría de la operación diaria es Eficiente; el modo Agentic se usa para los casos que de verdad lo ameritan.",
  },
  {
    q: "¿Cómo sé en qué modo responde mi agente?",
    a: "Tú lo configuras. Defines qué situaciones se resuelven en modo Eficiente y cuáles escalan a Agentic, según el tipo de clínica y de consulta. La mezcla real entre ambos modos es lo que determina cuánto rinde tu bolsa de créditos cada mes.",
  },
  {
    q: "¿Qué pasa si se me acaban los créditos del mes?",
    a: "No se corta el servicio de golpe ni hay cobros sorpresa. Puedes sumar un pack de créditos adicionales ($50 = 5.000 créditos) cuando lo necesites, o subir de plan. La calculadora de esta página te muestra de antemano cuántos packs harían falta a tu volumen para que no te tome por sorpresa.",
  },
  {
    q: "¿Los créditos no usados se acumulan o vencen?",
    a: "La política de acumulación o vencimiento de créditos no usados está [CONFIRMAR]. Lo dejamos marcado a propósito: no publicamos una condición que todavía no está cerrada.",
    confirmar: true,
  },
  {
    q: "¿Las llamadas de voz (CAMILA) consumen créditos?",
    a: "Sí, las llamadas de voz consumen créditos aparte de las conversaciones de texto. El costo exacto por llamada está [CONFIRMAR] y por eso aún no lo incluimos en la calculadora.",
    confirmar: true,
  },
  {
    q: "¿Puedo cambiar de plan cuando quiera?",
    a: "Sí. No hay permanencia ni contratos atados: subes, bajas o cancelas cuando lo necesites. Los créditos se ajustan al plan vigente en cada ciclo de facturación.",
  },
  {
    q: "¿Cómo se factura?",
    a: "La facturación es mensual en USD y puedes pagar con Stripe, MercadoPago o WebPay. El ciclo de créditos se cuenta por fecha de facturación, no por mes calendario.",
  },
  {
    q: "¿Incluye implementación?",
    a: "Sí, la implementación es $0 en todos los planes. No hay costo de setup ni de onboarding: empiezas a usar Clinera sin una inversión inicial.",
  },
];

const planOffers = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Clinera.io — Planes",
  description: "Software de IA para clínicas médicas y estéticas en LATAM. Planes con créditos visibles.",
  brand: { "@type": "Brand", name: "Clinera.io" },
  offers: [
    { "@type": "Offer", name: "Conect", price: "129", priceCurrency: "USD", url: URL },
    { "@type": "Offer", name: "Advanced", price: "179", priceCurrency: "USD", url: URL },
    { "@type": "Offer", name: "MAX", price: "279", priceCurrency: "USD", url: URL },
    { "@type": "Offer", name: "Corporativo", price: "1500", priceCurrency: "USD", url: "https://www.clinera.io/hablar-con-ventas" },
  ],
};

export default function PlanesProPage() {
  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          planOffers,
          // Solo FAQs confirmadas en structured data (los [CONFIRMAR] quedan visibles, no indexados)
          faqSchema(FAQS.filter((f) => !f.confirmar).map(({ q, a }) => ({ q, a }))),
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io" },
            { name: "Planes Pro", url: URL },
          ]),
        ]}
      />

      <NavV3 />

      {/* CSS local para acordeón FAQ accesible (details/summary) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .pp-faq summary{list-style:none;cursor:pointer;outline:none;}
          .pp-faq summary::-webkit-details-marker{display:none;}
          .pp-faq summary:focus-visible{box-shadow:0 0 0 2px ${ACCENT}33;border-radius:8px;}
          .pp-faq .pp-sign{transition:transform .2s ease;}
          .pp-faq details[open] .pp-sign{transform:rotate(45deg);}
        `,
        }}
      />

      <main style={{ background: "#fff", color: INK, fontFamily: FONT }}>
        {/* ───────────────────────── 1 · HERO ───────────────────────── */}
        <section
          style={{
            padding: "84px 24px 64px",
            background: "radial-gradient(ellipse 60% 70% at 100% 0%, rgba(0,159,227,0.08), transparent 60%), #fff",
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <span style={pill}>Planes Pro · transparencia total</span>
            <h1
              style={{
                fontSize: "clamp(34px,5.2vw,54px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                margin: "20px 0 16px",
                maxWidth: 760,
              }}
            >
              Todo lo que pagas, explicado al detalle.
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.6, color: MUTED, maxWidth: 660, margin: "0 0 30px" }}>
              Esta es la vista a fondo de los planes de Clinera: aquí sí hablamos de créditos
              y te mostramos exactamente cómo se mide el consumo, para que decidas con toda la
              información sobre la mesa. Sin letra chica.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <a href="#calculadora" style={ctaDark}>
                Calcular mi consumo
              </a>
              <a href="/planes" style={ctaGhostLink}>
                Prefiero la versión simple →
              </a>
            </div>
            <div style={{ display: "flex", gap: 22, flexWrap: "wrap", marginTop: 30 }}>
              {["Sin permanencia", "Implementación $0", "Facturación en USD"].map((t) => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 12.5, color: MUTED }}>
                  <Check />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────── 2 · EXPLAINER DE CRÉDITOS ───────────────────── */}
        <Section num="01" title="Qué es un crédito (y por qué una conversación no cuesta siempre lo mismo)">
          <p style={para}>
            Clinera factura por <strong>créditos</strong>, no por conversación. Cada plan trae
            una bolsa mensual de créditos y cada respuesta de tu agente consume según el esfuerzo
            real que tomó resolverla. ¿Por qué? Porque <strong>no todas las conversaciones son
            iguales</strong>: confirmar una hora no es lo mismo que cotizar un tratamiento y cerrar
            la venta. El modo de IA marca la diferencia.
          </p>

          {/* Comparación lado a lado */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginTop: 30 }}>
            <ModeCompare
              tag="Modo Eficiente"
              cr="~10"
              titulo="El día a día de la clínica"
              ejemplos={["Agendar una hora", "Confirmar o recordar una cita", "Responder preguntas frecuentes", "Reprogramar un control"]}
              accent={ACCENT}
            />
            <ModeCompare
              tag="Modo Agentic"
              cr="~195"
              titulo="Cuando hay que razonar"
              ejemplos={["Cotizar un tratamiento a medida", "Resolver objeciones y dudas complejas", "Decidir entre varias opciones", "Cerrar una venta multi-paso"]}
              accent="#7C3AED"
              big
            />
          </div>

          <div style={callout}>
            <strong>El contraste es real: Agentic cuesta casi 20× más que Eficiente.</strong> No es
            un castigo, es que la IA piensa, consulta el sistema y ejecuta varios pasos. La mayoría
            de tu operación es Eficiente; Agentic entra solo cuando de verdad aporta. Esa mezcla es
            la que define cuánto te rinde el mes.
          </div>

          {/* Cuánto alcanza cada plan */}
          <h3 style={subh}>Cuánto alcanza cada plan</h3>
          <p style={{ ...para, marginTop: 0 }}>
            A modo de referencia, si toda tu operación fuera de un solo tipo. En la práctica
            operarás con una mezcla — la calculadora más abajo lo estima por ti.
          </p>
          <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
            {[
              { plan: "Conect", cr: 10000, ef: 1000, ag: 51 },
              { plan: "Advanced", cr: 15000, ef: 1500, ag: 77 },
              { plan: "MAX", cr: 28000, ef: 2800, ag: 144 },
            ].map((row) => (
              <div key={row.plan} style={{ border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 20px", background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 17 }}>{row.plan}</span>
                  <span style={{ fontFamily: MONO, fontSize: 14, color: MUTED }}>{fmt(row.cr)} créditos / mes</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
                  <Gauge label="Eficiente" big={`~${fmt(row.ef)}`} unit="conversaciones" pct={100} color={ACCENT} />
                  <Gauge label="Agentic" big={`~${fmt(row.ag)}`} unit="conversaciones" pct={Math.round((row.ag / row.ef) * 100)} color="#7C3AED" />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ───────────────────── 3 · TABLA COMPARATIVA ───────────────────── */}
        <Section num="02" title="Los 4 planes, con todo visible">
          <p style={para}>
            Créditos incluidos, costo por conversación y diferencias avanzadas. Sin esconder nada.
          </p>

          <div style={{ overflowX: "auto", marginTop: 26, border: `1px solid ${BORDER}`, borderRadius: 16 }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 760, fontFamily: FONT }}>
              <thead>
                <tr>
                  <th style={{ ...thCell, textAlign: "left", minWidth: 150 }}>Plan</th>
                  <th style={thCell}>Conect</th>
                  <th style={thCell}>Advanced</th>
                  <th style={{ ...thCell, background: "rgba(0,159,227,0.07)", color: INK }}>
                    MAX
                    <span style={star}>★ El más elegido</span>
                  </th>
                  <th style={thCell}>Corporativo</th>
                </tr>
              </thead>
              <tbody>
                <Row label="Precio / mes" cells={["$129", "$179", "$279", "desde $1.500"]} mono strong featured={2} />
                <Row label="Créditos incluidos" cells={["10.000", "15.000", "28.000", "a medida"]} mono featured={2} />
                <Row label="Conversaciones ref.*" cells={["~1.000", "~1.500", "~2.800", "a medida"]} mono featured={2} />
                <Row label="Agendamientos / mes" cells={["80", "150", "500", "a medida"]} mono featured={2} />
                <Row label="Usuarios incluidos" cells={["3", "5", "15", "a medida"]} mono featured={2} />
                <Row label="Voz (CAMILA)" cells={["—", "—", "~120 llamadas/mes", "a medida"]} featured={2} />
                <Row label="Modos de IA" cells={["Eficiente · Agentic", "Eficiente · Agentic", "Eficiente · Agentic · Agentic Pro", "a medida"]} featured={2} />
                <Row label="Multisucursal" cells={[false, true, true, true]} featured={2} />
                <Row label="Webhooks + API pública" cells={[false, false, true, true]} featured={2} />
                <Row label="$ / conversación" cells={["$0.13", "$0.12", "$0.09", "—"]} mono featured={2} />
                <tr>
                  <td style={{ ...tdCell, fontWeight: 600 }}>Contratar</td>
                  <td style={tdCell}><CtaCell href={STRIPE.conect} name="Conect" /></td>
                  <td style={tdCell}><CtaCell href={STRIPE.advanced} name="Advanced" /></td>
                  <td style={{ ...tdCell, background: "rgba(0,159,227,0.05)" }}><CtaCell href={STRIPE.max} name="MAX" primary /></td>
                  <td style={tdCell}><CtaCell href="/hablar-con-ventas" name="Corporativo" label="Hablar" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={footnote}>
            * Cifras de conversaciones aproximadas y referenciales — la fuente de verdad son los
            créditos. A ~10 cr/conversación (Eficiente): 10.000≈1.000 y 15.000≈1.500 coinciden; para
            MAX, 28.000 créditos equivalen a ~2.800 (la cifra publicada de ~3.200 es solo orientativa){" "}
            <strong style={{ color: "#6B6B6B" }}>[CONFIRMAR cuál publicar]</strong>. Usa la calculadora
            para una estimación precisa según tu mezcla de modos.
          </p>
        </Section>

        {/* ───────────────────── 4 · CALCULADORA ───────────────────── */}
        <ConsumoCalculator />

        {/* ───────────────────── 5 · ADD-ONS ───────────────────── */}
        <Section num="03" title="Add-ons y extras">
          <p style={para}>Suma capacidad o funciones puntuales sin cambiar de plan.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginTop: 26 }}>
            <AddonCard
              titulo="Pack de créditos"
              precio="$50"
              unidad="= 5.000 créditos"
              desc="Cuando tu volumen supera la bolsa del mes. Equivale a ~500 conversaciones Eficientes extra."
              nota="[CONFIRMAR: única vez vs mensual]"
            />
            <AddonCard
              titulo="Usuario / profesional extra"
              precio="$9"
              unidad="/ mes"
              desc="Suma una persona más de tu equipo al acceso de la plataforma, por encima de los incluidos en tu plan."
            />
            <AddonCard
              titulo="Módulo Odontograma"
              precio="$21"
              unidad="/ mes"
              desc="Ficha odontológica visual e interactiva para clínicas dentales. Se activa sobre cualquier plan."
              badge="Nuevo"
            />
          </div>
        </Section>

        {/* ───────────────────── 6 · FAQ ───────────────────── */}
        <Section num="04" title="Preguntas sobre el consumo">
          <div className="pp-faq" style={{ marginTop: 18, borderTop: `1px solid ${BORDER}` }}>
            {FAQS.map((f) => (
              <details key={f.q} style={{ borderBottom: `1px solid ${BORDER}` }}>
                <summary
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "20px 4px",
                    fontSize: 17,
                    fontWeight: 600,
                    color: INK,
                  }}
                >
                  <span>{f.q}</span>
                  <span className="pp-sign" aria-hidden style={{ flexShrink: 0, color: ACCENT, fontFamily: MONO, fontSize: 22, lineHeight: 1 }}>
                    +
                  </span>
                </summary>
                <p style={{ padding: "0 4px 22px", fontSize: 15.5, lineHeight: 1.65, color: MUTED, maxWidth: 720 }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </Section>

        {/* ───────────────────── 7 · CIERRE / CTA ───────────────────── */}
        <section style={{ padding: "32px 24px 88px", background: "#fff" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div
              style={{
                background: INK,
                color: "#fff",
                borderRadius: 22,
                padding: "48px 40px",
                backgroundImage: "radial-gradient(ellipse 50% 80% at 100% 0%, rgba(0,159,227,0.22), transparent 60%)",
              }}
            >
              <h2 style={{ fontSize: "clamp(26px,3.6vw,38px)", fontWeight: 700, letterSpacing: "-0.025em", margin: "0 0 14px", color: "#fff", maxWidth: 600 }}>
                Decide con todo a la vista.
              </h2>
              <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "rgba(255,255,255,0.78)", maxWidth: 560, margin: "0 0 26px" }}>
                Sin permanencia · implementación $0 · cambias de plan cuando quieras. Empieza con el
                plan que la calculadora te recomendó, o conversemos tu caso.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 26 }}>
                <a href="#calculadora" style={{ ...ctaDark, background: "#fff", color: INK }}>
                  Calcular mi plan
                </a>
                <a href="/hablar-con-ventas" style={{ display: "inline-block", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "13px 22px", borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
                  Hablar con el equipo
                </a>
              </div>
              <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
                {["Sin permanencia", "Implementación $0", "USD · Stripe · MercadoPago · WebPay"].map((t) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 12.5, color: "rgba(255,255,255,0.6)" }}>
                    <Check light />
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <p style={{ textAlign: "center", fontFamily: MONO, fontSize: 13, color: "#8B92A5", marginTop: 26 }}>
              ¿Buscabas la versión sin tecnicismos?{" "}
              <a href="/planes" style={{ color: ACCENT }}>Ver la página de planes simple →</a>
            </p>
          </div>
        </section>
      </main>

      <FooterV3 />
    </>
  );
}

/* ───────────────────────── helpers ───────────────────────── */
function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(n);
}

const pill: CSSProperties = {
  fontFamily: MONO,
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: ACCENT,
  background: "rgba(0,159,227,0.08)",
  padding: "6px 13px",
  borderRadius: 999,
};

const ctaDark: CSSProperties = {
  display: "inline-block",
  background: INK,
  color: "#fff",
  padding: "13px 24px",
  borderRadius: 11,
  fontWeight: 600,
  fontSize: 15.5,
  textDecoration: "none",
};

const ctaGhostLink: CSSProperties = {
  color: MUTED,
  fontSize: 15,
  fontWeight: 500,
  textDecoration: "none",
  borderBottom: `1px solid ${BORDER}`,
  paddingBottom: 2,
};

const para: CSSProperties = { fontSize: 17, lineHeight: 1.7, color: "#374151", margin: "0 0 14px", maxWidth: 740 };

const subh: CSSProperties = { fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", margin: "38px 0 4px", color: INK };

const callout: CSSProperties = {
  marginTop: 28,
  padding: "20px 22px",
  background: "rgba(0,159,227,0.06)",
  borderLeft: `3px solid ${ACCENT}`,
  borderRadius: 8,
  fontSize: 15.5,
  lineHeight: 1.6,
  color: INK,
  maxWidth: 760,
};

const footnote: CSSProperties = {
  marginTop: 16,
  fontFamily: MONO,
  fontSize: 12.5,
  lineHeight: 1.6,
  color: "#8B92A5",
};

const thCell: CSSProperties = {
  textAlign: "center",
  fontFamily: FONT,
  fontSize: 14,
  fontWeight: 700,
  color: INK,
  padding: "16px 16px",
  borderBottom: `1px solid ${BORDER}`,
  background: "#F7F6F3",
  position: "relative",
};

const tdCell: CSSProperties = {
  padding: "14px 16px",
  borderBottom: `1px solid ${BORDER}`,
  fontSize: 14,
  color: INK,
  textAlign: "center",
};

const star: CSSProperties = {
  display: "block",
  fontFamily: MONO,
  fontSize: 9.5,
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: ACCENT,
  marginTop: 3,
};

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: "72px 24px", borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "#8B92A5" }}>
          Sección {num}
        </span>
        <h2 style={{ fontSize: "clamp(25px,3.3vw,34px)", fontWeight: 700, letterSpacing: "-0.025em", margin: "10px 0 20px", color: INK, maxWidth: 760 }}>
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function ModeCompare({
  tag,
  cr,
  titulo,
  ejemplos,
  accent,
  big,
}: {
  tag: string;
  cr: string;
  titulo: string;
  ejemplos: string[];
  accent: string;
  big?: boolean;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: big ? `1.5px solid ${accent}` : `1px solid ${BORDER}`,
        borderRadius: 16,
        padding: "24px 22px",
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: accent }}>
        {tag}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "12px 0 4px" }}>
        <span style={{ fontFamily: MONO, fontSize: 40, fontWeight: 500, color: INK, letterSpacing: "-0.02em", lineHeight: 1 }}>{cr}</span>
        <span style={{ fontFamily: MONO, fontSize: 13, color: "#8B92A5" }}>cr / conversación</span>
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: INK, margin: "12px 0 12px" }}>{titulo}</p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
        {ejemplos.map((e) => (
          <li key={e} style={{ display: "flex", gap: 10, fontSize: 14.5, color: MUTED, lineHeight: 1.45 }}>
            <span aria-hidden style={{ color: accent, flexShrink: 0 }}>·</span>
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
      <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B92A5", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 500, color: INK, letterSpacing: "-0.01em" }}>{big}</div>
      <div style={{ fontSize: 12, color: "#8B92A5", marginBottom: 8 }}>{unit}</div>
      <div style={{ height: 6, background: "#EEF0F3", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${Math.max(4, Math.min(100, pct))}%`, height: "100%", background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}

function Row({
  label,
  cells,
  mono,
  strong,
  featured,
}: {
  label: string;
  cells: (string | boolean)[];
  mono?: boolean;
  strong?: boolean;
  featured?: number;
}) {
  return (
    <tr>
      <td style={{ ...tdCell, textAlign: "left", fontWeight: 600, color: MUTED }}>{label}</td>
      {cells.map((c, i) => {
        const isFeatured = i === featured;
        const base: CSSProperties = {
          ...tdCell,
          fontFamily: mono ? MONO : FONT,
          fontWeight: strong ? 700 : 400,
          background: isFeatured ? "rgba(0,159,227,0.05)" : "transparent",
        };
        if (typeof c === "boolean") {
          return (
            <td key={i} style={base}>
              {c ? <Check inline /> : <span style={{ color: "#C7CBD3" }} aria-label="no incluido">—</span>}
            </td>
          );
        }
        return (
          <td key={i} style={base}>
            {c}
          </td>
        );
      })}
    </tr>
  );
}

function CtaCell({ href, name, primary, label }: { href: string; name: string; primary?: boolean; label?: string }) {
  return (
    <a
      href={href}
      data-plan-name={`planes-pro tabla · ${name}`}
      style={{
        display: "inline-block",
        padding: "9px 16px",
        borderRadius: 9,
        fontWeight: 600,
        fontSize: 13.5,
        textDecoration: "none",
        background: primary ? INK : "#fff",
        color: primary ? "#fff" : INK,
        border: primary ? `1px solid ${INK}` : `1px solid ${BORDER}`,
      }}
    >
      {label ?? "Contratar"}
    </a>
  );
}

function AddonCard({
  titulo,
  precio,
  unidad,
  desc,
  nota,
  badge,
}: {
  titulo: string;
  precio: string;
  unidad: string;
  desc: string;
  nota?: string;
  badge?: string;
}) {
  return (
    <div style={{ position: "relative", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 16, padding: "24px 22px" }}>
      {badge && (
        <span style={{ position: "absolute", top: 18, right: 18, fontFamily: MONO, fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(200,80,192,0.12)", color: "#A8329C", padding: "3px 9px", borderRadius: 999 }}>
          {badge}
        </span>
      )}
      <h3 style={{ fontSize: 16.5, fontWeight: 700, color: INK, margin: "0 0 12px", maxWidth: 180 }}>{titulo}</h3>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12 }}>
        <span style={{ fontFamily: MONO, fontSize: 30, fontWeight: 500, color: INK, letterSpacing: "-0.02em" }}>{precio}</span>
        <span style={{ fontFamily: MONO, fontSize: 13, color: "#8B92A5" }}>{unidad}</span>
      </div>
      <p style={{ fontSize: 14.5, lineHeight: 1.55, color: MUTED, margin: 0 }}>{desc}</p>
      {nota && <p style={{ fontFamily: MONO, fontSize: 12, color: "#A8329C", marginTop: 12, marginBottom: 0 }}>{nota}</p>}
    </div>
  );
}

function Check({ light, inline }: { light?: boolean; inline?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden style={inline ? { display: "inline", verticalAlign: "middle" } : undefined}>
      <path d="M13.5 4.5L6.5 11.5L3 8" stroke={light ? "#fff" : ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
