import { expect, test } from "@playwright/test";

// /kimi-gratis es la prueba de la demo de 7 días. /kimi y /kimi2 no cambian.
test("/kimi-gratis vende la demo de 7 días y los tres planes de lista", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/kimi-gratis", { waitUntil: "domcontentloaded" });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("h1")).toHaveText("Prueba gratis sin riesgo y haz crecer tu clínica");
  // Ricardo, 7-nov-2026: «GRATIS» en cada botón principal y «Sin tarjeta de crédito» al lado.
  await expect(page.locator("#hero-cta")).toContainText("Prueba gratis SIN RIESGO");
  await expect(page.locator("[data-testid=pasos-hero] li")).toHaveCount(3);
  // Testimonio en video de la Dra. María del Valle con su Instagram (14-nov-2026).
  await expect(page.locator("[data-testid=testimonio] iframe")).toHaveAttribute("src", /player\.vimeo\.com\/video\/1246716129/);
  await expect(page.locator("[data-testid=testimonio-instagram]")).toHaveAttribute("href", "https://www.instagram.com/dramariadelvalle_cirujana/");
  await expect(page.locator(".hero .sin-tarjeta")).toContainText("Sin tarjeta de crédito");
  await expect(page.locator("[data-testid=kimi-antes-despues] .ad-con li")).toHaveCount(4);
  await expect(page.locator("[data-urgencia]")).toContainText(/Prueba gratis de noviembre|termina hoy/);
  const pintura = (sel: string) =>
    page.locator(sel).evaluate((el) => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, image: cs.backgroundImage, shadow: cs.boxShadow, filter: cs.filter };
    });
  const heroBtn = await pintura("#hero-cta .btn");
  const mediaBtn = await pintura("[data-testid=kimi-asistencia-media] .btn.grad");
  const cierreBtn = await pintura("#comenzar .btn.grad");
  expect(heroBtn.bg).toBe("rgb(17, 17, 17)");
  expect(heroBtn.image).toBe("none");
  expect(heroBtn.shadow).toBe("none");
  expect(mediaBtn.bg).toBe("rgb(17, 17, 17)");
  expect(mediaBtn.shadow).toBe("none");
  expect(cierreBtn.bg).toBe("rgb(124, 58, 237)");
  expect(cierreBtn.image).toBe("none");
  expect(cierreBtn.shadow).toBe("none");
  expect(cierreBtn.filter).toBe("none");
  const wash = await page.locator("#comenzar").evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(wash).toContain("radial-gradient");
  expect(wash).toContain("167, 139, 250");
  await expect(page.locator("header.nav")).not.toContainText("Crea tu cuenta");
  await expect(page.locator("header.nav .nav-cta")).toHaveCount(0);
  await expect(page.locator("#mobile-cta [data-bar-label]")).toHaveCount(0);
  await expect(page.locator("#mobile-cta [data-bar-accion]")).toHaveText("Crea tu cuenta GRATIS");
  await expect(page.locator("#mobile-cta .mcta-row")).not.toContainText("Vortex");
  const media = page.locator("[data-testid=kimi-asistencia-media]");
  await expect(media.getByRole("link", { name: "Solicita asistencia" })).toHaveAttribute(
    "href",
    "https://wa.me/56985581524?text=necesito%20asistencia",
  );
  await expect(page.locator(".hero")).toContainText("Prueba gratis de 7 días");
  await expect(page.locator(".hero")).not.toContainText("Prueba gratis, sin compromiso");
  await expect(page.locator("main")).not.toContainText("$14.495");
  await expect(page.locator("main")).not.toContainText("primer mes");

  const planes = page.locator("[data-testid=kimi-gratis-planes]");
  const flux = planes.locator("[data-testid=plan-flux]");
  const hex = planes.locator("[data-testid=plan-hex]");
  const vortex = planes.locator("[data-testid=plan-xcale]");
  await expect(flux).toContainText("$49");
  await expect(flux).toContainText("2 profesionales");
  await expect(flux).toContainText("1 sucursal");
  await expect(flux).toContainText("WhatsApp");
  await expect(flux).toContainText("300 conversaciones");
  await expect(flux).toContainText("Clinera Intelligence");
  await expect(flux).not.toContainText("5000");
  await expect(hex).toContainText("$129");
  await expect(hex).toContainText("5 profesionales");
  await expect(hex).toContainText("2 sucursales");
  await expect(hex).toContainText("600 conversaciones");
  await expect(hex).toContainText("Clinera Intelligence");
  await expect(hex).not.toContainText("5000");
  await expect(hex.locator(".badge-plan")).toHaveCount(0);
  await expect(vortex).toContainText("Xcale");
  await expect(vortex).not.toContainText("Vortex");
  await expect(page.locator("main")).not.toContainText("Vortex");
  const xcaleGlow = await vortex.evaluate((el) => {
    const wash = getComputedStyle(el, "::after");
    const btn = el.querySelector(".btn.grad");
    const cs = getComputedStyle(btn!);
    return { filter: wash.filter, image: wash.backgroundImage, shadow: cs.boxShadow, bg: cs.backgroundColor };
  });
  expect(xcaleGlow.bg).toBe("rgb(17, 17, 17)");
  expect(xcaleGlow.shadow).toBe("none");
  expect(xcaleGlow.filter).toContain("blur");
  expect(xcaleGlow.image).toContain("radial-gradient");
  const pago = vortex.locator("a.btn.grad");
  await expect(pago).toHaveAttribute("href", "https://buy.stripe.com/8x29AV7cZ9eG9wTgwz1441O");
  await expect(pago).toHaveAttribute("data-plan", "xcale");
  await expect(pago).toHaveAttribute("data-plan-value", "149");
  await expect(pago).not.toHaveAttribute("data-abrir-cuenta", /.+/);
  await expect(flux.locator("a[href*='buy.stripe.com']")).toHaveCount(0);
  await expect(hex.locator("a[href*='buy.stripe.com']")).toHaveCount(0);
  await expect(vortex).toContainText("$149");
  await expect(vortex).toContainText("Recomendado");
  await expect(vortex).toContainText("10 profesionales");
  await expect(vortex).toContainText("3 sucursales");
  await expect(vortex).toContainText("2000 conversaciones");
  // Ricardo, 8-nov-2026: «Clinera Intelligence» a secas y «Agente IA» aparte.
  await expect(vortex).toContainText("Clinera Intelligence");
  await expect(vortex).toContainText("Agente IA");
  await expect(vortex.locator("[data-modelos-ia] img")).toHaveCount(5);
  await expect(vortex).not.toContainText("Clinera Intelligence · 5000");
  await expect(vortex).toContainText("Onboarding humano");

  const extras = page.locator("[data-testid=kimi-gratis-addons]");
  await expect(extras).toContainText("$25");
  await expect(extras).toContainText("5000 créditos IA");
  await expect(extras).toContainText("Profesional extra");
  await expect(extras).toContainText("Sucursal extra");
  await expect(extras).toContainText("$48");
  await expect(extras).toContainText("1000 conversaciones");
  await expect(page.locator("[data-cuenta-pagar]")).toBeHidden();

  const flujo = page.locator("[data-testid=kimi-flujo]");
  await expect(flujo).toContainText("WhatsApp");
  await expect(flujo).toContainText("Facebook");
  await expect(flujo).toContainText("Instagram");
  await expect(flujo).toContainText("Facebook conectado");
  await expect(flujo).toContainText("Instagram conectado");
  await expect(flujo).not.toContainText("Horarios y tratamientos");
});

