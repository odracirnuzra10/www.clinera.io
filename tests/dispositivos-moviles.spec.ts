// /agenda en celulares y tabletas (Ricardo, 19-oct-2026): «que todo sea funcional y que no haya
// nada roto que impida rellenar el formulario». Emula los dispositivos de Playwright (iPhone de
// todos los tamaños, Galaxy, Pixel, iPad y tabletas, y en horizontal) con el motor Chromium: el
// tamaño de pantalla, el táctil y el user agent son los del aparato, pero NO es el Safari real
// (lo que sí queda sin probar acá: el comportamiento exacto de la barra de Safari y del teclado
// de iOS). Las alturas de Playwright para iPhone ya descuentan las barras de Safari.
//
// Por dispositivo: sin scroll horizontal; el botón «Quiero ahorrar» se toca con el dedo; los campos tienen
// 16px o más (si no, iOS hace zoom al enfocar) y se pueden tocar; nada cubre el botón de cada
// paso; se llega al paso del horario; y la página no hace scroll en vertical (en horizontal,
// donde la altura es mínima, solo scrollea el wizard por dentro).

import { devices, expect, test, type Page } from "@playwright/test";

const LISTA = [
  "iPhone SE",
  "iPhone 8",
  "iPhone 8 Plus",
  "iPhone 12 Mini",
  "iPhone 13",
  "iPhone 14",
  "iPhone 15 Pro",
  "iPhone 14 Pro Max",
  "iPhone 15 Pro Max",
  "Galaxy S5",
  "Galaxy S8",
  "Galaxy S9+",
  "Galaxy S24",
  "Galaxy A55",
  "Pixel 5",
  "Pixel 7",
  "iPad Mini",
  "Galaxy Tab S4",
  "iPhone SE landscape",
  "iPhone 13 landscape",
  "Galaxy S8 landscape",
] as const;

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

/** Aprieta «Quiero ahorrar» con un toque, como un dedo. */
async function tocarQuieroAhorrar(page: Page) {
  await page.locator("[data-quiero-ahorrar]").tap();
}

/** El elemento en el centro del botón debe ser el botón (o algo dentro): nada lo tapa. */
async function nadaTapa(page: Page, selector: string) {
  const ok = await page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (!el) return "no existe";
    el.scrollIntoView({ block: "center" });
    const r = el.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    // `nextjs-portal` es el indicador de desarrollo de Next: no existe en producción.
    if (top?.tagName.toLowerCase() === "nextjs-portal") return "ok";
    return top && (el === top || el.contains(top)) ? "ok" : `tapado por <${top?.tagName.toLowerCase()} class="${top?.className}">`;
  }, selector);
  expect(ok, `${selector}`).toBe("ok");
}

for (const nombre of LISTA) {
  const d = devices[nombre];
  const { defaultBrowserType: _ignorar, ...sinNavegador } = d;
  void _ignorar;
  const horizontal = d.viewport.width > d.viewport.height;

  test.describe(`${nombre} (${d.viewport.width}×${d.viewport.height})`, () => {
    test.use({ ...sinNavegador });

    test("se puede rellenar todo el formulario hasta el horario", async ({ page }) => {
      await mockRed(page);
      await page.goto("/agenda", { waitUntil: "domcontentloaded" });
      await expect(page.locator("[data-ahorro]")).toBeVisible();

      const sinOverflowX = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
      const sinScrollY = () => page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1);

      // Paso 1: la boleta y el botón «Quiero ahorrar».
      expect(await sinOverflowX(), "scroll horizontal en el paso 1").toBe(true);
      if (!horizontal) expect(await sinScrollY(), "scroll vertical en el paso 1").toBe(true);
      await nadaTapa(page, "[data-quiero-ahorrar]");
      await expect(page.locator("[data-quiero-ahorrar]")).toBeInViewport();

      // Tocar «Quiero ahorrar» (se reintenta por si cae antes de la hidratación).
      await expect(async () => {
        if (!(await page.locator('[data-agenda-paso="2"]').isVisible())) await tocarQuieroAhorrar(page);
        await expect(page.locator('[data-agenda-paso="2"]')).toBeVisible({ timeout: 3000 });
      }).toPass({ timeout: 25000 });

      // Paso 2: campos de 16px o más (sin zoom en iOS) y de buen tamaño táctil.
      await expect(page.getByLabel("Nombre", { exact: true })).toBeVisible();
      const campos = await page.evaluate(() =>
        ["ag-nombre", "ag-email", "ag-phone", "ag-clinica"].map((id) => {
          const el = document.getElementById(id) as HTMLInputElement;
          const r = el.getBoundingClientRect();
          return { id, fuente: parseFloat(getComputedStyle(el).fontSize), alto: r.height, ancho: r.width };
        }),
      );
      for (const c of campos) {
        expect(c.fuente, `${c.id}: fuente < 16px (iOS haría zoom)`).toBeGreaterThanOrEqual(16);
        expect(c.alto, `${c.id}: alto táctil`).toBeGreaterThanOrEqual(40);
        expect(c.ancho, `${c.id}: ancho`).toBeGreaterThan(100);
      }
      await page.getByLabel("Nombre", { exact: true }).fill("[E2E TEST] Dispositivo");
      await page.getByLabel("Correo", { exact: true }).fill("e2e-disp@e2e.clinera.io");
      await page.getByLabel("Celular (WhatsApp)").fill("912345678");
      await page.getByLabel("Nombre de tu clínica").fill("[E2E TEST] Clínica");
      await page.getByLabel("Sitio web de tu clínica").fill("e2e.clinera.io");
      expect(await sinOverflowX(), "scroll horizontal en el paso 2").toBe(true);
      if (!horizontal) expect(await sinScrollY(), "scroll vertical en el paso 2").toBe(true);

      await nadaTapa(page, '[data-agenda-paso="2"] button[class*="cta"]');
      await page.locator('[data-agenda-paso="2"] button[class*="cta"]').tap();

      // Paso 3: el horario.
      await expect(page.locator('[data-agenda-paso="3"]')).toBeVisible();
      expect(await sinOverflowX(), "scroll horizontal en el paso 3").toBe(true);
      if (!horizontal) expect(await sinScrollY(), "scroll vertical en el paso 3").toBe(true);
    });
  });
}
