import type { Metadata } from "next";
import VozLanding from "@/components/voz/VozLanding";

// /voz (Ricardo, 11-nov-2026): tres llamadas reales del agente de voz, para la expo.
// Las grabaciones son de pacientes reales: la página no se indexa ni va al sitemap.
export const metadata: Metadata = {
  title: "Casos de voz",
  description: "Escucha tres llamadas reales del agente de voz con IA de Clinera agendando pacientes.",
  robots: { index: false, follow: false },
};

export default function VozPage() {
  return <VozLanding />;
}
