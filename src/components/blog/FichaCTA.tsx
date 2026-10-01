import Link from "next/link";

/**
 * CTA a mitad de los artículos de ficha clínica. El PostCTA del cierre sigue
 * donde estaba: este llega al lector que busca la plantilla o la ley y no
 * baja hasta el final. Va a /agenda con lead_source propio para atribuir.
 */
export default function FichaCTA() {
  return (
    <aside
      style={{
        margin: "36px 0",
        padding: "22px 26px",
        border: "1px solid rgba(10,10,10,0.12)",
        borderRadius: 14,
        background: "#fff",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#0A0A0A",
        }}
      >
        Ficha clínica electrónica dentro de Clinera
      </p>
      <p
        style={{
          margin: "8px 0 16px",
          fontSize: 15,
          lineHeight: 1.6,
          color: "rgba(10,10,10,0.7)",
        }}
      >
        Cifrada, con registro de quién accede y conectada a la agenda y a AURA
        en WhatsApp. Te la mostramos con los datos de tu clínica.
      </p>
      <Link
        href="/agenda?lead_source=blog_ficha_clinica"
        style={{
          display: "inline-block",
          padding: "11px 20px",
          borderRadius: 10,
          background: "#0A0A0A",
          color: "#fff",
          fontWeight: 600,
          fontSize: 15,
          textDecoration: "none",
        }}
      >
        Agenda una demo
      </Link>
    </aside>
  );
}
