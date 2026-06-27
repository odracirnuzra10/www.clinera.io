"use client";

import { CSSProperties, ElementType, ReactNode } from "react";

/* ============================================================
   Brand primitives — Clinera v3 (blue → purple → pink gradient)
   ============================================================ */

export const GRAD =
  "linear-gradient(135deg,#3B82F6 0%,#7C3AED 50%,#D946EF 100%)";

export function Isotipo({ size = 32, radius = 8 }: { size?: number; radius?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: GRAD,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: Math.round(size * 0.55),
        fontFamily: "Inter",
        letterSpacing: "-0.02em",
        boxShadow: "0 6px 16px -6px rgba(124,58,237,.45)",
      }}
    >
      c
    </div>
  );
}

export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Isotipo size={Math.round(size * 1.45)} radius={Math.round(size * 0.36)} />
      <div
        style={{
          fontSize: size,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#0A0A0A",
          fontFamily: "Inter",
        }}
      >
        clinera<span style={{ color: "#10B981" }}>.</span>io
      </div>
    </div>
  );
}

export function CnnLogo({
  height = 26,
  color = "#CC0000",
  style,
}: {
  height?: number;
  color?: string;
  style?: CSSProperties;
}) {
  // Marca CNN oficial (simple-icons, path único). viewBox recortado al wordmark.
  const width = Math.round(height * 2);
  return (
    <svg
      role="img"
      aria-label="CNN"
      viewBox="0 6 24 12"
      height={height}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", ...style }}
    >
      <title>CNN</title>
      <path
        fill={color}
        d="M23.9962 15.514c0 2.0638-2.6676 3.0547-4.0789.6576-.1012-.173-2.3252-4.0032-2.3252-4.0032v3.3457c0 2.0637-2.6663 3.0546-4.0776.6575-.1025-.173-2.3253-4.0032-2.3253-4.0032v3.1547c0 1.4318-.8498 2.2073-2.1791 2.2073H5.5299a5.5299 5.5299 0 010-11.0598h1.7946v1.328H5.5299a4.2019 4.2019 0 100 8.4038h3.4494a.8973.8973 0 00.8794-.878V8.524a.2692.2692 0 01.1935-.273c.141-.0384.2897.0487.3987.2333l2.1522 3.7084c1.251 2.1573 2.0728 3.5738 2.083 3.5892.2807.4742.6986.5576.9973.4755a.7973.7973 0 00.582-.787v-6.945a.2705.2705 0 01.191-.2744c.1397-.0384.287.0487.3947.2333l1.9946 3.4366 2.242 3.8648c.2191.3717.5242.5038.7896.5038a.7691.7691 0 00.2063-.0282.7986.7986 0 00.591-.791V6.4707H24zM8.0026 13.9695V8.4857c0-2.0638 2.6675-3.0546 4.0788-.6563.1025.173 2.3253 4.002 2.3253 4.002V8.4856c0-2.0638 2.6662-3.0546 4.0775-.6563.1026.173 2.3253 4.002 2.3253 4.002V6.4705H22.14v8.9999a.2705.2705 0 01-.1935.2743c-.141.0384-.2897-.0487-.3987-.2333a1360.4277 1360.4277 0 01-2.2406-3.8622l-1.9946-3.434c-.2794-.4744-.696-.5577-.9921-.477a.7986.7986 0 00-.5833.7858v6.9464a.2718.2718 0 01-.1935.2743c-.1423.0384-.291-.0487-.3987-.2333-.0192-.032-1.069-1.8407-2.083-3.5892a6211.7971 6211.7971 0 00-2.1535-3.711c-.2794-.4755-.6973-.5575-.996-.4768a.7999.7999 0 00-.5845.7858v6.8002a.3717.3717 0 01-.3487.3474h-3.452a3.6712 3.6712 0 010-7.3424H7.322v1.328H5.5427a2.3432 2.3432 0 100 4.6864H7.636a.364.364 0 00.3666-.3705Z"
      />
    </svg>
  );
}

export function Mono({
  children,
  color = "#6B7280",
  size = 12,
  style,
}: {
  children: ReactNode;
  color?: string;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: size,
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Eyebrow({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#10B981",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

type CtaProps<As extends ElementType = "button"> = {
  as?: As;
  children: ReactNode;
  href?: string;
  style?: CSSProperties;
  onClick?: () => void;
  target?: string;
  rel?: string;
};

export function CtaPrimary({
  children,
  as,
  style,
  ...rest
}: CtaProps<ElementType>) {
  const Cmp = (as || "button") as ElementType;
  return (
    <Cmp
      {...rest}
      style={{
        background: GRAD,
        color: "#fff",
        border: 0,
        padding: "13px 22px",
        borderRadius: 10,
        fontWeight: 600,
        fontSize: 15,
        cursor: "pointer",
        fontFamily: "Inter",
        boxShadow:
          "0 12px 32px -8px rgba(124,58,237,.35),0 4px 12px -2px rgba(217,70,239,.22)",
        letterSpacing: "-0.005em",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
    </Cmp>
  );
}

export function CtaSecondary({
  children,
  as,
  style,
  ...rest
}: CtaProps<ElementType>) {
  const Cmp = (as || "button") as ElementType;
  return (
    <Cmp
      {...rest}
      style={{
        background: "#fff",
        color: "#0A0A0A",
        border: "1px solid #E5E7EB",
        padding: "13px 22px",
        borderRadius: 10,
        fontWeight: 600,
        fontSize: 15,
        cursor: "pointer",
        fontFamily: "Inter",
        letterSpacing: "-0.005em",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
    </Cmp>
  );
}
