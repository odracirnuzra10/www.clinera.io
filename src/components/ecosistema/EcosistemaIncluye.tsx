import Link from "next/link";
import { CTA_VENTAS_LABEL, CTA_VENTAS_PATH, MARKETING_BLOQUES, PLANES } from "@/content/planes";
import s from "./EcosistemaIncluye.module.css";

// ============================================================================
// «Qué contratas» (Ricardo, 27-oct-2026): que el cliente vea de una que lo que
// compra es un ecosistema, software + marketing, y no solo un software.
// Va en el home (después de los logos), en /ecosistema y, como franja corta,
// en /funciones (la página de Vortex). Lo de marketing sale de MARKETING_BLOQUES
// y los precios de PLANES (planes.ts): no se escriben a mano acá.
// ============================================================================

const VORTEX = PLANES.find((p) => p.id === "vortex")!;
const ECOSISTEMA = PLANES.find((p) => p.id === "ecosistema")!;

const SOFTWARE = [
  "AURA, una secretaria con IA que responde y agenda por WhatsApp, Instagram y Facebook",
  "Agenda y fichas clínicas de tu clínica",
  "Cobros y pagos en el mismo lugar",
  "Clinera Intelligence: te dice cuánto vendiste y cómo va tu agenda",
  "Automatizaciones y difusiones",
] as const;

const JUNTOS = [
  "La campaña trae al paciente",
  "AURA le responde y lo agenda",
  "La ficha y el cobro quedan en Clinera",
  "Cada semana ajustamos las campañas contigo",
] as const;

export default function EcosistemaIncluye({ conCta = true }: { conCta?: boolean }) {
  return (
    <section className={s.wrap} id="que-incluye" data-ecosistema-incluye>
      <p className={s.eyebrow}>Qué contratas</p>
      <h2 className={s.h2}>
        No es solo un software. <span className={s.grad}>Es un ecosistema: software y marketing.</span>
      </h2>
      <p className={s.bajada}>
        Un equipo de marketing que te trae pacientes y un software con IA que los atiende, los agenda y les cobra. Un
        solo plan y un solo equipo detrás de tu clínica.
      </p>

      <div className={s.piezas}>
        <article className={s.pieza} data-ecosistema-pieza="marketing">
          <p className={s.num}>Pieza 1</p>
          <h3 className={s.h3}>Marketing de performance</h3>
          <p className={s.rol}>Te trae pacientes</p>
          <ul className={s.lista}>
            {MARKETING_BLOQUES.map((b) => (
              <li key={b.id}>{b.titulo}</li>
            ))}
          </ul>
        </article>
        <span className={s.mas} aria-hidden>
          +
        </span>
        <article className={s.pieza} data-ecosistema-pieza="software">
          <p className={s.num}>Pieza 2</p>
          <h3 className={s.h3}>Software con IA</h3>
          <p className={s.rol}>Los atiende, agenda y cobra</p>
          <ul className={s.lista}>
            {SOFTWARE.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className={s.juntos} data-ecosistema-juntos>
        <p className={s.juntosTitulo}>Cómo funcionan juntos</p>
        <ol>
          {JUNTOS.map((t, i) => (
            <li key={t}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {t}
            </li>
          ))}
        </ol>
      </div>

      <p className={s.precio} data-ecosistema-precio>
        <strong>
          Ecosistema: US$ {ECOSISTEMA.monthlyUsd} al mes por las dos piezas
          {ECOSISTEMA.precioNormalUsd ? ` (precio promocional ${ECOSISTEMA.promoHasta}; normal US$ ${ECOSISTEMA.precioNormalUsd})` : ""}.
        </strong>{" "}
        Sin costo de implementación. La inversión en anuncios se paga aparte. ¿Solo el software? Vortex cuesta US${" "}
        {VORTEX.monthlyUsd}.
      </p>
      {conCta ? (
        <div className={s.ctas}>
          <Link href={CTA_VENTAS_PATH} className={s.cta} data-ecosistema-cta>
            {CTA_VENTAS_LABEL}
          </Link>
          <Link href="/planes" className={s.ctaSec}>
            Ver los planes
          </Link>
        </div>
      ) : null}
    </section>
  );
}

/** Franja corta para /funciones: Vortex es la pieza de software del Ecosistema. */
export function EcosistemaFranja() {
  return (
    <aside className={s.franja} data-ecosistema-franja>
      <p>
        <strong>Vortex es la pieza de software del Ecosistema Clinera.</strong> ¿Quieres que además te traigamos
        pacientes? El Ecosistema suma un equipo de marketing de performance: US$ {ECOSISTEMA.monthlyUsd} al mes por
        las dos piezas.
      </p>
      <Link href="/ecosistema#que-incluye" className={s.franjaLink}>
        Ver el Ecosistema →
      </Link>
    </aside>
  );
}
