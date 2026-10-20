import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  CONVENIO_DOCTORES_BENEFICIOS,
  CONVENIO_DOCTORES_BIO_LINE,
  CONVENIO_DOCTORES_CANONICAL,
  CONVENIO_DOCTORES_PATH,
  CONVENIO_DOCTORES_PLAN_NAME,
  CONVENIO_DOCTORES_REQUISITOS,
  CONVENIO_DOCTORES_REQUISITOS_HREF,
  PARTNERS_APPLY,
  PARTNERS_BONUS_ANNUAL_USD,
  PARTNERS_BONUS_MONTHLY_USD,
  PARTNERS_BONUSES,
  PARTNERS_CANONICAL,
  PARTNERS_CTA_HREF,
  PARTNERS_DOCTORS_API,
  PARTNERS_DOCTORS_CONVENIO,
  PARTNERS_APPLY_EMAIL,
  PARTNERS_DOCTORS_EMAIL,
  PARTNERS_DOCTORS_HREF,
  PARTNERS_HERO,
  PARTNERS_PATH,
  PARTNERS_PRESENTATION_HREF,
  PARTNERS_REQUIREMENTS,
  PARTNERS_SUPPORT,
} from "@/content/partners-program";
import {
  errorDelPaso,
  normalizarPostulacion,
  validarPostulacion,
} from "@/lib/convenio-doctores";

const partnersLandingSrc = readFileSync(
  join(process.cwd(), "src/components/partners/PartnersLanding.tsx"),
  "utf8",
);
const partnersCopySrc = readFileSync(
  join(process.cwd(), "src/content/partners-program.ts"),
  "utf8",
);
const VOSEO =
  /\b(hacé|agendá|confirmá|volvé|mostrá|tenés|sos |podés|presentás|dejá|revisá|querés)\b/i;

