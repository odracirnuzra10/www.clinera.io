"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import {
  CtaPrimary,
  CtaSecondary,
  Eyebrow,
  GRAD,
} from "@/components/brand-v3/Brand";
import AgentShowcase from "@/components/empleado-digital/AgentShowcase";
import AuraConfirmCard from "@/components/empleado-digital/AuraConfirmCard";
import ModosAgendamiento from "@/components/empleado-digital/ModosAgendamiento";
import {
  Logos,
  PrensaCNN,
  Pricing,
  Testimonios,
  useReveal,
} from "@/components/home-v3/sections";
import { IntelligencePlataformaSection } from "@/components/IntelligenceSection";
import HeroCarousel from "@/components/plataforma/HeroCarousel";
import AuraNetwork from "@/components/plataforma/AuraNetwork";
import {
  CLINERA_PLANS,
  SETUP_FEE_NUMBER,
} from "@/content/pricing";
import type { SoftwareVerticalContent } from "./content";

const vortex = CLINERA_PLANS[0];

function subscribeLocation() {
  return () => {};
}
function getAgendaHref() {
  return window.location.search ? "/agenda" + window.location.search : "/agenda";
}
function getAgendaHrefServer() {
  return "/agenda";
}

export default function SoftwareVerticalLanding({
  content,
}: {
  content: SoftwareVerticalContent;
}) {
  useReveal();
  const agendaHref = useSyncExternalStore(
    subscribeLocation,
    getAgendaHref,
    getAgendaHrefServer,
  );

  return (
    <>
      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.in {
          opacity: 1;
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0ms !important;
            transition-duration: 0ms !important;
          }
        }
        @media (max-width: 720px) {
          main > section { padding-left: 32px !important; padding-right: 32px !important; }
        }
        .sv-hero-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          align-items: center;
          gap: 52px;
        }
        .sv-cards {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .sv-dive {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 56px;
        }
        @media (max-width: 1080px) {
          .sv-hero-grid,
          .sv-dive { grid-template-columns: 1fr; }
          .sv-cards { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 720px) {
          .sv-cards { grid-template-columns: 1fr; }
        }
      `}</style>

      <NavV3 ctaHref={agendaHref} ctaLabel="Agendar demo" />

      <main>
        <Hero content={content} agendaHref={agendaHref} />
        <Logos />
        <Includes content={content} />
        <AuraNetwork />
        <ModosAgendamiento />
        <DeepDive content={content} />
        <AgentShowcase
          id="aura"
          eyebrow={content.aura.eyebrow}
          headline={content.aura.headline}
          body={content.aura.body}
          imageSrc="/agents/aura-fullbody.png"
          imageAlt={content.aura.imageAlt}
          floatingCard={<AuraConfirmCard />}
          bg="linear-gradient(180deg, #F1ECFB 0%, #F7F4FD 60%, #FAFBFC 100%)"
        />
        <IntelligencePlataformaSection
          ctaHref={agendaHref}
          ctaLabel="Agendar demo de 30 min"
        />
        <CrmBand content={content} />
        <Testimonios />
        <PrensaCNN />
        <Pricing ctaHref={agendaHref} />
        <FaqSection faqs={content.faqs} />
        <FinalCta content={content} agendaHref={agendaHref} />
      </main>
    </>
  );
}

function Hero({
  content,
  agendaHref,
}: {
  content: SoftwareVerticalContent;
  agendaHref: string;
}) {
  return (
    <section style={{ position: "relative", padding: "80px 80px 40px", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 78% 62% at 46% -8%, rgba(59, 130, 246, 0.2) 0%, rgba(124, 58, 237, 0.15) 34%, rgba(217, 70, 239, 0.1) 56%, transparent 78%)",
          pointerEvents: "none",
        }}
      />
      <div className="sv-hero-grid" style={{ position: "relative" }}>
        <div className="reveal">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h1
            style={{
              fontFamily: "Inter",
              fontSize: "clamp(2.05rem, 3.35vw, 2.85rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.06,
              margin: "20px 0 0",
              color: "#0A0A0A",
            }}
          >
            {content.h1Lead}
            <span
              style={{
                background: GRAD,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {content.h1Accent}
            </span>
            {content.h1Rest}
          </h1>
          <strong
            style={{
              display: "block",
              marginTop: 24,
              borderLeft: "3px solid #7C3AED",
              paddingLeft: 16,
              color: "#22232A",
              fontSize: 18,
              fontWeight: 650,
              letterSpacing: "-0.015em",
              lineHeight: 1.45,
              fontFamily: "Inter",
            }}
          >
            {content.thesis}
          </strong>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 18,
              lineHeight: 1.58,
              color: "#4B5563",
              margin: "16px 0 0",
              maxWidth: 590,
            }}
          >
            {content.sub}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
            <CtaPrimary as={Link} href={agendaHref} style={{ padding: "15px 26px", fontSize: 16 }}>
              Agendar demo de 30 min <span>→</span>
            </CtaPrimary>
            <CtaSecondary as={Link} href="#precios" style={{ padding: "15px 26px", fontSize: 16 }}>
              Ver planes y precios
            </CtaSecondary>
          </div>
        </div>
        <div className="reveal" style={{ minWidth: 0 }}>
          <HeroCarousel only={content.heroViews} />
        </div>
      </div>
    </section>
  );
}

function Includes({ content }: { content: SoftwareVerticalContent }) {
  return (
    <section style={{ padding: "80px 80px 40px", background: "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
      <div className="reveal" style={{ maxWidth: 1200, margin: "0 auto 40px" }}>
        <Eyebrow>El sistema</Eyebrow>
        <h2
          style={{
            fontFamily: "Inter",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            margin: "14px 0 0",
            color: "#0A0A0A",
          }}
        >
          {content.includesH2}
        </h2>
      </div>
      <div className="sv-cards">
        {content.includes.map((card) => (
          <div
            key={card.title}
            className="reveal"
            style={{
              background: "#fff",
              border: "1px solid #EAEAEA",
              borderRadius: 16,
              padding: 28,
            }}
          >
            <h3
              style={{
                fontFamily: "Inter",
                fontSize: 18,
                fontWeight: 650,
                letterSpacing: "-0.02em",
                color: "#0A0A0A",
                margin: 0,
              }}
            >
              {card.title}
            </h3>
            <p
              style={{
                fontFamily: "Inter",
                fontSize: 15,
                lineHeight: 1.55,
                color: "#4B5563",
                margin: "10px 0 0",
              }}
            >
              {card.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DeepDive({ content }: { content: SoftwareVerticalContent }) {
  const { deepDive } = content;
  return (
    <section style={{ padding: "80px 80px 40px" }}>
      <div className="sv-dive">
        <div className="reveal">
          <Eyebrow>{deepDive.eyebrow}</Eyebrow>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.12,
              margin: "14px 0 0",
              color: "#0A0A0A",
            }}
          >
            {deepDive.h2}
          </h2>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 17,
              lineHeight: 1.58,
              color: "#4B5563",
              margin: "18px 0 0",
            }}
          >
            {deepDive.body}
          </p>
          <ul style={{ margin: "22px 0 0", padding: 0, listStyle: "none" }}>
            {deepDive.bullets.map((b) => (
              <li
                key={b}
                style={{
                  fontFamily: "Inter",
                  fontSize: 15,
                  color: "#0A0A0A",
                  padding: "8px 0",
                  borderBottom: "1px solid #F0F0F0",
                  display: "flex",
                  gap: 10,
                }}
              >
                <span style={{ color: "#10B981" }}>→</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal">
          {deepDive.imageSrc ? (
            <Image
              src={deepDive.imageSrc}
              alt={deepDive.imageAlt ?? ""}
              width={708}
              height={478}
              sizes="(max-width: 1080px) 100vw, 560px"
              style={{ width: "100%", height: "auto", borderRadius: 16, border: "1px solid #EAEAEA" }}
            />
          ) : (
            <OdontoPanel />
          )}
        </div>
      </div>
    </section>
  );
}

function OdontoPanel() {
  return (
    <div
      style={{
        background: "#FAFAFA",
        border: "1px solid #EAEAEA",
        borderRadius: 16,
        padding: 28,
      }}
    >
      {[
        ["1.6", "Caries · cara oclusal"],
        ["2.4", "Obturado"],
        ["3.6", "Corona"],
        ["4.8", "Ausente"],
      ].map(([pieza, hallazgo]) => (
        <div
          key={pieza}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            padding: "12px 0",
            borderBottom: "1px solid #EAEAEA",
            fontFamily: "Inter",
            fontSize: 15,
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontWeight: 600,
              color: "#0A0A0A",
            }}
          >
            Pieza {pieza}
          </span>
          <span style={{ color: "#4B5563" }}>{hallazgo}</span>
        </div>
      ))}
      <p
        style={{
          fontFamily: "Inter",
          fontSize: 14,
          color: "#6B7280",
          margin: "16px 0 0",
          lineHeight: 1.5,
        }}
      >
        Presupuesto de 1.6 enviado por WhatsApp · pendiente de aprobación
      </p>
    </div>
  );
}

function CrmBand({ content }: { content: SoftwareVerticalContent }) {
  return (
    <section style={{ padding: "80px 80px 40px", background: "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
      <div className="reveal" style={{ maxWidth: 760, margin: "0 auto" }}>
        <Eyebrow>{content.crm.eyebrow}</Eyebrow>
        <h2
          style={{
            fontFamily: "Inter",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1.15,
            margin: "14px 0 0",
            color: "#0A0A0A",
          }}
        >
          {content.crm.h2}
        </h2>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 17,
            lineHeight: 1.58,
            color: "#4B5563",
            margin: "16px 0 0",
          }}
        >
          {content.crm.body}
        </p>
      </div>
    </section>
  );
}

function FaqSection({ faqs }: { faqs: SoftwareVerticalContent["faqs"] }) {
  return (
    <section style={{ padding: "80px 80px 40px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <h2
          className="reveal"
          style={{
            fontFamily: "Inter",
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            color: "#0A0A0A",
            margin: "0 0 28px",
          }}
        >
          Preguntas frecuentes
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((f) => (
            <details
              key={f.q}
              className="reveal"
              style={{
                background: "#fff",
                border: "1px solid #EAEAEA",
                borderRadius: 12,
                padding: "18px 24px",
              }}
            >
              <summary
                style={{
                  fontFamily: "Inter",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0A0A0A",
                  cursor: "pointer",
                  listStyle: "none",
                }}
              >
                {f.q}
              </summary>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 15,
                  color: "#4B5563",
                  lineHeight: 1.6,
                  marginTop: 10,
                }}
              >
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta({
  content,
  agendaHref,
}: {
  content: SoftwareVerticalContent;
  agendaHref: string;
}) {
  return (
    <section style={{ padding: "16px 80px 24px", background: "#fff" }}>
      <div
        className="reveal"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          borderRadius: 24,
          padding: "72px 40px",
          position: "relative",
          overflow: "hidden",
          background: "#0E1014",
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 80% at 80% 20%, rgba(217,70,239,.35) 0%, rgba(124,58,237,.15) 40%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 640 }}>
          <Eyebrow style={{ color: "#D946EF" }}>Agenda tu demo</Eyebrow>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.08,
              margin: "16px 0 20px",
              color: "#fff",
            }}
          >
            {content.finalH2}
          </h2>
          <CtaPrimary as={Link} href={agendaHref} style={{ padding: "15px 26px", fontSize: 16 }}>
            Agendar demo de 30 min <span>→</span>
          </CtaPrimary>
          <div
            style={{
              marginTop: 22,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11.5,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#A0A6B2",
            }}
          >
            Desde USD {vortex.monthlyPrice}/mes · Implementación USD {SETUP_FEE_NUMBER} con el primer mes · Permanencia 6 meses · no incluye IVA
          </div>
        </div>
      </div>
    </section>
  );
}
