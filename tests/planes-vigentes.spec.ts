// Planes vigentes: Vortex · Ecosistema (Ricardo, 18-oct-2026). CTA único
// «Agendar reunión» → /agenda?servicio=…, sin cupón ni compra en la web.

import { expect, test } from "@playwright/test";
import { PLANES_TRIAL, XCALE_PAGO_URL } from "../src/content/planes-trial";
import { MARKETING_BLOQUES, PLANES, promoEcosistemaVigente } from "../src/content/planes";
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

  // Ricardo, 7-nov-2026: el home y /planes muestran la prueba gratis con Flux, Hex y Xcale. El único
  // link de pago es «o paga Xcale ahora» (US$ 149), pelado y con data-plan* para Analytics.tsx.
  test("el home solo lleva el link de pago de Xcale", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const pagos = page.locator('main a[href*="buy.stripe.com"]');
    await expect(pagos).toHaveCount(1);
    await expect(pagos).toHaveAttribute("href", XCALE_PAGO_URL);
    await expect(pagos).toHaveAttribute("data-plan", "xcale");
    await expect(pagos).toHaveAttribute("data-plan-value", "149");
  });

  test("/planes: prueba gratis y Flux, Hex y Xcale", async ({ page }) => {
    await page.goto("/planes?utm_source=google&plan=flux", { waitUntil: "domcontentloaded" });
    const cards = page.locator("[data-planes-trial] [data-plan-card]");
    await expect(cards).toHaveCount(3);
    await expect(page.locator("h1")).toContainText("Regístrate gratis");
    for (const p of PLANES_TRIAL) {
      const card = page.locator(`[data-plan-card="${p.id}"]`);
      await expect(card).toContainText(`US$ ${p.monthlyUsd}`);
      await expect(card.locator("[data-canales]")).toHaveAttribute("aria-label", /WhatsApp/);
      // «Regístrate gratis» va a /prueba-gratis con la query de la visita, sin `plan`.
      await expect(card.locator("a[data-cta-registro]")).toHaveAttribute("href", "/prueba-gratis?utm_source=google");
    }
    await expect(page.locator('[data-plan-card="xcale"]')).toContainText("Recomendado");
    await expect(page.locator('[data-plan-card="xcale"]')).toContainText("Onboarding humano");
    await expect(page.locator("[data-adicionales]")).toContainText("1000 conversaciones");
    await expect(page.locator('main a[href*="buy.stripe.com"]')).toHaveCount(1);
    const texto = await page.locator("main").innerText();
    for (const viejo of ["Vortex", "Ecosistema", "Hurricane", "Nexus", "Summit", "Atlas", "CU" + "KI", "PENDIENTE", "US$ 79", "US$ 179", "US$ 279"]) {
      expect(texto).not.toContain(viejo);
    }
  });
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
    // El Ecosistema salió de /planes: la reunión semanal ya no está en esta página (7-nov-2026: Xcale trae onboarding humano).
    await expect(page.getByText("Reunión de marketing cada semana")).toHaveCount(0);
    await expect(page.getByText("Onboarding humano").first()).toBeVisible();
    await page.goto("/presentacion/index.html#planes", { waitUntil: "domcontentloaded" });
    const html = await page.content();
    expect(html).toContain("Reunión de marketing cada semana");
    expect(html).toContain("4 reuniones de marketing al mes, 1 por semana");
    expect(html).toContain("onboarding dedicado con un ejecutivo humano");
  });
});
