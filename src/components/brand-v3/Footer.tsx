"use client";

import Link from "next/link";
import { Wordmark } from "./Brand";

type Col = { t: string; l: Array<[string, string, boolean?]> };

const cols: Col[] = [
  {
    t: "Producto",
    l: [
      ["Ver demo", "/demo"],
      ["Funciones", "/funciones"],
      ["Planes", "/planes"],
      ["Agencias", "/agencias"],
      ["Integraciones", "/blog/clinera-api-webhooks-n8n-make-zapier"],
    ],
  },
  {
    t: "Recursos",
    l: [
      ["Calcula tu consumo", "/calculadora-de-consumo"],
      ["Estudio de efectividad", "/efectividad"],
      ["Estudio de confianza", "/blog/estudio-ia-respuesta-humana-confianza-pacientes"],
      ["Novedades Clinera", "/novedades"],
    ],
  },
  {
    t: "Soporte",
    l: [
      ["Centro de ayuda", "/ayuda"],
      ["Migrar a Clinera", "/migracion"],
      ["Agendar reunión", "/hablar-con-ventas"],
    ],
  },
  {
    t: "Comparativas",
    l: [
      ["Clinera vs Reservo", "/comparativas/reservo"],
      ["Clinera vs AgendaPro", "/comparativas/agendapro"],
      ["Clinera vs Medilink", "/comparativas/medilink"],
      ["Clinera vs Manual", "/comparativas/manual"],
      ["Ver todas →", "/comparativas", true],
    ],
  },
  {
    t: "Recursos LLM",
    l: [
      ["llms.txt", "/llms.txt"],
      ["llms-full.txt", "/llms-full.txt"],
      ["Robots.txt", "/robots.txt"],
    ],
  },
];

export default function FooterV3() {
  const linkEl = (label: string, href: string, highlight = false) => {
    const style = {
      fontFamily: "Inter",
      fontSize: 14,
      color: highlight ? "#2563EB" : "#0A0A0A",
      textDecoration: "none",
    } as const;
    const external =
      href.startsWith("http") || href.startsWith("mailto:") || href.endsWith(".txt");
    if (external) {
      return (
        <a key={label} href={href} style={style}>
          {label}
        </a>
      );
    }
    return (
      <Link key={label} href={href} style={style}>
        {label}
      </Link>
    );
  };

  return (
    <footer
      style={{
        background: "#FAFAFA",
        padding: "72px 80px 32px",
        borderTop: "1px solid #F0F0F0",
      }}
    >
      <div
        className="footer-v3-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.6fr repeat(5, 1fr)",
          gap: 32,
        }}
      >
        <div>
          <Wordmark size={22} />
          <div
            style={{
              fontFamily: "Inter",
              fontSize: 14,
              color: "#4B5563",
              lineHeight: 1.55,
              maxWidth: 300,
              marginTop: 14,
            }}
          >
            La IA que atiende, agenda y confirma pacientes por ti. Para clínicas que quieren
            crecer sin contratar más recepción.
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 18,
              background: "#ECFDF5",
              border: "1px solid #A7F3D0",
              padding: "6px 12px",
              borderRadius: 999,
            }}
          >
            <span
              className="live-dot"
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: 999,
                background: "#10B981",
              }}
            />
            <span
              style={{
                fontFamily: "Inter",
                fontSize: 13,
                color: "#065F46",
                fontWeight: 500,
              }}
            >
              +500 médicos · 10 países
            </span>
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.t}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#6B7280",
                fontWeight: 500,
                marginBottom: 16,
              }}
            >
              {c.t}
              {c.t === "Recursos LLM" && (
                <span style={{ marginLeft: 6, color: "#7C3AED" }}>✦</span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {c.l.map(([label, href, highlight]) => linkEl(label, href, !!highlight))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "56px auto 0",
          paddingTop: 24,
          borderTop: "1px solid #E5E7EB",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          fontFamily: "Inter",
          fontSize: 13,
          color: "#6B7280",
        }}
      >
        <div>
          © 2026 Clinera SpA · OACG Group · Santiago, Chile · CDMX, México ·{" "}
          <Link href="/terminos" style={{ color: "inherit" }}>
            Términos
          </Link>{" "}
          ·{" "}
          <Link href="/privacidad" style={{ color: "inherit" }}>
            Privacidad
          </Link>{" "}
          ·{" "}
          <Link href="/cookies" style={{ color: "inherit" }}>
            Cookies
          </Link>
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontSize: 11,
          }}
        >
          USD · WhatsApp Business API · LATAM
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.footer-v3-grid) {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
          :global(.footer-v3-grid > div:first-child) {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 720px) {
          :global(footer) { padding-left: 32px !important; padding-right: 32px !important; }
        }
        @media (max-width: 520px) {
          :global(.footer-v3-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
