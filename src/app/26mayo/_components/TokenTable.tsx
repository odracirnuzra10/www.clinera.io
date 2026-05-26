"use client";

import React, { useState, useMemo } from "react";

const outfitFont = { fontFamily: "'Outfit', sans-serif" };
const dmMonoFont = { fontFamily: "'DM Mono', monospace" };

interface ClientData {
  id: string;
  name: string;
  tokens: number;
  cost: number;
  atRisk: boolean;
}

const initialClients: ClientData[] = [
  { id: "oftalvista", name: "Clínica Oftalmológica Oftalvista", tokens: 46805366, cost: 42.2366, atRisk: true },
  { id: "nevados", name: "Clínica dental Nevados", tokens: 30475092, cost: 26.7229, atRisk: true },
  { id: "hebe", name: "Método Hebe", tokens: 29868614, cost: 25.9037, atRisk: false },
  { id: "ser-estetica", name: "SER Estética Facial & Corporal", tokens: 20462492, cost: 16.8846, atRisk: true },
  { id: "antuka", name: "Clínica Antuka", tokens: 15430342, cost: 12.9683, atRisk: true },
  { id: "divedent", name: "Clínica dental Divedent", tokens: 10689939, cost: 12.6670, atRisk: true },
  { id: "aliviarte", name: "Aliviarte", tokens: 13484970, cost: 12.4148, atRisk: true },
  { id: "laser-podologia", name: "Laser Podología Chile", tokens: 13361469, cost: 11.3107, atRisk: true },
  { id: "lazaro", name: "Medicina Regenerativa Lázaro", tokens: 8777401, cost: 7.5872, atRisk: false },
  { id: "clinera-software", name: "Clinera software", tokens: 6149249, cost: 5.7630, atRisk: false },
  { id: "ckd", name: "Clínica CKD", tokens: 5339533, cost: 4.5475, atRisk: false },
  { id: "interlab", name: "Centro Médico Interlab", tokens: 4961061, cost: 4.4781, atRisk: false },
  { id: "valdes", name: "Clínica de Ortodoncia Valdés y Asociados", tokens: 3781857, cost: 3.6079, atRisk: false },
];

export default function TokenTable() {
  const [sortBy, setSortBy] = useState<"name" | "tokens" | "cost">("cost");
  const [sortDesc, setSortDesc] = useState<boolean>(true);

  // Totals computed on the entire list
  const metrics = useMemo(() => {
    const totalTokens = initialClients.reduce((sum, c) => sum + c.tokens, 0);
    const totalCost = initialClients.reduce((sum, c) => sum + c.cost, 0);
    
    // Sort all to find top 3 consumers by cost
    const sortedByCost = [...initialClients].sort((a, b) => b.cost - a.cost);
    const top3Cost = sortedByCost.slice(0, 3).reduce((sum, c) => sum + c.cost, 0);
    const top3Percentage = (top3Cost / totalCost) * 100;

    return {
      totalTokens,
      totalCost,
      top3Percentage,
    };
  }, []);

  const handleSort = (field: "name" | "tokens" | "cost") => {
    if (sortBy === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(field);
      setSortDesc(true);
    }
  };

  const sortedClients = useMemo(() => {
    return [...initialClients].sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name, "es");
      } else if (sortBy === "tokens") {
        comparison = a.tokens - b.tokens;
      } else if (sortBy === "cost") {
        comparison = a.cost - b.cost;
      }
      return sortDesc ? -comparison : comparison;
    });
  }, [sortBy, sortDesc]);

  const formatTokens = (val: number) => {
    return new Intl.NumberFormat("es-CL").format(val);
  };

  const formatCost = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(val);
  };

  return (
    <section className="py-12 border-b border-zinc-800">
      <div className="max-w-4xl mx-auto px-4">
        <h2 
          className="text-2xl font-semibold text-zinc-100 mb-2 tracking-tight"
          style={outfitFont}
        >
          El impacto económico
        </h2>
        <p className="text-sm text-zinc-400 mb-8 max-w-2xl leading-relaxed">
          Consumo registrado de tokens y costos reales acumulados por cliente durante el período actual sin límites técnicos.
        </p>

        {/* Client-side calculated KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#161920] border border-zinc-800 p-5">
            <span className="text-xs uppercase text-zinc-500 font-medium" style={outfitFont}>
              Consumo Total
            </span>
            <div className="flex items-baseline mt-2 gap-2">
              <span className="text-2xl font-bold text-zinc-100" style={dmMonoFont}>
                {formatTokens(metrics.totalTokens)}
              </span>
              <span className="text-xs text-zinc-500" style={outfitFont}>
                tokens
              </span>
            </div>
          </div>

          <div className="bg-[#161920] border border-zinc-800 p-5">
            <span className="text-xs uppercase text-zinc-500 font-medium" style={outfitFont}>
              Costo Mensual Total
            </span>
            <div className="flex items-baseline mt-2 gap-2">
              <span className="text-2xl font-bold text-zinc-100" style={dmMonoFont}>
                {formatCost(metrics.totalCost)}
              </span>
              <span className="text-xs text-zinc-500 font-mono" style={dmMonoFont}>
                USD
              </span>
            </div>
          </div>

          <div className="bg-[#161920] border border-zinc-800 p-5">
            <span className="text-xs uppercase text-zinc-500 font-medium" style={outfitFont}>
              Concentración Top 3
            </span>
            <div className="flex items-baseline mt-2 gap-2">
              <span className="text-2xl font-bold text-red-400" style={dmMonoFont}>
                {metrics.top3Percentage.toFixed(1)}%
              </span>
              <span className="text-xs text-zinc-500" style={outfitFont}>
                del costo total
              </span>
            </div>
          </div>
        </div>

        {/* Sortable Table */}
        <div className="overflow-x-auto border border-zinc-800 bg-[#161920]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#12141a]">
                <th 
                  onClick={() => handleSort("name")}
                  className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-200 select-none transition-colors"
                  style={outfitFont}
                >
                  Negocio {sortBy === "name" && (sortDesc ? "↓" : "↑")}
                </th>
                <th 
                  onClick={() => handleSort("tokens")}
                  className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-200 text-right select-none transition-colors"
                  style={outfitFont}
                >
                  Tokens {sortBy === "tokens" && (sortDesc ? "↓" : "↑")}
                </th>
                <th 
                  onClick={() => handleSort("cost")}
                  className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-200 text-right select-none transition-colors"
                  style={outfitFont}
                >
                  Costo {sortBy === "cost" && (sortDesc ? "↓" : "↑")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {sortedClients.map((client) => (
                <tr 
                  key={client.id} 
                  className={`hover:bg-[#1f232d] transition-colors ${
                    client.atRisk ? "bg-[#e11d4805]" : ""
                  }`}
                >
                  <td className="p-4 text-sm text-zinc-300">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{client.name}</span>
                      {client.atRisk && (
                        <span 
                          className="text-[9px] px-2 py-0.5 border border-red-900/60 bg-red-950/30 text-red-400 font-mono tracking-wider font-semibold"
                          style={dmMonoFont}
                        >
                          EN RIESGO
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-zinc-300 text-right font-mono" style={dmMonoFont}>
                    {formatTokens(client.tokens)}
                  </td>
                  <td className="p-4 text-sm text-zinc-300 text-right font-mono" style={dmMonoFont}>
                    {formatCost(client.cost)} USD
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-zinc-500 mt-3 text-right">
          Haz clic en las cabeceras de la tabla para ordenar la información.
        </p>
      </div>
    </section>
  );
}
