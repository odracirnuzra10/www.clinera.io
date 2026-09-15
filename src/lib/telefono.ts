// ============================================================================
// Teléfono por país — validación, normalización y E.164
// ----------------------------------------------------------------------------
// Fuente de las reglas de largo/patrón que usan los formularios de agenda
// (`/reserva-tu-hora`, wizard de `/agenda`). El servidor tiene su propio
// superset en `src/app/api/wizard/validation.ts` (incluye prefijos de
// DemoWizard); no importar de acá allá sin unificar primero las tres tablas
// del cliente — ver el comentario de ese archivo.
//
// Unidad: dígitos NACIONALES (sin código de país). El E.164 se arma con
// `aE164(prefix, digitos)` → "+56912345678", "+525512345678", etc.
// ============================================================================

export type PhoneRule = {
  name: string;
  len: number;
  placeholder: string;
  pattern: RegExp;
  invalidHint: string;
};

/**
 * Prefijo E.164 → regla del número local (móvil).
 *
 * | Prefijo | País        | Largo | Patrón local                         |
 * |---------|-------------|-------|--------------------------------------|
 * | +56     | Chile       | 9     | 9XXXXXXXX                            |
 * | +52     | México      | 10    | [2-9]XXXXXXXXX                       |
 * | +57     | Colombia    | 10    | 3XXXXXXXXX                           |
 * | +51     | Perú        | 9     | 9XXXXXXXX                            |
 * | +54     | Argentina   | 10    | 10 dígitos                           |
 * | +593    | Ecuador     | 9     | 9XXXXXXXX                            |
 * | +507    | Panamá      | 8     | 6XXXXXXX                             |
 * | +506    | Costa Rica  | 8     | [678]XXXXXXX                         |
 * | +595    | Paraguay    | 9     | 9[2-9]XXXXXXX                        |
 * | +598    | Uruguay     | 8     | 9XXXXXXX                             |
 * | +34     | España      | 9     | [67]XXXXXXXX                         |
 * | +1      | EE.UU.      | 10    | NANP [2-9]XXXXXXXXX                  |
 *
 * Puerto Rico también es `+1` (NANP). En el selector de reserva es una
 * opción aparte (`id: "PR"`) con patrón 787/939; el webhook igual manda
 * `celular_prefix: "+1"`. No poner `+1PR` en esta tabla: el API rechazaría
 * el prefijo y el E.164 saldría mal.
 */
export const PHONE_RULES: Record<string, PhoneRule> = {
  "+56": {
    name: "Chile",
    len: 9,
    placeholder: "9 1234 5678",
    pattern: /^9\d{8}$/,
    invalidHint: "Debe empezar con 9",
  },
  "+52": {
    name: "México",
    len: 10,
    placeholder: "55 1234 5678",
    pattern: /^[2-9]\d{9}$/,
    invalidHint: "Debe empezar con 2-9",
  },
  "+57": {
    name: "Colombia",
    len: 10,
    placeholder: "300 123 4567",
    pattern: /^3\d{9}$/,
    invalidHint: "Debe empezar con 3",
  },
  "+51": {
    name: "Perú",
    len: 9,
    placeholder: "912 345 678",
    pattern: /^9\d{8}$/,
    invalidHint: "Debe empezar con 9",
  },
  "+54": {
    name: "Argentina",
    len: 10,
    placeholder: "11 1234 5678",
    pattern: /^\d{10}$/,
    invalidHint: "Debe tener 10 dígitos",
  },
  "+593": {
    name: "Ecuador",
    len: 9,
    placeholder: "99 123 4567",
    pattern: /^9\d{8}$/,
    invalidHint: "Debe empezar con 9",
  },
  "+507": {
    name: "Panamá",
    len: 8,
    placeholder: "6123 4567",
    pattern: /^6\d{7}$/,
    invalidHint: "Debe empezar con 6",
  },
  "+506": {
    name: "Costa Rica",
    len: 8,
    placeholder: "8312 3456",
    pattern: /^[678]\d{7}$/,
    invalidHint: "Debe empezar con 6, 7 u 8",
  },
  "+598": {
    name: "Uruguay",
    len: 8,
    placeholder: "94 123 456",
    pattern: /^9\d{7}$/,
    invalidHint: "Debe empezar con 9",
  },
  "+595": {
    name: "Paraguay",
    len: 9,
    placeholder: "981 234 567",
    pattern: /^9[2-9]\d{7}$/,
    invalidHint: "Debe empezar con 92-99",
  },
  "+34": {
    name: "España",
    len: 9,
    placeholder: "612 345 678",
    pattern: /^[67]\d{8}$/,
    invalidHint: "Debe empezar con 6 o 7",
  },
  "+1": {
    name: "Estados Unidos",
    len: 10,
    placeholder: "415 555 1234",
    pattern: /^[2-9]\d{9}$/,
    invalidHint: "Código de área inválido",
  },
};

