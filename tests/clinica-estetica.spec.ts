// Una sola puerta de entrada (Ricardo, 18-oct-2026): /agenda. Las landings y rutas
// anteriores redirigen ahí con la query: el gclid del anuncio no se puede perder.

import { expect, test } from "@playwright/test";
import { CTA_VENTAS_LABEL, CTA_VENTAS_PATH } from "../src/content/planes";

test.describe("redirects a /agenda", () => {
  for (const vieja of [
    "/clinica-estetica",
    "/clinica-estetica/activar-cuenta",
    "/activar-cuenta",
    "/reunion-comercial",
  ]) {
    test(`${vieja} redirige con la query`, async ({ request }) => {
      const r = await request.get(`${vieja}?gclid=abc&utm_source=google`, { maxRedirects: 0 });
      expect(r.status()).toBe(308);
      expect(r.headers()["location"]).toBe(`${CTA_VENTAS_PATH}?gclid=abc&utm_source=google`);
    });
  }
});

test.describe("home", () => {
  test("el CTA del Nav es «Agendar reunión» y lleva a /agenda con la query", async ({ page }) => {
    expect(CTA_VENTAS_PATH).toBe("/agenda");
    await page.goto("/?gclid=abc", { waitUntil: "domcontentloaded" });
    const cta = page.locator("header").getByRole("link", { name: CTA_VENTAS_LABEL }).first();
    await expect(cta).toHaveAttribute("href", `${CTA_VENTAS_PATH}?gclid=abc`);
  });

  test("hero del ecosistema y las dos opciones; el marketing de performance vive en /ecosistema", async ({ page }) => {
    expect(CTA_VENTAS_LABEL).toBe("Agendar reunión");
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/clínica médica o estética/i);
    await expect(page.locator("[data-planes-vigentes]")).toContainText("Dos formas de trabajar");
    await expect(page.locator("[data-plan-card]")).toHaveCount(2);
    // Home corto (Ricardo, 20-oct-2026): sin bloque de marketing ni banda redundante.
    await expect(page.locator("[data-marketing-performance]")).toHaveCount(0);
    await expect(page.locator("[data-agente-ia-banda]")).toHaveCount(0);
    await page.goto("/ecosistema", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-marketing-performance] [data-marketing-bloque]")).toHaveCount(4);
    await expect(page.locator("[data-marketing-cta]")).toHaveAttribute("href", "/agenda?servicio=marketing");
    await page.goto("/", { waitUntil: "domcontentloaded" });
    for (const viejo of [/Flux/, /Hurricane/, /Atlas/, /Summit/, new RegExp("CU" + "KI")]) {
      await expect(page.locator("body")).not.toContainText(viejo);
    }
  });
});
