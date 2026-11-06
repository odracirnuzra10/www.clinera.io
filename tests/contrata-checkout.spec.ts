import { expect, test } from "@playwright/test";
import { CARRITO, type ItemId } from "@/content/carrito-flux";
import { ejecutarCheckout, vaciarCacheContrata, type PrecioStripe, type StripeContrata } from "@/lib/contrata-checkout";

function precio(id: ItemId, unit = CARRITO[id].usd * 100): PrecioStripe {
  const unico = CARRITO[id].cobro === "unico";
  return {
    id: `price_${id}`,
    lookup_key: CARRITO[id].lookup,
    unit_amount: unit,
    currency: "usd",
    recurring: unico ? null : { interval: "month" },
  };
}

function stripeFalso(opts?: { promo?: boolean; unit?: (id: ItemId) => number; faltan?: ItemId[] }) {
  const creadas: Record<string, unknown>[] = [];
  const cupones: Record<string, unknown>[] = [];
  const faltan = new Set(opts?.faltan ?? []);
  const stripe: StripeContrata = {
    prices: {
      list: async () => ({
        data: (Object.keys(CARRITO) as ItemId[]).filter((id) => !faltan.has(id)).map((id) => precio(id, opts?.unit?.(id))),
      }),
    },
    promotionCodes: {
      list: async () => ({ data: opts?.promo === false ? [] : [{ id: "promo_fp" }] }),
    },
    customers: {
      list: async () => ({ data: [] }),
      update: async (id) => ({ id }),
      create: async () => ({ id: "cus_1" }),
    },
    checkout: {
      sessions: {
        create: async (params) => {
          creadas.push(params);
          if (params.adaptive_pricing && creadas.length === 1) throw new Error("Received unknown parameter: adaptive_pricing");
          return { url: "https://checkout.stripe.com/c/pay/cs_test_ok" };
        },
      },
    },
    coupons: {
      create: async (params) => {
        cupones.push(params);
        return { id: "coupon_mensual" };
      },
    },
  };
  return { stripe, creadas, cupones };
}

test.beforeEach(() => vaciarCacheContrata());

