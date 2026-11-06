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
        await expect(flux).toContainText("$28.000");
        await expect(flux).toContainText("$14.000");
        await expect(flux).not.toContainText("USD");
      } else {
        await expect(flux).toContainText("USD");
        await expect(flux).toContainText("29");
      }
      await expect(flux).toContainText("Clinera Intelligence");
      await expect(flux).toContainText("100 conversaciones");
      const extras = page.locator("[data-testid=plan-addons]");
      await expect(extras).toContainText("Profesional extra");
      await expect(extras).toContainText("Agente IA");
      await expect(extras).toContainText("Regalo de noviembre");
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
  await expect(page.locator("#hero-cta").getByRole("button", { name: "Activar por $28.000" })).toBeVisible();
});

test("/kimi agrega Flux y los adicionales en la misma página", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/kimi", { waitUntil: "domcontentloaded" });
  const flux = page.locator("[data-testid=plan-flux]");
  await expect(flux.locator("img")).toHaveAttribute("src", "/kimi/productos/flux.jpg");
  await expect(page.locator("#hero-cta")).toContainText("Activar por $28.000");
  await expect(page.locator("#hero-cta").getByRole("link", { name: "Solicita asistencia" })).toHaveCount(0);
  await expect(page.locator("#comenzar")).toContainText("Agrega Clinera Flux y elige lo que tu clínica necesita.");
  await expect(page.locator("#comenzar")).toContainText("Sin costo de implementación");
  await expect(page.locator("#comenzar")).not.toContainText("cuatro preguntas");
  await expect(page.locator("#comenzar").getByRole("button")).toHaveCount(1);
  await expect(page.locator("#comenzar").getByRole("button", { name: "Activar por $28.000" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Hablar con ventas" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Hablar con ventas" })).toHaveCount(0);
  await expect(page.locator("#comenzar").getByRole("link", { name: "Solicita asistencia" })).toHaveAttribute(
    "href",
    "https://wa.me/56985581524?text=necesito%20asistencia",
  );
  await expect(flux.getByRole("button", { name: "Agregar al carrito" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Comienza ya" })).toHaveCount(0);
  const orden = await page.evaluate(() => {
    const y = (id: string) => document.getElementById(id)?.getBoundingClientRect().top ?? 0;
    return { hero: y("top"), funciones: y("funciones"), planes: y("planes") };
  });
  expect(orden.planes).toBeGreaterThan(orden.hero);
  expect(orden.planes).toBeGreaterThan(orden.funciones);
  const carril = page.locator("[data-testid=plan-addons]");
  const prof = carril.locator("[data-addon=profesional_extra]");
  await expect(prof).toHaveClass(/espera/);
  await expect(prof.locator("img")).toHaveAttribute("src", "/kimi/productos/profesional.jpg");
  await expect(carril.locator("[data-addon=sucursal_extra] img")).toHaveAttribute("src", "/kimi/productos/sucursal.jpg");
  await expect(carril.locator("[data-addon=conversaciones_1000] img")).toHaveAttribute("src", "/kimi/productos/conversaciones.jpg");
  await expect(carril.locator("[data-addon=instagram] img")).toHaveAttribute("src", "/kimi/productos/instagram.jpg");
  await expect(carril.locator("[data-addon=facebook] img")).toHaveAttribute("src", "/kimi/productos/facebook.jpg");
  await expect(carril.locator("[data-addon=agente_ia] img")).toHaveAttribute("src", "/kimi/productos/agente-ia.jpg");
  await expect(carril.locator('[data-regalo="email_marketing"] img')).toHaveAttribute("src", "/kimi/productos/email-marketing.jpg");
  await expect(carril.locator('[data-regalo="automatizaciones"] img')).toHaveAttribute("src", "/kimi/productos/automatizaciones.jpg");
  await expect(prof.getByRole("button", { name: "Primero agrega Clinera Flux" })).toBeDisabled();
  await expect(carril.locator("[data-addon=agente_ia] s")).toContainText("$76.280");
  await expect(carril.locator("[data-addon=agente_ia]")).toContainText("50% por 3 meses");
  await expect(carril.locator("[data-addon=agente_ia]")).toContainText("$38.140 por 3 meses, luego $76.280");
  const onboarding = carril.locator("[data-addon=onboarding_humano]");
  await expect(onboarding.locator("img")).toHaveAttribute("src", "/kimi/productos/onboarding.jpg");
  await expect(onboarding).toContainText("$183.450");
  await expect(onboarding).toContainText("cobro único");
  await expect(onboarding).not.toContainText("50% por 3 meses");
  await expect(onboarding.getByRole("button", { name: "Primero agrega Clinera Flux" })).toBeDisabled();
  await flux.getByRole("button", { name: "Agregar al carrito" }).click();
  await expect(page.locator("[data-toast]")).toHaveText("Agregado al carrito");
  await expect(page.locator("header.nav").getByRole("button", { name: "Activar por $28.000" })).toBeVisible();
  await expect(page.locator("header.nav").getByRole("button", { name: "Quitar" })).toHaveCount(0);
  await expect(page.locator("#hero-cta").getByRole("button", { name: "Activar por $28.000" })).toBeVisible();
  await expect(page.locator("#comenzar").getByRole("button", { name: "Activar por $28.000" })).toBeVisible();
  await expect(page.locator("[data-carrito-count]")).toHaveText("1");
  await expect(prof).not.toHaveClass(/espera/);
  await expect(prof.getByRole("button", { name: "Agregar al carrito" })).toBeEnabled();
  await carril.locator("[data-addon=instagram]").getByRole("button", { name: "Agregar al carrito" }).click();
  await onboarding.getByRole("button", { name: "Agregar al carrito" }).click();
  await page.locator("[data-carrito-icon]").click();
  const drawer = page.locator("[data-drawer]");
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("button", { name: "Quitar Clinera Flux" })).toBeVisible();
  await expect(drawer.getByRole("button", { name: "Sumar Clinera Flux" })).toHaveCount(0);
  await expect(drawer.getByRole("button", { name: "Quitar Onboarding humano" })).toBeVisible();
  await expect(drawer.getByRole("button", { name: "Sumar Onboarding humano" })).toHaveCount(0);
  await expect(drawer).toContainText("Hoy pagas");
  await expect(drawer.locator(".linea", { hasText: "Clinera Flux" })).toContainText("$28.000");
  await expect(drawer.locator(".linea", { hasText: "Clinera Flux" })).toContainText("$14.000");
  await expect(drawer.locator("[data-total-hoy]")).toContainText("$201.795");
  await expect(drawer.locator("[data-total-hoy]")).not.toContainText("USD");
  await expect(drawer).toContainText("$18.345 mensual + $183.450 de onboarding");
  await expect(drawer.getByRole("button", { name: "Activar", exact: true })).toBeVisible();
  await expect(drawer).toContainText("50% por 3 meses");
  await expect(drawer).toContainText("cobro único");
  await expect(drawer).toContainText("$183.450");
  await page.locator("[data-cerrar]").click();
  await flux.getByRole("button", { name: "Quitar" }).click();
  await page.locator("#comenzar").scrollIntoViewIfNeeded();
  await page.locator("#comenzar").getByRole("button", { name: "Activar por $28.000" }).click();
  const cubre = await page.evaluate(() => {
    const toast = document.querySelector("[data-toast]");
    const botones = [...document.querySelectorAll("#comenzar button")];
    if (!toast || (toast as HTMLElement).hidden) return false;
    const a = toast.getBoundingClientRect();
    return botones.some((b) => {
      const r = b.getBoundingClientRect();
      return a.left < r.right && a.right > r.left && a.top < r.bottom && a.bottom > r.top;
    });
  });
  expect(cubre).toBe(false);
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(ancho).toBeLessThanOrEqual(1280);
});

test("en el celular la barra ofrece Activar por $28.000 y la asistencia aparece al final", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto("/kimi", { waitUntil: "domcontentloaded" });
  const barra = page.locator("#mobile-cta");
  await expect(barra.locator("[data-bar-label]")).toHaveText("Clinera Flux");
  await expect(barra.locator("[data-total-bar]")).toBeHidden();
  await expect(barra.getByRole("button", { name: "Activar por $28.000" })).toBeVisible();
  const veces = ((await barra.innerText()).match(/\$28\.000/g) ?? []).length;
  expect(veces).toBe(1);
  await expect(barra.getByRole("link", { name: "Solicita asistencia" })).toHaveCount(0);
  await expect(barra.getByRole("button", { name: "→ Agregar" })).toHaveCount(0);
  await page.locator("#comenzar").scrollIntoViewIfNeeded();
  await expect(barra.getByRole("link", { name: "Solicita asistencia" })).toBeVisible();
  await barra.getByRole("button", { name: "Activar por $28.000" }).click();
  await expect(page.getByRole("heading", { name: "¿Quieres adicionales o con esto partes?" })).toBeVisible();
  await expect(page.locator("[data-chip=instagram]")).toBeVisible();
  await expect(page.locator("[data-chip=agente_ia]")).toBeVisible();
  await expect(barra).not.toContainText("USD 0");
});

