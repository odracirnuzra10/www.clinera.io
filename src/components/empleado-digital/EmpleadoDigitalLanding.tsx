import HeroEquipo from "./HeroEquipo";
import DuoAgentes from "./DuoAgentes";
import AgentShowcase from "./AgentShowcase";
import ModosAgendamiento from "./ModosAgendamiento";
import AdvancedCTA from "./AdvancedCTA";
import StickyAdvancedCTA from "./StickyAdvancedCTA";

export default function EmpleadoDigitalLanding() {
  return (
    <>
      <HeroEquipo />
      <DuoAgentes />

      <AgentShowcase
        id="aura"
        eyebrow="01 · WhatsApp IA"
        headline="Contesta, agenda y reagenda 24/7"
        body="AURA atiende WhatsApp en tiempo real. Sincroniza con tu calendario, recuerda al paciente y aplica los precios del día sin que tengas que mover un dedo."
        imageSrc="/agents/aura-fullbody.png"
        imageAlt="AURA — asistente IA de WhatsApp para clínicas"
      />

      <AgentShowcase
        id="lia"
        eyebrow="02 · Cerebro operacional"
        headline="Detecta huecos y los rellena sola"
        body="LIA mira tu agenda 24/7. Cuando aparece un cupo vacío, decide a qué paciente contactar y le pasa la acción a AURA. Beta incluida desde Advanced."
        imageSrc="/agents/lia-fullbody.png"
        imageAlt="LIA — cerebro operacional IA para clínicas"
        reverse
      />

      <ModosAgendamiento />
      <AdvancedCTA />
      <StickyAdvancedCTA />
    </>
  );
}
