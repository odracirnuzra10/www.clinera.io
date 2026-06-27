"use client";

import Link from "next/link";
import { CnnLogo, CtaPrimary, GRAD } from "@/components/brand-v3/Brand";
import { useReveal } from "@/components/home-v3/sections";

/* ============================================================
   PRENSA — Clinera en los medios
   Hub de apariciones en prensa. Pieza destacada: entrevista CNN.
   ============================================================ */

type PressItem = {
  id: string;
  outlet: string;
  outletColor: string;
  date: string;
  title: string;
  description: string;
  vimeoId: string;
  ratio: number; // padding-top % para el wrapper responsive
};

const FEATURED: PressItem = {
  id: "cnn-entrevista",
  outlet: "CNN",
  outletColor: "#F23A30",
  date: "Junio 2026",
  title: "Un gran paso para Clinera.",
  description:
    "Ricardo Oyarzún, fundador de Clinera, fue entrevistado por CNN sobre cómo la inteligencia artificial está transformando la atención de las clínicas en LATAM: agendamiento por WhatsApp 24/7, reducción de no-shows y un empleado digital que nunca descansa. Un reconocimiento que confirma hacia dónde vamos.",
  vimeoId: "1205127087",
  ratio: 56.25,
};

export default function PrensaV3() {
  useReveal();
  return (
    <>
      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.in {
          opacity: 1;
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0ms !important;
            transition-duration: 0ms !important;
          }
        }
        @media (max-width: 720px) {
          main > section {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .prensa-hero-title {
            font-size: 38px !important;
          }
        }
      `}</style>

      <PrensaHero />
      <FeaturedVideo item={FEATURED} />
      <MasEnCamino />
      <PrensaCta />
    </>
  );
}

/* ---------- Hero ---------- */
function PrensaHero() {
  return (
    <section
      style={{
        padding: "84px 80px 40px",
        background: "#fff",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div
          className="reveal"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#6B7280",
            marginBottom: 26,
          }}
        >
          <span
            style={{
              width: 24,
              height: 1,
              background: "linear-gradient(90deg,#3B82F6,#D946EF)",
            }}
          />
          Prensa
          <span
            style={{
              width: 24,
              height: 1,
              background: "linear-gradient(90deg,#D946EF,#3B82F6)",
            }}
          />
        </div>

        <h1
          className="reveal prensa-hero-title"
          style={{
            fontFamily: "Inter",
            fontSize: 54,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1.04,
            margin: "0 0 20px",
            color: "#0A0A0A",
          }}
        >
          Clinera en la{" "}
          <span
            style={{
              background: GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            prensa
          </span>
          .
        </h1>

        <p
          className="reveal"
          style={{
            fontFamily: "Inter",
            fontSize: 18,
            lineHeight: 1.6,
            color: "#4B5563",
            margin: "0 auto",
            maxWidth: 560,
          }}
        >
          Lo que dicen los medios sobre cómo Clinera está cambiando la forma en
          que operan las clínicas en LATAM.
        </p>
      </div>
    </section>
  );
}

/* ---------- Video destacado ---------- */
function FeaturedVideo({ item }: { item: PressItem }) {
  return (
    <section style={{ padding: "32px 80px 56px", background: "#fff" }}>
      <div className="reveal" style={{ maxWidth: 920, margin: "0 auto" }}>
        {/* meta línea: outlet + fecha */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            marginBottom: 22,
          }}
        >
          <CnnLogo height={30} color={item.outletColor} />
          <span
            style={{
              width: 1,
              height: 20,
              background: "#E5E7EB",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11.5,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9CA3AF",
            }}
          >
            {item.date}
          </span>
        </div>

        {/* player */}
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,.08)",
            boxShadow: "0 40px 90px -28px rgba(0,0,0,.35)",
            background: "#000",
          }}
        >
          <div style={{ padding: `${item.ratio}% 0 0 0`, position: "relative" }}>
            <iframe
              src={`https://player.vimeo.com/video/${item.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
              title={`${item.outlet} — ${item.title}`}
            />
          </div>
        </div>

        {/* contexto */}
        <div style={{ maxWidth: 680, margin: "30px auto 0", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              margin: "0 0 14px",
              color: "#0A0A0A",
            }}
          >
            {item.title}
          </h2>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 16.5,
              lineHeight: 1.65,
              color: "#4B5563",
              margin: 0,
            }}
          >
            {item.description}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Más en camino ---------- */
function MasEnCamino() {
  return (
    <section style={{ padding: "8px 80px 72px", background: "#fff" }}>
      <div
        className="reveal"
        style={{
          maxWidth: 920,
          margin: "0 auto",
          border: "1px dashed #D1D5DB",
          borderRadius: 18,
          padding: "30px 28px",
          textAlign: "center",
          background: "#FAFAFA",
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#10B981",
            marginBottom: 10,
          }}
        >
          Próximamente
        </div>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 16,
            lineHeight: 1.6,
            color: "#4B5563",
            margin: 0,
          }}
        >
          Estamos sumando más apariciones en medios. Pronto verás aquí nuevas
          entrevistas y reportajes sobre Clinera.
        </p>
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
function PrensaCta() {
  return (
    <section style={{ padding: "0 80px 96px", background: "#fff" }}>
      <div
        className="reveal"
        style={{
          maxWidth: 920,
          margin: "0 auto",
          position: "relative",
          overflow: "hidden",
          borderRadius: 24,
          background: "#0A0A0F",
          color: "#fff",
          padding: "52px 48px",
          textAlign: "center",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 80% at 80% 0%, rgba(217,70,239,.22) 0%, transparent 70%),radial-gradient(ellipse 55% 65% at 10% 100%, rgba(59,130,246,.18) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.12,
              margin: "0 0 14px",
            }}
          >
            ¿Quieres ver Clinera en acción?
          </h2>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 16.5,
              lineHeight: 1.6,
              color: "rgba(255,255,255,.72)",
              margin: "0 auto 26px",
              maxWidth: 460,
            }}
          >
            Agenda una demo y te mostramos en vivo cómo un empleado digital
            atiende, agenda y cobra por WhatsApp 24/7.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <CtaPrimary as={Link} href="/demo" style={{ padding: "14px 24px", fontSize: 15 }}>
              Ver una demo
            </CtaPrimary>
            <Link
              href="/planes"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "Inter",
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                textDecoration: "none",
                background: "rgba(255,255,255,.07)",
                border: "1px solid rgba(255,255,255,.16)",
                borderRadius: 10,
                padding: "14px 24px",
              }}
            >
              Ver planes
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
