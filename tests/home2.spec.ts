// Home (Ricardo, 26-oct-2026): el borrador /home2 pasó a ser `/`, con el degradé del hero
// anterior. /home2 redirige al home. Contenido en src/content/home2.ts.

import { expect, test } from "@playwright/test";

test("home: prueba gratis, funciones, blog, historia y fundador", async ({ page }) => {
  await page.route(/connect\.facebook\.net|googletagmanager/, (route) =>
    route.abort(),
  );
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // El home se indexa (el borrador no se indexaba).
  await expect(
    page.locator('meta[name="robots"][content*="noindex"]'),
  ).toHaveCount(0);
  // Ricardo, 7-nov-2026: el home vende la prueba gratis del software.
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "agenda y cobra la evaluación",
  );
  await expect(page.locator('[data-home2="cifras"] li')).toHaveCount(3);
  await expect(page.locator('[data-home2="cifras"]')).toContainText("+1.500");
  await expect(page.locator('[data-home2="fundador"]')).toContainText(
    "Ricardo Oyarzún",
  );

  // Ricardo, 7-nov-2026: el home vende solo el software. PMFC y los casos de campañas
  // quedan escondidos (HOME2_MOSTRAR en src/content/home2.ts), no borrados.
  await expect(page.locator("[data-home2-caso]")).toHaveCount(0);
  await expect(page.locator("[data-home2-pmfc]")).toHaveCount(0);
  await expect(page.locator("[data-home2-paso]")).toHaveCount(3);
  await expect(page.locator('[data-home2="funciones"]')).toContainText("Agenda por profesional");
  await expect(page.locator("[data-home2-post]")).toHaveCount(3);
  await expect(page.locator("[data-home2-blog-todo]")).toHaveAttribute("href", "/novedades");
  // Ricardo, 26-oct-2026: la red propia es «nuestra red de clínicas», sin marcas.
  for (const zona of ["hero", "historia", "fundador"]) {
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

  // Ricardo, 7-nov-2026: la fórmula es del software y los planes son los de la prueba gratis.
  await expect(page.locator('[data-home2="formula"]')).toContainText("IA que responde y agenda");
  await expect(page.locator('[data-home2="formula"]')).toContainText("Agenda por profesional");
  await expect(page.locator("[data-ecosistema-incluye]")).toHaveCount(0);
  const planes = page.locator("[data-planes-trial]");
  await expect(planes.locator("[data-plan-card]")).toHaveCount(3);
  await expect(planes).toContainText("US$ 49");
  await expect(planes).toContainText("US$ 129");
  await expect(planes).toContainText("US$ 149");

  // Ricardo, 7-nov-2026: Metricads y «Meta partner» escondidos del home (HOME2_MOSTRAR.metricads).
  // Queda CNN Chile en «Quién está detrás».
  await expect(page.locator("[data-home2-medio]")).toHaveCount(1);
  await expect(page.locator('[data-home2-medio="cnn"]')).toContainText(
    "CNN Chile",
  );
  await expect(page.locator("main")).not.toContainText(/Metricads|Meta y Google partner/);

  for (const donde of ["hero", "cierre"]) {
    // Ricardo, 7-nov-2026: «Regístrate gratis» (principal) y «Solicita asistencia» (WhatsApp).
    await expect(page.locator(`[data-home2-cta="${donde}"]`)).toHaveAttribute("href", "https://wa.me/56985581524?text=necesito%20asistencia");
    await expect(page.locator(`[data-home2-cta="${donde}"]`)).toHaveText("Solicita asistencia");
    await expect(page.locator(`[data-home2-registro="${donde}"]`)).toHaveAttribute("href", "/prueba-gratis");
    await expect(page.locator(`[data-home2-registro="${donde}"]`)).toHaveText("Regístrate gratis");
  }
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Tú atiendes pacientes");
  const convenio = page.locator('[data-home2="alta-qualita"]');
  await expect(convenio).toContainText("descuentos especiales");
  await expect(convenio.locator("a")).toHaveAttribute(
    "href",
    "https://alta-qualita.cl",
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
