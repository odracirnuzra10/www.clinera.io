import { expect, test } from "@playwright/test";
import { precioPorProfesional } from "../src/content/planes-usuario";

// /planes2 (Ricardo, 25-nov-2026): planes por profesional, al estilo Notion.
// Solo pagan los profesionales con agenda (confirmado por Ricardo, 25-nov). Sin indexar.
// /planes-usuario redirige acá.
test.describe("/planes2", () => {
  test("anual = 20 % menos, redondeado", () => {
    expect(precioPorProfesional(29, true)).toBe(23);
    expect(precioPorProfesional(29, false)).toBe(29);
  });

  test("cuatro planes por profesional, toggle anual/mensual y no se indexa", async ({ page }) => {
    await page.goto("/planes2", { waitUntil: "load" });
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator("[data-plan-card]")).toHaveCount(4);
    const pro = page.locator('[data-plan-card="pro"] [data-precio]');
    await expect(pro).toContainText("23");
    // Reintenta el clic por si llega antes de que React hidrate.
    await expect(async () => {
      await page.locator("[data-toggle-anual] button", { hasText: "Mensual" }).click();
      await expect(pro).toContainText("29", { timeout: 2000 });
    }).toPass({ timeout: 20000 });
    await expect(page.locator("[data-incluye-todos]")).toHaveCount(1);
    // Nada del modelo anterior de /planes2.
    await expect(page.locator("main")).not.toContainText(/Ecosistema|Vortex|Hex\b/);
  });

  test("/planes-usuario redirige a /planes2", async ({ page }) => {
    await page.goto("/planes-usuario", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/planes2$/);
  });

  test("en el celular no hay scroll horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/planes2", { waitUntil: "load" });
    await expect(page.locator("[data-plan-card]").first()).toBeVisible();
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(ancho).toBeLessThanOrEqual(390);
  });
});
