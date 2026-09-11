import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  CLINERA_PLANS,
  DEFAULT_PRICE_MODALITY,
  PRICE_MODALITY,
  PRICE_MODALITIES,
  SETUP_FEE_USD,
} from "../src/content/pricing";
import { parsePriceModality, priceModalityOrDefault } from "../src/lib/price-modality";

test("el catálogo USD no cambia entre modalidades", () => {
  expect(DEFAULT_PRICE_MODALITY).toBe("cl");
  expect(PRICE_MODALITIES).toEqual(["cl", "mx"]);
  expect(PRICE_MODALITY.cl.currency).toBe("USD");
  expect(PRICE_MODALITY.mx.currency).toBe("USD");
  expect(PRICE_MODALITY.cl.ivaNote).toBe("No incluye IVA");
  expect(PRICE_MODALITY.mx.ivaNote).toBe("No incluye IVA");
  expect(PRICE_MODALITY.cl.ivaNoteLong).toContain("Chile");
  expect(PRICE_MODALITY.mx.ivaNoteLong).toContain("México");
  expect(PRICE_MODALITY.cl.ivaNoteLong).not.toMatch(/CLP|MXN|\$\s*\d{3,}/);
  expect(PRICE_MODALITY.mx.ivaNoteLong).not.toMatch(/CLP|MXN|\$\s*\d{3,}/);
  expect(CLINERA_PLANS.map((p) => p.monthlyPrice)).toEqual([279, 379, 479]);
  expect(SETUP_FEE_USD).toBe(450);
});

test("parsePriceModality acepta aliases y rechaza basura", () => {
  expect(parsePriceModality("cl")).toBe("cl");
  expect(parsePriceModality("MX")).toBe("mx");
  expect(parsePriceModality("chile")).toBe("cl");
  expect(parsePriceModality("mexicanos")).toBe("mx");
  expect(parsePriceModality("usd")).toBeNull();
  expect(parsePriceModality("")).toBeNull();
  expect(priceModalityOrDefault("nope")).toBe("cl");
});

async function expectUsdCatalog(scope: Page | Locator) {
  await expect(scope.getByText("279").first()).toBeVisible();
  await expect(scope.getByText("379").first()).toBeVisible();
  await expect(scope.getByText("479").first()).toBeVisible();
  await expect(scope.getByText("450").first()).toBeVisible();
}

test("/planes: el switch cambia la nota de IVA y deja los USD", async ({ page }) => {
  await page.goto("/planes", { waitUntil: "domcontentloaded" });
  const precios = page.locator("#precios");
  const control = precios.getByRole("radiogroup", { name: "Modalidad de precios" });
  await expect(control).toBeVisible();
  await expect(control.getByRole("radio", { name: "Precios chilenos" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(precios.getByText(/no incluye IVA en Chile/i).first()).toBeVisible();
  await expectUsdCatalog(precios);
  await expect(precios.getByRole("button", { name: /semestral/i })).toHaveCount(0);
  await expect(precios.getByRole("button", { name: /anual/i })).toHaveCount(0);

  await control.getByRole("radio", { name: "Precios mexicanos" }).click();
  await expect(control.getByRole("radio", { name: "Precios mexicanos" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(precios.getByText(/no incluye IVA en México/i).first()).toBeVisible();
  await expect(precios.getByText(/no incluye IVA en Chile/i)).toHaveCount(0);
  await expectUsdCatalog(precios);
  expect(new URL(page.url()).searchParams.get("precios")).toBe("mx");
});

test("/planes?precios=mx abre en precios mexicanos", async ({ page }) => {
  await page.goto("/planes?precios=mx", { waitUntil: "domcontentloaded" });
  const control = page.locator("#precios").getByRole("radiogroup", { name: "Modalidad de precios" });
  await expect(control.getByRole("radio", { name: "Precios mexicanos" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(page.locator("#precios").getByText(/no incluye IVA en México/i).first()).toBeVisible();
  await expectUsdCatalog(page.locator("#precios"));
});

test("home y /planes-pro usan el mismo control", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const home = page.locator("#precios");
  await expect(home.getByRole("radiogroup", { name: "Modalidad de precios" })).toBeVisible();
  await home.getByRole("radio", { name: "Precios mexicanos" }).click();
  await expect(home.getByText(/no incluye IVA en México/i).first()).toBeVisible();
  await expectUsdCatalog(home);

  await page.goto("/planes-pro", { waitUntil: "domcontentloaded" });
  const pro = page.locator("#precios");
  await expect(pro.getByRole("radiogroup", { name: "Modalidad de precios" })).toBeVisible();
  await expect(pro.getByRole("radio", { name: "Precios mexicanos" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(pro.getByText(/no incluye IVA en México/i).first()).toBeVisible();
  await expectUsdCatalog(pro);
});

test("las calculadoras muestran el switch y ambas notas", async ({ page }) => {
  await page.goto("/calculadora-de-consumo", { waitUntil: "domcontentloaded" });
  const calc = page.locator("#calc");
  const control = calc.getByRole("radiogroup", { name: "Modalidad de precios" });
  await expect(control).toBeVisible();
  await expect(calc.getByText(/no incluye IVA en Chile/i).first()).toBeVisible();
  await control.getByRole("radio", { name: "Precios mexicanos" }).click();
  await expect(calc.getByText(/no incluye IVA en México/i).first()).toBeVisible();
  await expect(calc.getByText("279").first()).toBeVisible();
});
