// Fuente única del FAQ del home: la consume la sección <Faq /> de
// home-v3/sections.tsx y el JSON-LD FAQPage de src/app/page.tsx.
export const HOME_FAQ = [
  {
    q: "¿Necesito cambiar mi número de WhatsApp?",
    a: "No. Clinera se conecta con tu número actual usando la API oficial de WhatsApp Business. Tus pacientes siguen escribiendo al mismo número de siempre.",
  },
  {
    q: "¿Cuánto demora en estar funcionando?",
    a: "El mismo día. Nuestro equipo hace el onboarding asistido: conecta tu WhatsApp, carga tu agenda y tus servicios, y AURA empieza a responder — sin frenar tu operación.",
  },
  {
    q: "¿Y si AURA no entiende algo?",
    a: "Traspasa la conversación a una persona de tu equipo al tiro: cuando detecta urgencias, reclamos o algo fuera de su alcance, deriva según las reglas que tú defines. Y se equivoca poco: en una auditoría pública sobre 42 casos reales en 3 clínicas, AURA agendó correctamente el 95,2% de los pacientes al primer intento y el 100% en máximo tres. La metodología completa está publicada en clinera.io/efectividad.",
  },
  {
    q: "¿Mis pacientes aceptarán hablar con una IA?",
    a: "Sí — la mayoría ni lo nota. AURA responde con el tono y los protocolos de tu clínica. Como cuenta la Dra. Stefani Michailiszen (Dermaclinic): «las pacientes creen que AURA es la recepcionista nueva». Y un A/B con 89 clínicas y más de 57.000 interacciones mostró que la IA con timing humano convierte el 91% de las conversaciones, frente al 79% de la respuesta instantánea tipo bot.",
  },
  {
    q: "¿Puedo cobrar la reserva?",
    a: "Sí. AURA cobra con WebPay o MercadoPago al confirmar la hora. Esto baja los no-shows hasta un 72% en promedio.",
  },
  {
    q: "¿Funciona para clínicas con varios profesionales?",
    a: "Sí. Vortex y Ecosistema incluyen hasta 10 profesionales. Si necesitas más, lo conversamos en la videollamada.",
  },
  {
    q: "¿Dónde se guardan los datos de mis pacientes?",
    a: "En Google Cloud Platform, región Santiago de Chile (southamerica-west1): los datos clínicos residen en Chile, cifrados en tránsito y en reposo. Cumplimos Ley N° 19.628 y Ley N° 21.719 de protección de datos en Chile.",
  },
];
