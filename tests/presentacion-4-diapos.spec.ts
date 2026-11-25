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
  test("solo existen quiénes somos, problema, las 4 letras de PMFC y planes, en ese orden", () => {
    const ids = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toEqual(["quienes-somos", "problema", "pmfc-p", "pmfc-m", "pmfc-f", "pmfc-c", "planes"]);
  });

  test("quiénes somos: la plataforma, 12 años en YouTube y partner de Meta y Google, con el pantallazo del canal", () => {
    const c = slide("quienes-somos");
    expect(c).toContain("plataforma");
    expect(c).toContain("marketing digital y software");
    expect(c).toContain("clínicas estéticas y médicas");
    expect(c).toContain("más de 12 años");
    expect(c).toContain("Metricads Marketing");
    expect(c).toContain("Meta y Google partner");
    expect(c).toContain("canal-metricads.webp");
    expect(c).not.toContain("1.500");
    // Ricardo, 26-oct-2026: nacimos de la experiencia de su red de clínicas, sin nombrarlas,
    // y su foto en la apertura de la sucursal de Vitacura (2025).
    expect(c).toContain("data-nacimos");
    expect(c).toContain("nuestra red de clínicas");
    expect(c).not.toMatch(/Hebe|Lumina/);
    expect(c).toContain("apertura de la sucursal de Vitacura, 2025");
    expect(c).toContain("fundador-obra.webp");
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

  test("paso 1, qué vendes: botox suelto vs Facial 360 (Ricardo, 27-oct-2026)", () => {
    const p = slide("pmfc-p");
    expect(p).toContain("Qué vendes");
    expect(p).toContain("data-propuesta");
    expect(p).toContain('data-tratamiento="generico"');
    expect(p).toContain('data-tratamiento="facial-360"');
    for (const n of ["US$ 180", "US$ 1.800", "10 veces", "Facial 360", "HIFU"]) expect(p).toContain(n);
    expect(p).toContain("valores de referencia");
  });

  test("paso 2, cómo llegan los pacientes: la evaluación prepagada de US$ 20 vende el Facial 360", () => {
    const m = slide("pmfc-m");
    expect(m).toContain("data-embudo");
    for (const paso of ["creativo", "clic", "evaluacion", "tratamiento"]) expect(m).toContain(`data-paso="${paso}"`);
    expect(m).toContain("data-pelicula");
    // 26-oct-2026: las campañas buscan una sola cosa, cobrar la evaluación, para que el paciente asista.
    expect(m).toContain("data-cobro-evaluacion");
    expect(m).toContain("pague su evaluación antes de venir");
    expect(m).toContain("Asiste a su cita");
    // Ricardo, 27-oct-2026: el anuncio vende la evaluación (US$ 20), la consulta vende el Facial 360 (US$ 1.800).
    expect(m).toContain("data-evaluacion-prepagada");
    // La red de clínicas no se nombra (Ricardo, 26-oct-2026).
    // Ningún texto visible del deck nombra las clínicas de la red.
    expect(texto(html.slice(html.indexOf('<main class="slides"'), html.indexOf("</main>")))).not.toMatch(/HEBE|Hebe|Lumina/);
    for (const n of ["US$&nbsp;20", "US$&nbsp;1.800", "Facial 360"]) expect(m).toContain(n);
    expect(m).toContain("valores de referencia");
    // Una sola escala de números: sin la tabla de anuncios ni las tarjetas de Hebe y Lumina.
    expect(m).not.toContain("data-admin");
    expect(m).not.toContain("data-resultado");
    expect(m).not.toContain("US$ 220.000");
  });

  test("paso 3 y 4: vender en la consulta y la secretaria con IA", () => {
    const f = slide("pmfc-f"), c = slide("pmfc-c");
    expect(f).toContain("Cómo vender");
    expect(f).toContain("framework-consulta.webp");
    expect(f).toContain("alto valor");
    expect(f.match(/<li>/g)).toHaveLength(4);
    expect(c).toContain("secretaria con IA");
    expect(c).toContain("también de noche");
    expect(c).toContain("data-agenda-ia");
    for (const paso of ["campana", "chat", "agenda", "ficha"]) expect(c).toContain(`data-ca="${paso}"`);
    expect(c).not.toMatch(/open\s*factura/i);
  });

  test("planes: Flux, Hex y Xcale (recomendado) con tres líneas cada uno, más lo que incluyen todos", () => {
    const c = slide("planes");
    const card = (name: string) => {
      const i = c.indexOf(`<h3 class="px-name">${name}</h3>`);
      return c.slice(i, c.indexOf("</article>", i));
    };
    const flux = card("Flux"), hex = card("Hex"), xcale = card("Xcale");
    expect(flux).toContain("<strong>$79</strong>");
    expect(hex).toContain("<strong>$129</strong>");
    expect(xcale).toContain("<strong>$149</strong>");
    expect(flux).toContain("#ch-wa");
    expect(flux).not.toContain("#ch-ig");
    for (const k of [hex, xcale]) {
      for (const logo of ["#ch-wa", "#ch-ig", "#ch-fb"]) expect(k).toContain(logo);
    }
    for (const k of [flux, hex, xcale]) expect(k.match(/<li>/g)).toHaveLength(3);
    expect(xcale).toContain("Todo lo de Hex");
    expect(xcale).toContain("secretaria con IA");
    expect(c.slice(c.lastIndexOf("<article", c.indexOf('<h3 class="px-name">Xcale</h3>')), c.indexOf('<h3 class="px-name">Xcale</h3>'))).toContain("Recomendado");
    expect(c).not.toContain("Ecosistema");
    expect(c).not.toContain("Vortex");
    // Ricardo, 25-nov-2026: agenda, fichas, recetas y consentimientos, en azul médico.
    expect(c).toContain("data-incluido-todos");
    for (const f of ["Agenda", "Fichas clínicas", "Recetas", "Consentimientos informados"]) expect(c).toContain(f);
    expect(texto(c)).not.toMatch(/créditos|conversaciones|PMFC|onboarding|implementación|Promoción/i);
    // Convenio Alta Qualità (Ricardo, 26-oct-2026): sin porcentaje publicado.
    expect(c).toContain("data-convenio");
    expect(c).toContain("Alta Qualità");
    expect(c).not.toMatch(/20 ?%/);
  });
});
