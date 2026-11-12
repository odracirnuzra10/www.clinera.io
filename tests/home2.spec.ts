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
  // Ricardo, 12-nov-2026: el inicio es el de /prueba-gratis, con la demo viva al lado.
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Prueba gratis sin riesgo y haz crecer tu clínica",
  );
  // Ricardo, 7-nov-2026: las cifras y la franja de logos se cambiaron por las de /prueba-gratis.
  await expect(page.locator("[data-home2-incluye]")).toHaveCount(3);
  await expect(page.locator('[data-home2="marcas"]')).toContainText(
    "El sistema que ocupan las grandes redes de clínicas del país",
  );
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
  await expect(page.locator('[data-home2="formula"]')).toHaveCount(0);
  await expect(page.locator('[data-home2-confianza="hero"]')).toContainText("Sin tarjeta de crédito");
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
    await expect(page.locator(`[data-home2-registro="${donde}"]`)).toHaveText("Crea tu cuenta GRATIS");
  }
  // Las tres tarjetas de planes invitan a la prueba gratis; el pago de Xcale sigue como link secundario.
  await expect(planes.locator('[data-cta="registro"]')).toHaveText(["Pruébalo gratis 7 días", "Pruébalo gratis 7 días", "Pruébalo gratis 7 días"]);
  // Orden: los 3 pasos van justo después del inicio; historia, fundador y convenio, después de las preguntas.
  const y = (sel: string) => page.locator(sel).first().evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  expect(await y('[data-home2="prueba"]')).toBeLessThan(await y('[data-home2="marcas"]'));
  expect(await y("#faq")).toBeLessThan(await y('[data-home2="historia"]'));
  expect(await y('[data-home2="fundador"]')).toBeLessThan(await y('[data-home2="alta-qualita"]'));
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

test("home: la demo viva responde con el nombre de la clínica y lo lleva al registro", async ({ page }) => {
  await page.route(/connect\.facebook\.net|googletagmanager/, (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const demo = page.locator("[data-demo-viva]");
  await demo.getByLabel("Nombre de tu clínica").fill("Clínica Aurora");
  await demo.getByLabel("Tipo de clínica").selectOption("medica");
  await demo.locator("[data-demo-probar]").click();
  await expect(demo.locator("[data-demo-titulo]")).toContainText("WhatsApp de Clínica Aurora");
  const activar = demo.locator("[data-demo-activar]");
  await expect(activar).toBeVisible({ timeout: 8000 });
  await expect(demo).toContainText("Confirmada ✓");
  await expect(activar).toHaveAttribute("data-clinica", "Clínica Aurora");
  // El campo mide 16 px o más (si no, iOS hace zoom).
  const px = await demo.getByLabel("Nombre de tu clínica").evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(px).toBeGreaterThanOrEqual(16);
  // El clic va directo al alta de la plataforma con la clínica escrita.
  let destino = "";
  await page.route("https://app.clinera.io/**", (route) => {
    destino = route.request().url();
    return route.fulfill({ status: 200, contentType: "text/html", body: "ok" });
  });
  await activar.click();
  await page.waitForURL(/app\.clinera\.io/);
  expect(new URL(destino).searchParams.get("clinica")).toBe("Clínica Aurora");
});
