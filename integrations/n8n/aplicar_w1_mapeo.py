#!/usr/bin/env python3
"""Aplica el mapeo canónico al W1 vivo.

Reemplaza únicamente el jsCode de «Mapear etapa y cifrar datos» y el
nombre del workflow (saca «inactivo»). Respalda el JSON antes del PUT.
Requiere N8N_URL + N8N_API_KEY.

    python3 integrations/n8n/aplicar_w1_mapeo.py           # simulacro
    python3 integrations/n8n/aplicar_w1_mapeo.py --aplicar
"""
from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

WID = "W1SybZZSEZqAItIt"
NODO = "Mapear etapa y cifrar datos"
NOMBRE = "Clinera | Twenty etapas → Meta CAPI"
AQUI = Path(__file__).resolve().parent
MAPEO = AQUI / "crm-etapas-meta-capi.mapeo.js"
BACKUP = AQUI / "backup"

BASE = os.environ.get("N8N_URL", "").rstrip("/")
if BASE and not BASE.endswith("/api/v1"):
    BASE = BASE + "/api/v1"
KEY = os.environ.get("N8N_API_KEY", "").strip()


def api(method: str, path: str, body: dict | None = None) -> dict:
    req = urllib.request.Request(
        BASE + path,
        data=None if body is None else json.dumps(body).encode(),
        method=method,
        headers={
            "X-N8N-API-KEY": KEY,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            raw = resp.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        detalle = e.read().decode("utf-8", "replace")[:800]
        raise SystemExit(f"{method} {path} → {e.code}: {detalle}") from e


def payload_de(w: dict) -> dict:
    out = {
        "name": w["name"],
        "nodes": w["nodes"],
        "connections": w["connections"],
        "settings": w.get("settings") or {},
    }
    if "staticData" in w:
        out["staticData"] = w["staticData"]
    return out


def sondear_webhook() -> str:
    root = os.environ.get("N8N_URL", "").rstrip("/")
    if root.endswith("/api/v1"):
        root = root[: -len("/api/v1")]
    url = root + "/webhook/crm-sql"
    req = urllib.request.Request(url, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            txt = resp.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        txt = e.read().decode("utf-8", "replace")
    if "not registered for GET" in txt:
        return "registrado"
    if "not registered" in txt.lower() or "404" in txt:
        return "caido"
    return "otro"


def main() -> int:
    if not KEY or not BASE:
        print("Falta N8N_URL o N8N_API_KEY", file=sys.stderr)
        return 2
    aplicar = "--aplicar" in sys.argv
    nuevo = MAPEO.read_text()
    if "function mapearEtapa" not in nuevo or 'event_name: "NQL"' not in nuevo:
        print("El archivo de mapeo no parece el canónico.", file=sys.stderr)
        return 2
    # Contrato con los nodos siguientes (H8): sin estas claves el HTTP manda
    # JSON.stringify(undefined) y el filtro deja pasar todo.
    for clave in ("omitido: false", "payload: payload", "ledgerKey: ledgerKey"):
        if clave not in nuevo:
            print(f"El archivo no devuelve {clave!r}: rompería el nodo CAPI.", file=sys.stderr)
            return 2

    wf = api("GET", f"/workflows/{WID}")
    nodos = [n.get("name") for n in wf.get("nodes") or []]
    if NODO not in nodos:
        print(f"No está el nodo {NODO!r}. Hay: {nodos}", file=sys.stderr)
        return 2

    vivo = next(n for n in wf["nodes"] if n["name"] == NODO)
    code = vivo["parameters"].get("jsCode") or ""
    print("workflow:", wf.get("name"))
    print("active:", wf.get("active"))
    print("jsCode vivo bytes:", len(code), "archivo bytes:", len(nuevo))
    print("vivo tiene tabla vieja Lead/PQL 10:", "{ event: 'MQL',      value: 10 }" in code)
    print("archivo tiene NQL 0:", 'event_name: "NQL"' in nuevo and "value: 0" in nuevo)
    webhook_antes = sondear_webhook()
    print("webhook crm-sql:", webhook_antes)

    if code == nuevo and wf.get("name") == NOMBRE:
        print("Ya estaba aplicado. Nada que escribir.")
        return 0

    if not aplicar:
        print("simulacro: no se escribió. Pasá --aplicar para el PUT.")
        return 0

    BACKUP.mkdir(parents=True, exist_ok=True)
    marca = time.strftime("%Y%m%d-%H%M%S")
    respaldo = BACKUP / f"W1SybZZSEZqAItIt-{marca}.json"
    respaldo.write_text(
        json.dumps(
            {
                "id": wf.get("id"),
                "name": wf.get("name"),
                "active": wf.get("active"),
                "nodes": wf.get("nodes"),
                "connections": wf.get("connections"),
                "settings": wf.get("settings"),
                "staticData": wf.get("staticData"),
                "pinData": wf.get("pinData") or {},
            },
            indent=1,
        )
    )
    print("respaldo:", respaldo)

    vivo["parameters"]["jsCode"] = nuevo
    wf["name"] = NOMBRE
    api("PUT", f"/workflows/{WID}", payload_de(wf))

    d = api("GET", f"/workflows/{WID}")
    code2 = next(n for n in d["nodes"] if n["name"] == NODO)["parameters"]["jsCode"]
    ok = True

    def chequeo(etiqueta: str, cond: bool) -> None:
        nonlocal ok
        ok = ok and cond
        print(("ok " if cond else "MAL"), etiqueta)

    chequeo("jsCode = archivo", code2 == nuevo)
    chequeo("nombre sin «inactivo»", d.get("name") == NOMBRE)
    chequeo("mismo número de nodos", len(d["nodes"]) == len(wf["nodes"]))
    chequeo("connections iguales", d.get("connections") == wf.get("connections"))
    if not d.get("active") and wf.get("active"):
        print("quedó inactivo — reactivando")
        api("POST", f"/workflows/{WID}/activate")
        d = api("GET", f"/workflows/{WID}")
    chequeo("sigue activo", bool(d.get("active")))
    chequeo("webhook sigue registrado", sondear_webhook() == webhook_antes == "registrado")
    chequeo("vivo emite Nuevo 0", 'event_name: "Nuevo"' in code2 and "value: 0" in code2)
    chequeo("vivo emite MQL 10 (no PQL)", 'event_name: "MQL"' in code2 and 'event_name: "PQL"' not in code2)
    chequeo("vivo emite NQL 0", 'event_name: "NQL"' in code2)
    chequeo("vivo no emite NoContesta", 'event_name: "NoContesta"' not in code2)
    chequeo(
        "vivo devuelve payload + omitido (contrato con el nodo CAPI)",
        "payload: payload" in code2 and "omitido: false" in code2,
    )
    print(
        "Falta la prueba real: en la próxima ejecución con omitido=false, "
        "«Confirmar y auditar» debe mostrar events_received >= 1."
    )

    if not ok:
        print("HAY ALGO EN ROJO. Restaurar desde", respaldo)
        return 1
    print("W1 aplicado.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
