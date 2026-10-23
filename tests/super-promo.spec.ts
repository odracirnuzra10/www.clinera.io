// /super-promo (Ricardo, 23-oct-2026): destino de la difusión de WhatsApp y del correo a los
// leads. Software + Marketing a US$ 279/mes por 6 meses, hasta el 31-oct. Sin menú, noindex,
// CTA a WhatsApp de ventas. El precio público (529) sigue en /planes.

import { expect, test } from "@playwright/test";

test("super-promo: sin menú, noindex, boleta a 279 y CTA a WhatsApp", async ({ page }) => {
  await page.route(/connect\.facebook\.net|googletagmanager/, (route) => route.abort());
  await page.clock.setFixedTime(new Date("2026-10-23T15:00:00-03:00"));
  await page.goto("/super-promo", { waitUntil: "domcontentloaded" });

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("nav")).toHaveCount(0);
  await expect(page.locator(".ver-demo-float")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("US$ 279");

  const boleta = page.locator("[data-super-promo-boleta]");
  await expect(boleta).toContainText("US$ 1.000–1.700");
  await expect(boleta).toContainText("US$ 279/mes");
  await expect(boleta).toContainText("Te ahorras desde US$ 721 al mes");

  await expect(page.locator("[data-super-promo-incluye] li")).toHaveCount(6);
  // Nunca promete conexión con agendas de terceros.
  await expect(page.locator("main")).not.toContainText(/AgendaPro|Reservo|Google Calendar|conexi[oó]n a tu agenda/i);
  await expect(page.locator("main")).toContainText("La inversión en anuncios se paga aparte");

  for (const donde of ["hero", "cierre"]) {
    const href = await page.locator(`[data-super-promo-whatsapp="${donde}"]`).getAttribute("href");
    expect(href).toContain("https://wa.me/56985581524?text=");
    expect(decodeURIComponent(href!)).toContain("super promo");
  }
  await expect(page.locator("[data-super-promo-cuenta]")).toContainText("8 días");
});

test("super-promo: después del 31 de octubre dice que terminó", async ({ page }) => {
  await page.route(/connect\.facebook\.net|googletagmanager/, (route) => route.abort());
  await page.clock.setFixedTime(new Date("2026-11-01T00:00:30-03:00"));
  await page.goto("/super-promo", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-super-promo-terminada]")).toBeVisible();
  await expect(page.locator('[data-super-promo-whatsapp="hero"]')).toHaveText(/Escríbenos por WhatsApp/);
});

test("super-promo: en celular cabe sin scroll horizontal y el botón se ve en la primera pantalla", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.route(/connect\.facebook\.net|googletagmanager/, (route) => route.abort());
  await page.goto("/super-promo", { waitUntil: "domcontentloaded" });
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(ancho).toBeLessThanOrEqual(375);
  const btn = (await page.locator('[data-super-promo-whatsapp="hero"]').boundingBox())!;
  expect(btn.y + btn.height).toBeLessThan(812 + 120);
  expect(btn.height).toBeGreaterThanOrEqual(56);
});
