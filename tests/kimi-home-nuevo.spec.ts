import { expect, test } from "@playwright/test";

const HEADLINE = "La plataforma médica con IA que transforma leads en pacientes con evaluaciones pagadas";

for (const ruta of ["/kimi", "/home-nuevo"]) {
  test.describe(ruta, () => {
    test("el titular es exactamente la frase nueva", async ({ page }) => {
      await page.goto(ruta, { waitUntil: "domcontentloaded" });
      const texto = (await page.locator("h1").innerText()).replace(/\s+/g, " ").trim();
      expect(texto).toBe(HEADLINE);
      await expect(page).toHaveTitle(new RegExp(HEADLINE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    });

    test("Contratar lleva el plan y la atribución de la visita", async ({ page }) => {
      await page.goto(`${ruta}?utm_source=t&gclid=g`, { waitUntil: "domcontentloaded" });
      const links = page.locator("a[data-contrata-link]");
      const n = await links.count();
      expect(n).toBeGreaterThan(0);
      for (let i = 0; i < n; i++) {
        const a = links.nth(i);
        await expect(a).toHaveAttribute("data-cta", /.+/);
        await expect(a).toHaveAttribute("data-plan", /Flux|Hex|Vortex/);
        const href = await a.getAttribute("href");
        expect(href).toContain("utm_source=t");
        expect(href).toContain("gclid=g");
        expect(href).toMatch(/plan=(flux|hex|vortex)/);
      }
    });

    test("la foto de Hebe es el placeholder con el texto limpio", async ({ page }) => {
      await page.goto(ruta, { waitUntil: "domcontentloaded" });
      await expect(page.locator("[data-testid=hebe-testimonio] img")).toHaveAttribute(
        "alt",
        "Clienta de Método Hebe sosteniendo una bolsa de la clínica",
      );
    });

    test("Flux no incluye Clinera Intelligence", async ({ page }) => {
      await page.goto(ruta, { waitUntil: "domcontentloaded" });
      await expect(page.locator("[data-testid=plan-flux]")).not.toContainText("Clinera Intelligence");
    });

    test("en 375 el titular no desborda", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(ruta, { waitUntil: "domcontentloaded" });
      const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(ancho).toBeLessThanOrEqual(375);
      const cabe = await page.locator("h1").evaluate((el) => el.scrollWidth <= el.clientWidth + 1);
      expect(cabe).toBe(true);
    });
  });
}

test("el pie de /kimi enlaza Términos y Privacidad", async ({ page, request }) => {
  await page.goto("/kimi", { waitUntil: "domcontentloaded" });
  await expect(page.locator("footer a", { hasText: "Términos" })).toHaveAttribute("href", "/terminos");
  await expect(page.locator("footer a", { hasText: "Privacidad" })).toHaveAttribute("href", "/privacidad");
  expect((await request.get("/terminos")).status()).toBe(200);
  expect((await request.get("/privacidad")).status()).toBe(200);
});

test("el pie de /home-nuevo también enlaza Términos y Privacidad", async ({ page }) => {
  await page.goto("/home-nuevo", { waitUntil: "domcontentloaded" });
  const legal = page.locator("footer").getByText("Legal").locator("xpath=..");
  await expect(legal.locator("a", { hasText: "Términos" })).toHaveAttribute("href", "/terminos");
  await expect(legal.locator("a", { hasText: "Privacidad" })).toHaveAttribute("href", "/privacidad");
});

for (const ruta of ["/kimi", "/home-nuevo"]) {
  test(`${ruta}: el popup llega a la oferta y el embed lleva fecha`, async ({ page }) => {
    const errores: string[] = [];
    page.on("pageerror", (err) => errores.push(String(err)));
    await page.route(/clarity\.ms|facebook\.net|facebook\.com|googletagmanager|google-analytics|hotjar/, (route) => route.abort());
    await page.clock.setFixedTime(new Date("2026-11-06T10:00:00-03:00"));
    await page.goto(ruta, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Hablar con ventas" }).first().click();
    await page.locator("#w-nombre").fill("Ana Soto");
    await page.locator("#wiz-next").click();
    await page.locator("#w-clinica").fill("Clínica Vela");
    await page.locator("#wiz-next").click();
    await page.locator("label.wiz-opt").first().click();
    await page.locator("#wiz-next").click();
    await page.locator("#w-celular").fill("912345678");
    await page.locator("#w-correo").fill("ana@clinica.cl");
    await page.locator("#wiz-next").click();
    const link = page.locator("#wiz-offer-link");
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /^\/contrata\?plan=flux/);
    expect(errores).toEqual([]);
    await page.locator("#wiz-agendar").click();
    await expect(page.locator("#wiz-agenda-frame")).toHaveAttribute("src", /fecha=/);
  });
}
