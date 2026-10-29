"use client";

// /planes2 (Ricardo, 29-oct-2026): Hex · Flux · Vortex · Ecosistema. Vista previa sin
// indexar; /planes no cambia hasta que él la apruebe. Contenido en `planes-nuevos.ts`.

import { useEffect, useState, useSyncExternalStore } from "react";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { useReveal } from "@/components/home-v3/sections";
import PriceModalitySwitch from "@/components/pricing/PriceModalitySwitch";
import { usePriceModality } from "@/components/pricing/PriceModalityProvider";
import { CHANNEL_LABEL, ChannelLogo } from "@/components/pricing/PlanChannelLogos";
import { track, trackPixel } from "@/lib/tracking";
// Hoja normal, no styled-jsx: la grilla tiene que venir en el HTML del servidor; con
// styled-jsx las tarjetas se veían apiladas hasta que cargaba el JavaScript.
import "./planes-nuevos.css";
import {
  CLIENTE_ACTUAL_LINEA,
  CLIENTE_ACTUAL_PENDIENTE,
  COMO_FUNCIONA,
  EXTRAS_CREDITOS_PENDIENTE,
  EXTRAS_NUEVOS,
  OFERTA_LANZAMIENTO,
  PLANES2_BAJADA,
  PLANES2_FAQ,
  PLANES2_TITULO,
  PLANES2_TITULO_ACENTO,
  PLANES_NUEVOS,
  PRUEBA_LABEL,
  PRUEBA_LINEA,
  PRUEBA_URL,
  VENTAS_LABEL,
  conPlan,
  ofertaVigente,
  precioOferta,
  type PlanNuevo,
} from "@/content/planes-nuevos";

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const noop = () => () => {};
const readSearch = () => window.location.search;
const readSearchServer = () => "";

