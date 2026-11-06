// Nodo «Confirmar envío»: marca el evento como enviado solo si Meta lo recibió.
// Empareja por índice con «Decidir evento Meta» (solo los ítems con enviar=true pasan por el envío).
const st = $getWorkflowStaticData("global");
st.enviados = st.enviados || {};
const pedidos = $("Hay que enviar?").all();
return $input.all().map((r, i) => {
  const id = pedidos[i] && pedidos[i].json.id;
  const ok = Number(r.json.events_received || 0) >= 1;
  if (ok && id) st.enviados[id] = Date.now();
  return { json: { id, ok, events_received: r.json.events_received || 0, error: r.json.error ? r.json.error.message : undefined } };
});
