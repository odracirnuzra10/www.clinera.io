import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PlanesProBody from "@/components/planes-pro/PlanesProBody";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, orgSchema, faqSchema } from "@/components/seo/schemas";

const URL = "https://www.clinera.io/planes-pro";

export const metadata: Metadata = {
  title: "Planes Pro · precios y créditos explicados al detalle — Clinera.io",
  description:
    "La vista a fondo de los planes de Clinera: qué es un crédito, por qué una conversación no siempre cuesta lo mismo (Eficiente ~10 vs Agentic ~195) y cuánto rinde cada plan. Vortex 28.000 cr, Atlas 37.000 cr, Summit 46.000 cr. Calculadora de consumo incluida. Sin permanencia · + USD 450 implementación (pago único).",
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
    a: "No se corta el servicio de golpe ni hay cobros sorpresa. Puedes sumar una recarga de créditos (USD 55 = 5.000 créditos) cuando lo necesites, o subir de plan. La calculadora de esta página te muestra de antemano cuántas recargas harían falta a tu volumen para que no te tome por sorpresa.",
  },
  {
    q: "¿Los créditos no usados se acumulan o vencen?",
    a: "La política de acumulación o vencimiento de créditos no usados está [CONFIRMAR]. Lo dejamos marcado a propósito: no publicamos una condición que todavía no está cerrada.",
    confirmar: true,
  },
  {
    q: "¿Las llamadas de voz (CAMILA) consumen créditos?",
    a: "Sí. CAMILA atiende por voz y consume de la misma bolsa: cada minuto de voz gasta 25 créditos, aparte de las conversaciones de texto de AURA. El agendamiento que resulte de esa llamada no consume créditos.",
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
    a: "La implementación es un pago único de USD 450 en los tres planes (Vortex, Atlas y Summit). Es un onboarding asistido por una persona: configuramos tus agentes, tu agenda y tus flujos contigo antes de salir a producción. Es la única inversión inicial y no se repite.",
  },
];

const planOffers = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Clinera.io — Planes",
  description: "Software de IA para clínicas médicas y estéticas en LATAM. Planes con créditos visibles.",
  brand: { "@type": "Brand", name: "Clinera.io" },
  offers: [
    { "@type": "Offer", name: "Vortex", price: "279", priceCurrency: "USD", url: URL },
    { "@type": "Offer", name: "Atlas", price: "379", priceCurrency: "USD", url: URL },
    { "@type": "Offer", name: "Summit", price: "479", priceCurrency: "USD", url: URL },
    { "@type": "Offer", name: "Corporativo", price: "1900", priceCurrency: "USD", url: "https://www.clinera.io/hablar-con-ventas" },
  ],
};

export default function PlanesProPage() {
  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          planOffers,
          faqSchema(FAQS.filter((f) => !f.confirmar).map(({ q, a }) => ({ q, a }))),
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io" },
            { name: "Planes Pro", url: URL },
          ]),
        ]}
      />
      <NavV3 />
      <PlanesProBody faqs={FAQS} />
      <FooterV3 />
    </>
  );
}
