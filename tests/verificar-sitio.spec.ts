// Sitio web obligatorio en /agenda (Ricardo, 26-oct-2026): Clinera apunta a clínicas medianas
// y una clínica establecida tiene web. /api/verificar-sitio comprueba que exista y que sea de una
// clínica; si no, el formulario no pasa, no sale el Lead a Meta ni el lead al CRM.

import { expect, test, type Page } from "@playwright/test";
import { llenarClinica, pasarDatosPersonales } from "./agenda-helpers";
import { esIpPrivada, extraerTexto, esEstacionado, normalizarSitio, pareceClinica } from "../src/lib/verificar-sitio";

test("normalizarSitio: dominios, redes sociales y basura", () => {
  expect(normalizarSitio("www.MetodoHebe.cl")).toEqual({ url: "https://www.metodohebe.cl", host: "www.metodohebe.cl" });
  expect(normalizarSitio("http://clinica.cl/inicio")).toEqual({ url: "https://clinica.cl/inicio", host: "clinica.cl" });
  for (const v of ["@miclinica", "instagram.com/hebe", "https://www.facebook.com/x", "linktr.ee/x", "wa.me/569", "google.com"]) {
    expect(normalizarSitio(v), v).toEqual({ motivo: "red_social" });
  }
  for (const v of ["", "abc", "no tengo", "localhost", "127.0.0.1", "http://clinica.cl:8080", "ftp://clinica.cl", "https://u:p@clinica.cl"]) {
    expect(normalizarSitio(v), v).toEqual({ motivo: "formato" });
  }
});

test("esIpPrivada: el servidor no visita la red interna", () => {
  for (const ip of ["10.0.0.1", "127.0.0.1", "169.254.169.254", "172.16.5.4", "192.168.1.1", "100.64.0.1", "::1", "fd00::1", "::ffff:10.1.1.1", "0.0.0.0"]) {
    expect(esIpPrivada(ip), ip).toBe(true);
  }
  for (const ip of ["8.8.8.8", "190.98.200.1", "2606:4700::1111"]) expect(esIpPrivada(ip), ip).toBe(false);
});

test("extraerTexto, dominio en venta y heurística de clínica", () => {
  const html = `<html><head><title>Clínica Vela</title><meta name="description" content="Tratamientos faciales"><script>var x=1</script></head>
    <body><h1>Medicina estética</h1><p>Agenda tu consulta con nuestra doctora.</p><style>p{}</style></body></html>`;
  const t = extraerTexto(html);
  expect(t).toContain("Clínica Vela");
  expect(t).toContain("Tratamientos faciales");
  expect(t).not.toContain("var x");
  expect(pareceClinica(t)).toBe(true);
  expect(pareceClinica("Ofertas en televisores y celulares, despacho gratis")).toBe(false);
  expect(esEstacionado("This domain is for sale! Buy this domain today")).toBe(true);
  expect(esEstacionado(t)).toBe(false);
});

async function mockRed(page: Page, verificar: (sitio: string) => object | number) {
  const llamadas: string[] = [];
  await page.route("**/api/verificar-sitio", async (route) => {
    const { sitio } = JSON.parse(route.request().postData() || "{}") as { sitio: string };
    llamadas.push(sitio);
    const r = verificar(sitio);
    if (typeof r === "number") return route.fulfill({ status: r, body: "error" });
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(r) });
  });
  for (const path of ["**/api/wizard", "**/api/meta/capi"]) {
    await page.route(path, (route) =>
      route.request().method() === "POST" ? route.fulfill({ status: 200, contentType: "application/json", body: "{}" }) : route.continue(),
    );
  }
  await page.route(/connect\.facebook\.net/, (route) => route.abort());
  return llamadas;
}

function grabar(page: Page) {
  const wizard: Record<string, string>[] = [];
  const capi: { event_name?: string }[] = [];
  page.on("request", (req) => {
    if (req.method() !== "POST") return;
    if (req.url().includes("/api/wizard")) wizard.push(JSON.parse(req.postData() || "{}"));
    if (req.url().includes("/api/meta/capi")) capi.push(JSON.parse(req.postData() || "{}"));
  });
  return { wizard, capi };
}

