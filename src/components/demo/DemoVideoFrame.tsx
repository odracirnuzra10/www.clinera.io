import { DEMO_VIDEO, demoVideoPlayerSrc } from "@/content/demo-video";

type Props = {
  /** Id del player de Vimeo. Distinto si hay más de un embed en la página. */
  playerId?: string;
  title?: string;
  lazy?: boolean;
};

export default function DemoVideoFrame({
  playerId = "0",
  title = DEMO_VIDEO.title,
  lazy = false,
}: Props) {
  return (
    <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
      <iframe
        src={demoVideoPlayerSrc(playerId)}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        loading={lazy ? "lazy" : "eager"}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
    </div>
  );
}
