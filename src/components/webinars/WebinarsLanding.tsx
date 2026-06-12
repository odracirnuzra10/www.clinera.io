"use client";

import { useEffect } from "react";
import { CtaPrimary, Eyebrow, GRAD } from "@/components/brand-v3/Brand";

const WA_GROUP = "https://chat.whatsapp.com/JJzwD46zLEiAjJXWqtoLgE?mode=gi_t";

export default function WebinarsLanding() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_path: "/webinars",
      page_name: "webinars_landing",
      content_name: "Webinar semanal — Clinera",
      content_category: "webinar",
    });

    // Detector global solo para anchors a WhatsApp (única acción).
    const onClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      const a = target?.closest("a") as HTMLAnchorElement | null;
      if (!a) return;
      if (!a.href.includes("chat.whatsapp.com/JJzwD46z")) return;
      const placement = a.closest("section")?.getAttribute("data-placement") || "unknown";
      window.dataLayer!.push({
        event: "webinar_join_click",
        placement,
        page_path: "/webinars",
        content_name: "Webinar semanal — Clinera",
      });
      if (typeof window.fbq === "function") {
        window.fbq("track", "Lead", {
          content_name: "Webinar semanal — Clinera",
          content_category: "webinar_join",
          placement,
          value: 0,
          currency: "USD",
        });
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true } as AddEventListenerOptions);
  }, []);

  return (
    <>
      <Hero />
      <VideoSection />
      <WhatYoullLearn />
      <HowItWorks />
      <FinalCTA />
      <StickyCTA />
      <style jsx global>{`
        @media (max-width: 720px) {
          .webinars-section { padding-left: 24px !important; padding-right: 24px !important; }
          .webinars-section[data-placement="final"] { padding-bottom: 160px !important; }
        }
      `}</style>
    </>
  );
}

/* ============================================================
   STICKY FLOATING CTA
   ============================================================ */
