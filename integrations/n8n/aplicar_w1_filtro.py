#!/usr/bin/env python3
"""W1: el nodo «Corresponde enviar?» no filtraba nada.

Hallazgo de la auditoría del 09-sep-2026 (después de aplicar el jsCode):
el IF es typeVersion 2 pero tenía parámetros con la forma de la versión 1
(`conditions.boolean[{value1, value2}]`). En v2 esa forma no define
ninguna condición y TODO sale por la rama «true»: los ítems con
`omitido: true` llegaban igual a «Enviar evento a Meta CAPI», que hacía
`JSON.stringify(undefined)` y fallaba (inofensivo para Meta, pero cada
webhook de Twenty —notas, personas, metadata— terminaba en un HTTP
fallido). Venía así desde antes del PUT del 09-sep.

Este script reescribe las condiciones del IF en la forma v2:
`$json.omitido` es false → enviar. No toca ningún otro nodo.

    python3 integrations/n8n/aplicar_w1_filtro.py            # simulacro
    python3 integrations/n8n/aplicar_w1_filtro.py --aplicar
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request

WID = "W1SybZZSEZqAItIt"
NODO = "Corresponde enviar?"
BASE = os.environ.get("N8N_URL", "").rstrip("/")
if BASE and not BASE.endswith("/api/v1"):
    BASE = BASE + "/api/v1"
KEY = os.environ.get("N8N_API_KEY", "").strip()

PARAMS_V2 = {
    "conditions": {
        "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "loose", "version": 2},
        "conditions": [
            {
                "id": "omitido-es-false",
                "leftValue": "={{ $json.omitido }}",
                "rightValue": "",
                "operator": {"type": "boolean", "operation": "false", "singleValue": True},
            }
        ],
        "combinator": "and",
    },
    "options": {},
}


def api(method: str, path: str, body: dict | None = None) -> dict:
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
        raise SystemExit(f"{method} {path} → {e.code}: {e.read().decode('utf-8', 'replace')[:800]}") from e


def main() -> int:
    if not KEY or not BASE:
        print("Falta N8N_URL o N8N_API_KEY", file=sys.stderr)
        return 2
    aplicar = "--aplicar" in sys.argv
    w = api("GET", f"/workflows/{WID}")
    n = next((x for x in w["nodes"] if x["name"] == NODO), None)
    if n is None:
        print(f"No está el nodo {NODO!r}", file=sys.stderr)
        return 2
    print("workflow:", w["name"], "| active:", w.get("active"))
    print("IF typeVersion:", n.get("typeVersion"), "| parámetros actuales:", json.dumps(n.get("parameters"), ensure_ascii=False)[:200])
    if n.get("parameters") == PARAMS_V2:
        print("Ya estaba aplicado.")
        return 0
    if not aplicar:
        print("simulacro: sin PUT")
        return 0
    n["parameters"] = PARAMS_V2
    n["typeVersion"] = 2
    body = {"name": w["name"], "nodes": w["nodes"], "connections": w["connections"], "settings": w.get("settings") or {}}
    if "staticData" in w:
        body["staticData"] = w["staticData"]
    api("PUT", f"/workflows/{WID}", body)
    d = api("GET", f"/workflows/{WID}")
    n2 = next(x for x in d["nodes"] if x["name"] == NODO)
    ok = n2.get("parameters") == PARAMS_V2 and d.get("connections") == w.get("connections")
    if not d.get("active") and w.get("active"):
        api("POST", f"/workflows/{WID}/activate")
        d = api("GET", f"/workflows/{WID}")
    ok = ok and bool(d.get("active"))
    print("ok aplicado y activo" if ok else "MAL: revisar")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
