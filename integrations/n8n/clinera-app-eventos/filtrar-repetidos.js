// «Filtrar repetidos» (Ricardo, 24-nov-2026). app.clinera.io puede reenviar el mismo aviso.
// Llave: event_id si viene; si no, event + account_id. Lo visto se guarda 30 días en staticData
// (n8n sólo lo guarda en ejecuciones de producción). Lo repetido no sigue a Meta, Twenty, Loops ni Clinera.
const st = $getWorkflowStaticData("global");
st.vistosApp = st.vistosApp || {};
const ahora = Date.now();
for (const [k, t] of Object.entries(st.vistosApp)) if (ahora - t > 30 * 864e5) delete st.vistosApp[k];
const out = [];
for (const it of $input.all()) {
  const b = it.json.body && typeof it.json.body === "object" ? it.json.body : it.json;
  const ev = String(b.event || "").trim();
  const acc = String(b.account_id || b.clinic_id || "").trim();
  const clave = String(b.event_id || "").trim() || (ev && acc ? ev + ":" + acc : "");
  if (clave && st.vistosApp[clave]) continue;
  if (clave) st.vistosApp[clave] = ahora;
  out.push(it);
}
return out;
