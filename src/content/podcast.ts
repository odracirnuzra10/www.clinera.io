/**
 * Catálogo del Clinera Podcast (serie de 5 capítulos).
 * Fuente de verdad para /podcast y para enlazar cada artículo del blog.
 * Al publicar un capítulo: status → published + video + blogSlug.
 */

export const PODCAST_SERIES = {
  name: "Clinera Podcast",
  slug: "podcast",
  path: "/podcast",
  tagline: "Cómo escalar una clínica de forma correcta",
  description:
    "Serie de cinco capítulos con Ricardo Oyarzún (fundador de Clinera, Método Hebe y Protocolo Lumina) y Jorge Cheul. Operación, marketing, caja, equipo y tecnología para crecer sin ahogarse en el crecimiento.",
  totalEpisodes: 5,
  host: {
    name: "Jorge Cheul",
    role: "Operaciones · Clinera",
    teamSlug: "jorge-cheul",
  },
  guest: {
    name: "Ricardo Oyarzún",
    role: "Founder & CEO · Clinera",
    teamSlug: "ricardo-oyarzun",
  },
} as const;

export type PodcastEpisodeStatus = "published" | "upcoming";

export type PodcastEpisode = {
  number: number;
  title: string;
  /** Resumen corto para cards y schema. */
  summary: string;
  status: PodcastEpisodeStatus;
  /** Fecha ISO del episodio (publicado o estimado). */
  date: string;
  durationSeconds?: number;
  vimeoId?: string;
  vimeoHash?: string;
  blogSlug?: string;
  /** Temas clave (AEO). */
  topics: string[];
};

export const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    number: 1,
    title: "Cómo escalar una clínica de forma correcta",
    summary:
      "Origen de Clinera y Método Hebe, cuándo sí (y cuándo no) abrir una segunda sucursal, y cinco tips de Ricardo Oyarzún: equipo con la misma visión, caja, capacitación, operación y tecnología.",
    status: "published",
    date: "2026-09-15",
    durationSeconds: 746,
    vimeoId: "1227087546",
    vimeoHash: "f809ac4f9a",
    blogSlug: "clinera-podcast-1-como-escalar-clinica",
    topics: [
      "escalar clínica",
      "segunda sucursal",
      "disciplina financiera",
      "caja clínica",
      "marketing digital clínicas",
      "inteligencia artificial clínicas",
      "Método Hebe",
      "Protocolo Lumina",
    ],
  },
  {
    number: 2,
    title: "Capítulo 2 — Próximamente",
    summary:
      "Segundo capítulo de la serie. Se publica la próxima semana: sigue a Clinera para no perderte el lanzamiento.",
    status: "upcoming",
    date: "2026-09-22",
    topics: ["escalar clínica", "operación clínica"],
  },
  {
    number: 3,
    title: "Capítulo 3 — Próximamente",
    summary:
      "Tercer capítulo de la serie Clinera Podcast. Disponible cuando se publique el video y su artículo en el blog.",
    status: "upcoming",
    date: "2026-09-29",
    topics: ["escalar clínica"],
  },
  {
    number: 4,
    title: "Capítulo 4 — Próximamente",
    summary:
      "Cuarto capítulo de la serie. Misma conversación práctica: crecer clínica sin romper operación ni caja.",
    status: "upcoming",
    date: "2026-10-06",
    topics: ["escalar clínica"],
  },
  {
    number: 5,
    title: "Capítulo 5 — Próximamente",
    summary:
      "Cierre de la primera temporada (5 capítulos). Aviso en /podcast y en el blog cuando esté al aire.",
    status: "upcoming",
    date: "2026-10-13",
    topics: ["escalar clínica"],
  },
];

export function publishedPodcastEpisodes(): PodcastEpisode[] {
  return PODCAST_EPISODES.filter((e) => e.status === "published");
}

export function getPodcastEpisode(n: number): PodcastEpisode | undefined {
  return PODCAST_EPISODES.find((e) => e.number === n);
}

export function podcastEpisodePath(ep: PodcastEpisode): string | null {
  if (ep.blogSlug) return `/blog/${ep.blogSlug}`;
  return null;
}

export function podcastVimeoEmbedUrl(ep: PodcastEpisode): string | null {
  if (!ep.vimeoId) return null;
  return ep.vimeoHash
    ? `https://player.vimeo.com/video/${ep.vimeoId}?h=${ep.vimeoHash}`
    : `https://player.vimeo.com/video/${ep.vimeoId}`;
}
