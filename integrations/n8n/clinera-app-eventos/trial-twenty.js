// Nodo «Trial en Twenty» (7-nov-2026). Solo con account_created: busca el negocio del lead en
// clientes.oacg.cl (por correo y, si no, por celular) y lo sube a la etapa TRIAL («Trial 🎯»).
// Si no existe, crea persona + negocio en TRIAL. Nunca baja a un CUSTOMER. Devuelve el texto del
// aviso para [Clinera] Comercial, una sola vez por cuenta (staticData `avisados`, solo en producción).
// Modo: Run Once for All Items. Errores: Continue.
const KEY = $env.TWENTY_API_KEY;
const BASE = "https://crm.oacg.cl";
if (!KEY) throw new Error("Falta TWENTY_API_KEY en el entorno de n8n");
const st = $getWorkflowStaticData("global");
st.avisados = st.avisados || {};

const api = (method, path, body) =>
  this.helpers.httpRequest({
    method, url: BASE + path, body, json: true, timeout: 15000,
    headers: { Authorization: "Bearer " + KEY, "Content-Type": "application/json" },
  });
const lista = (r, obj) => (r && r.data && r.data[obj]) || [];
const creado = (r) => { const v = Object.values((r && r.data) || {})[0]; return v && v.id ? v.id : null; };
const NO_BAJAR = new Set(["CUSTOMER", "TRIAL"]);

const out = [];
for (const it of $input.all()) {
  const b = it.json.body && typeof it.json.body === "object" ? it.json.body : it.json;
  if (String(b.event || "") !== "account_created") continue;
  const acc = String(b.account_id || b.clinic_id || "").trim();
  const email = String(b.email || "").trim().toLowerCase();
  const fono = String(b.telefono || "").replace(/[^\d+]/g, "");
  const nacional = fono.startsWith("+56") ? fono.slice(3) : fono.replace(/^\+\d{1,3}/, "");
  const nombre = String(b.nombre || "").trim();
  const clinica = String(b.clinica || "").trim();

  // 1) Persona por correo; si no, por el celular nacional exacto (una sola coincidencia).
  let persona = null;
  if (email) persona = lista(await api("GET", `/rest/people?filter=emails.primaryEmail%5Beq%5D:${encodeURIComponent(email)}&limit=2`), "people")[0] || null;
  if (!persona && nacional.length >= 8) {
    const r = lista(await api("GET", `/rest/people?filter=phones.primaryPhoneNumber%5Beq%5D:${encodeURIComponent(nacional)}&limit=3`), "people");
    if (r.length === 1) persona = r[0];
  }

  let negocio = null;
  if (persona) {
    const ops = lista(await api("GET", `/rest/opportunities?filter=pointOfContactId%5Beq%5D:${persona.id}&order_by=createdAt%5BDescNullsLast%5D&limit=5`), "opportunities");
    negocio = ops[0] || null;
  }

  let accion;
  if (negocio) {
    if (NO_BAJAR.has(negocio.stage)) accion = negocio.stage === "TRIAL" ? "ya_trial" : "es_cliente";
    else { await api("PATCH", `/rest/opportunities/${negocio.id}`, { stage: "TRIAL" }); accion = "subido_a_trial"; }
  } else {
    if (!persona) {
      const partes = nombre.split(/\s+/);
      persona = { id: creado(await api("POST", "/rest/people", {
        name: { firstName: partes[0] || nombre || email, lastName: partes.slice(1).join(" ") },
        emails: email ? { primaryEmail: email } : undefined,
        phones: nacional ? { primaryPhoneNumber: nacional, primaryPhoneCallingCode: fono.startsWith("+56") ? "+56" : (fono.match(/^\+\d{1,3}/) || ["+56"])[0] } : undefined,
      })) };
    }
    const pagado = /meta|facebook|instagram/i.test(String(b.utm_source || "")) || b.fbclid ? "META_ADS" : (b.gclid ? "GOOGLE_ADS" : "ORGANICO");
    negocio = { id: creado(await api("POST", "/rest/opportunities", {
      name: clinica || nombre || email,
      stage: "TRIAL",
      pointOfContactId: persona.id,
      canalOrigen: pagado,
      horaRegistro: new Date().toISOString(),
      correoContacto: email ? { primaryEmail: email } : undefined,
      telefonoContacto: nacional ? { primaryPhoneNumber: nacional } : undefined,
    })), stage: "TRIAL" };
    accion = "creado_en_trial";
  }

  if (accion === "es_cliente") continue;
  if (acc && st.avisados[acc]) continue;
  if (acc) st.avisados[acc] = Date.now();
  const link = negocio && negocio.id ? `\n${BASE}/object/opportunity/${negocio.id}` : "";
  out.push({ json: {
    accion,
    text: `🎯 *Trial nuevo* — creó su cuenta gratis en app.clinera.io\n${nombre || "(sin nombre)"} · ${clinica || "(sin clínica)"}\n📱 ${fono || "sin celular"} · ✉️ ${email || "sin correo"}\nLlamar ahora: es el lead más caliente del día.${link}`,
  } });
}
return out;
