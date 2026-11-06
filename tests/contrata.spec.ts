import { expect, test, type Page } from "@playwright/test";

async function ir(page: Page, path: string, cuando?: string) {
  if (cuando) await page.clock.install({ time: new Date(cuando) });
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.locator("nextjs-portal").evaluateAll((nodes) => nodes.forEach((n) => n.remove())).catch(() => {});
}

async function sumarFlux(page: Page) {
  await page.locator("[data-flux-base]").getByRole("button", { name: /^Activar/ }).click();
  await expect(page.locator("[data-extras]")).toBeVisible();
  await page.locator("[data-extras-cerrar]").click({ position: { x: 12, y: 12 } });
  await expect(page.locator("[data-extras]")).toBeHidden();
}

function activarCajon(page: Page) {
  return page.locator("[data-drawer]").getByRole("button", { name: "Activar", exact: true });
}

test.describe("/contrata", () => {
  test("no redirige, no se indexa y conserva el pie legal", async ({ page }) => {
    const res = await page.goto("/contrata", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe("/contrata");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator("[data-carrito]")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Activa tu clínica" })).toBeVisible();
    await expect(page.getByText("Haz que sea tu clínica")).toBeVisible();
    await expect(page.getByText(/como comprar en Mercado Libre/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "También puedes agregar" })).toBeVisible();
    await expect(page.getByText("Depende de ti elegir lo adicional")).toBeVisible();
    await expect(page.locator("[data-flux-base]").getByRole("button", { name: "Activar por $28.000" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Comienza ya" })).toHaveCount(0);
    await expect(page.locator("[data-flux-base]")).toContainText("Clinera Intelligence");
    await expect(page.locator("[data-flux-base]")).toContainText("WhatsApp");
    await expect(page.getByRole("link", { name: "Términos" })).toHaveAttribute("href", "/terminos");
    await expect(page.getByRole("link", { name: "Privacidad" })).toHaveAttribute("href", "/privacidad");
    await expect(page.getByRole("link", { name: "Cookies" })).toHaveAttribute("href", "/cookies");
    await expect(page.getByRole("link", { name: "Ley 21.719 de datos personales" })).toHaveAttribute("href", "/seguridad");
    await expect(page.getByRole("link", { name: "Ficha clínica y Ley 20.584" })).toHaveAttribute("href", "/ley20584");
    await page.locator("[data-carrito-icon]").click();
    await expect(page.getByRole("heading", { name: "Tu clínica está a punto de crecer" })).toBeVisible();
    await expect(activarCajon(page)).toBeVisible();
    await expect(page.getByText("No pierdas más tu tiempo")).toBeVisible();
    await expect(page.locator(".ver-demo-float")).toHaveCount(0);
    const texto = await page.locator("[data-carrito]").innerText();
    expect(texto).not.toMatch(/USD 39,50|USD 89,50|USD 139,50|gratis para siempre/);
  });

  test("en noviembre Email marketing y Automatizaciones son el regalo, no un adicional", async ({ page }) => {
    await ir(page, "/contrata", "2026-11-05T12:00:00-03:00");
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
    await ir(page, "/contrata", "2026-12-01T12:00:00-03:00");
    await expect(page.locator("[data-regalo]")).toHaveCount(0);
    const email = page.locator("[data-addon=email_marketing]");
    const auto = page.locator("[data-addon=automatizaciones]");
    await expect(email).toBeVisible();
    await expect(auto).toBeVisible();
    await expect(email.getByRole("button", { name: "Primero agrega Clinera Flux" })).toBeDisabled();
    await expect(email).toContainText("$8.690");
    await expect(auto).toContainText("$8.690");
    await expect(email.locator("img")).toHaveAttribute("src", "/kimi/productos/email-marketing.jpg");
    await expect(auto.locator("img")).toHaveAttribute("src", "/kimi/productos/automatizaciones.jpg");
    await expect(page.locator("[data-carrito]")).not.toContainText("gratis para siempre");
    await sumarFlux(page);
    await email.getByRole("button", { name: "Agregar al carrito" }).click();
    await auto.getByRole("button", { name: "Agregar al carrito" }).click();
    await page.locator("[data-carrito-icon]").click();
    await expect(page.locator("[data-total-hoy]")).toContainText("$22.690");
    await expect(page.locator("[data-drawer]")).toContainText("Hoy pagas");
    await expect(page.locator("[data-total-hoy] s")).toHaveCount(0);
    await expect(page.locator("[data-carrito-count]")).toHaveText("3");
  });

  test("el HTML del servidor no trae la fecha del banner", async ({ page }) => {
    const res = await page.request.get("/contrata");
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
    await expect(page.locator("[data-addon=instagram]").getByRole("button", { name: "Quitar" })).toBeVisible();
    await expect(page.locator("[data-addon=facebook]").getByRole("button", { name: "Quitar" })).toBeVisible();
    await expect(page.locator("[data-addon=profesional_extra]").getByRole("button", { name: "Agregar al carrito" })).toBeVisible();
    await expect(page.locator("[data-carrito-count]")).toHaveText("3");
  });

  test("?pago=cancelado restaura el carrito guardado", async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem("contrata_carrito", JSON.stringify({ profesional_extra: 2, instagram: 1 }));
    });
    await ir(page, "/contrata?pago=cancelado", "2026-11-05T12:00:00-03:00");
    await expect(page.locator("[data-addon=profesional_extra] output")).toHaveText("2");
    await expect(page.locator("[data-addon=instagram]").getByRole("button", { name: "Quitar" })).toBeVisible();
  });

  test("sumar un adicional mueve el total y el valor del CTA", async ({ page }) => {
    await ir(page, "/contrata", "2026-11-05T12:00:00-03:00");
    await sumarFlux(page);
    await expect(page.locator("[data-toast]")).toHaveText("Agregado al carrito");
    await expect(page.locator("[data-carrito-count]")).toHaveText("1");
    await expect(page.locator("[data-flux-base]")).toContainText("50% por 3 meses");
    await expect(page.locator("[data-flux-base]")).toContainText("por 3 meses, luego $28.000");
    await page.locator("[data-carrito-icon]").click();
    const cta = activarCajon(page);
    await expect(cta).toHaveAttribute("data-plan", "flux_modular");
    await expect(cta).toHaveAttribute("data-plan-value", "14.5");
    await page.getByRole("button", { name: "Cerrar", exact: true }).click();
    await page.locator("[data-addon=profesional_extra]").getByRole("button", { name: "Agregar al carrito" }).click();
    await expect(page.locator("[data-addon=profesional_extra] output")).toHaveText("1");
    await expect(page.locator("[data-toast]")).toHaveText("Agregado al carrito");
    await expect(page.locator("[data-addon=profesional_extra]").getByRole("button", { name: "Sumar profesional extra" })).toBeFocused();
    await expect(page.locator("[data-carrito-count]")).toHaveText("2");
    await page.locator("[data-carrito-icon]").click();
    await expect(cta).toHaveAttribute("data-plan-value", "19");
    await expect(page.locator("[data-total-hoy]")).toContainText("$18.345");
    await page.getByRole("button", { name: "Cerrar", exact: true }).click();
    await page.locator("[data-addon=profesional_extra]").getByRole("button", { name: "Sumar profesional extra" }).click();
    await expect(page.locator("[data-addon=profesional_extra] output")).toHaveText("2");
  });

  test("el onboarding humano es cobro único de US$ 190 y no lleva el 50%", async ({ page }) => {
    await ir(page, "/contrata", "2026-11-05T12:00:00-03:00");
    const card = page.locator("[data-addon=onboarding_humano]");
    await expect(page.locator("[data-flux-base] img")).toHaveAttribute("src", "/kimi/productos/flux.jpg");
    await expect(card.locator("img")).toHaveAttribute("src", "/kimi/productos/onboarding.jpg");
    await expect(page.locator("[data-addon=agente_ia] img")).toHaveAttribute("src", "/kimi/productos/agente-ia.jpg");
    await expect(card).toContainText("Onboarding humano");
    await expect(card).toContainText("$183.450");
    await expect(card).toContainText("cobro único");
    await expect(card).not.toContainText("50% por 3 meses");
    await expect(card).toHaveAttribute("data-espera", "si");
    await expect(card.getByRole("button", { name: "Primero agrega Clinera Flux" })).toBeDisabled();
    await sumarFlux(page);
    await expect(card).toHaveAttribute("data-espera", "no");
    await card.getByRole("button", { name: "Agregar al carrito" }).click();
    await page.locator("[data-carrito-icon]").click();
    const drawer = page.locator("[data-drawer]");
    await expect(drawer.getByRole("button", { name: "Quitar Clinera Flux" })).toBeVisible();
    await expect(drawer.getByRole("button", { name: "Sumar Clinera Flux" })).toHaveCount(0);
    await expect(drawer.getByRole("button", { name: "Quitar Onboarding humano" })).toBeVisible();
    await expect(drawer.getByRole("button", { name: "Sumar Onboarding humano" })).toHaveCount(0);
    await expect(drawer).toContainText("cobro único");
    await expect(drawer).toContainText("50% por 3 meses");
    await expect(drawer).toContainText("Hoy pagas");
    await expect(drawer.locator("[data-total-hoy]")).toContainText("$197.450");
    await expect(drawer.locator("[data-total-hoy] s")).toHaveCount(0);
    await expect(drawer).toContainText("mensual +");
    await expect(drawer.getByText("Luego $28.000/mes")).toBeVisible();
  });

  test("Comienza ya manda el carrito saneado y abre el pago", async ({ page }) => {
    await ir(page, "/contrata?utm_source=ads&gclid=GCLID123", "2026-11-05T12:00:00-03:00");
    await sumarFlux(page);
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
    await activarCajon(page).click();
    await expect.poll(() => body.carrito?.instagram).toBe(1);
    expect(body.carrito?.flux_base).toBe(1);
    expect(body.carrito?.email_marketing ?? 0).toBe(0);
    expect(body.price).toBeUndefined();
    expect(body.utm?.utm_source).toBe("ads");
    await page.waitForURL(/checkout\.stripe\.com/);
  });

  test("con url abre Stripe aunque la promo no se haya aplicado", async ({ page }) => {
    await ir(page, "/contrata", "2026-11-05T12:00:00-03:00");
    await page.route("**/api/contrata/checkout", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, url: "https://checkout.stripe.com/c/pay/cs_test_ok", promo: false }),
      }),
    );
    await sumarFlux(page);
    await page.locator("[data-carrito-icon]").click();
    await activarCajon(page).click();
    await page.waitForURL(/checkout\.stripe\.com/);
  });

  test("sin url, promo false quita el 50% y ofrece reunión", async ({ page }) => {
    await ir(page, "/contrata", "2026-11-05T12:00:00-03:00");
    await sumarFlux(page);
    await page.locator("[data-carrito-icon]").click();
    await page.route("**/api/contrata/checkout", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, error: "prices_missing", promo: false }),
      }),
    );
    await activarCajon(page).click();
    await expect(page.locator("[data-pago-error]")).toBeVisible();
    await expect(page.locator("[data-urgencia]")).toHaveCount(0);
    await expect(activarCajon(page)).toHaveAttribute("data-promo", "no");
    await expect(activarCajon(page)).toHaveAttribute("data-plan-value", "29");
    expect(page.url()).toContain("/contrata");
  });

  test("sin Stripe el botón ofrece solicitar asistencia por WhatsApp", async ({ page }) => {
    await ir(page, "/contrata?utm_source=ads", "2026-11-05T12:00:00-03:00");
    await sumarFlux(page);
    await page.locator("[data-carrito-icon]").click();
    await activarCajon(page).click();
    await expect(page.locator("[data-pago-error]")).toHaveText("Pago online pronto — agenda con ventas");
    await expect(page.locator("[data-urgencia]").first()).toContainText("50%");
    const wa = "https://wa.me/56985581524?text=necesito%20asistencia";
    const links = page.getByRole("link", { name: "Solicita asistencia", exact: true });
    await expect(links).toHaveCount(1);
    await expect(links).toHaveAttribute("href", wa);
    await expect(page.locator("header").getByRole("link", { name: "Solicita asistencia" })).toHaveCount(0);
    await expect(page.locator("[data-cierre]").getByRole("link", { name: "Solicita asistencia" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Agendar reunión" })).toHaveCount(0);
    await expect(page.locator("[data-cta=agendar-reunion]")).toHaveCount(0);
  });

  test("Activar por $28.000 pregunta adicionales y con esto parto abre el pago", async ({ page }) => {
    await ir(page, "/contrata?utm_source=ads", "2026-11-05T12:00:00-03:00");
    let body: { carrito?: Record<string, number> } = {};
    await page.route("**/api/contrata/checkout", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, url: "https://checkout.stripe.com/c/pay/cs_test_ok", promo: true }),
      });
    });
    await page.locator("[data-flux-base]").getByRole("button", { name: "Activar por $28.000" }).click();
    const hoja = page.locator("[data-extras]");
    await expect(hoja.getByRole("heading", { name: "¿Quieres adicionales o con esto partes?" })).toBeVisible();
    for (const id of ["profesional_extra", "sucursal_extra", "conversaciones_1000", "instagram", "facebook", "agente_ia"]) {
      await expect(hoja.locator(`[data-chip=${id}]`)).toBeVisible();
    }
    await hoja.locator("[data-chip=instagram]").click();
    await hoja.getByRole("button", { name: "Continuar" }).click();
    await expect.poll(() => body.carrito?.instagram).toBe(1);
    expect(body.carrito?.flux_base).toBe(1);
    expect(body.carrito?.profesional_extra ?? 0).toBe(0);
  });

  test("?plan=flux&pe=3&ig=1&fb=1 abre el carrito con esas cantidades", async ({ page }) => {
    await ir(page, "/contrata?plan=flux&pe=3&ig=1&fb=1&em=1", "2026-11-05T12:00:00-03:00");
    await expect(page.locator("[data-addon=profesional_extra] output")).toHaveText("3");
    await expect(page.locator("[data-addon=instagram]").getByRole("button", { name: "Quitar" })).toBeVisible();
    await expect(page.locator("[data-addon=facebook]").getByRole("button", { name: "Quitar" })).toBeVisible();
    await expect(page.locator("[data-carrito-count]")).toHaveText("6");
    await expect(page.locator("[data-addon=email_marketing]")).toHaveCount(0);
    await expect(page.locator("[data-flux-base]").getByRole("button", { name: "Quitar" })).toBeVisible();
  });

  test("un email válido de la URL viaja al activar y uno inválido no", async ({ page }) => {
    await ir(page, "/contrata?plan=flux&pe=1&email=Ana@Clinica.cl", "2026-11-05T12:00:00-03:00");
    let body: { email?: string; carrito?: Record<string, number> } = {};
    await page.route("**/api/contrata/checkout", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, url: "https://checkout.stripe.com/c/pay/cs_test_ok", promo: true }),
      });
    });
    await page.locator("[data-carrito-icon]").click();
    await activarCajon(page).click();
    await expect.poll(() => body.email).toBe("ana@clinica.cl");
    expect(body.carrito?.profesional_extra).toBe(1);
    expect(body.carrito?.flux_base).toBe(1);

    body = {};
    await page.goto("/contrata?plan=flux&email=no-es-correo", { waitUntil: "domcontentloaded" });
    // El clic de arriba puede caer antes de hidratar: reintenta hasta que el cajón abra.
    await expect(async () => {
      if (!(await page.locator("[data-drawer]").isVisible())) {
        await page.locator("[data-carrito-icon]").click();
      }
      await expect(page.locator("[data-drawer]")).toBeVisible();
    }).toPass();
    await activarCajon(page).click();
    await expect.poll(() => body.carrito?.flux_base).toBe(1);
    expect(body.email).toBeUndefined();
  });

  test("el carrito cabe en el celular y el resumen sigue a la vista en escritorio", async ({ page }) => {
    await page.clock.install({ time: new Date("2026-11-05T12:00:00-03:00") });
    for (const [w, h] of [
      [375, 667],
      [390, 844],
      [360, 740],
    ] as const) {
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/contrata", { waitUntil: "load" });
      const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(desborde, `${w}x${h}`).toBeLessThanOrEqual(1);
      const cta = page.locator("[data-testid=mobile-cta] button:visible");
      await expect(cta).toBeVisible();
      const caja = await cta.boundingBox();
      expect(caja?.height ?? 0, `${w} alto`).toBeGreaterThanOrEqual(48);
      expect((caja?.y ?? 999) + (caja?.height ?? 0), `${w} dentro`).toBeLessThanOrEqual(h + 1);
      const font = await cta.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(font, `${w} tipo`).toBeGreaterThanOrEqual(16);
      const paso = page.locator("[data-addon=profesional_extra]").getByRole("button", { name: "Primero agrega Clinera Flux" });
      const pasoCaja = await paso.boundingBox();
      expect(pasoCaja?.height ?? 0, `${w} agregar`).toBeGreaterThanOrEqual(44);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/contrata", { waitUntil: "load" });
    await page.locator("[data-carrito-icon]").click();
    const drawer = await page.locator("[data-drawer]").boundingBox();
    expect(drawer?.y ?? 999).toBeLessThan(200);
    expect(await page.locator("[data-drawer]").isVisible()).toBe(true);
    await expect(activarCajon(page)).toBeVisible();
  });
});
