import { expect, test } from "@playwright/test";
import { CHECKOUT_URL, PROMO_CODE, TRACKING_PARAMS, checkoutUrl, soloTracking } from "../src/content/checkout";

test.describe("checkoutUrl", () => {
  test("sin opciones devuelve el Payment Link pelado", () => {
    expect(checkoutUrl("flux")).toBe(CHECKOUT_URL.flux);
  });

  test("con promo prellena CLINERA50X3 y sin promo no", () => {
    expect(PROMO_CODE).toBe("CLINERA50X3");
    expect(new URL(checkoutUrl("flux", { promo: true })).searchParams.get("prefilled_promo_code")).toBe("CLINERA50X3");
    expect(checkoutUrl("flux")).not.toContain("prefilled_promo_code");
  });

  test("un código explícito sí viaja", () => {
    const u = new URL(checkoutUrl("hex", { promo: true, promoCode: "CLINERA50X3" }));
    expect(u.searchParams.get("prefilled_promo_code")).toBe("CLINERA50X3");
  });

  test("conserva los utm y descarta el resto, incluido fbclid", () => {
    const u = new URL(checkoutUrl("vortex", { search: "?utm_source=g&utm_campaign=x&foo=1&fbclid=zz" }));
    expect(u.searchParams.get("utm_source")).toBe("g");
    expect(u.searchParams.get("utm_campaign")).toBe("x");
    expect(u.searchParams.has("foo")).toBe(false);
    expect(u.searchParams.has("fbclid")).toBe(false);
  });

  test("el gclid se sanea y se corta a 200", () => {
    expect(new URL(checkoutUrl("flux", { search: "?gclid=ab.c:d/e" })).searchParams.get("client_reference_id")).toBe("abcde");
    const largo = "a".repeat(300);
    expect(new URL(checkoutUrl("flux", { search: `?gclid=${largo}` })).searchParams.get("client_reference_id")).toHaveLength(200);
  });

  test("el correo se prellena", () => {
    expect(new URL(checkoutUrl("flux", { email: "ana@clinica.cl" })).searchParams.get("prefilled_email")).toBe("ana@clinica.cl");
  });

  test("soloTracking se queda con los parámetros de atribución", () => {
    const out = soloTracking("?utm_source=g&foo=1&gclid=abc&fbclid=zz&plan=hex");
    expect([...out.keys()].sort()).toEqual(["fbclid", "gclid", "utm_source"]);
    for (const k of out.keys()) expect(TRACKING_PARAMS).toContain(k);
  });
});
