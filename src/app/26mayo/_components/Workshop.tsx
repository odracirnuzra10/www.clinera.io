"use client";

import React, { useState } from "react";
import SlideHeader from "./SlideHeader";

interface PromptCard {
  number: string;
  question: string;
  points: string[];
}

const workshopPrompts: PromptCard[] = [
  {
    number: "01",
    question: "¿Cómo explicamos el cambio de Gemini a Kimi sin tecnicismos?",
    points: [
      "Kimi no solo responde mensajes de texto; es capaz de agendar, re-agendar y coordinar citas de forma autónoma en el sistema.",
      "Gemini 2.5 Flash actuaba como un contestador automático simple; Kimi K2.6 funciona como un asistente administrativo real que ejecuta flujos de acciones de extremo a extremo.",
    ],
  },
  {
    number: "02",
    question: '¿Qué decimos cuando el cliente reclama que "antes no tenía límite"?',
    points: [
      "Las capacidades avanzadas de Kimi requieren un procesamiento mucho mayor, lo que incrementa sustancialmente el costo de computación por token.",
      "Para mantener la viabilidad de la plataforma y garantizar el rendimiento óptimo del agente de IA, es indispensable aplicar un consumo controlado.",
    ],
  },
  {
    number: "03",
    question: "¿Cómo abordamos específicamente a Oftalvista, que consume el doble de su plan?",
    points: [
      "Gestionar el caso de manera individualizada a través de una reunión directa liderada por Mitzi y soporte antes del 1 de junio.",
      "Presentar una propuesta de transición inmediata a un plan corporativo de mayor capacidad para evitar cortes de servicio prematuros.",
    ],
  },
  {
    number: "04",
    question: "¿Qué upsell concreto ofrecemos cuando el cliente se acerca al límite?",
    points: [
      "Migración fluida a planes superiores o compra de paquetes de tokens adicionales (add-ons) para meses con alta demanda de pacientes.",
      "Auditoría técnica sin costo para optimizar los prompts del agente de IA y reducir interacciones redundantes.",
    ],
  },
  {
    number: "05",
    question: "¿Cómo dejamos claro que el periodo legacy de 60% a 20% es una cortesía, no la nueva base?",
    points: [
      "Presentar el cronograma completo de decremento (de junio a octubre) desde el primer contacto formal de soporte.",
      "Formalizar el esquema de amortización por escrito para asegurar que en septiembre y octubre entiendan la reducción automática.",
    ],
  },
];

export default function Workshop() {
  const [notes, setNotes] = useState<Record<string, string>>({});

  return (
    <section id="workshop" className="slide">
      <SlideHeader
        num="06"
        eyebrow="Taller de comunicación"
        title="Workshop: cómo se lo comunicamos al cliente"
        lead="Guía de discusión en vivo para alinear los discursos de Mitzi, desarrollo, soporte y ventas. Usa el campo de notas para registrar los acuerdos."
      />

      <div className="space-y-5">
        {workshopPrompts.map((p) => (
          <div key={p.number} className="card p-6 md:p-7 flex flex-col md:flex-row gap-7">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="stat-value text-lg gradient-text">{p.number}</span>
                <span className="chip chip-muted">Discusión grupal</span>
              </div>
              <h3 className="text-lg font-bold leading-snug mb-5" style={{ color: "var(--ink)" }}>
                {p.question}
              </h3>
              <span className="eyebrow !mb-3">Puntos de partida sugeridos</span>
              <ul className="space-y-3">
                {p.points.map((point, i) => (
                  <li
                    key={i}
                    className="text-sm leading-relaxed pl-4 border-l"
                    style={{ color: "var(--ink-soft)", borderColor: "var(--border-strong)" }}
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full md:w-80 flex flex-col">
              <span className="eyebrow !mb-2">Notas de la reunión</span>
              <textarea
                value={notes[p.number] || ""}
                onChange={(e) => setNotes((prev) => ({ ...prev, [p.number]: e.target.value }))}
                placeholder="Escribe aquí los acuerdos tomados en vivo…"
                className="w-full flex-1 min-h-[120px] p-3 rounded-xl text-sm resize-none focus:outline-none transition-colors"
                style={{
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid var(--border)",
                  color: "var(--ink)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
              <span className="deck-mono text-[10px] text-right mt-1.5" style={{ color: "var(--ink-faint)" }}>
                * Temporal · no se guarda en servidor
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
