// /agenda-google — versión del wizard para anuncios de Google (Ricardo, 19-oct-2026), escritorio.
// Mismo flujo que /agenda; cambia la atribución (google-ads aunque la URL no traiga gclid), el
// source_path y que no se indexe. Red mockeada.

import { expect, test, type Page } from "@playwright/test";

async function mockRed(page: Page) {
  await page.route("**/api/verificar-sitio", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, url: "https://e2e.clinera.io", estado: "verificado" }) }),
  );
  for (const path of ["**/api/wizard", "**/api/meta/capi"]) {
    await page.route(path, (route) =>
      route.request().method() === "POST"
        ? route.fulfill({ status: 200, contentType: "application/json", body: "{}" })
        : route.continue(),
    );
  }
  await page.route(/connect\.facebook\.net/, (route) => route.abort());
}

async function recorrer(page: Page, ruta: string) {
  const cuerpos: string[] = [];
  page.on("request", (req) => {
    if (req.url().includes("/api/wizard") && req.method() === "POST") cuerpos.push(req.postData() || "");
  });
  await page.goto(ruta, { waitUntil: "domcontentloaded" });
  await expect(async () => {
    if (!(await page.locator('[data-agenda-paso="2"]').isVisible())) {
      await page.locator("[data-quiero-ahorrar]").click();
    }
    await expect(page.locator('[data-agenda-paso="2"]')).toBeVisible({ timeout: 2500 });
  }).toPass({ timeout: 20000 });
  await page.getByLabel("Nombre", { exact: true }).fill("[E2E TEST] Google");
  await page.getByLabel("Correo", { exact: true }).fill("e2e-google@e2e.clinera.io");
  await page.getByLabel("Celular (WhatsApp)").fill("912345678");
  await page.getByLabel("Nombre de tu clínica").fill("[E2E TEST] Clínica");
  await page.getByLabel("Sitio web de tu clínica").fill("e2e.clinera.io");
  await page.getByRole("button", { name: /Elegir mi hora/ }).click();
  await expect(page.locator('[data-agenda-paso="3"]')).toBeVisible();
  await expect.poll(() => cuerpos.length).toBeGreaterThan(0);
  return cuerpos.join("\n");
}

test.use({ viewport: { width: 1440, height: 900 } });

test("/agenda-google: escritorio, atribuye a Google Ads sin gclid y reporta su source_path", async ({ page }) => {
  await mockRed(page);
  const cuerpo = await recorrer(page, "/agenda-google");
  expect(cuerpo).toContain("google-ads");
  expect(cuerpo).toContain("/agenda-google");
  // Sin scroll de página en escritorio.
  const sobra = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  expect(sobra).toBeLessThanOrEqual(1);
});

test("/agenda sigue atribuyendo organico sin señales", async ({ page }) => {
  await mockRed(page);
  const cuerpo = await recorrer(page, "/agenda");
  expect(cuerpo).not.toContain("google-ads");
});

test("/agenda-google no se indexa", async ({ request }) => {
  const html = await (await request.get("/agenda-google")).text();
  expect(html).toMatch(/<meta name="robots" content="noindex/);
});
