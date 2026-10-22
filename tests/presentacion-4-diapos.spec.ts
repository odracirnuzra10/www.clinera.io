import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * /presentacion: 4 diapositivas y, desde el 19-oct-2026, la del ecosistema PMFC (5 en total; Ricardo la pidió expresa):
 * quiénes somos, funciones Clinera, beneficios de contratar Clinera y planes. No reponer las 13 anteriores:
 * el deck es breve a propósito. El HTML duplica números porque no importa TS.
 */
const html = readFileSync(join(process.cwd(), "public/presentacion/index.html"), "utf8");

/** Solo el texto visible: los atributos internos (data-pelicula, clases) no cuentan como jerga. */
const texto = (h: string) => h.replace(/<[^>]+>/g, " ");

const slide = (id: string) => {
  const start = html.indexOf(`id="${id}"`);
  return html.slice(start, html.indexOf("</section>", start));
};

test.describe("/presentacion: 4 diapositivas más la del ecosistema PMFC", () => {
  test("solo existen quiénes somos, problema, las 4 letras de PMFC, beneficios y planes, en ese orden", () => {
    const ids = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toEqual(["quienes-somos", "problema", "pmfc-p", "pmfc-m", "pmfc-f", "pmfc-c", "beneficios", "planes"]);
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

  // Ricardo, 22-oct-2026: el deck se le muestra a doctores que no saben de marketing.
  // Una idea por diapo, palabras de todos los días, sin la sigla PMFC a la vista.
  test("el problema: tres frases cortas", () => {
    const c = slide("problema");
    for (const n of [1, 2, 3]) expect(c).toContain(`data-problema="${n}"`);
    expect(c).not.toContain('data-problema="4"');
    expect(c).toContain("Los anuncios están cada vez más caros");
    expect(c).toContain("Si cobras barato, no ganas");
    expect(c).toContain("vender algo único");
    expect(c).not.toMatch(/patentad/i);
  });

  test("los 4 pasos: numerados, sin PMFC ni jerga a la vista", () => {
    const ids = ["pmfc-p", "pmfc-m", "pmfc-f", "pmfc-c"];
    ids.forEach((id, i) => {
      const h = slide(id);
      expect(h).toContain(`PASO ${i + 1} DE 4`);
      const t = texto(h);
      expect(t).not.toMatch(/PMFC|Metodología|Framework|CPA|puja|\blead\b|SQL|conversión|película|Webhooks|API|FHIR|Roadmap|créditos/);
      expect(h).not.toMatch(/patentad|\b100 cl|1\.500/i);
    });
  });

  test("paso 1, qué vendes: botox común vs tratamiento único", () => {
    const p = slide("pmfc-p");
    expect(p).toContain("Qué vendes");
    expect(p).toContain("data-propuesta");
    expect(p).toContain('data-tratamiento="generico"');
    expect(p).toContain('data-tratamiento="lumina-face"');
    for (const n of ["US$ 50", "US$ 2.000", "40 veces"]) expect(p).toContain(n);
    expect(p).toContain("valores de referencia");
  });

  test("paso 2, cómo llegan los pacientes: el camino y el ejemplo US$ 500 → US$ 10.000", () => {
    const m = slide("pmfc-m");
    expect(m).toContain("data-embudo");
    for (const paso of ["creativo", "clic", "evaluacion", "tratamiento"]) expect(m).toContain(`data-paso="${paso}"`);
    expect(m).toContain("data-pelicula");
    expect(m).toContain("US$&nbsp;500");
    expect(m).toContain("US$&nbsp;10.000");
    expect(m).toContain("20 veces");
    // Una sola escala de números: sin la tabla de anuncios ni las tarjetas de Hebe y Lumina.
    expect(m).not.toContain("data-admin");
    expect(m).not.toContain("data-resultado");
    expect(m).not.toContain("US$ 220.000");
  });

  test("paso 3 y 4: vender en la consulta y la secretaria con IA", () => {
    const f = slide("pmfc-f"), c = slide("pmfc-c");
    expect(f).toContain("Cómo vender");
    expect(f).toContain("framework-consulta.webp");
    expect(c).toContain("secretaria con IA");
    expect(c).toContain("también de noche");
    expect(c).toContain("data-agenda-ia");
    for (const paso of ["campana", "chat", "agenda", "ficha"]) expect(c).toContain(`data-ca="${paso}"`);
    expect(c).not.toMatch(/open\s*factura/i);
  });

  test("beneficios: el ahorro en números y frases cortas", () => {
    const c = slide("beneficios");
    for (const b of ["costo", "unificado", "especializado"]) expect(c).toContain(`data-beneficio="${b}"`);
    expect(c).toContain("Ecosistema");
    expect(c).toContain("Te ahorras desde US$ 470 al mes");
    expect(c).toContain("clínicas estéticas y médicas");
    expect(c).toContain("US$ 600–800/mes");
    expect(c).toContain("US$ 1.000–1.700/mes");
    expect(c).toContain("Ahorras desde US$ 470 al mes");
    expect(c).toContain("US$ 529");
    expect(c).toContain("estimados");
    expect(c).not.toMatch(/AgendaPro|Reservo|Medilink|Bambi/i);
  });

  test("planes: Vortex y Ecosistema con tres líneas cada uno", () => {
    const c = slide("planes");
    const card = (name: string) => {
      const i = c.indexOf(`<h3 class="px-name">${name}</h3>`);
      return c.slice(i, c.indexOf("</article>", i));
    };
    const vortex = card("Vortex"), eco = card("Ecosistema");
    expect(vortex).toContain("<strong>$279</strong>");
    expect(eco).toContain("<strong>$529</strong>");
    for (const k of [vortex, eco]) {
      for (const logo of ["#ch-wa", "#ch-ig", "#ch-fb"]) expect(k).toContain(logo);
      expect(k.match(/<li>/g)).toHaveLength(3);
    }
    expect(vortex).toContain("secretaria con IA");
    expect(eco).toContain("Todo lo de Vortex");
    expect(eco).toContain("hace tus anuncios");
    expect(eco).toContain("reunión cada semana");
    expect(texto(c)).not.toMatch(/créditos|conversaciones|PMFC|onboarding|implementación|Promoción/i);
  });
});
