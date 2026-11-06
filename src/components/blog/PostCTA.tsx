import CtaPar from "@/components/cta/CtaPar";
import { PLAN_DESDE_USD } from "@/content/planes";

const COMPETITOR_LABELS: Record<string, string> = {
  agendapro: "AgendaPro",
  reservo: "Reservo",
  medilink: "Medilink",
  dentalink: "Dentalink",
  sacmed: "Sacmed",
  doctocliq: "Doctocliq",
  manual: "hacerlo manual",
};

type Props = {
  relatedComparativa?: string;
};

export default function PostCTA({ relatedComparativa }: Props) {
  const compLabel = relatedComparativa
    ? COMPETITOR_LABELS[relatedComparativa] ?? relatedComparativa
    : null;

  const heading = compLabel
    ? `¿Estás evaluando Clinera vs ${compLabel}?`
    : "¿Quieres ver Clinera en acción?";

  const subhead = compLabel
    ? `Tabla lado a lado, dimensiones técnicas, FAQ y cuándo elegir cada uno. O agenda 45 min con ventas y resolvemos tu caso puntual.`
    : `AURA atendiendo WhatsApp 24/7 con tu agenda y tu base de datos. Demo grabada de 5 minutos o reunión con ventas. Planes desde US$ ${PLAN_DESDE_USD}/mes.`;

  return (
    <section
      style={{
        marginTop: 56,
        background: "#0A0A0A",
        color: "#fff",
        borderRadius: 18,
        padding: "32px 36px",
        backgroundImage:
          "radial-gradient(ellipse 70% 80% at 100% 0%, rgba(217,70,239,.25), transparent 60%), radial-gradient(ellipse 50% 60% at 0% 120%, rgba(124,58,237,.22), transparent 60%)",
      }}
    >
      <h2
        style={{
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          margin: "0 0 12px",
        }}
      >
        {heading}
      </h2>
      <p
        style={{
          fontSize: 15.5,
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.78)",
          margin: "0 0 22px",
          maxWidth: 620,
        }}
      >
        {subhead}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {/* Ricardo, 4-nov-2026: los dos CTA del sitio. */}
        <CtaPar oscuro />
      </div>
    </section>
  );
}
