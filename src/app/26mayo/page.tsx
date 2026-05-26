import React from "react";
import type { Metadata } from "next";
import ModelComparison from "./_components/ModelComparison";
import TokenTable from "./_components/TokenTable";
import LimitPolicy from "./_components/LimitPolicy";
import AtRiskClients from "./_components/AtRiskClients";
import Workshop from "./_components/Workshop";
import NextSteps from "./_components/NextSteps";

const outfitFont = { fontFamily: "'Outfit', sans-serif" };
const dmMonoFont = { fontFamily: "'DM Mono', monospace" };

export const metadata: Metadata = {
  title: "Activación de IA · 26 de mayo · Clinera",
  description: "Plan de activación efectiva de límites de consumo de IA y migración a Kimi K2.6.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PresentationPage() {
  return (
    <main className="min-h-screen bg-[#111318] text-zinc-100 selection:bg-zinc-800">
      {/* Editorial Header bar */}
      <header className="border-b border-zinc-900 bg-[#12141a]/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <span 
            className="text-xs tracking-widest text-zinc-400 font-medium"
            style={outfitFont}
          >
            CLINERA MEMORANDUM INTERNO
          </span>
          <span 
            className="text-xs text-zinc-500 font-mono"
            style={dmMonoFont}
          >
            v2.0-STERILE
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-block mb-4">
            <span 
              className="text-sm font-semibold tracking-wider text-zinc-400 font-mono"
              style={dmMonoFont}
            >
              26 de mayo, 2026
            </span>
          </div>

          <h1 
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-[#009FE3] via-[#7C3AED] to-[#C850C0] bg-clip-text text-transparent"
            style={outfitFont}
          >
            Activación efectiva de IA en Clinera
          </h1>

          <p className="text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            El 1 de junio entra en vigencia la estructura de límites de consumo de tokens y el paso definitivo a Kimi K2.6 en producción.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <ModelComparison />
      <TokenTable />
      <LimitPolicy />
      <AtRiskClients />
      <Workshop />
      <NextSteps />

      {/* Footer metadata */}
      <footer className="py-12 bg-[#12141a] text-center border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs text-zinc-500 leading-normal" style={outfitFont}>
            Reunión estratégica de equipo · Clinera.io · Solo para uso interno de operadores autorizados.
          </p>
        </div>
      </footer>
    </main>
  );
}
