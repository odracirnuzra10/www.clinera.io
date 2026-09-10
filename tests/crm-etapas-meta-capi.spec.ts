import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import vm from "node:vm";

/**
 * Embudo canónico de W1. El archivo es jsCode de n8n (return de primer
 * nivel): no se puede require(). Se evalúan los helpers hasta el marcador.
 */
const SRC = readFileSync(
  join(process.cwd(), "integrations/n8n/crm-etapas-meta-capi.mapeo.js"),
  "utf8",
);
const AGENTS = readFileSync(join(process.cwd(), "AGENTS.md"), "utf8");
const README = readFileSync(
  join(process.cwd(), "integrations/n8n/README.md"),
  "utf8",
);

function loadHelpers() {
  const start = SRC.indexOf("const crypto = require");
  const end = SRC.indexOf("// --- fin helpers puros ---");
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  const box = { module: { exports: {} }, exports: {}, require: createRequire(__filename) };
  vm.runInNewContext(
    `${SRC.slice(start, end)}\nmodule.exports = { mapearEtapa, leadIdEntero, valorPurchase, etapasImplicitas };`,
    box,
  );
  return box.module.exports as {
    mapearEtapa: (
      stage: string,
      opts?: { leadgenId?: unknown; planClinera?: string },
    ) => { skip?: boolean; motivo?: string; event_name?: string; value?: number };
    leadIdEntero: (raw: unknown) => number | null;
    valorPurchase: (plan?: string) => number;
    etapasImplicitas: (
      evento: string,
      enviados: Record<string, unknown>,
      recordId: string,
    ) => { event_name: string; value: number | null; stage: string }[];
  };
}

