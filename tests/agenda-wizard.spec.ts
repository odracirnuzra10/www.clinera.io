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

async function pasoBoleta(page: Page) {
  // Se desliza la perilla hasta el final. Si el gesto cae antes de que React hidrate, se reintenta.
  await expect(async () => {
    if (!(await page.locator('[data-agenda-paso="2"]').isVisible())) {
      const pista = (await page.locator("[data-quiero-ahorrar]").boundingBox())!;
      const perilla = (await page.locator("[data-perilla]").boundingBox())!;
      const y = perilla.y + perilla.height / 2;
      await page.mouse.move(perilla.x + perilla.width / 2, y);
      await page.mouse.down();
      await page.mouse.move(perilla.x + perilla.width / 2 + (pista.width - perilla.width) / 2, y, { steps: 6 });
      await page.mouse.move(pista.x + pista.width + 20, y, { steps: 6 });
      await page.mouse.up();
    }
    await expect(page.locator('[data-agenda-paso="2"]')).toBeVisible({ timeout: 2500 });
  }).toPass({ timeout: 20000 });
}

async function llenarDatos(page: Page) {
  await page.getByLabel("Nombre", { exact: true }).fill("[E2E TEST] Agenda");
  await page.getByLabel("Correo", { exact: true }).fill("e2e-agenda@e2e.clinera.io");
  await page.getByLabel("Celular (WhatsApp)").fill("912345678");
  await page.getByLabel("Nombre de tu clínica").fill("[E2E TEST] Clínica");
}

test("wizard: boleta «Quiero ahorrar» → datos (CRM + Lead US$ 3) → horario", async ({ page }) => {
  await mockRed(page);
  const wizard = grabarWizard(page);
  const capi: { event_name?: string; user_data?: { em?: string }; custom_data?: Record<string, unknown> }[] = [];
  page.on("request", (req) => {
    if (req.url().includes("/api/meta/capi") && req.method() === "POST") capi.push(JSON.parse(req.postData() || "{}"));
  });
  await page.goto("/agenda", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/videollamada/i);

  // Paso 1: la boleta de lo que se ahorra, sin elegir servicio.
  await expect(page.locator('[data-agenda-paso="1"]')).toBeVisible();
  await expect(page.locator("[data-servicio]")).toHaveCount(0);
  const boleta = page.locator('[data-agenda-paso="1"] [data-ahorro]');
  await expect(boleta).toBeVisible();
  await expect(boleta).toContainText("US$ 600–800/mes");
  await expect(boleta).toContainText("US$ 1.000–1.700/mes");
  await expect(boleta).toContainText("US$ 529/mes");
  await expect(boleta).toContainText("Ahorras desde US$ 470 al mes");
  await expect(page.locator("[data-quiero-ahorrar]")).toContainText("Desliza para ahorrar");
  // Soltar a medio camino no avanza.
  const perilla0 = (await page.locator("[data-perilla]").boundingBox())!;
  await page.mouse.move(perilla0.x + 25, perilla0.y + 25);
  await page.mouse.down();
  await page.mouse.move(perilla0.x + 90, perilla0.y + 25, { steps: 5 });
  await page.mouse.up();
  await expect(page.locator('[data-agenda-paso="2"]')).toHaveCount(0);
  expect(capi).toHaveLength(0);
  await pasoBoleta(page);

  // Paso 2: solo nombre, correo, celular y clínica. Sin ciudad, país, tipo ni profesionales.
  await expect(page.getByLabel("Ciudad")).toHaveCount(0);
  await expect(page.getByText("Tipo de clínica")).toHaveCount(0);
  await expect(page.getByText("¿Cuántos profesionales atienden?")).toHaveCount(0);
  await page.getByRole("button", { name: /Elegir mi hora/ }).click();
  await expect(page.getByText("Escribe tu nombre.")).toBeVisible();

  // Nada sale al CRM ni a Meta antes de tener el contacto.
  expect(wizard.filter((w) => w.lead_stage === "contact")).toHaveLength(0);
  expect(capi.filter((c) => c.event_name === "Lead")).toHaveLength(0);

  await llenarDatos(page);
  await page.getByRole("button", { name: /Elegir mi hora/ }).click();

  await expect.poll(() => capi.map((c) => c.event_name)).toContain("Lead");
  const lead = capi.find((c) => c.event_name === "Lead")!;
  expect(lead.user_data?.em, "correo hasheado").toMatch(/^[a-f0-9]{64}$/);
  expect(lead.custom_data).toMatchObject({ value: 3, currency: "USD" });
  expect(capi.filter((c) => c.event_name === "MQL")).toHaveLength(0); // el MQL es al agendar

  // Paso 3: el calendario.
  await expect(page.locator('[data-agenda-paso="3"]')).toBeVisible();
  await page.waitForTimeout(400);
  const contactos = wizard.filter((w) => w.lead_stage === "contact");
  expect(contactos).toHaveLength(1);
  expect(contactos[0].nombre_clinica).toBe("[E2E TEST] Clínica");
  expect(contactos[0].celular).toBe("+56912345678");
  expect(contactos[0].servicio_interes).toBe("ambas"); // siempre el Ecosistema
  expect(contactos[0].ciudad ?? "").toBe("");
  expect(contactos[0].fuente).toContain("/agenda");
});

test("?servicio= ya no cambia el flujo: siempre parte en la boleta", async ({ page }) => {
  await mockRed(page);
  await page.goto("/agenda?servicio=software", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-agenda-paso="1"] [data-ahorro]')).toBeVisible();
  await expect(page.locator("[data-servicio]")).toHaveCount(0);
});

for (const [w, h] of [[390, 844], [360, 740], [375, 667], [1440, 900], [1280, 720]]) {
  test(`la página no hace scroll en ningún paso (${w}x${h})`, async ({ page }) => {
    await mockRed(page);
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/agenda", { waitUntil: "domcontentloaded" });
    const sinScroll = () =>
      page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight && document.documentElement.scrollWidth <= window.innerWidth);
    expect(await sinScroll(), "paso 1").toBe(true);
    // La boleta y el botón «Quiero ahorrar» quedan a la vista, sin scrollear.
    await expect(page.locator("[data-ahorro]")).toBeInViewport();
    await expect(page.locator("[data-quiero-ahorrar]")).toBeInViewport();
    await pasoBoleta(page);
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
  await pasoBoleta(page);
  await expect(pie).toContainText("Incorporamos el software de Clinera con su agente de inteligencia artificial");
  await llenarDatos(page);
  await page.getByRole("button", { name: /Elegir mi hora/ }).click();
  await expect(pie).toContainText("Una reunión de marketing por semana, 4 al mes, para ver los resultados");
  const body = page.locator("body");
  await expect(body).not.toContainText(/CU[K]I|cupón/i);
  await expect(body).not.toContainText(/Crear cuenta/);
});
