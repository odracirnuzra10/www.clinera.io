"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Vigente hasta el 7 de octubre de 2026 inclusive (hora de Chile, UTC-3).
const CYBER_HASTA = Date.parse("2026-10-08T00:00:00-03:00");
const GRAD = "linear-gradient(90deg, #009FE3 0%, #7C3AED 50%, #D946EF 100%)";

function restante(ahora: number) {
  const ms = Math.max(0, CYBER_HASTA - ahora);
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`;
}

/**
 * TEMPORAL — promo Cyber Clinera, hasta el 7 de octubre de 2026 (se oculta sola).
 * Franja bajo el navbar que se queda pegada mientras se hace scroll
 * (sticky bajo la altura real del <header>). Se retira borrando este archivo
 * y su uso en HomeV3.tsx. El catálogo (`pricing.ts`, contratos) NO cambia:
 * el costo de implementación $0 se concede en la venta, no aquí.
 */
export default function CyberClineraBanner() {
  const [vigente, setVigente] = useState(true);
  const [top, setTop] = useState(0);
  const [cuenta, setCuenta] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      setVigente(now < CYBER_HASTA);
      setCuenta(restante(now));
    };
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  // La franja se pega justo debajo del navbar, sea cual sea su alto (móvil/desktop).
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    let raf = 0;
    const medir = () => {
      raf = 0;
      setTop(Math.max(0, Math.round(header.getBoundingClientRect().bottom)));
    };
    const pedir = () => { if (!raf) raf = requestAnimationFrame(medir); };
    medir();
    const ro = new ResizeObserver(pedir);
    ro.observe(header);
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [vigente]);

  if (!vigente) return null;

  return (
    <aside
      aria-label="Promoción Cyber Clinera"
      data-promo="cyber-clinera"
      className="cyber-strip"
      style={{ top }}
    >
      <span aria-hidden className="cyber-strip__shine" />
      <div className="cyber-strip__inner">
        <span className="cyber-strip__tag">
          <span aria-hidden className="cyber-strip__dot" />
          Cyber Clinera
        </span>
        <p className="cyber-strip__text">
          Aprovecha Cyber Clinera hasta el 7 de octubre y contrata con costo de implementación $0
        </p>
        {cuenta ? (
          <span className="cyber-strip__count" aria-label={`Quedan ${cuenta}`}>
            Quedan <b>{cuenta}</b>
          </span>
        ) : null}
        <Link href="/agenda" className="cyber-strip__cta">
          Agenda tu demo
          <span aria-hidden>→</span>
        </Link>
      </div>
      <style>{`
        .cyber-strip {
          position: sticky;
          z-index: 40;
          overflow: hidden;
          background: linear-gradient(100deg, #0B0D12 0%, #1B1533 55%, #2A1245 100%);
          color: #fff;
          border-bottom: 1px solid rgba(217,70,239,.35);
          box-shadow: 0 10px 30px -12px rgba(124,58,237,.55);
        }
        .cyber-strip::before {
          content: "";
          position: absolute; left: 0; right: 0; top: 0; height: 2px;
          background: ${GRAD};
        }
        .cyber-strip__shine {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(110deg, transparent 35%, rgba(255,255,255,.10) 50%, transparent 65%);
          transform: translateX(-100%);
          animation: cyberShine 5.5s ease-in-out infinite;
        }
        @keyframes cyberShine {
          0%, 55% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes cyberPulse {
          0% { box-shadow: 0 0 0 0 rgba(217,70,239,.7); }
          70% { box-shadow: 0 0 0 8px rgba(217,70,239,0); }
          100% { box-shadow: 0 0 0 0 rgba(217,70,239,0); }
        }
        .cyber-strip__inner {
          position: relative;
          max-width: 1200px; margin: 0 auto;
          padding: 10px 80px;
          display: flex; align-items: center; justify-content: center; gap: 18px;
          font-family: Inter, system-ui, sans-serif;
        }
        .cyber-strip__tag {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase;
          color: #F0ABFC; white-space: nowrap;
        }
        .cyber-strip__dot {
          width: 7px; height: 7px; border-radius: 50%; background: #D946EF;
          animation: cyberPulse 1.8s infinite;
        }
        .cyber-strip__text {
          margin: 0; font-size: 15px; font-weight: 600; letter-spacing: -.01em; line-height: 1.3;
        }
        .cyber-strip .cyber-strip__text { color: #fff; }
        .cyber-strip .cyber-strip__tag { color: #F0ABFC; }
        .cyber-strip .cyber-strip__cta { color: #fff; }
        .cyber-strip__count {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 12px; color: rgba(255,255,255,.7); white-space: nowrap;
          padding: 4px 10px; border-radius: 999px;
          background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14);
        }
        .cyber-strip__count b { color: #fff; font-weight: 700; }
        .cyber-strip__cta {
          display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;
          padding: 8px 16px; border-radius: 999px;
          background: ${GRAD}; color: #fff; text-decoration: none;
          font-size: 13.5px; font-weight: 700; white-space: nowrap;
          transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s;
        }
        .cyber-strip__cta:hover { transform: translateY(-1px); box-shadow: 0 8px 20px -6px rgba(124,58,237,.8); }
        @media (max-width: 900px) {
          .cyber-strip__inner { padding: 9px 14px; gap: 10px; justify-content: space-between; }
          .cyber-strip__count { display: none; }
          .cyber-strip__tag { font-size: 10px; letter-spacing: .12em; }
          .cyber-strip__text { font-size: 12.5px; }
          .cyber-strip__cta { padding: 7px 12px; font-size: 12.5px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cyber-strip__shine, .cyber-strip__dot { animation: none; }
        }
      `}</style>
    </aside>
  );
}
