import { test, expect, Page, Request } from "@playwright/test";

/**
 * E2E para el wizard de calificación de /ventas y /hablar-con-ventas.
 * Flujo (4 pasos): Software → Filtro (precio + tamaño) → Contacto → Agenda.
 * Toda clínica que completa el filtro califica (no hay lista de espera).
 *
 * Verifica:
 *  - Paso 1: opciones de software + microcopy condicional.
 *  - Paso 2: encuadre de precio + chips de tamaño.
 *  - Card de inversión, CTA "Agenda con tu ingeniero", payload n8n.
 *
 * Nota: el request al webhook se DEJA PASAR a producción para validar downstream.
 * Por eso prefijamos los identificadores con [E2E TEST].
 */

const WEBHOOK_URL =
  "https://n8n.oacg.cl/webhook/088a2cfe-5c93-4a4b-a4e5-ac2617979ea5";

type LeadPayload = {
  event_id: string;
  lead_stage?: string;
  lead_status?: string;
  booking_status?: string;
  software_actual?: string;
  software_actual_label?: string;
  sucursales?: string;
  pacientes_mes?: string;
  profesionales?: string;
  prioridad_alta?: boolean;
  califica?: boolean;
  nombre?: string;
  nombre_clinica?: string;
  email?: string;
  celular?: string;
  celular_prefix?: string;
  celular_digits?: string;
  tipo_clinica?: string;
  lead_source?: string;
  fuente?: string;
};

function makeNonce(): string {
  return `e2e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function recordWebhookHits(page: Page): LeadPayload[] {
  const hits: LeadPayload[] = [];
  page.on("request", (req: Request) => {
    if (req.url() !== WEBHOOK_URL || req.method() !== "POST") return;
    const body = req.postData();
    if (!body) return;
    try {
      hits.push(JSON.parse(body));
    } catch {
      /* noop */
    }
  });
  return hits;
}

test.describe("Ventas wizard — software + tamaño + payload n8n", () => {
  test("flujo CALIFICA: AgendaPro + 2 sucursales manda lead completo a n8n", async ({ page }) => {
    const nonce = makeNonce();
    const hits = recordWebhookHits(page);

    await page.goto("/ventas", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    // Paso 1 — Software
    await expect(page.getByRole("heading", { level: 2 })).toContainText(/software/i);
    await page.getByRole("button", { name: "AgendaPro", exact: true }).click();
    // Microcopy de migración estándar
    await expect(
      page.getByText("Nuestro ingeniero migra tus fichas, pacientes y tratamientos"),
    ).toBeVisible();
    await page.getByRole("button", { name: /Continuar/i }).click();

    // Paso 2 — Filtro (todos califican; 1 suc + 200–500 → prioridad_alta false)
    await expect(page.getByRole("heading", { level: 2 })).toContainText(/tu clínica/i);
    await expect(page.getByText("con planes desde")).toBeVisible();
    await page.getByRole("button", { name: "1", exact: true }).click();
    await page.getByRole("button", { name: "200–500", exact: true }).click();
    await page.getByRole("button", { name: /Continuar/i }).click();

    // Paso 3 — Contacto + card de inversión
    await expect(page.getByRole("heading", { level: 2 })).toContainText(/datos/i);
    await expect(page.getByText("Planes desde US$279/mes")).toBeVisible();
    await expect(page.getByText("Te escribimos directo a quien decide, no a recepción.")).toBeVisible();

    await page.locator('input[autocomplete="name"]').fill(`[E2E TEST] ${nonce} Dueño`);
    await page.locator('input[autocomplete="organization"]').fill(`[E2E TEST] Clinica ${nonce}`);
    await page.getByRole("button", { name: "Médica", exact: true }).click();
    await page.locator('input[autocomplete="tel-national"]').fill("9 1234 5678");
    await page.locator('input[autocomplete="email"]').fill(`${nonce}@e2e.clinera.io`);

    const cta = page.getByRole("button", { name: /Agenda con tu ingeniero/i });
    await expect(cta).toBeEnabled();
    const reqPromise = page.waitForRequest(
      (r) => {
        if (r.url() !== WEBHOOK_URL || r.method() !== "POST") return false;
        try {
          return JSON.parse(r.postData() || "{}").lead_stage === "contact";
        } catch {
          return false;
        }
      },
      { timeout: 8000 },
    );
    await cta.click();
    await reqPromise;
    await page.waitForTimeout(500);

    // Lead de tamaño (paso 2) + lead de contacto (paso 3)
    const sizeLead = hits.find((h) => h.lead_stage === "size_captured");
    const contactLead = hits.find((h) => h.lead_stage === "contact");

    expect(sizeLead, "esperaba lead de tamaño en el paso 2").toBeTruthy();
    expect(sizeLead!.califica).toBe(true);
    expect(sizeLead!.prioridad_alta).toBe(false);
    expect(sizeLead!.lead_status).toBe("qualified");

    expect(contactLead, "esperaba lead de contacto en el paso 3").toBeTruthy();
    expect(contactLead!.software_actual).toBe("agendapro");
    expect(contactLead!.sucursales).toBe("1");
    expect(contactLead!.pacientes_mes).toBe("200_500");
    expect(contactLead!.califica).toBe(true);
    expect(contactLead!.prioridad_alta).toBe(false);
    expect(contactLead!.nombre).toContain(nonce);
    expect(contactLead!.email).toBe(`${nonce}@e2e.clinera.io`);
    expect(contactLead!.celular).toBe("+56912345678");
    expect(contactLead!.booking_status).toBe("pending");
    expect(contactLead!.fuente).toContain("Landing /ventas");

    console.log("=== E2E LEAD CALIFICA ===");
    console.log("nonce:", nonce);
    console.log("event_id:", contactLead!.event_id);
    console.log("=========================");
  });

});
