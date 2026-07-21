"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/tracking";

// ── Tarifario de créditos ──
const CR_TEXTO = 10; // por conversación de texto simple (Eficiente)
const CR_AGENDA = 195; // por agendamiento automático (Agentic)
const CR_VOZ = 25; // por minuto de voz (CAMILA)
const CR_LIA = 4000; // fiscalización + informes (LIA), por mes

const IMPL = 450; // implementación, pago único
const CORP_FROM = 1900; // Corporativo desde USD/mes

type Plan = {
  id: "vortex" | "atlas" | "summit";
  name: string;
  price: number;
  credits: number;
  tier: 1 | 2 | 3;
  includes: string;
};

const PLANS: Plan[] = [
  { id: "vortex", name: "VORTEX", price: 279, credits: 28000, tier: 1, includes: "AURA" },
  { id: "atlas", name: "ATLAS", price: 379, credits: 37000, tier: 2, includes: "AURA + CAMILA" },
  { id: "summit", name: "SUMMIT", price: 479, credits: 46000, tier: 3, includes: "AURA + CAMILA + LIA" },
];

const PRESETS = [
  { label: "Chica", value: 200 },
  { label: "Mediana", value: 600 },
  { label: "Activa", value: 1500 },
  { label: "Alto vol", value: 3500 },
];

const FONT_BODY = "Inter, system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";

function recomendar(conversaciones: number, agendamientos: number, minutosVoz: number, lia: boolean) {
  const crTexto = conversaciones * CR_TEXTO;
  const crAgenda = agendamientos * CR_AGENDA;
  const crVoz = minutosVoz * CR_VOZ;
  const crLia = lia ? CR_LIA : 0;
  const creditsNeeded = crTexto + crAgenda + crVoz + crLia;

  // Mínimo por feature: LIA solo en Summit; la voz (CAMILA) desde Atlas.
  const minTier: 1 | 2 | 3 = lia ? 3 : minutosVoz > 0 ? 2 : 1;

  const eligible = PLANS.filter((p) => p.tier >= minTier && p.credits >= creditsNeeded);
  const best = eligible[0] ?? null; // ya vienen ordenados por tier/precio asc
  const corporativo = best === null;

  return {
    creditsNeeded,
    breakdown: { texto: crTexto, agenda: crAgenda, voz: crVoz, lia: crLia },
    minTier,
    best,
    corporativo,
  };
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(n);
}

