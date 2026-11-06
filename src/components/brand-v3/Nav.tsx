"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GRAD, Wordmark } from "./Brand";
import { CtaRegistro, CtaAsistencia } from "@/components/cta/CtaPar";

type NavV3Props = {
  /** Destino del botón principal. Sin esto: `/agenda` («Agendar reunión», Ricardo 20-oct-2026). */
  ctaHref?: string;
  ctaLabel?: string;
  /**
   * Enlace discreto «Hablar con ventas» (→ /agenda) junto al botón
   * principal. Apagado por defecto.
   */
  salesLink?: boolean;
};

// Ricardo, 4-nov-2026: el menú lleva los dos CTA del sitio, «Contratar Hex · US$ 35/mes» (Payment
// Link de Stripe, degradado) y «Hablar con ventas» (/agenda, secundario). Se fue el atajo a la demo.
// Las props viejas (ctaHref, ctaLabel, salesLink) se aceptan y se ignoran: todas las páginas llevan el
// mismo par.
export default function NavV3(_props: NavV3Props) {
  void _props;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.86)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid " + (scrolled ? "#EEECEA" : "transparent"),
        transition: "border-color .2s",
      }}
    >
      {/* Top bar */}
      <div style={{ borderBottom: "1px solid #F3F2F0", background: "#FAFAFA" }}>
        <div
          className="nav-v3-top"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "6px 80px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Inter",
            fontSize: 13,
            color: "#6B7280",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>Atendiendo clínicas en Chile, México y toda LATAM</span>
          </div>
          <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
            <Link href="/ayuda" style={{ color: "#6B7280", textDecoration: "none" }}>
              Ayuda y soporte
            </Link>
            <a
              href="https://app.clinera.io/"
              style={{ color: "#0A0A0A", textDecoration: "none", fontWeight: 500 }}
            >
              Iniciar sesión
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className="nav-v3-main"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "14px 80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }} aria-label="Clinera.io">
          <Wordmark size={22} />
        </Link>

        <nav
          className="nav-v3-links"
          style={{
            display: "flex",
            gap: 24,
            fontFamily: "Inter",
            fontSize: 15,
            fontWeight: 500,
            color: "#0A0A0A",
          }}
        >
          {/* Ricardo, 21-oct-2026: el menú es Software (Vortex) · PMFC (la metodología y el
              Ecosistema, en /ecosistema) · Planes. */}
          <Link href="/funciones" style={{ color: "#0A0A0A", textDecoration: "none" }}>
            Software
          </Link>
          <Link
            href="/ecosistema"
            style={{
              background: GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            PMFC
          </Link>
          <Link href="/planes" style={{ color: "#0A0A0A", textDecoration: "none" }}>
            Planes
          </Link>
        </nav>

        <div className="nav-v3-actions" style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <CtaAsistencia tam="sm" />
          <CtaRegistro tam="sm" />
        </div>

        {/* Celular: sólo el principal, corto, junto al menú; los dos van dentro del menú. */}
        <div className="nav-v3-hex-movil">
          <CtaRegistro tam="sm" corto style={{ padding: "8px 14px", minHeight: 40, fontSize: 13.5 }} />
        </div>

        <button
          type="button"
          className="nav-v3-burger"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="nav-v3-mobile">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Link href="/funciones" onClick={() => setMobileOpen(false)} className="nav-v3-mobile-link">Software</Link>
            <Link href="/ecosistema" onClick={() => setMobileOpen(false)} className="nav-v3-mobile-link" style={{ color: "#7C3AED" }}>PMFC</Link>
            <Link href="/planes" onClick={() => setMobileOpen(false)} className="nav-v3-mobile-link">Planes</Link>
            <Link href="/ayuda" onClick={() => setMobileOpen(false)} className="nav-v3-mobile-link-sub">Ayuda y soporte</Link>
            <a
              href="https://app.clinera.io/"
              onClick={() => setMobileOpen(false)}
              className="nav-v3-mobile-link-sub"
            >
              Iniciar sesión
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            <CtaRegistro style={{ width: "100%" }} />
            <CtaAsistencia style={{ width: "100%" }} />
          </div>
        </div>
      )}

      <style jsx>{`
        .nav-v3-hex-movil {
          display: none;
        }
        .nav-v3-burger {
          display: none;
          background: none;
          border: 0;
          padding: 6px;
          cursor: pointer;
        }
        .nav-v3-mobile {
          padding: 20px 24px 28px;
          background: #fff;
          border-top: 1px solid #f0f0f0;
        }
        :global(.nav-v3-mobile-link) {
          padding: 13px 0;
          font-family: Inter, sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #0a0a0a;
          text-decoration: none;
          border-bottom: 1px solid #f3f2f0;
        }
        :global(.nav-v3-mobile-link-sub) {
          padding: 11px 0;
          font-family: Inter, sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #6b7280;
          text-decoration: none;
          border-bottom: 1px solid #f3f2f0;
        }
        @media (max-width: 860px) {
          :global(.nav-v3-top) { display: none !important; }
          :global(.nav-v3-links) { display: none !important; }
          :global(.nav-v3-actions) { display: none !important; }
          .nav-v3-burger { display: inline-flex; }
          .nav-v3-hex-movil { display: inline-flex; margin-left: auto; margin-right: 6px; }
          /* Con «Contratar Hex» en la barra, los 80 px de margen no dejaban espacio para el menú. */
          .nav-v3-main { padding-left: 16px !important; padding-right: 12px !important; }
        }
        @media (max-width: 720px) {
          :global(header > div > div) { padding-left: 28px !important; padding-right: 28px !important; }
        }
      `}</style>
    </header>
  );
}
