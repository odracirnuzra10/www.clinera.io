import Image from "next/image";
import { HOME2_TESTIMONIO_VIDEO as T } from "@/content/home2";
import s from "./TestimonioVideo.module.css";

/** Prueba social del home: video vertical de la Dra. María del Valle con su Instagram. */
export default function TestimonioVideo() {
  const ig = `https://www.instagram.com/${T.instagram}/`;
  return (
    <section className={s.bloque} data-home2="testimonio-video" aria-label={`Testimonio de ${T.nombre}`}>
      <div className={s.texto}>
        <p className={s.eyebrow}>{T.eyebrow}</p>
        <blockquote className={s.cita}>
          <p>«{T.cita}»</p>
        </blockquote>
        <div className={s.firma}>
          <Image src={T.foto} alt={T.nombre} width={56} height={56} className={s.avatar} />
          <div>
            <p className={s.nombre}>{T.nombre}</p>
            <a href={ig} target="_blank" rel="noopener noreferrer" className={s.ig} data-home2-instagram>
              <svg viewBox="0 0 24 24" aria-hidden="true" className={s.igIcono}>
                <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
              </svg>
              @{T.instagram}
            </a>
            <p className={s.meta}>{T.meta}</p>
          </div>
        </div>
      </div>
      <div className={s.video}>
        <iframe
          src={`https://player.vimeo.com/video/${T.vimeoId}?autopause=0&title=0&byline=0&portrait=0`}
          title={`Testimonio en video de ${T.nombre}`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </section>
  );
}
