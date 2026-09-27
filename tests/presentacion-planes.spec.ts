import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ANNUAL_DISCOUNT_PERCENT, CLINERA_PLANS, SETUP_FEE_USD, annualFirstYearSavings } from "../src/content/pricing";

/**
 * El cierre de /presentacion muestra el anual primero y el mensual debajo.
 * Los números viven en el HTML porque el deck no importa pricing.ts.
 */
const html = readFileSync(join(process.cwd(), "public/presentacion/index.html"), "utf8");

test.describe("Planes en /presentacion", () => {
  test("la diapositiva de precio cierra el deck, anual antes que mensual", () => {
    const ids = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
    expect(ids.at(-1)).toBe("planes");
    expect(ids).toHaveLength(13);
    expect(ids.indexOf("migracion")).toBe(ids.indexOf("planes") - 1);

    const start = html.indexOf('id="planes"');
    const chunk = html.slice(start, html.indexOf("</section>", start));
    expect(chunk.indexOf("Plan anual")).toBeLessThan(chunk.indexOf("Plan mensual"));
    expect(chunk).toContain(`${ANNUAL_DISCOUNT_PERCENT}% OFF`);
    expect(chunk).not.toMatch(/semestral/i);
    expect(chunk).toContain('aria-label="Dólar"');
    expect(chunk).toContain('aria-label="Peso mexicano"');
    expect(chunk).toContain('data-billing="annual"');
    expect(chunk).toContain("12 cuotas a precio de contado");
    expect(chunk).toContain("pagando con Mercado Pago");
    expect(chunk).toContain("/brand/mercadopago.svg");
  });

  test("los montos del deck coinciden con pricing.ts", () => {
    const start = html.indexOf('id="planes"');
    const chunk = html.slice(start, html.indexOf("</section>", start));
    for (const plan of CLINERA_PLANS) {
      expect(chunk).toContain(`data-monthly="${plan.monthlyPrice}"`);
      expect(chunk).toContain(`data-annual="${plan.annualTotal}"`);
      expect(chunk).toContain(`data-equiv="${plan.annualMonthly}"`);
      expect(chunk).toContain(`data-savings="${annualFirstYearSavings(plan)}"`);
    }
    expect(chunk).toContain(`data-slot="fee">$${SETUP_FEE_USD}`);
  });

  test("abre en anual y el mensual pasa a ser el número grande", async ({ page }) => {
    await page.goto("/presentacion#planes", { waitUntil: "domcontentloaded" });
    const slide = page.locator("#planes");
    await expect(slide).toHaveClass(/active/);
    await expect(slide).toHaveAttribute("data-billing", "annual");
    const vortex = slide.locator(".px-card").first();
    await expect(vortex.locator("[data-slot='annual']")).toHaveText("$223");
    await expect(vortex.locator("[data-slot='equiv']")).toContainText("ahorras $56/mes");
    await expect(vortex.locator("[data-slot='monthly']")).toHaveText("$279");
    await expect(vortex).not.toContainText("$2,678");

    await slide.getByRole("radio", { name: /Mensual/ }).click();
    await expect(slide).toHaveAttribute("data-billing", "monthly");
    await expect(vortex.locator("[data-slot='monthly']")).toHaveText("$279");

    await slide.getByRole("radio", { name: "Peso mexicano" }).click();
    await expect(slide).toHaveAttribute("data-fx", "mxn");
    await expect(vortex.locator("[data-slot='annual']")).toHaveText("$3,780");
    await expect(vortex.locator("[data-slot='monthly']")).toHaveText("$4,730");
    await expect(slide.locator("[data-slot='fee']")).toHaveText("$7,630");
  });
});
