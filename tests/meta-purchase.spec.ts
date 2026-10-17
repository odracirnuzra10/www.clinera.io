import { expect, test } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import type Stripe from "stripe";
import {
  buildConversionEvent,
  buildPurchaseEvent,
  isClineraSale,
  isGoPlan,
  isSubscriptionPurchase,
  normalizePhone,
  purchaseEventId,
  sessionValue,
  sqlEventId,
} from "@/lib/meta-purchase";

const sha = (v: string) => createHash("sha256").update(v).digest("hex");

const session = {
  id: "cs_live_a1B2",
  object: "checkout.session",
  mode: "subscription",
  payment_status: "paid",
  created: 1792183000,
  amount_total: 1700,
  currency: "usd",
  customer: "cus_123",
  customer_details: {
    email: "  Dra.Camila@Clinica.CL ",
    phone: "+56 9 1234 5678",
    name: "Camila Rojas Pérez",
    address: { country: "CL" },
  },
} as unknown as Stripe.Checkout.Session;

test.describe("Stripe → Meta CAPI: Purchase de suscripción", () => {
  test("arma el Purchase con valor, moneda y datos de contacto hasheados", () => {
    const ev = buildPurchaseEvent(session, ["Go!"]);
    expect(ev.event_name).toBe("Purchase");
    expect(ev.event_time).toBe(1792183000);
    expect(ev.custom_data.value).toBe(17);
    expect(ev.custom_data.currency).toBe("USD");
    expect(ev.custom_data.content_name).toBe("Go!");
    expect(ev.custom_data.order_id).toBe("cs_live_a1B2");
    expect(ev.action_source).toBe("system_generated");
    // Normaliza antes de hashear: minúsculas sin espacios; teléfono solo dígitos.
    expect(ev.user_data.em).toEqual([sha("dra.camila@clinica.cl")]);
    expect(ev.user_data.ph).toEqual([sha("56912345678")]);
    expect(ev.user_data.fn).toEqual([sha("camila")]);
    expect(ev.user_data.ln).toEqual([sha("rojaspérez")]);
    expect(ev.user_data.country).toEqual([sha("cl")]);
    // Nada sale en claro.
    expect(JSON.stringify(ev.user_data)).not.toMatch(/clinica\.cl|56912345678|camila/i);
  });

  test("el event_id del Purchase (Flux, Ultra) es purchase_{session}", () => {
    expect(buildPurchaseEvent(session).event_id).toBe(purchaseEventId("cs_live_a1B2"));
    expect(purchaseEventId("cs_live_a1B2")).toBe("purchase_cs_live_a1B2");
  });

  test("Go! no es Purchase: es SQL de USD 17 y el navegador de /go/exito usa el mismo event_id (deduplica)", () => {
    const ev = buildConversionEvent(session, ["Go!"]);
    expect(ev.event_name).toBe("SQL");
    expect(ev.event_id).toBe("sql_cs_live_a1B2");
    expect(ev.event_id).toBe(sqlEventId("cs_live_a1B2"));
    expect(ev.custom_data.value).toBe(17);
    expect(ev.custom_data.currency).toBe("USD");
    expect(readFileSync("src/components/go/GoExito.tsx", "utf8")).toContain("sqlEventId(sid)");
  });

  test("el SQL de Go! vale USD 17 aunque Stripe cobre en CLP o con cupón (la sesión de prueba fue CLP 17.401 con 100% de descuento)", () => {
    const clp = { ...session, currency: "clp", amount_total: 0 } as unknown as Stripe.Checkout.Session;
    const ev = buildConversionEvent(clp, ["Go!"]);
    expect(ev.event_name).toBe("SQL");
    expect(ev.custom_data.value).toBe(17);
    expect(ev.custom_data.currency).toBe("USD");
  });

  test("Flux y Ultra siguen mandando Purchase", () => {
    for (const nombre of ["Clinera Flux", "Clinera Ultra", "Flux", "Ultra"]) {
      expect(buildConversionEvent(session, [nombre]).event_name, nombre).toBe("Purchase");
    }
    expect(buildConversionEvent(session, []).event_name).toBe("Purchase");
  });

  test("isGoPlan reconoce «Go!» y no confunde otros nombres", () => {
    expect(isGoPlan(["Go!"])).toBe(true);
    expect(isGoPlan(["Clinera Go!"])).toBe(true);
    expect(isGoPlan(["Plan Go"])).toBe(true);
    expect(isGoPlan(["Gold Plan", "Mango"])).toBe(false);
    expect(isGoPlan(["Clinera Ultra"])).toBe(false);
  });

  test("monedas sin decimales (CLP) no se dividen por 100", () => {
    expect(sessionValue({ ...session, currency: "clp", amount_total: 17401 } as unknown as Stripe.Checkout.Session)).toBe(17401);
    expect(sessionValue(session)).toBe(17);
  });

  test("sin celular o nombre, esos campos se omiten en vez de mandar vacíos", () => {
    const s = { ...session, customer_details: { email: "a@b.cl" } } as unknown as Stripe.Checkout.Session;
    const ud = buildPurchaseEvent(s).user_data;
    expect(Object.keys(ud).sort()).toEqual(["em", "external_id"]);
  });

  test("solo cuentan las suscripciones cobradas", () => {
    expect(isSubscriptionPurchase(session)).toBe(true);
    expect(isSubscriptionPurchase({ ...session, mode: "payment" } as Stripe.Checkout.Session)).toBe(false);
    expect(isSubscriptionPurchase({ ...session, payment_status: "unpaid" } as Stripe.Checkout.Session)).toBe(false);
  });

  test("Marketing (Metricads) no suma al pixel de Clinera", () => {
    expect(isClineraSale(["Go!"])).toBe(true);
    expect(isClineraSale(["Clinera Vortex", "Marketing Pro"])).toBe(true);
    expect(isClineraSale(["Marketing Pro"])).toBe(false);
    expect(isClineraSale([])).toBe(true);
  });

  test("normalizePhone deja solo dígitos", () => {
    expect(normalizePhone("+52 (55) 1234-5678")).toBe("525512345678");
  });

  test("la ruta exige firma y secretos; sin ellos no manda nada", () => {
    const route = readFileSync("src/app/api/stripe/meta-purchase/route.ts", "utf8");
    expect(route).toContain("constructEvent(raw, signature, secret)");
    expect(route).toContain("status: 503");
    expect(route).toContain("checkout.session.completed");
    expect(route).not.toMatch(/console\.(log|error)\([^)]*token/i);
  });
});
