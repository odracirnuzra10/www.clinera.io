/*
 * Mensajes programados del conector MCP «Google Chat Ricardo».
 *
 * Este bloque se antepone a cada nodo Code de los workflows nuevos
 * (aplicar_programados.py lo inyecta). Corre dentro de n8n, donde `DateTime`
 * es Luxon global; en tests/gchat-programados.spec.ts se evalúa con vm.
 * Las funciones de error son copia de las del conector original para que
 * los mensajes suenen igual en todas las tools.
 */
const TZ = 'America/Santiago';
const CORREO_PROPIO = 'ricardo@oacg.cl'; // pragma: allowlist secret (es el correo público de Ricardo, no una clave)
const NOMBRE_CRED = 'Google Chat - Ricardo (OAuth)';
const ESTADOS = ['pendiente', 'enviando', 'enviado', 'error', 'cancelado'];
/* Reintentos ante 429/5xx/sin respuesta: el 1.º intento + 3 reintentos, con estas esperas. */
const MAX_REINTENTOS = 3;
const ESPERA_REINTENTO_MIN = [1, 2, 4];
/* Un «enviando» más viejo que esto es una ejecución que murió a mitad de camino. */
const ENVIANDO_ATASCADO_MIN = 10;

function fechaCL(iso) {
  if (!iso) return '';
  const d = DateTime.fromISO(String(iso), { setZone: true }).setZone(TZ);
  return d.isValid ? d.toFormat('yyyy-LL-dd HH:mm') : String(iso);
}
function fechaLargaCL(iso) {
  if (!iso) return '';
  const d = DateTime.fromISO(String(iso), { setZone: true }).setZone(TZ).setLocale('es');
  return d.isValid ? d.toFormat("cccc d 'de' LLLL yyyy, HH:mm") + ' (hora Chile)' : String(iso);
}
function statusDe(r) {
  const s = Number(r && (r.statusCode !== undefined ? r.statusCode : r.status));
  return Number.isFinite(s) ? s : 0;
}
/* 0 = no hubo respuesta HTTP (credencial sin token, red): también es error. */
function esError(status) { return status === 0 || status >= 400; }
function detalleGoogle(r) {
  const b = r && r.body;
  const m = b && b.error && (b.error.message || b.error.status);
  return m ? ' Google dijo: «' + String(m).slice(0, 200) + '».' : '';
}
function mensajeError(status, r, contexto) {
  const d = detalleGoogle(r);
  if (status === 401 || status === 403) {
    return 'Google rechazó la credencial (HTTP ' + status + '): revisa que «' + NOMBRE_CRED +
      '» esté conectada con la cuenta de Ricardo y tenga los scopes de Chat y directory.readonly.' + d;
  }
  if (status === 404) return (contexto || 'El espacio') + ' no existe o Ricardo no es miembro (HTTP 404).' + d;
  if (status === 429) return 'Google limitó las llamadas (HTTP 429). Espera un minuto y vuelve a intentar.' + d;
  if (status === 0) {
    const e = (r && r.error) || {};
    const msg = String(e.message || e.description || (typeof r.error === 'string' ? r.error : '') || '');
    if (/access token|sign without|credential|unauthorized|invalid_grant|refresh/i.test(msg)) {
      return 'n8n no pudo autenticar con Google: la credencial «' + NOMBRE_CRED +
        '» no está conectada o venció. Ábrela en n8n, revisa Client ID / Client Secret y vuelve a hacer «Sign in with Google» con la cuenta de Ricardo. (' + msg.slice(0, 160) + ')';
    }
    return 'No hubo respuesta de Google Chat' + (msg ? ': ' + msg.slice(0, 200) : '.');
  }
  return 'Google Chat respondió HTTP ' + status + '.' + d;
}
function falla(error) { return [{ json: { ok: false, error: String(error) } }]; }
function exito(data) { return [{ json: { ok: true, data } }]; }
function idEspacio(v) {
  v = String(v || '').trim();
  if (!v) return '';
  if (/^spaces\/[A-Za-z0-9_-]+$/.test(v)) return v;
  if (/^[A-Za-z0-9_-]+$/.test(v)) return 'spaces/' + v;
  return '';
}

/*
 * fecha_hora de programar_mensaje. Con offset o Z se respeta; sin zona se
 * interpreta en hora de Chile (Luxon aplica el horario de verano vigente ese
 * día, nunca un offset fijo). Exige hora: «2026-09-23» a secas es ambiguo.
 */
function parsearFechaEnvio(valor, ahora) {
  const s = String(valor || '').trim().replace(' ', 'T');
  if (!s) return { error: 'Falta fecha_hora (ISO 8601, ej. 2026-09-23T09:00:00-03:00).' };
  if (!/T\d{2}:\d{2}/.test(s)) return { error: 'fecha_hora debe incluir la hora (ej. 2026-09-23T09:00:00-03:00).' };
  const conZona = /T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)$/i.test(s);
  const d = conZona ? DateTime.fromISO(s, { setZone: true }) : DateTime.fromISO(s, { zone: TZ });
  if (!d.isValid) return { error: 'No entendí la fecha «' + valor + '». Usa ISO 8601, ej. 2026-09-23T09:00:00-03:00.' };
  const ref = ahora || DateTime.utc();
  if (d.toMillis() <= ref.toMillis()) {
    return { error: 'La fecha ' + fechaCL(d.toISO()) + ' (hora Chile) ya pasó; ahora son las ' + fechaCL(ref.toISO()) + '.' };
  }
  return {
    utc: d.toUTC().toISO(),
    chile: fechaCL(d.toISO()),
    chileLarga: fechaLargaCL(d.toISO()),
    zonaAsumida: !conZona,
  };
}