function StickyCTA() {
  return (
    <>
      <a
        href={WA_GROUP}
        target="_blank"
        rel="noopener noreferrer"
        className="webinars-sticky"
        aria-label="Unirme al grupo de WhatsApp del webinar"
      >
        <span className="webinars-sticky-dot live-dot" aria-hidden />
        <WhatsAppIcon />
        <span className="webinars-sticky-label">Unirme al grupo del webinar</span>
        <span style={{ marginLeft: 2 }}>→</span>
      </a>
      <style jsx>{`
        .webinars-sticky {
          position: fixed;
          left: 50%;
          bottom: 24px;
          transform: translateX(-50%);
          z-index: 60;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 22px;
          border-radius: 999px;
          background: linear-gradient(135deg, #3B82F6 0%, #7C3AED 50%, #D946EF 100%);
          color: #fff;
          font-family: Inter, sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.005em;
          text-decoration: none;
          box-shadow:
            0 1px 2px rgba(11, 11, 15, 0.10),
            0 10px 24px -10px rgba(11, 11, 15, 0.35);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          line-height: 1;
        }
        .webinars-sticky:hover {
          transform: translateX(-50%) translateY(-2px);
          box-shadow:
            0 1px 2px rgba(11, 11, 15, 0.10),
            0 14px 28px -10px rgba(11, 11, 15, 0.4);
        }
        .webinars-sticky-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #10b981;
          display: inline-block;
        }
        @media (max-width: 720px) {
          .webinars-sticky {
            left: 16px;
            right: 16px;
            transform: none;
            justify-content: center;
            padding: 14px 18px;
            font-size: 14.5px;
          }
          .webinars-sticky:hover {
            transform: none;
          }
        }
      `}</style>
    </>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero() {
  return (
    <section
      className="webinars-section"
      data-placement="hero"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "96px 80px 80px",
        background: "#FAFAFA",
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 80% 0%, rgba(217,70,239,.10), transparent 60%), radial-gradient(ellipse 60% 50% at 0% 100%, rgba(59,130,246,.08), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          position: "relative",
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11.5,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#0A0A0A",
            background: "#fff",
            border: "1px solid #E5E7EB",
            padding: "6px 12px",
            borderRadius: 999,
            marginBottom: 24,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "#10B981",
              display: "inline-block",
            }}
          />
          Webinar semanal · gratis · 30 min
        </span>
        <h1
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(34px, 5vw, 56px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            margin: "0 0 18px",
            color: "#0A0A0A",
          }}
        >
          Tu clínica funcionando con{" "}
          <span
            style={{
              background: GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            empleados digitales IA
          </span>
          , 24/7.
        </h1>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(15px, 1.2vw, 18px)",
            color: "#4B5563",
            lineHeight: 1.6,
            margin: "0 auto 32px",
            maxWidth: 640,
          }}
        >
          Cada semana mostramos <b style={{ color: "#0A0A0A", fontWeight: 600 }}>en vivo</b> cómo
          AURA atiende, agenda y cobra por WhatsApp mientras tu clínica duerme. Sesiones cortas,
          casos reales, sin costo y sin compromiso.
        </p>
        <WebinarMainCTA variant="light" />
        <div
          style={{
            marginTop: 18,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11.5,
            letterSpacing: "0.08em",
            color: "#6B7280",
          }}
        >
          Jueves 16:00 hora Chile · 30 min · sin costo
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   VIDEO SECTION — Vimeo embed (16:9 responsive)
   ============================================================ */
function VideoSection() {
  return (
    <section
      className="webinars-section"
      style={{
        padding: "48px 80px 8px",
        background: "#fff",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div
          style={{
            position: "relative",
            paddingTop: "56.25%",
            background: "#0A0A0A",
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid #EEECEA",
            boxShadow: "0 20px 50px -24px rgba(11,11,15,.18)",
          }}
        >
          <iframe
            src="https://player.vimeo.com/video/1195421426?h=1a476b36d0&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Webinars | Clinera.io"
          />
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
    </svg>
  );
}

/* ============================================================
   WEBINAR MAIN CTA — un solo CTA que abre el grupo de WhatsApp.
   Adentro del grupo se fija un mensaje con el link al evento .ics
   (público en /webinar.ics) para que cada usuario decida si lo agenda.
   ============================================================ */
function WebinarMainCTA({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark";
  const noteColor = dark ? "rgba(255,255,255,.55)" : "#9CA3AF";

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <CtaPrimary
        as="a"
        href={WA_GROUP}
        target="_blank"
        rel="noopener noreferrer"
        style={{ padding: "16px 26px", fontSize: 16, gap: 10 }}
      >
        <WhatsAppIcon />
        Unirme al grupo del webinar
        <span style={{ marginLeft: 4 }}>→</span>
      </CtaPrimary>
      <span
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10.5,
          letterSpacing: "0.08em",
          color: noteColor,
        }}
      >
        Jueves 16:00 hora Chile · 30 min · sin costo
      </span>
    </div>
  );
}

/* ============================================================
   WHAT YOU'LL LEARN
   ============================================================ */
function WhatYoullLearn() {
  const items = [
    {
      title: "Cómo reemplazar a la recepcionista con IA",
      desc: "AURA crea citas, las re-agenda, consulta pagos y reactiva pacientes. Sin pausa, sin licencias, por WhatsApp.",
    },
    {
      title: "Cómo conectar Meta Lead Ads en 30 segundos",
      desc: "Webhook de tu campaña → automatización en Clinera → AURA responde al lead antes de que se enfríe.",
    },
    {
      title: "Cuál de los 3 modos de IA elegir",
      desc: "Eficiente, Agentic o Agentic Pro. Cada uno cuesta distinto por conversación. Te mostramos cuál conviene según tu volumen.",
    },
    {
      title: "Casos reales de clínicas operando 24/7",
      desc: "Reservaciones nocturnas, recuperación de pacientes inactivos, +29% de citas confirmadas. Con números, no promesas.",
    },
  ];
  return (
    <section
      className="webinars-section"
      style={{
        padding: "96px 80px",
        background: "#fff",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Eyebrow>Qué vas a ver</Eyebrow>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: "clamp(26px, 3.3vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              margin: "12px 0 12px",
              color: "#0A0A0A",
            }}
          >
            En 30 minutos, lo que tu clínica necesita saber sobre IA.
          </h2>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 15.5,
              color: "#4B5563",
              lineHeight: 1.6,
              margin: "0 auto",
              maxWidth: 600,
            }}
          >
            Sesiones prácticas, con demos en vivo y Q&amp;A. No es un curso largo —
            es la versión corta y aplicable.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          {items.map((it, i) => (
            <div
              key={i}
              style={{
                background: "#FAFAFA",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                padding: "24px 22px 26px",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.14em",
                  color: "#7C3AED",
                  marginBottom: 14,
                }}
              >
                · {String(i + 1).padStart(2, "0")}
              </div>
              <h3
                style={{
                  fontFamily: "Inter",
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  color: "#0A0A0A",
                  margin: "0 0 8px",
                  lineHeight: 1.3,
                }}
              >
                {it.title}
              </h3>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 13.5,
                  color: "#6B7280",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HOW IT WORKS
   ============================================================ */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Te unes al grupo de WhatsApp",
      desc: "Un solo click. Sin formularios.",
    },
    {
      num: "02",
      title: "Recibes el link cada semana",
      desc: "Te avisamos el día y la hora con un día de anticipación.",
    },
    {
      num: "03",
      title: "Asistes en vivo (o ves la grabación)",
      desc: "Si no puedes en vivo, te llega la grabación al mismo grupo.",
    },
  ];
  return (
    <section
      className="webinars-section"
      style={{
        padding: "96px 80px",
        background: "#FAFAFA",
        borderTop: "1px solid #F0F0F0",
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Eyebrow style={{ color: "#7C3AED" }}>Cómo funciona</Eyebrow>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: "clamp(26px, 3.3vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              margin: "12px 0 0",
              color: "#0A0A0A",
            }}
          >
            Tres pasos. Cero fricción.
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
          }}
        >
          {steps.map((s) => (
            <div
              key={s.num}
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                padding: "26px 24px",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: 38,
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  lineHeight: 1,
                  background: GRAD,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  marginBottom: 14,
                }}
              >
                {s.num}
              </div>
              <h3
                style={{
                  fontFamily: "Inter",
                  fontSize: 16.5,
                  fontWeight: 700,
                  letterSpacing: "-0.012em",
                  color: "#0A0A0A",
                  margin: "0 0 6px",
                  lineHeight: 1.3,
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 13.5,
                  color: "#6B7280",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FINAL CTA
   ============================================================ */
function FinalCTA() {
  return (
    <section
      className="webinars-section"
      data-placement="final"
      style={{
        padding: "96px 80px 120px",
        background: "#0A0A0A",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-80px -80px auto -80px",
          height: 280,
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(124,58,237,.4), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#A5A5B0",
            marginBottom: 18,
          }}
        >
          · El próximo webinar es esta semana
        </div>
        <h2
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(30px, 4.2vw, 48px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            margin: "0 0 18px",
            color: "#fff",
          }}
        >
          Únete al grupo y participa{" "}
          <span
            style={{
              background:
                "linear-gradient(90deg, #60A5FA, #C084FC 55%, #F0ABFC)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            del próximo webinar
          </span>
          .
        </h2>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(14px, 1.15vw, 16px)",
            color: "#9CA3AF",
            lineHeight: 1.6,
            margin: "0 auto 30px",
            maxWidth: 540,
          }}
        >
          Sin costo. Sin compromiso. Puedes salir del grupo en cualquier momento.
        </p>
        <WebinarMainCTA variant="dark" />
      </div>
    </section>
  );
}
