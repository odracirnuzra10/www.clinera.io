import { expect, test } from "@playwright/test";
import { proximoDiaHabil } from "../src/lib/dia-habil";

test.describe("proximoDiaHabil", () => {
  const casos: [string, string][] = [
    ["2026-11-04T10:00:00-03:00", "2026-11-05"],
    ["2026-11-06T10:00:00-03:00", "2026-11-09"],
    ["2026-11-07T12:00:00-03:00", "2026-11-09"],
    ["2026-11-08T12:00:00-03:00", "2026-11-09"],
    ["2026-11-05T22:30:00-03:00", "2026-11-09"],
    ["2026-07-10T12:00:00-04:00", "2026-07-13"],
  ];
  for (const [now, esperado] of casos) {
    test(`${now} → ${esperado}`, () => {
      expect(proximoDiaHabil(new Date(now))).toBe(esperado);
    });
  }
});
