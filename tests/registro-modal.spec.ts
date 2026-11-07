// Ricardo, 7-nov-2026: «Regístrate gratis» del sitio abre el modal de registro en la misma página;
// /prueba-gratis queda solo para los anuncios. Componente: src/components/registro/RegistroModal.tsx.
import { expect, test } from "@playwright/test";

test("el «Regístrate gratis» del home abre el modal y el registro sale a app.clinera.io con los datos", async ({ page }) => {
  const llamadas: string[] = [];
  await page.route("**/api/wizard", (r) => { llamadas.push("wizard"); return r.fulfill({ status: 200, body: "{}" }); });
  await page.route("**/api/meta/capi", (r) => { llamadas.push("capi"); return r.fulfill({ status: 200, body: "{}" }); });
  let alta = "";
  await page.route("https://app.clinera.io/**", (r) => { alta = r.request().url(); return r.fulfill({ status: 200, body: "ok" }); });
  await page.goto("/?utm_source=prueba", { waitUntil: "networkidle" });

  await page.locator('[data-home2-registro="hero"]').click();
  const modal = page.locator("[data-registro-modal]");
  await expect(modal).toBeVisible();
  await expect(page).toHaveURL(/\/\?utm_source=prueba$/);
  await expect(modal.locator("[data-registro-resumen]")).toHaveText(
    "Conecta WhatsApp, Facebook e Instagram y agenda pacientes con IA. 7 días, sin tarjeta de crédito.",
  );

  await modal.locator("input[name=nombre]").fill("Ana Prueba");
  await modal.locator("input[name=celular]").fill("+56 9 1234 5678");
  await expect(modal.locator("input[name=celular]")).toHaveValue("912345678");
  await modal.locator("input[name=email]").fill("ana@prueba.cl");
  await modal.locator("input[name=clinica]").fill("Clínica Prueba");
  await modal.locator("[data-registro-enviar]").click();
  // Número de relleno: no pasa.
  await expect(modal.locator("[data-registro-error]")).toContainText("9 dígitos");

  await modal.locator("input[name=celular]").fill("987123456");
  await modal.locator("[data-registro-enviar]").click();
  await expect.poll(() => alta).toContain("app.clinera.io/auth/register");
  expect(alta).toContain("telefono=%2B56987123456");
  expect(alta).toContain("utm_source=prueba");
  expect(alta).toContain("lead_event_id=lead_web_");
  expect(llamadas).toEqual(expect.arrayContaining(["wizard", "capi"]));
});

test("en /planes cada tarjeta abre el modal con su plan", async ({ page }) => {
  let alta = "";
  await page.route("**/api/**", (r) => r.fulfill({ status: 200, body: "{}" }));
  await page.route("https://app.clinera.io/**", (r) => { alta = r.request().url(); return r.fulfill({ status: 200, body: "ok" }); });
  await page.goto("/planes", { waitUntil: "networkidle" });
  await page.locator('[data-plan-card="flux"] [data-cta-registro]').click();
  const modal = page.locator("[data-registro-modal]");
  await expect(modal).toBeVisible();
  await modal.locator("input[name=nombre]").fill("Ana");
  await modal.locator("input[name=celular]").fill("987123456");
  await modal.locator("input[name=email]").fill("ana@prueba.cl");
  await modal.locator("input[name=clinica]").fill("Clínica");
  await modal.locator("[data-registro-enviar]").click();
  await expect.poll(() => alta).toContain("plan=flux");
});

test("«Solicita asistencia» abre el modal en modo asistencia y después WhatsApp", async ({ page, context }) => {
  const llamadas: string[] = [];
  await page.route("**/api/wizard", (r) => { llamadas.push(r.request().postDataJSON().fuente); return r.fulfill({ status: 200, body: "{}" }); });
  await page.route("**/api/meta/capi", (r) => r.fulfill({ status: 200, body: "{}" }));
  await context.route("https://wa.me/**", (r) => r.fulfill({ status: 200, body: "wa" }));
  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator('[data-home2-cta="hero"]').click();
  const modal = page.locator("[data-registro-modal]");
  await expect(modal.getByRole("heading")).toHaveText("Solicita asistencia");
  await modal.locator("input[name=nombre]").fill("Ana");
  await modal.locator("input[name=celular]").fill("987123456");
  await modal.locator("input[name=email]").fill("ana@prueba.cl");
  await modal.locator("input[name=clinica]").fill("Clínica");
  const [wa] = await Promise.all([context.waitForEvent("page"), modal.locator("[data-registro-enviar]").click()]);
  expect(wa.url()).toContain("wa.me/56985581524");
  await expect(modal).toHaveCount(0);
  expect(llamadas[0]).toContain("asistencia");
});
