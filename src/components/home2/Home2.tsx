import Image from "next/image";
import Link from "next/link";
import ClinicasLogos from "@/components/clinicas/ClinicasLogos";
import { CTA_VENTAS_LABEL } from "@/content/planes";
import {
  HOME2_ALTA_QUALITA,
  HOME2_CASOS,
  HOME2_CASOS_TEXTO,
  HOME2_CIERRE,
  HOME2_CIFRAS,
  HOME2_FUNDADOR,
  HOME2_HERO,
  HOME2_HISTORIA,
  HOME2_HONESTO,
  HOME2_PIEZAS,
} from "@/content/home2";
import s from "./Home2.module.css";

// /home2 (Ricardo, 26-oct-2026): historia de Clinera + casos al estilo de
// sacamedi.com/casos. Contenido en `src/content/home2.ts`.

function Cta({ donde }: { donde: string }) {
  return (
    <Link href="/agenda" className={s.cta} data-home2-cta={donde}>
      {CTA_VENTAS_LABEL}
    </Link>
  );
}

export default function Home2() {
  return (
    <>
      <section className={s.hero} data-home2="hero">
        <p className={s.eyebrow}>{HOME2_HERO.eyebrow}</p>
        <h1 className={s.h1}>
          {HOME2_HERO.titulo}{" "}
          <span className={s.grad}>{HOME2_HERO.tituloAcento}</span>
        </h1>
        <p className={s.bajada}>{HOME2_HERO.bajada}</p>
        <div className={s.ctas}>
          <Cta donde="hero" />
          <a href="#casos" className={s.ctaSec}>
            Ver casos
          </a>
        </div>
        <ul className={s.cifras} data-home2="cifras">
          {HOME2_CIFRAS.map((c) => (
            <li key={c.valor}>
              <strong>{c.valor}</strong>
              <span>{c.texto}</span>
            </li>
          ))}
        </ul>
      </section>

      <ClinicasLogos />

      <section className={s.bloque} id="historia" data-home2="historia">
        <p className={s.eyebrow}>{HOME2_HISTORIA.eyebrow}</p>
        <h2 className={s.h2}>
          {HOME2_HISTORIA.titulo}{" "}
          <span className={s.grad}>{HOME2_HISTORIA.tituloAcento}</span>
        </h2>
        <ol className={s.linea}>
          {HOME2_HISTORIA.pasos.map((p) => (
            <li key={p.titulo}>
              <span className={s.marca}>{p.marca}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className={`${s.bloque} ${s.fundador}`}
        id="fundador"
        data-home2="fundador"
      >
        <div className={s.fotoFundador}>
          <Image
            src={HOME2_FUNDADOR.foto}
            alt={HOME2_FUNDADOR.nombre}
            width={480}
            height={480}
          />
        </div>
        <div>
          <p className={s.eyebrow}>{HOME2_FUNDADOR.eyebrow}</p>
          <h2 className={s.h2}>{HOME2_FUNDADOR.nombre}</h2>
          <p className={s.cargo}>{HOME2_FUNDADOR.cargo}</p>
          {HOME2_FUNDADOR.parrafos.map((t) => (
            <p key={t} className={s.texto}>
              {t}
            </p>
          ))}
          <ul className={s.chips}>
            {HOME2_FUNDADOR.credenciales.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={s.bloque} id="ecosistema" data-home2="piezas">
        <p className={s.eyebrow}>{HOME2_PIEZAS.eyebrow}</p>
        <h2 className={s.h2}>{HOME2_PIEZAS.titulo}</h2>
        <p className={s.bajada}>{HOME2_PIEZAS.bajada}</p>
        <ol className={s.piezas}>
          {HOME2_PIEZAS.items.map((p) => (
            <li key={p.n}>
              <span className={s.marca}>{p.n}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.bloque} id="casos" data-home2="casos">
        <p className={s.eyebrow}>{HOME2_CASOS_TEXTO.eyebrow}</p>
        <h2 className={s.h2}>
          {HOME2_CASOS_TEXTO.titulo}{" "}
          <span className={s.grad}>{HOME2_CASOS_TEXTO.tituloAcento}</span>
        </h2>
        <p className={s.bajada}>{HOME2_CASOS_TEXTO.bajada}</p>
        <div className={s.casos}>
          {HOME2_CASOS.map((c) => (
            <article
              key={c.id}
              className={c.foto ? s.caso : `${s.caso} ${s.casoAncho}`}
              data-home2-caso={c.id}
            >
              {c.foto ? (
                <figure className={s.casoFoto}>
                  <Image
                    src={c.foto.src}
                    alt={c.foto.alt}
                    fill
                    sizes="(max-width: 720px) 100vw, 50vw"
                  />
                  <figcaption>{c.foto.credito}</figcaption>
                </figure>
              ) : null}
              <div className={s.casoCuerpo}>
                <div>
                  <p className={s.casoCifra}>{c.cifra}</p>
                  <p className={s.casoNota}>{c.cifraNota}</p>
                </div>
                <div className={s.casoResto}>
                  <h3>{c.clinica}</h3>
                  <p className={s.casoDetalle}>{c.detalle}</p>
                  <p className={s.casoCambio}>
                    <span>Qué cambió</span>
                    {c.queCambio}
                  </p>
                  {c.cita ? (
                    <blockquote className={s.cita}>
                      «{c.cita.texto}»<cite>{c.cita.autor}</cite>
                    </blockquote>
                  ) : null}
                  {c.href ? (
                    <Link href={c.href} className={s.casoLink}>
                      Leer el caso →
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={s.bloque} id="alta-qualita" data-home2="alta-qualita">
        <div className={s.convenio}>
          <p className={s.eyebrow}>{HOME2_ALTA_QUALITA.eyebrow}</p>
          <h2 className={s.h2}>
            {HOME2_ALTA_QUALITA.titulo}{" "}
            <span className={s.grad}>{HOME2_ALTA_QUALITA.tituloAcento}</span>
          </h2>
          <p className={s.texto}>{HOME2_ALTA_QUALITA.texto}</p>
          <a
            href={HOME2_ALTA_QUALITA.href}
            target="_blank"
            rel="noopener"
            className={s.casoLink}
          >
            {HOME2_ALTA_QUALITA.link} →
          </a>
        </div>
      </section>

      <section className={`${s.bloque} ${s.honesto}`} data-home2="honesto">
        <h2 className={s.h3}>{HOME2_HONESTO.pregunta}</h2>
        <p className={s.honestoResp}>{HOME2_HONESTO.respuesta}</p>
        <p className={s.texto}>{HOME2_HONESTO.texto}</p>
      </section>

      <section className={`${s.bloque} ${s.cierre}`} data-home2="cierre">
        <h2 className={s.h2}>{HOME2_CIERRE.titulo}</h2>
        <p className={s.bajada}>{HOME2_CIERRE.texto}</p>
        <Cta donde="cierre" />
      </section>
    </>
  );
}