export default function PlanesNuevos() {
  useReveal();
  const search = useSyncExternalStore(noop, readSearch, readSearchServer);
  // La oferta se evalúa en el navegador: en el build quedaría congelada.
  const oferta = useSyncExternalStore(noop, () => ofertaVigente(), () => true);
  useEffect(() => {
    track("view_item_list", { item_list_id: "planes2" });
    trackPixel("ViewContent", { content_name: "planes2", content_type: "product_group" });
  }, []);

  return (
    <>
      <style jsx global>{`
        .reveal { opacity: 0; transform: translateY(12px); transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
        .reveal.in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0ms !important; transition-duration: 0ms !important; } }
      `}</style>

      <section className="p2-section" style={{ paddingBottom: 24, background: "linear-gradient(180deg,#FFFFFF 0%,#FAFAFA 100%)" }}>
        <div className="reveal" style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
          <Eyebrow>Planes y precios</Eyebrow>
          <h1 className="p2-title" style={{ fontFamily: "Inter", fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.03, margin: "16px 0 14px", color: "#0A0A0A" }}>
            {PLANES2_TITULO}{" "}
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{PLANES2_TITULO_ACENTO}</span>
          </h1>
          <p style={{ fontFamily: "Inter", fontSize: 18, color: "#4B5563", lineHeight: 1.55, margin: "0 auto 20px", maxWidth: 620 }}>{PLANES2_BAJADA}</p>
          <PriceModalitySwitch size="compact" align="center" />
        </div>
      </section>

      <section id="planes" className="p2-section" style={{ paddingTop: 16, background: "#FAFAFA" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="p2-grid">
            {PLANES_NUEVOS.map((p) => (
              <Tarjeta key={p.id} plan={p} search={search} oferta={oferta} />
            ))}
          </div>
          <p style={{ fontFamily: "Inter", fontSize: 14, color: "#4B5563", textAlign: "center", margin: "20px 0 4px" }}>{PRUEBA_LINEA}</p>
          <p data-cliente-actual style={{ fontFamily: "Inter", fontSize: 14, color: "#4B5563", textAlign: "center", margin: 0 }}>
            {CLIENTE_ACTUAL_LINEA} <span style={{ color: "#B45309" }}>{CLIENTE_ACTUAL_PENDIENTE}</span>
          </p>
        </div>
      </section>

      <section className="p2-section" style={{ background: "#fff", borderTop: "1px solid #F0F0F0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Titulo eyebrow="Extras" titulo="Para todos los planes." />
          <div className="p2-extras" data-extras>
            {EXTRAS_NUEVOS.map((e) => (
              <div key={e.label} style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: "18px 18px", background: "#fff" }}>
                <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.09em", textTransform: "uppercase", color: "#6B7280" }}>{e.label}</div>
                <div style={{ fontFamily: "Inter", fontSize: 22, fontWeight: 700, color: "#0A0A0A", marginTop: 6 }}>{e.precio}</div>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "Inter", fontSize: 13.5, color: "#B45309", marginTop: 14 }}>{EXTRAS_CREDITOS_PENDIENTE}</p>
        </div>
      </section>

      <section className="p2-section" style={{ background: "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Titulo eyebrow="Cómo funciona" titulo="Prueba primero, elige después." />
          <div className="p2-steps">
            {COMO_FUNCIONA.map((s) => (
              <div key={s.n} style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 22, background: "#fff" }}>
                <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.09em", color: "#7C3AED" }}>PASO {s.n}</div>
                <div style={{ fontFamily: "Inter", fontSize: 18, fontWeight: 700, color: "#0A0A0A", margin: "8px 0 6px" }}>{s.titulo}</div>
                <p style={{ fontFamily: "Inter", fontSize: 15, color: "#4B5563", lineHeight: 1.55, margin: 0 }}>{s.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Faq />
      <AgendaDemo search={search} />
    </>
  );
}

function Titulo({ eyebrow, titulo }: { eyebrow: string; titulo: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 style={{ fontFamily: "Inter", fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", margin: "12px 0 0", color: "#0A0A0A" }}>{titulo}</h2>
    </div>
  );
}

function Tarjeta({ plan, search, oferta }: { plan: PlanNuevo; search: string; oferta: boolean }) {
  const { amount, meta } = usePriceModality();
  const conOferta = oferta && (OFERTA_LANZAMIENTO.planes as readonly string[]).includes(plan.id);
  const fmt = (usd: number) => {
    const v = amount(usd);
    const dec = meta.currency === "USD" && !Number.isInteger(v) ? 2 : 0;
    return `${meta.currency === "USD" ? "US$" : "MX$"} ${v.toLocaleString("es-CL", { minimumFractionDigits: dec, maximumFractionDigits: dec })}`;
  };
  const href = plan.cta === "prueba" ? conPlan(PRUEBA_URL, plan.id, search) : conPlan("/agenda", plan.id, search);
  const onClick = () => {
    if (plan.cta === "prueba") {
      track("start_trial_click", { plan: plan.id });
      trackPixel("StartTrial", { content_name: plan.name, value: 0, currency: "USD" });
    } else {
      track("contact_sales_click", { plan: plan.id });
    }
  };

  return (
    <article
      data-plan-card={plan.id}
      className="reveal"
      style={{
        position: "relative",
        background: "#fff",
        borderRadius: 16,
        padding: 22,
        border: plan.destacado ? "1.5px solid transparent" : "1px solid #E5E7EB",
        backgroundImage: plan.destacado ? `linear-gradient(#fff,#fff), ${GRAD}` : undefined,
        backgroundOrigin: "border-box",
        backgroundClip: plan.destacado ? "padding-box, border-box" : undefined,
        // Subgrid: las 6 filas (etiqueta, nombre, precio, cupos, botón, lista) se alinean entre
        // tarjetas, así los botones quedan a la misma altura aunque un precio traiga oferta.
        display: "grid",
        gridTemplateRows: "subgrid",
        gridRow: "span 6",
        rowGap: 14,
        alignContent: "start",
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#7C3AED" }}>{plan.etiqueta}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <h3 style={{ fontFamily: "Inter", fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: "#0A0A0A" }}>{plan.name}</h3>
        {plan.canales.length > 0 && (
          <span data-canales style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
            {plan.canales.map((c) => (
              <span key={c} title={CHANNEL_LABEL[c]} style={{ display: "inline-flex" }}>
                <ChannelLogo channel={c} size={20} />
                <span className="sr-only">{CHANNEL_LABEL[c]}</span>
              </span>
            ))}
          </span>
        )}
        {(plan.cta === "prueba" || conOferta) && (
          <span
            data-insignia
            style={{
              position: "absolute",
              top: -12,
              right: 18,
              fontFamily: MONO,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "5px 10px",
              borderRadius: 999,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px -4px rgba(15,23,42,.18)",
              ...(conOferta ? { background: GRAD, color: "#fff" } : { background: "#ECFDF5", color: "#047857", border: "1px solid #A7F3D0" }),
            }}
          >
            {conOferta ? `${OFERTA_LANZAMIENTO.porcentaje}% OFF` : "Prueba gratis"}
          </span>
        )}
      </div>

      <div data-precio>
        {conOferta ? (
          <>
            <div style={{ fontFamily: "Inter", fontSize: 15, color: "#9CA3AF", textDecoration: "line-through" }}>{fmt(plan.monthlyUsd)}</div>
            <div style={{ fontFamily: "Inter", fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", color: "#0A0A0A" }}>
              {fmt(precioOferta(plan.monthlyUsd))}
              <span style={{ fontSize: 14, fontWeight: 500, color: "#6B7280" }}>/mes</span>
            </div>
            <div data-oferta style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600, background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              {OFERTA_LANZAMIENTO.linea}
            </div>
          </>
        ) : (
          <div style={{ fontFamily: "Inter", fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", color: "#0A0A0A" }}>
            {fmt(plan.monthlyUsd)}
            <span style={{ fontSize: 14, fontWeight: 500, color: "#6B7280" }}>/mes</span>
          </div>
        )}
      </div>

      <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4B5563" }}>
        {plan.profesionales} · {plan.sucursales}
      </div>

      <a
        href={href}
        onClick={onClick}
        data-cta={plan.cta}
        suppressHydrationWarning
        style={{
          display: "block",
          textAlign: "center",
          padding: "12px 16px",
          borderRadius: 10,
          fontFamily: "Inter",
          fontWeight: 600,
          fontSize: 15,
          textDecoration: "none",
          minHeight: 44,
          boxSizing: "border-box",
          ...(plan.cta === "ventas"
            ? { background: GRAD, color: "#fff" }
            : { background: "#fff", color: "#0A0A0A", border: "1px solid #E5E7EB" }),
        }}
      >
        {plan.cta === "prueba" ? PRUEBA_LABEL : VENTAS_LABEL}
      </a>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8, fontFamily: "Inter", fontSize: 14.5 }}>
        {plan.incluye.map((f) => (
          <li key={f} style={{ display: "flex", gap: 8, color: "#111827" }}>
            <span aria-hidden="true" style={{ color: "#7C3AED" }}>✓</span>
            {f}
          </li>
        ))}
        {plan.noIncluye.map((f) => (
          <li key={f} data-no-incluye style={{ display: "flex", gap: 8, color: "#9CA3AF" }}>
            <span aria-hidden="true">—</span>
            <span>
              <span className="sr-only">No incluye: </span>
              {f}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="p2-section" style={{ borderTop: "1px solid #F0F0F0", background: "#fff" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <Titulo eyebrow="Preguntas frecuentes" titulo="Dudas sobre los planes." />
        <div style={{ borderTop: "1px solid #E5E7EB" }}>
          {PLANES2_FAQ.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} style={{ borderBottom: "1px solid #E5E7EB" }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  style={{ width: "100%", textAlign: "left", background: "transparent", border: 0, padding: "20px 4px", display: "flex", justifyContent: "space-between", gap: 20, cursor: "pointer", fontFamily: "Inter", fontSize: 17, fontWeight: 600, color: "#0A0A0A" }}
                >
                  {it.q}
                  <span aria-hidden="true" style={{ transform: isOpen ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
                </button>
                {isOpen && <div style={{ padding: "0 4px 20px", fontFamily: "Inter", fontSize: 15.5, color: "#4B5563", lineHeight: 1.6 }}>{it.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AgendaDemo({ search }: { search: string }) {
  const q = new URLSearchParams(search).toString();
  return (
    <section className="p2-section" id="demo" style={{ background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", borderRadius: 20, padding: "48px 32px", background: "#0E1014", color: "#fff", textAlign: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.09em", color: "#C4B5FD" }}>AGENDA TU DEMO</div>
        <h2 style={{ fontFamily: "Inter", fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", margin: "12px 0 10px" }}>
          ¿Vortex o Ecosistema? Hablemos de tu clínica.
        </h2>
        <p style={{ fontFamily: "Inter", fontSize: 16, color: "#D1D5DB", margin: "0 auto 24px", maxWidth: 560 }}>
          Te mostramos el agente IA y el marketing funcionando, y te decimos qué plan te conviene.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href={q ? `/agenda?${q}` : "/agenda"} suppressHydrationWarning style={{ background: GRAD, color: "#fff", padding: "13px 22px", borderRadius: 10, fontFamily: "Inter", fontWeight: 600, textDecoration: "none" }}>
            {VENTAS_LABEL}
          </a>
          <a href={conPlan(PRUEBA_URL, "flux", search)} suppressHydrationWarning style={{ background: "#fff", color: "#0A0A0A", padding: "13px 22px", borderRadius: 10, fontFamily: "Inter", fontWeight: 600, textDecoration: "none" }}>
            {PRUEBA_LABEL}
          </a>
        </div>
      </div>
    </section>
  );
}
