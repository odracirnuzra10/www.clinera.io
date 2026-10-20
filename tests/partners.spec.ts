import { expect, test } from "@playwright/test";
import {
  getPartner,
  getPartnerPublicUrl,
  PARTNER_CNN_VIMEO_SRC,
  PARTNER_CTA_LABEL,
} from "@/lib/partners";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

test.describe("atribución del partner en WhatsApp", () => {
  test("el mensaje lleva nombre, ref y no se acorta", () => {
    const partner = getPartner("katherine");
    expect(partner).toBeTruthy();
    const message = buildWhatsAppMessage(partner!);
    expect(message).toBe(
      "Hola Rebeca, vengo de parte de Katherine Meza (ref: KATHE01). Quiero saber cómo funciona Clinera en mi clínica.",
    );
    const url = buildWhatsAppUrl(partner!);
    expect(url.startsWith("https://wa.me/56965810649?text=")).toBe(true);
    expect(url).toContain(encodeURIComponent("ref: KATHE01"));
    expect(decodeURIComponent(url)).toContain(message);
  });

  test("el link público de Katherine es /partner/km", () => {
    expect(getPartnerPublicUrl("katherine")).toBe("https://www.clinera.io/partner/km");
  });

  test("el mensaje de Yasna lleva ref YASNA01 y su link es /partner/yv", () => {
    const partner = getPartner("yasna");
    expect(partner).toBeTruthy();
    expect(getPartnerPublicUrl("yasna")).toBe("https://www.clinera.io/partner/yv");
    const message = buildWhatsAppMessage(partner!);
    expect(message).toContain("Yasna Vásquez");
    expect(message).toContain("ref: YASNA01");
    expect(buildWhatsAppUrl(partner!)).toContain(encodeURIComponent("ref: YASNA01"));
  });
});

test.describe("landing /partner/km", () => {
  test("el CTA del hero se ve en iPhone SE sin hacer scroll", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/partner/km");
    const cta = page.getByRole("link", { name: PARTNER_CTA_LABEL }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toBeInViewport();
    await expect(cta).toHaveAttribute("href", /wa\.me\/56965810649/);
    await expect(cta).toHaveAttribute("href", /KATHE01/);
    await expect(cta).toHaveAttribute("target", "_blank");
    await expect(cta).toHaveAttribute("rel", /noopener/);
    await expect(page.getByRole("link", { name: PARTNER_CTA_LABEL })).toHaveCount(3);
    await expect(page.getByText("Hablar con Rebeca por WhatsApp")).toHaveCount(0);
  });

  test("embebe el mismo clip de CNN que /plataforma", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/partner/km");
    const iframe = page.locator('iframe[title="Reportaje de CNN sobre Clinera"]');
    await expect(iframe).toHaveAttribute("src", PARTNER_CNN_VIMEO_SRC);
    await expect(iframe).toHaveAttribute("src", /player\.vimeo\.com\/video\/1205127087/);
  });

  test("en escritorio el hero y el video quedan lado a lado", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/partner/km");
    const hero = page.locator(".partner-hero");
    const video = page.locator(".partner-cnn");
    const heroBox = await hero.boundingBox();
    const videoBox = await video.boundingBox();
    expect(heroBox).toBeTruthy();
    expect(videoBox).toBeTruthy();
    expect(Math.abs((heroBox?.y ?? 0) - (videoBox?.y ?? 0))).toBeLessThan(24);
    expect((videoBox?.x ?? 0)).toBeGreaterThan((heroBox?.x ?? 0) + (heroBox?.width ?? 0) / 2);
  });

  test("el titular es la recomendación del partner, no un descuento ni planes", async ({
    page,
  }) => {
    await page.goto("/partner/km");
    const hero = page.locator(".partner-hero");
    await expect(hero.getByRole("heading", { level: 1 })).toContainText(
      "Katherine Meza te recomienda Clinera",
    );
    await expect(hero.getByText(/Coordiná una reunión/i)).toBeVisible();
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/10%/);
    expect(body).not.toMatch(/3 meses/);
    expect(body).not.toMatch(/USD\s*\d/);
    expect(body).not.toMatch(/US\$\s*\d/);
    expect(body).not.toMatch(/\bVortex\b/);
    expect(body).not.toMatch(/\bAtlas\b/);
    expect(body).not.toMatch(/\bSummit\b/);
    expect(body).not.toMatch(/\b279\b/);
    expect(body).not.toMatch(/\b379\b/);
    expect(body).not.toMatch(/\b479\b/);
    expect(body).not.toMatch(/\b450\b/);
  });

  test("/p/katherine redirige a /partner/km", async ({ page }) => {
    await page.goto("/p/katherine");
    expect(new URL(page.url()).pathname).toBe("/partner/km");
  });

  test("un slug que no existe responde 404", async ({ request }) => {
    const res = await request.get("/p/no-existe");
    expect(res.status()).toBe(404);
  });

  test("una vanity que no existe responde 404", async ({ request }) => {
    const res = await request.get("/partner/no-existe");
    expect(res.status()).toBe(404);
  });

  test("muestra el diagrama de Clinera", async ({ page }) => {
    await page.goto("/partner/km");
    await expect(page.getByText("Toda tu operación la alimenta")).toBeVisible();
    await expect(page.getByText("Clinera actúa")).toBeVisible();
    await expect(page.getByRole("img", { name: /alimentan Clinera/i })).toBeVisible();
  });
});

test.describe("landing /partner/yv", () => {
  test("es la landing de Yasna con foto, recomendación y atribución YASNA01", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/partner/yv");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Yasna Vásquez te recomienda Clinera",
    );
    await expect(page.getByRole("img", { name: "Yasna Vásquez" })).toBeVisible();
    const cta = page.getByRole("link", { name: PARTNER_CTA_LABEL }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toBeInViewport();
    await expect(cta).toHaveAttribute("href", /YASNA01/);
  });

  test("/p/yasna redirige a /partner/yv", async ({ page }) => {
    await page.goto("/p/yasna");
    expect(new URL(page.url()).pathname).toBe("/partner/yv");
  });
});

test.describe("kit /partner/km/kit", () => {
  test("no es indexable y trae el link, el ref y el QR", async ({ page }) => {
    await page.goto("/partner/km/kit");
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", /noindex/);
    await expect(
      page.getByText("https://www.clinera.io/partner/km", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("KATHE01")).toBeVisible();
    await expect(page.getByRole("img", { name: /QR del link de Katherine Meza/ })).toBeVisible();
  });
});
