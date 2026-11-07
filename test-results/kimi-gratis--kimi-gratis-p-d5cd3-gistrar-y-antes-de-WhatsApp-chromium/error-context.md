# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: kimi-gratis.spec.ts >> /kimi-gratis pide los cuatro datos antes de registrar y antes de WhatsApp
- Location: tests/kimi-gratis.spec.ts:114:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3311/kimi-gratis
Call log:
  - navigating to "http://localhost:3311/kimi-gratis", waiting until "domcontentloaded"

```

# Test source

```ts
  16  |       const cs = getComputedStyle(el);
  17  |       return { bg: cs.backgroundColor, image: cs.backgroundImage, shadow: cs.boxShadow, filter: cs.filter };
  18  |     });
  19  |   const heroBtn = await pintura("#hero-cta .btn");
  20  |   const mediaBtn = await pintura("[data-testid=kimi-asistencia-media] .btn.grad");
  21  |   const cierreBtn = await pintura("#comenzar .btn.grad");
  22  |   expect(heroBtn.bg).toBe("rgb(17, 17, 17)");
  23  |   expect(heroBtn.image).toBe("none");
  24  |   expect(heroBtn.shadow).toBe("none");
  25  |   expect(mediaBtn.bg).toBe("rgb(17, 17, 17)");
  26  |   expect(mediaBtn.shadow).toBe("none");
  27  |   expect(cierreBtn.bg).toBe("rgb(124, 58, 237)");
  28  |   expect(cierreBtn.image).toBe("none");
  29  |   expect(cierreBtn.shadow).toBe("none");
  30  |   expect(cierreBtn.filter).toBe("none");
  31  |   const wash = await page.locator("#comenzar").evaluate((el) => getComputedStyle(el).backgroundImage);
  32  |   expect(wash).toContain("radial-gradient");
  33  |   expect(wash).toContain("167, 139, 250");
  34  |   await expect(page.locator("header.nav")).not.toContainText("Crea tu cuenta");
  35  |   await expect(page.locator("header.nav .nav-cta")).toHaveCount(0);
  36  |   await expect(page.locator("#mobile-cta [data-bar-label]")).toHaveCount(0);
  37  |   await expect(page.locator("#mobile-cta [data-bar-accion]")).toHaveText("Crea tu cuenta GRATIS");
  38  |   await expect(page.locator("#mobile-cta .mcta-row")).not.toContainText("Vortex");
  39  |   const media = page.locator("[data-testid=kimi-asistencia-media]");
  40  |   await expect(media.getByRole("link", { name: "Solicita asistencia" })).toHaveAttribute(
  41  |     "href",
  42  |     "https://wa.me/56985581524?text=necesito%20asistencia",
  43  |   );
  44  |   await expect(page.locator(".hero")).toContainText("Demo de 7 días");
  45  |   await expect(page.locator(".hero")).not.toContainText("Prueba gratis, sin compromiso");
  46  |   await expect(page.locator("main")).not.toContainText("$14.495");
  47  |   await expect(page.locator("main")).not.toContainText("primer mes");
  48  | 
  49  |   const planes = page.locator("[data-testid=kimi-gratis-planes]");
  50  |   const flux = planes.locator("[data-testid=plan-flux]");
  51  |   const hex = planes.locator("[data-testid=plan-hex]");
  52  |   const vortex = planes.locator("[data-testid=plan-xcale]");
  53  |   await expect(flux).toContainText("$49");
  54  |   await expect(flux).toContainText("2 profesionales");
  55  |   await expect(flux).toContainText("1 sucursal");
  56  |   await expect(flux).toContainText("WhatsApp");
  57  |   await expect(flux).toContainText("300 conversaciones");
  58  |   await expect(flux).toContainText("Clinera Intelligence");
  59  |   await expect(flux).not.toContainText("5000");
  60  |   await expect(hex).toContainText("$129");
  61  |   await expect(hex).toContainText("5 profesionales");
  62  |   await expect(hex).toContainText("2 sucursales");
  63  |   await expect(hex).toContainText("600 conversaciones");
  64  |   await expect(hex).toContainText("Clinera Intelligence");
  65  |   await expect(hex).not.toContainText("5000");
  66  |   await expect(hex.locator(".badge-plan")).toHaveCount(0);
  67  |   await expect(vortex).toContainText("Xcale");
  68  |   await expect(vortex).not.toContainText("Vortex");
  69  |   await expect(page.locator("main")).not.toContainText("Vortex");
  70  |   const xcaleGlow = await vortex.evaluate((el) => {
  71  |     const wash = getComputedStyle(el, "::after");
  72  |     const btn = el.querySelector(".btn.grad");
  73  |     const cs = getComputedStyle(btn!);
  74  |     return { filter: wash.filter, image: wash.backgroundImage, shadow: cs.boxShadow, bg: cs.backgroundColor };
  75  |   });
  76  |   expect(xcaleGlow.bg).toBe("rgb(17, 17, 17)");
  77  |   expect(xcaleGlow.shadow).toBe("none");
  78  |   expect(xcaleGlow.filter).toContain("blur");
  79  |   expect(xcaleGlow.image).toContain("radial-gradient");
  80  |   const pago = vortex.locator("a.btn.grad");
  81  |   await expect(pago).toHaveAttribute("href", "https://buy.stripe.com/8x29AV7cZ9eG9wTgwz1441O");
  82  |   await expect(pago).toHaveAttribute("data-plan", "xcale");
  83  |   await expect(pago).toHaveAttribute("data-plan-value", "149");
  84  |   await expect(pago).not.toHaveAttribute("data-abrir-cuenta", /.+/);
  85  |   await expect(flux.locator("a[href*='buy.stripe.com']")).toHaveCount(0);
  86  |   await expect(hex.locator("a[href*='buy.stripe.com']")).toHaveCount(0);
  87  |   await expect(vortex).toContainText("$149");
  88  |   await expect(vortex).toContainText("Recomendado");
  89  |   await expect(vortex).toContainText("10 profesionales");
  90  |   await expect(vortex).toContainText("3 sucursales");
  91  |   await expect(vortex).toContainText("2000 conversaciones");
  92  |   await expect(vortex).toContainText("Clinera Intelligence · 5000 créditos");
  93  |   await expect(vortex).not.toContainText("Agente IA con 5000 créditos");
  94  |   await expect(vortex).toContainText("Onboarding humano");
  95  | 
  96  |   const extras = page.locator("[data-testid=kimi-gratis-addons]");
  97  |   await expect(extras).toContainText("$25");
  98  |   await expect(extras).toContainText("5000 créditos IA");
  99  |   await expect(extras).toContainText("Profesional extra");
  100 |   await expect(extras).toContainText("Sucursal extra");
  101 |   await expect(extras).toContainText("$48");
  102 |   await expect(extras).toContainText("1000 conversaciones");
  103 |   await expect(page.locator("[data-cuenta-pagar]")).toBeHidden();
  104 | 
  105 |   const flujo = page.locator("[data-testid=kimi-flujo]");
  106 |   await expect(flujo).toContainText("WhatsApp");
  107 |   await expect(flujo).toContainText("Facebook");
  108 |   await expect(flujo).toContainText("Instagram");
  109 |   await expect(flujo).toContainText("Facebook conectado");
  110 |   await expect(flujo).toContainText("Instagram conectado");
  111 |   await expect(flujo).not.toContainText("Horarios y tratamientos");
  112 | });
  113 | 
  114 | test("/kimi-gratis pide los cuatro datos antes de registrar y antes de WhatsApp", async ({ page }) => {
  115 |   await page.setViewportSize({ width: 390, height: 844 });
> 116 |   await page.goto("/kimi-gratis", { waitUntil: "domcontentloaded" });
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3311/kimi-gratis
  117 |   const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
  118 |   expect(ancho).toBeLessThanOrEqual(390);
  119 | 
  120 |   await page.locator(".hero").getByRole("button", { name: "Crea tu cuenta GRATIS" }).click();
  121 |   const modal = page.locator("[data-cuenta]");
  122 |   await expect(modal).toBeVisible();
  123 |   await expect(modal.locator("[data-cuenta-resumen]")).toHaveText("Crea tu cuenta gratis y conecta tu WhatsApp para que la IA atienda a tus pacientes. 7 días, sin tarjeta de crédito.");
  124 |   // Ricardo, 7-nov-2026: el modal no recomienda un plan; invita a crear la cuenta y conectar WhatsApp.
  125 |   await expect(modal.locator("[data-cuenta-resumen]")).not.toContainText("$149");
  126 |   await expect(modal).not.toContainText("Vortex");
  127 |   await expect(modal.locator("[data-cuenta-pagar]")).toBeHidden();
  128 |   await modal.locator("[data-cuenta-listo]").click();
  129 |   await expect(modal.locator("[data-cuenta-error]")).toBeVisible();
  130 | 
  131 |   // Celular chileno (7-nov-2026): exactamente 9 dígitos que empiezan con 9, sin números de relleno.
  132 |   const cel = modal.locator("input[name=celular]");
  133 |   await modal.locator("input[name=nombre]").fill("Ana");
  134 |   await modal.locator("input[name=email]").fill("ana@clinica.cl");
  135 |   await modal.locator("input[name=clinica]").fill("Clínica Ana");
  136 |   for (const malo of ["91234567", "812345678", "999999999", "912345678", "987654321"]) {
  137 |     await cel.fill(malo);
  138 |     await modal.locator("[data-cuenta-listo]").click();
  139 |     await expect(modal.locator("[data-cuenta-error]"), malo).toContainText("9 dígitos");
  140 |     await expect(cel, malo).toHaveAttribute("aria-invalid", "true");
  141 |   }
  142 |   await cel.fill("96503121999");
  143 |   await expect(cel).toHaveValue("965031219");
  144 |   await cel.fill("+56 9 6503 1219");
  145 |   await expect(cel).toHaveValue("965031219");
  146 | 
  147 |   await page.route("https://app.clinera.io/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "alta" }));
  148 |   const lead = page.waitForRequest((req) => req.url().includes("/api/wizard") && req.method() === "POST");
  149 |   // Lead del pixel (6-nov-2026): sale por CAPI con el mismo event_id que viaja al CRM.
  150 |   const capi = page.waitForRequest((req) => req.url().includes("/api/meta/capi") && req.method() === "POST");
  151 |   const alta = page.waitForRequest((req) => req.url().startsWith("https://app.clinera.io/auth/register"));
  152 |   await modal.locator("input[name=nombre]").fill("Ricardo");
  153 |   await modal.locator("input[name=celular]").fill("9650312199");
  154 |   await modal.locator("input[name=email]").fill("ricardo@oacg.cl");
  155 |   await modal.locator("input[name=clinica]").fill("metodo hebe");
  156 |   await modal.locator("[data-cuenta-listo]").click();
  157 |   await expect(modal.locator("[data-cuenta-error]")).toBeHidden();
  158 |   const altaUrl = new URL((await alta).url());
  159 |   const body = (await lead).postDataJSON();
  160 |   expect(altaUrl.origin + altaUrl.pathname).toBe("https://app.clinera.io/auth/register");
  161 |   expect(altaUrl.searchParams.get("nombre")).toBe("Ricardo");
  162 |   expect(altaUrl.searchParams.get("email")).toBe("ricardo@oacg.cl");
  163 |   expect(altaUrl.searchParams.get("telefono")).toBe("+56965031219");
  164 |   expect(altaUrl.searchParams.get("clinica")).toBe("metodo hebe");
  165 |   expect(altaUrl.searchParams.get("plan")).toBe("xcale");
  166 |   // Atribución para el webhook del Trial (6-nov-2026): el id del Lead viaja al registro.
  167 |   expect(altaUrl.searchParams.get("lead_event_id")).toMatch(/^lead_kg_/);
  168 |   expect(body.plan).toBe("vortex");
  169 |   expect(body.source_path).toBe("/kimi-gratis");
  170 |   expect(body.servicio_interes_label).toBe("Xcale $149 demo 7 días");
  171 |   expect(body.telefono).toBe("+56965031219");
  172 |   const capiBody = (await capi).postDataJSON();
  173 |   expect(capiBody.event_name).toBe("Lead");
  174 |   expect(capiBody.custom_data).toMatchObject({ value: 3, currency: "USD" });
  175 |   expect(capiBody.event_id).toMatch(/^lead_kg_/);
  176 |   expect(capiBody.event_id).toBe(body.event_id);
  177 |   expect(capiBody.user_data.em).toMatch(/^[0-9a-f]{64}$/);
  178 |   expect(capiBody.user_data.ph).toMatch(/^[0-9a-f]{64}$/);
  179 | 
  180 |   await page.goto("/kimi-gratis", { waitUntil: "domcontentloaded" });
  181 |   await page.locator("#comenzar").getByRole("link", { name: "Solicita asistencia" }).click();
  182 |   await expect(modal).toBeVisible();
  183 |   await modal.locator("input[name=nombre]").fill("");
  184 |   await modal.locator("input[name=celular]").fill("");
  185 |   await modal.locator("input[name=email]").fill("");
  186 |   await modal.locator("input[name=clinica]").fill("");
  187 |   await modal.locator("[data-asistencia-enviar]").click();
  188 |   await expect(modal.locator("[data-cuenta-error]")).toBeVisible();
  189 | });
  190 | 
```