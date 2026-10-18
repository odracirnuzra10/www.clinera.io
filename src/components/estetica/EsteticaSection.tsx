import Image from "next/image";
import ClinicasLogos from "@/components/clinicas/ClinicasLogos";
import {
  ESTETICA_BLOQUES,
  MODELOS_ESTETICA,
  TRATAMIENTOS_PRECARGADOS,
  type BloqueEstetica,
  type ModeloEsteticaId,
} from "@/content/estetica";
import { CTA_VENTAS_LABEL, CTA_VENTAS_PATH, PLANES } from "@/content/planes";
import styles from "./EsteticaSection.module.css";

// «Hecho para estética»: lo que hace que un dueño de clínica estética vea que
// Clinera le entiende. Se usa en el home y en /clinica-estetica; el copy vive
// en `src/content/estetica.ts`.

const IMAGENES: Partial<Record<BloqueEstetica["id"], { src: string; alt: string }>> = {
  facial: {
    src: "/presentacion/eval-facial.jpg",
    alt: "Evaluación facial en la ficha de Clinera, con tercios faciales y eje de simetría",
  },
  corporal: {
    src: "/presentacion/eval-corporal.jpg",
    alt: "Evaluación corporal en la ficha de Clinera, con abdomen, flancos y muslos marcados",
  },
};

function bloque(id: BloqueEstetica["id"]): BloqueEstetica {
  const b = ESTETICA_BLOQUES.find((x) => x.id === id);
  if (!b) throw new Error(`Falta el bloque de estética «${id}»`);
  return b;
}

function Cuerpo({ b, conPuntos = true }: { b: BloqueEstetica; conPuntos?: boolean }) {
  return (
    <div className={styles.body}>
      <span className={styles.meta}>{b.meta}</span>
      <h3 className={styles.title}>{b.titulo}</h3>
      <p className={styles.text}>{b.texto}</p>
      {conPuntos && (
        <ul className={styles.list}>
          {b.puntos.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TarjetaFicha({ id }: { id: "facial" | "corporal" }) {
  const img = IMAGENES[id]!;
  return (
    <article className={styles.card} data-estetica-bloque={id}>
      <div className={styles.shot}>
        <Image src={img.src} alt={img.alt} fill sizes="(max-width: 900px) 100vw, 600px" />
      </div>
      <Cuerpo b={bloque(id)} />
    </article>
  );
}

function TarjetaPresupuesto() {
  return (
    <article className={styles.card} data-estetica-bloque="presupuesto">
      <div className={styles.shot} aria-hidden>
        <div className={styles.budget}>
          <div className={styles.budgetHead}>
            <span>Presupuesto · plan corporal</span>
            <span className={styles.meta}>Desde la evaluación</span>
          </div>
          <div className={styles.budgetRow}>
            <span>Endoláser · abdomen</span>
            <span>Corporal</span>
          </div>
          <div className={styles.budgetRow}>
            <span>Endoláser · flancos</span>
            <span>Corporal</span>
          </div>
          <div className={styles.budgetRow}>
            <span>Radiesse · contorno mandibular</span>
            <span>Facial</span>
          </div>
          <div className={styles.budgetSent}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Enviado por WhatsApp · pendiente de aprobación
          </div>
        </div>
      </div>
      <Cuerpo b={bloque("presupuesto")} />
    </article>
  );
}

function TarjetaTratamientos() {
  return (
    <article className={styles.card} data-estetica-bloque="tratamientos">
      <div className={styles.shot}>
        <div className={styles.chips}>
          {TRATAMIENTOS_PRECARGADOS.map((t) => (
            <span key={t.nombre} className={styles.chip}>
              {t.nombre}
              <small>{t.zona}</small>
            </span>
          ))}
          <span className={`${styles.chip} ${styles.chipMore}`}>y el resto de tu catálogo</span>
        </div>
      </div>
      <Cuerpo b={bloque("tratamientos")} conPuntos={false} />
    </article>
  );
}

function Modelo({ id, ctaHref }: { id: ModeloEsteticaId; ctaHref: string }) {
  const m = MODELOS_ESTETICA[id];
  // El plan de entrada, como en los anuncios («US$ 89 al mes · hasta 3 profesionales»).
  const entrada = PLANES[0];
  return (
    <figure className={styles.modelo} data-modelo-estetica={id}>
      <div className={styles.modeloFoto}>
        <Image src={m.src} alt={m.alt} fill sizes="(max-width: 900px) 100vw, 520px" />
        <span className={styles.etiqueta}>{m.etiqueta}</span>
        <figcaption className={styles.contador}>
          <b>{m.cifra}</b> {m.contador}
        </figcaption>
      </div>
      <div className={styles.modeloTexto}>
        <span className={styles.meta}>{m.meta}</span>
        <p className={styles.modeloTitulo}>
          {m.titulo} <span className={styles.grad}>{m.acento}</span>
        </p>
        <p className={styles.text}>{m.texto}</p>
        <div className={styles.modeloPrecio}>
          <span className={styles.modeloCur}>US$</span>
          <span className={styles.modeloMonto}>{entrada.monthlyUsd}</span>
        </div>
        <p className={styles.modeloSub}>
          <b>al mes</b> · hasta {entrada.professionals} profesionales
        </p>
        <a className={styles.modeloCta} href={ctaHref} data-cta-ventas={`modelo-${id}`}>
          {CTA_VENTAS_LABEL}
        </a>
      </div>
    </figure>
  );
}

export default function EsteticaSection({
  id = "estetica",
  conLogos = true,
  modelo,
  ctaHref = CTA_VENTAS_PATH,
}: {
  id?: string;
  /** Franja de logos reales (Ricardo, 18-oct-2026: reemplaza a «Lo construimos para nuestras propias clínicas»). */
  conLogos?: boolean;
  /** Foto de la modelo (anuncios de Ricardo): `duena` en el home, `enfermera` en la landing. */
  modelo?: ModeloEsteticaId;
  /** CTA de la foto. En la landing de Ads baja al formulario (`#agenda-demo`). */
  ctaHref?: string;
}) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-h2`}>
      <div className={styles.inner}>
        <span className={styles.meta}>Hecho para estética facial y corporal</span>
        <h2 id={`${id}-h2`} className={styles.h2}>
          Un software que <span className={styles.grad}>entiende tu clínica estética</span>.
        </h2>
        <p className={styles.lead}>
          Fichas facial y corporal, presupuestos y tratamientos ya cargados. Lo que hace tu equipo
          en box queda en el sistema, y AURA lo usa para agendar por WhatsApp.
        </p>

        {modelo && <Modelo id={modelo} ctaHref={ctaHref} />}

        <div className={styles.grid}>
          <TarjetaFicha id="facial" />
          <TarjetaFicha id="corporal" />
          <TarjetaPresupuesto />
          <TarjetaTratamientos />
        </div>

        {conLogos && <ClinicasLogos enSeccion />}
      </div>
    </section>
  );
}
