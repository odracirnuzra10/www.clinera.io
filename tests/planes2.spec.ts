import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import {
  PENDIENTES,
  PLANS_2,
  PLANES2_FAQ,
  GO_FAQ,
  ULTRA,
  IMPLEMENTACION_USD,
  GO,
  GO_LANDING_CTA,
  GO_WIZARD,
  GO_PRUEBA_SOCIAL,
  EXTRA_PROFESSIONAL_USD,
  EXTRA_CONVERSATIONS_USD,
  EXTRA_CONVERSATIONS_PACK,
  EXTRA_CREDITS_USD,
  EXTRA_CREDITS_PACK,
  SOPORTE_WHATSAPP_URL,
  soporteWhatsAppUrl,
  ULTRA_DEMO_URL,
} from "../src/content/planes2";
import { buildRobotsTxt } from "../src/lib/robots-txt";

// /planes2 y /go son vista previa interna (Ricardo, 17-oct-2026): no reemplazan
// a /planes hasta que él apruebe.
test.describe("planes2 / go: modelo Go! – Flux – Ultra", () => {
  test("sin costo de implementación: no aparece USD 450 en los planes nuevos", () => {
    const copy = JSON.stringify([PLANS_2, PLANES2_FAQ, GO_FAQ]);
    expect(copy).not.toMatch(/\b450\b/);
    expect(IMPLEMENTACION_USD).toBe(0);
    for (const f of ["src/components/planes2/Planes2Body.tsx", "src/components/go/GoWizard.tsx"]) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(/SETUP_FEE|\b450\b/);
    }
  });

  test("precios y límites decididos el 17-oct", () => {
    expect(PLANS_2.map((p) => [p.name, p.monthlyUsd, p.professionals, p.branches, p.conversations, p.agendamientos, p.credits])).toEqual([
      ["Clinera Go!", 17, 1, 1, 50, 100, 100],
      ["Clinera Flux", 89, 3, null, 500, null, 200],
      ["Clinera Ultra", 179, 10, null, 5000, null, 10000],
    ]);
  });

  test("AURA y onboarding dedicado solo en Ultra", () => {
    expect(PLANS_2.filter((p) => p.aura).map((p) => p.id)).toEqual(["ultra"]);
    expect(PLANS_2.filter((p) => p.onboarding).map((p) => p.id)).toEqual(["ultra"]);
    for (const p of PLANS_2.filter((p) => !p.aura)) {
      expect(p.excluded.join(" ")).toContain("AURA");
      expect(p.excluded.join(" ")).toContain("Onboarding dedicado");
    }
  });

  test("automatizaciones y difusiones: Flux y Ultra; Go! las muestra tachadas", () => {
    expect(GO.excluded).toEqual(expect.arrayContaining(["Automatizaciones", "Difusiones"]));
    for (const p of PLANS_2.slice(1)) {
      expect(p.features.join(" ")).toMatch(/Automatizaciones|Todo lo de Flux/);
    }
  });

  test("Ultra muestra los modelos de IA; los logos quedan como PENDIENTE", () => {
    expect(ULTRA.models).toEqual(["Anthropic", "Z.ai", "Gemini (Google)", "OpenAI"]);
    expect(PLANS_2.filter((p) => p.models.length).map((p) => p.id)).toEqual(["ultra"]);
    expect(readFileSync("src/components/planes2/Planes2Body.tsx", "utf8")).toContain("LOGOS_MODELOS_PENDIENTE");
  });

  test("solo Go! tiene link de Stripe; Flux y Ultra quedan PENDIENTE (los links viejos 87 y 279 no se reutilizan)", () => {
    expect(PLANS_2.map((p) => p.checkoutUrl)).toEqual(["https://buy.stripe.com/bJeaEZbtf8aC5gD3JN1441G", null, null]);
    const src = readFileSync("src/content/planes2.ts", "utf8");
    expect(src).not.toContain("cNibJ37cZ2QifVh3JN1441H\"");
    expect(src).not.toContain("cNi00ldBnduW24r8031441I\"");
    expect(PENDIENTES.join(" ")).toContain("Flux (USD 89/mes) y de Ultra (USD 179/mes)");
  });

  test("créditos IA: Go! 100, Flux 200, Ultra 10.000", () => {
    expect(PLANS_2.map((p) => p.features.find((f) => /créditos IA/.test(f)))).toEqual([
      "100 créditos IA",
      "200 créditos IA",
      "10.000 créditos IA",
    ]);
  });

  test("el límite se expresa en conversaciones, nunca en mensajes", () => {
    const copy = JSON.stringify([PLANS_2.map((p) => p.features), PLANES2_FAQ, GO_FAQ, GO_WIZARD]);
    expect(copy).toMatch(/conversaciones/);
    expect(copy).not.toMatch(/\d+ mensajes|hasta [\d.]+ mensajes/i);
  });

  test("extras: profesional 9, 100 conversaciones 15, 5.000 créditos 15; sin sucursal extra", () => {
    expect([EXTRA_PROFESSIONAL_USD, EXTRA_CONVERSATIONS_USD, EXTRA_CONVERSATIONS_PACK, EXTRA_CREDITS_USD, EXTRA_CREDITS_PACK]).toEqual([9, 15, 100, 15, 5000]);
    const body = readFileSync("src/components/planes2/Planes2Body.tsx", "utf8");
    expect(body).not.toMatch(/Sucursal extra|EXTRA_BRANCH/);
    expect(JSON.stringify([PLANES2_FAQ, GO_FAQ])).not.toMatch(/sucursal extra/i);
  });

  test("Atlas, Summit, Vortex, Kimi y modos viejos no reaparecen en el copy", () => {
    const copy = JSON.stringify([PLANS_2, PLANES2_FAQ, GO_FAQ]);
    expect(copy).not.toMatch(/\bAtlas\b|\bSummit\b|\bVortex\b|Kimi|Agentic Pro|Eficiente/);
  });

  test("sin voseo", () => {
    const copy = JSON.stringify([PLANS_2, PLANES2_FAQ, GO_FAQ, GO_WIZARD]);
    expect(copy).not.toMatch(/\b(agendá|empezá|conectá|escribinos|tenés|podés|activá|probá)\b/i);
  });

  test("/go/exito lleva a WhatsApp de soporte para activar", () => {
    expect(SOPORTE_WHATSAPP_URL).toMatch(/^https:\/\/wa\.me\/56985581524\?text=/);
    const src = readFileSync("src/components/go/GoExito.tsx", "utf8");
    expect(src).toContain("SOPORTE_WHATSAPP_URL");
    expect(src).not.toMatch(/Pendiente/);
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

test("/planes2: línea «¿Ya eres cliente?», demo de Ultra con la query de ventas y sin link de soporte inventado", () => {
  const body = readFileSync("src/components/planes2/Planes2Body.tsx", "utf8");
  expect(body).toContain("YA_ERES_CLIENTE");
  expect(body).toContain("SOPORTE_LINK_PENDIENTE");
  expect(ULTRA_DEMO_URL).toBe("https://www.clinera.io/agenda?plan=ultra");
  expect(body).toContain("ULTRA_DEMO_URL");
});

test("/go es un wizard de 3 pantallas: oferta, datos y pago", () => {
  const go = readFileSync("src/components/go/GoWizard.tsx", "utf8");
  expect(GO_WIZARD.ofertaTitulo).toBe("Potencia tu clínica por solo $17 dólares.");
  expect(go).toContain("Potencia tu clínica por solo");
  expect(go).toContain("dólares.");
  expect(GO_WIZARD.ofertaTexto).toContain("50 conversaciones");
  expect(GO_WIZARD.ofertaTexto).toContain("100 agendamientos");
  expect(GO_LANDING_CTA).toBe("Sí, quiero activarla");
  expect(go).toContain('data-go-step="1"');
  expect(go).toContain('data-go-step="2"');
  expect(go).toContain('data-go-step="3"');
  expect(go).toContain('role="progressbar"');
  expect(go).toContain("← Atrás");
  expect(GO_WIZARD.pagoCta).toBe("Pagar USD 17");
});

test("/go: los datos se guardan ANTES del pago (mismo webhook de /agenda) y la pantalla 3 no espera a n8n", () => {
  const go = readFileSync("src/components/go/GoWizard.tsx", "utf8");
  expect(go).toContain("submitContactLead");
  expect(go).toContain('sourcePath: "/go"');
  expect(go).toContain('plan: "go"');
  // goTo(3) va antes del submit: un webhook colgado no puede perder una compra.
  expect(go.indexOf("goTo(3)")).toBeLessThan(go.indexOf("void submitContactLead"));
  // Dental sigue fuera (pendiente de ventas), igual que en /agenda.
  expect(go).not.toMatch(/id: "dental"/i);
});

test("/go: los datos del wizard viajan a Stripe (handoff) y el Payment Link queda de respaldo", () => {
  const go = readFileSync("src/components/go/GoWizard.tsx", "utf8");
  const ruta = readFileSync("src/app/api/go/checkout/route.ts", "utf8");
  // Pantalla 3: el botón sigue siendo un enlace a buy.stripe.com (Analytics cuenta el clic y arma el
  // client_reference_id de 7 segmentos «::»), pero `pagar` pide la sesión con los datos ya cargados.
  expect(go).toContain("prefilled_email");
  expect(go).toContain("/api/go/checkout");
  expect(go).toContain("ev.preventDefault()");
  expect(go).toContain("respaldo");
  expect(go).toContain('searchParams.get("client_reference_id")');
  expect(go).toContain("ctrl.abort()");
  // Un client_reference_id propio n8n lo leería entero como gclid (no trae «::»).
  expect(go).not.toContain('searchParams.set("client_reference_id"');
  expect(go).not.toMatch(/"InitiateCheckout"|"initiate_checkout"/);
  // El botón de pago nace en la pantalla 3: hay que avisarle a Analytics que lo enganche.
  expect(go).toContain('new Event("clinera:routechange")');
  expect(go).toContain('data-plan="go"');
  // La ruta: Customer con nombre/celular/correo + sesión sobre ese Customer.
  expect(ruta).toContain("stripe.customers.list");
  expect(ruta).toContain("name: nombre");
  expect(ruta).toContain("phone: celular");
  expect(ruta).toContain("customer: cliente.id");
  expect(ruta).toContain("GO_STRIPE_PRICE_ID");
  expect(ruta).toContain("{CHECKOUT_SESSION_ID}");
  expect(ruta).toContain("allow_promotion_codes: true");
  expect(ruta).toContain("client_reference_id");
  expect(ruta).toContain("emailValido");
  expect(ruta).toContain("telefonoValido");
  // Sin llave o con error de Stripe responde fallo y el navegador cae al Payment Link.
  expect(ruta).toContain('fallo("not_configured", 503)');
  expect(ruta).toContain('fallo("stripe", 502)');
});

test("/go: el wizard dispara MQL (pixel nuevo) al completar los datos; TRIAL al pagar; CLIENTE para Flux y Ultra", () => {
  const go = readFileSync("src/components/go/GoWizard.tsx", "utf8");
  expect(go).toContain("fireMqlEvent");
  expect(go).toContain("const MQL_GO_USD = 1;");
  expect(go).toContain("value: MQL_GO_USD");
  expect(readFileSync("src/lib/metaEvents.ts", "utf8")).toContain("opts.value ?? 10");
  expect(go).toContain("contact: { email: email.trim(), phoneE164:");
  expect(readFileSync("src/lib/meta-pixel-id.ts", "utf8")).toContain("2251201709002818");
  const exito = readFileSync("src/components/go/GoExito.tsx", "utf8");
  expect(exito).toContain('"TRIAL"');
  expect(readFileSync("src/lib/meta-purchase.ts", "utf8")).toContain('CLIENTE_EVENT_NAME = "CLIENTE"');
});

test("/go/exito: el mensaje a soporte lleva el correo con el que contrató y conserva el comienzo que reconoce AURA", () => {
  const con = decodeURIComponent(soporteWhatsAppUrl("camila@clinica.cl").split("text=")[1]);
  expect(con).toBe("Hola, acabo de contratar Clinera Go! y quiero activar el WhatsApp de mi clínica. Mi correo es camila@clinica.cl.");
  // Sin correo es el mensaje de siempre; con correo empieza igual (la regla de AURA lo reconoce por el comienzo).
  expect(soporteWhatsAppUrl()).toBe(SOPORTE_WHATSAPP_URL);
  expect(soporteWhatsAppUrl("  ")).toBe(SOPORTE_WHATSAPP_URL);
  expect(con.startsWith(decodeURIComponent(SOPORTE_WHATSAPP_URL.split("text=")[1]))).toBe(true);
  expect(soporteWhatsAppUrl("a@b.cl")).toMatch(/^https:\/\/wa\.me\/56985581524\?text=/);
  const exito = readFileSync("src/components/go/GoExito.tsx", "utf8");
  expect(exito).toContain("/api/go/session");
  expect(exito).toContain("GO_EMAIL_KEY");
  expect(exito).toContain("href={whatsappUrl}");
  expect(readFileSync("src/components/go/GoWizard.tsx", "utf8")).toContain("GO_EMAIL_KEY");
  // La ruta solo devuelve el correo de una sesión completada y valida el formato del id.
  const ruta = readFileSync("src/app/api/go/session/route.ts", "utf8");
  expect(ruta).toContain('sesion.status !== "complete"');
  expect(ruta).toContain("cs_(live|test)_");
  expect(ruta).toContain('"Cache-Control": "no-store"');
});

test("/go: cancelar cuando quiera y SIN salidas a ventas: la idea es que pague USD 17 para probar (Ricardo, 17-oct)", () => {
  const go = readFileSync("src/components/go/GoWizard.tsx", "utf8");
  expect(go).toContain("cancelar cuando quieras");
  expect(go).not.toMatch(/AGENDA_PATH|ULTRA_DEMO_URL|data-cta-agendar|hablar con ventas|agenda una reuni|prefieres hablarlo/i);
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

test("/go: solo el wizard y la animación de la IA agendando, con «Respaldado por» (sin FAQ, sin reproductor ni imagen de CNN)", () => {
  const go = readFileSync("src/components/go/GoWizard.tsx", "utf8");
  expect(GO_PRUEBA_SOCIAL).toBe("Clinera ya lo usan más de 1.000 clínicas en Chile");
  expect(go).toContain("DemoIACompact");
  expect(go).not.toMatch(/<iframe|GoFaq|GO_FAQ|PARTNER_CNN_VIMEO_SRC|cnn-clinera\.jpg/);
  // Un <main> anidado activaba `main > section:first-child { padding-top: 112px }` de globals.css.
  expect(go).not.toContain("<main");
});

test("/go: sin navbar ni footer; los flotantes del sitio no se apilan con el wizard", () => {
  const page = readFileSync("src/app/go/page.tsx", "utf8");
  expect(page).not.toContain("<NavV3");
  expect(page).not.toContain("FooterV3");
  expect(readFileSync("src/components/go/GoWizard.tsx", "utf8")).toContain("Wordmark");
  expect(readFileSync("src/components/cro/StickyMobileCTA.tsx", "utf8")).toContain('"/go"');
  expect(readFileSync("src/components/demo/VerDemoFloat.tsx", "utf8")).toContain('"/go"');
});

test("/planes2: el CTA de Go! dice Contrata y lleva a /go", () => {
  expect(GO.ctaLabel).toBe("Contrata");
  const body = readFileSync("src/components/planes2/Planes2Body.tsx", "utf8");
  expect(body).toContain('href="/go"');
});

test("el clic de compra se cuenta una sola vez: lo hace el rastreador global de Analytics", () => {
  const go = readFileSync("src/components/go/GoWizard.tsx", "utf8");
  const planes = readFileSync("src/components/planes2/Planes2Body.tsx", "utf8");
  const analytics = readFileSync("src/components/Analytics.tsx", "utf8");
  // Analytics escucha todo buy.stripe.com y arma el client_reference_id para n8n.
  expect(analytics).toContain("buy.stripe.com");
  expect(analytics).toContain("client_reference_id");
  for (const [nombre, src] of [["GoWizard", go], ["Planes2Body", planes]] as const) {
    expect(src, nombre).not.toContain('"InitiateCheckout"');
    expect(src, nombre).not.toContain('"initiate_checkout"');
    expect(src, nombre).not.toContain("withStripeAttribution");
  }
  expect(go).toContain("data-plan-value={GO_ANALYTICS.valueUsd}");
  expect(planes).toContain("data-plan-value={plan.monthlyUsd}");
});

test("clinera.io: el CTA principal del header es «Hablar con ventas» → /agenda (Ricardo, 18-oct-2026)", () => {
  const nav = readFileSync("src/components/brand-v3/Nav.tsx", "utf8");
  expect(nav).toContain('DEFAULT_CTA_LABEL = "Hablar con ventas"');
  expect(nav).toContain('DEFAULT_CTA_HREF = "/agenda"');
  // Ya no se promueve /go desde el header.
  expect(nav).not.toContain('DEFAULT_CTA_HREF = "/go"');
  // Las páginas que pasan su propio CTA (Google Ads → /agenda) no cambian.
  expect(readFileSync("src/components/software-vertical/SoftwareVerticalLanding.tsx", "utf8")).toContain('ctaLabel="Agendar demo"');
});

test("/go: la FAQ explica los tres planes sin marcadores ni datos viejos", () => {
  const preguntas = GO_FAQ.map((f) => f.q).join(" | ");
  for (const q of ["¿Cuáles son los planes?", "¿Qué incluye Clinera Go!?", "¿Qué incluye Clinera Flux?", "¿Qué incluye Clinera Ultra?"]) {
    expect(preguntas).toContain(q);
  }
  const todo = JSON.stringify(GO_FAQ);
  expect(todo).not.toContain("PENDIENTE");
  expect(todo).toContain("USD 17");
  expect(todo).toContain("USD 89");
  expect(todo).toContain("USD 179");
  expect(todo).toContain("100 créditos IA");
  expect(todo).toContain("200 créditos IA");
  expect(todo).toContain("10.000 créditos IA");
  // Go! y Flux no incluyen AURA: la FAQ no puede insinuar lo contrario.
  expect(GO_FAQ.find((f) => f.q === "¿Qué incluye Clinera Go!?")!.a).toContain("No incluye AURA");
  expect(GO_FAQ.find((f) => f.q === "¿Qué incluye Clinera Flux?")!.a).toContain("No incluye AURA");
});
