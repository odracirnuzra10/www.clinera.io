import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  PODCAST_EPISODES,
  PODCAST_SERIES,
  publishedPodcastEpisodes,
} from "@/content/podcast";
import { getPostBySlug } from "@/content/posts";

const postSlug = "clinera-podcast-1-como-escalar-clinica";
const postPath = join(
  process.cwd(),
  `src/content/posts/${postSlug}.mdx`,
);
const podcastContentSrc = readFileSync(
  join(process.cwd(), "src/content/podcast.ts"),
  "utf8",
);
const landingSrc = readFileSync(
  join(process.cwd(), "src/components/podcast/PodcastLanding.tsx"),
  "utf8",
);
const pageSrc = readFileSync(
  join(process.cwd(), "src/app/podcast/page.tsx"),
  "utf8",
);
const embedSrc = readFileSync(
  join(process.cwd(), "src/components/blog/VimeoEmbed.tsx"),
  "utf8",
);
const sitemapSrc = readFileSync(
  join(process.cwd(), "src/app/sitemap.ts"),
  "utf8",
);
const robotsSrc = readFileSync(
  join(process.cwd(), "src/lib/robots-txt.ts"),
  "utf8",
);
const llms = readFileSync(join(process.cwd(), "public/llms.txt"), "utf8");
const llmsFull = readFileSync(
  join(process.cwd(), "public/llms-full.txt"),
  "utf8",
);
const postRaw = readFileSync(postPath, "utf8");

test.describe("Clinera Podcast: hub + capítulo 1", () => {
  test("la serie declara exactamente 5 capítulos", () => {
    expect(PODCAST_SERIES.totalEpisodes).toBe(5);
    expect(PODCAST_EPISODES).toHaveLength(5);
    expect(PODCAST_EPISODES.map((e) => e.number)).toEqual([1, 2, 3, 4, 5]);
  });

  test("solo el capítulo 1 está publicado y apunta al blog", () => {
    const published = publishedPodcastEpisodes();
    expect(published).toHaveLength(1);
    expect(published[0].number).toBe(1);
    expect(published[0].vimeoId).toBe("1227087546");
    expect(published[0].vimeoHash).toBe("f809ac4f9a");
    expect(published[0].blogSlug).toBe(postSlug);
    expect(PODCAST_EPISODES.filter((e) => e.status === "upcoming")).toHaveLength(
      4,
    );
  });

  test("el post del capítulo 1 existe con video, FAQ y embed con hash", () => {
    const post = getPostBySlug(postSlug);
    expect(post).toBeTruthy();
    expect(post!.video?.id).toBe("1227087546");
    expect(post!.video?.hash).toBe("f809ac4f9a");
    expect(post!.faq?.length).toBeGreaterThanOrEqual(5);
    expect(postRaw).toMatch(/<VimeoEmbed[\s\S]*videoId="1227087546"/);
    expect(postRaw).toMatch(/hash="f809ac4f9a"/);
    expect(postRaw).toContain("/podcast");
  });

  test("VimeoEmbed acepta hash unlisted", () => {
    expect(embedSrc).toMatch(/hash\?:/);
    expect(embedSrc).toMatch(/params\.set\("h", hash\)/);
  });

  test("la página /podcast tiene PodcastSeries + FAQ schema", () => {
    expect(pageSrc).toMatch(/PodcastSeries/);
    expect(pageSrc).toMatch(/faqSchema/);
    expect(pageSrc).toMatch(/PodcastLanding/);
    expect(podcastContentSrc).toContain('vimeoId: "1227087546"');
    expect(podcastContentSrc).toContain('vimeoHash: "f809ac4f9a"');
    expect(landingSrc).toContain("Los 5 capítulos");
    expect(landingSrc).toContain("videoId={episode.vimeoId}");
  });

  test("sitemap, robots y llms exponen el podcast", () => {
    expect(sitemapSrc).toMatch(/\/podcast/);
    expect(robotsSrc).toContain('/podcast');
    expect(llms).toContain("https://www.clinera.io/podcast");
    expect(llms).toContain(
      `https://www.clinera.io/blog/${postSlug}`,
    );
    expect(llmsFull).toContain("https://www.clinera.io/podcast");
    expect(llmsFull).toContain(
      `https://www.clinera.io/blog/${postSlug}`,
    );
  });

  test("el hub y el artículo del cap. 1 cargan", async ({ page }) => {
    await page.goto("/");
    const navPodcast = page.locator('a[href="/podcast"]').filter({ hasText: "Podcast" }).first();
    await expect(navPodcast).toBeVisible();
    await navPodcast.click();
    await page.waitForURL(/\/podcast$/);
    await expect(
      page.getByRole("heading", { name: /Clinera Podcast/i }).first(),
    ).toBeVisible();
    await expect(page.getByText(/Capítulo 1/i).first()).toBeVisible();
    const iframe = page.locator(
      'iframe[title*="Clinera Podcast #1"]',
    );
    await expect(iframe).toHaveAttribute(
      "src",
      /player\.vimeo\.com\/video\/1227087546.*h=f809ac4f9a/,
    );

    await page.goto(`/blog/${postSlug}`);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /cómo escalar una clínica de forma correcta/i,
      }),
    ).toBeVisible();
    await expect(
      page.locator('iframe[title*="Clinera Podcast #1"]'),
    ).toHaveAttribute(
      "src",
      /player\.vimeo\.com\/video\/1227087546.*h=f809ac4f9a/,
    );
  });
});
