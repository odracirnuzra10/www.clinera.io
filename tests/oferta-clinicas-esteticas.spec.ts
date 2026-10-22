// /oferta-clinicas-esteticas (Ricardo, 22-oct-2026): landing de anuncios sin menú, con el
// wizard de /agenda arriba, las funciones de Clinera y cierre «software + marketing por US$ 379». Solo esta landing tiene ese
// precio: /planes sigue en 529, la página no se indexa y /agenda muestra 379 solo con
// `?oferta=estetica379`. Red mockeada.

import { expect, test, type Page, type Request } from "@playwright/test";

async function mockRed(page: Page) {
  for (const path of ["**/api/wizard", "**/api/meta/capi"]) {
    await page.route(path, (route) =>
      route.request().method() === "POST"
        ? route.fulfill({ status: 200, contentType: "application/json", body: "{}" })
        : route.continue(),
    );
  }
  await page.route(/connect\.facebook\.net|googletagmanager/, (route) => route.abort());
}

async function deslizar(page: Page) {
  await expect(async () => {
    if (!(await page.locator('[data-agenda-paso="2"]').isVisible())) {
      const pista = (await page.locator("[data-quiero-ahorrar]").boundingBox())!;
      const perilla = (await page.locator("[data-perilla]").boundingBox())!;
      const y = perilla.y + perilla.height / 2;
      await page.mouse.move(perilla.x + perilla.width / 2, y);
      await page.mouse.down();
      await page.mouse.move(pista.x + pista.width + 20, y, { steps: 12 });
      await page.mouse.up();
    }
    await expect(page.locator('[data-agenda-paso="2"]')).toBeVisible({ timeout: 2500 });
  }).toPass({ timeout: 20000 });
}

test("landing: sin menú, el wizard arriba con 379, funciones y la oferta al final", async ({ page }) => {
  await mockRed(page);
  await page.goto("/oferta-clinicas-esteticas?utm_source=meta&fbclid=abc", { waitUntil: "domcontentloaded" });

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  // Sin navbar ni flotantes que tapen el formulario.
  await expect(page.locator("nav")).toHaveCount(0);
  await expect(page.locator(".ver-demo-float")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/clínicas estéticas/i);

  // Lo primero de la página es el wizard, con la boleta de la oferta, y entra entero en pantalla.
  const primero = await page.locator("main > section").first().getAttribute("id");
  expect(primero).toBe("formulario");
  const boleta = page.locator('[data-oferta-wizard] [data-agenda-paso="1"] [data-ahorro]');
  await expect(boleta).toContainText("US$ 379/mes");
  await expect(boleta).not.toContainText("US$ 529/mes");
  await expect(page.locator("[data-quiero-ahorrar]")).toBeInViewport();

  const funciones = page.locator("[data-funciones-estetica] li");
  await expect(funciones).toHaveCount(9);
  await expect(page.locator("[data-funciones-estetica]")).toContainText("AURA");

  // La oferta es lo último del <main>, y su CTA sube al formulario.
  const ultimo = await page.locator("main > section").last().getAttribute("id");
  expect(ultimo).toBe("oferta");
  const oferta = page.locator("[data-oferta-estetica]");
  await oferta.scrollIntoViewIfNeeded();
  await expect(oferta).toContainText(/Llévate el software \+ marketing por\s*US\$ 379\s*al mes/);
  await expect(oferta).toContainText("US$ 529/mes"); // precio regular, tachado
  await expect(oferta).toContainText("La inversión en anuncios se paga aparte");
  await expect(page.locator("main")).not.toContainText(/sincroniza con (AgendaPro|Reservo)/i);
  const cta = oferta.locator('a[data-cta-ventas="oferta-cierre"]');
  await expect(cta).toHaveAttribute("href", "#formulario");
  await cta.click();
  await expect(page.locator("[data-quiero-ahorrar]")).toBeInViewport();
});

