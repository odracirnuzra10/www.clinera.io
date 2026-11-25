import { expect, test } from "@playwright/test";
import { precioPorProfesional } from "../src/content/planes-usuario";

// /planes-usuario (Ricardo, 25-nov-2026): vista previa de planes por profesional, estilo Notion.
// No reemplaza /planes. Se cobra solo a quien atiende con agenda (supuesto, por confirmar).
test.describe("/planes-usuario", () => {
  test("anual = 20 % menos, redondeado", () => {
    expect(precioPorProfesional(29, true)).toBe(23);
    expect(precioPorProfesional(29, false)).toBe(29);
  });

  test("cuatro planes, toggle anual/mensual y no se indexa", async ({ page }) => {
    await page.goto("/planes-usuario", { waitUntil: "domcontentloaded" });
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator("[data-plan-card]")).toHaveCount(4);
    const pro = page.locator('[data-plan-card="pro"] [data-precio]');
    await expect(pro).toContainText("23");
    await page.locator("[data-toggle-anual] button", { hasText: "Mensual" }).click();
    await expect(pro).toContainText("29");
    await expect(page.locator("[data-incluye-todos]")).toHaveCount(1);
  });

  test("celular sin scroll horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/planes-usuario", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-plan-card]").first()).toBeVisible();
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(ancho).toBeLessThanOrEqual(390);
  });
});
