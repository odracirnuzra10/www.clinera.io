"use client";

// «Boleta» de lo que se ahorra con el Ecosistema (Ricardo, 19-oct-2026): una boleta de
// gastos minimalista, con poco espacio y sin apiñar, bajo las tarjetas de planes. La
// pinta `PlanesVigentes` (home, /planes). Los números viven en `AHORRO` (planes.ts) y
// son estimados de mercado. La presentación (`public/presentacion`) tiene su propia
// copia en HTML, porque no importa TS.
//
// Está hecha en código y no como imagen generada: así los números salen nítidos, se
// pueden leer con lector de pantalla y cambian en un solo lugar.

import { AHORRO } from "@/content/planes";
import styles from "./AhorroEcosistema.module.css";

export default function AhorroEcosistema() {
  return (
    <div className={styles.bol} data-ahorro>
      <div className={styles.titulo}>{AHORRO.titulo}</div>

      <ul className={styles.lineas}>
        {AHORRO.items.map((it) => (
          <li key={it.id} className={styles.linea} data-ahorro-item={it.id}>
            <span className={styles.nombre}>
              {it.etiqueta}
              <small>{it.nota}</small>
            </span>
            <span className={styles.guia} aria-hidden />
            <span className={styles.precio}>{it.precio}</span>
          </li>
        ))}
      </ul>

      <hr className={styles.corte} />

      <div className={`${styles.linea} ${styles.separado}`}>
        <span className={styles.nombre}>{AHORRO.separado.etiqueta}</span>
        <span className={styles.guia} aria-hidden />
        <span className={styles.precio}>{AHORRO.separado.precio}</span>
      </div>

      <div className={`${styles.linea} ${styles.eco}`} data-ahorro-conclusion>
        <span className={styles.nombre}>{AHORRO.ecosistema.etiqueta}</span>
        <span className={styles.guia} aria-hidden />
        <span className={styles.precio}>{AHORRO.ecosistema.precio}</span>
      </div>

      <p className={styles.ahorro}>{AHORRO.ahorro}</p>
      <p className={styles.nota}>{AHORRO.nota}</p>
    </div>
  );
}
