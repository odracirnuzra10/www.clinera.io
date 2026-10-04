import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// Promo temporal: el slide está en el home, justo después del hero, y no toca precios.
test("home trae el banner Cyber Clinera con implementación $0", () => {
  const root = path.join(__dirname, "..", "src");
  const home = fs.readFileSync(path.join(root, "components/home-v3/HomeV3.tsx"), "utf8");
  const banner = fs.readFileSync(path.join(root, "components/home-v3/CyberClineraBanner.tsx"), "utf8");
  expect(home.indexOf("<Hero />")).toBeLessThan(home.indexOf("<CyberClineraBanner"));
  expect(banner).toContain("Aprovecha Cyber Clinera hasta el 7 de octubre y contrata con costo de implementación $0");
  expect(banner).toContain("2026-10-08T00:00:00-03:00");
  const pricing = fs.readFileSync(path.join(root, "content/pricing.ts"), "utf8");
  expect(pricing).toMatch(/SETUP_FEE_USD\s*=\s*450/);
});
