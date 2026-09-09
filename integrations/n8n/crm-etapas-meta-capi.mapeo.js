// Code node «Mapear etapa y cifrar datos»
// Workflow vivo: W1SybZZSEZqAItIt — Clinera | Twenty etapas → Meta CAPI
//
// ESTE ARCHIVO ES el jsCode que se pega en ese nodo. No aplicar a n8n
// hasta el OK explícito de Ricardo en el chat. El aplicador reemplaza
// únicamente este jsCode y el nombre del workflow (sacar «inactivo»).
// Antes de un PUT: guardar el JSON actual en integrations/n8n/backup/.
//
// Por qué existe: desde el 2026-09-07 21:17Z el mapeo vivo cruzaba las
// etiquetas. PQL («No contesta») salía como MQL US$ 10, y las campañas
// Conversion Leads (QUALITY_LEAD desde el 7-sep) aprendían de eso.
// Auditoría: docs/auditoria-meta-eventos-2026-09-09.md (H1).
//
// Contratos que NO se tocan:
//   event_id      = {opportunityId}_{stage}
//   lead_id       = leadgenId entero, sin hash (Conversion Leads)
//   action_source = system_generated
//   ledger        = staticData.global.enviados, ventana 28 días
//   currency      = USD
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
 * Mapeo corregido (2026-09-09). Las etiquetas del tablero NO son el valor
 * interno: SCREENING se lee «MQL»; PQL se lee «PQL · No contesta».
 *
 *   NEW        → no emite (Sub A ya mandó Lead US$ 5)
 *   SCREENING  → MQL 10 solo con leadgenId (el lead web ya emitió MQL)
 *   PQL        → NoContesta 0 (señal negativa, NUNCA MQL)
 *   NQL        → NQL 0
 *   MEETING    → SQL 100
 *   PROPOSAL   → HOT 300
 *   CUSTOMER   → Purchase según planClinera (vacío → 279)
 */
function mapearEtapa(stage, opts) {
  const s = norm(stage);
  const leadgenId = opts && opts.leadgenId;

  if (s === "new" || s === "nuevo") {
    return { skip: true, motivo: "new_no_emite" };
  }
  if (s === "screening") {
    if (!leadIdEntero(leadgenId)) {
      return { skip: true, motivo: "screening_sin_leadgen" };
    }
    return { event_name: "MQL", value: 10 };
  }
  if (s === "pql") {
    return { event_name: "NoContesta", value: 0 };
  }
  if (s === "nql") {
    return { event_name: "NQL", value: 0 };
  }
  if (s === "meeting" || s === "sql") {
    return { event_name: "SQL", value: 100 };
  }
  if (s === "proposal" || s === "hot" || s === "sql+" || s === "sqlplus" || s === "sql_plus") {
    return { event_name: "HOT", value: 300 };
  }
  if (s === "customer" || s === "contrata") {
    return { event_name: "Purchase", value: valorPurchase(opts && opts.planClinera) };
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
// --- fin helpers puros ---

const wh = $json || {};
const body = wh.body || wh;
const registro = body.record || {};
const objeto = norm((body.objectMetadata || {}).nameSingular || "");
const evento = String(body.eventName || "");
const tocados = Array.isArray(body.updatedFields) ? body.updatedFields : [];
const fuenteCambio = String((registro.updatedBy || {}).source || "").toUpperCase();

if (objeto && objeto !== "opportunity") {
  return [{ json: { ok: false, motivo: "objeto_no_es_oportunidad", objeto: objeto } }];
}

if (/\.updated$/.test(evento) && tocados.length && tocados.indexOf("stage") === -1) {
  return [{ json: { ok: false, motivo: "no_cambio_la_etapa", campos: tocados } }];
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
  return [{ json: { ok: false, motivo: mapped.motivo, etapa: etapa } }];
}

// SQL / HOT / Purchase los declara una persona. SCREENING/PQL/NQL también
// los mueve el closer en el tablero; si la etapa la escribió n8n
// (updatedBy.source = API) no se emite — el MQL del sitio o del Meet
// ya cubrió ese salto y un segundo event_id {oppId}_SCREENING duplicaría.
if (fuenteCambio === "API") {
  return [{ json: { ok: false, motivo: "etapa_movida_por_automatizacion", etapa: etapa } }];
}

const recordId = String(registro.id || deepFind(body, ["recordid", "opportunityid"]) || "");
if (!recordId) {
  return [{ json: { ok: false, motivo: "sin_opportunity_id", etapa: etapa } }];
}

const eventId = recordId + "_" + String(etapa);
const estado = $getWorkflowStaticData("global");
estado.enviados = estado.enviados && typeof estado.enviados === "object" ? estado.enviados : {};
const ahora = Date.now();
for (const k of Object.keys(estado.enviados)) {
  if (ahora - estado.enviados[k] > VENTANA_MS) delete estado.enviados[k];
}
if (estado.enviados[eventId]) {
  return [{ json: { ok: false, motivo: "evento_ya_enviado", event_id: eventId } }];
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
    const resp = await this.helpers.httpRequest({
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
  } catch (e) {
    // Se sigue: abajo se decide si con lo que hay alcanza.
  }
}

const telefono = String(telefonoRaw || "").replace(/\D/g, "");
const leadId = leadIdEntero(leadgenId);
if (!leadId && !email && telefono.length < 10) {
  return [
    {
      json: {
        ok: false,
        motivo: "sin_email_ni_telefono_ni_lead_id",
        contacto: contactoId,
        etapa: etapa,
      },
    },
  ];
}

estado.enviados = Object.assign({}, estado.enviados);
estado.enviados[eventId] = ahora;

const eventTime = Math.floor(Date.now() / 1000);
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

return [
  {
    json: {
      ok: true,
      event_name: mapped.event_name,
      value: mapped.value,
      currency: MONEDA,
      event_id: eventId,
      event_time: eventTime,
      action_source: "system_generated",
      etapa: etapa,
      opportunity_id: recordId,
      lead_id: leadId,
      user_data: userData,
      custom_data: { value: mapped.value, currency: MONEDA },
      em: userData.em ? userData.em[0] : "",
      ph: userData.ph ? userData.ph[0] : "",
      fn: userData.fn ? userData.fn[0] : "",
      ln: userData.ln ? userData.ln[0] : "",
    },
  },
];
