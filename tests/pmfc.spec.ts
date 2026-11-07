import { test, expect } from "@playwright/test";

test.describe("Metodología PMFC", () => {
  // Ricardo, 7-nov-2026: el home vende solo el software. PMFC queda escondido (HOME2_MOSTRAR.pmfc), no borrado.
  test("home: PMFC escondido", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[data-home2="pmfc"]')).toHaveCount(0);
  });

  test("artículo: renderiza, sin patentado ni voseo, con precios vigentes", async ({ page }) => {
    await page.goto("/blog/metodologia-pmfc-rentabilidad-clinicas-esteticas");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/PMFC/);
    const body = await page.locator("main").innerText();
    expect(body).toContain("USD 279");
    expect(body).toContain("USD 529");
    expect(body).not.toMatch(/patentad|implementación de USD|\b(hacé|pegás|agendá)\b/i);
  });

  // Ricardo, 7-nov-2026: /planes es la prueba gratis del software y ya no lleva PMFC (sigue en el home y /ecosistema).
  test("el deck sigue los 4 pasos de PMFC", async ({ request }) => {
    const html = await (await request.get("/presentacion/index.html")).text();
    // Ricardo, 22-oct-2026: el deck para doctores no muestra la sigla; los 4 pasos siguen el orden P-M-F-C.
    for (const id of ["pmfc-p", "pmfc-m", "pmfc-f", "pmfc-c"]) expect(html).toContain(`id="${id}"`);
    expect(html).not.toMatch(/patentad/i);
  });
});
