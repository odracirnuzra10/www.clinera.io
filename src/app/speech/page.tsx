import type { Metadata } from "next";
import SpeechDeck from "@/components/speech/SpeechDeck";

export const metadata: Metadata = {
  title: "Speech de ventas — Guía interna",
  description: "Guía interna del equipo comercial de Clinera.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function SpeechPage() {
  return <SpeechDeck />;
}
