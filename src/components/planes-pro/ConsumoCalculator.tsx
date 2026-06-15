"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/tracking";

// ── Tokens del sitio (clinera.io / /planes) ──
const FONT = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";
const ACCENT = "#7C3AED"; // violeta de marca (protagonista en /planes)
const ACCENT_BG = "rgba(124,58,237,0.06)";
const ACCENT_BD = "rgba(124,58,237,0.28)";
const GREEN = "#10B981";
const GREEN_TX = "#047857";
const AMBER = "#F59E0B";
const INK = "#0A0A0A";
const MUTED = "#4B5563";
const FAINT = "#9CA3AF";
const BORDER = "#E5E7EB";

// ── Modelo de consumo ──
const CR_EFICIENTE = 10;
const CR_AGENTIC = 195;
const MARGEN = 1.3; // +30% margen de seguridad
const ADDON_CR = 5000;
const ADDON_PRICE = 50;

type Plan = { id: string; name: string; price: number; credits: number; stripe: string };
const PLANS: Plan[] = [
  { id: "conect", name: "Conect", price: 129, credits: 10000, stripe: "https://buy.stripe.com/28EbJ32WJ3Um4cz6VZ1441k" },
  { id: "advanced", name: "Advanced", price: 179, credits: 15000, stripe: "https://buy.stripe.com/4gM00l7cZ8aCfVh6VZ1441m" },
  { id: "max", name: "MAX", price: 279, credits: 28000, stripe: "https://buy.stripe.com/6oU14pdBn9eGeRdgwz1441n" },
];

type Mode = "eficiente" | "mixto" | "agentic";
const PRESETS = [200, 600, 1500, 3500];

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(Math.round(n));
}

function crPorConv(mode: Mode, pAgentic: number): number {
  if (mode === "eficiente") return CR_EFICIENTE;
  if (mode === "agentic") return CR_AGENTIC;
  const p = pAgentic / 100;
  return CR_EFICIENTE * (1 - p) + CR_AGENTIC * p;
}

type PlanResult = Plan & { packs: number; covers: boolean; totalCredits: number; totalCost: number };

function calcular(mode: Mode, pAgentic: number, conversaciones: number) {
  const cpc = crPorConv(mode, pAgentic);
  const necesarios = Math.round(conversaciones * cpc * MARGEN);

  const perPlan: PlanResult[] = PLANS.map((pl) => {
    const overflow = Math.max(0, necesarios - pl.credits);
    const packs = Math.ceil(overflow / ADDON_CR);
    return {
      ...pl,
      packs,
      covers: overflow === 0,
      totalCredits: pl.credits + packs * ADDON_CR,
      totalCost: pl.price + packs * ADDON_PRICE,
    };
  });

  const recomendado = perPlan.find((p) => p.covers) ?? perPlan[perPlan.length - 1];
  const corporativo = necesarios > 75000;
  return { cpc, necesarios, perPlan, recomendado, corporativo };
}

