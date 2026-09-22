/**
 * Video de la demo pública (`/demo`). El mismo embed va en el home y en el
 * footer: si cambia el Vimeo, cambia acá.
 */
export const DEMO_VIDEO = {
  id: "1229275734",
  hash: "6bb3791685",
  title: "Demo | Clinera.io",
  /** Sin parámetros de player: lo usa el JSON-LD. */
  embedUrl: "https://player.vimeo.com/video/1229275734?h=6bb3791685",
} as const;

export function demoVideoPlayerSrc(playerId = "0"): string {
  const params = new URLSearchParams({
    h: DEMO_VIDEO.hash,
    badge: "0",
    autopause: "0",
    player_id: playerId,
    app_id: "58479",
  });
  return `https://player.vimeo.com/video/${DEMO_VIDEO.id}?${params.toString()}`;
}
