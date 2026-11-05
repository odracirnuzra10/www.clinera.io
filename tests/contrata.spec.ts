import { expect, test, type Page } from "@playwright/test";
import { CHECKOUT_URL, PROMO_CODE } from "../src/content/checkout";

// /contrata (Ricardo, 5-nov-2026): wizard de 3 pasos. El plan y el 50% aparecen solo al final.
async function hastaLaOferta(page: Page) {
  await page.locator("#ct-nombre").fill("Ana Soto");
  await page.getByLabel("Celular (WhatsApp)").fill("912345678");
  await page.getByLabel("Correo").fill("ana@clinica.cl");
  await page.getByRole("button", { name: "Continuar →" }).click();
  await page.getByLabel("Nombre de tu clínica").fill("Clínica Vela");
  await page.getByLabel("Ubicación").fill("Providencia");
  await page.getByRole("button", { name: "Ver mi oferta →" }).click();
  await page.getByRole("button", { name: "Sí, correcto" }).click();
}

test.describe("/contrata", () => {
  test("no redirige y no se indexa", async ({ page }) => {
    const res = await page.goto("/contrata", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe("/contrata");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator("[data-contrata-wizard]")).toHaveAttribute("data-paso", "1");
  });

  test("el paso 1 pide los datos y no nombra planes ni el 50%", async ({ page }) => {
    await page.goto("/contrata", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-contrata-wizard]")).toHaveAttribute("data-paso", "1");
    await expect(page.locator("#ct-nombre")).toBeVisible();
    const texto = await page.locator("[data-contrata-wizard]").innerText();
    expect(texto).not.toMatch(/Flux|Hex|Vortex|USD|50%/);
  });

  test("?plan=hex preselecciona Hex en el último paso", async ({ page }) => {
    await page.goto("/contrata?plan=hex", { waitUntil: "domcontentloaded" });
    await hastaLaOferta(page);
    await expect(page.locator("[data-plan-opcion='hex'] input")).toBeChecked();
  });

  test("sin ?plan el último paso deja Flux elegido", async ({ page }) => {
    await page.goto("/contrata", { waitUntil: "domcontentloaded" });
    await hastaLaOferta(page);
    await expect(page.locator("[data-plan-opcion='flux'] input")).toBeChecked();
  });

  test("el último paso cobra el 50% en Stripe, sin código mientras PROMO_CODE esté vacío", async ({ page }) => {
    await page.goto("/contrata?utm_source=test&gclid=abc.123&fbclid=x", { waitUntil: "domcontentloaded" });
    await hastaLaOferta(page);
    const oferta = page.locator("[data-oferta]");
    await expect(oferta).toBeVisible();
    await expect(oferta.locator(".paso, [class*=paso]").first()).toContainText("Paso 3 de 3 · Tu oferta");
    await expect(page.getByText("Paso 3 de 3 · Tu oferta")).toBeVisible();
    await expect(oferta.locator("[data-plan-opcion='flux'] [data-precio]")).toContainText("USD 39,50");
    await expect(oferta.locator("[data-plan-opcion='hex'] [data-precio]")).toContainText("USD 89,50");
    await expect(oferta.locator("[data-plan-opcion='vortex'] [data-precio]")).toContainText("USD 139,50");
    const cta = oferta.locator("[data-cta='oferta-50']");
    await expect(cta).toHaveText("Aprovechar Flux al 50%");
    await expect(cta).toHaveAttribute("href", /^https:\/\/buy\.stripe\.com\/14A28tgNz1MegZl9471441J/);
    await expect(cta).toHaveAttribute("data-plan", "flux");
    await expect(cta).toHaveAttribute("data-plan-name", "Flux");
    await expect(cta).toHaveAttribute("data-plan-value", "39.5");
    expect(await cta.getAttribute("href")).toContain("prefilled_email=ana%40clinica.cl");
    expect(await cta.getAttribute("href")).toContain("utm_source=test");
    expect(await cta.getAttribute("href")).toContain("client_reference_id=abc123");
    expect(await cta.getAttribute("href")).not.toContain("fbclid");
    if (PROMO_CODE) expect(await cta.getAttribute("href")).toContain(`prefilled_promo_code=${PROMO_CODE}`);
    else expect(await cta.getAttribute("href")).not.toContain("prefilled_promo_code");

    await oferta.locator("[data-plan-opcion='vortex']").click();
    await expect(cta).toHaveAttribute("href", new RegExp("^" + CHECKOUT_URL.vortex.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });

  test("el webhook marcador avisa y no corta el paso", async ({ page }) => {
    const avisos: string[] = [];
    page.on("console", (msg) => avisos.push(msg.text()));
    const errores: string[] = [];
    page.on("pageerror", (err) => errores.push(String(err)));
    const pedidos: string[] = [];
    page.on("request", (req) => pedidos.push(req.url()));
    // Clarity y el pixel tiran "a[c] is not a function" en este entorno; no son el formulario.
    await page.route(/clarity\.ms|facebook\.net|facebook\.com|googletagmanager|google-analytics|hotjar/, (route) => route.abort());
    await page.goto("/contrata", { waitUntil: "domcontentloaded" });
    await hastaLaOferta(page);
    await expect(page.locator("[data-oferta]")).toBeVisible();
    await expect(page.locator("[data-contrata-wizard]")).toHaveAttribute("data-paso", "3");
    expect(avisos.join("\n")).toMatch(/WEBHOOK_URL sin configurar/);
    expect(errores).toEqual([]);
    expect(pedidos.some((u) => u.includes("[WEBHOOK_URL_N8N]"))).toBe(false);
  });

  test("el 50% se anima y se apaga con movimiento reducido", async ({ page }) => {
    await page.goto("/contrata", { waitUntil: "domcontentloaded" });
    await hastaLaOferta(page);
    const nombre = await page.locator("[data-oferta-destacada]").evaluate((el) => getComputedStyle(el).animationName);
    expect(nombre).not.toBe("none");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/contrata", { waitUntil: "domcontentloaded" });
    await hastaLaOferta(page);
    const quieto = await page.locator("[data-oferta-destacada]").evaluate((el) => getComputedStyle(el).animationName);
    expect(quieto).toBe("none");
  });

  test("Agendar reunión mide 16 px y el embed abre en el próximo día hábil", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-11-06T10:00:00-03:00"));
    await page.goto("/contrata", { waitUntil: "domcontentloaded" });
    await hastaLaOferta(page);
    const font = await page.getByRole("button", { name: "Agendar reunión" }).evaluate((el) => getComputedStyle(el).fontSize);
    expect(font).toBe("16px");
    await page.getByRole("button", { name: "Agendar reunión" }).click();
    const src = await page.locator("[data-agenda-embed] iframe").getAttribute("src");
    expect(src).toContain("fecha=2026-11-09");
    expect(src).toContain("date=2026-11-09");
  });

  for (const [w, h] of [[375, 667], [390, 844], [360, 740]] as const) {
    test(`celular ${w}x${h}: sin scroll horizontal y el CTA del 50% se ve`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/contrata", { waitUntil: "domcontentloaded" });
      const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(ancho).toBeLessThanOrEqual(w);
      const font = await page.locator("#ct-nombre").evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(font).toBeGreaterThanOrEqual(16);
      await hastaLaOferta(page);
      const cta = page.locator("[data-cta='oferta-50']");
      const box = await cta.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.y + box!.height).toBeLessThanOrEqual(h);
      await expect(page.locator(".ver-demo-float")).toHaveCount(0);
    });
  }
});
