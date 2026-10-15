import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MejorSoftwarePage } from "@/components/mejor-software/MejorSoftwarePage";
import { getRankingBySlug, PAISES_CON_RUTA } from "@/content/mejor-software";
import { MEJOR_SOFTWARE_HREFLANG } from "@/content/entidad";

const PAIS_LABELS: Record<string, string> = {
  chile: "Chile",
  mexico: "México",
  colombia: "Colombia",
  peru: "Perú",
};

export function generateStaticParams() {
  return PAISES_CON_RUTA.map((pais) => ({ pais }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  const ranking = getRankingBySlug(pais);
  if (!ranking) return {};

  const pageUrl = `https://www.clinera.io/mejor-software-clinicas/${pais}`;
  return {
    title: ranking.metaTitle,
    description: ranking.metaDescription,
    alternates: { canonical: pageUrl, languages: { ...MEJOR_SOFTWARE_HREFLANG } },
    openGraph: {
      type: "article",
      locale: "es_CL",
      url: pageUrl,
      title: ranking.metaTitle,
      description: ranking.metaDescription,
      images: ["/images/og-banner.png"],
      modifiedTime: ranking.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: ranking.metaTitle,
      description: ranking.metaDescription,
      images: ["/images/og-banner.png"],
    },
  };
}

export default async function MejorSoftwareClinicasPaisPage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  const ranking = getRankingBySlug(pais);
  if (!ranking) notFound();

  const label = PAIS_LABELS[pais] ?? pais;
  const pageUrl = `https://www.clinera.io/mejor-software-clinicas/${pais}`;

  return (
    <MejorSoftwarePage
      ranking={ranking}
      pageUrl={pageUrl}
      breadcrumbLabel={label}
    />
  );
}
