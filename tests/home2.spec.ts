// /home2 (Ricardo, 26-oct-2026): historia de Clinera + casos al estilo de
// sacamedi.com/casos. Borrador: noindex. Contenido en src/content/home2.ts.

import { expect, test } from "@playwright/test";

test("home2: noindex, historia, fundador y cuatro casos con cifra", async ({
  page,
}) => {
  await page.route(/connect\.facebook\.net|googletagmanager/, (route) =>
    route.abort(),
  );
  await page.goto("/home2", { waitUntil: "domcontentloaded" });

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "cobre la evaluación por adelantado",
  );
  await expect(page.locator('[data-home2="cifras"] li')).toHaveCount(3);
  await expect(page.locator('[data-home2="cifras"]')).toContainText("+1.500");
  await expect(page.locator('[data-home2="fundador"]')).toContainText(
    "Ricardo Oyarzún",
  );

  await expect(page.locator("[data-home2-caso]")).toHaveCount(4);
  await expect(page.locator('[data-home2-caso="hebe"]')).toContainText("23x");
  await expect(page.locator('[data-home2-caso="lumina"]')).toContainText("31x");
  await expect(page.locator('[data-home2-caso="sucursal"]')).toContainText(
    "US$ 220.000",
  );
  await expect(page.locator('[data-home2-caso="sucursal"] h3')).toHaveText(
    "Una sucursal de nuestra red",
  );
  // Ricardo, 26-oct-2026: la red propia es «nuestra red de clínicas», sin marcas.
  for (const zona of ["hero", "historia", "casos", "fundador"]) {
    await expect(page.locator(`[data-home2="${zona}"]`)).not.toContainText(
      /Hebe|Lumina/,
    );
  }
  await expect(page.locator('[data-home2="hero"]')).toContainText(
    "nuestra red de clínicas",
  );
  await expect(page.locator('[data-home2="fundador"]')).toContainText(
    "apertura de la sucursal de Vitacura, 2025",
  );

  for (const donde of ["hero", "cierre"]) {
    await expect(page.locator(`[data-home2-cta="${donde}"]`)).toHaveAttribute(
      "href",
      "/agenda",
    );
    await expect(page.locator(`[data-home2-cta="${donde}"]`)).toHaveText(
      "Agendar reunión",
    );
  }
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "clínica médica o estética",
  );
  const convenio = page.locator('[data-home2="alta-qualita"]');
  await expect(convenio).toContainText("descuentos especiales");
  await expect(convenio.locator("a")).toHaveAttribute(
    "href",
    "https://alta-qualita.cl",
  );
  // PMFC con las cuatro letras y la C mostrando cómo agenda.
  for (const letra of ["P", "M", "F", "C"]) {
    await expect(page.locator(`[data-home2-pmfc="${letra}"]`)).toBeVisible();
  }
  await expect(page.locator('[data-home2-pmfc="M"]')).toContainText(
    "evaluaciones prepagadas",
  );
  await expect(page.locator('[data-home2-pmfc="F"]')).toContainText(
    "alto valor",
  );
  await expect(page.locator("[data-home2-slot-nuevo]")).toContainText(
    "Valentina R.",
  );
  // Lo que viene del home: demo, testimonios, planes y preguntas.
  await expect(page.locator("#demo-3-min")).toHaveCount(1);
  await expect(page.locator("#historias")).toContainText("Tamara Oyarzún");
  await expect(page.locator("#faq")).toHaveCount(1);
  // Sin cifras viejas ni promesas de integración con agendas de terceros.
  await expect(page.locator("main")).not.toContainText(
    /\+52 cl[ií]nicas|AgendaPro|Reservo|Medilink/,
  );
});

test("home2: en el celular no hay scroll horizontal", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route(/connect\.facebook\.net|googletagmanager/, (route) =>
    route.abort(),
  );
  await page.goto("/home2", { waitUntil: "domcontentloaded" });
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(ancho).toBeLessThanOrEqual(390);
});
