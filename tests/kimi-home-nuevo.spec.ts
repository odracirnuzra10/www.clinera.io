import { expect, test } from "@playwright/test";

const HEADLINE = "La plataforma médica con IA que transforma leads en pacientes con evaluaciones pagadas";

for (const ruta of ["/kimi", "/home-nuevo"]) {
  test.describe(ruta, () => {
    test("el titular es exactamente la frase nueva", async ({ page }) => {
      await page.goto(ruta, { waitUntil: "domcontentloaded" });
      const texto = (await page.locator("h1").innerText()).replace(/\s+/g, " ").trim();
      expect(texto).toBe(HEADLINE);
      await expect(page).toHaveTitle(new RegExp(HEADLINE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    });

    test("Contratar lleva a /contrata con la atribución de la visita", async ({ page }) => {
      test.skip(ruta === "/kimi", "en /kimi el carrito vive en la misma página");
      await page.goto(`${ruta}?utm_source=t&gclid=g`, { waitUntil: "domcontentloaded" });
      const links = page.locator("a[data-contrata-link]");
      const n = await links.count();
      expect(n).toBeGreaterThan(0);
      for (let i = 0; i < n; i++) {
        const a = links.nth(i);
        await expect(a).toHaveAttribute("data-cta", /.+/);
        await expect(a).toHaveAttribute("data-plan", "Flux");
        const href = await a.getAttribute("href");
        expect(href).toContain("/contrata");
        expect(href).toContain("utm_source=t");
        expect(href).toContain("gclid=g");
        expect(href).not.toMatch(/plan=(hex|vortex)/);
      }
    });

    test("la foto de Hebe es el placeholder con el texto limpio", async ({ page }) => {
      await page.goto(ruta, { waitUntil: "domcontentloaded" });
      await expect(page.locator("[data-testid=hebe-testimonio] img")).toHaveAttribute(
        "alt",
        "Clínicas de Método Hebe en Vitacura, Concón y Los Ángeles",
      );
    });

    test("muestra Flux y los adicionales, sin Hex ni Vortex", async ({ page }) => {
      await page.goto(ruta, { waitUntil: "domcontentloaded" });
      const flux = page.locator("[data-testid=plan-flux]");
      if (ruta === "/kimi") {
        await expect(flux).toContainText("$14.495");
        await expect(flux).toContainText("$78.990");
        await expect(flux).toContainText("500 conversaciones");
        await expect(flux).toContainText("10 profesionales");
        await expect(flux).not.toContainText("USD");
        await expect(flux).not.toContainText("Agente IA");
      } else {
        await expect(flux).toContainText("USD");
        await expect(flux).toContainText("29");
        await expect(flux).toContainText("Clinera Intelligence");
        await expect(flux).toContainText("100 conversaciones");
      }
      const extras = page.locator("[data-testid=plan-addons]");
      if (ruta !== "/kimi") {
      await expect(extras).toContainText("Profesional extra");
      await expect(extras).toContainText("Agente IA");
      await expect(extras).toContainText("Regalo de noviembre");
      }
      await expect(page.locator("[data-testid=plan-hex]")).toHaveCount(0);
      await expect(page.locator("[data-testid=plan-vortex]")).toHaveCount(0);
      const texto = await page.locator("main").innerText();
      expect(texto).not.toMatch(/USD 179|USD 279|Hex|Vortex/);
    });

    test("en 375 el titular no desborda", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(ruta, { waitUntil: "domcontentloaded" });
      const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(ancho).toBeLessThanOrEqual(375);
      const cabe = await page.locator("h1").evaluate((el) => el.scrollWidth <= el.clientWidth + 1);
      expect(cabe).toBe(true);
    });
  });
}

test("/kimi muestra el plano de CNN con Ricardo y el periodista", async ({ page }) => {
  await page.goto("/kimi", { waitUntil: "domcontentloaded" });
  const img = page.locator("[data-testid=kimi-cnn] img");
  await expect(img).toHaveAttribute("src", "/images/go/cnn-clinera.jpg");
  await expect(img).toHaveAttribute("alt", /periodista de Agenda Económica/);
  await expect(img).toHaveAttribute("width", "1280");
  await expect(img).toHaveAttribute("height", "720");
  await expect(page.locator("[data-testid=kimi-cnn]")).toContainText("Clinera en CNN Chile");
  await expect(page.locator("#hero-cta").getByRole("button", { name: "Crea tu cuenta por $14.495" })).toBeVisible();
});

test("/kimi vende la prueba de $14.495 y Crea tu cuenta abre el modal", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/kimi", { waitUntil: "domcontentloaded" });
  const flux = page.locator("[data-testid=plan-flux]");
  await expect(flux.locator("img")).toHaveAttribute("src", "/kimi/productos/flux.jpg");
  await expect(page.locator("#hero-cta")).toContainText("Crea tu cuenta por $14.495");
  await expect(page.locator("h1 + .sub, .hero .sub").first()).toContainText("Prueba Clinera por $14.495 por 30 días");
  await expect(page.locator("#hero-cta").getByRole("link", { name: "Solicita asistencia" })).toHaveCount(0);
  await expect(page.locator("#comenzar")).toContainText("Sin costo de implementación");
  await expect(page.locator("#comenzar").getByRole("button", { name: "Crea tu cuenta por $14.495" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Hablar con ventas" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Hablar con ventas" })).toHaveCount(0);
  await expect(page.locator("#comenzar").getByRole("link", { name: "Solicita asistencia" })).toHaveAttribute(
    "href",
    "https://wa.me/56985581524?text=necesito%20asistencia",
  );
  await expect(flux.getByRole("button", { name: "Crea tu cuenta por $14.495" })).toBeVisible();
  await expect(flux.locator("[data-prueba-incluye]")).toContainText("WhatsApp, Instagram y Facebook");
  await expect(flux).toContainText("Después de 30 días, $78.990");
  await expect(page.getByText("Vortex")).toHaveCount(0);
  await expect(page.getByText("$178.990")).toHaveCount(0);
  await expect(page.getByText("Pago online pronto")).toHaveCount(0);
  const orden = await page.evaluate(() => {
    const y = (id: string) => document.getElementById(id)?.getBoundingClientRect().top ?? 0;
    return { hero: y("top"), funciones: y("funciones"), planes: y("planes") };
  });
  expect(orden.planes).toBeGreaterThan(orden.hero);
  expect(orden.planes).toBeGreaterThan(orden.funciones);
  await page.locator("[data-carrito-icon]").click();
  const drawer = page.locator("[data-drawer]");
  await expect(drawer).toBeVisible();
  await expect(drawer.locator("[data-total-hoy]")).toContainText("$14.495");
  await expect(drawer).toContainText("Después, $78.990");
  await drawer.getByRole("button", { name: "Crea tu cuenta por $14.495" }).click();
  const modal = page.locator("[data-cuenta]");
  await expect(modal).toBeVisible();
  await expect(modal.locator("[data-cuenta-pagar]")).toHaveAttribute("href", "https://mpago.la/22dyhQr");
  await modal.locator("[data-cuenta-pagar]").click();
  await expect(modal.locator("[data-cuenta-error]")).toBeVisible();
  expect(page.url()).toContain("/kimi");
  await expect(drawer).not.toContainText("$14.000");
  await expect(drawer).not.toContainText("$28.000");
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(ancho).toBeLessThanOrEqual(1280);
  let lead: { nombre?: string; email?: string; clinica?: string; celular_digits?: string; telefono?: string } | null = null;
  await page.route("**/api/wizard", async (route) => {
    lead = route.request().postDataJSON();
    await route.fulfill({ status: 503, contentType: "application/json", body: "{}" });
  });
  await page.route("https://mpago.la/**", (route) => route.abort());
  await modal.locator("input[name=nombre]").fill("Ana Soto");
  await modal.locator("input[name=email]").fill("ana@clinica.cl");
  await modal.locator("input[name=clinica]").fill("Clínica Vela");
  await modal.locator("[data-cuenta-pagar]").click();
  await expect(modal.locator("[data-cuenta-error]")).toBeVisible();
  expect(lead).toBeNull();
  await modal.locator("input[name=celular]").fill("912345678");
  await modal.locator("[data-cuenta-pagar]").click();
  await expect.poll(() => lead?.email).toBe("ana@clinica.cl");
  expect(lead?.nombre).toBe("Ana Soto");
  expect(lead?.clinica).toBe("Clínica Vela");
  expect(lead?.celular_digits).toBe("912345678");
  expect(lead?.telefono).toBe("+56912345678");
});

