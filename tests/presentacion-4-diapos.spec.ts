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

  test("el problema: publicidad cara, vender barato, guerra de precios y la salida", () => {
    const c = slide("problema");
    for (const n of [1, 2, 3, 4]) expect(c).toContain(`data-problema="${n}"`);
    expect(c).toContain("Los anuncios cada vez cuestan más");
    expect(c).toContain("Instagram, Facebook y Google");
    expect(c).toContain("propuesta de valor");
    expect(c).not.toMatch(/patentad/i);
  });

  // Ricardo, 20-oct-2026: una diapo por sigla, y cada letra absorbe lo suyo
  // (P la rentabilidad; M los resultados y el anuncio; C el software de «PMFC en acción»).
  test("metodología PMFC: una diapo por sigla, cada una con su visual", () => {
    const p = slide("pmfc-p"), m = slide("pmfc-m"), f = slide("pmfc-f"), c = slide("pmfc-c");
    for (const [l, html] of [["P", p], ["M", m], ["F", f], ["C", c]] as const) {
      expect(html).toContain(`data-pmfc="${l}"`);
      expect(html).not.toMatch(/patentad|\b100 cl|1\.500/i);
    }
    // Ricardo, 20-oct-2026: botox genérico (US$ 180, margen US$ 50) vs protocolo único Lumina Face (cuesta US$ 500, se vende a US$ 2.500).
    expect(p).toContain("deja de competir por precio");
    expect(p).toContain("más de 10 años");
    expect(p).toContain("data-propuesta");
    expect(p).toContain('data-tratamiento="generico"');
    expect(p).toContain('data-tratamiento="lumina-face"');
    for (const n of ["US$ 180", "US$ 50", "US$ 500", "US$ 2.500", "US$ 2.000", "40 veces"]) expect(p).toContain(n);
    expect(p).toContain("valores de referencia");
  });

  test("M: del creativo al tratamiento, en dólares", () => {
    const m = slide("pmfc-m");
    expect(m).toContain("data-embudo");
    for (const paso of ["creativo", "clic", "evaluacion", "tratamiento"]) expect(m).toContain(`data-paso="${paso}"`);
    // Nohely, 22-oct-2026: sin la tabla del administrador de anuncios; solo lo que cuesta una venta y lo que paga el paciente.
    expect(m).not.toContain("data-admin");
    // Ricardo, 22-oct-2026: lenguaje simple para doctores; sin jerga de agencia.
    expect(texto(m)).not.toMatch(/CPA|puja|\blead\b|SQL|conversión|película/i);
    expect(m).not.toMatch(/\$63\.405|\$34\.814|pesos chilenos/);
    for (const n of ["US$ 55", "US$ 98", "US$ 78", "US$ 2.250", "US$ 2.449"]) expect(m).toContain(n);
    expect(m).toContain("data-pelicula");
    // Ricardo, 22-oct-2026: ejemplo chico, más fácil de imaginar para un doctor.
    expect(m).toContain("US$&nbsp;500");
    expect(m).toContain("US$&nbsp;10.000");
    expect(m).toContain("20 veces");
    expect(m).not.toContain("US$ 220.000");
  });

  test("F y C: framework con foto; Clinera con la IA agendando, el software y cómo funciona todo junto", () => {
    const f = slide("pmfc-f"), c = slide("pmfc-c");
    // Nohely, 22-oct-2026: «Framework comercial» no se entiende; se dice «Capacitación de ventas».
    expect(f).toContain("Capacitación de ventas");
    expect(texto(f)).not.toContain("Framework");
    expect(f).toContain("framework-consulta.webp");
    // Animación: campaña → AURA en WhatsApp → cita en Clinera → paciente con ficha de evaluación facial.
    expect(c).toContain("data-agenda-ia");
    for (const paso of ["campana", "chat", "agenda", "ficha"]) expect(c).toContain(`data-ca="${paso}"`);
    expect(c).toContain("Ficha de evaluación facial");
    for (const x of ["Agenda", "Fichas", "Cobros", "AURA", "CAMILA", "LIA"]) expect(c).toContain(x);
    expect(texto(c)).not.toMatch(/Webhooks|API|FHIR|Roadmap|\blead\b/);
    expect(c).toContain('data-eco="software"');
    expect(c).toContain("Cómo funcionan juntos");
    expect(c).toContain("Ya disponible");
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
    expect(vortex).toContain("~933 conversaciones");
    expect(vortex).not.toContain("créditos");
    for (const t of ["Campañas de performance en Facebook, Instagram y Google", "Propuesta de valor", "Capacitación de ventas"]) {
      expect(ecosistema).toContain(t);
      expect(vortex).not.toContain(t);
    }
    expect(c).not.toContain("Promoción del mes");
    expect(c).not.toContain("Implementación gratis");
    expect(c).not.toContain("USD 450");
    expect(c).toContain("Sin costo de implementación");
    expect(c).toContain("onboarding dedicado con un ejecutivo humano en ambos planes");
  });
});
