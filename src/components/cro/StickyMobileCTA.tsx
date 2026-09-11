"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useScrollPastPercent } from "@/components/cro/useScrollPastPercent";

function subscribeLocation() {
  return () => {};
}
function getAgendaHref() {
  return window.location.search ? "/agenda" + window.location.search : "/agenda";
}
function getAgendaHrefServer() {
  return "/agenda";
}

const SCROLL_REVEAL_PERCENT = 30;

const HIDDEN_PREFIXES = [
  "/agenda",
  "/reserva-tu-hora",
  "/gracias",
  "/contrata",
  "/empleado-digital",
  "/vision-2027",
  "/nuevodiscurso",
  "/ventas2026",
  "/internal",
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
  const agendaHref = useSyncExternalStore(
    subscribeLocation,
    getAgendaHref,
    getAgendaHrefServer,
  );

  useEffect(() => {
    if (!enabled) return;
    if (sessionStorage.getItem("sticky-cta-dismissed") === "1") {
      setDismissed(true);
    }
  }, [enabled]);

  if (!enabled || dismissed || !scrolledPast) return null;

  const trackClick = () => {
    if (typeof window === "undefined") return;
    type DL = { push: (e: Record<string, unknown>) => void };
    const dl = (window as unknown as { dataLayer?: DL }).dataLayer;
    if (dl) dl.push({ event: "sticky_cta_click", cta: "agendar", page_path: pathname });
  };

  const dismiss = () => {
    sessionStorage.setItem("sticky-cta-dismissed", "1");
    setDismissed(true);
  };

  return (
    <>
      <div className="sticky-agenda-cta" role="region" aria-label="Agendar demo Clinera">
        <Link href={agendaHref} onClick={trackClick} className="sticky-agenda-primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
          </svg>
          Agendar demo
        </Link>
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
            padding: 14px 12px;
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
            padding: 14px 20px;
            border-radius: 999px;
            white-space: nowrap;
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
