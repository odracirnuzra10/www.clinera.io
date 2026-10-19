"use client";

// ============================================================================
// «Activa tu ecosistema» — la banda que rompe el esquema (Ricardo, 18-oct-2026)
// ----------------------------------------------------------------------------
// El sitio es light sobre blanco; esta banda es lo único oscuro y de tipografía
// gigante para que el ojo se detenga ahí. Va SIEMPRE en el home, en las
// landings y en cada artículo del blog: una vez por página.
//
// Antes se llamaba «Activa tu agente IA» y vendía solo el software. Ricardo pidió
// enfocarla en TODO el ecosistema: campañas de marketing, framework comercial, y
// los canales junto con la agenda (la IA responde y deja la cita creada).
//
// Dónde vive: home (`HomeV3`), landings `software-vertical` y `/blog/[slug]`. El
// ancho lo decide el contenedor (container queries), así que la misma pieza sirve
// a página completa y dentro de la columna del blog. Sin alto fijo ni animación
// con JavaScript (lección de /go con el navegador de Meta).
// ============================================================================

import { useSyncExternalStore } from "react";
import { ChannelLogo } from "@/components/pricing/PlanChannelLogos";
import type { PlanChannel } from "@/content/pricing";
import { CTA_VENTAS_LABEL, CTA_VENTAS_PATH, PLANES } from "@/content/planes";
import styles from "./AgenteIABanda.module.css";

const CANALES: PlanChannel[] = ["whatsapp", "facebook", "instagram", "llamadas"];

function Cohete() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function Objetivo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function Calendario() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}

// Ricardo, 18-oct-2026: el CTA es «Agendar videollamada» (`CTA_VENTAS_PATH`), ya no /go.
const DEFAULT_HREF = CTA_VENTAS_PATH;

const noop = () => () => {};
const readSearch = () => window.location.search;
const readSearchServer = () => "";

export default function AgenteIABanda({
  href = DEFAULT_HREF,
  ctaLabel = CTA_VENTAS_LABEL,
  enColumna = false,
}: {
  /** Destino del CTA. */
  href?: string;
  ctaLabel?: string;
  /** Dentro de una columna angosta (artículo del blog): sin el margen de página. */
  enColumna?: boolean;
}) {
  // Al ir a /agenda se conserva la query de la visita (utm, gclid, fbclid): sin ella
  // el lead pierde su origen. Las anclas (#…) no la necesitan.
  const search = useSyncExternalStore(noop, readSearch, readSearchServer);
  const destino = href.startsWith("/") ? `${href}${search}` : href;
  const [vortex, ecosistema] = PLANES;

  return (
    <section className={`${styles.wrap} ${enColumna ? styles.enColumna : ""}`} aria-label="Activa tu ecosistema" data-agente-ia-banda>
      <div className={styles.panel}>
        <div className={styles.glow} aria-hidden />
        <span className={styles.meta}>
          <span className={styles.live} aria-hidden />
          Ecosistema · marketing + IA · 24/7
        </span>

        <h2 className={styles.h2}>
          <span className={styles.line}>Activa tu ecosistema.</span>
          <span className={styles.line}>Campañas que traen pacientes. IA que los agenda.</span>
        </h2>

        <ul className={styles.channels}>
          <li className={styles.channel}>
            <span className={styles.logo}>
              <Cohete />
            </span>
            <span>
              <b>Campañas de marketing</b>
              <small>Performance en Facebook, Instagram y Google, con tu propuesta de valor.</small>
            </span>
          </li>
          <li className={styles.channel}>
            <span className={styles.logo}>
              <Objetivo />
            </span>
            <span>
              <b>Framework comercial</b>
              <small>Técnicas de venta para cerrar a los pacientes que llegan, con una reunión de marketing por semana (4 al mes).</small>
            </span>
          </li>
          <li className={styles.channel}>
            <span className={styles.logo}>
              <Calendario />
            </span>
            <span>
              <b>Canales + agenda</b>
              <small>La IA responde por WhatsApp, Facebook, Instagram y teléfono, y deja la cita en tu agenda.</small>
              <span className={styles.logosFila} aria-hidden>
                {CANALES.map((c) => (
                  <span key={c} className={styles.logoMini}>
                    <ChannelLogo channel={c} size={14} />
                  </span>
                ))}
              </span>
            </span>
          </li>
        </ul>

        <div className={styles.foot}>
          <a href={destino} className={styles.cta}>
            {ctaLabel} <span aria-hidden>→</span>
          </a>
          <span className={styles.note}>
            {vortex.name} (US$ {vortex.monthlyUsd}/mes) trae el software con agente IA; {ecosistema.name} (US$ {ecosistema.monthlyUsd}/mes) suma el marketing.
          </span>
        </div>
      </div>
    </section>
  );
}
