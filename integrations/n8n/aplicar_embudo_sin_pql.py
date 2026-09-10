#!/usr/bin/env python3
"""Quita PQL de ORDEN y apaga Meta CAPI - Lead en los emisores vivos.

Wizard A3wOPmhQjit8VswM, Meet FZvyK42lkQdKWcIl, Sub A YmauqyDqrZNKIYlg.
No pisa el jsCode entero: solo el literal ORDEN y `disabled` del nodo Lead.

    python3 integrations/n8n/aplicar_embudo_sin_pql.py
    python3 integrations/n8n/aplicar_embudo_sin_pql.py --aplicar
"""
from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

BASE = os.environ.get("N8N_URL", "").rstrip("/")
if BASE and not BASE.endswith("/api/v1"):
    BASE = BASE + "/api/v1"
KEY = os.environ.get("N8N_API_KEY", "").strip()
BACKUP = Path(__file__).resolve().parent / "backup"

ORDEN_CON_PQL = "const ORDEN = { NEW: 0, PQL: 1, MQL: 2, MEETING: 3, PROPOSAL: 4, CUSTOMER: 5 };"
ORDEN_SIN_PQL = "const ORDEN = { NEW: 0, MQL: 1, MEETING: 2, PROPOSAL: 3, CUSTOMER: 4 };"
ORDEN_SCREENING = "const ORDEN = { NEW: 0, SCREENING: 1, MEETING: 2, PROPOSAL: 3, CUSTOMER: 4 };"

NODOS_ORDEN = [
    ("A3wOPmhQjit8VswM", "Twenty - Crear Lead"),
    ("FZvyK42lkQdKWcIl", "Twenty - Agendó (Meet)"),
    ("YmauqyDqrZNKIYlg", "Twenty - Crear Lead"),
]
SUB_A = "YmauqyDqrZNKIYlg"
LEAD_NODO = "Meta CAPI - Lead"


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
        raise SystemExit(f"{method} {path} → {e.code}: {e.read().decode('utf-8', 'replace')[:800]}") from e


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


def respaldo(w: dict) -> Path:
    BACKUP.mkdir(parents=True, exist_ok=True)
    marca = time.strftime("%Y%m%d-%H%M%S")
    dest = BACKUP / f"{w.get('id')}-sin-pql-{marca}.json"
    dest.write_text(
        json.dumps(
            {
                "id": w.get("id"),
                "name": w.get("name"),
                "active": w.get("active"),
                "nodes": w.get("nodes"),
                "connections": w.get("connections"),
                "settings": w.get("settings"),
                "staticData": w.get("staticData"),
            },
            indent=1,
        )
    )
    return dest


def main() -> int:
    if not KEY or not BASE:
        print("Falta N8N_URL o N8N_API_KEY", file=sys.stderr)
        return 2
    aplicar = "--aplicar" in sys.argv
    ok = True

    for wid, nodo in NODOS_ORDEN:
        w = api("GET", f"/workflows/{wid}")
        n = next((x for x in w["nodes"] if x["name"] == nodo), None)
        if n is None:
            print(f"[{wid}] no está {nodo!r}", file=sys.stderr)
            return 2
        code = n["parameters"].get("jsCode") or ""
        print(f"\n== {wid} · {w['name']} · {nodo} · active={w.get('active')}")
        print("   ORDEN con PQL:", ORDEN_CON_PQL in code)
        print("   ORDEN sin PQL:", ORDEN_SIN_PQL in code)
        print("   ORDEN SCREENING:", ORDEN_SCREENING in code)
        nuevo = code
        if ORDEN_SIN_PQL in nuevo and ORDEN_CON_PQL not in nuevo and ORDEN_SCREENING not in nuevo:
            print("   ORDEN ya sin PQL")
        elif ORDEN_CON_PQL in nuevo:
            nuevo = nuevo.replace(ORDEN_CON_PQL, ORDEN_SIN_PQL)
        elif ORDEN_SCREENING in nuevo:
            nuevo = nuevo.replace(ORDEN_SCREENING, ORDEN_SIN_PQL)
        else:
            print("   MAL: no encontré un ORDEN conocido", file=sys.stderr)
            return 2
        if nuevo != code:
            print(f"   jsCode {len(code)} → {len(nuevo)}")
            if aplicar:
                dest = respaldo(w)
                print("   respaldo:", dest)
                n["parameters"]["jsCode"] = nuevo
                api("PUT", f"/workflows/{wid}", payload_de(w))
                d = api("GET", f"/workflows/{wid}")
                c2 = next(x for x in d["nodes"] if x["name"] == nodo)["parameters"].get("jsCode") or ""
                if not d.get("active") and w.get("active"):
                    api("POST", f"/workflows/{wid}/activate")
                    d = api("GET", f"/workflows/{wid}")
                bien = c2 == nuevo and bool(d.get("active")) == bool(w.get("active"))
                ok = ok and bien
                print("   ok ORDEN" if bien else "   MAL ORDEN")
            else:
                print("   simulacro: sin PUT")

    w = api("GET", f"/workflows/{SUB_A}")
    lead = next((x for x in w["nodes"] if x["name"] == LEAD_NODO), None)
    print(f"\n== {SUB_A} · {LEAD_NODO}")
    if lead is None:
        print("   no está el nodo (nada que apagar)")
    else:
        print("   disabled:", bool(lead.get("disabled")))
        if lead.get("disabled"):
            print("   ya estaba apagado")
        elif aplicar:
            dest = respaldo(w)
            print("   respaldo:", dest)
            lead["disabled"] = True
            api("PUT", f"/workflows/{SUB_A}", payload_de(w))
            d = api("GET", f"/workflows/{SUB_A}")
            lead2 = next(x for x in d["nodes"] if x["name"] == LEAD_NODO)
            if not d.get("active") and w.get("active"):
                api("POST", f"/workflows/{SUB_A}/activate")
                d = api("GET", f"/workflows/{SUB_A}")
            bien = bool(lead2.get("disabled")) and bool(d.get("active")) == bool(w.get("active"))
            ok = ok and bien
            print("   ok Lead apagado" if bien else "   MAL Lead")
        else:
            print("   simulacro: sin PUT")

    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
