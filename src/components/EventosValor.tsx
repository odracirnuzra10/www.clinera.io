"use client";

// Dispara los eventos con valor de la campaña de tráfico (src/lib/eventosValor.ts).
// Montado una sola vez en layout.tsx. No pinta nada.

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { shouldInitMetaPixel } from "@/lib/metaEvents";
import {
  dispararEventoValor,
  esEnlaceWhatsApp,
  esNavegacionProfunda,
  profundaReciente,
} from "@/lib/eventosValor";

const K_VISITA = "cl_ev_visita";
const K_PAGINAS = "cl_ev_paginas";
const K_CONTACT = "cl_ev_contact";
const K_PROFUNDA = "cl_ev_profunda_ts";

function activo(): boolean {
  if (typeof window === "undefined") return false;
  // Las pruebas lo encienden en localhost; en producción manda el mismo corte que el pixel.
  if ((window as unknown as { __CLINERA_EVENTOS_TEST?: boolean }).__CLINERA_EVENTOS_TEST) return true;
  return shouldInitMetaPixel(window.location.hostname);
}

function leer<T>(s: Storage, k: string, def: T): T {
  try {
    const v = s.getItem(k);
    return v ? (JSON.parse(v) as T) : def;
  } catch {
    return def;
  }
}

function guardar(s: Storage, k: string, v: unknown): void {
  try {
    s.setItem(k, JSON.stringify(v));
  } catch {
    /* sin storage: el evento puede repetirse, nunca corta la página */
  }
}

let segundos = 0;

function revisarProfunda(): void {
  const paginas = leer<string[]>(sessionStorage, K_PAGINAS, []);
  if (!esNavegacionProfunda({ paginas, segundos })) return;
  const ahora = Date.now();
  if (profundaReciente(leer<number | null>(localStorage, K_PROFUNDA, null), ahora)) return;
  guardar(localStorage, K_PROFUNDA, ahora);
  void dispararEventoValor("NavegacionProfunda", { paginas: new Set(paginas).size, segundos });
}

export default function EventosValor() {
  const pathname = usePathname();

  // Cada página: la primera de la sesión es VisitaWeb; todas suman a la navegación profunda.
  useEffect(() => {
    if (!activo() || !pathname) return;
    if (!leer<boolean>(sessionStorage, K_VISITA, false)) {
      guardar(sessionStorage, K_VISITA, true);
      void dispararEventoValor("VisitaWeb");
    }
    const paginas = leer<string[]>(sessionStorage, K_PAGINAS, []);
    if (!paginas.includes(pathname)) guardar(sessionStorage, K_PAGINAS, [...paginas, pathname].slice(-20));
    revisarProfunda();
  }, [pathname]);

  // 60 s con la pestaña a la vista; clic a WhatsApp.
  useEffect(() => {
    if (!activo()) return;
    const t = window.setInterval(() => {
      if (document.hidden) return;
      segundos += 1;
      if (segundos === 60) revisarProfunda();
    }, 1000);
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as Element | null)?.closest?.("a");
      const href = a?.getAttribute("href") ?? "";
      if (!esEnlaceWhatsApp(href)) return;
      if (leer<boolean>(sessionStorage, K_CONTACT, false)) return;
      guardar(sessionStorage, K_CONTACT, true);
      void dispararEventoValor("Contact", { canal: "whatsapp" });
    };
    document.addEventListener("click", onClick, true);
    return () => {
      window.clearInterval(t);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
