#!/usr/bin/env python3
"""Crea o actualiza el workflow «OACG | Clinera app → Meta (Trial y Uso real)».

app.clinera.io manda POST a https://n8n.oacg.cl/webhook/clinera-app-eventos con el header
X-Clinera-Secret. El workflow manda StartTrial y UsoReal al dataset «Clinera Software»
(2251201709002818) con la credencial «Meta CAPI Clinera Software». Detalle: README.md de esta carpeta.

Uso:  python3 aplicar_clinera_app_eventos.py            (simulacro: muestra qué haría)
      python3 aplicar_clinera_app_eventos.py --aplicar  (crea/actualiza y activa)

La API de n8n la autentica el proxy del entorno (o N8N_API_KEY en el header X-N8N-API-KEY).
El secreto del header se genera UNA vez, se imprime una sola vez y no se guarda en el repo.
"""
import json, os, secrets, sys, uuid, urllib.request

BASE = "https://n8n.oacg.cl/api/v1"
AQUI = os.path.dirname(os.path.abspath(__file__))
NOMBRE_WF = "OACG | Clinera app → Meta (Trial y Uso real)"
NOMBRE_CRED = "Clinera app · webhook (X-Clinera-Secret)"
PATH = "clinera-app-eventos"
PIXEL = "2251201709002818"
CRED_META = {"id": "qAgXLEfHwAonxQ8h", "name": "Meta CAPI Clinera Software"}


def api(metodo, ruta, cuerpo=None):
    h = {"Content-Type": "application/json", "Accept": "application/json"}
    if os.environ.get("N8N_API_KEY"):
        h["X-N8N-API-KEY"] = os.environ["N8N_API_KEY"]
    req = urllib.request.Request(BASE + ruta, method=metodo, headers=h,
                                 data=json.dumps(cuerpo).encode() if cuerpo is not None else None)
    with urllib.request.urlopen(req, timeout=30) as r:
        t = r.read().decode()
        return json.loads(t) if t else {}


def leer(nombre):
    with open(os.path.join(AQUI, "clinera-app-eventos", nombre), encoding="utf-8") as f:
        return f.read()


def credencial(aplicar):
    for c in api("GET", "/credentials?limit=250").get("data", []):
        if c["name"] == NOMBRE_CRED:
            return {"id": c["id"], "name": c["name"]}, None
    if not aplicar:
        return {"id": "SIMULACRO", "name": NOMBRE_CRED}, None
    valor = secrets.token_urlsafe(32)
    c = api("POST", "/credentials", {"name": NOMBRE_CRED, "type": "httpHeaderAuth",
                                     "data": {"name": "X-Clinera-Secret", "value": valor}})
    return {"id": c["id"], "name": c["name"]}, valor


def armar(cred, webhook_id):
    seguro = {"onError": "continueRegularOutput"}
    nodos = [
        {"name": "Webhook app.clinera.io", "type": "n8n-nodes-base.webhook", "typeVersion": 2,
         "position": [0, 0], "webhookId": webhook_id,
         "parameters": {"httpMethod": "POST", "path": PATH, "authentication": "headerAuth",
                        "responseMode": "onReceived", "options": {}},
         "credentials": {"httpHeaderAuth": cred}},
        {"name": "Decidir evento Meta", "type": "n8n-nodes-base.code", "typeVersion": 2,
         "position": [240, 0], "parameters": {"mode": "runOnceForAllItems", "jsCode": leer("decidir.js")}},
        {"name": "Hay que enviar?", "type": "n8n-nodes-base.code", "typeVersion": 2,
         "position": [480, 0], "parameters": {"mode": "runOnceForAllItems",
                                             "jsCode": "return $input.all().filter(i => i.json.enviar === true);"}},
        {"name": "Enviar a Meta (2251)", "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2,
         "position": [720, 0], **seguro,
         "parameters": {"method": "POST", "url": f"https://graph.facebook.com/v26.0/{PIXEL}/events",
                        "authentication": "genericCredentialType", "genericAuthType": "httpQueryAuth",
                        "sendBody": True, "specifyBody": "json",
                        "jsonBody": "={{ JSON.stringify($json.payload) }}",
                        "options": {"timeout": 20000, "response": {"response": {"neverError": True}}}},
         "credentials": {"httpQueryAuth": dict(CRED_META)}},
        {"name": "Confirmar envío", "type": "n8n-nodes-base.code", "typeVersion": 2,
         "position": [960, 0], "parameters": {"mode": "runOnceForAllItems", "jsCode": leer("confirmar.js")}},
    ]
    orden = [n["name"] for n in nodos]
    conexiones = {a: {"main": [[{"node": b, "type": "main", "index": 0}]]} for a, b in zip(orden, orden[1:])}
    return {"name": NOMBRE_WF, "nodes": nodos, "connections": conexiones,
            "settings": {"executionOrder": "v1", "saveManualExecutions": True}}


def main():
    aplicar = "--aplicar" in sys.argv
    cred, valor = credencial(aplicar)
    existentes = [w for w in api("GET", "/workflows?limit=250").get("data", []) if w["name"] == NOMBRE_WF]
    webhook_id = str(uuid.uuid4())
    if existentes:
        viejo = api("GET", f"/workflows/{existentes[0]['id']}")
        for n in viejo["nodes"]:
            if n["type"] == "n8n-nodes-base.webhook" and n.get("webhookId"):
                webhook_id = n["webhookId"]
    wf = armar(cred, webhook_id)
    if not aplicar:
        print(("ACTUALIZARÍA " + existentes[0]["id"]) if existentes else "CREARÍA el workflow nuevo")
        print("credencial:", cred["name"], "(se crearía)" if cred["id"] == "SIMULACRO" else "(existe)")
        print("URL: https://n8n.oacg.cl/webhook/" + PATH)
        return
    if existentes:
        wid = existentes[0]["id"]
        api("PUT", f"/workflows/{wid}", wf)
    else:
        wid = api("POST", "/workflows", wf)["id"]
    api("POST", f"/workflows/{wid}/activate")
    print("workflow", wid, "activo")
    print("URL: https://n8n.oacg.cl/webhook/" + PATH)
    if valor:
        print("SECRETO X-Clinera-Secret (se muestra UNA vez, no se guarda en el repo):", valor)


if __name__ == "__main__":
    main()