test.describe("W1 embudo canónico (Nuevo → Customer)", () => {
  test("los estados canónicos y ningún otro", () => {
    const { mapearEtapa, valorPurchase } = loadHelpers();
    expect(mapearEtapa("NEW")).toEqual({ event_name: "Nuevo", value: 0 });
    expect(mapearEtapa("Nuevo")).toEqual({ event_name: "Nuevo", value: 0 });
    expect(mapearEtapa("PQL")).toEqual({ skip: true, motivo: "etapa_eliminada" });
    expect(mapearEtapa("MQL")).toEqual({ event_name: "MQL", value: 10 });
    expect(mapearEtapa("MEETING")).toEqual({ event_name: "SQL", value: 100 });
    expect(mapearEtapa("SQL")).toEqual({ event_name: "SQL", value: 100 });
    expect(mapearEtapa("PROPOSAL")).toEqual({ event_name: "HOT", value: 200 });
    expect(mapearEtapa("HOT")).toEqual({ event_name: "HOT", value: 200 });
    expect(mapearEtapa("NQL")).toEqual({ event_name: "NQL", value: 0 });
    expect(mapearEtapa("no responde")).toEqual({ event_name: "NQL", value: 0 });
    expect(mapearEtapa("no califica")).toEqual({ event_name: "NQL", value: 0 });
    expect(mapearEtapa("CUSTOMER", { planClinera: "SUMMIT" })).toEqual({
      event_name: "Purchase",
      value: 479,
    });
    expect(valorPurchase("")).toBe(279);
    expect(valorPurchase("ATLAS")).toBe(379);
  });

  test("SCREENING y lo demás no emiten", () => {
    const { mapearEtapa } = loadHelpers();
    expect(mapearEtapa("SCREENING")).toEqual({ skip: true, motivo: "screening_eliminado" });
    expect(mapearEtapa("SCREENING", { leadgenId: 1542457337898951 }).skip).toBe(true);
    expect(mapearEtapa("NoContesta")).toEqual({ skip: true, motivo: "etapa_eliminada" });
    expect(mapearEtapa("SQL_Plus")).toEqual({ skip: true, motivo: "etapa_eliminada" });
    expect(mapearEtapa("PQL")).toEqual({ skip: true, motivo: "etapa_eliminada" });
    expect(mapearEtapa("PQL").event_name).not.toBe("MQL");
    expect(mapearEtapa("PQL").event_name).not.toBe("NoContesta");
    expect(mapearEtapa("NQL").event_name).not.toBe("MQL");
  });

  test("lead_id es entero positivo, nunca hash", () => {
    const { leadIdEntero } = loadHelpers();
    expect(leadIdEntero(1058798810462323)).toBe(1058798810462323);
    expect(leadIdEntero("12")).toBe(12);
    expect(leadIdEntero("12.5")).toBeNull();
    expect(leadIdEntero("")).toBeNull();
    expect(leadIdEntero("abc")).toBeNull();
  });

  test("un estado implica los anteriores: MQL < SQL < HOT < Purchase (Ricardo, 10-sep)", () => {
    const { etapasImplicitas } = loadHelpers();
    const nombres = (evento: string, ledger: Record<string, unknown> = {}) =>
      etapasImplicitas(evento, ledger, "o").map((e) => e.event_name);
    expect(nombres("SQL")).toEqual(["MQL"]);
    expect(nombres("HOT")).toEqual(["MQL", "SQL"]);
    expect(nombres("Purchase")).toEqual(["MQL", "SQL", "HOT"]);
    expect(nombres("MQL")).toEqual([]);
    expect(nombres("Nuevo")).toEqual([]);
    expect(nombres("NQL")).toEqual([]);
    // Si el MQL se mandó alguna vez, no se rellena: acá no corre la ventana de 28 días.
    const viejo = { at: new Date(Date.now() - 90 * 86400000).toISOString() };
    expect(nombres("SQL", { "MQL:o": viejo })).toEqual([]);
    expect(nombres("SQL", { "MQL:otro": viejo })).toEqual(["MQL"]);
    expect(nombres("Purchase", { "SQL:o": viejo })).toEqual(["MQL", "HOT"]);
    expect(etapasImplicitas("SQL", {}, "o")[0]).toEqual({ event_name: "MQL", value: 10, stage: "MQL" });
  });

  test("AGENTS.md y el README no tienen dos tablas de mapeo distintas", () => {
    expect(AGENTS).toContain("| `NEW` | `Nuevo` | 0 |");
    expect(AGENTS).toContain("| `MQL` | `MQL` | 10 |");
    expect(AGENTS).toContain("| `MEETING` | `SQL` | 100 |");
    expect(AGENTS).toContain("| `PROPOSAL` | `HOT` | 200 |");
    expect(AGENTS).toContain("| `NQL` | `NQL` | 0 |");
    expect(AGENTS).not.toContain("| `PQL` | `PQL` | 1 |");
    expect(README).toContain("| `NEW` | `Nuevo` | 0 |");
    expect(README).toContain("| `MQL` | `MQL` | 10 |");
    expect(README).toContain("| `NQL` | `NQL` | 0 |");
    expect(README).not.toContain("| `PQL` | `PQL` | 1 |");
    expect(AGENTS).not.toMatch(/\|\s*`SCREENING`\s*\|\s*`MQL`\s*\|/);
    expect(AGENTS).not.toMatch(/\|\s*`PQL`\s*\|\s*`NoContesta`\s*\|/);
    expect(README).not.toMatch(/\|\s*`PQL`\s*\|\s*`NoContesta`\s*\|/);
    expect(SRC).not.toContain('event_name: "NoContesta"');
    expect(SRC).toMatch(/event_id\s+= \{opportunityId\}_\{stage\}/);
    expect(SRC).toContain('recordId + "_" + String(etapa)');
  });
});

/**
 * Contrato de salida del nodo completo. Los nodos que siguen en W1 no se
 * tocaron el 09-sep y leen `omitido`, `payload`, `ledgerKey`, `evento`,
 * `leadgen_id`, `opportunity_id`. La primera versión del jsCode devolvía
 * `ok` + `event_name` y nada de eso: el filtro dejaba pasar todo y el
 * nodo HTTP mandaba `JSON.stringify(undefined)` → «not valid JSON»,
 * `events_received: 0`. Este bloque corre el jsCode entero con stubs.
 */
