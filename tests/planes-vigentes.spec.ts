// Planes vigentes: Vortex · Ecosistema (Ricardo, 18-oct-2026). CTA único
// «Agendar reunión» → /agenda?servicio=…, sin cupón ni compra en la web.

import { expect, test } from "@playwright/test";
import { CHECKOUT_URL } from "../src/content/checkout";
import { AHORRO, MARKETING_BLOQUES, PLANES, promoEcosistemaVigente } from "../src/content/planes";
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

  // Ricardo, 5-nov-2026: /planes publica Flux · Hex · Vortex (sin Ecosistema). Cada tarjeta y el
  // encabezado van al Payment Link de checkout.ts, sin código de promoción.
  test("/planes: Flux, Hex y Vortex, con sus links de Stripe", async ({ page }) => {
    await page.goto("/planes?utm_source=google", { waitUntil: "domcontentloaded" });
    const cards = page.locator("[data-plan-card]");
    await expect(cards).toHaveCount(3);
    for (const [i, id] of ["flux", "hex", "vortex"].entries()) {
      await expect(cards.nth(i)).toHaveAttribute("data-plan-card", id);
      await expect(page.locator(`[data-plan-card="${id}"] [data-canales]`)).toContainText("WhatsApp");
    }
    await expect(page.locator('[data-plan-card="ecosistema"]')).toHaveCount(0);
    await expect(page.locator("[data-ahorro]")).toHaveCount(0);
    await expect(page.locator('[data-plan-card="flux"] [data-precio]')).toContainText("US$ 79");
    await expect(page.locator('[data-plan-card="hex"] [data-precio]')).toContainText("US$ 179");
    await expect(page.locator('[data-plan-card="vortex"] [data-precio]')).toContainText("US$ 279");
    await expect(page.locator('[data-plan-card="flux"]')).toContainText("WhatsApp con 500 conversaciones");
    await expect(page.locator('[data-plan-card="flux"]')).not.toContainText("Clinera Intelligence");
    await expect(page.locator('[data-plan-card="vortex"]')).toContainText("Clinera Intelligence");
    const precios = { flux: "79", hex: "179", vortex: "279" } as const;
    for (const id of ["flux", "hex", "vortex"] as const) {
      const pago = page.locator(`[data-plan-card="${id}"] a[data-cta="pago"]`);
      const base = CHECKOUT_URL[id].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      await expect(pago).toHaveAttribute("href", new RegExp(`^${base}\\?utm_source=google$`));
      await expect(pago).toHaveAttribute("data-plan", id);
      await expect(pago).toHaveAttribute("data-plan-value", precios[id]);
      expect(await pago.getAttribute("href")).not.toContain("prefilled_promo_code");
    }
    await expect(page.locator("a[data-cta-encabezado]")).toHaveAttribute("href", new RegExp("^" + CHECKOUT_URL.flux.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    await expect(page.locator('main a[href*="buy.stripe.com"]')).toHaveCount(4);
    await expect(page.locator("h1")).toContainText("Parte con Flux");
    await page.getByRole("button", { name: "¿Hay descuento?" }).click();
    await expect(page.locator("main")).toContainText("50% durante los primeros 3 meses");
    await expect(page.locator("main")).not.toContainText(/no tienen descuento|20% de descuento/);
    for (const id of ["hex", "vortex"]) {
      const fondo = await page.locator(`[data-plan-card="${id}"] a[data-cta="pago"]`).evaluate((e) => getComputedStyle(e).backgroundImage);
      expect(fondo).toBe("none");
    }
    const fondoFlux = await page.locator('[data-plan-card="flux"] a[data-cta="pago"]').evaluate((e) => getComputedStyle(e).backgroundImage);
    expect(fondoFlux).toContain("gradient");
    await expect(page.locator('[data-plan-card="flux"] [data-insignia]')).toHaveText("Recomendado");
    const texto = await page.locator("main").innerText();
    for (const viejo of ["Hurricane", "Nexus", "Summit", "Atlas", "CU" + "KI", "permanencia", "PENDIENTE", "no trae WhatsApp"]) {
      expect(texto).not.toContain(viejo);
    }
  });
});

test.describe("ahorro del Ecosistema (Ricardo, 19-oct-2026)", () => {
  for (const ruta of ["/"]) {
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
    // El Ecosistema salió de /planes: la reunión semanal ya no está en esta página.
    await expect(page.getByText("Reunión de marketing cada semana")).toHaveCount(0);
    await expect(page.getByText("Onboarding dedicado con un ejecutivo humano").first()).toBeVisible();
    await page.goto("/presentacion/index.html#planes", { waitUntil: "domcontentloaded" });
    const html = await page.content();
    expect(html).toContain("Reunión de marketing cada semana");
    expect(html).toContain("4 reuniones de marketing al mes, 1 por semana");
    expect(html).toContain("onboarding dedicado con un ejecutivo humano");
  });
});