test("en el celular el cajón muestra Flux a $28.000 y deja el total quieto", async ({ page }) => {
  for (const ancho of [320, 390, 430]) {
    await page.setViewportSize({ width: ancho, height: 700 });
    await page.goto("/kimi", { waitUntil: "domcontentloaded" });
    const barra = page.locator("#mobile-cta");
    expect(((await barra.innerText()).match(/\$28\.000/g) ?? []).length).toBe(1);
    await page.locator("[data-testid=plan-flux]").getByRole("button", { name: "Agregar al carrito" }).click();
    await page.locator("[data-addon=profesional_extra]").getByRole("button", { name: "Agregar al carrito" }).click();
    await page.locator("[data-addon=sucursal_extra]").getByRole("button", { name: "Agregar al carrito" }).click();
    await page.locator("[data-addon=conversaciones_1000]").getByRole("button", { name: "Agregar al carrito" }).click();
    await page.locator("[data-carrito-icon]").click();
    const drawer = page.locator("[data-drawer]");
    await expect(drawer).toBeVisible();
    await expect(drawer.locator(".linea", { hasText: "Clinera Flux" })).toContainText("$14.000");
    await expect(drawer.locator(".linea", { hasText: "Profesional extra" })).toContainText("$4.345");
    await expect(drawer.locator(".linea", { hasText: "1.000 conversaciones extra" })).toContainText("$12.070");
    await expect(drawer.locator("[data-total-hoy]")).toContainText("$34.760");
    await expect(drawer).toContainText("Luego $69.520/mes");
    await expect(drawer.getByRole("button", { name: "Quitar Profesional extra" })).toBeVisible();
    await expect(drawer.getByRole("button", { name: "Activar", exact: true })).toBeVisible();
    await expect(drawer).not.toContainText("No pierdas más tu tiempo");
    const enVista = await drawer.getByRole("button", { name: "Activar", exact: true }).evaluate((el) => {
      const r = el.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= window.innerHeight + 1;
    });
    expect(enVista).toBe(true);
    const paso = await drawer.locator(".stepper button").first().boundingBox();
    expect(paso?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(paso?.height ?? 0).toBeGreaterThanOrEqual(44);
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

test("en el celular Activar queda junto al carrito y Quitar saca el adicional", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto("/kimi", { waitUntil: "domcontentloaded" });
  const grupo = page.locator("header.nav .nav-acciones");
  const activar = grupo.getByRole("button", { name: "Activar por $28.000" });
  const bolsa = grupo.locator("[data-carrito-icon]");
  await expect(activar).toBeVisible();
  const a = await activar.boundingBox();
  const b = await bolsa.boundingBox();
  expect(a && b && b.x >= a.x + a.width - 1).toBe(true);
  expect(a && b && b.x - (a.x + a.width) < 24).toBe(true);
  await page.locator("[data-testid=plan-flux]").getByRole("button", { name: "Agregar al carrito" }).click();
  const card = page.locator("[data-addon=profesional_extra]");
  await card.getByRole("button", { name: "Agregar al carrito" }).click();
  await expect(card.getByRole("button", { name: "Quitar" })).toBeVisible();
  await card.getByRole("button", { name: "Quitar" }).click();
  await expect(card.getByRole("button", { name: "Agregar al carrito" })).toBeVisible();
  await expect(page.locator("[data-carrito-count]")).toHaveText("1");
});

test("/kimi ofrece Solicita asistencia y no muestra Hablar con ventas ni Agendar reunión", async ({ page }) => {
  await page.goto("/kimi", { waitUntil: "domcontentloaded" });
  const wa = "https://wa.me/56985581524?text=necesito%20asistencia";
  await expect(page.getByText("Hablar con ventas")).toHaveCount(0);
  await expect(page.getByText("Agendar reunión")).toHaveCount(0);
  await expect(page.locator("header.nav").getByRole("button")).toHaveCount(2);
  await expect(page.locator("header.nav").getByRole("link", { name: "Solicita asistencia" })).toHaveCount(0);
  await expect(page.locator("#hero-cta").getByRole("link", { name: "Solicita asistencia" })).toHaveCount(0);
  await expect(page.locator("#hero-cta").getByRole("button")).toHaveCount(1);
  await expect(page.locator("#comenzar").getByRole("button")).toHaveCount(1);
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
