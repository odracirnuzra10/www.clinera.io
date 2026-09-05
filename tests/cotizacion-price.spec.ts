import { expect, test } from "@playwright/test";
import { CLINERA_PLANS, SETUP_FEE_NUMBER, SETUP_FEE_USD } from "../src/content/pricing";

/**
 * Lo que se cuida acá es lo que sigue viviendo en este repo:
 *   1. la ruta vieja lleva al cotizador nuevo (nadie queda en un 404),
 *   2. `/planes` comunica la estructura de pago canónica de AGENTS.md
 *      (mensual = implementación US$ 450 luego el plan; semestral/anual =
 *      implementación gratis y cobro inmediato del período), y
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

test("setupFeeFor: gratis en semestral/anual, cobrada sólo en mensual", async () => {
  const { setupFeeFor, includesFreeSetup } = await import("../src/content/pricing");
  expect(setupFeeFor("monthly")).toBe(450);
  expect(setupFeeFor("semester")).toBe(0);
  expect(setupFeeFor("annual")).toBe(0);
  expect(includesFreeSetup("semester")).toBe(true);
  expect(includesFreeSetup("annual")).toBe(true);
  expect(includesFreeSetup("monthly")).toBe(false);
});

test("/planes en anual muestra implementación gratis (default)", async ({ page }) => {
  await page.goto("/planes", { waitUntil: "domcontentloaded" });
  const precios = page.locator("#precios");
  await expect(precios.getByText("Gratis").first()).toBeVisible();
  await expect(precios.getByText(/incluida en el plan anual/i).first()).toBeVisible();
});

test("/planes en mensual cobra implementación y luego el plan", async ({ page }) => {
  await page.goto("/planes", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /mensual/i }).first().click();
  const precios = page.locator("#precios");
  await expect(precios.getByText("Mes 1").first()).toBeVisible();
  await expect(precios.getByText(`$${SETUP_FEE_NUMBER}`).first()).toBeVisible();
  await expect(precios.getByText(/después de la implementación/i).first()).toBeVisible();
});

test("/planes en semestral también regala la implementación", async ({ page }) => {
  await page.goto("/planes", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /semestral/i }).first().click();
  const precios = page.locator("#precios");
  await expect(precios.getByText("Gratis").first()).toBeVisible();
  await expect(precios.getByText(/incluida en el plan semestral/i).first()).toBeVisible();
});

test("los links de pago de /planes son los de pricing.ts, sin copias sueltas", async ({ page }) => {
  await page.goto("/planes", { waitUntil: "domcontentloaded" });

  // /planes abre en anual (default del toggle).
  for (const plan of CLINERA_PLANS) {
    const boton = page.locator(`#precios a[data-plan="${plan.id}"][data-plan-billing="annual"]`);
    await expect(boton).toHaveAttribute("href", plan.stripeAnnual);
  }

  await page.getByRole("button", { name: /semestral/i }).first().click();
  for (const plan of CLINERA_PLANS) {
    const boton = page.locator(`#precios a[data-plan="${plan.id}"][data-plan-billing="semester"]`);
    await expect(boton).toHaveAttribute("href", plan.stripeSemester);
  }

  await page.getByRole("button", { name: /mensual/i }).first().click();
  for (const plan of CLINERA_PLANS) {
    const boton = page.locator(`#precios a[data-plan="${plan.id}"][data-plan-billing="monthly"]`);
    await expect(boton).toHaveAttribute("href", plan.stripe);
  }
});
