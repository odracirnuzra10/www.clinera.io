"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useScrollPastPercent } from "@/components/cro/useScrollPastPercent";
import { CTA_VENTAS_PATH } from "@/content/planes";
import {
  ASISTENCIA_URL,
  CTA_ASISTENCIA_LABEL,
  CTA_REGISTRO_LABEL,
  registroHref,
  useSearch,
} from "@/components/cta/CtaPar";


const SCROLL_REVEAL_PERCENT = 30;

const HIDDEN_PREFIXES = [
  CTA_VENTAS_PATH,
  "/reserva-tu-hora",
  "/gracias",
  "/contrata",
  "/prueba-gratis",
  "/go",
  "/empleado-digital",
  "/vision-2027",
  "/nuevodiscurso",
  "/ventas2026",
  "/internal",
  // /promo lleva su propia barra fija abajo.
  "/promo",
  // Lleva el formulario arriba; el flotante mandaría a /hablar-con-ventas.
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
  const search = useSearch();
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
      {/* Ricardo, 7-nov-2026: tarjeta flotante oscura (inspirada en loops.so), en escritorio y celular.
          El principal va a /prueba-gratis con la query de la visita; en el celular suma «Solicita asistencia». */}
      <aside className="flota-cta" aria-label="Activa tu cuenta gratis">
        <div className="flota-cab">
          <button type="button" onClick={dismiss} aria-label="Cerrar" className="flota-x">
            ×
          </button>
          <span className="flota-chs" role="img" aria-label="WhatsApp, Facebook, Instagram y agenda">
            <IconoWa />
            <IconoFb />
            <IconoIg />
            <IconoAgenda />
          </span>
          <p className="flota-tit">Activa tu cuenta gratis</p>
          <p className="flota-sub">7 días · sin tarjeta</p>
        </div>
        <a href={registroHref(search)} suppressHydrationWarning data-cta-registro className="flota-go">
          <span>{CTA_REGISTRO_LABEL}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
        <a href={ASISTENCIA_URL} target="_blank" rel="noopener noreferrer" data-cta-asistencia data-sticky="asistencia" className="flota-wa">
          {CTA_ASISTENCIA_LABEL}
        </a>
      </aside>
      <style jsx global>{`
        .flota-cta {
          position: fixed;
          z-index: 50;
          right: 24px;
          bottom: 24px;
          width: 270px;
          background: #111318;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(17, 19, 24, 0.35);
          overflow: hidden;
          font-family: Inter, system-ui, sans-serif;
          animation: flotaEntra 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        @keyframes flotaEntra {
          from {
            transform: translateY(24px);
            opacity: 0;
          }
          to {
            transform: none;
            opacity: 1;
          }
        }
        .flota-cab {
          position: relative;
          padding: 18px 18px 16px;
        }
        .flota-chs {
          display: flex;
          gap: 8px;
          margin-bottom: 14px;
        }
        .flota-chs svg {
          width: 22px;
          height: 22px;
          display: block;
        }
        .flota-tit {
          margin: 0;
          padding-right: 24px;
          font-size: 24px;
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: -0.035em;
          color: #fff;
        }
        .flota-sub {
          margin: 6px 0 0;
          font-family: "Geist Mono", ui-monospace, Menlo, monospace;
          font-size: 11.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
        }
        .flota-x {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
        }
        .flota-x:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }
        .flota-go {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 54px;
          padding: 12px 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: #0b0c10;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
        }
        .flota-go:hover {
          background: #1b1d24;
        }
        .flota-go svg {
          margin-left: auto;
          width: 18px;
          height: 18px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .flota-wa {
          display: none;
        }
        @media (max-width: 768px) {
          .flota-cta {
            left: 12px;
            right: 12px;
            bottom: calc(12px + env(safe-area-inset-bottom));
            width: auto;
          }
          .flota-cab {
            padding: 14px 16px 12px;
          }
          .flota-chs {
            gap: 7px;
            margin: 0 0 8px;
          }
          .flota-chs svg {
            width: 18px;
            height: 18px;
          }
          .flota-tit {
            font-size: 19px;
          }
          .flota-go {
            min-height: 50px;
            padding: 10px 16px;
          }
          .flota-wa {
            display: block;
            padding: 10px 16px 12px;
            background: #0b0c10;
            color: rgba(255, 255, 255, 0.75);
            font-size: 14px;
            text-decoration: underline;
            text-underline-offset: 3px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .flota-cta {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}

function IconoWa() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#25D366" d="M12 2C6.5 2 2 6.3 2 11.6c0 1.9.5 3.7 1.5 5.3L2 22l5.3-1.4c1.5.8 3.2 1.3 4.7 1.3 5.5 0 10-4.3 10-9.6S17.5 2 12 2zm5.7 13.6c-.2.7-1.2 1.2-1.9 1.4-.5.1-1.1.2-3.6-.8-3.1-1.3-5.1-4.5-5.2-4.7-.2-.2-1.3-1.7-1.3-3.3s.8-2.3 1.1-2.6c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.7-.1.3.1 1.9.9 2.2 1.1.3.1.5.2.6.3.1.2.1.8-.1 1.5z" />
    </svg>
  );
}

function IconoFb() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path fill="#fff" d="M13.4 21v-7.6h2.5l.4-3h-2.9V8.5c0-.9.3-1.4 1.5-1.4h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8v3h2.5V21z" />
    </svg>
  );
}

function IconoIg() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="flota-ig" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#FEDA75" />
          <stop offset=".45" stopColor="#D62976" />
          <stop offset="1" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="url(#flota-ig)" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="url(#flota-ig)" strokeWidth="2.2" />
      <circle cx="17.3" cy="6.7" r="1.3" fill="#D62976" />
    </svg>
  );
}

function IconoAgenda() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="1" width="22" height="22" rx="6" fill="#7C3AED" />
      <rect x="5.5" y="7" width="13" height="11.5" rx="2" fill="none" stroke="#fff" strokeWidth="1.8" />
      <path d="M5.5 11h13M9 5v3.5M15 5v3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
