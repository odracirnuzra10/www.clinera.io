import type { Metadata } from "next";
import { Suspense } from "react";
import { ThanksContent } from "./ThanksContent";

export const metadata: Metadata = {
  title: "¡Gracias! Te contactamos en menos de 2 horas — Clinera",
  description:
    "Recibimos tu solicitud. Catalina o Nohelymar te contactará por WhatsApp para coordinar la demo o resolver tus dudas.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.clinera.io/gracias" },
};

export default function GraciasPage() {
  return (
    <Suspense fallback={null}>
      <ThanksContent />
    </Suspense>
  );
}
