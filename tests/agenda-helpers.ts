// /agenda en 4 pasos (Ricardo, 27-oct-2026): boleta · tus datos · tu clínica · tu horario.
// Helpers compartidos por los tests que recorren el wizard (también /agenda-google y la oferta).

import { expect, type Locator, type Page } from "@playwright/test";

/** Paso 3: todo lo de la clínica menos el sitio web (cada test decide qué escribir ahí). */
export async function llenarClinica(page: Page, clinica = "[E2E TEST] Clínica", root: Page | Locator = page) {
  await root.getByLabel("Nombre de tu clínica").fill(clinica);
  await root.getByLabel("Ubicación").fill("Santiago");
  await root.getByLabel("Profesionales de tu clínica").selectOption("4_6");
  await root.getByLabel("Conversaciones al mes").selectOption("100_300");
  await root.getByLabel("Pacientes al mes").selectOption("50_150");
  await root.getByLabel("¿Qué necesitas?").fill("[E2E TEST] Llenar la agenda de la tarde");
}

/** Paso 2 → paso 3: nombre, celular y correo, y «Continuar». */
export async function pasarDatosPersonales(page: Page, nombre = "[E2E TEST] Agenda", correo = "e2e-agenda@e2e.clinera.io", root: Page | Locator = page) {
  await root.getByLabel("Nombre", { exact: true }).fill(nombre);
  await root.getByLabel("Celular (WhatsApp)").fill("912345678");
  await root.getByLabel("Correo", { exact: true }).fill(correo);
  await root.getByRole("button", { name: /Continuar/ }).click();
  await expect(root.locator('[data-agenda-paso="3"]')).toBeVisible();
}
