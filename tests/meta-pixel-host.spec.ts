import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { shouldInitMetaPixel } from "@/lib/metaEvents";
import { META_PIXEL_ID } from "@/lib/meta-pixel-id";

const analytics = readFileSync(
  join(process.cwd(), "src/components/Analytics.tsx"),
  "utf8",
);
const capiRoute = readFileSync(
  join(process.cwd(), "src/app/api/meta/capi/route.ts"),
  "utf8",
);

test.describe("pixel de producción no arranca en dev/preview", () => {
  test("shouldInitMetaPixel corta localhost, loopback y *.vercel.app", () => {
    expect(shouldInitMetaPixel("clinera.io")).toBe(true);
    expect(shouldInitMetaPixel("www.clinera.io")).toBe(true);
    expect(shouldInitMetaPixel("localhost")).toBe(false);
    expect(shouldInitMetaPixel("127.0.0.1")).toBe(false);
    expect(shouldInitMetaPixel("web-git-feat.vercel.app")).toBe(false);
  });

  test("el pixel lo carga GTM: el código no lo inicia (si no, cada PageView cuenta doble)", () => {
    expect(analytics).not.toContain("fbq('init'");
    expect(analytics).not.toContain("connect.facebook.net/en_US/fbevents.js");
    expect(analytics).toContain("tr?id=${META_PIXEL_ID}");
  });

  test("GTM (y con él el pixel) no carga en localhost, loopback ni *.vercel.app", () => {
    expect(analytics).toContain("h==='localhost'");
    expect(analytics).toContain("h==='127.0.0.1'");
    expect(analytics).toContain("\\\\.vercel\\\\.app$");
    expect(analytics.indexOf("h==='localhost'")).toBeLessThan(analytics.indexOf("googletagmanager.com/gtm.js"));
  });

  test("trackPixel espera a que GTM cargue el pixel en vez de perder el evento", () => {
    const tracking = readFileSync(join(process.cwd(), "src/lib/tracking.ts"), "utf8");
    expect(tracking).toContain("setInterval");
    expect(tracking).toContain("clearInterval");
  });

  // Lead (rellenó el formulario de la landing, US$ 3) se sumó el 18-oct-2026.
  test("el endpoint CAPI solo acepta MQL y Lead", () => {
    expect(capiRoute).toContain('new Set(["MQL", "Lead"])');
    expect(capiRoute).not.toMatch(/new Set\(\[[^\]]*Waitlist/);
    expect(capiRoute).not.toMatch(/new Set\(\[[^\]]*Contact/);
  });

  test("el pixel nuevo (Clinera Software) está en todo el sitio y el viejo ya no", () => {
    const OLD = "1104567405156111";
    expect(META_PIXEL_ID).toBe("2251201709002818");
    expect(capiRoute).toContain("META_PIXEL_ID");
    expect(capiRoute).not.toContain(OLD);
    // Páginas estáticas: no pueden importar la constante, llevan el ID escrito.
    for (const f of [
      "infraestructura/index.html",
      "init/index.html",
      "leads/index.html",
      "inicia-2/index.html",
      "inicia-ahora/index.html",
      "remarketing/index.html",
      "js/components.js",
    ]) {
      const src = readFileSync(join(process.cwd(), "public", f), "utf8");
      expect(src, f).toMatch(new RegExp(`fbq\\(\\s*['"]init['"]\\s*,\\s*['"]${META_PIXEL_ID}`));
      expect(src, f).not.toMatch(new RegExp(`fbq\\(\\s*['"]init['"]\\s*,\\s*['"]${OLD}`));
      expect(src, f).not.toContain(`tr?id=${OLD}`);
    }
  });
});
