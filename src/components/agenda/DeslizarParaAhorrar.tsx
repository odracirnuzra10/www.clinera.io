"use client";

// Botón deslizante «Desliza para ahorrar» (Ricardo, 19-oct-2026): el visitante arrastra la
// perilla hasta el final para pasar del paso 1 (la boleta) al de los datos. Una animación
// (la perilla se asoma hacia la derecha y las flechas parpadean) le muestra que debe
// deslizar. Accesible: la perilla es un `slider` y se completa con teclado (flecha derecha,
// Enter o Espacio). Con «reducir movimiento» no hay animación.

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import styles from "./DeslizarParaAhorrar.module.css";

const UMBRAL = 0.82; // fracción del recorrido para dar por hecho el deslizar

export type OrigenPum = { x: number; y: number };

export default function DeslizarParaAhorrar({
  onComplete,
  etiqueta = "Desliza para ahorrar",
}: {
  /** Se llama al llegar al final, con el punto de la pantalla donde quedó la perilla (para el efecto «pum»). */
  onComplete: (origen: OrigenPum) => void;
  etiqueta?: string;
}) {
  const pista = useRef<HTMLDivElement>(null);
  const perilla = useRef<HTMLButtonElement>(null);
  const inicio = useRef<{ px: number; x0: number } | null>(null);
  const [x, setX] = useState(0);
  const [arrastrando, setArrastrando] = useState(false);
  const [tocado, setTocado] = useState(false); // ya interactuó: se apaga la animación de aviso
  const [listo, setListo] = useState(false);

  const maximo = () => {
    const p = pista.current;
    const t = perilla.current;
    if (!p || !t) return 0;
    return Math.max(0, p.clientWidth - t.offsetWidth - 8);
  };

  function completar() {
    if (listo) return;
    setListo(true);
    const fin = maximo();
    setX(fin);
    // Donde termina la perilla: de ahí sale el «pum» (el rect actual es el de la posición de inicio).
    const r = perilla.current?.getBoundingClientRect();
    const origen: OrigenPum = r
      ? { x: r.left + (fin - x) + r.width / 2, y: r.top + r.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    window.setTimeout(() => onComplete(origen), 200);
  }

  function alBajar(e: PointerEvent<HTMLButtonElement>) {
    if (listo) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    inicio.current = { px: e.clientX, x0: x };
    setArrastrando(true);
    setTocado(true);
  }

  function alMover(e: PointerEvent<HTMLButtonElement>) {
    if (!inicio.current) return;
    const nuevo = Math.min(maximo(), Math.max(0, inicio.current.x0 + e.clientX - inicio.current.px));
    setX(nuevo);
  }

  function alSoltar() {
    if (!inicio.current) return;
    inicio.current = null;
    setArrastrando(false);
    const m = maximo();
    if (m > 0 && x / m >= UMBRAL) completar();
    else setX(0);
  }

  function alTeclear(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
      e.preventDefault();
      setTocado(true);
      completar();
    }
  }

  const m = maximo();
  const avance = m > 0 ? x / m : 0;

  return (
    <div
      ref={pista}
      className={`${styles.pista} ${tocado ? "" : styles.aviso} ${listo ? styles.listo : ""}`}
      data-quiero-ahorrar
      style={{ ["--avance" as string]: avance }}
    >
      <span className={styles.relleno} aria-hidden style={{ width: `calc(${x}px + 52px)` }} />
      <span className={styles.texto} aria-hidden>
        <span className={styles.etiqueta}>{etiqueta}</span>
        <span className={styles.flechas}>
          <i>›</i>
          <i>›</i>
          <i>›</i>
        </span>
      </span>
      <button
        ref={perilla}
        type="button"
        role="slider"
        aria-label={`${etiqueta}: arrastra hacia la derecha`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(avance * 100)}
        className={`${styles.perilla} ${arrastrando ? styles.arrastrando : ""}`}
        style={{ transform: `translateX(${x}px)` }}
        onPointerDown={alBajar}
        onPointerMove={alMover}
        onPointerUp={alSoltar}
        onPointerCancel={alSoltar}
        onKeyDown={alTeclear}
        data-perilla
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
