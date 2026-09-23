"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import VimeoEmbed from "@/components/blog/VimeoEmbed";
import { CtaPrimary, Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { useReveal } from "@/components/home-v3/sections";
import {
  PODCAST_EPISODES,
  PODCAST_SERIES,
  featuredPodcastEpisode,
  podcastEpisodePath,
  type PodcastEpisode,
} from "@/content/podcast";

function fmtDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function fmtDuration(seconds?: number) {
  if (!seconds) return null;
  const m = Math.round(seconds / 60);
  return `${m} min`;
}

export default function PodcastLanding() {
  useReveal();
  const featured = featuredPodcastEpisode();

  return (
    <>
      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(12px);
          transition:
            opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.in {
          opacity: 1;
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
        .podcast-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (max-width: 720px) {
          .podcast-grid {
            grid-template-columns: 1fr;
          }
          .podcast-pad {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
        }
      `}</style>

      <Hero />
      {featured ? <FeaturedEpisode episode={featured} /> : null}
      <EpisodeList episodes={PODCAST_EPISODES} />
      <SeriesAbout />
      <FinalCta />
    </>
  );
}

function Hero() {
  return (
    <section
      className="podcast-pad"
      style={{
        padding: "96px 48px 64px",
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,.12), transparent 60%), #FAFAF8",
        borderBottom: "1px solid #EEECEA",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }} className="reveal">
        <Eyebrow>Serie · 5 capítulos</Eyebrow>
        <h1
          data-entity-phrase
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 750,
            letterSpacing: "-0.035em",
            lineHeight: 1.08,
            color: "#0A0A0A",
            margin: "16px 0 18px",
          }}
        >
          {PODCAST_SERIES.name}
        </h1>
        <p
          style={{
            fontSize: 20,
            lineHeight: 1.45,
            color: "#374151",
            maxWidth: 640,
            margin: "0 0 12px",
            fontWeight: 550,
          }}
        >
          {PODCAST_SERIES.tagline}
        </p>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.65,
            color: "#4B5563",
            maxWidth: 640,
            margin: "0 0 28px",
          }}
        >
          {PODCAST_SERIES.description}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
            fontFamily: "JetBrains Mono, ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#6B7280",
          }}
        >
          <span>
            Con {PODCAST_SERIES.guest.name} · {PODCAST_SERIES.host.name}
          </span>
          <span aria-hidden>·</span>
          <span>{PODCAST_SERIES.totalEpisodes} episodios</span>
        </div>
      </div>
    </section>
  );
}

function FeaturedEpisode({ episode }: { episode: PodcastEpisode }) {
  const blogHref = podcastEpisodePath(episode);
  return (
    <section
      id={`cap-${episode.number}`}
      className="podcast-pad"
      style={{ padding: "64px 48px", background: "#fff" }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }} className="reveal">
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(124,58,237,.08)",
            color: "#7C3AED",
            fontFamily: "JetBrains Mono, ui-monospace, monospace",
            fontSize: 11,
            fontWeight: 650,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          Capítulo {episode.number} · Disponible
        </div>
        <h2
          style={{
            fontSize: "clamp(26px, 3.5vw, 36px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            margin: "0 0 12px",
            color: "#0A0A0A",
          }}
        >
          {episode.title}
        </h2>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.65,
            color: "#4B5563",
            margin: "0 0 10px",
            maxWidth: 680,
          }}
        >
          {episode.summary}
        </p>
        <p
          style={{
            fontFamily: "JetBrains Mono, ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#6B7280",
            margin: "0 0 24px",
          }}
        >
          {fmtDate(episode.date)}
          {fmtDuration(episode.durationSeconds)
            ? ` · ${fmtDuration(episode.durationSeconds)}`
            : ""}
        </p>

        {episode.vimeoId ? (
          <VimeoEmbed
            videoId={episode.vimeoId}
            hash={episode.vimeoHash}
            title={`Clinera Podcast #${episode.number} — ${episode.title}`}
            aspect="16 / 9"
          />
        ) : null}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 8,
            alignItems: "center",
          }}
        >
          {blogHref ? (
            <Link
              href={blogHref}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 18px",
                borderRadius: 10,
                background: GRAD,
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              Leer el artículo del capítulo →
            </Link>
          ) : null}
          <Link
            href="/agenda"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#7C3AED",
              textDecoration: "none",
            }}
          >
            Agendar reunión con Clinera
          </Link>
        </div>
      </div>
    </section>
  );
}

