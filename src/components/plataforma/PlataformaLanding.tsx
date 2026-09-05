import Image from "next/image";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { CnnLogo } from "@/components/brand-v3/Brand";
import AuraNetwork from "./AuraNetwork";
import CtaLink from "./CtaLink";
import HeroCarousel from "./HeroCarousel";
import PlanesSection from "./PlanesSection";
import styles from "./PlataformaLanding.module.css";

const CLIENTS = [
  { src: "/presentacion/clientes/andes.png", alt: "Andes Salud" },
  { src: "/presentacion/clientes/everest.png", alt: "Everest Clínicas Dentales" },
  { src: "/presentacion/clientes/sanatorio.png", alt: "Sanatorio Alemán" },
  { src: "/presentacion/clientes/sonrie.png", alt: "Sonríe" },
  { src: "/presentacion/clientes/lumina.png", alt: "Lumina Clínica Facial" },
  { src: "/presentacion/clientes/hebe.png", alt: "Método Hebe" },
];

const PARTNERS = [
  { src: "/images/badges/meta-business-partner.svg", alt: "Meta Business Partner" },
  { src: "/images/badges/whatsapp-business.svg", alt: "WhatsApp Business API oficial" },
  { src: "/images/badges/stripe.svg", alt: "Stripe" },
  { src: "/images/badges/google-calendar.svg", alt: "Google Calendar" },
];

const MIGRATION_STEPS = [
  { number: "01", title: "Migramos", copy: "Pacientes, agendas y datos históricos desde tu sistema actual." },
  { number: "02", title: "Configuramos", copy: "Sedes, roles, precios, protocolos y automatizaciones." },
  { number: "03", title: "Capacitamos", copy: "Al equipo operativo y a quienes necesitan control gerencial." },
  { number: "04", title: "Entregamos", copy: "Validamos contigo y activamos una operación lista para trabajar." },
];

export const FAQ = [
  {
    q: "¿Se integra con Reservo, AgendaPro o Medilink?",
    a: "No. Clinera opera sobre su propia agenda, ficha clínica y módulo de pagos — por eso migramos tus datos en el onboarding en vez de sincronizar dos sistemas. Para conectar otras herramientas tienes Webhooks y API pública (n8n, Make, Zapier) en los planes Atlas y Summit.",
  },
  {
    q: "¿Qué pasa con el software que usamos hoy y cómo validan la migración?",
    a: "Revisamos tu sistema actual y definimos qué se migra antes de intervenir la operación. Mapeamos los datos, hacemos controles de integridad y validamos contigo las excepciones antes de la entrega.",
  },
  {
    q: "¿Cuánto demora la implementación y cuánto cuesta?",
    a: "Depende del volumen de datos, las sedes y las integraciones; el alcance y el calendario quedan definidos antes de comenzar. La implementación tiene un costo único de USD 450 en mensual; en semestral y anual va incluida sin costo.",
  },
  {
    q: "¿Hay permanencia?",
    a: "Sí. Todos los planes tienen una permanencia mínima de 6 meses. Puedes pagar mes a mes, anticipar el semestre con 20% de descuento, o anticipar el año con 20% de descuento y la implementación de USD 450 incluida sin costo.",
  },
  {
    q: "¿Cómo protegen los datos de los pacientes?",
    a: "Datos aislados por clínica, cifrado AES-256-GCM con Cloud KMS, accesos registrados, backups con point-in-time recovery y operación conforme a la Ley 20.584.",
  },
];

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="none">
      <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="17" height="17" fill="none">
      <path d="m5 10 3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Para clínicas con equipo, alto volumen o varias sedes</span>
          <h1>
            Todas las operaciones de tu clínica, bajo un mismo sistema operativo con IA.
            <span>Clinera O.S.</span>
          </h1>
          <strong className={styles.enterpriseThesis}>
            Mucho más que un chatbot: el sistema por el que opera tu clínica, con la potencia
            enterprise de las clínicas grandes al alcance de la tuya.
          </strong>
          <p>
            Migramos tus datos, configuramos la operación y capacitamos a tu equipo.
          </p>
          <div className={styles.heroActions}>
            <CtaLink href="/agenda" id="hero-demo" location="hero" className={styles.primaryCta}>
              Agendar demo de 30 min
              <Arrow />
            </CtaLink>
            <CtaLink href="#precios" id="hero-planes" location="hero" className={styles.secondaryCta}>
              Ver planes y precios
            </CtaLink>
          </div>
          <div className={styles.proofLine} aria-label="Cifras de Clinera">
            <span><strong>+52</strong> clínicas activas</span>
            <i />
            <span><strong>+500</strong> profesionales</span>
            <i />
            <span><strong>10</strong> países</span>
          </div>
        </div>
        <div className={styles.heroProduct}>
          <span className={styles.productLabel}>Una sola plataforma · multi-sede por diseño</span>
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}

