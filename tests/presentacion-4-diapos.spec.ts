import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * /presentacion son 4 diapositivas como máximo (Ricardo, 7-oct-2026 y 19-oct-2026):
 * quiénes somos, funciones Clinera, beneficios de contratar Clinera y planes. No reponer las 13 anteriores:
 * el deck es breve a propósito. El HTML duplica números porque no importa TS.
 */
const html = readFileSync(join(process.cwd(), "public/presentacion/index.html"), "utf8");

const slide = (id: string) => {
  const start = html.indexOf(`id="${id}"`);
  return html.slice(start, html.indexOf("</section>", start));
};

test.describe("/presentacion en 4 diapositivas", () => {
  test("solo existen quiénes somos, funciones, beneficios y planes, en ese orden", () => {
    const ids = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toEqual(["quienes-somos", "funciones", "beneficios", "planes"]);
  });

  test("quiénes somos cuenta la historia: 2017, más de 1.500 clínicas, Clinera 2025", () => {
    const c = slide("quienes-somos");
    expect(c).toContain("2017");
    expect(c).toContain("Más de 1.500 clínicas");
    expect(c).toContain("ninguno satisfacía");
    expect(c).toContain("Sep 2025");
    expect(c).toContain("más de 1 año de desarrollo y testeo");
  });

  test("funciones Clinera: funciones e IA; CAMILA y LIA siguen como próximamente", () => {
    const c = slide("funciones");
    for (const f of ["Agenda", "Fichas", "Pagos", "Marketing", "Clinera Intelligence", "AURA", "CAMILA", "LIA"]) {
      expect(c).toContain(f);
    }
    expect(c).toContain("devolverle tiempo al paciente");
    expect(c).toContain("Roadmap 2027: HL7 FHIR");
    expect(c).toContain("En vivo");
    expect(c.match(/Oct 2026/g)).toHaveLength(2);
    expect(c).not.toMatch(/open\s*factura/i);
  });

  test("beneficios: costo, todo unificado y software hecho para clínicas, con el ahorro en números", () => {
    const c = slide("beneficios");
    for (const b of ["costo", "unificado", "especializado"]) expect(c).toContain(`data-beneficio="${b}"`);
    expect(c).toContain("Te ahorras más de US$ 600 al mes");
    expect(c).toContain("clínicas estéticas y médicas");
    expect(c).toContain("US$ 600–800/mes");
    expect(c).toContain("entre US$ 1.000 y 1.700");
    expect(c).toContain("US$ 1.000–1.700/mes");
    expect(c).toContain("Ahorras más de US$ 600 al mes");
    expect(c).toContain("US$ 379");
    expect(c).toContain("estimados");
    expect(c).not.toMatch(/AgendaPro|Reservo|Medilink|Bambi/i);
  });

  // Modelo nuevo (Ricardo, 18-oct-2026): Vortex y Ecosistema, con la promoción del mes.
  test("planes: Vortex y Ecosistema, con canales y lo que incluye el marketing", () => {
    const c = slide("planes");
    const card = (name: string) => {
      const i = c.indexOf(`<h3 class="px-name">${name}</h3>`);
      const j = c.indexOf("</article>", i);
      return c.slice(i, j);
    };
    const vortex = card("Vortex");
    const ecosistema = card("Ecosistema");
    expect(vortex).toContain("<strong>$279</strong>");
    expect(ecosistema).toContain("<strong>$379</strong>");
    for (const card of [vortex, ecosistema]) {
      for (const logo of ["#ch-wa", "#ch-ig", "#ch-fb"]) expect(card).toContain(logo);
    }
    expect(vortex).toContain("10.000 créditos de IA");
    for (const t of ["Campañas de performance en Facebook, Instagram y Google", "Propuesta de valor", "Framework comercial"]) {
      expect(ecosistema).toContain(t);
      expect(vortex).not.toContain(t);
    }
    expect(c).not.toContain("Promoción del mes");
    expect(c).not.toContain("Implementación gratis");
    expect(c).toContain("Implementación USD 450, pago único");
  });
});
