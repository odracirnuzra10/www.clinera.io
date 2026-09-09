import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import vm from "node:vm";

/**
 * Mapeo corregido de W1. El archivo es jsCode de n8n (return de primer
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
    ) => { skip?: boolean; motivo?: string; event_name?: string; value?: number };
    leadIdEntero: (raw: unknown) => number | null;
    valorPurchase: (plan?: string) => number;
  };
}

test.describe("W1 mapeo corregido", () => {
  test("PQL no contesta → NoContesta 0, nunca MQL", () => {
    const { mapearEtapa } = loadHelpers();
    expect(mapearEtapa("PQL")).toEqual({ event_name: "NoContesta", value: 0 });
    expect(mapearEtapa("PQL", { leadgenId: 999 }).event_name).not.toBe("MQL");
  });

  test("SCREENING sin leadgenId no emite; con leadgenId → MQL 10", () => {
    const { mapearEtapa } = loadHelpers();
    expect(mapearEtapa("SCREENING")).toEqual({
      skip: true,
      motivo: "screening_sin_leadgen",
    });
    expect(mapearEtapa("SCREENING", { leadgenId: 1542457337898951 })).toEqual({
      event_name: "MQL",
      value: 10,
    });
    expect(mapearEtapa("SCREENING", { leadgenId: "no-es-entero" }).skip).toBe(true);
  });

  test("NEW no emite; NQL / SQL / HOT / Purchase siguen", () => {
    const { mapearEtapa, valorPurchase } = loadHelpers();
    expect(mapearEtapa("NEW")).toEqual({ skip: true, motivo: "new_no_emite" });
    expect(mapearEtapa("NQL")).toEqual({ event_name: "NQL", value: 0 });
    expect(mapearEtapa("MEETING")).toEqual({ event_name: "SQL", value: 100 });
    expect(mapearEtapa("PROPOSAL")).toEqual({ event_name: "HOT", value: 300 });
    expect(mapearEtapa("CUSTOMER", { planClinera: "SUMMIT" })).toEqual({
      event_name: "Purchase",
      value: 479,
    });
    expect(valorPurchase("")).toBe(279);
    expect(valorPurchase("ATLAS")).toBe(379);
  });

  test("lead_id es entero positivo, nunca hash", () => {
    const { leadIdEntero } = loadHelpers();
    expect(leadIdEntero(1058798810462323)).toBe(1058798810462323);
    expect(leadIdEntero("12")).toBe(12);
    expect(leadIdEntero("12.5")).toBeNull();
    expect(leadIdEntero("")).toBeNull();
    expect(leadIdEntero("abc")).toBeNull();
  });

  test("AGENTS.md y el README no tienen dos tablas de mapeo distintas", () => {
    expect(AGENTS).toContain("| `PQL` | `NoContesta` | 0 |");
    expect(AGENTS).not.toMatch(/\|\s*`PQL`\s*\|\s*`MQL`\s*\|\s*10\s*\|/);
    expect(AGENTS).not.toMatch(/\|\s*`SCREENING`\s*\|\s*`PQL`\s*\|\s*2\s*\|/);
    expect(README).toContain("| `PQL` | `NoContesta` | 0 |");
    expect(README).not.toMatch(/\|\s*`PQL`\s*\|\s*`MQL`\s*\|\s*10\s*\|/);
    expect(SRC).toContain('event_name: "NoContesta"');
    expect(SRC).toContain("event_id = {opportunityId}_{stage}");
  });
});
