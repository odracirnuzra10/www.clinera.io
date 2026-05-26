import React from "react";
import SlideHeader from "./SlideHeader";

interface Row {
  label: string;
  text: string;
}

const gemini: Row[] = [
  { label: "Costo operativo", text: "Bajo. Permite volumen alto sin control estricto de tokens." },
  { label: "Mensajería", text: "Funcional para flujos lineales y respuestas predecibles." },
  {
    label: "Capacidades de acción",
    text: "Insuficiente para integraciones y tareas que requieran lógica compleja multi-paso.",
  },
];

const kimi: Row[] = [
  { label: "Costo operativo", text: "Elevado. Requiere control riguroso de límites de consumo por negocio." },
  {
    label: "Mensajería",
    text: "Redacción natural, comprensión contextual y resolución efectiva de dudas complejas.",
  },
  {
    label: "Capacidades de acción",
    text: "Autónomo. Agenda citas, re-agenda según disponibilidad y procesa lógicas complejas de backend.",
  },
];

export default function ModelComparison() {
  return (
    <section id="modelo" className="slide">
      <SlideHeader
        num="01"
        eyebrow="Transición de modelo"
        title="El cambio de modelo"
        lead="Migración técnica obligatoria a partir del 1 de junio de 2026: pasamos de una mensajería pasiva a agentes resolutivos que ejecutan acciones reales."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Gemini */}
        <div className="card p-7">
          <div className="flex items-center justify-between mb-7">
            <h3 className="text-xl font-bold" style={{ color: "var(--ink-soft)" }}>
              Gemini 2.5 Flash
            </h3>
            <span className="chip chip-muted">Histórico</span>
          </div>
          <dl className="space-y-5">
            {gemini.map((r) => (
              <div key={r.label}>
                <dt className="eyebrow !mb-1.5">{r.label}</dt>
                <dd className="text-[0.95rem] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  {r.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Kimi */}
        <div className="card card-topline p-7" style={{ borderColor: "var(--border-strong)" }}>
          <div className="flex items-center justify-between mb-7">
            <h3 className="text-xl font-bold gradient-text">Kimi K2.6</h3>
            <span className="chip chip-accent">Activo · 1 junio</span>
          </div>
          <dl className="space-y-5">
            {kimi.map((r, i) => (
              <div key={r.label}>
                <dt className="eyebrow !mb-1.5" style={i === 2 ? { color: "#d8a6ff" } : undefined}>
                  {r.label}
                </dt>
                <dd
                  className="text-[0.95rem] leading-relaxed"
                  style={{ color: i === 2 ? "var(--ink)" : "rgba(245,247,250,0.8)", fontWeight: i === 2 ? 500 : 400 }}
                >
                  {r.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Conclusión */}
      <div
        className="rounded-2xl p-5 border-l-2"
        style={{ background: "var(--surface)", borderColor: "var(--violet)" }}
      >
        <p className="text-[0.95rem] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          <strong className="block mb-1" style={{ color: "var(--ink)" }}>
            Conclusión de operaciones
          </strong>
          El salto en las capacidades del agente justifica la migración, pero el costo real por token
          impide mantener un consumo abierto sin restricciones.
        </p>
      </div>
    </section>
  );
}
