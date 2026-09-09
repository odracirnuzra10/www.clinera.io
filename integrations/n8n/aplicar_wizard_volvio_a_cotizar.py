#!/usr/bin/env python3
"""Wizard A3wOPmhQjit8VswM: etiqueta VOLVIO_A_COTIZAR + nota «Volvió a cotizar».

Pedido de Ricardo (09-sep-2026): cuando alguien completa /agenda y ya
existía como lead, el negocio se reetiqueta «Volvió a cotizar» (opción
VOLVIO_A_COTIZAR del multi-select `etiquetas`, ya creada en Twenty) y la
nota de la columna dice lo mismo. La etapa NO se toca (decisión de
Ricardo: solo etiqueta + nota; aparece en «Leads del día» por la hora de
registro nueva, que el Wizard ya refrescaba).

Toca sólo el jsCode del nodo «Twenty - Crear Lead». Simulacro por defecto;
--aplicar hace el PUT. Requiere N8N_URL + N8N_API_KEY. Antes del PUT,
guardá el JSON del workflow fuera del repo: trae tokens en las URLs de los
nodos (Google Chat, Clinera, GA4), no se commitea.

La fuente canónica del Wizard vive en el repo `baserow` (sales/n8n/):
después de aplicar, hay que replicar el cambio allá.

    python3 integrations/n8n/aplicar_wizard_volvio_a_cotizar.py           # simulacro
    python3 integrations/n8n/aplicar_wizard_volvio_a_cotizar.py --aplicar
"""
import json, os, sys, urllib.request

WID = "A3wOPmhQjit8VswM"
NODO = "Twenty - Crear Lead"
BASE = os.environ["N8N_URL"].rstrip("/") + "/api/v1"
KEY = os.environ["N8N_API_KEY"]


def api(method, path, body=None):
    req = urllib.request.Request(
        BASE + path,
        data=None if body is None else json.dumps(body).encode(),
        method=method,
        headers={"X-N8N-API-KEY": KEY, "Content-Type": "application/json", "Accept": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            raw = r.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raise SystemExit(f"{method} {path} -> {e.code}: {e.read().decode()[:600]}")


VIEJO_REFRESCO = """        if (String(d.booking_status || '').trim().toLowerCase() !== 'confirmed') {
          refresco.horaRegistro = new Date().toISOString();
          refresco.notas = '🔁 Ya había cotizado';
        }
"""
NUEVO_REFRESCO = """        if (String(d.booking_status || '').trim().toLowerCase() !== 'confirmed') {
          // Volvió a cotizar (Ricardo, 09-sep-2026): etiqueta nueva sin pisar
          // las que tenía, nota en la columna, y la etapa se queda como está.
          // El booking_confirmed del mismo lead entra acá un minuto después
          // del contact: por eso vive dentro de este guard.
          const etiquetasPrevias = Array.isArray(abierta.etiquetas) ? abierta.etiquetas : [];
          refresco.etiquetas = etiquetasPrevias.includes('VOLVIO_A_COTIZAR')
            ? etiquetasPrevias
            : etiquetasPrevias.concat('VOLVIO_A_COTIZAR');
          refresco.horaRegistro = new Date().toISOString();
          refresco.notas = '🔁 Volvió a cotizar';
        }
"""
VIEJO_ALTA = """            await api('PATCH', '/rest/opportunities/' + resultado.twenty.opportunityId, {
              notas: '🔁 Ya había cotizado',
            });
"""
NUEVO_ALTA = """            await api('PATCH', '/rest/opportunities/' + resultado.twenty.opportunityId, {
              notas: '🔁 Volvió a cotizar',
              etiquetas: ['VOLVIO_A_COTIZAR'],
            });
"""
REEMPLAZOS = [
    (VIEJO_REFRESCO, NUEVO_REFRESCO, 1),
    (VIEJO_ALTA, NUEVO_ALTA, 1),
    ("title: '🔁 Ya había cotizado',", "title: '🔁 Volvió a cotizar',", 2),
    ("'**Ya había cotizado** · volvió a enviar el formulario.\\n'", "'**Volvió a cotizar** · envió el formulario de nuevo.\\n'", 2),
]


def main():
    aplicar = "--aplicar" in sys.argv
    w = api("GET", f"/workflows/{WID}")
    nodo = next(n for n in w["nodes"] if n["name"] == NODO)
    code = nodo["parameters"]["jsCode"]
    nuevo = code
    for viejo, reemplazo, veces in REEMPLAZOS:
        n = nuevo.count(viejo)
        if n != veces:
            raise SystemExit(f"esperaba {veces} de {viejo[:50]!r}, hay {n}")
        nuevo = nuevo.replace(viejo, reemplazo)
    print("workflow:", w["name"], "| active:", w["active"])
    print("jsCode bytes:", len(code), "->", len(nuevo))
    print("queda 'Ya había cotizado':", nuevo.count("Ya había cotizado"))
    print("VOLVIO_A_COTIZAR apariciones:", nuevo.count("VOLVIO_A_COTIZAR"))
    if not aplicar:
        print("simulacro: sin PUT")
        return 0
    nodo["parameters"]["jsCode"] = nuevo
    body = {"name": w["name"], "nodes": w["nodes"], "connections": w["connections"], "settings": w.get("settings") or {}}
    if "staticData" in w:
        body["staticData"] = w["staticData"]
    api("PUT", f"/workflows/{WID}", body)
    d = api("GET", f"/workflows/{WID}")
    c2 = next(n for n in d["nodes"] if n["name"] == NODO)["parameters"]["jsCode"]
    print("ok jsCode aplicado:", c2 == nuevo)
    print("ok nodos:", len(d["nodes"]) == len(w["nodes"]), "| ok connections:", d["connections"] == w["connections"])
    if not d.get("active") and w.get("active"):
        api("POST", f"/workflows/{WID}/activate")
        d = api("GET", f"/workflows/{WID}")
    print("ok activo:", bool(d.get("active")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
