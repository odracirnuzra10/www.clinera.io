// ============================================================================
// Identificador tributario de la clínica (Ricardo, 26-oct-2026)
// ----------------------------------------------------------------------------
// /agenda exige sitio web. La clínica que todavía no lo tiene (p. ej. una que
// está por abrir) puede pasar con el identificador tributario de la EMPRESA:
// una clínica real ya tiene su sociedad constituida. Aquí se valida al instante,
// sin red: formato, dígito verificador cuando el país lo tiene, y que sea de una
// empresa y no de una persona cuando el número lo deja ver.
//
// Lo que NO se sabe aquí es si la empresa es del rubro salud: eso queda para el
// closer (o una consulta posterior a la base de cada país).
// ============================================================================

export type PaisTributario = "CL" | "MX" | "CO" | "PE" | "AR" | "EC" | "PA" | "CR" | "PY" | "ES";

export const PAISES_TRIBUTARIOS: { pais: PaisTributario; prefijo: string; nombre: string; doc: string; ejemplo: string }[] = [
  { pais: "CL", prefijo: "+56", nombre: "Chile", doc: "RUT de la empresa", ejemplo: "76.123.456-7" },
  { pais: "MX", prefijo: "+52", nombre: "México", doc: "RFC de la empresa (persona moral)", ejemplo: "ABC120315XY9" },
  { pais: "CO", prefijo: "+57", nombre: "Colombia", doc: "NIT de la empresa", ejemplo: "900123456-7" },
  { pais: "PE", prefijo: "+51", nombre: "Perú", doc: "RUC de la empresa", ejemplo: "20123456789" },
  { pais: "AR", prefijo: "+54", nombre: "Argentina", doc: "CUIT de la empresa", ejemplo: "30-71234567-1" },
  { pais: "EC", prefijo: "+593", nombre: "Ecuador", doc: "RUC de la empresa", ejemplo: "1791234567001" },
  { pais: "PA", prefijo: "+507", nombre: "Panamá", doc: "RUC de la empresa", ejemplo: "155123456-2-2020" },
  { pais: "CR", prefijo: "+506", nombre: "Costa Rica", doc: "Cédula jurídica", ejemplo: "3-101-123456" },
  { pais: "PY", prefijo: "+595", nombre: "Paraguay", doc: "RUC de la empresa", ejemplo: "80012345-6" },
  { pais: "ES", prefijo: "+34", nombre: "España", doc: "CIF / NIF de la sociedad", ejemplo: "B12345678" },
];

export const paisDePrefijoTributario = (prefijo: string): PaisTributario =>
  PAISES_TRIBUTARIOS.find((p) => p.prefijo === prefijo)?.pais ?? "CL";

export type ResultadoTributario =
  | { ok: true; normalizado: string }
  | { ok: false; motivo: "formato" | "verificador" | "persona" };

export const MENSAJE_TRIBUTARIO: Record<"formato" | "verificador" | "persona", string> = {
  formato: "Revisa el número: no tiene el formato del documento de una empresa.",
  verificador: "Ese número no es válido. Revisa que esté bien escrito.",
  persona: "Ese número es de una persona. Necesitamos el de la empresa de la clínica.",
};

const soloDig = (s: string) => s.replace(/\D/g, "");
const sumaPesos = (digitos: string, pesos: number[]) =>
  digitos.split("").reduce((acc, d, i) => acc + Number(d) * pesos[i], 0);

function chile(v: string): ResultadoTributario {
  const limpio = v.toUpperCase().replace(/[^0-9K]/g, "");
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) return { ok: false, motivo: "formato" };
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  let suma = 0;
  let mult = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const r = 11 - (suma % 11);
  const esperado = r === 11 ? "0" : r === 10 ? "K" : String(r);
  if (dv !== esperado) return { ok: false, motivo: "verificador" };
  // Las personas jurídicas parten en 50 millones; los RUT de persona están muy por debajo.
  if (Number(cuerpo) < 50_000_000) return { ok: false, motivo: "persona" };
  return { ok: true, normalizado: `${Number(cuerpo).toLocaleString("es-CL")}-${dv}` };
}

