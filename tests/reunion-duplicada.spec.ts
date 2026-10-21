import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Aviso de reunión duplicada (Ricardo, 21-oct-2026). Corre el jsCode REAL del nodo de n8n
// con stubs de `$` y del static data: lo que se prueba es lo que se aplica.
const codigo = readFileSync(join(process.cwd(), "integrations/n8n/aviso-reunion-duplicada.js"), "utf8");

type Reserva = Record<string, unknown>;

function correr(reserva: Reserva, staticData: Record<string, unknown>) {
  const fn = new Function("$", "$getWorkflowStaticData", "console", codigo);
  const $ = () => ({ first: () => ({ json: reserva }) });
  return fn($, () => staticData, { log: () => {} }) as { json: { textoChat: string; duplicadas: number } }[];
}

const manana = (hora: string) => `${new Date(Date.now() + 86400000).toISOString().slice(0, 10)}T${hora}:00-03:00`;
const base = (over: Reserva = {}): Reserva => ({
  ok: true,
  esPrueba: false,
  origenCita: "web",
  responsable: "Nohely Sánchez",
  startISO: manana("15:15"),
  fraseHora: "mañana, 15:15 hora Chile",
  cliente: { nombre: "Kerly Trujillo", email: "evolumed.pe@gmail.com", telefono: "51967770671" },
  ...over,
});

test.describe("aviso de reunión duplicada", () => {
  test("la primera reserva y su eco no avisan", () => {
    const sd: Record<string, unknown> = {};
    expect(correr(base(), sd)).toEqual([]);
    expect(correr(base(), sd)).toEqual([]); // el webhook llega dos veces por reserva
  });

  test("dos reuniones futuras del mismo correo avisan con las dos", () => {
    const sd: Record<string, unknown> = {};
    correr(base(), sd);
    const r = correr(
      base({ origenCita: "agente-ia", responsable: "Rebeca", startISO: manana("13:00"), fraseHora: "mañana, 13:00 hora Chile" }),
      sd,
    );
    expect(r).toHaveLength(1);
    const t = r[0].json.textoChat;
    expect(t).toContain("Reunión duplicada — Kerly Trujillo");
    expect(t).toContain("Nueva:* mañana, 13:00 hora Chile · con Rebeca · agente IA (WhatsApp)");
    expect(t).toContain("Ya tenía:* mañana, 15:15 hora Chile · con Nohely Sánchez · web");
    expect(t).toContain("reagenda");
  });

  test("se reconoce al mismo contacto por teléfono o por nombre completo aunque cambie el correo", () => {
    const sd: Record<string, unknown> = {};
    correr(base(), sd);
    const porTel = correr(base({ responsable: "Rebeca", startISO: manana("10:00"), cliente: { nombre: "K", email: "otro@x.com", telefono: "+51 967 770 671" } }), sd);
    expect(porTel).toHaveLength(1);
    const sd2: Record<string, unknown> = {};
    correr(base(), sd2);
    const porNombre = correr(base({ responsable: "Rebeca", startISO: manana("10:00"), cliente: { nombre: "kerly  TRUJILLO", email: "otro@x.com", telefono: "" } }), sd2);
    expect(porNombre).toHaveLength(1);
  });

  test("contactos distintos, pruebas internas y reuniones ya pasadas no avisan", () => {
    const sd: Record<string, unknown> = {};
    correr(base(), sd);
    expect(correr(base({ responsable: "Rebeca", startISO: manana("10:00"), cliente: { nombre: "Ana Pérez", email: "ana@x.com", telefono: "56911111111" } }), sd)).toEqual([]);
    // pruebas internas: ni se anotan ni avisan
    const interna = { nombre: "Ricardo Oyarzun", email: "ricardo@oacg.cl", telefono: "56965031299" };
    expect(correr(base({ cliente: interna }), sd)).toEqual([]);
    expect(correr(base({ responsable: "Rebeca", startISO: manana("12:00"), cliente: interna }), sd)).toEqual([]);
    expect(correr(base({ esPrueba: true, responsable: "Rebeca", startISO: manana("11:00") }), sd)).toEqual([]);
    // una reunión de hace 3 días no choca con la de mañana
    const pasada: Record<string, unknown> = {};
    correr(base({ startISO: new Date(Date.now() - 3 * 86400000).toISOString() }), pasada);
    expect(correr(base({ responsable: "Rebeca" }), pasada)).toEqual([]);
  });

  test("el ledger se reasigna entero y se poda", () => {
    const sd: Record<string, unknown> = {};
    correr(base(), sd);
    expect(Object.keys(sd.reunionesRecientes as object)).toHaveLength(1);
    const viejo = (sd.reunionesRecientes as Record<string, { startMs: number }>);
    for (const k of Object.keys(viejo)) viejo[k].startMs = Date.now() - 5 * 86400000;
    correr(base({ cliente: { nombre: "Luis Soto", email: "luis@x.com", telefono: "" }, responsable: "Rebeca", startISO: manana("09:00") }), sd);
    expect(Object.keys(sd.reunionesRecientes as object)).toHaveLength(1); // el viejo se podó
  });
});
