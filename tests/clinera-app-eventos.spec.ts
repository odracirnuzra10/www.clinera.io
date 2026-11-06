// Webhook de app.clinera.io → Meta (StartTrial y UsoReal), 6-nov-2026.
// Corre el código real de los nodos con stubs de n8n.
import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "integrations/n8n/clinera-app-eventos");
const decidirSrc = readFileSync(join(DIR, "decidir.js"), "utf8");
const confirmarSrc = readFileSync(join(DIR, "confirmar.js"), "utf8");

type Item = { json: Record<string, any> };
function correr(src: string, st: Record<string, any>, items: Item[], nodos: Record<string, Item[]> = {}) {
  const fn = new Function("require", "$getWorkflowStaticData", "$input", "$", src);
  return fn(require, () => st, { all: () => items }, (n: string) => ({ all: () => nodos[n] ?? [] })) as Item[];
}
const ev = (b: Record<string, any>) => ({ json: { body: b } });
const ahora = new Date().toISOString();

test.describe("webhook app.clinera.io → Meta", () => {
  test("account_created manda StartTrial con correo y celular hasheados, una sola vez", () => {
    const st: Record<string, any> = {};
    const out = correr(decidirSrc, st, [ev({ event: "account_created", account_id: "a1", email: "Ana@Clinica.cl ", telefono: "+56 9 1234 5678", occurred_at: ahora, lead_event_id: "lead_kg_x", fbclid: "abc" })]);
    expect(out).toHaveLength(1);
    const d = out[0].json.payload.data[0];
    expect(d.event_name).toBe("StartTrial");
    expect(d.event_id).toBe("trial_a1");
    expect(d.user_data.em[0]).toMatch(/^[0-9a-f]{64}$/);
    expect(d.user_data.ph[0]).toMatch(/^[0-9a-f]{64}$/);
    expect(d.user_data.fbc).toMatch(/^fb\.1\.\d+\.abc$/);
    expect(d.custom_data.lead_event_id).toBe("lead_kg_x");
    // Meta lo confirma → no se repite
    correr(confirmarSrc, st, [{ json: { events_received: 1 } }], { "Hay que enviar?": out });
    const otra = correr(decidirSrc, st, [ev({ event: "account_created", account_id: "a1", occurred_at: ahora })]);
    expect(otra[0].json.enviar).toBe(false);
    expect(otra[0].json.omitido).toBe("ya_enviado");
  });

  test("si Meta no confirma, se vuelve a intentar con el siguiente aviso", () => {
    const st: Record<string, any> = {};
    const out = correr(decidirSrc, st, [ev({ event: "account_created", account_id: "a2", occurred_at: ahora })]);
    correr(confirmarSrc, st, [{ json: { error: { message: "x" } } }], { "Hay que enviar?": out });
    const otra = correr(decidirSrc, st, [ev({ event: "account_created", account_id: "a2", occurred_at: ahora })]);
    expect(otra[0].json.enviar).toBe(true);
  });

  test("UsoReal exige WhatsApp conectado y conversación dentro de los 7 días", () => {
    const st: Record<string, any> = {};
    const t0 = Date.now() - 3 * 864e5;
    correr(decidirSrc, st, [ev({ event: "account_created", account_id: "a3", occurred_at: new Date(t0).toISOString() })]);
    const wa = correr(decidirSrc, st, [ev({ event: "whatsapp_connected", account_id: "a3", occurred_at: new Date(t0 + 864e5).toISOString() })]);
    expect(wa[0].json.enviar).toBe(false);
    const conv = correr(decidirSrc, st, [ev({ event: "first_conversation", account_id: "a3", occurred_at: new Date(t0 + 2 * 864e5).toISOString() })]);
    const uso = conv.find((i) => i.json.evento === "UsoReal");
    expect(uso?.json.payload.data[0].event_id).toBe("uso_real_a3");

    const st2: Record<string, any> = {};
    const v0 = Date.now() - 10 * 864e5;
    correr(decidirSrc, st2, [ev({ event: "account_created", account_id: "a4", occurred_at: new Date(v0).toISOString() })]);
    correr(decidirSrc, st2, [ev({ event: "whatsapp_connected", account_id: "a4", occurred_at: new Date(v0 + 864e5).toISOString() })]);
    const tarde = correr(decidirSrc, st2, [ev({ event: "first_conversation", account_id: "a4", occurred_at: new Date(v0 + 9 * 864e5).toISOString() })]);
    expect(tarde.some((i) => i.json.evento === "UsoReal")).toBe(false);
  });

  test("subscription_started no manda nada (el Purchase lo manda Stripe) y lo desconocido se ignora", () => {
    const st: Record<string, any> = {};
    expect(correr(decidirSrc, st, [ev({ event: "subscription_started", account_id: "a5" })])[0].json.omitido).toBe("purchase_lo_manda_stripe");
    expect(correr(decidirSrc, st, [ev({ event: "ping", account_id: "a5" })])[0].json.omitido).toBe("evento_desconocido");
    expect(correr(decidirSrc, st, [ev({ event: "account_created" })])[0].json.omitido).toBe("sin_event_o_account_id");
  });
});
