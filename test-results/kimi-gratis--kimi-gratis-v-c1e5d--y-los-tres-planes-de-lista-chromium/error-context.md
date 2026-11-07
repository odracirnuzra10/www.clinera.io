# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: kimi-gratis.spec.ts >> /kimi-gratis vende la demo de 7 días y los tres planes de lista
- Location: tests/kimi-gratis.spec.ts:4:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3311/kimi-gratis
Call log:
  - navigating to "http://localhost:3311/kimi-gratis", waiting until "domcontentloaded"

```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | 
  3   | // /kimi-gratis es la prueba de la demo de 7 días. /kimi y /kimi2 no cambian.
  4   | test("/kimi-gratis vende la demo de 7 días y los tres planes de lista", async ({ page }) => {
  5   |   await page.setViewportSize({ width: 1280, height: 900 });
> 6   |   await page.goto("/kimi-gratis", { waitUntil: "domcontentloaded" });
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3311/kimi-gratis
  7   |   await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  8   |   await expect(page.locator("h1")).toHaveText("Crea tu cuenta gratis");
  9   |   // Ricardo, 7-nov-2026: «GRATIS» en cada botón principal y «Sin tarjeta de crédito» al lado.
  10  |   await expect(page.locator("#hero-cta")).toContainText("Crea tu cuenta GRATIS");
  11  |   await expect(page.locator(".hero .sin-tarjeta")).toContainText("Sin tarjeta de crédito");
  12  |   await expect(page.locator("[data-testid=kimi-antes-despues] .ad-con li")).toHaveCount(4);
  13  |   await expect(page.locator("[data-urgencia]")).toContainText(/Prueba gratis de noviembre|termina hoy/);
  14  |   const pintura = (sel: string) =>
  15  |     page.locator(sel).evaluate((el) => {
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
```