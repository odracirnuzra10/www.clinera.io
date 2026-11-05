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

    test("Contratar lleva a /contrata con la atribución de la visita", async ({ page }) => {
      test.skip(ruta === "/kimi", "en /kimi el carrito vive en la misma página");
      await page.goto(`${ruta}?utm_source=t&gclid=g`, { waitUntil: "domcontentloaded" });
      const links = page.locator("a[data-contrata-link]");
      const n = await links.count();
      expect(n).toBeGreaterThan(0);
      for (let i = 0; i < n; i++) {
        const a = links.nth(i);
        await expect(a).toHaveAttribute("data-cta", /.+/);
        await expect(a).toHaveAttribute("data-plan", "Flux");
        const href = await a.getAttribute("href");
        expect(href).toContain("/contrata");
        expect(href).toContain("utm_source=t");
        expect(href).toContain("gclid=g");
        expect(href).not.toMatch(/plan=(hex|vortex)/);
      }
    });

    test("la foto de Hebe es el placeholder con el texto limpio", async ({ page }) => {
      await page.goto(ruta, { waitUntil: "domcontentloaded" });
      await expect(page.locator("[data-testid=hebe-testimonio] img")).toHaveAttribute(
        "alt",
        "Clienta de Método Hebe sosteniendo una bolsa de la clínica",
      );
    });

    test("muestra Flux desde USD 29 y los adicionales, sin Hex ni Vortex", async ({ page }) => {
      await page.goto(ruta, { waitUntil: "domcontentloaded" });
      const flux = page.locator("[data-testid=plan-flux]");
      await expect(flux).toContainText("USD");
      await expect(flux).toContainText("29");
      await expect(flux).toContainText("Clinera Intelligence");
      await expect(flux).toContainText("100 conversaciones");
      const extras = page.locator("[data-testid=plan-addons]");
      await expect(extras).toContainText("Profesional extra");
      await expect(extras).toContainText("Agente IA");
      await expect(extras).toContainText("Regalo de noviembre");
      await expect(page.locator("[data-testid=plan-hex]")).toHaveCount(0);
      await expect(page.locator("[data-testid=plan-vortex]")).toHaveCount(0);
      const texto = await page.locator("main").innerText();
      expect(texto).not.toMatch(/USD 179|USD 279|Hex|Vortex/);
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

test("/kimi agrega Flux y los adicionales en la misma página", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/kimi", { waitUntil: "domcontentloaded" });
  const flux = page.locator("[data-testid=plan-flux]");
  await expect(flux.locator("img")).toHaveAttribute("src", "/kimi/productos/flux.jpg");
  await expect(flux.getByRole("button", { name: "Agregar al carrito" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Comienza ya" })).toHaveCount(0);
  const orden = await page.evaluate(() => {
    const y = (id: string) => document.getElementById(id)?.getBoundingClientRect().top ?? 0;
    return { hero: y("top"), funciones: y("funciones"), planes: y("planes") };
  });
  expect(orden.planes).toBeGreaterThan(orden.hero);
  expect(orden.planes).toBeGreaterThan(orden.funciones);
  const carril = page.locator("[data-testid=plan-addons]");
  const prof = carril.locator("[data-addon=profesional_extra]");
  await expect(prof.locator("img")).toHaveAttribute("src", "/kimi/productos/profesional.jpg");
  await expect(carril.locator("[data-addon=sucursal_extra] img")).toHaveAttribute("src", "/kimi/productos/sucursal.jpg");
  await expect(carril.locator("[data-addon=conversaciones_1000] img")).toHaveAttribute("src", "/kimi/productos/conversaciones.jpg");
  await expect(carril.locator("[data-addon=instagram] img")).toHaveAttribute("src", "/kimi/productos/instagram.jpg");
  await expect(carril.locator("[data-addon=facebook] img")).toHaveAttribute("src", "/kimi/productos/facebook.jpg");
  await expect(carril.locator("[data-addon=agente_ia] img")).toHaveAttribute("src", "/kimi/productos/agente-ia.jpg");
  await expect(prof.getByRole("button", { name: "Primero agrega Clinera Flux" })).toBeDisabled();
  await expect(carril.locator("[data-addon=agente_ia] s")).toContainText("79");
  await expect(carril.locator("[data-addon=agente_ia]")).toContainText("50% por 3 meses");
  await expect(carril.locator("[data-addon=agente_ia]")).toContainText("USD 39,50 por 3 meses, luego precio normal");
  const onboarding = carril.locator("[data-addon=onboarding_humano]");
  await expect(onboarding.locator("img")).toHaveAttribute("src", "/kimi/productos/onboarding.jpg");
  await expect(onboarding).toContainText("USD 190");
  await expect(onboarding).toContainText("cobro único");
  await expect(onboarding).not.toContainText("50% por 3 meses");
  await expect(onboarding.getByRole("button", { name: "Primero agrega Clinera Flux" })).toBeDisabled();
  await flux.getByRole("button", { name: "Agregar al carrito" }).click();
  await expect(page.locator("[data-toast]")).toHaveText("Agregado al carrito");
  await expect(page.locator("[data-carrito-count]")).toHaveText("1");
  await expect(prof.getByRole("button", { name: "Agregar al carrito" })).toBeEnabled();
  await carril.locator("[data-addon=instagram]").getByRole("button", { name: "Agregar al carrito" }).click();
  await onboarding.getByRole("button", { name: "Agregar al carrito" }).click();
  await page.locator("[data-carrito-icon]").click();
  const drawer = page.locator("[data-drawer]");
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("button", { name: "Activar" })).toBeVisible();
  await expect(drawer).toContainText("50% por 3 meses");
  await expect(drawer).toContainText("cobro único");
  await expect(drawer).toContainText("190");
  await expect(drawer.locator("[data-total-hoy]")).toContainText("209");
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(ancho).toBeLessThanOrEqual(1280);
});

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
