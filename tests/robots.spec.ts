import { test, expect } from "@playwright/test";
import { buildRobotsTxt } from "../src/lib/robots-txt";

// Un bot con bloque propio ignora el bloque `*`: las rutas internas tienen
// que estar prohibidas también ahí.
function bloque(txt: string, agent: string): string {
  const parts = txt.split(/\n(?=User-Agent: )/);
  const b = parts.find((p) => p.startsWith(`User-Agent: ${agent}\n`));
  expect(b, `bloque ${agent}`).toBeTruthy();
  return b as string;
}

test.describe("robots.txt: rutas internas cerradas a los bots de IA", () => {
  const txt = buildRobotsTxt();
  const internas = [
    "/vision-2027",
    "/ventas2026",
    "/nuevodiscurso",
    "/nueva-reunion",
    "/firma",
    "/triage",
    "/internal/",
    "/reserva-tu-hora",
    "/admin/",
    "/api/",
  ];

  for (const agent of ["GPTBot", "ClaudeBot", "Bingbot", "Google-Extended", "AhrefsBot"]) {
    test(`${agent} no puede leer las rutas internas`, () => {
      const b = bloque(txt, agent);
      for (const r of internas) expect(b).toContain(`Disallow: ${r}`);
      expect(b).toContain("Allow: /blog/");
    });
  }

  test("sigue permitiendo el rastreo de contenido público", () => {
    expect(bloque(txt, "GPTBot")).not.toContain("Disallow: /\n");
  });
});
