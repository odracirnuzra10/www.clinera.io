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

export default function EmpleadoDigitalLanding() {
  return (
    <>
      <HeroEquipo />
      <DemoVideo />
      <RoiSection />
      <DuoAgentes />

      <AgentShowcase
        id="aura"
        eyebrow="01 · El que ejecuta funciones"
        headline="Crea, re-agenda y confirma sola."
        body="AURA no responde — ejecuta. Crea citas en tu calendario, las mueve, consulta pagos, revisa sesiones. Trabaja sobre la agenda de todo tu equipo por WhatsApp, 24/7 — sin que se escape un lead."
        imageSrc="/agents/aura-fullbody.png"
        imageAlt="AURA — asistente IA de WhatsApp para clínicas"
        floatingCard={<AuraConfirmCard />}
        bg="linear-gradient(180deg, #F1ECFB 0%, #F7F4FD 60%, #FAFBFC 100%)"
      />

      <AgentShowcase
        id="lia"
        eyebrow="02 · 0% vacancia"
        headline="Llena cada hueco con el paciente idóneo."
        body="LIA fiscaliza tu operación 24/7. Detecta huecos y fugas al instante, prioriza por LTV, urgencia e historial, y activa a AURA para llenarlos. Incluida en Summit."
        imageSrc="/agents/lia-fullbody.png"
        imageAlt="LIA — cerebro operacional IA para clínicas"
        reverse
        floatingCard={<LiaDetectionCard />}
        bg="linear-gradient(180deg, #0F1115 0%, #1A1530 60%, #14111E 100%)"
        dark
      />

      <ModosAgendamiento />
      <AtencionesExplainer />
      <AdvancedCTA />
      <CorporativoBanner />
      <StickyAdvancedCTA />
    </>
  );
}
