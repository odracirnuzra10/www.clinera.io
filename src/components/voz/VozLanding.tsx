"use client";

import Link from "next/link";
import { Eyebrow, Wordmark } from "@/components/brand-v3/Brand";
import CtaPar from "@/components/cta/CtaPar";
import { VOZ_CASOS } from "@/content/voz-casos";
import styles from "./VozLanding.module.css";

export default function VozLanding() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.glow} aria-hidden />
        <div className={styles.contenido}>
          <div className={styles.marca}>
            <Link href="/" aria-label="Clinera">
              <Wordmark size={24} />
            </Link>
          </div>
          <Eyebrow>Casos de voz · llamadas reales</Eyebrow>
          <h1 className={styles.h1}>Así suena la IA que llama a tus pacientes y les agenda la hora</h1>
          <p className={styles.bajada}>
            Tres llamadas reales de nuestra red de clínicas. La IA llama al paciente que dejó sus datos,
            responde sus dudas y le deja la cita agendada.
          </p>
        </div>
      </section>

      <section className={styles.casos} data-voz-casos>
        {VOZ_CASOS.map((c, i) => (
          <article key={c.id} className={styles.caso} data-voz-caso={c.id}>
            <div className={styles.cabeza}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <h2 className={styles.titulo}>{c.titulo}</h2>
              <span className={styles.dur}>{c.duracion}</span>
            </div>
            <p className={styles.resumen}>{c.resumen}</p>
            <audio className={styles.audio} controls preload="none" src={c.audio}>
              Tu navegador no reproduce audio.
            </audio>
          </article>
        ))}
      </section>

      <section className={styles.cierre}>
        <p className={styles.cierreTexto}>Pruébalo en tu clínica, 7 días gratis.</p>
        <CtaPar centrado />
      </section>
    </main>
  );
}
