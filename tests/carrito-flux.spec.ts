import { expect, test } from "@playwright/test";
import {
  CARRITO,
  FLUX_BASE_INCLUYE,
  carritoCorto,
  carritoDesdeQuery,
  regaloVigente,
  sanear,
  CTA_ACTIVAR_CLP,
  CTA_PAGAR_CLP,
  CTA_PRUEBA_CLP,
  MP_FLUX_PROMO_URL,
  EXTRAS_VISIBLES,
  MP_NOTA_CLP,
  NOTA_PLAN_CLP,
  PRECIO_DESPUES_CLP,
  PRECIO_FLUX_CLP,
  PRECIO_PRUEBA_CLP,
  clpDesdeUsd,
  clpLinea,
  formatoClp,
  totalLista,
  totalPromo,
} from "@/content/carrito-flux";

const nov = new Date("2026-11-05T15:00:00-03:00");
const finNov = new Date("2026-11-30T23:59:00-03:00");
const dicUtc = new Date("2026-12-01T02:00:00Z");
const dic = new Date("2026-12-01T00:00:00-03:00");

test.describe("catálogo del carrito Flux", () => {
  test("la pantalla muestra $28.000 y el mismo tipo para el resto", () => {
    expect(PRECIO_FLUX_CLP).toBe(28000);
    expect(CTA_ACTIVAR_CLP).toBe("Crea tu cuenta por $14.495");
    expect(CTA_PAGAR_CLP).toBe("Pagar $14.495");
    expect(CTA_PRUEBA_CLP).toBe("Prueba Clinera por $14.495 por 30 días y escala tu clínica");
    expect(PRECIO_PRUEBA_CLP).toBe(14495);
    expect(PRECIO_DESPUES_CLP).toBe(78990);
    expect(MP_FLUX_PROMO_URL).toBe("https://mpago.la/22dyhQr");
    expect(MP_NOTA_CLP).toContain("$14.495");
    expect(MP_NOTA_CLP).toContain("$78.990");
    expect(EXTRAS_VISIBLES).toEqual(["profesional_extra", "conversaciones_1000"]);
    expect(NOTA_PLAN_CLP).toContain("créditos de IA");
    expect(NOTA_PLAN_CLP).not.toContain("Vortex");
    expect(NOTA_PLAN_CLP).not.toContain("178.990");
    expect(clpDesdeUsd(29)).toBe(28000);
    expect(clpDesdeUsd(9)).toBe(8690);
    expect(clpDesdeUsd(25)).toBe(24140);
    expect(clpDesdeUsd(79)).toBe(76280);
    expect(clpDesdeUsd(190)).toBe(183450);
    expect(clpLinea(29, true).ahora).toBe(14000);
    expect(clpLinea(190, true, true).ahora).toBe(183450);
    expect(formatoClp(28000)).toBe("$28.000");
    expect(formatoClp(4345)).toBe("$4.345");
  });

  test("la base es US$ 29 y el 50% da 14,50", () => {
    expect(totalLista({})).toBe(29);
    expect(totalPromo({})).toBe(14.5);
    expect(FLUX_BASE_INCLUYE).toEqual([
      "WhatsApp, Instagram y Facebook",
      "500 conversaciones",
      "Fichas, recetas y consentimientos",
      "Automatizaciones avanzadas",
      "Email marketing",
      "3 sucursales",
      "10 profesionales",
    ]);
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

  test("el onboarding humano es US$ 190 de una vez y no entra en el 50%", () => {
    expect(CARRITO.onboarding_humano.lookup).toBe("clinera_onboarding_humano_usd_once");
    expect(CARRITO.onboarding_humano.cobro).toBe("unico");
    const c = { onboarding_humano: 1 };
    expect(totalLista(c, nov)).toBe(219);
    expect(totalPromo(c, nov)).toBe(204.5);
    expect(sanear({ onboarding_humano: 4 }, nov).onboarding_humano).toBe(1);
    expect(sanear({ onboarding_humano: 0 }, nov).onboarding_humano).toBe(0);
    expect(carritoCorto(c, nov)).toBe('{"oh":1}');
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

  test("la query de AURA arma el carrito y en noviembre apaga em y au", () => {
    const q = carritoDesdeQuery("?plan=flux&pe=3&ig=1&fb=1&em=1&au=1", nov);
    expect(q.aplica).toBe(true);
    expect(q.carrito.flux_base).toBe(1);
    expect(q.carrito.profesional_extra).toBe(3);
    expect(q.carrito.instagram).toBe(1);
    expect(q.carrito.facebook).toBe(1);
    expect(q.carrito.email_marketing).toBe(0);
    expect(q.carrito.automatizaciones).toBe(0);
    expect(q.carrito.onboarding_humano).toBe(0);
  });

  test("en diciembre em y au de la query sí entran", () => {
    const q = carritoDesdeQuery("plan=flux&em=1&au=1", dic);
    expect(q.carrito.email_marketing).toBe(1);
    expect(q.carrito.automatizaciones).toBe(1);
  });

  test("la query pisa la preselección, ignora lo que no es entero y recorta", () => {
    const q = carritoDesdeQuery("?plan=hex&ig=0&pe=99&c1k=no&se=-2&oh=1", nov);
    expect(q.carrito.instagram).toBe(0);
    expect(q.carrito.facebook).toBe(1);
    expect(q.carrito.profesional_extra).toBe(50);
    expect(q.carrito.sucursal_extra).toBe(0);
    expect(q.carrito.conversaciones_1000).toBe(0);
    expect(q.carrito.onboarding_humano).toBe(0);
    expect(q.carrito.agente_ia).toBe(0);
  });

  test("vortex suma el agente y ia=0 lo apaga", () => {
    const q = carritoDesdeQuery("?plan=vortex&ia=0&ig=2", nov);
    expect(q.carrito.agente_ia).toBe(0);
    expect(q.carrito.instagram).toBe(1);
    expect(q.carrito.facebook).toBe(1);
  });

  test("sin plan ni cantidades no pisa el carrito guardado", () => {
    const q = carritoDesdeQuery("?pago=cancelado&utm_source=ads", nov);
    expect(q.aplica).toBe(false);
    expect(q.email).toBe("");
  });

  test("el email válido se normaliza y el inválido se descarta", () => {
    expect(carritoDesdeQuery("?email=Ana@Clinica.cl", nov).email).toBe("ana@clinica.cl");
    expect(carritoDesdeQuery("?email=Ana@Clinica.cl", nov).aplica).toBe(false);
    expect(carritoDesdeQuery("?email=no-es-correo", nov).email).toBe("");
    expect(carritoDesdeQuery("?plan=flux&email=ana@", nov).email).toBe("");
  });
});
