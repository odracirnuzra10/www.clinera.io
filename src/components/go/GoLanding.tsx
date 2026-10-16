"use client";

import { useEffect, useState } from "react";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import Pendiente from "@/components/planes2/Pendiente";
import { ChannelLogo, PlanChannelLogos } from "@/components/pricing/PlanChannelLogos";
import {
  CHANNELS_2,
  FLUX,
  GO,
  GO_ANALYTICS,
  GO_FAQ,
  GO_INCLUYE,
  GO_PASOS,
  AGENDA_PATH,
  VORTEX_2,
} from "@/content/planes2";
import { withStripeAttribution } from "@/lib/gclid";
import { captureGoAttribution, readGoAttribution } from "@/lib/go-attribution";
import { track, trackPixel } from "@/lib/tracking";

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const INK = "#0A0A0A";
const MUTED = "#4B5563";
const gradText = { background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } as const;

export default function GoLanding() {
  useEffect(() => {
    captureGoAttribution(window.location.search);
    track("view_content", {
      lead_source: GO_ANALYTICS.leadSource,
      content_name: GO_ANALYTICS.contentName,
      page_path: "/go",
    });
    trackPixel("ViewContent", {
      content_name: GO_ANALYTICS.contentName,
      content_ids: [GO_ANALYTICS.contentId],
      content_type: "product",
      currency: GO_ANALYTICS.currency,
      value: GO_ANALYTICS.valueUsd,
    });
  }, []);

  return (
    <>
      <style jsx global>{`
        @media (max-width: 720px) {
          .go-sec { padding-left: 16px !important; padding-right: 16px !important; }
          .go-h1 { font-size: 38px !important; }
        }
        @media (max-width: 900px) {
          .go-hero { grid-template-columns: 1fr !important; }
          .go-3 { grid-template-columns: 1fr !important; }
          .go-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section className="go-sec" style={{ padding: "64px 80px 72px", background: "#fff" }}>
        <div className="go-hero" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <Eyebrow>Clinera Go!</Eyebrow>
            <h1 className="go-h1" style={{ fontFamily: "Inter", fontSize: 58, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.03, margin: "16px 0 16px", color: INK }}>
              Inicia con Clinera por solo <span style={gradText}>17&nbsp;dólares al&nbsp;mes.</span>
            </h1>
            <p style={{ fontFamily: "Inter", fontSize: 18, color: MUTED, lineHeight: 1.55, margin: "0 0 24px", maxWidth: 520 }}>
              Tu agenda, tus fichas y tus mensajes de WhatsApp, Facebook e Instagram en un solo lugar. Sin costo de implementación y sin permanencia: cancelas cuando quieras.
            </p>
            <GoCta where="hero" />
          </div>
          <Mockup />
        </div>
      </section>

      <section className="go-sec" style={{ padding: "72px 80px", background: "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Eyebrow>Qué incluye Go!</Eyebrow>
          <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 20px", display: "grid", gap: 12, fontFamily: "Inter", fontSize: 17, color: INK }}>
            {GO_INCLUYE.map((x) => (
              <li key={x} style={{ display: "flex", gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 18px", marginTop: 3 }} aria-hidden>
                  <path d="M5 12l5 5L20 7" />
                </svg>
                <span>{x}</span>
              </li>
            ))}
          </ul>
          <PlanChannelLogos channels={[...CHANNELS_2]} />
        </div>
      </section>

      <section className="go-sec" style={{ padding: "80px 80px", background: "#fff", borderTop: "1px solid #F0F0F0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Eyebrow>Cómo empiezas</Eyebrow>
            <h2 style={{ fontFamily: "Inter", fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em", margin: "12px 0 0", color: INK }}>
              Tres pasos, el mismo día.
            </h2>
          </div>
          <div className="go-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {GO_PASOS.map((s) => (
              <div key={s.n} style={{ border: "1px solid #EEECEA", borderRadius: 16, padding: "24px" }}>
                <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".1em", ...gradText }}>{s.n}</span>
                <h3 style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", margin: "10px 0 6px", color: INK }}>{s.t}</h3>
                <p style={{ fontFamily: "Inter", fontSize: 14.5, color: MUTED, lineHeight: 1.55, margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="go-sec" style={{ padding: "72px 80px", background: "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <Eyebrow>Cuando crezcas</Eyebrow>
            <h2 style={{ fontFamily: "Inter", fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", margin: "12px 0 0", color: INK }}>
              Subes de plan sin cambiar de herramienta.
            </h2>
          </div>
          <div className="go-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Mini name={FLUX.name} line="2 sucursales · 5 profesionales" />
            <Mini name={VORTEX_2.name} line="AURA responde a tus pacientes y agenda sola" />
          </div>
          <p style={{ textAlign: "center", fontFamily: "Inter", fontSize: 15, margin: "20px 0 0" }}>
            <a href="/planes2" style={{ color: "#7C3AED", fontWeight: 600, textDecoration: "none" }}>
              Ver todos los planes →
            </a>
          </p>
        </div>
      </section>

      <GoFaq />

      <section className="go-sec" style={{ padding: "40px 80px 24px", background: "#fff" }}>
        <p style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", fontFamily: "Inter", fontSize: 14.5, color: "#6B7280" }}>
          ¿Tienes varias sedes o un equipo grande?{" "}
          <AgendarLink where="alternativo">Agenda una reunión con ventas</AgendarLink>.
        </p>
      </section>

      <section className="go-sec" style={{ padding: "56px 80px 96px", background: "#fff", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Inter", fontSize: 40, fontWeight: 800, letterSpacing: "-0.035em", margin: "0 0 20px", color: INK }}>
          Empieza hoy por <span style={gradText}>USD 17.</span>
        </h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoCta where="final" />
        </div>
      </section>
    </>
  );
}

/** CTA único de la landing. Si falta el link de Stripe, muestra el marcador. */
function GoCta({ where }: { where: "hero" | "final" }) {
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: where === "final" ? "center" : "start" }}>
      <GoPay where={where} />
      <span style={{ fontFamily: "Inter", fontSize: 14, color: "#6B7280" }}>
        ¿Prefieres verlo antes? <AgendarLink where={where}>Agenda una reunión</AgendarLink>
      </span>
    </div>
  );
}

/**
 * Lleva a /agenda conservando la query de la visita (UTM, fbclid, gclid): la
 * atribución del lead depende de ella, ver `clasificarLeadSource()`.
 */
function AgendarLink({ where, children }: { where: string; children: React.ReactNode }) {
  return (
    <a
      href={`${AGENDA_PATH}?plan=go`}
      data-cta-agendar={where}
      onClick={(ev) => {
        ev.preventDefault();
        track("go_agendar_click", { lead_source: GO_ANALYTICS.leadSource, cta_position: where, page_path: "/go" });
        const q = new URLSearchParams(window.location.search);
        q.set("plan", "go");
        window.location.href = `${AGENDA_PATH}?${q.toString()}`;
      }}
      style={{ color: "#7C3AED", fontWeight: 600, textDecoration: "none" }}
    >
      {children}
    </a>
  );
}

function GoPay({ where }: { where: "hero" | "final" }) {
  const url = GO.checkoutUrl;
  const base = {
    display: "inline-block",
    padding: "16px 28px",
    borderRadius: 10,
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: 16,
    textDecoration: "none",
  } as const;

  if (!url) {
    return (
      <div>
        <span aria-disabled="true" data-cta-pendiente="go" data-cta-where={where} style={{ ...base, background: "#F3F4F6", color: "#6B7280", cursor: "not-allowed" }}>
          {GO.ctaLabel}
        </span>
        <p style={{ fontFamily: "Inter", fontSize: 12.5, lineHeight: 1.5, margin: "10px 0 0" }}>
          <Pendiente>{GO.checkoutPending}</Pendiente>
        </p>
      </div>
    );
  }

  return (
    <a
      href={url}
      data-plan="go"
      data-cta-where={where}
      onClick={(ev) => {
        ev.preventDefault();
        track("initiate_checkout", {
          lead_source: GO_ANALYTICS.leadSource,
          plan: "go",
          content_name: GO_ANALYTICS.contentName,
          value: GO_ANALYTICS.valueUsd,
          currency: GO_ANALYTICS.currency,
          cta_position: where,
          ...readGoAttribution(),
          page_path: "/go",
        });
        trackPixel("InitiateCheckout", {
          content_name: GO_ANALYTICS.contentName,
          content_ids: [GO_ANALYTICS.contentId],
          content_type: "product",
          currency: GO_ANALYTICS.currency,
          value: GO_ANALYTICS.valueUsd,
        });
        // Un tick para que el pixel y el dataLayer salgan antes de navegar.
        setTimeout(() => {
          window.location.href = withStripeAttribution(url);
        }, 150);
      }}
      style={{ ...base, background: GRAD, color: "#fff", boxShadow: "0 12px 32px -8px rgba(124,58,237,.35)" }}
    >
      {GO.ctaLabel}
    </a>
  );
}

function Mini({ name, line }: { name: string; line: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #EEECEA", borderRadius: 16, padding: "22px 24px" }}>
      <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B7280" }}>{name}</span>
      <p style={{ fontFamily: "Inter", fontSize: 16.5, fontWeight: 600, color: INK, lineHeight: 1.4, margin: "8px 0 0" }}>{line}</p>
    </div>
  );
}

function GoFaq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="go-sec" style={{ padding: "72px 80px", background: "#fff", borderTop: "1px solid #F0F0F0" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Eyebrow>Preguntas frecuentes</Eyebrow>
        </div>
        <div style={{ borderTop: "1px solid #E5E7EB" }}>
          {GO_FAQ.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} style={{ borderBottom: "1px solid #E5E7EB" }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  style={{ width: "100%", textAlign: "left", background: "transparent", border: 0, padding: "18px 4px", display: "flex", justifyContent: "space-between", gap: 20, cursor: "pointer", fontFamily: "Inter" }}
                >
                  <span style={{ fontSize: 16.5, fontWeight: 600, color: INK }}>{it.q}</span>
                  <span aria-hidden style={{ fontSize: 22, color: INK, transform: isOpen ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 4px 18px", fontFamily: "Inter", fontSize: 15, color: MUTED, lineHeight: 1.6 }}>
                    <Pendiente>{it.a}</Pendiente>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Ciclo de la animación (s). Cada paso entra en `at`% del ciclo y se mantiene
// hasta el 94%; después todo se apaga y vuelve a empezar.
const CYCLE_S = 13;
const STEPS = { m1: 4, m2: 20, m3: 38, m4: 52, slot: 64, toast: 70 } as const;

function stepKeyframes(name: string, at: number) {
  return `@keyframes go-${name}{0%,${at - 0.01}%{opacity:0;transform:translateY(10px) scale(.98)}${at + 3}%{opacity:1;transform:none}94%{opacity:1;transform:none}100%{opacity:0;transform:translateY(0)}}`;
}

const MOCKUP_CSS =
  Object.entries(STEPS).map(([k, v]) => stepKeyframes(k, v)).join("") +
  Object.keys(STEPS)
    .map((k) => `.go-a-${k}{opacity:0;animation:go-${k} ${CYCLE_S}s ease-out infinite}`)
    .join("") +
  `.go-mock-cols{display:grid;grid-template-columns:1.2fr 1fr}` +
  `@media (max-width:560px){.go-mock-cols{grid-template-columns:1fr}}` +
  `@media (prefers-reduced-motion: reduce){${Object.keys(STEPS)
    .map((k) => `.go-a-${k}`)
    .join(",")}{animation:none !important;opacity:1 !important;transform:none !important}}`;

/**
 * Animación del hero: un paciente escribe por WhatsApp, el equipo de la clínica
 * le ofrece la hora desde la bandeja y la cita aparece en la agenda. Es un
 * ejemplo ilustrativo (paciente ficticio). La respuesta la da una persona de la
 * clínica, no AURA: la IA que atiende pacientes es solo de Vortex y la landing
 * de Go! no debe prometerla.
 */
function Mockup() {
  const bubble = (mine: boolean) =>
    ({
      maxWidth: "82%",
      alignSelf: mine ? "flex-end" : "flex-start",
      background: mine ? "#E3F8EA" : "#fff",
      border: `1px solid ${mine ? "#BFE9CE" : "#E5E7EB"}`,
      borderRadius: mine ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
      padding: "8px 11px",
      fontFamily: "Inter",
      fontSize: 13,
      lineHeight: 1.4,
      color: INK,
    }) as const;
  const slots = [
    { h: "09:00", busy: "Reservado" },
    { h: "10:30", mine: true },
    { h: "12:00" },
    { h: "15:00", busy: "Reservado" },
  ];
  return (
    <figure
      aria-label="Ejemplo: un paciente agenda una hora por WhatsApp y la cita queda registrada en la agenda de Clinera"
      style={{ margin: 0, border: "1px solid #E5E7EB", borderRadius: 16, background: "#fff", overflow: "hidden", boxShadow: "0 24px 60px -30px rgba(124,58,237,.35)" }}
    >
      <style>{MOCKUP_CSS}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderBottom: "1px solid #F0F0F0", background: "#FAFAFA" }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 9, height: 9, borderRadius: 99, background: "#E5E7EB" }} />
        ))}
        <span style={{ marginLeft: 8, fontFamily: MONO, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#9CA3AF" }}>
          Clinera · ejemplo ilustrativo
        </span>
      </div>

      <div className="go-mock-cols" style={{ minHeight: 300 }}>
        {/* Bandeja de WhatsApp */}
        <div style={{ borderRight: "1px solid #F0F0F0", display: "flex", flexDirection: "column", background: "#FBFBFB" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#fff", borderBottom: "1px solid #F0F0F0" }}>
            <ChannelLogo channel="whatsapp" size={16} />
            <span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 700, color: INK }}>Camila R.</span>
            <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 9.5, letterSpacing: ".08em", textTransform: "uppercase", color: "#9CA3AF" }}>
              WhatsApp
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 14, flex: 1 }}>
            <div className="go-a-m1" style={bubble(false)}>Hola, quiero agendar una evaluación.</div>
            <div className="go-a-m2" style={bubble(true)}>Hola Camila. Tengo mañana a las 10:30. ¿Te acomoda?</div>
            <div className="go-a-m3" style={bubble(false)}>Sí, perfecto.</div>
            <div className="go-a-m4" style={bubble(true)}>Listo, quedó agendada para mañana a las 10:30.</div>
          </div>
        </div>

        {/* Agenda de Clinera */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid #F0F0F0" }}>
            <span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 700, color: INK }}>Agenda</span>
            <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 9.5, letterSpacing: ".08em", textTransform: "uppercase", color: "#9CA3AF" }}>
              Mañana
            </span>
          </div>
          <div style={{ display: "grid", gap: 8, padding: 14, alignContent: "start", position: "relative" }}>
            {slots.map((sl) => (
              <div key={sl.h} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "#9CA3AF", width: 34 }}>{sl.h}</span>
                <div style={{ position: "relative", flex: 1, height: 38 }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 8,
                      background: sl.busy ? "#F3F4F6" : "#fff",
                      border: sl.busy ? "1px solid #EEE" : "1px dashed #E5E7EB",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 10px",
                      fontFamily: "Inter",
                      fontSize: 11.5,
                      color: "#9CA3AF",
                    }}
                  >
                    {sl.busy ?? ""}
                  </div>
                  {sl.mine && (
                    <div
                      className="go-a-slot"
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 8,
                        background: "linear-gradient(90deg,#2563EB22,#7C3AED22,#C026D322)",
                        border: "1px solid #7C3AED55",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "0 10px",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: 600,
                        color: INK,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                      Camila R. · Evaluación
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div
              className="go-a-toast"
              style={{
                justifySelf: "end",
                marginTop: 4,
                fontFamily: MONO,
                fontSize: 9.5,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: "#047857",
                background: "#ECFDF5",
                border: "1px solid #A7F3D0",
                borderRadius: 999,
                padding: "5px 10px",
              }}
            >
              Cita registrada en la agenda
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
