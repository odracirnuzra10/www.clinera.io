// Code node «Mapear etapa y cifrar datos»
// Workflow vivo: W1SybZZSEZqAItIt — Clinera | Twenty etapas → Meta CAPI
//
// ESTE ARCHIVO ES el jsCode que se pega en ese nodo. No aplicar a n8n
// hasta el OK explícito de Ricardo en el chat. El aplicador reemplaza
// únicamente este jsCode y el nombre del workflow (sacar «inactivo»).
// Antes de un PUT: guardar el JSON actual en integrations/n8n/backup/.
//
// Embudo canónico (Ricardo, 2026-09-09 tarde). Los mismos seis estados
// en CRM y en el pixel. SCREENING, NQL, NoContesta, Lead y SQL_Plus
// no existen. Auditoría: docs/auditoria-meta-eventos-2026-09-09.md.
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
 * Embudo canónico. Etiqueta del tablero = evento del pixel.
 *
 *   NEW / Nuevo     → Nuevo     0
 *   PQL             → PQL       1
 *   MQL             → MQL       5
 *   MEETING / SQL   → SQL      10
 *   PROPOSAL / HOT  → HOT     100
 *   CUSTOMER        → Purchase  valor del plan (vacío → 279)
 *
 * SCREENING, NQL, NoContesta, SQL_Plus: no emiten.
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
  if (s === "customer" || s === "contrata") {
    return { event_name: "Purchase", value: valorPurchase(opts && opts.planClinera) };
  }
  if (s === "screening") {
    return { skip: true, motivo: "screening_eliminado" };
  }
  if (s === "nql") {
    return { skip: true, motivo: "nql_eliminado" };
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

// SQL / HOT / Purchase / PQL / MQL los declara una persona o el sitio.
// NEW lo crea n8n (Sub A, wizard): hay que emitir Nuevo aunque
// updatedBy.source = API. El resto, si lo movió una automatización,
// no se emite — el MQL del sitio o del Meet ya cubrió ese salto.
if (fuenteCambio === "API") {
  const etapaNorm = norm(etapa);
  if (etapaNorm !== "new" && etapaNorm !== "nuevo") {
    return [{ json: { ok: false, motivo: "etapa_movida_por_automatizacion", etapa: etapa } }];
  }
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
  } catch {
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
