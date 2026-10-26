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
      await page.locator("[data-quiero-ahorrar]").click();
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

// ── Clínica sin sitio web: documento tributario o correo empresarial (26-oct-2026) ──
import { dominioCorreoEmpresarial, validarIdTributario } from "../src/lib/id-tributario";
import { abrir, sellar } from "../src/lib/codigo-correo";

test("documento tributario: empresas reales pasan, personas e inventados no", () => {
  const empresas: [Parameters<typeof validarIdTributario>[0], string][] = [
    ["CL", "76.086.428-5"], ["CL", "60.803.000-K"], ["MX", "WMT970714R10"], ["CO", "890903938-8"],
    ["PE", "20100047218"], ["AR", "30-54668997-9"], ["EC", "1790010937001"], ["CR", "3-101-123456"],
    ["PY", "80000519-8"], ["ES", "A28015865"], ["PA", "155123456-2-2020"],
  ];
  for (const [p, v] of empresas) expect(validarIdTributario(p, v).ok, `${p} ${v}`).toBe(true);
  expect(validarIdTributario("CL", "76.086.428-6")).toEqual({ ok: false, motivo: "verificador" });
  expect(validarIdTributario("CL", "12.345.678-5")).toEqual({ ok: false, motivo: "persona" });
  expect(validarIdTributario("CL", "11.111.111-1")).toMatchObject({ ok: false });
  expect(validarIdTributario("MX", "GODE561231GR8")).toEqual({ ok: false, motivo: "persona" });
  expect(validarIdTributario("CO", "890903938-1")).toEqual({ ok: false, motivo: "verificador" });
  expect(validarIdTributario("PE", "10456789012")).toMatchObject({ ok: false });
  expect(validarIdTributario("AR", "20-12345678-9")).toMatchObject({ ok: false });
  expect(validarIdTributario("CR", "1-1234-5678")).toEqual({ ok: false, motivo: "persona" });
  expect(validarIdTributario("ES", "12345678Z")).toEqual({ ok: false, motivo: "persona" });
  expect(validarIdTributario("CL", "")).toEqual({ ok: false, motivo: "formato" });
});

test("correo empresarial: los gratuitos no cuentan; el código firmado vence y no se reutiliza en otro correo", () => {
  expect(dominioCorreoEmpresarial("Ana@ClinicaVela.cr")).toBe("clinicavela.cr");
  for (const c of ["ana@gmail.com", "ana@hotmail.com", "ana@outlook.es", "ana@icloud.com", "nada"]) {
    expect(dominioCorreoEmpresarial(c), c).toBeNull();
  }
  process.env.CODIGO_CORREO_SECRET = "e2e-secreto";
  const t0 = Date.now();
  const sobre = sellar("ana@clinicavela.cr", "123456", t0);
  expect(abrir("ana@clinicavela.cr", "123456", sobre, t0 + 1000)).toBe(true);
  expect(abrir("ANA@clinicavela.cr", "123456", sobre, t0 + 1000)).toBe(true);
  expect(abrir("ana@clinicavela.cr", "123457", sobre, t0 + 1000)).toBe(false);
  expect(abrir("otro@clinicavela.cr", "123456", sobre, t0 + 1000)).toBe(false);
  expect(abrir("ana@clinicavela.cr", "123456", sobre, t0 + 16 * 60_000)).toBe(false);
  expect(abrir("ana@clinicavela.cr", "123456", "basura", t0)).toBe(false);
});

