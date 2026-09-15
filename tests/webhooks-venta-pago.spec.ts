import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getPostBySlug } from "@/content/posts";

const slug = "webhooks-venta-nueva-pago-recibido-clinera";
const postPath = join(process.cwd(), `src/content/posts/${slug}.mdx`);
const postRaw = readFileSync(postPath, "utf8");
const llms = readFileSync(join(process.cwd(), "public/llms.txt"), "utf8");
const llmsFull = readFileSync(
  join(process.cwd(), "public/llms-full.txt"),
  "utf8",
);

test.describe("Webhooks venta nueva y pago recibido", () => {
  test("el post existe con FAQ, eventos y planes Atlas/Summit", () => {
    const post = getPostBySlug(slug);
    expect(post).toBeTruthy();
    expect(post!.title).toMatch(/venta nueva|pago recibido/i);
    expect(post!.category).toBe("Integraciones");
    expect(post!.featured).toBe(true);
    expect(post!.faq?.length).toBeGreaterThanOrEqual(5);
    expect(postRaw).toContain("sale.created");
    expect(postRaw).toContain("payment.created");
    expect(postRaw).toContain("payment.voided");
    expect(postRaw).toContain("Pagos del día");
    expect(postRaw).toContain("HMAC-SHA256");
    expect(postRaw).toContain("Automatizaciones");
    expect(postRaw).toMatch(/Atlas/);
    expect(postRaw).toMatch(/Summit/);
    expect(postRaw).toContain("/blog/clinera-api-webhooks-n8n-make-zapier");
  });

  test("llms apunta al artículo de webhooks de venta y pago", () => {
    expect(llms).toContain(`/blog/${slug}`);
    expect(llmsFull).toContain(`/blog/${slug}`);
  });

  test("la página del blog renderiza título y eventos", async ({ page }) => {
    await page.goto(`/blog/${slug}`);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Webhooks de venta nueva y pago recibido/i,
      }),
    ).toBeVisible();
    await expect(page.locator("article")).toContainText("sale.created");
    await expect(page.locator("article")).toContainText("payment.created");
    await expect(page.locator("article")).toContainText("Pagos del día");
  });
});
