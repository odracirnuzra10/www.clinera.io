import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CLINERA_PLANS } from "../src/content/pricing";

/**
 * /presentacion son 3 diapositivas (Ricardo, 7-oct-2026): quiénes somos,
 * funciones Clinera y planes con el detalle. No reponer las 13 anteriores:
 * el deck es breve a propósito. El HTML duplica números porque no importa TS.
 */
const html = readFileSync(join(process.cwd(), "public/presentacion/index.html"), "utf8");

const slide = (id: string) => {
  const start = html.indexOf(`id="${id}"`);
  return html.slice(start, html.indexOf("</section>", start));
};

test.describe("/presentacion en 3 diapositivas", () => {
  test("solo existen quiénes somos, funciones Clinera y planes, en ese orden", () => {
    const ids = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toEqual(["quienes-somos", "funciones", "planes"]);
  });

  test("quiénes somos cuenta la historia: 2017, más de 1.500 clínicas, Clinera 2025", () => {
    const c = slide("quienes-somos");
    expect(c).toContain("2017");
    expect(c).toContain("Más de 1.500 clínicas");
    expect(c).toContain("ninguno satisfacía");
    expect(c).toContain("Oct 2025");
  });

  test("funciones Clinera: funciones e IA; CAMILA y LIA siguen como próximamente", () => {
    const c = slide("funciones");
    for (const f of ["Agenda", "Fichas", "Pagos", "Marketing", "Clinera Intelligence", "AURA", "CAMILA", "LIA"]) {
      expect(c).toContain(f);
    }
    expect(c).toContain("En vivo");
    expect(c.match(/Oct 2026/g)).toHaveLength(2);
    expect(c).not.toMatch(/open\s*factura/i);
  });

  test("planes: canales por plan con logos, voz solo en Summit", () => {
    const c = slide("planes");
    const card = (name: string) => {
      const i = c.indexOf(`<h3 class="px-name">${name}</h3>`);
      const j = c.indexOf("</article>", i);
      return c.slice(i, j);
    };
    const vortex = card("Vortex");
    const atlas = card("Atlas");
    const summit = card("Summit");
    expect(vortex).toContain("#ch-wa");
    expect(vortex).not.toContain("#ch-fb");
    expect(vortex).not.toContain("#ch-ig");
    expect(atlas).toContain("#ch-fb");
    expect(atlas).toContain("#ch-ig");
    expect(atlas).not.toContain("#ch-tel");
    expect(summit).toContain("#ch-tel");
    for (const plan of CLINERA_PLANS) {
      expect(c).toContain(`${plan.credits.toLocaleString("es-CL")} créditos/mes`);
      expect(c).toContain(`${plan.users} usuarios`);
    }
  });
});
