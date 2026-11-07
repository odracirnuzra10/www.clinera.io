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
# El aviso de Trial va a [Clinera] Comercial con el webhook del nodo vivo «Chat Comercial» de
# «Videollamadas del día» (qQZiENSRbmFg307W): la URL trae la llave de la sala y no va en el repo.
WF_CHAT, NODO_CHAT = "qQZiENSRbmFg307W", "Chat Comercial"
# Loops: credencial Header Auth que crea Ricardo en n8n (Authorization: Bearer <API key de Loops>).
NOMBRE_CRED_LOOPS = "Loops API"


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


def url_chat():
    wf = api("GET", f"/workflows/{WF_CHAT}")
    xs = [n for n in wf["nodes"] if n["name"] == NODO_CHAT]
    if len(xs) != 1 or "chat.googleapis.com" not in xs[0]["parameters"].get("url", ""):
        raise SystemExit("No encontré el webhook de [Clinera] Comercial en «Chat Comercial»")
    return xs[0]["parameters"]["url"]


def cred_loops():
    for c in api("GET", "/credentials?limit=250").get("data", []):
        if c["name"] == NOMBRE_CRED_LOOPS and c["type"] == "httpHeaderAuth":
            return {"id": c["id"], "name": c["name"]}
    return None


def armar(cred, webhook_id, chat_url="SIMULACRO", loops=None):
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
    # Rama 2 (7-nov-2026): account_created sube el negocio a TRIAL en Twenty y avisa a Comercial.
    nodos += [
        {"name": "Trial en Twenty", "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [240, 260], **seguro,
         "parameters": {"mode": "runOnceForAllItems", "jsCode": leer("trial-twenty.js")}},
        {"name": "Avisar a Comercial", "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": [480, 260], **seguro,
         "parameters": {"method": "POST", "url": chat_url, "sendBody": True, "specifyBody": "json",
                        "jsonBody": "={{ JSON.stringify({ text: $json.text }) }}", "options": {"timeout": 15000}}},
    ]
    salidas = [{"node": "Decidir evento Meta", "type": "main", "index": 0},
               {"node": "Trial en Twenty", "type": "main", "index": 0}]
    conexiones["Trial en Twenty"] = {"main": [[{"node": "Avisar a Comercial", "type": "main", "index": 0}]]}
    # Rama 3: cada aviso va a Loops como evento (la serie de correos de la prueba gratis).
    if loops:
        nodos += [
            {"name": "Armar evento Loops", "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [240, 520], **seguro,
             "parameters": {"mode": "runOnceForAllItems", "jsCode": leer("loops-evento.js")}},
            {"name": "Enviar a Loops", "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": [480, 520], **seguro,
             "parameters": {"method": "POST", "url": "https://app.loops.so/api/v1/events/send",
                            "authentication": "genericCredentialType", "genericAuthType": "httpHeaderAuth",
                            "sendBody": True, "specifyBody": "json",
                            "jsonBody": "={{ JSON.stringify($json.body) }}",
                            "options": {"timeout": 15000, "response": {"response": {"neverError": True}}}},
             "credentials": {"httpHeaderAuth": dict(loops)}},
        ]
        salidas.append({"node": "Armar evento Loops", "type": "main", "index": 0})
        conexiones["Armar evento Loops"] = {"main": [[{"node": "Enviar a Loops", "type": "main", "index": 0}]]}
    conexiones["Webhook app.clinera.io"] = {"main": [salidas]}
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
    loops = cred_loops()
    wf = armar(cred, webhook_id, url_chat(), loops)
    if not aplicar:
        print(("ACTUALIZARÍA " + existentes[0]["id"]) if existentes else "CREARÍA el workflow nuevo")
        print("credencial:", cred["name"], "(se crearía)" if cred["id"] == "SIMULACRO" else "(existe)")
        print("URL: https://n8n.oacg.cl/webhook/" + PATH)
        print("Twenty + aviso a Comercial: sí")
        print("Loops:", "sí (" + loops["name"] + ")" if loops else "NO: falta la credencial «Loops API» en n8n")
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
