// Planes Flux · Hurricane · Vortex (Ricardo, 18-oct-2026), CTA «Hablar con ventas»
// → /agenda, fotos de modelos y franja de logos reales.

import { expect, test } from "@playwright/test";
import { ONBOARDING, PLANES } from "../src/content/planes";
import { CUPON, formatoUsd, precioConCupon } from "../src/content/agenda-oferta";
import { CLINICAS_LOGOS } from "../src/content/clinicas-logos";

test.describe("planes vigentes: Flux · Hurricane · Vortex", () => {
  test("el catálogo es el de la diapositiva", () => {
    expect(PLANES.map((p) => [p.name, p.monthlyUsd])).toEqual([
      ["Flux", 129],
      ["Hurricane", 179],
      ["Vortex", 279],
    ]);
    // Flux es sin IA; el agente viene desde Hurricane.
    expect(PLANES.filter((p) => p.agenteIA).map((p) => p.id)).toEqual(["hurricane", "vortex"]);
    expect(PLANES.map((p) => p.iaCredits)).toEqual([0, 5000, 15000]);
  });

  test("/planes muestra los 3 planes y CTA a ventas", async ({ page }) => {
    await page.goto("/planes?utm_source=google", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/Flux, Hurricane y Vortex/);
    for (const p of PLANES) {
      const card = page.locator(`[data-plan-card="${p.id}"]`);
      await expect(card).toContainText(String(p.monthlyUsd));
      // /planes: el pago está arriba; «Hablar con ventas» va a la reunión (con la query).
      await expect(card.getByRole("link", { name: /Hablar con ventas/ })).toHaveAttribute(
        "href",
        "/reunion-comercial?utm_source=google",
      );
      // Énfasis en el 1er mes con CUKI; desde el 2.º mes, en chico.
      await expect(card.locator("[data-precio-primer-mes]")).toContainText(formatoUsd(precioConCupon(p.monthlyUsd)));
      await expect(card.locator("[data-precio-desde-2do-mes]")).toHaveText(`Desde el 2.º mes: US$ ${p.monthlyUsd}/mes`);
    }
    await expect(page.locator("[data-planes-vigentes]")).not.toContainText("implementación");
    // Nada del catálogo viejo en la página de planes.
    const texto = await page.locator("main").innerText();
    for (const viejo of ["Nexus", "Summit", "Atlas", "479", "450"]) expect(texto).not.toContain(viejo);
  });

  test("créditos CI, canales y funciones destacadas (Ricardo, 18-oct-2026)", async ({ page }) => {
    expect(PLANES.map((p) => p.ciCredits)).toEqual([100, 200, 500]);
    expect(PLANES.map((p) => p.channels.includes("email"))).toEqual([true, true, true]);
    expect(PLANES.map((p) => p.channels.includes("telefono"))).toEqual([false, false, true]);
    await page.goto("/planes", { waitUntil: "domcontentloaded" });
    for (const p of PLANES) {
      const card = page.locator(`[data-plan-card="${p.id}"]`);
      await expect(card).toContainText(`${p.ciCredits} créditos de Clinera Intelligence`);
      await expect(card.getByText("Email marketing", { exact: true })).toBeVisible();
      await expect(card.getByText("Llamada telefónica", { exact: true })).toHaveCount(p.id === "vortex" ? 1 : 0);
      // Agente IA y onboarding: ícono + negrita, solo donde vienen.
      await expect(card.locator('[data-destacado="ia"] strong')).toHaveCount(p.agenteIA ? 1 : 0);
      await expect(card.locator('[data-destacado="onboarding"] strong')).toHaveText(p.agenteIA ? [ONBOARDING] : []);
    }
  });

  test("/planes avisa el cupón y paga en Stripe; el home no", async ({ page }) => {
    await page.goto("/planes", { waitUntil: "domcontentloaded" });
    const cupon = page.locator(`[data-planes-vigentes] [data-cupon="${CUPON.codigo}"]`);
    await expect(cupon).toContainText("50% de descuento el primer mes");
    await expect(cupon.locator("[data-cupon-vence]")).toContainText(/Válido hasta mañana/);
    for (const p of PLANES) {
      await expect(page.locator(`[data-plan-card="${p.id}"] a[href*="buy.stripe.com"]`)).toHaveAttribute("data-plan", p.id);
    }
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-planes-vigentes] a[href*="buy.stripe.com"]')).toHaveCount(0);
  });

  test("el header dice «Activar cuenta» y lleva a la landing, no a /go", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const cta = page.locator("header").getByRole("link", { name: "Activar cuenta" }).first();
    await expect(cta).toHaveAttribute("href", /^\/clinica-estetica\/activar-cuenta/);
    await expect(page.locator('header a[href^="/go"]')).toHaveCount(0);
  });
});

test.describe("home y landing: modelo y logos", () => {
  test("el home trae a la dueña de clínica, los planes y los logos reales", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-modelo-estetica="duena"] img')).toBeVisible();
    await expect(page.locator("[data-planes-vigentes]")).toHaveCount(1);
    const logos = page.locator("[data-clinicas-logos]");
    await expect(logos).toHaveCount(1);
    await expect(logos.getByRole("img", { name: "Método Hebe" })).toBeVisible();
    // La lista vieja era inventada: no puede volver.
    const texto = await page.locator("main").innerText();
    for (const falso of ["Hospital del Valle", "Centro Estético Aurora", "Vitaderma", "Nuevo Ser"]) {
      expect(texto).not.toContain(falso);
    }
    // El bloque «Lo construimos para nuestras propias clínicas» fue reemplazado por la franja.
    expect(texto).not.toContain("Lo construimos para nuestras propias clínicas.");
  });

  test("la landing trae a la dueña de clínica y los logos reales", async ({ page }) => {
    await page.goto("/clinica-estetica/activar-cuenta", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-modelo-estetica="duena"] img')).toBeVisible();
    await expect(page.locator("[data-clinicas-logos] img")).toHaveCount(CLINICAS_LOGOS.length);
  });
});
