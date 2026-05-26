"use client";

import React from "react";

export default function ModelComparison() {
  return (
    <section className="py-12 border-b border-zinc-900">
      <div>
        <div className="kicker-label font-mono-dm mb-3">
          Transición de Modelo
        </div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-2 tracking-tight font-outfit">
          El cambio de modelo
        </h2>
        <p className="text-sm text-zinc-400 mb-8 max-w-2xl leading-relaxed font-outfit">
          Migración técnica obligatoria a partir del 1 de junio de 2026. Transición desde mensajería pasiva a agentes resolutivos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Gemini 2.5 Flash */}
          <div className="bg-[#161920] border border-[#222530] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-zinc-200 font-outfit">
                  Gemini 2.5 Flash
                </h3>
                <span className="text-[10px] px-2 py-0.5 border border-zinc-800 text-zinc-500 font-mono-dm tracking-wider uppercase font-semibold bg-zinc-950/20">
                  Histórico
                </span>
              </div>
              
              <div className="space-y-5">
                <div>
                  <span className="text-[11px] uppercase text-zinc-500 font-semibold tracking-wider font-mono-dm block">
                    Costo operativo
                  </span>
                  <p className="text-sm text-zinc-400 mt-1 font-outfit">
                    Bajo. Permite volumen alto sin control estricto de tokens.
                  </p>
                </div>
                
                <div>
                  <span className="text-[11px] uppercase text-zinc-500 font-semibold tracking-wider font-mono-dm block">
                    Mensajería
                  </span>
                  <p className="text-sm text-zinc-400 mt-1 font-outfit">
                    Funcional para flujos lineales y respuestas predecibles.
                  </p>
                </div>
                
                <div>
                  <span className="text-[11px] uppercase text-zinc-500 font-semibold tracking-wider font-mono-dm block">
                    Capacidades de acción
                  </span>
                  <p className="text-sm text-zinc-500 mt-1 font-outfit">
                    Insuficiente para integraciones y tareas que requieran lógica compleja multi-paso.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kimi K2.6 */}
          <div className="bg-[#161920] border border-zinc-800 p-6 flex flex-col justify-between relative">
            <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-[#009FE3] via-[#7C3AED] to-[#C850C0]" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-zinc-100 font-outfit">
                  Kimi K2.6
                </h3>
                <span className="text-[10px] px-2 py-0.5 border border-[#7C3AED]/40 text-[#7C3AED] font-mono-dm tracking-wider uppercase font-semibold bg-[#7c3aed]/10">
                  Activo Junio 1
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <span className="text-[11px] uppercase text-zinc-500 font-semibold tracking-wider font-mono-dm block">
                    Costo operativo
                  </span>
                  <p className="text-sm text-zinc-300 mt-1 font-outfit">
                    Elevado. Requiere control riguroso de límites de consumo por negocio.
                  </p>
                </div>

                <div>
                  <span className="text-[11px] uppercase text-zinc-500 font-semibold tracking-wider font-mono-dm block">
                    Mensajería
                  </span>
                  <p className="text-sm text-zinc-300 mt-1 font-outfit">
                    Redacción natural, comprensión contextual y resolución efectiva de dudas complejas.
                  </p>
                </div>

                <div>
                  <span className="text-[11px] uppercase text-[#7C3AED] font-semibold tracking-wider font-mono-dm block">
                    Capacidades de acción
                  </span>
                  <p className="text-sm text-zinc-100 mt-1 font-medium font-outfit">
                    Autónomo. Agenda citas, re-agenda según disponibilidad y procesa lógicas complejas de backend.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#13161d] border border-zinc-900 p-4">
          <p className="text-xs text-zinc-400 leading-relaxed font-outfit">
            <strong className="text-zinc-300 font-semibold font-outfit block mb-1">Conclusión de operaciones:</strong> El salto en las capacidades del agente justifica la migración, pero el costo real por token impide mantener un consumo abierto sin restricciones.
          </p>
        </div>
      </div>
    </section>
  );
}
