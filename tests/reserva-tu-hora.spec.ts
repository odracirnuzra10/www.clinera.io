// /reserva-tu-hora — destino del Instant Form de Meta.
//
// Lo que se prueba es la razón de ser de la página: que un lead que YA dejó sus
// datos en el formulario de Meta llegue directo al calendario, que al confirmar
// la hora salga UN MQL de US$ 10 (que es el peldaño que Meta necesita para
// «maximizar clientes cualificados»), y que el `leadgen_id` sobreviva hasta el
// CRM. Y el caso opuesto: sin datos en la URL, la página los pide en vez de
// mandar una reserva vacía.
//
// La red va 100 % mockeada (patrón de `agenda-wizard.spec.ts` y
// `ventas-meta-events.spec.ts`): nada toca n8n ni Meta de verdad.

import { expect, test, type Page, type Request } from "@playwright/test";

const HEX64 = /^[a-f0-9]{64}$/;

type CapiBody = {
  event_name?: string;
  event_id?: string;
  custom_data?: Record<string, unknown>;
  user_data?: { em?: string; ph?: string };
};

type WizardBody = {
  lead_stage?: string;
  leadgen_id?: string;
  email?: string;
  celular?: string;
  cal_date?: string;
  fuente?: string;
  lead_priority?: string;
};

