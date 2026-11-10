#!/usr/bin/env python3
"""Wizard A3wOPmhQjit8VswM: aviso a [Clinera] Comercial por cada registro de la prueba gratis.

Ricardo, 10-nov-2026. Agrega dos nodos al final de «Solo etapa de contacto»:
  «Filtrar registro landing» (Code, wizard-aviso-registro/filtrar.js) → «Chat - Registro landing» (HTTP).
La URL de la sala se copia del nodo vivo «Notify Google Chat»; no va en el repo ni se imprime.
Los dos nodos llevan onError=continueRegularOutput: un tropiezo del aviso no puede cortar las
otras ramas del Wizard (Twenty, Baserow, Loops).

    python3 integrations/n8n/aplicar_wizard_aviso_registro.py             # simulacro
    python3 integrations/n8n/aplicar_wizard_aviso_registro.py --aplicar
    python3 integrations/n8n/aplicar_wizard_aviso_registro.py --deshacer --aplicar

La API de n8n la autentica el proxy del entorno (o N8N_API_KEY en X-N8N-API-KEY).
"""
import json, os, sys, urllib.request, pathlib

WID = "A3wOPmhQjit8VswM"
BASE = os.environ.get("N8N_URL", "https://n8n.oacg.cl").rstrip("/") + "/api/v1"
ORIGEN, FILTRO, CHAT, MOLDE = "Solo etapa de contacto", "Filtrar registro landing", "Chat - Registro landing", "Notify Google Chat"
AQUI = pathlib.Path(__file__).parent


def api(metodo, ruta, cuerpo=None):
    h = {"Content-Type": "application/json", "Accept": "application/json"}
    if os.environ.get("N8N_API_KEY"):
        h["X-N8N-API-KEY"] = os.environ["N8N_API_KEY"]
    req = urllib.request.Request(BASE + ruta, data=None if cuerpo is None else json.dumps(cuerpo).encode(), method=metodo, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            raw = r.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raise SystemExit(f"{metodo} {ruta} -> {e.code}: {e.read().decode()[:400]}")


def main():
    aplicar, deshacer = "--aplicar" in sys.argv, "--deshacer" in sys.argv
    wf = api("GET", f"/workflows/{WID}")
    nodos = {n["name"]: n for n in wf["nodes"]}
    for req in (ORIGEN, MOLDE):
        if req not in nodos:
            raise SystemExit(f"Falta el nodo «{req}» en el vivo: no toco nada.")
    wf["nodes"] = [n for n in wf["nodes"] if n["name"] not in (FILTRO, CHAT)]
    con = wf["connections"]
    con.pop(FILTRO, None); con.pop(CHAT, None)
    salidas = con.setdefault(ORIGEN, {"main": [[]]})["main"]
    salidas[0] = [c for c in salidas[0] if c["node"] != FILTRO]
    if not deshacer:
        x, y = nodos[ORIGEN]["position"]
        wf["nodes"].append({"name": FILTRO, "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [x + 240, y + 420],
                            "onError": "continueRegularOutput",
                            "parameters": {"jsCode": (AQUI / "wizard-aviso-registro" / "filtrar.js").read_text()}})
        wf["nodes"].append({"name": CHAT, "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": [x + 480, y + 420],
                            "onError": "continueRegularOutput",
                            "parameters": {"method": "POST", "url": nodos[MOLDE]["parameters"]["url"], "sendBody": True,
                                           "specifyBody": "json", "jsonBody": "={{ JSON.stringify({ text: $json.texto }) }}",
                                           "options": {"timeout": 15000}}})
        salidas[0].append({"node": FILTRO, "type": "main", "index": 0})  # al final: las ramas de siempre corren primero
        con[FILTRO] = {"main": [[{"node": CHAT, "type": "main", "index": 0}]]}
    print(("Quitar" if deshacer else "Poner"), f"«{FILTRO}» → «{CHAT}» después de «{ORIGEN}». Nodos: {len(wf['nodes'])}.")
    if not aplicar:
        print("Simulacro: no se escribió nada. Usa --aplicar.")
        return
    ajustes = {k: v for k, v in (wf.get("settings") or {}).items() if k in ("executionOrder", "errorWorkflow", "saveManualExecutions", "timezone", "callerPolicy")}
    api("PUT", f"/workflows/{WID}", {"name": wf["name"], "nodes": wf["nodes"], "connections": con, "settings": ajustes})
    vivo = api("GET", f"/workflows/{WID}")
    nombres = [n["name"] for n in vivo["nodes"]]
    print("Aplicado. Activo:", vivo.get("active"), "| filtro:", FILTRO in nombres, "| chat:", CHAT in nombres)


if __name__ == "__main__":
    main()
