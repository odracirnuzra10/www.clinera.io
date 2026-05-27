// Persistencia de identificadores de Google Ads (gclid / gbraid / wbraid)
// para offline conversions. Capturado en el primer pageview de la sesión
// y propagado a Cal.com, webhooks n8n y Stripe Checkout.
//
// TTL: 90 días (window por defecto de Google Ads).

export type StoredAttribution = {
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  landing_page: string | null;
  referrer: string | null;
  captured_at: string; // ISO
};

const STORAGE_KEY = "_clinera_gclid";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // 90 días

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;
  // `.clinera.io` solo sirve en producción; en localhost se cae al default (host actual).
  const domainAttr =
    host === "clinera.io" || host.endsWith(".clinera.io")
      ? "; domain=.clinera.io"
      : "";
  const secureAttr = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${COOKIE_MAX_AGE_SECONDS}; path=/${domainAttr}${secureAttr}; samesite=lax`;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"),
  );
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

// Lee storage SIN fallback a URL — interno, evita recursión.
function readStoredOnly(): StoredAttribution | null {
  if (typeof window === "undefined") return null;

  const fromCookie = readCookie(STORAGE_KEY);
  if (fromCookie) {
    try {
      return JSON.parse(fromCookie) as StoredAttribution;
    } catch {
      // cookie corrupta — caemos a localStorage
    }
  }

  try {
    const fromLs = window.localStorage.getItem(STORAGE_KEY);
    if (fromLs) return JSON.parse(fromLs) as StoredAttribution;
  } catch {
    // sin acceso a storage
  }

  return null;
}

// Lee URL actual y, si trae gclid/gbraid/wbraid, persiste.
// No sobreescribe si ya hay un identificador almacenado (first-touch wins,
// alineado con la ventana de Google Ads).
export function captureGclid(): StoredAttribution | null {
  if (typeof window === "undefined") return null;

  const existing = readStoredOnly();
  if (existing?.gclid || existing?.gbraid || existing?.wbraid) {
    return existing;
  }

  const qs = new URLSearchParams(window.location.search);
  const gclid = qs.get("gclid");
  const gbraid = qs.get("gbraid");
  const wbraid = qs.get("wbraid");

  if (!gclid && !gbraid && !wbraid) return null;

  const data: StoredAttribution = {
    gclid: gclid || null,
    gbraid: gbraid || null,
    wbraid: wbraid || null,
    landing_page: window.location.pathname + window.location.search,
    referrer: document.referrer || null,
    captured_at: new Date().toISOString(),
  };

  const serialized = JSON.stringify(data);
  setCookie(STORAGE_KEY, serialized);
  try {
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // localStorage puede fallar en private browsing — el cookie alcanza.
  }

  return data;
}

// Lee primero cookie (compartida entre subdominios), luego localStorage.
// Si no hay nada almacenado pero la URL actual trae gclid/gbraid/wbraid,
// los captura on-the-fly. Esto cubre el caso en que un componente cliente
// (StepCalCom, etc.) corre su useEffect antes que GclidCapture en layout.
export function getStoredGclid(): StoredAttribution | null {
  if (typeof window === "undefined") return null;
  const stored = readStoredOnly();
  if (stored) return stored;
  return captureGclid();
}

// Devuelve el identificador primario para client_reference_id de Stripe
// y para usar como GCLID en la API offline. Prefiere gclid > gbraid > wbraid.
export function getPrimaryAdClickId(): string | null {
  const stored = getStoredGclid();
  if (!stored) return null;
  return stored.gclid || stored.gbraid || stored.wbraid || null;
}

// Añade client_reference_id a un Stripe Payment Link.
// Stripe limita client_reference_id a 200 caracteres alphanumeric + "_-".
// GCLIDs son ~70-100 chars con caracteres compatibles; los sanitizamos
// igual por seguridad.
export function withStripeAttribution(stripeUrl: string): string {
  const id = getPrimaryAdClickId();
  if (!id) return stripeUrl;
  const sanitized = id.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 200);
  if (!sanitized) return stripeUrl;
  try {
    const u = new URL(stripeUrl);
    if (!u.searchParams.has("client_reference_id")) {
      u.searchParams.set("client_reference_id", sanitized);
    }
    return u.toString();
  } catch {
    return stripeUrl;
  }
}

// Construye el calLink de Cal.com con metadata embebida.
// Cal.com expone los parámetros `metadata[key]` a través de la URL y los
// guarda en la `booking.metadata` que llega al webhook.
export function buildCalLinkWithAttribution(baseCalLink: string): string {
  const stored = getStoredGclid();
  if (!stored) return baseCalLink;

  const append: [string, string][] = [];
  if (stored.gclid) append.push(["metadata[gclid]", stored.gclid]);
  if (stored.gbraid) append.push(["metadata[gbraid]", stored.gbraid]);
  if (stored.wbraid) append.push(["metadata[wbraid]", stored.wbraid]);
  if (stored.landing_page)
    append.push(["metadata[landing_page]", stored.landing_page]);
  if (stored.captured_at)
    append.push(["metadata[gclid_captured_at]", stored.captured_at]);

  if (!append.length) return baseCalLink;

  const [path, existingQs] = baseCalLink.split("?");
  const params = new URLSearchParams(existingQs || "");
  append.forEach(([k, v]) => params.set(k, v));
  return `${path}?${params.toString()}`;
}

// Payload listo para enchufar en el body de webhooks (n8n WIZARD, SUSCRIPCION).
// Devuelve siempre todos los campos en null si no hay captura — los nodos
// downstream pueden detectarlo con un IF "tiene gclid?".
export function getAttributionPayload(): {
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  ad_landing_page: string | null;
  ad_referrer: string | null;
  ad_captured_at: string | null;
} {
  const stored = getStoredGclid();
  return {
    gclid: stored?.gclid ?? null,
    gbraid: stored?.gbraid ?? null,
    wbraid: stored?.wbraid ?? null,
    ad_landing_page: stored?.landing_page ?? null,
    ad_referrer: stored?.referrer ?? null,
    ad_captured_at: stored?.captured_at ?? null,
  };
}
