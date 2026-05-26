"use client";

import React from "react";

const outfitFont = { fontFamily: "'Outfit', sans-serif" };
const dmMonoFont = { fontFamily: "'DM Mono', monospace" };

export default function ModelComparison() {
  return (
    <section className="py-12 border-b border-zinc-800">
      <div className="max-w-4xl mx-auto px-4">
        <h2 
          className="text-2xl font-semibold text-zinc-100 mb-2 tracking-tight"
          style={outfitFont}
        >
          El cambio de modelo
        </h2>
        <p className="text-sm text-zinc-400 mb-8 max-w-2xl leading-relaxed">
          Migración técnica obligatoria a partir del 1 de junio de 2026. Transición desde mensajería pasiva a agentes resolutivos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Gemini 2.5 Flash */}
          <div className="bg-[#161920] border border-zinc-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-zinc-200" style={outfitFont}>
                  Gemini 2.5 Flash
                </h3>
                <span 
                  className="text-xs px-2 py-0.5 border border-zinc-700 text-zinc-400"
                  style={dmMonoFont}
                >
                  HISTÓRICO
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-xs uppercase text-zinc-500 font-medium" style={outfitFont}>
                    Costo operativo
                  </span>
                  <p className="text-sm text-zinc-300 mt-1">
                    Bajo. Permite volumen alto sin control estricto de tokens.
                  </p>
                </div>
                
                <div>
                  <span className="text-xs uppercase text-zinc-500 font-medium" style={outfitFont}>
                    Mensajería
                  </span>
                  <p className="text-sm text-zinc-300 mt-1">
                    Funcional para flujos lineales y respuestas predecibles.
                  </p>
                </div>
                
                <div>
                  <span className="text-xs uppercase text-zinc-500 font-medium" style={outfitFont}>
                    Capacidades de acción
                  </span>
                  <p className="text-sm text-zinc-400 mt-1">
                    Insuficiente para integraciones y tareas que requieran lógica multi-paso.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kimi K2.6 */}
          <div className="bg-[#161920] border border-zinc-700 p-6 flex flex-col justify-between relative">
            <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-[#009FE3] via-[#7C3AED] to-[#C850C0]" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-zinc-100" style={outfitFont}>
                  Kimi K2.6
                </h3>
                <span 
                  className="text-xs px-2 py-0.5 border border-[#7C3AED] text-zinc-200 bg-[#7c3aed1a]"
                  style={dmMonoFont}
                >
                  ACTIVO JUNIO 1
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs uppercase text-zinc-500 font-medium" style={outfitFont}>
                    Costo operativo
                  </span>
                  <p className="text-sm text-zinc-300 mt-1">
                    Elevado. Requiere control riguroso de límites de consumo por negocio.
                  </p>
                </div>

                <div>
                  <span className="text-xs uppercase text-zinc-500 font-medium" style={outfitFont}>
                    Mensajería
                  </span>
                  <p className="text-sm text-zinc-300 mt-1">
                    Redacción natural, comprensión contextual y resolución efectiva de dudas complejas.
                  </p>
                </div>

                <div>
                  <span className="text-xs uppercase text-zinc-500 font-medium" style={outfitFont}>
                    Capacidades de acción
                  </span>
                  <p className="text-sm text-zinc-100 mt-1 font-medium">
                    Autónomo. Agenda citas, re-agenda según disponibilidad y procesa lógicas complejas del sistema.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#13161d] border border-zinc-800 p-4">
          <p className="text-xs text-zinc-400 leading-relaxed">
            <span className="text-zinc-300 font-medium" style={outfitFont}>Conclusión operativa:</span> El salto en las capacidades del agente justifica la migración, pero el costo real por token impide mantener un consumo abierto sin restricciones.
          </p>
        </div>
      </div>
    </section>
  );
}
