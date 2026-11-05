import { expect, test } from "@playwright/test";
import { CHECKOUT_URL } from "../src/content/checkout";

// /contrata (Ricardo, 4-nov-2026; planes del 5-nov): landing L2 «Software». Flux US$ 79 con
// WhatsApp y 500 conversaciones (recomendado, alta = «Prueba gratis» → app.clinera.io con la query
// de la visita) y Hex US$ 179 con WhatsApp + Facebook + Instagram y 2.500 (→ ventas). No se indexa.
test.describe("/contrata", () => {
  test("ya no redirige a /planes y no se indexa", async ({ page }) => {
    const res = await page.goto("/contrata", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe("/contrata");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("dos planes, los dos con WhatsApp, y el alta lleva la query", async ({ page }) => {
    await page.goto("/contrata?utm_source=test&gclid=abc", { waitUntil: "domcontentloaded" });
    const planes = page.locator("[data-contrata-plan]");
    await expect(planes).toHaveCount(2);
    await expect(planes.nth(0)).toHaveAttribute("data-contrata-plan", "flux");
    await expect(planes.nth(1)).toHaveAttribute("data-contrata-plan", "hex");

    const hex = page.locator('[data-contrata-plan="hex"]');
    const flux = page.locator('[data-contrata-plan="flux"]');
    await expect(flux.locator("[data-precio]")).toContainText("US$ 79/mes");
    await expect(hex.locator("[data-precio]")).toContainText("US$ 179/mes");
    await expect(flux.locator('[data-linea="WhatsApp"]')).toContainText("500 conversaciones");
    await expect(hex.locator('[data-linea="WhatsApp, Facebook e Instagram"]')).toContainText("2.500 conversaciones");
    await expect(hex.locator('[data-linea="Agendamiento"]')).toBeVisible();
    await expect(flux.locator('[data-linea="Agendamiento"]')).toBeVisible();
    await expect(flux.locator("[data-canales]")).toHaveText("WhatsApp");
    await expect(hex.locator("[data-canales]")).toHaveText("WhatsAppFacebookInstagram");

    // Flux y Hex van al Payment Link. El gclid no viaja como query (sería un gclid falso en otro campo):
    // queda saneado en client_reference_id. Los utm sí.
    await expect(flux.locator("[data-insignia]")).toHaveText("Recomendado");
    await expect(hex.locator("[data-insignia]")).toHaveCount(0);
    const pagoFlux = flux.locator("a[data-cta='pago']");
    await expect(pagoFlux).toHaveAttribute("href", new RegExp("^" + CHECKOUT_URL.flux.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    await expect(pagoFlux).toHaveAttribute("href", /utm_source=test/);
    await expect(pagoFlux).toHaveAttribute("href", /client_reference_id=abc/);
    const pagoHex = hex.locator("a[data-cta='pago']");
    await expect(pagoHex).toHaveAttribute("href", new RegExp("^" + CHECKOUT_URL.hex.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    await expect(page.locator("main")).not.toContainText(/US\$\s?(35|55)\b/);
    await expect(page.locator("[data-contrata-ventas]")).toHaveAttribute("href", /^\/agenda\?.*utm_source=test/);
    const texto = await page.locator("main").innerText();
    expect(texto).not.toMatch(/no trae WhatsApp|implementaci|permanencia/i);
  });

  for (const [w, h] of [[375, 667], [390, 844], [360, 740]] as const) {
    test(`celular ${w}x${h}: sin scroll horizontal y el botón de Flux se ve sin bajar mucho`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/contrata", { waitUntil: "domcontentloaded" });
      const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(ancho).toBeLessThanOrEqual(w);
      const cta = page.locator('[data-contrata-plan="flux"] a[data-cta]');
      const box = await cta.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      // Cabe en la primera pantalla y media: la landing es corta.
      expect(box!.y + box!.height).toBeLessThanOrEqual(h * 1.5);
      // Nada flotante del sitio tapa los botones.
      await expect(page.locator(".ver-demo-float")).toHaveCount(0);
    });
  }
});
