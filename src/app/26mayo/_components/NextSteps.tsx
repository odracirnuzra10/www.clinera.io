"use client";

import React, { useState } from "react";

const outfitFont = { fontFamily: "'Outfit', sans-serif" };
const dmMonoFont = { fontFamily: "'DM Mono', monospace" };

interface ActionItem {
  id: string;
  task: string;
  owner: string;
}

const initialActionItems: ActionItem[] = [
  {
    id: "step-1",
    task: "Llamada directa y personalizada con Clínica Oftalmológica Oftalvista para gestionar su consumo y acordar upgrade.",
    owner: "Mitzi",
  },
  {
    id: "step-2",
    task: "Despliegue y pruebas del sistema de límites duros en el entorno de producción.",
    owner: "Devs",
  },
  {
    id: "step-3",
    task: "Envío de comunicaciones formales detallando la transición legacy (esquema decreciente) a los 7 clientes identificados.",
    owner: "Soporte",
  },
  {
    id: "step-4",
    task: "Preparación de la oferta comercial de add-ons de tokens y actualización del catálogo de planes de Clinera.",
    owner: "Ventas",
  },
  {
    id: "step-5",
    task: "Supervisión diaria del costo diario de tokens en OpenRouter y validación del impacto de la medida.",
    owner: "Ricardo",
  },
];

export default function NextSteps() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggleComplete = (id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-12 border-b border-zinc-900 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h2 
          className="text-2xl font-semibold text-zinc-100 mb-2 tracking-tight"
          style={outfitFont}
        >
          Próximos pasos
        </h2>
        <p className="text-sm text-zinc-400 mb-8 max-w-2xl leading-relaxed">
          Acciones y responsables asignados para garantizar el cumplimiento del calendario de activación de límites.
        </p>

        <div className="space-y-4">
          {initialActionItems.map((item) => {
            const isDone = completed[item.id] || false;
            return (
              <div 
                key={item.id}
                onClick={() => toggleComplete(item.id)}
                className={`border p-4 flex items-center justify-between cursor-pointer select-none transition-all ${
                  isDone 
                    ? "bg-[#14181f]/40 border-zinc-800 opacity-60" 
                    : "bg-[#161920] border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Custom Checkbox */}
                  <div className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${
                    isDone 
                      ? "border-zinc-700 bg-zinc-800 text-zinc-300" 
                      : "border-zinc-600"
                  }`}>
                    {isDone && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 4L4 7L9 1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <p 
                    className={`text-sm leading-relaxed transition-all ${
                      isDone ? "line-through text-zinc-500" : "text-zinc-300"
                    }`}
                  >
                    {item.task}
                  </p>
                </div>

                <div 
                  className={`text-xs px-3 py-1 border ml-4 font-mono font-semibold tracking-wider flex-shrink-0 transition-colors ${
                    isDone 
                      ? "border-zinc-800 text-zinc-600 bg-zinc-900/50" 
                      : "border-zinc-700 text-zinc-300 bg-zinc-800"
                  }`}
                  style={dmMonoFont}
                >
                  {item.owner.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
