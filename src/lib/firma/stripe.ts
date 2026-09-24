// ============================================================================
// Firma + pago — creación del checkout de Stripe
// ----------------------------------------------------------------------------
// Cuando el cliente ya firmó y el sobre trae cotización, este módulo arma una
// Checkout Session en modo suscripción que replica la cotización:
//
//   - Ítems recurrentes a PRECIO DE LISTA (plan, usuarios extra, packs de
//     créditos), con el intervalo mensual o semestral.
//   - Un cupón por el monto exacto del descuento por período, con la duración
//     elegida por el closer: solo el primer pago, N meses, o para siempre.
//     Así una personalización temporal expira sola y la suscripción vuelve a
//     precio de lista sin tocar nada.
//   - La configuración inicial como cobro único en el primer pago (ya con su
//     descuento aplicado).
//
// Las sesiones expiran a las 24 h, por eso se crean on-demand en cada visita
// a /api/firma/[id]/pago en vez de guardarse.
//
// Config: STRIPE_SECRET_KEY — se recomienda una clave restringida con Write en
// Checkout Sessions, Customers, Products, Prices y Coupons (ver docs/firma.md).
// ============================================================================

import Stripe from "stripe";
import { periodoAdjetivo, periodoSustantivo } from "./cotizacion";
import type { SobreMeta } from "./tipos";

