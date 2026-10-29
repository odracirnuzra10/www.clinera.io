import { test, expect } from "@playwright/test";
import { construirCotizacion } from "../src/lib/firma/cotizacion";
import { conversacionesAprox, agendamientosAprox, PLANES } from "../src/content/planes";

const base = { planId: "vortex", billing: "monthly", extraUsuarios: 2, extraPacks: 1 };

test.describe("Cotizador: descuento en monto fijo", () => {
  test("sin monto fijo, el cálculo es el de siempre", () => {
    const c = construirCotizacion({ ...base, descuentos: { plan: 10 } })!;
    expect(c.descuentosUsd).toEqual({ plan: 0, users: 0, credits: 0, setup: 0, global: 0 });
  });

  test("USD enteros por línea: se restan después del porcentaje", () => {
    const sin = construirCotizacion({ ...base })!;
    const con = construirCotizacion({ ...base, descuentosUsd: { plan: 29 } })!;
    expect(sin.centavos.recurrenteFinal - con.centavos.recurrenteFinal).toBe(2900);
    expect(con.centavos.descuentoRecurrente).toBe(2900);
    const mix = construirCotizacion({ ...base, descuentos: { plan: 10 }, descuentosUsd: { plan: 29 } })!;
    expect(mix.centavos.recurrenteFinal).toBe(sin.centavos.recurrenteFinal - Math.round(sin.centavos.planLista * 0.1) - 2900);
  });

  test("global en USD resta del recurrente; no baja de 0 ni acepta decimales o negativos", () => {
    const sin = construirCotizacion({ ...base })!;
    const g = construirCotizacion({ ...base, descuentosUsd: { global: 50.6 } })!;
    expect(sin.centavos.recurrenteFinal - g.centavos.recurrenteFinal).toBe(5100);
    const neg = construirCotizacion({ ...base, descuentosUsd: { plan: -20, global: -5 } })!;
    expect(neg.centavos.recurrenteFinal).toBe(sin.centavos.recurrenteFinal);
    const tope = construirCotizacion({ ...base, descuentosUsd: { global: 100000 } })!;
    expect(tope.centavos.recurrenteFinal).toBe(0);
  });
});

test.describe("Vortex: conversaciones con IA aproximadas", () => {
  test("933 conversaciones o 143 agendamientos con 28.000 créditos, redondeo hacia abajo", () => {
    expect(conversacionesAprox(28000)).toBe(933);
    expect(agendamientosAprox(28000)).toBe(143);
    const vortex = PLANES.find((p) => p.id === "vortex")!;
    expect(vortex.features.join(" ")).toContain("5.000 conversaciones y 28.000 créditos de IA");
  });

  test("/planes lo muestra", async ({ page }) => {
    await page.goto("/planes");
    await expect(page.locator("main")).toContainText("5.000 conversaciones y 28.000 créditos de IA");
    await expect(page.locator("main")).toContainText("1.000 conversaciones extra US$ 98");
  });
});
