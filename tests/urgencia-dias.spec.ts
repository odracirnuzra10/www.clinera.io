import { expect, test } from "@playwright/test";
import { textoUrgencia } from "@/lib/urgencia-dias";

test.describe("banner de urgencia en hora de Chile", () => {
  test("5 de noviembre nombra hoy y mañana del mismo mes", () => {
    expect(textoUrgencia(new Date("2026-11-05T10:00:00-03:00"))).toBe("Solo por hoy 05 y mañana 06 de noviembre");
    expect(textoUrgencia(new Date("2026-11-05T23:30:00-03:00"))).toBe("Solo por hoy 05 y mañana 06 de noviembre");
  });

  test("el 30 de noviembre cruza a diciembre", () => {
    expect(textoUrgencia(new Date("2026-11-30T12:00:00-03:00"))).toBe(
      "Solo por hoy 30 de noviembre y mañana 01 de diciembre",
    );
  });

  test("el 31 de diciembre cruza a enero", () => {
    expect(textoUrgencia(new Date("2026-12-31T12:00:00-03:00"))).toBe(
      "Solo por hoy 31 de diciembre y mañana 01 de enero",
    );
  });

  test("de madrugada UTC sigue siendo el día anterior en Chile (invierno, GMT−4)", () => {
    expect(textoUrgencia(new Date("2026-07-10T03:30:00Z"))).toBe("Solo por hoy 09 y mañana 10 de julio");
  });
});
