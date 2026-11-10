"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { TEAM_MEMBERS } from "@/content/team";

const ACCENT = "#7C3AED";
const TEXT = "#111111";
const MUTED = "#6B6B6B";
const BORDER = "#EAEAEA";
const HOVER_BORDER = "#D4D4D4";
const BG = "#FBFBFA";

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M2.5 7h9M7.5 3.5 11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={dir === "prev" ? "M11 4.5 6.5 9 11 13.5" : "M7 4.5 11.5 9 7 13.5"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Bloque "Implementación asistida" del home.
 * Retratos en carrusel horizontal (scroll-snap + flechas).
 * Datos en `src/content/team.ts`.
 */
export function TeamSection() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [paused, setPaused] = useState(false);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-team-card]");
    if (!card) return;
    const gap = 16;
    const cardW = card.offsetWidth + gap;
    const visible = Math.max(1, Math.round(el.clientWidth / cardW));
    const pages = Math.max(1, TEAM_MEMBERS.length - visible + 1);
    setPageCount(pages);
    const idx = Math.round(el.scrollLeft / cardW);
    setPage(Math.min(pages - 1, Math.max(0, idx)));
  }, []);

  const scrollToPage = useCallback((next: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-team-card]");
    if (!card) return;
    const gap = 16;
    const cardW = card.offsetWidth + gap;
    const clamped = Math.min(pageCount - 1, Math.max(0, next));
    el.scrollTo({ left: clamped * cardW, behavior: "smooth" });
    setPage(clamped);
  }, [pageCount]);

  useEffect(() => {
    measure();
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Auto-avance suave; se pausa al hover / focus.
  useEffect(() => {
    if (paused || pageCount <= 1) return;
    const id = window.setInterval(() => {
      setPage((p) => {
        const next = p + 1 >= pageCount ? 0 : p + 1;
        const el = trackRef.current;
        const card = el?.querySelector<HTMLElement>("[data-team-card]");
        if (el && card) {
          const cardW = card.offsetWidth + 16;
          el.scrollTo({ left: next * cardW, behavior: "smooth" });
        }
        return next;
      });
    }, 4200);
    return () => window.clearInterval(id);
  }, [paused, pageCount]);

  return (
    <section
      id="equipo-implementacion"
      aria-labelledby="team-heading"
      style={{
        background: BG,
        borderTop: `1px solid ${BORDER}`,
        padding: "96px 80px",
      }}
    >
      <style jsx>{`
        .team-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.4fr) minmax(0, 0.6fr);
          gap: 56px;
          align-items: start;
          max-width: 72rem;
          margin: 0 auto;
        }
        .team-carousel {
          position: relative;
          min-width: 0;
        }
        .team-track {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 4px 2px 12px;
          list-style: none;
          margin: 0;
        }
        .team-track::-webkit-scrollbar {
          display: none;
        }
        .team-card {
          flex: 0 0 calc((100% - 32px) / 3);
          scroll-snap-align: start;
          border: 1px solid ${BORDER};
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          transition: border-color 200ms ease, transform 200ms ease;
        }
        .team-card:hover {
          border-color: ${HOVER_BORDER};
          transform: scale(1.02);
        }
        .team-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 8px;
        }
        .team-dots {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .team-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          border: 0;
          padding: 0;
          background: ${BORDER};
          cursor: pointer;
          transition: background 160ms ease, width 160ms ease;
        }
        .team-dot[aria-current="true"] {
          background: ${ACCENT};
          width: 20px;
        }
        .team-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid ${BORDER};
          background: #fff;
          color: ${TEXT};
          cursor: pointer;
          transition: border-color 160ms ease, color 160ms ease;
        }
        .team-arrow:hover:not(:disabled) {
          border-color: ${ACCENT};
          color: ${ACCENT};
        }
        .team-arrow:disabled {
          opacity: 0.35;
          cursor: default;
        }
        :global(a.team-primary) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: ${TEXT};
          color: #fff;
          border: 0;
          border-radius: 8px;
          padding: 13px 22px;
          font-family: Outfit, sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.01em;
          text-decoration: none;
          line-height: 1;
          transition: transform 120ms ease;
        }
        :global(a.team-primary:active) {
          transform: scale(0.98);
        }
        :global(a.team-secondary) {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          color: ${TEXT};
          border: 1px solid ${BORDER};
          border-radius: 8px;
          padding: 13px 18px;
          font-family: Outfit, sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.01em;
          text-decoration: none;
          line-height: 1;
          transition: color 160ms ease, border-color 160ms ease;
        }
        :global(a.team-secondary:hover) {
          color: ${ACCENT};
          border-color: ${ACCENT};
        }
        @media (max-width: 900px) {
          .team-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .team-card {
            flex-basis: calc((100% - 16px) / 2);
          }
        }
        @media (max-width: 720px) {
          section {
            padding-left: 32px !important;
            padding-right: 32px !important;
            padding-top: 72px !important;
            padding-bottom: 72px !important;
          }
          .team-card {
            flex-basis: 78%;
          }
          .team-track {
            gap: 12px;
          }
        }
      `}</style>

      <div className="team-grid">
        <div className="reveal" style={{ maxWidth: 420 }}>
          <p
            style={{
              margin: 0,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: ACCENT,
            }}
          >
            Implementación asistida
          </p>
          <h2
            id="team-heading"
            style={{
              margin: "16px 0 0",
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(28px, 3.2vw, 40px)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
              color: TEXT,
            }}
          >
            Un equipo de especialistas implementa Clinera en tu clínica por ti.
          </h2>
          <p
            style={{
              margin: "16px 0 0",
              fontFamily: "Outfit, sans-serif",
              fontSize: 17,
              fontWeight: 400,
              lineHeight: 1.55,
              color: MUTED,
            }}
          >
            Configuramos tus agentes, conectamos tu WhatsApp y migramos tu
            agenda. Tú sigues atendiendo pacientes; nosotros dejamos todo
            funcionando.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 28,
            }}
          >
            <Link
              href="/hablar-con-ventas"
              className="team-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: TEXT,
                color: "#fff",
                border: 0,
                borderRadius: 8,
                padding: "13px 22px",
                fontFamily: "Outfit, sans-serif",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                textDecoration: "none",
                lineHeight: 1,
              }}
            >
              Agenda una demo
            </Link>
            <Link
              href="/estructura"
              className="team-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                padding: "13px 18px",
                fontFamily: "Outfit, sans-serif",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                textDecoration: "none",
                lineHeight: 1,
              }}
            >
              Conoce cómo trabajamos
              <ArrowIcon />
            </Link>
          </div>
        </div>

        <div
          className="team-carousel reveal"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <ul
            ref={trackRef}
            className="team-track"
            aria-label="Equipo de implementación"
          >
            {TEAM_MEMBERS.map((member) => (
              <li
                key={member.slug}
                data-team-card
                className="team-card"
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "1 / 1",
                    background: "#fff",
                  }}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 720px) 78vw, (max-width: 900px) 45vw, 180px"
                    loading="lazy"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "12px 12px 14px" }}>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "Outfit, sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      color: TEXT,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.25,
                    }}
                  >
                    {member.name}
                  </p>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontFamily: "Outfit, sans-serif",
                      fontSize: 12,
                      fontWeight: 400,
                      color: MUTED,
                      lineHeight: 1.35,
                    }}
                  >
                    {member.role}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="team-nav">
            <div className="team-dots" role="tablist" aria-label="Páginas del carrusel">
              {Array.from({ length: pageCount }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className="team-dot"
                  aria-label={`Ir a la posición ${i + 1}`}
                  aria-current={i === page ? "true" : undefined}
                  onClick={() => scrollToPage(i)}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="team-arrow"
                aria-label="Anterior"
                disabled={page <= 0}
                onClick={() => scrollToPage(page - 1)}
              >
                <Chevron dir="prev" />
              </button>
              <button
                type="button"
                className="team-arrow"
                aria-label="Siguiente"
                disabled={page >= pageCount - 1}
                onClick={() => scrollToPage(page + 1)}
              >
                <Chevron dir="next" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
