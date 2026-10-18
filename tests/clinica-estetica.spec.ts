// /clinica-estetica — landing de Google Ads para clínicas estéticas.
//
// Lo que se prueba es su razón de ser: un wizard corto (nombre, tipo de
// clínica, correo, WhatsApp) que lleva al MISMO calendario de /agenda, da de
// alta el lead con el perfil exacto (enfermera, médico estético, clínica…) y
// manda UN MQL al confirmar la hora. Y que el home habla de estética.
//
// Red 100 % mockeada (patrón de `reserva-tu-hora.spec.ts`).

import { expect, test, type Page, type Request } from "@playwright/test";
import { TRATAMIENTOS_PRECARGADOS } from "../src/content/estetica";

type WizardBody = {
  lead_stage?: string;
  tipo_clinica?: string;
  subtipo_clinica?: string;
  subtipo_clinica_label?: string;
  celular?: string;
  fuente?: string;
};

function nonce() {
  return `e2e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function grabar<T>(page: Page, path: string) {
  const hits: T[] = [];
  page.on("request", (req: Request) => {
    if (!req.url().includes(path) || req.method() !== "POST") return;
    try {
      hits.push(JSON.parse(req.postData() || "{}"));
    } catch {
      /* noop */
    }
  });
  return hits;
}

async function mockRed(page: Page) {
  await page.route("https://n8n.oacg.cl/webhook/clinera-agenda-config", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, duracionMin: 45 }),
    }),
  );
  await page.route(/n8n\.oacg\.cl\/webhook\/clinera-agenda-disponibilidad/, (route) => {
    const url = new URL(route.request().url());
    if (url.searchParams.has("desde")) {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ dias: {} }) });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          horariosDisponibles: [
            { horaInicio: "10:00", duracionMin: 45, profesional: { id: "a", name: "Ana" } },
            { horaInicio: "11:00", duracionMin: 45, profesional: { id: "a", name: "Ana" } },
          ],
        },
      }),
    });
  });
  await page.route(/n8n\.oacg\.cl\/webhook\/clinera-agenda-turno/, (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }),
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

test.describe("/clinica-estetica — landing de Google Ads", () => {
  test("es destino de anuncios: noindex y sin navegación del sitio", async ({ page }) => {
    await page.goto("/clinica-estetica", { waitUntil: "domcontentloaded" });
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/clínicas y centros de estética/i);
    // Los tratamientos precargados se ven en el primer pliegue (beneficios).
    for (const t of TRATAMIENTOS_PRECARGADOS) {
      await expect(page.getByText(t.nombre).first()).toBeVisible();
    }
  });

  test("wizard corto → calendario de /agenda → UN MQL al reservar", async ({ page }) => {
    const id = nonce();
    await mockRed(page);
    const wizard = grabar<WizardBody>(page, "/api/wizard");
    const capi = grabar<{ event_name?: string }>(page, "/api/meta/capi");

    await page.goto("/clinica-estetica", { waitUntil: "domcontentloaded" });

    // Incompleto: no pasa al calendario.
    await page.getByRole("button", { name: /Ver horas disponibles/i }).click();
    await expect(page.getByText("Escribe tu nombre.")).toBeVisible();

    await page.getByLabel("Nombre").fill(`[E2E TEST] ${id}`);
    await page.getByRole("radio", { name: "Enfermero/a estético/a" }).click();
    await page.getByLabel("Correo").fill(`${id}@e2e.clinera.io`);
    await page.getByLabel("WhatsApp").fill("912345678");
    await page.getByRole("button", { name: /Ver horas disponibles/i }).click();

    await expect(page.getByRole("heading", { name: /Elige el día y la hora/i })).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(400);

    const contactos = wizard.filter((w) => w.lead_stage === "contact");
    expect(contactos).toHaveLength(1);
    expect(contactos[0].tipo_clinica).toBe("estetica");
    expect(contactos[0].subtipo_clinica).toBe("enfermera_estetica");
    expect(contactos[0].celular).toBe("+56912345678");
    expect(contactos[0].fuente).toContain("/clinica-estetica");
    // El MQL se gana agendando, no al llenar los datos.
    expect(capi.filter((c) => c.event_name === "MQL")).toHaveLength(0);

    await page.getByRole("button", { name: /10:00/ }).first().click();
    await page.getByRole("button", { name: /Confirmar reunión/i }).click();
    await expect(page.getByRole("heading", { name: /tu hora quedó reservada/i })).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(600);

    const reservas = wizard.filter((w) => w.lead_stage === "booking_confirmed");
    expect(reservas).toHaveLength(1);
    expect(reservas[0].subtipo_clinica).toBe("enfermera_estetica");
    expect(capi.filter((c) => c.event_name === "MQL")).toHaveLength(1);
  });

  test("en móvil el formulario queda bajo el H1, antes de los beneficios", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/clinica-estetica", { waitUntil: "domcontentloaded" });
    const nombre = await page.getByLabel("Nombre").boundingBox();
    expect(nombre).not.toBeNull();
    expect(nombre!.y).toBeLessThan(844);
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(ancho).toBeLessThanOrEqual(390);
  });
});

test.describe("home — nicho estético", () => {
  test("el hero y la sección «Hecho para estética» hablan de estética", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/clínica estética/i);
    for (const bloque of ["facial", "corporal", "presupuesto", "tratamientos"]) {
      await expect(page.locator(`[data-estetica-bloque="${bloque}"]`)).toHaveCount(1);
    }
  });
});
