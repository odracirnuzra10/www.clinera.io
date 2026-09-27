import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildRobotsTxt } from "../src/lib/robots-txt";

/**
 * Deck interno del nuevo discurso comercial. Titulares, sin texto chico,
 * tuteo chileno. No es el deck de ventas al dueño.
 */
const html = readFileSync(
  join(process.cwd(), "public/presentacion-nuevo-discurso.html"),
  "utf8",
);

const slideCount = (html.match(/<section class="slide/g) ?? []).length;

test.describe("nuevo discurso comercial — contrato del deck", () => {
  test("cabe en 12 slides, interno, sin texto chico", () => {
    expect(slideCount).toBeGreaterThanOrEqual(8);
    expect(slideCount).toBeLessThanOrEqual(12);
    expect(html).toContain("noindex");
    expect(html).toContain("https://www.clinera.io/nuevodiscurso");
    expect(html).not.toMatch(/font-family:\s*['"]?Inter/);
    expect(html).not.toMatch(/font-size:\s*1[0-5]px/);
    expect(html).not.toMatch(/\b(hacé|agendá|confirmá|volvé|mostrá|tenés|sos |podés)\b/i);
  });

  test("web pública: el anual primero y el mensual después", () => {
    expect(html).toMatch(/el anual primero/i);
    expect(html).toMatch(/Luego el mensual/i);
    expect(html).toContain("Vortex 279");
    expect(html).toContain("Atlas 379");
    expect(html).toContain("Summit 479");
    expect(html).toContain("20% OFF");
    expect(html).toContain("USD 450");
    expect(html).not.toMatch(/Sólo mensual/i);
  });

  test("empuje: 100% hoy/mañana, 50% esta semana, no bajar el plan", () => {
    expect(html).toMatch(/100% de regalo/);
    expect(html).toMatch(/50% de descuento/);
    expect(html).toMatch(/Nunca bajes el plan/);
    expect(html).toMatch(/Adelantamos el/);
    expect(html).toMatch(/Cyberday/);
    expect(html).toMatch(/10, 15, 20, 25 o 30/);
  });

  test("el anual se ofrece primero; el semestral sigue en el constructor", () => {
    expect(html).toMatch(/ofrece primero/i);
    expect(html).toMatch(/20% OFF de catálogo/);
    expect(html).toMatch(/Semestral solo en el constructor/i);
    expect(html).not.toMatch(/Nunca lo ofrezcas primero/);
    expect(html).toMatch(/Hasta 200 clientes/);
  });

  test("no entra al sitemap ni a robots, y no está en el menú", async ({
    page,
    request,
  }) => {
    const robotsTxt = buildRobotsTxt();
    expect(robotsTxt).toContain("Disallow: /nuevodiscurso");

    const sitemap = await request.get("/sitemap.xml");
    expect(await sitemap.text()).not.toContain("/nuevodiscurso");

    await page.goto("/", { waitUntil: "domcontentloaded" });
    const nav = await page.locator("nav").first().innerText();
    expect(nav.toLowerCase()).not.toContain("nuevodiscurso");
  });

  test("abre, pinta la portada y navega con el teclado", async ({ page }) => {
    await page.goto("/nuevodiscurso", { waitUntil: "domcontentloaded" });
    const cover = page.locator("#portada");
    await expect(cover).toHaveClass(/active/);
    await expect(page.getByRole("heading", { name: /Nuevo discurso/i })).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#friccion")).toHaveClass(/active/);

    await page.goto("/nuevodiscurso#anual", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#anual")).toHaveClass(/active/);
    await expect(
      page.locator("#anual").getByText(/solo en el constructor/i),
    ).toBeVisible();
  });
});
