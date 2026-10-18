// /agenda — landing «Crea tu cuenta y actívala en minutos» (Ricardo, 18-oct-2026).
// Paso 1 datos → CRM · paso 2 funciones (varias) · paso 3 los 3 planes con el
// cupón KUKY (50%). Red mockeada: nada toca n8n ni Meta.

import { expect, test, type Page, type Request } from "@playwright/test";
import { CUPON, LINKS_PAGO, precioConCupon } from "../src/content/agenda-oferta";
import { PLANES } from "../src/content/planes";

type WizardBody = {
  lead_stage?: string;
  nombre_clinica?: string;
  boxes_profesionales?: string;
  tipo_clinica?: string;
  celular?: string;
  fuente?: string;
  funciones_interes?: string;
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

test("precio con cupón: 50% de cada plan", () => {
  expect(CUPON.codigo).toBe("KUKY");
  expect(PLANES.map((p) => precioConCupon(p.monthlyUsd))).toEqual([44.5, 64.5, 89.5]);
});

test("/agenda: datos → CRM, funciones y los 3 planes con el cupón", async ({ page }) => {
  await mockRed(page);
  const wizard = grabarWizard(page);
  await page.goto("/agenda", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Crea tu cuenta y actívala en minutos/);

  // Paso 1: incompleto no avanza.
  await page.getByRole("button", { name: /Continuar/ }).click();
  await expect(page.getByText("Escribe tu nombre.")).toBeVisible();

  await page.getByLabel("Nombre", { exact: true }).fill("[E2E TEST] Agenda");
  await page.getByLabel("Correo", { exact: true }).fill("e2e-agenda@e2e.clinera.io");
  await page.getByLabel("Celular (WhatsApp)").fill("912345678");
  await page.getByLabel("Nombre de tu clínica").fill("[E2E TEST] Clínica");
  await page.getByRole("radio", { name: "4–6" }).click();
  await page.getByRole("button", { name: /Continuar/ }).click();

  // El lead se manda al CRM en el paso 1.
  await expect(page.locator('[data-agenda-paso="2"]')).toBeVisible();
  await page.waitForTimeout(400);
  const contactos = wizard.filter((w) => w.lead_stage === "contact");
  expect(contactos).toHaveLength(1);
  expect(contactos[0].nombre_clinica).toBe("[E2E TEST] Clínica");
  expect(contactos[0].boxes_profesionales).toBe("4_6");
  expect(contactos[0].tipo_clinica).toBe("estetica");
  expect(contactos[0].celular).toBe("+56912345678");
  expect(contactos[0].fuente).toContain("/agenda");

  // Paso 2: varias funciones. No hay segundo envío (n8n lo marcaría «Volvió a cotizar»).
  await page.getByRole("checkbox", { name: "Ficha estética facial" }).click();
  await page.getByRole("checkbox", { name: "Presupuestos" }).click();
  await expect(page.getByRole("checkbox", { name: "Presupuestos" })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: /Ver mi oferta/ }).click();
  await page.waitForTimeout(300);
  expect(wizard.filter((w) => w.lead_stage === "contact")).toHaveLength(1);

  // Paso 3: cupón y los 3 planes con el 50%.
  const oferta = page.locator("[data-oferta]");
  await expect(oferta.locator(`[data-cupon="${CUPON.codigo}"]`)).toBeVisible();
  for (const p of PLANES) {
    const card = oferta.locator(`[data-plan-oferta="${p.id}"]`);
    await expect(card).toContainText(`US$ ${p.monthlyUsd}`);
    await expect(card).toContainText(String(precioConCupon(p.monthlyUsd)).replace(".", ","));
    // Sin link de pago todavía: marcador visible, nunca un enlace roto.
    if (!LINKS_PAGO[p.id]) await expect(card.locator("[data-pago-pendiente]")).toBeVisible();
  }
  await expect(oferta).toContainText("Marcaste: ficha estética facial, presupuestos.");
  await expect(oferta.getByRole("button", { name: "Prefiero hablar con ventas antes" })).toBeVisible();
});
