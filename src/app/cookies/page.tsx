import type { Metadata } from "next";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";

export const metadata: Metadata = {
  title: "Política de Cookies — Clinera.io",
  description:
    "Cómo usa Clinera.io las cookies en su sitio web: tipos de cookies, finalidades, terceros, base legal y cómo gestionarlas.",
  alternates: { canonical: "https://www.clinera.io/cookies" },
  openGraph: {
    url: "https://www.clinera.io/cookies",
    title: "Política de Cookies — Clinera.io",
    description:
      "Tipos de cookies que usamos, finalidades, terceros y cómo gestionarlas.",
    type: "article",
  },
};

const LAST_UPDATED = "20 de abril de 2026";

export default function CookiesPage() {
  return (
    <>
      <NavV3 />
      <main>
        <section className="section">
          <div className="container" style={{ maxWidth: 820 }}>
            <div style={{ marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: "var(--font-tech)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--brand-cyan)",
                }}
              >
                Legal
              </span>
            </div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--ink-primary)",
                marginBottom: 8,
              }}
            >
              Política de Cookies
            </h1>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--ink-tertiary)",
                marginBottom: 32,
              }}
            >
              Última actualización: {LAST_UPDATED}
            </p>

            <div
              style={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "var(--ink-secondary)",
              }}
            >
              <p style={{ marginBottom: 20 }}>
                Esta política explica qué son las cookies, qué tipos utilizamos
                en Clinera.io, con qué finalidad y cómo puedes configurarlas o
                rechazarlas. Al navegar en clinera.io aceptas el uso de cookies
                según esta política, salvo que las configures de otra forma en
                tu navegador.
              </p>

              <h2 style={h2}>1. ¿Qué son las cookies?</h2>
              <p style={p}>
                Las cookies son pequeños archivos de texto que un sitio web
                guarda en tu dispositivo (computador, tablet o móvil) cuando
                lo visitas. Se usan para recordar preferencias, mantener
                sesiones activas y analizar cómo se utiliza el sitio.
              </p>

              <h2 style={h2}>2. Tipos de cookies que usamos</h2>

              <h3 style={h3}>2.1 Cookies estrictamente necesarias</h3>
              <p style={p}>
                Imprescindibles para el funcionamiento del sitio (por ejemplo,
                mantener la sesión iniciada o recordar el plan elegido durante
                el registro). No se pueden desactivar.
              </p>

              <h3 style={h3}>2.2 Cookies de rendimiento y analítica</h3>
              <p style={p}>
                Nos ayudan a entender cómo los visitantes interactúan con el
                sitio (páginas más visitadas, tiempo de carga, rutas de
                navegación) de forma anónima y agregada. Usamos:
              </p>
              <ul style={ul}>
                <li>Google Analytics 4 (GA4)</li>
                <li>Microsoft Clarity (mapas de calor, grabaciones)</li>
                <li>Google Tag Manager</li>
              </ul>

              <h3 style={h3}>2.3 Cookies de marketing y publicidad</h3>
              <p style={p}>
                Nos permiten medir el rendimiento de campañas publicitarias y
                mostrar anuncios relevantes en otras plataformas. Usamos:
              </p>
              <ul style={ul}>
                <li>Meta Pixel (Facebook e Instagram)</li>
                <li>Google Ads conversion tracking</li>
                <li>TikTok Pixel (cuando aplica)</li>
              </ul>

              <h3 style={h3}>2.4 Cookies funcionales</h3>
              <p style={p}>
                Recuerdan preferencias del usuario, como idioma o región,
                para mejorar la experiencia.
              </p>

              <h2 style={h2}>3. Cookies de terceros</h2>
              <p style={p}>
                Algunas cookies son establecidas por servicios de terceros que
                aparecen en nuestras páginas. Entre ellos:
              </p>
              <ul style={ul}>
                <li>Google (Analytics, Tag Manager, Ads)</li>
                <li>Meta (Facebook, Instagram)</li>
                <li>Microsoft Clarity</li>
                <li>Vimeo (para videos embebidos)</li>
                <li>Stripe (procesamiento de pagos)</li>
                <li>WhatsApp Business API</li>
              </ul>

              <h2 style={h2}>4. Base legal</h2>
              <p style={p}>
                Procesamos datos mediante cookies bajo las siguientes bases
                legales:
              </p>
              <ul style={ul}>
                <li>
                  <strong>Consentimiento</strong> — para cookies analíticas y
                  de marketing.
                </li>
                <li>
                  <strong>Interés legítimo</strong> — para cookies estrictamente
                  necesarias que permiten el funcionamiento del sitio.
                </li>
                <li>
                  <strong>Ejecución de contrato</strong> — cuando eres usuario
                  registrado y necesitamos mantener tu sesión.
                </li>
              </ul>

              <h2 style={h2}>5. ¿Cómo gestionar o desactivar cookies?</h2>
              <p style={p}>
                Puedes aceptar, bloquear o eliminar las cookies instaladas en
                tu dispositivo desde la configuración de tu navegador:
              </p>
              <ul style={ul}>
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
                    Apple Safari
                  </a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
                    Microsoft Edge
                  </a>
                </li>
              </ul>
              <p style={p}>
                Ten en cuenta que si desactivas las cookies estrictamente
                necesarias algunas partes del sitio podrían dejar de funcionar
                correctamente.
              </p>

              <h2 style={h2}>6. Opt-out de publicidad basada en interés</h2>
              <p style={p}>
                Puedes optar por no recibir publicidad personalizada visitando:
              </p>
              <ul style={ul}>
                <li>
                  <a href="https://www.youronlinechoices.com/es/" target="_blank" rel="noopener noreferrer">
                    Your Online Choices (Europa)
                  </a>
                </li>
                <li>
                  <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">
                    Digital Advertising Alliance (EE.UU.)
                  </a>
                </li>
                <li>
                  <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
                    Google Ad Settings
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/settings?tab=ads" target="_blank" rel="noopener noreferrer">
                    Meta Ad Preferences
                  </a>
                </li>
              </ul>

              <h2 style={h2}>7. Transferencias internacionales</h2>
              <p style={p}>
                Algunos proveedores (Google, Meta, Vimeo, Stripe) procesan
                datos en Estados Unidos u otros países. Estas transferencias se
                realizan bajo cláusulas contractuales tipo y marcos de
                privacidad reconocidos por la autoridad competente.
              </p>

              <h2 style={h2}>8. Cambios a esta política</h2>
              <p style={p}>
                Podemos actualizar esta política periódicamente. La versión
                vigente siempre estará publicada en esta URL con la fecha de
                última actualización. Si los cambios son materiales te
                notificaremos por email o mediante un aviso destacado en el
                sitio.
              </p>

              <h2 style={h2}>9. Contacto</h2>
              <p style={p}>
                Si tienes dudas sobre esta política, escríbenos a{" "}
                <a href="mailto:soporte@clinera.io">soporte@clinera.io</a> o
                revisa también nuestra{" "}
                <Link href="/privacidad">Política de Privacidad</Link> y{" "}
                <Link href="/terminos">Términos y Condiciones</Link>.
              </p>

              <div
                style={{
                  marginTop: 48,
                  padding: "20px 24px",
                  background: "var(--surface-1)",
                  borderRadius: 12,
                  border: "1px solid var(--divider-subtle)",
                  fontSize: "0.9rem",
                  color: "var(--ink-tertiary)",
                  textAlign: "center",
                }}
              >
                ¿Quieres conocer Clinera sin compromiso?{" "}
                <Link href="/hablar-con-ventas" style={{ color: "var(--brand-cyan)", fontWeight: 600 }}>
                  Habla con ventas →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterV3 />
    </>
  );
}

const h2 = {
  fontSize: "1.4rem",
  fontWeight: 700,
  color: "var(--ink-primary)",
  marginTop: 36,
  marginBottom: 12,
  letterSpacing: "-0.02em",
} as const;

const h3 = {
  fontSize: "1.1rem",
  fontWeight: 600,
  color: "var(--ink-primary)",
  marginTop: 22,
  marginBottom: 10,
} as const;

const p = {
  marginBottom: 14,
  color: "var(--ink-secondary)",
  lineHeight: 1.7,
} as const;

const ul = {
  margin: "0 0 18px",
  paddingLeft: 24,
  color: "var(--ink-secondary)",
  lineHeight: 1.75,
} as const;
