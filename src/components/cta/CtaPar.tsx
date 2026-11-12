"use client";

// Los dos únicos CTA del sitio (Ricardo, 7-nov-2026; reemplaza «Contratar Hex» + «Hablar con ventas» del 4-nov):
// · Principal «Regístrate gratis», en degradado. Al hacer clic abre el modal de registro en la misma página
//   (src/components/registro/RegistroModal.tsx, Ricardo 7-nov-2026); el href a /prueba-gratis queda solo de respaldo sin JS.
//   La landing /prueba-gratis es para los anuncios.
// · Secundario «Solicita asistencia» → WhatsApp de ventas con «necesito asistencia», blanco con borde.
// El principal conserva la query de la visita (utm, gclid, fbclid) para que el Lead de la landing
// quede atribuido. Saca `plan`, `pago` y `carrito`: con esas claves /contrata abre el carrito de Flux.

import { useSyncExternalStore, type CSSProperties } from "react";
import { GRAD } from "@/components/brand-v3/Brand";

export const CTA_REGISTRO_LABEL = "Regístrate gratis";
export const CTA_ASISTENCIA_LABEL = "Solicita asistencia";
export const REGISTRO_PATH = "/prueba-gratis";
export const ASISTENCIA_URL = "https://wa.me/56985581524?text=necesito%20asistencia";

const noop = () => () => {};
const leerSearch = () => window.location.search;
const leerSearchServidor = () => "";

/** La query de la visita, leída en el navegador (en el servidor, vacía). */
export function useSearch(): string {
  return useSyncExternalStore(noop, leerSearch, leerSearchServidor);
}

/** /contrata con la query de la visita, sin las claves que abren el carrito. */
export function registroHref(search: string): string {
  const q = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  for (const k of ["plan", "pago", "carrito", "session_id"]) q.delete(k);
  const s = q.toString();
  return s ? `${REGISTRO_PATH}?${s}` : REGISTRO_PATH;
}

type Tam = "md" | "sm";

export function estiloPrincipal(tam: Tam = "md"): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: tam === "sm" ? 44 : 50,
    padding: tam === "sm" ? "10px 16px" : "13px 22px",
    borderRadius: 999,
    background: GRAD,
    color: "#fff",
    fontFamily: "Inter, system-ui, sans-serif",
    fontWeight: 700,
    fontSize: tam === "sm" ? 14 : 16,
    textDecoration: "none",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  };
}

export function estiloSecundario(tam: Tam = "md", oscuro = false): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: tam === "sm" ? 44 : 50,
    padding: tam === "sm" ? "10px 16px" : "13px 22px",
    borderRadius: 999,
    background: oscuro ? "transparent" : "#fff",
    color: oscuro ? "#fff" : "#0A0A0A",
    border: oscuro ? "1.5px solid rgba(255,255,255,.55)" : "1.5px solid #D1D5DB",
    fontFamily: "Inter, system-ui, sans-serif",
    fontWeight: 600,
    fontSize: tam === "sm" ? 14 : 16,
    textDecoration: "none",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  };
}

function IconoWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ flex: "none" }}>
      <path
        fill="#25D366"
        d="M12 2C6.5 2 2 6.3 2 11.6c0 1.9.5 3.7 1.5 5.3L2 22l5.3-1.4c1.5.8 3.2 1.3 4.7 1.3 5.5 0 10-4.3 10-9.6S17.5 2 12 2zm5.7 13.6c-.2.7-1.2 1.2-1.9 1.4-.5.1-1.1.2-3.6-.8-3.1-1.3-5.1-4.5-5.2-4.7-.2-.2-1.3-1.7-1.3-3.3s.8-2.3 1.1-2.6c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.7-.1.3.1 1.9.9 2.2 1.1.3.1.5.2.6.3.1.2.1.8-.1 1.5z"
      />
    </svg>
  );
}

/** Botón principal: «Regístrate gratis» → /contrata. */
export function CtaRegistro({
  tam = "md",
  corto = false,
  style,
  className,
  datos,
  texto,
}: {
  tam?: Tam;
  /** Texto propio del botón (el home dice «Crea tu cuenta GRATIS»). Por defecto, «Regístrate gratis». */
  texto?: string;
  /** Se conserva por compatibilidad: el texto ya es corto. */
  corto?: boolean;
  style?: CSSProperties;
  className?: string;
  /** Atributos data-* extra (p. ej. los que leen las pruebas). */
  datos?: Record<string, string>;
}) {
  void corto;
  const search = useSearch();
  return (
    <a
      {...datos}
      href={registroHref(search)}
      suppressHydrationWarning
      data-cta-registro
      className={className}
      style={{ ...estiloPrincipal(tam), ...style }}
    >
      {texto ?? CTA_REGISTRO_LABEL}
    </a>
  );
}

/** Botón secundario: «Solicita asistencia» → WhatsApp de ventas. */
export function CtaAsistencia({
  tam = "md",
  oscuro = false,
  style,
  className,
  datos,
}: {
  tam?: Tam;
  oscuro?: boolean;
  /** Se ignora: venía de cuando el secundario iba a /hablar-con-ventas con lead_source. */
  extra?: Record<string, string>;
  style?: CSSProperties;
  className?: string;
  datos?: Record<string, string>;
}) {
  return (
    <a
      {...datos}
      href={ASISTENCIA_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-cta-asistencia
      className={className}
      style={{ ...estiloSecundario(tam, oscuro), ...style }}
    >
      <IconoWhatsApp />
      {CTA_ASISTENCIA_LABEL}
    </a>
  );
}

/** El par: principal + secundario. */
export default function CtaPar({
  tam = "md",
  oscuro = false,
  centrado = false,
  apilado = false,
  style,
}: {
  tam?: Tam;
  oscuro?: boolean;
  centrado?: boolean;
  apilado?: boolean;
  extra?: Record<string, string>;
  style?: CSSProperties;
}) {
  return (
    <div
      data-cta-par
      style={{
        display: "flex",
        flexDirection: apilado ? "column" : "row",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: centrado ? "center" : "flex-start",
        alignItems: apilado ? "stretch" : "center",
        ...style,
      }}
    >
      <CtaRegistro tam={tam} />
      <CtaAsistencia tam={tam} oscuro={oscuro} />
    </div>
  );
}