export function stripeConfigurado(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** Empresa que cobra un checkout de `/firma`. n8n la copia a Movimiento (940). */
export const EMPRESA_STRIPE_CLINERA = "clinera";

/**
 * Quien cerró la venta, para n8n. `closer` en el sobre es el CEO (firma
 * legal); el ejecutivo real es `gestor`. Sin gestor no se inventa: el
 * workflow sigue el hash Catalina/Nohe de siempre.
 */
export function closerParaStripe(
  meta: Pick<SobreMeta, "gestor">,
): { nombre: string; email: string } | null {
  const nombre = meta.gestor?.nombre?.trim() ?? "";
  const email = meta.gestor?.email?.trim() ?? "";
  if (!nombre || !email) return null;
  return { nombre, email };
}

/**
 * Metadata de la Checkout Session y de la suscripción. n8n
 * (`7jgtp669q8pWJKm6`) lee `closer` / `closer_email` / `empresa` al dar de
 * alta Movimiento (940) y Activación (957). Valores ≤ 500 caracteres (límite
 * de Stripe).
 */
export function metadataStripeAlta(meta: SobreMeta): Record<string, string> {
  const out: Record<string, string> = {
    folio_firma: meta.id,
    empresa: EMPRESA_STRIPE_CLINERA,
  };
  if (meta.cotizacion?.numero) out.cotizacion = meta.cotizacion.numero;
  if (meta.cotizacion?.planNombre) out.plan = meta.cotizacion.planNombre.slice(0, 40);
  const cliente = meta.cliente.nombre?.trim();
  if (cliente) out.cliente = cliente.slice(0, 100);
  const closer = closerParaStripe(meta);
  if (closer) {
    out.closer = closer.nombre.slice(0, 100);
    out.closer_email = closer.email.slice(0, 100);
  }
  return out;
}

/**
 * Lo que `checkout.sessions.create` recibe aparte de line_items: la misma
 * metadata en sesión y suscripción, y el nombre del cliente en la
 * descripción (Stripe no copia `customer_email` al name del Customer).
 */
export function payloadSesionAlta(meta: SobreMeta): {
  metadata: Record<string, string>;
  subscription_data: {
    metadata: Record<string, string>;
    description?: string;
  };
} {
  const metadata = metadataStripeAlta(meta);
  const nombre = meta.cliente.nombre.trim();
  return {
    metadata,
    subscription_data: {
      metadata,
      ...(nombre ? { description: nombre.slice(0, 350) } : {}),
    },
  };
}

/**
 * Customer con nombre, reutilizado por email. `customer_creation` no aplica
 * en mode=subscription (solo payment/setup); sin este paso Stripe deja el
 * Customer sin `name` y n8n arma el alta con el correo.
 */
async function customerParaCheckout(
  stripe: Stripe,
  meta: SobreMeta,
): Promise<Pick<Stripe.Checkout.SessionCreateParams, "customer" | "customer_email">> {
  const email = meta.cliente.email?.trim();
  const name = meta.cliente.nombre.trim();
  if (!email) return {};
  if (!name) return { customer_email: email };

  const existentes = await stripe.customers.list({ email, limit: 1 });
  const actual = existentes.data[0];
  if (actual) {
    if (actual.name !== name) {
      await stripe.customers.update(actual.id, { name });
    }
    return { customer: actual.id };
  }
  const creado = await stripe.customers.create({ email, name });
  return { customer: creado.id };
}

function descripcionDuracion(meta: SobreMeta): Stripe.CouponCreateParams {
  const cotizacion = meta.cotizacion!;
  const base: Stripe.CouponCreateParams = {
    amount_off: cotizacion.centavos.descuentoRecurrente,
    currency: "usd",
    name: `Descuento cotización ${cotizacion.numero}`.slice(0, 40),
  };
  const dur = cotizacion.duracionDescuento;
  if (dur.tipo === "siempre") return { ...base, duration: "forever" };
  if (dur.tipo === "meses") {
    return { ...base, duration: "repeating", duration_in_months: dur.meses };
  }
  return { ...base, duration: "once" };
}

/** Crea la sesión de pago y devuelve la URL de checkout. */
export async function crearSesionPago(
  meta: SobreMeta,
  urls: { exito: string; cancelado: string },
): Promise<string> {
  const cotizacion = meta.cotizacion;
  if (!cotizacion) throw new Error("El sobre no tiene cotización asociada.");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  // Los 12 meses del anual se expresan como un intervalo anual: Stripe acepta
  // interval_count hasta 12 en meses, pero "year" es lo que muestra al cliente.
  const recurring: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Recurring =
    cotizacion.periodoMeses === 12
      ? { interval: "year", interval_count: 1 }
      : { interval: "month", interval_count: cotizacion.periodoMeses };
  const sufijoPeriodo = periodoSustantivo(cotizacion.periodoMeses);

  const lineas: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: cotizacion.centavos.planLista,
        recurring,
        product_data: {
          name: `Plan ${cotizacion.planNombre} · Clinera`,
          description: `Suscripción ${periodoAdjetivo(cotizacion.periodoMeses)} — cotización ${cotizacion.numero}`,
        },
      },
    },
  ];

  if (cotizacion.extraUsuarios > 0) {
    lineas.push({
      quantity: cotizacion.extraUsuarios,
      price_data: {
        currency: "usd",
        unit_amount: cotizacion.centavos.usuarioLista,
        recurring,
        product_data: { name: `Usuario adicional · Clinera (por ${sufijoPeriodo})` },
      },
    });
  }

  if (cotizacion.extraPacks > 0) {
    lineas.push({
      quantity: cotizacion.extraPacks,
      price_data: {
        currency: "usd",
        unit_amount: cotizacion.centavos.packLista,
        recurring,
        product_data: { name: `Pack de créditos IA · Clinera (por ${sufijoPeriodo})` },
      },
    });
  }

  if (cotizacion.incluirSetup && cotizacion.centavos.setupFinal > 0) {
    lineas.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: cotizacion.centavos.setupFinal,
        product_data: { name: "Configuración inicial · Clinera (pago único)" },
      },
    });
  }

  let descuentos: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
  if (cotizacion.centavos.descuentoRecurrente > 0) {
    const cupon = await stripe.coupons.create(descripcionDuracion(meta));
    descuentos = [{ coupon: cupon.id }];
  }

  const alta = payloadSesionAlta(meta);
  const customer = await customerParaCheckout(stripe, meta);
  const sesion = await stripe.checkout.sessions.create({
    mode: "subscription",
    ...customer,
    line_items: lineas,
    discounts: descuentos,
    success_url: urls.exito,
    cancel_url: urls.cancelado,
    metadata: alta.metadata,
    subscription_data: alta.subscription_data,
  });

  if (!sesion.url) throw new Error("Stripe no devolvió URL de checkout.");
  return sesion.url;
}

/**
 * Verifica contra Stripe que una checkout session esté pagada y pertenezca al
 * folio indicado (el ?pago=ok de la URL jamás se toma como prueba de pago).
 */
export async function sesionPagada(
  sessionId: string,
  folio: string,
): Promise<boolean> {
  if (!/^cs_[a-zA-Z0-9_]+$/.test(sessionId)) return false;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const sesion = await stripe.checkout.sessions.retrieve(sessionId);
  return (
    sesion.payment_status === "paid" && sesion.metadata?.folio_firma === folio
  );
}