export default function ConsumoCalculator() {
  const [mode, setMode] = useState<Mode>("eficiente");
  const [pAgentic, setPAgentic] = useState<number>(20);
  const [conv, setConv] = useState<number>(600);

  const r = useMemo(() => calcular(mode, pAgentic, conv), [mode, pAgentic, conv]);

  const sectionRef = useRef<HTMLElement | null>(null);
  const viewFired = useRef(false);
  useEffect(() => {
    if (!sectionRef.current || viewFired.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !viewFired.current) {
            track("calc_planespro_view", { page_path: "/planes-pro" });
            viewFired.current = true;
            obs.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const t = setTimeout(() => {
      track("calc_planespro_input_change", {
        mode,
        p_agentic: mode === "mixto" ? pAgentic : undefined,
        conversaciones: conv,
        plan_recomendado: r.recomendado.id,
        costo_total: r.recomendado.totalCost,
        page_path: "/planes-pro",
      });
    }, 500);
    return () => clearTimeout(t);
  }, [mode, pAgentic, conv, r]);

  const barPct = Math.min(100, (r.necesarios / r.recomendado.credits) * 100);
  const cpcLabel = mode === "mixto" ? r.cpc.toFixed(0) : String(r.cpc);

  return (
    <section
      id="calculadora"
      ref={sectionRef}
      aria-labelledby="calc-title"
      style={{
        padding: "112px 24px",
        background: "#FAFAFA",
        borderTop: `1px solid #F0F0F0`,
        scrollMarginTop: 80,
        fontFamily: FONT,
        color: INK,
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <Eyebrow>Calculadora</Eyebrow>
        <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, margin: "14px 0 12px" }}>
          Calcula tu consumo real
        </h2>
        <p style={{ fontFamily: FONT, fontSize: 17, lineHeight: 1.55, color: MUTED, maxWidth: 620, margin: "0 0 36px" }}>
          Ajusta tu modo de uso y tu volumen mensual. Te recomendamos el plan que cubre tu caso —
          con un margen de seguridad del 30% ya incluido.
        </p>

        <div style={{ display: "grid", gap: 20 }}>
          {/* Inputs */}
          <div style={cardStyle}>
            <StepLabel num="01" text="¿En qué modo responderá tu agente?" />
            <div role="radiogroup" aria-label="Modo de uso" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, margin: "12px 0 0" }}>
              {([
                ["eficiente", "Eficiente", "~10 cr"],
                ["mixto", "Mixto", "10–195 cr"],
                ["agentic", "Agentic", "~195 cr"],
              ] as [Mode, string, string][]).map(([m, label, hint]) => {
                const active = m === mode;
                return (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setMode(m)}
                    style={{
                      textAlign: "left",
                      padding: "13px 14px",
                      borderRadius: 14,
                      border: active ? `2px solid ${ACCENT}` : `1px solid ${BORDER}`,
                      background: active ? ACCENT_BG : "#fff",
                      color: INK,
                      cursor: "pointer",
                      fontFamily: FONT,
                      transition: "background .15s,border-color .15s",
                    }}
                  >
                    <span style={{ display: "block", fontWeight: 700, fontSize: 15 }}>{label}</span>
                    <span style={{ display: "block", fontFamily: MONO, fontSize: 12, marginTop: 3, color: active ? ACCENT : FAINT }}>
                      {hint}/conv
                    </span>
                  </button>
                );
              })}
            </div>

            {mode === "mixto" && (
              <div style={{ marginTop: 18 }}>
                <label htmlFor="p-agentic" style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: MUTED, marginBottom: 8 }}>
                  <span>% de conversaciones en modo Agentic</span>
                  <span style={{ fontFamily: MONO, color: INK, fontWeight: 600 }}>{pAgentic}%</span>
                </label>
                <input id="p-agentic" type="range" min={0} max={100} step={5} value={pAgentic} onChange={(e) => setPAgentic(Number(e.target.value))} style={{ width: "100%", accentColor: ACCENT }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 11, color: FAINT, marginTop: 4 }}>
                  <span>0% (todo Eficiente)</span>
                  <span>100% (todo Agentic)</span>
                </div>
              </div>
            )}

            <div style={{ marginTop: 28 }}>
              <StepLabel num="02" text="¿Cuántas conversaciones esperas al mes?" />
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 14 }}>
                <input
                  type="number"
                  min={50}
                  max={20000}
                  step={50}
                  value={conv}
                  aria-label="Conversaciones por mes"
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (!Number.isFinite(v)) return;
                    setConv(Math.max(50, Math.min(20000, Math.round(v))));
                  }}
                  style={{
                    width: 150,
                    fontFamily: MONO,
                    fontSize: 30,
                    fontWeight: 700,
                    color: INK,
                    letterSpacing: "-0.02em",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 14,
                    padding: "8px 12px",
                    outline: "none",
                    background: "#fff",
                  }}
                />
                <span style={{ fontSize: 14, color: MUTED }}>conversaciones / mes</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                {PRESETS.map((p) => {
                  const active = p === conv;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setConv(p)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 999,
                        border: active ? `2px solid ${ACCENT}` : `1px solid ${BORDER}`,
                        background: active ? ACCENT_BG : "#fff",
                        color: INK,
                        fontFamily: FONT,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {fmt(p)}
                    </button>
                  );
                })}
              </div>
              <p style={{ fontFamily: MONO, fontSize: 12, color: FAINT, marginTop: 14 }}>
                Costo estimado por conversación en este modo: <strong style={{ color: INK }}>~{cpcLabel} créditos</strong>
              </p>
            </div>
          </div>

          {/* Resultado */}
          <div>
            <div style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BD}`, borderRadius: 20, padding: "28px 28px" }}>
              <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: ACCENT, marginBottom: 8 }}>
                Plan recomendado
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em" }}>{r.recomendado.name}</span>
                <span style={{ fontFamily: MONO, fontSize: 15, color: MUTED }}>
                  ${fmt(r.recomendado.price)} / mes · {fmt(r.recomendado.credits)} créditos
                </span>
              </div>

              <div style={{ marginTop: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 12.5, color: MUTED, marginBottom: 6 }}>
                  <span>Necesitas ~{fmt(r.necesarios)} cr</span>
                  <span>Incluye {fmt(r.recomendado.credits)} cr</span>
                </div>
                <div style={{ position: "relative", height: 12, background: "#ECECEC", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, width: `${barPct}%`, background: r.recomendado.packs > 0 ? AMBER : ACCENT, borderRadius: 999, transition: "width .25s ease" }} />
                </div>
                {r.recomendado.packs > 0 && (
                  <p style={{ fontSize: 13.5, lineHeight: 1.5, color: INK, marginTop: 12, padding: "12px 14px", background: "rgba(245,158,11,0.10)", borderLeft: `3px solid ${AMBER}`, borderRadius: 8 }}>
                    Tu volumen supera los {fmt(r.recomendado.credits)} cr del plan. Súmale{" "}
                    <strong>{r.recomendado.packs} pack{r.recomendado.packs > 1 ? "s" : ""}</strong> de +5.000 cr
                    (+${fmt(r.recomendado.packs * ADDON_PRICE)}/mes) para cubrirlo.
                  </p>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 1, background: BORDER, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", marginTop: 20 }}>
                <Cell label="Créditos necesarios" value={fmt(r.necesarios)} />
                <Cell label="Créditos del plan" value={fmt(r.recomendado.credits)} />
                <Cell label="Packs extra" value={r.recomendado.packs > 0 ? `${r.recomendado.packs} × $${ADDON_PRICE}` : "—"} />
                <Cell label="Total / mes" value={`$${fmt(r.recomendado.totalCost)}`} accent />
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
                <a
                  href={r.recomendado.stripe}
                  data-plan-name={`planes-pro calc · ${r.recomendado.name}`}
                  style={{ display: "inline-block", background: GRAD, color: "#fff", padding: "12px 22px", borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: "none" }}
                >
                  Activar {r.recomendado.name}
                </a>
                <a
                  href="/hablar-con-ventas"
                  style={{ display: "inline-block", border: `1px solid ${BORDER}`, background: "#fff", color: INK, padding: "12px 22px", borderRadius: 999, fontWeight: 600, fontSize: 15, textDecoration: "none" }}
                >
                  Hablar con ventas
                </a>
              </div>
            </div>

            {r.corporativo && (
              <div style={{ marginTop: 16, padding: "16px 20px", background: ACCENT_BG, border: `1px solid ${ACCENT_BD}`, borderRadius: 14, fontSize: 14, lineHeight: 1.55 }}>
                A tu volumen, sumar tantos packs deja de convenir. El <strong>plan Corporativo</strong>{" "}
                (desde $1.500/mes, créditos a medida) suele salir mejor.{" "}
                <a href="/hablar-con-ventas" style={{ color: ACCENT, fontWeight: 600 }}>Hablar con el equipo →</a>
              </div>
            )}

            <div style={{ marginTop: 24 }}>
              <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: FAINT, marginBottom: 12 }}>
                Qué pasaría con cada plan a este volumen
              </div>
              <div style={{ overflowX: "auto", border: `1px solid ${BORDER}`, borderRadius: 16 }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 440, fontFamily: FONT }}>
                  <thead>
                    <tr>
                      {["Plan", "¿Cubre?", "Packs", "Total / mes"].map((h) => (
                        <th key={h} style={thMini}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {r.perPlan.map((p) => {
                      const isBest = p.id === r.recomendado.id;
                      return (
                        <tr key={p.id} style={{ background: isBest ? ACCENT_BG : "transparent" }}>
                          <td style={tdMini}>
                            <span style={{ fontWeight: 700 }}>{p.name}</span>
                            {isBest && (
                              <span style={{ marginLeft: 8, fontFamily: MONO, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: ACCENT, color: "#fff", padding: "2px 7px", borderRadius: 999 }}>
                                tu plan
                              </span>
                            )}
                          </td>
                          <td style={{ ...tdMini, fontFamily: MONO }}>
                            {p.covers ? <span style={{ color: GREEN_TX }}>Sí, holgado</span> : <span style={{ color: FAINT }}>Con packs</span>}
                          </td>
                          <td style={{ ...tdMini, fontFamily: MONO }}>{p.packs > 0 ? `${p.packs}` : "—"}</td>
                          <td style={{ ...tdMini, fontFamily: MONO, fontWeight: 700 }}>${fmt(p.totalCost)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <p style={{ fontFamily: MONO, fontSize: 12.5, color: FAINT, lineHeight: 1.6, marginTop: 18 }}>
              Estimación con +30% de margen de seguridad. Tu consumo real puede variar según la mezcla de modos.
              <br />
              Las llamadas de voz (CAMILA) consumen créditos aparte — costo por llamada{" "}
              <strong style={{ color: MUTED }}>[CONFIRMAR]</strong>, aún no incluido en esta calculadora.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Tokens compuestos / subcomponentes ──
const GRAD = "linear-gradient(135deg,#3B82F6 0%,#7C3AED 50%,#D946EF 100%)";

const cardStyle: React.CSSProperties = { background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 20, padding: "28px 28px 26px", boxShadow: "0 4px 24px rgba(0,0,0,.03)" };

const thMini: React.CSSProperties = { textAlign: "left", fontFamily: MONO, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: FAINT, padding: "12px 14px", borderBottom: `1px solid ${BORDER}`, background: "#FAFAFA" };
const tdMini: React.CSSProperties = { padding: "13px 14px", borderBottom: `1px solid ${BORDER}`, fontSize: 14, color: INK };

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT }}>
      {children}
    </span>
  );
}

function StepLabel({ num, text }: { num: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
      <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: ACCENT }}>Paso {num}</span>
      <span style={{ fontFamily: FONT, fontSize: 15.5, fontWeight: 600, color: INK }}>{text}</span>
    </div>
  );
}

function Cell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ background: "#fff", padding: "16px 14px" }}>
      <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: FAINT, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 700, color: accent ? ACCENT : INK, letterSpacing: "-0.01em" }}>{value}</div>
    </div>
  );
}
