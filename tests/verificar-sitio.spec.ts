// Sitio web obligatorio en /agenda (Ricardo, 26-oct-2026): Clinera apunta a clínicas medianas
// y una clínica establecida tiene web. /api/verificar-sitio comprueba que exista y que sea de una
// clínica; si no, el formulario no pasa, no sale el Lead a Meta ni el lead al CRM.

import { expect, test, type Page } from "@playwright/test";
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

async function llegarAlPaso2(page: Page) {
  await page.goto("/agenda", { waitUntil: "domcontentloaded" });
  await expect(async () => {
    if (!(await page.locator('[data-agenda-paso="2"]').isVisible())) {
      const pista = (await page.locator("[data-quiero-ahorrar]").boundingBox())!;
      const perilla = (await page.locator("[data-perilla]").boundingBox())!;
      const y = perilla.y + perilla.height / 2;
      await page.mouse.move(perilla.x + perilla.width / 2, y);
      await page.mouse.down();
      await page.mouse.move(pista.x + pista.width + 20, y, { steps: 10 });
      await page.mouse.up();
    }
    await expect(page.locator('[data-agenda-paso="2"]')).toBeVisible({ timeout: 2500 });
  }).toPass({ timeout: 20000 });
  await page.getByLabel("Nombre", { exact: true }).fill("[E2E TEST] Sitio");
  await page.getByLabel("Correo", { exact: true }).fill("e2e-sitio@e2e.clinera.io");
  await page.getByLabel("Celular (WhatsApp)").fill("912345678");
  await page.getByLabel("Nombre de tu clínica").fill("[E2E TEST] Clínica");
}

const boton = (page: Page) => page.getByRole("button", { name: /Elegir mi hora|Verificando/ });

test("sin sitio no avanza; un sitio que no es clínica se bloquea y no sale nada a Meta ni al CRM", async ({ page }) => {
  const llamadas = await mockRed(page, (s) =>
    s.includes("lider") ? { ok: false, motivo: "no_clinica" } : { ok: true, url: `https://${s}`, estado: "verificado" },
  );
  const { wizard, capi } = grabar(page);
  await llegarAlPaso2(page);

  await boton(page).click();
  await expect(page.locator(`[data-agenda-paso="2"] [role="alert"]`)).toHaveText("Escribe el sitio web de tu clínica (por ejemplo, www.tuclinica.cl).");
  expect(llamadas).toHaveLength(0);

  const campo = page.getByLabel("Sitio web de tu clínica");
  await expect(campo).toHaveCSS("font-size", "16px"); // menos de 16 px y iOS hace zoom
  await campo.fill("www.lider.cl");
  await boton(page).click();
  await expect(page.locator(`[data-agenda-paso="2"] [role="alert"]`)).toHaveText("Este sitio no corresponde a una clínica. Por favor verifica.");
  await expect(page.locator('[data-agenda-paso="2"]')).toBeVisible();
  await page.waitForTimeout(300);
  expect(capi.filter((c) => c.event_name === "Lead")).toHaveLength(0);
  expect(wizard.filter((w) => w.lead_stage === "contact")).toHaveLength(0);

  // Corrige el sitio: el aviso se va al escribir y pasa al calendario.
  await campo.fill("metodohebe.cl");
  await expect(page.locator("[data-sitio-error]")).toHaveCount(0);
  await boton(page).click();
  await expect(page.locator('[data-agenda-paso="3"]')).toBeVisible();
  await expect.poll(() => capi.map((c) => c.event_name)).toContain("Lead");
  await expect.poll(() => wizard.filter((w) => w.lead_stage === "contact").length).toBe(1);
  const contacto = wizard.find((w) => w.lead_stage === "contact")!;
  expect(contacto.sitio_web).toBe("https://metodohebe.cl");
  expect(contacto.sitio_web_estado).toBe("verificado");
});

test("sitio que no existe: mensaje claro y no avanza", async ({ page }) => {
  await mockRed(page, () => ({ ok: false, motivo: "no_existe" }));
  await llegarAlPaso2(page);
  await page.getByLabel("Sitio web de tu clínica").fill("estonoexiste-123.cl");
  await boton(page).click();
  await expect(page.locator(`[data-agenda-paso="2"] [role="alert"]`)).toHaveText("No pudimos abrir ese sitio. Revisa que esté bien escrito.");
  await expect(page.locator('[data-agenda-paso="3"]')).toHaveCount(0);
});

test("si la verificación misma falla, el lead pasa (un error nuestro no lo bloquea)", async ({ page }) => {
  await mockRed(page, () => 500);
  const { wizard } = grabar(page);
  await llegarAlPaso2(page);
  await page.getByLabel("Sitio web de tu clínica").fill("clinicareal.cl");
  await boton(page).click();
  await expect(page.locator('[data-agenda-paso="3"]')).toBeVisible();
  await expect.poll(() => wizard.find((w) => w.lead_stage === "contact")?.sitio_web_estado).toBe("sin_verificar");
});
