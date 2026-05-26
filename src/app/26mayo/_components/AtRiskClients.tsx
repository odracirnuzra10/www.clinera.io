"use client";

import React from "react";

const outfitFont = { fontFamily: "'Outfit', sans-serif" };
const dmMonoFont = { fontFamily: "'DM Mono', monospace" };

interface AtRiskClient {
  name: string;
  cost: string;
}

const atRiskClientsList: AtRiskClient[] = [
  { name: "Clínica Oftalmológica Oftalvista", cost: "42,2366 US$" },
  { name: "Clínica dental Nevados", cost: "26,7229 US$" },
  { name: "SER Estética Facial & Corporal", cost: "16,8846 US$" },
  { name: "Clínica Antuka", cost: "12,9683 US$" },
  { name: "Clínica dental Divedent", cost: "12,6670 US$" },
  { name: "Aliviarte", cost: "12,4148 US$" },
  { name: "Laser Podología Chile", cost: "11,3107 US$" },
];

export default function AtRiskClients() {
  return (
    <section className="py-12 border-b border-zinc-800">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-[#1c1316] border border-red-900/40 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-red-500 rounded-none block animate-pulse" />
            <h2 
              className="text-lg font-semibold text-red-400 tracking-tight"
              style={outfitFont}
            >
              Clientes legacy en riesgo crítico para septiembre
            </h2>
          </div>
          
          <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
            Sin una actualización inmediata de plan o una reducción forzosa en la actividad del agente de IA, estas 7 cuentas consumirán la totalidad de su margen legacy descendente y experimentarán la desconexión del servicio al llegar a septiembre.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {atRiskClientsList.map((client, idx) => (
              <div 
                key={idx} 
                className="bg-[#161214] border border-zinc-900 p-4 flex items-center justify-between"
              >
                <span className="text-sm text-zinc-300 font-medium" style={outfitFont}>
                  {client.name}
                </span>
                <span 
                  className="text-base font-bold text-red-400 font-mono"
                  style={dmMonoFont}
                >
                  {client.cost}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