test("/kimi pide los cuatro datos antes de abrir WhatsApp", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/kimi", { waitUntil: "domcontentloaded" });
  const popups: string[] = [];
  page.on("popup", (popup) => {
    popups.push(popup.url());
  });
  await page.locator("#comenzar").getByRole("link", { name: "Solicita asistencia" }).click();
  const modal = page.locator("[data-cuenta]");
  await expect(modal).toBeVisible();
  await expect(modal.locator("#cuenta-titulo")).toHaveText("Solicita asistencia");
  await expect(modal.locator("[data-asistencia-enviar]")).toBeVisible();
  await expect(modal.locator("[data-cuenta-pagar]")).toBeHidden();
  await expect(modal.locator("input[name=nombre]")).toHaveValue("");
  await modal.locator("[data-asistencia-enviar]").click();
  await expect(modal.locator("[data-cuenta-error]")).toBeVisible();
  expect(popups).toEqual([]);
  let lead: { fuente?: string; celular_digits?: string; servicio_interes_label?: string } | null = null;
  await page.route("**/api/wizard", async (route) => {
    lead = route.request().postDataJSON();
    await route.fulfill({ status: 503, contentType: "application/json", body: "{}" });
  });
  await page.route("https://wa.me/**", (route) => route.abort());
  await modal.locator("input[name=nombre]").fill("Ana Soto");
  await modal.locator("input[name=celular]").fill("912345678");
  await modal.locator("input[name=email]").fill("ana@clinica.cl");
  await modal.locator("input[name=clinica]").fill("Clínica Vela");
  const popup = page.waitForEvent("popup");
  await modal.locator("[data-asistencia-enviar]").click();
  await expect.poll(() => lead?.celular_digits).toBe("912345678");
  expect(lead?.fuente).toBe("Landing /kimi — asistencia");
  expect(lead?.servicio_interes_label).toBe("Solicita asistencia");
  const abierto = (await popup).url();
  expect(abierto).toContain("56985581524");
  expect(abierto).toContain("necesito");
});

