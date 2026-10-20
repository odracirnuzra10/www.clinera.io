// «Activa tu ecosistema» (antes «Activa tu agente IA») — la banda oscura que rompe el esquema visual.
// Ricardo (18-oct-2026): presente en las landings y los artículos del blog.
// Desde el 20-oct-2026 ya no va en el home (era redundante con PMFC y planes). Y el ranking de software para clínicas estéticas, con
// Clinera primero.

import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const PAGINAS = [
  { path: "/software-estetica", cta: /^\/agenda/ },
  { path: "/blog/mejores-software-clinicas-esteticas", cta: /^\/agenda/ },
];

test.describe("banda «Activa tu ecosistema»", () => {
  for (const p of PAGINAS) {
    test(`está una vez en ${p.path}, con marketing, framework y canales + agenda`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "domcontentloaded" });
      const banda = page.locator("[data-agente-ia-banda]");
      await expect(banda).toHaveCount(1);
      await expect(banda.getByRole("heading", { level: 2 })).toContainText("Activa tu ecosistema");
      for (const tarjeta of ["Campañas de marketing", "Framework comercial", "Canales + agenda"]) {
        await expect(banda.locator("li b", { hasText: tarjeta })).toBeVisible();
      }
      // Planes vigentes: Vortex trae el software con agente IA; Ecosistema suma el marketing.
      await expect(banda).toContainText("Vortex");
      await expect(banda).toContainText("Ecosistema");
      await expect(banda.getByRole("link").first()).toHaveAttribute("href", p.cta);
    });
  }

  test("al ir a /agenda conserva la query del anuncio", async ({ page }) => {
    await page.goto("/software-estetica?utm_source=google&gclid=abc", { waitUntil: "domcontentloaded" });
    // Tras hidratar: el servidor no conoce la query.
    await expect(page.locator("[data-agente-ia-banda] a").first()).toHaveAttribute(
      "href",
      "/agenda?utm_source=google&gclid=abc",
    );
  });

  test("en móvil no desborda la pantalla", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/blog/mejores-software-clinicas-esteticas", { waitUntil: "domcontentloaded" });
    await page.locator("[data-agente-ia-banda]").scrollIntoViewIfNeeded();
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(ancho).toBeLessThanOrEqual(360);
  });
});

test.describe("blog: top 5 software para clínicas estéticas", () => {
  const mdx = readFileSync(
    join(process.cwd(), "src/content/posts/mejores-software-clinicas-esteticas.mdx"),
    "utf8",
  );

  test("Clinera primero y los cuatro competidores con enlace a su sitio", () => {
    const orden = ["## 1. Clinera", "## 2. Reservo", "## 3. AgendaPro", "## 4. Medilink", "## 5. Doctoralia"];
    let ultimo = -1;
    for (const h of orden) {
      const i = mdx.indexOf(h);
      expect(i, h).toBeGreaterThan(ultimo);
      ultimo = i;
    }
    for (const url of ["reservo.cl", "agendapro.com", "softwaremedilink.com", "doctoralia.cl"]) {
      expect(mdx).toContain(url);
    }
  });

  test("no promete integración con agendas de terceros", () => {
    // Las preguntas de la FAQ pueden nombrarla; las afirmaciones no.
    const afirmaciones = mdx
      .split("\n")
      .filter((l) => !l.trim().startsWith("- q:"))
      .join("\n");
    expect(afirmaciones).not.toMatch(/se (integra|sincroniza) con (Reservo|AgendaPro|Medilink)/);
    expect(mdx).toContain("No se sincroniza con otras agendas");
  });

  test("apunta a las keywords del nicho", async ({ page }) => {
    await page.goto("/blog/mejores-software-clinicas-esteticas", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/mejores software para clínicas estéticas/i);
    await expect(page.locator("article")).toContainText("software para centro estético", { ignoreCase: true });
    await expect(page.locator("article table").first()).toBeVisible();
  });
});