// Ricardo, 10-nov-2026: «Prueba gratis» va directo a app.clinera.io, sin formulario previo. El lead
// entra al CRM por el webhook de la plataforma. «Solicita asistencia» sí sigue pidiendo los datos.
test("/kimi-gratis: el botón de prueba gratis va directo a app.clinera.io; asistencia sigue pidiendo datos", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const llamadas: string[] = [];
  await page.route("**/api/wizard", (r) => { llamadas.push("wizard"); return r.fulfill({ status: 200, body: "{}" }); });
  await page.route("https://app.clinera.io/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "alta" }));
  await page.goto("/kimi-gratis?utm_source=expo&fbclid=abc", { waitUntil: "domcontentloaded" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);

  await page.locator(".hero").getByRole("button", { name: "Prueba gratis SIN RIESGO" }).click();
  await page.waitForURL(/app\.clinera\.io\/auth\/register/);
  const alta = new URL(page.url());
  expect(alta.searchParams.get("plan")).toBe("xcale");
  expect(alta.searchParams.get("utm_source")).toBe("expo");
  expect(alta.searchParams.get("fbclid")).toBe("abc");
  expect(alta.searchParams.get("nombre")).toBeNull();
  expect(llamadas).toEqual([]);

  // Flux lleva su plan.
  await page.goto("/kimi-gratis", { waitUntil: "domcontentloaded" });
  await page.locator('[data-elegir="flux"]').first().click();
  await page.waitForURL(/app\.clinera\.io\/auth\/register/);
  expect(new URL(page.url()).searchParams.get("plan")).toBe("flux");

  await page.goto("/kimi-gratis", { waitUntil: "domcontentloaded" });
  const modal = page.locator("[data-cuenta]");
  await page.locator("#comenzar").getByRole("link", { name: "Solicita asistencia" }).click();
  await expect(modal).toBeVisible();
  await modal.locator("[data-asistencia-enviar]").click();
  await expect(modal.locator("[data-cuenta-error]")).toBeVisible();
  // Celular chileno: 9 dígitos que empiezan con 9; lo que sobra se recorta al escribir.
  const cel = modal.locator("input[name=celular]");
  await cel.fill("+56 9 6503 1219");
  await expect(cel).toHaveValue("965031219");
});

// Ricardo, 9-nov-2026: demo viva del inicio. El doctor escribe su clínica y ve a la IA atender con ese nombre.
test("/prueba-gratis: la demo viva personaliza el chat y deja el nombre en el formulario", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/prueba-gratis", { waitUntil: "domcontentloaded" });
  const demo = page.locator("[data-demo-viva]");
  await expect(demo.locator("[data-demo-fin]")).toBeHidden();
  await demo.locator("#demo-clinica").fill("Clínica <b>Navia</b>");
  await demo.locator("select").selectOption("dental");
  await demo.getByRole("button", { name: /Ver cómo atiende/ }).click();
  await expect(demo.locator("[data-demo-titulo]")).toHaveText("WhatsApp de Clínica <b>Navia</b>");
  await expect(demo.locator('[data-demo-m="p1"]')).toContainText("evaluación dental");
  await expect(demo.locator("[data-demo-fin]")).toBeVisible({ timeout: 8000 });
  // Nada tapa el botón final (la tarjeta flotante se esconde con la demo en pantalla).
  const boton = demo.locator("[data-demo-activar]");
  await boton.scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  // 10-nov-2026: el botón va directo al registro de la plataforma, con la clínica escrita en la demo.
  await page.route("https://app.clinera.io/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "alta" }));
  await boton.click();
  await page.waitForURL(/app\.clinera\.io\/auth\/register/);
  expect(new URL(page.url()).searchParams.get("clinica")).toBe("Clínica <b>Navia</b>");
});
