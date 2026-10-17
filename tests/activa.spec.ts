import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { ACTIVA_CNN, ACTIVA_CTA, ACTIVA_CTA_HREF, ACTIVA_FUNCIONES } from "../src/content/activa";
import { PLANS_2 } from "../src/content/planes2";
import { buildRobotsTxt } from "../src/lib/robots-txt";

// /activa (Ricardo, 17-oct-2026): landing informativa con los 3 planes, el reportaje de CNN y las
// funciones. Todos los CTA dicen «Activa tu cuenta ahora» y van a /go.
test.describe("/activa: landing informativa", () => {
  const landing = readFileSync("src/components/activa/ActivaLanding.tsx", "utf8");
  const cta = readFileSync("src/components/activa/ActivaCta.tsx", "utf8");
  const page = readFileSync("src/app/activa/page.tsx", "utf8");

  test("el CTA dice «Activa tu cuenta ahora» y va a /go", () => {
    expect(ACTIVA_CTA).toBe("Activa tu cuenta ahora");
    expect(ACTIVA_CTA_HREF).toBe("/go");
    expect(cta).toMatch(/href=\{ACTIVA_CTA_HREF\}/);
    expect(landing).not.toMatch(/buy\.stripe\.com|\/agenda|wa\.me/);
  });

  test("conserva la query (utm, fbclid, gclid) al ir a /go", () => {
    expect(cta).toMatch(/window\.location\.search/);
  });

  test("muestra los 3 planes desde PLANS_2, sin precios escritos a mano", () => {
    expect(landing).toMatch(/PLANS_2\.map/);
    expect(landing).toMatch(/plan\.monthlyUsd/);
    expect(PLANS_2.map((p) => p.monthlyUsd)).toEqual([17, 89, 179]);
    expect(landing).not.toMatch(/\b(89|179)\b/);
  });

  test("el video es el reportaje de CNN (Vimeo 1205127087)", () => {
    expect(ACTIVA_CNN.vimeoSrc).toContain("player.vimeo.com/video/1205127087");
    expect(landing).toMatch(/ACTIVA_CNN\.vimeoSrc/);
  });

  test("funciones sin CAMILA ni LIA (próximamente) ni integraciones con agendas de terceros", () => {
    const copy = JSON.stringify(ACTIVA_FUNCIONES);
    expect(copy).not.toMatch(/CAMILA|\bLIA\b|Reservo|AgendaPro|Medilink|Dentalink/i);
    expect(ACTIVA_FUNCIONES.length).toBeGreaterThanOrEqual(6);
  });

  test("sin botones flotantes de demo: el único CTA es «Activa tu cuenta ahora»", () => {
    expect(readFileSync("src/components/cro/StickyMobileCTA.tsx", "utf8")).toContain('"/activa"');
    expect(readFileSync("src/components/demo/VerDemoFloat.tsx", "utf8")).toContain('"/activa"');
  });

  test("interna: noindex, Disallow en robots", () => {
    expect(page).toMatch(/index: false/);
    expect(buildRobotsTxt()).toMatch(/Disallow: \/activa/);
  });
});
