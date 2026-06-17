import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

// Frontmatter schema — extender acá cuando se sumen campos.
export type PostFrontmatter = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  category?: string;
  tags?: string[];
  heroImage?: string;
  author?: string;
  wordsApprox?: number;
  featured?: boolean;
  // Para internal linking automático: si declara una comparativa relacionada,
  // /blog/[slug] linkea a esa al final.
  relatedComparativa?: string;
  // FAQ embebido en frontmatter (opcional, para FAQPage schema).
  faq?: { q: string; a: string }[];
  // Video embebido en el post (opcional, para VideoObject schema).
  // Si falta thumbnailUrl se usa el de Vimeo (vumbnail); si falta uploadDate
  // se usa publishedAt. El embed visual va en el body con <VimeoEmbed/>.
  video?: {
    id: string;
    name: string;
    description: string;
    thumbnailUrl?: string;
    uploadDate?: string;
  };
};

export type Post = PostFrontmatter & {
  content: string;
};

const POSTS_DIR = join(process.cwd(), "src/content/posts");

let cachedPosts: Post[] | null = null;

function loadAll(): Post[] {
  if (cachedPosts) return cachedPosts;
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  const posts: Post[] = files.map((file) => {
    const raw = readFileSync(join(POSTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const fm = data as PostFrontmatter;
    return {
      ...fm,
      slug: fm.slug ?? file.replace(/\.mdx$/, ""),
      content,
    };
  });
  // Orden: featured primero, luego por publishedAt desc.
  posts.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.publishedAt.localeCompare(a.publishedAt);
  });
  cachedPosts = posts;
  return posts;
}

export const allPosts: Post[] = loadAll();

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export function getPostsByTag(tag: string): Post[] {
  return allPosts.filter((p) => p.tags?.includes(tag));
}

export function getRelatedPosts(post: Post, max = 3): Post[] {
  const tag = post.tags?.[0];
  if (!tag) return [];
  return allPosts
    .filter((p) => p.slug !== post.slug && p.tags?.includes(tag))
    .slice(0, max);
}

export function getAllTags(): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of allPosts) {
    for (const t of p.tags ?? []) {
      map.set(t, (map.get(t) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
