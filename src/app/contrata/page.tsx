import type { Metadata } from "next";
import FooterV3 from "@/components/brand-v3/Footer";
import FluxCarrito from "@/components/contrata/FluxCarrito";
import styles from "@/components/contrata/FluxCarrito.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contrata Clinera",
  description:
    "Arma tu Flux: US$ 29 al mes con profesionales, sucursal, conversaciones y los adicionales que elijas. 50% por 3 meses.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.clinera.io/contrata" },
};

function queryDe(sp: Record<string, string | string[] | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    const valor = Array.isArray(v) ? v[0] : v;
    if (typeof valor === "string" && valor) q.set(k, valor);
  }
  return q.toString();
}

export default async function ContrataPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const uno = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v ?? "").toLowerCase();
  const sessionId = Array.isArray(sp.session_id) ? sp.session_id[0] : sp.session_id ?? "";
  return (
    <div className={styles.sitio}>
      <FluxCarrito query={queryDe(sp)} pago={uno(sp.pago)} sessionId={sessionId} />
      <FooterV3 ocultarAgenda />
    </div>
  );
}
