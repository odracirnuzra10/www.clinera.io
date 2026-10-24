// ============================================================================
// Wizard — revalidación server-side de email y teléfono
// ----------------------------------------------------------------------------
// El navegador ya valida (VentasLanding.tsx, ReunionLanding.tsx,
// DemoWizard.tsx), pero cada uno con su propia tabla, y esa validación se
// salta con un curl directo — hasta ahora el único filtro del lado servidor
// en todo el pipeline era "el email no está vacío" (hallazgo #2 de
// auditoria-leads-clinera.md, PR #170).
//
// La tabla de teléfono de abajo es la UNIÓN de las reglas de los 3
// formularios, que hoy NO son idénticas entre sí (divergencia real, no un
// error de tipeo): VentasLanding/ReunionLanding.tsx tienen un PHONE_RULES con
// patrón por país para 10 prefijos; DemoWizard.tsx tiene su propio
// PHONE_PREFIXES, sin patrón (solo largo), y agrega +57/+598 que las otras
// dos no tienen. Rechazar acá con una tabla más chica que cualquiera de las 3
// tumbaría leads reales — por eso este es el superset, no la copia de una
// sola. Si algún día se unifican las 3 tablas del cliente, esta puede pasar a
// importar de esa fuente única en vez de mantener la suya.
// ============================================================================

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type PhoneRule = { len: number; pattern?: RegExp };

export const PHONE_RULES: Record<string, PhoneRule> = {
  "+56": { len: 9, pattern: /^9\d{8}$/ },
  "+52": { len: 10, pattern: /^[2-9]\d{9}$/ },
  "+54": { len: 10, pattern: /^\d{10}$/ },
  "+507": { len: 8, pattern: /^6\d{7}$/ },
  "+506": { len: 8, pattern: /^[678]\d{7}$/ },
  "+595": { len: 9, pattern: /^9[2-9]\d{7}$/ },
  "+34": { len: 9, pattern: /^[67]\d{8}$/ },
  "+51": { len: 9, pattern: /^9\d{8}$/ },
  "+593": { len: 9, pattern: /^9\d{8}$/ },
  // NANP: EE.UU. y Puerto Rico. El patrón viejo (solo 787/939) rechazaba
  // un lead de Estados Unidos que el selector de /reserva-tu-hora ya acepta.
  "+1": { len: 10, pattern: /^[2-9]\d{9}$/ },
  // Solo en DemoWizard.tsx, que no valida por patrón — se respeta ese mismo
  // criterio (solo largo) para no rechazar leads que su propio cliente acepta.
  "+57": { len: 10 },
  "+598": { len: 8 },
};

export function emailValido(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

/**
 * Un prefijo fuera de la tabla falla cerrado: ningún formulario real lo
 * ofrece (los tres son `<select>` acotados a su propia lista), así que sólo
 * llegaría por un envío directo — y ahí la regla es rechazar, no adivinar.
 */
export function telefonoValido(prefix: string, digits: string): boolean {
  const regla = PHONE_RULES[prefix];
  if (!regla) return false;
  if (digits.length !== regla.len) return false;
  return regla.pattern ? regla.pattern.test(digits) : true;
}

/**
 * Revalida el payload crudo del wizard. Email y teléfono son opcionales acá
 * porque el paso 2 (`lead_stage: "size_captured"`) todavía no los pide — ver
 * AGENTS.md, "El wizard manda VARIOS webhooks por lead". Si vienen, tienen
 * que ser válidos; si no vienen, no es un error de esa etapa.
 *
 * Los nombres de campo se leen tolerando las dos convenciones que ya usan los
 * 3 formularios (`celular_prefix`/`celular_digits` vs. `telefono_prefijo`/
 * `telefono`) — el propio nodo `Prepare Sales Lead Data` de n8n ya hace este
 * mismo `||` entre ambas, así que replicarlo acá no es inventar un contrato
 * nuevo.
 */
export function validarWizard(data: Record<string, unknown>): string[] {
  const errores: string[] = [];

  const email = typeof data.email === "string" ? data.email.trim() : "";
  if (email && !emailValido(email)) {
    errores.push("Email inválido.");
  }

  const prefix =
    (typeof data.celular_prefix === "string" && data.celular_prefix) ||
    (typeof data.telefono_prefijo === "string" && data.telefono_prefijo) ||
    "";
  const digitsRaw =
    (typeof data.celular_digits === "string" && data.celular_digits) ||
    (typeof data.telefono === "string" && data.telefono) ||
    "";
  const digits = digitsRaw.replace(/\D/g, "");

  if ((prefix || digits) && !telefonoValido(prefix, digits)) {
    errores.push("Teléfono inválido para el país declarado.");
  }

  return errores;
}
