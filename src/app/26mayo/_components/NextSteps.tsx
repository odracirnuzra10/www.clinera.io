"use client";

import React, { useState } from "react";
import SlideHeader from "./SlideHeader";

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
    task: "Supervisión diaria del costo de tokens en OpenRouter y validación del impacto de la medida.",
    owner: "Ricardo",
  },
];

export default function NextSteps() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const done = Object.values(completed).filter(Boolean).length;

  return (
    <section id="acciones" className="slide">
      <SlideHeader
        num="07"
        eyebrow="Plan de acción"
        title="Próximos pasos"
        lead="Acciones y responsables asignados para garantizar el cumplimiento del calendario de activación de límites. Marca cada tarea a medida que avanza."
      />

      <div className="flex items-center gap-3 mb-6">
        <span className="chip chip-accent">
          {done} / {initialActionItems.length} completadas
        </span>
        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${(done / initialActionItems.length) * 100}%`, background: "var(--grad)" }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {initialActionItems.map((item) => {
          const isDone = completed[item.id] || false;
          return (
            <div
              key={item.id}
              onClick={() => setCompleted((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
              className="card card-hover p-5 flex items-center gap-4 cursor-pointer select-none"
              style={{ opacity: isDone ? 0.55 : 1 }}
            >
              <div
                className="h-5 w-5 rounded-md flex items-center justify-center shrink-0 transition-colors"
                style={{
                  border: `1.5px solid ${isDone ? "transparent" : "var(--border-strong)"}`,
                  background: isDone ? "var(--grad)" : "transparent",
                }}
              >
                {isDone && (
                  <svg width="11" height="9" viewBox="0 0 10 8" fill="none" stroke="#0a0c11" strokeWidth="2.2">
                    <path d="M1 4L4 7L9 1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>

              <p
                className="flex-1 text-sm leading-relaxed transition-all"
                style={{
                  color: isDone ? "var(--ink-faint)" : "var(--ink-soft)",
                  textDecoration: isDone ? "line-through" : "none",
                }}
              >
                {item.task}
              </p>

              <span className={`chip shrink-0 ${isDone ? "chip-muted" : "chip-accent"}`}>{item.owner}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
