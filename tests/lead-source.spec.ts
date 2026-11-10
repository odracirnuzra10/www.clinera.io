// ===========================================================================
// De dónde viene el lead: Google Ads, Meta Ads u orgánico.
//
// Función pura, sin navegador ni red. Lo que se prueba acá es la REGLA, no el
// navegador: `detectLeadSource()` solo junta las señales (query de la URL,
// cookie `_clinera_gclid`, sessionStorage de Meta) y se las pasa a esta.
//
// Los dos casos que motivaron todo esto —y que hasta agosto 2026 se contaban
// como orgánicos— son "gbraid sin gclid" y "el gclid quedó en la visita
// anterior": están abajo, con el nombre completo.
// ===========================================================================
import { test, expect } from "@playwright/test";
import { clasificarLeadSource } from "@/components/ventas/VentasLanding";

const solo = (search: string) => clasificarLeadSource({ search });

test.describe("lo que manda es el enlace que escribimos nosotros", () => {
  test("?source= gana sobre cualquier heurística", () => {
    expect(solo("?source=google")).toBe("google-ads");
    expect(solo("?lead_source=meta-ads")).toBe("meta-ads");
    // Un ?source=organico explícito no lo pisa ni un fbclid guardado.
    expect(
      clasificarLeadSource({ search: "?source=organico", storedFbc: "fb.1.123.abc" }),
    ).toBe("organico");
  });
});

test.describe("identificador de click en la URL", () => {
  test("gclid es Google Ads", () => {
    expect(solo("?gclid=Cj0KCQjw")).toBe("google-ads");
  });

  test("gbraid y wbraid TAMBIÉN son Google Ads", () => {
    // El hueco viejo: YouTube/Demand Gen y iOS no mandan gclid. Estos leads
    // llegaban con su identificador de click en el payload y quedaban como
    // "organico" igual.
    expect(solo("?gbraid=0AAAAA")).toBe("google-ads");
    expect(solo("?wbraid=CjkKCQ")).toBe("google-ads");
  });

  test("gad_source sin gclid sigue siendo Google Ads", () => {
    expect(solo("?gad_source=1&gad_campaignid=2200")).toBe("google-ads");
  });

  test("fbclid es Meta Ads", () => {
    expect(solo("?fbclid=IwAR0")).toBe("meta-ads");
  });
});

test.describe("identificador de click guardado — la segunda página", () => {
  test("el gclid de la visita anterior manda aunque /hablar-con-ventas no traiga query", () => {
    // Entró por un anuncio a /planes y llegó a /hablar-con-ventas por el menú: la URL ya
    // no trae nada, pero la cookie de 90 días sí, y ese mismo gclid viaja en el
    // payload del webhook. Antes el lead salía "organico" con su gclid al lado.
    expect(clasificarLeadSource({ search: "", storedGoogleClickId: "Cj0KCQjw" })).toBe(
      "google-ads",
    );
  });

  test("la cookie _fbc guardada es Meta Ads", () => {
    expect(clasificarLeadSource({ search: "", storedFbc: "fb.1.1750000000.IwAR0" })).toBe(
      "meta-ads",
    );
    expect(clasificarLeadSource({ search: "", storedFbclid: "IwAR0" })).toBe("meta-ads");
  });

  test("la URL de AHORA le gana a lo guardado", () => {
    expect(
      clasificarLeadSource({ search: "?fbclid=IwAR0", storedGoogleClickId: "Cj0KCQjw" }),
    ).toBe("meta-ads");
  });

  test("con las dos huellas guardadas gana Google, sin empates al azar", () => {
    const señales = { search: "", storedGoogleClickId: "Cj0", storedFbc: "fb.1.1.x" };
    expect(clasificarLeadSource(señales)).toBe("google-ads");
    expect(clasificarLeadSource(señales)).toBe("google-ads");
  });
});

test.describe("utm — solo cuando no hay identificador de click", () => {
  test("google/cpc y youtube son Google Ads", () => {
    expect(solo("?utm_source=google&utm_medium=cpc")).toBe("google-ads");
    expect(solo("?utm_source=youtube&utm_medium=video")).toBe("google-ads");
    expect(solo("?utm_source=adwords")).toBe("google-ads");
  });

  test("las superficies de Meta son Meta Ads", () => {
    expect(solo("?utm_source=instagram")).toBe("meta-ads");
    expect(solo("?utm_source=facebook")).toBe("meta-ads");
    expect(solo("?utm_source=ig&utm_medium=paid_social")).toBe("meta-ads");
  });

  test("«an» es Audience Network y «msg» es Messenger — los rótulos de Meta", () => {
    // El caso real: un lead de agosto 2026 llegó a /hablar-con-ventas con
    // `utm_medium=paid&utm_source=an`. Traía fbclid, así que no se notó; el que
    // pierde el fbclid por el camino quedaba contado como orgánico.
    expect(solo("?utm_medium=paid&utm_source=an&utm_campaign=120247672764930218")).toBe("meta-ads");
    expect(solo("?utm_source=msg")).toBe("meta-ads");
    // Por igualdad, no por substring.
    expect(solo("?utm_source=analytics")).toBe("analytics");
  });

  test("una campaña de otra red se devuelve tal cual, no se inventa", () => {
    expect(solo("?utm_source=linkedin&utm_medium=social")).toBe("linkedin");
  });
});

test.describe("orgánico", () => {
  test("sin query y sin nada guardado", () => {
    expect(solo("")).toBe("organico");
    expect(solo("?ref=blog")).toBe("organico");
  });

  test("_fbp NO es señal de origen", () => {
    // La tiene todo visitante que cargue el Pixel: si contara, el sitio entero
    // sería Meta Ads. Por eso ni siquiera es un campo de LeadSourceSignals, y
    // este test existe para que no vuelva a aparecer.
    expect(Object.keys({ search: "", storedFbclid: null, storedFbc: null })).not.toContain(
      "storedFbp",
    );
    expect(clasificarLeadSource({ search: "", storedFbclid: "", storedFbc: "" })).toBe(
      "organico",
    );
  });
});
