import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, orgSchema, webPageSchema } from "@/components/seo/schemas";

const TITLE = "Centro de ayuda";
const DESCRIPTION =
  "FAQ y tutoriales de Clinera: WhatsApp Business API, AURA, agenda, ficha clínica e implementación. Si no encuentras la respuesta, agenda una reunión.";

const AYUDA_FAQ = [
  {
    q: "¿Cómo conectar WhatsApp Business API?",
    a: "En el onboarding te vinculamos el número oficial de WhatsApp Business API a AURA. Si ya usas WhatsApp Business, coexisten: AURA atiende por API y el equipo sigue el chat de la app.",
  },
  {
    q: "¿Cómo personalizar el tono de AURA?",
    a: "En Configuración > IA defines si AURA habla formal o cercano, y cargas el nombre de la clínica, tratamientos y horarios. El tono se aplica a todas las conversaciones.",
  },
  {
    q: "¿Clinera se integra con AgendaPro, Reservo o Dentalink?",
    a: "No. Clinera opera sobre su propia agenda, fichas y pagos. La migración de datos se hace en el onboarding. Clinera sí expone Webhooks + API hacia n8n, Make y Zapier.",
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.clinera.io/ayuda" },
  openGraph: {
    url: "https://www.clinera.io/ayuda",
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
  },
};

export default function AyudaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          webPageSchema({
            path: "/ayuda",
            name: TITLE,
            description: DESCRIPTION,
          }),
          faqSchema(AYUDA_FAQ),
        ]}
      />
      {children}
    </>
  );
}
