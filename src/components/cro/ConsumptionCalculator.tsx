"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/tracking";

type Mode = "eficiente" | "agentic" | "flash";

const CRED_PER_ATT: Record<Mode, number> = {
  eficiente: 4,
  agentic: 17,
  flash: 36,
};

const MODE_META: Record<Mode, { name: string; from: string }> = {
  eficiente: { name: "Eficiente", from: "Plan Conect" },
  agentic: { name: "Agentic", from: "Plan Conect" },
  flash: { name: "Agentic Pro", from: "Plan MAX" },
};

const ADDON_CRED = 5000;
const ADDON_PRICE = 100;

type Plan = {
  id: "conect" | "advanced" | "max";
  name: string;
  price: number;
  credits: number;
  users: number;
  modes: Mode[];
};

const PLANS: Plan[] = [
  { id: "conect", name: "Conect", price: 129, credits: 8000, users: 3, modes: ["eficiente", "agentic"] },
  { id: "advanced", name: "Advanced", price: 179, credits: 12000, users: 5, modes: ["eficiente", "agentic"] },
  { id: "max", name: "MAX", price: 279, credits: 28000, users: 15, modes: ["eficiente", "agentic", "flash"] },
];

const PRESETS = [
  { label: "Chica", value: 200 },
  { label: "Mediana", value: 600 },
  { label: "Activa", value: 1500 },
  { label: "Alto vol", value: 3500 },
];

const FONT_BODY = "Inter, system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";

function recomendar(mode: Mode, attentions: number) {
  const creditsNeeded = attentions * CRED_PER_ATT[mode];
  const available = PLANS.filter((p) => p.modes.includes(mode));
  const results = available.map((p) => {
    const overflow = Math.max(0, creditsNeeded - p.credits);
    const addons = Math.ceil(overflow / ADDON_CRED);
    return {
      plan: p,
      addons,
      totalCredits: p.credits + addons * ADDON_CRED,
      totalCost: p.price + addons * ADDON_PRICE,
    };
  });
  results.sort((a, b) => a.totalCost - b.totalCost || b.plan.users - a.plan.users);
  return { best: results[0], all: results, creditsNeeded };
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(n);
}

