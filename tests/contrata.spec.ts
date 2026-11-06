import { expect, test, type Page } from "@playwright/test";

async function ir(page: Page, path: string, cuando?: string) {
  if (cuando) await page.clock.install({ time: new Date(cuando) });
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.locator("nextjs-portal").evaluateAll((nodes) => nodes.forEach((n) => n.remove())).catch(() => {});
}

async function sumarFlux(page: Page) {
  await page.locator("[data-flux-base]").getByRole("button", { name: /Crea tu cuenta/ }).click();
  await expect(page.locator("[data-cuenta]")).toBeVisible();
  await page.getByRole("button", { name: "Cerrar cuenta" }).click();
  await expect(page.locator("[data-cuenta]")).toBeHidden();
}

function activarCajon(page: Page) {
  return page.locator("[data-drawer]").getByRole("button", { name: "Crea tu cuenta por $14.495" });
}

async function linkDePago(page: Page) {
  await activarCajon(page).click();
  const pagar = page.locator("[data-cuenta-pagar]");
  await expect(pagar).toBeVisible();
  return pagar;
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
    await expect(page.getByText(/Los adicionales son profesionales, conversaciones y créditos de IA/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "También puedes agregar" })).toBeVisible();
    await expect(page.getByText("Profesionales y conversaciones. Los créditos de IA se activan después de la prueba.")).toBeVisible();
    await expect(page.locator("[data-addon=sucursal_extra]")).toHaveCount(0);
    await expect(page.locator("[data-addon=instagram]")).toHaveCount(0);
    await expect(page.locator("[data-addon=agente_ia]")).toHaveCount(0);
    await expect(page.locator("[data-carrito]").getByText("Vortex")).toHaveCount(0);
    await expect(page.locator("[data-carrito]").getByText("$178.990")).toHaveCount(0);
    await expect(page.locator("[data-flux-base]").getByRole("button", { name: "Crea tu cuenta por $14.495" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Comienza ya" })).toHaveCount(0);
    await expect(page.locator("[data-flux-base]")).toContainText("WhatsApp, Instagram y Facebook");
    await expect(page.locator("[data-flux-base]")).toContainText("$14.495");
    await expect(page.locator("[data-flux-base]")).toContainText("$78.990");
    await expect(page.locator("[data-carrito]").getByText("Vortex")).toHaveCount(0);
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

  test("email y automatizaciones van en el plan, no como regalo ni adicional", async ({ page }) => {
    await ir(page, "/contrata", "2026-11-05T12:00:00-03:00");
    await expect(page.locator("[data-regalo]")).toHaveCount(0);
    await expect(page.locator("[data-flux-base]")).toContainText("Email marketing");
    await expect(page.locator("[data-flux-base]")).toContainText("Automatizaciones avanzadas");
    await expect(page.locator("[data-addon=email_marketing]")).toHaveCount(0);
    await expect(page.locator("[data-addon=automatizaciones]")).toHaveCount(0);
    await expect(page.locator("[data-carrito]")).not.toContainText("Regalo de noviembre");
    await expect(page.locator("[data-urgencia]").first()).toContainText("Solo por hoy 05 y mañana 06 de noviembre");
  });

  test("el 1 de diciembre email y automatizaciones siguen dentro del plan", async ({ page }) => {
    await ir(page, "/contrata", "2026-12-01T12:00:00-03:00");
    await expect(page.locator("[data-regalo]")).toHaveCount(0);
    await expect(page.locator("[data-addon=email_marketing]")).toHaveCount(0);
    await expect(page.locator("[data-addon=automatizaciones]")).toHaveCount(0);
    await expect(page.locator("[data-flux-base]")).toContainText("Email marketing");
    await expect(page.locator("[data-addon=profesional_extra]")).toBeVisible();
    await expect(page.locator("[data-addon=conversaciones_1000]")).toBeVisible();
  });

  test("el HTML del servidor no trae la fecha del banner", async ({ page }) => {
    const res = await page.request.get("/contrata");
    const html = await res.text();
    expect(html).toContain("data-urgencia");
    expect(html).not.toContain("Solo por hoy");
    expect(html).not.toContain("data-regalo");
    expect(html).not.toContain("data-addon=\"email_marketing\"");
    expect(html).not.toContain("data-addon=\"sucursal_extra\"");
    expect(html).toContain("créditos de IA");
  });

  test("?plan=hex no vende Instagram ni Facebook aparte", async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem("contrata_carrito", JSON.stringify({ profesional_extra: 4 }));
    });
    await ir(page, "/contrata?plan=hex", "2026-11-05T12:00:00-03:00");
    await expect(page.locator("[data-addon=instagram]")).toHaveCount(0);
    await expect(page.locator("[data-addon=facebook]")).toHaveCount(0);
    await expect(page.locator("[data-flux-base]")).toContainText("WhatsApp, Instagram y Facebook");
    await expect(page.locator("[data-addon=profesional_extra]").getByRole("button", { name: "Agregar al carrito" })).toBeVisible();
    await expect(page.locator("[data-carrito-count]")).toHaveText("1");
  });

  test("?pago=cancelado restaura el carrito guardado", async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem("contrata_carrito", JSON.stringify({ profesional_extra: 2, instagram: 1 }));
    });
    await ir(page, "/contrata?pago=cancelado", "2026-11-05T12:00:00-03:00");
    await expect(page.locator("[data-addon=profesional_extra] output")).toHaveText("2");
    await expect(page.locator("[data-addon=instagram]")).toHaveCount(0);
  });

  test("sumar un adicional mueve el total y el valor del CTA", async ({ page }) => {
    await ir(page, "/contrata", "2026-11-05T12:00:00-03:00");
    await sumarFlux(page);
    await expect(page.locator("[data-toast]")).toHaveText("Agregado al carrito");
    await expect(page.locator("[data-carrito-count]")).toHaveText("1");
    await expect(page.locator("[data-flux-base]")).toContainText("30 días");
    await expect(page.locator("[data-flux-base]")).toContainText("Después de 30 días, $78.990");
    await page.locator("[data-carrito-icon]").click();
    const cta = await linkDePago(page);
    await expect(cta).toHaveAttribute("href", "https://mpago.la/22dyhQr");
    await expect(cta).toHaveAttribute("data-plan", "flux_modular");
    await expect(cta).toHaveAttribute("data-plan-value", "14.5");
    await page.getByRole("button", { name: "Cerrar cuenta" }).click();
    await page.locator("[data-addon=profesional_extra]").getByRole("button", { name: "Agregar al carrito" }).click();
    await expect(page.locator("[data-addon=profesional_extra] output")).toHaveText("1");
    await expect(page.locator("[data-toast]")).toHaveText("Agregado al carrito");
    await expect(page.locator("[data-addon=profesional_extra]").getByRole("button", { name: "Sumar profesional extra" })).toBeFocused();
    await expect(page.locator("[data-carrito-count]")).toHaveText("2");
    await page.locator("[data-carrito-icon]").click();
    await expect(page.locator("[data-total-hoy]")).toContainText("$14.495");
    await page.getByRole("button", { name: "Cerrar", exact: true }).click();
    await page.locator("[data-addon=profesional_extra]").getByRole("button", { name: "Sumar profesional extra" }).click();
    await expect(page.locator("[data-addon=profesional_extra] output")).toHaveText("2");
  });

  test("el cajón cobra la prueba y no ofrece onboarding ni el agente", async ({ page }) => {
    await ir(page, "/contrata", "2026-11-05T12:00:00-03:00");
    await expect(page.locator("[data-flux-base] img")).toHaveAttribute("src", "/kimi/productos/flux.jpg");
    await expect(page.locator("[data-addon=onboarding_humano]")).toHaveCount(0);
    await expect(page.locator("[data-addon=agente_ia]")).toHaveCount(0);
    await sumarFlux(page);
    await page.locator("[data-addon=profesional_extra]").getByRole("button", { name: "Agregar al carrito" }).click();
    await page.locator("[data-carrito-icon]").click();
    const drawer = page.locator("[data-drawer]");
    await expect(drawer.getByRole("button", { name: "Quitar Clinera Flux" })).toBeVisible();
    await expect(drawer.getByRole("button", { name: "Quitar Profesional extra", exact: true })).toBeVisible();
    await expect(drawer).toContainText("Hoy pagas");
    await expect(drawer.locator("[data-total-hoy]")).toContainText("$14.495");
    await expect(drawer).toContainText("Después, $78.990");
    await activarCajon(page).click();
    await expect(page.locator("[data-cuenta-pagar]")).toHaveAttribute("href", "https://mpago.la/22dyhQr");
    await expect(page.locator("[data-cuenta]")).not.toContainText("Vortex");
    await expect(page.locator("[data-cuenta]")).not.toContainText("$178.990");
    await expect(drawer).not.toContainText("Vortex");
    await expect(drawer).not.toContainText("$178.990");
  });

  test("Comienza ya manda el carrito saneado y abre el pago", async ({ page }) => {
    await ir(page, "/contrata?utm_source=ads&gclid=GCLID123", "2026-11-05T12:00:00-03:00");
    await sumarFlux(page);
    await page.locator("[data-addon=conversaciones_1000]").getByRole("button", { name: "Agregar al carrito" }).click();
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
    const pagar = await linkDePago(page);
    await expect(pagar).toHaveAttribute("href", "https://mpago.la/22dyhQr");
    expect(body.carrito).toBeUndefined();
    expect(body.price).toBeUndefined();
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
    const pagar = await linkDePago(page);
    await expect(pagar).toHaveAttribute("href", "https://mpago.la/22dyhQr");
    expect(page.url()).toContain("/contrata");
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
    const pagar = await linkDePago(page);
    await expect(pagar).toHaveAttribute("href", "https://mpago.la/22dyhQr");
    await expect(page.locator("[data-pago-error]")).toHaveCount(0);
    await expect(pagar).toHaveAttribute("data-plan-value", "14.5");
    expect(page.url()).toContain("/contrata");
  });

  test("sin Stripe el botón ofrece solicitar asistencia por WhatsApp", async ({ page }) => {
    await ir(page, "/contrata?utm_source=ads", "2026-11-05T12:00:00-03:00");
    await sumarFlux(page);
    await page.locator("[data-carrito-icon]").click();
    const pagar = await linkDePago(page);
    await expect(pagar).toHaveAttribute("href", "https://mpago.la/22dyhQr");
    await expect(page.getByText("Pago online pronto")).toHaveCount(0);
    await expect(page.locator("[data-urgencia]").first()).toContainText("$14.495");
    const wa = "https://wa.me/56985581524?text=necesito%20asistencia";
    const links = page.getByRole("link", { name: "Solicita asistencia", exact: true });
    await expect(links).toHaveCount(1);
    await expect(links).toHaveAttribute("href", wa);
    await expect(page.locator("header").getByRole("link", { name: "Solicita asistencia" })).toHaveCount(0);
    await expect(page.locator("[data-cierre]").getByRole("link", { name: "Solicita asistencia" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Agendar reunión" })).toHaveCount(0);
    await expect(page.locator("[data-cta=agendar-reunion]")).toHaveCount(0);
  });

  test("Crea tu cuenta pide nombre, correo y clínica y Pagar abre Mercado Pago", async ({ page }) => {
    await ir(page, "/contrata?utm_source=ads", "2026-11-05T12:00:00-03:00");
    let lead: { email?: string; nombre_clinica?: string; lead_stage?: string } | null = null;
    await page.route("**/api/wizard", async (route) => {
      lead = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    });
    await page.route("https://mpago.la/**", (route) => route.abort());
    await page.locator("[data-flux-base]").getByRole("button", { name: "Crea tu cuenta por $14.495" }).click();
    const modal = page.locator("[data-cuenta]");
    await expect(modal.getByRole("heading", { name: "Crea tu cuenta" })).toBeVisible();
    await modal.locator("[data-cuenta-pagar]").click();
    await expect(modal.locator("[data-cuenta-error]")).toBeVisible();
    expect(page.url()).toContain("/contrata");
    await modal.locator("input[name=nombre]").fill("Ana Soto");
    await modal.locator("input[name=email]").fill("ana@clinica.cl");
    await modal.locator("input[name=clinica]").fill("Clínica Vela");
    const pagar = modal.locator("[data-cuenta-pagar]");
    await expect(pagar).toHaveAttribute("href", "https://mpago.la/22dyhQr");
    await pagar.click();
    await expect.poll(() => lead?.email).toBe("ana@clinica.cl");
    expect(lead?.nombre_clinica).toBe("Clínica Vela");
    expect(lead?.lead_stage).toBe("contact");
  });

  test("?plan=flux&pe=3&ig=1&fb=1 abre el carrito con esas cantidades", async ({ page }) => {
    await ir(page, "/contrata?plan=flux&pe=3&ig=1&fb=1&em=1", "2026-11-05T12:00:00-03:00");
    await expect(page.locator("[data-addon=profesional_extra] output")).toHaveText("3");
    await expect(page.locator("[data-addon=instagram]")).toHaveCount(0);
    await expect(page.locator("[data-addon=facebook]")).toHaveCount(0);
    await expect(page.locator("[data-carrito-count]")).toHaveText("4");
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
    const href = await page.locator("[data-cuenta-pagar]").getAttribute("href");
    expect(href).toBe("https://mpago.la/22dyhQr");
    expect(href).not.toContain("email");
    await expect(page.locator("[data-cuenta] input[name=email]")).toHaveValue("Ana@Clinica.cl");
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
      const cta = page.locator("[data-testid=mobile-cta] button:visible, [data-testid=mobile-cta] a:visible");
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