test.describe("fuente de verdad del programa partner", () => {
  test("bonos por modalidad; sin descuento al referido ni pago mensual", () => {
    expect(PARTNERS_BONUS_MONTHLY_USD).toBe(150);
    expect(PARTNERS_BONUS_ANNUAL_USD).toBe(400);
    expect(PARTNERS_BONUSES.map((b) => b.usd)).toEqual([150, 400]);
    expect(PARTNERS_PATH).toBe("/partners");
    expect(PARTNERS_CANONICAL).toBe("https://www.clinera.io/partners");
    expect(PARTNERS_CTA_HREF).toBe("/partners#aplicar");
    expect(PARTNERS_PRESENTATION_HREF).toBe("/presentacion-partners");
    expect(PARTNERS_REQUIREMENTS.map((r) => r.title)).toEqual([
      "Perfil profesional",
      "Bio de Instagram",
      "Notebook o tablet",
    ]);
    expect(PARTNERS_SUPPORT.map((s) => s.title)).toEqual([
      "Equipo comercial",
      "Acceso al CRM",
    ]);
    expect(partnersLandingSrc).toMatch(/No cierres solo/);
    expect(partnersLandingSrc).not.toMatch(/cieras/);
    expect(partnersLandingSrc).not.toMatch(VOSEO);
    expect(partnersCopySrc).not.toMatch(VOSEO);
    expect(PARTNERS_HERO.lead).toMatch(/Presentas Clinera/);
    expect(PARTNERS_HERO.lead).toMatch(/tienes acceso al CRM/);
    expect(PARTNERS_APPLY.h2Before).toBe("Deja tu celular.");
    expect(PARTNERS_APPLY.fields.nombre.hint).toMatch(/quieres/);
    expect(PARTNERS_DOCTORS_CONVENIO.cta).toBe("Postula");
    expect(PARTNERS_DOCTORS_CONVENIO.h2Accent).toBe("Postula.");
    expect(PARTNERS_DOCTORS_CONVENIO.lead).toMatch(/postulas acá/);
    expect(PARTNERS_DOCTORS_CONVENIO.lead).toMatch(/no es automático/i);
    expect(PARTNERS_DOCTORS_CONVENIO.lead).toMatch(/Vortex/);
    expect(PARTNERS_DOCTORS_CONVENIO.lead).toMatch(/30%/);
    expect(PARTNERS_DOCTORS_CONVENIO.lead).toMatch(/solo el bono/);
    expect(CONVENIO_DOCTORES_PLAN_NAME).toBe("Vortex");
    expect(CONVENIO_DOCTORES_BIO_LINE).toBe("Partner de @clinera.io");
    expect(CONVENIO_DOCTORES_BENEFICIOS.map((p) => p.title)).toEqual([
      "Sitio web remodelado",
      "Clinera Vortex 3 meses",
      "Bonos por referido",
      "30% después de 3 meses",
    ]);
    expect(CONVENIO_DOCTORES_REQUISITOS.map((p) => p.title)).toEqual([
      "Usar Clinera",
      "Recomendarla",
      "Perfil partner",
    ]);
    expect(PARTNERS_DOCTORS_CONVENIO.points).toEqual(CONVENIO_DOCTORES_BENEFICIOS);
    expect(PARTNERS_DOCTORS_CONVENIO.points[2].desc).toMatch(/US\$ 150/);
    expect(PARTNERS_DOCTORS_CONVENIO.points[2].desc).toMatch(/US\$ 400/);
    expect(PARTNERS_DOCTORS_CONVENIO.points[2].desc).not.toMatch(/US\$ 200/);
    expect(PARTNERS_DOCTORS_EMAIL).toBe(PARTNERS_APPLY_EMAIL);
    expect(PARTNERS_APPLY_EMAIL).toMatch(/^[^@]+@[^@]+\.[a-z]+$/);
    expect(PARTNERS_APPLY_EMAIL.startsWith("ric")).toBe(true);
    expect(PARTNERS_APPLY_EMAIL.endsWith(".cl")).toBe(true);
    expect(PARTNERS_DOCTORS_API).toBe("/api/convenio-doctores");
    expect(PARTNERS_DOCTORS_HREF).toBe("/partners#convenio-doctores");
    expect(CONVENIO_DOCTORES_PATH).toBe("/convenio-doctores");
    expect(CONVENIO_DOCTORES_CANONICAL).toBe("https://www.clinera.io/convenio-doctores");
    expect(CONVENIO_DOCTORES_REQUISITOS_HREF).toBe("/convenio-doctores#requisitos");
    expect(PARTNERS_DOCTORS_CONVENIO.detalleHref).toBe(CONVENIO_DOCTORES_PATH);
    expect(PARTNERS_DOCTORS_CONVENIO.wizard.steps.map((s) => s.key)).toEqual([
      "nombre",
      "correo",
      "motivo",
    ]);
  });

  test("una postulación corta no pasa; nombre+correo+motivo sí", () => {
    expect(validarPostulacion(normalizarPostulacion({}))).toContain("Escribe tu nombre.");
    expect(errorDelPaso("correo", "hola")).toMatch(/correo/i);
    expect(errorDelPaso("motivo", "muy corto")).toMatch(/motivo/i);
    expect(
      validarPostulacion(
        normalizarPostulacion({
          nombre: "María Soto",
          correo: "maria@clinica.cl",
          motivo: "Soy dermatóloga en Temuco y no tengo sitio web.",
        }),
      ),
    ).toEqual([]);
  });
});

