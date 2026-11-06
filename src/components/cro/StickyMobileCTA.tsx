"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useScrollPastPercent } from "@/components/cro/useScrollPastPercent";
import { CTA_VENTAS_PATH } from "@/content/planes";
import { CtaAsistencia, CtaRegistro } from "@/components/cta/CtaPar";


const SCROLL_REVEAL_PERCENT = 30;

const HIDDEN_PREFIXES = [
  CTA_VENTAS_PATH,
  "/reserva-tu-hora",
  "/gracias",
  "/contrata",
  "/go",
  "/empleado-digital",
  "/vision-2027",
  "/nuevodiscurso",
  "/ventas2026",
  "/internal",
  // /promo lleva su propia barra fija abajo.
  "/promo",
  // Lleva el formulario arriba; el flotante mandaría a /agenda.
  "/oferta-clinicas-esteticas",
  // Una pantalla con su propio botón a WhatsApp.
  "/super-promo",
];

function isHiddenPath(pathname: string | null) {
  if (!pathname) return true;
  return HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default function StickyMobileCTA() {
  const pathname = usePathname();
  const enabled = !isHiddenPath(pathname);
  const [dismissed, setDismissed] = useState(false);
  const scrolledPast = useScrollPastPercent(SCROLL_REVEAL_PERCENT, enabled && !dismissed);

  useEffect(() => {
    if (!enabled) return;
    if (sessionStorage.getItem("sticky-cta-dismissed") === "1") {
      setDismissed(true);
    }
  }, [enabled]);

  if (!enabled || dismissed || !scrolledPast) return null;

  const dismiss = () => {
    sessionStorage.setItem("sticky-cta-dismissed", "1");
    setDismissed(true);
  };

  return (
    <>
      {/* Ricardo, 7-nov-2026: los dos CTA del sitio. «Regístrate gratis» va a /contrata con la query
          de la visita; «Solicita asistencia» abre WhatsApp de ventas. */}
      <div className="sticky-agenda-cta" role="region" aria-label="Contratar Clinera">
        <CtaRegistro tam="sm" corto className="sticky-agenda-primary" style={{ flex: "1 1 0", minWidth: 0 }} />
        <CtaAsistencia tam="sm" className="sticky-agenda-ventas" datos={{ "data-sticky": "asistencia" }} />
        <button type="button" onClick={dismiss} aria-label="Cerrar" className="sticky-agenda-dismiss">
          ×
        </button>
      </div>
      <style jsx global>{`
        .sticky-agenda-cta {
          position: fixed;
          z-index: 50;
          display: flex;
          gap: 8px;
          align-items: center;
          animation: stickyAgendaReveal 0.62s cubic-bezier(0.34, 1.35, 0.64, 1) both;
        }
        @keyframes stickyAgendaReveal {
          0% {
            transform: translateY(calc(100% + 28px)) scale(0.94);
            opacity: 0;
          }
          55% {
            transform: translateY(-6px) scale(1.02);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        .sticky-agenda-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          text-decoration: none;
          font-family: Inter, system-ui, sans-serif;
          font-weight: 600;
          font-size: 14.5px;
          letter-spacing: -0.01em;
          line-height: 1.2;
          color: #fff;
          background: linear-gradient(135deg, #7c3aed 0%, #d946ef 100%);
          box-shadow: 0 10px 26px -8px rgba(124, 58, 237, 0.55);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .sticky-agenda-ventas {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          text-decoration: none;
          font-family: Inter, system-ui, sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #fff;
          border: 1.5px solid rgba(255, 255, 255, 0.55);
          white-space: nowrap;
        }
        .sticky-agenda-primary:active {
          transform: scale(0.97);
        }
        .sticky-agenda-dismiss {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: rgba(0, 0, 0, 0.55);
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          flex-shrink: 0;
          box-shadow: 0 8px 20px -10px rgba(0, 0, 0, 0.35);
        }
        @media (max-width: 768px) {
          .sticky-agenda-cta {
            bottom: calc(12px + env(safe-area-inset-bottom));
            left: 12px;
            right: 12px;
            padding: 10px;
            background: rgba(14, 14, 18, 0.92);
            backdrop-filter: blur(16px) saturate(140%);
            -webkit-backdrop-filter: blur(16px) saturate(140%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 18px;
            box-shadow:
              0 18px 40px -12px rgba(0, 0, 0, 0.6),
              0 6px 16px -8px rgba(124, 58, 237, 0.35);
          }
          .sticky-agenda-primary {
            flex: 1 1 0;
            min-width: 0;
            padding: 12px 10px !important;
            border-radius: 12px !important;
          }
          .sticky-agenda-ventas {
            flex: 1 1 0;
            min-width: 0;
            padding: 12px 10px;
            border-radius: 12px;
          }
        }
        @media (min-width: 769px) {
          .sticky-agenda-cta {
            bottom: 24px;
            right: 24px;
            left: auto;
            padding: 0;
            background: transparent;
            border: 0;
            box-shadow: none;
          }
          .sticky-agenda-primary {
            padding: 14px 20px !important;
            border-radius: 999px;
            white-space: nowrap;
          }
          /* En escritorio el menú ya lleva «Solicita asistencia»: la barra queda con el principal (!important: el botón trae display en línea). */
          .sticky-agenda-ventas {
            display: none !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sticky-agenda-cta {
            animation: none;
          }
          .sticky-agenda-primary:active {
            transform: none;
          }
        }
      `}</style>
    </>
  );
}