function ClientProof() {
  return (
    <section className={styles.clientProof} aria-label="Clínicas que operan con Clinera">
      <div className={styles.clientProofInner}>
        <span>Clínicas que ya operan con Clinera</span>
        <div className={styles.clientLogos}>
          {CLIENTS.map((client) => (
            <div key={client.src} className={styles.clientLogo}>
              <Image src={client.src} alt={client.alt} width={180} height={64} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CustomerResult() {
  return (
    <section className={styles.resultSection}>
      <div className={styles.resultGrid}>
        <div className={styles.resultNumber}>
          <span>Promedio sobre 52 clínicas activas · abril 2026</span>
          <strong>−73%</strong>
          <p>en no-shows, comparando los 90 días previos y posteriores a Clinera</p>
        </div>
        <figure className={styles.testimonial}>
          <blockquote>“Clinera me permite crecer sin pagar de más.”</blockquote>
          <figcaption>
            <Image src="/images/testimonials/flavio-rojas.jpeg" alt="Dr. Flavio Rojas" width={56} height={56} />
            <span>
              <strong>Dr. Flavio Rojas</strong>
              <small>Fundador · infiltracion.cl</small>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function PressCNN() {
  return (
    <section className={styles.pressSection} aria-labelledby="cnn-title">
      <div className={styles.pressCard}>
        <div className={styles.pressCopy}>
          <span className={styles.pressEyebrow}>Clinera en la prensa</span>
          <CnnLogo height={36} color="#F03A47" />
          <h2 id="cnn-title">Un gran paso para Clinera.</h2>
          <p>
            CNN conoció cómo estamos construyendo la infraestructura que ayuda a las clínicas de LATAM a
            crecer con más control, automatización e inteligencia.
          </p>
          <div className={styles.pressLinks}>
            <Link href="/prensa">Ver cobertura y prensa <Arrow /></Link>
          </div>
        </div>

        <div className={styles.pressVideo}>
          <iframe
            src="https://player.vimeo.com/video/1205127087?badge=0&autopause=0&player_id=0&app_id=58479"
            title="Reportaje de CNN sobre Clinera"
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

function Migration() {
  return (
    <section id="migracion" className={styles.migrationSection}>
      <div className={styles.container}>
        <div className={styles.migrationHeading}>
          <div>
            <span className={styles.eyebrow}>Implementación gestionada</span>
            <h2>Cambiar de sistema no tiene que paralizar tu clínica.</h2>
          </div>
          <div>
            <p>
              Nos hacemos cargo del cambio: migración validada, configuración, capacitación y entrega con
              interrupción mínima.
            </p>
            <Link href="/migracion" className={styles.textLink}>Ver proceso de migración <Arrow /></Link>
          </div>
        </div>

        <ol className={styles.migrationSteps}>
          {MIGRATION_STEPS.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </li>
          ))}
        </ol>

        <div className={styles.securityStrip}>
          <div>
            <span className={styles.securityIcon}><Check /></span>
            <span><strong>Seguridad y trazabilidad</strong><small>Datos aislados por clínica y accesos registrados.</small></span>
          </div>
          <ul>
            <li>AES-256-GCM</li>
            <li>Cloud KMS</li>
            <li>Ley 20.584</li>
            <li>Backups + PITR</li>
          </ul>
        </div>

        {/* La franja de partners vivía en su propia sección; aquí cierra la de
            infraestructura sin sumar otro bloque de página. */}
        <div className={styles.partnerRow}>
          <span>Opera sobre herramientas oficiales</span>
          <div className={styles.partnerLogos}>
            {PARTNERS.map((partner) => (
              <Image key={partner.src} src={partner.src} alt={partner.alt} width={132} height={40} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FrequentlyAsked() {
  return (
    <section className={styles.faqSection}>
      <div className={styles.faqGrid}>
        <div>
          <span className={styles.eyebrow}>Antes de cambiar</span>
          <h2>Las preguntas que importan.</h2>
          <p>El producto importa. La continuidad de tu clínica también.</p>
        </div>
        <div className={styles.faqList}>
          {FAQ.map((item) => (
            <details key={item.q}>
              <summary>{item.q}<span aria-hidden="true">+</span></summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className={styles.finalCta}>
      <div className={styles.finalCtaInner}>
        <span className={styles.finalEyebrow}>IA enterprise para clínicas medianas</span>
        <h2>Te mostramos tu clínica dentro de Clinera.</h2>
        <p>En 30 minutos, con tus sedes, tu equipo y tus procesos reales.</p>
        <CtaLink href="/agenda" id="final-demo" location="cierre" className={styles.finalButton}>
          Agendar demo de 30 min <Arrow />
        </CtaLink>
        <div className={styles.finalMeta}>
          <span>Desde USD 279/mes</span>
          <i />
          <span>Anual: 20% OFF + implementación gratis</span>
          <i />
          <span>Permanencia mínima: 6 meses</span>
          <i />
          <span>Migración gestionada</span>
        </div>
      </div>
    </section>
  );
}

export default function PlataformaLanding() {
  return (
    <>
      <NavV3 ctaHref="/agenda" />
      <div className={styles.page}>
        <Hero />
        <ClientProof />
        <AuraNetwork />
        <CustomerResult />
        <PressCNN />
        <Migration />
        <PlanesSection />
        <FrequentlyAsked />
        <FinalCta />
      </div>
      <FooterV3 />
    </>
  );
}
