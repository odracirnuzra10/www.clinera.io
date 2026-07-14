import { test, expect, Page, Request } from "@playwright/test";

/**
 * E2E para el wizard de calificación de /ventas y /hablar-con-ventas.
 * Flujo nuevo (4 pasos): Software → Tamaño (calificación) → Contacto → Agenda.
 *
 * Verifica:
 *  - Paso 1: opciones de software + microcopy condicional.
 *  - Paso 2: chips de tamaño + regla de calificación.
 *  - Flujo CALIFICA: card de inversión, CTA "Agenda con tu ingeniero", payload n8n.
 *  - Flujo NO CALIFICA: pantalla de waitlist + botón WhatsApp con mensaje precargado.
 *
 * Nota: el request al webhook se DEJA PASAR a producción para validar downstream.
 * Por eso prefijamos los identificadores con [E2E TEST].
 */

const WEBHOOK_URL =
  "https://n8n.oacg.cl/webhook/088a2cfe-5c93-4a4b-a4e5-ac2617979ea5";

const WA_NUMBER = "56985581524";
const WAITLIST_WA_MESSAGE =
  "Hola, mi clínica aún no llega al tamaño mínimo de Clinera. Quiero quedar en la lista de espera para cuando crezcamos.";

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

    // Paso 2 — Tamaño (2 sucursales → califica por una sola condición)
    await expect(page.getByRole("heading", { level: 2 })).toContainText(/tamaño/i);
    await page.getByRole("button", { name: "2", exact: true }).click();
    await page.getByRole("button", { name: "100–200", exact: true }).click();
    await page.getByRole("button", { name: "1–3", exact: true }).click();
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
    expect(contactLead!.sucursales).toBe("2");
    expect(contactLead!.pacientes_mes).toBe("100_200");
    expect(contactLead!.profesionales).toBe("1_3");
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

  test("flujo NO CALIFICA: Reservo + clínica chica → waitlist + WhatsApp", async ({ page }) => {
    const hits = recordWebhookHits(page);

    await page.goto("/hablar-con-ventas", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    // Paso 1 — Software
    await page.getByRole("button", { name: "Reservo", exact: true }).click();
    await page.getByRole("button", { name: /Continuar/i }).click();

    // Paso 2 — Tamaño (1 sucursal + <100 + 1–3 → NO califica)
    await expect(page.getByRole("heading", { level: 2 })).toContainText(/tamaño/i);
    const reqPromise = page.waitForRequest(
      (r) => r.url() === WEBHOOK_URL && r.method() === "POST",
      { timeout: 8000 },
    );
    await page.getByRole("button", { name: "1", exact: true }).click();
    await page.getByRole("button", { name: "Menos de 100", exact: true }).click();
    await page.getByRole("button", { name: "1–3", exact: true }).click();
    await page.getByRole("button", { name: /Continuar/i }).click();
    await reqPromise;
    await page.waitForTimeout(400);

    // Pantalla de waitlist
    await expect(page.getByRole("heading", { level: 2 })).toContainText(
      /Clinera aún no es para tu clínica/i,
    );
    const waLink = page.getByRole("link", { name: /Quiero quedar en la lista de espera/i });
    await expect(waLink).toBeVisible();
    const href = await waLink.getAttribute("href");
    expect(href).toBe(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WAITLIST_WA_MESSAGE)}`);
    await expect(
      page.getByText("Te avisaremos cuando abramos cupos para clínicas como la tuya."),
    ).toBeVisible();

    // Lead registrado como waitlist con atributos de tamaño
    const waitlistLead = hits.find((h) => h.lead_status === "waitlist");
    expect(waitlistLead, "esperaba lead de waitlist").toBeTruthy();
    expect(waitlistLead!.booking_status).toBe("waitlist");
    expect(waitlistLead!.califica).toBe(false);
    expect(waitlistLead!.software_actual).toBe("reservo");
    expect(waitlistLead!.sucursales).toBe("1");
    expect(waitlistLead!.pacientes_mes).toBe("lt100");
    expect(waitlistLead!.profesionales).toBe("1_3");

    console.log("=== E2E LEAD WAITLIST ===");
    console.log("event_id:", waitlistLead!.event_id);
    console.log("=========================");
  });
});
