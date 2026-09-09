// Code node «Mapear etapa y cifrar datos»
// Workflow vivo: W1SybZZSEZqAItIt — Clinera | Twenty etapas → Meta CAPI
//
// ESTE ARCHIVO ES el jsCode del nodo. Aplicado a n8n el 2026-09-09
// (Ricardo: «hay que tocar el n8n»). Aplicador: aplicar_w1_mapeo.py
// Reemplaza únicamente este jsCode y el nombre (sin «inactivo»).
// Antes de un PUT: guardar el JSON actual en integrations/n8n/backup/.
//
// Embudo canónico (Ricardo, 2026-09-09 tarde). Los mismos estados
// en CRM y en el pixel. SCREENING, NoContesta, Lead y SQL_Plus
// no existen. NQL es no calificado, value 0.
// Auditoría: docs/auditoria-meta-eventos-2026-09-09.md.
//
// Contratos que NO se tocan:
//   event_id      = {opportunityId}_{stage}
//   lead_id       = leadgenId entero, sin hash (Conversion Leads)
//   action_source = system_generated
//   ledger        = staticData.global.enviados, ventana 28 días
//   currency      = USD
//
// Contrato de SALIDA con los nodos que siguen. No se tocaron el 09-sep y
// la primera versión de este archivo lo rompió: W1 no mandó nada a Meta
// desde el PUT hasta este arreglo (auditoría, H8).
//   «Corresponde enviar?»        lee  $json.omitido  (true = no enviar)
//   «Enviar evento a Meta CAPI»  manda JSON.stringify($json.payload)
//   «Confirmar y auditar»        lee  ledgerKey / event_id / evento /
//                                leadgen_id / opportunity_id y escribe el
//                                ledger SOLO si Meta devuelve events_received.
// Por eso acá el ledger se consulta y NO se escribe.
//
// --- helpers puros (los tests los extraen hasta el marcador) ---
const crypto = require("crypto");

const MONEDA = "USD";
const VENTANA_MS = 28 * 86400000;
const PLAN_PURCHASE = { VORTEX: 279, ATLAS: 379, SUMMIT: 479 };

function hash(v) {
  return v
    ? crypto.createHash("sha256").update(String(v).trim().toLowerCase()).digest("hex")
    : "";
}

