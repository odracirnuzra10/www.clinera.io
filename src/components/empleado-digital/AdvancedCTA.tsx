"use client";

import CtaPar from "@/components/cta/CtaPar";

import Link from "next/link";
import styles from "@/app/empleado-digital/empleado-digital.module.css";
import { VERTEX_IA_MODELS_PROSE } from "@/content/ia-stack";
import { CTA_VENTAS_LABEL, CTA_VENTAS_PATH, IMPLEMENTACION_LINEA, PLANES, PLAN_IA_DESDE } from "@/content/planes";

// Cierre de /empleado-digital con el modelo vigente (Ricardo, 18-oct-2026): dos
// opciones, Vortex y Ecosistema, y un solo CTA a /hablar-con-ventas.
const BULLETS = [
  `Hasta ${PLAN_IA_DESDE.professionals} profesionales · ${PLAN_IA_DESDE.iaCredits.toLocaleString("es-CL")} créditos de IA al mes`,
  "Agente AURA: responde por WhatsApp, Instagram y Facebook y agenda sola dentro del chat",
  `Modelos orquestadores de tools: ${VERTEX_IA_MODELS_PROSE} (Vertex AI)`,
  "Módulo clínico completo (agenda + fichas + Vault)",
  "Webhooks + API pública (integraciones a medida)",
  "Onboarding asistido por una persona",
];

export default function AdvancedCTA() {
  const [vortex, ecosistema] = PLANES;
  return (
    <section className={styles.ctaSection} aria-labelledby="cta-h2">
      <div className={styles.ctaCard}>
        <span className={styles.ctaBadge}>Recomendado · {ecosistema.name}</span>

        <h2 id="cta-h2" className={styles.ctaH2}>
          Pon a tu clínica a trabajar con IA
        </h2>

        <div className={styles.ctaPriceRow}>
          <span className={styles.ctaPrice}>US$ {vortex.monthlyUsd}</span>
          <span className={styles.ctaPriceUnit}>/ mes · {vortex.name}</span>
        </div>
        <p className={styles.ctaTrust}>
          o US$ {ecosistema.monthlyUsd}/mes con {ecosistema.name}, que suma marketing de performance para traerte pacientes
        </p>

        <ul className={styles.ctaBullets}>
          {BULLETS.map((b) => (
            <li key={b} className={styles.ctaBullet}>
              {b}
            </li>
          ))}
        </ul>

        {/* Ricardo, 4-nov-2026: los dos CTA del sitio. */}
        <CtaPar centrado />

        <p className={styles.ctaTrust}>{IMPLEMENTACION_LINEA}</p>


        <div className={styles.ctaSecondaryLinks}>
          <Link href="/planes" className={styles.ctaSecondaryLink}>
            Ver las dos opciones →
          </Link>
        </div>
      </div>
    </section>
  );
}
