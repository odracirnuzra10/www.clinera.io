// Captura y persistencia de identificadores de Meta (fbclid / _fbp / _fbc)
// para mejorar el match de eventos de conversión vía CAPI. El backend n8n
// (workflow WIZARD) lee `meta_fbc`, `meta_fbp` y `fbclid` del body del POST.
//
// Por qué sessionStorage y no solo leer cookie/URL al enviar:
//  - `?fbclid=` vive solo en la URL del primer pageview; al navegar entre
//    pasos del wizard (o tras un redirect del Pixel) se pierde.
//  - La cookie `_fbc` la setea el Pixel base de forma async y puede no estar
//    lista cuando el usuario llega al landing.
// Capturamos lo antes posible y persistimos en sessionStorage (claves
// cl_fbclid / cl_fbc / cl_fbp) para que sobrevivan la navegación dentro de
// la misma pestaña hasta el envío del formulario.

const SS_FBCLID = "cl_fbclid";
const SS_FBC = "cl_fbc";
const SS_FBP = "cl_fbp";

export type ClineraMetaIds = {
  meta_fbc: string;
  meta_fbp: string;
  fbclid: string;
};

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(
    new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"),
  );
  if (!match) return "";
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

function readSession(key: string): string {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function writeSession(key: string, value: string) {
  // No persistimos vacíos: así un valor que aún no estaba (p.ej. la cookie
  // _fbp que el Pixel setea tarde) se captura recién cuando aparece.
  if (typeof window === "undefined" || !value) return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // private browsing / storage deshabilitado — el fallback a cookie/URL
    // sigue funcionando dentro del mismo pageview.
  }
}

// Resuelve los 3 identificadores: primero sessionStorage (sobrevive la
// navegación del wizard), luego cookie/URL. Reconstruye `fbc` desde `fbclid`
// (formato fb.1.<timestamp_ms>.<fbclid>) si no existe la cookie `_fbc`.
// Persiste lo que encuentre. Devuelve "" en cada campo si no hay nada.
export function getClineraMetaIds(): ClineraMetaIds {
  if (typeof window === "undefined") {
    return { meta_fbc: "", meta_fbp: "", fbclid: "" };
  }

  const qs = new URLSearchParams(window.location.search);
  const fbclid = readSession(SS_FBCLID) || qs.get("fbclid") || "";
  const fbp = readSession(SS_FBP) || readCookie("_fbp") || "";
  const fbc =
    readSession(SS_FBC) ||
    readCookie("_fbc") ||
    (fbclid ? `fb.1.${Date.now()}.${fbclid}` : "");

  writeSession(SS_FBCLID, fbclid);
  writeSession(SS_FBC, fbc);
  writeSession(SS_FBP, fbp);

  return { meta_fbc: fbc, meta_fbp: fbp, fbclid };
}

// Alias semántico para invocar en el primer pageview (layout). Dispara la
// captura + persistencia; normalmente se ignora el valor de retorno.
export function captureClineraMetaIds(): ClineraMetaIds {
  return getClineraMetaIds();
}
