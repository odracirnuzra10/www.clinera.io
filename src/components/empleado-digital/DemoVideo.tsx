import Script from "next/script";

export default function DemoVideo() {
  return (
    <section
      aria-label="Demo 2026 de Clinera"
      style={{
        background: "#FAFBFC",
        padding: "64px 20px 72px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontWeight: 600,
            fontSize: 11.5,
            letterSpacing: ".14em",
            color: "#7C3AED",
            textTransform: "uppercase",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          Demo 2026 · 3 min
        </div>
        <h2
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-.028em",
            color: "#0A0A0A",
            margin: "0 0 28px",
            textAlign: "center",
          }}
        >
          Mira a AURA y LIA en acción
        </h2>
        <div
          style={{
            position: "relative",
            paddingTop: "47.04%",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(15,10,30,.12), 0 8px 20px rgba(0,0,0,.05)",
            background: "#0A0A0A",
          }}
        >
          <iframe
            src="https://player.vimeo.com/video/1190537955?h=80af129fe0&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
            title="Demo 2026 | Clinera.io"
          />
        </div>
      </div>
      <Script src="https://player.vimeo.com/api/player.js" strategy="lazyOnload" />
    </section>
  );
}
