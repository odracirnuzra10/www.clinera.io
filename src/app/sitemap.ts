import type { MetadataRoute } from 'next';
import { allClinics } from '@/content/clinics';
import { allCruzadas } from '@/content/comparativas-cross';
import { allPosts } from '@/content/posts';
import { publishedRecursos } from '@/content/recursos';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.clinera.io';
  const now = new Date();

  const urls: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },

    // Core product
    { url: `${baseUrl}/funciones`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/planes`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/demo`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/inicia`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/reunion-comercial`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/hablar-con-ventas`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/ventas`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/presentacion`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/presentacion-agencia`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/agencias`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/migracion`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/calculadora-de-consumo`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // Comparativas (bottom-funnel SEO/AEO hub) — directas
    { url: `${baseUrl}/comparativas`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/comparativas/reservo`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/comparativas/agendapro`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/comparativas/medilink`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/comparativas/manual`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/comparativas/dentalink`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/comparativas/sacmed`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/comparativas/doctocliq`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // Trust / evidence (evergreen + companion article)
    { url: `${baseUrl}/efectividad`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/blog/efectividad`, lastModified: new Date('2026-04-23'), changeFrequency: 'monthly', priority: 0.8 },

    // Content / support
    { url: `${baseUrl}/novedades`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    // Categorias del blog (path-based URLs, mejor SEO que query strings)
    { url: `${baseUrl}/novedades/whatsapp`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/novedades/ia`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/novedades/operaciones`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/novedades/no-shows`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/novedades/estrategia`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/novedades/ltv`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/novedades/marketing`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/novedades/estetica`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/novedades/fichas-clinicas`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/ayuda`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },

    // Future dedicated pages (stubs / planned)
    { url: `${baseUrl}/casos-de-exito`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/seguridad`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },

    // Legal
    { url: `${baseUrl}/privacidad`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terminos`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cookies`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // ============================================================
  // Bloques dinámicos (Pilar B.1 + B.3 + B.4)
  // ============================================================

  const dynamicUrls: MetadataRoute.Sitemap = [
    // Hubs nuevos
    { url: `${baseUrl}/clinicas`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/recursos`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/recursos/calculadora-roi`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // Pilar B.1 — clínicas con consentimiento
    ...allClinics
      .filter((c) => c.consentGranted)
      .map((c) => ({
        url: `${baseUrl}/clinicas/${c.slug}`,
        lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(c.publishedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),

    // Pilar B.3 — comparativas cruzadas
    ...allCruzadas.map((c) => ({
      url: `${baseUrl}/comparativas/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(c.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),

    // Pilar B.4 — recursos geo publicados
    ...publishedRecursos.map((r) => ({
      url: `${baseUrl}/recursos/${r.slug}`,
      lastModified: r.updatedAt ? new Date(r.updatedAt) : new Date(r.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),

    // Posts del blog (auto desde MDX) — prioridad mayor para fichas-clinicas
    ...allPosts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(p.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: p.tags?.includes('fichas-clinicas') ? 0.8 : 0.6,
    })),
  ];

  return [...urls, ...dynamicUrls];
}
