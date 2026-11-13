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
    expect(d.custom_data.value).toBe(30);
    expect(d.custom_data.currency).toBe("USD");
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
    expect(uso?.json.payload.data[0].custom_data.value).toBe(60);
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

// Trial en Twenty (7-nov-2026): corre el nodo real contra un Twenty simulado.
const trialSrc = readFileSync(join(DIR, "trial-twenty.js"), "utf8");
const loopsSrc = readFileSync(join(DIR, "loops-evento.js"), "utf8");
type Llamada = { method: string; url: string; body?: any };
async function trial(items: Item[], st: Record<string, any>, twenty: (c: Llamada) => any) {
  const llamadas: Llamada[] = [];
  const ctx = { helpers: { httpRequest: async (o: any) => { const c = { method: o.method, url: o.url, body: o.body }; llamadas.push(c); return twenty(c); } } };
  const AsyncFn = Object.getPrototypeOf(async function () {}).constructor;
  const fn = new AsyncFn("$env", "$getWorkflowStaticData", "$input", trialSrc);
  const out = await fn.call(ctx, { TWENTY_API_KEY: "k" }, () => st, { all: () => items });
  return { out: out as Item[], llamadas };
}
const vacio = { data: { people: [], opportunities: [] } };

test.describe("Trial en Twenty", () => {
  test("sin persona: crea persona y negocio en TRIAL y avisa una sola vez", async () => {
    const st: Record<string, any> = {};
    const twenty = (c: Llamada) =>
      c.method === "GET" ? vacio : c.url.endsWith("/rest/people") ? { data: { createPerson: { id: "p1" } } } : { data: { createOpportunity: { id: "o1" } } };
    const r = await trial([ev({ event: "account_created", account_id: "a1", email: "Ana@Clinica.cl", telefono: "+56912345678", nombre: "Ana Pérez", clinica: "Clínica Aurora", fbclid: "x" })], st, twenty);
    expect(r.out).toHaveLength(1);
    expect(r.out[0].json.accion).toBe("creado_en_trial");
    expect(r.out[0].json.text).toContain("Trial nuevo");
    expect(r.out[0].json.text).toContain("/object/opportunity/o1");
    const opp = r.llamadas.find((c) => c.method === "POST" && c.url.endsWith("/rest/opportunities"))!;
    expect(opp.body).toMatchObject({ stage: "TRIAL", pointOfContactId: "p1", canalOrigen: "META_ADS", name: "Clínica Aurora" });
    const otra = await trial([ev({ event: "account_created", account_id: "a1", email: "ana@clinica.cl" })], st, twenty);
    expect(otra.out).toHaveLength(0);
  });

  test("negocio en MQL sube a TRIAL; un cliente no se toca ni se avisa", async () => {
    const conNegocio = (stage: string) => (c: Llamada) =>
      c.method === "GET" && c.url.includes("/rest/people") ? { data: { people: [{ id: "p1" }] } }
      : c.method === "GET" ? { data: { opportunities: [{ id: "o9", stage }] } } : {};
    const r = await trial([ev({ event: "account_created", account_id: "a2", email: "x@y.cl" })], {}, conNegocio("MQL"));
    expect(r.llamadas.some((c) => c.method === "PATCH" && c.url.endsWith("/rest/opportunities/o9") && c.body.stage === "TRIAL")).toBe(true);
    expect(r.out[0].json.accion).toBe("subido_a_trial");
    const cli = await trial([ev({ event: "account_created", account_id: "a3", email: "x@y.cl" })], {}, conNegocio("CUSTOMER"));
    expect(cli.llamadas.some((c) => c.method === "PATCH")).toBe(false);
    expect(cli.out).toHaveLength(0);
  });

  test("otros eventos no tocan Twenty", async () => {
    const r = await trial([ev({ event: "whatsapp_connected", account_id: "a4", email: "x@y.cl" })], {}, () => vacio);
    expect(r.llamadas).toHaveLength(0);
    expect(r.out).toHaveLength(0);
  });

  test("Loops recibe cada aviso como evento con las propiedades del contacto", () => {
    const out = correr(loopsSrc, {}, [
      ev({ event: "account_created", email: "Ana@Clinica.cl", nombre: "Ana Pérez", clinica: "Aurora", account_id: "a1", occurred_at: ahora }),
      ev({ event: "whatsapp_connected", email: "ana@clinica.cl" }),
      ev({ event: "ping", email: "ana@clinica.cl" }),
    ]);
    expect(out).toHaveLength(2);
    expect(out[0].json.body).toMatchObject({ email: "ana@clinica.cl", eventName: "trial_iniciado", firstName: "Ana", clinica: "Aurora" });
    expect(out[1].json.body).toMatchObject({ eventName: "whatsapp_conectado", whatsappConectado: true });
  });
});
