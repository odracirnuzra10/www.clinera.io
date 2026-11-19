"use client";

// Círculo dibujado a mano (degradado de marca) alrededor de una palabra, que se dibuja solo al entrar en pantalla.
// Formato Clinera × heymark (Ricardo, 19-nov-2026): docs/formato-diseno-clinera.md.

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function MarcaMano({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [dibujado, setDibujado] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          window.setTimeout(() => setDibujado(true), 350);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} data-marca-mano style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
      {children}
      <svg
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ position: "absolute", left: "-6%", top: "-18%", width: "112%", height: "140%", overflow: "visible", pointerEvents: "none" }}
      >
        <defs>
          <linearGradient id="marca-mano-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3B82F6" />
            <stop offset=".5" stopColor="#7C3AED" />
            <stop offset="1" stopColor="#D946EF" />
          </linearGradient>
        </defs>
        <path
          d="M40 26 C 140 4, 330 6, 380 36 C 410 62, 380 104, 270 112 C 170 120, 40 112, 14 84 C -6 60, 20 30, 110 18"
          fill="none"
          stroke="url(#marca-mano-g)"
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 1100,
            strokeDashoffset: dibujado ? 0 : 1100,
            transition: "stroke-dashoffset 1.4s cubic-bezier(.65,0,.35,1)",
          }}
        />
      </svg>
    </span>
  );
}