test("en el celular la barra ofrece Crea tu cuenta por $14.495 y la asistencia aparece al final", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto("/kimi", { waitUntil: "domcontentloaded" });
  const barra = page.locator("#mobile-cta");
  await expect(barra.locator("[data-bar-label]")).toHaveText("Clinera Flux");
  await expect(barra.locator("[data-total-bar]")).toBeHidden();
  const activar = barra.getByRole("button", { name: "Crea tu cuenta por $14.495" });
  await expect(activar).toBeVisible();
  const veces = ((await barra.innerText()).match(/\$14\.495/g) ?? []).length;
  expect(veces).toBe(1);
  await expect(barra.getByRole("link", { name: "Solicita asistencia" })).toHaveCount(0);
  await page.locator("#comenzar").scrollIntoViewIfNeeded();
  await expect(barra.getByRole("link", { name: "Solicita asistencia" })).toBeVisible();
  await expect(barra).not.toContainText("$28.000");
  await expect(page.locator("[data-chip=agente_ia]")).toHaveCount(0);
});

test("en el celular el cajón cobra la prueba de $14.495 y deja el total quieto", async ({ page }) => {
  for (const ancho of [320, 390, 430]) {
    await page.setViewportSize({ width: ancho, height: 700 });
    await page.goto("/kimi", { waitUntil: "domcontentloaded" });
    const barra = page.locator("#mobile-cta");
    expect(((await barra.innerText()).match(/\$14\.495/g) ?? []).length).toBe(1);
    await page.locator("[data-carrito-icon]").click();
    const drawer = page.locator("[data-drawer]");
    await expect(drawer).toBeVisible();
    await expect(drawer.locator("[data-total-hoy]")).toContainText("$14.495");
    await expect(drawer).toContainText("Después, $78.990");
    const pagar = drawer.getByRole("button", { name: "Crea tu cuenta por $14.495" });
    await expect(pagar).toBeVisible();
    await expect(drawer).not.toContainText("No pierdas más tu tiempo");
    const enVista = await pagar.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= window.innerHeight + 1;
    });
    expect(enVista).toBe(true);
    const cerrar = await drawer.locator("[data-cerrar]").boundingBox();
    expect(cerrar?.width ?? 0).toBeGreaterThanOrEqual(44);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    const fondoQuieto = await page.evaluate(() => document.body.dataset.lock === "1");
    expect(fondoQuieto).toBe(true);
  }
});

test("el pie de /kimi enlaza Términos y Privacidad", async ({ page, request }) => {
  await page.goto("/kimi", { waitUntil: "domcontentloaded" });
  await expect(page.locator("footer a", { hasText: "Términos" })).toHaveAttribute("href", "/terminos");
  await expect(page.locator("footer a", { hasText: "Privacidad" })).toHaveAttribute("href", "/privacidad");
  expect((await request.get("/terminos")).status()).toBe(200);
  expect((await request.get("/privacidad")).status()).toBe(200);
});

