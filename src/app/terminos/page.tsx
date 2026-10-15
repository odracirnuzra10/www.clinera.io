import type { Metadata } from "next";
import Link from "next/link";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Términos y condiciones de uso de Clinera.io. Derechos y obligaciones al usar nuestro software, licencia, privacidad, pagos y jurisdicción.",
  alternates: { canonical: "https://www.clinera.io/terminos" },
  openGraph: {
    url: "https://www.clinera.io/terminos",
    title: "Términos y condiciones",
    description:
      "Derechos y obligaciones al usar el software Clinera.",
    type: "article",
  },
};

const LAST_UPDATED = "15 de octubre de 2026";

export default function TerminosPage() {
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
                  color: "var(--brand-magenta, #B847FF)",
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
              Términos y Condiciones
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
              <h2 style={h2}>1. Entidad legal y aceptación de los términos</h2>
              <p style={p}>
                Estos Términos de Uso rigen la prestación de servicios del
                Software Clinera. El servicio es provisto por{" "}
                <strong>OACG Inc.</strong>, operando comercialmente como
                Clinera.io (en adelante, «la Compañía»).
              </p>
              <p style={p}>
                Al utilizar el Software Clinera, usted acepta estar obligado
                por las presentes cláusulas. Cualquier disputa, controversia o
                reclamo que surja de o esté relacionado con estos términos o
                el uso del software se resolverá exclusivamente bajo las leyes
                del Estado de Delaware y en los tribunales competentes de los
                Estados Unidos de América.
              </p>

              <h2 style={h2}>2. Definiciones y licencia</h2>
              <ul style={ul}>
                <li>
                  <strong>Servicio:</strong> plataforma Clinera, incluyendo
                  software, inteligencia artificial, API, integraciones y
                  funcionalidades asociadas.
                </li>
                <li>
                  <strong>Usuario / Cliente:</strong> clínica, profesional de
                  la salud o entidad que contrata y utiliza el Servicio.
                </li>
                <li>
                  <strong>Contenido:</strong> datos ingresados por el Usuario,
                  incluyendo fichas médicas, historiales clínicos y planes de
                  tratamiento.
                </li>
                <li>
                  <strong>Licencia de uso:</strong> la Compañía otorga una
                  licencia limitada, no exclusiva, revocable y no transferible
                  para utilizar el software únicamente para la gestión interna
                  del Cliente.
                </li>
              </ul>

              <h2 style={h2}>3. Privacidad y manejo de datos médicos</h2>
              <p style={p}>
                El Cliente es el <strong>Responsable del Tratamiento</strong>{" "}
                de los datos personales y médicos que procesa a través de
                Clinera y declara contar con los consentimientos legales
                necesarios.
              </p>
              <p style={p}>
                Clinera implementa medidas de seguridad razonables conforme a
                la normativa estándar vigente. El Cliente conserva la
                propiedad del Contenido ingresado.
              </p>

              <h2 style={h2}>4. Obligaciones y limitación de responsabilidad</h2>
              <p style={p}>
                El Cliente es responsable de la confidencialidad de su cuenta
                y de toda actividad realizada bajo ella.
              </p>
              <p style={p}>
                El Servicio se proporciona <em>&quot;tal cual&quot;</em> y
                según disponibilidad, sin garantías expresas o implícitas. La
                Compañía no será responsable por daños indirectos, lucro
                cesante, pérdida de datos o interrupciones del servicio.
              </p>
              <p style={p}>
                La propiedad intelectual del Software Clinera pertenece
                exclusivamente a la Compañía.
              </p>

              <h2 style={h2}>5. Precios, facturación y pagos</h2>
              <p style={p}>El acceso al Software Clinera puede incluir:</p>
              <ul style={ul}>
                <li>Tarifa de incorporación inicial, y</li>
                <li>Suscripción mensual, según el plan contratado.</li>
              </ul>
              <p style={p}>
                La Compañía podrá modificar precios y condiciones comerciales
                en cualquier momento, notificando con antelación razonable.
              </p>
              <p style={p}>
                Salvo acuerdo contrario por escrito, todas las sumas pagadas
                son <strong>no reembolsables</strong>.
              </p>

              <h2 style={h2}>6. Onboarding e implementación</h2>
              <p style={p}>
                La activación de la cuenta del Cliente requiere un proceso de
                incorporación (<em>Onboarding</em>) guiado por los especialistas
                de Clinera. Para que dicho proceso se ejecute en los plazos
                previstos, el Cliente asume las obligaciones descritas en esta
                sección.
              </p>
              <p style={p}>
                <strong>
                  El plazo estimado para completar el proceso de Onboarding e
                  implementación es de 30 días corridos,
                </strong>{" "}
                contados desde el inicio del proceso. Dicho plazo está sujeto al
                cumplimiento oportuno de las obligaciones del Cliente descritas
                en esta sección y podrá extenderse cuando el Cliente no entregue
                la información, documentación o materiales requeridos en los
                tiempos solicitados.
              </p>
              <p style={p}>
                <strong>
                  Es obligación del Cliente presentarse a cada sesión de
                  Onboarding con toda la información, documentación y materiales
                  requeridos,
                </strong>{" "}
                acoplándose estrictamente a las plantillas, formatos, sugerencias
                y requisitos que los especialistas de Onboarding le hayan
                comunicado de manera previa, por cualquiera de los canales
                habilitados (correo electrónico, WhatsApp u otros).
              </p>
              <p style={p}>
                Los retrasos, reprogramaciones o dilaciones en la implementación
                y en la activación de la cuenta que se deriven del incumplimiento
                de lo anterior —esto es, cuando el Cliente no llegue con lo mínimo
                requerido— son de exclusiva responsabilidad del Cliente y{" "}
                <strong>no son imputables a la Compañía</strong>. La Compañía no
                será responsable por la extensión de los plazos de puesta en
                marcha atribuibles a la falta de preparación o de entrega de
                información por parte del Cliente.
              </p>
              <p style={p}>
                La Compañía podrá reprogramar o suspender las sesiones de
                Onboarding cuando el Cliente no cuente con los requisitos previos
                solicitados, sin que ello genere responsabilidad alguna para la
                Compañía.
              </p>

              <h2 style={h2}>7. Deberes y obligaciones del Cliente</h2>
              <p style={p}>
                El Cliente se compromete a cumplir las siguientes obligaciones
                para garantizar la correcta prestación, configuración e
                implementación del servicio, las cuales deberán completarse en
                su totalidad dentro de un plazo máximo de{" "}
                <strong>treinta (30) días corridos</strong> contados desde la
                fecha de contratación, correspondiente al periodo de
                Onboarding:
              </p>
              <ul style={ul}>
                <li>
                  <strong>Entrega oportuna de información y accesos:</strong>{" "}
                  proporcionar dentro del periodo de Onboarding, de forma
                  completa, exacta y en los plazos requeridos, toda la
                  información, credenciales, bases de datos, parámetros de
                  configuración e insumos necesarios para la puesta en marcha
                  del sistema. Esto incluye expresamente el envío oportuno de
                  los tratamientos, horarios de atención y el listado completo
                  de profesionales junto con sus datos y credenciales. Cualquier
                  retraso atribuible al Cliente en la entrega de estos insumos
                  suspenderá los plazos de entrega e implementación fijados por
                  la Compañía.
                </li>
                <li>
                  <strong>Asistencia a reuniones y capacitaciones:</strong>{" "}
                  asistir de manera puntual a todas las sesiones de
                  coordinación, reuniones de integración y capacitaciones
                  programadas durante el periodo de Onboarding, para asegurar
                  la correcta adopción de la plataforma por parte de su equipo.
                </li>
                <li>
                  <strong>Designación de un interlocutor responsable:</strong>{" "}
                  nombrar desde el inicio de la contratación a un encargado o
                  contraparte técnica/operativa dentro de su organización, quien
                  actuará como enlace directo con la Compañía para coordinar la
                  implementación, aprobar configuraciones y tomar decisiones
                  operativas durante los 30 días de Onboarding.
                </li>
                <li>
                  <strong>Uso adecuado del servicio y credenciales:</strong>{" "}
                  resguardar la confidencialidad de las credenciales de acceso
                  otorgadas y asegurar que el uso del software se limite
                  estrictamente al número de usuarios y sucursales contratados.
                </li>
                <li>
                  <strong>
                    Responsabilidad sobre la información y datos médicos:
                  </strong>{" "}
                  garantizar la titularidad y legitimidad del tratamiento de los
                  datos personales y fichas clínicas de los pacientes ingresados
                  o migrados a la plataforma, cumpliendo con la normativa legal
                  vigente sobre protección de datos personales y sensibles.
                </li>
                <li>
                  <strong>Cumplimiento de pagos:</strong> realizar el pago
                  oportuno de las tarifas de suscripción y servicios acordados,
                  en las fechas y condiciones establecidas, para mantener la
                  continuidad del servicio.
                </li>
              </ul>

              <h2 style={h2}>8. Modelos de inteligencia artificial y precisión</h2>
              <p style={p}>
                Clinera utiliza modelos de lenguaje de gran escala (LLM)
                avanzados de proveedores líderes (como OpenAI, Anthropic y
                Google) para potenciar sus funciones de asistencia.
              </p>
              <p style={p}>
                Dada la naturaleza experimental de la inteligencia artificial,
                el Usuario reconoce que el sistema puede presentar
                &quot;alucinaciones&quot; (generación de información técnica o
                datos incorrectos que parecen plausibles).{" "}
                <strong>
                  El Servicio se proporciona con fines de asistencia
                  administrativa y, bajo ninguna circunstancia, reemplaza las
                  decisiones, diagnósticos o el juicio clínico de un
                  profesional de la salud.
                </strong>
              </p>
              <p style={p}>
                Es responsabilidad exclusiva del Usuario validar toda
                información generada por la IA antes de su uso. La Compañía no
                se responsabiliza por errores u omisiones derivados del uso
                directo de contenidos generados por los modelos de IA.
              </p>

              <h2 style={h2}>
                9. Integraciones con Facebook, Instagram y WhatsApp
              </h2>
              <p style={p}>
                Clinera permite que una clínica conecte determinados activos y
                servicios de Meta, incluyendo páginas de Facebook, cuentas
                profesionales de Instagram y cuentas de WhatsApp Business,
                cuando dichas funciones se encuentren disponibles.
              </p>
              <p style={p}>
                Al conectar un activo de Meta, el Cliente declara y garantiza
                que:
              </p>
              <ul style={ul}>
                <li>
                  está autorizado para administrar el activo seleccionado y
                  para otorgar a Clinera los permisos solicitados;
                </li>
                <li>
                  cuenta con las autorizaciones y bases legales necesarias para
                  procesar las conversaciones y datos personales asociados;
                </li>
                <li>
                  utilizará la integración de acuerdo con las leyes aplicables,
                  las condiciones de Clinera y las políticas vigentes de Meta;
                </li>
                <li>
                  no empleará la integración para enviar spam, contenido
                  ilegal, comunicaciones engañosas o mensajes que vulneren
                  derechos de terceros;
                </li>
                <li>
                  mantendrá actualizados los roles y accesos de las personas
                  autorizadas dentro de su organización.
                </li>
              </ul>
              <p style={p}>
                Clinera utilizará los permisos otorgados únicamente para prestar
                las funciones habilitadas por el Cliente, como descubrir activos
                administrados, conectar cuentas, recibir eventos, mostrar
                conversaciones y enviar respuestas. El tratamiento de datos se
                describe en la{" "}
                <Link href="/privacidad">Política de Privacidad</Link>.
              </p>
              <p style={p}>
                El Cliente puede revocar el acceso desde las herramientas
                disponibles en Clinera, cuando existan, o desde la
                configuración de aplicaciones y sitios web de Meta. La
                revocación puede interrumpir inmediatamente la recepción y el
                envío de mensajes. Las instrucciones para solicitar la
                eliminación de datos están disponibles en{" "}
                <Link href="/eliminar-datos">Eliminación de Datos</Link>.
              </p>
              <p style={p}>
                Meta y sus servicios son plataformas de terceros. Clinera no
                controla su disponibilidad, sus procesos de revisión, sus
                cambios de API ni la suspensión de activos realizada por Meta.
                Sin perjuicio de las obligaciones legales de Clinera, no se
                garantiza la continuidad de una integración cuando el proveedor
                externo modifica, limita o revoca el acceso.
              </p>

              <h2 style={h2}>10. Disposiciones generales</h2>
              <p style={p}>
                Estos Términos se rigen por las leyes del Estado de Delaware,
                Estados Unidos. Toda controversia, disputa o reclamación
                relacionada con el uso del Software Clinera será sometida y
                resuelta exclusivamente en los tribunales competentes de los
                Estados Unidos de América.
              </p>
              <p style={{ ...p, fontWeight: 600, color: "var(--ink-primary)" }}>
                Jurisdicción: Estado de Delaware, Estados Unidos de América.
              </p>

              <p style={{ ...p, marginTop: 28 }}>
                Consulta también nuestra{" "}
                <Link href="/privacidad">Política de Privacidad</Link>, la{" "}
                <Link href="/eliminar-datos">Eliminación de Datos</Link> y la{" "}
                <Link href="/cookies">Política de Cookies</Link>.
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
