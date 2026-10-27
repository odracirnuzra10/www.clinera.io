import Image from "next/image";
import Link from "next/link";
import ClinicasLogos from "@/components/clinicas/ClinicasLogos";
import EcosistemaIncluye from "@/components/ecosistema/EcosistemaIncluye";
import DemoEnVivo from "@/components/home-v3/DemoEnVivo";
import { Faq, Testimonios } from "@/components/home-v3/sections";
import PlanesVigentes from "@/components/pricing/PlanesVigentes";
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
  HOME2_PMFC,
} from "@/content/home2";
import s from "./Home2.module.css";

// /home2 (Ricardo, 26-oct-2026): mezcla del home actual con PMFC detallado,
// casos al estilo de sacamedi.com/casos e historia del fundador. Contenido en
// `src/content/home2.ts`; testimonios, demo, planes y preguntas son los del home.

const ESPERA_MS = [0, 900, 1900, 2800];

/** C de PMFC: AURA agenda por WhatsApp y la cita cae en la agenda. Sólo CSS. */
function AgendaEnVivo() {
  const chat = [
    { de: "paciente", texto: "Hola, quiero agendar una evaluación facial" },
    {
      de: "aura",
      texto: "¡Hola! Tengo martes 10:30 o jueves 16:00. ¿Cuál te acomoda?",
    },
    { de: "paciente", texto: "Martes 10:30" },
    {
      de: "aura",
      texto:
        "Listo ✅ Te dejé agendada. Te envío el link para pagar tu evaluación.",
    },
  ];
  return (
    <div
      className={s.cVisual}
      data-home2-agenda
      aria-label="Ejemplo de AURA agendando por WhatsApp"
    >
      <div className={s.chat}>
        <p className={s.chatHead}>
          <span className={s.chatDot} /> AURA · WhatsApp
        </p>
        {chat.map((m, i) => (
          <p
            key={m.texto}
            className={m.de === "aura" ? s.msgAura : s.msgPaciente}
            style={{ animationDelay: `${ESPERA_MS[i]}ms` }}
          >
            {m.texto}
          </p>
        ))}
      </div>
      <div className={s.agenda}>
        <p className={s.agendaHead}>Agenda · martes</p>
        <div className={s.slot}>
          <span>09:00</span> María T. · Control
        </div>
        <div className={`${s.slot} ${s.slotNuevo}`} data-home2-slot-nuevo>
          <span>10:30</span> Valentina R. · Evaluación facial
          <em>Pagada · agendó AURA</em>
        </div>
        <div className={s.slot}>
          <span>12:00</span> Libre
        </div>
        <div className={s.slot}>
          <span>15:00</span> Luis A. · Sesión 2
        </div>
      </div>
    </div>
  );
}

