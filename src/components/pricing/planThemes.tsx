// Temas de color e íconos de las tarjetas de planes (`PlanesVigentes`). Vivían en
// `home-v3/sections.tsx`, atados al catálogo viejo (anterior); acá quedan
// solo los dos que usan las opciones vigentes: Vortex (violeta claro) y Ecosistema
// (magenta claro).

import type { ReactNode } from "react";

export type PlanTheme = {
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  label: string;
  name: string;
  ink: string;
  sub: string;
  panelBg: string;
  panelBorder: string;
  divider: string;
  accent: string;
  ctaPrimaryBg: string;
  ctaPrimaryColor: string;
  ctaPrimaryShadow: string;
  checkBg: string;
  checkStroke: string;
  chipBg: string;
  chipBorder: string;
  iconBg: string;
  iconColor: string;
};

export const TEMA_VORTEX: PlanTheme = {
  cardBg: "linear-gradient(145deg,#FCFAFF 0%,#F0EBFC 100%)",
  cardBorder: "rgba(109,40,217,.20)",
  cardShadow: "0 22px 42px -28px rgba(109,40,217,.52), 0 6px 18px rgba(109,40,217,.08)",
  label: "#3B1E7E",
  name: "#5B21B6",
  ink: "#150B33",
  sub: "#4A3B7C",
  panelBg: "rgba(255,255,255,.60)",
  panelBorder: "rgba(109,40,217,.12)",
  divider: "rgba(109,40,217,.18)",
  accent: "#6D28D9",
  ctaPrimaryBg: "#0A0A0A",
  ctaPrimaryColor: "#fff",
  ctaPrimaryShadow: "none",
  checkBg: "rgba(109,40,217,.15)",
  checkStroke: "#6D28D9",
  chipBg: "rgba(255,255,255,.62)",
  chipBorder: "rgba(109,40,217,.16)",
  iconBg: "rgba(109,40,217,.15)",
  iconColor: "#6D28D9",
};

// Ecosistema: magenta claro, para que íconos y chips tengan contraste.
export const TEMA_ECOSISTEMA: PlanTheme = {
  ...TEMA_VORTEX,
  cardBg: "linear-gradient(145deg,#FFF8FD 0%,#FBE7F8 100%)",
  cardBorder: "rgba(192,38,211,.28)",
  cardShadow: "0 26px 50px -30px rgba(192,38,211,.55), 0 6px 18px rgba(192,38,211,.08)",
  label: "#701A75",
  name: "#A21CAF",
  ink: "#1F0A24",
  sub: "#7A3B7F",
  panelBorder: "rgba(192,38,211,.14)",
  divider: "rgba(192,38,211,.18)",
  accent: "#A21CAF",
  checkBg: "rgba(192,38,211,.13)",
  checkStroke: "#A21CAF",
  chipBorder: "rgba(192,38,211,.16)",
  iconBg: "rgba(192,38,211,.13)",
  iconColor: "#A21CAF",
};

// Íconos de plan (trazo propio, 20px): globo (Vortex) y cumbre (Ecosistema).
export const ICONO_VORTEX: ReactNode = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17" />
    <path d="M12 3.5c2.7 2.4 2.7 14.6 0 17" />
    <path d="M12 3.5c-2.7 2.4-2.7 14.6 0 17" />
  </svg>
);

export const ICONO_ECOSISTEMA: ReactNode = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 19h18" />
    <path d="M5 19l6-11 3.4 6.2L17 10.5 21 19" />
  </svg>
);
