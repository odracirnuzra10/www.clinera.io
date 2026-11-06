import { expect, test } from "@playwright/test";

// /kimi-gratis es la prueba de la demo de 7 días. /kimi y /kimi2 no cambian.
test("/kimi-gratis vende la demo de 7 días y los tres planes de lista", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/kimi-gratis", { waitUntil: "domcontentloaded" });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("h1")).toHaveText("Crea tu cuenta gratis");
  await expect(page.locator("#hero-cta")).toContainText("Registra y activa tu clínica");
  const pintura = (sel: string) =>
    page.locator(sel).evaluate((el) => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, image: cs.backgroundImage, shadow: cs.boxShadow, filter: cs.filter };
    });
  const heroBtn = await pintura("#hero-cta .btn");
  const mediaBtn = await pintura("[data-testid=kimi-asistencia-media] .btn.grad");
  const cierreBtn = await pintura("#comenzar .btn.grad");
  expect(heroBtn.bg).toBe("rgb(17, 17, 17)");
  expect(heroBtn.image).toBe("none");
  expect(heroBtn.shadow).toBe("none");
  expect(mediaBtn.bg).toBe("rgb(17, 17, 17)");
  expect(mediaBtn.shadow).toBe("none");
  expect(cierreBtn.bg).toBe("rgb(124, 58, 237)");
  expect(cierreBtn.image).toBe("none");
  expect(cierreBtn.shadow).toBe("none");
  expect(cierreBtn.filter).toBe("none");
  const wash = await page.locator("#comenzar").evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(wash).toContain("radial-gradient");
  expect(wash).toContain("167, 139, 250");
  await expect(page.locator("header.nav")).not.toContainText("Crea tu cuenta");
  await expect(page.locator("header.nav .nav-cta")).toHaveCount(0);
  await expect(page.locator("#mobile-cta [data-bar-label]")).toHaveCount(0);
  await expect(page.locator("#mobile-cta [data-bar-accion]")).toHaveText("Crea tu cuenta");
  await expect(page.locator("#mobile-cta .mcta-row")).not.toContainText("Vortex");
  const media = page.locator("[data-testid=kimi-asistencia-media]");
  await expect(media.getByRole("link", { name: "Solicita asistencia" })).toHaveAttribute(
    "href",
    "https://wa.me/56985581524?text=necesito%20asistencia",
  );
  await expect(page.locator(".hero")).toContainText("Demo de 7 días");
  await expect(page.locator(".hero")).not.toContainText("Prueba gratis, sin compromiso");
  await expect(page.locator("main")).not.toContainText("$14.495");
  await expect(page.locator("main")).not.toContainText("primer mes");

  const planes = page.locator("[data-testid=kimi-gratis-planes]");
  const flux = planes.locator("[data-testid=plan-flux]");
  const hex = planes.locator("[data-testid=plan-hex]");
  const vortex = planes.locator("[data-testid=plan-xcale]");
  await expect(flux).toContainText("$49");
  await expect(flux).toContainText("2 profesionales");
  await expect(flux).toContainText("1 sucursal");
  await expect(flux).toContainText("WhatsApp");
  await expect(flux).toContainText("300 conversaciones");
  await expect(flux).toContainText("Clinera Intelligence");
  await expect(flux).not.toContainText("5000");
  await expect(hex).toContainText("$129");
  await expect(hex).toContainText("5 profesionales");
  await expect(hex).toContainText("2 sucursales");
  await expect(hex).toContainText("600 conversaciones");
  await expect(hex).toContainText("Clinera Intelligence");
  await expect(hex).not.toContainText("5000");
  await expect(hex.locator(".badge-plan")).toHaveCount(0);
  await expect(vortex).toContainText("Xcale");
  await expect(vortex).not.toContainText("Vortex");
  await expect(page.locator("main")).not.toContainText("Vortex");
  const xcaleGlow = await vortex.evaluate((el) => {
    const wash = getComputedStyle(el, "::after");
    const btn = el.querySelector(".btn.grad");
    const cs = getComputedStyle(btn!);
    return { filter: wash.filter, image: wash.backgroundImage, shadow: cs.boxShadow, bg: cs.backgroundColor };
  });
  expect(xcaleGlow.bg).toBe("rgb(17, 17, 17)");
  expect(xcaleGlow.shadow).toBe("none");
  expect(xcaleGlow.filter).toContain("blur");
  expect(xcaleGlow.image).toContain("radial-gradient");
  const pago = vortex.locator("a.btn.grad");
  await expect(pago).toHaveAttribute("href", "https://buy.stripe.com/8x29AV7cZ9eG9wTgwz1441O");
  await expect(pago).toHaveAttribute("data-plan", "xcale");
  await expect(pago).toHaveAttribute("data-plan-value", "149");
  await expect(pago).not.toHaveAttribute("data-abrir-cuenta", /.+/);
  await expect(flux.locator("a[href*='buy.stripe.com']")).toHaveCount(0);
  await expect(hex.locator("a[href*='buy.stripe.com']")).toHaveCount(0);
  await expect(vortex).toContainText("$149");
  await expect(vortex).toContainText("Recomendado");
  await expect(vortex).toContainText("10 profesionales");
  await expect(vortex).toContainText("3 sucursales");
  await expect(vortex).toContainText("2000 conversaciones");
  await expect(vortex).toContainText("Clinera Intelligence · 5000 créditos");
  await expect(vortex).not.toContainText("Agente IA con 5000 créditos");
  await expect(vortex).toContainText("Onboarding humano");

  const extras = page.locator("[data-testid=kimi-gratis-addons]");
  await expect(extras).toContainText("$25");
  await expect(extras).toContainText("5000 créditos IA");
  await expect(extras).toContainText("Profesional extra");
  await expect(extras).toContainText("Sucursal extra");
  await expect(extras).toContainText("$48");
  await expect(extras).toContainText("1000 conversaciones");
  await expect(page.locator("[data-cuenta-pagar]")).toBeHidden();

  const flujo = page.locator("[data-testid=kimi-flujo]");
  await expect(flujo).toContainText("WhatsApp");
  await expect(flujo).toContainText("Facebook");
  await expect(flujo).toContainText("Instagram");
  await expect(flujo).toContainText("Facebook conectado");
  await expect(flujo).toContainText("Instagram conectado");
  await expect(flujo).not.toContainText("Horarios y tratamientos");
});

