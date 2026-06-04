import React from "react";
import SlideHeader from "./SlideHeader";

interface Mode {
  name: string;
  model: string;
  desc: string;
  traits: string[];
  accent: string;
  glow: string;
}

const modes: Mode[] = [
  {
    name: "Eficiente",
    model: "Gemini 3.0 Flash",
    desc: "El modo más económico. Responde y agenda en flujos guiados, pero no ejecuta acciones por sí solo: no incluye capacidades agénticas.",
    traits: ["Sin funciones agénticas", "Costo más bajo"],
    accent: "var(--cyan)",
    glow: "rgba(0,212,255,0.16)",
  },
  {
    name: "Agentic",
    model: "Kimi K2.6",
    desc: "El punto de equilibrio entre capacidades y costo. Agente resolutivo que agenda, re-agenda y coordina de forma autónoma con un consumo intermedio.",
    traits: ["Equilibrio función / costo", "Autonomía completa"],
    accent: "var(--violet)",
    glow: "rgba(184,71,255,0.16)",
  },
  {
    name: "Agentic Pro",
    model: "Claude Sonnet 4.6",
    desc: "El más rápido y potente. Acciones autónomas con la mejor velocidad de respuesta. Máxima capacidad y, también, el costo más alto.",
    traits: ["Máxima velocidad", "Costo más alto"],
    accent: "var(--magenta)",
    glow: "rgba(255,71,217,0.16)",
  },
];

export default function SchedulingModes() {
  return (
    <section id="modos" className="slide">
      <SlideHeader
        num="02"
        eyebrow="Operación · desde el 1 de junio"
        title={
          <>
            Los <span className="gradient-text">3 modos</span> de agendamiento
          </>
        }
        lead="Desde el 1 de junio, cada clínica opera en uno de tres modos. Cada modo está respaldado por un modelo de IA distinto y define el equilibrio entre costo, velocidad y autonomía del agente."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modes.map((m, i) => (
          <div key={m.name} className="card card-hover p-8 flex flex-col relative overflow-hidden">
            {/* glow superior */}
            <div
              className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full"
              style={{ background: `radial-gradient(circle, ${m.glow} 0%, transparent 70%)` }}
            />

            <div className="flex items-center justify-between mb-7">
              <span className="stat-value text-2xl" style={{ color: m.accent }}>
                0{i + 1}
              </span>
              <span
                className="chip"
                style={{
                  borderColor: m.accent,
                  color: m.accent,
                  background: m.glow,
                }}
              >
                {m.model}
              </span>
            </div>

            <h3 className="text-xl font-bold mb-4" style={{ color: "var(--ink)" }}>
              {m.name}
            </h3>

            <p className="text-[0.95rem] leading-[1.8] mb-8" style={{ color: "var(--ink-soft)" }}>
              {m.desc}
            </p>

            <div className="flex flex-wrap gap-2.5 mt-auto pt-6" style={{ borderTop: "1px solid var(--border)" }}>
              {m.traits.map((t) => (
                <span key={t} className="chip chip-muted">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm mt-8 leading-[1.8]" style={{ color: "var(--ink-faint)" }}>
        El modo asignado determina el costo por token y, por lo tanto, el límite de consumo que
        aplica a cada cuenta (ver <a href="#limites" style={{ color: "var(--cyan)" }}>Política de límites</a>).
      </p>
    </section>
  );
}
