# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: aeo-entidad.spec.ts >> AEO: entidad, schema e higiene >> Organization.name es Clinera y SoftwareApplication es Clinera O.S.
- Location: tests/aeo-entidad.spec.ts:9:7

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /ENTITY_PHRASE[\s\S]{0,200}AURA, CAMILA y LIA/
Received string:  "/**
 * Identidad pública canónica de Clinera (AEO).
 *
 * Marca = Clinera. Producto = Clinera O.S. El agente interno de reportes
 * NO es el nombre de la empresa: no usarlo en Organization, SoftwareApplication,
 * meta description de entidad ni llms.txt (confunde con clinera.ai).
 *
 * Frase de entidad (≤ 25 palabras) — repetir textual en schema, llms y home.
 */·
export const SITE_URL = \"https://www.clinera.io\";·
/**
 * @id del grafo AEO. Hebe y Lumina ya apuntan aquí (sin www).
 * No duplicar una Organization con www.clinera.io/#organization.
 */
export const CLINERA_ORG_ID = \"https://clinera.io/#organization\";
export const CLINERA_ORG_URL = \"https://clinera.io\";
export const OACG_ORG_ID = \"https://oacg.cl/#organization\";
export const RICARDO_PERSON_ID =
  \"https://www.metodohebe.cl/fundador/#person\";
export const HEBE_ORG_ID = \"https://www.metodohebe.cl/#organization\";
export const LUMINA_ORG_ID = \"https://www.protocololumina.cl/#organization\";
/** Partner / cliente. No es filial de OACG: no usar parentOrganization. */
export const KM_ORG_ID = \"https://kmestetica.cl/#organization\";
export const KATHERINE_PERSON_ID = \"https://kmestetica.cl/fundador/#person\";·
/** description del nodo Organization en JSON-LD (grafo AEO). */
export const ORG_SCHEMA_DESCRIPTION =
  \"Plataforma de IA para clínicas médicas y estéticas en Latinoamérica\";·
export const ENTITY_NAME = \"Clinera\";
export const PRODUCT_NAME = \"Clinera O.S.\";
export const LEGAL_NAME = \"OACG SpA\";
export const PARENT_ORG_NAME = \"OACG Group\";
export const PARENT_ORG_URL = \"https://oacg.cl\";
export const FOUNDING_DATE = \"2025\";·
/** ≤ 25 palabras. No cambiar sin actualizar schema + llms.txt + llms-full.txt. */
export const ENTITY_PHRASE =
  \"Clinera es la C de la metodología PMFC: software con IA y marketing de performance para clínicas estéticas y médicas en LATAM.\";·
export const ENTITY_DESCRIPTION =
  \"Software con IA y marketing de performance para clínicas estéticas y médicas en LATAM. Campañas que traen pacientes y AURA, el agente de IA que los responde, agenda y confirma por WhatsApp, integrado a agenda, ficha clínica y ventas.\";·
export const DISAMBIGUATING_DESCRIPTION =
  \"Empresa chilena de software para clínicas en Latinoamérica (clinera.io). No relacionada con clinera.ai.\";·
export const HOME_META_DESCRIPTION =
  \"Clinera O.S. es el software para clínicas estéticas: ficha médica y estética facial y corporal, evoluciones, presupuestos, ventas y tratamientos precargados. Con IA opcional que atiende tu WhatsApp y agenda por ti.\";·
