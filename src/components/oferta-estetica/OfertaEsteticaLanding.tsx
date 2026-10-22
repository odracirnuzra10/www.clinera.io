"use client";

// /oferta-clinicas-esteticas (Ricardo, 22-oct-2026): landing de anuncios para dueños de
// clínicas estéticas. Muestra las funciones de Clinera y cierra con la oferta
// «software + marketing por US$ 379/mes» (`OFERTA_ESTETICA`). Sin menú: arriba va el
// wizard de /agenda (boleta a 379, datos y horario) y los CTA de abajo suben a él.

import AgendaWizard from "@/components/agenda/AgendaWizard";
import { CtaPrimary, Eyebrow, GRAD } from "@/components/brand-v3/Brand";
import AgentShowcase from "@/components/empleado-digital/AgentShowcase";
import AuraConfirmCard from "@/components/empleado-digital/AuraConfirmCard";
import EsteticaSection from "@/components/estetica/EsteticaSection";
import { Logos, Testimonios, useReveal } from "@/components/home-v3/sections";
import { IntelligencePlataformaSection } from "@/components/IntelligenceSection";
import { CTA_VENTAS_LABEL, MARKETING_BLOQUES, PLANES } from "@/content/planes";
import { OFERTA_ESTETICA } from "@/content/oferta-estetica";
import styles from "./OfertaEsteticaLanding.module.css";

const VORTEX = PLANES[0];
const nf = (v: number) => v.toLocaleString("es-CL");

/** Las funciones de Clinera que ve una clínica estética. Sin integraciones con agendas de terceros. */
export const FUNCIONES_ESTETICA = [
  { titulo: "Agenda por profesional y box", texto: "Disponibilidad real por profesional, sala y duración del tratamiento. Reagendar y cancelar sin llamadas." },
  { titulo: "Ficha estética facial", texto: "Evaluación del rostro con tercios y eje de simetría, fotos de cada sesión y consentimiento en la misma ficha." },
  { titulo: "Ficha estética corporal", texto: "Zonas marcadas sobre el cuerpo, plan de sesiones y evolución. Las fotos quedan en el paciente, no en un celular." },
  { titulo: "Presupuestos por WhatsApp", texto: "Lo que evaluaste se convierte en presupuesto y sale por WhatsApp, con seguimiento hasta que el paciente agenda." },
  { titulo: "Pagos y cobros", texto: "Registra pagos y abonos de cada tratamiento: la venta queda junto al historial del paciente." },
  { titulo: "AURA, agente de IA 24/7", texto: "Responde el WhatsApp de la clínica, ofrece tus tratamientos y deja la cita creada en tu agenda, también de noche." },
  { titulo: "Bandeja unificada", texto: "WhatsApp, Instagram y Facebook en una sola bandeja conectada a la agenda y a la ficha." },
  { titulo: "Clinera Intelligence", texto: "Pregúntale cuánto vendiste, qué tratamiento se mueve más o cómo viene la agenda. Responde con tus datos." },
  { titulo: "CRM y difusiones", texto: "Seguimiento de leads y pacientes, automatizaciones y difusiones en el mismo software que la ficha." },
] as const;

export const FAQ_OFERTA = [
  {
    q: "¿Qué incluye la oferta de US$ 379 al mes?",
    a: `El Ecosistema completo: el software con IA (hasta ${VORTEX.professionals} profesionales, ${nf(VORTEX.iaCredits)} créditos de IA, agenda, fichas, pagos, AURA y Clinera Intelligence) más el marketing de performance: campañas, propuesta de valor, framework comercial y una reunión de marketing cada semana.`,
  },
  {
    q: "¿La inversión en anuncios está incluida?",
    a: "No. El servicio incluye la estrategia, las campañas, los creativos y las reuniones semanales; la inversión en anuncios en Meta y Google la pagas aparte, directamente a la plataforma.",
  },
  {
    q: "¿Hay costo de implementación?",
    a: "No. El onboarding es dedicado, con un ejecutivo humano, y migramos tus pacientes e historial desde tu sistema actual.",
  },
  {
    q: "¿Se conecta con Reservo o AgendaPro?",
    a: "No. Clinera opera sobre su propia agenda, ficha y pagos; tus datos se migran en el onboarding.",
  },
  {
    q: "¿Cómo tomo la oferta?",
    a: "Agenda una reunión en el formulario de arriba. En la videollamada te mostramos Clinera con el caso de tu clínica y dejamos el Ecosistema a US$ 379 al mes.",
  },
] as const;

