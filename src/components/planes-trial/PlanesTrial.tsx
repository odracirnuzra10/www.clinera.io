// Planes con prueba gratis (Ricardo, 7-nov-2026): Flux · Hex · Xcale. Lo usan /planes y el home.
// Cada tarjeta invita a «Regístrate gratis» (/contrata). Xcale además ofrece pagar altiro con su
// Payment Link: enlace pelado con data-plan*, sin onClick (AGENTS.md, «El clic a buy.stripe.com»).

import type { ReactNode } from "react";
import { ChannelLogo, CHANNEL_LABEL } from "@/components/pricing/PlanChannelLogos";
import CtaPar, { CtaRegistro } from "@/components/cta/CtaPar";
import {
  ADICIONALES_NOTA,
  ADICIONALES_TRIAL,
  INCLUIDO_TITULO,
  INCLUIDO_TODOS,
  AGENTE_IA,
  MODELOS_IA,
  PLANES_TRIAL,
  RECOMENDADO,
  TRIAL_BAJADA,
  TRIAL_EYEBROW,
  TRIAL_TITULO,
  pagoLabel,
} from "@/content/planes-trial";
import s from "./PlanesTrial.module.css";

// Íconos de línea, un solo color (azul médico). Sin librería: son cuatro.
const ICONOS: Record<string, ReactNode> = {
  agenda: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4M8 13h3M8 16.5h6" />
    </>
  ),
  fichas: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
      <path d="M9 3.5h6v2.5H9zM12 10v5M9.5 12.5h5M9 18h6" />
    </>
  ),
  recetas: (
    <>
      <path d="M6 3.5h9l3 3V20.5H6z" />
      <path d="M9 9h2.5a2 2 0 010 4H9V9zm0 4v4M11.5 13l3 4" />
    </>
  ),
  consentimientos: (
    <>
      <path d="M6 3.5h12v17H6z" />
      <path d="M9 8h6M9 11h6M9 17c1.2-1.6 2-1.6 2.6 0 .5 1.2 1.3 1.2 2.4-.4" />
    </>
  ),
};

export default function PlanesTrial({
  h1 = false,
  id = "planes",
  ctaTexto,
}: {
  h1?: boolean;
  id?: string;
  /** Texto del botón de cada tarjeta. El home usa «Pruébalo gratis 7 días» (12-nov-2026). */
  ctaTexto?: string;
}) {
  const Titulo = h1 ? "h1" : "h2";
  return (
    <section className={s.seccion} id={id} data-planes-trial aria-labelledby={`${id}-titulo`}>
      <div className={s.wrap}>
        <p className={s.eyebrow}>{TRIAL_EYEBROW}</p>
        <Titulo id={`${id}-titulo`} className={s.titulo}>
          {TRIAL_TITULO}
        </Titulo>
        <p className={s.bajada}>{TRIAL_BAJADA}</p>
        <div className={s.planes}>
          {PLANES_TRIAL.map((p) => (
            <article key={p.id} className={p.destacado ? `${s.card} ${s.destacado}` : s.card} data-plan-card={p.id}>
              <div className={s.cabeza}>
                <h3 className={s.nombre}>{p.name}</h3>
                {p.destacado ? <span className={s.badge}>{RECOMENDADO}</span> : null}
              </div>
              <p className={s.etiqueta}>{p.etiqueta}</p>
              <p className={s.precio}>
                <b>US$ {p.monthlyUsd}</b> <span>/mes</span>
              </p>
              <ul className={s.base} data-incluido-card aria-label={INCLUIDO_TITULO}>
                {INCLUIDO_TODOS.map((f) => (
                  <li key={f.id}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {ICONOS[f.id]}
                    </svg>
                    {f.titulo}
                  </li>
                ))}
              </ul>
              <ul className={s.lista}>
                {p.incluye.map((x) =>
                  x === AGENTE_IA ? (
                    <li key={x} className={s.agente}>
                      <span>{x}</span>
                      <span className={s.modelos} data-modelos-ia>
                        {MODELOS_IA.map((m) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={m.id} src={m.src} alt={m.label} title={m.label} width={18} height={18} />
                        ))}
                      </span>
                    </li>
                  ) : (
                    <li key={x}>{x}</li>
                  ),
                )}
              </ul>
              <p className={s.canales} data-canales aria-label={p.canales.map((c) => CHANNEL_LABEL[c]).join(", ")}>
                {p.canales.map((c) => (
                  <ChannelLogo key={c} channel={c} size={20} />
                ))}
              </p>
              <CtaRegistro className={s.cta} texto={ctaTexto} datos={{ "data-cta": "registro", "data-plan-elegido": p.id }} />
              {p.pagoUrl ? (
                <a
                  className={s.pago}
                  href={p.pagoUrl}
                  data-plan={p.id}
                  data-plan-name={p.name}
                  data-plan-value={p.monthlyUsd}
                  suppressHydrationWarning
                >
                  {pagoLabel(p.name)} · US$ {p.monthlyUsd}/mes
                </a>
              ) : null}
            </article>
          ))}
        </div>
        <div className={s.incluido} data-incluido-todos>
          <h3>{INCLUIDO_TITULO}</h3>
          <ul>
            {INCLUIDO_TODOS.map((f) => (
              <li key={f.id} data-incluido={f.id}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {ICONOS[f.id]}
                </svg>
                <div>
                  <b>{f.titulo}</b>
                  <span>{f.texto}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={s.sumas} data-adicionales>
          <h3>Puedes sumar</h3>
          <p>{ADICIONALES_NOTA}</p>
          <ul>
            {ADICIONALES_TRIAL.map((a) => (
              <li key={a.label}>
                <b>{a.precio}</b>
                <span>{a.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <CtaPar centrado style={{ marginTop: 32 }} />
      </div>
    </section>
  );
}
