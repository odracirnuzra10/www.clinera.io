"use client";

import Link from "next/link";
import { CtaPrimary, CtaSecondary, Eyebrow, GRAD } from "@/components/brand-v3/Brand";

const VIOLET = "#7C3AED";
const MAGENTA = "#C850C0";
const CYAN = "#009FE3";

export default function AgenciasLanding() {
  return (
    <>
      <Hero />
      <SellingPoints />
      <ProgramaPartner />
      <StackConnection />
      <ModosCompact />
      <FaqAgencias />
      <FinalCTA />
      <style jsx global>{`
        @media (max-width: 720px) {
          .agencias-section { padding-left: 28px !important; padding-right: 28px !important; }
        }
      `}</style>
    </>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero() {
  return (
    <section
      className="agencias-section"
      style={{
        padding: "120px 80px 80px",
        background: "#FAFAFA",
        borderBottom: "1px solid #F0F0F0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 60% at 80% 20%, rgba(217,70,239,.08), transparent 60%), radial-gradient(ellipse 50% 50% at 10% 80%, rgba(59,130,246,.06), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <Eyebrow style={{ color: VIOLET }}>Programa partner · Agencias</Eyebrow>
        <h1
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.04,
            margin: "16px 0 18px",
            color: "#0A0A0A",
            maxWidth: 920,
          }}
        >
          Clinera convierte cada clínica en{" "}
          <span
            style={{
              background: GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            un cliente conectado a tu stack
          </span>
          .
        </h1>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(15px, 1.2vw, 18px)",
            color: "#4B5563",
            lineHeight: 1.6,
            margin: "0 0 32px",
            maxWidth: 720,
          }}
        >
          AURA es un agente IA con tool calls que reemplaza casi por completo a la
          recepcionista. Agenda, cobra y reactiva por WhatsApp 24/7. Tu agencia conecta
          cada campaña de Meta o Google directamente a la operación — y rentabiliza
          cada lead.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <CtaPrimary
            as={Link}
            href="/reunion-comercial"
            style={{ padding: "14px 22px", fontSize: 15 }}
          >
            Aplicar al programa <span style={{ marginLeft: 2 }}>→</span>
          </CtaPrimary>
          <CtaSecondary
            as={Link}
            href="/presentacion-agencia"
            style={{ padding: "14px 22px", fontSize: 15 }}
          >
            Ver presentación técnica
          </CtaSecondary>
        </div>

        <div
          style={{
            marginTop: 56,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 24,
            paddingTop: 36,
            borderTop: "1px solid #E5E7EB",
          }}
        >
          <Stat label="Descuento permanente" value="20%" />
          <Stat label="Setup automatización" value="≈ 30s" />
          <Stat label="Atribución de leads" value="Tiempo real" />
          <Stat label="Apps conectables" value="9.000+" />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10.5,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#9CA3AF",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "Inter",
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          color: "#0A0A0A",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ============================================================
   LO QUE VENDES A TUS CLÍNICAS
   ============================================================ */
function SellingPoints() {
  const items = [
    {
      num: "01",
      title: "Agente IA con tool calls",
      desc: "AURA ejecuta funciones reales contra el sistema — agenda, cobra, consulta historial. No solo conversa.",
    },
    {
      num: "02",
      title: "Reemplaza casi por completo a la recepcionista",
      desc: "24/7 por WhatsApp, sin licencias, sin vacaciones. La clínica deja de perder ventas fuera de horario.",
    },
    {
      num: "03",
      title: "Setup en menos de 1 hora",
      desc: "Configuración asistida por humano del equipo de Clinera. AURA queda operando esa misma tarde.",
    },
    {
      num: "04",
      title: "Costo claro por conversación",
      desc: "Desde $0,09 USD por conversación en el plan MAX. Cupos calculados con 30% de margen conservador.",
    },
  ];
  return (
    <section
      className="agencias-section"
      style={{
        padding: "96px 80px",
        background: "#fff",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow>Lo que vendes a tus clínicas</Eyebrow>
        <h2
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(28px, 3.6vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: "14px 0 12px",
            color: "#0A0A0A",
            maxWidth: 760,
          }}
        >
          Un producto que la clínica entiende en 30 segundos.
        </h2>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 16,
            color: "#4B5563",
            lineHeight: 1.6,
            margin: "0 0 40px",
            maxWidth: 640,
          }}
        >
          Posicionar Clinera con tus clientes es directo: una recepcionista digital que
          atiende, agenda y cobra por WhatsApp.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
          }}
        >
          {items.map((it) => (
            <div
              key={it.num}
              style={{
                background: "#FAFAFA",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                padding: "22px 22px 24px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.14em",
                  color: VIOLET,
                  marginBottom: 14,
                }}
              >
                · {it.num}
              </div>
              <h3
                style={{
                  fontFamily: "Inter",
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  color: "#0A0A0A",
                  margin: "0 0 10px",
                  lineHeight: 1.25,
                }}
              >
                {it.title}
              </h3>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 13.5,
                  color: "#6B7280",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PROGRAMA PARTNER · 3 BENEFICIOS
   ============================================================ */
function ProgramaPartner() {
  return (
    <section
      className="agencias-section"
      style={{
        padding: "96px 80px",
        background: "#FAFAFA",
        borderTop: "1px solid #F0F0F0",
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow style={{ color: VIOLET }}>Lo que ganas tú</Eyebrow>
        <h2
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(28px, 3.6vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: "14px 0 12px",
            color: "#0A0A0A",
            maxWidth: 720,
          }}
        >
          Tres beneficios concretos del programa partner.
        </h2>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 16,
            color: "#4B5563",
            lineHeight: 1.6,
            margin: "0 0 40px",
            maxWidth: 660,
          }}
        >
          Más soporte dedicado mientras implementas Clinera en cada cliente.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18,
            marginBottom: 24,
          }}
        >
          <BenefitCard
            num="01"
            title="20%"
            unit=" descuento"
            desc="Permanente para todos los clientes que traes. Aplica a Conect, Advanced y MAX. Sin tope, sin vencimiento. Mejor margen para ti, mejor precio para la clínica."
          />
          <BenefitCard
            featured
            num="02"
            title="Directorio"
            unit=""
            desc="Apareces en el Directorio de Agencias Recomendadas que mostramos a clínicas buscando expertise. Te derivamos leads calificados directamente desde Clinera."
          />
          <BenefitCard
            num="03"
            title="Capacitación"
            unit=" 1:1"
            desc="Onboarding dedicado para tu equipo. Te entrenamos a implementar Clinera con las campañas de cada cliente y a sostener la operación a escala."
          />
        </div>

        <div
          className="agencias-franco"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,.05), rgba(200,80,192,.03))",
            border: "1px solid rgba(124,58,237,.18)",
            borderRadius: 16,
            padding: "24px 26px",
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <img
            src="/agents/franco.png"
            alt="Franco — ejecutivo de cuentas de Clinera"
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "center 18%",
              border: "2px solid #fff",
              boxShadow: "0 10px 24px -10px rgba(124,58,237,.4)",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 260 }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: VIOLET,
                marginBottom: 6,
              }}
            >
              Tu ejecutivo de cuentas
            </div>
            <h3
              style={{
                fontFamily: "Inter",
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#0A0A0A",
                margin: "0 0 8px",
              }}
            >
              Franco lleva tu cuenta — y la de tus clientes.
            </h3>
            <p
              style={{
                fontFamily: "Inter",
                fontSize: 14.5,
                color: "#1F2937",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              <b style={{ fontWeight: 600 }}>Soporte dedicado:</b> tienes su celular
              directo para resolver lo que necesites. Y las{" "}
              <b style={{ fontWeight: 600 }}>importaciones de fichas, tratamientos y
              pacientes</b>{" "}
              las hace él vía Excel, accediendo a la cuenta del software actual
              (Dentalink, Medilink, Reservo, AgendaPro) — listas en ~1 semana.
            </p>
          </div>
          <CtaPrimary
            as="a"
            href="/capacitacion"
            style={{ padding: "12px 20px", fontSize: 14, whiteSpace: "nowrap" }}
          >
            Soporte y capacitación <span style={{ marginLeft: 2 }}>→</span>
          </CtaPrimary>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  num,
  title,
  unit,
  desc,
  featured,
}: {
  num: string;
  title: string;
  unit: string;
  desc: string;
  featured?: boolean;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: featured ? "1px solid rgba(124,58,237,.4)" : "1px solid #E5E7EB",
        borderRadius: 16,
        padding: "26px 24px 22px",
        boxShadow: featured
          ? "0 22px 60px -22px rgba(124,58,237,.22)"
          : "0 4px 24px rgba(0,0,0,.03)",
        position: "relative",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10.5,
          letterSpacing: "0.14em",
          color: featured ? VIOLET : "#9CA3AF",
          marginBottom: 18,
        }}
      >
        · {num} · Beneficio
      </div>
      <h3
        style={{
          fontFamily: "Inter",
          fontSize: "clamp(28px, 3.2vw, 40px)",
          fontWeight: 800,
          letterSpacing: "-0.035em",
          lineHeight: 1,
          margin: "0 0 14px",
          background: GRAD,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {title}
        {unit && (
          <span
            style={{
              fontSize: "0.55em",
              fontWeight: 700,
              color: "#0A0A0A",
              WebkitTextFillColor: "#0A0A0A",
              background: "none",
            }}
          >
            {unit}
          </span>
        )}
      </h3>
      <p
        style={{
          fontFamily: "Inter",
          fontSize: 13.5,
          color: "#6B7280",
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

/* ============================================================
   STACK CONNECTION · Meta Ads → Clinera → WhatsApp + Ecosistema
   ============================================================ */
function StackConnection() {
  return (
    <section
      className="agencias-section"
      style={{
        padding: "96px 80px",
        background: "#fff",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow style={{ color: MAGENTA }}>API + Webhooks · Plug &amp; play</Eyebrow>
        <h2
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(28px, 3.6vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: "14px 0 12px",
            color: "#0A0A0A",
            maxWidth: 800,
          }}
        >
          Conecta cada campaña de tu cliente a su WhatsApp.
        </h2>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 16,
            color: "#4B5563",
            lineHeight: 1.6,
            margin: "0 0 40px",
            maxWidth: 680,
          }}
        >
          Triggers (cita creada, estado de lead cambia, paciente inactivo…) → acciones
          (WhatsApp, email, webhook a tu stack). En tiempo real, sin reescribir nada.
        </p>

        {/* Flow example */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(0,159,227,.04), rgba(124,58,237,.05) 50%, rgba(200,80,192,.04))",
            border: "1px solid rgba(124,58,237,.2)",
            borderRadius: 16,
            padding: "22px 24px",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10.5,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 700,
                background: GRAD,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              ★ Ejemplo plug &amp; play · el más usado
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#6B7280",
                padding: "4px 10px",
                borderRadius: 999,
                border: "1px solid #E5E7EB",
                background: "#fff",
              }}
            >
              Setup ≈ 30 segundos
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr auto 1fr",
              gap: 10,
              alignItems: "stretch",
            }}
            className="flow-cols"
          >
            <FlowStep
              title="Meta Lead Ads"
              sub="Lead entrante de tu campaña"
            />
            <FlowArrow />
            <FlowStep
              title="Webhook a Clinera"
              sub="Lead creado · automatización dispara"
            />
            <FlowArrow />
            <FlowStep
              title="AURA escribe"
              sub="WhatsApp al lead en segundos"
            />
          </div>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: 13.5,
              color: "#6B7280",
              lineHeight: 1.55,
              margin: "16px 0 0",
              paddingTop: 14,
              borderTop: "1px dashed rgba(124,58,237,.18)",
            }}
          >
            El lead que tu agencia generó por{" "}
            <b style={{ color: "#0A0A0A", fontWeight: 600 }}>Meta Ads</b> recibe
            respuesta antes de que se enfríe. La clínica cierra más citas, tu agencia
            muestra mejor{" "}
            <b style={{ color: "#0A0A0A", fontWeight: 600 }}>CPL → cita → venta</b>.
          </p>
        </div>

        {/* Ecosystem */}
        <div
          style={{
            background: "#FAFAFA",
            border: "1px solid #E5E7EB",
            borderRadius: 14,
            padding: "22px 24px",
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 10.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: VIOLET,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: VIOLET,
              }}
            />
            Ecosistema · el webhook abre la puerta a 9.000+ apps
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {[
              { t: "n8n", platform: true },
              { t: "Make", platform: true },
              { t: "Zapier", platform: true },
              { t: "HubSpot" },
              { t: "Salesforce" },
              { t: "Pipedrive" },
              { t: "Airtable" },
              { t: "Google Sheets" },
              { t: "Looker Studio" },
              { t: "Slack" },
              { t: "Monday" },
              { t: "Notion" },
              { t: "Meta Lead Ads" },
              { t: "Google Drive" },
              { t: "CRM interno" },
            ].map((c) => (
              <span
                key={c.t}
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: c.platform
                    ? "linear-gradient(90deg, rgba(124,58,237,.08), rgba(200,80,192,.08))"
                    : "#fff",
                  border: c.platform
                    ? "1px solid rgba(124,58,237,.25)"
                    : "1px solid #E5E7EB",
                  color: c.platform ? VIOLET : "#0A0A0A",
                  fontWeight: c.platform ? 600 : 400,
                  letterSpacing: "0.01em",
                }}
              >
                {c.t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.flow-cols) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function FlowStep({ title, sub }: { title: string; sub: string }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 10,
        padding: "12px 16px",
        lineHeight: 1.4,
      }}
    >
      <div
        style={{
          fontFamily: "Inter",
          fontSize: 13.5,
          fontWeight: 600,
          color: "#0A0A0A",
          marginBottom: 2,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10.5,
          color: "#9CA3AF",
          letterSpacing: "0.02em",
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <span
      style={{
        color: VIOLET,
        fontSize: 18,
        alignSelf: "center",
        textAlign: "center",
      }}
      className="flow-arrow"
    >
      →
    </span>
  );
}

