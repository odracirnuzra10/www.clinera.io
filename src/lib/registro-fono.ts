// Validación del celular del modal de registro (Ricardo, 7-nov-2026). Copia de la regla de
// public/kimi-gratis/index.html (FONO, fonoOk, fonoFalso): largo exacto por país y sin números de relleno,
// para filtrar leads falsos. Si cambia una, cambia la otra.

export const FONO: Record<string, [number, RegExp | null]> = {
  "+56": [9, /^9\d{8}$/],
  "+52": [10, /^[2-9]\d{9}$/],
  "+54": [10, /^\d{10}$/],
  "+57": [10, null],
  "+51": [9, /^9\d{8}$/],
  "+593": [9, /^9\d{8}$/],
  "+598": [8, null],
  "+1": [10, /^(787|939)\d{7}$/],
};

export const FONO_EJEMPLO: Record<string, string> = {
  "+56": "9 1234 5678", "+52": "55 1234 5678", "+54": "11 1234 5678", "+57": "300 123 4567",
  "+51": "912 345 678", "+593": "99 123 4567", "+598": "9123 4567", "+1": "787 123 4567",
};

export const FONO_AYUDA: Record<string, string> = {
  "+56": "En Chile el celular tiene 9 dígitos y empieza con 9.",
  "+51": "En Perú el celular tiene 9 dígitos y empieza con 9.",
  "+593": "En Ecuador el celular tiene 9 dígitos y empieza con 9.",
  "+52": "En México el celular tiene 10 dígitos.",
  "+57": "En Colombia el celular tiene 10 dígitos y empieza con 3.",
  "+54": "En Argentina el celular tiene 10 dígitos.",
  "+598": "En Uruguay el celular tiene 8 dígitos.",
  "+1": "El número tiene 10 dígitos (787 o 939).",
};

/** Números de relleno (999999999, 912345678, 987654321…). */
export function fonoFalso(d: string): boolean {
  const resto = d.slice(1);
  if (/^(\d)\1+$/.test(resto)) return true;
  return "0123456789".includes(resto) || "9876543210".includes(resto) || "1234567890".includes(resto);
}

/** Dígitos nacionales válidos o "" si el número no sirve. */
export function fonoOk(prefijo: string, raw: string): string {
  const regla = FONO[prefijo];
  if (!regla) return "";
  const cc = prefijo.replace(/\D/g, "");
  let d = String(raw || "").replace(/\D/g, "");
  if (cc && d.startsWith(cc) && d.length > regla[0]) d = d.slice(cc.length);
  if (prefijo === "+52" && d.length === regla[0] + 1 && d.charAt(0) === "1") d = d.slice(1);
  if (d.length !== regla[0]) return "";
  if (regla[1] && !regla[1].test(d)) return "";
  if (fonoFalso(d)) return "";
  return d;
}

/** Mientras escribe: solo dígitos, nunca más del largo del país; si pegan el prefijo, se saca. */
export function limitarFono(prefijo: string, valor: string): string {
  const regla = FONO[prefijo];
  let d = valor.replace(/\D/g, "");
  if (!regla) return d;
  const cc = prefijo.replace(/\D/g, "");
  if (cc && d.startsWith(cc) && d.length > regla[0]) d = d.slice(cc.length);
  return d.slice(0, regla[0]);
}