/** Puerto Rico comparte `+1` con EE.UU.; el selector lo distingue por `id`. */
const PR_RULE: PhoneRule = {
  name: "Puerto Rico",
  len: 10,
  placeholder: "787 123 4567",
  pattern: /^(787|939)\d{7}$/,
  invalidHint: "Debe empezar con 787 o 939",
};

export type PhonePrefixOption = {
  prefix: string;
  flag: string;
  label: string;
  /** Valor del <option> cuando dos países comparten prefijo (NANP +1). */
  id?: string;
};

/** Prefijos del selector de `/reserva-tu-hora` (subset de `PHONE_RULES`). */
export const RESERVA_PHONE_PREFIXES: readonly PhonePrefixOption[] = [
  { prefix: "+56", flag: "🇨🇱", label: "Chile" },
  { prefix: "+52", flag: "🇲🇽", label: "México" },
  { prefix: "+57", flag: "🇨🇴", label: "Colombia" },
  { prefix: "+51", flag: "🇵🇪", label: "Perú" },
  { prefix: "+54", flag: "🇦🇷", label: "Argentina" },
  { prefix: "+593", flag: "🇪🇨", label: "Ecuador" },
  { prefix: "+507", flag: "🇵🇦", label: "Panamá" },
  { prefix: "+506", flag: "🇨🇷", label: "Costa Rica" },
  { prefix: "+595", flag: "🇵🇾", label: "Paraguay" },
  { prefix: "+598", flag: "🇺🇾", label: "Uruguay" },
  { prefix: "+34", flag: "🇪🇸", label: "España" },
  { prefix: "+1", flag: "🇺🇸", label: "Estados Unidos" },
  { prefix: "+1", flag: "🇵🇷", label: "Puerto Rico", id: "PR" },
];

export function idOpcionTelefono(p: PhonePrefixOption): string {
  return p.id ?? p.prefix;
}

/** Prefijo E.164 de una opción del selector (`PR` → `+1`). */
export function prefixDeOpcionTelefono(
  id: string,
  opciones: readonly PhonePrefixOption[] = RESERVA_PHONE_PREFIXES,
): string {
  const opt = opciones.find((p) => idOpcionTelefono(p) === id);
  if (opt) return opt.prefix;
  if (id === "PR" || id === "US") return "+1";
  return id;
}

export function reglaOpcionTelefono(id: string): PhoneRule {
  if (id === "PR") return PR_RULE;
  return reglaTelefono(prefixDeOpcionTelefono(id));
}

/** Elige la opción del selector (PR si el local es 787/939). */
export function idOpcionReservaDesdeTelefono(crudo: string): string {
  const { prefix, phone } = separarTelefono(crudo);
  if (prefix === "+1" && /^(787|939)/.test(digitosTelefono(phone))) return "PR";
  return prefix;
}

/**
 * Prefijos del formulario «Aplicar al programa» en `/partners`.
 * México, Perú, Chile, Colombia, Uruguay, Costa Rica, Panamá.
 */
export const PARTNERS_APPLY_PHONE_PREFIXES = [
  { prefix: "+52", flag: "🇲🇽", label: "México" },
  { prefix: "+51", flag: "🇵🇪", label: "Perú" },
  { prefix: "+56", flag: "🇨🇱", label: "Chile" },
  { prefix: "+57", flag: "🇨🇴", label: "Colombia" },
  { prefix: "+598", flag: "🇺🇾", label: "Uruguay" },
  { prefix: "+506", flag: "🇨🇷", label: "Costa Rica" },
  { prefix: "+507", flag: "🇵🇦", label: "Panamá" },
] as const;


export function digitosTelefono(v: string): string {
  return String(v || "").replace(/\D/g, "");
}

export function reglaTelefono(prefix: string): PhoneRule {
  return PHONE_RULES[prefix] ?? PHONE_RULES["+56"];
}

/**
 * Si pegan `+56…` / `56…` (o el código del país seleccionado), deja solo los
 * dígitos nacionales. México a veces llega con el `1` móvil viejo (`+521…`):
 * se quita cuando sobra exactamente un dígito.
 */
