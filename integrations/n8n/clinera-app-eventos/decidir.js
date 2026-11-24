// OACG | Clinera app → Meta (Trial y Uso real). Nodo «Decidir evento Meta».
// Recibe los avisos de app.clinera.io (account_created, whatsapp_connected,
// first_conversation, subscription_started) y decide qué mandar al dataset
// «Clinera Software» (2251201709002818):
//   account_created                         → StartTrial («Trial») US$ 12 (una vez por cuenta)
//   tutorial_completed                      → Tutorial («Tutorial») US$ 15 (una vez por cuenta; Ricardo, 16-nov-2026)
//   whatsapp_connected                      → UsoReal («Uso real») US$ 20 (una vez; si se conoce el alta, dentro de los 7 días)
//   first_conversation / whatsapp_first_message_received → sólo se anota (desde el 15-nov ya no hace falta para Uso real)
//   subscription_started                    → nada: el Purchase ya lo manda Stripe
// Lo enviado se marca en «Confirmar envío», recién cuando Meta dice events_received ≥ 1.
const crypto = require("crypto");
const st = $getWorkflowStaticData("global");
st.cuentas = st.cuentas || {};
st.enviados = st.enviados || {};

const DIAS7 = 7 * 864e5;
// Embudo de 5 eventos (Ricardo, 15-nov-2026): Lead 3 · Videollamada 5 · Trial 10 · Uso real 20 · Contrata.
// Tutorial de la maqueta del trial US$ 15 (Ricardo, 16-nov-2026), entre Trial y Uso real.
const VALOR_USD = { StartTrial: 12, Tutorial: 15, UsoReal: 20 }; // Trial 12 (Ricardo, 2026-11-22; antes 10)
const PRUEBA = 30 * 864e5;
const sha = (v) => crypto.createHash("sha256").update(v).digest("hex");
const hEmail = (v) => (v ? sha(String(v).trim().toLowerCase()) : undefined);
const hFono = (v) => {
  const d = String(v || "").replace(/\D/g, "");
  return d ? sha(d) : undefined;
};
const CAMPOS = ["email", "telefono", "nombre", "clinica", "plan", "lead_event_id", "fbp", "fbc", "fbclid", "gclid",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

// Limpieza: cuentas de más de 30 días ya no pueden dar Trial ni Uso real.
const ahora = Date.now();
for (const [k, c] of Object.entries(st.cuentas)) if (ahora - (c.visto || 0) > PRUEBA) delete st.cuentas[k];

const out = [];
for (const it of $input.all()) {
  const b = it.json.body && typeof it.json.body === "object" ? it.json.body : it.json;
  const ev = String(b.event || "").trim();
  const acc = String(b.account_id || b.clinic_id || "").trim();
  if (!ev || !acc) { out.push({ json: { enviar: false, omitido: "sin_event_o_account_id", ev } }); continue; }
  const c = (st.cuentas[acc] = st.cuentas[acc] || {});
  const t = Date.parse(b.occurred_at) || ahora;
  c.visto = ahora;
  for (const k of CAMPOS) if (b[k]) c[k] = String(b[k]);

  const eventos = [];
  if (ev === "account_created") {
    if (!c.creada) c.creada = t;
    eventos.push(["StartTrial", "trial_" + acc, c.creada]);
  } else if (ev === "tutorial_completed") {
    if (!c.tutorial) c.tutorial = t;
    eventos.push(["Tutorial", "tutorial_" + acc, c.tutorial]);
  } else if (ev === "whatsapp_connected") {
    if (!c.wa) c.wa = t;
  } else if (ev === "first_conversation" || ev === "whatsapp_first_message_received") {
    if (!c.conv) c.conv = t;
  } else if (ev === "subscription_started") {
    c.suscrita = t;
    out.push({ json: { enviar: false, omitido: "purchase_lo_manda_stripe", ev, acc } });
    continue;
  } else {
    out.push({ json: { enviar: false, omitido: "evento_desconocido", ev, acc } });
    continue;
  }
  // Uso real = conectó la API de WhatsApp (Ricardo, 15-nov-2026). Ya no exige la primera conversación.
  if (c.wa && (!c.creada || c.wa - c.creada <= DIAS7)) {
    eventos.push(["UsoReal", "uso_real_" + acc, c.wa]);
  }
  if (!eventos.length) { out.push({ json: { enviar: false, omitido: "esperando_mas_datos", ev, acc } }); continue; }

  for (const [nombre, id, ts] of eventos) {
    if (st.enviados[id]) { out.push({ json: { enviar: false, omitido: "ya_enviado", id } }); continue; }
    const fbc = c.fbc || (c.fbclid ? `fb.1.${ts}.${c.fbclid}` : undefined);
    const ud = { external_id: [sha(acc)] };
    if (hEmail(c.email)) ud.em = [hEmail(c.email)];
    if (hFono(c.telefono)) ud.ph = [hFono(c.telefono)];
    if (c.fbp) ud.fbp = c.fbp;
    if (fbc) ud.fbc = fbc;
    const cd = {};
    if (VALOR_USD[nombre]) { cd.value = VALOR_USD[nombre]; cd.currency = "USD"; }
    for (const k of ["plan", "lead_event_id", "utm_source", "utm_medium", "utm_campaign", "utm_content"]) if (c[k]) cd[k] = c[k];
    out.push({
      json: {
        enviar: true,
        id,
        evento: nombre,
        payload: {
          data: [{
            event_name: nombre,
            event_time: Math.floor(Math.min(ts, ahora) / 1000),
            event_id: id,
            action_source: "website",
            event_source_url: "https://www.clinera.io/contrata",
            user_data: ud,
            custom_data: cd,
          }],
        },
      },
    });
  }
}
return out.length ? out : [{ json: { enviar: false, omitido: "vacio" } }];
