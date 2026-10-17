"use client";

import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { ACTIVA_CTA_HREF } from "@/content/activa";

/**
 * Enlace a `/go` que conserva la query de la visita (utm, fbclid, gclid). Un anuncio de Meta no
 * deja nada más que eso para clasificar el origen: perderla manda el lead como «orgánico».
 * El clic normal reenvía la query; con Ctrl/Cmd o botón medio se comporta como un enlace común.
 */
export default function ActivaCta({ children, where, style }: { children: ReactNode; where: string; style?: CSSProperties }) {
  function ir(e: MouseEvent<HTMLAnchorElement>) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    window.location.assign(ACTIVA_CTA_HREF + window.location.search);
  }
  return (
    <a href={ACTIVA_CTA_HREF} onClick={ir} data-activa-cta data-cta-where={where} style={style}>
      {children}
    </a>
  );
}