async function llegarAlPasoClinica(page: Page) {
  await page.goto("/agenda", { waitUntil: "domcontentloaded" });
  await expect(async () => {
    if (!(await page.locator('[data-agenda-paso="2"]').isVisible())) {
      await page.locator("[data-quiero-ahorrar]").click();
    }
    await expect(page.locator('[data-agenda-paso="2"]')).toBeVisible({ timeout: 2500 });
  }).toPass({ timeout: 20000 });
  await pasarDatosPersonales(page, "[E2E TEST] Sitio", "e2e-sitio@e2e.clinera.io");
  await llenarClinica(page);
}

const boton = (page: Page) => page.getByRole("button", { name: /Elegir mi hora|Verificando/ });

test("un sitio que no es clínica pasa como Nuevo, sin Lead de Meta (27-oct-2026)", async ({ page }) => {
  const llamadas = await mockRed(page, (s) =>
    s.includes("lider") ? { ok: false, motivo: "no_clinica" } : { ok: true, url: `https://${s}`, estado: "verificado" },
  );
  const { wizard, capi } = grabar(page);
  await llegarAlPasoClinica(page);

  const campo = page.getByLabel("Sitio web de tu clínica");
  await campo.fill("abc");
  await boton(page).click();
  await expect(page.locator(`[data-agenda-paso="3"] [role="alert"]`)).toHaveText("Escribe el sitio web de tu clínica (por ejemplo, www.tuclinica.cl).");
  expect(llamadas, "un texto que no es dirección no se verifica").toHaveLength(0);

  await expect(campo).toHaveCSS("font-size", "16px"); // menos de 16 px y iOS hace zoom
  await campo.fill("www.lider.cl");
  await boton(page).click();
  await expect(page.locator('[data-agenda-paso="4"]')).toBeVisible();
  await expect.poll(() => wizard.filter((w) => w.lead_stage === "contact").length).toBe(1);
  const contacto = wizard.find((w) => w.lead_stage === "contact")!;
  expect(contacto.sitio_web).toBe("www.lider.cl");
  expect(contacto.sitio_web_estado, "el closer lo revisa").toBe("no_clinica");
  await page.waitForTimeout(500);
  expect(capi.filter((c) => c.event_name === "Lead"), "no entrena a Meta").toHaveLength(0);
});

test("sitio verificado: pasa, dispara el Lead y llega al CRM como verificado", async ({ page }) => {
  await mockRed(page, (s) => ({ ok: true, url: `https://${s}`, estado: "verificado" }));
  const { wizard, capi } = grabar(page);
  await llegarAlPasoClinica(page);
  await page.getByLabel("Sitio web de tu clínica").fill("metodohebe.cl");
  await boton(page).click();
  await expect(page.locator('[data-agenda-paso="4"]')).toBeVisible();
  await expect.poll(() => capi.map((c) => c.event_name)).toContain("Lead");
  await expect.poll(() => wizard.filter((w) => w.lead_stage === "contact").length).toBe(1);
  const contacto = wizard.find((w) => w.lead_stage === "contact")!;
  expect(contacto.sitio_web).toBe("https://metodohebe.cl");
  expect(contacto.sitio_web_estado).toBe("verificado");
});

test("sitio que no existe: pasa igual como Nuevo", async ({ page }) => {
  await mockRed(page, () => ({ ok: false, motivo: "no_existe" }));
  const { wizard } = grabar(page);
  await llegarAlPasoClinica(page);
  await page.getByLabel("Sitio web de tu clínica").fill("estonoexiste-123.cl");
  await boton(page).click();
  await expect(page.locator('[data-agenda-paso="4"]')).toBeVisible();
  await expect.poll(() => wizard.find((w) => w.lead_stage === "contact")?.sitio_web_estado).toBe("no_existe");
});

