import { expect, test } from "@playwright/test";

// /kimi2 es la paralela de /kimi: tres planes en USD. /kimi no se toca.
test("/kimi2 muestra Flux, Hex y Vortex recomendado", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/kimi2", { waitUntil: "domcontentloaded" });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const planes = page.locator("[data-testid=kimi2-planes]");
  const flux = planes.locator("[data-testid=plan-flux]");
  const hex = planes.locator("[data-testid=plan-hex]");
  const vortex = planes.locator("[data-testid=plan-vortex]");
  await expect(flux).toContainText("$49");
  await expect(flux).toContainText("$24.50");
  await expect(flux).toContainText("50% el primer mes");
  await expect(flux).toContainText("2 profesionales");
  await expect(flux).toContainText("WhatsApp");
  await expect(flux).toContainText("100 conversaciones");
  await expect(hex).toContainText("$79");
  await expect(hex).toContainText("$39.50");
  await expect(hex).toContainText("50% el primer mes");
  await expect(hex.locator(".badge-plan")).toHaveCount(0);
  await expect(hex).toContainText("5 profesionales");
  await expect(hex).toContainText("300 conversaciones");
  await expect(vortex).toContainText("$89");
  await expect(vortex).toContainText("$62.30");
  await expect(vortex).toContainText("30% el primer mes");
  await expect(vortex).not.toContainText("50%");
  await expect(vortex).toContainText("Recomendado");
  await expect(vortex).toContainText("10 profesionales");
  await expect(vortex).toContainText("Instagram");
  await expect(vortex).toContainText("Facebook");
  await expect(vortex).toContainText("WhatsApp");
  await expect(vortex).toContainText("2000 conversaciones");
  const orden = await planes.locator(".pcard").evaluateAll((els) =>
    els.map((el) => el.getAttribute("data-testid")),
  );
  expect(orden).toEqual(["plan-flux", "plan-hex", "plan-vortex"]);
  await expect(page.locator("[data-carrito-icon]")).toBeHidden();
  await expect(page.locator("#comenzar").getByRole("link", { name: "Solicita asistencia" })).toHaveAttribute(
    "href",
    "https://wa.me/56985581524?text=necesito%20asistencia",
  );
});

test("Vortex guarda el plan y Flux es el único que cobra en Mercado Pago", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/kimi2", { waitUntil: "domcontentloaded" });
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(ancho).toBeLessThanOrEqual(390);

  await page.locator("[data-testid=plan-vortex]").getByRole("button", { name: "Crea tu cuenta" }).click();
  const modal = page.locator("[data-cuenta]");
  await expect(modal).toBeVisible();
  await expect(modal.locator("[data-cuenta-resumen]")).toContainText("Vortex");
  await expect(modal.locator("[data-cuenta-resumen]")).toContainText("$62.30");
  await expect(modal.locator("[data-cuenta-resumen]")).toContainText("30%");
  await expect(modal.locator("[data-cuenta-resumen]")).toContainText("$89");
  await expect(modal.locator("[data-cuenta-pagar]")).toBeHidden();
  const listo = modal.locator("[data-cuenta-listo]");
  await expect(listo).toBeVisible();
  const alto = await listo.boundingBox();
  expect(alto?.height ?? 0).toBeGreaterThanOrEqual(48);
  const font = await listo.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(font).toBeGreaterThanOrEqual(16);

  const lead = page.waitForRequest((req) => req.url().includes("/api/wizard") && req.method() === "POST");
  await modal.locator("input[name=nombre]").fill("Ana Ruiz");
  await modal.locator("input[name=celular]").fill("912345678");
  await modal.locator("input[name=email]").fill("ana@clinica.test");
  await modal.locator("input[name=clinica]").fill("Clínica Norte");
  await listo.click();
  const body = (await lead).postDataJSON();
  expect(body.plan).toBe("vortex");
  expect(body.source_path).toBe("/kimi2");
  expect(body.servicio_interes_label).toBe("Vortex $62.30 primer mes, luego $89");
  expect(body.celular_digits).toBe("912345678");
  expect(body.telefono).toBe("+56912345678");
  await expect(modal.locator("[data-cuenta-ok]")).toContainText("Vortex");

  await page.getByRole("button", { name: "Cerrar cuenta" }).click();
  await page.locator("[data-testid=plan-flux]").getByRole("button", { name: "Crea tu cuenta" }).click();
  await expect(modal.locator("[data-cuenta-resumen]")).toContainText("Flux");
  await expect(modal.locator("[data-cuenta-resumen]")).toContainText("$14.495");
  const pagar = modal.locator("[data-cuenta-pagar]");
  await expect(pagar).toBeVisible();
  await expect(pagar).toHaveAttribute("href", "https://mpago.la/22dyhQr");
  await expect(modal.locator("[data-cuenta-listo]")).toBeHidden();
  await expect(modal.locator("[data-asistencia-enviar]")).toBeHidden();
});

test("/kimi2 pide los cuatro datos antes de abrir WhatsApp", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/kimi2", { waitUntil: "domcontentloaded" });
  await page.locator("#comenzar").scrollIntoViewIfNeeded();
  await page.locator("#comenzar").getByRole("link", { name: "Solicita asistencia" }).click();
  const modal = page.locator("[data-cuenta]");
  await expect(modal).toBeVisible();
  await expect(modal.locator("#cuenta-titulo")).toHaveText("Solicita asistencia");
  await expect(modal.locator("[data-asistencia-enviar]")).toBeVisible();
  await expect(modal.locator("[data-cuenta-pagar]")).toBeHidden();
  await expect(modal.locator("[data-cuenta-listo]")).toBeHidden();
  await modal.locator("[data-asistencia-enviar]").click();
  await expect(modal.locator("[data-cuenta-error]")).toBeVisible();
  let lead: { fuente?: string; telefono?: string; servicio_interes_label?: string } | null = null;
  await page.route("**/api/wizard", async (route) => {
    lead = route.request().postDataJSON();
    await route.abort();
  });
  await page.route("https://wa.me/**", (route) => route.abort());
  await modal.locator("input[name=nombre]").fill("Ana Ruiz");
  await modal.locator("input[name=celular]").fill("912345678");
  await modal.locator("input[name=email]").fill("ana@clinica.test");
  await modal.locator("input[name=clinica]").fill("Clínica Norte");
  const popup = page.waitForEvent("popup");
  await modal.locator("[data-asistencia-enviar]").click();
  await expect.poll(() => lead?.telefono).toBe("+56912345678");
  expect(lead?.fuente).toBe("Landing /kimi2 — asistencia");
  expect(lead?.servicio_interes_label).toBe("Solicita asistencia");
  const abierto = (await popup).url();
  expect(abierto).toContain("56985581524");
  expect(abierto).toContain("necesito");
});
