import { expect, test } from "@playwright/test";
import { promoRango } from "../src/components/promo/promo-rango";

// /promo (Ricardo, 21-oct-2026): /planes con una barra de descuento de 7 días cuyo
// último día es el día de la reunión (hora de Chile).
test.describe("/promo", () => {
  test("el rango termina hoy en Chile y parte 7 días antes", () => {
    expect(promoRango(new Date("2026-10-21T15:00:00Z")).texto).toBe(
      "Aprovecha nuestro descuento desde el 14 de octubre al 21 de octubre",
    );
    expect(promoRango(new Date("2026-10-22T15:00:00Z")).texto).toBe(
      "Aprovecha nuestro descuento desde el 15 de octubre al 22 de octubre",
    );
    // 01:30 UTC del 22 todavía es 21 en Chile (GMT-3).
    expect(promoRango(new Date("2026-10-22T01:30:00Z")).hasta).toBe("21 de octubre");
    // Cruce de mes.
    expect(promoRango(new Date("2026-11-03T15:00:00Z")).desde).toBe("27 de octubre");
  });

  test("muestra los planes, la barra y no se indexa", async ({ page }) => {
    await page.goto("/promo", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-plan-card]")).toHaveCount(2);
    const barra = page.locator("[data-promo-bar]");
    await expect(barra).toBeVisible();
    await expect(barra).toContainText("Aprovecha nuestro descuento desde el");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator(".ver-demo-float")).toHaveCount(0);
  });
});
