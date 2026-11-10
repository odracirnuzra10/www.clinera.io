// «Filtrar registro landing» — nodo Code del Wizard (A3wOPmhQjit8VswM).
// Ricardo, 10-nov-2026: cada registro de la prueba gratis (landing /prueba-gratis, /contrata o el
// modal del sitio) avisa a [Clinera] Comercial para hacer seguimiento. El aviso del wizard de
// /agenda no cambia: ese sólo se publica cuando hay demo agendada.
// Lee el cuerpo crudo del webhook. Si no es un registro o una asistencia, no devuelve nada.
const wh = $('Webhook').first().json;
const B = wh.body || wh;
const txt = (v) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim();
const etiqueta = txt(B.servicio_interes_label);
const esAsistencia = /solicita asistencia/i.test(etiqueta);
const esRegistro = /demo 7 d[ií]as/i.test(etiqueta);
if (!esAsistencia && !esRegistro) return [];

const nombre = txt(B.nombre) || 'Sin nombre';
const clinica = txt(B.nombre_clinica || B.clinica);
const fono = txt(B.telefono || B.celular);
const correo = txt(B.email);
// El plan sale de la etiqueta («Xcale $149 demo 7 días»): el campo `plan` trae un id interno viejo.
const plan = etiqueta.replace(/\s*demo 7 d[ií]as.*$/i, '');
const origen = [txt(B.lead_source), txt(B.source_path)].filter(Boolean).join(' · ');
const wa = fono.replace(/\D/g, '');

const titulo = esAsistencia
  ? '🙋 Pidió asistencia en la web'
  : '🆕 Registro en la prueba gratis';
const lineas = [
  titulo,
  `${nombre}${clinica ? ' (' + clinica + ')' : ''} completó el formulario. Hacer seguimiento.`,
  fono ? `Celular: ${fono}${wa ? ' · https://wa.me/' + wa : ''}` : '',
  correo ? `Correo: ${correo}` : '',
  !esAsistencia && plan ? `Plan elegido: ${plan}` : '',
  origen ? `Origen: ${origen}` : '',
].filter(Boolean);
return [{ json: { texto: lineas.join('\n') } }];
