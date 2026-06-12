import type { Metadata } from "next";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";

export const metadata: Metadata = {
  title: "Política de Privacidad — Clinera.io",
  description:
    "Política de privacidad de Clinera.io. Cómo recopilamos, usamos y protegemos tu información personal, incluidos los servicios de inteligencia artificial.",
  alternates: { canonical: "https://www.clinera.io/privacidad" },
  openGraph: {
    url: "https://www.clinera.io/privacidad",
    title: "Política de Privacidad — Clinera.io",
    description:
      "Cómo recopilamos, usamos y protegemos tu información personal en Clinera.io.",
    type: "article",
  },
};

const LAST_UPDATED = "30 de abril de 2026";

export default function PrivacidadPage() {
  return (
    <>
      <NavV3 />
      <main>
        <section className="section">
          <div className="container" style={{ maxWidth: 820 }}>
            <div style={{ marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: "var(--font-tech)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--brand-cyan)",
                }}
              >
                Legal
              </span>
            </div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--ink-primary)",
                marginBottom: 8,
              }}
            >
              Política de Privacidad
            </h1>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--ink-tertiary)",
                marginBottom: 32,
              }}
            >
              Última actualización: {LAST_UPDATED}
            </p>

            <div
              style={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "var(--ink-secondary)",
              }}
            >
              <h2 style={h2}>1. Entidad Legal</h2>
              <p style={p}>
                La presente Política de Privacidad describe cómo{" "}
                <strong>OACG Inc.</strong>, en adelante &quot;la Empresa&quot;,
                recopila, utiliza y protege la información que obtenemos de
                usted (en adelante, el &quot;Usuario&quot;) a través del sitio
                web y los servicios de Clinera.io (&quot;Clinera&quot;).
              </p>
              <p style={p}>
                Clinera.io es un producto y servicio comercializado y operado
                exclusivamente por OACG Inc.
              </p>

              <h2 style={h2}>2. Qué datos recopilamos</h2>
              <p style={p}>Recopilamos los siguientes tipos de información:</p>
              <ul style={ul}>
                <li>
                  <strong>Datos de contacto:</strong> nombre, dirección de
                  correo electrónico y número de teléfono proporcionados
                  voluntariamente a través de formularios en nuestro sitio web.
                </li>
                <li>
                  <strong>Información de la clínica o negocio:</strong> nombre
                  de la empresa ingresado para solicitar demostraciones o
                  contratar planes de software.
                </li>
                <li>
                  <strong>Datos sensibles relacionados con salud:</strong>{" "}
                  cuando una clínica usuaria configura el agente IA AURA, en
                  el flujo conversacional pueden circular nombres de
                  pacientes, motivos de consulta, fecha y hora de citas,
                  contenido de mensajes de WhatsApp y profesional asignado.
                  Bajo la <strong>Ley Federal de Protección de Datos
                  Personales en Posesión de los Particulares (LFPDPPP)</strong>{" "}
                  estos son <strong>datos personales sensibles</strong> y
                  reciben tratamiento reforzado: acceso restringido por rol,
                  cifrado en tránsito y reposo, y conservación limitada al
                  cumplimiento del servicio.
                </li>
                <li>
                  <strong>Datos de uso y navegación:</strong> interacciones con
                  nuestro sitio web, tipo de navegador, sistema operativo y
                  otra información analítica recopilada mediante cookies o
                  herramientas de medición de terceros (p.ej.: píxeles de
                  seguimiento).
                </li>
              </ul>

              <h2 style={h2}>3. Cómo usamos y protegemos la información</h2>
              <p style={p}>
                Utilizamos la información recopilada con los siguientes fines:
              </p>
              <ul style={ul}>
                <li>
                  Proveer, mantener, operar y mejorar nuestros servicios web y
                  de software.
                </li>
                <li>
                  Contactarle para programar demostraciones técnicas, brindar
                  soporte técnico o enviar actualizaciones del servicio.
                </li>
                <li>
                  Personalizar la experiencia web y nuestras comunicaciones
                  comerciales.
                </li>
              </ul>
              <p style={p}>
                <strong>Protección:</strong> en OACG Inc. tomamos medidas de
                seguridad técnicas razonables y acorde a los estándares
                modernos de la industria (encriptación, acceso restringido)
                para proteger sus datos personales a fin de evitar su pérdida,
                alteración o el acceso no autorizado a los mismos.
              </p>

              <h2 style={h2}>4. Uso de servicios de inteligencia artificial</h2>
              <p style={p}>
                Clinera utiliza servicios de inteligencia artificial (IA) de
                terceros para mejorar la experiencia de atención al paciente a
                través de funciones de mensajería automatizada. A continuación,
                detallamos cómo se utilizan estos servicios.
              </p>

              <h3 style={h3}>4.1 Proveedores de IA</h3>
              <p style={p}>
                Los datos son procesados a través de los siguientes
                proveedores:
              </p>
              <ul style={ul}>
                <li>
                  <strong>OpenRouter</strong> (
                  <a
                    href="https://openrouter.ai/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    openrouter.ai
                  </a>
                  ) — servicio de enrutamiento de modelos de IA que actúa como
                  intermediario para acceder a{" "}
                  <strong>Google Gemini</strong> y <strong>OpenAI GPT</strong>.
                </li>
              </ul>

              <h3 style={h3}>4.2 Datos compartidos con proveedores de IA</h3>
              <p style={p}>
                Cuando las funciones de IA están habilitadas, los siguientes
                datos pueden ser enviados a los proveedores mencionados para
                su procesamiento:
              </p>
              <ul style={ul}>
                <li>Nombre del paciente o contacto.</li>
                <li>
                  Contenido de los mensajes de WhatsApp dentro de la
                  conversación activa.
                </li>
                <li>
                  Datos de citas: fecha, hora, disponibilidad y motivo de
                  consulta.
                </li>
                <li>Información básica del profesional asignado.</li>
              </ul>

              <h3 style={h3}>4.3 Finalidad del procesamiento</h3>
              <p style={p}>
                Los datos se envían a estos servicios exclusivamente para:
              </p>
              <ul style={ul}>
                <li>Generar respuestas automatizadas a consultas de pacientes.</li>
                <li>Asistir en el agendamiento inteligente de citas.</li>
                <li>Clasificar y priorizar consultas entrantes.</li>
              </ul>

              <h3 style={h3}>4.4 Consentimiento del usuario</h3>
              <p style={p}>
                Antes de que cualquier dato sea enviado a proveedores de IA,
                la aplicación solicita el consentimiento explícito del usuario
                mediante una pantalla de autorización. El usuario puede:
              </p>
              <ul style={ul}>
                <li>
                  <strong>Aceptar:</strong> se habilitan las funciones de
                  mensajería con IA.
                </li>
                <li>
                  <strong>Rechazar:</strong> no se envían datos a proveedores
                  de IA y las funciones de mensajería automatizada no estarán
                  disponibles.
                </li>
              </ul>
              <p style={p}>
                El usuario puede revocar este consentimiento en cualquier
                momento desde la configuración de la aplicación.
              </p>

              <h3 style={h3}>4.5 Protección de datos</h3>
              <p style={p}>
                Todas las comunicaciones con los proveedores de IA se realizan
                mediante conexiones cifradas (HTTPS/TLS). Los proveedores de
                IA utilizados cumplen con estándares de protección de datos
                equivalentes y no utilizan los datos enviados para entrenar
                sus modelos cuando se acceden a través de API empresariales.
              </p>
              <p style={p}>
                Para más información, consulte las políticas de privacidad de
                cada proveedor:
              </p>
              <ul style={ul}>
                <li>
                  <a
                    href="https://openrouter.ai/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidad de OpenRouter
                  </a>
                </li>
                <li>
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidad de Google
                  </a>
                </li>
                <li>
                  <a
                    href="https://openai.com/policies/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidad de OpenAI
                  </a>
                </li>
              </ul>

              <h2 style={h2}>
                5. Marco legal mexicano (LFPDPPP) y derechos ARCO
              </h2>
              <p style={p}>
                Para los Usuarios y Titulares de datos personales en territorio
                mexicano, OACG Inc. trata sus datos conforme a la{" "}
                <strong>
                  Ley Federal de Protección de Datos Personales en Posesión de
                  los Particulares (LFPDPPP)
                </strong>
                , su Reglamento, y los Lineamientos del Aviso de Privacidad
                emitidos por el Instituto Nacional de Transparencia, Acceso a
                la Información y Protección de Datos Personales (INAI).
              </p>

              <h3 style={h3}>5.1 Derechos ARCO del Titular</h3>
              <p style={p}>
                Como Titular de los datos personales, usted tiene derecho a:
              </p>
              <ul style={ul}>
                <li>
                  <strong>Acceso:</strong> conocer qué datos personales tenemos
                  de usted, para qué los usamos y las condiciones del uso que
                  les damos.
                </li>
                <li>
                  <strong>Rectificación:</strong> solicitar la corrección de su
                  información personal en caso de que esté desactualizada,
                  incompleta o sea inexacta.
                </li>
                <li>
                  <strong>Cancelación:</strong> solicitar que la eliminemos de
                  nuestros registros o bases de datos cuando considere que la
                  misma no está siendo utilizada conforme a los principios,
                  deberes y obligaciones previstas en la normatividad.
                </li>
                <li>
                  <strong>Oposición:</strong> oponerse al uso de sus datos
                  personales para fines específicos.
                </li>
              </ul>

              <h3 style={h3}>5.2 Cómo ejercer los derechos ARCO</h3>
              <p style={p}>
                Para ejercer cualquiera de los derechos ARCO, así como para
                revocar su consentimiento o limitar el uso o divulgación de sus
                datos, debe enviar una solicitud a{" "}
                <a href="mailto:privacidad@clinera.io">privacidad@clinera.io</a>{" "}
                con la siguiente información:
              </p>
              <ul style={ul}>
                <li>
                  Nombre completo del Titular y un medio de contacto (correo
                  electrónico) para comunicarle la respuesta.
                </li>
                <li>
                  Documento que acredite la identidad del Titular (o de su
                  representante legal cuando aplique).
                </li>
                <li>
                  Descripción clara y precisa de los datos personales sobre los
                  que se busca ejercer el derecho, así como el derecho que se
                  pretende ejercer (Acceso, Rectificación, Cancelación u
                  Oposición).
                </li>
                <li>
                  En caso de Rectificación, la documentación que sustente la
                  modificación solicitada.
                </li>
              </ul>
              <p style={p}>
                OACG Inc. responderá a su solicitud en un plazo máximo de{" "}
                <strong>20 días hábiles</strong> contados desde la fecha de
                recepción. Cuando proceda, la respuesta se hará efectiva dentro
                de los 15 días hábiles siguientes a la fecha en que se
                comunique. Estos plazos pueden ampliarse una sola vez por igual
                periodo, siempre que las circunstancias del caso lo justifiquen.
              </p>

              <h3 style={h3}>
                5.3 Transferencias de datos a terceros
              </h3>
              <p style={p}>
                OACG Inc. puede transferir sus datos personales a los siguientes
                terceros, sin requerir su consentimiento adicional cuando la
                transferencia esté prevista en la LFPDPPP:
              </p>
              <ul style={ul}>
                <li>
                  Proveedores de infraestructura cloud (AWS São Paulo) para el
                  almacenamiento cifrado de la información.
                </li>
                <li>
                  Proveedores de IA (OpenRouter / Google Gemini / OpenAI),
                  exclusivamente para las funciones descritas en la sección 4
                  y bajo cláusulas contractuales que prohíben el uso de los
                  datos para entrenar modelos.
                </li>
                <li>
                  Procesadores de pago (Stripe, MercadoPago, Webpay/Transbank)
                  para procesar transacciones de la suscripción del software.
                </li>
                <li>
                  Autoridades competentes cuando exista una orden judicial o
                  un mandato legal aplicable.
                </li>
              </ul>

              <h3 style={h3}>
                5.4 Reclamaciones ante el INAI
              </h3>
              <p style={p}>
                Si considera que su derecho a la protección de datos
                personales ha sido vulnerado por alguna conducta de OACG Inc.,
                podrá interponer una <strong>queja</strong> o{" "}
                <strong>denuncia</strong> ante el INAI a través de su sitio
                oficial:
              </p>
              <ul style={ul}>
                <li>
                  <a
                    href="https://home.inai.org.mx/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    home.inai.org.mx
                  </a>
                </li>
                <li>
                  Tel-INAI: <strong>800 835 4324</strong>
                </li>
              </ul>
              <p style={p}>
                Antes de acudir ante el INAI, le solicitamos contactarnos
                directamente — la mayoría de las solicitudes se resuelven en
                menos de 20 días hábiles sin necesidad de un procedimiento
                formal.
              </p>

              <h3 style={h3}>5.5 Cambios al Aviso de Privacidad</h3>
              <p style={p}>
                OACG Inc. se reserva el derecho de modificar esta Política /
                Aviso de Privacidad. Cualquier cambio sustancial será
                notificado mediante (i) un anuncio destacado en{" "}
                <a href="https://www.clinera.io/privacidad">
                  www.clinera.io/privacidad
                </a>{" "}
                y (ii) un correo a la dirección registrada del Usuario, con al
                menos 15 días naturales de anticipación a su entrada en vigor.
              </p>

              <h2 style={h2}>6. Información de contacto</h2>
              <p style={p}>
                Si tiene preguntas, inquietudes o desea ejercer sus derechos
                sobre sus datos personales, puede comunicarse con nuestro
                equipo oficial escribiendo a{" "}
                <a href="mailto:privacidad@clinera.io">
                  privacidad@clinera.io
                </a>{" "}
                (canal dedicado para asuntos de privacidad y derechos ARCO) o
                a <a href="mailto:hola@clinera.io">hola@clinera.io</a> para el
                resto de consultas.
              </p>

              <p style={{ ...p, marginTop: 28 }}>
                Consulta también nuestra{" "}
                <Link href="/cookies">Política de Cookies</Link> y los{" "}
                <Link href="/terminos">Términos y Condiciones</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterV3 />
    </>
  );
}

const h2 = {
  fontSize: "1.4rem",
  fontWeight: 700,
  color: "var(--ink-primary)",
  marginTop: 36,
  marginBottom: 12,
  letterSpacing: "-0.02em",
} as const;

const h3 = {
  fontSize: "1.1rem",
  fontWeight: 600,
  color: "var(--ink-primary)",
  marginTop: 22,
  marginBottom: 10,
} as const;

const p = {
  marginBottom: 14,
  color: "var(--ink-secondary)",
  lineHeight: 1.7,
} as const;

const ul = {
  margin: "0 0 18px",
  paddingLeft: 24,
  color: "var(--ink-secondary)",
  lineHeight: 1.75,
} as const;