function mexico(v: string): ResultadoTributario {
  const limpio = v.toUpperCase().replace(/[\s-]/g, "");
  if (/^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/.test(limpio)) return { ok: false, motivo: "persona" }; // 13 = persona física
  const m = limpio.match(/^[A-ZÑ&]{3}(\d{2})(\d{2})(\d{2})[A-Z0-9]{3}$/);
  if (!m) return { ok: false, motivo: "formato" };
  const [mes, dia] = [Number(m[2]), Number(m[3])];
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return { ok: false, motivo: "verificador" };
  return { ok: true, normalizado: limpio };
}

function colombia(v: string): ResultadoTributario {
  const d = soloDig(v);
  if (!/^\d{10}$/.test(d)) return { ok: false, motivo: "formato" };
  const nit = d.slice(0, 9);
  const pesos = [41, 37, 29, 23, 19, 17, 13, 7, 3];
  const r = sumaPesos(nit, pesos) % 11;
  const dv = r > 1 ? 11 - r : r;
  if (dv !== Number(d[9])) return { ok: false, motivo: "verificador" };
  // Los NIT de personas jurídicas empiezan en 8 o 9; los de persona natural son su cédula.
  if (!/^[89]/.test(nit)) return { ok: false, motivo: "persona" };
  return { ok: true, normalizado: `${nit}-${d[9]}` };
}

function peru(v: string): ResultadoTributario {
  const d = soloDig(v);
  if (!/^\d{11}$/.test(d)) return { ok: false, motivo: "formato" };
  const r = 11 - (sumaPesos(d.slice(0, 10), [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]) % 11);
  const dv = r === 10 ? 0 : r === 11 ? 1 : r;
  if (dv !== Number(d[10])) return { ok: false, motivo: "verificador" };
  if (d.startsWith("10") || d.startsWith("15") || d.startsWith("17")) return { ok: false, motivo: "persona" };
  if (!d.startsWith("20")) return { ok: false, motivo: "formato" };
  return { ok: true, normalizado: d };
}

function argentina(v: string): ResultadoTributario {
  const d = soloDig(v);
  if (!/^\d{11}$/.test(d)) return { ok: false, motivo: "formato" };
  const r = 11 - (sumaPesos(d.slice(0, 10), [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]) % 11);
  const dv = r === 11 ? 0 : r;
  if (r === 10 || dv !== Number(d[10])) return { ok: false, motivo: "verificador" };
  if (!/^(30|33|34)/.test(d)) return { ok: false, motivo: /^(20|23|24|27)/.test(d) ? "persona" : "formato" };
  return { ok: true, normalizado: `${d.slice(0, 2)}-${d.slice(2, 10)}-${d[10]}` };
}

function ecuador(v: string): ResultadoTributario {
  const d = soloDig(v);
  if (!/^\d{13}$/.test(d) || !d.endsWith("001")) return { ok: false, motivo: "formato" };
  const prov = Number(d.slice(0, 2));
  if (!((prov >= 1 && prov <= 24) || prov === 30)) return { ok: false, motivo: "formato" };
  const tercero = Number(d[2]);
  if (tercero < 6) return { ok: false, motivo: "persona" };
  if (tercero === 9) {
    const r = sumaPesos(d.slice(0, 9), [4, 3, 2, 7, 6, 5, 4, 3, 2]) % 11;
    const dv = r === 0 ? 0 : 11 - r;
    if (dv !== Number(d[9])) return { ok: false, motivo: "verificador" };
  } else if (tercero === 6) {
    const r = sumaPesos(d.slice(0, 8), [3, 2, 7, 6, 5, 4, 3, 2]) % 11;
    const dv = r === 0 ? 0 : 11 - r;
    if (dv !== Number(d[8])) return { ok: false, motivo: "verificador" };
  } else return { ok: false, motivo: "formato" };
  return { ok: true, normalizado: d };
}

function panama(v: string): ResultadoTributario {
  // El RUC de una sociedad panameña es el número de folio del Registro Público: N-N-N.
  // No tiene un dígito verificador público fácil de calcular: solo se revisa la forma.
  const limpio = v.toUpperCase().replace(/\s/g, "");
  if (/^(\d{1,2}|PE|E|N|\d{1,2}(AV|PI))-\d{1,4}-\d{1,6}$/.test(limpio)) return { ok: false, motivo: "persona" };
  if (!/^\d{3,12}-\d{1,4}-\d{1,7}(DV\d{1,2})?$/.test(limpio)) return { ok: false, motivo: "formato" };
  return { ok: true, normalizado: limpio };
}

