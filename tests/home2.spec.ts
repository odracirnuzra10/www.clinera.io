// Home (Ricardo, 26-oct-2026): el borrador /home2 pasó a ser `/`, con el degradé del hero
// anterior. /home2 muestra la vista previa /home-mix (19-nov-2026). Contenido en src/content/home2.ts.

import { expect, test } from "@playwright/test";

test("home: la nueva forma de atender tu clínica (formato del 19-nov-2026)", async ({ page }) => {
  await page.route(/connect\.facebook\.net|googletagmanager|vimeo/, (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  // El home se indexa y conserva su JSON-LD y la frase de entidad.
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  await expect(page.locator('script[type="application/ld+json"]').first()).toBeAttached();
  // Ricardo, 19-nov-2026: el home es la página de /home2 (public/home-mix/index.html).
  const home = page.locator("[data-home-nuevo]");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("La nueva forma de atender tu clínica");
  await expect(home.locator(".paso")).toHaveCount(7);
  await expect(home.locator("#planes")).toContainText("US$ 79");
  await expect(home.locator("#planes")).toContainText("US$ 129");
  await expect(home.locator("#planes")).toContainText("US$ 149");
  // Los botones de registro van a la plataforma y los intercepta RegistroModal (suma utm).
  const registro = home.locator("a[data-cta-registro]");
  expect(await registro.count()).toBeGreaterThanOrEqual(4);
  await expect(registro.first()).toHaveAttribute("href", /app\.clinera\.io\/auth\/register\?plan=/);
  // Menú y pie del sitio, una sola vez; las preguntas del home siguen.
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator("#faq")).toHaveCount(1);
  // El CSS de la página no se filtra al menú del sitio.
  const navPos = await page.locator("header").first().evaluate((el) => getComputedStyle(el).fontFamily);
  expect(navPos).not.toContain("Plus Jakarta Sans");
  await expect(page.locator("main")).not.toContainText(/\+52 cl[ií]nicas|AgendaPro|Reservo|Medilink/);
});

test("home: /home2 muestra la vista previa del home mezclado (19-nov-2026)", async ({ page }) => {
  await page.goto("/home2", { waitUntil: "domcontentloaded" });
  expect(new URL(page.url()).pathname).toBe("/home2");
  await expect(page.locator("h1")).toContainText("La nueva forma de");
  await expect(page.locator(".paso")).toHaveCount(7);
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

test("ecosistema: /ecosistema redirige a /planes y /funciones ya no nombra el Ecosistema", async ({ page }) => {
  await page.route(/connect\.facebook\.net|googletagmanager/, (route) => route.abort());
  await page.goto("/ecosistema", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/planes/);
  await page.goto("/funciones", { waitUntil: "domcontentloaded" });
  await expect(page.locator("main")).not.toContainText("Ecosistema");
});
