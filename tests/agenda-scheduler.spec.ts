// ===========================================================================
// Paso 4 de /agenda: reparto de profesional y horarios por zona.
//
// Funciones puras, sin navegador ni red: el fixture es la respuesta REAL de la
// API de disponibilidad del 20-ago-2026 — mismos bloques, mismo reparto y la
// misma asimetría (una profesional tiene un bloque más que la otra, que es lo
// que hacía fallar la primera versión de la regla). Sólo se cambiaron nombres
// e ids por opacos: este repo es público y no necesita los internos de Clinera.
// ===========================================================================
import { test, expect } from "@playwright/test";
import {
  repartirSlots,
  instanteEnChile,
  horaEnZona,
  etiquetaGmt,
  offsetZona,
  TZ_CLINICA,
  diasCandidatosAgenda,
  esBloqueHabil,
  rotuloSlot,
  type DispoSlot,
} from "@/components/ventas/VentasLanding";
import { zonaMostrada } from "@/lib/timezone";
import fixture from "./fixtures-agenda-20ago.json";

const SLOTS = fixture as DispoSlot[];
const nombre = (s?: DispoSlot) => s?.profesional?.name ?? "";

test.describe("reparto de profesional", () => {
  test("ofrece cada hora una sola vez", () => {
    const visibles = repartirSlots(SLOTS);
    const horas = visibles.map((s) => s.horaInicio);
    expect(new Set(horas).size).toBe(horas.length);
    expect(horas).toEqual([...horas].sort());
  });

  test("reparte las horas del día real entre las dos profesionales", () => {
    // El bug original: la API ordena por id de profesional de forma estable y
    // el dedupe se quedaba con el primero, así que la misma persona ganaba 48
    // de cada 50 bloques.
    // Contar sólo bloques libres del día tampoco servía: daba las 10 horas a
    // la que tuviera uno más. Ninguna puede quedarse con más del 70%.
    const asignados = repartirSlots(SLOTS).map(nombre);
    const cuenta = new Map<string, number>();
    for (const n of asignados) cuenta.set(n, (cuenta.get(n) ?? 0) + 1);
    expect(cuenta.size).toBeGreaterThan(1);
    for (const [, c] of cuenta) expect(c).toBeLessThanOrEqual(Math.ceil(asignados.length * 0.7));
  });

  test("reparte parejo cuando los dos tienen la misma disponibilidad", () => {
    const slots: DispoSlot[] = [];
    for (const h of ["10:00", "10:45", "11:30", "12:15", "13:00", "13:45"]) {
      slots.push({ horaInicio: h, profesional: { id: "aaa", name: "Ana" } });
      slots.push({ horaInicio: h, profesional: { id: "bbb", name: "Beto" } });
    }
    const asignados = repartirSlots(slots).map(nombre);
    expect(asignados.filter((n) => n === "Ana").length).toBe(3);
    expect(asignados.filter((n) => n === "Beto").length).toBe(3);
  });

  test("prefiere a quien tiene la agenda más vacía", () => {
    // Ana libre todo el día; Beto solo a las 12:15 porque tiene el resto tomado.
    const slots: DispoSlot[] = [];
    for (const h of ["10:00", "11:00", "12:15", "13:00"]) {
      slots.push({ horaInicio: h, profesional: { id: "aaa", name: "Ana" } });
    }
    slots.push({ horaInicio: "12:15", profesional: { id: "bbb", name: "Beto" } });
    const porHora = new Map(repartirSlots(slots).map((s) => [s.horaInicio, nombre(s)]));
    expect(porHora.get("12:15")).toBe("Ana");
  });

  test("la primera hora del día no va siempre a la misma persona", () => {
    // 30-oct-2026: casi todos eligen la primera hora. Con agendas iguales esa
    // hora iba siempre a quien la API listara primero. La semilla (el correo
    // del lead) reparte esa primera hora entre visitantes.
    const slots: DispoSlot[] = [];
    for (const h of ["10:00", "10:45", "11:30", "12:15"]) {
      slots.push({ horaInicio: h, profesional: { id: "aaa", name: "Ana" } });
      slots.push({ horaInicio: h, profesional: { id: "bbb", name: "Beto" } });
    }
    const primeras = new Map<string, number>();
    for (let k = 0; k < 200; k++) {
      const n = nombre(repartirSlots(slots, `lead${k}@correo.cl`)[0]);
      primeras.set(n, (primeras.get(n) ?? 0) + 1);
    }
    expect(primeras.get("Ana") ?? 0).toBeGreaterThan(70);
    expect(primeras.get("Beto") ?? 0).toBeGreaterThan(70);
    // Mismo visitante, misma asignación (corre dentro de un useMemo).
    expect(repartirSlots(slots, "x@y.cl").map(nombre)).toEqual(repartirSlots(slots, "x@y.cl").map(nombre));
    // Sigue parejo dentro del día.
    const dia = repartirSlots(slots, "x@y.cl").map(nombre);
    expect(dia.filter((n) => n === "Ana").length).toBe(2);
  });

  test("es estable: dos llamadas seguidas dan lo mismo", () => {
    expect(repartirSlots(SLOTS).map(nombre)).toEqual(repartirSlots(SLOTS).map(nombre));
  });

  test("aguanta slots sin profesional y sin hora", () => {
    const slots = [
      { horaInicio: "" } as DispoSlot,
      { horaInicio: "10:00" } as DispoSlot,
      { horaInicio: "10:00", profesional: { id: "aaa", name: "Ana" } } as DispoSlot,
    ];
    const visibles = repartirSlots(slots);
    expect(visibles.map((s) => s.horaInicio)).toEqual(["10:00"]);
  });
});

