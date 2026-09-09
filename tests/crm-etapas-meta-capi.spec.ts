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
    ) => { skip?: boolean; motivo?: string; event_name?: string; value?: number };
    leadIdEntero: (raw: unknown) => number | null;
    valorPurchase: (plan?: string) => number;
  };
}

test.describe("W1 embudo canónico (Nuevo → Customer)", () => {
  test("los estados canónicos y ningún otro", () => {
    const { mapearEtapa, valorPurchase } = loadHelpers();
    expect(mapearEtapa("NEW")).toEqual({ event_name: "Nuevo", value: 0 });
    expect(mapearEtapa("Nuevo")).toEqual({ event_name: "Nuevo", value: 0 });
    expect(mapearEtapa("PQL")).toEqual({ event_name: "PQL", value: 1 });
    expect(mapearEtapa("MQL")).toEqual({ event_name: "MQL", value: 5 });
    expect(mapearEtapa("MEETING")).toEqual({ event_name: "SQL", value: 10 });
    expect(mapearEtapa("SQL")).toEqual({ event_name: "SQL", value: 10 });
    expect(mapearEtapa("PROPOSAL")).toEqual({ event_name: "HOT", value: 100 });
    expect(mapearEtapa("HOT")).toEqual({ event_name: "HOT", value: 100 });
    expect(mapearEtapa("NQL")).toEqual({ event_name: "NQL", value: 0 });
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

  test("AGENTS.md y el README no tienen dos tablas de mapeo distintas", () => {
    expect(AGENTS).toContain("| `NEW` | `Nuevo` | 0 |");
    expect(AGENTS).toContain("| `PQL` | `PQL` | 1 |");
    expect(AGENTS).toContain("| `MQL` | `MQL` | 5 |");
    expect(AGENTS).toContain("| `MEETING` | `SQL` | 10 |");
    expect(AGENTS).toContain("| `PROPOSAL` | `HOT` | 100 |");
    expect(AGENTS).toContain("| `NQL` | `NQL` | 0 |");
    expect(README).toContain("| `NEW` | `Nuevo` | 0 |");
    expect(README).toContain("| `PQL` | `PQL` | 1 |");
    expect(README).toContain("| `NQL` | `NQL` | 0 |");
    expect(AGENTS).not.toMatch(/\|\s*`SCREENING`\s*\|\s*`MQL`\s*\|/);
    expect(AGENTS).not.toMatch(/\|\s*`PQL`\s*\|\s*`NoContesta`\s*\|/);
    expect(README).not.toMatch(/\|\s*`PQL`\s*\|\s*`NoContesta`\s*\|/);
    expect(SRC).not.toContain('event_name: "NoContesta"');
    expect(SRC).toMatch(/event_id\s+= \{opportunityId\}_\{stage\}/);
    expect(SRC).toContain('recordId + "_" + String(etapa)');
  });
});
