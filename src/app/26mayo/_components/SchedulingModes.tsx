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
    desc: "El modo más económico y veloz. Responde y agenda en flujos simples y predecibles, ideal para alto volumen de mensajes con bajo costo por interacción.",
    traits: ["Costo bajo", "Alta velocidad"],
    accent: "var(--cyan)",
    glow: "rgba(0,212,255,0.16)",
  },
  {
    name: "Agentic",
    model: "Kimi K2.6",
    desc: "El agente más resolutivo. Comprende contexto complejo, agenda, re-agenda y coordina de forma autónoma de extremo a extremo. Máxima capacidad, mayor costo.",
    traits: ["Máxima autonomía", "Costo alto"],
    accent: "var(--violet)",
    glow: "rgba(184,71,255,0.16)",
  },
  {
    name: "Agentic Flash",
    model: "Claude Sonnet 4.6",
    desc: "El equilibrio. Acciones autónomas con respuesta rápida y costo intermedio: capacidades de agente sin el consumo del modo Agentic completo.",
    traits: ["Autonomía + velocidad", "Costo medio"],
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {modes.map((m, i) => (
          <div key={m.name} className="card card-hover p-7 flex flex-col relative overflow-hidden">
            {/* glow superior */}
            <div
              className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full"
              style={{ background: `radial-gradient(circle, ${m.glow} 0%, transparent 70%)` }}
            />

            <div className="flex items-center justify-between mb-5">
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

            <h3 className="text-xl font-bold mb-3" style={{ color: "var(--ink)" }}>
              {m.name}
            </h3>

            <p className="text-[0.95rem] leading-relaxed mb-6" style={{ color: "var(--ink-soft)" }}>
              {m.desc}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto pt-5" style={{ borderTop: "1px solid var(--border)" }}>
              {m.traits.map((t) => (
                <span key={t} className="chip chip-muted">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm mt-6 leading-relaxed" style={{ color: "var(--ink-faint)" }}>
        El modo asignado determina el costo por token y, por lo tanto, el límite de consumo que
        aplica a cada cuenta (ver <a href="#limites" style={{ color: "var(--cyan)" }}>Política de límites</a>).
      </p>
    </section>
  );
}