type NodeItem = { json: Record<string, any> };

async function runNode(
  bodies: Record<string, unknown>[],
  opts: {
    ledger?: Record<string, unknown>;
    httpRequest?: (req: unknown) => Promise<unknown>;
  } = {},
) {
  const staticData: { enviados?: Record<string, unknown> } = {};
  if (opts.ledger) staticData.enviados = opts.ledger;
  const items = bodies.map((body) => ({ json: { body, headers: {} } }));
  const ctx = {
    require: createRequire(__filename),
    $input: { all: () => items },
    $json: items[0]?.json,
    $env: { TWENTY_URL: "http://twenty.test", TWENTY_API_KEY: "test" },
    $getWorkflowStaticData: () => staticData,
  };
  const fn = vm.runInNewContext(`(async function () {\n${SRC}\n})`, ctx) as (
    this: unknown,
  ) => Promise<NodeItem[]>;
  const out = await fn.call({
    helpers: {
      httpRequest:
        opts.httpRequest ??
        (async () => {
          throw new Error("sin red en el test");
        }),
    },
  });
  return { out, staticData };
}

function webhook(
  stage: string,
  extra: Partial<{
    id: string;
    source: string;
    eventName: string;
    objeto: string;
    leadgenId: string;
    email: string;
    planClinera: string;
  }> = {},
) {
  return {
    eventName: extra.eventName ?? "opportunity.updated",
    objectMetadata: { nameSingular: extra.objeto ?? "opportunity" },
    updatedFields: ["stage"],
    record: {
      id: extra.id ?? "opp-test-1",
      stage,
      leadgenId: extra.leadgenId,
      planClinera: extra.planClinera,
      updatedBy: { source: extra.source ?? "MANUAL" },
      pointOfContact: extra.email ? { emails: { primaryEmail: extra.email } } : undefined,
    },
  };
}

