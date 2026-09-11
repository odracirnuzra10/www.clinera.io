import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildRobotsTxt } from "../src/lib/robots-txt";

/**
 * Deck interno de la reunión con ventas: la campaña aprende del marcado MQL.
 * Camino obligatorio Nuevo → MQL → SQL; nunca Nuevo → SQL.
 */
const html = readFileSync(
  join(process.cwd(), "public/presentacion-campana-mql.html"),
  "utf8",
);

const slideCount = (html.match(/<section class="slide/g) ?? []).length;

test.describe("ventas2026 — campaña MQL", () => {
  test("9 slides, interno, camino Nuevo → MQL → SQL", () => {
    expect(slideCount).toBe(9);
    expect(html).toContain("noindex");
    expect(html).toContain("https://www.clinera.io/ventas2026");
    expect(html).toContain("Nuevo → MQL → SQL");
    expect(html).toContain("Nunca Nuevo → SQL");
    expect(html).toMatch(/aprende\s+<strong>solo de MQL<\/strong>/i);
    expect(html).not.toMatch(/font-family:\s*['"]?Inter/);
    expect(html).not.toMatch(/\b(hacé|agendá|confirmá|volvé|mostrá|tenés|sos |podés)\b/i);
  });

  test("no entra al sitemap ni a robots, y no está en el menú", async ({
    page,
    request,
  }) => {
    const robotsTxt = buildRobotsTxt();
    expect(robotsTxt).toContain("Disallow: /ventas2026");

    const sitemap = await request.get("/sitemap.xml");
    expect(await sitemap.text()).not.toContain("/ventas2026");

    await page.goto("/", { waitUntil: "domcontentloaded" });
    const nav = await page.locator("nav").first().innerText();
    expect(nav.toLowerCase()).not.toContain("ventas2026");
  });

  test("abre, pinta la portada y no deja saltar MQL", async ({ page }) => {
    await page.goto("/ventas2026", { waitUntil: "domcontentloaded" });
    const cover = page.locator("#portada");
    await expect(cover).toHaveClass(/active/);
    await expect(
      page.getByRole("heading", { name: /aprende de ustedes/i }),
    ).toBeVisible();
    await expect(page.locator("#counter")).toHaveText("01 / 09");

    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#cambio")).toHaveClass(/active/);
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#ensena")).toHaveClass(/active/);
    await expect(page.locator("#ensena").getByText("Nunca")).toBeVisible();
    await expect(page.locator("#ensena").getByText("Siempre")).toBeVisible();
    await expect(
      page.locator("#ensena").getByRole("heading", { name: "Nuevo → MQL → SQL" }),
    ).toBeVisible();
    await expect(
      page.locator("#ensena").getByRole("heading", { name: "Nuevo → SQL" }),
    ).toBeVisible();
    await expect(page.locator("#counter")).toHaveText("03 / 09");
  });
});
