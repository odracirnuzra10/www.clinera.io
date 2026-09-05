import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PlanesProBody from "@/components/planes-pro/PlanesProBody";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, orgSchema, faqSchema } from "@/components/seo/schemas";

const URL = "https://www.clinera.io/planes-pro";

export const metadata: Metadata = {
  title: "Planes Pro: precios y créditos",
  description:
    "La vista a fondo de los planes de Clinera: qué es un crédito, por qué una conversación no siempre cuesta lo mismo (conversar ~30 vs agendar ~195) y cuánto rinde cada plan. Vortex 28.000 cr, Atlas 37.000 cr, Summit 46.000 cr. Calculadora de consumo incluida. Permanencia mínima de 6 meses · semestral y anual con 20% OFF e implementación gratis · mensual + USD 450 de configuración inicial.",
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: URL,
    siteName: "Clinera.io",
    title: "Planes Pro · precios y créditos explicados al detalle",
    description:
      "Transparencia total: créditos visibles, el modo Agentic explicado y una calculadora para estimar tu plan ideal.",
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
    a: "Depende de cuánto trabajo tomó resolverla. Clinera opera en un único modo, Agentic: la IA siempre razona y siempre puede ejecutar acciones. Una conversación que solo informa (precios, horarios, confirmar o recordar una cita) gasta ~30 créditos. Una que termina en agendamiento —crear, reagendar o cancelar la hora— gasta ~195: unas 6× más, porque la IA consulta la disponibilidad real de tu agenda y ejecuta varios pasos. La mayoría de la operación diaria son conversaciones; el agendamiento entra cuando el paciente de verdad reserva.",
  },
  {
    q: "¿Puedo elegir cómo responde mi agente?",
    a: "El modo es uno solo —Agentic— y viene activo en todos los planes: la IA agenda sola, dentro del chat, sin mandar links ni depender de sistemas externos. Lo que sí configuras son las reglas de tu clínica: qué tratamientos ofrece, con qué profesionales, qué disponibilidad publica y en qué casos deriva a una persona.",
  },
  {
    q: "¿Qué pasa si se me acaban los créditos del mes?",
    a: "No se corta el servicio de golpe ni hay cobros sorpresa. Puedes sumar una recarga de créditos (USD 15 = 5.000 créditos) cuando lo necesites, o subir de plan. La calculadora de esta página te muestra de antemano cuántas recargas harían falta a tu volumen para que no te tome por sorpresa.",
  },
  {
    q: "¿Los créditos no usados se acumulan o vencen?",
    a: "La política de acumulación o vencimiento de créditos no usados está [CONFIRMAR]. Lo dejamos marcado a propósito: no publicamos una condición que todavía no está cerrada.",
    confirmar: true,
  },
  {
    q: "¿Las llamadas de voz (CAMILA) consumen créditos?",
    a: "Sí. CAMILA atiende por voz y consume de la misma bolsa: cada minuto de voz gasta 25 créditos, aparte de las conversaciones de texto de AURA. Si esa llamada termina en un agendamiento automático, ese cierre consume como cualquier agendamiento (~195 créditos).",
  },
  {
    q: "¿Puedo cambiar de plan cuando quiera?",
    a: "Sí. No hay permanencia ni contratos atados: subes, bajas o cancelas cuando lo necesites. Los créditos se ajustan al plan vigente en cada ciclo de facturación.",
  },
  {
    q: "¿Cómo se factura?",
    a: "En USD, con Stripe, MercadoPago o WebPay, y eliges entre tres modalidades: anual (12 meses por adelantado, 20% OFF e implementación gratis), semestral (6 meses por adelantado, 20% OFF) o mensual a precio de lista. La bolsa de créditos se recarga igual todos los meses en las tres; el ciclo se cuenta por fecha de facturación, no por mes calendario.",
  },
  {
    q: "¿Incluye configuración?",
    a: "El costo de configuración es un pago único de USD 450 en los tres planes (Vortex, Atlas y Summit) cuando pagas mensual o semestral, y es gratis si contratas el plan anual. Es un onboarding asistido por una persona: migramos tus fichas clínicas, datos históricos, pacientes y tratamientos, y configuramos tus agentes, tu agenda y tus flujos contigo antes de salir a producción. Es la única inversión inicial y no se repite.",
  },
];

const planOffers = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Clinera.io — Planes",
  description: "Software de IA para clínicas médicas y estéticas en LATAM. Planes con créditos visibles.",
  brand: { "@type": "Brand", name: "Clinera.io" },
  offers: [
    { "@type": "Offer", name: "Vortex · Anual", price: "2678", priceCurrency: "USD", url: URL, description: "12 meses con 20% OFF e implementación gratis." },
    { "@type": "Offer", name: "Atlas · Anual", price: "3638", priceCurrency: "USD", url: URL, description: "12 meses con 20% OFF e implementación gratis." },
    { "@type": "Offer", name: "Summit · Anual", price: "4598", priceCurrency: "USD", url: URL, description: "12 meses con 20% OFF e implementación gratis." },
    { "@type": "Offer", name: "Vortex", price: "279", priceCurrency: "USD", url: URL },
    { "@type": "Offer", name: "Atlas", price: "379", priceCurrency: "USD", url: URL },
    { "@type": "Offer", name: "Summit", price: "479", priceCurrency: "USD", url: URL },
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
