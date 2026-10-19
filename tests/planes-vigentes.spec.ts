// Planes vigentes: Vortex · Ecosistema (Ricardo, 18-oct-2026). CTA único
// «Agendar videollamada» → /agenda?servicio=…, sin cupón ni compra en la web.

import { expect, test } from "@playwright/test";
import { CTA_VENTAS_LABEL, IMPLEMENTACION_USD, MARKETING_BLOQUES, PLANES } from "../src/content/planes";
import { CLINICAS_LOGOS } from "../src/content/clinicas-logos";

test.describe("planes vigentes: Vortex · Ecosistema", () => {
  test("el catálogo", () => {
    expect(PLANES.map((p) => [p.id, p.monthlyUsd])).toEqual([
      ["vortex", 379],
      ["ecosistema", 479],
    ]);
    expect(IMPLEMENTACION_USD).toBe(450);
    expect(PLANES[1].features).toEqual(expect.arrayContaining(MARKETING_BLOQUES.map((b) => b.titulo)));
  });

  test("/planes: dos tarjetas con CTA a /agenda y la query", async ({ page }) => {
    await page.goto("/planes?utm_source=google", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-plan-card]")).toHaveCount(2);
    for (const p of PLANES) {
      const card = page.locator(`[data-plan-card="${p.id}"]`);
      await expect(card).toContainText(String(p.monthlyUsd));
      await expect(card.getByRole("link", { name: CTA_VENTAS_LABEL })).toHaveAttribute(
        "href",
        `/agenda?utm_source=google&servicio=${p.servicio}`,
      );
    }
    await expect(page.locator("[data-planes-vigentes]")).toContainText(`${IMPLEMENTACION_USD}`);
    await expect(page.locator('main a[href*="buy.stripe.com"]')).toHaveCount(0);
    const texto = await page.locator("main").innerText();
    for (const viejo of ["Flux", "Hurricane", "Nexus", "Summit", "Atlas", "CU" + "KI", "permanencia"]) {
      expect(texto).not.toContain(viejo);
    }
  });
});

test.describe("ahorro del Ecosistema (Ricardo, 19-oct-2026)", () => {
  for (const ruta of ["/", "/planes"]) {
    test(`${ruta} explica lo que se ahorra con el Ecosistema`, async ({ page }) => {
      await page.goto(ruta, { waitUntil: "domcontentloaded" });
      const bloque = page.locator("[data-ahorro]");
      await expect(bloque).toHaveCount(1);
      await expect(bloque.locator("[data-ahorro-item]")).toHaveCount(3);
      await expect(bloque).toContainText("desde US$ 500/mes");
      await expect(bloque).toContainText("US$ 1.000–1.500/mes");
      await expect(bloque.locator("[data-ahorro-conclusion]")).toContainText("US$ 479");
      await expect(bloque).toContainText("Ahorras casi US$ 500 al mes");
      // Valores estimados y sin nombrar competidores.
      await expect(bloque).toContainText("estimados");
      await expect(bloque).not.toContainText(/AgendaPro|Reservo|Medilink|Bambi/i);
    });
  }
});

test.describe("home: logos reales", () => {
  test("el home trae los logos reales y no los nombres inventados", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const logos = page.locator("[data-clinicas-logos]");
    await expect(logos).toHaveCount(1);
    await expect(logos.locator("img")).toHaveCount(CLINICAS_LOGOS.length);
    const texto = await page.locator("main").innerText();
    for (const falso of ["Hospital del Valle", "Centro Estético Aurora", "Vitaderma", "Nuevo Ser"]) {
      expect(texto).not.toContain(falso);
    }
  });
});
