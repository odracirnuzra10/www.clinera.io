// /voz (Ricardo, 11-nov-2026): tres llamadas reales del agente de voz para la expo.
import { expect, test } from "@playwright/test";

test("voz: noindex, tres audios que cargan y sin nombres de la red", async ({ page, request }) => {
  await page.route(/connect\.facebook\.net|googletagmanager/, (route) => route.abort());
  await page.goto("/voz", { waitUntil: "domcontentloaded" });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("[data-voz-caso]")).toHaveCount(3);
  const srcs = await page.locator("[data-voz-caso] audio").evaluateAll((els) => els.map((e) => e.getAttribute("src")));
  for (const src of srcs) {
    const r = await request.get(src!);
    expect(r.status()).toBe(200);
    expect(r.headers()["content-type"]).toContain("audio");
  }
  await expect(page.locator("main")).not.toContainText(/Hebe|Lumina|Pamela|Virgi|Patricia/i);
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(ancho).toBeLessThanOrEqual(0);
});
