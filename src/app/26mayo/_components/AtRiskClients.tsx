"use client";

import React from "react";

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
    <section className="py-12 border-b border-zinc-900">
      <div className="bg-[#1c1316] border border-red-950 p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-1.5 h-1.5 bg-red-500 block animate-pulse" />
          <h2 className="text-lg font-bold text-red-400 tracking-tight font-outfit">
            Clientes legacy en riesgo crítico para septiembre
          </h2>
        </div>
        
        <p className="text-sm text-zinc-300 mb-6 leading-relaxed font-outfit">
          Sin una actualización inmediata de plan o una reducción forzosa en la actividad del agente de IA, estas 7 cuentas consumirán la totalidad de su margen legacy descendente y experimentarán la desconexión del servicio al llegar a septiembre.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {atRiskClientsList.map((client, idx) => (
            <div 
              key={idx} 
              className="bg-[#161214] border border-red-950/20 p-4 flex items-center justify-between"
            >
              <span className="text-sm text-zinc-300 font-medium font-outfit">
                {client.name}
              </span>
              <span className="text-base font-bold text-red-400 font-mono-dm">
                {client.cost}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
