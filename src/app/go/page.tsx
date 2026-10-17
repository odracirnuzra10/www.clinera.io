import type { Metadata } from "next";
import GoWizard from "@/components/go/GoWizard";

const TITLE = "Inicia con Clinera por solo 17 dólares al mes";

// Wizard de Go! (17-oct) en revisión interna: noindex, Disallow en robots-txt.ts y
// fuera del sitemap. La ruta /go es sugerida y está pendiente de confirmar.
export const metadata: Metadata = {
  title: TITLE,
  description: "Tu agenda, tus fichas y tus mensajes de WhatsApp, Facebook e Instagram en un solo lugar.",
  alternates: { canonical: "https://www.clinera.io/go" },
  robots: { index: false, follow: false },
};

export default function GoPage() {
  return (
    <>
      {/* Wizard sin navbar ni footer a propósito: una sola salida por pantalla. El logo va dentro del wizard. */}
      <main>
        <GoWizard />
      </main>
    </>
  );
}
