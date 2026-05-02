type Props = {
  videoId: string;
  title?: string;
  aspect?: "16 / 9" | "16 / 10" | "4 / 3" | "1 / 1";
};

export default function VimeoEmbed({
  videoId,
  title = "Video",
  aspect = "16 / 9",
}: Props) {
  const src = `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479`;
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: aspect,
        margin: "32px 0",
        borderRadius: 14,
        overflow: "hidden",
        background: "#0A0A0A",
        boxShadow: "0 24px 48px -16px rgba(15,15,20,.35)",
      }}
    >
      <iframe
        src={src}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
    </div>
  );
}
