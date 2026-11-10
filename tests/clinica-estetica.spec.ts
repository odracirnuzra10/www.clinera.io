// Una sola puerta de entrada (Ricardo, 18-oct-2026): /hablar-con-ventas. Las landings y rutas
// anteriores redirigen ahí con la query: el gclid del anuncio no se puede perder.

import { expect, test } from "@playwright/test";
import { CTA_VENTAS_PATH } from "../src/content/planes";

test.describe("redirects a /hablar-con-ventas", () => {
  for (const vieja of [
    "/clinica-estetica",
    "/clinica-estetica/activar-cuenta",
    "/activar-cuenta",
    "/reunion-comercial",
  ]) {
    test(`${vieja} redirige con la query`, async ({ request }) => {
      const r = await request.get(`${vieja}?gclid=abc&utm_source=google`, { maxRedirects: 0 });
      expect(r.status()).toBe(308);
      expect(r.headers()["location"]).toBe(`${CTA_VENTAS_PATH}?gclid=abc&utm_source=google`);
    });
  }
});

test.describe("home", () => {
  test("el Nav lleva «Regístrate gratis» a /prueba-gratis con la query y «Solicita asistencia» a WhatsApp (7-nov-2026)", async ({ page }) => {
    await page.goto("/?gclid=abc&plan=flux", { waitUntil: "domcontentloaded" });
    const registro = page.locator("header a[data-cta-registro]").first();
    // Sin `plan`: con esa clave /contrata abre el carrito de Flux.
    await expect(registro).toHaveAttribute("href", "/prueba-gratis?gclid=abc");
    await expect(page.locator("header a[data-cta-asistencia]").first()).toHaveAttribute("href", "https://wa.me/56985581524?text=necesito%20asistencia");
  });

  test("hero del ecosistema y las dos opciones; el marketing de performance vive en /ecosistema", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Tú atiendes pacientes");
    // Ricardo, 7-nov-2026: el home muestra la prueba gratis con Flux, Hex y Xcale.
    await expect(page.locator("[data-planes-trial] [data-plan-card]")).toHaveCount(3);
    // Home corto (Ricardo, 20-oct-2026): sin bloque de marketing ni banda redundante.
    await expect(page.locator("[data-marketing-performance]")).toHaveCount(0);
    await expect(page.locator("[data-agente-ia-banda]")).toHaveCount(0);
    await page.goto("/ecosistema", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-marketing-performance] [data-marketing-bloque]")).toHaveCount(4);
    // Ricardo, 4-nov-2026: el bloque de marketing cierra con los dos CTA del sitio.
    await expect(page.locator("[data-marketing-performance] [data-cta-registro]")).toHaveAttribute("href", "/prueba-gratis");
    await expect(page.locator("[data-marketing-performance] [data-cta-asistencia]")).toHaveAttribute("href", "https://wa.me/56985581524?text=necesito%20asistencia");
    await page.goto("/", { waitUntil: "domcontentloaded" });
    for (const viejo of [/Vortex/, /Hurricane/, /Atlas/, /Summit/, new RegExp("CU" + "KI")]) {
      await expect(page.locator("body")).not.toContainText(viejo);
    }
  });
});
