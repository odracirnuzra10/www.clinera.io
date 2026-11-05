import type { Metadata } from "next";
import FooterV3 from "@/components/brand-v3/Footer";
import FluxCarrito from "@/components/contrata/FluxCarrito";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contrata Clinera",
  description:
    "Arma tu Flux: US$ 29 al mes con profesionales, sucursal, conversaciones y los adicionales que elijas. 50% por 3 meses.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.clinera.io/contrata" },
};

export default async function ContrataPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[]; pago?: string | string[]; session_id?: string | string[] }>;
}) {
  const sp = await searchParams;
  const uno = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v ?? "").toLowerCase();
  const sessionId = Array.isArray(sp.session_id) ? sp.session_id[0] : sp.session_id ?? "";
  return (
    <>
      <FluxCarrito planInicial={uno(sp.plan)} pago={uno(sp.pago)} sessionId={sessionId} />
      <FooterV3 />
    </>
  );
}