test("el pie de /home-nuevo también enlaza Términos y Privacidad", async ({ page }) => {
  await page.goto("/home-nuevo", { waitUntil: "domcontentloaded" });
  const legal = page.locator("footer").getByText("Legal").locator("xpath=..");
  await expect(legal.locator("a", { hasText: "Términos" })).toHaveAttribute("href", "/terminos");
  await expect(legal.locator("a", { hasText: "Privacidad" })).toHaveAttribute("href", "/privacidad");
});

test("/kimi explica cómo funciona en cuatro pasos y ese CTA abre la cuenta", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/kimi", { waitUntil: "domcontentloaded" });
  const pasos = page.locator("[data-testid=kimi-pasos]");
  await expect(pasos.getByRole("heading", { name: "Cómo funciona Clinera" })).toBeVisible();
  const items = pasos.locator(".pasos-lista p");
  await expect(items).toHaveText([
    "Conecta tu WhatsApp",
    "Configura tus horarios, profesionales y tratamientos",
    "Activa tus campañas",
    "Tu agente IA agenda por ti",
  ]);
  const orden = await page.evaluate(() => {
    const y = (id: string) => document.getElementById(id)?.getBoundingClientRect().top ?? 0;
    return { funciones: y("funciones"), pasos: y("como-funciona"), intel: y("intelligence") };
  });
  expect(orden.pasos).toBeGreaterThan(orden.funciones);
  expect(orden.intel).toBeGreaterThan(orden.pasos);
  const cta = pasos.getByRole("button", { name: "Activa tu cuenta por $14.495 por 30 días y prueba el poder." });
  await expect(cta).toBeVisible();
  const caja = await cta.boundingBox();
  expect(caja?.height ?? 0).toBeGreaterThanOrEqual(48);
  const font = await cta.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(font).toBeGreaterThanOrEqual(16);
  await cta.click();
  const modal = page.locator("[data-cuenta]");
  await expect(modal).toBeVisible();
  await expect(modal.locator("[data-cuenta-pagar]")).toHaveAttribute("href", "https://mpago.la/22dyhQr");
  await expect(page.locator("#hero-cta").getByRole("button", { name: "Crea tu cuenta por $14.495" })).toBeVisible();
});

test("/kimi muestra el flujo y los logos reales del home", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/kimi", { waitUntil: "domcontentloaded" });
  const flujo = page.locator("[data-testid=kimi-flujo]");
  await expect(flujo).toContainText("WhatsApp");
  await expect(flujo).toContainText("Horarios y tratamientos");
  await expect(flujo).toContainText("Campañas");
  await expect(flujo).toContainText("El agente agenda por ti");
  await expect(flujo.locator(".flujo-hub img")).toHaveAttribute("src", "/kimi/clinera-logo-blanco.png");
  await expect(flujo).not.toContainText(/Nexor|cita/i);
  const logos = page.locator("[data-testid=kimi-logos] ul").first();
  const alts = await logos.locator("img").evaluateAll((els) => els.map((el) => el.getAttribute("alt")));
  expect(alts).toEqual([
    "Método Hebe",
    "Protocolo Lumina",
    "Andes Salud",
    "Sanatorio Alemán",
    "Everest Clínicas Dentales",
    "Sonríe",
  ]);
  await expect(logos.locator("img").nth(0)).toHaveAttribute("src", "/presentacion/clientes/hebe.png");
  await expect(logos.locator("img").nth(3)).toHaveAttribute("src", "/presentacion/clientes/sanatorio.png");
  await expect(logos.locator("img").nth(4)).toHaveAttribute("src", "/presentacion/clientes/everest-mono.png");
  const orden = await page.evaluate(() => {
    const y = (sel: string) => document.querySelector(sel)?.getBoundingClientRect().top ?? 0;
    return { hero: y("#top"), logos: y("[data-testid=kimi-logos]"), dolor: y("#dolor") };
  });
  expect(orden.logos).toBeGreaterThan(orden.hero);
  expect(orden.dolor).toBeGreaterThan(orden.logos);
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(ancho).toBeLessThanOrEqual(390);
});