test.describe("horarios en la zona del visitante", () => {
  // La API manda "10:00" en hora de Chile. Lo que se guarda no cambia nunca;
  // lo único que cambia es lo que el visitante lee.
  test("convierte bien antes del cambio de horario chileno", () => {
    const inst = instanteEnChile("2026-08-20", "10:00");
    expect(inst.toISOString()).toBe("2026-08-20T14:00:00.000Z");
    expect(horaEnZona(inst, TZ_CLINICA)).toBe("10:00");
    expect(horaEnZona(inst, "America/Mexico_City")).toBe("08:00");
    expect(horaEnZona(inst, "America/Bogota")).toBe("09:00");
    expect(horaEnZona(inst, "America/Argentina/Buenos_Aires")).toBe("11:00");
    expect(horaEnZona(inst, "Europe/Madrid")).toBe("16:00");
  });

  test("convierte bien DESPUÉS del cambio (Chile pasa a GMT-3 el 6-sep)", () => {
    // Sin esto, un offset escrito a mano quedaría viejo ese domingo y nadie
    // se enteraría hasta que un lead llegara una hora tarde.
    const inst = instanteEnChile("2026-09-09", "10:00");
    expect(inst.toISOString()).toBe("2026-09-09T13:00:00.000Z");
    expect(horaEnZona(inst, TZ_CLINICA)).toBe("10:00");
    expect(horaEnZona(inst, "America/Mexico_City")).toBe("07:00");
    expect(etiquetaGmt(TZ_CLINICA, inst)).toBe("GMT-3");
  });

  test("el caso real: el bloque de 16:45 que reservó un lead de México", () => {
    const inst = instanteEnChile("2026-08-20", "16:45");
    expect(horaEnZona(inst, "America/Mexico_City")).toBe("14:45");
    expect(etiquetaGmt("America/Mexico_City", inst)).toBe("GMT-6");
  });

  test("no molesta a quien ya está en el mismo huso", () => {
    // Caracas está en GMT-4 igual que Chile en invierno: mostrarle dos horas
    // idénticas sería ruido, así que la doble etiqueta no debe encenderse.
    const inst = instanteEnChile("2026-08-20", "10:00");
    expect(offsetZona("America/Caracas", inst)).toBe(offsetZona(TZ_CLINICA, inst));
    // …pero en septiembre Chile se corre y ahí sí difieren.
    const sept = instanteEnChile("2026-09-09", "10:00");
    expect(offsetZona("America/Caracas", sept)).not.toBe(offsetZona(TZ_CLINICA, sept));
  });

  test("etiqueta husos con media hora", () => {
    const inst = instanteEnChile("2026-08-20", "10:00");
    expect(etiquetaGmt("Asia/Kolkata", inst)).toBe("GMT+5:30");
  });

  test("la IP gana al reloj del sistema (México con laptop en hora Chile)", () => {
    expect(zonaMostrada("America/Mexico_City", "America/Santiago")).toBe("America/Mexico_City");
    expect(zonaMostrada("", "America/Mexico_City")).toBe("America/Mexico_City");
    expect(zonaMostrada("no-es-zona", "America/Bogota")).toBe("America/Bogota");
  });

  test("México ve su hora y Chile debajo — el 14:00 / 17:00 de septiembre", () => {
    // Chile GMT-3 desde el 6-sep; México City GMT-6. 17:00 Chile = 14:00 México.
    const r = rotuloSlot("17:00", "2026-09-09", "America/Mexico_City");
    expect(r.local).toBe("14:00");
    expect(r.chile).toBe("17:00");
    expect(r.otraZona).toBe(true);
  });

  test("en agosto (Chile GMT-4) 10:00 Chile es 08:00 en México", () => {
    const r = rotuloSlot("10:00", "2026-08-20", "America/Mexico_City");
    expect(r.local).toBe("08:00");
    expect(r.chile).toBe("10:00");
  });
});

test.describe("días candidatos y bloques hábiles", () => {
  // Caso real (ago-2026): a las 22:30 en Chile ya es "mañana" local, pero
  // sigue siendo hoy en UTC. La API arma esa grilla desde la hora UTC actual
  // (01:45, 02:45…) y el picker las mostraba como si fueran de Chile.
  test("después de las 20:00 Chile no ofrece el día UTC en curso", () => {
    const dias = diasCandidatosAgenda(new Date("2026-08-26T02:33:00.000Z"));
    expect(dias.map((d) => d.ymd)).not.toContain("2026-08-26");
    expect(dias[0].ymd).toBe("2026-08-27");
  });

  test("de día en Chile arranca en el hábil siguiente, no en hoy", () => {
    const dias = diasCandidatosAgenda(new Date("2026-08-26T14:00:00.000Z"));
    expect(dias.map((d) => d.ymd)).not.toContain("2026-08-26");
    expect(dias[0].ymd).toBe("2026-08-27");
  });

  test("salta el fin de semana", () => {
    const dias = diasCandidatosAgenda(new Date("2026-08-28T14:00:00.000Z"));
    expect(dias[0].ymd).toBe("2026-08-31");
    expect(dias.map((d) => d.ymd)).not.toContain("2026-08-29");
    expect(dias.map((d) => d.ymd)).not.toContain("2026-08-30");
  });

  test("rechaza la madrugada que arma la API de hoy UTC", () => {
    expect(esBloqueHabil("01:45")).toBe(false);
    expect(esBloqueHabil("02:45")).toBe(false);
    expect(esBloqueHabil("07:15")).toBe(false);
    expect(esBloqueHabil("10:00")).toBe(true);
    expect(esBloqueHabil("16:45")).toBe(true);
    expect(esBloqueHabil("19:00")).toBe(false);
    expect(esBloqueHabil("")).toBe(false);
    expect(esBloqueHabil("10:00:00")).toBe(false);
  });
});
