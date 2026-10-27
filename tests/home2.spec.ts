// Home (Ricardo, 26-oct-2026): el borrador /home2 pasó a ser `/`, con el degradé del hero
// anterior. /home2 redirige al home. Contenido en src/content/home2.ts.

import { expect, test } from "@playwright/test";

test("home: historia, fundador y cuatro casos con cifra", async ({ page }) => {
  await page.route(/connect\.facebook\.net|googletagmanager/, (route) =>
    route.abort(),
  );
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // El home se indexa (el borrador no se indexaba).
  await expect(
    page.locator('meta[name="robots"][content*="noindex"]'),
  ).toHaveCount(0);
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

  // Ricardo, 27-oct-2026: se ve de una que se compra un ecosistema (software + marketing).
  await expect(page.locator('[data-home2="formula"]')).toContainText("Software con IA");
  await expect(page.locator('[data-home2="formula"]')).toContainText("Marketing de performance");
  const incluye = page.locator("[data-ecosistema-incluye]");
  await expect(incluye.locator("[data-ecosistema-pieza]")).toHaveCount(2);
  await expect(incluye).toContainText("Campañas de performance");
  await expect(incluye).toContainText("AURA");
  await expect(incluye.locator("[data-ecosistema-precio]")).toContainText("US$ 529");

  // Ricardo, 27-oct-2026: canal de YouTube y CNN Chile en «Quién está detrás».
  await expect(page.locator("[data-home2-medio]")).toHaveCount(2);
  await expect(page.locator('[data-home2-medio="cnn"]')).toContainText(
    "CNN Chile",
  );
  await expect(page.locator('[data-home2-medio="youtube"]')).toHaveAttribute(
    "href",
    /youtube\.com/,
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
  // Un solo ejemplo recorre las cuatro letras (Ricardo, 27-oct-2026).
  await expect(page.locator('[data-home2-pmfc="P"]')).toContainText("Facial 360");
  await expect(page.locator('[data-home2-pmfc="M"]')).toContainText("US$ 20");
  await expect(page.locator('[data-home2-pmfc="F"]')).toContainText("US$ 1.800");
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

test("home: /home2 redirige al home", async ({ page }) => {
  await page.route(/connect\.facebook\.net|googletagmanager/, (route) =>
    route.abort(),
  );
  await page.goto("/home2", { waitUntil: "domcontentloaded" });
  expect(new URL(page.url()).pathname).toBe("/");
});

test("home: en el celular no hay scroll horizontal", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route(/connect\.facebook\.net|googletagmanager/, (route) =>
    route.abort(),
  );
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(ancho).toBeLessThanOrEqual(390);
});

test("ecosistema: /ecosistema explica las dos piezas y /funciones apunta al Ecosistema", async ({ page }) => {
  await page.route(/connect\.facebook\.net|googletagmanager/, (route) => route.abort());
  await page.goto("/ecosistema", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-ecosistema-incluye] [data-ecosistema-pieza]")).toHaveCount(2);
  await page.goto("/funciones", { waitUntil: "domcontentloaded" });
  const franja = page.locator("[data-ecosistema-franja]");
  await expect(franja).toContainText("Vortex es la pieza de software del Ecosistema");
  await expect(franja.locator("a")).toHaveAttribute("href", "/ecosistema#que-incluye");
});
