import type { PlanChannel } from "@/content/pricing";

export const CHANNEL_LABEL: Record<PlanChannel, string> = {
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  instagram: "Instagram",
  llamadas: "Llamadas con IA",
};

/** Logo de marca de cada canal, en su color. */
export function ChannelLogo({ channel, size = 18 }: { channel: PlanChannel; size?: number }) {
  switch (channel) {
    case "whatsapp":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366" aria-hidden>
          <path d="M12 2C6.5 2 2 6.3 2 11.6c0 1.9.5 3.7 1.5 5.3L2 22l5.3-1.4c1.5.8 3.2 1.3 4.7 1.3 5.5 0 10-4.3 10-9.6S17.5 2 12 2zm5.7 13.6c-.2.7-1.2 1.2-1.9 1.4-.5.1-1.1.2-3.6-.8-3.1-1.3-5.1-4.5-5.2-4.7-.2-.2-1.3-1.7-1.3-3.3s.8-2.3 1.1-2.6c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.7-.1.3.1 1.9.9 2.2 1.1.3.1.5.2.6.3.1.2.1.8-.1 1.5z" />
        </svg>
      );
    case "facebook":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="11" fill="#1877F2" />
          <path fill="#fff" d="M13.4 21v-7.6h2.5l.4-3h-2.9V8.5c0-.9.3-1.4 1.5-1.4h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8v3h2.5V21z" />
        </svg>
      );
    case "instagram":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <defs>
            <linearGradient id="ig-grad" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEDA75" />
              <stop offset=".35" stopColor="#FA7E1E" />
              <stop offset=".6" stopColor="#D62976" />
              <stop offset="1" stopColor="#4F5BD5" />
            </linearGradient>
          </defs>
          <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="url(#ig-grad)" strokeWidth="2.2" />
          <circle cx="12" cy="12" r="4.2" stroke="url(#ig-grad)" strokeWidth="2.2" />
          <circle cx="17.3" cy="6.7" r="1.3" fill="#D62976" />
        </svg>
      );
    case "llamadas":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6.5 3.5l3 2.2-1.6 2.4a14 14 0 007 7l2.4-1.6 2.2 3-2.1 1.2C15.2 19.2 5 16 4.2 7.6L5.4 5.5z" />
        </svg>
      );
  }
}

/**
 * Fila de canales del plan: logo + nombre, para que se vea de un vistazo
 * qué trae cada uno. `channels` sale de `CLINERA_PLANS`.
 */
export function PlanChannelLogos({
  channels,
  color = "#0A0A0A",
  chipBg = "rgba(255,255,255,.7)",
  chipBorder = "rgba(0,0,0,.08)",
}: {
  channels: readonly PlanChannel[];
  color?: string;
  chipBg?: string;
  chipBorder?: string;
}) {
  return (
    <ul
      aria-label="Canales incluidos"
      style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 8 }}
    >
      {channels.map((c) => (
        <li
          key={c}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "5px 11px 5px 8px",
            borderRadius: 999,
            background: chipBg,
            border: `1px solid ${chipBorder}`,
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 12.5,
            fontWeight: 600,
            color,
          }}
        >
          <span style={{ display: "inline-flex", background: "#fff", borderRadius: 999, padding: 2 }}>
            <ChannelLogo channel={c} size={16} />
          </span>
          {CHANNEL_LABEL[c]}
        </li>
      ))}
    </ul>
  );
}
