import { expect, test } from "@playwright/test";
import { ofertaVigente, precioOferta } from "../src/content/planes-nuevos";

// /planes2 (Ricardo, 29-oct-2026): Hex · Flux · Vortex · Ecosistema, sin indexar.
// Dos CTA: «Prueba gratis» (Hex, Flux) → app.clinera.io y «Hablar con ventas»
// (Vortex, Ecosistema) → /agenda. 20 % por 6 meses en Vortex y Ecosistema durante noviembre.
test.describe("/planes2", () => {
  test("oferta: 20 % y vigente hasta el 30 de noviembre en Chile", () => {
    expect(precioOferta(279)).toBe(223.2);
    expect(precioOferta(379)).toBe(303.2);
    expect(ofertaVigente(Date.parse("2026-11-30T23:00:00-03:00"))).toBe(true);
    expect(ofertaVigente(Date.parse("2026-12-01T00:30:00-03:00"))).toBe(false);
  });

  test("cuatro planes, dos CTA y no se indexa", async ({ page }) => {
    await page.goto("/planes2?utm_source=test", { waitUntil: "domcontentloaded" });
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const cards = page.locator("[data-plan-card]");
    await expect(cards).toHaveCount(4);
    await expect(cards.nth(0)).toHaveAttribute("data-plan-card", "hex");
    await expect(cards.nth(3)).toHaveAttribute("data-plan-card", "ecosistema");

    for (const id of ["hex", "flux"]) {
      const cta = page.locator(`[data-plan-card="${id}"] a[data-cta]`);
      await expect(cta).toHaveText("Prueba gratis");
      await expect(cta).toHaveAttribute("href", new RegExp(`^https://app\\.clinera\\.io\\?.*plan=${id}`));
      await expect(cta).toHaveAttribute("href", /utm_source=test/);
    }
    for (const id of ["vortex", "ecosistema"]) {
      const cta = page.locator(`[data-plan-card="${id}"] a[data-cta]`);
      await expect(cta).toHaveText("Hablar con ventas");
      await expect(cta).toHaveAttribute("href", new RegExp(`^/agenda\\?.*plan=${id}`));
    }

    await expect(page.locator('[data-plan-card="hex"] [data-precio]')).toContainText("US$ 35");
    await expect(page.locator('[data-plan-card="flux"] [data-precio]')).toContainText("US$ 55");
    await expect(page.locator('[data-plan-card="hex"] [data-oferta]')).toHaveCount(0);
    await expect(page.locator('[data-plan-card="flux"] [data-no-incluye]')).toContainText(["Instagram y Facebook"]);
    await expect(page.locator("[data-extras]")).toContainText("US$ 198");
    // Ni precios viejos ni implementación ni permanencia.
    const texto = await page.locator("main").innerText();
    expect(texto).not.toMatch(/US\$\s?(17|87|529)\b|implementaci|permanencia/i);
  });

  test("en noviembre Vortex y Ecosistema muestran el precio con descuento", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-11-15T12:00:00-03:00"));
    await page.goto("/planes2", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-plan-card="vortex"] [data-precio]')).toContainText("US$ 223,20");
    await expect(page.locator('[data-plan-card="ecosistema"] [data-precio]')).toContainText("US$ 303,20");
    await expect(page.locator('[data-plan-card="vortex"] [data-oferta]')).toHaveText("20% de descuento por 6 meses. Oferta de noviembre.");
  });

  test("en el celular no hay scroll horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/planes2", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-plan-card]")).toHaveCount(4);
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(ancho).toBeLessThanOrEqual(390);
  });
});
