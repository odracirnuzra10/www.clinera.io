import CtaPar from "@/components/cta/CtaPar";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageUpdated } from "@/components/seo/PageUpdated";
import {
  breadcrumbSchema,
  caseStudySchema,
  orgSchema,
} from "@/components/seo/schemas";
import { casoImageAbs, type CasoEstudio } from "@/content/casos";
import s from "@/app/casos/casos.module.css";

export function casoMetadata(caso: CasoEstudio): Metadata {
  const image = casoImageAbs(caso);
  return {
    title: caso.title,
    description: caso.description,
    alternates: { canonical: caso.url },
    openGraph: {
      type: "article",
      locale: "es_CL",
      url: caso.url,
      title: caso.title,
      description: caso.description,
      publishedTime: caso.datePublished,
      modifiedTime: caso.dateModified,
      images: [
        {
          url: image,
          alt: caso.image.alt,
          width: caso.image.width,
          height: caso.image.height,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: caso.title,
      description: caso.description,
      images: [image],
    },
  };
}

function injectClinicLinks(
  text: string,
  caso: CasoEstudio,
  used: Set<string>,
): ReactNode[] {
  const needles = [
    { needle: caso.clinica.anchor, href: caso.clinica.href },
    { needle: caso.home.anchor, href: caso.home.href },
  ];
  const nodes: ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest.length) {
    let earliest = -1;
    let hit: (typeof needles)[number] | null = null;
    for (const n of needles) {
      if (used.has(n.href)) continue;
      const i = rest.indexOf(n.needle);
      if (i !== -1 && (earliest === -1 || i < earliest)) {
        earliest = i;
        hit = n;
      }
    }
    if (!hit || earliest < 0) {
      nodes.push(rest);
      break;
    }
    if (earliest > 0) nodes.push(rest.slice(0, earliest));
    used.add(hit.href);
    nodes.push(
      <a key={`${hit.href}-${key++}`} href={hit.href}>
        {hit.needle}
      </a>,
    );
    rest = rest.slice(earliest + hit.needle.length);
  }
  return nodes;
}

function CasoBody({ caso }: { caso: CasoEstudio }) {
  const used = new Set<string>();
  return caso.sections.map((sec) => (
    <section key={sec.h2}>
      <h2>{sec.h2}</h2>
      {sec.body.map((p) => (
        <p key={p.slice(0, 48)}>{injectClinicLinks(p, caso, used)}</p>
      ))}
    </section>
  ));
}

export function CasoEstudioPage({ caso }: { caso: CasoEstudio }) {
  const articleLd = caseStudySchema({
    path: caso.path,
    headline: caso.h1,
    description: caso.description,
    datePublished: caso.datePublished,
    dateModified: caso.dateModified,
    mentions: caso.mentions,
    image: {
      url: casoImageAbs(caso),
      width: caso.image.width,
      height: caso.image.height,
      caption: caso.image.caption,
    },
  });

  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          articleLd,
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io/" },
            { name: "Casos", url: "https://www.clinera.io/clinicas" },
            { name: caso.home.anchor, url: caso.url },
          ]),
        ]}
      />
      <NavV3 />
      <main className={s.page}>
        <header className={s.hero}>
          <div className={s.wrap}>
            <p className={s.eyebrow}>{caso.eyebrow}</p>
            <div className={s.rule} aria-hidden="true" />
            <h1 className={s.h1}>{caso.h1}</h1>
            <p className={s.lede}>{caso.lede}</p>
            <p className={s.stamp}>
              Publicado el{" "}
              {new Date(`${caso.datePublished}T12:00:00`).toLocaleDateString(
                "es-CL",
                { day: "numeric", month: "long", year: "numeric" },
              )}
            </p>
          </div>
        </header>
        <article className={s.prose}>
          <div className={s.wrap}>
            <figure className={s.photo}>
              <Image
                src={caso.image.src}
                alt={caso.image.alt}
                width={caso.image.width}
                height={caso.image.height}
                className={s.photoImg}
                sizes="(max-width: 760px) 100vw, 704px"
                priority
              />
              <figcaption className={s.photoCaption}>{caso.image.caption}</figcaption>
            </figure>
            <CasoBody caso={caso} />
            <p>{caso.cierra}</p>
          </div>
        </article>
        <div className={s.cta}>
          <div className={s.wrap}>
            {/* Ricardo, 4-nov-2026: los dos CTA del sitio. */}
            <CtaPar />
          </div>
        </div>
        <PageUpdated path={caso.path} />
      </main>
      <FooterV3 />
    </>
  );
}
