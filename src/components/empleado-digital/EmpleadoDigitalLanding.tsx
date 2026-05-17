"use client";

import { AgentSection, useReveal } from "@/components/home-v3/sections";
import HeroEquipo from "./HeroEquipo";
import DuoAgentes from "./DuoAgentes";
import ModosAgendamiento from "./ModosAgendamiento";
import AdvancedCTA from "./AdvancedCTA";
import StickyAdvancedCTA from "./StickyAdvancedCTA";

/* ============== Icons (inline SVG, matching size of home-v3 internal icons) ============== */

const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function IconCalendar() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

function IconDatabase() {
  return (
    <svg {...iconProps}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg {...iconProps}>
      <path d="M21 12a9 9 0 0 0-15.5-6.3L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 15.5 6.3L21 16" />
      <path d="M21 21v-5h-5" />
    </svg>
  );
}

function IconScan() {
  return (
    <svg {...iconProps}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M7 12h10" />
    </svg>
  );
}

function IconBranch() {
  return (
    <svg {...iconProps}>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M6 8v3a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V8" />
      <path d="M12 14v2" />
    </svg>
  );
}

function IconFunnel() {
  return (
    <svg {...iconProps}>
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </svg>
  );
}

/* ============== Mock surface (shared by all features) ============== */

type MockRow = { left: string; right: string; accent?: string; muted?: boolean };

