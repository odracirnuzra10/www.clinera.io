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
    `${SRC.slice(start, end)}\nmodule.exports = { mapearEtapa, leadIdEntero, valorPurchase };`,
    box,
  );
  return box.module.exports as {
    mapearEtapa: (
      stage: string,
      opts?: { leadgenId?: unknown; planClinera?: string },
    ) => { skip?: boolean; motivo?: string; event_name?: string; value?: number; etapa?: string };
    leadIdEntero: (raw: unknown) => number | null;
    valorPurchase: (plan?: string) => number;
  };
}

test.describe("W1 embudo canónico (Lead → Customer)", () => {
  test("los cinco estados y ningún otro", () => {
    const { mapearEtapa, valorPurchase } = loadHelpers();
    expect(mapearEtapa("NEW")).toEqual({ event_name: "Lead", value: 1 });
    expect(mapearEtapa("MQL")).toEqual({ event_name: "MQL", value: 10 });
    expect(mapearEtapa("MEETING")).toEqual({ event_name: "SQL", value: 100 });
    expect(mapearEtapa("NQL")).toEqual({ event_name: "NQL", value: 0 });
    expect(mapearEtapa("CUSTOMER", { planClinera: "SUMMIT" })).toEqual({
      event_name: "Purchase",
      value: 479,
    });
    expect(valorPurchase("")).toBe(279);
    expect(valorPurchase("ATLAS")).toBe(379);
    expect(valorPurchase("VORTEX")).toBe(279);
  });

  test("una etapa fuera del mapa no inventa evento", () => {
    const { mapearEtapa } = loadHelpers();
    expect(mapearEtapa("FOO")).toEqual({
      skip: true,
      motivo: "etapa_no_mapeada",
      etapa: "FOO",
    });
    expect(mapearEtapa("SQL").skip).toBe(true);
    expect(mapearEtapa("SQL").motivo).toBe("etapa_no_mapeada");
    expect(mapearEtapa("Nuevo").skip).toBe(true);
    expect(mapearEtapa("").skip).toBe(true);
  });

  test("lead_id es entero positivo, nunca hash", () => {
    const { leadIdEntero } = loadHelpers();
    expect(leadIdEntero(1058798810462323)).toBe(1058798810462323);
    expect(leadIdEntero("12")).toBe(12);
    expect(leadIdEntero("12.5")).toBeNull();
    expect(leadIdEntero("")).toBeNull();
    expect(leadIdEntero("abc")).toBeNull();
  });

  test("el nodo no rellena peldaños anteriores", () => {
    expect(SRC).not.toContain("etapasImplicitas");
    expect(SRC).not.toContain("ESCALERA");
    expect(SRC).toContain("W1 etapa no mapeada");
  });

  test("AGENTS.md y el README comparten la tabla de cinco etapas", () => {
    expect(AGENTS).toContain("| `NEW` | `Lead` | 1 |");
    expect(AGENTS).toContain("| `MQL` | `MQL` | 10 |");
    expect(AGENTS).toContain("| `MEETING` | `SQL` | 100 |");
    expect(AGENTS).toContain("| `NQL` | `NQL` | 0 |");
    expect(README).toContain("| `NEW` | `Lead` | 1 |");
    expect(README).toContain("| `MQL` | `MQL` | 10 |");
    expect(README).toContain("| `NQL` | `NQL` | 0 |");
    expect(SRC).not.toContain('event_name: "Nuevo"');
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
    console,
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
  test("NEW creado por n8n → Lead 1 con payload, omitido=false y ledgerKey", async () => {
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
    expect(j.evento).toBe("Lead");
    expect(j.event_id).toBe("opp-test-1_NEW");
    expect(j.ledgerKey).toBe("Lead:opp-test-1");
    expect(j.leadgen_id).toBe(1058798810462323);
    expect(j.opportunity_id).toBe("opp-test-1");
    const payload = JSON.parse(JSON.stringify(j.payload));
    expect(payload.data).toHaveLength(1);
    const ev = payload.data[0];
    expect(ev.event_name).toBe("Lead");
    expect(ev.event_id).toBe("opp-test-1_NEW");
    expect(ev.action_source).toBe("system_generated");
    expect(ev.user_data.lead_id).toBe(1058798810462323);
    expect(ev.custom_data).toMatchObject({
      currency: "USD",
      value: 1,
      lead_stage: "NEW",
      opportunity_id: "opp-test-1",
      leadgen_id: 1058798810462323,
      lead_event_source: "Twenty CRM",
    });
    expect(staticData.enviados).toBeUndefined();
  });

  test("etapa fuera del mapa se omite; NQL humano sí; API no-NEW se omite", async () => {
    const fuera = await runNode([webhook("FOO", { email: "lead@clinica.cl" })]);
    expect(fuera.out[0].json.omitido).toBe(true);
    expect(fuera.out[0].json.motivo).toBe("etapa_no_mapeada");
    expect(fuera.out[0].json.payload).toBeUndefined();
    expect(fuera.out[0].json.evento).toBeUndefined();

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
      webhook("FOO", { email: "a@b.cl" }),
      webhook("MEETING"),
    ]);
    expect(out.map((i) => i.json.motivo)).toEqual([
      "objeto_no_es_oportunidad",
      "etapa_no_mapeada",
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

  test("MEETING emite solo SQL 100, sin inventar un MQL", async () => {
    const { out } = await runNode([
      webhook("MEETING", {
        id: "opp-salto",
        email: "lead@clinica.cl",
        leadgenId: "1058798810462323",
      }),
    ]);
    expect(out).toHaveLength(1);
    const sql = out[0].json;
    expect(sql.omitido).toBe(false);
    expect(sql.evento).toBe("SQL");
    expect(sql.value).toBe(100);
    expect(sql.event_id).toBe("opp-salto_MEETING");
    expect(sql.ledgerKey).toBe("SQL:opp-salto");
    expect(sql.payload.data[0]).toMatchObject({
      event_name: "SQL",
      event_id: "opp-salto_MEETING",
      action_source: "system_generated",
      custom_data: { value: 100, lead_stage: "MEETING", opportunity_id: "opp-salto" },
    });
    expect(sql.payload.data[0].user_data.lead_id).toBe(1058798810462323);
  });

  test("MQL emite solo MQL 10", async () => {
    const { out } = await runNode([
      webhook("MQL", { id: "opp-mql", email: "a@b.cl", leadgenId: "1058798810462323" }),
    ]);
    expect(out.map((i) => i.json.evento)).toEqual(["MQL"]);
    expect(out[0].json.value).toBe(10);
    expect(out[0].json.event_id).toBe("opp-mql_MQL");
    expect(out[0].json.payload.data[0].user_data.lead_id).toBe(1058798810462323);
  });

  test("CUSTOMER → Purchase con el valor del plan, un solo ítem", async () => {
    const { out } = await runNode([
      webhook("CUSTOMER", { id: "opp-c", email: "a@b.cl", planClinera: "SUMMIT" }),
    ]);
    expect(out.map((i) => i.json.evento)).toEqual(["Purchase"]);
    expect(out[0].json.value).toBe(479);
    expect(out[0].json.event_id).toBe("opp-c_CUSTOMER");
    expect(out[0].json.payload.data[0].custom_data.value).toBe(479);

    const vacio = await runNode([webhook("CUSTOMER", { id: "opp-d", email: "a@b.cl" })]);
    expect(vacio.out.map((i) => i.json.evento)).toEqual(["Purchase"]);
    expect(vacio.out[0].json.value).toBe(279);
  });
});
