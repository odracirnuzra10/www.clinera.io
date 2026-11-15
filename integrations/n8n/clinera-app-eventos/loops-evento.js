// Nodo «Armar evento Loops» (7-nov-2026). Cada aviso de app.clinera.io se manda a Loops como evento,
// con las propiedades del contacto. Los correos de la serie se filtran por esas propiedades
// (whatsappConectado, primeraConversacion), así un correo de «conecta tu WhatsApp» no le llega a
// quien ya lo conectó. Loops crea el contacto si no existe.
// Embudo de 5 eventos (Ricardo, 15-nov-2026): lead · videollamada · trial · uso_real · contrata.
// Desde la app salen sólo «trial» y «uso_real». «contrata» lo manda Stripe (7jgtp669q8pWJKm6) y
// first_conversation ya no es un evento: si se mandara, Loops contaría pasos que el embudo no tiene.
const NOMBRES = {
  account_created: "trial",
  whatsapp_connected: "uso_real",
};
const out = [];
for (const it of $input.all()) {
  const b = it.json.body && typeof it.json.body === "object" ? it.json.body : it.json;
  const ev = NOMBRES[String(b.event || "")];
  const email = String(b.email || "").trim().toLowerCase();
  if (!ev || !email) continue;
  const nombre = String(b.nombre || "").trim();
  const props = { source: "app.clinera.io", userGroup: ev };
  if (nombre) props.firstName = nombre.split(/\s+/)[0];
  if (nombre) props.lastName = nombre.split(/\s+/).slice(1).join(" ");
  if (b.clinica) props.clinica = String(b.clinica);
  if (b.telefono) props.telefono = String(b.telefono);
  if (b.plan) props.plan = String(b.plan);
  if (b.account_id) props.accountId = String(b.account_id);
  if (ev === "trial") props.trialInicio = new Date(Date.parse(b.occurred_at) || Date.now()).toISOString();
  if (ev === "uso_real") props.whatsappConectado = true;
  out.push({ json: { body: { email, eventName: ev, ...props } } });
}
return out;
