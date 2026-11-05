import type { Metadata } from "next";
import ContrataWizard from "@/components/contrata/ContrataWizard";

export const dynamic = "force-dynamic";

// /contrata (Ricardo, 5-nov-2026): wizard de contratación con el cascarón de /agenda.
// noindex: es el destino de «Contratar» en /kimi y /home-nuevo, no una página de precios.
export const metadata: Metadata = {
  title: "Contrata Clinera",
  description:
    "Elige Flux, Hex o Vortex y contrata Clinera. El 50% por 3 meses aparece después de tus datos.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.clinera.io/contrata" },
};

export default async function ContrataPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[] }>;
}) {
  const { plan } = await searchParams;
  const raw = (Array.isArray(plan) ? plan[0] : plan ?? "").toLowerCase();
  return <ContrataWizard planInicial={raw} />;
}