function EpisodeList({ episodes }: { episodes: PodcastEpisode[] }) {
  return (
    <section
      id="capitulos"
      className="podcast-pad"
      style={{
        padding: "56px 48px 72px",
        background: "#FAFAF8",
        borderTop: "1px solid #EEECEA",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <h2
          className="reveal"
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: "0 0 8px",
          }}
        >
          Los 5 capítulos
        </h2>
        <p
          className="reveal"
          style={{
            fontSize: 15,
            color: "#6B7280",
            margin: "0 0 28px",
            maxWidth: 560,
            lineHeight: 1.55,
          }}
        >
          La primera temporada tiene cinco episodios. Los capítulos 1 y 2 ya
          están al aire; los siguientes se publican aquí y en el blog a medida
          que salen.
        </p>
        <div className="podcast-grid">
          {episodes.map((ep) => (
            <EpisodeCard key={ep.number} episode={ep} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EpisodeCard({ episode }: { episode: PodcastEpisode }) {
  const href =
    podcastEpisodePath(episode) ??
    (episode.status === "published" ? `#cap-${episode.number}` : null);
  const upcoming = episode.status === "upcoming";
  const inner = (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono, ui-monospace, monospace",
            fontSize: 11,
            fontWeight: 650,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: upcoming ? "#9CA3AF" : "#7C3AED",
          }}
        >
          Cap. {String(episode.number).padStart(2, "0")}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: upcoming ? "#9CA3AF" : "#059669",
          }}
        >
          {upcoming ? "Próximamente" : "Disponible"}
        </span>
      </div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 650,
          letterSpacing: "-0.015em",
          margin: "0 0 8px",
          color: upcoming ? "#6B7280" : "#0A0A0A",
        }}
      >
        {episode.title}
      </h3>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.55,
          color: "#6B7280",
          margin: 0,
        }}
      >
        {episode.summary}
      </p>
      {!upcoming && href ? (
        <span
          style={{
            display: "inline-block",
            marginTop: 14,
            fontSize: 13,
            fontWeight: 600,
            color: "#7C3AED",
          }}
        >
          Ver capítulo →
        </span>
      ) : null}
    </>
  );

  const style: CSSProperties = {
    display: "block",
    padding: 22,
    borderRadius: 14,
    background: "#fff",
    border: "1px solid #EEECEA",
    textDecoration: "none",
    color: "inherit",
    opacity: upcoming ? 0.85 : 1,
  };

  if (href && !upcoming) {
    const isHash = href.startsWith("#");
    if (isHash) {
      return (
        <a href={href} className="reveal" style={style}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className="reveal" style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <div className="reveal" style={style} aria-disabled={upcoming || undefined}>
      {inner}
    </div>
  );
}

function SeriesAbout() {
  return (
    <section
      className="podcast-pad"
      style={{
        padding: "64px 48px",
        background: "#fff",
        borderTop: "1px solid #EEECEA",
      }}
    >
      <div
        className="reveal"
        style={{ maxWidth: 720, margin: "0 auto" }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: "0 0 14px",
          }}
        >
          De qué trata esta serie
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#374151", margin: "0 0 14px" }}>
          Clinera Podcast nace desde la operación real: clínicas de estética que
          escalaron (Concón, Vitacura, Los Ángeles), una agencia de marketing
          especializada en salud y un software —Clinera— que une el mundo
          comercial con la agenda, la ficha y la inteligencia artificial.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#374151", margin: "0 0 14px" }}>
          No es un pitch de producto. Es la conversación que Ricardo Oyarzún y
          Jorge Cheul tienen con dueños de clínica que quieren crecer sin
          depender de una sola persona, sin quemar caja y sin quedarse atrás en
          IA.
        </p>
        <ul
          style={{
            margin: 0,
            paddingLeft: 20,
            color: "#374151",
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          <li>
            Casos reales:{" "}
            <Link href="/casos/metodo-hebe" style={{ color: "#7C3AED" }}>
              Método Hebe
            </Link>{" "}
            y{" "}
            <Link href="/casos/protocolo-lumina" style={{ color: "#7C3AED" }}>
              Protocolo Lumina
            </Link>
          </li>
          <li>
            Producto:{" "}
            <Link href="/empleado-digital" style={{ color: "#7C3AED" }}>
              empleados digitales
            </Link>{" "}
            y{" "}
            <Link href="/plataforma" style={{ color: "#7C3AED" }}>
              Clinera O.S.
            </Link>
          </li>
          <li>
            Equipo:{" "}
            <Link href="/equipo" style={{ color: "#7C3AED" }}>
              quién está detrás
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section
      className="podcast-pad"
      style={{
        padding: "72px 48px",
        background:
          "linear-gradient(180deg, #0A0A0A 0%, #141517 100%)",
        color: "#fff",
      }}
    >
      <div
        className="reveal"
        style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}
      >
        <h2
          style={{
            fontSize: "clamp(24px, 3vw, 32px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            margin: "0 0 12px",
          }}
        >
          ¿Quieres escalar con la misma stack que usan Hebe y Lumina?
        </h2>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: "rgba(255,255,255,.72)",
            margin: "0 0 24px",
          }}
        >
          Agenda una reunión: te mostramos cómo Clinera conecta marketing,
          agenda, ficha y empleados digitales en un solo sistema.
        </p>
        <CtaPrimary href="/agenda">Agendar reunión</CtaPrimary>
      </div>
    </section>
  );
}