function norm(s) {
  return String(s == null ? "" : s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** lead_id de Conversion Leads: entero positivo, nunca hash. */
function leadIdEntero(raw) {
  if (raw == null || raw === "") return null;
  const n = Number(String(raw).trim());
  if (!Number.isFinite(n) || n <= 0 || Math.floor(n) !== n) return null;
  return n;
}

function valorPurchase(planClinera) {
  const p = String(planClinera || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
  if (p.includes("SUMMIT")) return PLAN_PURCHASE.SUMMIT;
  if (p.includes("ATLAS")) return PLAN_PURCHASE.ATLAS;
  return PLAN_PURCHASE.VORTEX;
}

/**
 * Embudo canónico. Etiqueta del tablero = evento del pixel.
 *
 *   NEW / Nuevo     → Nuevo     0
 *   PQL             → PQL       1
 *   MQL             → MQL       5
 *   MEETING / SQL   → SQL      10
 *   PROPOSAL / HOT  → HOT     100
 *   CUSTOMER        → Purchase  valor del plan (vacío → 279)
 *   NQL             → NQL       0  (no calificado)
 *
 * SCREENING, NoContesta, SQL_Plus: no emiten.
 */
function mapearEtapa(stage, opts) {
  const s = norm(stage);

  if (s === "new" || s === "nuevo") {
    return { event_name: "Nuevo", value: 0 };
  }
  if (s === "pql") {
    return { event_name: "PQL", value: 1 };
  }
  if (s === "mql") {
    return { event_name: "MQL", value: 5 };
  }
  if (s === "meeting" || s === "sql") {
    return { event_name: "SQL", value: 10 };
  }
  if (s === "proposal" || s === "hot") {
    return { event_name: "HOT", value: 100 };
  }
  if (s === "nql" || s === "no califica" || s === "nocalifica") {
    return { event_name: "NQL", value: 0 };
  }
  if (s === "customer" || s === "contrata") {
    return { event_name: "Purchase", value: valorPurchase(opts && opts.planClinera) };
  }
  if (s === "screening") {
    return { skip: true, motivo: "screening_eliminado" };
  }
  if (s === "sql+" || s === "sqlplus" || s === "sql_plus" || s === "nocontesta") {
    return { skip: true, motivo: "etapa_eliminada" };
  }
  return { skip: true, motivo: "etapa_desconocida" };
}

function deepFind(obj, claves, validar) {
  const objetivo = claves.map(norm);
  const visto = new Set();
  const cola = [obj];
  while (cola.length) {
    const cur = cola.shift();
    if (!cur || typeof cur !== "object" || visto.has(cur)) continue;
    visto.add(cur);
    for (const k of Object.keys(cur)) {
      const v = cur[k];
      if (v && typeof v === "object") {
        cola.push(v);
        continue;
      }
      if (!objetivo.includes(norm(k))) continue;
      const s = String(v == null ? "" : v).trim();
      if (!s) continue;
      if (validar && !validar(s)) continue;
      return s;
    }
  }
  return "";
}

/**
 * true si la entrada del ledger sigue dentro de la ventana de 28 días.
 * «Confirmar y auditar» guarda objetos { at, event_id, evento, fbtrace_id };
 * versiones viejas guardaron números (Date.now()). Se aceptan ambas.
 */
function ledgerVigente(entrada, ahora) {
  if (entrada == null) return false;
  let t = NaN;
  if (typeof entrada === "number") t = entrada;
  else if (typeof entrada === "string") t = Date.parse(entrada);
  else if (typeof entrada === "object" && entrada.at) t = Date.parse(entrada.at);
  if (!Number.isFinite(t)) return true; // forma desconocida: no se reenvía
  return ahora - t <= VENTANA_MS;
}
// --- fin helpers puros ---

function omitir(motivo, extra) {
  return { json: Object.assign({ omitido: true, ok: false, motivo: motivo }, extra || {}) };
}

async function procesar(wh, helpers) {
  const body = wh.body || wh;
  const registro = body.record || {};
  const objeto = norm((body.objectMetadata || {}).nameSingular || "");
  const evento = String(body.eventName || "");
  const tocados = Array.isArray(body.updatedFields) ? body.updatedFields : [];
  const fuenteCambio = String((registro.updatedBy || {}).source || "").toUpperCase();

  if (objeto && objeto !== "opportunity") {
    return omitir("objeto_no_es_oportunidad", { objeto: objeto });
  }

  if (/\.updated$/.test(evento) && tocados.length && tocados.indexOf("stage") === -1) {
    return omitir("no_cambio_la_etapa", { campos: tocados });
  }

  const etapa = String(
    registro.stage ||
      deepFind(body, ["stage", "etapa", "status", "estado", "pipelinestage", "dealstage"]) ||
      "",
  );
  const leadgenId =
    registro.leadgenId ||
    registro.leadgen_id ||
    deepFind(body, ["leadgenid", "leadgen_id", "lead_id"]);
  const planClinera = registro.planClinera || registro.plan || "";

  const mapped = mapearEtapa(etapa, { leadgenId: leadgenId, planClinera: planClinera });
  if (mapped.skip) {
    return omitir(mapped.motivo, { etapa: etapa });
  }

  // SQL / HOT / Purchase / PQL / MQL los declara una persona o el sitio.
  // NEW lo crea n8n (Sub A, wizard): hay que emitir Nuevo aunque
  // updatedBy.source = API. El resto, si lo movió una automatización,
  // no se emite — el MQL del sitio o del Meet ya cubrió ese salto.
  if (fuenteCambio === "API") {
    const etapaNorm = norm(etapa);
    if (etapaNorm !== "new" && etapaNorm !== "nuevo") {
      return omitir("etapa_movida_por_automatizacion", { etapa: etapa });
    }
  }

  const recordId = String(registro.id || deepFind(body, ["recordid", "opportunityid"]) || "");
  if (!recordId) {
    return omitir("sin_opportunity_id", { etapa: etapa });
  }

  const eventId = recordId + "_" + String(etapa);
  const ledgerKey = mapped.event_name + ":" + recordId;
  const estado = $getWorkflowStaticData("global");
  const enviados =
    estado.enviados && typeof estado.enviados === "object" ? estado.enviados : {};
  const ahora = Date.now();
  if (ledgerVigente(enviados[ledgerKey], ahora)) {
    return omitir("ya_enviado_ledger", { ledgerKey: ledgerKey, event_id: eventId });
  }

  let email = deepFind(body, ["email", "primaryemail", "emails", "correo"], function (s) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  }).toLowerCase();
  let telefonoRaw = deepFind(body, [
    "phone",
    "primaryphonenumber",
    "telefono",
    "celular",
    "whatsapp",
  ]);
  let nombre = deepFind(body, ["firstname", "nombre", "fullname"]);
  let apellido = deepFind(body, ["lastname", "apellido"]);

  const contactoId = String(registro.pointOfContactId || "");
  if (!email && contactoId) {
    try {
      const resp = await helpers.httpRequest({
        method: "GET",
        url: $env.TWENTY_URL + "/rest/people/" + contactoId,
        headers: { Authorization: "Bearer " + $env.TWENTY_API_KEY },
        json: true,
        timeout: 15000,
      });
      const p = (resp && resp.data && (resp.data.person || resp.data)) || {};
      email = String((p.emails || {}).primaryEmail || "").toLowerCase();
      const tel =
        String((p.phones || {}).primaryPhoneCallingCode || "") +
        String((p.phones || {}).primaryPhoneNumber || "");
      if (tel.replace(/\D/g, "")) telefonoRaw = tel;
      nombre = String((p.name || {}).firstName || nombre || "");
      apellido = String((p.name || {}).lastName || apellido || "");
    } catch {
      // Se sigue: abajo se decide si con lo que hay alcanza.
    }
  }

  const telefono = String(telefonoRaw || "").replace(/\D/g, "");
  const leadId = leadIdEntero(leadgenId);
  if (!leadId && !email && telefono.length < 10) {
    return omitir("sin_email_ni_telefono_ni_lead_id", { contacto: contactoId, etapa: etapa });
  }

  const userData = {};
  if (email) userData.em = [hash(email)];
  if (telefono.length >= 10) userData.ph = [hash(telefono)];
  if (nombre) userData.fn = [hash(nombre)];
  if (apellido) userData.ln = [hash(apellido)];
  if (leadId) userData.lead_id = leadId;

  const fbc = deepFind(body, ["fbc", "metafbc", "fbclid"]);
  const fbp = deepFind(body, ["fbp", "metafbp"]);
  if (fbc) userData.fbc = fbc;
  if (fbp) userData.fbp = fbp;

  const customData = {
    event_source: "crm",
    lead_event_source: "Twenty CRM",
    currency: MONEDA,
    value: mapped.value,
    lead_stage: etapa,
    opportunity_id: recordId,
  };
  if (leadId) customData.leadgen_id = leadId;

  // Lo que se manda a Meta, tal cual. «Enviar evento a Meta CAPI» hace
  // JSON.stringify($json.payload): si esta clave falta, no sale nada.
  const payload = {
    data: [
      {
        event_name: mapped.event_name,
        event_time: Math.floor(ahora / 1000),
        event_id: eventId,
        action_source: "system_generated",
        user_data: userData,
        custom_data: customData,
      },
    ],
  };

  return {
    json: {
      omitido: false,
      ok: true,
      etapa: etapa,
      evento: mapped.event_name,
      event_name: mapped.event_name,
      value: mapped.value,
      currency: MONEDA,
      event_id: eventId,
      leadgen_id: leadId,
      lead_id: leadId,
      opportunity_id: recordId,
      ledgerKey: ledgerKey,
      payload: payload,
    },
  };
}

const salida = [];
for (const item of $input.all()) {
  salida.push(await procesar(item.json || {}, this.helpers));
}
return salida;
