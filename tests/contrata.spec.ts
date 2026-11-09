import { expect, test, type Page } from "@playwright/test";

async function ir(page: Page, path: string, cuando?: string) {
  if (cuando) await page.clock.install({ time: new Date(cuando) });
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.locator("nextjs-portal").evaluateAll((nodes) => nodes.forEach((n) => n.remove())).catch(() => {});
}

test.describe("/contrata", () => {
  // Desde el 6-nov-2026 /contrata a secas muestra la landing de la demo de 7 días (/kimi-gratis).
  // El carrito de Flux sigue en /contrata?plan=… y en la vuelta de Stripe (?pago=…).
  test("a secas muestra la landing de la demo; con ?plan=, ?carrito= o ?pago= sigue el carrito", async ({ page }) => {
    await page.goto("/contrata?utm_source=meta", { waitUntil: "domcontentloaded" });
    expect(new URL(page.url()).pathname).toBe("/contrata");
    await expect(page.locator("h1")).toHaveText("Mientras atiendes, un paciente te escribió y nadie le respondió");
    await expect(page.locator("[data-testid=kimi-gratis-planes]")).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    // Ricardo, 7-nov-2026: /prueba-gratis es la URL principal de la misma landing.
    await page.goto("/prueba-gratis?utm_source=instagram&plan=flux", { waitUntil: "domcontentloaded" });
    expect(new URL(page.url()).pathname).toBe("/prueba-gratis");
    await expect(page.locator("h1")).toHaveText("Mientras atiendes, un paciente te escribió y nadie le respondió");
    for (const q of ["?plan=flux", "?carrito=1", "?pago=cancelado"]) {
      await page.goto("/contrata" + q, { waitUntil: "domcontentloaded" });
      await expect(page.locator("[data-carrito]"), q).toBeVisible();
    }
  });

  // ?carrito=1 abre el carrito vacío (con ?plan= ya parte con Flux adentro y no hay «Agregar al carrito» en Flux).
  test("con ?carrito= sigue el carrito: no redirige, no se indexa y conserva el pie legal", async ({ page }) => {
    const res = await page.goto("/contrata?carrito=1", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe("/contrata");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator("[data-carrito]")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Activa tu clínica" })).toBeVisible();
    await expect(page.getByText("Haz que sea tu clínica")).toBeVisible();
    await expect(page.getByText(/como comprar en Mercado Libre/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "También puedes agregar" })).toBeVisible();
    await expect(page.getByText("Depende de ti elegir lo adicional")).toBeVisible();
    await expect(page.locator("[data-flux-base]").getByRole("button", { name: "Agregar al carrito" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Comienza ya" })).toHaveCount(0);
    await expect(page.locator("[data-flux-base]")).toContainText("Clinera Intelligence");
    await expect(page.locator("[data-flux-base]")).toContainText("WhatsApp");
    await expect(page.getByRole("link", { name: "Términos" })).toHaveAttribute("href", "/terminos");
    await expect(page.getByRole("link", { name: "Privacidad" })).toHaveAttribute("href", "/privacidad");
    await expect(page.getByRole("link", { name: "Cookies" })).toHaveAttribute("href", "/cookies");
    await expect(page.getByRole("link", { name: "Ley 21.719 de datos personales" })).toHaveAttribute("href", "/seguridad");
    await expect(page.getByRole("link", { name: "Ficha clínica y Ley 20.584" })).toHaveAttribute("href", "/ley20584");
    await page.locator("[data-carrito-icon]").click();
    await expect(page.getByRole("heading", { name: "Tu carrito" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Activar" })).toBeVisible();
    await expect(page.getByText("No pierdas más tu tiempo")).toBeVisible();
    await expect(page.locator(".ver-demo-float")).toHaveCount(0);
    const texto = await page.locator("[data-carrito]").innerText();
    expect(texto).not.toMatch(/USD 39,50|USD 89,50|USD 139,50|gratis para siempre/);
  });

  test("en noviembre Email marketing y Automatizaciones son el regalo, no un adicional", async ({ page }) => {
    await ir(page, "/contrata?carrito=1", "2026-11-05T12:00:00-03:00");
    await expect(page.locator("[data-regalo]")).toBeVisible();
    await expect(page.locator("[data-regalo]")).toContainText("Regalo de noviembre");
    await expect(page.locator("[data-regalo]")).toContainText("Email marketing");
    await expect(page.locator("[data-regalo]")).toContainText("Automatizaciones");
    await expect(page.locator("[data-addon=email_marketing]")).toHaveCount(0);
    await expect(page.locator("[data-addon=automatizaciones]")).toHaveCount(0);
    await expect(page.locator("[data-carrito]")).not.toContainText("gratis para siempre");
    await expect(page.locator("[data-urgencia]").first()).toContainText("Solo por hoy 05 y mañana 06 de noviembre");
  });

  test("el 1 de diciembre pasan a adicionales de US$ 9 con Agregar al carrito", async ({ page }) => {
    await ir(page, "/contrata?carrito=1", "2026-12-01T12:00:00-03:00");
    await expect(page.locator("[data-regalo]")).toHaveCount(0);
    const email = page.locator("[data-addon=email_marketing]");
    const auto = page.locator("[data-addon=automatizaciones]");
    await expect(email).toBeVisible();
    await expect(auto).toBeVisible();
    await expect(email.getByRole("button", { name: "Agregar al carrito" })).toBeVisible();
    await expect(email).toContainText("US$ 9");
    await expect(auto).toContainText("US$ 9");
    await expect(page.locator("[data-carrito]")).not.toContainText("gratis para siempre");
    await page.locator("[data-flux-base]").getByRole("button", { name: "Agregar al carrito" }).click();
    await email.getByRole("button", { name: "Agregar al carrito" }).click();
    await auto.getByRole("button", { name: "Agregar al carrito" }).click();
    await page.locator("[data-carrito-icon]").click();
    await expect(page.locator("[data-total-hoy]")).toContainText("23,50");
    await expect(page.locator("[data-total-hoy] s")).toContainText("47");
    await expect(page.locator("[data-carrito-count]")).toHaveText("3");
  });

  test("el HTML del servidor no trae la fecha del banner", async ({ page }) => {
    const res = await page.request.get("/contrata?carrito=1");
    const html = await res.text();
    expect(html).toContain("data-urgencia");
    expect(html).not.toContain("Solo por hoy");
    expect(html).not.toContain("data-regalo");
    expect(html).not.toContain("data-addon=\"email_marketing\"");
  });

  test("?plan=hex deja Instagram y Facebook en el carrito y gana al guardado", async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem("contrata_carrito", JSON.stringify({ profesional_extra: 4 }));
    });
    await ir(page, "/contrata?plan=hex", "2026-11-05T12:00:00-03:00");
    await expect(page.locator("[data-addon=instagram] output")).toHaveText("1");
    await expect(page.locator("[data-addon=facebook] output")).toHaveText("1");
    await expect(page.locator("[data-addon=profesional_extra]").getByRole("button", { name: "Agregar al carrito" })).toBeVisible();
    await expect(page.locator("[data-carrito-count]")).toHaveText("3");
  });

  test("?pago=cancelado restaura el carrito guardado", async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem("contrata_carrito", JSON.stringify({ profesional_extra: 2, instagram: 1 }));
    });
    await ir(page, "/contrata?pago=cancelado", "2026-11-05T12:00:00-03:00");
    await expect(page.locator("[data-addon=profesional_extra] output")).toHaveText("2");
    await expect(page.locator("[data-addon=instagram] output")).toHaveText("1");
  });

  test("sumar un adicional mueve el total y el valor del CTA", async ({ page }) => {
    await ir(page, "/contrata?carrito=1", "2026-11-05T12:00:00-03:00");
    await page.locator("[data-flux-base]").getByRole("button", { name: "Agregar al carrito" }).click();
    await expect(page.locator("[data-toast]")).toHaveText("Agregado al carrito");
    await expect(page.locator("[data-carrito-count]")).toHaveText("1");
    await expect(page.locator("[data-flux-base]")).toContainText("−50%");
    await page.locator("[data-carrito-icon]").click();
    const cta = page.getByRole("button", { name: "Activar" });
    await expect(cta).toHaveAttribute("data-plan", "flux_modular");
    await expect(cta).toHaveAttribute("data-plan-value", "14.5");
    await page.getByRole("button", { name: "Cerrar carrito" }).click();
    await page.locator("[data-addon=profesional_extra]").getByRole("button", { name: "Agregar al carrito" }).click();
    await expect(page.locator("[data-addon=profesional_extra] output")).toHaveText("1");
    await expect(page.locator("[data-toast]")).toHaveText("Agregado al carrito");
    await expect(page.locator("[data-addon=profesional_extra]").getByRole("button", { name: "Sumar profesional extra" })).toBeFocused();
    await expect(page.locator("[data-carrito-count]")).toHaveText("2");
    await page.locator("[data-carrito-icon]").click();
    await expect(cta).toHaveAttribute("data-plan-value", "19");
    await expect(page.locator("[data-total-hoy]")).toContainText("19");
    await page.getByRole("button", { name: "Cerrar carrito" }).click();
    await page.locator("[data-addon=profesional_extra]").getByRole("button", { name: "Sumar profesional extra" }).click();
    await expect(page.locator("[data-addon=profesional_extra] output")).toHaveText("2");
  });

  test("Comienza ya manda el carrito saneado y abre el pago", async ({ page }) => {
    await ir(page, "/contrata?carrito=1&utm_source=ads&gclid=GCLID123", "2026-11-05T12:00:00-03:00");
    await page.locator("[data-flux-base]").getByRole("button", { name: "Agregar al carrito" }).click();
    await page.locator("[data-addon=instagram]").getByRole("button", { name: "Agregar al carrito" }).click();
    await page.locator("[data-carrito-icon]").click();
    let body: { carrito?: Record<string, number>; price?: unknown; utm?: Record<string, string> } = {};
    await page.route("**/api/contrata/checkout", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, url: "https://checkout.stripe.com/c/pay/cs_test_ok", promo: true, lista_usd: 38, promo_usd: 19 }),
      });
    });
    await page.getByRole("button", { name: "Activar" }).click();
    await expect.poll(() => body.carrito?.instagram).toBe(1);
    expect(body.carrito?.flux_base).toBe(1);
    expect(body.carrito?.email_marketing ?? 0).toBe(0);
    expect(body.price).toBeUndefined();
    expect(body.utm?.utm_source).toBe("ads");
    await page.waitForURL(/checkout\.stripe\.com/);
  });

  test("con url abre Stripe aunque la promo no se haya aplicado", async ({ page }) => {
    await ir(page, "/contrata?carrito=1", "2026-11-05T12:00:00-03:00");
    await page.route("**/api/contrata/checkout", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, url: "https://checkout.stripe.com/c/pay/cs_test_ok", promo: false }),
      }),
    );
    await page.locator("[data-flux-base]").getByRole("button", { name: "Agregar al carrito" }).click();
    await page.locator("[data-carrito-icon]").click();
    await page.getByRole("button", { name: "Activar" }).click();
    await page.waitForURL(/checkout\.stripe\.com/);
  });

  test("sin url, promo false quita el 50% y ofrece reunión", async ({ page }) => {
    await ir(page, "/contrata?carrito=1", "2026-11-05T12:00:00-03:00");
    await page.locator("[data-flux-base]").getByRole("button", { name: "Agregar al carrito" }).click();
    await page.locator("[data-carrito-icon]").click();
    await page.route("**/api/contrata/checkout", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, error: "prices_missing", promo: false }),
      }),
    );
    await page.getByRole("button", { name: "Activar" }).click();
    await expect(page.locator("[data-pago-error]")).toBeVisible();
    await expect(page.locator("[data-urgencia]")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Activar" })).toHaveAttribute("data-promo", "no");
    await expect(page.getByRole("button", { name: "Activar" })).toHaveAttribute("data-plan-value", "29");
    expect(page.url()).toContain("/contrata");
  });

  test("sin Stripe el botón ofrece agendar una reunión", async ({ page }) => {
    await ir(page, "/contrata?carrito=1&utm_source=ads", "2026-11-05T12:00:00-03:00");
    await page.locator("[data-flux-base]").getByRole("button", { name: "Agregar al carrito" }).click();
    await page.locator("[data-carrito-icon]").click();
    await page.getByRole("button", { name: "Activar" }).click();
    await expect(page.locator("[data-pago-error]")).toBeVisible();
    await expect(page.locator("[data-urgencia]").first()).toContainText("50%");
    const link = page.locator("[data-cta=agendar-reunion]");
    await expect(link).toHaveAttribute("href", /\/agenda\?/);
    await expect(link).toHaveAttribute("href", /utm_source=ads/);
  });

  test("el carrito cabe en el celular y el resumen sigue a la vista en escritorio", async ({ page }) => {
    await page.clock.install({ time: new Date("2026-11-05T12:00:00-03:00") });
    for (const [w, h] of [
      [375, 667],
      [390, 844],
      [360, 740],
    ] as const) {
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/contrata?plan=flux", { waitUntil: "load" });
      const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(desborde, `${w}x${h}`).toBeLessThanOrEqual(1);
      const cta = page.locator("[data-cta=carrito-checkout]:visible");
      await expect(cta).toBeVisible();
      const caja = await cta.boundingBox();
      expect(caja?.height ?? 0, `${w} alto`).toBeGreaterThanOrEqual(48);
      expect((caja?.y ?? 999) + (caja?.height ?? 0), `${w} dentro`).toBeLessThanOrEqual(h + 1);
      const font = await cta.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(font, `${w} tipo`).toBeGreaterThanOrEqual(16);
      const paso = page.locator("[data-addon=profesional_extra]").getByRole("button", { name: "Agregar al carrito" });
      const pasoCaja = await paso.boundingBox();
      expect(pasoCaja?.height ?? 0, `${w} agregar`).toBeGreaterThanOrEqual(44);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/contrata?plan=flux", { waitUntil: "load" });
    await page.locator("[data-carrito-icon]").click();
    const drawer = await page.locator("[data-drawer]").boundingBox();
    expect(drawer?.y ?? 999).toBeLessThan(200);
    expect(await page.locator("[data-drawer]").isVisible()).toBe(true);
    await expect(page.getByRole("button", { name: "Activar" })).toBeVisible();
  });
});
