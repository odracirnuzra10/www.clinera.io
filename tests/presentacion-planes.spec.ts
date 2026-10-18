import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { IMPLEMENTACION_USD, MARKETING_BLOQUES, PLANES } from "../src/content/planes";

/**
 * El cierre de /presentacion muestra las dos opciones vigentes (Vortex y
 * Ecosistema) y la promoción del mes: implementación gratis en Ecosistema
 * (Ricardo, 18-oct-2026). Los números viven en el HTML porque el deck no importa TS.
 */
const html = readFileSync(join(process.cwd(), "public/presentacion/index.html"), "utf8");
const start = html.indexOf('id="planes"');
const chunk = html.slice(start, html.indexOf("</section>", start));

test.describe("Planes en /presentacion", () => {
  test("el deck son 3 diapositivas y la de planes lo cierra", () => {
    const ids = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toEqual(["quienes-somos", "funciones", "planes"]);
  });

  test("los montos y el marketing coinciden con planes.ts; sin planes viejos ni permanencia", () => {
    for (const p of PLANES) {
      expect(chunk).toContain(`<h3 class="px-name">${p.name}</h3>`);
      expect(chunk).toContain(`<strong>$${p.monthlyUsd}</strong>`);
    }
    for (const b of MARKETING_BLOQUES) expect(chunk).toContain(b.titulo.replace("Facebook, Instagram y Google", "Facebook, Instagram y Google"));
    expect(chunk).toContain(`Implementación USD ${IMPLEMENTACION_USD}`);
    expect(chunk).toContain("Implementación gratis en el plan Ecosistema");
    for (const viejo of ["Atlas", "Summit", "Flux", "Hurricane", "permanencia", "CU" + "KI", "Mercado Pago", "12 cuotas", "20% OFF"]) {
      expect(html, viejo).not.toContain(viejo);
    }
  });

  test("se ve la promoción del mes y Ecosistema lista lo que incluye el marketing", async ({ page }) => {
    await page.goto("/presentacion#planes", { waitUntil: "domcontentloaded" });
    const slide = page.locator("#planes");
    await expect(slide).toHaveClass(/active/);
    await expect(slide.locator(".px-promo")).toContainText("Implementación gratis en el plan Ecosistema");
    await expect(slide.locator(".px-card")).toHaveCount(2);
    const eco = slide.locator('.px-card[data-plan="ecosistema"]');
    await expect(eco.locator(".px-mkt li")).toHaveCount(3);
    await expect(slide.locator('.px-card[data-plan="vortex"] .px-mkt')).toHaveCount(0);
  });
});
