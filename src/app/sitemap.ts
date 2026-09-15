import type { MetadataRoute } from 'next';
import { allClinics } from '@/content/clinics';
import { getPartnerPublicPath, listPartners } from '@/lib/partners';
import { allCruzadas } from '@/content/comparativas-cross';
import { allPosts } from '@/content/posts';
import { publishedRecursos } from '@/content/recursos';
import { pageDate } from '@/content/page-dates';

const baseUrl = 'https://www.clinera.io';

function staticEntry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number,
): MetadataRoute.Sitemap[number] {
  const { modified } = pageDate(path);
  return {
    url: path === '/' ? `${baseUrl}/` : `${baseUrl}${path}`,
    lastModified: new Date(modified),
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [
    staticEntry('/', 'weekly', 1.0),

    staticEntry('/plataforma', 'monthly', 0.9),
    staticEntry('/software-medico', 'monthly', 0.9),
    staticEntry('/software-dental', 'monthly', 0.9),
    staticEntry('/funciones', 'monthly', 0.9),
    staticEntry('/planes', 'weekly', 0.9),
    staticEntry('/empleado-digital', 'monthly', 0.9),
    staticEntry('/mejor-software-clinicas', 'monthly', 0.9),
    staticEntry('/mejor-software-clinicas/chile', 'monthly', 0.9),
    staticEntry('/mejor-software-clinicas/mexico', 'monthly', 0.9),
    staticEntry('/mejor-software-clinicas/colombia', 'monthly', 0.9),
    staticEntry('/planes-pro', 'weekly', 0.8),
    staticEntry('/demo', 'monthly', 0.9),
    staticEntry('/app', 'monthly', 0.75),
    staticEntry('/reunion-comercial', 'monthly', 0.8),
    staticEntry('/agenda', 'monthly', 0.9),
    staticEntry('/ventas', 'monthly', 0.6),
    staticEntry('/presentacion', 'monthly', 0.7),
    staticEntry('/presentacion-partners', 'monthly', 0.7),
    staticEntry('/partners', 'monthly', 0.85),
    staticEntry('/convenio-doctores', 'monthly', 0.7),
    staticEntry('/webinars', 'weekly', 0.8),
    staticEntry('/podcast', 'weekly', 0.85),
    staticEntry('/reserva', 'weekly', 0.85),
    staticEntry('/migracion', 'monthly', 0.85),
    staticEntry('/calculadora-de-consumo', 'monthly', 0.8),
    staticEntry('/equipo', 'monthly', 0.7),
    staticEntry('/casos/metodo-hebe', 'monthly', 0.75),
    staticEntry('/casos/protocolo-lumina', 'monthly', 0.75),
    staticEntry('/casos/katherine-meza', 'monthly', 0.75),

    staticEntry('/comparativas', 'monthly', 0.9),
    staticEntry('/comparativas/reservo', 'monthly', 0.9),
    staticEntry('/comparativas/agendapro', 'monthly', 0.9),
    staticEntry('/comparativas/medilink', 'monthly', 0.8),
    staticEntry('/comparativas/manual', 'monthly', 0.8),
    staticEntry('/comparativas/dentalink', 'monthly', 0.8),
    staticEntry('/comparativas/sacmed', 'monthly', 0.8),
    staticEntry('/comparativas/doctocliq', 'monthly', 0.8),

    staticEntry('/seguridad', 'monthly', 0.9),
    staticEntry('/prensa', 'monthly', 0.7),
    staticEntry('/efectividad', 'monthly', 0.9),
    {
      url: `${baseUrl}/blog/efectividad`,
      lastModified: new Date('2026-04-23'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    staticEntry('/novedades', 'weekly', 0.7),
    staticEntry('/novedades/whatsapp', 'weekly', 0.7),
    staticEntry('/novedades/ia', 'weekly', 0.7),
    staticEntry('/novedades/operaciones', 'weekly', 0.7),
    staticEntry('/novedades/no-shows', 'weekly', 0.7),
    staticEntry('/novedades/estrategia', 'weekly', 0.7),
    staticEntry('/novedades/ltv', 'weekly', 0.7),
    staticEntry('/novedades/marketing', 'weekly', 0.7),
    staticEntry('/novedades/estetica', 'weekly', 0.7),
    staticEntry('/novedades/fichas-clinicas', 'weekly', 0.9),
    staticEntry('/ayuda', 'weekly', 0.6),
    staticEntry('/blog', 'weekly', 0.6),
    staticEntry('/llms.txt', 'weekly', 0.8),
    staticEntry('/llms-full.txt', 'weekly', 0.7),

    staticEntry('/ley20584', 'monthly', 0.6),
    staticEntry('/acreditacion', 'monthly', 0.85),

    staticEntry('/privacidad', 'yearly', 0.3),
    staticEntry('/terminos', 'yearly', 0.3),
    staticEntry('/cookies', 'yearly', 0.3),
  ];

  const partnersModified = new Date(pageDate('/partners').modified);

  const dynamicUrls: MetadataRoute.Sitemap = [
    staticEntry('/clinicas', 'weekly', 0.7),
    staticEntry('/recursos', 'weekly', 0.7),
    staticEntry('/recursos/calculadora-roi', 'monthly', 0.8),

    ...allClinics
      .filter((c) => c.consentGranted)
      .map((c) => ({
        url: `${baseUrl}/clinicas/${c.slug}`,
        lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(c.publishedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),

    ...allCruzadas.map((c) => ({
      url: `${baseUrl}/comparativas/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(c.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),

    ...publishedRecursos.map((r) => ({
      url: `${baseUrl}/recursos/${r.slug}`,
      lastModified: r.updatedAt ? new Date(r.updatedAt) : new Date(r.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),

    ...listPartners().map((p) => ({
      url: `${baseUrl}${getPartnerPublicPath(p)}`,
      lastModified: partnersModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),

    ...allPosts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(p.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: p.featured
        ? 0.85
        : p.tags?.includes('fichas-clinicas')
          ? 0.8
          : 0.6,
    })),
  ];

  return [...urls, ...dynamicUrls];
}
