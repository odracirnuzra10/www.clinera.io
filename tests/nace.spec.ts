// /nace (Ricardo, 12-nov-2026): propuesta para Clínica Nace. Un número para las 4 sucursales.
import { expect, test } from "@playwright/test";

for (const vp of [
  { name: "escritorio", width: 1440, height: 900 },
  { name: "celular", width: 390, height: 844 },
]) {
  test(`nace (${vp.name}): noindex, animación del número único y cotización`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    const errores: string[] = [];
    page.on("pageerror", (e) => errores.push(e.message));
    await page.goto("/nace", { waitUntil: "domcontentloaded" });
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator("h1")).toContainText("Un número.");

    // La escena: AURA consulta las 4 agendas y agenda en San Miguel.
    await page.locator("#como").scrollIntoViewIfNeeded();
    await expect(page.locator("#stage .suc")).toHaveCount(4);
    await expect(page.locator("#chat .msg.ai").last()).toContainText("quedaste agendada", { timeout: 15000 });
    await expect(page.locator('#stage .suc[data-s="smig"] .slot.new')).toBeVisible();

    // Accesos por rol: Recepción Providencia ve solo Providencia.
    await page.locator("#accesos").scrollIntoViewIfNeeded();
    await page.locator('.role[data-role="prov"]').click();
    await expect(page.locator("#inboxCount")).toHaveText("2 conversaciones");

    await expect(page.locator("#cotizacion")).toContainText("US$ 2.342");
    await expect(page.locator("#cotizacion")).toContainText("US$ 3.422");

    const ancho = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(ancho).toBeLessThanOrEqual(0);
    expect(errores).toEqual([]);
  });
}
