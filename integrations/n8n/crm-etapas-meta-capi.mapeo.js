// Code node «Mapear etapa y cifrar datos»
// Workflow vivo: W1SybZZSEZqAItIt — Clinera | Twenty etapas → Meta CAPI
//
// ESTE ARCHIVO ES el jsCode del nodo. Aplicador: aplicar_w1_mapeo.py
// Reemplaza únicamente este jsCode y el nombre (sin «inactivo»).
// Antes de un PUT: guardar el JSON actual en integrations/n8n/backup/.
//
// Mapa (Ricardo, 2026-09-12). Cinco etapas, currency USD. Cualquier
// otra etapa no emite: se loguea el valor recibido y se omite.
//
//   NEW       → Lead      1
//   MQL       → MQL      10
//   MEETING   → SQL     100
//   CUSTOMER  → Purchase  planClinera (VORTEX 279 / ATLAS 379 / SUMMIT 479 / vacío 279)
//   NQL       → NQL       0
//
// Contratos que NO se tocan:
//   event_id      = {opportunityId}_{stage}
//   lead_id       = leadgenId entero, sin hash
//   action_source = system_generated
//   ledger        = staticData.global.enviados, ventana 28 días
//   currency      = USD
//
// Contrato de SALIDA con los nodos que siguen.
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

/** lead_id: entero positivo, nunca hash. */
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
 * Cinco etapas. Nada más.
 *
 *   NEW      → Lead      1
 *   MQL      → MQL      10
 *   MEETING  → SQL     100
 *   CUSTOMER → Purchase  planClinera (vacío → 279)
 *   NQL      → NQL       0
 */
function mapearEtapa(stage, opts) {
  const s = norm(stage);
  if (s === "new") {
    return { event_name: "Lead", value: 1 };
  }
  if (s === "mql") {
    return { event_name: "MQL", value: 10 };
  }
  if (s === "meeting") {
    return { event_name: "SQL", value: 100 };
  }
  if (s === "customer") {
    return { event_name: "Purchase", value: valorPurchase(opts && opts.planClinera) };
  }
  if (s === "nql") {
    return { event_name: "NQL", value: 0 };
  }
  return { skip: true, motivo: "etapa_no_mapeada", etapa: stage };
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
  if (!Number.isFinite(t)) return true;
  return ahora - t <= VENTANA_MS;
}
// --- fin helpers puros ---

function omitir(motivo, extra) {
  return { json: Object.assign({ omitido: true, ok: false, motivo: motivo }, extra || {}) };
}

/**
 * Un ítem: omitido, o el evento de la etapa actual. No se inventan
 * eventos de etapas que no vinieron en el webhook.
 */
async function procesar(wh, helpers) {
  const body = wh.body || wh;
  const registro = body.record || {};
  const objeto = norm((body.objectMetadata || {}).nameSingular || "");
  const evento = String(body.eventName || "");
  const tocados = Array.isArray(body.updatedFields) ? body.updatedFields : [];
  const fuenteCambio = String((registro.updatedBy || {}).source || "").toUpperCase();

  if (objeto && objeto !== "opportunity") {
    return [omitir("objeto_no_es_oportunidad", { objeto: objeto })];
  }

  if (/\.updated$/.test(evento) && tocados.length && tocados.indexOf("stage") === -1) {
    return [omitir("no_cambio_la_etapa", { campos: tocados })];
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
    console.log("W1 etapa no mapeada:", etapa);
    return [omitir(mapped.motivo, { etapa: etapa })];
  }

  // NEW lo crea n8n (Sub A, wizard): hay que emitir Lead aunque
  // updatedBy.source = API. El resto, si lo movió una automatización,
  // no se emite.
  if (fuenteCambio === "API") {
    if (norm(etapa) !== "new") {
      return [omitir("etapa_movida_por_automatizacion", { etapa: etapa })];
    }
  }

  const recordId = String(registro.id || deepFind(body, ["recordid", "opportunityid"]) || "");
  if (!recordId) {
    return [omitir("sin_opportunity_id", { etapa: etapa })];
  }

  const eventId = recordId + "_" + String(etapa);
  const ledgerKey = mapped.event_name + ":" + recordId;
  const estado = $getWorkflowStaticData("global");
  const enviados =
    estado.enviados && typeof estado.enviados === "object" ? estado.enviados : {};
  const ahora = Date.now();
  if (ledgerVigente(enviados[ledgerKey], ahora)) {
    return [omitir("ya_enviado_ledger", { ledgerKey: ledgerKey, event_id: eventId })];
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
    return [omitir("sin_email_ni_telefono_ni_lead_id", { contacto: contactoId, etapa: etapa })];
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

  const ahoraSeg = Math.floor(ahora / 1000);
  const customData = {
    event_source: "crm",
    lead_event_source: "Twenty CRM",
    currency: MONEDA,
    value: mapped.value,
    lead_stage: String(etapa),
    opportunity_id: recordId,
  };
  if (leadId) customData.leadgen_id = leadId;
  const payload = {
    data: [
      {
        event_name: mapped.event_name,
        event_time: ahoraSeg,
        event_id: eventId,
        action_source: "system_generated",
        user_data: userData,
        custom_data: customData,
      },
    ],
  };
  return [
    {
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
    },
  ];
}

const salida = [];
const entradas = $input.all();
for (let idx = 0; idx < entradas.length; idx++) {
  const items = await procesar(entradas[idx].json || {}, this.helpers);
  for (const it of items) {
    it.pairedItem = { item: idx };
    salida.push(it);
  }
}
return salida;
