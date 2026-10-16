import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { PENDIENTES, PLANS_2, PLANES2_FAQ, GO_FAQ, VORTEX_2, IMPLEMENTACION_USD, EXTRA_BRANCH_USD } from "../src/content/planes2";
import { EXTRA_USER_USD, EXTRA_CREDIT_PACK_USD, EXTRA_CREDIT_PACK_CREDITS } from "../src/content/pricing";
import { buildRobotsTxt } from "../src/lib/robots-txt";

// /planes2 y /go son vista previa interna (Ricardo, 16-oct-2026): no reemplazan
// a /planes hasta que él apruebe.
test.describe("planes2 / go: modelo Go! – Flux – Vortex", () => {
  test("sin costo de implementación: no aparece USD 450 en los planes nuevos", () => {
    const copy = JSON.stringify([PLANS_2, PLANES2_FAQ, GO_FAQ]);
    expect(copy).not.toMatch(/\b450\b/);
    expect(IMPLEMENTACION_USD).toBe(0);
    for (const f of ["src/components/planes2/Planes2Body.tsx", "src/components/go/GoLanding.tsx"]) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(/SETUP_FEE|\b450\b/);
    }
  });

  test("precios y límites decididos el 16-oct", () => {
    expect(PLANS_2.map((p) => [p.name, p.monthlyUsd, p.branches, p.professionals])).toEqual([
      ["Clinera Go!", 17, 1, 1],
      ["Clinera Flux", 87, 2, 5],
      ["Clinera Vortex", 279, 3, 10],
    ]);
  });

  test("AURA solo en Vortex", () => {
    expect(PLANS_2.filter((p) => p.aura).map((p) => p.id)).toEqual(["vortex"]);
    for (const p of PLANS_2.filter((p) => !p.aura)) {
      expect(p.excluded.join(" ")).toContain("AURA");
    }
  });

  test("links de Stripe de los planes nuevos; no se reutiliza el del Vortex viejo", () => {
    expect(PLANS_2.map((p) => p.checkoutUrl)).toEqual([
      "https://buy.stripe.com/bJeaEZbtf8aC5gD3JN1441G",
      "https://buy.stripe.com/cNibJ37cZ2QifVh3JN1441H",
      "https://buy.stripe.com/cNi00ldBnduW24r8031441I",
    ]);
    expect(VORTEX_2.checkoutUrl).not.toContain("471441A");
  });

  test("créditos IA: Go! 100, Flux 200, Vortex 28.000", () => {
    expect(PLANS_2.map((p) => p.features.find((f) => /créditos IA/.test(f)))).toEqual([
      "100 créditos IA",
      "200 créditos IA",
      "28.000 créditos IA",
    ]);
  });

  test("Atlas, Summit, Kimi y modos viejos no reaparecen en el copy", () => {
    const copy = JSON.stringify([PLANS_2, PLANES2_FAQ, GO_FAQ]);
    expect(copy).not.toMatch(/\bAtlas\b|\bSummit\b|Kimi|Agentic Pro|Eficiente/);
  });

  test("sin voseo", () => {
    const copy = JSON.stringify([PLANS_2, PLANES2_FAQ, GO_FAQ]);
    expect(copy).not.toMatch(/\b(agendá|empezá|conectá|escribinos|tenés|podés)\b/i);
  });

  test("los datos abiertos quedan listados como PENDIENTE", () => {
    expect(PENDIENTES.length).toBeGreaterThan(5);
  });

  test("las rutas son noindex y están cerradas en robots.txt", () => {
    for (const f of ["src/app/planes2/page.tsx", "src/app/go/page.tsx", "src/app/go/exito/page.tsx"]) {
      expect(readFileSync(f, "utf8"), f).toContain("index: false");
    }
    const txt = buildRobotsTxt();
    for (const r of ["/planes2", "/go$", "/go/"]) expect(txt).toContain(`Disallow: ${r}`);
  });

  test("fuera del sitemap", () => {
    const sm = readFileSync("src/app/sitemap.ts", "utf8");
    expect(sm).not.toMatch(/['"]\/planes2['"]|['"]\/go['"]/);
  });
});

test("add-ons confirmados por Ricardo (16-oct): sucursal 15, profesional 9, 5.000 créditos 15", () => {
  expect([EXTRA_BRANCH_USD, EXTRA_USER_USD, EXTRA_CREDIT_PACK_USD, EXTRA_CREDIT_PACK_CREDITS]).toEqual([15, 9, 15, 5000]);
  expect(JSON.stringify(PLANES2_FAQ)).not.toMatch(/PENDIENTE: confirmar si (aplica|la recarga)/);
});

test("/go: cancelar cuando quiera y salida a /agenda con la query de la visita", () => {
  const go = readFileSync("src/components/go/GoLanding.tsx", "utf8");
  expect(go).toContain("cancelas cuando quieras");
  expect(go).toContain("AGENDA_PATH");
  expect(go).toContain("window.location.search");
  for (const f of [...PLANES2_FAQ, ...GO_FAQ].filter((x) => /permanencia|cancelar/i.test(x.q))) {
    expect(f.a, f.q).not.toContain("PENDIENTE");
  }
});

test("/agenda muestra los precios nuevos, no los de los planes viejos", () => {
  const ag = readFileSync("src/components/ventas/AgendaHebeLanding.tsx", "utf8");
  expect(ag).toContain("PLANS_2");
  expect(ag).not.toMatch(/CLINERA_PLANS\[0\]\.monthlyPrice/);
});

test("/planes2 solo en dólares: sin switch ni conversión a MXN", () => {
  const body = readFileSync("src/components/planes2/Planes2Body.tsx", "utf8");
  expect(body).not.toMatch(/PriceModalitySwitch|CatalogPrice|usePriceModality|MXN/);
});
