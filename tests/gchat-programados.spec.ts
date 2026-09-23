import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";
import { DateTime } from "luxon";

/**
 * Helpers de los mensajes programados del MCP «Google Chat Ricardo».
 * El archivo es el prefijo de los nodos Code de n8n (DateTime = Luxon global),
 * así que se evalúa hasta el marcador con vm.
 */
const SRC = readFileSync(
  join(process.cwd(), "integrations/n8n/google-chat-programados/helpers.js"),
  "utf8",
);

type Clasificacion = {
  estado: string;
  error?: string;
  proximoIntento?: string;
  enviadoEn?: string;
  mensajeId?: string;
  link?: string;
};

function load() {
  const end = SRC.indexOf("// --- fin helpers ---");
  expect(end).toBeGreaterThan(0);
  const box: Record<string, unknown> = { DateTime, module: { exports: {} } };
  vm.runInNewContext(
    `${SRC.slice(0, end)}\nmodule.exports = { parsearFechaEnvio, clasificarEnvio, nombreDestino, validarMensaje, formatoProgramado, requestIdPara, MAX_REINTENTOS };`,
    box,
  );
  return (box.module as { exports: Record<string, unknown> }).exports as {
    parsearFechaEnvio: (
      v: unknown,
      ahora: DateTime,
    ) => { error?: string; utc?: string; chile?: string; zonaAsumida?: boolean };
    clasificarEnvio: (res: unknown, intentos: number, ahora: DateTime) => Clasificacion;
    nombreDestino: (
      esp: { nombre?: string; tipo?: string },
      miembros: { id: string; nombre?: string }[],
      mapa: Record<string, { nombre?: string; correo?: string }>,
    ) => string;
    validarMensaje: (t: Record<string, unknown>) => { error?: string; espacio?: string };
    formatoProgramado: (r: Record<string, unknown>) => Record<string, unknown>;
    requestIdPara: (tabla: string, id: number) => string;
    MAX_REINTENTOS: number;
  };
}

const AHORA = DateTime.fromISO("2026-09-23T02:00:00Z");

test.describe("programar_mensaje: fecha_hora", () => {
  test("con offset se respeta y se muestra en hora de Chile", () => {
    const { parsearFechaEnvio } = load();
    const f = parsearFechaEnvio("2026-09-23T09:00:00-03:00", AHORA);
    expect(f.error).toBeUndefined();
    expect(f.utc).toBe("2026-09-23T12:00:00.000Z");
    expect(f.chile).toBe("2026-09-23 09:00");
    expect(f.zonaAsumida).toBe(false);
  });

  test("sin zona se interpreta en America/Santiago (horario de verano incluido)", () => {
    const { parsearFechaEnvio } = load();
    const sep = parsearFechaEnvio("2026-09-23T09:00:00", AHORA);
    expect(sep.utc).toBe("2026-09-23T12:00:00.000Z");
    expect(sep.zonaAsumida).toBe(true);
    // Julio: Chile en GMT-4.
    const jul = parsearFechaEnvio("2027-07-01 09:00", AHORA);
    expect(jul.utc).toBe("2027-07-01T13:00:00.000Z");
  });

  test("Z y offsets de otros países", () => {
    const { parsearFechaEnvio } = load();
    expect(parsearFechaEnvio("2026-09-23T12:00:00Z", AHORA).chile).toBe("2026-09-23 09:00");
    expect(parsearFechaEnvio("2026-09-23T07:00:00-05:00", AHORA).chile).toBe("2026-09-23 09:00");
  });

  test("rechaza pasado, ahora mismo, sin hora y basura", () => {
    const { parsearFechaEnvio } = load();
    expect(parsearFechaEnvio("2026-09-22T22:59:00-03:00", AHORA).error).toMatch(/ya pasó/);
    expect(parsearFechaEnvio("2026-09-23T02:00:00Z", AHORA).error).toMatch(/ya pasó/);
    expect(parsearFechaEnvio("2026-09-23", AHORA).error).toMatch(/hora/);
    expect(parsearFechaEnvio("mañana a las 9", AHORA).error).toBeTruthy();
    expect(parsearFechaEnvio("", AHORA).error).toMatch(/Falta/);
  });
});