function MockCard({
  header,
  rows,
  footer,
  accent = "#7C3AED",
}: {
  header: string;
  rows: MockRow[];
  footer?: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        border: "1px solid #F0F0F0",
        padding: 22,
        boxShadow: "0 24px 64px rgba(0,0,0,0.05)",
        fontFamily: "var(--font-main)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: accent,
          marginBottom: 14,
        }}
      >
        {header}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              borderRadius: 10,
              background: r.accent ? `${r.accent}10` : "#FAFBFC",
              border: `1px solid ${r.accent ? `${r.accent}30` : "#F0F0F0"}`,
              fontSize: 13,
              color: r.muted ? "#9CA3AF" : "#111318",
              fontWeight: r.accent ? 600 : 500,
              letterSpacing: "-0.005em",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                color: r.accent ?? "#3D4250",
                fontWeight: 600,
              }}
            >
              {r.left}
            </span>
            <span>{r.right}</span>
          </div>
        ))}
      </div>
      {footer && (
        <div
          style={{
            marginTop: 14,
            padding: "10px 12px",
            background: `${accent}08`,
            border: `1px dashed ${accent}40`,
            borderRadius: 10,
            fontSize: 12,
            color: "#3D4250",
            fontStyle: "italic",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

/* ============== AURA features ============== */

const AURA_FEATURES = [
  {
    tabLabel: "Agenda",
    tabIcon: <IconCalendar />,
    eyebrow: "Agenda sin colisiones",
    title: "Conecta tu agenda. Reserva sola.",
    body: "AURA lee tu calendario en tiempo real, agenda y reagenda sin pisarse con nadie y respeta los tiempos por tratamiento.",
    bullets: [
      "Sincroniza con Google Calendar, AgendaPro, Reservo",
      "Respeta duraciones por tratamiento",
      "Reagenda con un tap del paciente",
    ],
    mockup: (
      <MockCard
        accent="#7C3AED"
        header="Agenda · Viernes 24 oct"
        rows={[
          { left: "09:00", right: "María Torres · Control" },
          { left: "10:30", right: "Pedro Rojas · Primera vez", accent: "#7C3AED" },
          { left: "12:00", right: "Libre", muted: true },
          { left: "15:00", right: "Luis Alonso · Pagado", accent: "#7C3AED" },
          { left: "16:30", right: "Ana Mena · Control" },
        ]}
        footer="2 nuevos agendados por AURA hoy"
      />
    ),
  },
  {
    tabLabel: "Contexto",
    tabIcon: <IconDatabase />,
    eyebrow: "Contexto real del paciente",
    title: "Conoce a cada paciente antes de responder.",
    body: "Antes de escribir consulta tu base: historial, alergias, contraindicaciones y precios vigentes del día.",
    bullets: [
      "Reconoce por teléfono o RUT",
      "Recuerda tratamientos y alergias",
      "Aplica precios y promos del día",
    ],
    mockup: (
      <MockCard
        accent="#7C3AED"
        header="Paciente · Carla V."
        rows={[
          { left: "RUT", right: "16.245.882-1" },
          { left: "Última visita", right: "Limpieza · 6 mar" },
          { left: "Alergias", right: "Penicilina", accent: "#EF4444" },
          { left: "LTV", right: "USD 1.240", accent: "#7C3AED" },
        ]}
        footer="AURA consulta antes de cotizar. Precio del día aplicado: USD 89."
      />
    ),
  },
  {
    tabLabel: "Reactiva",
    tabIcon: <IconRefresh />,
    eyebrow: "Recuperación automática",
    title: "Pacientes dormidos vuelven solos.",
    body: "Detecta a quien no ha vuelto en 60, 90 o 180 días y lo reactiva con un mensaje personal a tu nombre.",
    bullets: [
      "Segmenta por tratamiento y tiempo dormido",
      "Tu voz, no plantillas genéricas",
      "Dashboard con recuperaciones del mes",
    ],
    mockup: (
      <MockCard
        accent="#7C3AED"
        header="Reactivación · Últimos 30 días"
        rows={[
          { left: "Contactados", right: "127" },
          { left: "Respondieron", right: "84", accent: "#10B981" },
          { left: "Agendaron", right: "41", accent: "#7C3AED" },
          { left: "Ticket promedio", right: "USD 96" },
        ]}
        footer="USD 3.936 recuperados este mes por AURA."
      />
    ),
  },
];

/* ============== LIA features ============== */

const LIA_FEATURES = [
  {
    tabLabel: "Huecos",
    tabIcon: <IconScan />,
    eyebrow: "Inteligencia operativa",
    title: "Encuentra cupos vacíos antes que tú.",
    body: "LIA mira tu agenda 24/7. Detecta cancelaciones, no-shows y huecos imprevistos al instante.",
    bullets: [
      "Cron sobre agenda y base de datos",
      "Cancelaciones de última hora detectadas",
      "Prioriza pacientes por LTV y urgencia",
    ],
    mockup: (
      <MockCard
        accent="#0A0A0A"
        header="LIA · Cupos detectados hoy"
      rows={[
          { left: "11:00", right: "Cancelado por paciente", accent: "#EF4444" },
          { left: "14:30", right: "No-show", accent: "#F59E0B" },
          { left: "17:00", right: "Hueco original" },
        ]}
        footer="LIA reasignando 3 cupos a lista de espera."
      />
    ),
  },
  {
    tabLabel: "Decide",
    tabIcon: <IconBranch />,
    eyebrow: "Canal correcto · cero pisadas",
    title: "Decide a quién contactar y por dónde.",
    body: "Por cada cupo vacío arma una shortlist y le pasa la acción a AURA. Si el paciente prefiere llamada, escala al canal correcto.",
    bullets: [
      "Memoria del paciente compartida con AURA",
      "Canal según historial de respuesta",
      "Si nadie contesta, escala automáticamente",
    ],
    mockup: (
      <MockCard
        accent="#0A0A0A"
        header="LIA · Plan de contacto"
        rows={[
          { left: "11:00", right: "→ Camila S. (LTV alto)", accent: "#7C3AED" },
          { left: "11:00", right: "→ Diego P. (responde rápido)" },
          { left: "11:00", right: "→ Renata M. (interesada en limpieza)" },
        ]}
        footer="AURA envió 3 propuestas en paralelo. ETA primera respuesta: 4 min."
      />
    ),
  },
  {
    tabLabel: "Embudo",
    tabIcon: <IconFunnel />,
    eyebrow: "Recuperación end-to-end",
    title: "Levanta lo que se perdía.",
    body: "Leads tibios, dormidos, cobros pendientes — arma cohortes y los manda a recuperar. Reporta resultados por cohorte.",
    bullets: [
      "Detecta leads que no avanzaron",
      "Reactiva a 60, 90 o 180 días",
      "Reportes con cohortes y resultados",
    ],
    mockup: (
      <MockCard
        accent="#0A0A0A"
        header="LIA · Cohorte recuperación"
        rows={[
          { left: "Cohorte", right: "Dormidos 90 días" },
          { left: "Contactados", right: "846" },
          { left: "Agendados", right: "181", accent: "#7C3AED" },
          { left: "% recuperación", right: "21.4%", accent: "#10B981" },
        ]}
        footer="LIA priorizó por LTV y AURA cerró el agendamiento."
      />
    ),
  },
];

/* ============== Composition ============== */

export default function EmpleadoDigitalLanding() {
  useReveal();

  return (
    <>
      <HeroEquipo />
      <DuoAgentes />

      {/* AURA deep-dive */}
      <AgentSection
        id="aura"
        num="01"
        role="WhatsApp IA"
        name="AURA"
        accent="#7C3AED"
        accentSoft="rgba(124,58,237,0.08)"
        accentBorder="#DDD6FE"
        nameGrad
        sectionEyebrow="AURA en profundidad"
        status={{ kind: "live", label: "Activa ahora" }}
        stat={{ value: "94%", label: "confirmaciones automáticas" }}
        bg="#fff"
        features={AURA_FEATURES}
      />

      {/* LIA deep-dive */}
      <AgentSection
        id="lia"
        num="02"
        role="Cerebro operacional"
        name="LIA"
        accent="#0A0A0A"
        accentSoft="#F3F4F6"
        accentBorder="#E5E7EB"
        sectionEyebrow="LIA en profundidad"
        reverse
        status={{ kind: "dev", label: "Beta · Incluida desde Advanced" }}
        stat={{ value: "+21%", label: "cupos recuperados al mes" }}
        bg="var(--bg-ice)"
        features={LIA_FEATURES}
      />

      <ModosAgendamiento />
      <AdvancedCTA />
      <StickyAdvancedCTA />
    </>
  );
}
