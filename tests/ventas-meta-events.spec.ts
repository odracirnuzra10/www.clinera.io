import { test, expect, Page } from "@playwright/test";

/**
 * Eventos de Meta del wizard de /ventas — MQL · Waitlist · Contact.
 *
 * Red 100% MOCKEADA: el webhook n8n, el endpoint CAPI (/api/meta/capi) y wa.me
 * se interceptan con route.fulfill → NO se toca producción. El Pixel se stubea
 * antes de cargar la página para grabar las llamadas a fbq().
 *
 * Cubre los criterios de aceptación observables en runtime (1, 2, 3). Los
 * criterios 4 (MQL_TRIGGER = "qualified_step2") y 5 (cambiar umbrales) son
 * cambios de constantes en el código → se validan con Meta Test Events.
 */

const WEBHOOK_URL =
  "https://n8n.oacg.cl/webhook/088a2cfe-5c93-4a4b-a4e5-ac2617979ea5";

type FbqCall = { method: string; name: string; params: Record<string, unknown>; opts: Record<string, unknown> };
type CapiBody = {
  event_name: string;
  event_id: string;
  user_data?: { em?: string; ph?: string; fbp?: string; fbc?: string };
  custom_data?: Record<string, unknown>;
};

const HEX64 = /^[a-f0-9]{64}$/;

// Stub de fbq + capturador, inyectado ANTES de cualquier script de la página.
async function installFbqRecorder(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __fbqCalls: FbqCall[]; fbq: unknown; _fbq: unknown };
    w.__fbqCalls = [];
    const rec = function (...args: unknown[]) {
      const [method, name, params, opts] = args;
      if (method === "track" || method === "trackCustom") {
        w.__fbqCalls.push({
          method: method as string,
          name: name as string,
          params: (params as Record<string, unknown>) || {},
          opts: (opts as Record<string, unknown>) || {},
        });
      }
    } as unknown as Record<string, unknown>;
    rec.queue = [];
    rec.loaded = true;
    rec.version = "2.0";
    // El loader oficial hace `if (f.fbq) return;` → no descarga fbevents.js.
    w.fbq = rec;
    w._fbq = rec;
  });
}

