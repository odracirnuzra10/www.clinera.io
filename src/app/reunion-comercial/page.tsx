import type { Metadata } from "next";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import CalEmbed from "../reunion/CalEmbed";
import styles from "../reunion/reunion.module.css";

export const metadata: Metadata = {
  title: "Reunión comercial — Clinera.io",
  description:
    "Agenda una reunión comercial de 30 minutos con el equipo de Clinera.io. Te mostramos cómo nuestra IA puede responder en WhatsApp, agendar y cobrar por tu clínica.",
  alternates: { canonical: "https://www.clinera.io/reunion-comercial" },
  openGraph: {
    title: "Reunión comercial — Clinera.io",
    description:
      "30 min con el equipo comercial de Clinera. Elige tu horario.",
    url: "https://www.clinera.io/reunion-comercial",
    type: "website",
  },
};

export default function ReunionComercialPage() {
  return (
    <>
      <NavV3 />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.eyebrow}>
              <span className={styles.dot} />
              Reunión comercial · 30 minutos
            </div>
            <h1 className={styles.title}>
              Agenda una <span className={styles.accent}>reunión comercial</span>
            </h1>
            <p className={styles.subtitle}>
              Elige el día y hora que mejor te acomode. Un especialista te mostrará
              cómo Clinera puede responder WhatsApp, agendar y cobrar por tu clínica.
            </p>
          </div>
        </section>
        <section className={styles.calWrap}>
          <CalEmbed />
        </section>
      </main>
      <FooterV3 />
    </>
  );
}
