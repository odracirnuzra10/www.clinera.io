import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavV3 from "@/components/brand-v3/Nav";
import FooterV3 from "@/components/brand-v3/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
  medicalBusinessSchema,
  orgSchema,
} from "@/components/seo/schemas";
import {
  allClinics,
  CITIES_WITH_RECURSO_OLA1,
  slugifyCity,
} from "@/content/clinics";

export async function generateStaticParams() {
  return allClinics
    .filter((c) => c.consentGranted)
    .map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const clinic = allClinics.find((c) => c.slug === slug && c.consentGranted);
  if (!clinic) return {};
  // Si el nombre ya incluye la ciudad, no la repetimos en el title
  // (evita "Antuka Spa Osorno en Osorno" o "Terapia Saheba en Panamá").
  const nombreIncluyeCiudad = clinic.nombre
    .toLowerCase()
    .includes(clinic.ciudad.toLowerCase());
  const title = nombreIncluyeCiudad
    ? `${clinic.nombre} — Agenda por WhatsApp 24/7`
    : `${clinic.nombre} en ${clinic.ciudad} — Agenda por WhatsApp 24/7`;
  const description = `Agenda con ${clinic.nombre} (${clinic.ciudad}) por WhatsApp en cualquier momento. ${clinic.especialidades.slice(0, 3).join(", ")}. Confirmación inmediata.`;
  const url = `https://www.clinera.io/clinicas/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_CL",
      url,
      title,
      description,
      images: [clinic.heroImageUrl ?? "https://www.clinera.io/images/og-banner.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [clinic.heroImageUrl ?? "https://www.clinera.io/images/og-banner.png"],
    },
  };
}

export default async function ClinicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const clinic = allClinics.find((c) => c.slug === slug && c.consentGranted);
  if (!clinic) notFound();

  const otherInCity = allClinics
    .filter(
      (c) => c.ciudad === clinic.ciudad && c.slug !== slug && c.consentGranted,
    )
    .slice(0, 3);
  const ciudadSlug = slugifyCity(clinic.ciudad);
  const recursoSlug = `mejor-software-clinicas-${ciudadSlug}-2026`;
  const recursoDisponible = CITIES_WITH_RECURSO_OLA1.has(ciudadSlug);

  const waText = encodeURIComponent("Hola, quiero agendar una hora.");
  const waHref = `https://wa.me/${clinic.whatsapp.replace("+", "")}?text=${waText}`;

  const faqs = [
    {
      q: `¿Cómo agendo con ${clinic.nombre}?`,
      a: `Escribe por WhatsApp al ${clinic.whatsapp}. Te responde AURA, el agente IA de Clinera, las 24 horas. Confirmas tu hora en menos de un minuto.`,
    },
    {
      q: `¿Qué especialidades atiende ${clinic.nombre}?`,
      a: clinic.especialidades.join(", ") + ".",
    },
    {
      q: "¿Esta clínica usa Clinera?",
      a: `Sí, ${clinic.nombre} usa Clinera para gestionar su agenda y atender pacientes por WhatsApp 24/7.`,
    },
    ...(clinic.horario
      ? [{ q: "¿Cuál es el horario de atención?", a: clinic.horario }]
      : []),
  ];

  return (
    <>
      <JsonLd
        data={[
          orgSchema,
          medicalBusinessSchema({
            slug: clinic.slug,
            name: clinic.nombre,
            city: clinic.ciudad,
            region: clinic.region,
            countryCode: clinic.countryCode,
            address: clinic.direccion,
            phone: clinic.telefono,
            whatsapp: clinic.whatsapp,
            specialties: clinic.especialidades,
            hours: clinic.horario,
          }),
          breadcrumbSchema([
            { name: "Inicio", url: "https://www.clinera.io" },
            { name: "Clínicas", url: "https://www.clinera.io/clinicas" },
            {
              name: clinic.nombre,
              url: `https://www.clinera.io/clinicas/${slug}`,
            },
          ]),
          faqSchema(faqs),
        ]}
      />

      <NavV3 />
      <main
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#0A0A0A",
          background:
            "linear-gradient(180deg,#FAFAFA 0%,#FFFFFF 100%)",
        }}
      >
        {/* Hero */}
        <header
          style={{
            maxWidth: 980,
            margin: "0 auto",
            padding: "96px 24px 40px",
          }}
        >
          <nav
            aria-label="breadcrumb"
            style={{
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              color: "#6B7280",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            <Link href="/clinicas" style={{ color: "#7C3AED" }}>
              Clínicas
            </Link>
            <span style={{ margin: "0 8px" }}>·</span>
            <span>{clinic.ciudad}</span>
          </nav>

          <h1
            style={{
              fontSize: "clamp(34px, 4.6vw, 56px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.04,
              margin: "0 0 18px",
            }}
          >
            {clinic.nombre}
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "#4B5563",
              lineHeight: 1.6,
              maxWidth: 760,
              margin: "0 0 28px",
            }}
          >
            {clinic.descripcion}
          </p>

          <a
            href={waHref}
            data-event="whatsapp_click"
            data-clinic={clinic.slug}
            data-wa-context="clinic"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#0A0A0A",
              color: "#fff",
              padding: "14px 22px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 15.5,
              boxShadow:
                "0 12px 32px -8px rgba(124,58,237,.25), 0 4px 12px -2px rgba(217,70,239,.15)",
            }}
          >
            Agendar por WhatsApp →
          </a>
        </header>

        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            padding: "0 24px 80px",
            display: "grid",
            gap: 32,
          }}
        >
          {/* Especialidades */}
          <section>
            <h2 style={sectionTitleStyle}>Especialidades</h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {clinic.especialidades.map((e) => (
                <li
                  key={e}
                  style={{
                    background: "#fff",
                    border: "1px solid #EEECEA",
                    borderRadius: 999,
                    padding: "8px 14px",
                    fontSize: 14,
                    color: "#374151",
                  }}
                >
                  {e}
                </li>
              ))}
            </ul>
          </section>

          {/* Profesionales */}
          {clinic.profesionales && clinic.profesionales.length > 0 && (
            <section>
              <h2 style={sectionTitleStyle}>Profesionales</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {clinic.profesionales.map((p) => (
                  <li
                    key={p.nombre}
                    style={{
                      background: "#fff",
                      border: "1px solid #EEECEA",
                      borderRadius: 12,
                      padding: "16px 20px",
                      marginBottom: 8,
                    }}
                  >
                    <strong style={{ fontSize: 15.5 }}>{p.nombre}</strong>
                    <span style={{ color: "#6B7280", marginLeft: 8 }}>
                      — {p.especialidad}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Información */}
          <section>
            <h2 style={sectionTitleStyle}>Información</h2>
            <dl
              style={{
                background: "#fff",
                border: "1px solid #EEECEA",
                borderRadius: 14,
                padding: "20px 24px",
                margin: 0,
                display: "grid",
                gridTemplateColumns: "minmax(120px,auto) 1fr",
                rowGap: 12,
                columnGap: 24,
                fontSize: 15,
              }}
            >
              {clinic.direccion && (
                <>
                  <dt style={dtStyle}>Dirección</dt>
                  <dd style={ddStyle}>{clinic.direccion}</dd>
                </>
              )}
              {clinic.horario && (
                <>
                  <dt style={dtStyle}>Horario</dt>
                  <dd style={ddStyle}>{clinic.horario}</dd>
                </>
              )}
              {clinic.telefono && (
                <>
                  <dt style={dtStyle}>Teléfono</dt>
                  <dd style={ddStyle}>{clinic.telefono}</dd>
                </>
              )}
              <dt style={dtStyle}>WhatsApp</dt>
              <dd style={ddStyle}>{clinic.whatsapp}</dd>
              {clinic.webOriginal && (
                <>
                  <dt style={dtStyle}>Sitio</dt>
                  <dd style={ddStyle}>
                    <a
                      href={clinic.webOriginal}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#7C3AED" }}
                    >
                      {clinic.webOriginal.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </>
              )}
            </dl>
          </section>

          {/* Testimonio */}
          {clinic.testimonio && (
            <blockquote
              style={{
                background: "#0A0A0A",
                color: "#fff",
                borderRadius: 16,
                padding: "28px 32px",
                margin: 0,
                fontSize: 18,
                lineHeight: 1.5,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                backgroundImage:
                  "radial-gradient(ellipse 60% 80% at 80% 20%, rgba(217,70,239,.25), transparent 60%), radial-gradient(ellipse 50% 60% at 10% 110%, rgba(124,58,237,.20), transparent 60%)",
              }}
            >
              <p style={{ margin: 0 }}>«{clinic.testimonio.quote}»</p>
              {clinic.testimonio.metric && (
                <cite
                  style={{
                    display: "block",
                    fontStyle: "normal",
                    marginTop: 14,
                    fontFamily: "JetBrains Mono, ui-monospace, monospace",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#D946EF",
                  }}
                >
                  {clinic.testimonio.metric}
                </cite>
              )}
            </blockquote>
          )}

          {/* FAQ */}
          <section>
            <h2 style={sectionTitleStyle}>Preguntas frecuentes</h2>
            <dl style={{ margin: 0, display: "grid", gap: 10 }}>
              {faqs.map(({ q, a }) => (
                <div
                  key={q}
                  style={{
                    background: "#fff",
                    border: "1px solid #EEECEA",
                    borderRadius: 12,
                    padding: "16px 20px",
                  }}
                >
                  <dt style={{ fontWeight: 600, fontSize: 15.5, marginBottom: 6 }}>
                    {q}
                  </dt>
                  <dd
                    style={{
                      margin: 0,
                      color: "#4B5563",
                      lineHeight: 1.55,
                      fontSize: 14.5,
                    }}
                  >
                    {a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Internal linking */}
          <footer style={{ display: "grid", gap: 14, marginTop: 8 }}>
            {otherInCity.length > 0 && (
              <section>
                <h3 style={{ ...sectionTitleStyle, fontSize: 17 }}>
                  Otras clínicas en {clinic.ciudad}
                </h3>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "grid",
                    gap: 8,
                  }}
                >
                  {otherInCity.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/clinicas/${c.slug}`}
                        style={{ color: "#7C3AED", fontWeight: 600 }}
                      >
                        {c.nombre} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <p style={{ color: "#4B5563", fontSize: 15 }}>
              ¿Tienes una clínica?{" "}
              <Link href="/planes" style={{ color: "#7C3AED", fontWeight: 600 }}>
                Conoce Clinera
              </Link>{" "}
              — el software de IA que usa {clinic.nombre} para atender
              pacientes 24/7.
            </p>
            {recursoDisponible && (
              <p>
                <Link
                  href={`/recursos/${recursoSlug}`}
                  style={{ color: "#7C3AED", fontWeight: 600 }}
                >
                  Mejor software para clínicas en {clinic.ciudad} 2026 →
                </Link>
              </p>
            )}
          </footer>
        </div>
      </main>
      <FooterV3 />
    </>
  );
}

const sectionTitleStyle = {
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: "-0.02em",
  margin: "0 0 14px",
} as const;

const dtStyle = {
  fontFamily: "JetBrains Mono, ui-monospace, monospace",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.14em",
  color: "#6B7280",
  textTransform: "uppercase",
} as const;

const ddStyle = {
  margin: 0,
  color: "#0A0A0A",
} as const;
