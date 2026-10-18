// /clinica-estetica/activar-cuenta (ex /agenda) — landing «Crea tu cuenta y actívala en minutos» (Ricardo, 18-oct-2026).
// Paso 1 datos → CRM · paso 2 funciones (varias) · paso 3 los 3 planes con el
// cupón CUKI (50% el primer mes, vence al día siguiente de la primera visita). Red mockeada.

import { expect, test, type Page, type Request } from "@playwright/test";
import { CUPON, FUNCIONES_HERO, LINKS_PAGO, fechaLarga, precioConCupon, venceCupon } from "../src/content/agenda-oferta";
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

test("precio con cupón: 50% de cada plan, solo el primer mes", () => {
  expect(CUPON.codigo).toBe("CUKI");
  expect(CUPON.descuentoPct).toBe(50);
  expect(CUPON.meses).toBe(1);
  expect(PLANES.map((p) => precioConCupon(p.monthlyUsd))).toEqual([64.5, 89.5, 139.5]);
});

test("el cupón vence al día siguiente de la primera visita", () => {
  // Ricardo: si entró el domingo 18, vale hasta el lunes 19; si entró el 20, hasta el 21.
  expect(venceCupon("2026-10-18")).toBe("2026-10-19");
  expect(venceCupon("2026-10-20")).toBe("2026-10-21");
  expect(venceCupon("2026-10-31")).toBe("2026-11-01");
  expect(fechaLarga("2026-10-19")).toBe("lunes 19 de octubre");
});

test("la landing recuerda la primera visita: el vencimiento no se corre", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem("cl_cupon_primera_visita", "2026-10-18"));
  await mockRed(page);
  await page.goto("/clinica-estetica/activar-cuenta", { waitUntil: "domcontentloaded" });
  await page.getByLabel("Nombre", { exact: true }).fill("[E2E TEST] Vence");
  await page.getByLabel("Correo", { exact: true }).fill("e2e-vence@e2e.clinera.io");
  await page.getByLabel("Celular (WhatsApp)").fill("912345678");
  await page.getByLabel("Nombre de tu clínica").fill("[E2E TEST] Clínica");
  await page.getByRole("radio", { name: "1–3" }).click();
  await page.getByRole("button", { name: /Continuar/ }).click();
  await page.getByRole("button", { name: /Ver mi oferta/ }).click();
  await expect(page.locator("[data-cupon-vence]")).toHaveAttribute("data-cupon-vence", "2026-10-19");
});

test("landing: datos → CRM, funciones y los 3 planes con el cupón", async ({ page }) => {
  await mockRed(page);
  const wizard = grabarWizard(page);
  await page.goto("/clinica-estetica/activar-cuenta", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Crea tu cuenta y actívala en minutos/);
  // Al lado del wizard: lo que trae Clinera y la prueba social nueva.
  await expect(page.locator("[data-funciones-hero] li")).toHaveCount(FUNCIONES_HERO.length);
  await expect(page.locator("main, body").first()).toContainText("5/5 de calificación en Capterra");
  await expect(page.locator("body")).not.toContainText("Hecho en Método Hebe y Protocolo Lumina");

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
  expect(contactos[0].fuente).toContain("/clinica-estetica/activar-cuenta");

  // Paso 2: vista exclusiva del wizard (sin el resto de la landing) y el cupón en grande.
  await expect(page.locator("[data-agenda-enfocado]")).toHaveCount(1);
  await expect(page.locator("#hecho-para-estetica")).toHaveCount(0);
  await expect(page.locator("[data-agente-ia-banda]")).toHaveCount(0);
  const cuponGrande = page.locator(`[data-cupon-grande] >> text=${CUPON.codigo}`);
  await expect(cuponGrande).toBeVisible();
  await expect(page.locator("[data-cupon-grande]").getByRole("button", { name: "Copiar código" })).toBeVisible();

  // Paso 2: varias funciones. No hay segundo envío (n8n lo marcaría «Volvió a cotizar»).
  await page.getByRole("checkbox", { name: "Ficha estética facial" }).click();
  await page.getByRole("checkbox", { name: "Presupuestos" }).click();
  await expect(page.getByRole("checkbox", { name: "Presupuestos" })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: /Ver mi oferta/ }).click();
  await page.waitForTimeout(300);
  expect(wizard.filter((w) => w.lead_stage === "contact")).toHaveLength(1);

  // Paso 3: cupón y los 3 planes con el 50% del primer mes.
  const oferta = page.locator("[data-oferta]");
  await expect(oferta.locator(`[data-cupon="${CUPON.codigo}"]`)).toBeVisible();
  // El botón de pago dice «Crear cuenta», no «Activar» (Ricardo, 18-oct-2026).
  for (const p of PLANES) {
    if (LINKS_PAGO[p.id]) {
      await expect(oferta.locator(`[data-plan-oferta="${p.id}"] a[data-plan="${p.id}"]`)).toHaveText(`Crear cuenta · ${p.name}`);
    }
  }
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

test("landing móvil: cupón en vez de precio y botón fijo que vuelve al formulario", async ({ page }) => {
  await mockRed(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/clinica-estetica/activar-cuenta", { waitUntil: "domcontentloaded" });
  // La foto lleva el cupón, no el precio del plan de entrada.
  await expect(page.locator(`[data-modelo-cupon="${CUPON.codigo}"]`)).toContainText("50% de descuento en tu primer mes");
  await expect(page.locator('[data-modelo-estetica] [class*="modeloMonto"]')).toHaveCount(0);
  // Landing breve: sin las 4 tarjetas de funciones.
  await expect(page.locator("[data-estetica-bloque]")).toHaveCount(0);
  const volver = page.locator("[data-volver-form]");
  await expect(volver).toHaveCount(0);
  await page.locator("[data-modelo-cupon]").scrollIntoViewIfNeeded();
  await expect(volver).toBeVisible();
  await volver.click();
  await expect(page.getByLabel("Nombre", { exact: true })).toBeInViewport();
});
