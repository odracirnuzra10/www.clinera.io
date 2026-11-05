import { expect, test } from "@playwright/test";
import {
  CARRITO,
  FLUX_BASE_INCLUYE,
  carritoCorto,
  regaloVigente,
  sanear,
  totalLista,
  totalPromo,
} from "@/content/carrito-flux";

const nov = new Date("2026-11-05T15:00:00-03:00");
const finNov = new Date("2026-11-30T23:59:00-03:00");
const dicUtc = new Date("2026-12-01T02:00:00Z");
const dic = new Date("2026-12-01T00:00:00-03:00");

test.describe("catálogo del carrito Flux", () => {
  test("la base es US$ 29 y el 50% da 14,50", () => {
    expect(totalLista({})).toBe(29);
    expect(totalPromo({})).toBe(14.5);
    expect(FLUX_BASE_INCLUYE).toEqual(
      expect.arrayContaining(["Clinera Intelligence", "WhatsApp", "100 conversaciones", "2 profesionales", "1 sucursal", "Fichas clínicas"]),
    );
  });

  test("2 profesionales + 1 pack + Instagram + Agente IA suman 160 / 80", () => {
    const c = { profesional_extra: 2, conversaciones_1000: 1, instagram: 1, agente_ia: 1 };
    expect(totalLista(c, dic)).toBe(160);
    expect(totalPromo(c, dic)).toBe(80);
  });

  test("sanear recorta negativos, decimales y el máximo, y la base queda en 1", () => {
    const s = sanear({ flux_base: 0, profesional_extra: -3, sucursal_extra: 1.9, conversaciones_1000: 99, instagram: 4 }, dic);
    expect(s.flux_base).toBe(1);
    expect(s.profesional_extra).toBe(0);
    expect(s.sucursal_extra).toBe(1);
    expect(s.conversaciones_1000).toBe(20);
    expect(s.instagram).toBe(1);
  });

  test("en noviembre email y automatizaciones no se cobran aunque vengan en 1", () => {
    const pedido = { email_marketing: 1, automatizaciones: 1 };
    expect(regaloVigente(nov)).toBe(true);
    expect(regaloVigente(finNov)).toBe(true);
    expect(regaloVigente(dicUtc)).toBe(true);
    expect(sanear(pedido, nov).email_marketing).toBe(0);
    expect(sanear(pedido, finNov).automatizaciones).toBe(0);
    expect(totalLista(pedido, nov)).toBe(29);
    expect(carritoCorto(pedido, nov)).toBe("{}");
    expect(CARRITO.email_marketing.lookup).toBe("clinera_email_marketing_usd_m");
    expect(CARRITO.automatizaciones.lookup).toBe("clinera_automatizaciones_usd_m");
    expect(CARRITO.email_marketing.usd).toBe(9);
    expect(CARRITO.automatizaciones.usd).toBe(9);
  });

  test("desde el 1 de diciembre son adicionales de US$ 9", () => {
    expect(regaloVigente(dic)).toBe(false);
    const pedido = { email_marketing: 1, automatizaciones: 1 };
    expect(sanear(pedido, dic).email_marketing).toBe(1);
    expect(sanear(pedido, dic).automatizaciones).toBe(1);
    expect(totalLista(pedido, dic)).toBe(47);
    expect(totalPromo(pedido, dic)).toBe(23.5);
    expect(carritoCorto(pedido, dic)).toBe('{"em":1,"au":1}');
  });
});
