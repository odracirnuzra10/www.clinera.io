// Sesión de Stripe del carrito de /contrata. El navegador manda cantidades;
// los precios salen de lookup_key y se comparan con el catálogo. Si la llave
// o los precios no existen, la ruta responde error y la página ofrece agendar.
// No crea Products ni Prices.

import { emailValido } from "@/app/api/wizard/validation";
import {
  CARRITO,
  ITEM_IDS,
  PROMO_CODE_CARRITO,
  type ItemId,
  carritoCorto,
  regaloVigente,
  sanear,
  totalLista,
  totalPromo,
} from "@/content/carrito-flux";
import { UTM_PARAMS } from "@/content/checkout";

const CACHE_MS = 10 * 60 * 1000;
const PROHIBIDOS = [
  "price",
  "prices",
  "unit_amount",
  "amount",
  "amount_total",
  "regalo",
  "regalo_nov",
  "lookup_key",
  "lookup",
  "line_items",
  "discounts",
  "promotion_code",
];

export type PrecioStripe = {
  id: string;
  lookup_key?: string | null;
  unit_amount?: number | null;
  currency?: string | null;
  recurring?: { interval?: string | null } | null;
};

export interface StripeContrata {
  prices: {
    list: (params: { lookup_keys: string[]; active: boolean; expand?: string[] }) => Promise<{ data: PrecioStripe[] }>;
  };
  promotionCodes: {
    list: (params: { code: string; active: boolean; limit: number }) => Promise<{ data: { id: string }[] }>;
  };
  customers: {
    list: (params: { email: string; limit: number }) => Promise<{ data: { id: string }[] }>;
    update: (id: string, params: Record<string, unknown>) => Promise<{ id: string }>;
    create: (params: Record<string, unknown>) => Promise<{ id: string }>;
  };
  checkout: {
    sessions: {
      create: (params: Record<string, unknown>) => Promise<{ url: string | null }>;
    };
  };
}

export type CheckoutBody = {
  ok: boolean;
  error?: string;
  url?: string;
  lista_usd?: number;
  promo_usd?: number;
  promo?: boolean;
  regalo?: boolean;
};

let preciosCache: { at: number; value: Map<string, PrecioStripe> } | null = null;
let promoCache: { at: number; value: string | null } | null = null;

export function vaciarCacheContrata() {
  preciosCache = null;
  promoCache = null;
}

export function recortarClientRef(ref: string, max = 200): string {
  return ref.length <= max ? ref : ref.slice(0, max);
}

async function catalogo(stripe: StripeContrata): Promise<Map<string, PrecioStripe>> {
  if (preciosCache && Date.now() - preciosCache.at < CACHE_MS) return preciosCache.value;
  const lookup_keys = ITEM_IDS.map((id) => CARRITO[id].lookup);
  const res = await stripe.prices.list({ lookup_keys, active: true, expand: ["data.product"] });
  const map = new Map<string, PrecioStripe>();
  for (const p of res.data) {
    if (p.lookup_key) map.set(p.lookup_key, p);
  }
  preciosCache = { at: Date.now(), value: map };
  return map;
}

async function promoId(stripe: StripeContrata): Promise<string | null> {
  if (promoCache && Date.now() - promoCache.at < CACHE_MS) return promoCache.value;
  const res = await stripe.promotionCodes.list({ code: PROMO_CODE_CARRITO, active: true, limit: 1 });
  const id = res.data[0]?.id ?? null;
  promoCache = { at: Date.now(), value: id };
  return id;
}

function utmDe(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object") return {};
  const src = raw as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const k of [...UTM_PARAMS, "gclid"] as const) {
    const v = src[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, 200);
  }
  return out;
}

