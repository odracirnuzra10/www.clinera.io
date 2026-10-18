// /agenda — wizard de 3 pasos (Ricardo, 18-oct-2026): servicio (varios) → datos → horario.
// El paso 2 manda el lead al CRM y dispara Lead US$ 3; el paso 1 ViewContent; el MQL sale
// al agendar. Sin cupón ni compra desde la web. Red mockeada.

import { expect, test, type Page, type Request } from "@playwright/test";

type WizardBody = {
  lead_stage?: string;
  nombre_clinica?: string;
  servicio_interes?: string;
  celular?: string;
  fuente?: string;
  ciudad?: string;
  pais_clinica?: string;
};

function grabarWizard(page: Page) {
  const hits: WizardBody[] = [];
  page.on("request", (req: Request) => {
    if (!req.url().includes("/api/wizard") || req.method() !== "POST") return;
    try {
      hits.push(JSON.parse(req.postData() || "{}"));
    } catch {
      /* noop */
    }
  });
  return hits;
}

async function mockRed(page: Page) {
  for (const path of ["**/api/wizard", "**/api/meta/capi"]) {
    await page.route(path, (route) =>
      route.request().method() === "POST"
        ? route.fulfill({ status: 200, contentType: "application/json", body: "{}" })
        : route.continue(),
    );
  }
  await page.route(/connect\.facebook\.net/, (route) => route.abort());
}

async function pasoServicios(page: Page, ids: string[] = ["marketing", "software"]) {
  for (const id of ids) {
    const op = page.locator(`[data-servicio="${id}"]`);
    // Si el clic cae antes de que React hidrate, se reintenta hasta que quede marcado.
    await expect(async () => {
      if ((await op.getAttribute("aria-checked")) !== "true") await op.click();
      await expect(op).toHaveAttribute("aria-checked", "true", { timeout: 1500 });
    }).toPass({ timeout: 15000 });
  }
  await page.getByRole("button", { name: /Continuar/ }).click();
  await expect(page.locator('[data-agenda-paso="2"]')).toBeVisible();
}

async function llenarDatos(page: Page) {
  await page.getByLabel("Nombre", { exact: true }).fill("[E2E TEST] Agenda");
  await page.getByLabel("Correo", { exact: true }).fill("e2e-agenda@e2e.clinera.io");
  await page.getByLabel("Celular (WhatsApp)").fill("912345678");
  await page.getByLabel("Nombre de tu clínica").fill("[E2E TEST] Clínica");
}

test("wizard: servicios (varios) → datos (CRM + Lead US$ 3) → horario", async ({ page }) => {
  await mockRed(page);
  const wizard = grabarWizard(page);
  const capi: { event_name?: string; user_data?: { em?: string }; custom_data?: Record<string, unknown> }[] = [];
  page.on("request", (req) => {
    if (req.url().includes("/api/meta/capi") && req.method() === "POST") capi.push(JSON.parse(req.postData() || "{}"));
  });
  await page.goto("/agenda", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/videollamada/i);
  await expect(page.locator("[data-agenda-casos]")).toHaveCount(1);

  // Paso 1: dos servicios elegibles a la vez; hay que elegir al menos uno.
  await expect(page.locator("[data-servicio]")).toHaveCount(2);
  await page.getByRole("button", { name: /Continuar/ }).click();
  await expect(page.getByText("Elige al menos un servicio.")).toBeVisible();
  // Cohete en marketing; el rayo solo aparece al elegir las dos opciones.
  await expect(page.locator('[data-servicio="marketing"] [data-icono="cohete"]')).toHaveCount(1);
  await expect(page.locator("[data-ecosistema-completo]")).toHaveCount(0);
  await pasoServicios(page, ["marketing"]);
  await page.getByRole("button", { name: /Volver/ }).click();
  await expect(page.locator('[data-servicio="marketing"]')).toBeVisible();
  await page.locator('[data-servicio="software"]').click();
  await expect(page.locator("[data-ecosistema-completo] [data-icono=\"rayo\"]")).toHaveCount(1);
  await page.getByRole("button", { name: /Continuar/ }).click();
  await expect(page.locator('[data-agenda-paso="2"]')).toBeVisible();

  // Paso 2: solo nombre, correo, celular y clínica. Sin ciudad, país, tipo ni profesionales.
  await expect(page.getByLabel("Ciudad")).toHaveCount(0);
  await expect(page.getByText("Tipo de clínica")).toHaveCount(0);
  await expect(page.getByText("¿Cuántos profesionales atienden?")).toHaveCount(0);
  await page.getByRole("button", { name: /Elegir mi hora/ }).click();
  await expect(page.getByText("Escribe tu nombre.")).toBeVisible();

  // Nada sale al CRM ni a Meta antes de tener el contacto.
  expect(wizard.filter((w) => w.lead_stage === "contact")).toHaveLength(0);
  expect(capi).toHaveLength(0);

  await llenarDatos(page);
  await page.getByRole("button", { name: /Elegir mi hora/ }).click();

  await expect.poll(() => capi.map((c) => c.event_name)).toContain("Lead");
  const lead = capi.find((c) => c.event_name === "Lead")!;
  expect(lead.user_data?.em, "correo hasheado").toMatch(/^[a-f0-9]{64}$/);
  expect(lead.custom_data).toMatchObject({ value: 3, currency: "USD" });
  expect(capi.filter((c) => c.event_name === "MQL")).toHaveLength(0); // el MQL es al agendar

  await expect(page.locator('[data-agenda-paso="3"]')).toBeVisible();
  await page.waitForTimeout(400);
  const contactos = wizard.filter((w) => w.lead_stage === "contact");
  expect(contactos).toHaveLength(1);
  expect(contactos[0].nombre_clinica).toBe("[E2E TEST] Clínica");
  expect(contactos[0].celular).toBe("+56912345678");
  expect(contactos[0].servicio_interes).toBe("ambas"); // marketing + software
  expect(contactos[0].ciudad ?? "").toBe("");
  expect(contactos[0].fuente).toContain("/agenda");
});

