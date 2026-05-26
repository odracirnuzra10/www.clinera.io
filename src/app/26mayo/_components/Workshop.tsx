"use client";

import React, { useState } from "react";

const outfitFont = { fontFamily: "'Outfit', sans-serif" };
const dmMonoFont = { fontFamily: "'DM Mono', monospace" };

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
      "Gemini 2.5 Flash actuaba como un contestador automático simple; Kimi K2.6 funciona como un asistente administrativo real que ejecuta flujos multi-paso."
    ]
  },
  {
    number: "02",
    question: "¿Qué decimos cuando el cliente reclama que \"antes no tenía límite\"?",
    points: [
      "Las capacidades avanzadas de Kimi requieren un procesamiento mucho mayor, lo que incrementa sustancialmente el costo de computación por token.",
      "Para mantener la viabilidad de la plataforma y garantizar el rendimiento óptimo del agente de IA, es indispensable aplicar un consumo controlado."
    ]
  },
  {
    number: "03",
    question: "¿Cómo abordamos específicamente a Oftalvista, que consume el doble de su plan?",
    points: [
      "Gestionar el caso de manera individualizada a través de una reunión directa liderada por Mitzi y soporte antes del 1 de junio.",
      "Presentar una propuesta de transición inmediata a un plan corporativo de mayor capacidad para evitar cortes de servicio prematuros."
    ]
  },
  {
    number: "04",
    question: "¿Qué upsell concreto ofrecemos cuando el cliente se acerca al límite?",
    points: [
      "Migración fluida a planes superiores o compra de paquetes de tokens adicionales (add-ons) para meses con alta demanda de pacientes.",
      "Auditoría técnica sin costo para optimizar los prompts del agente de IA y reducir interacciones redundantes."
    ]
  },
  {
    number: "05",
    question: "¿Cómo dejamos claro que el periodo legacy de 60% a 20% es una cortesía, no la nueva base?",
    points: [
      "Presentar el cronograma completo de decremento (de junio a octubre) desde el primer contacto formal de soporte.",
      "Formalizar el esquema de amortización por escrito para asegurar que en septiembre y octubre entiendan la reducción automática."
    ]
  }
];

export default function Workshop() {
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleNoteChange = (id: string, text: string) => {
    setNotes((prev) => ({ ...prev, [id]: text }));
  };

  return (
    <section className="py-12 border-b border-zinc-800">
      <div className="max-w-4xl mx-auto px-4">
        <h2 
          className="text-2xl font-semibold text-zinc-100 mb-2 tracking-tight"
          style={outfitFont}
        >
          Workshop: cómo se lo comunicamos al cliente
        </h2>
        <p className="text-sm text-zinc-400 mb-8 max-w-2xl leading-relaxed">
          Guía de discusión en vivo para alinear los discursos de Mitzi, desarrollo, soporte y ventas.
        </p>

        <div className="space-y-6">
          {workshopPrompts.map((prompt) => (
            <div 
              key={prompt.number} 
              className="bg-[#161920] border border-zinc-800 p-6 flex flex-col md:flex-row gap-6"
            >
              {/* Number and Question */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span 
                    className="text-sm font-bold text-zinc-500 font-mono"
                    style={dmMonoFont}
                  >
                    {prompt.number}
                  </span>
                  <span 
                    className="text-[9px] px-2 py-0.5 border border-zinc-700 bg-zinc-800 text-zinc-400 font-mono font-semibold uppercase tracking-wider"
                    style={dmMonoFont}
                  >
                    Discusión grupal
                  </span>
                </div>
                <h3 
                  className="text-base font-semibold text-zinc-200 leading-snug"
                  style={outfitFont}
                >
                  {prompt.question}
                </h3>
                
                {/* Drafted points */}
                <div className="mt-4 space-y-3">
                  <span className="text-[10px] uppercase text-zinc-500 font-medium block" style={outfitFont}>
                    Puntos de partida sugeridos
                  </span>
                  <ul className="space-y-2">
                    {prompt.points.map((point, pIdx) => (
                      <li key={pIdx} className="text-xs text-zinc-300 pl-3 border-l border-zinc-700 leading-relaxed">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Note taking field */}
              <div className="w-full md:w-80 flex flex-col justify-between">
                <span className="text-[10px] uppercase text-zinc-500 font-medium block mb-2" style={outfitFont}>
                  Notas de la reunión
                </span>
                <textarea
                  value={notes[prompt.number] || ""}
                  onChange={(e) => handleNoteChange(prompt.number, e.target.value)}
                  placeholder="Escribe aquí los acuerdos tomados en vivo..."
                  className="w-full h-32 p-3 bg-[#111318] border border-zinc-800 text-zinc-300 text-xs focus:outline-none focus:border-zinc-700 resize-none rounded-none placeholder-zinc-600"
                  style={outfitFont}
                />
                <span className="text-[9px] text-zinc-600 text-right mt-1 font-mono" style={dmMonoFont}>
                  * Temporal (no se guarda en servidor)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