test("/kimi-gratis pide los cuatro datos antes de registrar y antes de WhatsApp", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/kimi-gratis", { waitUntil: "domcontentloaded" });
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(ancho).toBeLessThanOrEqual(390);

  await page.locator(".hero").getByRole("button", { name: "Registra y activa tu clínica" }).click();
  const modal = page.locator("[data-cuenta]");
  await expect(modal).toBeVisible();
  await expect(modal.locator("[data-cuenta-resumen]")).toHaveText("Xcale · recomendado · $149. Demo de 7 días. Incluye Clinera Intelligence con 5000 créditos y onboarding humano.");
  await expect(modal).not.toContainText("Vortex");
  await expect(modal.locator("[data-cuenta-pagar]")).toBeHidden();
  await modal.locator("[data-cuenta-listo]").click();
  await expect(modal.locator("[data-cuenta-error]")).toBeVisible();

  await page.route("https://app.clinera.io/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "alta" }));
  const lead = page.waitForRequest((req) => req.url().includes("/api/wizard") && req.method() === "POST");
  // Lead del pixel (6-nov-2026): sale por CAPI con el mismo event_id que viaja al CRM.
  const capi = page.waitForRequest((req) => req.url().includes("/api/meta/capi") && req.method() === "POST");
  const alta = page.waitForRequest((req) => req.url().startsWith("https://app.clinera.io/auth/register"));
  await modal.locator("input[name=nombre]").fill("Ricardo");
  await modal.locator("input[name=celular]").fill("9650312199");
  await modal.locator("input[name=email]").fill("ricardo@oacg.cl");
  await modal.locator("input[name=clinica]").fill("metodo hebe");
  await modal.locator("[data-cuenta-listo]").click();
  await expect(modal.locator("[data-cuenta-error]")).toBeHidden();
  const altaUrl = new URL((await alta).url());
  const body = (await lead).postDataJSON();
  expect(altaUrl.origin + altaUrl.pathname).toBe("https://app.clinera.io/auth/register");
  expect(altaUrl.searchParams.get("nombre")).toBe("Ricardo");
  expect(altaUrl.searchParams.get("email")).toBe("ricardo@oacg.cl");
  expect(altaUrl.searchParams.get("telefono")).toBe("+56965031219");
  expect(altaUrl.searchParams.get("clinica")).toBe("metodo hebe");
  expect(altaUrl.searchParams.get("plan")).toBe("xcale");
  expect(body.plan).toBe("vortex");
  expect(body.source_path).toBe("/kimi-gratis");
  expect(body.servicio_interes_label).toBe("Xcale $149 demo 7 días");
  expect(body.telefono).toBe("+56965031219");
  const capiBody = (await capi).postDataJSON();
  expect(capiBody.event_name).toBe("Lead");
  expect(capiBody.custom_data).toMatchObject({ value: 3, currency: "USD" });
  expect(capiBody.event_id).toMatch(/^lead_kg_/);
  expect(capiBody.event_id).toBe(body.event_id);
  expect(capiBody.user_data.em).toMatch(/^[0-9a-f]{64}$/);
  expect(capiBody.user_data.ph).toMatch(/^[0-9a-f]{64}$/);

  await page.goto("/kimi-gratis", { waitUntil: "domcontentloaded" });
  await page.locator("#comenzar").getByRole("link", { name: "Solicita asistencia" }).click();
  await expect(modal).toBeVisible();
  await modal.locator("input[name=nombre]").fill("");
  await modal.locator("input[name=celular]").fill("");
  await modal.locator("input[name=email]").fill("");
  await modal.locator("input[name=clinica]").fill("");
  await modal.locator("[data-asistencia-enviar]").click();
  await expect(modal.locator("[data-cuenta-error]")).toBeVisible();
});
