import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Brand column */}
          <div className={styles.footerBrand}>
            <Image
              src="/images/clinera-logo.svg"
              alt="Clinera"
              width={92}
              height={24}
              className={styles.footerLogo}
              unoptimized
            />
            <p className={styles.brandTagline}>
              La IA que atiende, agenda y confirma pacientes por ti. Para
              clínicas que quieren crecer sin contratar más recepción.
            </p>
            <div className={styles.trustPill}>
              <span className={styles.trustDot} aria-hidden />
              +500 médicos · 9 países
            </div>

            <details className={styles.llmResources}>
              <summary className={styles.llmResourcesLabel}>
                Recursos LLM
                <span aria-hidden className={styles.llmResourcesChevron}>▾</span>
              </summary>
              <div className={styles.llmResourcesLinks}>
                <a href="/llms.txt">Leer llms.txt</a>
                <a href="/llms-full.txt">Leer llms-full.txt</a>
              </div>
            </details>
          </div>

          {/* Producto */}
          <div className={styles.footerLinks}>
            <h4>Producto</h4>
            <Link href="/funciones">Funciones</Link>
            <Link href="/planes">Planes</Link>
            <Link href="/novedades">Novedades</Link>
          </div>

          {/* Soporte */}
          <div className={styles.footerLinks}>
            <h4>Soporte</h4>
            <Link href="/ayuda">Centro de ayuda</Link>
            <Link href="/agenda">Agendar videollamada</Link>
          </div>

          {/* Comparativas */}
          <div className={styles.footerLinks}>
            <h4>Comparativas</h4>
            <Link href="/comparativas/reservo">Clinera vs Reservo</Link>
            <Link href="/comparativas/agendapro">Clinera vs AgendaPro</Link>
            <Link href="/comparativas/medilink">Clinera vs Medilink</Link>
            <Link href="/comparativas/manual">Clinera vs Manual</Link>
            <Link href="/comparativas" className={styles.linkAll}>
              Ver todas →
            </Link>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.footerBottomLeft}>
            © 2026 Clinera.io · Todos los derechos reservados
          </div>
          <div className={styles.footerBottomCenter}>
            <Link href="/terminos">Términos</Link>
            <span aria-hidden className={styles.legalDot}>·</span>
            <Link href="/privacidad">Privacidad</Link>
            <span aria-hidden className={styles.legalDot}>·</span>
            <Link href="/cookies">Cookies</Link>
          </div>
          <div className={styles.socialIcons}>
            <a
              href="https://cl.linkedin.com/company/clinera-io"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={styles.socialBtn}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/clinera.io"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={styles.socialBtn}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/channel/UCl4Bh9sNp22PjJuSLgz9ZsQ"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className={styles.socialBtn}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.3 31.3 0 000 12a31.3 31.3 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.3 31.3 0 0024 12a31.3 31.3 0 00-.5-5.8zM9.75 15.57V8.43L15.82 12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
