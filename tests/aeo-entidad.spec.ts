import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");

test.describe("AEO: entidad, schema e higiene", () => {
  test("Organization.name es Clinera y SoftwareApplication es Clinera O.S.", () => {
    const entidad = read("src/content/entidad.ts");
    expect(entidad).toMatch(/export const ENTITY_NAME = "Clinera"/);
    expect(entidad).toMatch(/export const PRODUCT_NAME = "Clinera O.S."/);
    expect(entidad).toContain("No relacionada con clinera.ai");
    expect(entidad).toMatch(/ENTITY_PHRASE[\s\S]{0,200}AURA, CAMILA y LIA/);

    const schemas = read("src/components/seo/schemas.ts");
    expect(schemas).toContain("name: ENTITY_NAME");
    expect(schemas).toContain("name: PRODUCT_NAME");
    expect(schemas).toContain("disambiguatingDescription");
    expect(schemas).toContain("parentOrganization");
    expect(schemas).not.toMatch(/AggregateRating/);
    expect(schemas).not.toMatch(/lowPrice:\s*"129"/);
    // Las Offers salen de los planes vigentes (Flux · Nexus · Summit, 18-oct-2026).
    expect(schemas).toContain("PLANES.map");
  });

  test("home usa orgSchema/softwareSchema y no duplica precios viejos", () => {
    const home = read("src/app/page.tsx");
    expect(home).toContain("orgSchema");
    expect(home).toContain("softwareSchema");
    expect(home).toContain("data-entity-phrase");
    expect(home).not.toMatch(/Clinera Intelligence/);
    expect(home).not.toMatch(/lowPrice/);
    expect(home).not.toMatch(/AggregateRating/);

    const layout = read("src/app/layout.tsx");
    expect(layout).toContain('template: "%s | Clinera"');
    expect(layout).not.toContain("| Clinera.io");
  });

  test("llms.txt unifica nombre y desambigua clinera.ai", () => {
    const llms = read("public/llms.txt");
    expect(llms).toContain(
      "Nombre canónico: Clinera (producto: Clinera O.S.). No confundir con clinera.ai.",
    );
    expect(llms).toContain(
      "Clinera es la C de la metodología PMFC: software con IA y marketing de performance para clínicas estéticas y médicas en LATAM.",
    );
    expect(llms).toContain("https://www.clinera.io/efectividad");
    expect(llms).toContain("Brasil no está");
    expect(llms).not.toMatch(/10 países/);

    const full = read("public/llms-full.txt");
    expect(full).toContain("No confundir con clinera.ai");
    expect(full).toContain("## Ayuda y cómo hacer");
    expect(full).toContain("/ayuda");
    expect(full).toContain("/#definiciones");
  });

  test("301 de URLs 404 y sitemap sin casos-de-exito", () => {
    const config = read("next.config.ts");
    expect(config).toMatch(/source:\s*'\/casos-de-exito'/);
    expect(config).toContain("destination: '/clinicas'");
    expect(config).toMatch(/source:\s*'\/precios\/software.html'/);
    expect(config).toContain("destination: '/planes'");

    const sitemap = read("src/app/sitemap.ts");
    expect(sitemap).not.toContain("/casos-de-exito");
    expect(sitemap).toContain("pageDate");
    expect(sitemap).toContain("/equipo");
    expect(sitemap).not.toMatch(/lastModified:\s*now/);
  });

  test("títulos sin sufijo duplicado ni emojis", () => {
    expect(read("src/app/empleado-digital/page.tsx")).not.toContain("| Clinera.io");
    expect(read("src/app/prensa/page.tsx")).not.toContain("| Clinera.io");
    expect(read("src/app/planes/page.tsx")).not.toContain("| Clinera.io");
    expect(read("src/app/ayuda/layout.tsx")).not.toContain("| Clinera.io");

    const chatbot = read(
      "src/content/posts/chatbot-vs-agente-de-ia-no-son-lo-mismo.mdx",
    );
    expect(chatbot).not.toMatch(/🤖|🧠/);
    expect(chatbot).toContain("Chatbot vs agente de IA: no son lo mismo");

    const noshows = read(
      "src/content/posts/como-reducir-no-shows-clinica-estetica.mdx",
    );
    const title = noshows.match(/^title:\s*"([^"]+)"/m)?.[1] ?? "";
    expect(title.length).toBeLessThanOrEqual(50);
  });

  // Ricardo, 20-oct-2026: la cifra pública es «+1.500 clínicas en 10 años» (no
  // «+500 profesionales · 9 países»). Los 9 mercados siguen en `MARKETS`.
  test("home y footer dicen +1.500 clínicas, no 10 países ni +500 profesionales", () => {
    for (const f of ["src/components/home-v3/sections.tsx", "src/components/brand-v3/Footer.tsx", "src/components/Footer.tsx"]) {
      expect(read(f)).toContain("1.500 clínicas");
      expect(read(f)).not.toContain("10 países");
      expect(read(f)).not.toContain("500 profesionales");
    }
  });

  test("demo y plataforma no publican AggregateRating ni lowPrice 129", () => {
    const demo = read("src/app/demo/page.tsx");
    expect(demo).not.toMatch(/aggregateRating|AggregateRating/i);
    expect(demo).not.toMatch(/price:\s*"129"/);

    const plataforma = read("src/app/plataforma/page.tsx");
    expect(plataforma).toContain("softwareSchema");
    expect(plataforma).not.toMatch(/offerCount:\s*"9"/);
    expect(plataforma).not.toMatch(/lowPrice/);
  });

  test("existe /equipo y Person @id para autores", () => {
    const equipo = read("src/app/equipo/page.tsx");
    expect(equipo).toContain("personSchema");
    expect(equipo).toContain("id={a.slug}");
    const schemas = read("src/components/seo/schemas.ts");
    expect(schemas).toContain("/equipo#");
    expect(schemas).toContain('slug: "ricardo-oyarzun"');
  });
});

test.describe("AEO: JSON-LD en runtime", () => {
  test("home emite Organization Clinera y Offers de planes", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/Clinera O\.S\./);

    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const blob = scripts.join("\n");
    expect(blob).toContain('"name":"Clinera"');
    expect(blob).toContain('"name":"Clinera O.S."');
    expect(blob).toContain("No relacionada con clinera.ai");
    expect(blob).toContain('"price":"129"');
    expect(blob).toContain('"price":"179"');
    expect(blob).toContain('"price":"279"');
    expect(blob).not.toContain('"price":"479"');
    expect(blob).not.toContain('"lowPrice":"129"');
    expect(blob).not.toContain("AggregateRating");
    expect(blob).not.toContain("Clinera Intelligence");
  });

  test("/casos-de-exito redirige a /clinicas", async ({ page }) => {
    const res = await page.goto("/casos-de-exito", {
      waitUntil: "domcontentloaded",
    });
    expect(res?.url()).toContain("/clinicas");
    expect(res?.status()).toBeLessThan(400);
  });

  test("/precios/software.html redirige a /planes", async ({ page }) => {
    const res = await page.goto("/precios/software.html", {
      waitUntil: "domcontentloaded",
    });
    expect(res?.url()).toContain("/planes");
  });

  test("empleado-digital no duplica el sufijo Clinera.io", async ({ page }) => {
    await page.goto("/empleado-digital", { waitUntil: "domcontentloaded" });
    const title = await page.title();
    expect(title).not.toMatch(/Clinera\.io\s*\|\s*Clinera/);
    expect(title).toMatch(/Clinera$/);
    expect(title.length).toBeLessThanOrEqual(60);
  });
});