export default function ConsumptionCalculator() {
  const [conversaciones, setConversaciones] = useState<number>(600);
  const [agendamientos, setAgendamientos] = useState<number>(0);
  const [minutosVoz, setMinutosVoz] = useState<number>(0);
  const [lia, setLia] = useState<boolean>(false);

  const result = useMemo(
    () => recomendar(conversaciones, agendamientos, minutosVoz, lia),
    [conversaciones, agendamientos, minutosVoz, lia],
  );

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
        conversaciones,
        agendamientos,
        minutos_voz: minutosVoz,
        lia,
        credits_needed: result.creditsNeeded,
        recommended_plan: result.best?.id ?? "corporativo",
        page_path: "/calculadora-de-consumo",
      });
    }, 500);
    return () => clearTimeout(t);
  }, [conversaciones, agendamientos, minutosVoz, lia, result]);

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
          Calcula tus créditos y tu plan ideal
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
          {/* Tarifario */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 26,
            }}
          >
            {[
              { k: "Texto", v: "10 cr" },
              { k: "Agendamiento", v: "195 cr" },
              { k: "Min. voz", v: "25 cr" },
              { k: "LIA · informes", v: "≈4.000 cr/mes" },
            ].map((it) => (
              <span
                key={it.k}
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11.5,
                  color: "#374151",
                  background: "#F3F4F6",
                  border: "1px solid #EEECEA",
                  borderRadius: 999,
                  padding: "5px 12px",
                }}
              >
                {it.k}: <strong style={{ color: "#0A0A0A" }}>{it.v}</strong>
              </span>
            ))}
          </div>

          {/* Step 01 — Conversaciones de texto */}
          <StepLabel num="01" text="¿Cuántas conversaciones de texto esperas al mes?" />
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
              min={0}
              max={5000}
              step={50}
              value={conversaciones}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (!Number.isFinite(v)) return;
                setConversaciones(Math.max(0, Math.min(5000, Math.round(v))));
              }}
              aria-label="Conversaciones de texto por mes"
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
            <span style={{ fontSize: 14, color: "#6B7280" }}>conversaciones / mes · 10 cr c/u</span>
          </div>

          <input
            type="range"
            min={0}
            max={5000}
            step={50}
            value={conversaciones}
            onChange={(e) => setConversaciones(Number(e.target.value))}
            aria-label="Conversaciones de texto por mes (slider)"
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
              marginBottom: 14,
            }}
          >
            <span>0</span>
            <span>5.000</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            {PRESETS.map((p) => {
              const active = p.value === conversaciones;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setConversaciones(p.value)}
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
          <p
            style={{
              fontFamily: FONT_MONO,
              fontSize: 12,
              color: "#9CA3AF",
              margin: "2px 0 28px",
            }}
          >
            Conversaciones simples de AURA (~10 cr c/u).
          </p>

          {/* Step 02 — Agendamientos automáticos (Agentic) */}
          <StepLabel num="02" text="¿Cuántos agendamientos automáticos al mes? (Agentic)" />
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
              min={0}
              max={2000}
              step={10}
              value={agendamientos}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (!Number.isFinite(v)) return;
                setAgendamientos(Math.max(0, Math.min(2000, Math.round(v))));
              }}
              aria-label="Agendamientos automáticos por mes"
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
            <span style={{ fontSize: 14, color: "#6B7280" }}>agendamientos / mes · 195 cr c/u</span>
          </div>

          <input
            type="range"
            min={0}
            max={2000}
            step={10}
            value={agendamientos}
            onChange={(e) => setAgendamientos(Number(e.target.value))}
            aria-label="Agendamientos automáticos por mes (slider)"
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
              marginBottom: 14,
            }}
          >
            <span>0</span>
            <span>2.000</span>
          </div>
          <p
            style={{
              fontFamily: FONT_MONO,
              fontSize: 12,
              color: "#9CA3AF",
              margin: "2px 0 28px",
            }}
          >
            Cuando la IA agenda sola (modo Agentic): razona, consulta tu agenda y ejecuta varios pasos.
          </p>

          {/* Step 03 — Minutos de voz */}
          <StepLabel num="03" text="¿Cuántos minutos de voz al mes? (CAMILA)" />
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
              min={0}
              max={4000}
              step={50}
              value={minutosVoz}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (!Number.isFinite(v)) return;
                setMinutosVoz(Math.max(0, Math.min(4000, Math.round(v))));
              }}
              aria-label="Minutos de voz por mes"
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
            <span style={{ fontSize: 14, color: "#6B7280" }}>minutos / mes · 25 cr c/u</span>
          </div>

          <input
            type="range"
            min={0}
            max={4000}
            step={50}
            value={minutosVoz}
            onChange={(e) => setMinutosVoz(Number(e.target.value))}
            aria-label="Minutos de voz por mes (slider)"
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
              marginBottom: 14,
            }}
          >
            <span>0</span>
            <span>4.000</span>
          </div>
          <p
            style={{
              fontFamily: FONT_MONO,
              fontSize: 12,
              color: "#9CA3AF",
              margin: "2px 0 28px",
            }}
          >
            La voz (CAMILA) está disponible desde el plan ATLAS.
          </p>

          {/* Step 04 — LIA */}
          <StepLabel num="04" text="¿Quieres fiscalización + informes con LIA?" />
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
              borderRadius: 12,
              border: lia ? "1.5px solid #0A0A0A" : "1px solid #EEECEA",
              background: lia ? "#0A0A0A" : "#fff",
              color: lia ? "#fff" : "#0A0A0A",
              cursor: "pointer",
              fontFamily: FONT_BODY,
              transition: "background 0.15s, color 0.15s, border-color 0.15s",
            }}
          >
            <span
              aria-hidden
              style={{
                flex: "0 0 auto",
                width: 44,
                height: 26,
                borderRadius: 999,
                background: lia ? "#009FE3" : "#E5E7EB",
                position: "relative",
                transition: "background 0.15s",
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
                  transition: "left 0.15s",
                }}
              />
            </span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontWeight: 700, fontSize: 15 }}>
                Sumar LIA {lia ? "· activado" : ""}
              </span>
              <span
                style={{
                  display: "block",
                  fontFamily: FONT_MONO,
                  fontSize: 12,
                  marginTop: 4,
                  color: lia ? "rgba(255,255,255,0.7)" : "#6B7280",
                }}
              >
                +4.000 cr/mes · solo viene en el plan SUMMIT
              </span>
            </span>
          </button>
        </div>

        {/* ────── Resultado ────── */}
        <div style={{ marginTop: 28 }}>
          {result.corporativo || !result.best ? (
            <div
              style={{
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.25)",
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
                  color: "#7C3AED",
                  marginBottom: 8,
                }}
              >
                Plan recomendado
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
                Corporativo
              </div>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 13.5,
                  color: "#374151",
                  letterSpacing: "0.02em",
                }}
              >
                Necesitas ~{fmt(result.creditsNeeded)} créditos, más de los 46.000 de SUMMIT.
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "#0A0A0A", margin: "16px 0 0" }}>
                A tu volumen conviene el <strong>Plan Corporativo</strong> (desde USD ${fmt(CORP_FROM)}/mes,
                créditos a medida).{" "}
                <a href="/hablar-con-ventas" style={{ color: "#7C3AED", fontWeight: 600 }}>
                  Habla con ventas →
                </a>
              </p>
            </div>
          ) : (
            <>
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
                  {result.best.name}
                </div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 13.5,
                    color: "#374151",
                    letterSpacing: "0.02em",
                  }}
                >
                  USD ${fmt(result.best.price)} / mes · {fmt(result.best.credits)} créditos · {result.best.includes}
                </div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 12.5,
                    color: "#6B7280",
                    marginTop: 6,
                  }}
                >
                  + USD ${fmt(IMPL)} implementación (pago único)
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
                  marginTop: 0,
                }}
              >
                <BreakdownCell label="Créditos texto" value={fmt(result.breakdown.texto)} />
                <BreakdownCell label="Créditos agenda" value={fmt(result.breakdown.agenda)} />
                <BreakdownCell label="Créditos voz" value={fmt(result.breakdown.voz)} />
                <BreakdownCell label="Créditos LIA" value={fmt(result.breakdown.lia)} />
                <BreakdownCell label="Créditos totales" value={fmt(result.creditsNeeded)} />
              </div>

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
                  Costo mensual · {result.best.name}
                </span>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 26,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  USD ${fmt(result.best.price)}
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginLeft: 8, fontWeight: 500 }}>
                    + ${fmt(IMPL)} impl.
                  </span>
                </span>
              </div>
            </>
          )}

          {/* Nota de mínimos por feature */}
          {(minutosVoz > 0 || lia) && (
            <div
              style={{
                marginTop: 16,
                padding: "14px 18px",
                background: "rgba(0,159,227,0.06)",
                borderLeft: "3px solid #009FE3",
                borderRadius: 8,
                fontSize: 14,
                lineHeight: 1.55,
                color: "#0A0A0A",
              }}
            >
              {lia
                ? "LIA (fiscalización + informes) solo viene en SUMMIT, así que ese es tu plan mínimo."
                : "La voz (CAMILA) está disponible desde ATLAS, así que ese es tu plan mínimo."}
            </div>
          )}
        </div>

        {/* ────── Comparativa de planes ────── */}
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
            Comparativa — qué cubre cada bolsa
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {PLANS.map((p) => {
              const isBest = result.best?.id === p.id;
              const cubre = p.tier >= result.minTier && p.credits >= result.creditsNeeded;
              const bloqueadoFeature = p.tier < result.minTier;
              return (
                <div
                  key={p.id}
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
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 12,
                      color: "#6B7280",
                      marginBottom: 12,
                    }}
                  >
                    {fmt(p.credits)} cr · {p.includes}
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
                    ${fmt(p.price)}
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
                  <div
                    style={{
                      marginTop: 10,
                      fontFamily: FONT_MONO,
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: cubre ? "#047857" : "#9CA3AF",
                    }}
                  >
                    {cubre
                      ? "Cubre tu consumo"
                      : bloqueadoFeature
                        ? "No incluye lo que necesitas"
                        : "Créditos insuficientes"}
                  </div>
                </div>
              );
            })}
          </div>
          <p
            style={{
              fontFamily: FONT_MONO,
              fontSize: 12,
              color: "#9CA3AF",
              lineHeight: 1.6,
              marginTop: 18,
            }}
          >
            Un agendamiento automático (Agentic) consume ~195 cr; una conversación simple ~10 cr. Todos los planes suman USD ${fmt(IMPL)} de implementación (pago único).
            Sobre 46.000 créditos → Plan Corporativo (desde USD ${fmt(CORP_FROM)}/mes).
          </p>
        </div>
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
