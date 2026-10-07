import HeroEquipo from "./HeroEquipo";
import DemoVideo from "./DemoVideo";
import DuoAgentes from "./DuoAgentes";
import AgentShowcase from "./AgentShowcase";
import AuraConfirmCard from "./AuraConfirmCard";
import LiaDetectionCard from "./LiaDetectionCard";
import ModosAgendamiento from "./ModosAgendamiento";
import RoiSection from "./RoiSection";
import AtencionesExplainer from "./AtencionesExplainer";
import CorporativoBanner from "./CorporativoBanner";
import AdvancedCTA from "./AdvancedCTA";
import StickyAdvancedCTA from "./StickyAdvancedCTA";
import EmpleadoDigitalFaq from "./EmpleadoDigitalFaq";
import Link from "next/link";
import { EMPLEADO_DIGITAL_ARTICULO_SLUG } from "@/content/empleado-digital-definicion";
import styles from "@/app/empleado-digital/empleado-digital.module.css";

export default function EmpleadoDigitalLanding() {
  return (
    <>
      <HeroEquipo />
      <p className={styles.definicionLink}>
        <Link href={`/blog/${EMPLEADO_DIGITAL_ARTICULO_SLUG}`}>
          ¿Qué es un empleado digital? — definición completa →
        </Link>
      </p>
      <DemoVideo />
      <RoiSection />
      <DuoAgentes />

      <AgentShowcase
        id="aura"
        eyebrow="01 · El que ejecuta funciones"
        headline="Crea, re-agenda y confirma sola."
        body="AURA no responde — ejecuta. Crea citas en tu calendario, las mueve, consulta pagos, revisa sesiones. Trabaja sobre la agenda de todo tu equipo por WhatsApp, 24/7 — sin que se escape un lead."
        imageSrc="/agents/aura-fullbody.png"
        imageAlt="AURA — empleado digital de WhatsApp para clínicas"
        floatingCard={<AuraConfirmCard />}
        bg="linear-gradient(180deg, #F1ECFB 0%, #F7F4FD 60%, #FAFBFC 100%)"
      />

      <AgentShowcase
        id="camila"
        eyebrow="02 · El call center IA"
        headline="Llama, confirma y reagenda por teléfono."
        body="CAMILA es el empleado digital de voz: llama a tus pacientes para confirmar y reagendar, con tool-calling sobre la agenda para mover citas durante la llamada. Cinco acentos (chileno, colombiano, peruano, mexicano y español). 25 créditos por minuto, disponible solo en Summit."
        imageSrc="/agents/camila.png"
        imageAlt="CAMILA — empleado digital de voz para clínicas"
        reverse
        bg="linear-gradient(180deg, #ECFEFF 0%, #F0FDFA 60%, #FAFBFC 100%)"
      />

      <AgentShowcase
        id="lia"
        eyebrow="03 · 0% vacancia"
        headline="Llena cada hueco con el paciente idóneo."
        body="LIA fiscaliza tu operación 24/7. Detecta huecos y fugas al instante, prioriza por LTV, urgencia e historial, y activa a AURA o CAMILA según el canal del paciente. Incluida en Summit."
        imageSrc="/agents/lia-fullbody.png"
        imageAlt="LIA — empleado digital orquestador para clínicas"
        floatingCard={<LiaDetectionCard />}
        bg="linear-gradient(180deg, #0F1115 0%, #1A1530 60%, #14111E 100%)"
        dark
      />

      <ModosAgendamiento />
      <AtencionesExplainer />
      <EmpleadoDigitalFaq />
      <AdvancedCTA />
      <CorporativoBanner />
      <StickyAdvancedCTA />
    </>
  );
}