/* ============================================================
   MODOS COMPACT
   ============================================================ */
function ModosCompact() {
  return (
    <section
      className="agencias-section"
      style={{
        padding: "96px 80px",
        background: "#FAFAFA",
        borderTop: "1px solid #F0F0F0",
        borderBottom: "1px solid #F0F0F0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow style={{ color: CYAN }}>Modos de IA · Costo claro</Eyebrow>
        <h2
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(28px, 3.6vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: "14px 0 12px",
            color: "#0A0A0A",
            maxWidth: 720,
          }}
        >
          Una IA. Tres modos. Cada uno con su costo por conversación.
        </h2>
        <p
          style={{
            fontFamily: "Inter",
            fontSize: 16,
            color: "#4B5563",
            lineHeight: 1.6,
            margin: "0 0 40px",
            maxWidth: 660,
          }}
        >
          Tu cliente elige el modo según su volumen y la velocidad que necesita. La
          unidad atómica es el crédito.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18,
            marginBottom: 22,
          }}
        >
          <ModoMini
            num="01"
            name="Eficiente"
            credits="~4"
            cost="$0,39"
            desc="IA conversa, paciente confirma vía link. Costo IA más bajo. Desde Plan Conect."
          />
          <ModoMini
            featured
            num="02"
            name="Agentic"
            credits="~17"
            cost="$0,36"
            desc="IA agenda sola con tool calls. La mejor relación capacidad/costo. Desde Plan Conect."
          />
          <ModoMini
            num="03"
            name="Agentic Pro"
            credits="~36"
            cost="$0,28"
            desc="Agentic con respuesta inmediata a 289 tokens/s. Solo Plan MAX."
          />
        </div>

        <Link
          href="/calculadora-de-consumo"
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 12,
            letterSpacing: "0.1em",
            color: VIOLET,
            textDecoration: "none",
            borderBottom: "1px solid rgba(124,58,237,.25)",
            paddingBottom: 2,
          }}
        >
          Calculadora de consumo →
        </Link>
      </div>
    </section>
  );
}

