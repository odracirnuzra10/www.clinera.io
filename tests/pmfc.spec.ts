import { test, expect } from "@playwright/test";

test.describe("Metodología PMFC", () => {
  test("home: sección PMFC con 4 piezas, 2 casos y link al artículo", async ({ page }) => {
    await page.goto("/");
    const sec = page.locator("[data-pmfc]");
    await expect(sec).toBeVisible();
    await expect(sec.locator("[data-pmfc-pieza]")).toHaveCount(4);
    await expect(sec.locator("[data-pmfc-caso]")).toHaveCount(2);
    await expect(sec).toContainText(/ilustrativo/i);
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

  test("/planes y el deck también hablan PMFC", async ({ page, request }) => {
    await page.goto("/planes");
    await expect(page.locator("[data-pmfc]")).toBeVisible();
    await expect(page.locator("[data-pmfc-caso]")).toHaveCount(0);
    await expect(page.locator("main")).toContainText(/PMFC completo/i);
    const html = await (await request.get("/presentacion/index.html")).text();
    expect(html).toContain("PMFC completo");
    expect(html).toContain("La C de PMFC");
    expect(html).not.toMatch(/patentad/i);
  });
});
