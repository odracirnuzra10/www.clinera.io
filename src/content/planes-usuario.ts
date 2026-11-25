// Propuesta de planes por profesional (Ricardo, 25-nov-2026). Vista previa en /planes-usuario.
// Se cobra solo al profesional con agenda propia: recepción y administración no pagan (supuesto, sin confirmar).
// Los planes vigentes siguen en planes-trial.ts.

export const ANUAL_DESCUENTO = 0.2;

export type PlanUsuario = {
  id: "gratis" | "esencial" | "pro" | "grandes";
  nombre: string;
  /** US$ por profesional al mes, pago mensual. null = a medida. */
  mensualUsd: number | null;
  bajada: string;
  recomendado?: boolean;
  /** Solo lo que este plan suma sobre el anterior. */
  suma: string[];
  cta: "registro" | "asistencia";
};

export const PLANES_USUARIO: PlanUsuario[] = [
  {
    id: "gratis",
    nombre: "Gratis",
    mensualUsd: 0,
    bajada: "Para el profesional que parte solo.",
    suma: ["1 profesional", "1 sucursal", "Recordatorios de cita por WhatsApp"],
    cta: "registro",
  },
  {
    id: "esencial",
    nombre: "Esencial",
    mensualUsd: 15,
    bajada: "Para clínicas que ordenan su operación.",
    suma: [
      "Profesionales y sucursales sin límite",
      "Bandeja de WhatsApp, Instagram y Facebook",
      "Roles y permisos por persona",
      "Recepción y administración no pagan",
    ],
    cta: "registro",
  },
  {
    id: "pro",
    nombre: "Pro",
    mensualUsd: 29,
    bajada: "Para clínicas que quieren que la IA agende.",
    recomendado: true,
    suma: [
      "Agente IA que responde y agenda 24/7",
      "100 conversaciones por profesional, compartidas",
      "Clinera Intelligence: ventas y agenda al día",
      "Onboarding con un ejecutivo",
    ],
    cta: "registro",
  },
  {
    id: "grandes",
    nombre: "Clínicas grandes",
    mensualUsd: null,
    bajada: "Desde 15 profesionales o varias sedes.",
    suma: ["Precio por volumen", "API pública y webhooks", "Ejecutivo dedicado", "Migración de datos asistida"],
    cta: "asistencia",
  },
];

/** Lo que trae todo plan. Va una sola vez, no repetido en cada tarjeta. */
export const INCLUYE_TODOS = [
  "Agenda por profesional",
  "Fichas clínicas editables",
  "Recetas",
  "Consentimientos informados",
  "Cobros y pagos",
  "Datos alojados en Chile",
];

export const EXTRA_CONVERSACIONES = { cantidad: 1000, usd: 48 };

export function precioPorProfesional(mensualUsd: number, anual: boolean): number {
  return anual ? Math.round(mensualUsd * (1 - ANUAL_DESCUENTO)) : mensualUsd;
}
