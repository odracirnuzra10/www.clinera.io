import { test, expect, Page, Request } from "@playwright/test";

/**
 * E2E tests for Meta Pixel + dataLayer analytics.
 *
 * Intercepts outgoing requests to Meta (connect.facebook.net/tr/) and reads
 * the client-side dataLayer to verify events fire on the expected triggers.
 */

type PixelHit = {
  event: string;
  url: string;
  params: Record<string, string>;
};

async function installPixelRecorder(page: Page) {
  const hits: PixelHit[] = [];

  // Meta Pixel: every event is fired as GET/POST to connect.facebook.net/tr/
  page.on("request", (req: Request) => {
    const url = req.url();
    if (!url.includes("facebook.com/tr") && !url.includes("facebook.net/tr")) return;
    const u = new URL(url);
    const params: Record<string, string> = {};
    u.searchParams.forEach((v, k) => (params[k] = v));
    hits.push({ event: params["ev"] || "unknown", url, params });
  });

  return hits;
}

async function readDataLayer(page: Page) {
  return page.evaluate(() =>
    ((window as unknown) as { dataLayer?: unknown[] }).dataLayer || []
  );
}

test.describe("Meta Pixel & dataLayer events", () => {
  test("1) localhost no inicializa el pixel de producción", async ({ page }) => {
    const hits = await installPixelRecorder(page);
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    const pageviews = hits.filter((h) => h.event === "PageView");
    expect(pageviews.length, "localhost no debe pegarle al pixel 1104567405156111").toBe(0);

    const script = await page.locator("#meta-pixel").textContent();
    expect(script).toContain("1104567405156111");
    expect(script).toContain("localhost");
    expect(await page.evaluate(() => typeof (window as unknown as { fbq?: unknown }).fbq)).toBe(
      "undefined",
    );

    const dl = await readDataLayer(page);
    console.log("dataLayer after load:", JSON.stringify(dl, null, 2));
    console.log("pixel hits after load:", hits.map((h) => h.event));
  });

  test("2) ViewContent fires after scrolling to bottom of home", async ({ page }) => {
    const hits = await installPixelRecorder(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // Slow scroll in chunks so IntersectionObserver + scroll listeners fire
    await page.evaluate(async () => {
      const total = document.documentElement.scrollHeight;
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < total; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 350));
      }
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((r) => setTimeout(r, 1500));
    });

    await page.waitForTimeout(2000);

    const viewContents = hits.filter((h) => h.event === "ViewContent");
    const dl = await readDataLayer(page);
    const dlVC = (dl as Array<Record<string, unknown>>).filter(
      (e) => e.event === "view_content"
    );

    console.log("ViewContent Meta Pixel hits:", viewContents.length);
    console.log("view_content dataLayer hits:", dlVC.length);
    console.log("All hits:", hits.map((h) => h.event));

    expect(
      viewContents.length + dlVC.length,
      "expected ViewContent to fire on Meta Pixel OR dataLayer after scroll-to-bottom"
    ).toBeGreaterThanOrEqual(1);
  });

  test("3) ViewContent fires on SPA navigation between pages", async ({ page }) => {
    const hits = await installPixelRecorder(page);
    const consoleLogs: string[] = [];
    page.on("console", (msg) => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1800);

    const hitsBefore = hits.length;
    const dlBefore = (await readDataLayer(page)) as Array<Record<string, unknown>>;

    // Navigate to /planes via Next.js client-side nav
    await page.click('a[href="/planes"]');
    await page.waitForURL("**/planes");
    await page.waitForTimeout(3000);

    const newHits = hits.slice(hitsBefore);
    const dlAfter = (await readDataLayer(page)) as Array<Record<string, unknown>>;
    const dlNew = dlAfter.slice(dlBefore.length);

    console.log("hits before navigation:", hits.slice(0, hitsBefore).map((h) => h.event));
    console.log("new pixel hits after navigation:", newHits.map((h) => h.event));
    console.log("dataLayer new events after navigation:");
    dlNew.forEach((e) => console.log(" ", JSON.stringify(e).slice(0, 200)));
    console.log(
      "debug: location after nav:",
      await page.evaluate(() => location.pathname)
    );

    const viewContentsAfter = newHits.filter((h) => h.event === "ViewContent");
    const dlViewContentsAfter = dlNew.filter((e) => e.event === "view_content");

    expect(
      viewContentsAfter.length + dlViewContentsAfter.length,
      "expected ViewContent on SPA navigation (Meta Pixel or dataLayer)"
    ).toBeGreaterThanOrEqual(1);
  });

  test("4) Plan cards on /planes: Contratar → Stripe; Agendar demo → /agenda (secundario)", async ({ page }) => {
    await page.goto("/planes", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    const contratar = page.locator('#precios a[data-plan][data-plan-billing]').first();
    await expect(contratar).toBeVisible({ timeout: 10_000 });
    await expect(contratar).toContainText(/Contratar/i);
    await expect(contratar).toHaveAttribute("href", /buy\.stripe\.com/);

    const demoLink = page.locator('#precios a[data-plan-demo]').first();
    await expect(demoLink).toBeVisible();
    await expect(demoLink).toContainText(/Agendar demo/i);
    await expect(demoLink).toHaveAttribute("href", /\/agenda/);
  });

  test("5) EngagedSession fires after 60 seconds of visible time", async ({ page }) => {
    const hits = await installPixelRecorder(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // Simulate 65 seconds of presence. We can't actually wait 65s per test,
    // so we cheat by dispatching a custom synthetic tick — inspect state.
    await page.waitForTimeout(65_000);

    const customEvents = hits.filter((h) => h.event === "EngagedSession" || h.params["ev"] === "EngagedSession");
    const dl = await readDataLayer(page);
    const dlEngaged = (dl as Array<Record<string, unknown>>).filter(
      (e) => e.event === "engaged_60s"
    );

    console.log("EngagedSession Meta Pixel hits:", customEvents.length);
    console.log("engaged_60s dataLayer hits:", dlEngaged.length);
    console.log("all hits names:", hits.map((h) => h.event));

    expect(
      customEvents.length + dlEngaged.length,
      "expected EngagedSession / engaged_60s after 60+ seconds"
    ).toBeGreaterThanOrEqual(1);
  });
});
