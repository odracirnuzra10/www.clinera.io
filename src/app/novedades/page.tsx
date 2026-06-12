import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import NovedadesV3 from "@/components/interior-v3/NovedadesV3";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, orgSchema } from "@/components/seo/schemas";
import { allPosts, getAllTags } from "@/content/posts";

export const metadata: Metadata = {
  title: "Blog y novedades — Clinera",
  description:
    "Lo nuevo de Clinera: estudios técnicos, guías de WhatsApp Business + IA, casos reales de clínicas LATAM y operaciones para clínicas médicas y estéticas.",
  alternates: { canonical: "https://www.clinera.io/novedades" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://www.clinera.io/novedades",
    siteName: "Clinera.io",
    title: "Blog y novedades — Clinera",
    description: "Estudios técnicos, guías de WhatsApp + IA y casos reales.",
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog y novedades — Clinera",
    description: "Estudios, guías y casos reales para clínicas LATAM.",
    images: ["/images/og-banner.png"],
  },
};

type Blog = {
  title: string;
  excerpt?: string;
  category?: string;
  image?: string;
  url?: string;
  slug?: string;
  publishedAt?: string;
  tags?: string[];
};

type SearchParams = Promise<{ tag?: string | string[] }>;

export default async function NovedadesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const rawTag = params.tag;
  const activeTag = (Array.isArray(rawTag) ? rawTag[0] : rawTag) ?? null;

  // Redirect 308 de /novedades?tag=X → /novedades/X (URLs path-based son canónicas)
  if (activeTag) {
    permanentRedirect(`/novedades/${encodeURIComponent(activeTag)}`);
  }

  const filtered = allPosts;

  const blogs: Blog[] = filtered.map((p) => ({
    title: p.title,
    excerpt: p.description,
    category: p.category,
    image: p.heroImage,
    url: `/blog/${p.slug}`,
    slug: p.slug,
    publishedAt: p.publishedAt,
    tags: p.tags,
  }));

  const allTags = getAllTags();

  // Schema Blog + ItemList
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://www.clinera.io/novedades#blog",
    name: "Blog Clinera",
    url: "https://www.clinera.io/novedades",
    description:
      "Estudios técnicos, guías de WhatsApp + IA, casos reales y operaciones para clínicas LATAM.",
    publisher: { "@id": "https://www.clinera.io/#organization" },
    blogPost: filtered.slice(0, 12).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://www.clinera.io/blog/${p.slug}`,
      datePublished: p.publishedAt,
      ...(p.updatedAt && { dateModified: p.updatedAt }),
      ...(p.author && { author: { "@type": "Person", name: p.author } }),
      ...(p.description && { description: p.description }),
    })),
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: filtered.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.clinera.io/blog/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io" },
            { name: "Blog", url: "https://www.clinera.io/novedades" },
          ]),
          blogSchema,
          itemListSchema,
        ]}
      />
      <NavV3 />
      <main>
        <NovedadesV3
          blogs={blogs}
          faqs={[]}
          allTags={allTags}
          activeTag={activeTag}
        />
      </main>
      <FooterV3 />
    </>
  );
}
