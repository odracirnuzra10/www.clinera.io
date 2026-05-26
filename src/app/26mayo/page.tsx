import React from "react";
import type { Metadata } from "next";
import "./styles.css";
import ModelComparison from "./_components/ModelComparison";
import TokenTable from "./_components/TokenTable";
import LimitPolicy from "./_components/LimitPolicy";
import AtRiskClients from "./_components/AtRiskClients";
import Workshop from "./_components/Workshop";
import NextSteps from "./_components/NextSteps";

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
    <main className="min-h-screen bg-[#111318] text-zinc-100 selection:bg-zinc-800 font-outfit pb-16">
      {/* Editorial Header bar */}
      <header className="border-b border-zinc-900 bg-[#12141a]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-zinc-100 tracking-tight text-lg font-outfit">
              Clinera
            </span>
            <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full inline-block" />
          </div>
          <div className="flex items-center gap-4">
            <span className="kicker-label font-mono-dm text-zinc-400">
              Memorando Interno
            </span>
            <span className="text-zinc-700 font-mono-dm">|</span>
            <span className="text-[11px] text-zinc-500 font-mono-dm uppercase tracking-wider">
              26.05.2026
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 border-b border-[#222530] bg-[#12141a]/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="kicker-label font-mono-dm mb-4 text-[#7C3AED] uppercase font-bold">
            Operaciones & Tecnología
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 brand-gradient-text font-outfit leading-none py-1">
            Activación efectiva de IA en Clinera
          </h1>

          <p className="text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed font-outfit">
            El 1 de junio entra en vigencia la estructura de límites de consumo de tokens y el paso definitivo a Kimi K2.6 en producción.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        <ModelComparison />
        <TokenTable />
        <LimitPolicy />
        <AtRiskClients />
        <Workshop />
        <NextSteps />
      </div>

      {/* Footer metadata */}
      <footer className="py-12 bg-[#12141a] text-center border-t border-zinc-900 mt-20">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs text-zinc-500 leading-normal font-outfit">
            Reunión estratégica de equipo · Clinera.io · Solo para uso interno de operadores autorizados.
          </p>
        </div>
      </footer>
    </main>
  );
}