function validarMensaje(t) {
  const espacio = idEspacio(t.espacio);
  if (!espacio) return { error: 'Falta el id del espacio (formato spaces/XXXX). Usa listar_espacios o abrir_dm para obtenerlo.' };
  const texto = String(t.texto || '').trim();
  if (!texto) return { error: 'El texto del mensaje está vacío.' };
  if (texto.length > 4000) return { error: 'El mensaje supera los 4.000 caracteres que acepta Google Chat.' };
  const hilo = String(t.hilo || '').trim();
  if (hilo && !/^spaces\/[A-Za-z0-9_-]+\/threads\/[A-Za-z0-9_-]+$/.test(hilo)) return { error: 'El hilo debe tener el formato spaces/XXX/threads/YYY (es el campo hilo de leer_mensajes).' };
  if (hilo && hilo.indexOf(espacio + '/') !== 0) return { error: 'El hilo no pertenece al espacio indicado.' };
  return { espacio, texto, hilo };
}

/* Nombre legible del destino. Para DMs y grupos sin displayName usa los miembros. */
function nombreDestino(espacio, miembros, mapa) {
  if (espacio.nombre) return espacio.nombre;
  mapa = mapa || {};
  miembros = miembros || [];
  const nombreDe = m => m.nombre || (mapa[m.id] && mapa[m.id].nombre) || m.id;
  const esYo = m => String((mapa[m.id] && mapa[m.id].correo) || '').toLowerCase() === CORREO_PROPIO;
  const otros = miembros.filter(m => !esYo(m));
  if (otros.length) return otros.map(nombreDe).join(' · ');
  if (miembros.length) return nombreDe(miembros[0]) + ' (DM contigo mismo)';
  return espacio.tipo === 'DIRECT_MESSAGE' ? 'DM sin resolver' : 'Grupo sin nombre';
}

/* Id idempotente para Google: reenviar con el mismo requestId devuelve el mensaje ya creado. */
function requestIdPara(tablaId, filaId) {
  return 'gchat-prog-' + tablaId + '-' + filaId;
}

function textoError(res) {
  if (!res) return 'El envío no devolvió resultado.';
  const e = res.error;
  if (e && typeof e === 'object') return String(e.message || e.description || JSON.stringify(e)).slice(0, 500);
  return String(e || 'El envío no devolvió resultado.').slice(0, 500);
}

/*
 * Qué hacer con la fila según lo que devolvió enviar_mensaje.
 * `intentos` es el número del intento recién hecho (1 = primer envío).
 * Credencial rota → error sin reintento (reintentar cada minuto no la arregla).
 * 429 / 5xx / sin respuesta → hasta MAX_REINTENTOS reintentos con espera.
 * Resto (404, 400…) → error definitivo.
 */
function clasificarEnvio(res, intentos, ahora) {
  const ref = ahora || DateTime.utc();
  if (res && res.ok === true) {
    const d = res.data || {};
    return { estado: 'enviado', enviadoEn: ref.toUTC().toISO(), mensajeId: String(d.id || ''), link: String(d.link || ''), error: '' };
  }
  const err = textoError(res);
  const credencial = /HTTP (401|403)\b|no pudo autenticar|rechazó la credencial/i.test(err);
  const sinVeredicto = !res || res.ok !== false;
  const temporal = !credencial && (sinVeredicto || /HTTP (429|5\d\d)\b|No hubo respuesta de Google Chat|ETIMEDOUT|ECONNRESET|ECONNREFUSED|socket hang up|timeout/i.test(err));
  if (credencial) return { estado: 'error', error: 'Credencial (no se reintenta): ' + err };
  if (temporal && intentos <= MAX_REINTENTOS) {
    const min = ESPERA_REINTENTO_MIN[Math.max(0, intentos - 1)] || ESPERA_REINTENTO_MIN[ESPERA_REINTENTO_MIN.length - 1];
    return {
      estado: 'pendiente',
      proximoIntento: ref.plus({ minutes: min }).toUTC().toISO(),
      error: 'Intento ' + intentos + ' falló; se reintenta en ' + min + ' min: ' + err,
    };
  }
  if (temporal) return { estado: 'error', error: 'Falló tras ' + MAX_REINTENTOS + ' reintentos: ' + err };
  return { estado: 'error', error: err };
}

function formatoProgramado(r) {
  const out = {
    id: r.id,
    destino: r.nombreEspacio || r.espacio,
    espacio: r.espacio,
    tipoEspacio: r.tipoEspacio || '',
    fecha: fechaCL(r.fechaEnvio),
    fechaIso: r.fechaEnvio || '',
    estado: r.estado,
    texto: r.texto,
  };
  if (r.hilo) out.hilo = r.hilo;
  if (Number(r.intentos) > 0) out.intentos = Number(r.intentos);
  if (r.estado === 'pendiente' && r.proximoIntento && r.proximoIntento !== r.fechaEnvio) out.proximoIntento = fechaCL(r.proximoIntento);
  if (r.enviadoEn) out.enviadoEn = fechaCL(r.enviadoEn);
  if (r.mensajeId) out.mensajeId = r.mensajeId;
  if (r.link) out.link = r.link;
  if (r.canceladoEn) out.canceladoEn = fechaCL(r.canceladoEn);
  if (r.error) out.error = r.error;
  return out;
}
// --- fin helpers ---