test.describe("programar_mensaje: validación", () => {
  test("espacio, texto e hilo", () => {
    const { validarMensaje } = load();
    expect(validarMensaje({ espacio: "spaces/AAA", texto: "hola" })).toEqual({ espacio: "spaces/AAA", texto: "hola", hilo: "" });
    expect(validarMensaje({ espacio: "AAA", texto: "hola" }).espacio).toBe("spaces/AAA");
    expect(validarMensaje({ espacio: "", texto: "hola" }).error).toMatch(/espacio/);
    expect(validarMensaje({ espacio: "spaces/AAA", texto: "  " }).error).toMatch(/vacío/);
    expect(validarMensaje({ espacio: "spaces/AAA", texto: "x".repeat(4001) }).error).toMatch(/4.000/);
    expect(validarMensaje({ espacio: "spaces/AAA", texto: "a", hilo: "spaces/BBB/threads/T" }).error).toMatch(/no pertenece/);
  });

  test("nombre legible del destino", () => {
    const { nombreDestino } = load();
    const mapa = {
      "users/1": { nombre: "Ricardo Oyarzún", correo: "ricardo@oacg.cl" },
      "users/2": { nombre: "Rebeca", correo: "rebeca@oacg.cl" },
    };
    expect(nombreDestino({ nombre: "Ventas" }, [], {})).toBe("Ventas");
    expect(nombreDestino({ tipo: "DIRECT_MESSAGE" }, [{ id: "users/1" }, { id: "users/2" }], mapa)).toBe("Rebeca");
    expect(nombreDestino({ tipo: "DIRECT_MESSAGE" }, [{ id: "users/1" }], mapa)).toBe("Ricardo Oyarzún (DM contigo mismo)");
    expect(nombreDestino({ tipo: "DIRECT_MESSAGE" }, [], {})).toBe("DM sin resolver");
  });
});

test.describe("envío: clasificación del resultado", () => {
  test("éxito guarda id, link y hora real", () => {
    const { clasificarEnvio } = load();
    const c = clasificarEnvio({ ok: true, data: { id: "spaces/A/messages/M", link: "https://chat.google.com/dm/A" } }, 1, AHORA);
    expect(c).toEqual({
      estado: "enviado",
      enviadoEn: "2026-09-23T02:00:00.000Z",
      mensajeId: "spaces/A/messages/M",
      link: "https://chat.google.com/dm/A",
      error: "",
    });
  });

  test("429 / 5xx / sin respuesta: 3 reintentos con espera y después error", () => {
    const { clasificarEnvio, MAX_REINTENTOS } = load();
    expect(MAX_REINTENTOS).toBe(3);
    const r429 = { ok: false, error: "Google limitó las llamadas (HTTP 429). Espera un minuto y vuelve a intentar." };
    expect(clasificarEnvio(r429, 1, AHORA)).toMatchObject({ estado: "pendiente", proximoIntento: "2026-09-23T02:01:00.000Z" });
    expect(clasificarEnvio({ ok: false, error: "Google Chat respondió HTTP 503." }, 2, AHORA)).toMatchObject({
      estado: "pendiente",
      proximoIntento: "2026-09-23T02:02:00.000Z",
    });
    expect(clasificarEnvio({ ok: false, error: "No hubo respuesta de Google Chat: ETIMEDOUT" }, 3, AHORA)).toMatchObject({
      estado: "pendiente",
      proximoIntento: "2026-09-23T02:04:00.000Z",
    });
    const ultimo = clasificarEnvio(r429, 4, AHORA);
    expect(ultimo.estado).toBe("error");
    expect(ultimo.error).toMatch(/Falló tras 3 reintentos/);
  });

  test("credencial rota: error sin reintento", () => {
    const { clasificarEnvio } = load();
    for (const error of [
      "Google rechazó la credencial (HTTP 401): revisa…",
      "Google rechazó la credencial (HTTP 403): revisa…",
      "n8n no pudo autenticar con Google: la credencial «Google Chat - Ricardo (OAuth)» no está conectada o venció.",
    ]) {
      const c = clasificarEnvio({ ok: false, error }, 1, AHORA);
      expect(c.estado).toBe("error");
      expect(c.error).toMatch(/no se reintenta/);
      expect(c.proximoIntento).toBeUndefined();
    }
  });

  test("404 y otros definitivos no se reintentan; un nodo caído sí", () => {
    const { clasificarEnvio } = load();
    expect(clasificarEnvio({ ok: false, error: "El espacio spaces/X no existe o Ricardo no es miembro (HTTP 404)." }, 1, AHORA).estado).toBe("error");
    expect(clasificarEnvio({ error: { message: "Workflow did not finish" } }, 1, AHORA).estado).toBe("pendiente");
    expect(clasificarEnvio(null, 1, AHORA).estado).toBe("pendiente");
  });
});

test.describe("formato de salida", () => {
  test("listar_programados muestra hora Chile y solo lo que aplica", () => {
    const { formatoProgramado, requestIdPara } = load();
    const out = formatoProgramado({
      id: 7,
      espacio: "spaces/A",
      nombreEspacio: "Ventas",
      tipoEspacio: "SPACE",
      texto: "hola",
      hilo: null,
      fechaEnvio: "2026-09-23T12:00:00.000Z",
      proximoIntento: "2026-09-23T12:00:00.000Z",
      estado: "pendiente",
      intentos: 0,
      enviadoEn: null,
      error: null,
    });
    expect(out).toEqual({
      id: 7,
      destino: "Ventas",
      espacio: "spaces/A",
      tipoEspacio: "SPACE",
      fecha: "2026-09-23 09:00",
      fechaIso: "2026-09-23T12:00:00.000Z",
      estado: "pendiente",
      texto: "hola",
    });
    expect(requestIdPara("T", 7)).toBe("gchat-prog-T-7");
  });
});
