"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/tracking";

// ── Tokens del sitio (clinera.io / /planes) ──
const FONT = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";
const ACCENT = "#7C3AED"; // violeta de marca (protagonista en /planes)
const ACCENT_BG = "rgba(124,58,237,0.06)";
const ACCENT_BD = "rgba(124,58,237,0.28)";
const GREEN_TX = "#047857";
const AMBER = "#F59E0B";
const INK = "#0A0A0A";
const MUTED = "#4B5563";
const FAINT = "#9CA3AF";
const BORDER = "#E5E7EB";

// ── Tarifario de créditos ──
const CR_TEXTO = 10; // por conversación de texto simple (Eficiente)
const CR_AGENDA = 195; // por agendamiento automático (Agentic)
const CR_VOZ = 25; // por minuto de voz (CAMILA)
const CR_LIA = 4000; // fiscalización + informes (LIA), por mes
const IMPL = 450; // implementación, pago único
const CORP_FROM = 1900; // Corporativo desde USD/mes

type Plan = { id: string; name: string; price: number; credits: number; tier: 1 | 2 | 3; includes: string };
const PLANS: Plan[] = [
  { id: "vortex", name: "Vortex", price: 279, credits: 28000, tier: 1, includes: "AURA" },
  { id: "atlas", name: "Atlas", price: 379, credits: 37000, tier: 2, includes: "AURA + CAMILA" },
  { id: "summit", name: "Summit", price: 479, credits: 46000, tier: 3, includes: "AURA + CAMILA + LIA" },
];

const PRESETS = [200, 600, 1500, 3500];

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(Math.round(n));
}

type PlanResult = Plan & { covers: boolean; blockedFeature: boolean };

function calcular(conversaciones: number, agendamientos: number, minutosVoz: number, lia: boolean) {
  const crTexto = conversaciones * CR_TEXTO;
  const crAgenda = agendamientos * CR_AGENDA;
  const crVoz = minutosVoz * CR_VOZ;
  const crLia = lia ? CR_LIA : 0;
  const necesarios = crTexto + crAgenda + crVoz + crLia;

  // Mínimo por feature: LIA solo en Summit; la voz (CAMILA) desde Atlas.
  const minTier: 1 | 2 | 3 = lia ? 3 : minutosVoz > 0 ? 2 : 1;

  const perPlan: PlanResult[] = PLANS.map((pl) => ({
    ...pl,
    covers: pl.tier >= minTier && pl.credits >= necesarios,
    blockedFeature: pl.tier < minTier,
  }));

  const recomendado = perPlan.find((p) => p.covers) ?? null;
  const corporativo = recomendado === null;
  return { crTexto, crAgenda, crVoz, crLia, necesarios, minTier, perPlan, recomendado, corporativo };
}