export const MARKETS = [
  \"Chile\",
  \"México\",
  \"Perú\",
  \"Colombia\",
  \"Argentina\",
  \"Ecuador\",
  \"Uruguay\",
  \"Costa Rica\",
  \"Panamá\",
] as const;·
export const AREA_SERVED = [
  \"CL\",
  \"MX\",
  \"PE\",
  \"CO\",
  \"AR\",
  \"EC\",
  \"UY\",
  \"CR\",
  \"PA\",
] as const;·
export const MARKETS_PROSE = [
  MARKETS.slice(0, -1).join(\", \"),
  MARKETS[MARKETS.length - 1],
].join(\" y \");·
export const MARKETS_COUNT = MARKETS.length;·
export const SAME_AS = [
  SITE_URL,
  \"https://cl.linkedin.com/company/clinera-io\",
  \"https://www.instagram.com/clinera.io\",
  \"https://www.youtube.com/channel/UCl4Bh9sNp22PjJuSLgz9ZsQ\",
  \"https://apps.apple.com/us/app/clinera/id6759620693\",
  \"https://play.google.com/store/apps/details?id=com.clinera.mobile\",
  \"https://oacg.cl/clinera/\",
] as const;·
export const FOUNDER = {
  name: \"Ricardo Oyarzún Acuña\",
  jobTitle:
    \"Fundador de Clinera, Método Hebe, Protocolo Lumina y Metricads\",
  sameAs: \"https://www.linkedin.com/in/ricardooyarzunmarketingdigital/\",
  slug: \"ricardo-oyarzun\",
} as const;·
export const LOGO_URL = `${SITE_URL}/images/brand/clinera-icon-512.png`;
export const ADDRESS_LOCALITY = \"Santiago\";
export const ADDRESS_COUNTRY = \"CL\";·
export const MEJOR_SOFTWARE_HREFLANG = {
  \"es-419\": `${SITE_URL}/mejor-software-clinicas`,
  \"es-CL\": `${SITE_URL}/mejor-software-clinicas/chile`,
  \"es-MX\": `${SITE_URL}/mejor-software-clinicas/mexico`,
  \"es-CO\": `${SITE_URL}/mejor-software-clinicas/colombia`,
  \"es-PE\": `${SITE_URL}/mejor-software-clinicas/peru`,
  \"x-default\": `${SITE_URL}/mejor-software-clinicas`,
} as const;
"
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | import { readFileSync } from "node:fs";
  3   | import { join } from "node:path";
  4   | 
  5   | const root = process.cwd();
  6   | const read = (p: string) => readFileSync(join(root, p), "utf8");
  7   | 
  8   | test.describe("AEO: entidad, schema e higiene", () => {
  9   |   test("Organization.name es Clinera y SoftwareApplication es Clinera O.S.", () => {
  10  |     const entidad = read("src/content/entidad.ts");
  11  |     expect(entidad).toMatch(/export const ENTITY_NAME = "Clinera"/);
  12  |     expect(entidad).toMatch(/export const PRODUCT_NAME = "Clinera O.S."/);
  13  |     expect(entidad).toContain("No relacionada con clinera.ai");
> 14  |     expect(entidad).toMatch(/ENTITY_PHRASE[\s\S]{0,200}AURA, CAMILA y LIA/);
      |                     ^ Error: expect(received).toMatch(expected)
  15  | 
  16  |     const schemas = read("src/components/seo/schemas.ts");
  17  |     expect(schemas).toContain("name: ENTITY_NAME");
  18  |     expect(schemas).toContain("name: PRODUCT_NAME");
  19  |     expect(schemas).toContain("disambiguatingDescription");
  20  |     expect(schemas).toContain("parentOrganization");
  21  |     expect(schemas).not.toMatch(/AggregateRating/);
  22  |     expect(schemas).not.toMatch(/lowPrice:\s*"129"/);
  23  |     // Las Offers salen de los planes vigentes (Flux · Nexus · Summit, 18-oct-2026).
  24  |     expect(schemas).toContain("PLANES.map");
  25  |   });
  26  | 
  27  |   test("home usa orgSchema/softwareSchema y no duplica precios viejos", () => {
  28  |     const home = read("src/app/page.tsx");
  29  |     expect(home).toContain("orgSchema");
  30  |     expect(home).toContain("softwareSchema");
  31  |     expect(home).toContain("data-entity-phrase");
  32  |     expect(home).not.toMatch(/Clinera Intelligence/);
  33  |     expect(home).not.toMatch(/lowPrice/);
  34  |     expect(home).not.toMatch(/AggregateRating/);
  35  | 
  36  |     const layout = read("src/app/layout.tsx");
  37  |     expect(layout).toContain('template: "%s | Clinera"');
  38  |     expect(layout).not.toContain("| Clinera.io");
  39  |   });
  40  | 
  41  |   test("llms.txt unifica nombre y desambigua clinera.ai", () => {
  42  |     const llms = read("public/llms.txt");
  43  |     expect(llms).toContain(
  44  |       "Nombre canónico: Clinera (producto: Clinera O.S.). No confundir con clinera.ai.",
  45  |     );
  46  |     expect(llms).toContain(
  47  |       "Clinera es la C de la metodología PMFC: software con IA y marketing de performance para clínicas estéticas y médicas en LATAM.",
  48  |     );
  49  |     expect(llms).toContain("https://www.clinera.io/efectividad");
  50  |     expect(llms).toContain("Brasil no está");
  51  |     expect(llms).not.toMatch(/10 países/);
  52  | 
  53  |     const full = read("public/llms-full.txt");
  54  |     expect(full).toContain("No confundir con clinera.ai");
  55  |     expect(full).toContain("## Ayuda y cómo hacer");
  56  |     expect(full).toContain("/ayuda");
  57  |     expect(full).toContain("/#definiciones");
  58  |   });
  59  | 
  60  |   test("301 de URLs 404 y sitemap sin casos-de-exito", () => {
  61  |     const config = read("next.config.ts");
  62  |     expect(config).toMatch(/source:\s*'\/casos-de-exito'/);
  63  |     expect(config).toContain("destination: '/clinicas'");
  64  |     expect(config).toMatch(/source:\s*'\/precios\/software.html'/);
  65  |     expect(config).toContain("destination: '/planes'");
  66  | 
  67  |     const sitemap = read("src/app/sitemap.ts");
  68  |     expect(sitemap).not.toContain("/casos-de-exito");
  69  |     expect(sitemap).toContain("pageDate");
  70  |     expect(sitemap).toContain("/equipo");
  71  |     expect(sitemap).not.toMatch(/lastModified:\s*now/);
  72  |   });
  73  | 
  74  |   test("títulos sin sufijo duplicado ni emojis", () => {
  75  |     expect(read("src/app/empleado-digital/page.tsx")).not.toContain("| Clinera.io");
  76  |     expect(read("src/app/prensa/page.tsx")).not.toContain("| Clinera.io");
  77  |     expect(read("src/app/planes/page.tsx")).not.toContain("| Clinera.io");
  78  |     expect(read("src/app/ayuda/layout.tsx")).not.toContain("| Clinera.io");
  79  | 
  80  |     const chatbot = read(
  81  |       "src/content/posts/chatbot-vs-agente-de-ia-no-son-lo-mismo.mdx",
  82  |     );
  83  |     expect(chatbot).not.toMatch(/🤖|🧠/);
  84  |     expect(chatbot).toContain("Chatbot vs agente de IA: no son lo mismo");
  85  | 
  86  |     const noshows = read(
  87  |       "src/content/posts/como-reducir-no-shows-clinica-estetica.mdx",
  88  |     );
  89  |     const title = noshows.match(/^title:\s*"([^"]+)"/m)?.[1] ?? "";
  90  |     expect(title.length).toBeLessThanOrEqual(50);
  91  |   });
  92  | 
  93  |   // Ricardo, 20-oct-2026: la cifra pública es «+1.500 clínicas en 10 años» (no
  94  |   // «+500 profesionales · 9 países»). Los 9 mercados siguen en `MARKETS`.
  95  |   test("home y footer dicen +1.500 clínicas, no 10 países ni +500 profesionales", () => {
  96  |     for (const f of ["src/components/home-v3/sections.tsx", "src/components/brand-v3/Footer.tsx", "src/components/Footer.tsx"]) {
  97  |       expect(read(f)).toContain("1.500 clínicas");
  98  |       expect(read(f)).not.toContain("10 países");
  99  |       expect(read(f)).not.toContain("500 profesionales");
  100 |     }
  101 |   });
  102 | 
  103 |   test("demo y plataforma no publican AggregateRating ni lowPrice 129", () => {
  104 |     const demo = read("src/app/demo/page.tsx");
  105 |     expect(demo).not.toMatch(/aggregateRating|AggregateRating/i);
  106 |     expect(demo).not.toMatch(/price:\s*"129"/);
  107 | 
  108 |     const plataforma = read("src/app/plataforma/page.tsx");
  109 |     expect(plataforma).toContain("softwareSchema");
  110 |     expect(plataforma).not.toMatch(/offerCount:\s*"9"/);
  111 |     expect(plataforma).not.toMatch(/lowPrice/);
  112 |   });
  113 | 
  114 |   test("existe /equipo y Person @id para autores", () => {
```