function nonce() {
  return `e2e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

/** Stub de fbq que graba las llamadas y frena al loader oficial. */
async function installFbqRecorder(page: Page) {
  await page.addInitScript(() => {
    const calls: { name: string; eventId?: string }[] = [];
    (window as unknown as { __fbqCalls: typeof calls }).__fbqCalls = calls;
    const rec = ((...args: unknown[]) => {
      if (args[0] === "track") {
        const opts = args[3] as { eventID?: string } | undefined;
        calls.push({ name: String(args[1]), eventId: opts?.eventID });
      }
    }) as unknown as { (...a: unknown[]): void; loaded?: boolean; queue?: unknown[] };
    rec.loaded = true;
    rec.queue = [];
    (window as unknown as { fbq: typeof rec }).fbq = rec;
    (window as unknown as { _fbq: typeof rec })._fbq = rec;
  });
}

function grabarCapi(page: Page) {
  const hits: CapiBody[] = [];
  page.on("request", (req: Request) => {
    if (!req.url().includes("/api/meta/capi") || req.method() !== "POST") return;
    try {
      hits.push(JSON.parse(req.postData() || "{}"));
    } catch {
      /* noop */
    }
  });
  return hits;
}

function grabarWizard(page: Page) {
  const hits: WizardBody[] = [];
  page.on("request", (req: Request) => {
    if (!req.url().includes("/api/wizard") || req.method() !== "POST") return;
    try {
      hits.push(JSON.parse(req.postData() || "{}"));
    } catch {
      /* noop */
    }
  });
  return hits;
}

async function mockRed(page: Page) {
  await page.route("https://n8n.oacg.cl/webhook/clinera-agenda-config", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, duracionMin: 45 }),
    }),
  );
  await page.route(/n8n\.oacg\.cl\/webhook\/clinera-agenda-disponibilidad/, (route) => {
    const url = new URL(route.request().url());
    if (url.searchParams.has("desde")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ dias: {} }),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          horariosDisponibles: [
            { horaInicio: "10:00", duracionMin: 45, profesional: { id: "a", name: "Ana" } },
            { horaInicio: "11:00", duracionMin: 45, profesional: { id: "a", name: "Ana" } },
          ],
        },
      }),
    });
  });
  await page.route(/n8n\.oacg\.cl\/webhook\/clinera-agenda-turno/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    }),
  );
  await page.route("**/api/wizard", (route) =>
    route.request().method() === "POST"
      ? route.fulfill({ status: 200, contentType: "application/json", body: "{}" })
      : route.continue(),
  );
  await page.route("**/api/meta/capi", (route) =>
    route.request().method() === "POST"
      ? route.fulfill({ status: 200, contentType: "application/json", body: "{}" })
      : route.continue(),
  );
  await page.route(/connect\.facebook\.net/, (route) => route.abort());
}

const LEADGEN_ID = "2207921869776121";

function urlConDatos(id: string) {
  const p = new URLSearchParams({
    nombre: `[E2E TEST] ${id}`,
    email: `${id}@e2e.clinera.io`,
    telefono: "+56912345678",
    clinica: `[E2E TEST] Clinica ${id}`,
    tamano: "P_500_1000",
    leadgen_id: LEADGEN_ID,
  });
  return `/reserva-tu-hora?${p.toString()}`;
}

test.describe("/reserva-tu-hora — destino del Instant Form", () => {
  test("con los datos del formulario va DIRECTO al calendario, sin volver a pedirlos", async ({ page }) => {
    const id = nonce();
    await mockRed(page);
    await page.goto(urlConDatos(id), { waitUntil: "domcontentloaded" });

    // El calendario es lo primero: si volviera a pedir nombre/correo/teléfono,
    // estaríamos cobrando dos veces el mismo dato y perdiendo al lead.
    await expect(page.getByRole("heading", { name: /Elige el día y la hora/i })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByLabel("Tu nombre")).toHaveCount(0);

    // Sin paso previo, «Volver» no lleva a ninguna parte: no se muestra.
    await expect(page.locator(".ventas-back-btn")).toBeHidden();
  });

  test("al confirmar la hora manda UN MQL de US$ 10 y lleva el leadgen_id al CRM", async ({ page }) => {
    const id = nonce();
    await installFbqRecorder(page);
    await mockRed(page);
    const capi = grabarCapi(page);
    const wizard = grabarWizard(page);

    await page.goto(urlConDatos(id), { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Elige el día y la hora/i })).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole("button", { name: /10:00/ }).first().click();
    await page.getByRole("button", { name: /Confirmar reunión/i }).click();
    await expect(page.getByRole("heading", { name: /tu hora quedó reservada/i })).toBeVisible({
      timeout: 15000,
    });
    await page.waitForTimeout(600);

    // --- El MQL: uno solo, a 10 USD, con el contacto hasheado ---
    const mqls = capi.filter((c) => c.event_name === "MQL");
    expect(mqls).toHaveLength(1);
    expect(mqls[0].custom_data?.value).toBe(10);
    expect(mqls[0].custom_data?.currency).toBe("USD");
    expect(mqls[0].user_data?.em).toMatch(HEX64);
    expect(mqls[0].user_data?.ph).toMatch(HEX64);
    // El tramo declarado en el formulario tiene que llegar: es lo que separa
    // una clínica de 1.000 pacientes de una de 200 a los ojos de Meta.
    expect(mqls[0].custom_data?.lead_priority).toBe("high");
    expect(mqls[0].custom_data?.prioridad_alta).toBe(true);
    // Sin PII en custom_data.
    expect(JSON.stringify(mqls[0].custom_data)).not.toContain("@");

    // El Pixel manda el MQL con el MISMO event_id → Meta cuenta UNA conversión.
    const fbq = await page.evaluate(
      () => (window as unknown as { __fbqCalls: { name: string; eventId?: string }[] }).__fbqCalls,
    );
    const pixelMqls = fbq.filter((c) => c.name === "MQL");
    expect(pixelMqls).toHaveLength(1);
    expect(pixelMqls[0].eventId).toBe(mqls[0].event_id);

    // --- El CRM ---
    const confirmaciones = wizard.filter((w) => w.lead_stage === "booking_confirmed");
    expect(confirmaciones).toHaveLength(1);
    // Sin esto Meta no puede atar la venta al lead del anuncio y «maximizar
    // clientes cualificados» se queda sin señal.
    expect(confirmaciones[0].leadgen_id).toBe(LEADGEN_ID);
    expect(confirmaciones[0].cal_date).toContain("10:00");
    expect(confirmaciones[0].fuente).toContain("/reserva-tu-hora");

    // El lead del Instant Form YA existe en Baserow y Twenty: darlo de alta otra
    // vez sería una segunda llamada de la IA al mismo teléfono.
    expect(wizard.filter((w) => w.lead_stage === "contact")).toHaveLength(0);
  });

  test("sin datos en la URL los pide, y recién ahí muestra el calendario", async ({ page }) => {
    const id = nonce();
    await mockRed(page);
    const wizard = grabarWizard(page);

    await page.goto("/reserva-tu-hora", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Tu nombre")).toBeVisible();

    // Con el formulario incompleto no se llega al calendario: el webhook del
    // turno necesita nombre, correo y teléfono.
    await page.getByRole("button", { name: /Ver horas disponibles/i }).click();
    // Por texto: Next monta su propio `role="alert"` (el anunciador de rutas),
    // así que `getByRole("alert")` matchea dos elementos, y para `role=alert`
    // el nombre accesible no sale del contenido.
    await expect(page.getByText(/Revisa tu nombre|Ingresa tu WhatsApp|dígito/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /Elige el día y la hora/i })).toHaveCount(0);

    await page.getByLabel("Tu nombre").fill(`[E2E TEST] ${id}`);
    await page.getByLabel("Correo").fill(`${id}@e2e.clinera.io`);
    await page.getByLabel("WhatsApp").fill("912345678");
    await page.getByRole("button", { name: /Ver horas disponibles/i }).click();

    await expect(page.getByRole("heading", { name: /Elige el día y la hora/i })).toBeVisible({
      timeout: 15000,
    });
    await page.waitForTimeout(400);

    // Este lead NO vino del Instant Form, así que acá sí hay que darlo de alta.
    const contactos = wizard.filter((w) => w.lead_stage === "contact");
    expect(contactos).toHaveLength(1);
    // Chile por defecto → E.164 +569…
    expect(contactos[0].celular).toBe("+56912345678");
  });

  test("valida largo por país: CL 9, MX 10; rechaza dígitos de menos", async ({ page }) => {
    const id = nonce();
    await mockRed(page);

    await page.goto("/reserva-tu-hora", { waitUntil: "domcontentloaded" });
    await page.getByLabel("Tu nombre").fill(`[E2E TEST] ${id}`);
    await page.getByLabel("Correo").fill(`${id}@e2e.clinera.io`);

    // Chile: 8 dígitos no alcanza.
    await page.getByLabel("WhatsApp").fill("91234567");
    await page.getByRole("button", { name: /Ver horas disponibles/i }).click();
    await expect(page.getByText(/Falta 1 dígito.*Chile/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /Elige el día y la hora/i })).toHaveCount(0);

    // Pegar con +56 → normaliza a 9 locales y pasa.
    await page.getByLabel("WhatsApp").fill("+56912345678");
    await expect(page.getByLabel("WhatsApp")).toHaveValue("9 1234 5678");

    // México: cambiar prefijo y exigir 10.
    await page.getByLabel("Código de país").selectOption("+52");
    await page.getByLabel("WhatsApp").fill("551234567");
    await page.getByRole("button", { name: /Ver horas disponibles/i }).click();
    await expect(page.getByText(/Falta 1 dígito.*México/i)).toBeVisible();

    await page.getByLabel("WhatsApp").fill("5512345678");
    await page.getByRole("button", { name: /Ver horas disponibles/i }).click();
    await expect(page.getByRole("heading", { name: /Elige el día y la hora/i })).toBeVisible({
      timeout: 15000,
    });
  });

  test("ofrece Uruguay, Estados Unidos y Puerto Rico; US manda E.164 +1", async ({ page }) => {
    const id = nonce();
    await mockRed(page);
    const wizard = grabarWizard(page);

    await page.goto("/reserva-tu-hora", { waitUntil: "domcontentloaded" });
    const pais = page.getByLabel("Código de país");
    await expect(pais.locator("option[value='+598']")).toHaveCount(1);
    await expect(pais.locator("option[value='+1']")).toHaveCount(1);
    await expect(pais.locator("option[value='PR']")).toHaveCount(1);

    await page.getByLabel("Tu nombre").fill(`[E2E TEST] ${id}`);
    await page.getByLabel("Correo").fill(`${id}@e2e.clinera.io`);
    await pais.selectOption("+1");
    await page.getByLabel("WhatsApp").fill("4155551234");
    await page.getByRole("button", { name: /Ver horas disponibles/i }).click();

    await expect(page.getByRole("heading", { name: /Elige el día y la hora/i })).toBeVisible({
      timeout: 15000,
    });
    await page.waitForTimeout(400);

    const contactos = wizard.filter((w) => w.lead_stage === "contact");
    expect(contactos).toHaveLength(1);
    expect(contactos[0].celular).toBe("+14155551234");
  });
});
