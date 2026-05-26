import React from "react";
import type { Metadata } from "next";
import "./styles.css";
import DeckProgress from "./_components/DeckProgress";
import ModelComparison from "./_components/ModelComparison";
import SchedulingModes from "./_components/SchedulingModes";
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

const agenda = [
  { id: "modelo", label: "El cambio de modelo", desc: "De mensajería pasiva a agente" },
  { id: "modos", label: "Los 3 modos de agendamiento", desc: "Eficiente · Agentic · Agentic Flash" },
  { id: "impacto", label: "El impacto económico", desc: "Consumo y costo real por cliente" },
  { id: "limites", label: "Política de límites", desc: "Cronograma de ajustes progresivos" },
  { id: "riesgo", label: "Clientes en riesgo", desc: "Cuentas críticas para septiembre" },
  { id: "workshop", label: "Workshop de comunicación", desc: "Cómo se lo explicamos al cliente" },
  { id: "acciones", label: "Próximos pasos", desc: "Acciones y responsables" },
];

export default function PresentationPage() {
  return (
    <main className="deck min-h-screen">
      <DeckProgress />

      {/* ── Portada ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* halos */}
        <div
          className="pointer-events-none absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.16) 0%, transparent 65%)" }}
        />
        <div
          className="pointer-events-none absolute -top-20 right-0 h-[30rem] w-[30rem] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,71,217,0.14) 0%, transparent 65%)" }}
        />

        <div className="slide" style={{ paddingTop: "5rem", paddingBottom: "4rem" }}>
          {/* brand row */}
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight">Clinera</span>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--violet)" }} />
            </div>
            <div className="flex items-center gap-3 deck-mono text-[11px]" style={{ color: "var(--ink-faint)" }}>
              <span className="chip chip-muted">Memorando interno</span>
              <span>26.05.2026</span>
            </div>
          </div>

          <div className="eyebrow">
            <span className="num">00</span>
            <span className="dash" />
            Operaciones &amp; Tecnología
          </div>

          <h1
            className="font-extrabold tracking-tight leading-[1.04] mb-6"
            style={{ fontSize: "clamp(2.6rem, 6.5vw, 4.5rem)" }}
          >
            Activación efectiva de <span className="gradient-text">IA</span> en Clinera
          </h1>

          <p className="slide-lead text-balance" style={{ maxWidth: "40rem" }}>
            El 1 de junio entra en vigencia la estructura de límites de consumo de tokens y el paso
            definitivo a <strong style={{ color: "var(--ink)" }}>Kimi K2.6</strong> en producción.
            Esta es la hoja de ruta para que el equipo lo ejecute y lo comunique sin fricción.
          </p>

          {/* Agenda / tabla de contenidos */}
          <div className="mt-16">
            <div className="eyebrow mb-6">
              <span className="dash" />
              Agenda de la reunión
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agenda.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="card card-hover flex items-center gap-4 p-4 group"
                  >
                    <span
                      className="deck-mono text-sm font-bold w-8 shrink-0 text-center"
                      style={{ color: "var(--ink-faint)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold" style={{ color: "var(--ink)" }}>
                        {item.label}
                      </span>
                      <span className="block text-sm" style={{ color: "var(--ink-soft)" }}>
                        {item.desc}
                      </span>
                    </span>
                    <span
                      className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                      style={{ color: "var(--ink-soft)" }}
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Slides ───────────────────────────────────────────────── */}
      <ModelComparison />
      <SchedulingModes />
      <TokenTable />
      <LimitPolicy />
      <AtRiskClients />
      <Workshop />
      <NextSteps />

      {/* ── Cierre ───────────────────────────────────────────────── */}
      <footer className="slide text-center" style={{ paddingTop: "4rem", paddingBottom: "5rem" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-base font-extrabold tracking-tight">Clinera</span>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--violet)" }} />
        </div>
        <p className="text-sm" style={{ color: "var(--ink-faint)" }}>
          Reunión estratégica de equipo · Clinera.io · Solo para uso interno de operadores autorizados.
        </p>
      </footer>
    </main>
  );
}
