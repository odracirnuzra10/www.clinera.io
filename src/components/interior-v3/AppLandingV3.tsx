"use client";

import { GRAD } from "@/components/brand-v3/Brand";
import { useReveal } from "@/components/home-v3/sections";

/* ============================================================
   APP MÓVIL — Landing de la versión 2.0 (iOS + Android)
   ============================================================ */

const APP_STORE = "https://apps.apple.com/cl/app/clinera/id6759620693";
const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.clinera.mobile";

type Feature = { t: string; d: string; icon: React.ReactNode };

const stroke = {
  fill: "none",
  stroke: "#7C3AED",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const FEATURES: Feature[] = [
  {
    t: "Rediseño completo",
    d: "Interfaz más limpia y directa. Menos pasos para hacer lo de siempre.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
        <path d="M12 3l2.1 4.7L19 8.3l-3.5 3.4.9 5.1L12 14.8 7.6 16.8l.9-5.1L5 8.3l4.9-.6z" />
      </svg>
    ),
  },
  {
    t: "Agenda por sucursal",
    d: "Cambia entre sedes en un toque y ve solo las citas que te importan.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
        <rect x="3" y="5" width="18" height="16" rx="2.5" />
        <path d="M3 9h18M8 3v4M16 3v4M8 14h3" />
      </svg>
    ),
  },
  {
    t: "Mensajería mejorada",
    d: "Plantillas de WhatsApp aprobadas y chatbot, integrados en cada conversación.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
        <path d="M21 11.5a8.4 8.4 0 0 1-11.9 7.6L4 20.5l1.4-5A8.4 8.4 0 1 1 21 11.5z" />
      </svg>
    ),
  },
  {
    t: "Más rápida y estable",
    d: "Reescrita desde cero: abre al instante y sin los errores de la versión anterior.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
        <path d="M13 3L4 14h6l-1 7 9-11h-6z" />
      </svg>
    ),
  },
  {
    t: "Tu clínica, contigo",
    d: "Agenda, fichas de pacientes y conversaciones — donde estés, desde el celular.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
        <rect x="6" y="2.5" width="12" height="19" rx="3" />
        <path d="M10.5 18.5h3" />
      </svg>
    ),
  },
];

