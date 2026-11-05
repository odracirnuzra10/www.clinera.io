import { expect, test } from "@playwright/test";

// /contrata (Ricardo, 5-nov-2026): wizard de contratación, mismo cascarón que /agenda.
// El 50% no se ve antes del paso 4. Flux queda preseleccionado salvo ?plan=hex|vortex.
test.describe("/contrata", () => {
  test("no redirige y no se indexa", async ({ page }) => {
    const res = await page.goto("/contrata", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe("/contrata");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator("[data-contrata-wizard]")).toHaveAttribute("data-paso", "1");
  });

  test("el paso 1 muestra los tres planes a precio de lista, sin el 50%", async ({ page }) => {
    await page.goto("/contrata", { waitUntil: "domcontentloaded" });
    const paso = page.locator("[data-contrata-paso='1']");
    await expect(paso.locator("[data-plan-opcion='flux'] [data-precio]")).toContainText("USD 79");
    await expect(paso.locator("[data-plan-opcion='hex'] [data-precio]")).toContainText("USD 179");
    await expect(paso.locator("[data-plan-opcion='vortex'] [data-precio]")).toContainText("USD 279");
    await expect(paso.locator("[data-plan-opcion='flux'] input")).toBeChecked();
    await expect(paso).toContainText("500 conversaciones");
    await expect(paso).toContainText("2.500 conversaciones");
    await expect(paso).toContainText("28.000 créditos");
    const texto = await paso.innerText();
    expect(texto).not.toMatch(/39,50|89,50|139,50|50%/);
  });

  test("?plan=hex deja Hex elegido", async ({ page }) => {
    await page.goto("/contrata?plan=hex", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-plan-opcion='hex'] input")).toBeChecked();
  });

  test("al terminar, Flux está al 50% y el CTA apunta al marcador de checkout", async ({ page }) => {
    await page.goto("/contrata", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continuar →" }).click();
    await page.locator("#ct-nombre").fill("Ana Soto");
    await page.getByLabel("Celular (WhatsApp)").fill("912345678");
    await page.getByLabel("Correo").fill("ana@clinica.cl");
    await page.getByRole("button", { name: "Continuar →" }).click();
    await page.getByLabel("Nombre de tu clínica").fill("Clínica Vela");
    await page.getByLabel("Ubicación").fill("Providencia");
    await page.getByRole("button", { name: "Ver mi oferta →" }).click();
    await page.getByRole("button", { name: "Sí, correcto" }).click();

    const oferta = page.locator("[data-oferta]");
    await expect(oferta).toBeVisible();
    await expect(oferta.locator("[data-plan-opcion='flux'] input")).toBeChecked();
    await expect(oferta.locator("[data-plan-opcion='flux'] [data-precio]")).toContainText("USD 39,50");
    await expect(oferta.locator("[data-plan-opcion='hex'] [data-precio]")).toContainText("USD 89,50");
    await expect(oferta.locator("[data-plan-opcion='vortex'] [data-precio]")).toContainText("USD 139,50");
    const cta = oferta.locator("[data-cta='oferta-50']");
    await expect(cta).toHaveText("Aprovechar Flux al 50%");
    await expect(cta).toHaveAttribute("href", "[LINK CHECKOUT FLUX 50%]");

    await oferta.locator("[data-plan-opcion='vortex']").click();
    await expect(cta).toHaveText("Aprovechar Vortex al 50%");
    await expect(cta).toHaveAttribute("href", "[LINK CHECKOUT VORTEX 50%]");
    await expect(cta).toHaveAttribute("data-checkout", "vortex");
  });

  test("Agendar reunión carga el embed de Clinera", async ({ page }) => {
    await page.goto("/contrata?plan=flux", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continuar →" }).click();
    await page.locator("#ct-nombre").fill("Ana Soto");
    await page.getByLabel("Celular (WhatsApp)").fill("912345678");
    await page.getByLabel("Correo").fill("ana@clinica.cl");
    await page.getByRole("button", { name: "Continuar →" }).click();
    await page.getByLabel("Nombre de tu clínica").fill("Clínica Vela");
    await page.getByLabel("Ubicación").fill("Providencia");
    await page.getByRole("button", { name: "Ver mi oferta →" }).click();
    await page.getByRole("button", { name: "Sí, correcto" }).click();
    await page.getByRole("button", { name: "Agendar reunión" }).click();
    await expect(page.locator("[data-agenda-embed] iframe")).toHaveAttribute("src", /app\.clinera\.io\/embed/);
  });

  test("en 375×667 el CTA del 50% cabe en la primera pantalla y los campos miden 16 px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/contrata", { waitUntil: "domcontentloaded" });
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(ancho).toBeLessThanOrEqual(375);

    await page.getByRole("button", { name: "Continuar →" }).click();
    const input = page.locator("#ct-nombre");
    const font = await input.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(font).toBeGreaterThanOrEqual(16);

    await input.fill("Ana Soto");
    await page.getByLabel("Celular (WhatsApp)").fill("912345678");
    await page.getByLabel("Correo").fill("ana@clinica.cl");
    await page.getByRole("button", { name: "Continuar →" }).click();
    await page.getByLabel("Nombre de tu clínica").fill("Clínica Vela");
    await page.getByLabel("Ubicación").fill("Providencia");
    await page.getByRole("button", { name: "Ver mi oferta →" }).click();
    await page.getByRole("button", { name: "Sí, correcto" }).click();

    const cta = page.locator("[data-cta='oferta-50']");
    const box = await cta.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(667);
    await expect(page.locator(".ver-demo-float")).toHaveCount(0);
  });
});
