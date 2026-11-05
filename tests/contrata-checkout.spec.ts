import { expect, test } from "@playwright/test";
import { CARRITO, type ItemId } from "@/content/carrito-flux";
import { ejecutarCheckout, vaciarCacheContrata, type PrecioStripe, type StripeContrata } from "@/lib/contrata-checkout";

function precio(id: ItemId, unit = CARRITO[id].usd * 100): PrecioStripe {
  return {
    id: `price_${id}`,
    lookup_key: CARRITO[id].lookup,
    unit_amount: unit,
    currency: "usd",
    recurring: { interval: "month" },
  };
}

function stripeFalso(opts?: { promo?: boolean; unit?: (id: ItemId) => number; faltan?: ItemId[] }) {
  const creadas: Record<string, unknown>[] = [];
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
  };
  return { stripe, creadas };
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
});
