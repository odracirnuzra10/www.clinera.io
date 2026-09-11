import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  CLINERA_PLANS,
  DEFAULT_PRICE_MODALITY,
  DISPLAY_ROUND_MXN,
  EXTRA_CREDIT_PACK_USD,
  EXTRA_USER_USD,
  FX_LOCKED_ON,
  PRICE_MODALITY,
  PRICE_MODALITIES,
  SETUP_FEE_USD,
  USD_TO_MXN,
  formatCatalogNumber,
  formatCatalogPrice,
  usdToDisplayAmount,
} from "../src/content/pricing";
import { parsePriceModality, priceModalityOrDefault } from "../src/lib/price-modality";

const USD_CATALOG = [279, 379, 479, 450, 15, 9] as const;

test("el default es dólar y no hay peso chileno", () => {
  expect(DEFAULT_PRICE_MODALITY).toBe("usd");
  expect(PRICE_MODALITIES).toEqual(["usd", "mxn"]);
  expect(PRICE_MODALITY.usd.label).toBe("Dólar");
  expect(PRICE_MODALITY.mxn.label).toBe("Peso mexicano");
  expect(PRICE_MODALITY).not.toHaveProperty("clp");
  expect(FX_LOCKED_ON).toBe("2026-09-11");
  expect(USD_TO_MXN).toBe(16.95);
  expect(DISPLAY_ROUND_MXN).toBe(10);
  expect(CLINERA_PLANS.map((p) => p.monthlyPrice)).toEqual([279, 379, 479]);
  expect(SETUP_FEE_USD).toBe(450);
  expect(EXTRA_CREDIT_PACK_USD).toBe(15);
  expect(EXTRA_USER_USD).toBe(9);
  for (const meta of Object.values(PRICE_MODALITY)) {
    expect(meta.ivaNote).toBe("No incluye IVA");
  }
});

test("USD no se redondea; MXN a la decena", () => {
  const expected = {
    usd: [279, 379, 479, 450, 15, 9],
    mxn: [4_730, 6_420, 8_120, 7_630, 250, 150],
  } as const;
  for (const modality of PRICE_MODALITIES) {
    expect(USD_CATALOG.map((usd) => usdToDisplayAmount(usd, modality))).toEqual([
      ...expected[modality],
    ]);
  }
  expect(usdToDisplayAmount(279, "usd")).toBe(279);
  expect(formatCatalogPrice(279, "usd")).toBe("$279");
  expect(formatCatalogPrice(279, "mxn")).toBe(`$${formatCatalogNumber(4_730, "mxn")}`);
});

test("parsePriceModality acepta aliases y rechaza CLP", () => {
  expect(parsePriceModality("usd")).toBe("usd");
  expect(parsePriceModality("Dólar")).toBe("usd");
  expect(parsePriceModality("MXN")).toBe("mxn");
  expect(parsePriceModality("mexicanos")).toBe("mxn");
  expect(parsePriceModality("clp")).toBeNull();
  expect(parsePriceModality("chile")).toBeNull();
  expect(parsePriceModality("")).toBeNull();
  expect(parsePriceModality("eur")).toBeNull();
  expect(priceModalityOrDefault("clp")).toBe("usd");
  expect(priceModalityOrDefault("nope")).toBe("usd");
});

function visibleAmount(usd: number, modality: "usd" | "mxn") {
  return formatCatalogNumber(usdToDisplayAmount(usd, modality), modality);
}

async function expectCatalog(scope: Page | Locator, modality: "usd" | "mxn") {
  await expect(scope.getByText(visibleAmount(279, modality), { exact: false }).first()).toBeVisible();
  await expect(scope.getByText(visibleAmount(379, modality), { exact: false }).first()).toBeVisible();
  await expect(scope.getByText(visibleAmount(479, modality), { exact: false }).first()).toBeVisible();
  await expect(scope.getByText(visibleAmount(450, modality), { exact: false }).first()).toBeVisible();
}

test("/planes: default dólar y el switch solo tiene dólar y MXN", async ({ page }) => {
  await page.goto("/planes", { waitUntil: "domcontentloaded" });
  const precios = page.locator("#precios");
  const control = precios.getByRole("radiogroup", { name: "Modalidad de precios" });
  await expect(control).toBeVisible();
  await expect(control.getByRole("radio", { name: "Dólar" })).toHaveAttribute("aria-checked", "true");
  await expect(control.getByRole("radio", { name: "Peso mexicano" })).toBeVisible();
  await expect(control.getByRole("radio", { name: "Peso chileno" })).toHaveCount(0);
  await expect(precios.getByText(/USD · no incluye IVA/i).first()).toBeVisible();
  await expectCatalog(precios, "usd");
  await expect(precios.getByRole("button", { name: /semestral/i })).toHaveCount(0);
  await expect(precios.getByRole("button", { name: /anual/i })).toHaveCount(0);

  await control.getByRole("radio", { name: "Peso mexicano" }).click();
  await expect(control.getByRole("radio", { name: "Peso mexicano" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(precios.getByText(/MXN · no incluye IVA en México/i).first()).toBeVisible();
  await expectCatalog(precios, "mxn");
  expect(new URL(page.url()).searchParams.get("precios")).toBe("mxn");
});

test("/planes?precios=clp cae a dólar", async ({ page }) => {
  await page.goto("/planes?precios=clp", { waitUntil: "domcontentloaded" });
  const control = page.locator("#precios").getByRole("radiogroup", { name: "Modalidad de precios" });
  await expect(control.getByRole("radio", { name: "Dólar" })).toHaveAttribute("aria-checked", "true");
  await expect(control.getByRole("radio", { name: "Peso chileno" })).toHaveCount(0);
  await expectCatalog(page.locator("#precios"), "usd");
});

test("home y /planes-pro usan el mismo control de 2 opciones", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const home = page.locator("#precios");
  const control = home.getByRole("radiogroup", { name: "Modalidad de precios" });
  await expect(control.getByRole("radio", { name: "Dólar" })).toHaveAttribute("aria-checked", "true");
  await expect(control.getByRole("radio", { name: "Peso chileno" })).toHaveCount(0);
  await control.getByRole("radio", { name: "Peso mexicano" }).click();
  await expect(home.getByText(/MXN · no incluye IVA en México/i).first()).toBeVisible();
  await expectCatalog(home, "mxn");

  await page.goto("/planes-pro", { waitUntil: "domcontentloaded" });
  const pro = page.locator("#precios");
  await expect(pro.getByRole("radio", { name: "Peso mexicano" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(pro.getByRole("radio", { name: "Peso chileno" })).toHaveCount(0);
  await expectCatalog(pro, "mxn");
});

test("la calculadora muestra el switch y convierte a MXN", async ({ page }) => {
  await page.goto("/calculadora-de-consumo", { waitUntil: "domcontentloaded" });
  const calc = page.locator("#calc");
  const control = calc.getByRole("radiogroup", { name: "Modalidad de precios" });
  await expect(control).toBeVisible();
  await expect(control.getByRole("radio", { name: "Dólar" })).toHaveAttribute("aria-checked", "true");
  await expect(control.getByRole("radio", { name: "Peso chileno" })).toHaveCount(0);
  await expect(calc.getByText(/USD · no incluye IVA/i).first()).toBeVisible();
  await control.getByRole("radio", { name: "Peso mexicano" }).click();
  await expect(calc.getByText(/MXN · no incluye IVA en México/i).first()).toBeVisible();
});
