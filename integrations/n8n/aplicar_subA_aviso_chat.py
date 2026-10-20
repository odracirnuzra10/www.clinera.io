#!/usr/bin/env python3
"""Rehabilita el aviso de Google Chat de los leads de Instant Form (Sub A).

Por qué existe (Ricardo, 20-oct-2026): desde el 25-sep el nodo «Notify Google
Chat» de Sub A (`YmauqyDqrZNKIYlg`) era un Code que devolvía el input sin
publicar nada (la sala «Reuniones comerciales» se retiró el 22-sep y el aviso no
se movió). Los leads de formulario de Meta llegaban al CRM sin que nadie se
enterara; el caso que lo destapó fue David Rodríguez (20-oct).

Qué hace:
- Reemplaza ese nodo por un HTTP Request a la misma sala del Wizard
  (`OACG TECH | Wizard`, `A3wOPmhQjit8VswM`, nodo «Notify Google Chat»). La URL
  del webhook se copia en vivo desde el Wizard: la llave no se versiona acá.
- Lo cuelga de «Twenty - Crear Lead» (no de «Prepare Lead Data») para que el
  aviso traiga el encargado y los links a Twenty y Baserow.
- Respaldo del workflow antes del PUT (en `N8N_BACKUP_DIR`; trae llaves, no commitear).

Uso: python3 aplicar_subA_aviso_chat.py            (simulacro)
     python3 aplicar_subA_aviso_chat.py --aplicar
"""
import json
import os
import pathlib
import sys
import urllib.request
from datetime import datetime, timezone

N8N = "https://n8n.oacg.cl/api/v1"
SUB_A = "YmauqyDqrZNKIYlg"
WIZARD = "A3wOPmhQjit8VswM"
NODO = "Notify Google Chat"
DESDE = "Twenty - Crear Lead"

# El texto se arma entero adentro y sale por JSON.stringify: un nombre con
# comillas no rompe el body (misma regla que el aviso del Wizard).
JSON_BODY = r"""={{ JSON.stringify({ text: (() => {
const L = $('Prepare Lead Data').first().json;
const R = $json || {};
const tw = R.twenty || {};
const paises = { CL: 'Chile', MX: 'México', PE: 'Perú', CO: 'Colombia', AR: 'Argentina', EC: 'Ecuador', UY: 'Uruguay', CR: 'Costa Rica', PA: 'Panamá', BO: 'Bolivia', PY: 'Paraguay', DO: 'Rep. Dominicana', GT: 'Guatemala', US: 'EE. UU.', ES: 'España' };
const val = (v) => (v && typeof v === 'object') ? (v.value || '') : (v || '');
const red = { fb: 'Facebook', ig: 'Instagram' }[L.platform] || L.platform || '';
const tel = L.phoneRaw || (L.phone ? '+' + L.phone : '');
const lineas = [
  '🆕 *Lead de formulario Meta — ' + (L.fullName || 'sin nombre') + '*',
  '_Aún no agenda: hay que contactarlo._',
  '',
  '*Origen:* 🟪 Meta Ads' + (red ? ' · ' + red : '') + (L.campaignId ? ' · campaña ' + L.campaignId : ''),
  L.adId ? '*Anuncio:* ' + L.adId : '',
  '*Teléfono:* ' + (tel || '—') + (L.country ? ' · ' + (paises[L.country] || L.country) : ''),
  '*Email:* ' + (L.emailReal || L.email || '—'),
  L.clinicName ? '*Clínica:* ' + L.clinicName : '',
  L.tipoClinica ? '*Tipo:* ' + L.tipoClinica : '',
  L.situacionActual ? '*Situación:* ' + L.situacionActual : '',
  val(R['Encargado']) ? '👩‍⚕️ *Encargado:* ' + val(R['Encargado']) : '',
  '',
  tw.opportunityId ? '🔗 https://clientes.oacg.cl/object/opportunity/' + tw.opportunityId : '',
  R.id ? '🔗 https://core.oacg.cl/database/41/table/152/row/' + R.id : '',
];
return lineas.filter((l, i) => l !== '' || (i > 0 && lineas[i - 1] !== '')).join('\n').trim();
})() }) }}"""


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
    wiz = api("GET", f"/workflows/{WIZARD}")
    url = next(n["parameters"]["url"] for n in wiz["nodes"] if n["name"] == NODO)
    assert url.startswith("https://chat.googleapis.com/v1/spaces/"), "URL del Wizard inesperada"

    wf = api("GET", f"/workflows/{SUB_A}")
    viejo = next(n for n in wf["nodes"] if n["name"] == NODO)
    if viejo["type"] == "n8n-nodes-base.httpRequest" and viejo["parameters"].get("jsonBody") == JSON_BODY:
        print("Ya estaba aplicado.")
        return

    nuevo = {
        "id": viejo["id"],
        "name": NODO,
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [1332, 576],
        "onError": "continueRegularOutput",
        "parameters": {
            "method": "POST",
            "url": url,
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": JSON_BODY,
            "options": {},
        },
    }
    wf["nodes"] = [nuevo if n["name"] == NODO else n for n in wf["nodes"]]

    con = wf["connections"]
    # Sale de «Prepare Lead Data» y cuelga de «Twenty - Crear Lead».
    for salida in con.get("Prepare Lead Data", {}).get("main", []):
        salida[:] = [c for c in salida if c["node"] != NODO]
    con[DESDE] = {"main": [[{"node": NODO, "type": "main", "index": 0}]]}

    print(f"Nodo «{NODO}»: {viejo['type']} → httpRequest, colgado de «{DESDE}».")
    if not aplicar:
        print("Simulacro. Usa --aplicar para escribir en n8n.")
        return

    # Sub A lleva llaves en sus headers (Clinera, Baserow): el respaldo va fuera
    # del repo si se pasa N8N_BACKUP_DIR; si no, a backup/ y NO se commitea.
    backup = pathlib.Path(os.environ.get("N8N_BACKUP_DIR") or pathlib.Path(__file__).parent / "backup")
    backup.mkdir(exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    original = api("GET", f"/workflows/{SUB_A}")
    (backup / f"subA-{SUB_A}-{stamp}.json").write_text(json.dumps(original, ensure_ascii=False, indent=1))

    cuerpo = {
        "name": wf["name"],
        "nodes": wf["nodes"],
        "connections": con,
        "settings": {"executionOrder": wf.get("settings", {}).get("executionOrder", "v1")},
    }
    r = api("PUT", f"/workflows/{SUB_A}", cuerpo)
    print("Aplicado. versionId:", r.get("versionId"), "active:", r.get("active"))


if __name__ == "__main__":
    main()
