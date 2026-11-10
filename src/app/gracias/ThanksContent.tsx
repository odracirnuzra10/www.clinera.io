"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Ejecutiva = {
  nombre: string;
  cargo: string;
  whatsapp: string;
  foto: string;
};

const TEAM: Record<"catalina" | "nohelymar", Ejecutiva> = {
  catalina: {
    nombre: "Catalina Fuentes",
    cargo: "Ejecutiva de ventas",
    whatsapp: "+56975724898",
    // TODO Ricardo: subir public/team/catalina.jpg (foto cuadrada 480×480, fondo claro)
    foto: "/team/catalina.jpg",
  },
  nohelymar: {
    nombre: "Nohelymar Sánchez",
    cargo: "Ejecutiva de ventas",
    // TODO Ricardo: confirmar WhatsApp real de Nohelymar (por ahora fallback al de Catalina)
    whatsapp: "+56975724898",
    // TODO Ricardo: subir public/team/nohelymar.jpg (foto cuadrada 480×480, fondo claro)
    foto: "/team/nohelymar.jpg",
  },
};

// pixelVerified lo calcula page.tsx (Server Component) validando el token
// firmado que trae la URL — ver ./token.ts. Sin él, CompleteRegistration no
// dispara aunque event_id venga en la URL (hallazgo #3 de
// auditoria-leads-clinera.md, PR #170): antes bastaba con visitar
// /gracias?event_id=x a mano para inflar el Pixel con una conversión falsa.
//
// Ojo con el alcance: hoy quien llega acá con un lead real es
// RoiCalculator.tsx (calculadora de ROI), no el wizard de /hablar-con-ventas ni
// /ventas — ninguno de los dos redirige a /gracias, confirmado revisando
// VentasLanding.tsx, ReunionLanding.tsx y DemoWizard.tsx. La protección
// vive igual acá porque /gracias es la página vulnerable, sea cual sea el
// formulario que la use hoy o mañana.
export function ThanksContent({ pixelVerified }: { pixelVerified: boolean }) {
  const params = useSearchParams();
  const source = params.get("source") ?? "unknown";
  const eventId = params.get("event_id") ?? "";
  const ejecutivaParam = (params.get("ejecutiva") ?? "").toLowerCase();
  // n8n puede pasar ?ejecutiva=nohelymar para asignación 100% precisa.
  // Default: siempre Catalina (decisión Ricardo 2026-04-25).
  const key: "catalina" | "nohelymar" =
    ejecutivaParam === "nohelymar" ? "nohelymar" : "catalina";
  const ejecutiva = TEAM[key];
  const firstName = ejecutiva.nombre.split(" ")[0];
  const waText = encodeURIComponent(
    `Hola ${firstName}, acabo de dejar mis datos en Clinera.`,
  );
  const waHref = `https://wa.me/${ejecutiva.whatsapp.replace("+", "")}?text=${waText}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.fbq && eventId && pixelVerified) {
      window.fbq(
        "track",
        "CompleteRegistration",
        { content_name: source },
        { eventID: eventId },
      );
    }
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "lead_thank_you_view",
        lead_source: source,
        event_id: eventId,
        ejecutiva_asignada: key,
      });
    }
  }, [source, eventId, key, pixelVerified]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#FAFAFA 0%,#FFFFFF 100%)",
        padding: "96px 24px 80px",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#0A0A0A",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            borderRadius: 999,
            background: "#ECFDF5",
            border: "1px solid #A7F3D0",
            color: "#065F46",
            fontFamily: "JetBrains Mono, ui-monospace, monospace",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "#10B981",
            }}
          />
          Recibido · te contactamos pronto
        </span>

        <h1
          style={{
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            margin: "20px 0 14px",
          }}
        >
          ¡Gracias! Te contactamos en menos de 2 horas
        </h1>
        <p style={{ fontSize: 18, color: "#4B5563", lineHeight: 1.55, marginBottom: 36 }}>
          Recibimos tu solicitud. <strong>{ejecutiva.nombre}</strong> te escribe por WhatsApp para coordinar.
        </p>

        <article
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            gap: 24,
            alignItems: "center",
            background: "#fff",
            border: "1px solid #EEECEA",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ejecutiva.foto}
            alt={ejecutiva.nombre}
            width={120}
            height={120}
            style={{
              width: 120,
              height: 120,
              borderRadius: 999,
              objectFit: "cover",
              background: "#F3F4F6",
            }}
          />
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
              {ejecutiva.nombre}
            </h2>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "4px 0 14px" }}>
              {ejecutiva.cargo}
            </p>
            <a
              href={waHref}
              data-event="thanks_whatsapp_click"
              data-ejecutiva={key}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#0A0A0A",
                color: "#fff",
                padding: "12px 20px",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14.5,
              }}
            >
              Escribir a {firstName} por WhatsApp →
            </a>
          </div>
        </article>

        <section style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.015em", marginBottom: 14 }}>
            Mientras tanto…
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <li>
              <Link href="/efectividad" style={{ color: "#7C3AED", fontWeight: 600, fontSize: 15 }}>
                Lee el estudio: 100% de agendamientos en ≤3 intentos →
              </Link>
            </li>
            <li>
              <Link href="/blog/efectividad" style={{ color: "#7C3AED", fontWeight: 600, fontSize: 15 }}>
                Cómo lo medimos: metodología completa →
              </Link>
            </li>
            <li>
              <Link href="/comparativas/agendapro" style={{ color: "#7C3AED", fontWeight: 600, fontSize: 15 }}>
                Clinera vs AgendaPro →
              </Link>
            </li>
            <li>
              <Link href="/demo" style={{ color: "#7C3AED", fontWeight: 600, fontSize: 15 }}>
                Ver demo grabada (5 min) →
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
