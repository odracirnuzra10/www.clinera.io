#!/usr/bin/env python3
"""Mensajes programados para el conector MCP «Google Chat Ricardo» (n8n).

La API de Google Chat no programa envíos. Este script arma, en n8n vivo:

  · Data Table `gchat_mensajes_programados` (la cola persistente; la crea si
    no existe).
  · Tres tools nuevas en el MCP server `MCP · Google Chat`
    (xDXIu0jNUdcYAf2U): programar_mensaje, listar_programados y
    cancelar_programado, cada una como sub-workflow.
  · `MCP · Google Chat · enviar_programado (interno)`: toma UNA fila, la
    reclama (pendiente → enviando, compare-and-set en la tabla), la envía
    llamando al mismo sub-workflow de enviar_mensaje y guarda el resultado.
  · `MCP · Google Chat · Envío de programados (cron)`: cada minuto busca las
    filas pendientes vencidas y llama al interno por cada una.
  · En enviar_mensaje (9Fdns86ZWNK5dX0x) agrega el input opcional
    `request_id`: si viene, va como `requestId` a Google y un reenvío con el
    mismo id devuelve el mensaje ya creado en vez de duplicarlo. La tool MCP
    no lo pasa, así que enviar_mensaje se comporta igual que antes.

Idempotente: busca los workflows por nombre y los reescribe.

  python3 aplicar_programados.py              # simulacro: muestra qué haría
  python3 aplicar_programados.py --aplicar    # escribe en n8n
  python3 aplicar_programados.py --prueba-crear   # MCP temporal con bearer propio
  python3 aplicar_programados.py --prueba-borrar  # lo elimina

Requiere N8N_URL y N8N_API_KEY.
"""
from __future__ import annotations

import json
import os
import secrets
import sys
import urllib.error
import urllib.parse
import urllib.request
import uuid
from pathlib import Path

AQUI = Path(__file__).resolve().parent
HELPERS = (AQUI / "helpers.js").read_text()

BASE = os.environ.get("N8N_URL", "").rstrip("/")
if BASE and not BASE.endswith("/api/v1"):
    BASE = BASE + "/api/v1"
KEY = os.environ.get("N8N_API_KEY", "").strip()

MCP_SERVER = "xDXIu0jNUdcYAf2U"
ENVIAR = "9Fdns86ZWNK5dX0x"
RESOLVER = "86N21fqQNIhzMfnj"
CRED_GOOGLE = {"googleOAuth2Api": {"id": "L7tpOcuXqVBa2QFj", "name": "Google Chat - Ricardo (OAuth)"}}
TABLA_NOMBRE = "gchat_mensajes_programados"
TABLA_COLUMNAS = [
    ("espacio", "string"),
    ("nombreEspacio", "string"),
    ("tipoEspacio", "string"),
    ("texto", "string"),
    ("hilo", "string"),
    ("fechaEnvio", "date"),
    ("proximoIntento", "date"),
    ("estado", "string"),
    ("intentos", "number"),
    ("enviadoEn", "date"),
    ("mensajeId", "string"),
    ("link", "string"),
    ("error", "string"),
    ("canceladoEn", "date"),
]
SETTINGS = {"executionOrder": "v1", "timezone": "America/Santiago", "saveManualExecutions": True}

N_PROGRAMAR = "MCP · Google Chat · programar_mensaje"
N_LISTAR = "MCP · Google Chat · listar_programados"
N_CANCELAR = "MCP · Google Chat · cancelar_programado"
N_INTERNO = "MCP · Google Chat · enviar_programado (interno)"
N_CRON = "MCP · Google Chat · Envío de programados (cron)"
N_PRUEBA = "TMP · prueba MCP Google Chat programados"
CRED_PRUEBA = "TMP · prueba MCP programados · Bearer"

URL_VIEJA = (
    "const url = 'https://chat.googleapis.com/v1/' + espacio + '/messages' + "
    "(hilo ? '?messageReplyOption=REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD' : '');"
)
URL_NUEVA = (
    "const requestId = String(t.request_id || '').trim();\n"
    "const qs = [];\n"
    "if (hilo) qs.push('messageReplyOption=REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD');\n"
    "if (requestId) qs.push('requestId=' + encodeURIComponent(requestId));\n"
    "const url = 'https://chat.googleapis.com/v1/' + espacio + '/messages' + (qs.length ? '?' + qs.join('&') : '');"
)


