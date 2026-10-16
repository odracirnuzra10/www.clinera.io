"use client";

import { useEffect, useState } from "react";
import { CnnLogo, Eyebrow, GRAD, Wordmark } from "@/components/brand-v3/Brand";
import Pendiente from "@/components/planes2/Pendiente";
import { ChannelLogo, PlanChannelLogos } from "@/components/pricing/PlanChannelLogos";
import {
  CHANNELS_2,
  FLUX,
  GO,
  GO_ANALYTICS,
  GO_FAQ,
  GO_INCLUYE,
  GO_LANDING_CTA,
  GO_PASOS,
  AGENDA_PATH,
  VORTEX_2,
} from "@/content/planes2";
import { PARTNER_CNN_VIMEO_SRC } from "@/lib/partners";
import { captureGoAttribution } from "@/lib/go-attribution";
import { track, trackPixel } from "@/lib/tracking";

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const INK = "#0A0A0A";
const MUTED = "#4B5563";
// Mismo degradado de marca, en tonos más claros para leerse sobre el hero oscuro.
const GRAD_LIGHT = "linear-gradient(90deg,#60A5FA 0%,#A78BFA 50%,#F0ABFC 100%)";
const gradTextLight = { background: GRAD_LIGHT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } as const;
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
        .go-sec { padding: 72px 80px; }
        .go-h2 { font-family: Inter; font-size: clamp(26px, 4.4vw, 38px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.08; color: ${INK}; margin: 12px 0 0; }
        .go-cta {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          min-height: 56px; padding: 0 34px; border-radius: 14px; border: 0;
          font-family: Inter; font-weight: 700; font-size: 17px; letter-spacing: -0.01em;
          text-decoration: none; color: #fff; background: ${GRAD};
          box-shadow: 0 16px 36px -12px rgba(124,58,237,.55);
          transition: transform .2s ease, filter .2s ease;
        }
        .go-cta:hover { transform: translateY(-2px); filter: brightness(.97); }
        .go-cta:focus-visible { outline: 3px solid rgba(124,58,237,.55); outline-offset: 3px; }
        .go-float {
          position: fixed; z-index: 60; right: 24px; bottom: 24px;
          display: flex; align-items: center; gap: 14px;
          padding: 10px 10px 10px 20px; border-radius: 999px;
          background: rgba(255,255,255,.94); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          border: 1px solid #E5E7EB; box-shadow: 0 20px 50px -18px rgba(76,29,149,.45);
          transform: translateY(24px); opacity: 0; visibility: hidden;
          transition: transform .3s cubic-bezier(.16,1,.3,1), opacity .25s ease, visibility 0s linear .3s;
        }
        .go-float[data-visible="true"] { transform: none; opacity: 1; visibility: visible; transition-delay: 0s; }
        .go-float .go-cta { min-height: 48px; padding: 0 26px; border-radius: 999px; font-size: 16px; }
        .go-float-price { display: grid; line-height: 1.15; }
        @media (max-width: 900px) {
          .go-hero { grid-template-columns: 1fr !important; gap: 28px !important; }
          .go-3, .go-2 { grid-template-columns: 1fr !important; }
          .go-incl-list { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 720px) {
          .go-sec { padding: 44px 20px !important; }
          .go-sec-hero { padding: 20px 20px 40px !important; }
          .go-sec-hero > div:first-child { margin-bottom: 28px !important; }
          .go-h1 { letter-spacing: -0.035em !important; }
          .go-cta-wrap, .go-cta-wrap .go-cta { width: 100%; }
          .go-trust { justify-content: flex-start; }
          .go-float {
            left: 0; right: 0; bottom: 0; border-radius: 18px 18px 0 0; border-width: 1px 0 0;
            padding: 10px 16px calc(10px + env(safe-area-inset-bottom)); justify-content: space-between;
            box-shadow: 0 -14px 40px -18px rgba(76,29,149,.4);
          }
          .go-float .go-cta { flex: 1; max-width: 220px; }
          .go-final-card { padding: 28px 20px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .go-float, .go-cta { transition: none !important; }
        }
      `}</style>

      {/* Primer bloque oscuro, para contrastar con el resto de la página (Ricardo, 16-oct).
          Sin navbar: solo el logo, sin enlace, para que no haya otra salida que el CTA. */}
      <section
        className="go-sec go-sec-hero"
        style={{
          padding: "28px 80px 88px",
          color: "#fff",
          background:
            "radial-gradient(ellipse 55% 75% at 88% 0%, rgba(192,38,211,.38), transparent 62%), radial-gradient(ellipse 50% 60% at 0% 100%, rgba(37,99,235,.28), transparent 62%), #0A0A14",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto 44px" }}>
          <Wordmark size={22} color="#fff" />
        </div>
        <div className="go-hero" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 56, alignItems: "center" }}>
          <div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: MONO,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "#DDD6FE",
                background: "rgba(255,255,255,.07)",
                border: "1px solid rgba(255,255,255,.2)",
                borderRadius: 999,
                padding: "6px 12px",
              }}
            >
              Clinera Go!
            </span>
            <h1 className="go-h1" style={{ fontFamily: "Inter", fontSize: "clamp(38px, 6.4vw, 64px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.02, margin: "16px 0 16px", color: "#fff" }}>
              Inicia con Clinera por solo <span style={gradTextLight}>17&nbsp;dólares al&nbsp;mes.</span>
            </h1>
            <p style={{ fontFamily: "Inter", fontSize: "clamp(16px, 2.2vw, 19px)", color: "rgba(255,255,255,.72)", lineHeight: 1.55, margin: "0 0 22px", maxWidth: 540 }}>
              Tu agenda, tus fichas y tus mensajes de WhatsApp, Facebook e Instagram en un solo lugar.
            </p>

            <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "0 0 18px" }}>
              <span style={{ fontFamily: "Inter", fontSize: "clamp(44px, 9vw, 60px)", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, ...gradTextLight }}>
                USD&nbsp;17
              </span>
              <span style={{ fontFamily: "Inter", fontSize: 17, fontWeight: 600, color: "rgba(255,255,255,.6)" }}>/mes</span>
            </div>

            <div id="go-hero-cta" className="go-cta-wrap" style={{ display: "inline-block" }}>
              <CheckoutLink where="hero" />
            </div>
            <TrustChips dark />
            <p style={{ fontFamily: "Inter", fontSize: 14.5, color: "rgba(255,255,255,.62)", margin: "16px 0 0" }}>
              ¿Prefieres verlo antes? <AgendarLink where="hero" light>Agenda una reunión</AgendarLink>
            </p>
          </div>
          <Mockup />
        </div>
      </section>

      <section className="go-sec" style={{ background: "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div
            style={{
              background: "#fff",
              border: "1.5px solid transparent",
              backgroundImage: `linear-gradient(#fff,#fff), ${GRAD}`,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              borderRadius: 24,
              padding: "clamp(22px, 4vw, 36px)",
              boxShadow: "0 24px 60px -34px rgba(124,58,237,.45)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
              <div>
                <Eyebrow>Qué incluye Go!</Eyebrow>
                <h2 className="go-h2">Todo lo esencial para operar.</h2>
              </div>
              <div style={{ fontFamily: "Inter", textAlign: "right" }}>
                <span style={{ fontSize: "clamp(34px, 6vw, 44px)", fontWeight: 800, letterSpacing: "-0.04em", color: INK }}>USD&nbsp;17</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#6B7280" }}> /mes</span>
              </div>
            </div>
            <ul className="go-incl-list" style={{ listStyle: "none", padding: 0, margin: "24px 0 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 28px", fontFamily: "Inter", fontSize: 16, color: INK, lineHeight: 1.45 }}>
              {GO_INCLUYE.map((x) => (
                <li key={x} style={{ display: "flex", gap: 10 }}>
                  <span style={{ flex: "0 0 20px", width: 20, height: 20, borderRadius: 999, background: "rgba(124,58,237,.12)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <PlanChannelLogos channels={[...CHANNELS_2]} />
          </div>
        </div>
      </section>

      {/* Prueba social: el mismo clip de CNN de /plataforma y /partner. */}
      <section className="go-sec" aria-labelledby="go-cnn-title" style={{ background: "#fff", borderTop: "1px solid #F0F0F0" }}>
        <div className="go-2" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: 40, alignItems: "center" }}>
          <div>
            <CnnLogo height={30} color="#F03A47" />
            <span style={{ display: "block", fontFamily: MONO, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#6B7280", margin: "14px 0 0" }}>
              Clinera en CNN
            </span>
            <h2 id="go-cnn-title" className="go-h2" style={{ margin: "10px 0 12px" }}>
              Un gran paso para Clinera.
            </h2>
            <p style={{ fontFamily: "Inter", fontSize: 16, color: MUTED, lineHeight: 1.55, margin: 0 }}>
              CNN conoció cómo Clinera ayuda a las clínicas de LATAM a operar con más control.
            </p>
          </div>
          <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: 16, overflow: "hidden", border: "1px solid #E5E7EB", background: "#0A0A0A", boxShadow: "0 24px 60px -30px rgba(124,58,237,.35)" }}>
            <iframe
              src={PARTNER_CNN_VIMEO_SRC}
              title="Reportaje de CNN sobre Clinera"
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          </div>
        </div>
      </section>

      <section className="go-sec" style={{ background: "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Eyebrow>Cómo empiezas</Eyebrow>
            <h2 className="go-h2">Tres pasos, el mismo día.</h2>
          </div>
          <div className="go-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {GO_PASOS.map((s) => (
              <div key={s.n} style={{ background: "#fff", border: "1px solid #EEECEA", borderRadius: 16, padding: "22px 22px 24px" }}>
                <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".1em", ...gradText }}>{s.n}</span>
                <h3 style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", margin: "10px 0 6px", color: INK }}>{s.t}</h3>
                <p style={{ fontFamily: "Inter", fontSize: 15, color: MUTED, lineHeight: 1.55, margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="go-sec" style={{ background: "#fff", borderTop: "1px solid #F0F0F0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <Eyebrow>Cuando crezcas</Eyebrow>
            <h2 className="go-h2">Subes de plan sin cambiar de herramienta.</h2>
          </div>
          <div className="go-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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

      <section className="go-sec" style={{ background: "#FAFAFA", borderTop: "1px solid #F0F0F0", paddingBottom: 96 }}>
        <div
          className="go-final-card"
          style={{
            maxWidth: 760,
            margin: "0 auto",
            textAlign: "center",
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 28,
            padding: "44px 36px",
            boxShadow: "0 30px 70px -40px rgba(124,58,237,.5)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124,58,237,.10), transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <h2 className="go-h2" style={{ fontSize: "clamp(30px, 6vw, 46px)", margin: "0 0 18px" }}>
              Empieza hoy por <span style={gradText}>USD&nbsp;17.</span>
            </h2>
            <div id="go-final-cta" className="go-cta-wrap" style={{ display: "inline-block" }}>
              <CheckoutLink where="final" />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <TrustChips center />
            </div>
            <p style={{ fontFamily: "Inter", fontSize: 14.5, color: "#6B7280", margin: "18px 0 0" }}>
              ¿Tienes varias sedes o un equipo grande?{" "}
              <AgendarLink where="alternativo">Habla con ventas</AgendarLink>
            </p>
          </div>
        </div>
      </section>

      <FloatingCta />
    </>
  );
}

/** Tres razones para decidir sin miedo, justo bajo el botón. */
function TrustChips({ center, dark }: { center?: boolean; dark?: boolean }) {
  return (
    <div className="go-trust" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, justifyContent: center ? "center" : "flex-start" }}>
      {["Sin implementación", "Sin permanencia", "Cancela cuando quieras"].map((t) => (
        <span
          key={t}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "Inter",
            fontSize: 13,
            fontWeight: 600,
            color: dark ? "#fff" : INK,
            background: dark ? "rgba(255,255,255,.08)" : "#fff",
            border: dark ? "1px solid rgba(255,255,255,.18)" : "1px solid #E5E7EB",
            borderRadius: 999,
            padding: "6px 12px",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={dark ? "#C4B5FD" : "#6D28D9"} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12l5 5L20 7" />
          </svg>
          {t}
        </span>
      ))}
    </div>
  );
}

/**
 * Lleva a /agenda conservando la query de la visita (UTM, fbclid, gclid): la
 * atribución del lead depende de ella, ver `clasificarLeadSource()`.
 */
function AgendarLink({ where, children, light }: { where: string; children: React.ReactNode; light?: boolean }) {
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
      style={{ color: light ? "#C4B5FD" : "#7C3AED", fontWeight: 600, textDecoration: "none" }}
    >
      {children}
    </a>
  );
}

/**
 * Botón de compra de Go!: abre el checkout de Stripe del plan. Es el único CTA
 * de la landing (hero, final y flotante). Si faltara el link, muestra el marcador.
 */
function CheckoutLink({ where }: { where: "hero" | "final" | "floating" }) {
  const url = GO.checkoutUrl;
  if (!url) {
    return (
      <div>
        <span aria-disabled="true" data-cta-pendiente="go" data-cta-where={where} className="go-cta" style={{ background: "#F3F4F6", color: "#6B7280", boxShadow: "none", cursor: "not-allowed" }}>
          {GO_LANDING_CTA}
        </span>
        <p style={{ fontFamily: "Inter", fontSize: 12.5, lineHeight: 1.5, margin: "10px 0 0" }}>
          <Pendiente>{GO.checkoutPending}</Pendiente>
        </p>
      </div>
    );
  }
  // Sin onClick propio: `Analytics.tsx` ya escucha todo enlace a buy.stripe.com
  // (InitiateCheckout al dataLayer y al pixel, más el `client_reference_id` con
  // fbc/fbp/GA que lee n8n). Un handler propio contaba el clic doble y, al
  // navegar a la URL original, se saltaba ese `client_reference_id`.
  return (
    <a
      href={url}
      data-plan="go"
      data-plan-name={`${GO_ANALYTICS.contentName} contratar`}
      data-plan-value={GO_ANALYTICS.valueUsd}
      data-cta-where={where}
      className="go-cta"
    >
      {GO_LANDING_CTA}
    </a>
  );
}

/**
 * Botón flotante "Inicia ahora". Aparece cuando el CTA del hero sale de
 * pantalla y se esconde al llegar al CTA final (y después), para no tapar el
 * pie ni duplicar el botón que ya se ve. En móvil es una barra al borde inferior.
 */
function FloatingCta() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const hero = document.getElementById("go-hero-cta")?.getBoundingClientRect();
      const fin = document.getElementById("go-final-cta")?.getBoundingClientRect();
      if (!hero) return;
      const heroGone = hero.bottom < 0;
      const finalReached = fin ? fin.top < window.innerHeight - 40 : false;
      setVisible(heroGone && !finalReached);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="go-float" data-visible={visible} data-go-float aria-hidden={!visible} role="region" aria-label="Inicia con Clinera Go!">
      <div className="go-float-price">
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#6B7280" }}>Clinera Go!</span>
        <span style={{ fontFamily: "Inter", fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em", color: INK }}>USD 17/mes</span>
      </div>
      <CheckoutLink where="floating" />
    </div>
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
    <section className="go-sec" style={{ background: "#fff", borderTop: "1px solid #F0F0F0" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h2 className="go-h2">Todo sobre los planes.</h2>
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
