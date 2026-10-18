import Image from "next/image";
import { CLINICAS_LOGOS, CLINICAS_LOGOS_TITULO } from "@/content/clinicas-logos";
import styles from "./ClinicasLogos.module.css";

// Franja de logos reales, en blanco y negro (Ricardo, 18-oct-2026). Va dentro de
// «Hecho para estética» (home y /clinica-estetica) y en las landings vía `Logos()`.
export default function ClinicasLogos({ enSeccion = false }: { enSeccion?: boolean }) {
  const Tag = enSeccion ? "div" : "section";
  return (
    <Tag className={`${styles.wrap} ${enSeccion ? styles.enSeccion : ""}`} data-clinicas-logos>
      <p className={styles.meta}>{CLINICAS_LOGOS_TITULO}</p>
      <ul className={styles.grid}>
        {CLINICAS_LOGOS.map((c) => (
          <li key={c.src} className={styles.logo}>
            <Image src={c.src} alt={c.alt} width={180} height={64} />
          </li>
        ))}
      </ul>
    </Tag>
  );
}
