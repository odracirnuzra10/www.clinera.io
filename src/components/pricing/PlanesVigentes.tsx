"use client";

// ============================================================================
// Planes Flux · Nexus · Summit (Ricardo, 18-oct-2026). Réplica de su diapositiva:
// Flux blanco, Nexus destacado con borde en degradado, Summit oscuro.
// Un solo CTA, «Hablar con ventas» → /agenda?plan=… con la query de la visita.
// Datos: `src/content/planes.ts`. Sin checkout ni switch de moneda.
// ============================================================================

import { useSyncExternalStore } from "react";
import {
  CTA_VENTAS_LABEL,
  EXTRAS_LINEA,
  IMPLEMENTACION_USD,
  PLANES,
  PLANES_TITULO,
  PLANES_TITULO_ACENTO,
  agendaHrefPlan,
  type Plan,
} from "@/content/planes";
import styles from "./PlanesVigentes.module.css";

const noop = () => () => {};
const readSearch = () => window.location.search;
const readSearchServer = () => "";

const n = (v: number) => v.toLocaleString("es-CL");

function Tarjeta({ plan, search }: { plan: Plan; search: string }) {
  const tono = plan.agenteIA ? styles.oscura : plan.featured ? styles.destacada : styles.clara;
  return (
    <article className={`${styles.card} ${tono}`} data-plan-card={plan.id}>
      <div className={styles.cardHead}>
        <span className={styles.planName}>{plan.name}</span>
        {plan.tag && <span className={styles.tag}>{plan.tag}</span>}
      </div>
      <div className={styles.price}>
        <span className={styles.cur}>US$</span>
        <span className={styles.amount}>{n(plan.monthlyUsd)}</span>
        <span className={styles.per}>/mes</span>
      </div>
      <ul className={styles.features}>
        {plan.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <a className={styles.cta} href={agendaHrefPlan(plan.id, search)} data-cta-ventas={plan.id}>
        {CTA_VENTAS_LABEL} <span aria-hidden>→</span>
      </a>
    </article>
  );
}

export default function PlanesVigentes({
  id = "planes",
  conTitulo = true,
}: {
  id?: string;
  conTitulo?: boolean;
}) {
  // La query de la visita (utm, gclid, fbclid) viaja a /agenda: sin ella el lead
  // del anuncio llega sin origen.
  const search = useSyncExternalStore(noop, readSearch, readSearchServer);

  return (
    <section id={id} className={styles.section} aria-label="Planes de Clinera" data-planes-vigentes>
      <div className={styles.inner}>
        {conTitulo && (
          <div className={styles.head}>
            <span className={styles.meta}>Planes · clínicas estéticas · clinera.io</span>
            <h2 className={styles.h2}>
              {PLANES_TITULO} <span className={styles.grad}>{PLANES_TITULO_ACENTO}</span>
            </h2>
          </div>
        )}

        <div className={styles.grid}>
          {PLANES.map((p) => (
            <Tarjeta key={p.id} plan={p} search={search} />
          ))}
        </div>

        <div className={styles.foot}>
          <div className={styles.footText}>
            <p className={styles.impl}>
              <b>+ US${n(IMPLEMENTACION_USD)} de implementación</b> · pago único, en todos los planes.
            </p>
            <span className={styles.meta}>Extras</span>
            <p className={styles.extras}>{EXTRAS_LINEA}</p>
          </div>
          <a className={styles.ctaFoot} href={agendaHrefPlan(null, search)} data-cta-ventas="general">
            {CTA_VENTAS_LABEL}
          </a>
        </div>
      </div>
    </section>
  );
}
