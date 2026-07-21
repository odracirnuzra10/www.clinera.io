import Link from "next/link";
import styles from "@/app/empleado-digital/empleado-digital.module.css";

const STRIPE_SUMMIT = "https://buy.stripe.com/5kQ6oJbtf3UmdN94NR1441w";

const BULLETS = [
  "46.000 créditos / mes · bolsa mensual de IA",
  "Una sola bolsa para texto, voz y agendamiento",
  "3 empleados digitales: AURA (texto) + CAMILA (voz) + LIA (fiscaliza)",
  "3 modos de agendamiento (incluye Agentic Pro)",
  "3 modelos IA: Gemini 3.0 Flash · Kimi K2.6 · Gemini 3.5 Flash",
  "Módulo clínico completo (agenda + fichas + Vault)",
  "Sucursales ilimitadas + panel de atribución",
  "Webhooks + API pública (integraciones a medida)",
  "25 usuarios / profesionales",
  "Soporte prioritario · onboarding dedicado",
];

export default function AdvancedCTA() {
  return (
    <section className={styles.ctaSection} aria-labelledby="cta-h2">
      <div className={styles.ctaCard}>
        <span className={styles.ctaBadge}>Recomendado · Summit</span>

        <h2 id="cta-h2" className={styles.ctaH2}>
          Activa tu empleado digital hoy
        </h2>

        <div className={styles.ctaPriceRow}>
          <span className={styles.ctaPrice}>USD 479</span>
          <span className={styles.ctaPriceUnit}>/ mes</span>
        </div>

        <ul className={styles.ctaBullets}>
          {BULLETS.map((b) => (
            <li key={b} className={styles.ctaBullet}>
              {b}
            </li>
          ))}
        </ul>

        <a
          href={STRIPE_SUMMIT}
          className={styles.ctaButton}
          data-plan="summit"
          data-plan-value="479"
          data-plan-name="Summit signup final empleado-digital"
        >
          Contratar Summit — USD 479/mes
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        <p className={styles.ctaTrust}>
          Implementación USD 450 pago único · Cancela cuando quieras · Pago seguro vía Stripe
        </p>

        <Link href="/demo" className={styles.ctaDemoLink}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          Ver demo en video — 2 min
        </Link>

        <div className={styles.ctaSecondaryLinks}>
          <Link
            href="/planes"
            className={styles.ctaSecondaryLink}
            data-plan="atlas"
            data-plan-value="379"
            data-plan-name="Atlas view from empleado-digital"
          >
            Ver plan Atlas — USD 379/mes →
          </Link>
          <Link
            href="/planes"
            className={styles.ctaSecondaryLink}
            data-plan="vortex"
            data-plan-value="279"
            data-plan-name="Vortex view from empleado-digital"
          >
            Ver plan Vortex — USD 279/mes →
          </Link>
        </div>
      </div>
    </section>
  );
}
