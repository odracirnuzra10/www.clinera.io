// Una sola landing (Ricardo, 18-oct-2026): /clinica-estetica/activar-cuenta.
// La landing vieja de Google Ads (/clinica-estetica), /agenda y /activar-cuenta
// redirigen ahí con la query: el gclid del anuncio no se puede perder.
// El wizard en sí se prueba en `agenda-cuenta.spec.ts`. Y el home habla de estética.

import { expect, test } from "@playwright/test";
import { CTA_VENTAS_PATH } from "../src/content/planes";

test.describe("una sola landing: /clinica-estetica/activar-cuenta", () => {
  for (const vieja of ["/clinica-estetica", "/agenda", "/activar-cuenta"]) {
    test(`${vieja} redirige con la query`, async ({ request }) => {
      const r = await request.get(`${vieja}?gclid=abc&utm_source=google`, { maxRedirects: 0 });
      expect(r.status()).toBe(308);
      expect(r.headers()["location"]).toBe(`${CTA_VENTAS_PATH}?gclid=abc&utm_source=google`);
    });
  }

  test("el CTA del home es «Activar cuenta» y lleva a la landing", async ({ page }) => {
    expect(CTA_VENTAS_PATH).toBe("/clinica-estetica/activar-cuenta");
    await page.goto("/?gclid=abc", { waitUntil: "domcontentloaded" });
    const cta = page.locator("header").getByRole("link", { name: "Activar cuenta" }).first();
    await expect(cta).toHaveAttribute("href", `${CTA_VENTAS_PATH}?gclid=abc`);
  });
});

test.describe("home — nicho estético", () => {
  test("el hero y la sección «Hecho para estética» hablan de estética", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/clínica estética/i);
    for (const bloque of ["facial", "corporal", "presupuesto", "tratamientos"]) {
      await expect(page.locator(`[data-estetica-bloque="${bloque}"]`)).toHaveCount(1);
    }
  });
});