test("sin sitio web: pasa con el RUT de la empresa, va al CRM marcado y NO dispara el Lead de Meta", async ({ page }) => {
  const llamadas = await mockRed(page, () => ({ ok: true, url: "https://x.cl", estado: "verificado" }));
  const { wizard, capi } = grabar(page);
  await llegarAlPaso2(page);
  await page.locator("[data-sin-web-abrir]").click();
  await expect(page.getByLabel("Sitio web de tu clínica")).toHaveCount(0);
  const rut = page.getByLabel("RUT de la empresa");
  await expect(rut).toHaveCSS("font-size", "16px");

  await rut.fill("12.345.678-5"); // RUT de persona
  await boton(page).click();
  await expect(page.locator(`[data-agenda-paso="2"] [role="alert"]`)).toHaveText(
    "Ese número es de una persona. Necesitamos el de la empresa de la clínica.",
  );
  await rut.fill("76.086.428-5");
  await boton(page).click();
  await expect(page.locator('[data-agenda-paso="3"]')).toBeVisible();
  await expect.poll(() => wizard.filter((w) => w.lead_stage === "contact").length).toBe(1);
  const c = wizard.find((w) => w.lead_stage === "contact")!;
  expect(c.sitio_web_estado).toBe("sin_web_tributario");
  expect(c.id_tributario).toBe("76.086.428-5");
  expect(c.id_tributario_pais).toBe("CL");
  expect(c.sitio_web).toBe("");
  await page.waitForTimeout(500);
  expect(capi.filter((x) => x.event_name === "Lead"), "sin web no entrena a Meta").toHaveLength(0);
  expect(llamadas, "no se verifica un sitio que no existe").toHaveLength(0);
});

test("sin sitio web: correo de la clínica con código", async ({ page }) => {
  await mockRed(page, () => ({ ok: true, url: "https://x.cl", estado: "verificado" }));
  await page.route("**/api/verificar-sitio/codigo", async (route) => {
    const b = JSON.parse(route.request().postData() || "{}") as { accion: string; codigo?: string };
    const r = b.accion === "enviar" ? { ok: true, sobre: "s" } : b.codigo === "246810" ? { ok: true } : { ok: false, motivo: "codigo" };
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(r) });
  });
  const { wizard, capi } = grabar(page);
  await llegarAlPaso2(page);
  await page.locator("[data-sin-web-abrir]").click();
  await page.getByRole("tab", { name: "Correo empresarial" }).click();

  const correo = page.getByLabel("Correo de la clínica (con su dominio)");
  await correo.fill("ana@gmail.com");
  await page.locator("[data-enviar-codigo]").click();
  await expect(page.locator("[data-codigo-msg]")).toContainText("no Gmail");

  await correo.fill("ana@clinicavela.cr");
  await page.locator("[data-enviar-codigo]").click();
  const cod = page.getByLabel("Código que te llegó al correo");
  await cod.fill("111111");
  await page.locator("[data-confirmar-codigo]").click();
  await expect(page.locator("[data-codigo-msg]")).toHaveText("El código no coincide o ya venció.");
  await boton(page).click();
  await expect(page.locator('[data-agenda-paso="3"]')).toHaveCount(0);

  await cod.fill("246810");
  await page.locator("[data-confirmar-codigo]").click();
  await expect(page.locator("[data-correo-ok]")).toContainText("ana@clinicavela.cr");
  await boton(page).click();
  await expect(page.locator('[data-agenda-paso="3"]')).toBeVisible();
  await expect.poll(() => wizard.find((w) => w.lead_stage === "contact")?.sitio_web_estado).toBe("sin_web_correo");
  expect(wizard.find((w) => w.lead_stage === "contact")?.correo_empresa_verificado).toBe("ana@clinicavela.cr");
  await page.waitForTimeout(500);
  expect(capi.filter((x) => x.event_name === "Lead")).toHaveLength(0);
});

test("sin sitio web en un celular chico: el botón se alcanza y la página no se corre de lado", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await mockRed(page, () => ({ ok: true, url: "https://x.cl", estado: "verificado" }));
  await llegarAlPaso2(page);
  await page.locator("[data-sin-web-abrir]").click();
  await page.getByLabel("RUT de la empresa").fill("76.086.428-5");
  const b = boton(page);
  await b.scrollIntoViewIfNeeded();
  await expect(b).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await b.click();
  await expect(page.locator('[data-agenda-paso="3"]')).toBeVisible();
});