function VisualPmfc({ letra }: { letra: string }) {
  if (letra === "P") {
    return (
      <div className={s.pVisual}>
        {HOME2_PMFC.propuesta.filas.map((f) => (
          <div key={f.nombre} className={s.pFila}>
            <p className={s.pNombre}>{f.nombre}</p>
            <p className={s.pCifras}>
              {f.detalle} · <strong>{f.vende}</strong>
            </p>
            <div className={s.pBarra}>
              <i style={{ width: `${f.pct}%` }} />
            </div>
          </div>
        ))}
        <p className={s.nota}>{HOME2_PMFC.propuesta.nota}</p>
      </div>
    );
  }
  if (letra === "M") {
    return (
      <ol className={s.mVisual}>
        {HOME2_PMFC.marketing.map((paso, i) => (
          <li key={paso} style={{ width: `${100 - i * 14}%` }}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {paso}
          </li>
        ))}
      </ol>
    );
  }
  if (letra === "F") {
    return (
      <div className={s.fVisual}>
        <div className={s.fFoto}>
          <Image
            src={HOME2_PMFC.framework.foto}
            alt="Especialista explicando un tratamiento a una paciente en la consulta"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <ol className={s.fPasos}>
          {HOME2_PMFC.framework.pasos.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      </div>
    );
  }
  return <AgendaEnVivo />;
}

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
      <div className={s.heroFondo}>
        <section className={s.hero} data-home2="hero">
          <p className={s.eyebrow}>{HOME2_HERO.eyebrow}</p>
          <h1 className={s.h1}>
            {HOME2_HERO.titulo}{" "}
            <span className={s.grad}>{HOME2_HERO.tituloAcento}</span>
          </h1>
          <p className={s.bajada}>{HOME2_HERO.bajada}</p>
          <p className={s.formula} data-home2="formula">
            <span className={s.formulaPieza}>{HOME2_HERO.formula[0]}</span>
            <span className={s.formulaSigno} aria-hidden>
              +
            </span>
            <span className={s.formulaPieza}>{HOME2_HERO.formula[1]}</span>
            <span className={s.formulaSigno} aria-hidden>
              =
            </span>
            <span className={s.formulaResultado}>{HOME2_HERO.formulaResultado}</span>
          </p>
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
      </div>

      <ClinicasLogos />

      <EcosistemaIncluye />

      <section className={s.bloque} id="pmfc" data-home2="pmfc">
        <p className={s.eyebrow}>{HOME2_PMFC.eyebrow}</p>
        <h2 className={s.h2}>
          {HOME2_PMFC.titulo}{" "}
          <span className={s.grad}>{HOME2_PMFC.tituloAcento}</span>
        </h2>
        <p className={s.bajada}>{HOME2_PMFC.bajada}</p>
        <div className={s.pmfc}>
          {HOME2_PMFC.piezas.map((p) => (
            <article
              key={p.letra}
              className={s.pmfcFila}
              data-home2-pmfc={p.letra}
            >
              <div className={s.pmfcTexto}>
                <span className={s.letra}>{p.letra}</span>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </div>
              <VisualPmfc letra={p.letra} />
            </article>
          ))}
        </div>
        <Link
          href="/blog/metodologia-pmfc-rentabilidad-clinicas-esteticas"
          className={s.casoLink}
          data-pmfc-link
        >
          Lee la metodología completa →
        </Link>
      </section>

      <div className={s.importado}>
        <DemoEnVivo />
      </div>

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
              className={
                c.id === "sucursal" ? `${s.caso} ${s.casoAncho}` : s.caso
              }
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

      <div className={s.importado}>
        <Testimonios />
        <PlanesVigentes
          titulo="Dos formas de trabajar"
          tituloAcento="con Clinera."
          bajada="El Ecosistema son las dos piezas: el software con IA y el equipo de marketing que te trae pacientes. Si solo quieres el software, está Vortex."
        />
      </div>

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
            alt={HOME2_FUNDADOR.fotoAlt}
            width={1600}
            height={900}
            sizes="(max-width: 900px) 100vw, 55vw"
          />
          <p className={s.fotoPie}>{HOME2_FUNDADOR.fotoPie}</p>
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
          <div className={s.medios} data-home2-medios>
            {HOME2_FUNDADOR.medios.map((m) => (
              <a
                key={m.id}
                href={m.href}
                className={s.medio}
                data-home2-medio={m.id}
                {...(m.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener" }
                  : {})}
              >
                <span className={s.medioFoto}>
                  <Image
                    src={m.src}
                    alt={m.alt}
                    fill
                    sizes="(max-width: 900px) 50vw, 20vw"
                  />
                </span>
                <strong>{m.titulo}</strong>
                <span>{m.texto}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className={s.importado}>
        <Faq />
      </div>

      <section className={`${s.bloque} ${s.cierre}`} data-home2="cierre">
        <h2 className={s.h2}>{HOME2_CIERRE.titulo}</h2>
        <p className={s.bajada}>{HOME2_CIERRE.texto}</p>
        <Cta donde="cierre" />
      </section>
    </>
  );
}
