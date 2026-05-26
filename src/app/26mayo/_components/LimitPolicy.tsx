"use client";

import React, { useState } from "react";

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

export default function LimitPolicy() {
  const [activeNewStep, setActiveNewStep] = useState<number>(0);
  const [activeLegacyStep, setActiveLegacyStep] = useState<number>(0);

  return (
    <section className="py-12 border-b border-zinc-900">
      <div>
        <div className="kicker-label font-mono-dm mb-3">
          Cronograma de Ajustes
        </div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-2 tracking-tight font-outfit">
          Política de límites
        </h2>
        <p className="text-sm text-zinc-400 mb-8 max-w-2xl leading-relaxed font-outfit">
          Estructura de control de excedentes. Ajustes progresivos mensuales sobre el límite base contratado a partir del 1 de junio de 2026.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* New Clients Panel */}
          <div className="bg-[#161920] border border-[#222530] p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase text-zinc-400 mb-8 tracking-wider font-mono-dm">
                Clientes Nuevos
              </h3>
              
              {/* Stepper container */}
              <div className="relative flex justify-between items-center mb-8 mt-4">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-zinc-800 -translate-y-1/2 z-0" />
                
                {newClientSteps.map((step, idx) => {
                  const isSelected = activeNewStep === idx;
                  return (
                    <button
                      key={step.month}
                      onClick={() => setActiveNewStep(idx)}
                      className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                    >
                      <div className={`text-[10px] px-2 py-0.5 mb-2 font-semibold tracking-widest transition-colors font-mono-dm ${
                        isSelected 
                          ? "text-zinc-100 bg-[#009FE3]" 
                          : "text-zinc-500 bg-zinc-900 group-hover:text-zinc-300"
                      }`}>
                        {step.month}
                      </div>
                      <div className={`text-2xl font-bold tracking-tighter transition-all font-mono-dm ${
                        isSelected 
                          ? "text-zinc-100 scale-105" 
                          : "text-[#009FE3]/70 group-hover:text-[#009FE3]"
                      }`}>
                        {step.value}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Detail */}
            <div className="bg-[#12141a] p-4 border border-zinc-800/80 min-h-[72px] flex items-center">
              <p className="text-xs text-zinc-400 leading-normal font-outfit">
                <strong className="text-zinc-300 block mb-1 font-outfit uppercase tracking-wider text-[10px]">
                  Detalle {newClientSteps[activeNewStep].month}
                </strong>
                {newClientSteps[activeNewStep].desc}.
              </p>
            </div>
          </div>

          {/* Legacy Clients Panel */}
          <div className="bg-[#161920] border border-[#222530] p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase text-zinc-400 mb-8 tracking-wider font-mono-dm">
                Clientes Legacy
              </h3>

              {/* Stepper container */}
              <div className="relative flex justify-between items-center mb-8 mt-4">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-zinc-800 -translate-y-1/2 z-0" />

                {legacyClientSteps.map((step, idx) => {
                  const isSelected = activeLegacyStep === idx;
                  return (
                    <button
                      key={step.month}
                      onClick={() => setActiveLegacyStep(idx)}
                      className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                    >
                      <div className={`text-[10px] px-1.5 py-0.5 mb-2 font-semibold tracking-widest transition-colors font-mono-dm ${
                        isSelected 
                          ? "text-zinc-100 bg-[#7C3AED]" 
                          : "text-zinc-500 bg-zinc-900 group-hover:text-zinc-300"
                      }`}>
                        {step.month}
                      </div>
                      <div className={`text-2xl font-bold tracking-tighter transition-all font-mono-dm ${
                        isSelected 
                          ? "text-zinc-100 scale-105" 
                          : "text-[#7C3AED]/70 group-hover:text-[#7C3AED]"
                      }`}>
                        {step.value}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Detail */}
            <div className="bg-[#12141a] p-4 border border-zinc-800/80 min-h-[72px] flex items-center">
              <p className="text-xs text-zinc-400 leading-normal font-outfit">
                <strong className="text-zinc-300 block mb-1 font-outfit uppercase tracking-wider text-[10px]">
                  Detalle {legacyClientSteps[activeLegacyStep].month}
                </strong>
                {legacyClientSteps[activeLegacyStep].desc}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
