"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Atajo fijo a la demo. No se muestra en /demo, que ya es esa página. */
export default function VerDemoFloat() {
  const pathname = usePathname();
  if (pathname === "/demo" || pathname?.startsWith("/demo/")) return null;

  return (
    <>
      <Link href="/demo" className="ver-demo-float">
        <span className="ver-demo-float-cam" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </span>
        Ver demo
      </Link>
      <style jsx>{`
        :global(.ver-demo-float) {
          position: fixed;
          z-index: 45;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px 8px 8px;
          background: #fff;
          color: #0a0a0a;
          border: 1px solid #e5e7eb;
          border-radius: 999px;
          box-shadow: 0 12px 32px rgba(15, 10, 30, 0.12);
          text-decoration: none;
          font-family: Inter, system-ui, sans-serif;
          font-size: 14px;
          font-weight: 600;
          line-height: 1;
        }
        :global(.ver-demo-float-cam) {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: linear-gradient(135deg, #3b82f6 0%, #7c3aed 50%, #d946ef 100%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 32px;
        }
        @media (max-width: 768px) {
          :global(.ver-demo-float) {
            top: auto;
            bottom: 92px;
            left: 12px;
            transform: none;
          }
        }
      `}</style>
    </>
  );
}
