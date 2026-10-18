"use client";

// Cupón con forma de ticket (talón con el código, muescas laterales, línea de
// corte) y botón «Copiar código» (Ricardo, 18-oct-2026: «que tenga forma de
// cupón y botón para copiar»). Lo usan CuponBanner (/planes, /clinica-estetica)
// y el wizard de /activar-cuenta.

import { useState, type ReactNode } from "react";
import { CUPON } from "@/content/agenda-oferta";
import styles from "./CuponTicket.module.css";

export default function CuponTicket({
  children,
  grande = false,
  style,
}: {
  /** Texto a la derecha del talón (condiciones, vencimiento, enlace). */
  children?: ReactNode;
  grande?: boolean;
  style?: React.CSSProperties;
}) {
  const [copiado, setCopiado] = useState(false);
  return (
    <div
      className={`${styles.ticket} ${grande ? styles.grande : ""}`}
      data-cupon={CUPON.codigo}
      data-cupon-grande={grande || undefined}
      style={style}
    >
      <div className={styles.talon}>
        <span className={styles.off}>{CUPON.descuentoPct}% OFF · 1er mes</span>
        <span className={styles.codigo}>{CUPON.codigo}</span>
      </div>
      <div className={styles.cuerpo}>
        {children}
        <button
          type="button"
          className={styles.copiar}
          onClick={() => {
            void navigator.clipboard?.writeText(CUPON.codigo).then(() => setCopiado(true));
          }}
        >
          {copiado ? "¡Copiado!" : "Copiar código"}
        </button>
      </div>
    </div>
  );
}
