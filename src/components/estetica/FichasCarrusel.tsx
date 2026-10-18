"use client";

// Carrusel «Fichas y presupuestos para tu clínica» (Ricardo, 18-oct-2026):
// ficha médica estándar, ficha estética facial, ficha estética corporal y
// presupuesto. Desliza con el dedo (scroll-snap) o con las flechas; los puntos
// marcan la tarjeta visible. Copy en `src/content/estetica.ts`.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FICHAS_CARRUSEL as F } from "@/content/estetica";
import styles from "./FichasCarrusel.module.css";

type SlideId = (typeof F.slides)[number]["id"];

function Visual({ id }: { id: SlideId }) {
  if (id === "facial" || id === "corporal") {
    const facial = id === "facial";
    return (
      <Image
        src={facial ? "/presentacion/eval-facial.jpg" : "/presentacion/eval-corporal.jpg"}
        alt={
          facial
            ? "Evaluación facial en la ficha de Clinera, con tercios faciales y eje de simetría"
            : "Evaluación corporal en la ficha de Clinera, con abdomen, flancos y muslos marcados"
        }
        fill
        sizes="(max-width: 700px) 90vw, 560px"
      />
    );
  }
  if (id === "medica") {
    return (
      <div className={styles.mock} aria-hidden>
        <div className={styles.mockHead}>
          <span>Ficha médica · Carla R.</span>
          <span className={styles.mockMeta}>Editable</span>
        </div>
        {[
          ["Motivo de consulta", "Arrugas de expresión y pérdida de volumen"],
          ["Antecedentes", "Sin cirugías previas"],
          ["Alergias", "Lidocaína"],
          ["Medicamentos", "Ninguno"],
        ].map(([k, v]) => (
          <div key={k} className={styles.mockRow}>
            <span>{k}</span>
            <b>{v}</b>
          </div>
        ))}
        <div className={styles.mockOk}>✓ Consentimiento informado firmado</div>
      </div>
    );
  }
  return (
    <div className={styles.mock} aria-hidden>
      <div className={styles.mockHead}>
        <span>Presupuesto · plan corporal</span>
        <span className={styles.mockMeta}>Desde la evaluación</span>
      </div>
      {[
        ["Endoláser · abdomen", "Corporal"],
        ["Endoláser · flancos", "Corporal"],
        ["Radiesse · contorno mandibular", "Facial"],
      ].map(([k, v]) => (
        <div key={k} className={styles.mockRow}>
          <span>{k}</span>
          <b>{v}</b>
        </div>
      ))}
      <div className={styles.mockOk}>✓ Enviado por WhatsApp · pendiente de aprobación</div>
    </div>
  );
}

export default function FichasCarrusel() {
  const track = useRef<HTMLDivElement>(null);
  const [activa, setActiva] = useState(0);

  // El punto activo es la tarjeta alineada al inicio del carrusel (en escritorio
  // se ven varias a la vez). Al llegar al final, la última.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const alMover = () => {
      const slides = Array.from(el.querySelectorAll<HTMLElement>("[data-i]"));
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) return setActiva(slides.length - 1);
      let mejor = 0;
      slides.forEach((s, i) => {
        if (Math.abs(s.offsetLeft - el.offsetLeft - el.scrollLeft) < Math.abs(slides[mejor].offsetLeft - el.offsetLeft - el.scrollLeft)) mejor = i;
      });
      setActiva(mejor);
    };
    el.addEventListener("scroll", alMover, { passive: true });
    return () => el.removeEventListener("scroll", alMover);
  }, []);

  function ir(i: number) {
    const el = track.current;
    const slide = el?.querySelector<HTMLElement>(`[data-i="${i}"]`);
    if (el && slide) el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }

  const total = F.slides.length;

  return (
    <section className={styles.section} aria-labelledby="fichas-carrusel-h2" data-fichas-carrusel>
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <span className={styles.meta}>{F.meta}</span>
            <h2 id="fichas-carrusel-h2" className={styles.h2}>
              {F.titulo} <span className={styles.grad}>{F.acento}</span>
            </h2>
          </div>
          <div className={styles.flechas}>
            <button type="button" aria-label="Anterior" onClick={() => ir(Math.max(activa - 1, 0))} disabled={activa === 0}>
              ←
            </button>
            <button type="button" aria-label="Siguiente" onClick={() => ir(Math.min(activa + 1, total - 1))} disabled={activa === total - 1}>
              →
            </button>
          </div>
        </div>

        <div ref={track} className={styles.track} role="region" aria-roledescription="carrusel" aria-label={`${F.titulo} ${F.acento}`}>
          {F.slides.map((s, i) => (
            <article key={s.id} className={styles.slide} data-i={i} data-ficha={s.id} aria-label={`${i + 1} de ${total}: ${s.titulo}`}>
              <div className={styles.visual}>
                <Visual id={s.id} />
              </div>
              <div className={styles.body}>
                <h3>{s.titulo}</h3>
                <p>{s.texto}</p>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.dots}>
          {F.slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Ver ${s.titulo}`}
              aria-current={activa === i || undefined}
              className={activa === i ? styles.dotOn : styles.dot}
              onClick={() => ir(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