def api(method: str, path: str, body: dict | None = None) -> dict | list:
    req = urllib.request.Request(
        BASE + path,
        data=None if body is None else json.dumps(body).encode(),
        method=method,
        headers={"X-N8N-API-KEY": KEY, "Content-Type": "application/json", "Accept": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            raw = resp.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        detalle = e.read().decode("utf-8", "replace")[:1500]
        raise SystemExit(f"{method} {path} → {e.code}: {detalle}") from e


# ---------- piezas de nodos ----------

def _id() -> str:
    return str(uuid.uuid4())


def code(name: str, body: str, pos: list[int], consts: str = "") -> dict:
    return {
        "parameters": {"jsCode": HELPERS + "\n" + consts + body.strip() + "\n"},
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": pos,
        "id": _id(),
        "name": name,
    }


def trigger(inputs: list[tuple[str, str]], pos: list[int] | None = None) -> dict:
    return {
        "parameters": {
            "inputSource": "workflowInputs",
            "workflowInputs": {"values": [{"name": n, "type": t} for n, t in inputs]},
        },
        "type": "n8n-nodes-base.executeWorkflowTrigger",
        "typeVersion": 1.1,
        "position": pos or [0, 0],
        "id": _id(),
        "name": "Trigger",
    }


def iff(name: str, expr: str, pos: list[int]) -> dict:
    return {
        "parameters": {
            "conditions": {
                "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "loose", "version": 2},
                "conditions": [
                    {
                        "id": _id(),
                        "leftValue": "={{ " + expr + " }}",
                        "rightValue": "",
                        "operator": {"type": "boolean", "operation": "true", "singleValue": True},
                    }
                ],
                "combinator": "and",
            },
            "options": {},
        },
        "type": "n8n-nodes-base.if",
        "typeVersion": 2.2,
        "position": pos,
        "id": _id(),
        "name": name,
    }


def http_get(name: str, url: str, pos: list[int], query: dict | None = None) -> dict:
    p: dict = {
        "method": "GET",
        "url": url,
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "googleOAuth2Api",
        "options": {"response": {"response": {"fullResponse": True, "neverError": True}}},
    }
    if query:
        p["sendQuery"] = True
        p["queryParameters"] = {"parameters": [{"name": k, "value": v} for k, v in query.items()]}
    return {
        "parameters": p,
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": pos,
        "id": _id(),
        "name": name,
        "credentials": CRED_GOOGLE,
    }


def call_wf(name: str, wid: str, inputs: dict[str, tuple[str, str]], pos: list[int], mode: str = "once") -> dict:
    return {
        "parameters": {
            "workflowId": {"__rl": True, "value": wid, "mode": "id"},
            "workflowInputs": {
                "mappingMode": "defineBelow",
                "value": {k: v for k, (v, _t) in inputs.items()},
                "matchingColumns": [],
                "schema": [
                    {
                        "id": k,
                        "displayName": k,
                        "required": False,
                        "defaultMatch": False,
                        "display": True,
                        "canBeUsedToMatch": True,
                        "type": t,
                        "removed": False,
                    }
                    for k, (_v, t) in inputs.items()
                ],
                "attemptToConvertTypes": False,
                "convertFieldsToString": False,
            },
            "mode": mode,
            "options": {"waitForSubWorkflow": True},
        },
        "type": "n8n-nodes-base.executeWorkflow",
        "typeVersion": 1.2,
        "position": pos,
        "id": _id(),
        "name": name,
    }


def tabla(name: str, tabla_id: str, operation: str, pos: list[int], **kw) -> dict:
    p: dict = {
        "resource": "row",
        "operation": operation,
        "dataTableId": {"__rl": True, "mode": "id", "value": tabla_id},
    }
    if "filtros" in kw:
        p["matchType"] = "allConditions"
        p["filters"] = {
            "conditions": [{"keyName": k, "condition": c, "keyValue": v} for k, c, v in kw["filtros"]]
        }
    if "columnas" in kw:
        valores = kw["columnas"]
        if valores is None:
            p["columns"] = {
                "mappingMode": "autoMapInputData",
                "value": {},
                "matchingColumns": [],
                "schema": [],
                "attemptToConvertTypes": False,
                "convertFieldsToString": False,
            }
        else:
            tipos = dict(TABLA_COLUMNAS)
            p["columns"] = {
                "mappingMode": "defineBelow",
                "value": valores,
                "matchingColumns": [],
                "schema": [
                    {
                        "id": c,
                        "displayName": c,
                        "required": False,
                        "defaultMatch": False,
                        "display": True,
                        "type": tipos[c] if tipos[c] != "date" else "dateTime",
                        "readOnly": False,
                        "removed": c not in valores,
                    }
                    for c, _ in TABLA_COLUMNAS
                ],
                "attemptToConvertTypes": False,
                "convertFieldsToString": False,
            }
    if operation in ("update", "insert"):
        p["options"] = {}
    if operation == "get":
        p["returnAll"] = False
        p["limit"] = kw.get("limit", 50)
        if kw.get("orden"):
            col, direc = kw["orden"]
            p["orderBy"] = True
            p["orderByColumn"] = col
            p["orderByDirection"] = direc
    n = {
        "parameters": p,
        "type": "n8n-nodes-base.dataTable",
        "typeVersion": 1.1,
        "position": pos,
        "id": _id(),
        "name": name,
    }
    if kw.get("siempre"):
        n["alwaysOutputData"] = True
    if kw.get("una_vez"):
        n["executeOnce"] = True
    return n


def reintento_429(pos_x: int) -> list[dict]:
    """El mismo bucle «¿Reintentar por 429?» → «Esperar 3 s» → Preparar de las otras tools."""
    return [
        iff("¿Reintentar por 429?", "$json.ok === false && String($json.error || '').indexOf('429') >= 0 && $runIndex < 1", [pos_x, 0]),
        {
            "parameters": {"amount": 3, "unit": "seconds"},
            "type": "n8n-nodes-base.wait",
            "typeVersion": 1.1,
            "position": [pos_x + 220, -160],
            "id": _id(),
            "name": "Esperar 3 s",
            "webhookId": _id(),
        },
        code("Respuesta", "return [{ json: $input.first().json }];", [pos_x + 220, 60]),
    ]


def conn(*pares) -> dict:
    """pares: (origen, [destinos salida 0], [destinos salida 1]...)"""
    out: dict = {}
    for origen, *salidas in pares:
        out[origen] = {"main": [[{"node": d, "type": "main", "index": 0} for d in s] for s in salidas]}
    return out


# ---------- workflows ----------

def wf_programar(tabla_id: str) -> dict:
    nodes = [
        trigger([("espacio", "string"), ("texto", "string"), ("fecha_hora", "string"), ("hilo", "string")], [-1560, 0]),
        code("Preparar", """
const t = $('Trigger').first().json;
const m = validarMensaje(t);
if (m.error) return [{ json: { error: m.error } }];
const f = parsearFechaEnvio(t.fecha_hora, DateTime.utc());
if (f.error) return [{ json: { error: f.error } }];
return [{ json: Object.assign({}, m, { fecha: f }) }];
""", [-1340, 0]),
        iff("¿Entrada válida?", "!$json.error", [-1120, 0]),
        http_get("GET espacio", "=https://chat.googleapis.com/v1/{{ $json.espacio }}", [-900, -120]),
        code("Revisar espacio", """
const r = $input.first().json;
const p = $('Preparar').first().json;
const st = statusDe(r);
if (esError(st)) return [{ json: { error: mensajeError(st, r, 'El espacio ' + p.espacio) } }];
const b = r.body || {};
return [{ json: { nombre: b.displayName || '', tipo: b.spaceType || '' } }];
""", [-680, -120]),
        iff("¿Sin nombre?", "!$json.error && !$json.nombre", [-460, -120]),
        http_get("GET miembros", "=https://chat.googleapis.com/v1/{{ $('Preparar').first().json.espacio }}/members", [-240, -260], {"pageSize": "100"}),
        code("Ids a resolver", """
const r = $input.first().json;
const miembros = [];
if (!esError(statusDe(r))) {
  for (const m of ((r.body && r.body.memberships) || [])) {
    const u = m.member || {};
    if (u.type && u.type !== 'HUMAN') continue;
    if (u.name) miembros.push({ id: u.name, nombre: u.displayName || '' });
  }
}
return [{ json: { miembros, ids: miembros.map(m => m.id) } }];
""", [-20, -260]),
        call_wf("Resolver usuarios", RESOLVER, {"ids": ("={{ $json.ids }}", "array")}, [200, -260]),
        code("Armar fila", """
const p = $('Preparar').first().json;
const esp = $('Revisar espacio').first().json;
if (esp.error) return [{ json: { error: esp.error } }];
let miembros = [];
let mapa = {};
try { miembros = $('Ids a resolver').first().json.miembros || []; } catch (e) { miembros = []; }
try { mapa = $('Resolver usuarios').first().json.mapa || {}; } catch (e) { mapa = {}; }
return [{ json: {
  espacio: p.espacio,
  nombreEspacio: nombreDestino(esp, miembros, mapa),
  tipoEspacio: esp.tipo,
  texto: p.texto,
  hilo: p.hilo,
  fechaEnvio: p.fecha.utc,
  proximoIntento: p.fecha.utc,
  estado: 'pendiente',
  intentos: 0,
} }];
""", [420, -120]),
        iff("¿Fila lista?", "!$json.error", [640, -120]),
        tabla("Guardar", tabla_id, "insert", [860, -200], columnas=None),
        code("Final", """
const p = $('Preparar').first().json;
if (p.error) return falla(p.error);
let fila = null;
try { fila = $('Armar fila').first().json; } catch (e) { fila = null; }
if (!fila) {
  let esp = null;
  try { esp = $('Revisar espacio').first().json; } catch (e) { esp = null; }
  return falla((esp && esp.error) || 'No se llegó a revisar el espacio.');
}
if (fila.error) return falla(fila.error);
let g = null;
try { g = $('Guardar').first().json; } catch (e) { g = null; }
if (!g || g.id === undefined || g.id === null) return falla('No se pudo guardar el mensaje programado en la tabla de n8n.');
const data = {
  id: g.id,
  estado: 'pendiente',
  destino: fila.nombreEspacio,
  espacio: fila.espacio,
  tipoEspacio: fila.tipoEspacio,
  fecha: p.fecha.chile,
  fechaTexto: p.fecha.chileLarga,
  fechaIso: p.fecha.utc,
  texto: fila.texto,
};
if (fila.hilo) data.hilo = fila.hilo;
if (p.fecha.zonaAsumida) data.aviso = 'La fecha no traía zona horaria: se interpretó en hora de Chile.';
return exito(data);
""", [1080, 0]),
        *reintento_429(1300),
    ]
    connections = conn(
        ("Trigger", ["Preparar"]),
        ("Preparar", ["¿Entrada válida?"]),
        ("¿Entrada válida?", ["GET espacio"], ["Final"]),
        ("GET espacio", ["Revisar espacio"]),
        ("Revisar espacio", ["¿Sin nombre?"]),
        ("¿Sin nombre?", ["GET miembros"], ["Armar fila"]),
        ("GET miembros", ["Ids a resolver"]),
        ("Ids a resolver", ["Resolver usuarios"]),
        ("Resolver usuarios", ["Armar fila"]),
        ("Armar fila", ["¿Fila lista?"]),
        ("¿Fila lista?", ["Guardar"], ["Final"]),
        ("Guardar", ["Final"]),
        ("Final", ["¿Reintentar por 429?"]),
        ("¿Reintentar por 429?", ["Esperar 3 s"], ["Respuesta"]),
        ("Esperar 3 s", ["Preparar"]),
    )
    return {"name": N_PROGRAMAR, "nodes": nodes, "connections": connections, "settings": SETTINGS}


def wf_listar(tabla_id: str) -> dict:
    nodes = [
        trigger([("estado", "string"), ("limite", "number")], [-660, 0]),
        code("Preparar", """
const t = $('Trigger').first().json;
let estado = String(t.estado || '').trim().toLowerCase();
if (!estado) estado = 'pendiente';
const todos = ['todos', 'todas', 'all', '*'].indexOf(estado) >= 0;
if (!todos && ESTADOS.indexOf(estado) < 0) {
  return [{ json: { error: 'Estado desconocido «' + t.estado + '». Usa pendiente, enviando, enviado, error, cancelado o todos.' } }];
}
let limite = Math.floor(Number(t.limite));
if (!Number.isFinite(limite) || limite <= 0) limite = 50;
limite = Math.min(limite, 200);
const recientesPrimero = todos || ['enviado', 'error', 'cancelado'].indexOf(estado) >= 0;
return [{ json: { estado: todos ? 'todos' : estado, todos, limite, orden: recientesPrimero ? 'DESC' : 'ASC' } }];
""", [-440, 0]),
        iff("¿Entrada válida?", "!$json.error", [-220, 0]),
        tabla(
            "Buscar", tabla_id, "get", [0, -120],
            filtros=[("estado", "={{ $json.todos ? 'neq' : 'eq' }}", "={{ $json.todos ? '__todos__' : $json.estado }}")],
            limit="={{ $json.limite }}",
            orden=("fechaEnvio", "={{ $json.orden }}"),
            siempre=True,
        ),
        code("Final", """
const p = $('Preparar').first().json;
if (p.error) return falla(p.error);
let filas = [];
try { filas = $('Buscar').all().map(i => i.json).filter(r => r && r.id !== undefined && r.id !== null); } catch (e) { filas = []; }
const programados = filas.map(formatoProgramado);
return exito({ estado: p.estado, total: programados.length, programados, zonaHoraria: 'Fechas en hora de Chile (America/Santiago).' });
""", [220, 0]),
    ]
    connections = conn(
        ("Trigger", ["Preparar"]),
        ("Preparar", ["¿Entrada válida?"]),
        ("¿Entrada válida?", ["Buscar"], ["Final"]),
        ("Buscar", ["Final"]),
    )
    return {"name": N_LISTAR, "nodes": nodes, "connections": connections, "settings": SETTINGS}


def wf_cancelar(tabla_id: str) -> dict:
    nodes = [
        trigger([("id", "number")], [-660, 0]),
        code("Preparar", """
const t = $('Trigger').first().json;
const bruto = t.id === undefined || t.id === null ? '' : String(t.id).trim();
const id = Number(bruto);
if (!bruto || !Number.isInteger(id) || id <= 0) {
  return [{ json: { error: 'Falta el id del mensaje programado (número entero; sale de programar_mensaje o listar_programados).' } }];
}
return [{ json: { id, estado: 'cancelado', canceladoEn: DateTime.utc().toISO() } }];
""", [-440, 0]),
        iff("¿Entrada válida?", "!$json.error", [-220, 0]),
        tabla(
            "Cancelar", tabla_id, "update", [0, -120],
            filtros=[("id", "eq", "={{ $json.id }}"), ("estado", "eq", "pendiente")],
            columnas=None,
            siempre=True,
        ),
        iff("¿Cancelado?", "$json.id !== undefined && $json.id !== null", [220, -120]),
        tabla(
            "Buscar fila", tabla_id, "get", [440, -40],
            filtros=[("id", "eq", "={{ $('Preparar').first().json.id }}")],
            limit=1,
            siempre=True,
        ),
        code("Final", """
const p = $('Preparar').first().json;
if (p.error) return falla(p.error);
let c = null;
try { c = $('Cancelar').first().json; } catch (e) { c = null; }
if (c && c.id !== undefined && c.id !== null) return exito(Object.assign({ cancelado: true }, formatoProgramado(c)));
let f = null;
try { f = $('Buscar fila').first().json; } catch (e) { f = null; }
if (!f || f.id === undefined || f.id === null) return falla('No existe un mensaje programado con id ' + p.id + '.');
const motivo = {
  enviando: 'se está enviando en este momento',
  enviado: 'ya se envió (' + fechaCL(f.enviadoEn) + ')',
  cancelado: 'ya estaba cancelado',
  error: 'quedó en error y no se va a enviar',
}[f.estado] || ('está en estado ' + f.estado);
return falla('No se canceló el mensaje ' + p.id + ': ' + motivo + '.');
""", [660, 0]),
    ]
    connections = conn(
        ("Trigger", ["Preparar"]),
        ("Preparar", ["¿Entrada válida?"]),
        ("¿Entrada válida?", ["Cancelar"], ["Final"]),
        ("Cancelar", ["¿Cancelado?"]),
        ("¿Cancelado?", ["Final"], ["Buscar fila"]),
        ("Buscar fila", ["Final"]),
    )
    return {"name": N_CANCELAR, "nodes": nodes, "connections": connections, "settings": SETTINGS}


def wf_interno(tabla_id: str) -> dict:
    consts = f"const TABLA_ID = '{tabla_id}';\n"
    enviar = call_wf(
        "Enviar (enviar_mensaje)",
        ENVIAR,
        {
            "espacio": ("={{ $json.espacio }}", "string"),
            "texto": ("={{ $json.texto }}", "string"),
            "hilo": ("={{ $json.hilo || '' }}", "string"),
            "request_id": ("={{ 'gchat-prog-" + tabla_id + "-' + $json.id }}", "string"),
        },
        [440, -120],
    )
    enviar["onError"] = "continueRegularOutput"
    enviar["alwaysOutputData"] = True
    nodes = [
        trigger([("id", "number"), ("intentos", "number")], [-440, 0]),
        code("Preparar reclamo", """
const t = $('Trigger').first().json;
return [{ json: { id: Number(t.id), estado: 'enviando', intentos: (Number(t.intentos) || 0) + 1 } }];
""", [-220, 0], consts),
        tabla(
            "Reclamar", tabla_id, "update", [0, 0],
            filtros=[("id", "eq", "={{ $json.id }}"), ("estado", "eq", "pendiente")],
            columnas=None,
            siempre=True,
        ),
        iff("¿Reclamado?", "$json.id !== undefined && $json.id !== null && $json.estado === 'enviando'", [220, 0]),
        enviar,
        code("Clasificar resultado", """
const fila = $('Reclamar').first().json;
let res = null;
try { res = $input.first().json; } catch (e) { res = null; }
const c = clasificarEnvio(res, Number(fila.intentos) || 1, DateTime.utc());
return [{ json: Object.assign({ id: fila.id }, c) }];
""", [660, -120], consts),
        tabla(
            "Guardar resultado", tabla_id, "update", [880, -120],
            filtros=[("id", "eq", "={{ $json.id }}")],
            columnas=None,
            siempre=True,
        ),
        code("Final", """
const t = $('Trigger').first().json;
let fila = null;
try { fila = $('Reclamar').first().json; } catch (e) { fila = null; }
if (!fila || fila.id === undefined || fila.id === null) {
  return [{ json: { id: Number(t.id), omitido: true, motivo: 'Ya no estaba pendiente (otro proceso lo tomó o lo cancelaron).' } }];
}
let c = null;
try { c = $('Clasificar resultado').first().json; } catch (e) { c = null; }
return [{ json: Object.assign({ id: fila.id, intento: fila.intentos }, c || {}) }];
""", [1100, 0], consts),
    ]
    connections = conn(
        ("Trigger", ["Preparar reclamo"]),
        ("Preparar reclamo", ["Reclamar"]),
        ("Reclamar", ["¿Reclamado?"]),
        ("¿Reclamado?", ["Enviar (enviar_mensaje)"], ["Final"]),
        ("Enviar (enviar_mensaje)", ["Clasificar resultado"]),
        ("Clasificar resultado", ["Guardar resultado"]),
        ("Guardar resultado", ["Final"]),
    )
    return {"name": N_INTERNO, "nodes": nodes, "connections": connections, "settings": SETTINGS}


def wf_cron(tabla_id: str, interno_id: str) -> dict:
    procesar = call_wf(
        "Enviar cada uno",
        interno_id,
        {"id": ("={{ $json.id }}", "number"), "intentos": ("={{ $json.intentos || 0 }}", "number")},
        [660, 0],
        mode="each",
    )
    procesar["onError"] = "continueRegularOutput"
    nodes = [
        {
            "parameters": {"rule": {"interval": [{"field": "minutes", "minutesInterval": 1}]}},
            "type": "n8n-nodes-base.scheduleTrigger",
            "typeVersion": 1.2,
            "position": [-440, 0],
            "id": _id(),
            "name": "Cada minuto",
        },
        code("Ahora", """
const ahora = DateTime.utc();
return [{ json: { ahora: ahora.toISO(), limiteAtascado: ahora.minus({ minutes: ENVIANDO_ATASCADO_MIN }).toISO() } }];
""", [-220, 0]),
        tabla(
            "Cerrar atascados", tabla_id, "update", [0, 0],
            filtros=[
                ("estado", "eq", "enviando"),
                ("updatedAt", "lte", "={{ $('Ahora').first().json.limiteAtascado }}"),
                ("intentos", "gt", "3"),
            ],
            columnas={
                "estado": "error",
                "error": "El último intento se interrumpió a mitad de envío; revisa en el chat si llegó antes de reprogramarlo.",
            },
            siempre=True,
            una_vez=True,
        ),
        tabla(
            "Rescatar atascados", tabla_id, "update", [220, 0],
            filtros=[
                ("estado", "eq", "enviando"),
                ("updatedAt", "lte", "={{ $('Ahora').first().json.limiteAtascado }}"),
                ("intentos", "lte", "3"),
            ],
            columnas={
                "estado": "pendiente",
                "error": "El envío anterior se interrumpió; se reintenta con el mismo requestId (Google no lo duplica).",
            },
            siempre=True,
            una_vez=True,
        ),
        tabla(
            "Buscar vencidos", tabla_id, "get", [440, 0],
            filtros=[
                ("estado", "eq", "pendiente"),
                ("proximoIntento", "lte", "={{ $('Ahora').first().json.ahora }}"),
            ],
            limit=25,
            orden=("proximoIntento", "ASC"),
            una_vez=True,
        ),
        procesar,
    ]
    connections = conn(
        ("Cada minuto", ["Ahora"]),
        ("Ahora", ["Cerrar atascados"]),
        ("Cerrar atascados", ["Rescatar atascados"]),
        ("Rescatar atascados", ["Buscar vencidos"]),
        ("Buscar vencidos", ["Enviar cada uno"]),
    )
    settings = dict(SETTINGS)
    # 1.440 ejecuciones al día: las exitosas no se guardan (el resultado queda en la tabla).
    settings["saveDataSuccessExecution"] = "none"
    return {"name": N_CRON, "nodes": nodes, "connections": connections, "settings": settings}


def tool_nodes(programar_id: str, listar_id: str, cancelar_id: str) -> list[dict]:
    def tool(name: str, desc: str, wid: str, inputs: list[tuple[str, str, str]], x: int) -> dict:
        return {
            "parameters": {
                "description": desc,
                "workflowId": {"__rl": True, "value": wid, "mode": "id"},
                "workflowInputs": {
                    "mappingMode": "defineBelow",
                    "value": {k: v for k, v, _t in inputs},
                    "matchingColumns": [],
                    "schema": [
                        {
                            "id": k,
                            "displayName": k,
                            "required": False,
                            "defaultMatch": False,
                            "display": True,
                            "canBeUsedToMatch": True,
                            "type": t,
                            "removed": False,
                        }
                        for k, _v, t in inputs
                    ],
                    "attemptToConvertTypes": False,
                    "convertFieldsToString": False,
                },
            },
            "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
            "typeVersion": 2.2,
            "position": [x, 260],
            "id": _id(),
            "name": name,
        }

    return [
        tool(
            "programar_mensaje",
            "Antes de usar, confirma con el usuario destinatario, texto exacto y hora. "
            "Programa un mensaje de Google Chat que se enviará en nombre de Ricardo a un espacio, grupo o DM "
            "en la fecha y hora indicadas (opcionalmente dentro de un hilo). La fecha debe ser futura; sin zona "
            "horaria se interpreta en hora de Chile. Devuelve el id del programado (para listar_programados y "
            "cancelar_programado), el destino y la fecha en hora de Chile. Para escribirle a una persona, primero "
            "consigue el id del DM con abrir_dm.",
            programar_id,
            [
                ("espacio", "={{ $fromAI('espacio', 'Id del espacio o DM destino, formato spaces/XXX.', 'string') }}", "string"),
                ("texto", "={{ $fromAI('texto', 'Texto exacto del mensaje, ya confirmado con el usuario.', 'string') }}", "string"),
                ("fecha_hora", "={{ $fromAI('fecha_hora', 'Fecha y hora de envío en ISO 8601 con zona, ej. 2026-09-23T09:00:00-03:00. Sin zona se asume hora de Chile. Debe ser futura.', 'string') }}", "string"),
                ("hilo", "={{ $fromAI('hilo', 'Opcional: nombre del hilo a responder (formato spaces/XXX/threads/YYY). Vacío = mensaje nuevo.', 'string', '') }}", "string"),
            ],
            690,
        ),
        tool(
            "listar_programados",
            "Lista los mensajes programados de Google Chat con id, destino (nombre legible), fecha de envío en hora "
            "de Chile, estado y texto. Por defecto solo los pendientes; con estado puedes ver enviado, error, "
            "cancelado, enviando o todos. Los enviados traen la hora real de envío y el link; los error, el detalle.",
            listar_id,
            [
                ("estado", "={{ $fromAI('estado', 'Filtro: pendiente (por defecto), enviando, enviado, error, cancelado o todos.', 'string', '') }}", "string"),
                ("limite", "={{ $fromAI('limite', 'Máximo de mensajes a devolver. Por defecto 50.', 'number', 50) }}", "number"),
            ],
            920,
        ),
        tool(
            "cancelar_programado",
            "Cancela un mensaje programado por su id (sale de programar_mensaje o listar_programados). Solo cancela "
            "si sigue pendiente; si ya se envió, se está enviando o quedó en error, avisa y no cambia nada.",
            cancelar_id,
            [("id", "={{ $fromAI('id', 'Id numérico del mensaje programado.', 'number') }}", "number")],
            1150,
        ),
    ]


INSTRUCCION_EXTRA = (
    " Para enviar más tarde usa programar_mensaje (confirma antes destinatario, texto exacto y hora);"
    " listar_programados y cancelar_programado administran esa cola."
)


# ---------- aplicar ----------

def listar_workflows() -> list[dict]:
    out, cursor = [], None
    while True:
        q = "/workflows?limit=250" + (f"&cursor={urllib.parse.quote(cursor)}" if cursor else "")
        d = api("GET", q)
        out += d.get("data", [])
        cursor = d.get("nextCursor")
        if not cursor:
            return out


def asegurar_tabla(aplicar: bool) -> str | None:
    d = api("GET", "/data-tables?limit=100")
    for t in d.get("data", []):
        if t["name"] == TABLA_NOMBRE:
            faltan = {c for c, _ in TABLA_COLUMNAS} - {c["name"] for c in t.get("columns", [])}
            if faltan:
                raise SystemExit(f"La tabla {TABLA_NOMBRE} existe pero le faltan columnas: {sorted(faltan)}")
            print("tabla:", TABLA_NOMBRE, t["id"])
            return t["id"]
    if not aplicar:
        print("tabla: se crearía", TABLA_NOMBRE)
        return None
    t = api("POST", "/data-tables", {"name": TABLA_NOMBRE, "columns": [{"name": c, "type": ty} for c, ty in TABLA_COLUMNAS]})
    print("tabla creada:", t["id"])
    return t["id"]


def publicar(wid: str) -> None:
    api("POST", f"/workflows/{wid}/activate")
    d = api("GET", f"/workflows/{wid}")
    if not d.get("active"):
        raise SystemExit(f"{d.get('name')} quedó inactivo")
    if d.get("activeVersionId") and d.get("versionId") and d["activeVersionId"] != d["versionId"]:
        raise SystemExit(f"{d.get('name')}: la versión publicada no es la última")


def upsert(wf: dict, existentes: dict[str, str], aplicar: bool) -> str:
    wid = existentes.get(wf["name"])
    if not aplicar:
        print(("actualizaría " if wid else "crearía ") + wf["name"])
        return wid or f"<{wf['name']}>"
    if wid:
        api("PUT", f"/workflows/{wid}", wf)
    else:
        wid = api("POST", "/workflows", wf)["id"]
    publicar(wid)
    print("ok", wf["name"], wid)
    return wid


def parchar_enviar(aplicar: bool) -> None:
    w = api("GET", f"/workflows/{ENVIAR}")
    trig = next(n for n in w["nodes"] if n["name"] == "Trigger")
    prep = next(n for n in w["nodes"] if n["name"] == "Preparar")
    valores = trig["parameters"]["workflowInputs"]["values"]
    js = prep["parameters"]["jsCode"]
    tiene_input = any(v["name"] == "request_id" for v in valores)
    tiene_js = URL_NUEVA in js
    if tiene_input and tiene_js:
        print("enviar_mensaje: request_id ya estaba")
        return
    if not tiene_js and URL_VIEJA not in js:
        raise SystemExit("enviar_mensaje: no encontré la línea de la URL a reemplazar; revisar a mano.")
    if not aplicar:
        print("enviar_mensaje: agregaría input opcional request_id")
        return
    if not tiene_input:
        valores.append({"name": "request_id", "type": "string"})
    if not tiene_js:
        prep["parameters"]["jsCode"] = js.replace(URL_VIEJA, URL_NUEVA)
    api("PUT", f"/workflows/{ENVIAR}", {k: w[k] for k in ("name", "nodes", "connections", "settings")})
    publicar(ENVIAR)
    print("ok enviar_mensaje: request_id opcional")


def mcp_con_tools(base: dict, programar_id: str, listar_id: str, cancelar_id: str) -> dict:
    nuevos = tool_nodes(programar_id, listar_id, cancelar_id)
    nombres = {n["name"] for n in nuevos}
    nodes = [n for n in base["nodes"] if n["name"] not in nombres] + nuevos
    connections = {k: v for k, v in base["connections"].items() if k not in nombres}
    trig = next(n for n in nodes if n["type"] == "@n8n/n8n-nodes-langchain.mcpTrigger")
    for n in nuevos:
        connections[n["name"]] = {"ai_tool": [[{"node": trig["name"], "type": "ai_tool", "index": 0}]]}
    ins = trig["parameters"].get("instructions", "")
    if INSTRUCCION_EXTRA.strip() not in ins:
        trig["parameters"]["instructions"] = ins + INSTRUCCION_EXTRA
    return {"name": base["name"], "nodes": nodes, "connections": connections, "settings": base.get("settings") or SETTINGS}


def aplicar_todo(aplicar: bool) -> int:
    tabla_id = asegurar_tabla(aplicar) or "<tabla>"
    existentes = {w["name"]: w["id"] for w in listar_workflows()}
    parchar_enviar(aplicar)
    interno = upsert(wf_interno(tabla_id), existentes, aplicar)
    programar = upsert(wf_programar(tabla_id), existentes, aplicar)
    listar = upsert(wf_listar(tabla_id), existentes, aplicar)
    cancelar = upsert(wf_cancelar(tabla_id), existentes, aplicar)
    upsert(wf_cron(tabla_id, interno), existentes, aplicar)
    base = api("GET", f"/workflows/{MCP_SERVER}")
    nuevo = mcp_con_tools(base, programar, listar, cancelar)
    if not aplicar:
        print("actualizaría MCP server con", [n["name"] for n in nuevo["nodes"] if "toolWorkflow" in n["type"]])
        print("simulacro: no se escribió nada. Pasa --aplicar.")
        return 0
    api("PUT", f"/workflows/{MCP_SERVER}", nuevo)
    publicar(MCP_SERVER)
    d = api("GET", f"/workflows/{MCP_SERVER}")
    print("ok MCP server; tools:", [n["name"] for n in d["nodes"] if "toolWorkflow" in n["type"]])
    return 0


def prueba_crear() -> int:
    """Clon del MCP server con otro path y un bearer propio, para probar sin tocar el token de Ricardo."""
    token = secrets.token_urlsafe(32)
    cred = api("POST", "/credentials", {"name": CRED_PRUEBA, "type": "httpBearerAuth", "data": {"token": token}})
    base = api("GET", f"/workflows/{MCP_SERVER}")
    ruta = "google-chat-ricardo-prueba-" + secrets.token_hex(4)
    nodes = json.loads(json.dumps(base["nodes"]))
    for n in nodes:
        n["id"] = _id()
        if n["type"] == "@n8n/n8n-nodes-langchain.mcpTrigger":
            n["parameters"]["path"] = ruta
            n["credentials"] = {"httpBearerAuth": {"id": cred["id"], "name": CRED_PRUEBA}}
            n["webhookId"] = _id()
    wid = api("POST", "/workflows", {"name": N_PRUEBA, "nodes": nodes, "connections": base["connections"], "settings": base.get("settings") or SETTINGS})["id"]
    publicar(wid)
    raiz = BASE[: -len("/api/v1")]
    print(json.dumps({"workflow": wid, "credencial": cred["id"], "url": f"{raiz}/mcp/{ruta}", "token": token}))
    return 0


def prueba_borrar() -> int:
    for w in listar_workflows():
        if w["name"] == N_PRUEBA:
            api("POST", f"/workflows/{w['id']}/deactivate")
            api("DELETE", f"/workflows/{w['id']}")
            print("borrado workflow", w["id"])
    creds = api("GET", "/credentials?limit=250")
    for c in creds.get("data", []):
        if c["name"] == CRED_PRUEBA:
            api("DELETE", f"/credentials/{c['id']}")
            print("borrada credencial", c["id"])
    return 0


def main() -> int:
    if not KEY or not BASE:
        print("Falta N8N_URL o N8N_API_KEY", file=sys.stderr)
        return 2
    if "--prueba-crear" in sys.argv:
        return prueba_crear()
    if "--prueba-borrar" in sys.argv:
        return prueba_borrar()
    return aplicar_todo("--aplicar" in sys.argv)


if __name__ == "__main__":
    sys.exit(main())