export default function ConsumptionCalculator() {
  const [mode, setMode] = useState<Mode>("agentic");
  const [attentions, setAttentions] = useState<number>(600);

  const result = useMemo(() => recomendar(mode, attentions), [mode, attentions]);

  // Tracking: view event una sola vez al entrar a viewport (≥50%)
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewFiredRef = useRef(false);
  useEffect(() => {
    if (!sectionRef.current || viewFiredRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !viewFiredRef.current) {
            track("calc_consumo_view", {
              page_path: "/calculadora-de-consumo",
            });
            viewFiredRef.current = true;
            obs.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Tracking: input_change con debounce 500ms
  const firstRunRef = useRef(true);
  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }
    const t = setTimeout(() => {
      track("calc_consumo_input_change", {
        mode,
        attentions,
        recommended_plan: result.best.plan.id,
        total_cost: result.best.totalCost,
        page_path: "/calculadora-de-consumo",
      });
    }, 500);
    return () => clearTimeout(t);
  }, [mode, attentions, result]);

  const showCorpHint = attentions >= 3500;

  return (
    <section
      id="calc"
      ref={sectionRef}
      style={{
        padding: "72px 24px",
        background: "#FAFAFA",
        borderTop: "1px solid #EEECEA",
        borderBottom: "1px solid #EEECEA",
        scrollMarginTop: 80,
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#6B7280",
          }}
        >
          Sección 07
        </span>
        <h2
          style={{
            fontFamily: FONT_BODY,
            fontSize: "clamp(26px, 3.4vw, 34px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            margin: "10px 0 28px",
            color: "#0A0A0A",
          }}
        >
          Calcula tu plan ideal
        </h2>

        {/* ────── Inputs card ────── */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #EEECEA",
            borderRadius: 18,
            padding: "28px 28px 24px",
          }}
        >
          {/* Step 01 — Modo */}
          <StepLabel num="01" text="¿Qué modo de IA vas a usar?" />
          <div
            role="radiogroup"
            aria-label="Modo de IA"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
              marginTop: 12,
              marginBottom: 28,
            }}
          >
            {(["eficiente", "agentic", "flash"] as Mode[]).map((m) => {
              const active = m === mode;
              const meta = MODE_META[m];
              return (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setMode(m)}
                  style={{
                    textAlign: "left",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: active ? "1.5px solid #0A0A0A" : "1px solid #EEECEA",
                    background: active ? "#0A0A0A" : "#fff",
                    color: active ? "#fff" : "#0A0A0A",
                    cursor: "pointer",
                    fontFamily: FONT_BODY,
                    transition: "background 0.15s, color 0.15s, border-color 0.15s",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{meta.name}</div>
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 12,
                      marginTop: 4,
                      color: active ? "rgba(255,255,255,0.7)" : "#6B7280",
                    }}
                  >
                    ~{CRED_PER_ATT[m]} cr/atención · {meta.from}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Step 02 — Atenciones */}
          <StepLabel num="02" text="¿Cuántas atenciones esperas al mes?" />
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              marginTop: 14,
              marginBottom: 14,
            }}
          >
            <input
              type="number"
              min={50}
              max={5000}
              step={50}
              value={attentions}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (!Number.isFinite(v)) return;
                setAttentions(Math.max(50, Math.min(5000, Math.round(v))));
              }}
              aria-label="Atenciones por mes"
              style={{
                width: 140,
                fontFamily: FONT_MONO,
                fontSize: 32,
                fontWeight: 700,
                color: "#0A0A0A",
                letterSpacing: "-0.02em",
                border: "1px solid #EEECEA",
                borderRadius: 12,
                padding: "8px 12px",
                outline: "none",
                background: "#fff",
              }}
            />
            <span style={{ fontSize: 14, color: "#6B7280" }}>atenciones / mes</span>
          </div>

          <input
            type="range"
            min={50}
            max={5000}
            step={50}
            value={attentions}
            onChange={(e) => setAttentions(Number(e.target.value))}
            aria-label="Atenciones por mes (slider)"
            style={{
              width: "100%",
              accentColor: "#009FE3",
              marginBottom: 8,
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: FONT_MONO,
              fontSize: 11,
              color: "#9CA3AF",
              marginBottom: 18,
            }}
          >
            <span>50</span>
            <span>5.000</span>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {PRESETS.map((p) => {
              const active = p.value === attentions;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setAttentions(p.value)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: active ? "1.5px solid #0A0A0A" : "1px solid #EEECEA",
                    background: active ? "#0A0A0A" : "#fff",
                    color: active ? "#fff" : "#0A0A0A",
                    fontFamily: FONT_BODY,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {p.label} <span style={{ opacity: 0.6, marginLeft: 4 }}>{p.value}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ────── Resultado ────── */}
        <div style={{ marginTop: 28 }}>
          {/* Card recomendado */}
          <div
            style={{
              background: "rgba(0,159,227,0.08)",
              border: "1px solid rgba(0,159,227,0.25)",
              borderRadius: 18,
              padding: "28px 28px",
            }}
          >
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#009FE3",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span aria-hidden>✓</span> Plan recomendado
            </div>
            <div
              style={{
                fontFamily: FONT_BODY,
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "#0A0A0A",
                marginBottom: 8,
                lineHeight: 1.1,
              }}
            >
              {result.best.plan.name}
            </div>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 13.5,
                color: "#374151",
                letterSpacing: "0.02em",
              }}
            >
              ${fmt(result.best.plan.price)} / mes · {fmt(result.best.plan.credits)} créditos · {result.best.plan.users} usuarios
            </div>
          </div>

          {/* Breakdown 4 celdas */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 1,
              background: "#EEECEA",
              border: "1px solid #EEECEA",
              borderTop: "none",
              borderRadius: "0 0 0 0",
              marginTop: 0,
            }}
          >
            <BreakdownCell label="Créditos que necesitas" value={fmt(result.creditsNeeded)} />
            <BreakdownCell label="Créditos del plan" value={fmt(result.best.plan.credits)} />
            <BreakdownCell
              label="Add-ons extra"
              value={`${result.best.addons} × $${ADDON_PRICE}`}
            />
            <BreakdownCell label="Créditos totales" value={fmt(result.best.totalCredits)} />
          </div>

          {/* Línea ámbar add-ons */}
          {result.best.addons > 0 && (
            <div
              style={{
                marginTop: 16,
                padding: "14px 18px",
                background: "rgba(245,158,11,0.08)",
                borderLeft: "3px solid #F59E0B",
                borderRadius: 8,
                fontSize: 14,
                lineHeight: 1.55,
                color: "#0A0A0A",
              }}
            >
              Necesitas {result.best.addons} pack{result.best.addons > 1 ? "s" : ""} de +5.000
              créditos para cubrir tu volumen (~{fmt(result.best.addons * Math.floor(ADDON_CRED / CRED_PER_ATT[mode]))}{" "}
              atenciones extra · +${result.best.addons * ADDON_PRICE}/mes).
            </div>
          )}

          {/* Barra costo total */}
          <div
            style={{
              marginTop: 16,
              background: "#0A0A0A",
              color: "#fff",
              padding: "20px 24px",
              borderRadius: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Costo total mensual
            </span>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              USD ${fmt(result.best.totalCost)}
            </span>
          </div>

          {/* Callout corporativo */}
          {showCorpHint && (
            <div
              style={{
                marginTop: 16,
                padding: "16px 20px",
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.25)",
                borderRadius: 12,
                fontSize: 14,
                lineHeight: 1.55,
                color: "#0A0A0A",
              }}
            >
              A tu volumen, probablemente el <strong>Plan Corporativo</strong> (desde
              USD $1.500/mes, créditos personalizados, usuarios ilimitados, modos custom)
              te salga más conveniente.{" "}
              <a href="/hablar-con-ventas" style={{ color: "#7C3AED", fontWeight: 600 }}>
                Habla con ventas →
              </a>
            </div>
          )}
        </div>

        {/* ────── Comparativa de planes ────── */}
        {result.all.length > 1 && (
          <div style={{ marginTop: 40 }}>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#6B7280",
                marginBottom: 14,
              }}
            >
              Comparativa — modo {MODE_META[mode].name}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              {result.all.map((r) => {
                const isBest = r.plan.id === result.best.plan.id;
                return (
                  <div
                    key={r.plan.id}
                    style={{
                      position: "relative",
                      background: "#fff",
                      border: isBest ? "1.5px solid #0A0A0A" : "1px solid #EEECEA",
                      borderRadius: 14,
                      padding: "18px 18px",
                    }}
                  >
                    {isBest && (
                      <span
                        style={{
                          position: "absolute",
                          top: -10,
                          left: 14,
                          background: "#0A0A0A",
                          color: "#fff",
                          fontFamily: FONT_MONO,
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          padding: "3px 9px",
                          borderRadius: 999,
                        }}
                      >
                        Tu plan
                      </span>
                    )}
                    <div
                      style={{
                        fontFamily: FONT_BODY,
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#0A0A0A",
                        marginBottom: 4,
                      }}
                    >
                      {r.plan.name}
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 12,
                        color: "#6B7280",
                        marginBottom: 12,
                      }}
                    >
                      Base ${r.plan.price} + {r.addons} add-on{r.addons === 1 ? "" : "s"}
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#0A0A0A",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      ${fmt(r.totalCost)}
                      <span
                        style={{
                          fontSize: 12,
                          color: "#6B7280",
                          fontWeight: 500,
                          marginLeft: 4,
                          letterSpacing: 0,
                        }}
                      >
                        / mes
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StepLabel({ num, text }: { num: string; text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 10,
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#009FE3",
        }}
      >
        Step {num}
      </span>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 15.5,
          fontWeight: 600,
          color: "#0A0A0A",
        }}
      >
        {text}
      </span>
    </div>
  );
}

function BreakdownCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#fff", padding: "18px 16px" }}>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#6B7280",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 18,
          fontWeight: 700,
          color: "#0A0A0A",
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </div>
    </div>
  );
}
