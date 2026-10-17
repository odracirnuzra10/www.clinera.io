import { GRAD, Eyebrow, Wordmark, CnnLogo } from "@/components/brand-v3/Brand";
import { ChannelLogo } from "@/components/pricing/PlanChannelLogos";
import ActivaCta from "@/components/activa/ActivaCta";
import { ACTIVA_CNN, ACTIVA_CTA, ACTIVA_FUNCIONES, ACTIVA_HERO, ACTIVA_PRUEBA_SOCIAL } from "@/content/activa";
import { PLANS_2, SOLO_NUEVOS, type Plan2 } from "@/content/planes2";

const INK = "#0A0A0A";
const MUTED = "#4B5563";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const gradText = { background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } as const;

const ctaStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: GRAD,
  color: "#fff",
  fontFamily: "Inter",
  fontWeight: 700,
  fontSize: 17,
  padding: "16px 28px",
  borderRadius: 12,
  textDecoration: "none",
  boxShadow: "0 12px 32px -8px rgba(124,58,237,.35),0 4px 12px -2px rgba(217,70,239,.22)",
} as const;

export default function ActivaLanding() {
  return (
    <div style={{ background: "#fff", color: INK }}>
      <style>{`
        .ac-sec { padding: 72px 24px; }
        .ac-wrap { max-width: 1120px; margin: 0 auto; }
        .ac-planes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .ac-func { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .ac-video { position: relative; aspect-ratio: 16 / 9; border-radius: 16px; overflow: hidden; background: #0A0A0A; }
        .ac-video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
        @media (max-width: 900px) {
          .ac-planes, .ac-func { grid-template-columns: 1fr; }
          .ac-sec { padding: 48px 16px; }
          .ac-h1 { font-size: 36px !important; }
        }
      `}</style>

      <header style={{ padding: "16px 24px", display: "flex", justifyContent: "center" }}>
        <Wordmark size={20} />
      </header>

      <main>
        <section className="ac-sec" style={{ paddingTop: 40, textAlign: "center" }}>
          <div className="ac-wrap" style={{ maxWidth: 820 }}>
            <Eyebrow>{ACTIVA_HERO.eyebrow}</Eyebrow>
            <h1 className="ac-h1" style={{ fontFamily: "Inter", fontSize: 56, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.04, margin: "16px 0 14px" }}>
              Tu agenda, tus fichas y tus mensajes{" "}
              <span style={gradText}>en un solo lugar.</span>
            </h1>
            <p style={{ fontFamily: "Inter", fontSize: 19, color: MUTED, lineHeight: 1.55, margin: "0 auto 22px", maxWidth: 560 }}>{ACTIVA_HERO.texto}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 24 }} data-activa-canales>
              <ChannelLogo channel="whatsapp" size={26} />
              <ChannelLogo channel="facebook" size={26} />
              <ChannelLogo channel="instagram" size={26} />
            </div>
            <ActivaCta where="hero" style={ctaStyle}>{ACTIVA_CTA}</ActivaCta>
            <p style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase", color: "#6B7280", margin: "16px 0 0" }}>{ACTIVA_PRUEBA_SOCIAL}</p>
          </div>
        </section>

        <section className="ac-sec" style={{ background: "#FAFAFA" }} aria-labelledby="ac-cnn">
          <div className="ac-wrap" style={{ maxWidth: 860, textAlign: "center" }}>
            <Eyebrow>{ACTIVA_CNN.eyebrow}</Eyebrow>
            <div style={{ display: "flex", justifyContent: "center", margin: "12px 0 8px" }}>
              <CnnLogo height={34} color="#F03A47" />
            </div>
            <h2 id="ac-cnn" style={{ fontFamily: "Inter", fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 8px" }}>{ACTIVA_CNN.titulo}</h2>
            <p style={{ fontFamily: "Inter", fontSize: 16, color: MUTED, margin: "0 auto 24px", maxWidth: 560 }}>{ACTIVA_CNN.texto}</p>
            <div className="ac-video" data-activa-cnn>
              <iframe
                src={ACTIVA_CNN.vimeoSrc}
                title={ACTIVA_CNN.iframeTitle}
                loading="lazy"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        <section className="ac-sec" aria-labelledby="ac-func">
          <div className="ac-wrap">
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <Eyebrow>Funciones</Eyebrow>
              <h2 id="ac-func" style={{ fontFamily: "Inter", fontSize: 36, fontWeight: 800, letterSpacing: "-0.035em", margin: "12px 0 0" }}>
                Todo lo que tu clínica necesita, <span style={gradText}>sin cambiar de pestaña.</span>
              </h2>
            </div>
            <div className="ac-func" data-activa-funciones>
              {ACTIVA_FUNCIONES.map((f) => (
                <div key={f.t} style={{ border: "1px solid #E5E7EB", borderRadius: 14, padding: 22, background: "#fff" }}>
                  <h3 style={{ fontFamily: "Inter", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 8px" }}>{f.t}</h3>
                  <p style={{ fontFamily: "Inter", fontSize: 14.5, color: MUTED, lineHeight: 1.55, margin: 0 }}>{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ac-sec" style={{ background: "#FAFAFA" }} aria-labelledby="ac-planes">
          <div className="ac-wrap">
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <Eyebrow>Planes</Eyebrow>
              <h2 id="ac-planes" style={{ fontFamily: "Inter", fontSize: 36, fontWeight: 800, letterSpacing: "-0.035em", margin: "12px 0 8px" }}>
                Elige el tamaño de tu clínica.
              </h2>
              <p style={{ fontFamily: "Inter", fontSize: 15, color: MUTED, margin: 0 }}>{SOLO_NUEVOS}</p>
            </div>
            <div className="ac-planes" data-activa-planes>
              {PLANS_2.map((p) => (
                <PlanCard key={p.id} plan={p} />
              ))}
            </div>
          </div>
        </section>

        <section className="ac-sec" style={{ textAlign: "center" }}>
          <div className="ac-wrap" style={{ maxWidth: 720 }}>
            <h2 style={{ fontFamily: "Inter", fontSize: 36, fontWeight: 800, letterSpacing: "-0.035em", margin: "0 0 14px" }}>
              Empieza hoy por <span style={gradText}>USD 17 al mes.</span>
            </h2>
            <ActivaCta where="cierre" style={ctaStyle}>{ACTIVA_CTA}</ActivaCta>
          </div>
        </section>
      </main>
    </div>
  );
}

function PlanCard({ plan }: { plan: Plan2 }) {
  const destacado = plan.id === "ultra";
  return (
    <div
      data-activa-plan={plan.id}
      style={{
        border: destacado ? "2px solid #7C3AED" : "1px solid #E5E7EB",
        borderRadius: 16,
        padding: 26,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "#10B981" }}>{plan.tag}</span>
      <h3 style={{ fontFamily: "Inter", fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", margin: "8px 0 4px" }}>{plan.name}</h3>
      <p style={{ fontFamily: "Inter", fontSize: 14.5, color: MUTED, lineHeight: 1.5, margin: "0 0 14px", minHeight: 44 }}>{plan.tagline}</p>
      <div style={{ margin: "0 0 16px" }}>
        <span style={{ fontFamily: "Inter", fontSize: 44, fontWeight: 800, letterSpacing: "-0.04em", ...gradText }}>${plan.monthlyUsd}</span>
        <span style={{ fontFamily: "Inter", fontSize: 15, color: MUTED }}> dólares al mes</span>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "grid", gap: 8, flex: 1 }}>
        <li style={{ fontFamily: "Inter", fontSize: 14.5, color: "#374151" }}>
          {plan.professionals} {plan.professionals === 1 ? "profesional" : "profesionales"}
          {plan.branches === 1 ? " · 1 sucursal" : " · sucursales ilimitadas"}
        </li>
        {plan.features.map((f) => (
          <li key={f} style={{ fontFamily: "Inter", fontSize: 14.5, color: "#374151" }}>
            ✓ {f}
          </li>
        ))}
      </ul>
      <ActivaCta where={`plan-${plan.id}`} style={{ ...ctaStyle, fontSize: 16, padding: "14px 20px" }}>
        {ACTIVA_CTA}
      </ActivaCta>
    </div>
  );
}