/** Los CTA de más abajo suben al formulario: el wizard ES la parte de arriba de la página. */
const AL_FORMULARIO = "#formulario";

export default function OfertaEsteticaLanding({ tzIp = "" }: { tzIp?: string }) {
  useReveal();

  return (
    <>
      <main className={styles.main}>
        <section id="formulario" className={styles.formulario} aria-label="Agenda tu reunión" data-oferta-wizard>
          <AgendaWizard
            tzIp={tzIp}
            oferta={OFERTA_ESTETICA.id}
            sourcePath={`/${OFERTA_ESTETICA.slug}`}
            encabezado={{
              titulo: "Software para clínicas estéticas + marketing por US$ 379",
              sub: "Agenda tu reunión con Clinera",
            }}
            embebido
          />
        </section>

        <Logos />

        <section className={styles.funciones} id="funciones" aria-labelledby="funciones-h2">
          <div className={`reveal ${styles.cabecera}`}>
            <Eyebrow>Funciones de Clinera</Eyebrow>
            <h2 id="funciones-h2" className={styles.h2}>
              Todo lo que tu clínica estética necesita, en un solo lugar
            </h2>
          </div>
          <ul className={styles.grilla} data-funciones-estetica>
            {FUNCIONES_ESTETICA.map((f) => (
              <li key={f.titulo} className={`reveal ${styles.tarjeta}`}>
                <h3>{f.titulo}</h3>
                <p>{f.texto}</p>
              </li>
            ))}
          </ul>
        </section>

        <EsteticaSection id="ficha-estetica" conLogos={false} />

        <AgentShowcase
          id="aura"
          eyebrow="Agente IA · en vivo"
          headline="AURA responde y agenda cuando tu equipo no puede."
          body="Atiende consultas fuera de horario, ofrece tus tratamientos, agenda y confirma sobre la agenda real del equipo, y deriva a una persona cuando la conversación lo pide."
          imageSrc="/agents/aura-fullbody.png"
          imageAlt="AURA, agente de IA de WhatsApp para clínicas estéticas"
          floatingCard={<AuraConfirmCard />}
          bg="linear-gradient(180deg, #F1ECFB 0%, #F7F4FD 60%, #FAFBFC 100%)"
        />

        <IntelligencePlataformaSection ctaHref={AL_FORMULARIO} ctaLabel={CTA_VENTAS_LABEL} />

        <Testimonios />

        <section className={styles.faq} aria-labelledby="faq-h2">
          <h2 id="faq-h2" className={`reveal ${styles.h2}`}>Preguntas frecuentes</h2>
          <div className={styles.faqLista}>
            {FAQ_OFERTA.map((f) => (
              <details key={f.q} className={`reveal ${styles.faqItem}`}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="oferta" className={styles.oferta} aria-labelledby="oferta-h2" data-oferta-estetica>
          <div className={`reveal ${styles.ofertaCaja}`}>
            <div className={styles.ofertaGlow} aria-hidden />
            <div className={styles.ofertaTexto}>
              <Eyebrow style={{ color: "#D946EF" }}>Oferta Ecosistema</Eyebrow>
              <h2 id="oferta-h2" className={styles.ofertaH2}>
                Llévate el software + marketing por{" "}
                <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                  US$ {OFERTA_ESTETICA.precioUsd}
                </span>{" "}
                al mes
              </h2>
              <p className={styles.regular}>
                Precio regular <s>US$ {OFERTA_ESTETICA.precioRegularUsd}/mes</s>
              </p>
              <CtaPrimary as="a" href={AL_FORMULARIO} data-cta-ventas="oferta-cierre" style={{ padding: "16px 28px", fontSize: 16 }}>
                {CTA_VENTAS_LABEL} <span>→</span>
              </CtaPrimary>
              <p className={styles.letraChica}>
                Sin costo de implementación. La inversión en anuncios se paga aparte.
              </p>
            </div>
            <ul className={styles.incluye}>
              <li>
                <b>Software con IA</b>
                <span>
                  Agenda, fichas, pagos, AURA y Clinera Intelligence. Hasta {VORTEX.professionals} profesionales y{" "}
                  {nf(VORTEX.iaCredits)} créditos de IA.
                </span>
              </li>
              {MARKETING_BLOQUES.map((b) => (
                <li key={b.id}>
                  <b>{b.titulo}</b>
                  <span>{b.texto}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
