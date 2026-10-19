"use client";

// ============================================================================
// «Marketing de performance» (Ricardo, 18-oct-2026): mismo peso visual que la
// sección de software. Los bloques de `MARKETING_BLOQUES` y el cierre que los
// une con el software: el lead llega a la bandeja de Clinera y la IA lo agenda.
// Sin cifras. CTA a /agenda?servicio=marketing con la query de la visita.
// ============================================================================

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import { CTA_VENTAS_LABEL, MARKETING_BLOQUES, agendaHref } from "@/content/planes";

const noop = () => () => {};
const readSearch = () => window.location.search;
const readSearchServer = () => "";

export default function MarketingPerformance() {
  const search = useSyncExternalStore(noop, readSearch, readSearchServer);
  return (
    <section
      id="marketing"
      aria-label="Marketing de performance"
      data-marketing-performance
      style={{ padding: "112px 56px", background: "#FFFFFF" }}
    >
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 56px" }}>
          <Eyebrow>Marketing de performance</Eyebrow>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "16px 0 14px",
              color: "#0A0A0A",
            }}
          >
            Te traemos los pacientes,{" "}
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              y la IA los agenda.
            </span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "#4B5563", margin: 0 }}>
            El marketing es lo que cambia el resultado: en el plan Ecosistema un equipo se encarga de las campañas, de tu propuesta de valor y de enseñarle a tu equipo a cerrar, y se reúne contigo cada semana.
          </p>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}
        >
          {MARKETING_BLOQUES.map((b, i) => (
            <article
              key={b.id}
              data-marketing-bloque={b.id}
              style={{
                background: "#FAFAFA",
                border: "1px solid #EDEDED",
                borderRadius: 20,
                padding: 28,
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.09em",
                  color: "#7C3AED",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 700, lineHeight: 1.25, margin: "10px 0 10px", color: "#0A0A0A" }}>
                {b.titulo}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "#4B5563", margin: 0 }}>{b.texto}</p>
            </article>
          ))}
        </div>

        <div
          data-marketing-semanas
          aria-label="Cuatro reuniones de marketing al mes, una por semana"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12,
            marginTop: 28,
            padding: 20,
            borderRadius: 20,
            background: "#0A0A0A",
          }}
        >
          {[1, 2, 3, 4].map((n) => (
            <div key={n} style={{ textAlign: "center", color: "#FFFFFF" }}>
              <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11, letterSpacing: "0.09em", color: "#C4B5FD", textTransform: "uppercase" }}>
                Semana {n}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6 }}>Reunión de marketing</div>
            </div>
          ))}
          <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#E5E7EB", fontSize: 14, marginTop: 4 }}>
            4 reuniones al mes, 1 por semana, para ver los resultados y ajustar las campañas contigo.
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            maxWidth: 640,
            margin: "40px auto 0",
            fontSize: 17,
            lineHeight: 1.6,
            color: "#0A0A0A",
            fontWeight: 600,
          }}
        >
          Cada lead llega a la bandeja de Clinera y se agenda ahí mismo.
        </p>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <Link
            href={agendaHref("marketing", search)}
            data-marketing-cta
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 26px",
              borderRadius: 999,
              background: GRAD,
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
            }}
          >
            {CTA_VENTAS_LABEL}
          </Link>
        </div>
      </div>
    </section>
  );
}
