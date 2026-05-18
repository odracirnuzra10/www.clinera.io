import { test, expect, Page, Request } from "@playwright/test";

/**
 * E2E para el widget de leads de /ventas y /hablar-con-ventas.
 * Verifica el nuevo step de rol, el microcopy condicional, el CTA, y que
 * el payload al webhook n8n incluya lead_role + solicitante.
 *
 * Nota: el request al webhook se DEJA PASAR a producción para validar
 * downstream (Monday "Solicitante", Loops, Clinera DB). Por eso prefijamos
 * todos los identificadores con [E2E TEST] para identificarlos fácil.
 */

const WEBHOOK_URL =
  "https://clinerasoftware.app.n8n.cloud/webhook/088a2cfe-5c93-4a4b-a4e5-ac2617979ea5";

type LeadPayload = {
  event_id: string;
  lead_role: string;
  solicitante: string;
  nombre: string;
  nombre_clinica: string;
  email: string;
  celular: string;
  celular_prefix: string;
  celular_digits: string;
  challenge_id: string;
  challenge_label: string;
  migration_intent?: string;
  monday_initial_status?: string;
  lead_source?: string;
  booking_status?: string;
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

async function walkToContact(page: Page, role: "Dueño/a" | "Administrador/a" | "Doctor/a o Profesional" | "Recepción / Asistente") {
  // Step 1 — Migration qualification (priority option)
  await page.getByRole("button", { name: /No tenemos software/i }).click();
  // Step 2 — Challenge
  await page.getByRole("button", { name: /Automatizar respuestas/i }).click();
  // Step 3 — Role (nuevo)
  await expect(page.getByRole("heading", { level: 2 })).toContainText(/rol/i);
  await page.getByRole("button", { name: new RegExp(role.replace("/", "\\/"), "i") }).click();
  // Step 4 — Contact
  await expect(page.getByRole("heading", { level: 2 })).toContainText(/datos/i);
}

test.describe("Ventas lead — rol + payload n8n", () => {
  test("flujo Dueño/a manda lead_role=owner + solicitante a n8n", async ({ page }) => {
    const nonce = makeNonce();
    const hits = recordWebhookHits(page);

    await page.goto("/ventas", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    await walkToContact(page, "Dueño/a");

    // Microcopy default (no recepción)
    await expect(page.getByText("Tu WhatsApp personal")).toBeVisible();
    await expect(
      page.getByText("Te escribimos directo a ti, no a recepción. Coordinar la demo toma 2 minutos."),
    ).toBeVisible();

    // Form fields
    await page.locator('input[autocomplete="name"]').fill(`[E2E TEST] ${nonce} Dueño`);
    await page.locator('input[autocomplete="organization"]').fill(`[E2E TEST] Clinica ${nonce}`);
    await page.locator('input[autocomplete="tel-national"]').fill("9 1234 5678");
    await page.locator('input[autocomplete="email"]').fill(`${nonce}@e2e.clinera.io`);

    // CTA actualizado — pre-armar wait ANTES del click (la fetch dispara sync)
    const cta = page.getByRole("button", { name: /Agenda mi demo/i });
    await expect(cta).toBeEnabled();
    const reqPromise = page.waitForRequest(
      (r) => r.url() === WEBHOOK_URL && r.method() === "POST",
      { timeout: 8000 },
    );
    await cta.click();
    await reqPromise;
    await page.waitForTimeout(500);

    expect(hits.length, "esperaba ≥1 hit al webhook n8n").toBeGreaterThanOrEqual(1);
    const lead = hits[0];

    expect(lead.lead_role).toBe("owner");
    expect(lead.solicitante).toBe("Dueño/a");
    expect(lead.challenge_id).toBe("automatizar");
    expect(lead.migration_intent).toBe("no_software");
    expect(lead.monday_initial_status).toBe("no tiene software");
    expect(lead.nombre).toContain(nonce);
    expect(lead.email).toBe(`${nonce}@e2e.clinera.io`);
    expect(lead.celular).toBe("+56912345678");
    expect(lead.celular_prefix).toBe("+56");
    expect(lead.celular_digits).toBe("912345678");
    expect(lead.booking_status).toBe("pending");
    expect(lead.fuente).toContain("Landing /ventas");

    // Print para que el operador correlacione con Monday/n8n
    console.log("=== E2E LEAD SUBMITTED ===");
    console.log("nonce:", nonce);
    console.log("event_id:", lead.event_id);
    console.log("email:", lead.email);
    console.log("solicitante:", lead.solicitante);
    console.log("==========================");
  });

  test("flujo Recepción cambia label/helper a 'WhatsApp del dueño'", async ({ page }) => {
    const nonce = makeNonce();
    const hits = recordWebhookHits(page);

    await page.goto("/hablar-con-ventas", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    await walkToContact(page, "Recepción / Asistente");

    // Microcopy alterno
    await expect(page.getByText("WhatsApp del dueño o administrador")).toBeVisible();
    await expect(
      page.getByText("Necesitamos coordinar con quien toma la decisión. Pídele su número y vuelve."),
    ).toBeVisible();

    await page.locator('input[autocomplete="name"]').fill(`[E2E TEST] ${nonce} Recep`);
    await page.locator('input[autocomplete="organization"]').fill(`[E2E TEST] Clinica ${nonce}`);
    await page.locator('input[autocomplete="tel-national"]').fill("9 8765 4321");
    await page.locator('input[autocomplete="email"]').fill(`${nonce}@e2e.clinera.io`);

    const reqPromise = page.waitForRequest(
      (r) => r.url() === WEBHOOK_URL && r.method() === "POST",
      { timeout: 8000 },
    );
    await page.getByRole("button", { name: /Agenda mi demo/i }).click();
    await reqPromise;
    await page.waitForTimeout(500);

    expect(hits.length).toBeGreaterThanOrEqual(1);
    const lead = hits[0];
    expect(lead.lead_role).toBe("reception");
    expect(lead.solicitante).toBe("Recepción / Asistente");
    expect(lead.email).toBe(`${nonce}@e2e.clinera.io`);

    console.log("=== E2E LEAD (Recepción) ===");
    console.log("nonce:", nonce);
    console.log("event_id:", lead.event_id);
    console.log("============================");
  });
});
