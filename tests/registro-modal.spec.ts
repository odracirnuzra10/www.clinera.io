// Ricardo, 7-nov-2026: «Regístrate gratis» del sitio abre el modal de registro en la misma página;
// /prueba-gratis queda solo para los anuncios. Componente: src/components/registro/RegistroModal.tsx.
import { expect, test } from "@playwright/test";

// Ricardo, 10-nov-2026: «Regístrate gratis» ya no abre el formulario: va directo a app.clinera.io.
test("el «Regístrate gratis» del home va directo a app.clinera.io, sin formulario ni lead", async ({ page }) => {
  const llamadas: string[] = [];
  await page.route("**/api/wizard", (r) => { llamadas.push("wizard"); return r.fulfill({ status: 200, body: "{}" }); });
  await page.route("https://app.clinera.io/**", (r) => r.fulfill({ status: 200, contentType: "text/html", body: "ok" }));
  await page.goto("/?utm_source=prueba", { waitUntil: "networkidle" });
  await page.locator('[data-home2-registro="hero"]').click();
  await page.waitForURL(/app\.clinera\.io\/auth\/register/);
  const alta = new URL(page.url());
  expect(alta.searchParams.get("plan")).toBe("xcale");
  expect(alta.searchParams.get("utm_source")).toBe("prueba");
  expect(alta.searchParams.get("nombre")).toBeNull();
  expect(llamadas).toEqual([]);
});

test("en /planes cada tarjeta va al registro con su plan", async ({ page }) => {
  await page.route("https://app.clinera.io/**", (r) => r.fulfill({ status: 200, contentType: "text/html", body: "ok" }));
  await page.goto("/planes", { waitUntil: "networkidle" });
  await page.locator('[data-plan-card="flux"] [data-cta-registro]').click();
  await page.waitForURL(/app\.clinera\.io\/auth\/register/);
  expect(new URL(page.url()).searchParams.get("plan")).toBe("flux");
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
