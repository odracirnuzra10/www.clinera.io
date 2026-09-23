import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import PodcastLanding from "@/components/podcast/PodcastLanding";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageUpdated } from "@/components/seo/PageUpdated";
import {
  breadcrumbSchema,
  faqSchema,
  orgSchema,
  videoObjectSchema,
  webPageSchema,
} from "@/components/seo/schemas";
import {
  PODCAST_EPISODES,
  PODCAST_SERIES,
  podcastEpisodePath,
  podcastVimeoEmbedUrl,
  publishedPodcastEpisodes,
} from "@/content/podcast";
import { SITE_URL } from "@/content/entidad";

const TITLE = "Clinera Podcast — Cómo escalar una clínica";
const DESCRIPTION = PODCAST_SERIES.description;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PODCAST_SERIES.path}` },
  openGraph: {
    url: `${SITE_URL}${PODCAST_SERIES.path}`,
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "es_CL",
    siteName: "Clinera.io",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Clinera Podcast",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/og-banner.png"],
  },
};

const FAQ = [
  {
    q: "¿Qué es Clinera Podcast?",
    a: "Una serie de cinco capítulos con Ricardo Oyarzún (fundador de Clinera, Método Hebe y Protocolo Lumina) y Jorge Cheul sobre cómo escalar una clínica de forma correcta: operación, caja, equipo, marketing e inteligencia artificial.",
  },
  {
    q: "¿Cuántos capítulos tiene la serie?",
    a: "Cinco. Los capítulos 1 y 2 ya están publicados; los capítulos 3 a 5 se irán subiendo en esta página y en el blog de Clinera.",
  },
  {
    q: "¿Dónde veo los capítulos publicados?",
    a: "En esta página (/podcast) y en el blog: capítulo 1 en https://www.clinera.io/blog/clinera-podcast-1-como-escalar-clinica y capítulo 2 en https://www.clinera.io/blog/clinera-podcast-2-facturacion-no-es-administrar, cada uno con el video embebido de Vimeo.",
  },
  {
    q: "¿De qué habla el capítulo 1?",
    a: "Del origen de Clinera y Método Hebe, del momento correcto para abrir una segunda sucursal y de cinco tips: gente con la misma visión, disciplina financiera y caja, capacitación continua (IA), no despegarse de la operación, y tecnología para crecer sin inflar costos.",
  },
];

function podcastSeriesSchema() {
  const published = publishedPodcastEpisodes();
  return {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    "@id": `${SITE_URL}${PODCAST_SERIES.path}#series`,
    name: PODCAST_SERIES.name,
    description: PODCAST_SERIES.description,
    url: `${SITE_URL}${PODCAST_SERIES.path}`,
    inLanguage: "es-CL",
    genre: ["Business", "Health", "Technology"],
    author: { "@id": "https://clinera.io/#organization" },
    publisher: { "@id": "https://clinera.io/#organization" },
    numberOfEpisodes: PODCAST_SERIES.totalEpisodes,
    episode: published.map((ep) => ({
      "@type": "PodcastEpisode",
      "@id": `${SITE_URL}${PODCAST_SERIES.path}#cap-${ep.number}`,
      name: `Capítulo ${ep.number}: ${ep.title}`,
      description: ep.summary,
      datePublished: ep.date,
      episodeNumber: ep.number,
      duration: ep.durationSeconds
        ? `PT${Math.floor(ep.durationSeconds / 60)}M${ep.durationSeconds % 60}S`
        : undefined,
      url:
        podcastEpisodePath(ep) != null
          ? `${SITE_URL}${podcastEpisodePath(ep)}`
          : `${SITE_URL}${PODCAST_SERIES.path}#cap-${ep.number}`,
    })),
  };
}

function itemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Capítulos de Clinera Podcast",
    numberOfItems: PODCAST_EPISODES.length,
    itemListElement: PODCAST_EPISODES.map((ep, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Capítulo ${ep.number}: ${ep.title}`,
      url:
        ep.status === "published" && podcastEpisodePath(ep)
          ? `${SITE_URL}${podcastEpisodePath(ep)}`
          : `${SITE_URL}${PODCAST_SERIES.path}#cap-${ep.number}`,
    })),
  };
}

export default function PodcastPage() {
  const videos = publishedPodcastEpisodes()
    .map((ep) => {
      const embedUrl = podcastVimeoEmbedUrl(ep);
      if (!embedUrl || !ep.vimeoId) return null;
      return videoObjectSchema({
        name: `Clinera Podcast #${ep.number} — ${ep.title}`,
        description: ep.summary,
        thumbnailUrl: `https://vumbnail.com/${ep.vimeoId}.jpg`,
        uploadDate: ep.date,
        embedUrl,
      });
    })
    .filter((v) => v != null);

  return (
    <>
      <NavV3 />
      <JsonLd
        data={[
          orgSchema,
          webPageSchema({
            path: PODCAST_SERIES.path,
            name: TITLE,
            description: DESCRIPTION,
          }),
          breadcrumbSchema([
            { name: "Inicio", url: `${SITE_URL}/` },
            { name: "Podcast", url: `${SITE_URL}${PODCAST_SERIES.path}` },
          ]),
          podcastSeriesSchema(),
          itemListSchema(),
          faqSchema(FAQ),
          ...videos,
        ]}
      />
      <main>
        <PodcastLanding />
        <PageUpdated path={PODCAST_SERIES.path} />
      </main>
      <FooterV3 />
    </>
  );
}
