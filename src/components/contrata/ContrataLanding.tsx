"use client";

// /contrata (Ricardo, 4-nov-2026): landing L2 «Software». Invita a contratar Clinera como
// software (Hex o Flux), corta y pensada para el celular. La L1 del Ecosistema es /agenda y no
// se toca. Misma identidad que /agenda: boleta recortada, degradado azul → violeta, Outfit +
// mono. Los planes salen de `planes-nuevos.ts` (la misma fuente de /planes2): un precio o una
// cantidad de conversaciones se cambia allá, no acá.
//
// CTA: Hex y Flux no tienen link de pago todavía; el alta es la de /planes2, «Prueba gratis»
// → app.clinera.io?plan=… con la query de la visita (utm, gclid, fbclid).

import { useEffect, useSyncExternalStore } from "react";
import { CHANNEL_LABEL, ChannelLogo } from "@/components/pricing/PlanChannelLogos";
import { track, trackPixel } from "@/lib/tracking";
import {
  HEX_PAGO_LABEL,
  PLANES_NUEVOS,
  RECOMENDADO_LABEL,
  PRUEBA_LABEL,
  PRUEBA_LINEA,
  PRUEBA_URL,
  conPlan,
  conUtm,
  type PlanNuevo,
} from "@/content/planes-nuevos";
import styles from "./ContrataLanding.module.css";

const noop = () => () => {};
const readSearch = () => window.location.search;
const readSearchServer = () => "";

const PLANES = PLANES_NUEVOS.filter((p) => p.id === "hex" || p.id === "flux");
// Lo que traen los dos (agenda, presupuestos, panel de ventas): Flux lo dice como «Todo lo de Hex».
const BASE_COMUN = PLANES[0].incluye.filter((f) => !f.includes(" con "));

/** «WhatsApp con 200 conversaciones» → ["WhatsApp", "200 conversaciones"]. */
function partirLinea(texto: string): [string, string] {
  const m = texto.match(/^(.+?) con (.+)$/);
  return m ? [m[1], m[2]] : [texto, "Incluido"];
}

export default function ContrataLanding() {
  const search = useSyncExternalStore(noop, readSearch, readSearchServer);
  useEffect(() => {
    track("view_item_list", { item_list_id: "contrata" });
    trackPixel("ViewContent", { content_name: "contrata", content_type: "product_group" });
  }, []);

  const ventasQ = new URLSearchParams(search).toString();

  return (
    <main className={styles.pagina} data-contrata>
      <header className={styles.cabeza}>
        <span className={styles.eyebrow}>Clinera · Software para clínicas</span>
        <h1 className={styles.titulo}>
          Tu clínica ordenada, <span className={styles.acento}>con WhatsApp incluido.</span>
        </h1>
        <p className={styles.bajada}>Agenda, presupuestos y panel de ventas. Creas tu cuenta en minutos y pruebas gratis.</p>
      </header>

      <div className={styles.tickets}>
        {PLANES.map((p) => (
          <Ticket key={p.id} plan={p} search={search} />
        ))}
      </div>

      <p className={styles.prueba}>{PRUEBA_LINEA}</p>

      <p className={styles.ventas}>
        ¿Quieres que la IA atienda a tus pacientes o sumar marketing?{" "}
        <a href={ventasQ ? `/agenda?${ventasQ}` : "/agenda"} suppressHydrationWarning data-contrata-ventas>
          Conoce Vortex y el Ecosistema
        </a>
      </p>
    </main>
  );
}

function Ticket({ plan, search }: { plan: PlanNuevo; search: string }) {
  // Hex es el plan a vender (Ricardo, 4-nov-2026): su botón es el Payment Link de Stripe, con los utm
  // de la visita. Flux sigue con «Prueba gratis», en segundo plano.
  const pago = plan.cta === "pago" && plan.pagoUrl;
  const href = pago ? conUtm(plan.pagoUrl!, search) : conPlan(PRUEBA_URL, plan.id, search);
  const lineas = [...BASE_COMUN, ...plan.incluye.filter((f) => f.includes(" con "))];
  return (
    <article className={`${styles.ticket} ${pago ? styles.recomendado : ""}`} data-contrata-plan={plan.id}>
      {pago && (
        <span className={styles.insignia} data-insignia>
          {RECOMENDADO_LABEL}
        </span>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/agenda/boleta-arriba.webp" alt="" aria-hidden className={styles.papel} width={600} height={96} />
      <div className={styles.cuerpo}>
        <div className={styles.encabezado}>
          <span className={styles.etiqueta}>{plan.etiqueta}</span>
          <span className={styles.nombre}>
            {plan.name}
            {plan.canales.map((c) => (
              <span key={c} title={CHANNEL_LABEL[c]} className={styles.canal} data-canales>
                <ChannelLogo channel={c} size={18} />
                <span className="sr-only">{CHANNEL_LABEL[c]}</span>
              </span>
            ))}
          </span>
        </div>

        <ul className={styles.lineas}>
          {lineas.map((f) => {
            const [concepto, valor] = partirLinea(f);
            return (
              <li key={f} className={styles.linea} data-linea={concepto}>
                <span>{concepto}</span>
                <span className={styles.guia} aria-hidden />
                <span className={styles.valor}>{valor}</span>
              </li>
            );
          })}
          <li className={styles.linea}>
            <span>Equipo</span>
            <span className={styles.guia} aria-hidden />
            <span className={styles.valor}>{plan.profesionales.replace("Hasta ", "hasta ")}</span>
          </li>
          <li className={styles.linea}>
            <span>Sucursales</span>
            <span className={styles.guia} aria-hidden />
            <span className={styles.valor}>{plan.sucursales.replace(/ sucursal(es)?$/, "")}</span>
          </li>
        </ul>

        <hr className={styles.corte} />

        <div className={`${styles.linea} ${styles.total}`} data-precio>
          <span>Total</span>
          <span className={styles.guia} aria-hidden />
          <span className={styles.monto}>US$ {plan.monthlyUsd}/mes</span>
        </div>

        {pago ? (
          // Enlace pelado: Analytics.tsx cuenta el clic y le pone client_reference_id.
          <a
            href={href}
            suppressHydrationWarning
            data-cta="pago"
            data-plan={plan.id}
            data-plan-name={plan.name}
            data-plan-value={plan.monthlyUsd}
            className={styles.cta}
          >
            {HEX_PAGO_LABEL} · US$ {plan.monthlyUsd}/mes
          </a>
        ) : (
          <a
            href={href}
            suppressHydrationWarning
            data-cta="prueba"
            className={`${styles.cta} ${styles.ctaSecundario}`}
            onClick={() => {
              track("start_trial_click", { plan: plan.id, source_path: "/contrata" });
              trackPixel("StartTrial", { content_name: plan.name, value: 0, currency: "USD" });
            }}
          >
            {PRUEBA_LABEL} con {plan.name}
          </a>
        )}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/agenda/boleta-abajo.webp" alt="" aria-hidden className={styles.papel} width={600} height={70} />
    </article>
  );
}
