import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PLANES } from "../src/content/planes";

/**
 * El cierre de /presentacion muestra las dos opciones vigentes (Vortex y
 * Ecosistema) y el onboarding dedicado (sin valor de implementación ni promoción)
 * (Ricardo, 18-oct-2026). Los números viven en el HTML porque el deck no importa TS.
 */
const html = readFileSync(join(process.cwd(), "public/presentacion/index.html"), "utf8");
const start = html.indexOf('id="planes"');
const chunk = html.slice(start, html.indexOf("</section>", start));

test.describe("Planes en /presentacion", () => {
  test("el deck termina en la diapositiva de planes", () => {
    const ids = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toEqual(["quienes-somos", "problema", "pmfc-p", "pmfc-m", "pmfc-f", "pmfc-c", "beneficios", "planes"]);
  });

  // Ricardo, 22-oct-2026: deck para doctores, tres líneas por plan; el detalle (extras, créditos) vive en /planes.
  test("los montos coinciden con planes.ts; sin planes viejos ni permanencia", () => {
    for (const p of PLANES) {
      expect(chunk).toContain(`<h3 class="px-name">${p.name}</h3>`);
      expect(chunk).toContain(`<strong>$${p.monthlyUsd}</strong>`);
    }
    expect(chunk).not.toContain("450");
    expect(chunk).not.toContain("gratis");
    expect(chunk).toContain("Sin costo de instalación");
    for (const viejo of ["Atlas", "Summit", "Flux", "Hurricane", "permanencia", "CU" + "KI", "Mercado Pago", "12 cuotas", "20% OFF"]) {
      expect(html, viejo).not.toContain(viejo);
    }
  });

  test("se ven las dos tarjetas, sin promoción ni boleta", async ({ page }) => {
    await page.goto("/presentacion#planes", { waitUntil: "domcontentloaded" });
    const slide = page.locator("#planes");
    await expect(slide).toHaveClass(/active/);
    await expect(slide.locator(".px-promo")).toHaveCount(0);
    await expect(slide.locator("[data-ahorro]")).toHaveCount(0);
    await expect(slide.locator(".px-card")).toHaveCount(2);
    await expect(slide.locator('.px-card[data-plan="ecosistema"] .px-feats li')).toHaveCount(3);
    await expect(slide.locator('.px-card[data-plan="vortex"] .px-feats li')).toHaveCount(3);
  });
});
