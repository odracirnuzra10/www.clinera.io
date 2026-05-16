type Props = {
  href: string;
  filename: string;
  title: string;
  description?: string;
  size?: string;
};

export default function DownloadCTA({
  href,
  filename,
  title,
  description,
  size,
}: Props) {
  return (
    <a
      href={href}
      download={filename}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "22px 24px",
        margin: "32px 0",
        background: "#0A0A0A",
        backgroundImage:
          "radial-gradient(ellipse 50% 80% at 100% 0%, rgba(200,80,192,.22), transparent 60%), radial-gradient(ellipse 50% 80% at 0% 120%, rgba(0,159,227,.18), transparent 60%)",
        color: "#fff",
        borderRadius: 16,
        textDecoration: "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          flexShrink: 0,
          width: 52,
          height: 52,
          borderRadius: 12,
          background:
            "linear-gradient(135deg, #009FE3 0%, #7C3AED 50%, #C850C0 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "JetBrains Mono, ui-monospace, monospace",
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#C850C0",
            marginBottom: 4,
          }}
        >
          Descarga gratis
        </div>
        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            marginBottom: description ? 4 : 0,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: 13.5,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {description}
          </div>
        )}
        <div
          style={{
            marginTop: 8,
            fontFamily: "JetBrains Mono, ui-monospace, monospace",
            fontSize: 11,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {filename}
          {size ? ` · ${size}` : ""}
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: "10px 18px",
          background: "#fff",
          color: "#0A0A0A",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
        }}
      >
        Descargar →
      </div>
    </a>
  );
}
