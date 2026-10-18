import { expect, test } from "@playwright/test";
import { SETUP_FEE_NUMBER, SETUP_FEE_USD } from "../src/content/pricing";

/**
 * Lo que se cuida acá es lo que sigue viviendo en este repo:
 *   1. la ruta vieja lleva al cotizador nuevo (nadie queda en un 404),
 *   2. `/planes` comunica la estructura de pago canónica: implementación USD 450
 *      más el período del plan (anual primero; el mensual queda debajo), y
 *   3. los links de pago que se publican son EXACTAMENTE los de pricing.ts.
 *
 * Que el cotizador cobre esa misma estructura se prueba en el repo `baserow`:
 * `tests/frontend/test_cotizacion_pago.js` y `test_cotizacion_semilla.js`.
 */

test("la ruta vieja /cotizacion lleva al cotizador de cotizacion.oacg.cl", async ({ request }) => {
  const r = await request.get("/cotizacion", { maxRedirects: 0 });
  expect(r.status()).toBe(308);
  expect(r.headers()["location"]).toBe("https://cotizacion.oacg.cl/");
});

test("la implementación sigue valiendo USD 450 en la fuente única", () => {
  expect(SETUP_FEE_USD).toBe(450);
  expect(SETUP_FEE_NUMBER).toBe("450");
});

test("setupFeeFor: catálogo cobra implementación siempre", async () => {
  const { setupFeeFor, includesFreeSetup } = await import("../src/content/pricing");
  expect(setupFeeFor("monthly")).toBe(450);
  expect(setupFeeFor("annual")).toBe(450);
  expect(includesFreeSetup("monthly")).toBe(false);
  expect(includesFreeSetup("annual")).toBe(false);
});

// /planes publica Flux · Hurricane · Vortex sin costo de implementación (Ricardo, 18-oct-2026).
// Los US$ 450 de `setupFeeFor` siguen rigiendo los contratos de /firma (test de arriba).
test("/planes no muestra implementación y no cobra en la web", async ({ page }) => {
  await page.goto("/planes", { waitUntil: "domcontentloaded" });
  const planes = page.locator("[data-planes-vigentes]");
  await expect(planes.getByText(/implementación/i)).toHaveCount(0);
  await expect(planes.getByText(`$${SETUP_FEE_NUMBER}`)).toHaveCount(0);
  await expect(page.locator('main a[href*="buy.stripe.com"]')).toHaveCount(0);
});
