// /agenda — wizard de 3 pasos (Ricardo, 18-oct-2026): datos → servicio → videollamada.
// Paso 1 manda el lead al CRM y dispara Lead US$ 3; paso 2 ViewContent; el MQL sale
// al agendar. Sin cupón ni compra desde la web. Red mockeada.

import { expect, test, type Page, type Request } from "@playwright/test";

type WizardBody = {
  lead_stage?: string;
  nombre_clinica?: string;
  boxes_profesionales?: string;
  tipo_clinica?: string;
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

async function pasoClinica(page: Page) {
  await page.getByLabel("Nombre de tu clínica").fill("[E2E TEST] Clínica");
  await page.getByRole("radio", { name: "Estética" }).click();
  await page.getByRole("radio", { name: "4–6" }).click();
  await page.getByLabel("Ciudad").fill("Los Ángeles");
  await page.getByRole("button", { name: /Continuar/ }).click();
}

async function pasoContacto(page: Page) {
  await page.getByLabel("Nombre", { exact: true }).fill("[E2E TEST] Agenda");
  await page.getByLabel("Correo", { exact: true }).fill("e2e-agenda@e2e.clinera.io");
  await page.getByLabel("Celular (WhatsApp)").fill("912345678");
  await page.getByRole("button", { name: /Enviar y elegir mi hora/ }).click();
}

test("wizard: servicio → clínica → datos (CRM + Lead US$ 3) → calendario", async ({ page }) => {
  await mockRed(page);
  const wizard = grabarWizard(page);
  const capi: { event_name?: string; user_data?: { em?: string }; custom_data?: Record<string, unknown> }[] = [];
  page.on("request", (req) => {
    if (req.url().includes("/api/meta/capi") && req.method() === "POST") capi.push(JSON.parse(req.postData() || "{}"));
  });
  await page.goto("/agenda", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/videollamada/i);
  await expect(page.locator("[data-agenda-casos]")).toHaveCount(1);

  // Paso 1: tres servicios, «Ambas» recomendada; hay que elegir uno.
  await expect(page.locator("[data-servicio]")).toHaveCount(3);
  await expect(page.locator('[data-servicio="ambas"]')).toContainText("Recomendado");
  await page.getByRole("button", { name: /Continuar/ }).click();
  await expect(page.getByText("Elige el servicio que te interesa.")).toBeVisible();
  await page.locator('[data-servicio="marketing"]').click();
  await page.getByRole("button", { name: /Continuar/ }).click();

  // Paso 2: clínica. Incompleto no avanza.
  await expect(page.locator('[data-agenda-paso="2"]')).toBeVisible();
  await page.getByRole("button", { name: /Continuar/ }).click();
  await expect(page.getByText("Escribe el nombre de tu clínica.")).toBeVisible();
  await pasoClinica(page);

  // Nada sale al CRM ni a Meta antes de tener el contacto.
  await expect(page.locator('[data-agenda-paso="3"]')).toBeVisible();
  expect(wizard.filter((w) => w.lead_stage === "contact")).toHaveLength(0);
  expect(capi).toHaveLength(0);

  // Paso 3: contacto → CRM + Lead.
  await page.getByRole("button", { name: /Enviar y elegir mi hora/ }).click();
  await expect(page.getByText("Escribe tu nombre.")).toBeVisible();
  await pasoContacto(page);

  await expect.poll(() => capi.map((c) => c.event_name)).toContain("Lead");
  const lead = capi.find((c) => c.event_name === "Lead")!;
  expect(lead.user_data?.em, "correo hasheado").toMatch(/^[a-f0-9]{64}$/);
  expect(lead.custom_data).toMatchObject({ value: 3, currency: "USD" });
  expect(capi.filter((c) => c.event_name === "MQL")).toHaveLength(0); // el MQL es al agendar

  await expect(page.locator('[data-agenda-paso="4"]')).toBeVisible();
  await page.waitForTimeout(400);
  const contactos = wizard.filter((w) => w.lead_stage === "contact");
  expect(contactos).toHaveLength(1);
  expect(contactos[0].nombre_clinica).toBe("[E2E TEST] Clínica");
  expect(contactos[0].boxes_profesionales).toBe("4_6");
  expect(contactos[0].tipo_clinica).toBe("estetica");
  expect(contactos[0].celular).toBe("+56912345678");
  expect(contactos[0].fuente).toContain("/agenda");
});

test("?servicio= preselecciona el servicio en el paso 1", async ({ page }) => {
  await mockRed(page);
  await page.goto("/agenda?servicio=software", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-servicio="software"]')).toHaveAttribute("aria-checked", "true");
});

for (const [w, h] of [[390, 844], [360, 740], [375, 667], [1440, 900], [1280, 720]]) {
  test(`la página no hace scroll en ningún paso (${w}x${h})`, async ({ page }) => {
    await mockRed(page);
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/agenda", { waitUntil: "domcontentloaded" });
    const sinScroll = () =>
      page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight && document.documentElement.scrollWidth <= window.innerWidth);
    expect(await sinScroll(), "paso 1").toBe(true);
    await page.locator('[data-servicio="ambas"]').click();
    await expect(page.locator('[data-servicio="ambas"]')).toHaveAttribute("aria-checked", "true");
    await page.getByRole("button", { name: /Continuar/ }).click();
    await expect(page.locator('[data-agenda-paso="2"]')).toBeVisible();
    expect(await sinScroll(), "paso 2").toBe(true);
    // El botón de continuar tiene que quedar a la vista sin scrollear.
    await expect(page.getByRole("button", { name: /Continuar/ })).toBeInViewport();
    await pasoClinica(page);
    await expect(page.locator('[data-agenda-paso="3"]')).toBeVisible();
    expect(await sinScroll(), "paso 3").toBe(true);
    await expect(page.getByRole("button", { name: /Enviar y elegir mi hora/ })).toBeInViewport();
  });
}

test("el panel muestra cómo funciona el ecosistema y no hay cupón ni compra", async ({ page }) => {
  await mockRed(page);
  await page.goto("/agenda", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-agenda-casos]")).toContainText("Las campañas traen al paciente");
  const body = page.locator("body");
  await expect(body).not.toContainText(/CU[K]I|cupón/i);
  await expect(body).not.toContainText(/Crear cuenta/);
});
