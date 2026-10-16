const GA_MEASUREMENT_ID = "G-FB5YV66KKJ";

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const dl = (window.dataLayer = window.dataLayer || []);
  dl.push({ event, ...params });
}

/**
 * Evento del Meta Pixel. El pixel lo carga la etiqueta de Meta de GTM, de forma
 * asíncrona, así que en páginas que disparan un evento al cargar (/go, /go/exito)
 * `window.fbq` puede no existir todavía: se espera hasta ~8 s en vez de perder el
 * evento. Si nunca aparece (bloqueador, GTM caído), se descarta sin error.
 */
export function trackPixel(
  event: string,
  params: Record<string, unknown> = {},
  eventId?: string,
) {
  if (typeof window === "undefined") return;
  const send = () => {
    if (!window.fbq) return false;
    if (eventId) window.fbq("track", event, params, { eventID: eventId });
    else window.fbq("track", event, params);
    return true;
  };
  if (send()) return;
  let tries = 0;
  const timer = window.setInterval(() => {
    if (send() || ++tries >= 50) window.clearInterval(timer);
  }, 160);
}

export async function getGaClientId(): Promise<string> {
  if (typeof window === "undefined") return "";
  const gtag = window.gtag;
  if (!gtag) return "";
  return new Promise((resolve) => {
    let done = false;
    const finish = (v: string) => {
      if (done) return;
      done = true;
      resolve(v);
    };
    gtag("get", GA_MEASUREMENT_ID, "client_id", (id: string) =>
      finish(id || ""),
    );
    setTimeout(() => finish(""), 800);
  });
}

export async function getGaSessionId(): Promise<string> {
  if (typeof window === "undefined") return String(Date.now());
  const gtag = window.gtag;
  if (!gtag) return String(Date.now());
  return new Promise((resolve) => {
    let done = false;
    const finish = (v: string) => {
      if (done) return;
      done = true;
      resolve(v);
    };
    gtag("get", GA_MEASUREMENT_ID, "session_id", (id: string) =>
      finish(id || String(Date.now())),
    );
    setTimeout(() => finish(String(Date.now())), 800);
  });
}

export function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(
    new RegExp("(^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]+)"),
  );
  return m ? decodeURIComponent(m[2]) : "";
}

export function getFbc() {
  return getCookie("_fbc");
}
export function getFbp() {
  return getCookie("_fbp");
}

// Payload uniforme para postear al webhook de n8n
// (workflow OACG TECH → LEAD `yloHdEaI3qT6WGEF`).
export async function buildLeadPayload(extra: Record<string, unknown> = {}) {
  const [ga_client_id, ga_session_id] = await Promise.all([
    getGaClientId(),
    getGaSessionId(),
  ]);
  return {
    ga_client_id,
    ga_session_id,
    meta_fbc: getFbc(),
    meta_fbp: getFbp(),
    landing_url: typeof window !== "undefined" ? window.location.href : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
    event_id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    created_at: new Date().toISOString(),
    ...extra,
  };
}
