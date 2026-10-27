// /agenda — wizard de 4 pasos (Ricardo, 27-oct-2026): boleta → tus datos → tu clínica → horario.
// El paso 3 manda el lead al CRM y dispara Lead US$ 3 si la web se verifica; el paso 1 ViewContent.
// Sin cupón ni compra desde la web. Red mockeada.

import { expect, test, type Page, type Request } from "@playwright/test";
import { llenarClinica, pasarDatosPersonales } from "./agenda-helpers";

type WizardBody = {
  lead_stage?: string;
  nombre_clinica?: string;
  servicio_interes?: string;
  celular?: string;
  fuente?: string;
  ciudad?: string;
  pais_clinica?: string;
  boxes_profesionales?: string;
  conversaciones_mes?: string;
  pacientes_mes?: string;
  pacientes_mes_label?: string;
  necesidad?: string;
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

async function pasoBoleta(page: Page) {
  // Se aprieta «Quiero ahorrar». Si el clic cae antes de que React hidrate, se reintenta.
  await expect(async () => {
    if (!(await page.locator('[data-agenda-paso="2"]').isVisible())) {
      await page.locator("[data-quiero-ahorrar]").click();
    }
    await expect(page.locator('[data-agenda-paso="2"]')).toBeVisible({ timeout: 2500 });
  }).toPass({ timeout: 20000 });
}

/** Pasos 2 y 3: datos personales, «Continuar» y los datos de la clínica (sin enviar). */
async function llenarDatos(page: Page) {
  await pasarDatosPersonales(page);
  await llenarClinica(page);
  await page.getByLabel("Sitio web de tu clínica").fill("e2e.clinera.io");
}

test("wizard: boleta «Quiero ahorrar» → tus datos → tu clínica (CRM + Lead US$ 3) → horario", async ({ page }) => {
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
  // Ricardo, 26-oct-2026: el deslizador pasó a ser un botón «Quiero ahorrar».
  await expect(page.locator("[data-quiero-ahorrar]")).toHaveText("Quiero ahorrar");
  await expect(page.locator("[data-perilla]")).toHaveCount(0);
  await expect(page.locator('[data-agenda-paso="2"]')).toHaveCount(0);
  expect(capi).toHaveLength(0);
  await pasoBoleta(page);

  // Paso 2: solo nombre, celular y correo. La clínica va en el paso 3.
  await expect(page.getByLabel("Nombre de tu clínica")).toHaveCount(0);
  await expect(page.getByText("Tipo de clínica")).toHaveCount(0);
  await page.getByRole("button", { name: /Continuar/ }).click();
  await expect(page.getByText("Escribe tu nombre.")).toBeVisible();
  await pasarDatosPersonales(page);

  // Paso 3: la clínica. «¿Qué necesitas?» es obligatorio.
  await page.getByLabel("Nombre de tu clínica").fill("[E2E TEST] Clínica");
  await page.getByLabel("Ubicación").fill("Santiago");
  await page.getByRole("button", { name: /Elegir mi hora/ }).click();
  await expect(page.getByText("Elige cuántos profesionales tiene tu clínica.")).toBeVisible();
  await llenarClinica(page);
  await page.getByLabel("¿Qué necesitas?").fill("");
  await page.getByRole("button", { name: /Elegir mi hora/ }).click();
  await expect(page.getByText("Cuéntanos qué necesitas.")).toBeVisible();
  await expect(page.getByLabel("¿Qué necesitas?")).toHaveCSS("font-size", "16px");

  // Nada sale al CRM ni a Meta antes de tener los datos de la clínica.
  expect(wizard.filter((w) => w.lead_stage === "contact")).toHaveLength(0);
  expect(capi.filter((c) => c.event_name === "Lead")).toHaveLength(0);

  await llenarClinica(page);
  await page.getByLabel("Sitio web de tu clínica").fill("e2e.clinera.io");
  await page.getByRole("button", { name: /Elegir mi hora/ }).click();

  await expect.poll(() => capi.map((c) => c.event_name)).toContain("Lead");
  const lead = capi.find((c) => c.event_name === "Lead")!;
  expect(lead.user_data?.em, "correo hasheado").toMatch(/^[a-f0-9]{64}$/);
  expect(lead.custom_data).toMatchObject({ value: 3, currency: "USD" });
  expect(capi.filter((c) => c.event_name === "MQL")).toHaveLength(0); // el MQL es al agendar

  // Paso 4: el calendario.
  await expect(page.locator('[data-agenda-paso="4"]')).toBeVisible();
  await page.waitForTimeout(400);
  const contactos = wizard.filter((w) => w.lead_stage === "contact");
  expect(contactos).toHaveLength(1);
  expect(contactos[0].nombre_clinica).toBe("[E2E TEST] Clínica");
  expect(contactos[0].celular).toBe("+56912345678");
  expect(contactos[0].servicio_interes).toBe("ambas"); // siempre el Ecosistema
  expect(contactos[0].ciudad).toBe("Santiago");
  expect(contactos[0].boxes_profesionales).toBe("4_6");
  expect(contactos[0].conversaciones_mes).toBe("100_300");
  expect(contactos[0].pacientes_mes).toBe("50_150");
  expect(contactos[0].pacientes_mes_label).toBe("50 a 150");
  expect(contactos[0].necesidad).toBe("[E2E TEST] Llenar la agenda de la tarde");
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
    await expect(page.getByRole("button", { name: /Continuar/ })).toBeInViewport();
    await llenarDatos(page);
    expect(await sinScroll(), "paso 3").toBe(true);
    // El botón del paso 3 tiene que quedar a la vista sin scrollear.
    await expect(page.getByRole("button", { name: /Elegir mi hora/ })).toBeInViewport();
    await page.getByRole("button", { name: /Elegir mi hora/ }).click();
    await expect(page.locator('[data-agenda-paso="4"]')).toBeVisible();
    expect(await sinScroll(), "paso 4").toBe(true);
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

test("«Quiero ahorrar» avanza aunque GTM o el pixel tiren error (26-oct-2026)", async ({ page }) => {
  await mockRed(page);
  await page.addInitScript(() => {
    const w = window as unknown as { dataLayer: unknown[]; fbq: unknown };
    w.dataLayer = [];
    w.dataLayer.push = () => {
      throw new TypeError("a[c] is not a function");
    };
    w.fbq = () => {
      throw new TypeError("a[c] is not a function");
    };
  });
  await page.goto("/agenda", { waitUntil: "domcontentloaded" });
  await pasoBoleta(page);
  await expect(page.locator('[data-agenda-paso="2"]')).toBeVisible();
});
