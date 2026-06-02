import Link from "next/link";
import styles from "@/app/empleado-digital/empleado-digital.module.css";

const STRIPE_MAX = "https://buy.stripe.com/6oU14pdBn9eGeRdgwz1441n";

const BULLETS = [
  "~1.000 atenciones por texto (WhatsApp/chat) al mes",
  "~120 atenciones por voz (CAMILA) al mes",
  "28.000 créditos IA (consumo técnico)",
  "3 modos de agendamiento (incluye Agentic Flash)",
  "3 modelos IA: Gemini 3.0 Flash · Kimi K2.6 · Gemini 3.5 Flash",
  "Módulo clínico completo (agenda + fichas + Vault)",
  "Multi-sede + panel de atribución",
  "Webhooks + API pública (integraciones a medida)",
  "15 usuarios / profesionales",
  "Empleados digitales: AURA + LIA + CAMILA (voz)",
  "Soporte prioritario · onboarding dedicado",
];

export default function AdvancedCTA() {
  return (
    <section className={styles.ctaSection} aria-labelledby="cta-h2">
      <div className={styles.ctaCard}>
        <span className={styles.ctaBadge}>Recomendado · MAX</span>

        <h2 id="cta-h2" className={styles.ctaH2}>
          Activa tu empleado digital hoy
        </h2>

        <div className={styles.ctaPriceRow}>
          <span className={styles.ctaPrice}>USD 279</span>
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
          href={STRIPE_MAX}
          className={styles.ctaButton}
          data-plan="max"
          data-plan-value="279"
          data-plan-name="MAX signup final empleado-digital"
        >
          Contratar MAX — USD 279/mes
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
          Cancela cuando quieras · Sin permanencia · Pago seguro vía Stripe
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
            data-plan="advanced"
            data-plan-value="179"
            data-plan-name="Advanced view from empleado-digital"
          >
            Ver plan Advanced — USD 179/mes →
          </Link>
          <Link
            href="/planes"
            className={styles.ctaSecondaryLink}
            data-plan="conect"
            data-plan-value="129"
            data-plan-name="Conect view from empleado-digital"
          >
            Ver plan Conect — USD 129/mes →
          </Link>
        </div>
      </div>
    </section>
  );
}
