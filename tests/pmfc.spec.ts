import { test, expect } from "@playwright/test";

test.describe("Metodología PMFC", () => {
  // Desde el 26-oct-2026 el home es el de /home2: PMFC con un visual por letra.
  test("home: sección PMFC con 4 piezas y link al artículo", async ({ page }) => {
    await page.goto("/");
    const sec = page.locator('[data-home2="pmfc"]');
    await expect(sec).toBeVisible();
    await expect(sec.locator("[data-home2-pmfc]")).toHaveCount(4);
    await expect(sec).toContainText(/valores de referencia/i);
    await expect(sec).not.toContainText(/patentad/i);
    await expect(sec.locator("[data-pmfc-link]")).toHaveAttribute(
      "href",
      "/blog/metodologia-pmfc-rentabilidad-clinicas-esteticas",
    );
  });

  test("artículo: renderiza, sin patentado ni voseo, con precios vigentes", async ({ page }) => {
    await page.goto("/blog/metodologia-pmfc-rentabilidad-clinicas-esteticas");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/PMFC/);
    const body = await page.locator("main").innerText();
    expect(body).toContain("USD 279");
    expect(body).toContain("USD 529");
    expect(body).not.toMatch(/patentad|implementación de USD|\b(hacé|pegás|agendá)\b/i);
  });

  test("/planes habla PMFC y el deck sigue sus 4 pasos", async ({ page, request }) => {
    await page.goto("/planes");
    await expect(page.locator("[data-pmfc]")).toBeVisible();
    await expect(page.locator("[data-pmfc-caso]")).toHaveCount(0);
    await expect(page.locator("main")).toContainText(/PMFC completo/i);
    const html = await (await request.get("/presentacion/index.html")).text();
    // Ricardo, 22-oct-2026: el deck para doctores no muestra la sigla; los 4 pasos siguen el orden P-M-F-C.
    for (const id of ["pmfc-p", "pmfc-m", "pmfc-f", "pmfc-c"]) expect(html).toContain(`id="${id}"`);
    expect(html).not.toMatch(/patentad/i);
  });
});
