import { expect, test, type Page } from "@playwright/test";
import {
  esEnlaceWhatsApp,
  esNavegacionProfunda,
  profundaReciente,
  VALOR_USD,
} from "../src/lib/eventosValor";

// Eventos con valor de la campaña de tráfico (Ricardo, 13-nov-2026).

test.describe("eventos con valor: reglas", () => {
  test("valores pedidos por Ricardo", () => {
    expect(VALOR_USD).toEqual({ VisitaWeb: 1, NavegacionProfunda: 5, Contact: 7 });
  });

  test("navegación profunda: 3 páginas, /planes o 60 s", () => {
    expect(esNavegacionProfunda({ paginas: ["/", "/blog"], segundos: 10 })).toBe(false);
    expect(esNavegacionProfunda({ paginas: ["/", "/", "/"], segundos: 10 })).toBe(false);
    expect(esNavegacionProfunda({ paginas: ["/", "/blog", "/funciones"], segundos: 0 })).toBe(true);
    expect(esNavegacionProfunda({ paginas: ["/planes"], segundos: 0 })).toBe(true);
    expect(esNavegacionProfunda({ paginas: ["/planes2"], segundos: 0 })).toBe(false);
    expect(esNavegacionProfunda({ paginas: ["/"], segundos: 60 })).toBe(true);
  });

  test("una vez cada 30 días", () => {
    const dia = 86_400_000;
    expect(profundaReciente(null, Date.now())).toBe(false);
    expect(profundaReciente(1000, 1000 + 29 * dia)).toBe(true);
    expect(profundaReciente(1000, 1000 + 30 * dia)).toBe(false);
  });

  test("enlaces de WhatsApp", () => {
    expect(esEnlaceWhatsApp("https://wa.me/56985581524?text=hola")).toBe(true);
    expect(esEnlaceWhatsApp("https://api.whatsapp.com/send?phone=1")).toBe(true);
    expect(esEnlaceWhatsApp("/planes")).toBe(false);
  });
});

type Evento = { via: "pixel" | "capi"; nombre: string; id: string; valor: number };

async function preparar(page: Page): Promise<Evento[]> {
  const eventos: Evento[] = [];
  await page.addInitScript(() => {
    (window as unknown as { __CLINERA_EVENTOS_TEST: boolean }).__CLINERA_EVENTOS_TEST = true;
    const w = window as unknown as { fbq: (...a: unknown[]) => void; __fbq: unknown[][] };
    w.__fbq = [];
    w.fbq = (...a: unknown[]) => w.__fbq.push(a);
  });
  await page.route("**/api/meta/capi", async (route) => {
    const b = route.request().postDataJSON() as {
      event_name: string; event_id: string; custom_data: { value: number };
    };
    eventos.push({ via: "capi", nombre: b.event_name, id: b.event_id, valor: b.custom_data.value });
    await route.fulfill({ json: { ok: true } });
  });
  return eventos;
}

async function pixel(page: Page): Promise<Evento[]> {
  const crudo = await page.evaluate(
    () => (window as unknown as { __fbq: unknown[][] }).__fbq,
  );
  return crudo
    .filter((a) => ["VisitaWeb", "NavegacionProfunda", "Contact"].includes(a[1] as string))
    .map((a) => ({
      via: "pixel" as const,
      nombre: a[1] as string,
      id: (a[3] as { eventID: string }).eventID,
      valor: (a[2] as { value: number }).value,
    }));
}

test("VisitaWeb sale una vez, con el mismo event_id en pixel y CAPI", async ({ page }) => {
  const capi = await preparar(page);
  await page.goto("/funciones");
  await expect.poll(() => capi.filter((e) => e.nombre === "VisitaWeb").length).toBe(1);
  const p = (await pixel(page)).filter((e) => e.nombre === "VisitaWeb");
  expect(p.map((e) => e.id)).toEqual([capi.find((e) => e.nombre === "VisitaWeb")!.id]);
  await page.goto("/blog");
  await page.waitForTimeout(1500);
  const visitas = capi.filter((e) => e.nombre === "VisitaWeb");
  expect(visitas).toHaveLength(1);
  expect(visitas[0].valor).toBe(1);
});

test("pasar por /planes cuenta NavegacionProfunda US$ 5, una sola vez", async ({ page }) => {
  const capi = await preparar(page);
  await page.goto("/planes");
  await expect.poll(() => capi.filter((e) => e.nombre === "NavegacionProfunda").length).toBe(1);
  const p = (await pixel(page)).filter((e) => e.nombre === "NavegacionProfunda");
  expect(p).toHaveLength(1);
  const c = capi.find((e) => e.nombre === "NavegacionProfunda")!;
  expect(c.valor).toBe(5);
  expect(p[0].id).toBe(c.id);
  // Otra visita el mismo día (localStorage) no la repite.
  await page.goto("/");
  await page.waitForTimeout(1500);
  expect(capi.filter((e) => e.nombre === "NavegacionProfunda")).toHaveLength(1);
});

test("clic a WhatsApp cuenta Contact US$ 7", async ({ page }) => {
  const capi = await preparar(page);
  await page.goto("/funciones");
  await page.evaluate(() => {
    const a = document.createElement("a");
    a.href = "https://wa.me/56985581524?text=hola";
    a.id = "wa-prueba";
    a.textContent = "wa";
    a.addEventListener("click", (e) => e.preventDefault());
    document.body.appendChild(a);
  });
  await page.click("#wa-prueba");
  await expect.poll(() => capi.filter((e) => e.nombre === "Contact").length).toBe(1);
  expect(capi.find((e) => e.nombre === "Contact")!.valor).toBe(7);
});