function costaRica(v: string): ResultadoTributario {
  const d = soloDig(v);
  if (!/^\d{10}$/.test(d)) return { ok: false, motivo: d.length === 9 ? "persona" : "formato" };
  if (!d.startsWith("3")) return { ok: false, motivo: "persona" };
  return { ok: true, normalizado: `${d[0]}-${d.slice(1, 4)}-${d.slice(4)}` };
}

function paraguay(v: string): ResultadoTributario {
  const d = soloDig(v);
  if (!/^\d{7,9}$/.test(d)) return { ok: false, motivo: "formato" };
  const cuerpo = d.slice(0, -1);
  let suma = 0;
  let k = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * k;
    k = k === 11 ? 2 : k + 1;
  }
  const r = suma % 11;
  const dv = r > 1 ? 11 - r : 0;
  if (dv !== Number(d.slice(-1))) return { ok: false, motivo: "verificador" };
  // Las personas jurídicas tienen RUC propio que empieza en 80; las físicas usan su cédula.
  if (!cuerpo.startsWith("80")) return { ok: false, motivo: "persona" };
  return { ok: true, normalizado: `${cuerpo}-${d.slice(-1)}` };
}

function espana(v: string): ResultadoTributario {
  const s = v.toUpperCase().replace(/[\s-]/g, "");
  if (/^[0-9XYZ]\d{7}[A-Z]$/.test(s)) return { ok: false, motivo: "persona" }; // DNI / NIE
  const m = s.match(/^([ABCDEFGHJNPQRSUVW])(\d{7})([0-9A-J])$/);
  if (!m) return { ok: false, motivo: "formato" };
  const num = m[2];
  let suma = 0;
  for (let i = 0; i < 7; i++) {
    const n = Number(num[i]);
    if (i % 2 === 1) suma += n;
    else {
      const x = n * 2;
      suma += Math.floor(x / 10) + (x % 10);
    }
  }
  const control = (10 - (suma % 10)) % 10;
  const letra = "JABCDEFGHI"[control];
  if (m[3] !== String(control) && m[3] !== letra) return { ok: false, motivo: "verificador" };
  return { ok: true, normalizado: s };
}

const VALIDADORES: Record<PaisTributario, (v: string) => ResultadoTributario> = {
  CL: chile,
  MX: mexico,
  CO: colombia,
  PE: peru,
  AR: argentina,
  EC: ecuador,
  PA: panama,
  CR: costaRica,
  PY: paraguay,
  ES: espana,
};

export function validarIdTributario(pais: PaisTributario, valor: string): ResultadoTributario {
  if (!valor.trim()) return { ok: false, motivo: "formato" };
  return VALIDADORES[pais](valor);
}

// ── Correo empresarial ──────────────────────────────────────────────────────
// Un correo de dominio propio (contacto@clinicavela.cr) prueba casi lo mismo que
// un sitio web. Los gratuitos no prueban nada de la empresa.
const GRATUITOS = new Set([
  "gmail.com", "googlemail.com", "hotmail.com", "hotmail.es", "hotmail.cl", "outlook.com", "outlook.es",
  "live.com", "live.cl", "msn.com", "yahoo.com", "yahoo.es", "yahoo.com.mx", "yahoo.com.ar", "ymail.com",
  "icloud.com", "me.com", "mac.com", "aol.com", "proton.me", "protonmail.com", "pm.me", "gmx.com", "gmx.es",
  "mail.com", "yandex.com", "zoho.com", "zohomail.com", "terra.com", "terra.cl", "prodigy.net.mx",
  "latinmail.com", "tutanota.com", "fastmail.com", "hey.com", "qq.com", "163.com", "mailinator.com",
  "guerrillamail.com", "10minutemail.com", "temp-mail.org", "yopmail.com",
]);

export function dominioCorreoEmpresarial(correo: string): string | null {
  const m = correo.trim().toLowerCase().match(/^[^\s@]+@([a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,})$/);
  if (!m) return null;
  const dominio = m[1];
  if (GRATUITOS.has(dominio)) return null;
  return dominio;
}