// Mockea toda la red externa que el wizard toca, y graba los cuerpos CAPI.
function mockNetwork(page: Page) {
  const capi: CapiBody[] = [];
  page.route("**/api/meta/capi", async (route) => {
    try {
      capi.push(route.request().postDataJSON() as CapiBody);
    } catch {
      /* noop */
    }
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  // Webhook n8n: responder OK sin tocar producción (gatea el MQL contact_submitted).
  page.route(WEBHOOK_URL, (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }),
  );
  // Externos ruidosos/lentos: cortarlos.
  for (const glob of ["**/wa.me/**", "**/app.cal.com/**", "**/*.cal.com/**", "**/connect.facebook.net/**"]) {
    page.route(glob, (route) => route.fulfill({ status: 200, contentType: "text/html", body: "ok" }));
  }
  return capi;
}

async function fbqNames(page: Page): Promise<FbqCall[]> {
  return page.evaluate(() => (window as unknown as { __fbqCalls: FbqCall[] }).__fbqCalls);
}

async function fillContactStep(page: Page) {
  await page.locator('input[autocomplete="name"]').fill("QA Dueño");
  await page.locator('input[autocomplete="organization"]').fill("QA Clinica");
  await page.getByRole("button", { name: "Médica", exact: true }).click();
  await page.locator('input[autocomplete="tel-national"]').fill("9 1234 5678");
  await page.locator('input[autocomplete="email"]').fill("qa.dueno@example.com");
}

test.describe("Meta events — /ventas wizard", () => {
  // --- Criterio 1: lead calificado → UN MQL (Pixel+CAPI dedup) --------------
  test("calificado completa Paso 3 → un solo MQL con custom_data + user_data hasheado", async ({ page }) => {
    await installFbqRecorder(page);
    const capi = mockNetwork(page);

    await page.goto("/ventas", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    await page.getByRole("button", { name: "AgendaPro", exact: true }).click();
    await page.getByRole("button", { name: /Continuar/i }).click();

    await expect(page.getByRole("heading", { level: 2 })).toContainText(/tamaño/i);
    await page.getByRole("button", { name: "2", exact: true }).click(); // sucursales>=2 → califica
    await page.getByRole("button", { name: "100–200", exact: true }).click();
    await page.getByRole("button", { name: "1–3", exact: true }).click();
    await page.getByRole("button", { name: /Continuar/i }).click();

    await expect(page.getByRole("heading", { level: 2 })).toContainText(/datos/i);
    await fillContactStep(page);

    const mqlCapi = page.waitForRequest(
      (r) => {
        if (!r.url().includes("/api/meta/capi") || r.method() !== "POST") return false;
        try {
          return (r.postDataJSON() as CapiBody).event_name === "MQL";
        } catch {
          return false;
        }
      },
      { timeout: 8000 },
    );
    await page.getByRole("button", { name: /Agenda con tu ingeniero/i }).click();
    await mqlCapi;
    await page.waitForTimeout(300);

    // CAPI: exactamente un MQL
    const mqls = capi.filter((c) => c.event_name === "MQL");
    expect(mqls.length).toBe(1);
    const mql = mqls[0];

    // user_data hasheado (SHA-256 = 64 hex)
    expect(mql.user_data?.em).toMatch(HEX64);
    expect(mql.user_data?.ph).toMatch(HEX64);

    // custom_data: atributos de calificación, SIN PII
    expect(mql.custom_data?.software_actual).toBe("agendapro");
    expect(mql.custom_data?.sucursales).toBe("2");
    expect(mql.custom_data?.pacientes_mes).toBe("100_200");
    expect(mql.custom_data?.profesionales).toBe("1_3");
    expect(mql.custom_data?.prioridad_alta).toBe(false);
    expect(mql.custom_data?.pais).toBe("Chile");
    expect(JSON.stringify(mql.custom_data)).not.toContain("example.com"); // sin email

    // Pixel: exactamente un track MQL, con el MISMO event_id (dedup)
    const calls = await fbqNames(page);
    const pixelMqls = calls.filter((c) => c.name === "MQL");
    expect(pixelMqls.length).toBe(1);
    expect(pixelMqls[0].opts?.eventID).toBe(mql.event_id);
  });

  // --- Criterio 2: no calificado → sin MQL; Waitlist + Contact --------------
  test("no calificado → NO MQL; Waitlist al llegar; Contact al click de WhatsApp", async ({ page }) => {
    await installFbqRecorder(page);
    const capi = mockNetwork(page);

    await page.goto("/hablar-con-ventas", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    await page.getByRole("button", { name: "Reservo", exact: true }).click();
    await page.getByRole("button", { name: /Continuar/i }).click();

    const waitlistCapi = page.waitForRequest(
      (r) => {
        if (!r.url().includes("/api/meta/capi")) return false;
        try {
          return (r.postDataJSON() as CapiBody).event_name === "Waitlist";
        } catch {
          return false;
        }
      },
      { timeout: 8000 },
    );
    await page.getByRole("button", { name: "1", exact: true }).click();
    await page.getByRole("button", { name: "Menos de 100", exact: true }).click();
    await page.getByRole("button", { name: "1–3", exact: true }).click();
    await page.getByRole("button", { name: /Continuar/i }).click();
    await waitlistCapi;

    await expect(page.getByRole("heading", { level: 2 })).toContainText(/Clinera aún no es para tu clínica/i);

    // Waitlist llegó, con atributos y SIN PII
    const waitlist = capi.filter((c) => c.event_name === "Waitlist");
    expect(waitlist.length).toBe(1);
    expect(waitlist[0].custom_data?.software_actual).toBe("reservo");
    expect(waitlist[0].custom_data?.prioridad_alta).toBe(false);
    expect(waitlist[0].user_data?.em).toBeUndefined();
    expect(waitlist[0].user_data?.ph).toBeUndefined();

    // Ningún MQL
    expect(capi.some((c) => c.event_name === "MQL")).toBe(false);
    expect((await fbqNames(page)).some((c) => c.name === "MQL")).toBe(false);

    // Click WhatsApp → Contact (antes de abrir wa.me)
    const contactCapi = page.waitForRequest(
      (r) => {
        if (!r.url().includes("/api/meta/capi")) return false;
        try {
          return (r.postDataJSON() as CapiBody).event_name === "Contact";
        } catch {
          return false;
        }
      },
      { timeout: 8000 },
    );
    await page.getByRole("link", { name: /Quiero quedar en la lista de espera/i }).click();
    await contactCapi;

    const contact = capi.filter((c) => c.event_name === "Contact");
    expect(contact.length).toBe(1);
    const pixelContact = (await fbqNames(page)).filter((c) => c.name === "Contact");
    expect(pixelContact.length).toBe(1);
    expect(pixelContact[0].opts?.eventID).toBe(contact[0].event_id);
  });

  // --- Criterio 3: recarga tras submit NO genera un segundo MQL -------------
  test("recargar tras el submit NO dispara un segundo MQL (idempotencia por sesión)", async ({ page }) => {
    await installFbqRecorder(page);
    const capi = mockNetwork(page);

    async function runQualifiedFlow() {
      await page.getByRole("button", { name: "AgendaPro", exact: true }).click();
      await page.getByRole("button", { name: /Continuar/i }).click();
      await page.getByRole("button", { name: "2", exact: true }).click();
      await page.getByRole("button", { name: "100–200", exact: true }).click();
      await page.getByRole("button", { name: "1–3", exact: true }).click();
      await page.getByRole("button", { name: /Continuar/i }).click();
      await expect(page.getByRole("heading", { level: 2 })).toContainText(/datos/i);
      await fillContactStep(page);
      await page.getByRole("button", { name: /Agenda con tu ingeniero/i }).click();
    }

    // 1er submit → 1 MQL
    await page.goto("/ventas", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    const firstMql = page.waitForRequest(
      (r) => r.url().includes("/api/meta/capi") && (() => { try { return (r.postDataJSON() as CapiBody).event_name === "MQL"; } catch { return false; } })(),
      { timeout: 8000 },
    );
    await runQualifiedFlow();
    await firstMql;
    await page.waitForTimeout(300);
    expect(capi.filter((c) => c.event_name === "MQL").length).toBe(1);

    // Recarga (misma sesión/pestaña → sessionStorage persiste) + rehacer flujo
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    await runQualifiedFlow();
    await page.waitForTimeout(1500);

    // Sigue habiendo UN solo MQL en CAPI; y tras recarga no hubo MQL en el Pixel.
    expect(capi.filter((c) => c.event_name === "MQL").length).toBe(1);
    expect((await fbqNames(page)).some((c) => c.name === "MQL")).toBe(false);
  });
});
