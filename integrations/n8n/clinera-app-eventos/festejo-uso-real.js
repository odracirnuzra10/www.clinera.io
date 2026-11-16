// Nodo Code «Festejo uso real» (Ricardo, 16-nov-2026). Cuelga del webhook de app.clinera.io,
// en paralelo al resto. Cuando una cuenta conecta su WhatsApp («Uso real», el paso que más
// predice el pago) publica un festejo en Team 2027. Una vez por cuenta. Lo enviado se anota en
// staticData, que n8n sólo guarda en ejecuciones de producción (una prueba manual no lo marca).
// Modo: Run Once for All Items.
function festejo(b, st, ahora) {
  if (String(b.event || "") !== "whatsapp_connected") return null;
  const acc = String(b.account_id || b.clinic_id || "").trim();
  const clave = acc || String(b.email || "").trim().toLowerCase();
  if (!clave) return null;
  st.festejados = st.festejados || {};
  if (st.festejados[clave]) return null;
  st.festejados[clave] = ahora;
  const cuenta = (st.cuentas || {})[acc] || {};
  const nombre = String(b.nombre || cuenta.nombre || "").trim() || "Un cliente";
  const clinica = String(b.clinica || cuenta.clinica || "").trim();
  const plan = String(b.plan || cuenta.plan || "").trim();
  const tel = String(b.telefono || cuenta.telefono || "").trim();
  let dias = "";
  if (cuenta.creada) {
    const d = Math.max(0, Math.floor((ahora - cuenta.creada) / 864e5));
    dias = d === 0 ? " el mismo día que creó su cuenta" : ` ${d} día${d === 1 ? "" : "s"} después de crear su cuenta`;
  }
  const lineas = [
    "🎉🎉 *¡USO REAL!* 🎉🎉",
    `*${nombre}*${clinica ? " · " + clinica : ""} conectó su WhatsApp a Clinera${dias}.`,
    "La IA ya está atendiendo a sus pacientes. 🚀",
  ];
  const datos = [plan ? "Plan " + plan : "", tel ? "📱 " + tel : ""].filter(Boolean).join(" · ");
  if (datos) lineas.push(datos);
  lineas.push("Siguiente paso: que vea sus primeras citas agendadas y elija plan. 💪");
  return { text: lineas.join("\n") };
}
// --- fin helpers puros ---

const st = $getWorkflowStaticData("global");
const out = [];
for (const it of $input.all()) {
  const b = it.json.body && typeof it.json.body === "object" ? it.json.body : it.json;
  const f = festejo(b, st, Date.now());
  if (f) out.push({ json: f });
}
return out;
