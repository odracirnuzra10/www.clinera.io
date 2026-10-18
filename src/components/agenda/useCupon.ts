"use client";

// El cupón vence al día siguiente de la PRIMERA visita (Ricardo, 18-oct-2026).
// La fecha se guarda en el navegador para que no se corra cada vez que vuelve;
// sin almacenamiento (modo privado), se cuenta desde hoy. Lo comparten /agenda,
// /planes y /clinica-estetica: la primera visita a cualquiera de ellas fija la fecha.

import { useEffect, useSyncExternalStore } from "react";
import { CUPON_PRIMERA_VISITA_KEY, fechaLarga, venceCupon, ymdChile } from "@/content/agenda-oferta";

const noop = () => () => {};

/** Último día del cupón según la primera visita guardada (o hoy). */
function leerVenceCupon(): string {
  let primera = ymdChile(new Date());
  try {
    const guardada = window.localStorage.getItem(CUPON_PRIMERA_VISITA_KEY);
    if (guardada && /^\d{4}-\d{2}-\d{2}$/.test(guardada)) primera = guardada;
  } catch {
    /* sin almacenamiento */
  }
  return venceCupon(primera);
}

/** YYYY-MM-DD del último día válido; `null` en el servidor. */
export function useVenceCupon(): string | null {
  const vence = useSyncExternalStore(noop, leerVenceCupon, () => null);
  useEffect(() => {
    try {
      if (!window.localStorage.getItem(CUPON_PRIMERA_VISITA_KEY)) {
        window.localStorage.setItem(CUPON_PRIMERA_VISITA_KEY, ymdChile(new Date()));
      }
    } catch {
      /* sin almacenamiento: cuenta desde hoy */
    }
  }, []);
  return vence;
}

/** «hasta mañana, lunes 19 de octubre» / «hasta hoy, …» / «hasta el …». */
export function textoVence(vence: string): string {
  const hoy = ymdChile(new Date());
  if (vence === hoy) return `hasta hoy, ${fechaLarga(vence)}`;
  if (vence === venceCupon(hoy)) return `hasta mañana, ${fechaLarga(vence)}`;
  return `hasta el ${fechaLarga(vence)}`;
}