export async function ejecutarCheckout(input: {
  body: unknown;
  origin: string;
  stripe: StripeContrata;
  now?: Date;
}): Promise<{ status: number; body: CheckoutBody }> {
  const data = input.body;
  if (!data || typeof data !== "object") return { status: 400, body: { ok: false, error: "bad_json" } };
  const src = data as Record<string, unknown>;
  if (PROHIBIDOS.some((k) => k in src)) return { status: 400, body: { ok: false, error: "client_price" } };

  const crudo = src.carrito;
  if (!crudo || typeof crudo !== "object" || Array.isArray(crudo)) {
    return { status: 400, body: { ok: false, error: "carrito" } };
  }
  const now = input.now ?? new Date();
  const cantidades = sanear(crudo as Partial<Record<ItemId, number>>, now);
  const lista = totalLista(cantidades, now);
  const promoUsd = totalPromo(cantidades, now);
  const regalo = regaloVigente(now);

  let precios: Map<string, PrecioStripe>;
  try {
    precios = await catalogo(input.stripe);
  } catch (e) {
    console.error("[contrata/checkout] no se leyeron los precios", e instanceof Error ? e.message : e);
    return { status: 502, body: { ok: false, error: "stripe" } };
  }

  const lineas: { price: string; quantity: number }[] = [];
  for (const id of ITEM_IDS) {
    const qty = cantidades[id];
    if (qty <= 0) continue;
    const spec = CARRITO[id];
    const precio = precios.get(spec.lookup);
    if (!precio) return { status: 503, body: { ok: false, error: "prices_missing", promo: false } };
    const ok =
      precio.unit_amount === spec.usd * 100 &&
      (precio.currency ?? "").toLowerCase() === "usd" &&
      precio.recurring?.interval === "month";
    if (!ok) return { status: 409, body: { ok: false, error: "price_mismatch" } };
    lineas.push({ price: precio.id, quantity: qty });
  }

  const email = typeof src.email === "string" ? src.email.trim().toLowerCase().slice(0, 200) : "";
  if (email && !emailValido(email)) return { status: 400, body: { ok: false, error: "invalid_email" } };

  let customerId = "";
  if (email) {
    const previos = await input.stripe.customers.list({ email, limit: 1 });
    const meta = { metadata: { fuente: "contrata_carrito" } };
    const cliente = previos.data[0]
      ? await input.stripe.customers.update(previos.data[0].id, meta)
      : await input.stripe.customers.create({ email, ...meta });
    customerId = cliente.id;
  }

  let codigo = "";
  try {
    codigo = (await promoId(input.stripe)) ?? "";
  } catch (e) {
    console.error("[contrata/checkout] no se leyó el código", e instanceof Error ? e.message : e);
    return { status: 502, body: { ok: false, error: "stripe" } };
  }

  const utm = utmDe(src.utm);
  const clientRef = recortarClientRef(typeof src.clientRef === "string" ? src.clientRef.trim() : "");
  const metadata: Record<string, string> = {
    fuente: "contrata_carrito",
    carrito: carritoCorto(cantidades, now).slice(0, 500),
    lista_usd: String(lista),
    promo_usd: String(promoUsd),
    promo: codigo ? PROMO_CODE_CARRITO : "none",
    ...utm,
  };
  if (regalo) metadata.regalo_nov = "email_marketing,automatizaciones";

  const params: Record<string, unknown> = {
    mode: "subscription",
    line_items: lineas,
    phone_number_collection: { enabled: true },
    success_url: `${input.origin}/contrata?pago=ok&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.origin}/contrata?pago=cancelado`,
    locale: "es",
    metadata,
    subscription_data: { metadata },
    adaptive_pricing: { enabled: true },
  };
  if (codigo) params.discounts = [{ promotion_code: codigo }];
  if (customerId) {
    params.customer = customerId;
    params.customer_update = { name: "auto" };
  }
  if (clientRef) params.client_reference_id = clientRef;

  try {
    let session: { url: string | null };
    try {
      session = await input.stripe.checkout.sessions.create(params);
    } catch (e) {
      if (!/adaptive_pricing/i.test(e instanceof Error ? e.message : "")) throw e;
      const sin = { ...params };
      delete sin.adaptive_pricing;
      session = await input.stripe.checkout.sessions.create(sin);
    }
    if (!session.url) return { status: 502, body: { ok: false, error: "no_url" } };
    return {
      status: 200,
      body: { ok: true, url: session.url, lista_usd: lista, promo_usd: promoUsd, promo: Boolean(codigo), regalo },
    };
  } catch (e) {
    console.error("[contrata/checkout] Stripe rechazó la sesión", e instanceof Error ? e.message : e);
    return { status: 502, body: { ok: false, error: "stripe" } };
  }
}
