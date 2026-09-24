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
const postSlug2 = "clinera-podcast-2-facturacion-no-es-administrar";
const postPath = join(
  process.cwd(),
  `src/content/posts/${postSlug}.mdx`,
);
const postPath2 = join(
  process.cwd(),
  `src/content/posts/${postSlug2}.mdx`,
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
const postRaw2 = readFileSync(postPath2, "utf8");

test.describe("Clinera Podcast: hub + capítulo 1", () => {
  test("la serie declara exactamente 5 capítulos", () => {
    expect(PODCAST_SERIES.totalEpisodes).toBe(5);
    expect(PODCAST_EPISODES).toHaveLength(5);
    expect(PODCAST_EPISODES.map((e) => e.number)).toEqual([1, 2, 3, 4, 5]);
  });

  test("los capítulos 1 y 2 están publicados y apuntan al blog", () => {
    const published = publishedPodcastEpisodes();
    expect(published).toHaveLength(2);
    expect(published[0].number).toBe(1);
    expect(published[0].vimeoId).toBe("1227087546");
    expect(published[0].vimeoHash).toBe("f809ac4f9a");
    expect(published[0].blogSlug).toBe(postSlug);
    expect(published[1].number).toBe(2);
    expect(published[1].vimeoId).toBe("1229666017");
    expect(published[1].vimeoHash).toBe("505f8b4905");
    expect(published[1].blogSlug).toBe(postSlug2);
    expect(published[1].durationSeconds).toBe(418);
    expect(PODCAST_EPISODES.filter((e) => e.status === "upcoming")).toHaveLength(
      3,
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
    expect(postRaw).toContain(`/blog/${postSlug2}`);
  });

  test("el post del capítulo 2 existe con video, FAQ y embed con hash", () => {
    const post = getPostBySlug(postSlug2);
    expect(post).toBeTruthy();
    expect(post!.video?.id).toBe("1229666017");
    expect(post!.video?.hash).toBe("505f8b4905");
    expect(post!.faq?.length).toBeGreaterThanOrEqual(5);
    expect(postRaw2).toMatch(/<VimeoEmbed[\s\S]*videoId="1229666017"/);
    expect(postRaw2).toMatch(/hash="505f8b4905"/);
    expect(postRaw2).toContain("/podcast");
    expect(postRaw2).toContain("25");
    expect(postRaw2).toContain("40");
    expect(post!.title.toLowerCase()).toContain("facturación");
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
    expect(podcastContentSrc).toContain('vimeoId: "1229666017"');
    expect(podcastContentSrc).toContain('vimeoHash: "505f8b4905"');
    expect(pageSrc).toContain("clinera-podcast-2-facturacion-no-es-administrar");
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
    expect(llms).toContain(`https://www.clinera.io/blog/${postSlug2}`);
    expect(llmsFull).toContain(`https://www.clinera.io/blog/${postSlug2}`);
  });

  test("el podcast sale del nav y queda en el footer; la demo ocupa ese lugar", () => {
    const nav = readFileSync(
      join(process.cwd(), "src/components/brand-v3/Nav.tsx"),
      "utf8",
    );
    const footer = readFileSync(
      join(process.cwd(), "src/components/brand-v3/Footer.tsx"),
      "utf8",
    );
    const home = readFileSync(
      join(process.cwd(), "src/components/home-v3/HomeV3.tsx"),
      "utf8",
    );
    expect(nav).toContain('href="/demo"');
    expect(nav).toContain("Ver demo 3 min");
    expect(nav).not.toContain("/podcast");
    expect(footer).toContain('["Clinera Podcast", "/podcast"]');
    expect(footer).toContain("VerDemoFloat");
    expect(footer).not.toContain("DemoVideoFrame");
    expect(home).toContain("<DemoEnVivo />");
    const plataforma = readFileSync(
      join(process.cwd(), "src/components/plataforma/PlataformaLanding.tsx"),
      "utf8",
    );
    expect(plataforma).toContain("<DemoEnVivo />");
    const demoVideo = readFileSync(
      join(process.cwd(), "src/content/demo-video.ts"),
      "utf8",
    );
    expect(demoVideo).toContain('speed: "1"');
  });

  test("el hub y el artículo del cap. 1 cargan", async ({ page }) => {
    await page.goto("/");
    const footerPodcast = page
      .locator('footer a[href="/podcast"]')
      .filter({ hasText: "Clinera Podcast" });
    await expect(footerPodcast).toBeVisible();
    await expect(page.locator('header a[href="/podcast"]')).toHaveCount(0);
    await expect(page.getByRole("link", { name: /ver demo 3 min/i }).first()).toBeVisible();
    await expect(page.locator("#demo-3-min iframe")).toHaveAttribute(
      "src",
      /player\.vimeo\.com\/video\/1229275734.*speed=1/,
    );
    await expect(page.locator("footer iframe")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Ver demo", exact: true })).toBeVisible();
    await footerPodcast.click();
    await page.waitForURL(/\/podcast$/);
    await expect(
      page.getByRole("heading", { name: /Clinera Podcast/i }).first(),
    ).toBeVisible();
    await expect(page.getByText(/Capítulo 2/i).first()).toBeVisible();
    await expect(
      page
        .getByRole("heading", {
          name: /por qué mirar la facturación no es administrar/i,
        })
        .first(),
    ).toBeVisible();
    const iframe = page.locator(
      'iframe[title*="Clinera Podcast #2"]',
    );
    await expect(iframe).toHaveAttribute(
      "src",
      /player\.vimeo\.com\/video\/1229666017.*h=505f8b4905/,
    );
    await expect(
      page.getByRole("link", { name: /cómo escalar una clínica de forma correcta/i }),
    ).toBeVisible();

    await page.goto(`/blog/${postSlug2}`);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /por qué mirar la facturación no es administrar/i,
      }),
    ).toBeVisible();
    await expect(
      page.locator('iframe[title*="Clinera Podcast #2"]'),
    ).toHaveAttribute(
      "src",
      /player\.vimeo\.com\/video\/1229666017.*h=505f8b4905/,
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