test("landing: el lead completa el wizard ahí mismo y el closer ve la oferta", async ({ page }) => {
  await mockRed(page);
  const hits: Record<string, string>[] = [];
  page.on("request", (req: Request) => {
    if (req.url().includes("/api/wizard") && req.method() === "POST") hits.push(JSON.parse(req.postData() || "{}"));
  });
  await page.goto("/oferta-clinicas-esteticas?fbclid=abc", { waitUntil: "domcontentloaded" });
  await deslizar(page);
  await page.getByLabel("Nombre", { exact: true }).fill("[E2E TEST] Oferta landing");
  await page.getByLabel("Correo", { exact: true }).fill("e2e-oferta-landing@e2e.clinera.io");
  await page.getByLabel("Celular (WhatsApp)").fill("912345678");
  await page.getByLabel("Nombre de tu clínica").fill("[E2E TEST] Estética");
  await page.getByRole("button", { name: /Elegir mi hora/ }).click();
  await expect(page.locator('[data-agenda-paso="3"]')).toBeVisible();
  await expect.poll(() => hits.filter((h) => h.lead_stage === "contact").length).toBe(1);
  const contacto = hits.find((h) => h.lead_stage === "contact")!;
  expect(contacto.servicio_interes).toBe("ambas");
  expect(contacto.servicio_interes_label).toContain("oferta US$ 379");
  expect(JSON.stringify(contacto)).toContain("/oferta-clinicas-esteticas");
});

test("/agenda con la oferta: boleta a 379 y el closer lo ve en el CRM", async ({ page }) => {
  await mockRed(page);
  const hits: Record<string, string>[] = [];
  page.on("request", (req: Request) => {
    if (req.url().includes("/api/wizard") && req.method() === "POST") hits.push(JSON.parse(req.postData() || "{}"));
  });
  await page.goto("/agenda?servicio=ambas&oferta=estetica379", { waitUntil: "domcontentloaded" });
  const boleta = page.locator('[data-agenda-paso="1"] [data-ahorro]');
  await expect(boleta).toContainText("US$ 379/mes");
  await expect(boleta).toContainText("Ahorras desde US$ 621 al mes");
  await expect(boleta).not.toContainText("US$ 529/mes");

  await deslizar(page);

  await page.getByLabel("Nombre", { exact: true }).fill("[E2E TEST] Oferta");
  await page.getByLabel("Correo", { exact: true }).fill("e2e-oferta@e2e.clinera.io");
  await page.getByLabel("Celular (WhatsApp)").fill("912345678");
  await page.getByLabel("Nombre de tu clínica").fill("[E2E TEST] Estética");
  await page.getByRole("button", { name: /Elegir mi hora/ }).click();
  await expect(page.locator('[data-agenda-paso="3"]')).toBeVisible();
  await expect.poll(() => hits.filter((h) => h.lead_stage === "contact").length).toBe(1);
  const contacto = hits.find((h) => h.lead_stage === "contact")!;
  expect(contacto.servicio_interes).toBe("ambas");
  expect(contacto.servicio_interes_label).toContain("oferta US$ 379");
});

test("/agenda sin oferta o con un valor inventado sigue en 529", async ({ page }) => {
  await mockRed(page);
  for (const url of ["/agenda", "/agenda?oferta=gratis1"]) {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const boleta = page.locator('[data-agenda-paso="1"] [data-ahorro]');
    await expect(boleta).toContainText("US$ 529/mes");
    await expect(boleta).not.toContainText("US$ 379");
  }
});

test("móvil: sin scroll horizontal y la oferta se lee completa", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await mockRed(page);
  await page.goto("/oferta-clinicas-esteticas", { waitUntil: "domcontentloaded" });
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(ancho).toBeLessThanOrEqual(390);
  // El wizard entra en la primera pantalla y la perilla queda a la vista.
  await expect(page.locator("[data-quiero-ahorrar]")).toBeInViewport();
  const cta = page.locator('a[data-cta-ventas="oferta-cierre"]');
  await cta.scrollIntoViewIfNeeded();
  await expect(cta).toBeInViewport();
  await ctx.close();
});
