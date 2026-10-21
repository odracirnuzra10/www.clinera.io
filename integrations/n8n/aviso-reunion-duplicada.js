// Nodo Code «Detectar reunión duplicada» del workflow
// «Clinera — Google Meet por profesional (Nohe / Rebe)» (id FZvyK42lkQdKWcIl).
// Cuelga de «Elegir evento» (en paralelo a «Preparar aviso Chat») y, si hay
// duplicado, alimenta «Aviso reunión duplicada» (POST a la sala [Clinera] Comercial).
// Aplicador: integrations/n8n/aplicar_aviso_reunion_duplicada.py. Guardián:
// tests/reunion-duplicada.spec.ts, que corre ESTE archivo con stubs.
//
// POR QUÉ EXISTE (Ricardo, 21-oct-2026): un lead de la campaña reserva en la web
// (reparte Rebeca/Nohelymar) y además AURA lo contacta por WhatsApp y le agenda OTRA
// reunión, casi siempre con Rebeca. Las dos citas ocupan hora y la de Nohelymar se
// pierde: en la semana del 19-oct ella tuvo 0 reuniones reales. Este nodo avisa
// cuando un mismo contacto tiene dos reuniones futuras DISTINTAS, para cancelar una.
//
// QUÉ ES «LA MISMA REUNIÓN» (no se avisa): mismo contacto + mismo instante + mismo
// profesional. El webhook de turno llega dos veces por reserva (eco de la web y de
// app.clinera.io), así que sin esto cada cita sería «duplicada» de sí misma.
//
// Contacto = mismo correo, o mismo teléfono (últimos 9 dígitos), o mismo nombre
// completo (2+ palabras). Límite conocido: una persona que llena el formulario con
// otro correo y otro teléfono no se detecta.
//
// Ledger propio en el static data del workflow (`reunionesRecientes`), que se
// reasigna ENTERO en la clave de primer nivel (el detector de cambios de n8n es un
// proxy sobre el objeto de primer nivel). Solo mira hacia adelante: no conoce las
// reservas anteriores al día en que se aplicó. Modo: Run Once for All Items.
// Errores: Continue (si falla, la reserva sigue su curso: este nodo es solo aviso).

const r = $('Normalizar Reserva').first().json || {};
if (r.esPrueba || !r.startISO) return [];

const txt = (v) => String(v == null ? '' : v).trim();
const sinAcento = (s) =>
  txt(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ');

const cli = r.cliente || {};
const email = txt(cli.email).toLowerCase();
const tel = txt(cli.telefono).replace(/\D/g, '');
const tel9 = tel.length >= 9 ? tel.slice(-9) : '';
const nombre = sinAcento(cli.nombre);
const nombreClave = nombre.split(' ').filter(Boolean).length >= 2 ? nombre : '';

// Pruebas internas del equipo: no son leads y harían ruido en la sala.
if (/@oacg\.cl$|cukyrico|prueba/i.test(email) || /prueba|ricardo oyarzun|andres ricardo/.test(nombre)) {
  return [];
}
if (!email && !tel9 && !nombreClave) return [];

const startMs = Date.parse(r.startISO);
if (!startMs) return [];
const resp = sinAcento(r.responsable);
const ahora = Date.now();
const DIA = 86400000;

const ledger = $getWorkflowStaticData('global');
const bruto = ledger.reunionesRecientes;
const guardadas = typeof bruto === 'string' ? JSON.parse(bruto)
                : (bruto && typeof bruto === 'object' ? bruto : {});

// Poda: lo que empezó hace más de un día ya no puede chocar con nada.
for (const k of Object.keys(guardadas)) {
  if (!guardadas[k] || !(guardadas[k].startMs > ahora - DIA)) delete guardadas[k];
}

const mismoContacto = (e) =>
  (email && e.email === email) || (tel9 && e.tel9 === tel9) || (nombreClave && e.nombre === nombreClave);

const previas = Object.values(guardadas).filter(mismoContacto);
const esLaMisma = (e) => e.startMs === startMs && e.resp === resp;

// Eco del mismo agendamiento: ya se vio, no hay nada nuevo que avisar.
if (previas.some(esLaMisma)) {
  ledger.reunionesRecientes = { ...guardadas };
  return [];
}

const otras = previas
  .filter((e) => !esLaMisma(e) && e.startMs > ahora)
  .sort((a, b) => a.startMs - b.startMs);

// Se anota esta reserva (tope de 400 para que el static data no crezca sin límite).
const id = new Date(startMs).toISOString() + '|' + resp + '|' + (email || tel9 || nombreClave);
guardadas[id] = {
  startMs, resp, email, tel9, nombre: nombreClave,
  origen: txt(r.origenCita), frase: txt(r.fraseHora), responsable: txt(r.responsable),
};
const claves = Object.keys(guardadas).sort((a, b) => guardadas[b].startMs - guardadas[a].startMs);
const recortadas = {};
for (const k of claves.slice(0, 400)) recortadas[k] = guardadas[k];
ledger.reunionesRecientes = { ...recortadas };

if (!otras.length) return [];

const via = (o) => (o === 'agente-ia' ? 'agente IA (WhatsApp)' : 'web');
const lineas = [
  '⚠️ *Reunión duplicada — ' + (txt(cli.nombre) || 'sin nombre') + '*',
  '_Este lead ya tenía otra reunión pendiente. Dejen una sola y avísenle al cliente; si es una reagenda, ignoren este aviso._',
  '',
  '*Nueva:* ' + (txt(r.fraseHora) || txt(r.startISO)) + ' · con ' + (txt(r.responsable) || '—') + ' · ' + via(txt(r.origenCita)),
];
for (const o of otras) {
  lineas.push('*Ya tenía:* ' + (o.frase || new Date(o.startMs).toISOString()) + ' · con ' + (o.responsable || '—') + ' · ' + via(o.origen));
}
lineas.push('');
lineas.push('*Contacto:* ' + [txt(cli.email), txt(cli.telefono)].filter(Boolean).join(' · '));

return [{ json: { textoChat: lineas.join('\n'), duplicadas: otras.length } }];
