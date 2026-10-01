import { test, expect } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
import { ESTETICA, WHATSAPP_IA } from "../src/components/software-vertical/content";

// Plan SEO/AEO Q4 2026. Pruebas estáticas: no abren navegador.
const leer = (p: string) => readFileSync(p, "utf8");

test.describe("páginas de compra nuevas", () => {
  for (const [c, ruta] of [
    [ESTETICA, "software-estetica"],
    [WHATSAPP_IA, "agendamiento-whatsapp-ia"],
  ] as const) {
    test(`/${ruta}: contenido, sitemap y página`, () => {
      expect(c.slug).toBe(ruta);
      expect(existsSync(`src/app/${ruta}/page.tsx`)).toBe(true);
      expect(leer("src/app/sitemap.ts")).toContain(`'/${ruta}'`);
      expect(leer("src/content/page-dates.ts")).toContain(`"/${ruta}"`);
      expect(leer("public/llms.txt")).toContain(`clinera.io/${ruta}`);
      // respuesta directa de 40 a 60 palabras
      const palabras = c.thesis.trim().split(/\s+/).length;
      expect(palabras).toBeGreaterThanOrEqual(40);
      expect(palabras).toBeLessThanOrEqual(60);
      // regla de AGENTS.md: sin integración con agendas de terceros
      const faqs = c.faqs.map((f) => f.a).join(" ");
      expect(faqs).toContain("No. Clinera no se sincroniza");
      // residuos que no deben volver
      const todo = JSON.stringify(c);
      expect(todo).not.toMatch(/10 créditos por conversación|US\$ ?750|Agentic Pro|modo Eficiente/i);
      expect(todo).not.toMatch(/\+500 médicos/);
    });
  }

  test("WhatsApp: tarifas de AGENTS.md y regla 1 cuenta = 1 número", () => {
    const todo = JSON.stringify(WHATSAPP_IA);
    expect(todo).toContain("30 créditos");
    expect(todo).toContain("195");
    expect(todo).toContain("1 número de WhatsApp");
  });
});

test.describe("comparativas AgendaPro y Medilink", () => {
  const src = leer("src/app/comparativas/[slug]/page.tsx");

  test("ninguna comparativa afirma integración con agendas de terceros", () => {
    // AGENTS.md: Clinera no se integra con agendas de terceros (opera sobre su
    // propia agenda, ficha y pagos). Solo existen Webhooks + API pública.
    const fuentes = [
      "src/app/comparativas/[slug]/page.tsx",
      "src/app/comparativas/page.tsx",
      "src/content/comparativas-cross.ts",
      "src/content/recursos-templates.ts",
      "src/content/mejor-software.ts",
    ];
    const prohibido = [
      /IA integrable con/,
      /integrable (encima|a cualquier|con cualquier)/,
      /vía API\/MCP con/,
      /vía API y MCP con/,
      /sincroniza la agenda con tu/,
      /operar (el canal )?WhatsApp (encima|por encima)/i,
      /(encima|por encima) (de|vía) (tu |Dentalink|Reservo|Sacmed|Medilink|AgendaPro|Medifolios|Saludtools|Doctocliq|cualquier)/,
      /(combinar|combina|combinarlos)[^.]{0,60}vía API/,
      /Mantenés|Tenés/,
    ];
    for (const f of fuentes) {
      const t = leer(f);
      for (const re of prohibido) expect(t, `${f} ${re}`).not.toMatch(re);
    }
  });

  test("titulan por la intención «alternativa a»", () => {
    expect(src).toContain("Alternativa a AgendaPro");
    expect(src).toContain("Alternativa a Medilink");
  });
});

test.describe("ficha clínica: demo a mitad de artículo y en /ley20584", () => {
  const posts = [
    "que-es-una-ficha-clinica",
    "elementos-ficha-clinica-chile",
    "ficha-clinica-electronica-chile",
    "normativa-ficha-clinica-chile-ley-20584",
    "software-ficha-clinica-electronica",
    "ficha-clinica-papel-vs-electronica",
    "ficha-clinica-estetica-vs-medica",
    "ficha-clinica-por-especialidad",
    "como-pedir-ficha-clinica-chile",
  ];
  for (const p of posts) {
    test(`${p} lleva <FichaCTA />`, () => {
      expect(leer(`src/content/posts/${p}.mdx`)).toContain("<FichaCTA />");
    });
  }

  test("el blog registra FichaCTA como componente MDX", () => {
    expect(leer("src/app/blog/[slug]/page.tsx")).toMatch(/components=\{\{[^}]*FichaCTA/);
  });

  test("/ley20584 tiene CTA a /agenda y FAQPage", () => {
    const t = leer("src/app/ley20584/page.tsx");
    expect(t).toContain("/agenda?lead_source=ley20584");
    expect(t).toContain("faqSchema(FAQS)");
    const resp = /RESPUESTA_DIRECTA =\s+"([^"]+)"/.exec(t)?.[1] ?? "";
    const n = resp.split(/\s+/).length;
    expect(n).toBeGreaterThanOrEqual(40);
    expect(n).toBeLessThanOrEqual(60);
  });
});