test("un solo servicio viaja como ese servicio", async ({ page }) => {
  await mockRed(page);
  const wizard = grabarWizard(page);
  await page.goto("/agenda", { waitUntil: "domcontentloaded" });
  await pasoServicios(page, ["marketing"]);
  await llenarDatos(page);
  await page.getByRole("button", { name: /Elegir mi hora/ }).click();
  await expect(page.locator('[data-agenda-paso="3"]')).toBeVisible();
  await page.waitForTimeout(400);
  expect(wizard.find((w) => w.lead_stage === "contact")?.servicio_interes).toBe("marketing");
});

test("?servicio= deja marcadas las opciones (ambas = las dos)", async ({ page }) => {
  await mockRed(page);
  await page.goto("/agenda?servicio=software", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-servicio="software"]')).toHaveAttribute("aria-checked", "true");
  await expect(page.locator('[data-servicio="marketing"]')).toHaveAttribute("aria-checked", "false");
  await page.goto("/agenda?servicio=ambas", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-servicio="software"]')).toHaveAttribute("aria-checked", "true");
  await expect(page.locator('[data-servicio="marketing"]')).toHaveAttribute("aria-checked", "true");
});

for (const [w, h] of [[390, 844], [360, 740], [375, 667], [1440, 900], [1280, 720]]) {
  test(`la página no hace scroll en ningún paso (${w}x${h})`, async ({ page }) => {
    await mockRed(page);
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/agenda", { waitUntil: "domcontentloaded" });
    const sinScroll = () =>
      page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight && document.documentElement.scrollWidth <= window.innerWidth);
    expect(await sinScroll(), "paso 1").toBe(true);
    await pasoServicios(page);
    expect(await sinScroll(), "paso 2").toBe(true);
    await llenarDatos(page);
    // El botón del paso 2 tiene que quedar a la vista sin scrollear.
    await expect(page.getByRole("button", { name: /Elegir mi hora/ })).toBeInViewport();
    await page.getByRole("button", { name: /Elegir mi hora/ }).click();
    await expect(page.locator('[data-agenda-paso="3"]')).toBeVisible();
    expect(await sinScroll(), "paso 3").toBe(true);
  });
}

test("el panel muestra una imagen por pantalla y no hay cupón ni compra", async ({ page }) => {
  await mockRed(page);
  await page.goto("/agenda", { waitUntil: "domcontentloaded" });
  const pie = page.locator("[data-agenda-caption]");
  await expect(pie).toContainText("Nuestro equipo activa tus campañas de marketing digital");
  await pasoServicios(page);
  await expect(pie).toContainText("Incorporamos el software de Clinera con su agente de inteligencia artificial");
  await llenarDatos(page);
  await page.getByRole("button", { name: /Elegir mi hora/ }).click();
  await expect(pie).toContainText("Nos reunimos semanalmente para ver los resultados");
  const body = page.locator("body");
  await expect(body).not.toContainText(/CU[K]I|cupón/i);
  await expect(body).not.toContainText(/Crear cuenta/);
});
