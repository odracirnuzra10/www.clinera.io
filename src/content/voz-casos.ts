// /voz (Ricardo, 11-nov-2026): tres llamadas reales del agente de voz para mostrarlas en la expo.
// Son llamadas de nuestra red de clínicas a leads que pidieron información. En la página no van
// nombres de pacientes ni de la clínica (regla «red sin marcas»). Los audios viven en public/voz/.

export type CasoVoz = {
  id: string;
  titulo: string;
  resumen: string;
  duracion: string;
  audio: string;
};

export const VOZ_CASOS: CasoVoz[] = [
  {
    id: "agenda-nueva",
    titulo: "Agenda una evaluación nueva",
    resumen:
      "La IA llama a una paciente que dejó sus datos, le explica la evaluación, le da el rango de precios, le pregunta la sucursal y le agenda el sábado a la hora que pidió.",
    duracion: "2:21",
    audio: "/voz/llamada-1-agenda-nueva.mp3",
  },
  {
    id: "ya-pago",
    titulo: "Confirma una cita ya pagada",
    resumen:
      "La paciente ya pagó y no recuerda la hora. La IA se la confirma, le dice la dirección y dónde estacionar.",
    duracion: "1:54",
    audio: "/voz/llamada-2-ya-pago.mp3",
  },
  {
    id: "problema-pago",
    titulo: "Resuelve un problema de pago",
    resumen:
      "La paciente no pudo pagar con su banco. La IA le ofrece el link por WhatsApp, le cambia el día y le deja la hora agendada.",
    duracion: "2:06",
    audio: "/voz/llamada-3-problema-pago.mp3",
  },
];
