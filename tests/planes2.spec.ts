import { expect, test } from "@playwright/test";
import { CHECKOUT_URL } from "../src/content/checkout";
import { OFERTA_LANZAMIENTO, ofertaVigente, precioOferta } from "../src/content/planes-nuevos";

// /planes2 (Ricardo, 5-nov-2026): Flux · Hex · Vortex · Ecosistema, sin indexar.
// Dos CTA: «Prueba gratis» (Flux, recomendado) → app.clinera.io y «Hablar con ventas»
// (Hex, Vortex, Ecosistema) → /agenda. 20 % por 6 meses solo en el Ecosistema durante noviembre.
test.describe("/planes2", () => {
  test("oferta: 20 % solo Ecosistema y vigente hasta el 30 de noviembre en Chile", () => {
    expect(precioOferta(379)).toBe(303.2);
    expect(OFERTA_LANZAMIENTO.planes).toEqual(["ecosistema"]);
    expect(ofertaVigente(Date.parse("2026-11-30T23:00:00-03:00"))).toBe(true);
    expect(ofertaVigente(Date.parse("2026-12-01T00:30:00-03:00"))).toBe(false);
  });

  test("cuatro planes, dos CTA y no se indexa", async ({ page }) => {
    await page.goto("/planes2?utm_source=test", { waitUntil: "domcontentloaded" });
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const cards = page.locator("[data-plan-card]");
    await expect(cards).toHaveCount(4);
    await expect(cards.nth(0)).toHaveAttribute("data-plan-card", "flux");
    await expect(cards.nth(1)).toHaveAttribute("data-plan-card", "hex");
    await expect(cards.nth(2)).toHaveAttribute("data-plan-card", "vortex");
    await expect(cards.nth(3)).toHaveAttribute("data-plan-card", "ecosistema");

    // Flux, Hex y Vortex van al Payment Link (con los utm). Ecosistema sigue en ventas.
    // La prueba gratis de Flux queda como enlace secundario.
    for (const id of ["flux", "hex", "vortex"] as const) {
      const cta = page.locator(`[data-plan-card="${id}"] a[data-cta="pago"]`);
      const base = CHECKOUT_URL[id].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      await expect(cta).toHaveAttribute("href", new RegExp(`^${base}\\?utm_source=test$`));
    }
    await expect(page.locator('[data-plan-card="flux"] a[data-cta="prueba"]')).toHaveAttribute("href", /plan=flux/);
    await expect(page.locator('[data-plan-card="flux"]')).not.toContainText("Clinera Intelligence");
    await expect(page.locator('[data-plan-card="vortex"]')).toContainText("Clinera Intelligence");
    const eco = page.locator('[data-plan-card="ecosistema"] a[data-cta="ventas"]');
    await expect(eco).toHaveText("Hablar con ventas");
    await expect(eco).toHaveAttribute("href", /^\/agenda\?.*plan=ecosistema/);

    await expect(page.locator('[data-plan-card="flux"] [data-precio]')).toContainText("US$ 79");
    await expect(page.locator('[data-plan-card="hex"] [data-precio]')).toContainText("US$ 179");
    await expect(page.locator('[data-plan-card="vortex"] [data-precio]')).toContainText("US$ 279");
    for (const id of ["flux", "hex", "vortex"]) await expect(page.locator(`[data-plan-card="${id}"] [data-oferta]`)).toHaveCount(0);
    await expect(page.locator('[data-plan-card="flux"] [data-no-incluye]')).toContainText(["Instagram y Facebook", "Agente IA"]);
    await expect(page.locator('[data-plan-card="hex"] [data-no-incluye]')).toContainText(["Agente IA"]);
    await expect(page.locator('[data-plan-card="vortex"] [data-no-incluye]')).toHaveCount(0);
    await expect(page.locator('[data-plan-card="flux"]')).toContainText("WhatsApp con 500 conversaciones");
    await expect(page.locator('[data-plan-card="flux"]')).toContainText("Hasta 5 profesionales · Hasta 2 sucursales");
    await expect(page.locator('[data-plan-card="hex"]')).toContainText("WhatsApp, Facebook e Instagram con 2.500 conversaciones");
    await expect(page.locator('[data-plan-card="hex"]')).toContainText("Hasta 10 profesionales");
    await expect(page.locator('[data-plan-card="vortex"]')).toContainText("Agente IA con 28.000 créditos");
    await expect(page.locator('[data-plan-card="vortex"]')).toContainText("Hasta 5.000 conversaciones");
    await expect(page.locator('[data-plan-card="vortex"]')).toContainText("Hasta 15 profesionales");
    await expect(page.locator('[data-plan-card="hex"] [data-no-incluye]', { hasText: /^WhatsApp$/ })).toHaveCount(0);
    // Sin precios viejos del modelo del 4-nov (Hex 35, Flux 55) ni «Parte con Hex».
    await expect(page.locator("main")).not.toContainText(/US\$\s?(35|55)\b|Parte con Hex/);
    await expect(page.locator("main")).not.toContainText(/no trae WhatsApp/i);
    await expect(page.locator("[data-extras]")).toContainText("US$ 198");
    // Ni precios viejos ni implementación ni permanencia.
    const texto = await page.locator("main").innerText();
    expect(texto).not.toMatch(/US\$\s?(17|87|529)\b|implementaci|permanencia/i);
  });

  test("en noviembre solo el Ecosistema muestra el precio con descuento", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-11-15T12:00:00-03:00"));
    await page.goto("/planes2", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-plan-card="ecosistema"] [data-precio]')).toContainText("US$ 303,20");
    await expect(page.locator('[data-plan-card="ecosistema"] [data-oferta]')).toHaveText("20% de descuento por 6 meses. Oferta de noviembre.");
    await expect(page.locator('[data-plan-card="ecosistema"] [data-insignia]')).toHaveText("20% OFF");
    // Flux, Hex y Vortex sin descuento (Ricardo, 5-nov-2026).
    await expect(page.locator('[data-plan-card="vortex"] [data-precio]')).toContainText("US$ 279");
    await expect(page.locator('[data-plan-card="vortex"] [data-oferta]')).toHaveCount(0);
    await expect(page.locator('[data-plan-card="vortex"] [data-insignia]')).toHaveCount(0);
    await expect(page.locator('[data-plan-card="flux"] [data-insignia]')).toHaveText("Recomendado");
    await expect(page.locator('[data-plan-card="hex"] [data-insignia]')).toHaveCount(0);
    // Canales: Flux solo WhatsApp; Hex y Vortex, las tres redes.
    await expect(page.locator('[data-plan-card="flux"] [data-canales]')).toHaveText("WhatsApp");
    await expect(page.locator('[data-plan-card="hex"] [data-canales]')).toHaveText("WhatsAppFacebookInstagram");
    await expect(page.locator('[data-plan-card="vortex"] [data-canales]')).toHaveText("WhatsAppFacebookInstagram");
  });

  test("en escritorio los cuatro botones quedan a la misma altura", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.clock.setFixedTime(new Date("2026-11-15T12:00:00-03:00"));
    await page.goto("/planes2", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-plan-card="ecosistema"] [data-oferta]')).toBeVisible();
    const tops = await page.locator("[data-plan-card] a[data-cta='pago'], [data-plan-card='ecosistema'] a[data-cta='ventas']").evaluateAll((els) =>
      els.map((e) => Math.round(e.getBoundingClientRect().top)),
    );
    expect(tops).toHaveLength(4);
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThanOrEqual(1);
  });

  test("en el celular no hay scroll horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/planes2", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-plan-card]")).toHaveCount(4);
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(ancho).toBeLessThanOrEqual(390);
  });
});
