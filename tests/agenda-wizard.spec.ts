import { expect, test, type Page, type Request } from "@playwright/test";

type LeadPayload = {
  event_id?: string;
  lead_stage?: string;
  nombre?: string;
  clinica?: string;
  nombre_clinica?: string;
  tamano_operacion?: string;
  tamano_operacion_label?: string;
  cargo?: string;
  sitio_web?: string;
  ciudad?: string;
  necesidad_principal?: string;
  necesidad_principal_label?: string;
  plan?: string;
  plan_interes?: string;
  fuente?: string;
  boxes_profesionales?: string;
};

function nonce() {
  return `e2e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function recordWizard(page: Page) {
  const hits: LeadPayload[] = [];
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

async function mockAgendaNativa(
  page: Page,
  slots: { horaInicio: string }[],
) {
  await page.route("**/webhook/clinera-agenda-config", (route) =>
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
        body: JSON.stringify({ dias: { "2099-01-01": 2 } }),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          horariosDisponibles: slots.map((s) => ({
            ...s,
            duracionMin: 45,
            profesional: { id: "a", name: "Ana" },
          })),
        },
      }),
    });
  });
  await page.route("**/api/wizard", (route) =>
    route.request().method() === "POST"
      ? route.fulfill({ status: 200, contentType: "application/json", body: "{}" })
      : route.continue(),
  );
}

async function completarClinica(page: Page, id: string) {
  await expect(page.getByRole("heading", { name: /Cuéntanos de tu clínica/i })).toBeVisible();
  await page.getByPlaceholder("Ej: Clínica Sonríe").fill(`[E2E TEST] Clinica ${id}`);
  await page.getByLabel("Especialidad").selectOption("medica");
  await page.getByRole("button", { name: "1–3", exact: true }).click();
  await page.getByRole("button", { name: "200 a 500", exact: true }).click();
  await page.getByRole("button", { name: /^Continuar$/ }).filter({ visible: true }).click();
}

async function completarContacto(page: Page, id: string, pais: "+56" | "+52" = "+56") {
  await expect(page.getByRole("heading", { name: "Tus datos de contacto" })).toBeVisible();
  await page.getByPlaceholder("Tu nombre completo").fill(`[E2E TEST] ${id}`);
  await page.getByLabel("Cargo").selectOption("Dueño / Fundador");
  await page.getByLabel("País del WhatsApp").selectOption(pais);
  await page.locator("#agenda-whatsapp").fill(pais === "+52" ? "5512345678" : "912345678");
  await page.getByPlaceholder("nombre@tuclinica.com").fill(`${id}@e2e.clinera.io`);
  await page.getByRole("button", { name: /Agenda una demostración/i }).click();
}

async function llegarAlCalendario(page: Page, id: string) {
  await page.goto("/agenda", { waitUntil: "domcontentloaded" });
  await completarClinica(page, id);
  await completarContacto(page, id);
  await expect(page.getByRole("heading", { name: /Elige el día y la hora/i })).toBeVisible({ timeout: 12000 });
}

test.describe("/agenda — wizard Hebe + agendador Clinera", () => {
  test("el titular es la propuesta de valor y no pide elegir plan", async ({ page }) => {
    await page.goto("/agenda", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { level: 1, name: /Automatiza el WhatsApp y las citas de tu clínica con inteligencia artificial/i }),
    ).toBeVisible();
    await expect(page.getByText(/Planes desde USD 279/).first()).toBeVisible();
    await expect(page.getByText(/Cuál plan te interesa/i)).toHaveCount(0);
    await expect(page.getByRole("link", { name: /política de privacidad/i })).toBeVisible();
  });

  test("tres pasos: clínica, contacto y calendario; manda boxes y tamaño al webhook", async ({ page }) => {
    const id = nonce();
    const hits = recordWizard(page);

    await page.goto("/agenda", { waitUntil: "domcontentloaded" });

    // El paso 1 no avanza sin boxes ni volumen.
    await page.getByPlaceholder("Ej: Clínica Sonríe").fill(`[E2E TEST] Clinica ${id}`);
    await page.getByLabel("Especialidad").selectOption("medica");
    await page.getByRole("button", { name: /^Continuar$/ }).filter({ visible: true }).click();
    await expect(page.getByRole("heading", { name: /Cuéntanos de tu clínica/i })).toBeVisible();

    await page.getByRole("button", { name: "4–6", exact: true }).click();
    await expect(page.getByRole("button", { name: "4–6", exact: true })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "200 a 500", exact: true }).click();
    await page.getByRole("button", { name: /^Continuar$/ }).filter({ visible: true }).click();

    await completarContacto(page, id);
    await expect(
      page.getByRole("heading", { name: /Elige (el día y la hora|profesional y horario)/i }),
    ).toBeVisible({ timeout: 12000 });

    await expect.poll(() => hits.some((h) => h.lead_stage === "contact"), { timeout: 12000 }).toBeTruthy();
    const contact = hits.find((h) => h.lead_stage === "contact");
    expect(contact?.nombre_clinica || contact?.clinica).toContain(id);
    expect(contact?.tamano_operacion).toBe("vol_200_500");
    expect(contact?.boxes_profesionales).toBe("4_6");
    expect(contact?.cargo).toBe("Dueño / Fundador");
    expect(contact?.fuente).toContain("/agenda");
  });

  test("no ofrece Dental ni menos de 200 pacientes", async ({ page }) => {
    await page.goto("/agenda", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Especialidad").locator('option[value="dental"]')).toHaveCount(0);
    await expect(page.getByLabel("Especialidad").locator("option", { hasText: /dental/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Menos de 200/ })).toHaveCount(0);
  });

  test("México: el teléfono se valida con +52 y viaja en E.164", async ({ page }) => {
    const id = nonce();
    const hits = recordWizard(page);
    await page.goto("/agenda", { waitUntil: "domcontentloaded" });
    await completarClinica(page, id);
    await completarContacto(page, id, "+52");
    await expect.poll(() => hits.some((h) => h.lead_stage === "contact"), { timeout: 12000 }).toBeTruthy();
    const contact = hits.find((h) => h.lead_stage === "contact") as LeadPayload & { celular?: string };
    expect(contact.celular).toBe("+525512345678");
  });
});

test.describe("/agenda — no ofrece madrugada UTC", () => {
  test.use({ timezoneId: "America/Santiago" });

  test("oculta 01:45/02:45 aunque la API las mande", async ({ page }) => {
    await mockAgendaNativa(page, [
      { horaInicio: "01:45" },
      { horaInicio: "02:45" },
      { horaInicio: "10:00" },
      { horaInicio: "16:45" },
    ]);
    await llegarAlCalendario(page, nonce());
    await expect(page.getByRole("button", { name: /10:00/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /16:45/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /01:45/ })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /02:45/ })).toHaveCount(0);
  });
});

test.describe("/agenda — hora local de la IP, no del reloj", () => {
  test.use({
    timezoneId: "America/Santiago",
    extraHTTPHeaders: { "x-vercel-ip-timezone": "America/Mexico_City" },
  });

  test("México ve 08:00 cuando Chile es 10:00, aunque el OS esté en Santiago", async ({ page }) => {
    await mockAgendaNativa(page, [{ horaInicio: "10:00" }, { horaInicio: "17:00" }]);
    await llegarAlCalendario(page, nonce());
    await expect(page.getByRole("button", { name: /08:00 tu hora, 10:00 en Chile/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /15:00 tu hora, 17:00 en Chile/ })).toBeVisible();
  });
});