test.describe("POST /api/contrata/checkout", () => {
  test("rechaza un precio, un monto o un regalo mandados por el cliente", async () => {
    const { stripe } = stripeFalso();
    for (const extra of [{ price: "price_x" }, { amount: 1 }, { regalo: true }, { unit_amount: 900 }]) {
      const r = await ejecutarCheckout({ body: { carrito: { flux_base: 1 }, ...extra }, origin: "https://www.clinera.io", stripe });
      expect(r.status, JSON.stringify(extra)).toBe(400);
      expect(r.body.error).toBe("client_price");
    }
  });

  test("en noviembre no cobra email ni automatizaciones y anota el regalo", async () => {
    const { stripe, creadas } = stripeFalso();
    const r = await ejecutarCheckout({
      body: { carrito: { flux_base: 1, email_marketing: 1, automatizaciones: 1 }, clientRef: "gclid_1" },
      origin: "https://www.clinera.io",
      stripe,
      now: new Date("2026-11-05T12:00:00-03:00"),
    });
    expect(r.status).toBe(200);
    expect(r.body.lista_usd).toBe(29);
    expect(r.body.promo).toBe(true);
    expect(r.body.regalo).toBe(true);
    const params = creadas.at(-1)!;
    const lineas = params.line_items as { price: string; quantity: number }[];
    expect(lineas).toEqual([{ price: "price_flux_base", quantity: 1 }]);
    expect(params.discounts).toEqual([{ promotion_code: "promo_fp" }]);
    expect(params).not.toHaveProperty("allow_promotion_codes");
    const meta = params.metadata as Record<string, string>;
    expect(meta.fuente).toBe("contrata_carrito");
    expect(meta.regalo_nov).toBe("email_marketing,automatizaciones");
    expect(meta.lista_usd).toBe("29");
    expect(params.success_url).toBe("https://www.clinera.io/contrata?pago=ok&session_id={CHECKOUT_SESSION_ID}");
    expect(params.cancel_url).toBe("https://www.clinera.io/contrata?pago=cancelado");
  });

  test("el 1 de diciembre email y automatizaciones van como líneas de US$ 9", async () => {
    const { stripe, creadas } = stripeFalso();
    const r = await ejecutarCheckout({
      body: { carrito: { email_marketing: 1, automatizaciones: 1 } },
      origin: "https://www.clinera.io",
      stripe,
      now: new Date("2026-12-01T12:00:00-03:00"),
    });
    expect(r.status).toBe(200);
    expect(r.body.lista_usd).toBe(47);
    expect(r.body.promo_usd).toBe(23.5);
    expect(r.body.regalo).toBe(false);
    const params = creadas.at(-1)!;
    const lineas = params.line_items as { price: string }[];
    expect(lineas.map((l) => l.price)).toEqual(["price_flux_base", "price_email_marketing", "price_automatizaciones"]);
    expect(params.metadata).not.toHaveProperty("regalo_nov");
  });

  test("un unit_amount distinto al catálogo es 409 y un precio ausente es 503", async () => {
    const mal = stripeFalso({ unit: (id) => (id === "instagram" ? 100 : CARRITO[id].usd * 100) });
    const a = await ejecutarCheckout({
      body: { carrito: { instagram: 1 } },
      origin: "https://www.clinera.io",
      stripe: mal.stripe,
      now: new Date("2026-12-01T12:00:00-03:00"),
    });
    expect(a.status).toBe(409);
    vaciarCacheContrata();
    const falta = stripeFalso({ faltan: ["email_marketing"] });
    const b = await ejecutarCheckout({
      body: { carrito: { email_marketing: 1 } },
      origin: "https://www.clinera.io",
      stripe: falta.stripe,
      now: new Date("2026-12-01T12:00:00-03:00"),
    });
    expect(b.status).toBe(503);
    expect(b.body.error).toBe("prices_missing");
  });

  test("sin código activo no promete el 50% y recorta client_reference_id a 200", async () => {
    const { stripe, creadas } = stripeFalso({ promo: false });
    const r = await ejecutarCheckout({
      body: { carrito: { flux_base: 1 }, clientRef: "a".repeat(240) },
      origin: "https://www.clinera.io",
      stripe,
      now: new Date("2026-12-01T12:00:00-03:00"),
    });
    expect(r.body.promo).toBe(false);
    const params = creadas.at(-1)!;
    expect(params.discounts).toBeUndefined();
    expect(params).not.toHaveProperty("allow_promotion_codes");
    expect(String(params.client_reference_id)).toHaveLength(200);
    expect(creadas[0]).toHaveProperty("adaptive_pricing");
    expect(creadas[1]).not.toHaveProperty("adaptive_pricing");
  });

  test("si Stripe rechaza el código, reintenta sin descuento y responde promo false", async () => {
    const { stripe, creadas } = stripeFalso();
    stripe.checkout.sessions.create = async (params) => {
      creadas.push(params);
      if (params.discounts) throw new Error("No such promotion code: promo_fp");
      return { url: "https://checkout.stripe.com/c/pay/cs_test_ok" };
    };
    const r = await ejecutarCheckout({
      body: { carrito: { flux_base: 1 } },
      origin: "https://www.clinera.io",
      stripe,
      now: new Date("2026-12-01T12:00:00-03:00"),
    });
    expect(r.status).toBe(200);
    expect(r.body.ok).toBe(true);
    expect(r.body.promo).toBe(false);
    expect(r.body.url).toContain("checkout.stripe.com");
    expect(creadas[0]).toHaveProperty("discounts");
    expect(creadas[1]).not.toHaveProperty("discounts");
    expect((creadas[1].metadata as Record<string, string>).promo).toBe("none");
    expect(creadas[1]).not.toHaveProperty("allow_promotion_codes");
  });

  test("el onboarding entra a US$ 190 y el 50% solo baja lo mensual", async () => {
    const { stripe, creadas, cupones } = stripeFalso();
    const r = await ejecutarCheckout({
      body: { carrito: { flux_base: 1, onboarding_humano: 1, instagram: 1 } },
      origin: "https://www.clinera.io",
      stripe,
      now: new Date("2026-11-05T12:00:00-03:00"),
    });
    expect(r.status).toBe(200);
    expect(r.body.lista_usd).toBe(228);
    expect(r.body.promo_usd).toBe(209);
    expect(r.body.promo).toBe(true);
    expect(cupones).toEqual([
      expect.objectContaining({
        amount_off: 1900,
        currency: "usd",
        duration: "repeating",
        duration_in_months: 3,
        max_redemptions: 1,
      }),
    ]);
    const params = creadas.at(-1)!;
    const lineas = params.line_items as { price: string; quantity: number }[];
    expect(lineas).toEqual([
      { price: "price_flux_base", quantity: 1 },
      { price: "price_instagram", quantity: 1 },
      { price: "price_onboarding_humano", quantity: 1 },
    ]);
    expect(params.discounts).toEqual([{ coupon: "coupon_mensual" }]);
    expect(params).not.toHaveProperty("allow_promotion_codes");
    expect((params.metadata as Record<string, string>).promo_alcance).toBe("mensual");
    expect((params.metadata as Record<string, string>).promo_usd).toBe("209");
  });

  test("un Price mensual en el onboarding no se cobra", async () => {
    const { stripe, cupones } = stripeFalso();
    stripe.prices.list = async () => ({
      data: (Object.keys(CARRITO) as ItemId[]).map((id) => {
        const p = precio(id);
        if (id === "onboarding_humano") p.recurring = { interval: "month" };
        return p;
      }),
    });
    const r = await ejecutarCheckout({
      body: { carrito: { onboarding_humano: 1 } },
      origin: "https://www.clinera.io",
      stripe,
      now: new Date("2026-11-05T12:00:00-03:00"),
    });
    expect(r.status).toBe(409);
    expect(r.body.error).toBe("price_mismatch");
    expect(cupones).toHaveLength(0);
  });

  test("al actualizar el cliente conserva la metadata que ya tenía", async () => {
    const { stripe } = stripeFalso();
    const updates: Record<string, unknown>[] = [];
    stripe.customers.list = async () => ({ data: [{ id: "cus_old", metadata: { campana: "hebe", fuente: "wizard" } }] });
    stripe.customers.update = async (id, params) => {
      updates.push({ id, ...params });
      return { id };
    };
    stripe.checkout.sessions.create = async () => ({ url: "https://checkout.stripe.com/c/pay/cs_test_ok" });
    const r = await ejecutarCheckout({
      body: { carrito: { flux_base: 1 }, email: "ana@clinica.cl" },
      origin: "https://www.clinera.io",
      stripe,
      now: new Date("2026-12-01T12:00:00-03:00"),
    });
    expect(r.status).toBe(200);
    expect(updates[0]).toMatchObject({
      id: "cus_old",
      metadata: { campana: "hebe", fuente: "contrata_carrito" },
    });
  });
});
