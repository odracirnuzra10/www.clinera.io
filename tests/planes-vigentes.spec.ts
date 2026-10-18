// Planes Flux · Hurricane · Vortex (Ricardo, 18-oct-2026), CTA «Hablar con ventas»
// → /agenda, implementación US$ 250, fotos de modelos y franja de logos reales.

import { expect, test } from "@playwright/test";
import { IMPLEMENTACION_USD, PLANES } from "../src/content/planes";
import { CLINICAS_LOGOS } from "../src/content/clinicas-logos";

test.describe("planes vigentes: Flux · Hurricane · Vortex", () => {
  test("el catálogo es el de la diapositiva", () => {
    expect(PLANES.map((p) => [p.name, p.monthlyUsd])).toEqual([
      ["Flux", 129],
      ["Hurricane", 179],
      ["Vortex", 279],
    ]);
    expect(IMPLEMENTACION_USD).toBe(250);
    // Flux es sin IA; el agente viene desde Hurricane.
    expect(PLANES.filter((p) => p.agenteIA).map((p) => p.id)).toEqual(["hurricane", "vortex"]);
    expect(PLANES.map((p) => p.iaCredits)).toEqual([0, 5000, 15000]);
  });

  test("/planes muestra los 3 planes, la implementación y CTA a ventas", async ({ page }) => {
    await page.goto("/planes?utm_source=google", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/Flux, Hurricane y Vortex/);
    for (const p of PLANES) {
      const card = page.locator(`[data-plan-card="${p.id}"]`);
      await expect(card).toContainText(String(p.monthlyUsd));
      await expect(card.getByRole("link", { name: /Hablar con ventas/ })).toHaveAttribute(
        "href",
        `/agenda?utm_source=google&plan=${p.id}`,
      );
    }
    await expect(page.locator("[data-planes-vigentes]")).toContainText(`implementación US$${IMPLEMENTACION_USD}`);
    // Nada del catálogo viejo en la página de planes.
    const texto = await page.locator("main").innerText();
    for (const viejo of ["Nexus", "Summit", "Atlas", "479", "450"]) expect(texto).not.toContain(viejo);
  });

  test("el header lleva a ventas, no a /go", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const cta = page.locator("header").getByRole("link", { name: "Hablar con ventas" }).first();
    await expect(cta).toHaveAttribute("href", /^\/agenda/);
    await expect(page.locator('header a[href^="/go"]')).toHaveCount(0);
  });
});

test.describe("home y /clinica-estetica: modelo y logos", () => {
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

  test("/clinica-estetica trae a la enfermera y los logos", async ({ page }) => {
    await page.goto("/clinica-estetica", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-modelo-estetica="enfermera"] img')).toBeVisible();
    await expect(page.locator("[data-clinicas-logos] img")).toHaveCount(CLINICAS_LOGOS.length);
  });
});
