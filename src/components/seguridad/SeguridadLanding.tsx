import CtaPar from "@/components/cta/CtaPar";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  CONTACTO_PRIVACIDAD,
  CONTROLES,
  DERECHOS,
  RESUMEN,
  RETENCION,
  SEGURIDAD_FAQ,
  SEGURIDAD_FAQ_PENDIENTE,
  SUBENCARGADOS,
  ULTIMA_ACTUALIZACION,
} from "@/content/seguridad";
import { VERTEX_IA_MODELS_PROSE } from "@/content/ia-stack";
import Countdown from "./Countdown";
import Faq from "./Faq";
import Pendiente from "./Pendiente";
import Reveal from "./Reveal";
import RolesDiagram from "./RolesDiagram";
import styles from "./seguridad.module.css";

// Retardo de la cascada de aparición. El CSS lo lee desde --sg-delay.
const d = (ms: number) => ({ "--sg-delay": `${ms}ms` }) as CSSProperties;

const MAILTO_DPA = `mailto:${CONTACTO_PRIVACIDAD}?subject=${encodeURIComponent(
  "Solicitud del anexo de tratamiento de datos (DPA)"
)}`;

const ROLES = [
  {
    rol: "Titular",
    quien: "El paciente",
    texto:
      "Los datos son suyos. La ley le reconoce derechos sobre ellos y puede ejercerlos ante la clínica.",
  },
  {
    rol: "Responsable",
    quien: "Tu clínica",
    texto:
      "Decide para qué se tratan los datos y responde ante el paciente y ante la Agencia. Es el rol que casi ningún dueño de clínica sabe que tiene, y cambia toda la conversación: el proveedor no puede asumirlo por ti.",
  },
  {
    rol: "Encargado",
    quien: "Clinera",
    texto:
      "Trata los datos por instrucción de tu clínica y sólo para prestarle el servicio. No los usa para fines propios, no los vende y no los comparte fuera de la lista de subencargados publicada más abajo.",
  },
  {
    rol: "Subencargado",
    quien: "Los proveedores de Clinera",
    texto:
      "Terceros que Clinera necesita para operar. Quedan sujetos por contrato a las mismas obligaciones que Clinera asume contigo, y están todos con nombre en esta página.",
  },
];

