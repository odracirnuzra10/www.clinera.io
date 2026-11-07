// Ricardo, 20-oct-2026: el sitio vende dos cosas, Vortex y el Ecosistema.
// Menú = Software + PMFC + Planes (21-oct); un solo CTA «Agendar reunión»; cifra «+1.500
// clínicas en 10 años»; sin integraciones con agendas de terceros; sin notas
// internas visibles; pie de página con los links legales bien rotulados.
import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PLANES } from "../src/content/planes";
import { PLANES_FAQ } from "../src/content/planes-faq";
import { HOME_FAQ } from "../src/content/home-faq";

test.describe("sitio de dos productos", () => {
  // Ricardo, 7-nov-2026: Software · Planes · Blog (PMFC escondido; /ecosistema sigue).
  test("el menú es Software, Planes y Blog", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const links = page.locator("nav.nav-v3-links a");
    await expect(links).toHaveCount(3);
    await expect(links.nth(0)).toHaveText("Software");
    await expect(links.nth(0)).toHaveAttribute("href", "/funciones");
    await expect(links.nth(1)).toHaveText("Planes");
    await expect(links.nth(1)).toHaveAttribute("href", "/planes");
    await expect(links.nth(2)).toHaveText("Blog");
    await expect(links.nth(2)).toHaveAttribute("href", "/novedades");
    await expect(page.locator("header")).not.toContainText("Clinera O.S.");
  });

  test("el home del software: hero, logos, prueba gratis, funciones, demo, planes, testimonios, blog, preguntas y cierre", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const body = page.locator("body");
    await expect(body).toContainText("+1.500 clínicas");
    await expect(body).not.toContainText("+52 clínicas activas");
    await expect(body).not.toContainText("+500 profesionales");
    await expect(body).not.toContainText("Coordina todo tu equipo");
    // Ricardo, 7-nov-2026: dos acciones en todo el sitio, «Regístrate gratis» y «Solicita asistencia».
    await expect(body).toContainText("Regístrate gratis");
    await expect(body).toContainText("Solicita asistencia");
    await expect(body).not.toContainText(/Contratar Hex|Hablar con ventas|Agendar reunión|Agendar videollamada|Agendar demo|Ver demo 3 min/);
    await expect(page.locator("#faq")).toContainText("¿Cómo funciona la prueba gratis?");
    // Ricardo, 7-nov-2026: sin PMFC ni casos de campañas (escondidos con HOME2_MOSTRAR).
    await expect(page.locator('[data-home2="pmfc"], [data-home2="casos"]')).toHaveCount(0);
    await expect(page.locator("[data-home2-paso]")).toHaveCount(3);
    await expect(page.locator("[data-home2-post]")).toHaveCount(3);
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