function ModoMini({
  num,
  name,
  credits,
  cost,
  desc,
  featured,
}: {
  num: string;
  name: string;
  credits: string;
  cost: string;
  desc: string;
  featured?: boolean;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: featured ? "1px solid rgba(124,58,237,.4)" : "1px solid #E5E7EB",
        borderRadius: 16,
        padding: "24px 22px",
        boxShadow: featured
          ? "0 22px 60px -22px rgba(124,58,237,.22)"
          : "0 4px 24px rgba(0,0,0,.03)",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10.5,
          letterSpacing: "0.14em",
          color: featured ? VIOLET : "#9CA3AF",
          marginBottom: 14,
        }}
      >
        · {num} · Modo
      </div>
      <h3
        style={{
          fontFamily: "Inter",
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          lineHeight: 1,
          margin: "0 0 14px",
          color: "#0A0A0A",
        }}
      >
        {name}
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          padding: 14,
          borderRadius: 10,
          background: featured ? "rgba(124,58,237,.04)" : "#FAFAFA",
          border: featured ? "1px solid rgba(124,58,237,.18)" : "1px solid #F0F0F0",
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#9CA3AF",
              marginBottom: 5,
            }}
          >
            Créditos / at.
          </div>
          <div
            style={{
              fontFamily: "Inter",
              fontSize: 18,
              fontWeight: 700,
              color: featured ? VIOLET : "#0A0A0A",
              letterSpacing: "-0.015em",
            }}
          >
            {credits}
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#9CA3AF",
              marginBottom: 5,
            }}
          >
            Costo / at.
          </div>
          <div
            style={{
              fontFamily: "Inter",
              fontSize: 18,
              fontWeight: 700,
              color: featured ? VIOLET : "#0A0A0A",
              letterSpacing: "-0.015em",
            }}
          >
            {cost}
          </div>
        </div>
      </div>
      <p
        style={{
          fontFamily: "Inter",
          fontSize: 13,
          color: "#6B7280",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

/* ============================================================
   FAQ
   ============================================================ */
function FaqAgencias() {
  const faq = [
    {
      q: "¿Cómo funciona el 20% de descuento?",
      a: "Aplica permanentemente a todas las cuentas activas que tu agencia traiga: Conect, Advanced o MAX. Sin tope, sin vencimiento. Se descuenta directo del precio del plan que paga la clínica — tu agencia decide si lo absorbe como margen, si lo traslada, o si lo divide.",
    },
    {
      q: "¿Qué es el Directorio de Agencias Recomendadas?",
      a: "Un directorio público dentro de clinera.io donde aparecen las agencias partner verificadas. Cuando una clínica nos pregunta por una agencia experta en Clinera, le derivamos contactos directamente. Quedas listado con descripción, áreas de expertise y forma de contacto.",
    },
    {
      q: "¿Quién es Franco y cómo es el soporte dedicado?",
      a: "Franco es el enlace entre tu agencia y Clinera: el rostro detrás de tu operación y la de tus clientes. Tienes su celular directo (WhatsApp +54 9 2616 62-5707) para resolver dudas de integración, automatizaciones y casos puntuales — sin tickets ni esperas. Más onboarding 1:1 de tu equipo (configurar AURA por vertical, conectar Meta Lead Ads vía webhook, reporting con atribución y cómo escalar a múltiples clientes).",
    },
    {
      q: "¿Quién hace la importación de fichas, tratamientos y pacientes?",
      a: "La hacemos nosotros. Franco solicita acceso a la cuenta del software actual de tu cliente (Dentalink, Medilink, Reservo, AgendaPro, etc.), exporta a Excel y deja importadas las fichas clínicas, los tratamientos y la base de pacientes en un plazo de ~1 semana. Importante: los tratamientos suelen venir sin descripción; Franco le pide al cliente que complete esas descripciones (puede apoyarse en ChatGPT y solo verificar que estén correctas) antes de cargarlas en Clinera. Tu cliente no parte de cero ni pierde su historial.",
    },
    {
      q: "¿Hay un compromiso de volumen mínimo?",
      a: "No. El programa partner no exige cuotas. Si traes 1 cliente, aplican los 3 beneficios. Si traes 50, también — escala contigo.",
    },
    {
      q: "¿Cómo se conecta Meta Lead Ads con Clinera?",
      a: "Vía webhook. Cada lead que genera tu campaña dispara una automatización en Clinera que crea el lead en el sistema, registra origen (campaña, ad set) y arranca un flujo de WhatsApp con AURA. Setup típico: 30 segundos en n8n, Make o Zapier.",
    },
    {
      q: "¿Qué pasa si mi cliente quiere usar su propio CRM?",
      a: "Clinera se conecta vía webhook a HubSpot, Salesforce, Pipedrive, Airtable o cualquier sistema con API. Tu agencia mantiene la operación comercial donde la tiene y Clinera alimenta los eventos clínicos en tiempo real.",
    },
    {
      q: "¿Cómo aplico al programa?",
      a: "Agenda una reunión de descubrimiento con el equipo de Clinera. Vemos tu cartera de clientes, tu stack actual y los servicios que ofreces, y te activamos en el programa la misma semana.",
    },
  ];
  return (
    <section
      className="agencias-section"
      style={{
        padding: "96px 80px",
        background: "#fff",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <Eyebrow>Preguntas frecuentes</Eyebrow>
        <h2
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(28px, 3.6vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: "14px 0 40px",
            color: "#0A0A0A",
          }}
        >
          Lo que las agencias preguntan antes de entrar.
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faq.map((f) => (
            <details
              key={f.q}
              style={{
                background: "#FAFAFA",
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                padding: "16px 20px",
              }}
            >
              <summary
                style={{
                  fontFamily: "Inter",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0A0A0A",
                  cursor: "pointer",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.4,
                }}
              >
                {f.q}
              </summary>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 14.5,
                  color: "#4B5563",
                  lineHeight: 1.6,
                  margin: "12px 0 0",
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

/* ============================================================
   FINAL CTA
   ============================================================ */
function FinalCTA() {
  return (
    <section
      className="agencias-section"
      style={{
        padding: "96px 80px 120px",
        background: "#0A0A0A",
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-80px -80px auto -80px",
            height: 240,
            background:
              "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(124,58,237,.35), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#A5A5B0",
              marginBottom: 18,
            }}
          >
            · Programa partner · 2026
          </div>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: "clamp(32px, 4.5vw, 56px)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.04,
              margin: "0 0 18px",
              color: "#fff",
              maxWidth: 820,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Tu próximo cliente clínico,{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, #60A5FA, #C084FC 55%, #F0ABFC)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              conectado a tu stack
            </span>
            .
          </h2>
          <p
            style={{
              fontFamily: "Inter",
              fontSize: "clamp(15px, 1.2vw, 17px)",
              color: "#9CA3AF",
              lineHeight: 1.6,
              margin: "0 auto 32px",
              maxWidth: 600,
            }}
          >
            Agendamos una reunión de descubrimiento, revisamos tu cartera y te
            activamos en el programa la misma semana.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <CtaPrimary
              as={Link}
              href="/reunion-comercial"
              style={{ padding: "14px 22px", fontSize: 15 }}
            >
              Aplicar al programa <span style={{ marginLeft: 2 }}>→</span>
            </CtaPrimary>
            <CtaSecondary
              as={Link}
              href="/presentacion-agencia"
              style={{
                padding: "14px 22px",
                fontSize: 15,
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.15)",
              }}
            >
              Ver presentación técnica
            </CtaSecondary>
          </div>
        </div>
      </div>
    </section>
  );
}
