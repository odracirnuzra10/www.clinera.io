import { expect, test } from "@playwright/test";
import { CLINERA_PLANS, SETUP_FEE_NUMBER, SETUP_FEE_USD } from "../src/content/pricing";

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

test("/planes muestra implementación USD 450 junto al plan anual", async ({ page }) => {
  await page.goto("/planes", { waitUntil: "domcontentloaded" });
  const precios = page.locator("#precios");
  await expect(precios.getByText("Implementación").first()).toBeVisible();
  await expect(precios.getByText(`$${SETUP_FEE_NUMBER}`).first()).toBeVisible();
  await expect(precios.getByText(/con el plan anual/i).first()).toBeVisible();
  await expect(precios.getByText(/12 cuotas a precio de contado/i).first()).toBeVisible();
  await expect(precios.getByRole("img", { name: "Mercado Pago" }).first()).toBeVisible();
  await expect(precios.getByText(/incluida en el plan/i)).toHaveCount(0);
  await expect(precios.getByRole("radio", { name: /semestral/i })).toHaveCount(0);
  await expect(precios.getByRole("radio", { name: /anual/i })).toHaveAttribute("aria-checked", "true");
  await expect(precios.getByText("$223").first()).toBeVisible();
  await expect(precios.getByText(/Ahorras/).first()).toBeVisible();
  await expect(precios.getByText("$2,678")).toHaveCount(0);
  await expect(precios.getByText(/\/año/)).toHaveCount(0);
});

test("los links de pago de /planes abren en el anual y pasan al mensual", async ({ page }) => {
  await page.goto("/planes", { waitUntil: "domcontentloaded" });

  for (const plan of CLINERA_PLANS) {
    const boton = page.locator(`#precios a[data-plan="${plan.id}"][data-plan-billing="annual"]`);
    await expect(boton).toHaveAttribute("href", plan.stripeAnnual);
  }

  await page.getByRole("radio", { name: /Mensual/ }).click();

  for (const plan of CLINERA_PLANS) {
    const boton = page.locator(`#precios a[data-plan="${plan.id}"][data-plan-billing="monthly"]`);
    await expect(boton).toHaveAttribute("href", plan.stripe);
  }
});
