// Planes vigentes: Vortex · Ecosistema (Ricardo, 18-oct-2026). CTA único
// «Agendar reunión» → /agenda?servicio=…, sin cupón ni compra en la web.

import { expect, test } from "@playwright/test";
import { AHORRO, CTA_VENTAS_LABEL, MARKETING_BLOQUES, PLANES, promoEcosistemaVigente } from "../src/content/planes";
import { CLINICAS_LOGOS } from "../src/content/clinicas-logos";

test.describe("planes vigentes: Vortex · Ecosistema", () => {
  test("el catálogo", () => {
    expect(PLANES.map((p) => [p.id, p.monthlyUsd])).toEqual([
      ["vortex", 279],
      // Promoción del Ecosistema: 379 hasta el 26-nov-2026, después 529 (Ricardo, 27-oct-2026).
      ["ecosistema", promoEcosistemaVigente() ? 379 : 529],
    ]);
    // Ricardo, 19-oct-2026: el valor de la implementación no se publica en ningún lado.
    expect(PLANES[1].features).toEqual(expect.arrayContaining(MARKETING_BLOQUES.map((b) => b.titulo)));
  });

  test("el home no lleva links de pago (solo /planes)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('main a[href*="buy.stripe.com"]')).toHaveCount(0);
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
    await expect(page.locator("[data-planes-vigentes]")).not.toContainText("450");
    // Ricardo, 20-oct-2026: /planes lleva el Payment Link de cada plan, con los
    // data-plan* que lee Analytics.tsx (InitiateCheckout + client_reference_id).
    // Durante la promo del Ecosistema su link (que cobra 529) no se muestra.
    const conLink = PLANES.filter((p) => p.pagoUrl);
    await expect(page.locator('main a[href*="buy.stripe.com"]')).toHaveCount(conLink.length);
    for (const p of conLink) {
      const pago = page.locator(`[data-plan-card="${p.id}"] a[href*="buy.stripe.com"]`);
      await expect(pago).toHaveAttribute("href", new RegExp("^" + p.pagoUrl.replace(/[.?]/g, "\\$&")));
      await expect(pago).toHaveAttribute("data-plan", p.id);
      await expect(pago).toHaveAttribute("data-plan-value", String(p.monthlyUsd));
    }
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
      await expect(bloque).toContainText("US$ 600–800/mes");
      await expect(bloque).toContainText("US$ 1.000–1.700/mes");
      await expect(bloque.locator("[data-ahorro-conclusion]")).toContainText(`US$ ${PLANES[1].monthlyUsd}`);
      await expect(bloque).toContainText(AHORRO.ahorro);
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

// Ricardo, 19-oct-2026: 4 reuniones de marketing al mes (1 por semana) y onboarding dedicado con un
// ejecutivo humano en las dos opciones.
test.describe("reuniones de marketing y onboarding dedicado", () => {
  test("el marketing incluye creativos; los videos los entrega el cliente y Clinera los edita", () => {
    const campanas = MARKETING_BLOQUES.find((b) => b.id === "campanas")!;
    expect(campanas.texto).toMatch(/creativos/);
    expect(campanas.texto).toMatch(/videos.*editamos/);
  });

  test("el catálogo lo declara en las dos opciones", () => {
    expect(MARKETING_BLOQUES.map((b) => b.id)).toContain("reuniones");
    expect(MARKETING_BLOQUES.find((b) => b.id === "reuniones")!.texto).toMatch(/4 reuniones .* 1 por semana/);
    expect(PLANES[0].features).toContain("Onboarding dedicado con un ejecutivo humano");
    expect(PLANES[1].features).toContain("Todo lo de Vortex");
  });

  test("/planes y la presentación lo muestran", async ({ page }) => {
    await page.goto("/planes", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Reunión de marketing cada semana").first()).toBeVisible();
    await expect(page.getByText("Onboarding dedicado con un ejecutivo humano").first()).toBeVisible();
    await page.goto("/presentacion/index.html#planes", { waitUntil: "domcontentloaded" });
    const html = await page.content();
    expect(html).toContain("Reunión de marketing cada semana");
    expect(html).toContain("4 reuniones de marketing al mes, 1 por semana");
    expect(html).toContain("onboarding dedicado con un ejecutivo humano");
  });
});