export default function ConsumoCalculator() {
  const [conv, setConv] = useState<number>(600);
  const [agenda, setAgenda] = useState<number>(0);
  const [voz, setVoz] = useState<number>(0);
  const [lia, setLia] = useState<boolean>(false);

  const r = useMemo(() => calcular(conv, agenda, voz, lia), [conv, agenda, voz, lia]);

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
        conversaciones: conv,
        agendamientos: agenda,
        minutos_voz: voz,
        lia,
        creditos_necesarios: r.necesarios,
        plan_recomendado: r.recomendado?.id ?? "corporativo",
        page_path: "/planes-pro",
      });
    }, 500);
    return () => clearTimeout(t);
  }, [conv, agenda, voz, lia, r]);

  const target = r.recomendado?.credits ?? 46000;
  const barPct = Math.min(100, (r.necesarios / target) * 100);

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
          Calcula tus créditos
        </h2>
        <p style={{ fontFamily: FONT, fontSize: 17, lineHeight: 1.55, color: MUTED, maxWidth: 620, margin: "0 0 36px" }}>
          Suma tus conversaciones de texto, tus minutos de voz y —si la necesitas— la fiscalización de LIA.
          Te recomendamos la bolsa de créditos que cubre tu caso.
        </p>

        <div style={{ display: "grid", gap: 20 }}>
          {/* Inputs */}
          <div style={cardStyle}>
            {/* Tarifario */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {[
                ["Texto", "10 cr"],
                ["Agendamiento", "195 cr"],
                ["Min. voz", "25 cr"],
                ["LIA · informes", "≈4.000 cr/mes"],
              ].map(([k, v]) => (
                <span
                  key={k}
                  style={{
                    fontFamily: MONO,
                    fontSize: 11.5,
                    color: MUTED,
                    background: "#F3F4F6",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 999,
                    padding: "5px 12px",
                  }}
                >
                  {k}: <strong style={{ color: INK }}>{v}</strong>
                </span>
              ))}
            </div>

            <StepLabel num="01" text="¿Cuántas conversaciones de texto al mes?" />
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 14 }}>
              <input
                type="number"
                min={0}
                max={20000}
                step={50}
                value={conv}
                aria-label="Conversaciones de texto por mes"
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (!Number.isFinite(v)) return;
                  setConv(Math.max(0, Math.min(20000, Math.round(v))));
                }}
                style={numInput}
              />
              <span style={{ fontSize: 14, color: MUTED }}>conversaciones / mes · 10 cr c/u</span>
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
            <p style={{ fontFamily: MONO, fontSize: 12, color: FAINT, marginTop: 12 }}>
              Conversaciones simples de AURA (~10 cr c/u).
            </p>

            <div style={{ marginTop: 28 }}>
              <StepLabel num="02" text="¿Cuántos agendamientos automáticos al mes? (Agentic)" />
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 14 }}>
                <input
                  type="number"
                  min={0}
                  max={5000}
                  step={10}
                  value={agenda}
                  aria-label="Agendamientos automáticos por mes"
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (!Number.isFinite(v)) return;
                    setAgenda(Math.max(0, Math.min(5000, Math.round(v))));
                  }}
                  style={numInput}
                />
                <span style={{ fontSize: 14, color: MUTED }}>agendamientos / mes · 195 cr c/u</span>
              </div>
              <p style={{ fontFamily: MONO, fontSize: 12, color: FAINT, marginTop: 12 }}>
                Cuando la IA agenda sola (modo Agentic): razona, consulta tu agenda y ejecuta varios pasos.
              </p>
            </div>

            <div style={{ marginTop: 28 }}>
              <StepLabel num="03" text="¿Cuántos minutos de voz al mes? (CAMILA)" />
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 14 }}>
                <input
                  type="number"
                  min={0}
                  max={10000}
                  step={50}
                  value={voz}
                  aria-label="Minutos de voz por mes"
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (!Number.isFinite(v)) return;
                    setVoz(Math.max(0, Math.min(10000, Math.round(v))));
                  }}
                  style={numInput}
                />
                <span style={{ fontSize: 14, color: MUTED }}>minutos / mes · 25 cr c/u</span>
              </div>
              <p style={{ fontFamily: MONO, fontSize: 12, color: FAINT, marginTop: 12 }}>
                La voz (CAMILA) está disponible desde el plan Atlas.
              </p>
            </div>

            <div style={{ marginTop: 28 }}>
              <StepLabel num="04" text="¿Sumar fiscalización + informes con LIA?" />
              <button
                type="button"
                role="switch"
                aria-checked={lia}
                onClick={() => setLia((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  width: "100%",
                  textAlign: "left",
                  marginTop: 14,
                  padding: "16px 18px",
                  borderRadius: 14,
                  border: lia ? `2px solid ${ACCENT}` : `1px solid ${BORDER}`,
                  background: lia ? ACCENT_BG : "#fff",
                  color: INK,
                  cursor: "pointer",
                  fontFamily: FONT,
                  transition: "background .15s,border-color .15s",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    flex: "0 0 auto",
                    width: 44,
                    height: 26,
                    borderRadius: 999,
                    background: lia ? ACCENT : "#E5E7EB",
                    position: "relative",
                    transition: "background .15s",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      left: lia ? 21 : 3,
                      width: 20,
                      height: 20,
                      borderRadius: 999,
                      background: "#fff",
                      transition: "left .15s",
                    }}
                  />
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontWeight: 700, fontSize: 15 }}>
                    Sumar LIA {lia ? "· activado" : ""}
                  </span>
                  <span style={{ display: "block", fontFamily: MONO, fontSize: 12, marginTop: 3, color: lia ? ACCENT : FAINT }}>
                    +4.000 cr/mes · solo viene en el plan Summit
                  </span>
                </span>
              </button>
            </div>

            <p style={{ fontFamily: MONO, fontSize: 12, color: FAINT, marginTop: 20 }}>
              Créditos que necesitas este mes: <strong style={{ color: INK }}>~{fmt(r.necesarios)} créditos</strong>
            </p>
          </div>

          {/* Resultado */}
          <div>
            {r.corporativo || !r.recomendado ? (
              <div style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BD}`, borderRadius: 20, padding: "28px 28px" }}>
                <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: ACCENT, marginBottom: 8 }}>
                  Plan recomendado
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em" }}>Corporativo</span>
                  <span style={{ fontFamily: MONO, fontSize: 15, color: MUTED }}>desde USD ${fmt(CORP_FROM)} / mes</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.55, marginTop: 16 }}>
                  Necesitas ~{fmt(r.necesarios)} créditos, más de los 46.000 de Summit. A tu volumen conviene el{" "}
                  <strong>plan Corporativo</strong> (créditos a medida).{" "}
                  <a href="/hablar-con-ventas" style={{ color: ACCENT, fontWeight: 600 }}>Hablar con el equipo →</a>
                </p>
              </div>
            ) : (
              <div style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BD}`, borderRadius: 20, padding: "28px 28px" }}>
                <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: ACCENT, marginBottom: 8 }}>
                  Plan recomendado
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em" }}>{r.recomendado.name}</span>
                  <span style={{ fontFamily: MONO, fontSize: 15, color: MUTED }}>
                    USD ${fmt(r.recomendado.price)} / mes · {fmt(r.recomendado.credits)} créditos · {r.recomendado.includes}
                  </span>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 12.5, color: FAINT, marginTop: 6 }}>
                  + USD ${fmt(IMPL)} implementación (pago único)
                </div>

                <div style={{ marginTop: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 12.5, color: MUTED, marginBottom: 6 }}>
                    <span>Necesitas ~{fmt(r.necesarios)} cr</span>
                    <span>Incluye {fmt(r.recomendado.credits)} cr</span>
                  </div>
                  <div style={{ position: "relative", height: 12, background: "#ECECEC", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, width: `${barPct}%`, background: ACCENT, borderRadius: 999, transition: "width .25s ease" }} />
                  </div>
                  {(voz > 0 || lia) && (
                    <p style={{ fontSize: 13.5, lineHeight: 1.5, color: INK, marginTop: 12, padding: "12px 14px", background: "rgba(124,58,237,0.08)", borderLeft: `3px solid ${ACCENT}`, borderRadius: 8 }}>
                      {lia
                        ? "LIA (fiscalización + informes) solo viene en Summit, así que ese es tu plan mínimo."
                        : "La voz (CAMILA) está disponible desde Atlas, así que ese es tu plan mínimo."}
                    </p>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 1, background: BORDER, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", marginTop: 20 }}>
                  <Cell label="Créditos texto" value={fmt(r.crTexto)} />
                  <Cell label="Créditos agenda" value={fmt(r.crAgenda)} />
                  <Cell label="Créditos voz" value={fmt(r.crVoz)} />
                  <Cell label="Créditos LIA" value={fmt(r.crLia)} />
                  <Cell label="Total / mes" value={`$${fmt(r.recomendado.price)}`} accent />
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
                  <a
                    href="/planes"
                    data-plan-name={`planes-pro calc · ${r.recomendado.name}`}
                    style={{ display: "inline-block", background: GRAD, color: "#fff", padding: "12px 22px", borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: "none" }}
                  >
                    Ver plan {r.recomendado.name}
                  </a>
                  <a
                    href="/hablar-con-ventas"
                    style={{ display: "inline-block", border: `1px solid ${BORDER}`, background: "#fff", color: INK, padding: "12px 22px", borderRadius: 999, fontWeight: 600, fontSize: 15, textDecoration: "none" }}
                  >
                    Hablar con ventas
                  </a>
                </div>
              </div>
            )}

            <div style={{ marginTop: 24 }}>
              <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: FAINT, marginBottom: 12 }}>
                Qué cubre cada plan a este consumo
              </div>
              <div style={{ overflowX: "auto", border: `1px solid ${BORDER}`, borderRadius: 16 }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 480, fontFamily: FONT }}>
                  <thead>
                    <tr>
                      {["Plan", "Incluye", "¿Cubre?", "USD / mes"].map((h) => (
                        <th key={h} style={thMini}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {r.perPlan.map((p) => {
                      const isBest = p.id === r.recomendado?.id;
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
                          <td style={{ ...tdMini, fontFamily: MONO, fontSize: 12.5, color: MUTED }}>{p.includes}</td>
                          <td style={{ ...tdMini, fontFamily: MONO }}>
                            {p.covers ? (
                              <span style={{ color: GREEN_TX }}>Sí</span>
                            ) : p.blockedFeature ? (
                              <span style={{ color: FAINT }}>Falta feature</span>
                            ) : (
                              <span style={{ color: AMBER }}>Créditos cortos</span>
                            )}
                          </td>
                          <td style={{ ...tdMini, fontFamily: MONO, fontWeight: 700 }}>${fmt(p.price)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <p style={{ fontFamily: MONO, fontSize: 12.5, color: FAINT, lineHeight: 1.6, marginTop: 18 }}>
              Un agendamiento automático (Agentic) consume ~195 cr; una conversación simple ~10 cr. Todos los planes suman USD ${fmt(IMPL)} de implementación (pago único).
              <br />
              Sobre 46.000 créditos → Plan Corporativo (desde USD ${fmt(CORP_FROM)}/mes, créditos a medida).
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

const numInput: React.CSSProperties = {
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
};

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
