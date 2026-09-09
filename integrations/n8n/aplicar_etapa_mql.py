#!/usr/bin/env python3
"""Etapa MQL en Twenty: los workflows dejan de escribir SCREENING.

Contexto (auditoría 09-sep-2026, capa Twenty): el 07-sep se relabelaron
las etapas para que el tablero calzara con el W1 cruzado — el valor
`SCREENING` decía «PQL» y el valor `PQL` decía «MQL». Los datos decían lo
contrario: 130 negocios en SCREENING eran leads que agendaron (86 con
fecha de demo), o sea MQL; los 36 en PQL eran PQL. Con el mapeo canónico
de W1 (Nuevo/PQL/MQL/SQL/HOT/NQL/Purchase) eso hacía que mover a «PQL» no
emitiera nada y mover a «MQL» emitiera `PQL` US$ 1.

Lo que ya se hizo en Twenty (09-sep, vía conector, sin este script):
  - opción `MQL` creada en `stage`, etiqueta «MQL»;
  - opción `PQL` re-etiquetada «PQL»;
  - opción `SCREENING` re-etiquetada «Screening (migrar a MQL)»;
  - 131 negocios movidos SCREENING → MQL.

Lo que hace este script (n8n): los tres nodos que escriben o comparan
`SCREENING` pasan a `MQL`, con la escalera NEW < PQL < MQL < SQL < HOT <
Customer. Sin esto, cuando se borre la opción SCREENING de Twenty cada
lead que agenda fallaría al crearse (POST con enum inválido).

  - Wizard `A3wOPmhQjit8VswM` · «Twenty - Crear Lead»: `etapaDestino`
    agendó → `MQL`; `ORDEN`.
  - Meet `FZvyK42lkQdKWcIl` · «Twenty - Agendó (Meet)»: `DESTINO = 'MQL'`;
    `ORDEN`.
  - Sub A `YmauqyDqrZNKIYlg` · «Twenty - Crear Lead»: `ORDEN`.

Después del PUT queda un paso manual en Twenty: migrar los SCREENING que
hayan entrado entre medio y borrar la opción. Orden obligatorio:
1) este script con --aplicar, 2) recién ahí borrar SCREENING en Twenty.

La fuente canónica de estos workflows vive en el repo `baserow`
(sales/n8n/) y `integrations/n8n/clinera-meet-por-profesional.workflow.json`
acá: replicar el cambio allá después de aplicar. Los JSON completos traen
tokens en las URLs: respaldarlos fuera del repo.

    python3 integrations/n8n/aplicar_etapa_mql.py            # simulacro
    python3 integrations/n8n/aplicar_etapa_mql.py --aplicar
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request

BASE = os.environ.get("N8N_URL", "").rstrip("/")
if BASE and not BASE.endswith("/api/v1"):
    BASE = BASE + "/api/v1"
KEY = os.environ.get("N8N_API_KEY", "").strip()

ORDEN_VIEJO = "const ORDEN = { NEW: 0, SCREENING: 1, MEETING: 2, PROPOSAL: 3, CUSTOMER: 4 };"
ORDEN_NUEVO = "const ORDEN = { NEW: 0, PQL: 1, MQL: 2, MEETING: 3, PROPOSAL: 4, CUSTOMER: 5 };"

# (workflow id, nodo, [(viejo, nuevo, veces)])
CAMBIOS = [
    (
        "A3wOPmhQjit8VswM",
        "Twenty - Crear Lead",
        [
            (ORDEN_VIEJO, ORDEN_NUEVO, 1),
            (
                "const etapaDestino = agendo ? 'SCREENING' : 'NEW';",
                "const etapaDestino = agendo ? 'MQL' : 'NEW';",
                1,
            ),
            (
                "// (`MEETING`); solo llenó el wizard → MQL (`SCREENING`). El caso en que el",
                "// (`MEETING`); solo llenó el wizard → MQL (`MQL`). El caso en que el",
                1,
            ),
            (
                "// (SCREENING). Subirlo a SQL o SQL+ es decisión de ventas (Nohe, Rebe o",
                "// (MQL). Subirlo a SQL o HOT es decisión de ventas (Nohe, Rebe o",
                1,
            ),
        ],
    ),
    (
        "FZvyK42lkQdKWcIl",
        "Twenty - Agendó (Meet)",
        [
            (ORDEN_VIEJO, ORDEN_NUEVO, 1),
            ("const DESTINO = 'SCREENING';", "const DESTINO = 'MQL';", 1),
        ],
    ),
    (
        "YmauqyDqrZNKIYlg",
        "Twenty - Crear Lead",
        [(ORDEN_VIEJO, ORDEN_NUEVO, 1)],
    ),
]


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


def main() -> int:
    if not KEY or not BASE:
        print("Falta N8N_URL o N8N_API_KEY", file=sys.stderr)
        return 2
    aplicar = "--aplicar" in sys.argv
    ok_total = True

    for wid, nodo, reemplazos in CAMBIOS:
        w = api("GET", f"/workflows/{wid}")
        n = next((x for x in w["nodes"] if x["name"] == nodo), None)
        if n is None:
            print(f"[{wid}] no está el nodo {nodo!r}", file=sys.stderr)
            return 2
        code = n["parameters"].get("jsCode") or ""
        nuevo = code
        ya = all(v not in nuevo and r in nuevo for v, r, _ in reemplazos)
        print(f"\n== {wid} · {w['name']} · {nodo} · active={w.get('active')}")
        if ya:
            print("   ya estaba aplicado")
            continue
        for viejo, reemplazo, veces in reemplazos:
            c = nuevo.count(viejo)
            if c != veces:
                print(f"   esperaba {veces} de {viejo[:60]!r}, hay {c}", file=sys.stderr)
                return 2
            nuevo = nuevo.replace(viejo, reemplazo)
        print(f"   jsCode {len(code)} → {len(nuevo)} bytes · queda 'SCREENING' en código: "
              f"{sum(1 for l in nuevo.splitlines() if 'SCREENING' in l and not l.strip().startswith('//'))}")
        if not aplicar:
            print("   simulacro: sin PUT")
            continue
        n["parameters"]["jsCode"] = nuevo
        api("PUT", f"/workflows/{wid}", payload_de(w))
        d = api("GET", f"/workflows/{wid}")
        c2 = next(x for x in d["nodes"] if x["name"] == nodo)["parameters"]["jsCode"]
        ok = c2 == nuevo and len(d["nodes"]) == len(w["nodes"]) and d["connections"] == w["connections"]
        if not d.get("active") and w.get("active"):
            api("POST", f"/workflows/{wid}/activate")
            d = api("GET", f"/workflows/{wid}")
        ok = ok and bool(d.get("active")) == bool(w.get("active"))
        ok_total = ok_total and ok
        print("   ok aplicado" if ok else "   MAL: revisar y restaurar desde el respaldo")

    if aplicar and ok_total:
        print(
            "\nn8n listo. Ahora en Twenty: mover los negocios que sigan en SCREENING a MQL "
            "y borrar la opción SCREENING del campo `stage` (id 7d5e561d-ea1c-4210-8f1f-d0f7ad474f06)."
        )
    return 0 if ok_total else 1


if __name__ == "__main__":
    raise SystemExit(main())
