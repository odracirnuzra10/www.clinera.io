import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { PENDIENTES, PLANS_2, PLANES2_FAQ, GO_FAQ, VORTEX_2, IMPLEMENTACION_USD, GO, GO_LANDING_CTA, EXTRA_BRANCH_USD } from "../src/content/planes2";
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
  expect(go).toContain("Cancela cuando quieras");
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

test("/go trae el video de CNN (mismo clip que /plataforma)", () => {
  const go = readFileSync("src/components/go/GoLanding.tsx", "utf8");
  expect(go).toContain("PARTNER_CNN_VIMEO_SRC");
  expect(go).toContain("Reportaje de CNN sobre Clinera");
  expect(readFileSync("src/lib/partners.ts", "utf8")).toContain("player.vimeo.com/video/1205127087");
});

test("/go: un solo CTA \"Inicia ahora\" (hero, final y flotante) y ventas queda discreto", () => {
  const go = readFileSync("src/components/go/GoLanding.tsx", "utf8");
  expect(GO_LANDING_CTA).toBe("Inicia ahora");
  expect(go).toContain("FloatingCta");
  expect(go).toContain('where="floating"');
  // Landing sin navbar: el logo va dentro del hero y no hay otra salida que el CTA.
  const page = readFileSync("src/app/go/page.tsx", "utf8");
  expect(page).not.toContain("<NavV3");
  expect(go).toContain("Wordmark");
  expect(go).toContain("#0A0A14");
  // Los flotantes del sitio no se apilan con el de /go.
  expect(readFileSync("src/components/cro/StickyMobileCTA.tsx", "utf8")).toContain('"/go"');
  expect(readFileSync("src/components/demo/VerDemoFloat.tsx", "utf8")).toContain('"/go"');
});

test("/planes2: el CTA de Go! dice Contrata y lleva a /go", () => {
  expect(GO.ctaLabel).toBe("Contrata");
  const body = readFileSync("src/components/planes2/Planes2Body.tsx", "utf8");
  expect(body).toContain('href="/go"');
});

test("el clic de compra se cuenta una sola vez: lo hace el rastreador global de Analytics", () => {
  const go = readFileSync("src/components/go/GoLanding.tsx", "utf8");
  const planes = readFileSync("src/components/planes2/Planes2Body.tsx", "utf8");
  const analytics = readFileSync("src/components/Analytics.tsx", "utf8");
  // Analytics escucha todo buy.stripe.com y arma el client_reference_id para n8n.
  expect(analytics).toContain("buy.stripe.com");
  expect(analytics).toContain("client_reference_id");
  for (const [nombre, src] of [["GoLanding", go], ["Planes2Body", planes]] as const) {
    expect(src, nombre).not.toContain('"InitiateCheckout"');
    expect(src, nombre).not.toContain('"initiate_checkout"');
    expect(src, nombre).not.toContain("withStripeAttribution");
  }
  expect(go).toContain("data-plan-value={GO_ANALYTICS.valueUsd}");
  expect(planes).toContain("data-plan-value={plan.monthlyUsd}");
});

test("clinera.io: el CTA principal del header es «Iniciar ahora» → /go, y ventas queda discreto", () => {
  const nav = readFileSync("src/components/brand-v3/Nav.tsx", "utf8");
  expect(nav).toContain('DEFAULT_CTA_LABEL = "Iniciar ahora"');
  expect(nav).toContain('DEFAULT_CTA_HREF = "/go"');
  // «Hablar con ventas» sigue, pero como enlace discreto (QuietCta), no como botón principal.
  expect(nav).toContain('label="Hablar con ventas"');
  expect(nav).not.toMatch(/ctaLabel = "Hablar con ventas"/);
  // Una página que pasa solo ctaHref (/plataforma → /agenda) no hereda «Iniciar ahora».
  expect(nav).toContain('ctaHref === undefined ? DEFAULT_CTA_LABEL : "Hablar con ventas"');
  // Las páginas que pasan su propio CTA (Google Ads → /agenda) no cambian.
  expect(readFileSync("src/components/software-vertical/SoftwareVerticalLanding.tsx", "utf8")).toContain('ctaLabel="Agendar demo"');
});
