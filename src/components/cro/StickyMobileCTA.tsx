"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function StickyMobileCTA() {
  const pathname = usePathname();
  const isDemo = pathname?.startsWith("/demo") === true;
  // Páginas largas de conversión donde el CTA persistente ayuda en móvil.
  const enabled =
    isDemo ||
    pathname === "/" ||
    pathname === "/planes" ||
    pathname?.startsWith("/comparativas") === true;
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (sessionStorage.getItem("sticky-cta-dismissed") === "1") {
      setDismissed(true);
      return;
    }
    // En /demo aparece casi de inmediato; en el resto, pasado el hero
    // para no tapar los CTAs principales.
    const threshold = isDemo ? 80 : 600;
    const onScroll = () => setShow(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled, isDemo]);

  if (!enabled || dismissed || !show) return null;

  const trackClick = (cta: "whatsapp" | "agendar") => {
    if (typeof window === "undefined") return;
    type DL = { push: (e: Record<string, unknown>) => void };
    const dl = (window as unknown as { dataLayer?: DL }).dataLayer;
    if (dl) dl.push({ event: "sticky_cta_click", cta, page_path: pathname });
  };

  const dismiss = () => {
    sessionStorage.setItem("sticky-cta-dismissed", "1");
    setDismissed(true);
  };

  return (
    <>
      <div className="sticky-mobile-cta" role="region" aria-label="Acción rápida Clinera">
        <a
          href="https://wa.me/56985581524?text=Hola%2C%20quiero%20asistencia%20con%20Clinera."
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick("whatsapp")}
          className="sticky-secondary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>
        <Link
          href="/hablar-con-ventas"
          onClick={() => trackClick("agendar")}
          className="sticky-primary"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
          </svg>
          Agendar reunión
        </Link>
        <button
          onClick={dismiss}
          aria-label="Cerrar"
          className="sticky-dismiss"
        >
          ×
        </button>
      </div>
      <style jsx global>{`
        .sticky-mobile-cta {
          position: fixed;
          bottom: calc(12px + env(safe-area-inset-bottom));
          left: 12px;
          right: 12px;
          padding: 10px;
          background: rgba(14, 14, 18, 0.92);
          backdrop-filter: blur(16px) saturate(140%);
          -webkit-backdrop-filter: blur(16px) saturate(140%);
          display: flex;
          gap: 8px;
          align-items: center;
          z-index: 50;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          box-shadow:
            0 18px 40px -12px rgba(0, 0, 0, 0.6),
            0 6px 16px -8px rgba(124, 58, 237, 0.35);
          animation: stickyUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes stickyUp {
          from {
            transform: translateY(140%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .sticky-secondary,
        .sticky-primary {
          flex: 1 1 0;
          min-width: 0;
          text-align: center;
          padding: 14px 12px;
          border-radius: 12px;
          font-family: Inter, system-ui, sans-serif;
          font-weight: 600;
          font-size: 14.5px;
          letter-spacing: -0.01em;
          text-decoration: none;
          line-height: 1.2;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        .sticky-secondary:active,
        .sticky-primary:active {
          transform: scale(0.97);
        }
        .sticky-secondary svg,
        .sticky-primary svg {
          flex-shrink: 0;
        }
        .sticky-secondary {
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.14);
        }
        .sticky-primary {
          background: linear-gradient(135deg, #7C3AED 0%, #D946EF 100%);
          color: #fff;
          box-shadow: 0 10px 26px -8px rgba(124, 58, 237, 0.55);
        }
        .sticky-dismiss {
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
        .sticky-dismiss:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }
        @media (min-width: 769px) {
          .sticky-mobile-cta { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sticky-mobile-cta { animation: none; }
          .sticky-secondary:active,
          .sticky-primary:active { transform: none; }
        }
      `}</style>
    </>
  );
}
