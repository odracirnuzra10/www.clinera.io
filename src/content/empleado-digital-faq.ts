// FAQ de /empleado-digital — alimenta el render y el JSON-LD FAQPage.
export const EMPLEADO_DIGITAL_FAQ: Array<{ q: string; a: string }> = [
  {
    q: "¿Qué es un empleado digital?",
    a: "Un agente de IA con un rol operativo asignado que ejecuta tareas reales —agenda, llama, cobra, decide—, a diferencia de un chatbot que solo responde texto. En Clinera son CAMILA (voz), AURA (WhatsApp) y LIA (orquestación).",
  },
  {
    q: "¿Cuál es la diferencia entre CAMILA, AURA y LIA?",
    a: "AURA atiende por WhatsApp 24/7 en todos los planes. CAMILA llama por teléfono para confirmar y reagendar (solo en Summit, 25 créditos/min). LIA vigila la operación en Summit: fiscaliza sin costo de créditos e informes ≈4.000 créditos/mes, y despacha a CAMILA o AURA según el historial del paciente.",
  },
  {
    q: "¿Desde qué plan puedo contratar cada una?",
    a: "AURA viene en Vortex, Atlas y Summit. CAMILA está solo en Summit. LIA está en Summit. Los precios publicados son Vortex USD 279, Atlas USD 379 y Summit USD 479 al mes.",
  },
  {
    q: "¿Cómo se contrata?",
    a: "Agenda una reunión en /agenda o activa el plan en /planes. La implementación es USD 450 pago único, cobrada con el primer mes del plan.",
  },
  {
    q: "¿Qué pasa si la IA no sabe responder?",
    a: "Deriva a un humano de tu equipo sin pelearle la conversación. El paciente no queda colgado: la memoria del caso queda en Clinera para que tu recepción retome donde quedó.",
  },
  {
    q: "¿Qué acentos tiene CAMILA?",
    a: "Cinco: chileno, colombiano, peruano, mexicano y español. El paciente escucha el acento de su mercado; eso baja la fricción en la llamada de confirmación o reagendamiento.",
  },
];
