"use client";

import React, { useState } from "react";
import SlideHeader from "./SlideHeader";

interface Step {
  month: string;
  value: string;
  desc: string;
}

const newClientSteps: Step[] = [
  { month: "JUN", value: "+20%", desc: "Margen inicial para integración de Kimi K2.6" },
  { month: "JUL", value: "+15%", desc: "Ajuste de consumo y optimización de prompts" },
  { month: "AGO", value: "+10%", desc: "Límite estándar permanente para cuentas nuevas" },
];

const legacyClientSteps: Step[] = [
  { month: "JUN", value: "+60%", desc: "Periodo inicial de amortiguación de costos" },
  { month: "JUL", value: "+50%", desc: "Rampa descendente de cortesía obligatoria" },
  { month: "AGO", value: "+40%", desc: "Transición hacia consumo regulado" },
  { month: "SEP", value: "+30%", desc: "Alerta crítica de desactivación para alto consumo" },
  { month: "OCT", value: "+20%", desc: "Piso objetivo de consumo para clientes legacy" },
];

interface StepperProps {
  title: string;
  steps: Step[];
  accent: string;
}

function Stepper({ title, steps, accent }: StepperProps) {
  const [active, setActive] = useState(0);
  return (
    <div className="card p-7 flex flex-col">
      <h3 className="eyebrow !mb-8">{title}</h3>

      <div className="relative flex justify-between items-end mb-8">
        <div
          className="absolute left-0 right-0 bottom-[10px] h-px z-0"
          style={{ background: "var(--border)" }}
        />
        {steps.map((step, idx) => {
          const isActive = active === idx;
          return (
            <button
              key={step.month}
              onClick={() => setActive(idx)}
              className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
            >
              <span
                className="stat-value text-2xl transition-all"
                style={{
                  color: isActive ? "var(--ink)" : accent,
                  opacity: isActive ? 1 : 0.55,
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                }}
              >
                {step.value}
              </span>
              <span
                className="deck-mono text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded-full transition-colors"
                style={{
                  color: isActive ? "#0a0c11" : "var(--ink-faint)",
                  background: isActive ? accent : "rgba(255,255,255,0.05)",
                }}
              >
                {step.month}
              </span>
              <span
                className="h-1.5 w-1.5 rounded-full transition-colors"
                style={{ background: isActive ? accent : "var(--border-strong)" }}
              />
            </button>
          );
        })}
      </div>

      <div
        className="rounded-xl p-4 mt-auto min-h-[80px] flex flex-col justify-center"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid var(--border)" }}
      >
        <span className="eyebrow !mb-1.5">Detalle {steps[active].month}</span>
        <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          {steps[active].desc}.
        </p>
      </div>
    </div>
  );
}

export default function LimitPolicy() {
  return (
    <section id="limites" className="slide">
      <SlideHeader
        num="03"
        eyebrow="Cronograma de ajustes"
        title="Política de límites"
        lead="Estructura de control de excedentes con ajustes progresivos mensuales sobre el límite base contratado, a partir del 1 de junio de 2026. Toca cada mes para ver el detalle."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Stepper title="Clientes nuevos" steps={newClientSteps} accent="var(--cyan)" />
        <Stepper title="Clientes legacy" steps={legacyClientSteps} accent="var(--violet)" />
      </div>
    </section>
  );
}
