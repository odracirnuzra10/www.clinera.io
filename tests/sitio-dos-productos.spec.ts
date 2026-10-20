// Ricardo, 20-oct-2026: el sitio vende dos cosas, Vortex y el Ecosistema.
// Menú = Software + Ecosistema; un solo CTA «Agendar reunión»; cifra «+1.500
// clínicas en 10 años»; sin integraciones con agendas de terceros; sin notas
// internas visibles; pie de página con los links legales bien rotulados.
import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PLANES } from "../src/content/planes";
import { PLANES_FAQ } from "../src/content/planes-faq";
import { HOME_FAQ } from "../src/content/home-faq";

test.describe("sitio de dos productos", () => {
  test("el menú tiene solo Software y Ecosistema", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const links = page.locator("nav.nav-v3-links a");
    await expect(links).toHaveCount(2);
    await expect(links.nth(0)).toHaveText("Software");
    await expect(links.nth(0)).toHaveAttribute("href", "/funciones");
    await expect(links.nth(1)).toHaveText("Ecosistema");
    await expect(links.nth(1)).toHaveAttribute("href", "/ecosistema");
    await expect(page.locator("header")).not.toContainText("Clinera O.S.");
  });

  test("el home es corto: hero, logos, las dos opciones, PMFC, demo, testimonios, preguntas y cierre", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const body = page.locator("body");
    await expect(body).toContainText("+1.500 clínicas");
    await expect(body).not.toContainText("+52 clínicas activas");
    await expect(body).not.toContainText("+500 profesionales");
    await expect(body).not.toContainText("Coordina todo tu equipo");
    await expect(body).not.toContainText(/Hablar con ventas|Agendar videollamada|Agendar demo/);
    await expect(page.locator("#faq")).toContainText("¿La publicidad está incluida en el Ecosistema?");
  });

  test("Vortex incluye Clinera Intelligence, el agente interno", () => {
    const vortex = PLANES.find((p) => p.id === "vortex")!;
    expect(vortex.features.join(" ")).toContain("Clinera Intelligence");
    expect(HOME_FAQ.map((f) => f.q)).toContain("¿Qué es Clinera Intelligence?");
  });

  test("la publicidad se paga aparte y no quedan notas internas en /planes", async ({ page }) => {
    const pub = PLANES_FAQ.find((f) => /publicidad/i.test(f.q))!;
    expect(pub.a).toMatch(/^No\. La inversión en publicidad la paga la clínica aparte/);
    await page.goto("/planes", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).not.toContainText("PENDIENTE");
  });

  test("/funciones es Vortex y no promete integraciones con agendas de terceros", async ({ page }) => {
    await page.goto("/funciones", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Vortex");
    await expect(page.locator("main")).not.toContainText(/AgendaPro, Medilink|Sincroniza con Google Calendar|LangChain/);
    await expect(page.locator("main")).toContainText("Clinera Intelligence");
  });

  test("/ecosistema existe, explica PMFC y dice que la publicidad va aparte", async ({ page }) => {
    await page.goto("/ecosistema", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Crece con un equipo detrás");
    await expect(page.locator("[data-ecosistema-hero]")).toContainText("La inversión en publicidad se paga aparte");
    await expect(page.locator("[data-pmfc]")).toBeVisible();
    await expect(page.locator("[data-plan-card]")).toHaveCount(2);
  });

  test("pie de página: links legales bien rotulados", () => {
    const f = readFileSync(join(process.cwd(), "src/components/brand-v3/Footer.tsx"), "utf8");
    expect(f).toContain('["Ley 21.719 de datos personales", "/seguridad"]');
    expect(f).toContain('["Ficha clínica y Ley 20.584", "/ley20584"]');
    expect(f).toContain("+1.500 clínicas en 10 años");
  });
});
