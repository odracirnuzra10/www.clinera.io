// Lo que traen todos los planes (agenda, fichas, recetas, consentimientos), dentro de cada tarjeta.
// Lo usan /planes, el home (vía PlanesTrial) y /planes2 (PlanesNuevos).

import type { ReactNode } from "react";
import { INCLUIDO_TITULO, INCLUIDO_TODOS } from "@/content/planes-trial";
import s from "./PlanesTrial.module.css";

// Íconos de línea, un solo color (azul médico). Sin librería: son cuatro.
const ICONOS: Record<string, ReactNode> = {
  agenda: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4M8 13h3M8 16.5h6" />
    </>
  ),
  fichas: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
      <path d="M9 3.5h6v2.5H9zM12 10v5M9.5 12.5h5M9 18h6" />
    </>
  ),
  recetas: (
    <>
      <path d="M6 3.5h9l3 3V20.5H6z" />
      <path d="M9 9h2.5a2 2 0 010 4H9V9zm0 4v4M11.5 13l3 4" />
    </>
  ),
  consentimientos: (
    <>
      <path d="M6 3.5h12v17H6z" />
      <path d="M9 8h6M9 11h6M9 17c1.2-1.6 2-1.6 2.6 0 .5 1.2 1.3 1.2 2.4-.4" />
    </>
  ),
};

export default function IncluidoBase() {
  return (
    <ul className={s.base} data-incluido-card aria-label={INCLUIDO_TITULO}>
      {INCLUIDO_TODOS.map((f) => (
        <li key={f.id}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {ICONOS[f.id]}
          </svg>
          {f.titulo}
        </li>
      ))}
    </ul>
  );
}