test.describe("landing /partners", () => {
  test("publica los bonos nuevos y no el 10% ni el 15%", async ({ page }) => {
    await page.goto("/partners");
    await expect(page).toHaveTitle(/Programa Partner/i);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", PARTNERS_CANONICAL);

    const hero = page.locator("section").first();
    await expect(hero.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(hero.getByText("US$ 150", { exact: true })).toBeVisible();
    await expect(hero.getByText("US$ 400", { exact: true })).toBeVisible();
    await expect(hero.getByText("US$ 200", { exact: true })).toHaveCount(0);
    await expect(hero.getByText("15%", { exact: true })).toHaveCount(0);

    const body = await page.locator("body").innerText();
    expect(body).toMatch(/US\$ 150/);
    expect(body).toMatch(/US\$ 400/);
    expect(body).not.toMatch(/US\$ 200/);
    expect(body).toMatch(/partner @clinera\.io/);
    expect(body).toMatch(/Notebook o tablet/i);
    expect(body).toMatch(/Equipo comercial/i);
    expect(body).toMatch(/CRM/i);
    expect(body).toMatch(/No cierres solo/);
    expect(body).not.toMatch(/cieras/);
    expect(body).not.toMatch(/\btenés\b/i);
    expect(body).not.toMatch(/15%/);
    expect(body).not.toMatch(/Permanente para todos los clientes/);
    expect(body).not.toMatch(/comisión del 10%/i);
    expect(body).not.toMatch(/4 historias al mes/);
    expect(body).not.toMatch(/1 reel al mes/);
    expect(body).not.toMatch(/10% de descuento/);
    expect(body).toMatch(/Convenio doctores/i);
    expect(body).toMatch(/3 meses/);
    expect(body).toMatch(/30%/);
    expect(body).toMatch(/solo el bono/i);
    expect(body).toMatch(/No es automático/);
    expect(body).toMatch(/Sitio web remodelado/);
    expect(body).toMatch(/Vortex/);

    const apply = page.getByRole("link", { name: /Aplicar al programa/ }).first();
    await expect(apply).toHaveAttribute("href", PARTNERS_CTA_HREF);
    await apply.click();
    await expect(page).toHaveURL(/#aplicar/);
    const applySection = page.locator("#aplicar");
    await expect(applySection.getByLabel(/nombre/i)).toBeVisible();
    await expect(applySection.locator("select")).toBeVisible();
  });

  test("convenio doctores se postula en un wizard propio, no el de agendar", async ({
    page,
  }) => {
    const enviados: unknown[] = [];
    await page.route("**/api/convenio-doctores", async (route) => {
      enviados.push(route.request().postDataJSON());
      await route.fulfill({ json: { ok: true } });
    });

    await page.goto("/partners");
    const block = page.locator("#convenio-doctores");
    await expect(block.getByRole("heading", { level: 2 })).toContainText("Postula");
    await expect(block).toContainText("Sitio web remodelado");
    await expect(block).toContainText("Clinera Vortex 3 meses");
    await expect(block).toContainText("Bonos por referido");
    await expect(block).toContainText("30% después de 3 meses");
    await expect(block).toContainText("No es automático");
    await expect(block.getByRole("link", { name: /Cómo funciona el convenio/ })).toHaveAttribute(
      "href",
      CONVENIO_DOCTORES_PATH,
    );
    await expect(block.getByRole("link", { name: /Aplicar al programa/ })).toHaveCount(0);
    await expect(block.getByRole("link", { name: /^Postula/ })).toHaveCount(0);

    await block.getByRole("button", { name: /^Postula/ }).click();
    await expect(block.getByText("Paso 1 de 3")).toBeVisible();
    await block.getByLabel("Tu nombre").fill("María Soto");
    await block.getByRole("button", { name: /Continuar/ }).click();
    await expect(block.getByText("Paso 2 de 3")).toBeVisible();
    await block.getByLabel("Tu correo").fill("maria@clinica.cl");
    await block.getByRole("button", { name: /Continuar/ }).click();
    await expect(block.getByText("Paso 3 de 3")).toBeVisible();
    await block
      .getByLabel("Motivo")
      .fill("Soy dermatóloga en Temuco y no tengo sitio web.");
    await block.getByRole("button", { name: /Enviar postulación/ }).click();

    await expect(block.getByRole("heading", { name: "Postulación enviada" })).toBeVisible();
    expect(enviados).toEqual([
      {
        nombre: "María Soto",
        correo: "maria@clinica.cl",
        motivo: "Soy dermatóloga en Temuco y no tengo sitio web.",
      },
    ]);
    await expect(page).not.toHaveURL(/\/reunion-comercial/);
    await expect(page).not.toHaveURL(/\/agenda/);
  });

  test("el ancla #convenio-doctores abre el wizard en el bloque", async ({ page }) => {
    await page.goto("/partners#convenio-doctores");
    const block = page.locator("#convenio-doctores");
    await expect(block.getByText("Paso 1 de 3")).toBeVisible();
    await expect(block.getByLabel("Tu nombre")).toBeVisible();
  });

  test("muestra el diagrama de Clinera", async ({ page }) => {
    await page.goto("/partners");
    await expect(page.getByText("Toda tu operación la alimenta")).toBeVisible();
    await expect(page.getByText("Clinera actúa")).toBeVisible();
    await expect(page.getByText("Contexto · decisiones · acción")).toBeVisible();
  });

  test("el botón Ver presentación abre el deck de partners", async ({ page }) => {
    await page.goto("/partners");
    const deck = page.getByRole("link", { name: /Ver presentación/ }).first();
    await expect(deck).toHaveAttribute("href", PARTNERS_PRESENTATION_HREF);
    await deck.click();
    await expect(page).toHaveURL(/\/presentacion-partners/);
    await expect(page.locator(".slide.active")).toContainText("US$ 150");
    await expect(page.locator("body")).toContainText("US$ 400");
    await expect(page.locator("body")).not.toContainText("US$ 200");
    await expect(page.locator("body")).toContainText("partner @clinera.io");
    await expect(page.locator("body")).toContainText("Notebook o tablet");
    await expect(page.locator("body")).not.toContainText("15%");
    await expect(page.locator("body")).not.toContainText("4 historias al mes");
    await expect(page.locator("#convenio-doctores")).toContainText("partner médico");
    await expect(page.locator("#convenio-doctores")).toContainText("Vortex");
    await expect(page.locator("#convenio-doctores")).toContainText("3 meses");
    await expect(page.locator("#convenio-doctores")).toContainText("30%");
    await expect(page.locator("#convenio-doctores")).toContainText("US$ 150");
    await expect(page.locator("#convenio-doctores")).toContainText("solo el bono");
    await expect(page.locator("#convenio-doctores")).toContainText("Partner de @clinera.io");
    await expect(page.locator("#convenio-doctores a.partner-cta-primary")).toHaveAttribute(
      "href",
      CONVENIO_DOCTORES_REQUISITOS_HREF,
    );
  });

  test("el footer apunta a /partners, no a /agencias", async ({ page }) => {
    await page.goto("/partners");
    const partners = page.locator("footer").getByRole("link", { name: "Partners" });
    await expect(partners).toHaveAttribute("href", "/partners");
    await expect(
      page.locator("footer").getByRole("link", { name: "Convenio doctores" }),
    ).toHaveAttribute("href", CONVENIO_DOCTORES_PATH);
    await expect(
      page.locator("footer").getByRole("link", { name: "Agencias" }),
    ).toHaveCount(0);
  });
});

test.describe("redirect /agencias → /partners", () => {
  test("308 permanente y el visitante aterriza en /partners", async ({
    page,
    request,
  }) => {
    const res = await request.get("/agencias", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toBe("/partners");

    await page.goto("/agencias");
    expect(new URL(page.url()).pathname).toBe("/partners");
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("redirect /presentacion-agencia → /presentacion-partners", () => {
  test("308 permanente hacia el deck nuevo", async ({ page, request }) => {
    const res = await request.get("/presentacion-agencia", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toBe("/presentacion-partners");

    await page.goto("/presentacion-agencia");
    expect(new URL(page.url()).pathname).toBe("/presentacion-partners");
    await expect(page.locator(".slide.active")).toContainText("US$ 150");
    await expect(page.locator("body")).toContainText("US$ 400");
    await expect(page.locator("body")).not.toContainText("15%");
  });
});

test.describe("/api/convenio-doctores", () => {
  test("un body vacío se rechaza; el SMTP no se filtra al cliente", async ({
    request,
    page,
  }) => {
    const res = await request.post("/api/convenio-doctores", { data: {} });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.errores.length).toBeGreaterThan(0);
    expect(JSON.stringify(json)).not.toContain("SMTP_PASS");

    await page.goto("/partners");
    const html = await page.content();
    expect(html).not.toContain("SMTP_PASS");
    expect(html).not.toContain("SMTP_USER");
  });
});


test.describe("formulario aplicar partner", () => {
  test("envía nombre + celular a /api/partner-apply", async ({ page }) => {
    const enviados: unknown[] = [];
    await page.route("**/api/partner-apply", async (route) => {
      enviados.push(route.request().postDataJSON());
      await route.fulfill({ json: { ok: true } });
    });

    await page.goto("/partners#aplicar");
    const block = page.locator("#aplicar");
    await block.getByLabel(/nombre/i).fill("Ana Pérez");
    await block.locator("select").selectOption("+52");
    await block.getByLabel(/celular|whatsapp/i).fill("5512345678");
    await block.getByRole("button", { name: /enviar/i }).click();
    await expect(block.getByText(/solicitud enviada/i)).toBeVisible();
    expect(enviados).toEqual([
      { nombre: "Ana Pérez", prefix: "+52", telefono: "5512345678" },
    ]);
  });
});

test.describe("página /convenio-doctores", () => {
  test("el doctor ya calificado ve beneficios, requisitos y el ejemplo de KM", async ({
    page,
  }) => {
    await page.goto(CONVENIO_DOCTORES_PATH);
    await expect(page).toHaveTitle(/Convenio doctores/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      CONVENIO_DOCTORES_CANONICAL,
    );

    await expect(page.getByRole("heading", { level: 1 })).toContainText("partner médico");
    await expect(page.getByRole("heading", { name: /Cuatro cosas/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sitio web remodelado" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Clinera Vortex 3 meses" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Bonos por referido" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "30% después de 3 meses" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Tres cosas/i })).toBeVisible();
    await expect(page.locator("#requisitos")).toContainText("Utilizar activamente la herramienta");
    await expect(page.locator("#requisitos")).toContainText("Recomendarla");
    await expect(page.locator("#requisitos")).toContainText(CONVENIO_DOCTORES_BIO_LINE);
    await expect(
      page.getByRole("img", { name: /KM Estética/i }),
    ).toBeVisible();
    await expect(page.getByText("Toda tu operación la alimenta")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Postula/ })).toHaveCount(0);
    await expect(page.getByText("Paso 1 de 3")).toHaveCount(0);

    const body = await page.locator("body").innerText();
    expect(body).toMatch(/US\$ 150/);
    expect(body).toMatch(/US\$ 400/);
    expect(body).not.toMatch(/US\$ 200/);
    expect(body).not.toMatch(/15%/);
    expect(body).not.toMatch(/Permanente para todos los clientes/);
  });

  test("el ancla #requisitos muestra el ejemplo de bio, no el wizard", async ({ page }) => {
    await page.goto(CONVENIO_DOCTORES_REQUISITOS_HREF);
    const block = page.locator("#requisitos");
    await expect(block.getByRole("heading", { name: /Tres cosas/i })).toBeVisible();
    await expect(block.getByRole("img", { name: /KM Estética/i })).toBeVisible();
    await expect(block.getByText("Paso 1 de 3")).toHaveCount(0);
    await expect(page).not.toHaveURL(/\/agenda/);
  });
});

