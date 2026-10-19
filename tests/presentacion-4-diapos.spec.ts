import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * /presentacion: 4 diapositivas y, desde el 19-oct-2026, la del ecosistema PMFC (5 en total; Ricardo la pidió expresa):
 * quiénes somos, funciones Clinera, beneficios de contratar Clinera y planes. No reponer las 13 anteriores:
 * el deck es breve a propósito. El HTML duplica números porque no importa TS.
 */
const html = readFileSync(join(process.cwd(), "public/presentacion/index.html"), "utf8");

const slide = (id: string) => {
  const start = html.indexOf(`id="${id}"`);
  return html.slice(start, html.indexOf("</section>", start));
};

test.describe("/presentacion: 4 diapositivas más la del ecosistema PMFC", () => {
  test("solo existen quiénes somos, ecosistema PMFC, funciones, beneficios y planes, en ese orden", () => {
    const ids = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toEqual(["quienes-somos", "pmfc", "rentabilidad", "funciones", "beneficios", "planes"]);
  });

  test("quiénes somos: el ecosistema, 12 años en YouTube y partner de Meta y Google, con el pantallazo del canal", () => {
    const c = slide("quienes-somos");
    expect(c).toContain("ecosistema");
    expect(c).toContain("marketing digital y software");
    expect(c).toContain("clínicas estéticas y médicas");
    expect(c).toContain("más de 12 años");
    expect(c).toContain("Metricads Marketing");
    expect(c).toContain("Meta y Google partner");
    expect(c).toContain("canal-metricads.webp");
    expect(c).not.toContain("1.500");
  });

  test("ecosistema PMFC: cuatro letras, minimalista", () => {
    const c = slide("pmfc");
    for (const l of ["P", "M", "F", "C"]) expect(c).toContain(`data-pmfc="${l}"`);
    for (const n of ["Propuesta de valor", "Marketing", "Framework", "Clinera"]) expect(c).toContain(n);
    // Minimalista: una línea por pieza, sin párrafos.
    expect(c).not.toMatch(/<p\b/);
  });

  test("rentabilidad: mismo ingreso, 10 pacientes de US$ 1.000 vs 100 de US$ 100", () => {
    const c = slide("rentabilidad");
    expect(c.match(/US\$ 10\.000/g)!.length).toBeGreaterThanOrEqual(2);
    expect(c).toContain("10 pacientes");
    expect(c).toContain("100 pacientes");
    expect(c).toContain("× US$ 1.000");
    expect(c).toContain("× US$ 100");
    expect(c.match(/<i><\/i>/g)).toHaveLength(110);
    for (const f of ["Menos mano de obra", "Más mano de obra", "Más estrés", "Menos margen para crecer", "Más margen para crecer"]) expect(c).toContain(f);
  });

  test("funciones Clinera: funciones e IA; CAMILA y LIA siguen como próximamente", () => {
    const c = slide("funciones");
    for (const f of ["Agenda", "Fichas", "Pagos", "Marketing", "Clinera Intelligence", "AURA", "CAMILA", "LIA"]) {
      expect(c).toContain(f);
    }
    // El ecosistema se explica en dos piezas separadas (marketing y software) y cómo trabajan juntas.
    expect(c).toContain('data-eco="marketing"');
    expect(c).toContain('data-eco="software"');
    expect(c).toContain("Cómo funcionan juntos");
    expect(c).toContain("Reunión de marketing cada semana");
    expect(c).toContain("devolverle tiempo al paciente");
    expect(c).toContain("Roadmap 2027: HL7 FHIR");
    expect(c).toContain("En vivo");
    expect(c.match(/Oct 2026/g)).toHaveLength(2);
    expect(c).not.toMatch(/open\s*factura/i);
  });

  test("beneficios: costo, todo unificado y software hecho para clínicas, con el ahorro en números", () => {
    const c = slide("beneficios");
    for (const b of ["costo", "unificado", "especializado"]) expect(c).toContain(`data-beneficio="${b}"`);
    expect(c).toContain("¿Por qué contratar el");
    expect(c).toContain("Ecosistema");
    expect(c).toContain("4 reuniones de marketing al mes");
    expect(c).toContain("Te ahorras desde US$ 470 al mes");
    expect(c).toContain("clínicas estéticas y médicas");
    expect(c).toContain("US$ 600–800/mes");
    expect(c).toContain("entre US$ 1.000 y 1.700");
    expect(c).toContain("US$ 1.000–1.700/mes");
    expect(c).toContain("Ahorras desde US$ 470 al mes");
    expect(c).toContain("US$ 529");
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
    expect(ecosistema).toContain("<strong>$529</strong>");
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
    expect(c).not.toContain("USD 450");
    expect(c).toContain("Onboarding dedicado con un ejecutivo humano en ambos planes");
  });
});
