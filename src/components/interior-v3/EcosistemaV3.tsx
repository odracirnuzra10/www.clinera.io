"use client";

// ============================================================================
// /ecosistema (Ricardo, 20-oct-2026): una de las dos entradas del menú
// (Software y Ecosistema). Explica el Ecosistema: Vortex + marketing de
// performance, con la metodología PMFC. La publicidad la paga la clínica aparte.
// ============================================================================

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { CtaPrimary, Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { FinalCTA, useReveal } from "@/components/home-v3/sections";
import MarketingPerformance from "@/components/marketing/MarketingPerformance";
import PmfcSection from "@/components/pmfc/PmfcSection";
import PlanesVigentes from "@/components/pricing/PlanesVigentes";
import { CTA_VENTAS_LABEL, PLANES, agendaHref } from "@/content/planes";

const noop = () => () => {};
const readSearch = () => window.location.search;
const readSearchServer = () => "";

const ECOSISTEMA = PLANES.find((p) => p.id === "ecosistema")!;

export default function EcosistemaV3() {
  useReveal();
  return (
    <>
      <style jsx global>{`
        .reveal { opacity: 0; transform: translateY(12px); transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
        .reveal.in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0ms !important; transition-duration: 0ms !important; } }
        @media (max-width: 720px) {
          main > section { padding-left: 32px !important; padding-right: 32px !important; }
        }
      `}</style>
      <EcosistemaHero />
      <PmfcSection />
      <MarketingPerformance />
      <PlanesVigentes titulo="Dos formas de trabajar" tituloAcento="con Clinera." bajada="Vortex es el software con IA. El Ecosistema es Vortex más el equipo de marketing que te trae pacientes." />
      <FinalCTA />
    </>
  );
}

function EcosistemaHero() {
  const search = useSyncExternalStore(noop, readSearch, readSearchServer);
  return (
    <section data-ecosistema-hero style={{ padding: "72px 80px 24px", background: "linear-gradient(180deg,#FFFFFF 0%,#FAFAFA 100%)" }}>
      <div className="reveal" style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <Eyebrow>Ecosistema Clinera</Eyebrow>
        <h1
          className="ecosistema-hero-title"
          style={{ fontFamily: "Inter", fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.03, margin: "16px 0 16px", color: "#0A0A0A" }}
        >
          Crece con un equipo detrás,{" "}
          <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            no solo con un software.
          </span>
        </h1>
        <p style={{ fontFamily: "Inter", fontSize: 18, color: "#4B5563", lineHeight: 1.55, margin: "0 auto 26px", maxWidth: 680 }}>
          El Ecosistema es Vortex, el software con IA, más un equipo de marketing que trabaja contigo con la
          metodología PMFC: propuesta de valor, marketing, framework comercial y Clinera. US$ {ECOSISTEMA.monthlyUsd} al
          mes, sin costo de implementación. La inversión en publicidad se paga aparte.
        </p>
        <CtaPrimary as={Link} href={agendaHref("ambas", search)} style={{ padding: "15px 26px", fontSize: 16 }}>
          {CTA_VENTAS_LABEL} <span>→</span>
        </CtaPrimary>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.ecosistema-hero-title) { font-size: 38px !important; }
        }
      `}</style>
    </section>
  );
}