export default function AppLandingV3() {
  useReveal();
  return (
    <>
      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.in {
          opacity: 1;
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0ms !important;
            transition-duration: 0ms !important;
          }
        }
        .app-hero-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 64px;
          align-items: center;
        }
        .app-new-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .app-new-grid > :nth-child(1) {
          grid-column: span 2;
        }
        @media (max-width: 940px) {
          .app-hero-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .app-hero-phone {
            order: -1;
          }
          .app-new-grid {
            grid-template-columns: 1fr;
          }
          .app-new-grid > :nth-child(1) {
            grid-column: auto;
          }
        }
        @media (max-width: 720px) {
          main > section {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .app-hero-title {
            font-size: 40px !important;
          }
        }
      `}</style>

      <Hero />
      <Novedades />
      <DownloadBand />
    </>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section style={{ padding: "72px 80px 64px", background: "#fff" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }} className="app-hero-grid">
        <div>
          <div
            className="reveal"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#7C3AED",
              marginBottom: 22,
            }}
          >
            <span style={{ width: 24, height: 1, background: "#7C3AED", display: "inline-block" }} />
            App móvil · Versión 2.0
          </div>

          <h1
            className="reveal app-hero-title"
            style={{
              fontFamily: "Inter",
              fontSize: 54,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.04,
              margin: "0 0 20px",
              color: "#0A0A0A",
            }}
          >
            Toda tu clínica,{" "}
            <span
              style={{
                background: GRAD,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              en tu bolsillo
            </span>
            .
          </h1>

          <p
            className="reveal"
            style={{
              fontFamily: "Inter",
              fontSize: 18,
              lineHeight: 1.6,
              color: "#4B5563",
              margin: "0 0 30px",
              maxWidth: 460,
            }}
          >
            Rediseñamos la app de Clinera por completo. Más limpia, más rápida y
            sin errores: agenda, pacientes y mensajería de tu clínica, siempre a
            mano.
          </p>

          <div className="reveal">
            <StoreBadges />
          </div>

          <div className="reveal" style={{ marginTop: 26 }}>
            <QrRow />
          </div>
        </div>

        <div className="app-hero-phone reveal" style={{ justifySelf: "center" }}>
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

/* ---------- Store badges ----------
   Los SVG de badge son la variante "artwork blanco / fondo transparente":
   se ven sobre superficies oscuras. En claro (onDark=false) van sobre una
   píldora negra → queda el badge negro oficial. En oscuro, sin envoltorio. */
function StoreBadges({ onDark = false }: { onDark?: boolean }) {
  const badge = (href: string, src: string, alt: string) => {
    // eslint-disable-next-line @next/next/no-img-element
    const img = <img src={src} alt={alt} style={{ height: onDark ? 52 : 40, display: "block" }} />;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={alt}
        style={
          onDark
            ? { display: "inline-block" }
            : {
                display: "inline-flex",
                alignItems: "center",
                background: "#0A0A0A",
                borderRadius: 11,
                padding: "8px 14px",
                border: "1px solid #0A0A0A",
              }
        }
      >
        {img}
      </a>
    );
  };
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {badge(APP_STORE, "/images/AppStore.svg", "Descargar en el App Store")}
      {badge(PLAY_STORE, "/images/Google_Play.svg", "Disponible en Google Play")}
    </div>
  );
}

/* ---------- QR row ---------- */
function QrCard({ src, label, tienda }: { src: string; label: string; tienda: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 76,
          height: 76,
          padding: 8,
          borderRadius: 14,
          border: "1px solid #EAEAEA",
          background: "#fff",
          flex: "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={`Código QR para ${tienda}`} style={{ width: "100%", height: "100%", display: "block", imageRendering: "pixelated" }} />
      </div>
      <div>
        <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 3 }}>
          {tienda}
        </div>
        <div style={{ fontFamily: "Inter", fontSize: 13.5, fontWeight: 500, color: "#4B5563", lineHeight: 1.35, maxWidth: 130 }}>
          {label}
        </div>
      </div>
    </div>
  );
}

function QrRow() {
  return (
    <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
      <QrCard src="/images/qr-app-ios.svg" tienda="iOS" label="Escanea con la cámara del iPhone" />
      <QrCard src="/images/qr-app-android.svg" tienda="Android" label="Escanea con la cámara del teléfono" />
    </div>
  );
}

/* ---------- Phone mockup ---------- */
function PhoneMockup() {
  const cita = (h: string, name: string, treat: string, pill: string, pillBg: string, pillFg: string) => (
    <div style={{ display: "flex", gap: 12, padding: "12px 13px", border: "1px solid #EFEFF2", borderRadius: 13, background: "#fff", alignItems: "center" }}>
      <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 12, color: "#7C3AED", fontWeight: 600, width: 42, flex: "none" }}>{h}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600, color: "#111", lineHeight: 1.2 }}>{name}</div>
        <div style={{ fontFamily: "Inter", fontSize: 11.5, color: "#9CA3AF", marginTop: 1 }}>{treat}</div>
      </div>
      <span style={{ fontFamily: "Inter", fontSize: 10.5, fontWeight: 600, color: pillFg, background: pillBg, borderRadius: 999, padding: "3px 9px", flex: "none" }}>{pill}</span>
    </div>
  );

  return (
    <div
      style={{
        width: 288,
        borderRadius: 42,
        padding: 11,
        background: "#0A0A0F",
        boxShadow: "0 50px 100px -30px rgba(20,10,40,.4), 0 12px 32px -12px rgba(0,0,0,.25)",
      }}
    >
      <div style={{ borderRadius: 32, overflow: "hidden", background: "#F7F6F3", position: "relative" }}>
        {/* notch */}
        <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 92, height: 24, background: "#0A0A0F", borderRadius: 999, zIndex: 2 }} />
        {/* app header */}
        <div style={{ background: "#fff", padding: "40px 18px 16px", borderBottom: "1px solid #EFEFF2" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF" }}>Sucursal Providencia</div>
              <div style={{ fontFamily: "Inter", fontSize: 17, fontWeight: 700, color: "#111", letterSpacing: "-0.02em", marginTop: 2 }}>Agenda de hoy</div>
            </div>
            <div style={{ width: 34, height: 34, borderRadius: 11, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Inter", fontWeight: 700, fontSize: 16 }}>c</div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            {["Providencia", "Las Condes", "Ñuñoa"].map((s, i) => (
              <span key={s} style={{ fontFamily: "Inter", fontSize: 10.5, fontWeight: 500, padding: "5px 10px", borderRadius: 999, background: i === 0 ? "#111" : "#F3F2F0", color: i === 0 ? "#fff" : "#6B7280" }}>{s}</span>
            ))}
          </div>
        </div>
        {/* agenda */}
        <div style={{ padding: "14px 14px 20px", display: "flex", flexDirection: "column", gap: 9 }}>
          {cita("09:30", "Dra. Javiera Solís", "Limpieza facial profunda", "Confirmada", "#EDF3EC", "#3F7A4E")}
          {cita("11:00", "Tomás Errázuriz", "Control post-tratamiento", "En camino", "#E1F3FE", "#0B72A8")}
          {cita("12:15", "Sofía Paredes", "Consulta dermatología", "Pendiente", "#FBF3DB", "#9A7B15")}
          <div style={{ marginTop: 4, display: "flex", gap: 10, alignItems: "center", padding: "11px 13px", borderRadius: 13, background: "#111", color: "#fff" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-11.9 7.6L4 20.5l1.4-5A8.4 8.4 0 1 1 21 11.5z" /></svg>
            <span style={{ fontFamily: "Inter", fontSize: 12.5, fontWeight: 500 }}>3 mensajes nuevos por WhatsApp</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Novedades ---------- */
function Novedades() {
  return (
    <section style={{ padding: "24px 80px 84px", background: "#fff" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div className="reveal" style={{ maxWidth: 560, marginBottom: 40 }}>
          <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 14 }}>
            Qué hay de nuevo
          </div>
          <h2 style={{ fontFamily: "Inter", fontSize: 34, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0, color: "#0A0A0A" }}>
            Una app rehecha de cero, pensada para el día a día de tu clínica.
          </h2>
        </div>

        <div className="app-new-grid">
          {FEATURES.map((f, i) => (
            <div
              key={f.t}
              className="reveal"
              style={{
                border: "1px solid #EAEAEA",
                borderRadius: 18,
                background: i === 0 ? "#F9F9F8" : "#fff",
                padding: "26px 26px 28px",
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F3EEFE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: "Inter", fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", color: "#111", margin: "0 0 7px" }}>{f.t}</h3>
              <p style={{ fontFamily: "Inter", fontSize: 14.5, lineHeight: 1.55, color: "#6B6B6B", margin: 0, maxWidth: i === 0 ? 420 : "none" }}>{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Download band ---------- */
function DownloadBand() {
  return (
    <section style={{ padding: "0 80px 96px", background: "#fff" }}>
      <div
        className="reveal"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          position: "relative",
          overflow: "hidden",
          borderRadius: 26,
          background: "#0A0A0F",
          color: "#fff",
          padding: "56px 56px",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 50% 70% at 90% 10%, rgba(124,58,237,.28) 0%, transparent 68%),radial-gradient(ellipse 45% 60% at 5% 100%, rgba(59,130,246,.16) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", display: "flex", gap: 40, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ maxWidth: 460 }}>
            <h2 style={{ fontFamily: "Inter", fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 12px" }}>
              Descarga Clinera 2.0
            </h2>
            <p style={{ fontFamily: "Inter", fontSize: 16.5, lineHeight: 1.6, color: "rgba(255,255,255,.72)", margin: "0 0 24px" }}>
              Gratis para clínicas Clinera. Disponible para iPhone y Android — escanea el código o descárgala desde tu tienda.
            </p>
            <StoreBadges onDark />
          </div>

          <div style={{ display: "flex", gap: 22 }}>
            <DarkQr src="/images/qr-app-ios.svg" label="iOS" />
            <DarkQr src="/images/qr-app-android.svg" label="Android" />
          </div>
        </div>
      </div>
    </section>
  );
}

function DarkQr({ src, label }: { src: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 108, height: 108, padding: 10, borderRadius: 16, background: "#fff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={`Código QR para ${label}`} style={{ width: "100%", height: "100%", display: "block", imageRendering: "pixelated" }} />
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", marginTop: 10 }}>{label}</div>
    </div>
  );
}
