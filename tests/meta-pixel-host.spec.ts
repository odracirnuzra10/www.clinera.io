import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { shouldInitMetaPixel } from "@/lib/metaEvents";

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

  test("el script inline de Analytics replica el mismo corte", () => {
    expect(analytics).toContain("h==='localhost'");
    expect(analytics).toContain("h==='127.0.0.1'");
    expect(analytics).toContain("\\\\.vercel\\\\.app$");
    expect(analytics).toContain("1104567405156111");
  });

  test("el endpoint CAPI solo acepta MQL", () => {
    expect(capiRoute).toContain('new Set(["MQL"])');
    expect(capiRoute).not.toMatch(/new Set\(\[[^\]]*Waitlist/);
    expect(capiRoute).not.toMatch(/new Set\(\[[^\]]*Contact/);
  });
});
