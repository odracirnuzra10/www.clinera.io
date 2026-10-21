#!/usr/bin/env python3
"""Agrega el aviso de reunión duplicada al workflow de Meet (FZvyK42lkQdKWcIl).

Por qué (Ricardo, 21-oct-2026): un lead de la campaña reserva en la web y además AURA le
agenda otra reunión por WhatsApp (casi siempre con Rebeca); las dos citas ocupan hora y la
de Nohelymar se pierde. El código del nodo y su porqué están en `aviso-reunion-duplicada.js`.

Qué hace:
- Crea «Detectar reunión duplicada» (Code) y «Aviso reunión duplicada» (HTTP a Google Chat).
- Los cuelga de «Elegir evento» EN PARALELO a los que ya salen de ahí: no toca la reserva,
  el Meet, Baserow, Twenty ni el MQL. Ambos nodos van con onError=continueRegularOutput.
- La URL del webhook de Chat se copia en vivo de «Notify Google Chat» del mismo workflow
  (misma sala [Clinera] Comercial): la llave no se versiona acá.
- Respaldo del workflow antes del PUT en N8N_BACKUP_DIR (trae llaves: no commitear).

Uso: python3 aplicar_aviso_reunion_duplicada.py            (simulacro)
     python3 aplicar_aviso_reunion_duplicada.py --aplicar
"""
import json
import os
import pathlib
import sys
import urllib.request
from datetime import datetime, timezone

N8N = "https://n8n.oacg.cl/api/v1"
WID = "FZvyK42lkQdKWcIl"
DESDE = "Elegir evento"
CHAT = "Notify Google Chat"
DETECTAR = "Detectar reunión duplicada"
AVISO = "Aviso reunión duplicada"
JS = pathlib.Path(__file__).with_name("aviso-reunion-duplicada.js")


def api(method, path, body=None):
    req = urllib.request.Request(
        N8N + path,
        method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req) as r:
        return json.load(r)


def main():
    aplicar = "--aplicar" in sys.argv
    wf = api("GET", f"/workflows/{WID}")
    nodos = {n["name"]: n for n in wf["nodes"]}
    for requerido in (DESDE, CHAT, "Normalizar Reserva"):
        assert requerido in nodos, f"falta el nodo «{requerido}»"
    url = nodos[CHAT]["parameters"]["url"]
    assert url.startswith("https://chat.googleapis.com/v1/spaces/"), "URL de Chat inesperada"

    codigo = JS.read_text()
    if DETECTAR in nodos and nodos[DETECTAR]["parameters"].get("jsCode") == codigo and AVISO in nodos:
        print("Ya estaba aplicado.")
        return

    x, y = nodos[DESDE]["position"]
    nuevos = [
        {
            "id": "dup-detectar-0001",
            "name": DETECTAR,
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [x + 220, y - 140],
            "onError": "continueRegularOutput",
            "parameters": {"jsCode": codigo},
        },
        {
            "id": "dup-aviso-0002",
            "name": AVISO,
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4.2,
            "position": [x + 440, y - 140],
            "onError": "continueRegularOutput",
            "parameters": {
                "method": "POST",
                "url": url,
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": "={{ JSON.stringify({ text: $json.textoChat }) }}",
                "options": {"timeout": 10000, "response": {"response": {"neverError": True}}},
            },
        },
    ]
    wf["nodes"] = [n for n in wf["nodes"] if n["name"] not in (DETECTAR, AVISO)] + nuevos

    con = wf["connections"]
    salida = con[DESDE]["main"][0]
    salida[:] = [c for c in salida if c["node"] != DETECTAR] + [{"node": DETECTAR, "type": "main", "index": 0}]
    con[DETECTAR] = {"main": [[{"node": AVISO, "type": "main", "index": 0}]]}

    print(f"«{DESDE}» → «{DETECTAR}» → «{AVISO}» (en paralelo a {len(salida) - 1} nodos que ya salían de ahí).")
    if not aplicar:
        print("Simulacro. Usa --aplicar para escribir en n8n.")
        return

    backup = pathlib.Path(os.environ.get("N8N_BACKUP_DIR") or pathlib.Path(__file__).parent / "backup")
    backup.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    (backup / f"meet-{WID}-{stamp}.json").write_text(json.dumps(api("GET", f"/workflows/{WID}"), ensure_ascii=False, indent=1))

    # Re-lee justo antes del PUT: el static data (ledgers `creados` y `mqlAgenteIa`) cambia con cada reserva.
    vivo = api("GET", f"/workflows/{WID}")
    payload = {
        "name": wf["name"],
        "nodes": wf["nodes"],
        "connections": con,
        "settings": vivo.get("settings") or {},
    }
    if "staticData" in vivo:
        payload["staticData"] = vivo["staticData"]
    r = api("PUT", f"/workflows/{WID}", payload)
    print("Aplicado. versionId:", r.get("versionId"), "active:", r.get("active"))


if __name__ == "__main__":
    main()
