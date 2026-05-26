"use client";

import React, { useState, useMemo } from "react";
import SlideHeader from "./SlideHeader";

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

type SortField = "name" | "tokens" | "cost";

export default function TokenTable() {
  const [sortBy, setSortBy] = useState<SortField>("cost");
  const [sortDesc, setSortDesc] = useState(true);

  const metrics = useMemo(() => {
    const totalTokens = initialClients.reduce((s, c) => s + c.tokens, 0);
    const totalCost = initialClients.reduce((s, c) => s + c.cost, 0);
    const sortedByCost = [...initialClients].sort((a, b) => b.cost - a.cost);
    const top3Cost = sortedByCost.slice(0, 3).reduce((s, c) => s + c.cost, 0);
    return { totalTokens, totalCost, top3Percentage: (top3Cost / totalCost) * 100, maxCost: sortedByCost[0].cost };
  }, []);

  const handleSort = (field: SortField) => {
    if (sortBy === field) setSortDesc(!sortDesc);
    else {
      setSortBy(field);
      setSortDesc(true);
    }
  };

  const sortedClients = useMemo(() => {
    return [...initialClients].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.name.localeCompare(b.name, "es");
      else if (sortBy === "tokens") cmp = a.tokens - b.tokens;
      else cmp = a.cost - b.cost;
      return sortDesc ? -cmp : cmp;
    });
  }, [sortBy, sortDesc]);

  const fTokens = (v: number) => new Intl.NumberFormat("es-CL").format(v);
  const fCost = (v: number) =>
    new Intl.NumberFormat("es-CL", { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(v);

  const arrow = (f: SortField) => (sortBy === f ? (sortDesc ? " ↓" : " ↑") : "");

  const kpis = [
    { label: "Consumo total", value: fTokens(metrics.totalTokens), unit: "tokens", accent: "var(--cyan)" },
    { label: "Costo mensual total", value: fCost(metrics.totalCost), unit: "USD", accent: "var(--violet)" },
    { label: "Concentración top 3", value: `${metrics.top3Percentage.toFixed(1)}%`, unit: "del gasto", accent: "var(--danger)" },
  ];

  return (
    <section id="impacto" className="slide">
      <SlideHeader
        num="02"
        eyebrow="Datos de consumo"
        title="El impacto económico"
        lead="Consumo de tokens y costo real acumulado por cliente durante el período actual, todavía sin límites técnicos aplicados."
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-9">
        {kpis.map((k) => (
          <div key={k.label} className="card card-hover p-6">
            <span className="eyebrow !mb-3">{k.label}</span>
            <div className="flex items-baseline gap-2">
              <span className="stat-value text-3xl" style={{ color: k.accent }}>
                {k.value}
              </span>
              <span className="deck-mono text-[11px]" style={{ color: "var(--ink-faint)" }}>
                {k.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla con barras de consumo */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {(
                  [
                    ["name", "Negocio", "left"],
                    ["tokens", "Tokens", "right"],
                    ["cost", "Costo (USD)", "right"],
                  ] as [SortField, string, string][]
                ).map(([f, label, align]) => (
                  <th
                    key={f}
                    onClick={() => handleSort(f)}
                    className={`p-4 deck-mono text-[11px] uppercase tracking-[0.14em] font-semibold cursor-pointer select-none transition-colors hover:text-white ${
                      align === "right" ? "text-right" : "text-left"
                    }`}
                    style={{ color: "var(--ink-faint)" }}
                  >
                    {label}
                    {arrow(f)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedClients.map((c) => (
                <tr
                  key={c.id}
                  className="transition-colors"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                        {c.name}
                      </span>
                      {c.atRisk && <span className="chip chip-danger">En riesgo</span>}
                    </div>
                    {/* barra proporcional al costo */}
                    <div className="h-1 w-full max-w-[260px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(c.cost / metrics.maxCost) * 100}%`,
                          background: c.atRisk ? "var(--danger)" : "var(--grad)",
                        }}
                      />
                    </div>
                  </td>
                  <td className="p-4 text-sm text-right deck-mono align-middle" style={{ color: "var(--ink-soft)" }}>
                    {fTokens(c.tokens)}
                  </td>
                  <td className="p-4 text-sm text-right deck-mono align-middle font-semibold" style={{ color: "var(--ink)" }}>
                    {fCost(c.cost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs mt-3 text-right" style={{ color: "var(--ink-faint)" }}>
        Haz clic en las cabeceras para ordenar. La barra bajo cada negocio es proporcional a su costo.
      </p>
    </section>
  );
}
