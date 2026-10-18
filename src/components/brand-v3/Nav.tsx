"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { CtaPrimary, GRAD, Wordmark } from "./Brand";

type NavV3Props = {
  /** Destino del botón principal. Sin esto: `/agenda` («Hablar con ventas», Ricardo 18-oct-2026). */
  ctaHref?: string;
  ctaLabel?: string;
  /**
   * Enlace discreto «Hablar con ventas» junto al botón principal. Apagado por
   * defecto desde el 18-oct-2026: el botón principal ya es ventas.
   */
  salesLink?: boolean;
};

// Ricardo, 18-oct-2026: el CTA vuelve a ser «Hablar con ventas» → /agenda.
// /go (Go! US$ 17) sigue existiendo, pero el sitio ya no lo promueve.
const DEFAULT_CTA_HREF = "/agenda";
const DEFAULT_CTA_LABEL = "Hablar con ventas";
const SALES_HREF = "/agenda";

const noop = () => () => {};
const readSearch = () => window.location.search;
const readSearchServer = () => "";

export default function NavV3({ ctaHref, ctaLabel, salesLink }: NavV3Props) {
  // El botón principal ya es ventas: el enlace discreto duplicaría el mismo destino.
  const showSales = salesLink ?? false;
  // Al ir a /agenda se conserva la query de la visita (UTM, fbclid, gclid): la
  // atribución del lead depende de ella.
  const search = useSyncExternalStore(noop, readSearch, readSearchServer);
  const primaryHref = ctaHref ?? `${DEFAULT_CTA_HREF}${search}`;
  const primaryLabel = ctaLabel ?? DEFAULT_CTA_LABEL;
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
            <Link
              href="/demo"
              style={{
                color: "#7C3AED",
                textDecoration: "none",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: "#10B981",
                  display: "inline-block",
                }}
                className="live-dot"
              />
              Ver demo 3 min
            </Link>
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
          <Link
            href="/#clinera-intelligence"
            style={{
              background: GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Clinera O.S.
          </Link>
          <Link href="/funciones" style={{ color: "#0A0A0A", textDecoration: "none" }}>
            Funciones
          </Link>
          <Link href="/planes" style={{ color: "#0A0A0A", textDecoration: "none" }}>
            Planes
          </Link>
          <Link href="/prensa" style={{ color: "#0A0A0A", textDecoration: "none" }}>
            Prensa
          </Link>
          <Link href="/novedades" style={{ color: "#0A0A0A", textDecoration: "none" }}>
            Novedades
          </Link>
        </nav>

        <div className="nav-v3-actions" style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {showSales && <QuietCta href={SALES_HREF} label="Hablar con ventas" />}
          <CtaPrimary
            as={Link}
            href={primaryHref}
            style={{ padding: "10px 16px", fontSize: 14 }}
          >
            {primaryLabel} <span style={{ marginLeft: 2 }}>→</span>
          </CtaPrimary>
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
            <Link href="/#clinera-intelligence" onClick={() => setMobileOpen(false)} className="nav-v3-mobile-link" style={{ color: "#7C3AED" }}>Clinera O.S.</Link>
            <Link href="/funciones" onClick={() => setMobileOpen(false)} className="nav-v3-mobile-link">Funciones</Link>
            <Link href="/planes" onClick={() => setMobileOpen(false)} className="nav-v3-mobile-link">Planes</Link>
            <Link href="/prensa" onClick={() => setMobileOpen(false)} className="nav-v3-mobile-link">Prensa</Link>
            <Link href="/novedades" onClick={() => setMobileOpen(false)} className="nav-v3-mobile-link">Novedades</Link>
            <Link href="/demo" onClick={() => setMobileOpen(false)} className="nav-v3-mobile-link" style={{ color: "#7C3AED" }}>Ver demo 3 min</Link>
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
            <CtaPrimary
              as={Link}
              href={primaryHref}
              onClick={() => setMobileOpen(false)}
              style={{ width: "100%", justifyContent: "center", padding: "14px 20px" }}
            >
              {primaryLabel} <span>→</span>
            </CtaPrimary>
            {showSales && (
              <QuietCta href={SALES_HREF} label="Hablar con ventas" block onNavigate={() => setMobileOpen(false)} />
            )}
          </div>
        </div>
      )}

      <style jsx>{`
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
        }
        @media (max-width: 720px) {
          :global(header > div > div) { padding-left: 28px !important; padding-right: 28px !important; }
        }
      `}</style>
    </header>
  );
}

/**
 * Enlace discreto del header. Conserva la query de la visita (UTM, click ids):
 * la atribución del lead que llegue a /agenda depende de ella.
 */
function QuietCta({
  href,
  label,
  block,
  onNavigate,
}: {
  href: string;
  label: string;
  block?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={(ev) => {
        ev.preventDefault();
        onNavigate?.();
        const [path, own = ""] = href.split("?");
        const q = new URLSearchParams(window.location.search);
        new URLSearchParams(own).forEach((v, k) => q.set(k, v));
        const qs = q.toString();
        window.location.href = qs ? `${path}?${qs}` : path;
      }}
      style={{
        display: block ? "block" : "inline-block",
        textAlign: block ? "center" : undefined,
        padding: block ? "12px 16px" : "8px 12px",
        fontFamily: "Inter",
        fontSize: 14,
        fontWeight: 500,
        color: "#6B7280",
        textDecoration: "none",
        borderRadius: 8,
      }}
    >
      {label}
    </a>
  );
}
