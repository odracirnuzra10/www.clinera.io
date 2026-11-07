# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home2.spec.ts >> home: historia, fundador y cuatro casos con cifra
- Location: tests/home2.spec.ts:6:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3311/
Call log:
  - navigating to "http://localhost:3311/", waiting until "domcontentloaded"

```

# Test source

```ts
  1   | // Home (Ricardo, 26-oct-2026): el borrador /home2 pasó a ser `/`, con el degradé del hero
  2   | // anterior. /home2 redirige al home. Contenido en src/content/home2.ts.
  3   | 
  4   | import { expect, test } from "@playwright/test";
  5   | 
  6   | test("home: historia, fundador y cuatro casos con cifra", async ({ page }) => {
  7   |   await page.route(/connect\.facebook\.net|googletagmanager/, (route) =>
  8   |     route.abort(),
  9   |   );
> 10  |   await page.goto("/", { waitUntil: "domcontentloaded" });
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3311/
  11  | 
  12  |   // El home se indexa (el borrador no se indexaba).
  13  |   await expect(
  14  |     page.locator('meta[name="robots"][content*="noindex"]'),
  15  |   ).toHaveCount(0);
  16  |   // Ricardo, 7-nov-2026: el home vende la prueba gratis del software.
  17  |   await expect(page.getByRole("heading", { level: 1 })).toContainText(
  18  |     "agenda y cobra la evaluación",
  19  |   );
  20  |   await expect(page.locator('[data-home2="cifras"] li')).toHaveCount(3);
  21  |   await expect(page.locator('[data-home2="cifras"]')).toContainText("+1.500");
  22  |   await expect(page.locator('[data-home2="fundador"]')).toContainText(
  23  |     "Ricardo Oyarzún",
  24  |   );
  25  | 
  26  |   await expect(page.locator("[data-home2-caso]")).toHaveCount(4);
  27  |   await expect(page.locator('[data-home2-caso="hebe"]')).toContainText("23x");
  28  |   await expect(page.locator('[data-home2-caso="lumina"]')).toContainText("31x");
  29  |   await expect(page.locator('[data-home2-caso="sucursal"]')).toContainText(
  30  |     "US$ 220.000",
  31  |   );
  32  |   await expect(page.locator('[data-home2-caso="sucursal"] h3')).toHaveText(
  33  |     "Una sucursal de nuestra red",
  34  |   );
  35  |   // Ricardo, 26-oct-2026: la red propia es «nuestra red de clínicas», sin marcas.
  36  |   for (const zona of ["hero", "historia", "casos", "fundador"]) {
  37  |     await expect(page.locator(`[data-home2="${zona}"]`)).not.toContainText(
  38  |       /Hebe|Lumina/,
  39  |     );
  40  |   }
  41  |   await expect(page.locator('[data-home2="hero"]')).toContainText(
  42  |     "nuestra red de clínicas",
  43  |   );
  44  |   await expect(page.locator('[data-home2="fundador"]')).toContainText(
  45  |     "apertura de la sucursal de Vitacura, 2025",
  46  |   );
  47  | 
  48  |   // Ricardo, 7-nov-2026: la fórmula es del software y los planes son los de la prueba gratis.
  49  |   await expect(page.locator('[data-home2="formula"]')).toContainText("IA que responde y agenda");
  50  |   await expect(page.locator('[data-home2="formula"]')).toContainText("Agenda por profesional");
  51  |   await expect(page.locator("[data-ecosistema-incluye]")).toHaveCount(0);
  52  |   const planes = page.locator("[data-planes-trial]");
  53  |   await expect(planes.locator("[data-plan-card]")).toHaveCount(3);
  54  |   await expect(planes).toContainText("US$ 49");
  55  |   await expect(planes).toContainText("US$ 129");
  56  |   await expect(planes).toContainText("US$ 149");
  57  | 
  58  |   // Ricardo, 27-oct-2026: canal de YouTube y CNN Chile en «Quién está detrás».
  59  |   await expect(page.locator("[data-home2-medio]")).toHaveCount(2);
  60  |   await expect(page.locator('[data-home2-medio="cnn"]')).toContainText(
  61  |     "CNN Chile",
  62  |   );
  63  |   await expect(page.locator('[data-home2-medio="youtube"]')).toHaveAttribute(
  64  |     "href",
  65  |     /youtube\.com/,
  66  |   );
  67  | 
  68  |   for (const donde of ["hero", "cierre"]) {
  69  |     // Ricardo, 7-nov-2026: «Regístrate gratis» (principal) y «Solicita asistencia» (WhatsApp).
  70  |     await expect(page.locator(`[data-home2-cta="${donde}"]`)).toHaveAttribute("href", "https://wa.me/56985581524?text=necesito%20asistencia");
  71  |     await expect(page.locator(`[data-home2-cta="${donde}"]`)).toHaveText("Solicita asistencia");
  72  |     await expect(page.locator(`[data-home2-registro="${donde}"]`)).toHaveAttribute("href", "/prueba-gratis");
  73  |     await expect(page.locator(`[data-home2-registro="${donde}"]`)).toHaveText("Regístrate gratis");
  74  |   }
  75  |   await expect(page.getByRole("heading", { level: 1 })).toContainText("Tú atiendes pacientes");
  76  |   const convenio = page.locator('[data-home2="alta-qualita"]');
  77  |   await expect(convenio).toContainText("descuentos especiales");
  78  |   await expect(convenio.locator("a")).toHaveAttribute(
  79  |     "href",
  80  |     "https://alta-qualita.cl",
  81  |   );
  82  |   // PMFC con las cuatro letras y la C mostrando cómo agenda.
  83  |   for (const letra of ["P", "M", "F", "C"]) {
  84  |     await expect(page.locator(`[data-home2-pmfc="${letra}"]`)).toBeVisible();
  85  |   }
  86  |   await expect(page.locator('[data-home2-pmfc="M"]')).toContainText(
  87  |     "evaluaciones prepagadas",
  88  |   );
  89  |   await expect(page.locator('[data-home2-pmfc="F"]')).toContainText(
  90  |     "alto valor",
  91  |   );
  92  |   // Un solo ejemplo recorre las cuatro letras (Ricardo, 27-oct-2026).
  93  |   await expect(page.locator('[data-home2-pmfc="P"]')).toContainText("Facial 360");
  94  |   await expect(page.locator('[data-home2-pmfc="M"]')).toContainText("US$ 20");
  95  |   await expect(page.locator('[data-home2-pmfc="F"]')).toContainText("US$ 1.800");
  96  |   await expect(page.locator("[data-home2-slot-nuevo]")).toContainText(
  97  |     "Valentina R.",
  98  |   );
  99  |   // Lo que viene del home: demo, testimonios, planes y preguntas.
  100 |   await expect(page.locator("#demo-3-min")).toHaveCount(1);
  101 |   await expect(page.locator("#historias")).toContainText("Tamara Oyarzún");
  102 |   await expect(page.locator("#faq")).toHaveCount(1);
  103 |   // Sin cifras viejas ni promesas de integración con agendas de terceros.
  104 |   await expect(page.locator("main")).not.toContainText(
  105 |     /\+52 cl[ií]nicas|AgendaPro|Reservo|Medilink/,
  106 |   );
  107 | });
  108 | 
  109 | test("home: /home2 redirige al home", async ({ page }) => {
  110 |   await page.route(/connect\.facebook\.net|googletagmanager/, (route) =>
```