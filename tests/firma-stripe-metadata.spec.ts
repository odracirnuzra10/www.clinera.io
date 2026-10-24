import { expect, test } from "@playwright/test";
import {
  EMPRESA_STRIPE_CLINERA,
  closerParaStripe,
  metadataStripeAlta,
  payloadSesionAlta,
} from "../src/lib/firma/stripe";
import type { SobreMeta } from "../src/lib/firma/tipos";
import type { CotizacionSnapshot } from "../src/lib/firma/cotizacion";

/**
 * El checkout de `/firma` tiene que llevar el closer real (gestor) y la
 * empresa en metadata de sesión y de suscripción. n8n
 * (`7jgtp669q8pWJKm6`) lee eso al dar de alta Movimiento (940). El CEO
 * (`meta.closer`) no viaja: esa firma es legal, no comercial.
 */

const CEO: SobreMeta["closer"] = {
  nombre: "Ricardo Oyarzún",
  email: "ricardo@oacg.cl",
  cargo: "CEO",
  firmadoEn: "2026-09-15T16:00:00.000Z",
  ip: "127.0.0.1",
  userAgent: "test",
  firmaPng: "data:image/png;base64,AA==",
};

const COTIZACION: CotizacionSnapshot = {
  numero: "CLI-20260915-001",
  planId: "vortex",
  planNombre: "Vortex",
  billing: "monthly",
  periodoMeses: 1,
  extraUsuarios: 0,
  extraPacks: 0,
  incluirSetup: false,
  descuentos: { plan: 20, users: 0, credits: 0, setup: 0, global: 0 },
  duracionDescuento: { tipo: "siempre" },
  moneda: "USD",
  centavos: {
    planLista: 27900,
    usuarioLista: 0,
    packLista: 0,
    setupLista: 45000,
    recurrenteLista: 27900,
    recurrenteFinal: 22320,
    descuentoRecurrente: 5580,
    setupFinal: 0,
  },
};

function sobre(parcial: Partial<SobreMeta> = {}): SobreMeta {
  return {
    version: 1,
    id: "5c022209850561f34888d7d2abf92c40",
    creadoEn: "2026-09-14T17:54:00.000Z",
    estado: "pendiente",
    titulo: "Cotización CLI-20260915-001",
    documento: null,
    cliente: {
      nombre: "Sociedad Odontológica Dental Fresh",
      email: "rojedadentalfresh@gmail.com",
    },
    closer: CEO,
    cotizacion: COTIZACION,
    ...parcial,
  };
}

test("closerParaStripe usa el gestor, nunca al CEO", () => {
  expect(closerParaStripe(sobre())).toBeNull();
  expect(
    closerParaStripe(
      sobre({
        gestor: { nombre: "Nohelymar C.", email: "nohe@oacg.cl" },
      }),
    ),
  ).toEqual({ nombre: "Nohelymar C.", email: "nohe@oacg.cl" });
  expect(
    closerParaStripe({
      gestor: { nombre: "  ", email: "nohe@oacg.cl" },
    }),
  ).toBeNull();
});

test("metadataStripeAlta lleva empresa, folio, cliente y closer del gestor", () => {
  const conGestor = metadataStripeAlta(
    sobre({
      gestor: { nombre: "Nohelymar C.", email: "nohe@oacg.cl" },
    }),
  );
  expect(conGestor).toEqual({
    folio_firma: "5c022209850561f34888d7d2abf92c40",
    empresa: EMPRESA_STRIPE_CLINERA,
    cotizacion: "CLI-20260915-001",
    plan: "Vortex",
    cliente: "Sociedad Odontológica Dental Fresh",
    closer: "Nohelymar C.",
    closer_email: "nohe@oacg.cl",
  });
  expect(conGestor.closer).not.toContain("Ricardo");
  expect(EMPRESA_STRIPE_CLINERA).toBe("clinera");

  const sinGestor = metadataStripeAlta(sobre());
  expect(sinGestor.closer).toBeUndefined();
  expect(sinGestor.closer_email).toBeUndefined();
  expect(sinGestor.empresa).toBe("clinera");
});

test("payloadSesionAlta copia la metadata a la suscripción y el nombre al description", () => {
  const meta = sobre({
    gestor: { nombre: "Catalina", email: "catalina@oacg.cl" },
  });
  const payload = payloadSesionAlta(meta);
  expect(payload.metadata).toEqual(payload.subscription_data.metadata);
  expect(payload.subscription_data.description).toBe(
    "Sociedad Odontológica Dental Fresh",
  );
  expect(payload.metadata.closer).toBe("Catalina");
  expect(payload.metadata.empresa).toBe("clinera");
});

test("el nombre del cliente se recorta a 100 caracteres (límite práctico de metadata)", () => {
  const largo = "N".repeat(180);
  const meta = metadataStripeAlta(
    sobre({ cliente: { nombre: largo, email: "a@b.cl" } }),
  );
  expect(meta.cliente).toHaveLength(100);
});
