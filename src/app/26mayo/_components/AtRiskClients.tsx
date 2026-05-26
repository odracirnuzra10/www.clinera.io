import React from "react";
import SlideHeader from "./SlideHeader";

interface AtRiskClient {
  name: string;
  cost: string;
}

const atRiskClientsList: AtRiskClient[] = [
  { name: "Clínica Oftalmológica Oftalvista", cost: "42,2366" },
  { name: "Clínica dental Nevados", cost: "26,7229" },
  { name: "SER Estética Facial & Corporal", cost: "16,8846" },
  { name: "Clínica Antuka", cost: "12,9683" },
  { name: "Clínica dental Divedent", cost: "12,6670" },
  { name: "Aliviarte", cost: "12,4148" },
  { name: "Laser Podología Chile", cost: "11,3107" },
];

export default function AtRiskClients() {
  return (
    <section id="riesgo" className="slide">
      <SlideHeader
        num="04"
        eyebrow="Alerta operativa"
        title={
          <>
            Clientes legacy en <span style={{ color: "var(--danger)" }}>riesgo crítico</span> para
            septiembre
          </>
        }
        lead="Sin una actualización de plan o una reducción en la actividad del agente, estas 7 cuentas agotarán su margen legacy descendente y serán desconectadas al llegar a septiembre."
      />

      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: "linear-gradient(180deg, rgba(255,90,110,0.08), rgba(255,90,110,0.02))",
          border: "1px solid rgba(255,90,110,0.25)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-6">
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ background: "var(--danger)", boxShadow: "0 0 12px var(--danger)" }}
          />
          <span className="chip chip-danger">7 cuentas afectadas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {atRiskClientsList.map((client, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 rounded-xl p-4"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid var(--border)" }}
            >
              <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                {client.name}
              </span>
              <span className="stat-value text-base shrink-0" style={{ color: "var(--danger)" }}>
                {client.cost} <span className="deck-mono text-[10px] opacity-70">USD</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