test("/kimi explica Clinera Intelligence con un ejemplo, sin video", async ({ page }) => {
  await page.goto("/kimi", { waitUntil: "domcontentloaded" });
  const sec = page.locator("[data-testid=kimi-intelligence]");
  await expect(sec).toContainText("agente interno conectado a tus ventas");
  await expect(sec).toContainText("fichas clínicas");
  await expect(sec).toContainText("mensajes");
  await expect(sec).toContainText("¿Cuándo es mi próximo paciente?");
  await expect(sec).toContainText("Hoy 16:40 · Camila Rojas · Evaluación facial. Sala 2.");
  await expect(sec).toContainText("¿Cuánto vendí la semana pasada?");
  await expect(sec).toContainText("$4.280.000 en 37 evaluaciones pagadas");
  await expect(sec).toContainText("clínica ficticia");
  await expect(sec.locator("video")).toHaveCount(0);
  const orden = await page.evaluate(() => {
    const y = (id: string) => document.getElementById(id)?.getBoundingClientRect().top ?? 0;
    return { funciones: y("funciones"), intel: y("intelligence"), planes: y("planes") };
  });
  expect(orden.intel).toBeGreaterThan(orden.funciones);
  expect(orden.planes).toBeGreaterThan(orden.intel);
});

test("en el celular Crea tu cuenta queda junto al carrito y Quitar saca el adicional", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto("/kimi", { waitUntil: "domcontentloaded" });
  const grupo = page.locator("header.nav .nav-acciones");
  const activar = grupo.getByRole("button", { name: "Crea tu cuenta por $14.495" });
  const bolsa = grupo.locator("[data-carrito-icon]");
  await expect(activar).toBeVisible();
  const a = await activar.boundingBox();
  const b = await bolsa.boundingBox();
  expect(a && b && b.x >= a.x + a.width - 1).toBe(true);
  expect(a && b && b.x - (a.x + a.width) < 24).toBe(true);
});

test("/kimi ofrece Solicita asistencia y no muestra Hablar con ventas ni Agendar reunión", async ({ page }) => {
  await page.goto("/kimi", { waitUntil: "domcontentloaded" });
  const wa = "https://wa.me/56985581524?text=necesito%20asistencia";
  await expect(page.getByText("Hablar con ventas")).toHaveCount(0);
  await expect(page.getByText("Agendar reunión")).toHaveCount(0);
  await expect(page.locator("header.nav").getByRole("button")).toHaveCount(2);
  await expect(page.locator("header.nav").getByRole("button", { name: "Crea tu cuenta por $14.495" })).toBeVisible();
  await expect(page.locator("header.nav").getByRole("link", { name: "Solicita asistencia" })).toHaveCount(0);
  await expect(page.locator("#hero-cta").getByRole("link", { name: "Solicita asistencia" })).toHaveCount(0);
  await expect(page.locator("#hero-cta").getByRole("button", { name: "Crea tu cuenta por $14.495" })).toBeVisible();
  await expect(page.locator("#comenzar").getByRole("button", { name: "Crea tu cuenta por $14.495" })).toBeVisible();
  const link = page.locator("#comenzar").getByRole("link", { name: "Solicita asistencia", exact: true });
  await expect(link).toHaveAttribute("href", wa);
  await expect(link).toHaveAttribute("target", "_blank");
});

test("/home-nuevo: el popup llega a la oferta y el embed lleva fecha", async ({ page }) => {
  const errores: string[] = [];
  page.on("pageerror", (err) => errores.push(String(err)));
  await page.route(/clarity\.ms|facebook\.net|facebook\.com|googletagmanager|google-analytics|hotjar/, (route) => route.abort());
  await page.clock.setFixedTime(new Date("2026-11-06T10:00:00-03:00"));
  await page.goto("/home-nuevo", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Hablar con ventas" }).first().click();
    await page.locator("#w-nombre").fill("Ana Soto");
    await page.locator("#wiz-next").click();
    await page.locator("#w-clinica").fill("Clínica Vela");
    await page.locator("#wiz-next").click();
    await page.locator("label.wiz-opt").first().click();
    await page.locator("#wiz-next").click();
    await page.locator("#w-celular").fill("912345678");
    await page.locator("#w-correo").fill("ana@clinica.cl");
    await page.locator("#wiz-next").click();
    const link = page.locator("#wiz-offer-link");
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /^\/contrata\?plan=flux/);
    expect(errores).toEqual([]);
    await page.locator("#wiz-agendar").click();
    await expect(page.locator("#wiz-agenda-frame")).toHaveAttribute("src", /fecha=/);
});