export function normalizarDigitosLocales(crudo: string, prefix: string): string {
  const real = prefixDeOpcionTelefono(prefix);
  const rule = reglaOpcionTelefono(prefix);
  const cc = real.replace(/\D/g, "");
  let d = digitosTelefono(crudo);

  if (cc && d.startsWith(cc) && d.length > rule.len) {
    d = d.slice(cc.length);
  }

  // MX histórico: +52 1 + 10 dígitos locales
  if (real === "+52" && d.length === rule.len + 1 && d.startsWith("1")) {
    d = d.slice(1);
  }

  return d.slice(0, rule.len);
}

/** Formatea dígitos locales con espacios según el país (solo UX). */
export function formatearTelefono(crudo: string, prefix: string): string {
  const real = prefixDeOpcionTelefono(prefix);
  const d = normalizarDigitosLocales(crudo, prefix);

  if (real === "+56") {
    if (d.length <= 1) return d;
    if (d.length <= 5) return `${d[0]} ${d.slice(1)}`;
    return `${d[0]} ${d.slice(1, 5)} ${d.slice(5)}`;
  }
  if (real === "+34" || real === "+51" || real === "+595" || real === "+598") {
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
    return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  }
  if (real === "+507" || real === "+506") {
    if (d.length <= 4) return d;
    return `${d.slice(0, 4)} ${d.slice(4)}`;
  }
  if (real === "+593") {
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
    return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
  }
  if (real === "+57") {
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
    return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  }
  if (real === "+1") {
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
    return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  }
  // MX, AR y default: 2 + 4 + resto
  if (d.length <= 2) return d;
  if (d.length <= 6) return `${d.slice(0, 2)} ${d.slice(2)}`;
  return `${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6)}`;
}

export function telefonoLocalValido(prefix: string, digitos: string): boolean {
  const rule = prefix === "PR" ? PR_RULE : PHONE_RULES[prefixDeOpcionTelefono(prefix)];
  if (!rule) return false;
  const d = digitosTelefono(digitos);
  return d.length === rule.len && rule.pattern.test(d);
}

/**
 * Mensaje en español si el número no calza con la regla del país.
 * `null` = válido.
 */
export function mensajeErrorTelefono(prefix: string, digitos: string): string | null {
  const rule = reglaOpcionTelefono(prefix);
  const d = digitosTelefono(digitos);
  if (!d.length) {
    return `Ingresa tu WhatsApp (${rule.len} dígitos para ${rule.name})`;
  }
  if (d.length < rule.len) {
    const faltan = rule.len - d.length;
    return `Falta${faltan === 1 ? "" : "n"} ${faltan} dígito${faltan === 1 ? "" : "s"} para ${rule.name} (debe tener ${rule.len})`;
  }
  if (d.length > rule.len) {
    return `Demasiados dígitos para ${rule.name} (debe tener ${rule.len})`;
  }
  if (!rule.pattern.test(d)) {
    return `${rule.invalidHint} (${rule.name})`;
  }
  return null;
}

/** E.164: `+` + código país + dígitos nacionales, sin espacios. */
export function aE164(prefix: string, digitos: string): string {
  const real = prefixDeOpcionTelefono(prefix);
  const p = real.startsWith("+") ? real : `+${real}`;
  return `${p}${digitosTelefono(digitos)}`;
}

/**
 * Parte un teléfono E.164 en (prefijo, dígitos locales). Prueba los prefijos
 * de más largo a más corto: `+595` gana a `+59`, `+507` a `+50`.
 * Si no reconoce ninguno, deja el número completo en el campo para corregir.
 */
export function separarTelefono(
  crudo: string,
  porDefecto = "+56",
  prefijos: readonly { prefix: string }[] = RESERVA_PHONE_PREFIXES,
): { prefix: string; phone: string } {
  const limpio = String(crudo || "").replace(/[^\d+]/g, "");
  if (!limpio) return { prefix: porDefecto, phone: "" };
  const conMas = limpio.startsWith("+") ? limpio : `+${limpio}`;
  const ordenados = [...prefijos].sort((a, b) => b.prefix.length - a.prefix.length);
  for (const { prefix } of ordenados) {
    if (conMas.startsWith(prefix)) {
      const locales = normalizarDigitosLocales(conMas.slice(prefix.length), prefix);
      return { prefix, phone: formatearTelefono(locales, prefix) };
    }
  }
  return {
    prefix: porDefecto,
    phone: formatearTelefono(limpio.replace(/^\+/, ""), porDefecto),
  };
}
