import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Ricardo, 22-oct-2026: dos decks. /presentacion-facil (= /presentacion) es para doctores
 * que no saben de marketing; /presentacion-tecnica es la versión con jerga y números de
 * campaña (ROAS, CPA, costo por lead, administrador de anuncios) para quien sí los entiende.
 */
const tecnica = readFileSync(join(process.cwd(), "public/presentacion-tecnica/index.html"), "utf8");
const slide = (id: string) => {
  const i = tecnica.indexOf(`id="${id}"`);
  return tecnica.slice(i, tecnica.indexOf("</section>", i));
};

test.describe("/presentacion-tecnica y /presentacion-facil", () => {
  test("la técnica tiene las 8 diapos, sin Exposalud", () => {
    const ids = [...tecnica.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toEqual(["quienes-somos", "problema", "pmfc-p", "pmfc-m", "pmfc-f", "pmfc-c", "beneficios", "planes"]);
    expect(tecnica).not.toMatch(/xposalud/);
    expect(tecnica).toContain('href="https://www.clinera.io/presentacion-tecnica"');
    expect(tecnica).toContain('content="noindex,nofollow"');
  });

  test("la técnica habla de ROAS, CPA y costo por lead", () => {
    const m = slide("pmfc-m");
    expect(m).toContain("ROAS 6,3x");
    expect(m).toContain("ROAS 23x");
    expect(m).toContain("ROAS 31x");
    expect(m).toContain("CPA objetivo");
    expect(m).toContain("Costo por lead");
    expect(m).toContain("data-admin");
    expect(slide("pmfc-f")).toContain("Framework comercial");
  });

  test("las dos rutas responden y no son la misma página", async ({ request }) => {
    const facil = await request.get("/presentacion-facil");
    const tec = await request.get("/presentacion-tecnica");
    expect(facil.status()).toBe(200);
    expect(tec.status()).toBe(200);
    expect(await facil.text()).toContain("PASO 1 DE 4");
    expect(await tec.text()).toContain("ROAS 6,3x");
  });
});