test("si la verificación misma falla, el lead pasa (un error nuestro no lo bloquea)", async ({ page }) => {
  await mockRed(page, () => 500);
  const { wizard } = grabar(page);
  await llegarAlPasoClinica(page);
  await page.getByLabel("Sitio web de tu clínica").fill("clinicareal.cl");
  await boton(page).click();
  await expect(page.locator('[data-agenda-paso="4"]')).toBeVisible();
  await expect.poll(() => wizard.find((w) => w.lead_stage === "contact")?.sitio_web_estado).toBe("sin_verificar");
});

// ── Sitio web o Instagram, y los dos pueden ir en blanco (Ricardo, 27-oct-2026) ──
test("sin sitio web: lo deja en blanco, avanza, va al CRM como sin_web y NO dispara el Lead de Meta", async ({ page }) => {
  const llamadas = await mockRed(page, () => ({ ok: true, url: "https://x.cl", estado: "verificado" }));
  const { wizard, capi } = grabar(page);
  await llegarAlPasoClinica(page);
  await boton(page).click();
  await expect(page.locator('[data-agenda-paso="4"]')).toBeVisible();
  await expect.poll(() => wizard.filter((w) => w.lead_stage === "contact").length).toBe(1);
  const c = wizard.find((w) => w.lead_stage === "contact")!;
  expect(c.sitio_web_estado).toBe("sin_web");
  expect(c.sitio_web).toBe("");
  await page.waitForTimeout(500);
  expect(capi.filter((x) => x.event_name === "Lead"), "sin web no entrena a Meta").toHaveLength(0);
  expect(llamadas, "no se verifica un sitio vacío").toHaveLength(0);
});

test("Instagram: escribe solo el usuario, va al CRM como instagram.com/usuario y NO dispara el Lead", async ({ page }) => {
  const llamadas = await mockRed(page, () => ({ ok: true, url: "https://x.cl", estado: "verificado" }));
  const { wizard, capi } = grabar(page);
  await llegarAlPasoClinica(page);
  await page.locator("[data-canal-instagram]").click();
  await expect(page.getByLabel("Sitio web de tu clínica")).toHaveCount(0);
  const campo = page.getByLabel("Instagram de tu clínica");
  await expect(campo).toHaveCSS("font-size", "16px");
  await expect(page.getByText("instagram.com/@")).toBeVisible();
  await campo.fill("clinica vela!");
  await boton(page).click();
  await expect(page.locator(`[data-agenda-paso="3"] [role="alert"]`)).toContainText("usuario de Instagram");
  await campo.fill("@clinica.vela");
  await boton(page).click();
  await expect(page.locator('[data-agenda-paso="4"]')).toBeVisible();
  await expect.poll(() => wizard.filter((w) => w.lead_stage === "contact").length).toBe(1);
  const c = wizard.find((w) => w.lead_stage === "contact")!;
  expect(c.sitio_web).toBe("https://instagram.com/clinica.vela");
  expect(c.sitio_web_estado, "lo verifica un humano").toBe("instagram");
  await page.waitForTimeout(500);
  expect(capi.filter((x) => x.event_name === "Lead"), "Instagram no entrena a Meta").toHaveLength(0);
  expect(llamadas, "Instagram no pasa por la IA").toHaveLength(0);
});

test("Instagram en blanco: pasa como sin_web", async ({ page }) => {
  await mockRed(page, () => ({ ok: true, url: "https://x.cl", estado: "verificado" }));
  const { wizard } = grabar(page);
  await llegarAlPasoClinica(page);
  await page.locator("[data-canal-instagram]").click();
  await boton(page).click();
  await expect(page.locator('[data-agenda-paso="4"]')).toBeVisible();
  await expect.poll(() => wizard.find((w) => w.lead_stage === "contact")?.sitio_web_estado).toBe("sin_web");
});

test("Instagram en un celular chico: el botón se alcanza y la página no se corre de lado", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await mockRed(page, () => ({ ok: true, url: "https://x.cl", estado: "verificado" }));
  await llegarAlPasoClinica(page);
  await page.locator("[data-canal-instagram]").click();
  await page.getByLabel("Instagram de tu clínica").fill("clinicavela");
  const b = boton(page);
  await b.scrollIntoViewIfNeeded();
  await expect(b).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await b.click();
  await expect(page.locator('[data-agenda-paso="4"]')).toBeVisible();
});
