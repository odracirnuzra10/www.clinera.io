import DemoVideoFrame from "@/components/demo/DemoVideoFrame";

/** El video de /demo, arriba en el home, en 16:9. */
export default function DemoEnVivo() {
  return (
    <section id="demo-3-min" style={{ padding: "8px 80px 72px", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 22 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#0A0A0A",
              background: "#fff",
              border: "1px solid #E5E7EB",
              padding: "6px 12px",
              borderRadius: 999,
              marginBottom: 16,
            }}
          >
            <span
              className="live-dot"
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: "#10B981",
                display: "inline-block",
              }}
            />
            Ver demo 3 min
          </div>
          <h2
            style={{
              fontFamily: "Inter",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              margin: 0,
              color: "#0A0A0A",
            }}
          >
            Mira Clinera en 3 minutos
          </h2>
        </div>
        <div
          className="reveal"
          style={{
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid #EEECEA",
            boxShadow: "0 30px 80px rgba(15,10,30,.10), 0 8px 20px rgba(0,0,0,.04)",
            background: "#0E1014",
          }}
        >
          <DemoVideoFrame playerId="home" />
        </div>
      </div>
    </section>
  );
}