test.describe("W1 nodo completo: lo que leen los nodos siguientes", () => {
  test("NEW creado por n8n → Nuevo 0 con payload, omitido=false y ledgerKey", async () => {
    const { out, staticData } = await runNode([
      webhook("NEW", {
        eventName: "opportunity.created",
        source: "API",
        leadgenId: "1058798810462323",
      }),
    ]);
    expect(out).toHaveLength(1);
    const j = out[0].json;
    expect(j.omitido).toBe(false);
    expect(j.evento).toBe("Nuevo");
    expect(j.event_id).toBe("opp-test-1_NEW");
    expect(j.ledgerKey).toBe("Nuevo:opp-test-1");
    expect(j.leadgen_id).toBe(1058798810462323);
    expect(j.opportunity_id).toBe("opp-test-1");
    // Lo que va a Meta, serializable tal cual por el nodo HTTP.
    const payload = JSON.parse(JSON.stringify(j.payload));
    expect(payload.data).toHaveLength(1);
    const ev = payload.data[0];
    expect(ev.event_name).toBe("Nuevo");
    expect(ev.event_id).toBe("opp-test-1_NEW");
    expect(ev.action_source).toBe("system_generated");
    expect(ev.user_data.lead_id).toBe(1058798810462323);
    expect(ev.custom_data).toMatchObject({
      currency: "USD",
      value: 0,
      lead_stage: "NEW",
      opportunity_id: "opp-test-1",
      leadgen_id: 1058798810462323,
      lead_event_source: "Twenty CRM",
    });
    // El ledger lo escribe «Confirmar y auditar» cuando Meta confirma, no acá.
    expect(staticData.enviados).toBeUndefined();
  });

  test("PQL ya no emite (etapa eliminada); NQL humano sí; API no-NEW se omite", async () => {
    const pql = await runNode([webhook("PQL", { email: "lead@clinica.cl" })]);
    expect(pql.out[0].json.omitido).toBe(true);
    expect(pql.out[0].json.motivo).toBe("etapa_eliminada");
    expect(pql.out[0].json.payload).toBeUndefined();
    expect(pql.out[0].json.evento).not.toBe("MQL");

    const nql = await runNode([webhook("NQL", { email: "lead@clinica.cl" })]);
    expect(nql.out[0].json.omitido).toBe(false);
    expect(nql.out[0].json.payload.data[0].event_name).toBe("NQL");
    expect(nql.out[0].json.payload.data[0].custom_data.value).toBe(0);
    expect(nql.out[0].json.payload.data[0].user_data.em).toHaveLength(1);

    const api = await runNode([webhook("MQL", { email: "lead@clinica.cl", source: "API" })]);
    expect(api.out[0].json.omitido).toBe(true);
    expect(api.out[0].json.motivo).toBe("etapa_movida_por_automatizacion");
    expect(api.out[0].json.payload).toBeUndefined();
  });

  test("todo lo que no se manda sale con omitido=true y sin payload", async () => {
    const { out } = await runNode([
      webhook("NEW", { objeto: "person", eventName: "person.updated" }),
      webhook("SCREENING", { email: "a@b.cl" }),
      webhook("PQL", { id: "", email: "a@b.cl" }),
      webhook("MEETING"),
    ]);
    expect(out.map((i) => i.json.motivo)).toEqual([
      "objeto_no_es_oportunidad",
      "screening_eliminado",
      "etapa_eliminada",
      "sin_email_ni_telefono_ni_lead_id",
    ]);
    for (const item of out) {
      expect(item.json.omitido).toBe(true);
      expect(item.json.payload).toBeUndefined();
    }
  });

  test("ledger de «Confirmar y auditar» (objeto con at) evita el reenvío; un MQL viejo no bloquea un NQL", async () => {
    const reciente = { at: new Date().toISOString(), event_id: "x", evento: "NQL" };
    const bloqueado = await runNode([webhook("NQL", { id: "opp-2", email: "a@b.cl" })], {
      ledger: { "NQL:opp-2": reciente },
    });
    expect(bloqueado.out[0].json.omitido).toBe(true);
    expect(bloqueado.out[0].json.motivo).toBe("ya_enviado_ledger");

    const otroEvento = await runNode([webhook("NQL", { id: "opp-2", email: "a@b.cl" })], {
      ledger: { "MQL:opp-2": reciente },
    });
    expect(otroEvento.out[0].json.omitido).toBe(false);

    const vencido = await runNode([webhook("NQL", { id: "opp-2", email: "a@b.cl" })], {
      ledger: { "NQL:opp-2": { at: new Date(Date.now() - 29 * 86400000).toISOString() } },
    });
    expect(vencido.out[0].json.omitido).toBe(false);
  });

  test("Nuevo → SQL directo: sale el MQL que faltaba y después el SQL, en ítems separados", async () => {
    const { out } = await runNode([
      webhook("MEETING", { id: "opp-salto", email: "lead@clinica.cl", leadgenId: "1058798810462323" }),
    ]);
    expect(out.map((i) => i.json.evento)).toEqual(["MQL", "SQL"]);
    const [mql, sql] = out.map((i) => i.json);
    expect(mql.omitido).toBe(false);
    expect(mql.implicita).toBe(true);
    expect(mql.value).toBe(10);
    expect(mql.event_id).toBe("opp-salto_MQL");
    expect(mql.ledgerKey).toBe("MQL:opp-salto");
    expect(mql.payload.data[0]).toMatchObject({
      event_name: "MQL",
      event_id: "opp-salto_MQL",
      action_source: "system_generated",
      custom_data: { value: 10, lead_stage: "MQL", opportunity_id: "opp-salto" },
    });
    expect(sql.implicita).toBe(false);
    expect(sql.value).toBe(100);
    expect(sql.event_id).toBe("opp-salto_MEETING");
    expect(sql.ledgerKey).toBe("SQL:opp-salto");
    expect(sql.payload.data[0].custom_data.lead_stage).toBe("MEETING");
    // Mismo lead, mismos datos de contacto, y el MQL un segundo antes.
    expect(mql.payload.data[0].user_data).toEqual(sql.payload.data[0].user_data);
    expect(mql.payload.data[0].user_data.lead_id).toBe(1058798810462323);
    expect(mql.payload.data[0].event_time).toBeLessThan(sql.payload.data[0].event_time);
    // «Confirmar y auditar» empareja por índice con el mismo ítem de entrada.
    for (const item of out) expect((item as { pairedItem?: unknown }).pairedItem).toEqual({ item: 0 });
  });

  test("si el MQL ya se mandó (aunque haga más de 28 días), Nuevo → SQL manda solo el SQL", async () => {
    const hace40d = { at: new Date(Date.now() - 40 * 86400000).toISOString(), evento: "MQL" };
    const { out } = await runNode([webhook("MEETING", { id: "opp-2", email: "a@b.cl" })], {
      ledger: { "MQL:opp-2": hace40d },
    });
    expect(out.map((i) => i.json.evento)).toEqual(["SQL"]);
    expect(out[0].json.implicita).toBe(false);
  });

  test("el relleno respeta las mismas puertas: movido por automatización o sin contacto, nada", async () => {
    const api = await runNode([webhook("MEETING", { email: "a@b.cl", source: "API" })]);
    expect(api.out).toHaveLength(1);
    expect(api.out[0].json.omitido).toBe(true);
    expect(api.out[0].json.motivo).toBe("etapa_movida_por_automatizacion");
    const sinContacto = await runNode([webhook("PROPOSAL")]);
    expect(sinContacto.out).toHaveLength(1);
    expect(sinContacto.out[0].json.motivo).toBe("sin_email_ni_telefono_ni_lead_id");
    // MQL y NQL no tienen peldaños anteriores: un solo ítem.
    const mql = await runNode([webhook("MQL", { email: "a@b.cl" })]);
    expect(mql.out.map((i) => i.json.evento)).toEqual(["MQL"]);
    const nql = await runNode([webhook("NQL", { email: "a@b.cl" })]);
    expect(nql.out.map((i) => i.json.evento)).toEqual(["NQL"]);
  });

  test("CUSTOMER → Purchase con el valor del plan, precedido por lo que falte de la escalera", async () => {
    const { out } = await runNode([
      webhook("CUSTOMER", { id: "opp-c", email: "a@b.cl", planClinera: "SUMMIT" }),
    ]);
    expect(out.map((i) => i.json.evento)).toEqual(["MQL", "SQL", "HOT", "Purchase"]);
    expect(out.map((i) => i.json.value)).toEqual([10, 100, 200, 479]);
    expect(out.map((i) => i.json.event_id)).toEqual([
      "opp-c_MQL",
      "opp-c_MEETING",
      "opp-c_PROPOSAL",
      "opp-c_CUSTOMER",
    ]);
    const tiempos = out.map((i) => i.json.payload.data[0].event_time as number);
    expect([...tiempos].sort((a, b) => a - b)).toEqual(tiempos);
    expect(out[3].json.payload.data[0].custom_data.value).toBe(479);

    const conSql = await runNode([webhook("CUSTOMER", { id: "opp-d", email: "a@b.cl" })], {
      ledger: { "MQL:opp-d": { at: "2026-08-01T00:00:00.000Z" }, "SQL:opp-d": { at: "2026-08-02T00:00:00.000Z" } },
    });
    expect(conSql.out.map((i) => i.json.evento)).toEqual(["HOT", "Purchase"]);
    expect(conSql.out[1].json.value).toBe(279);
  });
});
