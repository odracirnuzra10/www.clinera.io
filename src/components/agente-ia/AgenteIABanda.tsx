"use client";

// ============================================================================
// «Activa tu agente IA» — la banda que rompe el esquema (Ricardo, 18-oct-2026)
// ----------------------------------------------------------------------------
// El sitio es light sobre blanco; esta banda es lo único oscuro y de tipografía
// gigante para que el ojo se detenga ahí. Va SIEMPRE en el home, en las
// landings y en cada artículo del blog: una vez por página.
//
// Dónde vive: home (`HomeV3`), landings `software-vertical`
// y `/blog/[slug]`. El ancho lo decide el contenedor (container queries), así
// que la misma pieza sirve a página completa y dentro de la columna del blog.
//
// El agente IA viene incluido en Vortex (y en Ecosistema, que suma marketing;
// 18-oct-2026). Por eso la nota bajo los canales.
//
// Sin JavaScript para la animación y sin alto fijo: la palabra que rota está
// apilada en una sola celda de grilla, la caja mide la más larga (lección de
// /go con el navegador de Meta).
// ============================================================================

import { useSyncExternalStore } from "react";
import { ChannelLogo, CHANNEL_LABEL } from "@/components/pricing/PlanChannelLogos";
import type { PlanChannel } from "@/content/pricing";
import { CTA_VENTAS_LABEL, CTA_VENTAS_PATH, PLAN_IA_DESDE } from "@/content/planes";
import styles from "./AgenteIABanda.module.css";

const CANALES: { id: PlanChannel; palabra: string; accion: string }[] = [
  { id: "whatsapp", palabra: "WhatsApp", accion: "Responde, agenda y confirma" },
  { id: "facebook", palabra: "Facebook", accion: "Contesta Messenger y agenda" },
  { id: "instagram", palabra: "Instagram", accion: "Convierte mensajes directos en citas" },
  { id: "llamadas", palabra: "teléfono", accion: "Atiende la llamada y agenda" },
];

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
  /** Destino del CTA. En la landing de Ads se pasa el ancla del formulario. */
  href?: string;
  ctaLabel?: string;
  /** Dentro de una columna angosta (artículo del blog): sin el margen de página. */
  enColumna?: boolean;
}) {
  // Al ir a la landing se conserva la query de la visita (utm, gclid, fbclid): sin
  // ella el lead pierde su origen. Las anclas (#…) no la necesitan.
  const search = useSyncExternalStore(noop, readSearch, readSearchServer);
  const destino = href.startsWith("/") ? `${href}${search}` : href;

  return (
    <section className={`${styles.wrap} ${enColumna ? styles.enColumna : ""}`} aria-label="Activa tu agente IA" data-agente-ia-banda>
      <div className={styles.panel}>
        <div className={styles.glow} aria-hidden />
        <span className={styles.meta}>
          <span className={styles.live} aria-hidden />
          Agente IA · 24/7 · en tu WhatsApp, Facebook, Instagram y teléfono
        </span>

        <h2 className={styles.h2}>
          <span className={styles.line}>Activa tu agente IA.</span>
          <span className={styles.line}>
            Que agende tus pacientes por{" "}
            <span className={styles.rotor} aria-hidden>
              {CANALES.map((c, i) => (
                <span key={c.id} className={styles.word} style={{ animationDelay: `${i * 2.5}s` }}>
                  {c.palabra}
                </span>
              ))}
            </span>
            <span className={styles.srOnly}>WhatsApp, Facebook, Instagram y llamadas telefónicas</span>
          </span>
        </h2>

        <ul className={styles.channels}>
          {CANALES.map((c) => (
            <li key={c.id} className={styles.channel}>
              <span className={styles.logo}>
                <ChannelLogo channel={c.id} size={22} />
              </span>
              <span>
                <b>{CHANNEL_LABEL[c.id]}</b>
                <small>{c.accion}</small>
              </span>
            </li>
          ))}
        </ul>

        <div className={styles.foot}>
          <a href={destino} className={styles.cta}>
            {ctaLabel} <span aria-hidden>→</span>
          </a>
          <span className={styles.note}>
            El agente IA viene incluido en {PLAN_IA_DESDE.name} · US$ {PLAN_IA_DESDE.monthlyUsd}/mes.
          </span>
        </div>
      </div>
    </section>
  );
}
