import { expect, test } from "@playwright/test";

// /contrata (Ricardo, 4-nov-2026): landing L2 «Software». Hex US$ 35 con WhatsApp y 50
// conversaciones, Flux US$ 55 con WhatsApp y 200. Alta = «Prueba gratis» → app.clinera.io
// con la query de la visita, la misma de /planes2. No se indexa.
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
    await expect(planes.nth(0)).toHaveAttribute("data-contrata-plan", "hex");
    await expect(planes.nth(1)).toHaveAttribute("data-contrata-plan", "flux");

    const hex = page.locator('[data-contrata-plan="hex"]');
    const flux = page.locator('[data-contrata-plan="flux"]');
    await expect(hex.locator("[data-precio]")).toContainText("US$ 35/mes");
    await expect(flux.locator("[data-precio]")).toContainText("US$ 55/mes");
    await expect(hex.locator('[data-linea="WhatsApp"]')).toContainText("50 conversaciones");
    await expect(flux.locator('[data-linea="WhatsApp"]')).toContainText("200 conversaciones");
    await expect(hex.locator('[data-linea="Agendamiento"]')).toBeVisible();
    await expect(flux.locator('[data-linea="Agendamiento"]')).toBeVisible();
    for (const p of [hex, flux]) await expect(p.locator("[data-canales]")).toHaveText("WhatsApp");

    // Hex primero y recomendado; su botón es el Payment Link de Stripe con los utm (el gclid viaja
    // en client_reference_id, que pone Analytics.tsx al hacer clic). Flux sigue con «Prueba gratis».
    await expect(hex.locator("[data-insignia]")).toHaveText("Recomendado");
    const pago = hex.locator("a[data-cta]");
    await expect(pago).toHaveAttribute("data-cta", "pago");
    await expect(pago).toHaveAttribute("href", /^https:\/\/buy\.stripe\.com\/14AdRbdBnfD49wTgwz1441M\?utm_source=test$/);
    await expect(pago).toHaveAttribute("data-plan", "hex");
    await expect(pago).toHaveAttribute("data-plan-value", "35");
    // Flux (4-nov-2026): botón secundario a su Payment Link; la prueba gratis, link de texto.
    const fluxPago = flux.locator("a[data-cta]");
    await expect(fluxPago).toHaveAttribute("data-cta", "pago");
    await expect(fluxPago).toHaveAttribute("href", /^https:\/\/buy\.stripe\.com\/14A28tgNz1MegZl9471441J\?utm_source=test$/);
    await expect(fluxPago).toHaveAttribute("data-plan", "flux");
    await expect(fluxPago).toHaveAttribute("data-plan-value", "55");
    await expect(fluxPago).toContainText("Contratar Flux");
    await expect(flux.locator("[data-insignia]")).toHaveCount(0);
    const fondos = await page.locator("[data-contrata-plan] a[data-cta]").evaluateAll((els) => els.map((e) => getComputedStyle(e).backgroundImage));
    expect(fondos[0]).toContain("gradient");
    expect(fondos[1]).toBe("none");
    const prueba = flux.locator("a[data-cta-prueba]");
    await expect(prueba).toHaveAttribute("href", /^https:\/\/app\.clinera\.io\?.*plan=flux/);
    await expect(prueba).toHaveAttribute("href", /utm_source=test/);
    await expect(prueba).toHaveAttribute("href", /gclid=abc/);
    await expect(page.locator("[data-contrata-ventas]")).toHaveAttribute("href", /^\/agenda\?.*utm_source=test/);
    const texto = await page.locator("main").innerText();
    expect(texto).not.toMatch(/no trae WhatsApp|implementaci|permanencia/i);
  });

  for (const [w, h] of [[375, 667], [390, 844], [360, 740]] as const) {
    test(`celular ${w}x${h}: sin scroll horizontal y el botón de Hex se ve sin bajar mucho`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/contrata", { waitUntil: "domcontentloaded" });
      const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(ancho).toBeLessThanOrEqual(w);
      const cta = page.locator('[data-contrata-plan="hex"] a[data-cta]');
      const box = await cta.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      // Cabe en la primera pantalla y media: la landing es corta.
      expect(box!.y + box!.height).toBeLessThanOrEqual(h * 1.5);
      // Nada flotante del sitio tapa los botones.
      await expect(page.locator(".ver-demo-float")).toHaveCount(0);
    });
  }
});
