// /go: guarda UTM y click ids hasta el registro. El gclid ya lo guarda
// <GclidCapture /> (cookie) y el fbclid metaIds.ts (sessionStorage); acá se
// suman los utm_* y se junta todo en un solo objeto para pasarlo al registro.

const KEY = "cl_go_attr";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type GoAttribution = Partial<Record<(typeof UTM_KEYS)[number] | "fbclid" | "gclid", string>>;

export function captureGoAttribution(search: string): GoAttribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(search);
  const found: GoAttribution = {};
  for (const k of [...UTM_KEYS, "fbclid", "gclid"] as const) {
    const v = params.get(k);
    if (v) found[k] = v.slice(0, 200);
  }
  try {
    // Los valores nuevos pisan a los viejos; los que no vienen se conservan.
    const merged = { ...readGoAttribution(), ...found };
    if (Object.keys(merged).length) window.sessionStorage.setItem(KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return found;
  }
}

export function readGoAttribution(): GoAttribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GoAttribution) : {};
  } catch {
    return {};
  }
}
