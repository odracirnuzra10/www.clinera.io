import Image from "next/image";
import Link from "next/link";
import {
  ESTETICA_BLOQUES,
  ESTETICA_ORIGEN,
  TRATAMIENTOS_PRECARGADOS,
  type BloqueEstetica,
} from "@/content/estetica";
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

export default function EsteticaSection({
  id = "estetica",
  conOrigen = true,
}: {
  id?: string;
  /** La historia de Hebe y Lumina. La landing de Ads la muestra aparte. */
  conOrigen?: boolean;
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

        <div className={styles.grid}>
          <TarjetaFicha id="facial" />
          <TarjetaFicha id="corporal" />
          <TarjetaPresupuesto />
          <TarjetaTratamientos />
        </div>

        {conOrigen && (
          <div className={styles.origin}>
            <div>
              <span className={styles.meta}>{ESTETICA_ORIGEN.meta}</span>
              <h3 className={styles.originTitle}>{ESTETICA_ORIGEN.titulo}</h3>
              <p className={styles.text}>{ESTETICA_ORIGEN.texto}</p>
            </div>
            <div className={styles.cases}>
              {ESTETICA_ORIGEN.casos.map((c) => (
                <Link key={c.href} href={c.href} className={styles.case}>
                  {c.nombre}
                  <span>{c.rubro} →</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
