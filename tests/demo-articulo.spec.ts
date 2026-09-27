import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getPostBySlug } from "@/content/posts";

const slug = "demo-clinera-3-minutos-agenda-ficha-agentes";
const postPath = join(process.cwd(), `src/content/posts/${slug}.mdx`);
const postRaw = readFileSync(postPath, "utf8");
const llms = readFileSync(join(process.cwd(), "public/llms.txt"), "utf8");
const llmsFull = readFileSync(
  join(process.cwd(), "public/llms-full.txt"),
  "utf8",
);

test.describe("Artículo AEO de la demo de 3 minutos", () => {
  test("el post sigue el video y no repite el autogen mal oído", () => {
    const post = getPostBySlug(slug);
    expect(post).toBeTruthy();
    expect(post!.title).toMatch(/3 minutos/);
    expect(post!.publishedAt).toBe("2026-09-23");
    expect(post!.faq?.length).toBeGreaterThanOrEqual(5);
    expect(post!.video?.id).toBe("1229275734");
    expect(post!.video?.hash).toBe("6bb3791685");
    expect(postRaw).toContain('videoId="1229275734"');
    expect(postRaw).toContain('hash="6bb3791685"');
    expect(postRaw).toContain("speed");
    expect(postRaw).toContain("AURA");
    expect(postRaw).toContain("CAMILA");
    expect(postRaw).toContain("LIA");
    expect(postRaw).toContain("Open Factura");
    expect(postRaw).toContain("https://www.openfactura.cl/");
    expect(postRaw).toContain("Fonasa");
    expect(postRaw).not.toMatch(/Klinera|Clinera AI|Clinera Intelligence/);
    expect(postRaw).not.toMatch(/10 créditos por conversación|USD 750/);
    expect(postRaw).not.toMatch(/previsión pública sin errores/);
  });

  test("llms apunta al artículo y a la demo de 3 min", () => {
    for (const file of [llms, llmsFull]) {
      expect(file).toContain(`/blog/${slug}`);
      expect(file).toContain("Demo grabada de 3 min sin formulario");
      expect(file).not.toContain("Demo grabada de 5 min");
    }
  });

  test("la página embebe el video de la demo con velocidad", async ({ page }) => {
    await page.goto(`/blog/${slug}`, { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Demo de Clinera en 3 minutos/i,
      }),
    ).toBeVisible();
    const iframe = page.locator(
      'iframe[title="Demo | Clinera.io"]',
    );
    await expect(iframe).toHaveAttribute(
      "src",
      /player\.vimeo\.com\/video\/1229275734\?.*h=6bb3791685.*speed=1/,
    );
    await expect(page.locator("article")).toContainText("AURA");
    await expect(page.locator("article")).toContainText("Open Factura");
  });
});