export default function SeguridadLanding() {
  return (
    <div className={styles.page}>
      <Reveal />

      {/* ---------------------------------------------------------------
          1 · Hero
          --------------------------------------------------------------- */}
      <section className={`${styles.section} ${styles.hero} ${styles.sectionFlush}`}>
        <div className={styles.heroGrid}>
          <div>
            <span className={styles.heroBadge}>
              <span className={styles.heroDot} aria-hidden="true" />
              <span className={styles.mono}>Seguridad y protección de datos</span>
            </span>

            <h1 className={styles.h1}>
              La Ley 21.719 entra en vigencia el 1 de diciembre. Esto es exactamente cómo
              tratamos los datos de tus pacientes.
            </h1>

            <p className={styles.lead}>
              Tu clínica es la responsable del tratamiento y Clinera es la encargada:
              procesamos los datos por instrucción tuya, no por cuenta propia. Eso no es una
              declaración de buenas intenciones, es un contrato que se firma como anexo del
              servicio.
            </p>

            {/* Ricardo, 4-nov-2026: los dos CTA del sitio. El anexo DPA queda como link de texto. */}
            <CtaPar />
            <p style={{ marginTop: 14, fontSize: 14 }}>
              <a href={MAILTO_DPA} style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>
                Solicitar el anexo DPA
              </a>
            </p>
          </div>

          <Countdown />
        </div>
      </section>

      {/* ---------------------------------------------------------------
          2 · Resumen para el que tiene 30 segundos
          --------------------------------------------------------------- */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.inner}>
          <span className={styles.sectionLabel}>Resumen en 30 segundos</span>
          <h2 className={styles.h2}>Las cuatro preguntas que importan</h2>
          <p className={`${styles.lead} ${styles.read}`}>
            Si sólo vas a leer una parte de esta página, lee esta. El detalle técnico y las
            tablas para tu abogado están más abajo.
          </p>

          <div className={styles.bento}>
            {RESUMEN.map((c, i) => (
              <div key={c.kicker} className={styles.bentoCard} data-reveal style={d(i * 60)}>
                <span className={styles.bentoKicker}>{c.kicker}</span>
                <h3 className={styles.h3}>{c.titulo}</h3>
                {c.pendiente ? (
                  <Pendiente texto={c.pendiente} compact />
                ) : (
                  <p className={styles.bodyTight}>{c.cuerpo}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          3 · Los cuatro roles
          --------------------------------------------------------------- */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.sectionLabel}>Quién es quién</span>
          <h2 className={styles.h2}>Cuatro roles, y tu clínica tiene el principal</h2>
          <p className={`${styles.lead} ${styles.read}`}>
            La ley reparte responsabilidades entre cuatro figuras. Entender cuál te toca es
            lo primero, porque de ahí sale quién responde ante el paciente y quién le
            responde a quién.
          </p>

          <div className={styles.rolesGrid}>
            <ul className={styles.rolesList}>
              {ROLES.map((r, i) => (
                <li key={r.rol} className={styles.rolesItem} data-reveal style={d(i * 60)}>
                  <span className={styles.rolesRole}>{r.rol}</span>
                  <div>
                    <h3 className={styles.h3}>{r.quien}</h3>
                    <p className={styles.bodyTight}>{r.texto}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div data-reveal style={d(120)}>
              <RolesDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          4 · Infraestructura
          --------------------------------------------------------------- */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.inner}>
          <span className={styles.sectionLabel}>Infraestructura</span>
          <h2 className={styles.h2}>Controles técnicos, uno por uno</h2>
          <p className={`${styles.lead} ${styles.read}`}>
            Cada fila dice cómo está implementado el control y dónde puedes comprobarlo. Las
            filas en amarillo son las que todavía no podemos afirmar: preferimos dejarlas a
            la vista antes que llenarlas con algo que suene bien.
          </p>

          <div className={styles.tableWrap} data-reveal>
            <table className={styles.table}>
              <caption>
                Controles de seguridad de la plataforma Clinera. Las cabeceras HTTP se pueden
                verificar por tu cuenta con <code>curl -sI https://www.clinera.io</code>.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Control</th>
                  <th scope="col">Cómo está implementado</th>
                  <th scope="col">Evidencia</th>
                </tr>
              </thead>
              <tbody>
                {CONTROLES.map((c) => (
                  <tr key={c.control}>
                    <th scope="row">{c.control}</th>
                    {c.pendiente ? (
                      <td colSpan={2}>
                        <Pendiente texto={c.pendiente} compact />
                      </td>
                    ) : (
                      <>
                        <td>{c.implementacion}</td>
                        <td className={styles.tdEvidencia}>{c.evidencia}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 40 }} data-reveal>
            <h3 className={styles.h3}>Región de alojamiento</h3>
            <p className={`${styles.body} ${styles.read}`}>
              Los datos clínicos de Clinera viven en Google Cloud Platform, región Santiago
              de Chile (southamerica-west1). Sin salida del país para los datos clínicos en
              reposo: es el dato que más pesa cuando una clínica chilena compara proveedores
              frente a la Ley 21.719.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          5 · Subencargados
          --------------------------------------------------------------- */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.sectionLabel}>Subencargados</span>
          <h2 className={styles.h2}>Con quién compartimos datos, con nombre</h2>
          <p className={`${styles.lead} ${styles.read}`}>
            Es la primera tabla que revisa un abogado. La publicamos entera: es una lista
            cerrada, y si un proveedor no aparece acá, no recibe datos de tus pacientes.
          </p>

          <div className={styles.tableWrap} data-reveal>
            <table className={styles.subTable}>
              <thead>
                <tr>
                  <th scope="col">Subencargado</th>
                  <th scope="col">Para qué se usa</th>
                  <th scope="col">Qué datos toca</th>
                  <th scope="col">Dónde está</th>
                  <th scope="col">Bajo qué contrato</th>
                </tr>
              </thead>
              <tbody>
                {SUBENCARGADOS.map((s) => (
                  <tr key={s.nombre}>
                    <th scope="row">{s.nombre}</th>
                    {s.pendiente ? (
                      <td colSpan={4}>
                        <Pendiente texto={s.pendiente} compact />
                      </td>
                    ) : (
                      <>
                        <td>{s.proposito}</td>
                        <td>{s.datos}</td>
                        <td>{s.ubicacion}</td>
                        <td>{s.contrato}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.calloutGreen} style={{ marginTop: 40 }} data-reveal>
            <h3 className={styles.h3}>Tu número de WhatsApp es de tu clínica, no nuestro</h3>
            <p className={`${styles.bodyTight} ${styles.read}`}>
              La cuenta de WhatsApp Business se crea a nombre de tu clínica mediante Meta
              Embedded Signup. El vínculo contractual es entre tu clínica y Meta; Clinera
              figura como Tech Provider sobre esa cuenta. Si mañana dejas Clinera, conservas
              tu número y tu historial: sólo nos desvinculas como proveedor. No dependes de
              nosotros para seguir teniendo tu canal.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          6 · IA y datos de pacientes
          --------------------------------------------------------------- */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.inner}>
          <span className={styles.sectionLabel}>Inteligencia artificial</span>
          <h2 className={styles.h2}>Qué pasa con los datos cuando interviene un modelo</h2>
          <p className={`${styles.lead} ${styles.read}`}>
            Es la pregunta que más miedo da y la que casi nadie responde derecho. Acá va lo
            que podemos afirmar hoy y, con la misma claridad, lo que todavía no.
          </p>

          <div className={styles.splitGrid}>
            <div className={styles.stack}>
              <div className={styles.callout} data-reveal>
                <h3 className={styles.h3}>Tus datos no entrenan modelos</h3>
                <p className={styles.bodyTight}>
                  Los proveedores de inteligencia artificial que usamos están sujetos a
                  cláusulas contractuales que prohíben usar los datos para entrenar modelos.
                  Está declarado en nuestra{" "}
                  <Link className={styles.link} href="/privacidad">
                    política de privacidad
                  </Link>
                  .
                </p>
              </div>

              <div data-reveal style={d(60)}>
                <h3 className={styles.h3}>Qué se le envía al modelo y qué no</h3>
                <p className={styles.bodyTight}>
                  Desde el 1 de agosto de 2026 la inferencia corre en Vertex AI (Google
                  Cloud), con {VERTEX_IA_MODELS_PROSE}. El diagrama exacto de campos que
                  salen en cada conversación —y los que nunca salen— todavía se documenta
                  para el DPA.
                </p>
                <Pendiente texto="Detalle de los campos que salen hacia Vertex AI en cada conversación y de los que nunca salen. Sin ese inventario cerrado no se publica el diagrama de flujo de datos del DPA." />
              </div>

              <div data-reveal style={d(120)}>
                <h3 className={styles.h3}>Cuánto retiene el proveedor</h3>
                <p className={styles.bodyTight}>
                  La inferencia ocurre dentro del perímetro de Vertex AI (Google Cloud). La
                  ventana de retención exacta del proveedor para logs de inferencia todavía
                  se confirma antes de publicarla como compromiso contractual.
                </p>
                <Pendiente texto="Ventana de retención de Vertex AI para logs de inferencia. Sin ese dato no se puede prometer una retención determinada en el DPA." />
              </div>

              <div data-reveal style={d(180)}>
                <h3 className={styles.h3}>Apagar los agentes sin perder el producto</h3>
                <Pendiente texto="Si hoy una clínica puede desactivar AURA, CAMILA y LIA conservando agenda, fichas y pagos, y si esa desactivación es autoservicio o pasa por soporte." />
              </div>
            </div>

            <div className={styles.calloutBlue} data-reveal style={d(60)}>
              <h3 className={styles.h3}>Por qué preferimos dejarlo en amarillo</h3>
              <p className={styles.bodyTight}>
                Una afirmación sobre inteligencia artificial y datos de salud que después hay
                que corregir vale menos que un espacio en blanco honesto. Bajo la Ley 21.719
                lo que publicamos acá es oponible: si lo decimos, hay que poder probarlo el
                día de la fiscalización.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          7 · Retención y derechos
          --------------------------------------------------------------- */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.sectionLabel}>Retención</span>
          <h2 className={styles.h2}>Qué pasa el día que decides irte</h2>
          <p className={`${styles.lead} ${styles.read}`}>
            Ninguna clínica firma tranquila si no sabe cómo se sale. Este es el calendario
            completo, con las fechas en que te avisamos.
          </p>

          <div className={styles.timeline}>
            {RETENCION.map((h, i) => (
              <div key={h.dia} className={styles.timelineStep} data-reveal style={d(i * 70)}>
                <span className={styles.timelineDia}>{h.dia}</span>
                <div className={styles.timelineRule} aria-hidden="true" />
                <h3 className={styles.h3}>{h.titulo}</h3>
                <p className={styles.bodyTight}>{h.detalle}</p>
              </div>
            ))}
          </div>

          <div className={styles.callout} data-reveal>
            <h3 className={styles.h3}>Los 15 años de la ficha son obligación tuya, y por eso te la devolvemos</h3>
            <p className={styles.body}>
              El artículo 11 del Decreto 41 de 2012 obliga a conservar la ficha clínica por
              quince años. Esa obligación recae en el prestador de salud, es decir tu clínica,
              y no se transfiere al software que uses.
            </p>
            <p className={styles.bodyTight}>
              Por eso Clinera está diseñado para devolverte la ficha completa y después
              eliminarla, en vez de custodiarla por su cuenta de forma indefinida. Si
              guardáramos tus fichas para siempre no te estaríamos ayudando a cumplir: te
              estaríamos dejando una copia de datos sensibles fuera de tu control, y el plazo
              lo seguirías debiendo tú.
            </p>
          </div>

          <div className={styles.splitGrid} style={{ marginTop: 56 }}>
            <div data-reveal>
              <h3 className={styles.h3}>Derechos del paciente</h3>
              <p className={styles.body}>
                La solicitud del paciente entra por la clínica, que es quien tiene el deber de
                responder. Clinera te entrega las herramientas y la información para hacerlo.
              </p>
              <ul className={styles.defList}>
                {DERECHOS.map((r) => (
                  <li key={r.nombre} className={styles.defItem}>
                    <span className={styles.defTerm}>{r.nombre}</span>
                    <span>{r.que}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.callout} data-reveal style={d(60)}>
              <h3 className={styles.h3}>Nuestro plazo interno: 5 días hábiles</h3>
              <p className={styles.bodyTight}>
                Cuando nos pidas los datos necesarios para responderle a un paciente, te los
                entregamos dentro de 5 días hábiles. El plazo legal para responderle corre
                contra tu clínica, así que el nuestro está fijado más corto a propósito, para
                que llegues con margen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          8 · Minimización
          --------------------------------------------------------------- */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.inner}>
          <span className={styles.sectionLabel}>Minimización</span>
          <h2 className={styles.h2}>El dato que no se pide no se puede filtrar</h2>
          <div className={styles.read}>
            <p className={styles.body}>
              Pedir menos datos es la medida de seguridad más barata que existe y la única que
              no depende de que ningún sistema funcione bien. El caso concreto en Clinera es
              el RUT al momento de agendar: si una paciente puede reservar con nombre y
              apellidos y entregar el RUT recién cuando llega a la consulta, ese dato deja de
              viajar por WhatsApp.
            </p>
            <Pendiente texto="Si el agendamiento sin RUT ya está implementado en producción. Mientras no esté confirmado no se publica como una función disponible; si no existe todavía, esta sección se elimina de la página en vez de quedar como promesa." />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          9 · Notificación de incidentes
          --------------------------------------------------------------- */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.sectionLabel}>Incidentes</span>
          <h2 className={styles.h2}>Si algo pasa, te enteras por nosotros</h2>

          <div className={styles.splitGrid}>
            <div data-reveal>
              <h3 className={styles.h3}>Qué consideramos un incidente</h3>
              <p className={styles.body}>
                Cualquier acceso, divulgación, alteración, pérdida o destrucción de datos
                personales que no haya sido autorizada por tu clínica. Cuenta también el
                acceso indebido desde una cuenta legítima, y cuenta aunque no podamos
                confirmar todavía qué alcance tuvo: el aviso no espera al informe final.
              </p>

              <h3 className={styles.h3} style={{ marginTop: 28 }}>
                Quién notifica a quién
              </h3>
              <p className={styles.body}>
                La ley pone el deber de notificar a la Agencia en el responsable, que es tu
                clínica. Como encargada, la obligación de Clinera es avisarte a ti con lo que
                necesitas para cumplir: qué pasó, qué datos alcanzó, desde cuándo, qué hicimos
                para contenerlo y qué te recomendamos hacer. La notificación a la Agencia se
                cursa sin dilación indebida.
              </p>
            </div>

            <div className={styles.stack}>
              <div data-reveal style={d(60)}>
                <h3 className={styles.h3}>En cuánto te avisamos</h3>
                <Pendiente texto="Plazo comprometido para notificar a la clínica desde que Clinera toma conocimiento del incidente, y canal por el que se cursa el aviso. Es un compromiso contractual y tiene que fijarlo la empresa antes de publicarlo." />
              </div>

              <div className={styles.callout} data-reveal style={d(120)}>
                <h3 className={styles.h3}>Contacto de seguridad</h3>
                <p className={styles.bodyTight}>
                  Si detectaste algo raro en tu cuenta, o eres investigador y encontraste una
                  vulnerabilidad, escribe a{" "}
                  <a className={styles.link} href={`mailto:${CONTACTO_PRIVACIDAD}`}>
                    {CONTACTO_PRIVACIDAD}
                  </a>
                  . Es el mismo canal para asuntos de privacidad y derechos del titular.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          10 · Preguntas frecuentes
          --------------------------------------------------------------- */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.inner}>
          <span className={styles.sectionLabel}>Preguntas frecuentes</span>
          <h2 className={styles.h2}>Lo que nos preguntan las clínicas</h2>
          <div className={styles.read} style={{ maxWidth: 820 }}>
            <Faq items={[...SEGURIDAD_FAQ, ...SEGURIDAD_FAQ_PENDIENTE]} />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          11 · Cierre
          --------------------------------------------------------------- */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.cierreGrid}>
            <div>
              <span className={styles.sectionLabel}>Documentación</span>
              <h2 className={styles.h2}>Pásale esta página a tu abogado</h2>
              <p className={`${styles.body} ${styles.read}`}>
                El anexo de tratamiento de datos se firma junto al contrato de servicio y
                puedes pedirlo antes de contratar, para que lo revise quien tenga que
                revisarlo. Si tu clínica usa un cuestionario de seguridad propio, envíanoslo y
                lo respondemos.
              </p>

              <div className={styles.ctaRow}>
                <a className={styles.ctaPrimary} href={MAILTO_DPA}>
                  Solicitar el anexo DPA
                </a>
                <a
                  className={styles.ctaSecondary}
                  href={`mailto:${CONTACTO_PRIVACIDAD}`}
                >
                  {CONTACTO_PRIVACIDAD}
                </a>
              </div>

              <div className={styles.read} style={{ marginTop: 28 }}>
                <Pendiente
                  texto="Publicación del anexo DPA como PDF descargable. Mientras no exista el archivo, la página lo entrega por correo en vez de ofrecer una descarga que no está."
                  compact
                />
              </div>
            </div>

            <div className={styles.metaBlock}>
              <div className={styles.metaRow}>
                <span>Última actualización</span>
                <span className={styles.metaValue}>{ULTIMA_ACTUALIZACION}</span>
              </div>
              <div className={styles.metaRow}>
                <span>Vigencia Ley 21.719</span>
                <span className={styles.metaValue}>1 diciembre 2026</span>
              </div>
              <div className={styles.metaRow}>
                <span>Rol de Clinera</span>
                <span className={styles.metaValue}>Encargado del tratamiento</span>
              </div>
              <div className={styles.metaRow}>
                <span>Documentos relacionados</span>
                <span className={styles.metaValue}>
                  <Link className={styles.link} href="/privacidad">
                    Privacidad
                  </Link>
                  {" · "}
                  <Link className={styles.link} href="/ley20584">
                    Ley 20.584
                  </Link>
                  {" · "}
                  <Link className={styles.link} href="/terminos">
                    Términos
                  </Link>
                </span>
              </div>
            </div>
          </div>

          <p
            className={styles.body}
            style={{ marginTop: 56, marginBottom: 0, fontSize: "0.875rem" }}
          >
            Esta página describe medidas vigentes, no planes. No constituye asesoría legal.
          </p>
        </div>
      </section>
    </div>
  );
}
