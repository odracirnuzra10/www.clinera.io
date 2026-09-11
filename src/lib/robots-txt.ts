/**
 * Cuerpo de /robots.txt. Next.js MetadataRoute.Robots no admite comentarios,
 * así que se sirve desde `src/app/robots.txt/route.ts`.
 *
 * Fuente de anuncios de producto: /blog/proximas-funciones-clinera-dte-odontograma-instagram
 *
 * Política de entrenamiento (sept 2026): se PERMITE rastreo de entrenamiento
 * (Google-Extended, CCBot, Applebot-Extended, Bytespider y el resto).
 * No bloquearlos sin una decisión explícita de Ricardo.
 */

export const AEO_ALLOW = [
  "/",
  "/llms.txt",
  "/llms-full.txt",
  "/blog/",
  "/novedades/",
  "/casos/",
  "/sitemap.xml",
] as const;

export const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "GoogleOther",
  "Google-CloudVertexBot",
  "Bingbot",
  "Applebot-Extended",
  "CCBot",
  "Meta-ExternalAgent",
  "FacebookBot",
  "YouBot",
  "Amazonbot",
  "Bytespider",
  "xAI-Bot",
  "Grok",
  "MistralAI-User",
  "cohere-ai",
  "cohere-training-data-crawler",
  "Diffbot",
  "DuckAssistBot",
  "AI2Bot",
] as const;

export const SEO_TOOLS = ["SemrushBot", "AhrefsBot"] as const;
export const SCRAPERS = ["MJ12bot", "DotBot", "rogerbot", "BLEXBot"] as const;

const STAR_DISALLOW = [
  "/api/",
  "/_next/",
  "/admin/",
  "/internal/",
  "/nueva-reunion",
  "/nueva-reunion/",
  "/nuevodiscurso",
  "/nuevodiscurso/",
  "/ventas2026",
  "/ventas2026/",
  "/vision-2027",
  "/vision-2027/",
  "/triage",
  "/firma",
  "/firma/",
  "/p/*/kit",
  "/partner/*/kit",
  "/reserva-tu-hora",
  "/*?utm_*",
  "/*?gclid=*",
  "/*?fbclid=*",
  "/*?ref=*",
];

function block(agent: string, allow: readonly string[], disallow: string[]) {
  const lines = [`User-Agent: ${agent}`];
  for (const a of allow) lines.push(`Allow: ${a}`);
  for (const d of disallow) lines.push(`Disallow: ${d}`);
  return lines.join("\n") + "\n";
}

export function buildRobotsTxt(): string {
  const parts: string[] = [
    "# LLM docs: https://clinera.io/llms.txt",
    "",
    block("*", AEO_ALLOW, STAR_DISALLOW),
  ];
  for (const agent of AI_CRAWLERS) {
    parts.push(block(agent, AEO_ALLOW, ["/admin/", "/api/"]));
  }
  for (const agent of SEO_TOOLS) {
    parts.push(block(agent, AEO_ALLOW, ["/admin/", "/api/"]));
  }
  for (const agent of SCRAPERS) {
    parts.push(`User-Agent: ${agent}\nDisallow: /\n`);
  }
  parts.push("Host: https://www.clinera.io");
  parts.push("Sitemap: https://www.clinera.io/sitemap.xml");
  parts.push("");
  return parts.join("\n");
}
