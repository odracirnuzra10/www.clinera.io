// Planes con prueba gratis (Ricardo, 7-nov-2026): Flux · Hex · Xcale. Lo usan /planes y el home.
// Cada tarjeta invita a «Regístrate gratis» (/contrata). Xcale además ofrece pagar altiro con su
// Payment Link: enlace pelado con data-plan*, sin onClick (AGENTS.md, «El clic a buy.stripe.com»).

import { ChannelLogo, CHANNEL_LABEL } from "@/components/pricing/PlanChannelLogos";
import CtaPar, { CtaRegistro } from "@/components/cta/CtaPar";
import {
  ADICIONALES_NOTA,
  ADICIONALES_TRIAL,
  AGENTE_IA,
  MODELOS_IA,
  PLANES_TRIAL,
  RECOMENDADO,
  TRIAL_BAJADA,
  TRIAL_EYEBROW,
  TRIAL_TITULO,
  XCALE_PAGO_LABEL,
} from "@/content/planes-trial";
import s from "./PlanesTrial.module.css";

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
                  {XCALE_PAGO_LABEL} · US$ {p.monthlyUsd}/mes
                </a>
              ) : null}
            </article>
          ))}
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
