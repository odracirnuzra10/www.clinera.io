"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function StickyAdvancedCTA() {
  const pathname = usePathname();
  const isEmpleadoDigital = pathname?.startsWith("/empleado-digital") === true;
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isEmpleadoDigital) return;
    if (sessionStorage.getItem("empleado-digital-sticky-dismissed") === "1") {
      setDismissed(true);
      return;
    }
    const onScroll = () => setShow(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isEmpleadoDigital]);

  if (!isEmpleadoDigital || dismissed || !show) return null;

  const dismiss = () => {
    sessionStorage.setItem("empleado-digital-sticky-dismissed", "1");
    setDismissed(true);
  };

  return (
    <>
      <div className="equipo-sticky" role="region" aria-label="Agendar demo">
        <a
          href="/hablar-con-ventas"
          className="equipo-sticky-primary"
        >
          Agendar demo
        </a>
        <button
          onClick={dismiss}
          aria-label="Cerrar"
          className="equipo-sticky-dismiss"
          type="button"
        >
          ×
        </button>
      </div>
      <style jsx global>{`
        .equipo-sticky {
          position: fixed;
          bottom: calc(12px + env(safe-area-inset-bottom));
          left: 12px;
          right: 12px;
          padding: 10px;
          background: rgba(14, 14, 18, 0.94);
          backdrop-filter: blur(16px) saturate(140%);
          -webkit-backdrop-filter: blur(16px) saturate(140%);
          display: flex;
          gap: 8px;
          align-items: center;
          z-index: 50;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          box-shadow:
            0 18px 40px -12px rgba(0, 0, 0, 0.55),
            0 6px 16px -8px rgba(124, 58, 237, 0.4);
          animation: equipoStickyUp 0.42s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes equipoStickyUp {
          from { transform: translateY(140%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .equipo-sticky-primary {
          flex: 1 1 0;
          min-width: 0;
          text-align: center;
          padding: 14px 12px;
          border-radius: 12px;
          font-family: var(--font-main), Inter, system-ui, sans-serif;
          font-weight: 700;
          font-size: 14.5px;
          letter-spacing: -0.01em;
          text-decoration: none;
          line-height: 1.2;
          color: #fff;
          background: linear-gradient(135deg, #009FE3 0%, #7C3AED 50%, #C850C0 100%);
          box-shadow: 0 10px 26px -8px rgba(124, 58, 237, 0.55);
          transition: transform 0.15s ease;
        }
        .equipo-sticky-primary:active {
          transform: scale(0.97);
        }
        .equipo-sticky-dismiss {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.7);
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          flex-shrink: 0;
          transition: color 0.15s ease, background 0.15s ease;
        }
        .equipo-sticky-dismiss:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }
        @media (min-width: 769px) {
          .equipo-sticky { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .equipo-sticky { animation: none; }
          .equipo-sticky-primary:active { transform: none; }
        }
      `}</style>
    </>
  );
}
